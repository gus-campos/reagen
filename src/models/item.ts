import { Size } from './size';
import Unit from './unit';

export interface Item {
  id: string;
  reagentId: string;
  size: Size;
  purity: number;
  inDate: Date;
  expireDate: Date;
  outDate: Date | null;
}
