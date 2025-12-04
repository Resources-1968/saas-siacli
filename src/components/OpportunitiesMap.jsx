import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, TrendingUp, Users, Building2, ArrowRight, Settings, Sliders, RefreshCw, BarChart2, BrainCircuit, Loader } from 'lucide-react';
import StrategyModal from './StrategyModal';
import { opportunitiesService } from '../services/opportunitiesService';

const initialRegions = [
    {
        id: 1,
        name: 'Comunidad de Madrid',
        potential: '€1.2M',
        sectors: ['Oficinas', 'Hospitalidad'],
        status: 'Prioridad Alta',
        description: 'Alta demanda de sistemas de climatización eficiente en nuevos desarrollos de oficinas en la zona norte.',
        cities: 'Madrid, Alcobendas, Las Rozas',
        factors: {
            market: 95,
            construction: 90,
            industry: 60,
            competition: 80,
            logistics: 95
        }
    },
    {
        id: 2,
        name: 'Cataluña',
        potential: '€950k',
        sectors: ['Industrial', 'Farmacéutico'],
        status: 'Prioridad Alta',
        description: 'Oportunidad en renovación de sistemas de ventilación industrial para cumplimiento de nuevas normativas.',
        cities: 'Barcelona, Tarragona, Granollers',
        factors: {
            market: 90,
            construction: 75,
            industry: 95,
            competition: 85,
            logistics: 90
        }
    },
    {
        id: 3,
        name: 'País Vasco',
        potential: '€450k',
        sectors: ['Industrial', 'Naval'],
        status: 'En Evaluación',
        description: 'Interés creciente en microcogeneración para plantas industriales medianas.',
        cities: 'Bilbao, Vitoria-Gasteiz',
        factors: {
            market: 70,
            construction: 60,
            industry: 90,
            competition: 60,
            logistics: 80
        }
    },
    {
        id: 4,
        name: 'Andalucía',
        potential: '€600k',
        sectors: ['Turismo', 'Residencial'],
        status: 'En Evaluación',
        description: 'Fuerte demanda estacional. Oportunidad para bombas de calor aerotérmicas en sector hotelero.',
        cities: 'Málaga, Sevilla, Marbella',
        factors: {
            market: 80,
            construction: 85,
            industry: 50,
            competition: 70,
            logistics: 75
        }
    },
    {
        id: 5,
        name: 'Comunidad Valenciana',
        potential: '€800k',
        sectors: ['Turismo', 'Industria'],
        status: 'Prioridad Media',
        description: 'Excelente infraestructura logística (Puerto de Valencia). Oportunidades en sector cerámico y turístico.',
        cities: 'Valencia, Alicante, Castellón',
        factors: {
            market: 85,
            construction: 80,
            industry: 85,
            competition: 75,
            logistics: 95
        }
    },
    {
        id: 6,
        name: 'Galicia',
        potential: '€500k',
        sectors: ['Textil', 'Alimentación'],
        status: 'En Evaluación',
        description: 'Sector textil potente y creciente industria alimentaria. Demanda de climatización industrial específica.',
        cities: 'A Coruña, Vigo, Santiago',
        factors: {
            market: 70,
            construction: 65,
            industry: 80,
            competition: 60,
            logistics: 75
        }
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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
};

const OpportunitiesMap = () => {
    const [weights, setWeights] = useState({
        market: 30,
        construction: 20,
        industry: 20,
        competition: 15,
        logistics: 15
    });

    const [simulationTrends, setSimulationTrends] = useState({
        market: 0,
        construction: 0,
        industry: 0,
        competition: 0,
        logistics: 0
    });

    const [regions, setRegions] = useState([]);
    const [initialRegions, setInitialRegions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfig, setShowConfig] = useState(false);
    const [showSimulation, setShowSimulation] = useState(false);
    const [showClusters, setShowClusters] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedRegionForStrategy, setSelectedRegionForStrategy] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [aiResponse, setAiResponse] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const loadOpportunities = async () => {
            setIsLoading(true);
            try {
                const data = await opportunitiesService.getOpportunities();
                // Enrich data with factors for simulation (mocking factors as they weren't in the service initially)
                const enrichedData = data.map(r => ({
                    ...r,
                    factors: {
                        market: Math.floor(Math.random() * 30) + 70,
                        construction: Math.floor(Math.random() * 40) + 60,
                        industry: Math.floor(Math.random() * 50) + 50,
                        competition: Math.floor(Math.random() * 40) + 50,
                        logistics: Math.floor(Math.random() * 30) + 70
                    },
                    status: r.potential === 'Alto' || r.potential === 'Muy Alto' ? 'Prioridad Alta' : 'En Evaluación',
                    sectors: ['General'], // Default
                    cities: 'Capital y Área Metro' // Default
                }));
                setInitialRegions(enrichedData);
                setRegions(enrichedData);
            } catch (error) {
                console.error("Failed to load opportunities", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadOpportunities();
    }, []);

    useEffect(() => {
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

        const updatedRegions = initialRegions.map(region => {
            const score = (
                (region.factors.market * weights.market) +
                (region.factors.construction * weights.construction) +
                (region.factors.industry * weights.industry) +
                ((100 - region.factors.competition) * weights.competition) +
                (region.factors.logistics * weights.logistics)
            ) / totalWeight;

            // Calculate Projected Score based on simulation trends
            // Helper to clamp values between 0 and 100
            const clamp = (val) => Math.min(100, Math.max(0, val));

            const projectedScore = (
                (clamp(region.factors.market * (1 + simulationTrends.market / 100)) * weights.market) +
                (clamp(region.factors.construction * (1 + simulationTrends.construction / 100)) * weights.construction) +
                (clamp(region.factors.industry * (1 + simulationTrends.industry / 100)) * weights.industry) +
                ((100 - clamp(region.factors.competition * (1 + simulationTrends.competition / 100))) * weights.competition) +
                (clamp(region.factors.logistics * (1 + simulationTrends.logistics / 100)) * weights.logistics)
            ) / totalWeight;

            return {
                ...region,
                score: Math.round(score),
                projectedScore: Math.round(Math.min(100, Math.max(0, projectedScore)))
            };
        });

        updatedRegions.sort((a, b) => b.score - a.score);
        setRegions(updatedRegions);
    }, [weights, simulationTrends]);

    const handleAISearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setAiResponse(null);

        // Simulate AI processing
        setTimeout(() => {
            const query = searchQuery.toLowerCase();
            let filtered = [...initialRegions];
            let response = "";

            if (query.includes('competencia baja') || query.includes('poca competencia')) {
                filtered = filtered.filter(r => r.factors.competition < 75);
                response = "He filtrado las regiones donde la competencia es baja (< 75). ";
            } else if (query.includes('logística') || query.includes('logistica')) {
                filtered.sort((a, b) => b.factors.logistics - a.factors.logistics);
                response = "He ordenado las regiones priorizando aquellas con mejor infraestructura logística. ";
            } else if (query.includes('madrid')) {
                filtered = filtered.filter(r => r.name.toLowerCase().includes('madrid'));
                response = "Mostrando resultados específicos para la Comunidad de Madrid. ";
            } else if (query.includes('industrial')) {
                filtered = filtered.filter(r => r.sectors.includes('Industrial'));
                response = "He seleccionado regiones con fuerte presencia del sector Industrial. ";
            } else {
                response = "He analizado tu consulta y ordenado las regiones por potencial general. ";
            }

            // Re-calculate scores for the filtered list (using current weights)
            const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
            const processedRegions = filtered.map(region => {
                const score = (
                    (region.factors.market * weights.market) +
                    (region.factors.construction * weights.construction) +
                    (region.factors.industry * weights.industry) +
                    ((100 - region.factors.competition) * weights.competition) +
                    (region.factors.logistics * weights.logistics)
                ) / totalWeight;
                return { ...region, score: Math.round(score), projectedScore: Math.round(score) }; // Simplified for search result
            });

            if (!query.includes('logística') && !query.includes('logistica')) {
                processedRegions.sort((a, b) => b.score - a.score);
            }

            setRegions(processedRegions);
            setAiResponse(response + "Aquí tienes los mejores resultados.");
            setIsSearching(false);
        }, 1000);
    };

    const handleWeightChange = (factor, value) => {
        setWeights(prev => ({ ...prev, [factor]: parseInt(value) }));
    };

    const handleTrendChange = (factor, value) => {
        setSimulationTrends(prev => ({ ...prev, [factor]: parseInt(value) }));
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            setRegions(initialRegions); // Reset to initial on refresh
            setSearchQuery('');
            setAiResponse(null);
        }, 1000);
    };

    const handleStrategyClick = (region) => {
        setSelectedRegionForStrategy(region);
    };

    const getFactorColor = (factor) => {
        switch (factor) {
            case 'market': return '#3b82f6';
            case 'construction': return '#10b981';
            case 'industry': return '#f59e0b';
            case 'competition': return '#ef4444';
            case 'logistics': return '#8b5cf6';
            default: return '#cbd5e1';
        }
    };

    const getFactorLabel = (factor) => {
        switch (factor) {
            case 'market': return 'Mercado';
            case 'construction': return 'Construcción';
            case 'industry': return 'Industria';
            case 'competition': return 'Competencia';
            case 'logistics': return 'Logística';
            default: return factor;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin text-accent" size={40} />
                    <p className="text-secondary">Analizando oportunidades de mercado...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="flex-col gap-4"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={item} className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 className="text-lg font-bold" style={{ fontSize: '1.5rem' }}>Mapa de Oportunidades</h2>
                    <p className="text-secondary">Análisis geográfico y sectorial para la expansión.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        className={`card flex items-center gap-2 ${showClusters ? 'active' : ''}`}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderColor: showClusters ? 'var(--color-accent-primary)' : 'var(--border-color)' }}
                        onClick={() => { setShowClusters(!showClusters); setShowSimulation(false); setShowConfig(false); }}
                    >
                        <Users size={16} />
                        Vista Clusters
                    </button>
                    <button
                        className={`card flex items-center gap-2 ${showSimulation ? 'active' : ''}`}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderColor: showSimulation ? 'var(--color-accent-primary)' : 'var(--border-color)' }}
                        onClick={() => { setShowSimulation(!showSimulation); setShowConfig(false); setShowClusters(false); }}
                    >
                        <BrainCircuit size={16} />
                        IA Predictiva
                    </button>
                    <button
                        className={`card flex items-center gap-2 ${showConfig ? 'active' : ''}`}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', borderColor: showConfig ? 'var(--color-accent-primary)' : 'var(--border-color)' }}
                        onClick={() => { setShowConfig(!showConfig); setShowSimulation(false); setShowClusters(false); }}
                    >
                        <Sliders size={16} />
                        Configurar Algoritmo
                    </button>
                    <button
                        className="card flex items-center gap-2"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', background: 'var(--color-accent-primary)', color: 'white', border: 'none' }}
                        onClick={handleRefresh}
                    >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                        {isRefreshing ? 'Actualizando...' : 'Actualizar Datos'}
                    </button>
                </div>
            </motion.div>

            {/* AI Assistant Search Bar */}
            <motion.div variants={item} className="card" style={{ marginBottom: '2rem', padding: '1rem', background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <form onSubmit={handleAISearch} className="flex gap-2 items-center">
                    <BrainCircuit className="text-accent" size={24} />
                    <input
                        type="text"
                        placeholder="Pregunta a la IA (ej: 'Busca regiones con competencia baja' o 'Mejor logística')"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--color-text-primary)', fontSize: '1rem', outline: 'none' }}
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        style={{ padding: '0.5rem 1.5rem', background: 'var(--color-accent-primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: 'bold', cursor: isSearching ? 'wait' : 'pointer', opacity: isSearching ? 0.7 : 1 }}
                    >
                        {isSearching ? 'Analizando...' : 'Consultar'}
                    </button>
                </form>
                {aiResponse && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 bg-slate-800/50 rounded-md border border-slate-700 text-sm text-secondary flex items-start gap-2"
                    >
                        <div className="min-w-[4px] h-full bg-accent rounded-full"></div>
                        <p>{aiResponse}</p>
                    </motion.div>
                )}
            </motion.div>

            {/* Algorithm Configuration Panel */}
            <AnimatePresence>
                {showConfig && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="card"
                        style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--color-bg-tertiary)' }}
                    >
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Settings size={18} />
                            Ponderación de Factores (IA)
                        </h3>
                        <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: 0 }}>
                            {Object.entries(weights).map(([key, value]) => (
                                <div key={key}>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-bold capitalize">{getFactorLabel(key)}</label>
                                        <span className="text-sm text-accent">{value}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={value}
                                        onChange={(e) => handleWeightChange(key, e.target.value)}
                                        style={{ width: '100%', accentColor: 'var(--color-accent-primary)' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Predictive AI Simulation Panel */}
            <AnimatePresence>
                {showSimulation && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="card"
                        style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                    >
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-success">
                            <TrendingUp size={18} />
                            Simulador de Escenarios (12 Meses)
                        </h3>
                        <p className="text-sm text-secondary mb-4">Ajusta las tendencias de mercado previstas para ver cómo impactan en el Score de cada región.</p>

                        {/* Preset Scenarios */}
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                            <button
                                onClick={() => setSimulationTrends({ market: 20, construction: 40, industry: 10, competition: 0, logistics: 5 })}
                                className="px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors whitespace-nowrap"
                            >
                                🚀 Boom Construcción
                            </button>
                            <button
                                onClick={() => setSimulationTrends({ market: -10, construction: -20, industry: -5, competition: 10, logistics: -40 })}
                                className="px-3 py-1.5 rounded-full text-xs font-bold border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors whitespace-nowrap"
                            >
                                🚚 Crisis Logística
                            </button>
                            <button
                                onClick={() => setSimulationTrends({ market: 5, construction: 0, industry: 0, competition: 50, logistics: 0 })}
                                className="px-3 py-1.5 rounded-full text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors whitespace-nowrap"
                            >
                                ⚔️ Alta Competencia
                            </button>
                            <button
                                onClick={() => setSimulationTrends({ market: 0, construction: 0, industry: 0, competition: 0, logistics: 0 })}
                                className="px-3 py-1.5 rounded-full text-xs font-bold border border-slate-500/30 bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 transition-colors whitespace-nowrap"
                            >
                                🔄 Reset
                            </button>
                        </div>
                        <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: 0 }}>
                            {Object.entries(simulationTrends).map(([key, value]) => (
                                <div key={key}>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-bold capitalize">{getFactorLabel(key)}</label>
                                        <span className={`text-sm font-bold ${value > 0 ? 'text-success' : value < 0 ? 'text-warning' : 'text-secondary'}`}>
                                            {value > 0 ? '+' : ''}{value}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-50"
                                        max="50"
                                        value={value}
                                        onChange={(e) => handleTrendChange(key, e.target.value)}
                                        style={{ width: '100%', accentColor: 'var(--color-success)' }}
                                    />
                                    <div className="flex justify-between text-xs text-secondary mt-1">
                                        <span>-50%</span>
                                        <span>0%</span>
                                        <span>+50%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cluster Analysis Panel */}
            <AnimatePresence>
                {showClusters && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-col gap-4"
                        style={{ marginBottom: '2rem' }}
                    >
                        {/* Strategic Insight Box */}
                        <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <BrainCircuit size={24} className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Insight Estratégico (IA)</h3>
                                    <p className="text-secondary italic">
                                        "Para <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>Ctiki</span> se detecta un grupo de regiones con alta demanda de ACS y buena logística, pero aún con competencia moderada. Son interesantes para ataques selectivos."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Clusters Grid */}
                        <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: 0 }}>

                            {/* Cluster 1: Construction Opportunity */}
                            <div className="card" style={{ borderTop: '4px solid #10b981' }}>
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <Building2 size={20} className="text-emerald-500" />
                                    Expansión Obra Nueva
                                </h4>
                                <p className="text-xs text-secondary mb-4">Regiones con mucha obra nueva pero poca industria.</p>
                                <div className="flex flex-col gap-2">
                                    {regions.filter(r => r.factors.construction > 80 && r.factors.industry < 70).map(r => (
                                        <div key={r.id} className="p-2 rounded flex justify-between items-center" style={{ background: 'var(--color-bg-tertiary)' }}>
                                            <span>{r.name}</span>
                                            <span className="text-xs font-mono text-emerald-400">Constr: {r.factors.construction}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cluster 2: Mature Market */}
                            <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <Users size={20} className="text-amber-500" />
                                    Mercados Maduros
                                </h4>
                                <p className="text-xs text-secondary mb-4">Alta competencia pero gran volumen de mercado.</p>
                                <div className="flex flex-col gap-2">
                                    {regions.filter(r => r.factors.market > 80 && r.factors.competition > 75).map(r => (
                                        <div key={r.id} className="p-2 rounded flex justify-between items-center" style={{ background: 'var(--color-bg-tertiary)' }}>
                                            <span>{r.name}</span>
                                            <span className="text-xs font-mono text-amber-400">Comp: {r.factors.competition}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cluster 3: Niche Logistics */}
                            <div className="card" style={{ borderTop: '4px solid #8b5cf6' }}>
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-violet-500" />
                                    Nicho Logístico
                                </h4>
                                <p className="text-xs text-secondary mb-4">Buena logística y competencia moderada.</p>
                                <div className="flex flex-col gap-2">
                                    {regions.filter(r => r.factors.logistics > 80 && r.factors.competition < 80).map(r => (
                                        <div key={r.id} className="p-2 rounded flex justify-between items-center" style={{ background: 'var(--color-bg-tertiary)' }}>
                                            <span>{r.name}</span>
                                            <span className="text-xs font-mono text-violet-400">Log: {r.factors.logistics}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
                {regions.map((region) => (
                    <motion.div layout key={region.id} variants={item} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '4px',
                            height: '100%',
                            background: region.score > 80 ? 'var(--color-success)' : region.score > 60 ? 'var(--color-warning)' : 'var(--color-text-secondary)'
                        }} />

                        <div className="flex justify-between items-start" style={{ marginBottom: '1rem' }}>
                            <div className="flex items-center gap-2">
                                <div style={{ padding: '0.5rem', background: 'var(--color-bg-tertiary)', borderRadius: '50%' }}>
                                    <MapPin size={20} color="var(--color-text-primary)" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{region.name}</h3>
                                    <span className={`badge ${region.score > 80 ? 'badge-success' : 'badge-warning'}`}>{region.status}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold" style={{ color: region.score > 80 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                    {region.score}/100
                                </div>
                                {showSimulation && region.projectedScore !== region.score && (
                                    <div className="text-xs font-bold animate-pulse" style={{ color: region.projectedScore > region.score ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                        {region.projectedScore} ({region.projectedScore > region.score ? '+' : ''}{region.projectedScore - region.score})
                                    </div>
                                )}
                                <div className="text-xs text-secondary">AI Score</div>
                            </div>
                        </div>

                        <p className="text-sm text-secondary" style={{ marginBottom: '1rem', minHeight: '3rem' }}>
                            {region.description}
                        </p>

                        <div className="flex items-center gap-2 mb-4 p-2 bg-slate-800/50 rounded-md">
                            <Building2 size={16} className="text-accent" />
                            <span className="text-xs font-bold text-secondary">Foco en ciudades:</span>
                            <span className="text-xs text-primary">{region.cities}</span>
                        </div>

                        {/* Explainable AI: Visual Factor Breakdown */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart2 size={14} className="text-secondary" />
                                <span className="text-xs font-bold text-secondary">Análisis de Factores (IA Explicable)</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {Object.entries(region.factors).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <div className="w-20 text-xs text-secondary capitalize truncate">{getFactorLabel(key)}</div>
                                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${value}%` }}
                                                transition={{ duration: 0.5 }}
                                                className="h-full rounded-full"
                                                style={{ background: getFactorColor(key) }}
                                            />
                                        </div>
                                        <div className="w-8 text-xs text-right font-mono">{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center" style={{ padding: '1rem', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                            <div>
                                <div className="text-xs text-secondary">Potencial Estimado</div>
                                <div className="font-bold">{region.potential}</div>
                            </div>
                            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
                            <div>
                                <div className="text-xs text-secondary">Competencia</div>
                                <div className="font-bold">{region.factors.competition > 70 ? 'Alta' : region.factors.competition > 40 ? 'Media' : 'Baja'}</div>
                            </div>
                            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
                            <div>
                                <div className="text-xs text-secondary">Sectores Top</div>
                                <div className="font-bold text-sm">{region.sectors[0]}</div>
                            </div>
                        </div>

                        <button
                            className="w-full flex items-center justify-center gap-2"
                            style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', transition: 'all 0.2s', cursor: 'pointer' }}
                            onClick={() => handleStrategyClick(region)}
                        >
                            <span>Ver Estrategia de Entrada</span>
                            <ArrowRight size={16} />
                        </button>
                    </motion.div>
                ))}
            </div>

            {selectedRegionForStrategy && (
                <StrategyModal region={selectedRegionForStrategy} onClose={() => setSelectedRegionForStrategy(null)} />
            )}
        </motion.div>
    );
};

export default OpportunitiesMap;
