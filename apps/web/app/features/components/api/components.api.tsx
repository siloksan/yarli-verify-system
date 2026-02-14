import type { IComponentDto } from '@repo/api';
import { http } from '~/shared/lib/http';

export function getAllComponents(search?: string) {
  if (search?.trim()) {
    return http<IComponentDto[]>('/components/search', {
      params: { q: search.trim() },
    });
  }

  return http<IComponentDto[]>('/components');
}
