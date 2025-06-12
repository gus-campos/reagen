import Reagent from '../typings/Reagent';
import { UnitMultiplier } from '../typings/Unit';

function absoluteAmount(reagent: Reagent) {
  return reagent.amount * UnitMultiplier[reagent.unit];
}
