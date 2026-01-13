import { NamedOption } from '@/features/named-option/named-option.type';
import { BrandedId } from '@/shared/types/id.type';

type ControlAgencyId = BrandedId<'control-agency'>;

export type ControlAgency = NamedOption & {
  id: ControlAgencyId;
};
