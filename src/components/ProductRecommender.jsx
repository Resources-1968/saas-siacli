import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle, Zap, Info, Telescope, TrendingUp, Loader } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { productsService } from '../services/productsService';
import { opportunitiesService } from '../services/opportunitiesService';

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

const ProductRecommender = () => {
    const [selectedSector, setSelectedSector] = useState('Todos');
    const [selectedRegion, setSelectedRegion] = useState('Comunidad de Madrid');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [nicheData, setNicheData] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showNicheExplorer, setShowNicheExplorer] = useState(false);
    const [availableRegions, setAvailableRegions] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [productsData, nicheAnalysis, opportunities] = await Promise.all([
                    productsService.getAllProducts(),
                    productsService.getNicheAnalysis(),
                    opportunitiesService.getOpportunities()
                ]);
                setProducts(productsData);
                setFilteredProducts(productsData);
                setNicheData(nicheAnalysis);

                // Extract unique region names from opportunities
                const regions = opportunities.map(op => op.name);
                setAvailableRegions(regions);

                // Set default region if not already set or invalid
                if (regions.length > 0 && !regions.includes(selectedRegion)) {
                    setSelectedRegion(regions[0]);
                }
            } catch (error) {
                console.error("Failed to load products data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Auto-trigger analysis when filters change
    useEffect(() => {
        const runAnalysis = async () => {
            setIsAnalyzing(true);
            try {
                console.log(`Analyzing for Region: ${selectedRegion}, Sector: ${selectedSector}`);
                const results = await productsService.getAllProducts(selectedSector, selectedRegion);
                setFilteredProducts(results);
            } catch (error) {
                console.error("Analysis failed", error);
            } finally {
                setIsAnalyzing(false);
            }
        };

        if (!isLoading) {
            runAnalysis();
        }
    }, [selectedRegion, selectedSector, isLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin text-accent" size={40} />
                    <p className="text-secondary">Cargando catálogo de productos...</p>
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
                    <h2 className="text-lg font-bold" style={{ fontSize: '1.5rem' }}>Recomendador Inteligente</h2>
                    <p className="text-secondary">Selección de productos optimizada por IA según demanda y competencia.</p>
                </div>
                <button
                    onClick={() => setShowNicheExplorer(!showNicheExplorer)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors font-bold ${showNicheExplorer ? 'bg-accent text-white border-accent' : 'bg-transparent border-slate-400 hover:border-accent hover:text-accent'}`}
                    style={{ color: showNicheExplorer ? 'white' : 'var(--color-text-primary)' }}
                >
                    <Telescope size={18} />
                    {showNicheExplorer ? 'Ocultar Explorador' : 'Explorar Nichos (IA)'}
                </button>
            </motion.div>

            <AnimatePresence>
                {showNicheExplorer && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="card mb-8 overflow-hidden"
                        style={{ background: 'var(--color-bg-secondary)' }}
                    >
                        <div className="p-6">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <Telescope className="text-purple-500" />
                                Identificación de Nichos de Mercado (INNOV-1)
                            </h3>
                            <p className="text-sm text-secondary mb-6">
                                El algoritmo cruza la <strong>Infraestructura Local</strong> (Eje X) con la <strong>Penetración de Tecnología</strong> (Eje Y).
                                <br />
                                <span className="text-emerald-500 font-bold">Oportunidad:</span> Alta Infraestructura + Baja Penetración.
                            </p>

                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                        <XAxis type="number" dataKey="x" name="Infraestructura" unit="%" stroke="var(--color-text-secondary)">
                                            <LabelList value="Infraestructura Local" offset={-10} position="insideBottom" />
                                        </XAxis>
                                        <YAxis type="number" dataKey="y" name="Penetración" unit="%" stroke="var(--color-text-secondary)">
                                            <LabelList value="Penetración Tecnológica" angle={-90} position="insideLeft" />
                                        </YAxis>
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-slate-800 p-3 border border-slate-700 rounded shadow-xl">
                                                        <p className="font-bold text-white mb-1">{data.name}</p>
                                                        <p className="text-xs text-secondary">Infraestructura: {data.x}%</p>
                                                        <p className="text-xs text-secondary">Penetración: {data.y}%</p>
                                                        <p className="text-xs font-bold mt-2" style={{ color: data.color }}>Potencial: {data.potential}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Scatter name="Nichos" data={nicheData} fill="#8884d8">
                                            {nicheData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <motion.div variants={item} className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <div className="flex items-end gap-4">
                    <div className="flex-col gap-2" style={{ flex: 1 }}>
                        <label className="text-sm font-bold text-secondary">Región Objetivo ({availableRegions.length})</label>
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', background: 'var(--color-bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}
                        >
                            {availableRegions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-col gap-2" style={{ flex: 1 }}>
                        <label className="text-sm font-bold text-secondary">Sector del Cliente</label>
                        <select
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', background: 'var(--color-bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}
                        >
                            <option value="Todos">Todos los sectores</option>
                            <option value="Oficinas">Oficinas / Corporativo</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Hospitalidad">Hospitalidad / Hoteles</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center pb-1">
                        {isAnalyzing && <Loader className="animate-spin text-accent" size={24} />}
                    </div>
                </div>
            </motion.div>

            {/* Results Status */}
            <div className="flex justify-between items-center text-sm text-secondary mb-2">
                <span>Mostrando resultados para <strong>{selectedSector}</strong> en <strong>{selectedRegion}</strong></span>
                <span>{filteredProducts.length} productos encontrados</span>
            </div>

            {/* Results */}
            <div className="flex-col gap-4">
                {filteredProducts.length === 0 ? (
                    <div className="text-center text-secondary py-8">No se encontraron productos para este sector.</div>
                ) : (
                    filteredProducts.map((product, index) => (
                        <motion.div
                            layout
                            key={`${product.id}-${selectedRegion}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                            style={{ display: 'flex', gap: '1.5rem', borderLeft: index === 0 ? '4px solid var(--color-accent-primary)' : 'none' }}
                        >
                            <div style={{ width: '120px', height: '120px', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                <Zap size={40} className="text-secondary" />
                                {index === 0 && (
                                    <div className="absolute -top-2 -left-2 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                                        Top Regional
                                    </div>
                                )}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg">{product.name}</h3>
                                            <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>{product.category}</span>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            {product.features.map((feature, idx) => (
                                                <span key={idx} className="text-xs text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <CheckCircle size={12} color="var(--color-success)" /> {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="badge badge-blue" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                                            {product.matchScore}% Match
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Info size={16} color="var(--color-accent-primary)" />
                                        <span className="text-sm font-bold" style={{ color: 'var(--color-accent-primary)' }}>Por qué recomendamos esto:</span>
                                    </div>
                                    <p className="text-sm text-secondary">{product.reason}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default ProductRecommender;
