
import React, { useState, useCallback } from 'react';
import type { Meal, MealType } from '../types';
import { DIET_PLAN } from '../constants';
import { getMealSuggestion, estimateCaloriesFromImage } from '../services/geminiService';
import { Utensils, Camera, Lightbulb, ChefHat, Loader2, Sparkles } from 'lucide-react';

interface MealDashboardProps {
    meals: Record<MealType, Meal[]>;
    onLogMeal: (mealType: MealType, meal: Meal) => void;
}

const MealCard: React.FC<{ mealType: MealType; meals: Meal[]; onLogMeal: (mealType: MealType, meal: Meal) => void }> = ({ mealType, meals, onLogMeal }) => {
    const [showLogger, setShowLogger] = useState(false);
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [caloriesResult, setCaloriesResult] = useState<{ totalCalories: number; items: { name: string; calories: number }[] } | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setCaloriesResult(null);
        }
    };

    const handleGetSuggestion = useCallback(async () => {
        setIsLoading(true);
        setSuggestion('');
        try {
            const result = await getMealSuggestion(mealType, DIET_PLAN[mealType]);
            setSuggestion(result);
        } catch (error) {
            setSuggestion('Não foi possível obter uma sugestão. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }, [mealType]);

    const handleCalorieEstimation = async () => {
        if (!imageFile) return;
        setIsLoading(true);
        setCaloriesResult(null);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = async () => {
                const base64Image = (reader.result as string).split(',')[1];
                const result = await estimateCaloriesFromImage(base64Image);
                setCaloriesResult(result);
            };
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveMeal = () => {
        let meal: Meal = { description };
        if (caloriesResult && imagePreview) {
            meal = {
                description: `Refeição da foto: ${caloriesResult.items.map(i => i.name).join(', ')}`,
                calories: caloriesResult.totalCalories,
                imageUrl: imagePreview,
                items: caloriesResult.items,
            };
        }
        onLogMeal(mealType, meal);
        setDescription('');
        setImageFile(null);
        setImagePreview(null);
        setCaloriesResult(null);
        setShowLogger(false);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><ChefHat className="mr-2 h-5 w-5 text-green-600" />{mealType}</h3>
            
            {meals.map((meal, index) => (
                <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
                    {meal.imageUrl && <img src={meal.imageUrl} alt="Refeição" className="rounded-lg mb-2 w-full h-40 object-cover" />}
                    <p className="text-gray-700">{meal.description}</p>
                    {meal.calories && <p className="font-bold text-green-700">{meal.calories.toFixed(0)} kcal</p>}
                </div>
            ))}

            {showLogger ? (
                <div className="mt-4 space-y-4">
                     <div className="space-y-2">
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva a sua refeição..." className="w-full p-2 border rounded-lg h-20"></textarea>
                        <div className="p-2 border-2 border-dashed rounded-lg text-center">
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id={`file-upload-${mealType}`} />
                            <label htmlFor={`file-upload-${mealType}`} className="cursor-pointer text-green-600 font-semibold flex items-center justify-center"><Camera className="mr-2 h-5 w-5" />Carregar Foto</label>
                        </div>
                        {imagePreview && (
                            <div>
                                <img src={imagePreview} alt="Preview" className="rounded-lg w-full h-48 object-cover" />
                                <button onClick={handleCalorieEstimation} disabled={isLoading} className="mt-2 w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
                                    {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="h-5 w-5" />} Estimar Calorias
                                </button>
                            </div>
                        )}
                        {caloriesResult && (
                             <div className="p-3 bg-indigo-50 rounded-lg">
                                <p className="font-bold text-indigo-800">Total Estimado: {caloriesResult.totalCalories.toFixed(0)} kcal</p>
                                <ul className="text-sm text-indigo-700 list-disc list-inside">
                                    {caloriesResult.items.map(item => <li key={item.name}>{item.name}: {item.calories.toFixed(0)} kcal</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSaveMeal} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 flex-1">Guardar</button>
                        <button onClick={() => setShowLogger(false)} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setShowLogger(true)} className="mt-2 w-full bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-lg hover:bg-green-200 transition-colors">Registar Refeição</button>
            )}

            <div className="mt-4">
                <button onClick={handleGetSuggestion} disabled={isLoading} className="w-full flex justify-center items-center gap-2 text-sm text-yellow-800 bg-yellow-100 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-200 disabled:bg-yellow-50">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Lightbulb className="h-4 w-4" />} Obter Sugestão
                </button>
                {suggestion && <p className="mt-2 p-3 bg-yellow-50 text-yellow-900 rounded-lg text-sm">{suggestion}</p>}
            </div>
        </div>
    );
};

export const MealDashboard: React.FC<MealDashboardProps> = ({ meals, onLogMeal }) => {
    const mealTypes: MealType[] = ['Pequeno-almoço', 'Almoço', 'Meio da tarde', 'Jantar'];
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Utensils className="mr-3 h-6 w-6 text-green-600"/>Registo de Refeições</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mealTypes.map(mealType => (
                    <MealCard key={mealType} mealType={mealType} meals={meals[mealType]} onLogMeal={onLogMeal} />
                ))}
            </div>
        </div>
    );
};
