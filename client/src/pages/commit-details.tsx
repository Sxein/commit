import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { fetchCommitLogs } from "@/services/api";
import { useCommits } from "@/hooks/useCommits";
import { Loader2 } from "lucide-react";
import {ActivityCalendar} from "react-activity-calendar";
import 'react-activity-calendar/tooltips.css';
import { addDays, format, startOfMonth } from "date-fns";
import type { CommitLog, Commit } from "@/types";

export default function CommitDetails() {
    const { id } = useParams();
    const commitId = Number(id);
    const { commitsData, isPending } = useCommits();

    const currentCommit = commitsData?.find((commit: Commit) => commit.id === commitId);

    const { data: logs, isPending: isLogsPending } = useQuery({
        queryKey: ['commitLogs', commitId],
        queryFn: () => fetchCommitLogs(commitId),
    });

    const completedDateSet = new Set(logs?.map((log: CommitLog) => log.date.split('T')[0]) || []); 

    const calendarData = Array.from({ length: 365 }, (_, i) => {
        const date = addDays(startOfMonth(new Date(currentCommit?.createdAt || new Date())), i);    
        const dateStr = format(date, 'yyyy-MM-dd');

        const isCompleted = completedDateSet.has(dateStr);

        return {
            date: dateStr,
            count: isCompleted ? 1 : 0,
            level: isCompleted ? 1 : 0
        };
    })

    return (
        <>
            <p>Commit Details</p>
            {isPending || isLogsPending ? (
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                </div>
            ) : (
            <div className="flex justify-center items-center h-64">
                <ActivityCalendar
                data={calendarData}
                minLevel={0}
                maxLevel={1}
                showWeekdayLabels={true}
                theme= {{
                    light: ['#ebedf0', '#FF9B00'],
                }}
                blockMargin = {4}
                blockSize = {15}
                blockRadius={2}
                showColorLegend={false}
                showTotalCount={false}
                tooltips={{
                    activity: {
                        text: activity => `${activity.date}`,
                    },
                }}
            />
            </div>
            )}
        </>
    )
}