import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { fetchCommitLogs } from "@/services/api";
import { Loader2 } from "lucide-react";
import {ActivityCalendar, type ThemeInput} from "react-activity-calendar";
import { subDays, format } from "date-fns";
import type { CommitLog } from "@/types";

export default function CommitDetails() {
    const { id } = useParams();
    const commitId = Number(id);

    const { data: logs, isPending } = useQuery({
        queryKey: ['commitLogs', commitId],
        queryFn: () => fetchCommitLogs(commitId)
    })

    const completedDateSet = new Set(logs?.map((log: CommitLog) => log.date.split('T')[0]));

    const calendarData = Array.from({ length: 365 }, (_, i) => {
        const date = subDays(new Date(), 364 - i);
        const dateStr = format(date, 'yyyy-MM-dd');

        const isCompleted = completedDateSet.has(dateStr);

        return {
            date: dateStr,
            count: isCompleted ? 1 : 0,
            level: isCompleted ? 1 : 0
        };
    })

    const twoColorTheme: ThemeInput = {
        light: ['#ebedf0', '#FF9B00'],
}

    return (
        <>
            <p>Commit Details</p>
            <div className="flex justify-center items-center h-64">
                <ActivityCalendar
                data={calendarData}
                minLevel={0}
                maxLevel={1}
                showWeekdayLabels={true}
                theme= {twoColorTheme}
                blockMargin = {5}
                blockSize = {20}
                blockRadius={4}
                showColorLegend={false}
                showTotalCount={false}
                tooltips={{
                    activity: {
                        text: activity => `${activity.date}`
                    },
                }}
            />
            </div>
        </>
    )
}