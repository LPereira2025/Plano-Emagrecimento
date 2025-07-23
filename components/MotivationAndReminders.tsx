
import React, { useState, useEffect } from 'react';
import { Droplets, Footprints, Sparkles } from 'lucide-react';

interface MotivationAndRemindersProps {
    quote: string;
}

export const MotivationAndReminders: React.FC<MotivationAndRemindersProps> = ({ quote }) => {
    const [showReminder, setShowReminder] = useState(false);

    useEffect(() => {
        const reminderInterval = setInterval(() => {
            setShowReminder(true);
            setTimeout(() => setShowReminder(false), 3 * 60 * 1000); // Show for 3 minutes
        }, 60 * 60 * 1000); // Every hour

        return () => clearInterval(reminderInterval);
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 text-yellow-500">
                    <Sparkles className="h-10 w-10" />
                </div>
                <div className="flex-grow text-center md:text-left">
                    <h2 className="text-lg font-semibold text-gray-700">Frase do Dia</h2>
                    <p className="text-gray-600 italic">"{quote || 'Carregando frase...'}"</p>
                </div>
            </div>
            {showReminder && (
                <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded-lg animate-pulse flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5" />
                        <span>Lembrete: Beba água!</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Footprints className="h-5 w-5" />
                        <span>Caminhe por 5 minutos!</span>
                    </div>
                </div>
            )}
        </div>
    );
};
