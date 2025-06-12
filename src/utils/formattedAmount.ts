import Reagent from '../typings/Reagent';

function formattedAmount(reagent: Reagent) {
  return reagent.amount + ' ' + reagent.unit;
}

export default formattedAmount;
