declare const __vial: unique symbol;
export type BrandedId<TBrand> = string & { [__vial]: TBrand };
