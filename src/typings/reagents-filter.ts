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

import { Dimension } from './unit';

export enum DateField {
  IN_DATE = 'Entrada',
  OUT_DATE = 'Saída',
  EXPIRE_DATE = 'Vencimento',
}

export interface ReagentsFilter {
  expired: boolean | null; // TODO

  dateField: DateField | null;
  minDate: Date | null;
  maxDate: Date | null;

  dimension: Dimension | null;
  minAmount: number | null;
  maxAmount: number | null;
}

export default ReagentsFilter;
