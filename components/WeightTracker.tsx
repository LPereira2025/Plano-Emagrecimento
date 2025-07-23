
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { WeightEntry } from '../types';
import { TrendingUp, Target, Weight, Edit } from 'lucide-react';

interface WeightTrackerProps {
    data: WeightEntry[];
    onLogWeight: (weight: number) => void;
    initialWeight: number;
    targetWeight: number;
    setInitialWeight: (weight: number) => void;
    setTargetWeight: (weight: number) => void;
    targetDate: string;
    setTargetDate: (date: string) => void;
}

export const WeightTracker: React.FC<WeightTrackerProps> = ({ data, onLogWeight, initialWeight, targetWeight, setInitialWeight, setTargetWeight, targetDate, setTargetDate }) => {
    const [newWeight, setNewWeight] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const sortedData = useMemo(() => [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [data]);
    const currentWeight = sortedData.length > 0 ? sortedData[sortedData.length - 1].weight : initialWeight;
    const totalLoss = initialWeight - currentWeight;
    const toGoal = currentWeight - targetWeight;

    const weeklyChange = useMemo(() => {
        if (sortedData.length < 2) return null;
        const today = new Date();
        const lastWeekEntry = sortedData.find(d => {
            const entryDate = new Date(d.date);
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            return entryDate >= sevenDaysAgo && entryDate <= today;
        });

        if (!lastWeekEntry || lastWeekEntry.weight === currentWeight) return null;
        
        const change = currentWeight - lastWeekEntry.weight;
        return change;
    }, [sortedData, currentWeight]);

    const handleLog = () => {
        const weight = parseFloat(newWeight);
        if (!isNaN(weight) && weight > 20) {
            onLogWeight(weight);
            setNewWeight('');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Evolução do Peso</h2>
                 <button onClick={() => setIsEditing(!isEditing)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Edit className="h-5 w-5 text-gray-500" />
                </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">Peso Inicial</p>
                    {isEditing ? <input type="number" value={initialWeight} onChange={(e) => setInitialWeight(parseFloat(e.target.value))} className="w-full text-center bg-transparent font-bold text-xl text-blue-900"/> : <p className="font-bold text-xl text-blue-900">{initialWeight.toFixed(1)} kg</p>}
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">Peso Atual</p>
                    <p className="font-bold text-xl text-green-900">{currentWeight.toFixed(1)} kg</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-red-800">Perda Total</p>
                    <p className="font-bold text-xl text-red-900">{totalLoss.toFixed(1)} kg</p>
                </div>
                 <div className="bg-purple-50 p-3 rounded-lg flex flex-col justify-between">
                    <div>
                        <p className="text-sm text-purple-800">Objetivo</p>
                        {isEditing ? 
                            <input type="number" value={targetWeight} onChange={(e) => setTargetWeight(parseFloat(e.target.value))} className="w-full text-center bg-transparent font-bold text-xl text-purple-900"/> 
                            : <p className="font-bold text-xl text-purple-900">{targetWeight.toFixed(1)} kg</p>
                        }
                    </div>
                    <div className="mt-1">
                        {isEditing ?
                            <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full text-center bg-transparent font-semibold text-sm text-purple-900 p-0 border-0" />
                            : <p className="font-semibold text-sm text-purple-800">{new Date(targetDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                         }
                    </div>
                </div>
            </div>

            {weeklyChange !== null && (
                <div className={`p-3 rounded-lg mb-4 text-center ${weeklyChange <= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Variação Semanal: <span className="font-bold">{weeklyChange.toFixed(1)} kg</span>
                </div>
            )}
            
            <div className="flex-grow h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sortedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} tick={{ fontSize: 12 }} />
                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} name="Peso (kg)" dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-auto flex items-center gap-2">
                <Weight className="h-5 w-5 text-gray-400" />
                <input 
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Registar peso de hoje (kg)"
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button 
                    onClick={handleLog}
                    className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                    Registar
                </button>
            </div>
        </div>
    );
};
