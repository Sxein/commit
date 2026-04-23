import { useState, useEffect } from 'react';
import { getLast30Days } from "../lib/utils";
import { fetchCommitLogs } from '@/services/api';

interface HeatmapProps {
    commitId: number;
    isCompletedToday: boolean;
}

export default function Heatmap({ commitId, isCompletedToday }: HeatmapProps) {
    const last30Days = getLast30Days();
    
    // Get today's date in YYYY-MM-DD format
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({});
    
    useEffect(() => {
        if (!commitId) return;
        
        const fetchCompletedLogs = async () => {
            try {
                const logs = await fetchCommitLogs(commitId);
                const dataMap: Record<string, boolean> = {};

                logs.forEach((log: { date: string; isCompleted: boolean }) => {
                    const formatDate = log.date.split('T')[0]; // Extract the date part (YYYY-MM-DD)
                    dataMap[formatDate] = log.isCompleted;
                });
                setCompletedDays(dataMap);
            }
            catch (error) {
                console.error('Error fetching commit logs:', error);
            }
        }
        fetchCompletedLogs();
    }, [commitId]);

    // const completedDays: Record<string, boolean> = {
    // "2026-04-15": true,
    // "2026-04-10": false,
    // "2026-04-05": true,
    // };

    return (
        <div className="flex flex-wrap gap-1 px-6 pb-6">
            {last30Days.map((date) => {
                const isToday = (date === todayStr);
                const isCompleted = (isToday && isCompletedToday) || completedDays[date] || false;
                return (
                    <div
                        key={date}
                        title={`${date}: ${isCompleted ? 'Completed' : 'Missed'}`}
                        className={`w-4 h-4 rounded-sm ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                    />
                )
            })}
        </div>
    )
}