import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(value);
};

export const formatPercent = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value);
};