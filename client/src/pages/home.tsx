import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommits } from '@/hooks/useCommits';
import { useCommitLogs } from '@/hooks/useCommitLogs';
import { useAuth } from '@/context/AuthContext';
import type { Commit } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CommitCard from '@/components/CommitCard';

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
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label"

const EMPTY_COMMITS: Commit[] = [];

export default function Home() {
    const [commitTitle, setCommitTitle] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [commitToEdit, setCommitToEdit] = useState<Commit | null>(null);
    const [commitToDelete, setCommitToDelete] = useState<Commit | null>(null);
    const navigate = useNavigate();
    const { logoutUser } = useAuth(); 
    const { commitsData, isPending, isError, error, createCommit, updateCommit, deleteCommit } = useCommits();
    const { commitLogs, isPendingLogs, createCommitLog, completedCommitIdsToday, streaks } = useCommitLogs(commitsData || EMPTY_COMMITS);


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
              createCommit.mutate(commitTitle, {
                onSuccess: () => setCommitTitle(''),
              });
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
          disabled={createCommit.isPending}
          >
            {createCommit.isPending && <Loader2 className="h-4 w-4 animate-spin" /> }
            Create
          </Button>
        </form>
        <div className="space-y-4">
        {commitsData.map((commit: Commit) => ( 
          <CommitCard 
          key={commit.id} 
          commit={commit}
          logs = {commitLogs.filter(log => log.commitId === commit.id)}
          isPendingLogs = {isPendingLogs}
          streak = {streaks[commit.id] || 0}
          isPending = {createCommitLog.isPending && createCommitLog.variables?.commitId === commit.id}
          onCreateCommitLog = {() => createCommitLog.mutate({ commitId: commit.id, date: new Date().toISOString() })}
          isCompletedToday = {completedCommitIdsToday.includes(commit.id)}
          setCommitToEdit={setCommitToEdit}
          setCommitToDelete={setCommitToDelete}
          setEditTitle={setEditTitle}
          onNavigate={() => navigate(`/commit/${commit.id}`)}
          />
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
                updateCommit.mutate({commitId: commitToEdit?.id, title: editTitle},{
                  onSuccess: () => {    
                    setCommitToEdit(null);
                    setEditTitle('');
                  }
                }
                )
              }} 
              className="cursor-pointer min-w-22" 
              disabled={updateCommit.isPending || !editTitle.trim() || editTitle === commitToEdit?.title}>
                {updateCommit.isPending && <Loader2 className="h-4 w-4 animate-spin" />} 
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
                deleteCommit.mutate(commitToDelete.id, {
                  onSuccess: () => setCommitToDelete(null)
                });
              }} 
              className="cursor-pointer min-w-22"
              disabled={deleteCommit.isPending}
              >
                {deleteCommit.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
}