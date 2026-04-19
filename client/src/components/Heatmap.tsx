import { getLast30Days } from "../lib/utils";

export default function Heatmap() {
    const last30Days = getLast30Days();

    const completedDays: Record<string, boolean> = {
    "2026-04-15": true,
    "2026-04-10": false,
    "2026-04-05": true,
    };

    return (
        <div className="flex flex-wrap gap-1">
            {last30Days.map((date) => {
                const isCompleted = completedDays[date] || false;
                return (
                    <div
                        key={date}
                        className={`w-4 h-4 rounded-sm ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                    />
                )
            })}
        </div>
    )
}