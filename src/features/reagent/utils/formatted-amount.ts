import { Size } from '@/src/features/reagent/types/size';

export function formattedSize(size: Size) {
  return `${size.amount} ${size.unit}`;
}
