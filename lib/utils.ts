import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, fmt = 'PPP'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, fmt);
}

export function formatDateInput(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'PPpp');
}

export function formatSnakeCase(str: string): string {
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function cleanOptionalField(value: string | undefined | null): string | undefined {
  return value || undefined;
}

import type { Platform } from '@/types/job-application';

export function customPlatformFor(platform: Platform | undefined, customPlatform: string | undefined): string | undefined {
  return platform === 'other' ? customPlatform : undefined;
}

let lastId = 0;

export function generateId(): number {
  const now = Date.now();
  if (now <= lastId) {
    lastId++;
    return lastId;
  }
  lastId = now;
  return now;
}

export function isValidUrl(urlString: string): boolean {
  const blockedProtocols = ['javascript:', 'data:', 'file:', 'vbscript:'];
  try {
    const url = new URL(urlString);
    return (url.protocol === 'http:' || url.protocol === 'https:')
      && !blockedProtocols.some(p => urlString.toLowerCase().startsWith(p));
  } catch {
    return false;
  }
}
