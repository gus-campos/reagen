import { NamedOption } from '@/features/named-option/named-option.type';
import { BrandedId } from '@/shared/types/id.type';

export type BrandId = BrandedId<'brand'>;

export type Brand = NamedOption & {
  id: BrandId;
};
