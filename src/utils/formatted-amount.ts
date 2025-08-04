import { Reagent } from '../models/reagent';

export function formattedAmount(reagent: Reagent) {
  return reagent.amount + ' ' + reagent.unit;
}
