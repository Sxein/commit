import { getLast30Days } from "../lib/utils";

interface HeatmapProps {
    isCompletedToday: boolean;
    logs?: { date: string; isCompleted: boolean; commitId: number }[]; 
}

export default function Heatmap({ isCompletedToday, logs }: HeatmapProps) {
    const last30Days = getLast30Days();
    
    // Get today's date in YYYY-MM-DD format
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;


    const dataMap = logs? logs.reduce((acc: Record<string, boolean>, log) => {
        const formattedDate = log.date.split('T')[0]; // Extract date part in YYYY-MM-DD format
        acc[formattedDate] = log.isCompleted; // Store completion status for each date
        return acc;
    }, {}) : {};
    
    return (
        <div className="flex flex-wrap gap-1 px-6 pb-6">
            {last30Days.map((date) => {
                const isToday = (date === todayStr);
                const isCompleted = (isToday && isCompletedToday) || dataMap[date] || false;
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