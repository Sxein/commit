import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CommitLog } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getLast30Days() {
  const dates = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();

    d.setDate(d.getDate() - i);


    // 3. Extract the year, month, and day
    // Hint: getFullYear(), getMonth() + 1 (months are 0-indexed!), getDate()
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so need to add 1
    const day = String(d.getDate()).padStart(2, '0');

    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}

export function calculateStreaks(logs: CommitLog[]): number {
    // Filter logs to only include completed ones
    const completedLogs = logs.filter(log => log.isCompleted);
    // Extract unique dates from completed logs and get rid of time component for accurate streak calculation
    const uniqueCompletedLogs = Array.from(new Set(completedLogs.map(log => new Date(log.date).toDateString())));
    // Sort Commit logs by dates in descending order
    const sortedDates = uniqueCompletedLogs.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (sortedDates.length === 0) {
      return 0;
    }

    const expectedDate = new Date(sortedDates[0]);
    expectedDate.setHours(0, 0, 0, 0); // Normalize to start of the day
    
    // the most recent completed log date cannot be smaller than yesterday, otherwise the streak is already broken
    if (expectedDate < yesterday) {
      return 0; 
    }

    for (let i = 0; i < sortedDates.length; i++) {
      const logDate = new Date(sortedDates[i]);
      logDate.setHours(0, 0, 0, 0); // Normalize to start of the day

      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1); // Move to the previous day
      } else {
        break; // Break the loop if the streak is broken (gap in the days)
      }
    }

    return streak;
  }