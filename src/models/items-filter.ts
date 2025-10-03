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

export interface ItemsFilter {
  expired: boolean | null; // TODO

  minDate: Date | null;
  maxDate: Date | null;

  dimension: Dimension | null;
  minAmount: number | null;
  maxAmount: number | null;
}

export default ItemsFilter;
