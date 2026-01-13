export type WithId = {
  id: string;
};

export type OmitId<T> = Omit<T, 'id'>;

// Para o ts diferenciar diferentes tipos de id, mesmo que todos sejam no fundo uma string
declare const __idBranding: unique symbol;
export type BrandedId<TBrand> = string & { [__idBranding]: TBrand };
