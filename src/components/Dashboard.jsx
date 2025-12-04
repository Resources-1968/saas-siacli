import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, MapPin, AlertCircle, Clock, AlertTriangle, CheckCircle, Activity, PieChart as PieChartIcon, X, Eye, Download, Loader } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { dashboardService } from '../services/dashboardService';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#64748b'];

// Mock Data for Modals (kept local for UI interaction demo)
const detailedOpportunities = [
    { id: 1, name: 'Oficinas Norte Madrid', region: 'Madrid', value: '€450k', probability: 'Alta' },
    { id: 2, name: 'Renovación Hotel W', region: 'Cataluña', value: '€320k', probability: 'Media' },
    { id: 3, name: 'Planta Industrial Seat', region: 'Cataluña', value: '€280k', probability: 'Alta' },
    { id: 4, name: 'Hospital La Fe', region: 'Com. Valenciana', value: '€500k', probability: 'Alta' },
    { id: 5, name: 'Centro Comercial Sur', region: 'Andalucía', value: '€150k', probability: 'Baja' },
    { id: 6, name: 'Torre Empresarial', region: 'Madrid', value: '€600k', probability: 'Alta' },
];

const activeRegionsList = [
    { id: 1, name: 'Comunidad de Madrid', status: 'Consolidado', projects: 12 },
    { id: 2, name: 'Cataluña', status: 'En Crecimiento', projects: 8 },
    { id: 3, name: 'Comunidad Valenciana', status: 'Iniciando', projects: 4 },
];

const potentialClientsList = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Cliente Potencial ${i + 1}`,
    sector: i % 3 === 0 ? 'Industrial' : i % 3 === 1 ? 'Hospitalidad' : 'Oficinas',
    value: `€${Math.floor(Math.random() * 500) + 50}k`
}));

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Dashboard = ({ setActiveTab }) => {
    const [generatingReport, setGeneratingReport] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            setIsLoading(true);
            try {
                const data = await dashboardService.getDashboardData();
                setDashboardData(data);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const handleGenerateReport = async () => {
        setGeneratingReport(true);

        try {
            const element = document.getElementById('dashboard-content');
            const canvas = await html2canvas(element, {
                scale: 2, // Higher resolution
                useCORS: true,
                logging: false,
                backgroundColor: '#0f172a' // Match app background
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add Header
            pdf.setFillColor(30, 41, 59); // Dark slate header
            pdf.rect(0, 0, pdfWidth, 20, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(16);
            pdf.text('SIACLI - Informe Ejecutivo Mensual', 10, 13);
            pdf.setFontSize(10);
            pdf.text(`Generado: ${new Date().toLocaleDateString()}`, pdfWidth - 50, 13);

            // Add Dashboard Image
            pdf.addImage(imgData, 'PNG', 0, 25, imgWidth, imgHeight);

            // Add AI Summary Section (Simulated text for the report)
            const currentY = 25 + imgHeight + 10;
            if (currentY < pdfHeight - 40) {
                pdf.setFillColor(248, 250, 252); // Light background for text
                pdf.rect(10, currentY, pdfWidth - 20, 35, 'F');

                pdf.setTextColor(15, 23, 42);
                pdf.setFontSize(12);
                pdf.text('Resumen Ejecutivo (IA)', 15, currentY + 8);

                pdf.setFontSize(9);
                pdf.setTextColor(51, 65, 85);
                const summaryLines = pdf.splitTextToSize(
                    "El rendimiento de este mes muestra un crecimiento sólido del 12% en oportunidades detectadas, impulsado principalmente por la región de Madrid. Sin embargo, se detecta una amenaza competitiva creciente de 'Boreas' en el sector de precios bajos. Se recomienda activar las acciones preventivas en Andalucía y reforzar el stock de la línea Ecodense.",
                    pdfWidth - 30
                );
                pdf.text(summaryLines, 15, currentY + 15);
            }

            pdf.save('SIACLI_Reporte_Ejecutivo.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Hubo un error al generar el informe.");
        } finally {
            setGeneratingReport(false);
        }
    };

    const formatCurrency = (value) => {
        return `€${value}`;
    };

    const closeModal = () => setActiveModal(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin text-accent" size={40} />
                    <p className="text-secondary">Cargando indicadores clave...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            id="dashboard-content"
            className="flex-col gap-4 relative"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={item} className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 className="text-lg font-bold" style={{ fontSize: '1.5rem' }}>Panel de Control</h2>
                    <p className="text-secondary">Visión general de la expansión y rendimiento.</p>
                </div>
                <button
                    className="card hover:bg-slate-800 transition-colors"
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                >
                    {generatingReport ? (
                        <Activity size={16} className="animate-spin text-accent" />
                    ) : (
                        <Download size={16} color="var(--color-accent-primary)" />
                    )}
                    <span className="text-sm font-bold text-white">{generatingReport ? 'Generando PDF...' : 'Descargar Informe'}</span>
                </button>
            </motion.div>

            {/* KPI Grid */}
            <motion.div variants={item} className="grid-dashboard" style={{ alignItems: 'start' }}>
                {/* Oportunidades Card */}
                <motion.div layout className="card relative group" style={{ gridRow: activeModal === 'opportunities' ? 'span 2' : 'span 1' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="stat-label">Oportunidades Detectadas</p>
                            <h3 className="stat-value">{dashboardData.kpis.opportunities.value}</h3>
                            <span className="badge badge-success">{dashboardData.kpis.opportunities.trend}</span>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                            <TrendingUp size={24} color="var(--color-accent-primary)" />
                        </div>
                    </div>

                    {!activeModal && (
                        <button
                            onClick={() => setActiveModal('opportunities')}
                            className="absolute bottom-4 right-4 p-2 bg-slate-700/50 hover:bg-slate-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Ver listado"
                        >
                            <Eye size={16} className="text-white" />
                        </button>
                    )}

                    <AnimatePresence>
                        {activeModal === 'opportunities' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 border-t border-slate-700 pt-4"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-sm text-accent">Detalle de Oportunidades</h4>
                                    <button onClick={closeModal} className="p-1 hover:bg-slate-700 rounded-full"><X size={14} /></button>
                                </div>
                                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                    {detailedOpportunities.map(opp => (
                                        <div key={opp.id} className="p-2 bg-slate-800/50 rounded text-sm border border-slate-700/50">
                                            <div className="flex justify-between mb-1">
                                                <span className="font-bold">{opp.name}</span>
                                                <span className="text-accent">{opp.value}</span>
                                            </div>
                                            <div className="flex justify-between text-xs text-secondary">
                                                <span>{opp.region}</span>
                                                <span>Prob: {opp.probability}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={closeModal} className="w-full mt-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors">Cerrar Detalle</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Regiones Card */}
                <motion.div layout className="card relative group" style={{ gridRow: activeModal === 'regions' ? 'span 2' : 'span 1' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="stat-label">Regiones Activas</p>
                            <h3 className="stat-value">{dashboardData.kpis.activeRegions.value}</h3>
                            <span className="badge badge-blue">{dashboardData.kpis.activeRegions.status}</span>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem' }}>
                            <MapPin size={24} color="var(--color-success)" />
                        </div>
                    </div>

                    {!activeModal && (
                        <button
                            onClick={() => setActiveModal('regions')}
                            className="absolute bottom-4 right-4 p-2 bg-slate-700/50 hover:bg-slate-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Ver listado"
                        >
                            <Eye size={16} className="text-white" />
                        </button>
                    )}

                    <AnimatePresence>
                        {activeModal === 'regions' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 border-t border-slate-700 pt-4"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-sm text-success">Estado por Región</h4>
                                    <button onClick={closeModal} className="p-1 hover:bg-slate-700 rounded-full"><X size={14} /></button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {activeRegionsList.map(region => (
                                        <div key={region.id} className="p-2 bg-slate-800/50 rounded text-sm border border-slate-700/50 flex justify-between items-center">
                                            <div>
                                                <div className="font-bold">{region.name}</div>
                                                <div className="text-xs text-secondary">{region.status}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">{region.projects}</div>
                                                <div className="text-[10px] text-secondary">Proyectos</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={closeModal} className="w-full mt-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors">Cerrar Detalle</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Clientes Card */}
                <motion.div layout className="card relative group" style={{ gridRow: activeModal === 'clients' ? 'span 2' : 'span 1' }}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="stat-label">Clientes Potenciales</p>
                            <h3 className="stat-value">{dashboardData.kpis.potentialClients.value}</h3>
                            <span className="badge badge-warning">{dashboardData.kpis.potentialClients.status}</span>
                        </div>
                        <div style={{ padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem' }}>
                            <Users size={24} color="var(--color-warning)" />
                        </div>
                    </div>

                    {!activeModal && (
                        <button
                            onClick={() => setActiveModal('clients')}
                            className="absolute bottom-4 right-4 p-2 bg-slate-700/50 hover:bg-slate-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Ver Top 20"
                        >
                            <Eye size={16} className="text-white" />
                        </button>
                    )}

                    <AnimatePresence>
                        {activeModal === 'clients' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 border-t border-slate-700 pt-4"
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-sm text-warning">Top 20 Clientes</h4>
                                    <button onClick={closeModal} className="p-1 hover:bg-slate-700 rounded-full"><X size={14} /></button>
                                </div>
                                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                    {potentialClientsList.map(client => (
                                        <div key={client.id} className="p-2 bg-slate-800/50 rounded text-sm border border-slate-700/50 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono text-secondary w-4">{client.id}</span>
                                                <div>
                                                    <div className="font-bold truncate max-w-[100px]">{client.name}</div>
                                                    <div className="text-[10px] text-secondary">{client.sector}</div>
                                                </div>
                                            </div>
                                            <div className="font-bold text-warning text-xs">{client.value}</div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={closeModal} className="w-full mt-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 rounded text-white transition-colors">Cerrar Detalle</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>

            {/* Critical Alerts Section */}
            <motion.div variants={item} className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--color-danger)' }}>
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-danger" />
                    <h3 className="font-bold text-danger">Atención Requerida</h3>
                </div>
                <div className="flex flex-col gap-2">
                    {dashboardData.alerts.map((alert, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: alert.level === 'high' ? 'var(--color-danger)' : 'var(--color-warning)' }}></div>
                            <span>{alert.text}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>

                {/* Left Column */}
                <div className="flex-col gap-4">
                    {/* Area Chart */}
                    <motion.div variants={item} className="card">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold">Proyección de Demanda</h3>
                                <p className="text-sm text-secondary">1er Semestre 2026</p>
                            </div>
                            <div className="badge badge-blue">k€</div>
                        </div>
                        <div style={{ height: '250px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dashboardData.projection}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" tickFormatter={formatCurrency} fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        itemStyle={{ color: '#38bdf8' }}
                                        formatter={(value) => [`€${value}k`, 'Demanda']}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Product Distribution */}
                    <motion.div variants={item} className="card">
                        <div className="flex items-center gap-2 mb-4">
                            <PieChartIcon size={18} className="text-secondary" />
                            <h3 className="font-bold">Distribución por Producto</h3>
                        </div>
                        <div className="flex items-center justify-center" style={{ height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dashboardData.productDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {dashboardData.productDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column */}
                <div className="flex-col gap-4">
                    {/* Top Regions - Premium Leaderboard Style */}
                    <motion.div variants={item} className="card" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--border-color)' }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <TrendingUp size={18} className="text-accent" />
                                Top Regiones
                            </h3>
                            <button className="text-xs text-accent hover:underline" onClick={() => setActiveTab('opportunities')}>Ver todo</button>
                        </div>
                        <div className="flex-col gap-3">
                            {dashboardData.topRegions.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                                    {/* Rank */}
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${index === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' : 'bg-slate-800 text-secondary border border-slate-700'}`}
                                    >
                                        {index + 1}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-sm">{item.region}</span>
                                            <span className="font-mono text-xs text-accent">{item.potential}</span>
                                        </div>
                                        {/* Score Bar */}
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${item.score}%`,
                                                    background: index === 0 ? 'linear-gradient(90deg, #eab308, #facc15)' :
                                                        item.score > 80 ? 'linear-gradient(90deg, #10b981, #34d399)' :
                                                            'linear-gradient(90deg, #3b82f6, #60a5fa)'
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Trend */}
                                    <div className="shrink-0" title={item.trend === 'up' ? 'Tendencia al alza' : item.trend === 'down' ? 'Tendencia a la baja' : 'Estable'}>
                                        {item.trend === 'up' && <div className="p-1 bg-emerald-500/10 rounded"><TrendingUp size={14} className="text-emerald-500" /></div>}
                                        {item.trend === 'down' && <div className="p-1 bg-rose-500/10 rounded"><TrendingUp size={14} className="text-rose-500 rotate-180" /></div>}
                                        {item.trend === 'stable' && <div className="p-1 bg-slate-500/10 rounded"><Activity size={14} className="text-slate-400" /></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Activity - Modern Card Timeline */}
                    <motion.div variants={item} className="card" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--border-color)' }}>
                        <div className="flex items-center gap-2 mb-4">
                            <Clock size={18} className="text-secondary" />
                            <h3 className="font-bold">Bitácora de Actividad</h3>
                        </div>
                        <div className="flex-col gap-0 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-slate-800"></div>

                            {dashboardData.activity.map((activity, index) => (
                                <div key={index} className="flex gap-4 relative pb-6 last:pb-0 group">
                                    {/* Dot */}
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 z-10 ring-4 ring-[var(--color-bg-secondary)] ${activity.type === 'success' ? 'bg-emerald-500' : activity.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}
                                        style={{ marginLeft: '0.2rem' }}
                                    ></div>

                                    {/* Content Card */}
                                    <div className="flex-1 -mt-1">
                                        <div className="text-xs text-secondary mb-1 font-mono">{activity.time}</div>
                                        <div className={`p-3 rounded-md border text-sm ${activity.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20' : activity.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
                                            <p className="font-medium mb-0.5">{activity.text}</p>
                                            {activity.type === 'success' && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle size={10} /> Acción requerida completada</span>}
                                            {activity.type === 'warning' && <span className="text-xs text-amber-400 flex items-center gap-1"><AlertTriangle size={10} /> Revisar estrategia</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </div>
        </motion.div>
    );
};

export default Dashboard;
