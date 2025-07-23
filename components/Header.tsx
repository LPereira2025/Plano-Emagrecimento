
import React from 'react';
import { Apple } from 'lucide-react';

export const Header: React.FC = () => (
    <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center">
                <Apple className="h-8 w-8 text-green-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-800">Meu Plano de Emagrecimento</h1>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-600">Nutricionista</p>
                <p className="font-semibold text-green-700">Sandra Rosmaninho Almeida</p>
            </div>
        </div>
    </header>
);
