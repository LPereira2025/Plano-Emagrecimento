
import React, { useState, useEffect, useCallback } from 'react';
import { Dumbbell, PlusCircle, Loader2 } from 'lucide-react';
import { getExerciseSuggestions } from '../services/geminiService';
import { EXERCISES as fallbackExercises } from '../constants';

interface Exercise {
    name: string;
    description: string;
}

export const ExerciseTracker: React.FC = () => {
    const [loggedExercises, setLoggedExercises] = useState<string[]>(() => {
        const saved = localStorage.getItem('loggedExercises');
        return saved ? JSON.parse(saved) : [];
    });
    const [newExercise, setNewExercise] = useState('');
    const [suggestedExercises, setSuggestedExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSuggestions = useCallback(async () => {
        setIsLoading(true);
        try {
            const suggestions = await getExerciseSuggestions();
            setSuggestedExercises(suggestions.map((s: any) => ({ name: s.name, description: s.description })));
        } catch (error) {
            console.error("Failed to fetch exercise suggestions, using fallback:", error);
            setSuggestedExercises(fallbackExercises.slice(0, 3));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuggestions();
    }, [fetchSuggestions]);

    useEffect(() => {
        localStorage.setItem('loggedExercises', JSON.stringify(loggedExercises));
    }, [loggedExercises]);

    const handleLogExercise = () => {
        if (newExercise.trim()) {
            setLoggedExercises(prev => [...prev, newExercise.trim()]);
            setNewExercise('');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Dumbbell className="mr-3 h-6 w-6 text-indigo-600" />Exercício Físico</h2>
            
            <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Sugestões do Dia</h3>
                {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {suggestedExercises.map((ex, i) => (
                            <div key={i} className="p-3 bg-indigo-50 rounded-lg">
                                <p className="font-semibold text-indigo-800">{ex.name}</p>
                                <p className="text-sm text-indigo-700">{ex.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-4 flex-grow">
                <h3 className="font-semibold text-gray-700 mb-2">Exercícios Registados</h3>
                {loggedExercises.length > 0 ? (
                    <ul className="space-y-2 list-disc list-inside text-gray-600">
                        {loggedExercises.map((ex, i) => <li key={i}>{ex}</li>)}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">Nenhum exercício registado hoje.</p>
                )}
            </div>

            <div className="mt-auto flex items-center gap-2">
                <input
                    type="text"
                    value={newExercise}
                    onChange={(e) => setNewExercise(e.target.value)}
                    placeholder="Registar outro exercício..."
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    onClick={handleLogExercise}
                    className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
                >
                    <PlusCircle className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};
