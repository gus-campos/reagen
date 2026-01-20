import { NamedOption } from '@/features/named-option/named-option.type';
import { BrandedId } from '@/shared/types/id.type';
import { DatabaseTableName } from '@/shared/types/table-name.type';

type ControlAgencyId = BrandedId<DatabaseTableName.ControlAgency>;

export type ControlAgency = NamedOption & {
  id: ControlAgencyId;
};
