import { Size } from './size';

export interface Item {
  id: string;
  reagentId: string;
  size: Size;
  purity: number;
  inDate: Date;
  expireDate: Date;
  outDate: Date | null;
  controlAgency: string | null;
  brand: string | null;
}
