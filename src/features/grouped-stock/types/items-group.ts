import { Item } from '../../items/types/item';
import { Size } from '../../reagents/types/size';

export type ItemGroup = {
  reagentId: string;
  size: Size;
  items: Item[];
};
