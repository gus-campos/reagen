import { Size } from '../models/size';

export function areSizesEqual(a: Size, b: Size) {
  return a.amount === b.amount && a.unit === b.unit;
}
