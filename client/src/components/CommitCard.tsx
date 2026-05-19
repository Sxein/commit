import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PencilIcon, Ellipsis, TrashIcon, Loader2, CirclePlus, CheckCircle2 } from "lucide-react"
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
          `relative my-2 transition-all shadow-sm overflow-hidden border
          ${isCompletedToday ? 'bg-green-50 border-green-200 cursor-pointer' : 'bg-white hover:border-slate-300 hover:shadow-md cursor-pointer'}`
          }
          onClick={onNavigate}
        >
          {isPending && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          )}
          
          <div className="flex items-center justify-between p-3 px-4">
            <div className="flex flex-col flex-1 min-w-0 mr-4">
              <CardTitle className="text-base font-semibold text-slate-900 truncate">
                {commit.title}
              </CardTitle>
              <div className="text-sm font-medium text-slate-500 mt-0.5">
                {logs.length} {logs.length === 1 ? 'repetition' : 'repetitions'}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
              <Button 
                variant={isCompletedToday ? "secondary" : "default"}
                size="icon"
                className={`h-11 w-11 rounded-full ${isCompletedToday ? 'text-green-600 bg-green-100 hover:bg-green-200 opacity-100' : 'cursor-pointer hover:scale-105 transition-transform shadow-sm'}`}
                disabled={isCompletedToday || isPending}
                onClick={() => onCreateCommitLog()}
              >
                {isCompletedToday ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <CirclePlus className="h-6 w-6" />
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer">
                    <Ellipsis className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => {
                    setCommitToEdit(commit);
                    setEditTitle(commit.title);
                  }} className="cursor-pointer">
                    <PencilIcon className="mr-2 h-4 w-4 text-slate-500" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={() => setCommitToDelete(commit)}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
    )
}