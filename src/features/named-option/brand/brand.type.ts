import { NamedOption } from '@/features/named-option/named-option.type';
import { BrandedId } from '@/shared/types/id.type';
import { DatabaseTableName } from '@/shared/types/table-name.type';

export type BrandId = BrandedId<DatabaseTableName.Brand>;

export type Brand = NamedOption & {
  id: BrandId;
};
