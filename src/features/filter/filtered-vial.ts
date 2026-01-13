import { Vial } from '../vial/types/vial';
import { StockFilter } from './stock-filter';

export function filteredVial(vial: Vial, filter: StockFilter): boolean {
  const matchesLaboratoryFilter =
    filter.laboratoryId === null || filter.laboratoryId === vial.laboratoryId;

  return matchesLaboratoryFilter;
}
