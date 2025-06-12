// Vencimento
//  (x) Todos
//  ( ) Apenas vencidos
//  ( ) Apenas não vencidos
//
// Filtrar datas
// [x]Entrada []Saída []Vencimento
// De 10/05/2025 até __/__/____
//
// Filtrar quantidade
// (x)Massa ()Volume ()Mols
// De 10g até 2Kg

import { Dimension } from './Unit';

type DateField = 'inDate' | 'outDate' | 'expireDate';

export interface ReagentsFilter {
  expired: boolean | null;
  dateFieldFiltered: DateField | null; // TODO: Se não for null, mostrar só quem tem tal data definida
  minDate: Date | null;
  maxDate: Date | null;
  dimension: Dimension | null;
  amount: number | null;
}

export default ReagentsFilter;
