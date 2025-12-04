import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Building, Calendar, DollarSign, ArrowUpRight, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';

// Data for 30 days
const radarData30 = [
    { subject: 'Tecnología', A: 120, B: 110, fullMark: 150 },
    { subject: 'Precio', A: 98, B: 130, fullMark: 150 },
    { subject: 'Servicio', A: 86, B: 130, fullMark: 150 },
    { subject: 'Logística', A: 99, B: 100, fullMark: 150 },
    { subject: 'Marca', A: 85, B: 90, fullMark: 150 },
    { subject: 'Innovación', A: 65, B: 85, fullMark: 150 },
];

// Data for 90 days - Significantly different to show change
const radarData90 = [
    { subject: 'Tecnología', A: 140, B: 100, fullMark: 150 }, // Competitors improved tech
    { subject: 'Precio', A: 110, B: 120, fullMark: 150 },     // Price gap narrowed
    { subject: 'Servicio', A: 100, B: 140, fullMark: 150 },    // We improved service
    { subject: 'Logística', A: 90, B: 110, fullMark: 150 },
    { subject: 'Marca', A: 95, B: 95, fullMark: 150 },
    { subject: 'Innovación', A: 80, B: 70, fullMark: 150 },    // We dropped in innovation
];

const trendData30 = [
    { month: 'Sem 1', Aerotermia: 40, Ventilacion: 24, Gas: 60 },
    { month: 'Sem 2', Aerotermia: 45, Ventilacion: 28, Gas: 55 },
    { month: 'Sem 3', Aerotermia: 55, Ventilacion: 35, Gas: 50 },
    { month: 'Sem 4', Aerotermia: 60, Ventilacion: 40, Gas: 45 },
];

const trendData90 = [
    { month: 'Ene', Aerotermia: 40, Ventilacion: 24, Gas: 60 },
    { month: 'Feb', Aerotermia: 45, Ventilacion: 28, Gas: 55 },
    { month: 'Mar', Aerotermia: 55, Ventilacion: 35, Gas: 50 },
    { month: 'Abr', Aerotermia: 60, Ventilacion: 40, Gas: 45 },
    { month: 'May', Aerotermia: 75, Ventilacion: 45, Gas: 40 },
    { month: 'Jun', Aerotermia: 85, Ventilacion: 55, Gas: 35 },
];

const tenders = [
    {
        id: 1,
        title: 'Renovación Climatización Hospital La Paz',
        location: 'Madrid',
        budget: '€2.5M',
        deadline: '15 días',
        match: 98,
        status: 'Abierto'
    },
    {
        id: 2,
        title: 'Nueva Sede Corporativa TechHub',
        location: 'Barcelona',
        budget: '€850k',
        deadline: '5 días',
        match: 92,
        status: 'Urgente'
    },
    {
        id: 3,
        title: 'Complejo Residencial "Los Olivos"',
        location: 'Valencia',
        budget: '€1.2M',
        deadline: '20 días',
        match: 85,
        status: 'Abierto'
    }
];

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

const MarketIntelligence = () => {
    const [dateRange, setDateRange] = useState('30');

    const handleDateRangeToggle = () => {
        setDateRange(prev => prev === '30' ? '90' : '30');
    };

    const currentRadarData = dateRange === '30' ? radarData30 : radarData90;
    const currentTrendData = dateRange === '30' ? trendData30 : trendData90;

    const handleTenderClick = (title) => {
        alert(`Navegando al detalle del proyecto: ${title}`);
    };

    return (
        <motion.div
            className="flex-col gap-4"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={item} className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 className="text-lg font-bold" style={{ fontSize: '1.5rem' }}>Inteligencia de Mercado</h2>
                    <p className="text-secondary">Análisis competitivo y detección de oportunidades públicas.</p>
                </div>
                <button
                    className="card"
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: dateRange === '90' ? 'var(--color-bg-tertiary)' : 'var(--color-bg-secondary)' }}
                    onClick={handleDateRangeToggle}
                >
                    <Calendar size={16} />
                    <span className="text-sm">Últimos {dateRange} días</span>
                </button>
            </motion.div>

            <div className="grid-dashboard" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {/* Competitive Radar */}
                <motion.div variants={item} className="card">
                    <h3 className="font-bold mb-4">Posicionamiento Competitivo ({dateRange} días)</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentRadarData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="Tu Empresa" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                <Radar name="Competencia Promedio" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                                <Legend />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-secondary mt-4 text-center">
                        {dateRange === '30'
                            ? "Este mes has mejorado en Precio, pero la competencia aprieta en Innovación."
                            : "Tendencia trimestral: La competencia ha mejorado significativamente en Tecnología."}
                    </p>
                </motion.div>

                {/* Market Trends */}
                <motion.div variants={item} className="card">
                    <h3 className="font-bold mb-4">Tendencias Tecnológicas ({dateRange} días)</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={currentTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" label={{ value: 'Índice de Demanda', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                                <Legend />
                                <Line type="monotone" dataKey="Aerotermia" stroke="#10b981" strokeWidth={2} />
                                <Line type="monotone" dataKey="Ventilacion" stroke="#3b82f6" strokeWidth={2} />
                                <Line type="monotone" dataKey="Gas" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-secondary mt-4 text-center">
                        {dateRange === '30'
                            ? "Pico de demanda de Aerotermia en la última semana."
                            : "La demanda de Aerotermia ha superado al Gas por primera vez este trimestre."}
                    </p>
                </motion.div>
            </div>

            {/* Tenders Feed */}
            <motion.div variants={item} className="card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Radar de Licitaciones y Proyectos</h3>
                    <span className="badge badge-blue">3 nuevas hoy</span>
                </div>

                <div className="flex-col gap-4">
                    {tenders.map((tender) => (
                        <div key={tender.id} className="flex justify-between items-center" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-secondary)', marginBottom: '0.5rem' }}>
                            <div className="flex gap-4 items-center">
                                <div style={{ padding: '0.75rem', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                    <Building className="text-secondary" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{tender.title}</h4>
                                    <div className="flex gap-4 text-sm text-secondary mt-1">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {tender.location}</span>
                                        <span className="flex items-center gap-1"><DollarSign size={14} /> {tender.budget}</span>
                                        <span className="flex items-center gap-1" style={{ color: 'var(--color-warning)' }}><AlertTriangle size={14} /> Cierra en {tender.deadline}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-xl font-bold" style={{ color: 'var(--color-success)' }}>{tender.match}%</div>
                                    <div className="text-xs text-secondary">Match</div>
                                </div>
                                <button
                                    style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-accent-primary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                                    onClick={() => handleTenderClick(tender.title)}
                                >
                                    <ArrowUpRight size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MarketIntelligence;
