
export interface WeightEntry {
  date: string;
  weight: number;
}

export interface Meal {
  description: string;
  calories?: number;
  imageUrl?: string;
  items?: { name: string; calories: number }[];
}

export type MealType = 'Pequeno-almoço' | 'Almoço' | 'Meio da tarde' | 'Jantar';
