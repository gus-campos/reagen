import { NamedOption } from '@/features/named-option/named-option.type';
import { BrandedId } from '@/shared/types/id.type';
import { DatabaseTableName } from '@/shared/types/table-name.type';

export type FundingSourceId = BrandedId<DatabaseTableName.FundingSource>;

export type FundingSource = NamedOption & {
  id: FundingSourceId;
};
