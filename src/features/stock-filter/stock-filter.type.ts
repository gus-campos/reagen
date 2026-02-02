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

export interface StockFilter {
  /* Filtra de forma geral pacotes e frascos */

  outStatus: 'is-out' | 'not-out' | 'all';
  minOutDate: Date | null;
  maxOutDate: Date | null;

  expired: 'expired' | 'not-expired' | 'all';
  minExpire: Date | null;
  maxExpire: Date | null;

  minInDate: Date | null;
  maxInDate: Date | null;

  controlled: 'controlled' | 'not-controlled' | 'all';
  controlAgencyId: string | null;

  fundingScope: 'internal' | 'external' | 'all';
  fundingSourceId: string | null;

  supplierId: string | null;
  laboratoryId: string | null;
}
