// Vencimento
//  (x) todos
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

import { z } from 'zod';

export const stockFilterSchema = z.object({
  outStatus: z.enum(['is-out', 'not-out', 'all']),
  minOutDate: z.date().nullable(),
  maxOutDate: z.date().nullable(),

  expired: z.enum(['expired', 'not-expired', 'all']),
  minExpire: z.date().nullable(),
  maxExpire: z.date().nullable(),

  minInDate: z.date().nullable(),
  maxInDate: z.date().nullable(),

  controlled: z.enum(['controlled', 'not-controlled', 'all']),
  controlAgencyId: z.string().nullable(),

  fundingScope: z.enum(["internal", "external", "all"]),
  fundingSourceId: z.string().nullable(),

  supplierId: z.string().nullable(),
  laboratoryId: z.string().nullable(),
});

/* Filtra de forma geral pacotes e frascos */
export type StockFilter = z.infer<typeof stockFilterSchema>;