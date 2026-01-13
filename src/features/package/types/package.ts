import { Size } from '../../reagent/types/size';
import { Vial } from '../../vial/types/vial';

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
