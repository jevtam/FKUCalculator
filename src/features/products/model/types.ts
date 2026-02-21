export type ProductId = string;

export type Product = {
  id: ProductId;
  name: string;
  proteinPer100g: number;//г на 100г
  faPer100g: number;//мг на 100г

  createdAt: number;
  updatedAt: number;
};

export type ProductDraft = {
  name: string;
  proteinPer100g: string;
  faPer100g: string;
};
