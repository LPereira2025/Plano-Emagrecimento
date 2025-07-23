
import React, { useState, useEffect, useCallback } from 'react';
import { WeightTracker } from './components/WeightTracker';
import { MealDashboard } from './components/MealDashboard';
import { ExerciseTracker } from './components/ExerciseTracker';
import { MotivationAndReminders } from './components/MotivationAndReminders';
import { Header } from './components/Header';
import { PwaInstallInstructions } from './components/PwaInstallInstructions';
import type { WeightEntry, Meal, MealType } from './types';
import { getMotivationalQuote } from './services/geminiService';
import { initialWeightData, initialMealData } from './constants';

const App: React.FC = () => {
    const [weightData, setWeightData] = useState<WeightEntry[]>(() => {
        const saved = localStorage.getItem('weightData');
        return saved ? JSON.parse(saved) : initialWeightData;
    });
    const [meals, setMeals] = useState<Record<MealType, Meal[]>>(() => {
        const saved = localStorage.getItem('meals');
        return saved ? JSON.parse(saved) : initialMealData;
    });
    const [motivationalQuote, setMotivationalQuote] = useState<string>('');
    const [initialWeight, setInitialWeight] = useState<number>(() => {
        const saved = localStorage.getItem('initialWeight');
        return saved ? JSON.parse(saved) : 85;
    });
    const [targetWeight, setTargetWeight] = useState<number>(() => {
        const saved = localStorage.getItem('targetWeight');
        return saved ? JSON.parse(saved) : 75;
    });
    const [targetDate, setTargetDate] = useState<string>(() => {
        const saved = localStorage.getItem('targetDate');
        const defaultDate = new Date();
        defaultDate.setMonth(defaultDate.getMonth() + 3);
        return saved ? JSON.parse(saved) : defaultDate.toISOString().split('T')[0];
    });

    useEffect(() => {
        localStorage.setItem('weightData', JSON.stringify(weightData));
        localStorage.setItem('meals', JSON.stringify(meals));
        localStorage.setItem('initialWeight', JSON.stringify(initialWeight));
        localStorage.setItem('targetWeight', JSON.stringify(targetWeight));
        localStorage.setItem('targetDate', JSON.stringify(targetDate));
    }, [weightData, meals, initialWeight, targetWeight, targetDate]);

    const fetchQuote = useCallback(async () => {
        try {
            const quote = await getMotivationalQuote();
            setMotivationalQuote(quote);
        } catch (error) {
            console.error("Failed to fetch motivational quote:", error);
            setMotivationalQuote("Lembre-se por que você começou. Cada passo é um progresso.");
        }
    }, []);

    useEffect(() => {
        fetchQuote();
        
        const now = new Date();
        const next10AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0);
        if (now.getHours() >= 10) {
            next10AM.setDate(next10AM.getDate() + 1);
        }
        
        const timeTo10AM = next10AM.getTime() - now.getTime();
        
        const timeoutId = setTimeout(() => {
            fetchQuote();
            setInterval(fetchQuote, 24 * 60 * 60 * 1000); 
        }, timeTo10AM);

        return () => clearTimeout(timeoutId);
    }, [fetchQuote]);

    const handleLogWeight = (weight: number) => {
        const today = new Date().toISOString().split('T')[0];
        const newEntry = { date: today, weight };
        const existingEntryIndex = weightData.findIndex(d => d.date === today);
        if (existingEntryIndex > -1) {
            const updatedData = [...weightData];
            updatedData[existingEntryIndex] = newEntry;
            setWeightData(updatedData);
        } else {
            setWeightData([...weightData, newEntry]);
        }
    };

    const handleLogMeal = (mealType: MealType, meal: Meal) => {
        setMeals(prevMeals => ({
            ...prevMeals,
            [mealType]: [...prevMeals[mealType], meal],
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header />
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-3">
                         <MotivationAndReminders quote={motivationalQuote} />
                    </div>
                    <div className="lg:col-span-2">
                        <WeightTracker 
                            data={weightData} 
                            onLogWeight={handleLogWeight}
                            initialWeight={initialWeight}
                            targetWeight={targetWeight}
                            setInitialWeight={setInitialWeight}
                            setTargetWeight={setTargetWeight}
                            targetDate={targetDate}
                            setTargetDate={setTargetDate}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <ExerciseTracker />
                    </div>
                    <div className="lg:col-span-3">
                        <MealDashboard meals={meals} onLogMeal={handleLogMeal} />
                    </div>
                </div>
            </main>
            <PwaInstallInstructions />
        </div>
    );
};

export default App;