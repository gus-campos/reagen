import { BrandedId } from '@core/models/branded-id';
import { WithId } from '@core/models/base.interface';
import { BoxId } from '@features/box/box.model';
import { LabId } from '@features/validated-options/lab.model';

export type VialId = BrandedId<'VialId'>;

export interface Vial extends WithId {
  id: VialId;
  boxId: BoxId;
  labId: LabId;
  outDate: Date | null;
}
