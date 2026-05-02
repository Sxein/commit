import { useState, useEffect } from 'react';
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
import { fetchCommits, createCommit, updateCommit, deleteCommit, createCommitLog, fetchCommitLogs,  } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import Heatmap from '../components/Heatmap';
import { PencilIcon, Ellipsis , TrashIcon } from "lucide-react"
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

export default function Home() {
    const [commits, setCommits] = useState<Commit[]>([]);
    const [commitTitle, setCommitTitle] = useState('');
    const [completedCommitIdsToday, setCompletedCommitIdsToday] = useState<number[]>([]);
    const [streaks, setStreaks] = useState<Record<number, number>>({});
    const [logs, setLogs] = useState<CommitLog[]>([]);
    const [commitToEdit, setCommitToEdit] = useState<Commit | null>(null);
    const [commitToDelete, setCommitToDelete] = useState<Commit | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const { logoutUser } = useAuth(); 
    useEffect(() => {
      const loadCommitsToBeCompletedToday = async () => {
        try {
          //fetch commits for user
          const commits = await fetchCommits();
          setCommits(commits);

          //fetch logs for each commit
          const logPromises = commits.map((commit: Commit) => fetchCommitLogs(commit.id));
          const allLogs = await Promise.all(logPromises);

          const newStreaks: Record<number, number> = {};
          const completedCommitIdsForToday: number[] = [];
          const today = new Date().toDateString();
          const allLogsFlat = allLogs.flat();

          // Store all logs in state for heatmap use
          setLogs(allLogsFlat);

          // Check logs to find completed commits for today
          allLogsFlat.forEach((log: CommitLog) => {
            const logDate = new Date(log.date).toDateString();
            if (log.isCompleted && logDate === today) {
              completedCommitIdsForToday.push(log.commitId);
            }
          })

          // Calculate streaks for each commit
          commits.forEach((commit: Commit) => {
            const logsForSpecificCommit = allLogsFlat.filter(log => (log.commitId === commit.id))
            newStreaks[commit.id] = calculateStreaks(logsForSpecificCommit);
          })

          setCompletedCommitIdsToday(completedCommitIdsForToday);
          setStreaks(newStreaks);
        } catch (error) {
          console.error('Error fetching commits:', error);
        }
      };
      loadCommitsToBeCompletedToday();
    }, []);


    // Create a new commit
    const handleCreateCommit = async (title: string) => {
      try {
        const newCommit = await createCommit(title);
        setCommits(prevCommits => [...prevCommits, newCommit]);
        setCommitTitle('');
      }
      catch (error) {
        console.error('Error creating commit:', error);
      }
    }

    // Log commit completion
    const handleCreateCommitLog = async (commitId: number, date: string) => {
      if (completedCommitIdsToday.includes(commitId)) {
        return;
      }
      
      try {
        await createCommitLog(commitId, date);
      }
      catch (error) {
        console.error(`Error logging completion for commit ${commitId}:`, error);
        return;
      }

      if (!completedCommitIdsToday.includes(commitId)) {
        setCompletedCommitIdsToday(prev => [...prev, commitId]);
      }

      
      setStreaks(prev => {
        const currentStreak = prev[commitId] || 0;
        return {
          ...prev,
          [commitId]: currentStreak + 1,
        };
      });
    }

    // Update an existing commit
    const handleUpdateCommit = async () => {
      if (!commitToEdit || !editTitle.trim()) return;
      try {
        await updateCommit(commitToEdit.id, editTitle);
        setCommits(prev => prev.map(c => c.id === commitToEdit.id ? { ...c, title: editTitle } : c));
        setCommitToEdit(null);
        setEditTitle('');
      } catch (error) {
        console.error('Error updating commit:', error);
      }
    }

    // Delete a commit
    const handleDeleteCommit = async () => {
      if (!commitToDelete) return;
      try {
        await deleteCommit(commitToDelete.id);
        setCommits(prev => prev.filter(c => c.id !== commitToDelete.id));
        setCommitToDelete(null);
      } catch (error) {
        console.error('Error deleting commit:', error);
      }
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
              handleCreateCommit(commitTitle);
            }
          }} 
        >
          <Input type="text"
            className="flex-1"
            placeholder="Enter commit message..."
            value={commitTitle}
            onChange={(e) => setCommitTitle(e.target.value)} />
          <Button type="submit" className='cursor-pointer'>Create Commit</Button>
        </form>

        <div className="space-y-4">
        {commits.map((commit) => ( 
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
              ${completedCommitIdsToday.includes(commit.id) ? 'bg-green-200 cursor-not-allowed' : 'bg-white hover:cursor-pointer'}`}
              onClick = {() => handleCreateCommitLog(commit.id, new Date().toISOString())}
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
                        <DropdownMenuItem onClick={() => setCommitToEdit(commit)} className="cursor-pointer">
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
              logs = {logs.filter(log => log.commitId === commit.id)} />
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
                value={editTitle ? editTitle : commitToEdit?.title || ''} 
                onChange={(e) => setEditTitle(e.target.value)} 
                className="mt-2"
                placeholder="Enter new title..."
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={()=> setEditTitle('')} className = "cursor-pointer">Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdateCommit} className="cursor-pointer">
                Save changes
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
              <Button variant="destructive" onClick={handleDeleteCommit} className="cursor-pointer">
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
}