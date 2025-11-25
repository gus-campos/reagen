import { Size } from '../../reagent/types/size';

export type Package = {
  id: string;
  size: Size;
  purity: number;

  // Dates
  inDate: Date;
  expireDate: Date;

  // Associações
  reagentId: string;
  brandId: string | null;
  supplierId: string | null;
};
