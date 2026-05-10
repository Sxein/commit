import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Heatmap from '../components/Heatmap';
import { PencilIcon, Ellipsis , TrashIcon  } from "lucide-react"

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
    setCommitToDelete
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
}
) {   

    return (
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
              ${isPending ? 'bg-yellow-500 cursor-wait' 
              : isCompletedToday ? 'bg-green-200 cursor-not-allowed' 
              : 'bg-white hover:cursor-pointer'}`}
              onClick = {() =>{
                if (isCompletedToday || isPending) return;

                onCreateCommitLog();
              }} 
            >
              <CardHeader className="py-4 px-6">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg text-slate-900">{commit.title}</CardTitle>
                    <CardDescription className="text-sm">Commit #{commit.id} • User {commit.userId}</CardDescription>
                    <div className="mt-1 font-medium text-orange-600">
                        {streak > 1 ? `🔥 Streak: ${streak} day(s)`: ''}
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
              <Heatmap isCompletedToday={isCompletedToday}
              logs={logs}/>
            </Card>
          </motion.div>
    )
}