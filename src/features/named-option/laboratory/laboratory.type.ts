import { NamedOption } from '@/features/named-option/named-option.type';
import { BrandedId } from '@/shared/types/id.type';

export type LaboratoryId = BrandedId<'laboratory'>;

export type Laboratory = NamedOption & {
  id: LaboratoryId;
};
