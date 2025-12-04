import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Crosshair, Calculator, TrendingUp, DollarSign, Target, ArrowRight } from 'lucide-react';

const regionsData = [
    { id: 1, name: 'Madrid', market: 90, competition: 80, logistics: 95, growth: 85, cost: 70 },
    { id: 2, name: 'Cataluña', market: 85, competition: 90, logistics: 90, growth: 75, cost: 75 },
    { id: 3, name: 'Andalucía', market: 70, competition: 60, logistics: 75, growth: 90, cost: 60 },
    { id: 4, name: 'Com. Valenciana', market: 75, competition: 70, logistics: 85, growth: 80, cost: 65 },
    { id: 5, name: 'País Vasco', market: 80, competition: 75, logistics: 80, growth: 70, cost: 85 },
];

const StrategicAnalysis = () => {
    const [selectedRegions, setSelectedRegions] = useState([regionsData[0], regionsData[1]]);
    const [roiInputs, setRoiInputs] = useState({
        investment: 50000,
        margin: 25,
        monthlySales: 15000
    });

    const toggleRegion = (region) => {
        if (selectedRegions.find(r => r.id === region.id)) {
            if (selectedRegions.length > 1) {
                setSelectedRegions(selectedRegions.filter(r => r.id !== region.id));
            }
        } else {
            if (selectedRegions.length < 3) {
                setSelectedRegions([...selectedRegions, region]);
            } else {
                alert("Máximo 3 regiones para comparar.");
            }
        }
    };

    const calculateROI = () => {
        const monthlyProfit = roiInputs.monthlySales * (roiInputs.margin / 100);
        const monthsToBreakEven = roiInputs.investment / monthlyProfit;
        const annualROI = ((monthlyProfit * 12 - roiInputs.investment) / roiInputs.investment) * 100;
        return { monthsToBreakEven, annualROI, monthlyProfit };
    };

    const roiResults = calculateROI();

    const radarData = [
        { subject: 'Mercado', A: selectedRegions[0]?.market || 0, B: selectedRegions[1]?.market || 0, C: selectedRegions[2]?.market || 0, fullMark: 100 },
        { subject: 'Competencia', A: selectedRegions[0]?.competition || 0, B: selectedRegions[1]?.competition || 0, C: selectedRegions[2]?.competition || 0, fullMark: 100 },
        { subject: 'Logística', A: selectedRegions[0]?.logistics || 0, B: selectedRegions[1]?.logistics || 0, C: selectedRegions[2]?.logistics || 0, fullMark: 100 },
        { subject: 'Crecimiento', A: selectedRegions[0]?.growth || 0, B: selectedRegions[1]?.growth || 0, C: selectedRegions[2]?.growth || 0, fullMark: 100 },
        { subject: 'Coste Op.', A: selectedRegions[0]?.cost || 0, B: selectedRegions[1]?.cost || 0, C: selectedRegions[2]?.cost || 0, fullMark: 100 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-col gap-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Análisis Estratégico Avanzado</h2>
                    <p className="text-secondary">Herramientas de decisión y comparación financiera.</p>
                </div>
            </div>

            <div className="grid-dashboard" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>

                {/* Region Comparator Section */}
                <div className="card flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Crosshair className="text-accent" size={24} />
                        <h3 className="text-lg font-bold">Comparador "Head-to-Head"</h3>
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap">
                        {regionsData.map(region => (
                            <button
                                key={region.id}
                                onClick={() => toggleRegion(region)}
                                className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedRegions.find(r => r.id === region.id)
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-slate-800 border-slate-700 text-secondary hover:bg-slate-700'
                                    }`}
                            >
                                {region.name}
                            </button>
                        ))}
                    </div>

                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                                {selectedRegions[0] && (
                                    <Radar name={selectedRegions[0].name} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                )}
                                {selectedRegions[1] && (
                                    <Radar name={selectedRegions[1].name} dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                )}
                                {selectedRegions[2] && (
                                    <Radar name={selectedRegions[2].name} dataKey="C" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                                )}
                                <Legend />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                            <Target size={16} className="text-accent" />
                            Insight Comparativo
                        </h4>
                        <p className="text-sm text-secondary">
                            {selectedRegions[0] && selectedRegions[1] ? (
                                <>
                                    <span className="text-white font-bold">{selectedRegions[0].name}</span> destaca en
                                    <span className="text-blue-400"> {Object.keys(selectedRegions[0]).reduce((a, b) => selectedRegions[0][a] > selectedRegions[0][b] && typeof selectedRegions[0][a] === 'number' ? a : b)}</span>,
                                    mientras que <span className="text-white font-bold">{selectedRegions[1].name}</span> es superior en
                                    <span className="text-emerald-400"> {Object.keys(selectedRegions[1]).reduce((a, b) => selectedRegions[1][a] > selectedRegions[1][b] && typeof selectedRegions[1][a] === 'number' ? a : b)}</span>.
                                </>
                            ) : "Selecciona al menos dos regiones para ver insights."}
                        </p>
                    </div>
                </div>

                {/* ROI Calculator Section */}
                <div className="card flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Calculator className="text-success" size={24} />
                        <h3 className="text-lg font-bold">Calculadora de ROI</h3>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs text-secondary mb-1 block">Inversión Inicial (€)</label>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-3 top-3 text-secondary" />
                                <input
                                    type="number"
                                    value={roiInputs.investment}
                                    onChange={(e) => setRoiInputs({ ...roiInputs, investment: Number(e.target.value) })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 pl-8 text-white focus:border-accent outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-secondary mb-1 block">Ventas Mensuales Est. (€)</label>
                                <input
                                    type="number"
                                    value={roiInputs.monthlySales}
                                    onChange={(e) => setRoiInputs({ ...roiInputs, monthlySales: Number(e.target.value) })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-secondary mb-1 block">Margen Neto (%)</label>
                                <input
                                    type="number"
                                    value={roiInputs.margin}
                                    onChange={(e) => setRoiInputs({ ...roiInputs, margin: Number(e.target.value) })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-accent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                            <span className="text-sm text-secondary">Beneficio Mensual</span>
                            <span className="font-bold text-lg text-white">€{roiResults.monthlyProfit.toLocaleString()}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-2 bg-slate-800/50 rounded">
                                <div className="text-xs text-secondary mb-1">Break-even</div>
                                <div className="text-xl font-bold text-warning">{roiResults.monthsToBreakEven.toFixed(1)} <span className="text-xs font-normal text-secondary">meses</span></div>
                            </div>
                            <div className="text-center p-2 bg-slate-800/50 rounded">
                                <div className="text-xs text-secondary mb-1">ROI Anual</div>
                                <div className={`text-xl font-bold ${roiResults.annualROI > 0 ? 'text-success' : 'text-danger'}`}>
                                    {roiResults.annualROI.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-secondary mt-2">
                        <TrendingUp size={14} />
                        <span>Basado en proyecciones lineales simples.</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default StrategicAnalysis;
