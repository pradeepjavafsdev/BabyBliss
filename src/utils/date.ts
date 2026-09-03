import { differenceInDays, differenceInMonths, differenceInWeeks, format } from 'date-fns';

export function formatBabyAge(birthDate: string, asOf: Date = new Date()): string {
  const birth = new Date(birthDate);
  const months = differenceInMonths(asOf, birth);
  const days = differenceInDays(asOf, birth);

  if (days < 0) return 'Not born yet';
  if (days < 14) return `${days} day${days === 1 ? '' : 's'} old`;
  if (months < 1) {
    const weeks = differenceInWeeks(asOf, birth);
    return `${weeks} week${weeks === 1 ? '' : 's'} old`;
  }
  if (months < 24) {
    const remDays = differenceInDays(asOf, new Date(birth.getFullYear(), birth.getMonth() + months, birth.getDate()));
    if (months < 12) {
      return remDays > 0 ? `${months} mo · ${remDays}d` : `${months} month${months === 1 ? '' : 's'} old`;
    }
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return remMonths > 0 ? `${years}y ${remMonths}m` : `${years} year${years === 1 ? '' : 's'} old`;
  }
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return remMonths > 0 ? `${years}y ${remMonths}m` : `${years} years old`;
}

export function babyAgeInMonths(birthDate: string, asOf: Date = new Date()): number {
  return Math.max(0, differenceInMonths(asOf, new Date(birthDate)));
}

export function babyAgeInDays(birthDate: string, asOf: Date = new Date()): number {
  return Math.max(0, differenceInDays(asOf, new Date(birthDate)));
}

export function formatMemoryDate(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy · h:mm a');
}

export function formatShortDate(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy');
}

export function createId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
