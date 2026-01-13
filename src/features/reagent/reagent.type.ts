import { Size } from '../size/size.type';
import { Dimension } from '../size/unit.type';

export type Reagent = {
  id: string;
  name: string;
  dimension: Dimension;
  sizes: Size[];
  controlAgencyId: string | null;
};
