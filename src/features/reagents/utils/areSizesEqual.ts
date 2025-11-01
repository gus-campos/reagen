import { Size } from '@/src/features/reagents/types/size';

export function areSizesEqual(a: Size, b: Size) {
  return a.amount === b.amount && a.unit === b.unit;
}
