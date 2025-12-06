import React from 'react';
import { Sparkles } from 'lucide-react';

const AIBadge = ({ text = 'Generado por IA', tooltip = 'Este contenido fue generado con inteligencia artificial' }) => {
    return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg">
            <Sparkles size={14} className="text-purple-400 animate-pulse" />
            <span className="text-xs font-medium text-purple-300" title={tooltip}>
                {text}
            </span>
        </div>
    );
};

export default AIBadge;
