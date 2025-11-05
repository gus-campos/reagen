import { Size } from './size';
import { Dimension } from './unit';

export type Reagent = {
  id: string;
  name: string;
  dimension: Dimension;
  sizes: Size[];
  controlAgencyId: string | null;
};
