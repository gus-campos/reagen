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

export interface ItemFilter {
  minExpire: Date | null;
  maxExpire: Date | null;

  expired: 'expired' | 'not-expired' | 'all';
  controlled: 'controlled' | 'not-controlled' | 'all';

  controlAgencyId: string | null;
  brandId: string | null;
  supplierId: string | null;
  laboratoryId: string | null;
}
