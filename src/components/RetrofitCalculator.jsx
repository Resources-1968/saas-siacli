import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Zap, DollarSign, Leaf, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const RetrofitCalculator = () => {
    const [inputs, setInputs] = useState({
        currentBill: 1200, // Monthly bill in Euros
        systemAge: 15, // Years
        facilitySize: 500, // m2
        energyType: 'gas', // gas, electric, oil
        proposedInvestment: 25000
    });

    const [results, setResults] = useState(null);

    useEffect(() => {
        calculateROI();
    }, [inputs]);

    const calculateROI = () => {
        // Simulation Logic
        // Older systems are less efficient. Efficiency loss ~1% per year of age.
        const efficiencyFactor = Math.max(0.5, 1 - (inputs.systemAge * 0.015));

        // Base energy cost per year
        const annualCost = inputs.currentBill * 12;

        // New system efficiency (Heat Pump) is typically 300-400% efficient (COP 3-4), 
        // compared to old gas boiler (80-90%) or old electric (100%).
        // Simplified savings calculation:
        let savingsPercentage = 0.40; // Default 40% savings
        if (inputs.energyType === 'gas') savingsPercentage = 0.45;
        if (inputs.energyType === 'oil') savingsPercentage = 0.60;
        if (inputs.energyType === 'electric') savingsPercentage = 0.50;

        // Adjust by system age (older = more savings potential)
        savingsPercentage += (inputs.systemAge / 100);

        const annualSavings = annualCost * savingsPercentage;
        const paybackYears = inputs.proposedInvestment / annualSavings;
        const roi10Years = ((annualSavings * 10) - inputs.proposedInvestment) / inputs.proposedInvestment * 100;
        const co2Saved = (annualSavings / 0.25) * 0.0002; // Rough estimate: 0.25€/kWh, 0.2kg CO2/kWh

        // Generate Chart Data (10 Year Projection)
        const chartData = [];
        let cumulativeSavings = -inputs.proposedInvestment;
        for (let i = 0; i <= 10; i++) {
            chartData.push({
                year: `Año ${i}`,
                balance: Math.round(cumulativeSavings),
                breakEven: 0
            });
            cumulativeSavings += annualSavings;
        }

        setResults({
            annualSavings: Math.round(annualSavings),
            paybackYears: paybackYears.toFixed(1),
            roi10Years: Math.round(roi10Years),
            co2Saved: co2Saved.toFixed(1),
            chartData
        });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="flex-col gap-6"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="text-accent" />
                        Retrofit Inteligente (IA)
                    </h2>
                    <p className="text-secondary">Evaluación de viabilidad y rentabilidad para renovación de equipos.</p>
                </div>
            </div>

            <div className="grid-dashboard" style={{ gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>

                {/* Input Panel */}
                <motion.div variants={item} className="card h-fit" style={{ background: 'var(--color-bg-secondary)' }}>
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Calculator size={18} />
                        Parámetros de la Instalación
                    </h3>

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm text-secondary mb-1 block">Factura Mensual Promedio (€)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range" min="100" max="5000" step="50"
                                    value={inputs.currentBill}
                                    onChange={(e) => setInputs({ ...inputs, currentBill: Number(e.target.value) })}
                                    className="flex-1 accent-blue-500"
                                />
                                <span className="font-mono font-bold w-16 text-right">{inputs.currentBill}€</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-secondary mb-1 block">Antigüedad del Sistema (Años)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range" min="0" max="30" step="1"
                                    value={inputs.systemAge}
                                    onChange={(e) => setInputs({ ...inputs, systemAge: Number(e.target.value) })}
                                    className="flex-1 accent-amber-500"
                                />
                                <span className="font-mono font-bold w-16 text-right">{inputs.systemAge} a</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-secondary mb-1 block">Inversión Propuesta (€)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range" min="1000" max="100000" step="1000"
                                    value={inputs.proposedInvestment}
                                    onChange={(e) => setInputs({ ...inputs, proposedInvestment: Number(e.target.value) })}
                                    className="flex-1 accent-emerald-500"
                                />
                                <span className="font-mono font-bold w-16 text-right">{(inputs.proposedInvestment / 1000).toFixed(1)}k</span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-secondary mb-2 block">Fuente de Energía Actual</label>
                            <div className="flex gap-2">
                                {['gas', 'electric', 'oil'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setInputs({ ...inputs, energyType: type })}
                                        className={`flex-1 py-2 rounded text-sm font-bold capitalize transition-colors ${inputs.energyType === type ? 'bg-accent text-white' : 'text-secondary hover:text-primary'}`}
                                        style={{ background: inputs.energyType === type ? 'var(--color-accent-primary)' : 'var(--color-bg-tertiary)' }}
                                    >
                                        {type === 'gas' ? 'Gas' : type === 'electric' ? 'Elec.' : 'Gasoil'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 rounded-lg border" style={{ background: 'var(--color-bg-tertiary)', borderColor: 'var(--border-color)' }}>
                        <h4 className="text-xs font-bold text-secondary mb-2 uppercase">Diagnóstico Preliminar</h4>
                        <div className="flex items-start gap-2">
                            {inputs.systemAge > 10 ? <AlertCircle className="text-warning shrink-0" size={16} /> : <CheckCircle className="text-success shrink-0" size={16} />}
                            <p className="text-xs text-secondary">
                                {inputs.systemAge > 10
                                    ? `Sistema obsoleto (${inputs.systemAge} años). Pérdida de eficiencia estimada del ${(inputs.systemAge * 1.5).toFixed(0)}%. Alto potencial de ahorro.`
                                    : "Sistema relativamente moderno. El ahorro dependerá del cambio de combustible."}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Results Panel */}
                <div className="flex flex-col gap-4">
                    {/* KPI Cards */}
                    <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card p-4 flex flex-col items-center justify-center text-center" style={{ background: 'var(--color-bg-secondary)' }}>
                            <DollarSign className="text-emerald-600 mb-2" />
                            <span className="text-xs text-secondary">Ahorro Anual</span>
                            <span className="text-xl font-bold text-emerald-600">€{results?.annualSavings.toLocaleString()}</span>
                        </div>
                        <div className="card p-4 flex flex-col items-center justify-center text-center" style={{ background: 'var(--color-bg-secondary)' }}>
                            <TrendingUp className="text-blue-500 mb-2" />
                            <span className="text-xs text-secondary">Retorno (Payback)</span>
                            <span className={`text-xl font-bold ${Number(results?.paybackYears) < 3 ? 'text-emerald-600' : Number(results?.paybackYears) < 6 ? 'text-amber-500' : 'text-rose-500'}`}>
                                {results?.paybackYears} años
                            </span>
                        </div>
                        <div className="card p-4 flex flex-col items-center justify-center text-center" style={{ background: 'var(--color-bg-secondary)' }}>
                            <Zap className="text-amber-500 mb-2" />
                            <span className="text-xs text-secondary">ROI (10 años)</span>
                            <span className="text-xl font-bold text-amber-500">{results?.roi10Years}%</span>
                        </div>
                        <div className="card p-4 flex flex-col items-center justify-center text-center" style={{ background: 'var(--color-bg-secondary)' }}>
                            <Leaf className="text-emerald-600 mb-2" />
                            <span className="text-xs text-secondary">CO2 Evitado/año</span>
                            <span className="text-xl font-bold text-emerald-600">{results?.co2Saved} t</span>
                        </div>
                    </motion.div>

                    {/* Chart */}
                    <motion.div variants={item} className="card flex-1 min-h-[300px]" style={{ background: 'var(--color-bg-secondary)' }}>
                        <h3 className="font-bold mb-4">Proyección de Flujo de Caja Acumulado</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={results?.chartData}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis dataKey="year" stroke="var(--color-text-secondary)" fontSize={12} />
                                <YAxis stroke="var(--color-text-secondary)" fontSize={12} tickFormatter={(val) => `€${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--color-text-primary)' }}
                                    formatter={(val) => [`€${val.toLocaleString()}`, 'Balance Acumulado']}
                                />
                                <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                                {/* Zero Line */}
                                <Area type="monotone" dataKey="breakEven" stroke="#94a3b8" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* AI Recommendation */}
                    <motion.div variants={item} className="card p-4 border-l-4 border-l-accent" style={{ background: 'var(--color-bg-tertiary)' }}>
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            <Zap size={16} className="text-accent" />
                            Recomendación del Sistema
                        </h4>
                        <p className="text-sm text-secondary">
                            {Number(results?.paybackYears) < 4
                                ? "PROYECTO ALTAMENTE VIABLE. El periodo de retorno es inferior a 4 años, lo que lo convierte en una inversión prioritaria. Se recomienda proceder con la propuesta técnica inmediata."
                                : Number(results?.paybackYears) < 7
                                    ? "VIABILIDAD MEDIA. El proyecto es rentable a medio plazo. Se sugiere buscar subvenciones locales para eficiencia energética que puedan reducir el Payback por debajo de 5 años."
                                    : "VIABILIDAD BAJA. El retorno es lento. Considere opciones de menor inversión o espere a un incremento en los costes de energía para reevaluar."}
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default RetrofitCalculator;
