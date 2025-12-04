import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart, Activity, Leaf, Globe, Download, CheckCircle, Loader } from 'lucide-react';

const reportTypes = [
    {
        id: 'executive',
        title: 'Informe Ejecutivo',
        description: 'Visión estratégica global para la dirección. Incluye KPIs financieros, resumen de oportunidades y top estrategias.',
        icon: BarChart,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20'
    },
    {
        id: 'operational',
        title: 'Informe Operativo',
        description: 'Detalle del día a día para Project Managers. Estado del Kanban, cuellos de botella y rendimiento del equipo.',
        icon: Activity,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20'
    },
    {
        id: 'sustainability',
        title: 'Viabilidad y Sostenibilidad',
        description: 'Herramienta de venta para Retrofit. Análisis de ROI, Payback y reducción de huella de carbono.',
        icon: Leaf,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20'
    },
    {
        id: 'market',
        title: 'Inteligencia de Mercado',
        description: 'Análisis profundo del entorno. Identificación de nichos (Scatter Plot), competencia y mix de marketing.',
        icon: Globe,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20'
    }
];

const ReportCenter = () => {
    const [generating, setGenerating] = useState(null);
    const [completed, setCompleted] = useState(null);
    const [recentReports, setRecentReports] = useState([]);

    const downloadFile = (title) => {
        // Create a dummy text file
        const element = document.createElement("a");
        const file = new Blob([`Contenido del ${title}\n\nGenerado el: ${new Date().toLocaleString()}\n\nEste es un archivo simulado para demostración.`], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${title.replace(/\s+/g, '_')}_${Date.now()}.txt`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    };

    const handleGenerate = (id) => {
        setGenerating(id);
        setCompleted(null);

        // Simulate PDF generation delay
        setTimeout(() => {
            setGenerating(null);
            setCompleted(id);

            // Add to history
            const reportConfig = reportTypes.find(r => r.id === id);
            const newReport = {
                id: Date.now(),
                title: reportConfig.title,
                date: new Date().toLocaleString(),
                type: reportConfig.id
            };
            setRecentReports(prev => [newReport, ...prev]);

            // Trigger download
            downloadFile(reportConfig.title);

            // Auto-hide success message after 3 seconds
            setTimeout(() => setCompleted(null), 3000);
        }, 2000);
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
                        <FileText className="text-accent" />
                        Centro de Informes
                    </h2>
                    <p className="text-secondary">Generación automatizada de documentación estratégica y operativa.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportTypes.map((report) => (
                    <motion.div
                        key={report.id}
                        variants={item}
                        className={`card p-6 border transition-all hover:shadow-lg ${report.borderColor}`}
                        style={{ background: 'var(--color-bg-secondary)' }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${report.bgColor}`}>
                                <report.icon size={24} className={report.color} />
                            </div>
                            {completed === report.id && (
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="flex items-center gap-1 text-emerald-500 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full"
                                >
                                    <CheckCircle size={14} /> Generado
                                </motion.div>
                            )}
                        </div>

                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{report.title}</h3>
                        <p className="text-sm text-secondary mb-6 min-h-[40px]">{report.description}</p>

                        <button
                            onClick={() => handleGenerate(report.id)}
                            disabled={generating === report.id}
                            className="w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                            style={{
                                background: generating === report.id ? 'var(--color-bg-tertiary)' : 'var(--color-bg-tertiary)',
                                color: generating === report.id ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                                border: '1px solid var(--border-color)'
                            }}
                        >
                            {generating === report.id ? (
                                <>
                                    <Loader size={18} className="animate-spin" /> Generando...
                                </>
                            ) : (
                                <>
                                    <Download size={18} /> Generar PDF
                                </>
                            )}
                        </button>
                    </motion.div>
                ))}
            </div>

            <motion.div variants={item} className="mt-8 p-6 rounded-xl border border-slate-700/30" style={{ background: 'var(--color-bg-secondary)' }}>
                <h4 className="font-bold mb-4 flex items-center gap-2 text-secondary">
                    <FileText size={16} />
                    Historial Reciente
                </h4>
                {recentReports.length === 0 ? (
                    <div className="text-sm text-secondary italic">
                        No hay informes generados en los últimos 7 días.
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {recentReports.map((report) => (
                            <div key={report.id} className="flex justify-between items-center p-3 rounded border transition-colors" style={{ background: 'var(--color-bg-primary)', borderColor: 'var(--border-color)' }}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded ${reportTypes.find(r => r.id === report.type)?.bgColor || 'bg-slate-700'}`}>
                                        <FileText size={16} className={reportTypes.find(r => r.id === report.type)?.color || 'text-slate-400'} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>{report.title}</p>
                                        <p className="text-xs text-secondary">{report.date}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => downloadFile(report.title)}
                                    className="text-xs text-accent hover:underline flex items-center gap-1 font-bold"
                                >
                                    <Download size={14} /> Descargar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ReportCenter;
