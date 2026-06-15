import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: 'USD' | 'BOB' = 'USD'): string {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function calcUsd(cost: { currency: string; amount: number; exchange_rate?: number }): number {
  return cost.currency === 'USD' ? cost.amount : cost.amount / (cost.exchange_rate || 1);
}

export function calcBob(cost: { currency: string; amount: number; exchange_rate?: number }): number {
  return cost.currency === 'BOB' ? cost.amount : cost.amount * (cost.exchange_rate || 1);
}
