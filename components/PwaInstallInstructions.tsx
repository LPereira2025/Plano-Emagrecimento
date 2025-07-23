
import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export const PwaInstallInstructions: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

        // Mostra o banner apenas se for iOS e não estiver já no modo de app standalone
        if (isIOS() && !isInStandaloneMode()) {
            // Atraso para não ser demasiado intrusivo no carregamento
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 animate-fade-in-up">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-800"
                aria-label="Fechar instruções de instalação"
            >
                <X size={20} />
            </button>
            <div className="flex flex-col gap-3">
                <p className="font-bold text-center text-gray-800">Instale a App no seu iPhone</p>
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                         <Share className="h-6 w-6 text-green-700" />
                    </div>
                    <p className="text-gray-700 text-sm">1. Toque no botão <strong>Partilhar</strong> na barra de ferramentas do Safari.</p>
                </div>
                 <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                        <PlusSquare className="h-6 w-6 text-green-700" />
                    </div>
                    <p className="text-gray-700 text-sm">2. Deslize para cima e selecione <strong>Adicionar ao ecrã principal</strong>.</p>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
