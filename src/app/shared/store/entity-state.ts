import { WithId } from '@core/models/base.interface';

export interface EntityState<T extends WithId> {
  items: T[];
  loading: boolean;
  error: string | null;
}
