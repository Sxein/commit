import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import { fetchCommitLogs } from "@/services/api";
import { useCommits } from "@/hooks/useCommits";
import { Loader2, ArrowLeft, Target, Flame, TrendingUp } from "lucide-react";
import {ActivityCalendar} from "react-activity-calendar";
import 'react-activity-calendar/tooltips.css';
import { addDays, format, startOfMonth } from "date-fns";
import type { CommitLog, Commit } from "@/types";
import { calculateStreaks } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommitDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const totalRepetitions = logs?.filter((log: CommitLog) => log.isCompleted).length || 0;
    const streaks = calculateStreaks(logs || []);
    const consistency = Math.round((totalRepetitions / 365) * 100);

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            {isPending || isLogsPending ? (
                <div className="flex items-center justify-center h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                </div>
            ) : (
            <div className="animate-in fade-in duration-500">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-slate-500 hover:text-slate-900 cursor-pointer">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Commits
                </Button>

                <div className="space-y-2 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{currentCommit?.title}</h1>
                    <p className="text-slate-500">Visualizing your progress starting from creation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Repetitions</CardTitle>
                            <Target className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{totalRepetitions}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Current Streak</CardTitle>
                            <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{streaks} <span className="text-sm font-normal text-slate-500">days</span></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Consistency</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{consistency}%</div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="p-6 md:p-8 overflow-x-auto flex justify-center items-center shadow-sm">
                    <ActivityCalendar
                        data={calendarData}
                        minLevel={0}
                        maxLevel={1}
                        showWeekdayLabels={true}
                        theme={{
                            light: ['#ebedf0', '#FF9B00'],
                        }}
                        blockMargin={4}
                        blockSize={15}
                        blockRadius={2}
                        showColorLegend={false}
                        showTotalCount={false}
                        tooltips={{
                            activity: {
                                text: activity => `${activity.date}`,
                            },
                        }}
                    />
                </Card>
            </div>
            )}
        </div>
    )
}