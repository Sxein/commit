import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PencilIcon, Ellipsis , TrashIcon, Loader2, CirclePlus  } from "lucide-react"
import type { Commit, CommitLog } from '@/types';


export default function CommitCard({
    commit,
    logs,
    streak,
    isPending,
    onCreateCommitLog,
    isCompletedToday,
    setCommitToEdit,
    setEditTitle,
    setCommitToDelete,
    onNavigate
} : {
    commit: Commit;
    logs: CommitLog[];
    streak: number;
    isPending: boolean;
    onCreateCommitLog: () => void;
    isCompletedToday: boolean;
    setCommitToEdit: (commit: Commit) => void;
    setEditTitle: (title: string) => void;
    setCommitToDelete: (commit: Commit) => void;
    onNavigate: () => void;
}
) {   
    return (
        <Card 
        className={
          `relative my-3 transition-colors shadow-sm overflow-hidden
          ${isCompletedToday ? 'bg-green-200 cursor-pointer' : 'bg-white hover:cursor-pointer'}`
          }
          onClick={onNavigate}
        >
          {isPending && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          )}
          <CardHeader className="py-4 px-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg text-slate-900">{commit.title}</CardTitle>
                <div className="mt-1 font-medium text-orange-600">
                    {streak > 1 ? `🔥 Streak: ${streak} day(s)`: ''}
                </div>
                <div className="font-medium text-blue-400">
                  Repetition: {logs.length}
                </div>
              </div>
              <div className="flex gap-2 items-start" onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  className={`h-8 w-8 p-0 cursor-pointer text-slate-500`}
                  disabled={isCompletedToday || isPending}
                  onClick={() => onCreateCommitLog()}
                >
                  <CirclePlus className="h-6 w-6" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
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
        </Card>
    )
}