export type Nutrition = {
  proteinG: number; //граммы
  faMg: number;     //миллиграммы
};

export function calcForGrams(params: {
  grams: number;
  proteinPer100g: number;
  faPer100g: number;
}): Nutrition {
  const factor = params.grams / 100;

  return {
    proteinG: params.proteinPer100g * factor,
    faMg: params.faPer100g * factor,
  };
}

export function addNutrition(a: Nutrition, b: Nutrition): Nutrition {
  return { proteinG: a.proteinG + b.proteinG, faMg: a.faMg + b.faMg };
}

export function roundProtein(v: number): number {
  //точность до 2 знаков
  return Math.round(v * 100) / 100;
}

export function roundFa(v: number): number {
  //ФА целым мг
  return Math.round(v);
}
