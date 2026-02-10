export type MealKey = "breakfast" | "lunch" | "dinner";

export type DiaryItemId = string;

export type DiaryItem = {
  id: DiaryItemId;
  productId: string; //пока только продукты
  grams: number;

  createdAt: number;
  updatedAt: number;
};

export type DiaryState = Record<MealKey, DiaryItem[]>;
