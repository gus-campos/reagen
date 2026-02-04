import { Size } from '@/features/size/size.type';

export type Package = {
  id: string;
  size: Size;
  purity: number;

  // Dates
  inDate: Date;
  expireDate: Date;

  // Associações
  reagentId: string;
  fundingSourceId: string | null;
  supplierId: string | null;
};
