import { useState, useMemo } from 'react';
import { fetchCommits, createCommit, updateCommit, deleteCommit, createCommitLog, fetchCommitLogs,  } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useQueries, useQueryClient, useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Heatmap from '../components/Heatmap';
import { PencilIcon, Ellipsis , TrashIcon, Loader2  } from "lucide-react"
import { Label } from "@/components/ui/label"


interface Commit {
    id: number;
    title: string;
    userId: number;
  }

interface CommitLog {
    date: string;
    isCompleted: boolean;
    commitId: number;
}

function calculateStreaks(logs: CommitLog[]): number {
    // Filter logs to only include completed ones
    const completedLogs = logs.filter(log => log.isCompleted);
    // Extract unique dates from completed logs and get rid of time component for accurate streak calculation
    const uniqueCompletedLogs = Array.from(new Set(completedLogs.map(log => new Date(log.date).toDateString())));
    // Sort Commit logs by dates in descending order
    const sortedDates = uniqueCompletedLogs.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (sortedDates.length === 0) {
      return 0;
    }

    const expectedDate = new Date(sortedDates[0]);
    expectedDate.setHours(0, 0, 0, 0); // Normalize to start of the day
    
    // the most recent completed log date cannot be smaller than yesterday, otherwise the streak is already broken
    if (expectedDate < yesterday) {
      return 0; 
    }

    for (let i = 0; i < sortedDates.length; i++) {
      const logDate = new Date(sortedDates[i]);
      logDate.setHours(0, 0, 0, 0); // Normalize to start of the day

      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1); // Move to the previous day
      } else {
        break; // Break the loop if the streak is broken (gap in the days)
      }
    }

    return streak;
  }

// Temporary empty commit array to satisfy TypeScript type checking for line 140 before data is fetched
const EMPTY_COMMITS : Commit[] = [];

export default function Home() {
    const [commitTitle, setCommitTitle] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [commitToEdit, setCommitToEdit] = useState<Commit | null>(null);
    const [commitToDelete, setCommitToDelete] = useState<Commit | null>(null);
    const { logoutUser } = useAuth(); 
    const [loadingCommitId, setLoadingCommitId] = useState<Set<number>>(new Set());
    const queryClient = useQueryClient();

    // Fetch commits using React Query
    const {data : commitsData, isPending, isError, error} = useQuery({
      queryKey: ['commits'],
      queryFn: fetchCommits,
    })

    // Create commit mutation
    const createCommitMutation = useMutation({
      mutationFn: createCommit,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['commits'] });

        setCommitTitle('');
      }
    })

    // Update commit mutation
    const updateCommitMutation = useMutation({
      mutationFn: ({commitId, title}: {commitId: number, title: string}) => updateCommit(commitId, title),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['commits'] });
        setCommitToEdit(null);
        setEditTitle('');
      }
    })
    
    // Delete commit mutation
    const deleteCommitMutation = useMutation({
      mutationFn: deleteCommit,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['commits'] });
        setCommitToDelete(null);
      }
    })


    // Use an empty array as a fallback to prevent errors before data is loaded
    const commits = commitsData || EMPTY_COMMITS;
    // Fetch commit logs for all commits using useQueries
    const commitLogsQueries = useQueries({
      queries: commits.map((commit: Commit) => ({
        queryKey: ['commitLogs', commit.id],
        queryFn: () => fetchCommitLogs(commit.id),
        enabled: !!commit.id, // Ensure the query only runs if commit.id is available
      })),
      combine: (results) => {
        return {
          isPending: results.some((result) => result.isPending),
          data: results.map((result) => result.data).filter(Boolean).flat() as CommitLog[],
        }
      }
    })

        // Create commit log mutation
    const createCommitLogMutation = useMutation({
      mutationFn: ({ commitId, date}: {commitId: number, date: string}) => createCommitLog(commitId, date),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['commitLogs', variables.commitId] });
      }
    })


    // Extract completed commit IDs for today using useMemo to optimize performance
    const completedCommitIdsToday = useMemo(() => {
      const commitLogs = commitLogsQueries.data || [];
      const today = new Date().toDateString();

      return commitLogs
      .filter(log => log.isCompleted && new Date(log.date).toDateString() === today)
      .map(log => log.commitId);
     }, [commitLogsQueries.data]
    );

    // Calculate streaks for each commit using useMemo to avoid unnecessary recalculations
    const streaks = useMemo(()=> {
      const commitLogs = commitLogsQueries.data || [];
      const newStreak: Record<number, number> = {};

      commits.forEach((commit: Commit) => {
        const logsForSpecificCommit = commitLogs.filter(log => (log.commitId === commit.id))
        newStreak[commit.id] = calculateStreaks(logsForSpecificCommit);
      })
      return newStreak;
     }, [commitLogsQueries.data, commits]
    );

    if (isPending) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-red-500">Error: {error instanceof Error ? error.message : 'An error occurred'}</p>
        </div>
      );
    }
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-slate-900">Commits</h1>
        <Button onClick={logoutUser} className="ml-auto mb-4 cursor-pointer" variant="destructive">
          Logout
        </Button>
      <form 
          className='flex w-full items-center space-x-2 mb-8'
          onSubmit={(e) => {
            e.preventDefault();
            if (commitTitle.trim()) {
              createCommitMutation.mutate(commitTitle);
            }
          }} 
        >
          <Input type="text"
            className="flex-1"
            placeholder="Enter commit message..."
            value={commitTitle}
            onChange={(e) => setCommitTitle(e.target.value)} />
          <Button 
          type="submit" 
          className='cursor-pointer min-w-22' 
          disabled={createCommitMutation.isPending}
          >
            {createCommitMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" /> }
            Create
          </Button>
        </form>
        <div className="space-y-4">
        {commitsData.map((commit: Commit) => ( 
          <motion.div
            key={commit.id}
            layout
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Card 
            className={
              `my-3 transition-colors shadow-sm overflow-hidden
              ${loadingCommitId.has(commit.id) ? 'bg-yellow-500 cursor-wait' 
              : completedCommitIdsToday.includes(commit.id) ? 'bg-green-200 cursor-not-allowed' 
              : 'bg-white hover:cursor-pointer'}`}
              onClick = {() => createCommitLogMutation.mutate({ commitId: commit.id, date: new Date().toISOString() })}
            >
              <CardHeader className="py-4 px-6">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg text-slate-900">{commit.title}</CardTitle>
                    <CardDescription className="text-sm">Commit #{commit.id} • User {commit.userId}</CardDescription>
                    <div className="mt-1 font-medium text-orange-600">
                        {streaks[commit.id] > 1 ? `🔥 Streak: ${streaks[commit.id]} day(s)`: ''}
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 relative -right-2 -top-2 cursor-pointer">
                          <Ellipsis className="h-4 w-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setCommitToEdit(commit);
                          setEditTitle(commit.title);
                        }} className="cursor-pointer">
                          <PencilIcon className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          variant='destructive'
                          className="cursor-pointer"
                          onClick={() => setCommitToDelete(commit)}
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <Heatmap isCompletedToday={completedCommitIdsToday.includes(commit.id)}
              logs = {(commitLogsQueries.data || []).filter(log => log.commitId === commit.id)} />
            </Card>
          </motion.div>
        ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!commitToEdit} onOpenChange={(open) => !open && setCommitToEdit(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Commit</DialogTitle>
              <DialogDescription>
                Make changes to your commit title here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
                className="mt-2"
                placeholder="Enter new title..."
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={()=> setEditTitle('')} className = "cursor-pointer">Cancel</Button>
              </DialogClose>
              <Button onClick={() => {
                if (!commitToEdit) return;
                updateCommitMutation.mutate({commitId: commitToEdit?.id, title: editTitle})
              }} 
              className="cursor-pointer min-w-22" 
              disabled={updateCommitMutation.isPending || !editTitle.trim() || editTitle === commitToEdit?.title}>
                {updateCommitMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} 
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Alert Dialog */}
        <AlertDialog open={!!commitToDelete} onOpenChange={(open) => !open && setCommitToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the commit 
                <span className="font-semibold text-slate-900"> "{commitToDelete?.title}" </span> 
                and remove all of its log history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
              <Button 
              variant="destructive" 
              onClick={() => {
                if (!commitToDelete) return;
                deleteCommitMutation.mutate(commitToDelete.id);
              }} 
              className="cursor-pointer min-w-22"
              disabled={deleteCommitMutation.isPending}
              >
                {deleteCommitMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
}