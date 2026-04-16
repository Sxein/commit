import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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