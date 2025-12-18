import { WithId } from '@core/models/base.interface';
import { Dimension } from './dimension.model';
import { Size } from './size.model';
import { BrandedId } from '@core/models/branded-id';
import { RegulatorId } from '@features/validated-options/regulator.model';

export type ReagentId = BrandedId<'ReagentId'>;

export interface Reagent extends WithId {
  id: ReagentId;
  name: string;
  dimension: Dimension;
  sizes: Size[];
  regulatorId: RegulatorId | null;
}
