import { Size } from '@/features/size/size.type';
import { Dimension } from '@/features/size/unit.type';

export type Reagent = {
  id: string;
  name: string;
  dimension: Dimension;
  sizes: Size[];
  controlAgencyId: string | null;
};
