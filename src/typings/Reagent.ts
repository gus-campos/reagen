import Unit from './Unit';

type Reagent = {
  id: string | null;
  name: string;
  amount: number;
  unit: Unit;
};

export default Reagent;
