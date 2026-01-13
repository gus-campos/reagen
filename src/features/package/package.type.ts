import { Size } from '@/features/size/size.type';
import { Vial } from '@/features/vial/vial.type';

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

export type PackageWithVials = Package & { vials: Vial[] };
