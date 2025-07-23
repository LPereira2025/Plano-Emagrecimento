import type { Meal, MealType, WeightEntry } from './types';

export const DIET_PLAN = {
    'Pequeno-almoço': 'Chá autorizado ou café, leite sem lactose ou bebida vegetal autorizada, ou iogurte autorizado ou 1 ovo. 2 fatias de pão sem glúten (50g) ou 30g de flocos de aveia/corn-flakes/farinha permitida ou 4 galetes de arroz (28g). 1 peça de fruta.',
    'Almoço': 'Sopa de legumes. 100g de carne ou peixe magro ou 2 ovos. 1 batata (80g) ou 3 colheres de sopa de arroz/quinoa/massa sem glúten. Legumes e/ou hortaliças autorizados.',
    'Meio da tarde': '1 peça de fruta. 2 fatias de pão sem glúten ou de fermentação lenta (50g) ou 30g de flocos de aveia ou corn-flakes. Bebida vegetal autorizada ou leite sem lactose ou 1 iogurte autorizado.',
    'Jantar': 'Sopa de legumes. 150g de carne ou peixe magro ou 2 ovos. 2 batatas (160g) ou 6 colheres de sopa de arroz/quinoa/massa sem glúten. Legumes e/ou hortaliças autorizados.',
};

export const EXERCISES = [
    { name: "Caminhada Rápida", description: "30 minutos de caminhada em ritmo acelerado." },
    { name: "Agachamento (Bodyweight Squats)", description: "3 séries de 15 repetições." },
    { name: "Prancha Abdominal (Plank)", description: "3 séries, segurando o máximo de tempo possível." },
    { name: "Flexões (Push-ups)", description: "3 séries de 10 repetições (pode ser com os joelhos no chão)." },
    { name: "Elevação de joelhos (High Knees)", description: "3 séries de 30 segundos." },
];

export const initialWeightData: WeightEntry[] = [
    { date: '2024-07-01', weight: 85.0 },
    { date: '2024-07-08', weight: 84.5 },
    { date: '2024-07-15', weight: 84.0 },
];

export const initialMealData: Record<MealType, Meal[]> = {
    'Pequeno-almoço': [],
    'Almoço': [],
    'Meio da tarde': [],
    'Jantar': [],
};