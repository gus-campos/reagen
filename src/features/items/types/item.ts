import { Size } from '../../reagents/types/size';

export interface Item {
  id: string;
  size: Size;
  purity: number;
  inDate: Date;
  expireDate: Date;
  outDate: Date | null;
  // Associações
  reagentId: string;
  brandId: string | null;
  laboratoryId: string | null;
  supplierId: string | null;
}
