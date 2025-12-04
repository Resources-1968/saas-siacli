import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Bell, Lock, Database, Cpu } from 'lucide-react';

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

const Settings = ({ autoUpdate, setAutoUpdate }) => {
    const [aiCreativity, setAiCreativity] = useState(50);
    const [notifications, setNotifications] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('Configuración guardada correctamente');
        }, 1500);
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
                    <h2 className="text-lg font-bold" style={{ fontSize: '1.5rem' }}>Configuración del Sistema</h2>
                    <p className="text-secondary">Personaliza el comportamiento de la IA y preferencias de usuario.</p>
                </div>
                <button
                    className="card"
                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent-primary)', color: 'white', border: 'none' }}
                    onClick={handleSave}
                >
                    <Save size={16} />
                    <span className="text-sm">{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
            </motion.div>

            <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                {/* AI Parameters */}
                <motion.div variants={item} className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <Cpu className="text-accent" size={24} />
                        <h3 className="font-bold">Parámetros de IA</h3>
                    </div>

                    <div className="flex-col gap-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-bold">Nivel de Creatividad (Análisis)</label>
                                <span className="text-sm text-secondary">{aiCreativity}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={aiCreativity}
                                onChange={(e) => setAiCreativity(e.target.value)}
                                style={{ width: '100%', accentColor: 'var(--color-accent-primary)' }}
                            />
                            <p className="text-xs text-secondary mt-1">Ajusta qué tan especulativa debe ser la IA al detectar oportunidades futuras.</p>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold">Actualización Automática de Datos</label>
                            <div
                                onClick={() => setAutoUpdate(!autoUpdate)}
                                style={{
                                    width: '40px',
                                    height: '20px',
                                    background: autoUpdate ? 'var(--color-success)' : 'var(--color-bg-tertiary)',
                                    borderRadius: '20px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s'
                                }}
                            >
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    background: 'white',
                                    borderRadius: '50%',
                                    position: 'absolute',
                                    top: '2px',
                                    left: autoUpdate ? '22px' : '2px',
                                    transition: 'left 0.3s'
                                }} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div variants={item} className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell className="text-warning" size={24} />
                        <h3 className="font-bold">Notificaciones</h3>
                    </div>

                    <div className="flex-col gap-4">
                        <div className="flex items-center justify-between p-2 hover:bg-slate-800 rounded transition-colors">
                            <div>
                                <p className="text-sm font-bold">Alertas de Licitaciones</p>
                                <p className="text-xs text-secondary">Recibir email cuando haya &gt;90% match</p>
                            </div>
                            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} style={{ accentColor: 'var(--color-accent-primary)' }} />
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-slate-800 rounded transition-colors">
                            <div>
                                <p className="text-sm font-bold">Resumen Semanal</p>
                                <p className="text-xs text-secondary">Informe PDF automático los lunes</p>
                            </div>
                            <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-accent-primary)' }} />
                        </div>
                    </div>
                </motion.div>

                {/* Account */}
                <motion.div variants={item} className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <User className="text-success" size={24} />
                        <h3 className="font-bold">Cuenta</h3>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={30} />
                        </div>
                        <div>
                            <p className="font-bold">Admin User</p>
                            <p className="text-sm text-secondary">admin@distriai.com</p>
                        </div>
                    </div>

                    <button className="w-full" style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                        Cerrar Sesión
                    </button>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default Settings;
