import { Size } from './size';
import Unit, { Dimension } from './unit';

export type Reagent = {
  id: string;
  name: string;
  dimension: Dimension;
  itemsId: string[];
  sizes: Size[];
};
