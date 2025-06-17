import { Reagent } from '../typings/reagent';

export function formattedAmount(reagent: Reagent) {
  return reagent.amount + ' ' + reagent.unit;
}
