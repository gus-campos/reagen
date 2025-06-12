import Unit from './Unit';

interface Reagent {
  id: string | null;
  name: string;
  amount: number;
  unit: Unit;
  inDate: Date | null;
  outDate: Date | null;
  expireDate: Date | null;
}

export default Reagent;

// TODO: Verificar se unidade está listada
