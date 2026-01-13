import { NamedOption } from '@/features/named-option/named-option.type';
import { BrandedId } from '@/shared/types/id.type';

export type SupplierId = BrandedId<'supplier'>;

export type Supplier = NamedOption & {
  id: SupplierId;
};
