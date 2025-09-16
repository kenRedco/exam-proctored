import { format, formatDistanceToNow, parseISO, isToday, isYesterday, isThisYear } from 'date-fns';

type FormatDateOptions = {
  format?: 'short' | 'medium' | 'long' | 'full';
  includeTime?: boolean;
  timeOnly?: boolean;
};

const FORMATS = {
  short: 'MMM d',
  medium: 'MMM d, yyyy',
  long: 'MMMM d, yyyy',
  full: 'EEEE, MMMM d, yyyy',
} as const;

const TIME_FORMAT = 'h:mm a';

export function formatDate(
  date: string | Date,
  options: FormatDateOptions = { format: 'medium', includeTime: false }
): string {
  const { format: formatType = 'medium', includeTime = false, timeOnly = false } = options;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (timeOnly) {
    return format(dateObj, TIME_FORMAT);
  }

  let dateFormat = FORMATS[formatType];
  
  // Handle relative dates for recent dates
  if (isToday(dateObj)) {
    return `Today${includeTime ? `, ${format(dateObj, TIME_FORMAT)}` : ''}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday${includeTime ? `, ${format(dateObj, TIME_FORMAT)}` : ''}`;
  }
  
  // For current year, omit the year in medium format
  if (isThisYear(dateObj) && formatType === 'medium') {
    dateFormat = 'MMM d';
  }
  
  const formattedDate = format(dateObj, dateFormat);
  
  if (includeTime) {
    return `${formattedDate} at ${format(dateObj, TIME_FORMAT)}`;
  }
  
  return formattedDate;
}

export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hr${hours !== 1 ? 's' : ''} ${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100); // Assuming amount is in cents
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function isPast(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
}

export function isFuture(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj > new Date();
}

export function getTimeRemaining(endDate: string | Date): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
}

export function formatTimeRemaining(endDate: string | Date): string {
  const { days, hours, minutes } = getTimeRemaining(endDate);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
}
