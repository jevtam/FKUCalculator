export type MealId = string;
export type DiaryItemId = string;

export type DiaryItem = {
  id: DiaryItemId;
  productId: string;
  grams: number;
  createdAt: number;
  updatedAt: number;
};

export type Meal = {
  id: MealId;
  title: string; //завтрак, обед, полдник...
  isDefault?: boolean; //для дефолтных (завтрак, обед, ужин)
  items: DiaryItem[];
};

export type DiaryState = {
  meals: Meal[];
};
