import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Truck, Target, Lightbulb, User, Megaphone, Loader } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { opportunitiesService } from '../services/opportunitiesService';

const StrategyModal = ({ region, onClose }) => {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStrategy = async () => {
            if (!region) return;
            setIsLoading(true);
            try {
                const data = await opportunitiesService.getStrategyByRegion(region.name);
                setContent(data);
            } catch (error) {
                console.error("Failed to load strategy", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStrategy();
    }, [region]);

    if (!region) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
                style={{
                    width: '90%',
                    maxWidth: '600px',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-accent-primary)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    padding: '0'
                }}
            >
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(59, 130, 246, 0.1)' }}>
                    <div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Estrategia de Entrada: {region.name}</h3>
                        <p className="text-sm text-accent">Plan Táctico Generado por IA</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader className="animate-spin text-accent" size={40} />
                    </div>
                ) : (
                    <div style={{ padding: '2rem' }}>
                        <div className="grid-dashboard" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="text-accent" size={20} />
                                    <h4 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Foco Comercial</h4>
                                </div>
                                <p className="text-sm text-secondary mb-4">{content.focus}</p>

                                <div className="flex items-center gap-2 mb-2">
                                    <Truck className="text-warning" size={20} />
                                    <h4 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Logística</h4>
                                </div>
                                <p className="text-sm text-secondary">{content.logistics}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="text-success" size={20} />
                                    <h4 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Marketing</h4>
                                </div>
                                <p className="text-sm text-secondary mb-4">{content.marketing}</p>

                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="text-blue-400" size={20} />
                                    <h4 className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Acción Clave</h4>
                                </div>
                                <p className="text-sm text-secondary">{content.keyAction}</p>
                            </div>

                        </div>

                        {/* INNOV-2: Personalized Strategy Extensions */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Marketing Mix Chart */}
                            <div className="p-4 rounded-lg border border-slate-700/30" style={{ background: 'var(--color-bg-tertiary)' }}>
                                <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                                    <Megaphone size={18} className="text-purple-500" />
                                    Mix de Canales (IA)
                                </h4>
                                <div className="flex justify-center items-center" style={{ height: '200px', width: '100%' }}>
                                    <PieChart width={250} height={200}>
                                        <Pie
                                            data={content.mix || []}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {(content.mix || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--color-text-primary)' }} />
                                        <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                                    </PieChart>
                                </div>
                            </div>

                            {/* Customer Persona Card */}
                            <div className="p-4 rounded-lg border border-slate-700/30 flex flex-col justify-center" style={{ background: 'var(--color-bg-tertiary)' }}>
                                <h4 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                                    <User size={18} className="text-blue-500" />
                                    Perfil del Cliente (Persona)
                                </h4>
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between border-b border-slate-600/30 pb-2">
                                        <span className="text-sm text-secondary">Rol Típico</span>
                                        <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{content.persona.role}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-rose-400 font-bold uppercase">Dolor (Pain)</span>
                                        <p className="text-sm text-secondary mt-1">{content.persona.pain}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-emerald-400 font-bold uppercase">Beneficio (Gain)</span>
                                        <p className="text-sm text-secondary mt-1">{content.persona.gain}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-accent-primary)' }}>
                            <p className="text-xs text-secondary italic">
                                "Esta estrategia se basa en el análisis de 45 variables locales, incluyendo densidad de competidores y licitaciones públicas recientes."
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: 'transparent', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer' }}>Cerrar</button>
                    <button onClick={() => { alert(`Plan activado para ${region.name}. El equipo de operaciones ha sido notificado.`); onClose(); }} style={{ padding: '0.5rem 1.5rem', background: 'var(--color-accent-primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                        Activar Plan
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default StrategyModal;
