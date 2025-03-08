import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const formatTime = (time) => {
  return time.toString().padStart(2, '0');
};

export const getDayType = (date) => {
  const day = date.getDay();
  if (day === 0) return '休日';
  if (day === 6) return '土曜日';
  return '平日';
};

export const calculateNextBuses = (timetableData, currentTime, dayType, limit = 5) => {
  if (!timetableData) return [];

  const currentHour = currentTime.getHours();
  const schedule = timetableData.timetable[dayType];
  const nextBuses = [];

  for (let hour = currentHour; hour < 24; hour++) {
    const timeKey = `${hour}時`;
    const hourSchedule = schedule[timeKey] || [];

    hourSchedule.forEach(minute => {
      const busTime = new Date(currentTime);
      busTime.setHours(hour, parseInt(minute), 0);

      if (busTime > currentTime) {
        const minutesUntilBus = Math.floor((busTime - currentTime) / 60000);
        nextBuses.push({
          time: `${formatTime(hour)}:${minute}`,
          minutesLeft: minutesUntilBus
        });
      }
    });

    if (nextBuses.length >= limit) break;
  }

  return nextBuses.slice(0, limit);
};

export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}
