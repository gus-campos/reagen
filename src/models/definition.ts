import { Dimension } from './unit';

export type Definition = {
  id: string;
  name: string;
  dimension: Dimension;
  itemsId: string[];
};
