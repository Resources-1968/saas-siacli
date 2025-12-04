import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, ShieldAlert, TrendingDown, TrendingUp, Target, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const competitors = [
    { name: 'Boreas', marketShare: 35, strength: 'Precio', weakness: 'Logística', threatLevel: 'high' },
    { name: 'Ecodense', marketShare: 20, strength: 'Tecnología', weakness: 'Precio', threatLevel: 'medium' },
    { name: 'Local Players', marketShare: 15, strength: 'Relación', weakness: 'Escala', threatLevel: 'low' },
    { name: 'SIACLI (Nosotros)', marketShare: 30, strength: 'Calidad', weakness: 'Cobertura', threatLevel: 'none' },
];

const marketShareData = [
    { name: 'Boreas', value: 35, color: '#ef4444' },
    { name: 'SIACLI', value: 30, color: '#3b82f6' },
    { name: 'Ecodense', value: 20, color: '#f59e0b' },
    { name: 'Otros', value: 15, color: '#94a3b8' },
];

const priceComparisonData = [
    { region: 'Madrid', SIACLI: 1200, Boreas: 1100, Ecodense: 1350 },
    { region: 'Cataluña', SIACLI: 1250, Boreas: 1150, Ecodense: 1400 },
    { region: 'Andalucía', SIACLI: 1180, Boreas: 1050, Ecodense: 1300 },
];

const CompetitiveIntelligence = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-col gap-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Inteligencia Competitiva</h2>
                    <p className="text-secondary">Análisis de rivales y posicionamiento de mercado.</p>
                </div>
            </div>

            <div className="grid-dashboard" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                {/* Market Share Donut */}
                <div className="card flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe size={20} className="text-blue-400" />
                        <h3 className="text-lg font-bold">Cuota de Mercado Global</h3>
                    </div>
                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={marketShareData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {marketShareData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-2xl font-bold text-white">30%</div>
                            <div className="text-xs text-secondary">Nuestra Cuota</div>
                        </div>
                    </div>
                </div>

                {/* Competitor Radar List */}
                <div className="card flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Swords size={20} className="text-rose-500" />
                        <h3 className="text-lg font-bold">Radar de Amenazas</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                        {competitors.filter(c => c.name !== 'SIACLI (Nosotros)').map((comp, index) => (
                            <div key={index} className="p-3 bg-slate-800/50 rounded border border-slate-700 flex justify-between items-center">
                                <div>
                                    <div className="font-bold flex items-center gap-2">
                                        {comp.name}
                                        {comp.threatLevel === 'high' && <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] rounded uppercase">Alta</span>}
                                        {comp.threatLevel === 'medium' && <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded uppercase">Media</span>}
                                    </div>
                                    <div className="text-xs text-secondary mt-1">
                                        Fuerte en: <span className="text-emerald-400">{comp.strength}</span> • Débil en: <span className="text-rose-400">{comp.weakness}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-lg">{comp.marketShare}%</div>
                                    <div className="text-[10px] text-secondary">Cuota</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Comparison Chart */}
                <div className="card flex-col gap-4" style={{ gridColumn: 'span 2' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Target size={20} className="text-emerald-400" />
                        <h3 className="text-lg font-bold">Comparativa de Precios Medios (Heat Pumps)</h3>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priceComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="region" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `€${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    formatter={(value) => [`€${value}`, 'Precio Medio']}
                                />
                                <Legend />
                                <Bar dataKey="SIACLI" fill="#3b82f6" name="SIACLI" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Boreas" fill="#ef4444" name="Boreas" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Ecodense" fill="#f59e0b" name="Ecodense" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm text-blue-200 flex items-start gap-2">
                        <TrendingUp size={16} className="mt-0.5 shrink-0" />
                        <p>
                            <strong>Insight de Precios:</strong> SIACLI mantiene un precio medio un 10-15% superior a Boreas, justificable por la calidad.
                            Sin embargo, en <strong>Andalucía</strong> la brecha es mayor, lo que podría explicar la pérdida de cuota reciente.
                        </p>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default CompetitiveIntelligence;
