import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, unknown>;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
