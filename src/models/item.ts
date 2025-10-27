import { Size } from './size';

export interface Item {
  id: string;
  size: Size;
  purity: number;
  inDate: Date;
  expireDate: Date;
  outDate: Date | null;
  // Associações
  reagentId: string;
  controlAgencyId: string | null;
  brandId: string | null;
}
