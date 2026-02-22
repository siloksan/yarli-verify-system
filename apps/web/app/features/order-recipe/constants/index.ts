import type { ComponentStatus } from '../types';

export const STATUS_STYLES: Record<
  ComponentStatus,
  { badge: string; label: string; dot: string }
> = {
  UNCHECKED: {
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    label: 'Не проверено',
    dot: 'bg-gray-400',
  },
  OK: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Подтверждено',
    dot: 'bg-emerald-500',
  },
  WRONG: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    label: 'Не совпадает',
    dot: 'bg-rose-500',
  },
} as const;
