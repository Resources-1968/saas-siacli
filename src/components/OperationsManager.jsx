import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar, User, CheckCircle, AlertTriangle, Play, RefreshCw, Loader } from 'lucide-react';
import { operationsService } from '../services/operationsService';

const OperationsManager = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [simulationResult, setSimulationResult] = useState(null);
    const [scenarioInputs, setScenarioInputs] = useState({
        competitorPriceDrop: 10,
        transportCostIncrease: 5,
        demandDrop: 0
    });

    // New State for Features
    const [filterCategory, setFilterCategory] = useState('Todas');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        category: 'Ventas',
        priority: 'medium',
        assignee: 'Ana García',
        dueDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    });

    useEffect(() => {
        const loadTasks = async () => {
            setIsLoading(true);
            try {
                const data = await operationsService.getTasks();
                setTasks(data);
            } catch (error) {
                console.error("Failed to load tasks", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTasks();
    }, []);

    const moveTask = async (taskId, newStatus) => {
        // Optimistic update
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        try {
            await operationsService.updateTaskStatus(taskId, newStatus);
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.title) return;

        const taskToAdd = { ...newTask, status: 'todo' };

        // Optimistic UI update (temporary ID)
        const tempId = `temp-${Date.now()}`;
        const optimisticTask = { ...taskToAdd, id: tempId };
        setTasks([...tasks, optimisticTask]);
        setShowNewTaskModal(false);
        setNewTask({ ...newTask, title: '' }); // Reset title

        try {
            const createdTask = await operationsService.createTask(taskToAdd);
            // Replace temp task with real one
            setTasks(prev => prev.map(t => t.id === tempId ? createdTask : t));
        } catch (error) {
            console.error("Failed to create task", error);
            setTasks(prev => prev.filter(t => t.id !== tempId)); // Revert
        }
    };

    const filteredTasks = filterCategory === 'Todas'
        ? tasks
        : tasks.filter(t => t.category === filterCategory);

    const runSimulation = () => {
        // Simple simulation logic
        const impact = (scenarioInputs.competitorPriceDrop * 1.5) + (scenarioInputs.transportCostIncrease * 0.8) + (scenarioInputs.demandDrop * 2);
        let resultText = '';
        let resultType = '';

        if (impact < 15) {
            resultText = "Impacto Bajo: El margen se mantendría saludable (>20%). Se recomienda mantener estrategia actual.";
            resultType = 'success';
        } else if (impact < 30) {
            resultText = "Impacto Medio: El margen caería al 12-15%. Se recomienda lanzar promociones agresivas.";
            resultType = 'warning';
        } else {
            resultText = "Impacto Crítico: Riesgo de pérdidas operativas. Se requiere reestructuración de costes inmediata.";
            resultType = 'danger';
        }

        setSimulationResult({ text: resultText, type: resultType, score: impact });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin text-accent" size={40} />
                    <p className="text-secondary">Sincronizando tareas con el servidor...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-col gap-6"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Centro de Operaciones</h2>
                    <p className="text-secondary">Gestión de tareas y simulación de escenarios.</p>
                </div>
            </div>

            <div className="grid-dashboard" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

                {/* Kanban Board */}
                <div className="card flex-col gap-4" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <CheckCircle size={20} className="text-accent" />
                            Planificador de Acciones
                        </h3>
                        <div className="flex gap-2 relative">
                            <button
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${filterCategory !== 'Todas' ? 'bg-accent text-white' : 'bg-slate-700/50 text-secondary hover:text-white hover:bg-slate-700'}`}
                            >
                                {filterCategory === 'Todas' ? 'Filtrar' : filterCategory}
                            </button>

                            {showFilterMenu && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
                                    {['Todas', 'Ventas', 'Presupuesto', 'Calidad', 'Admin', 'Visita'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setFilterCategory(cat); setShowFilterMenu(false); }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 text-secondary hover:text-white"
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setShowNewTaskModal(true)}
                                className="px-3 py-1.5 text-xs font-medium bg-accent text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1"
                            >
                                <Plus size={14} />
                                Nueva Tarea
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-5 h-full min-h-[500px]">
                        {/* To Do Column */}
                        <div className="rounded-xl p-4 border border-slate-700/30 flex flex-col gap-4" style={{ background: 'var(--color-bg-tertiary)' }}>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-700/30">
                                <h4 className="text-base font-bold text-secondary uppercase tracking-wide flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                    Pendiente
                                </h4>
                                <span className="text-xs font-mono text-secondary bg-slate-700/30 px-2 py-0.5 rounded-full">{filteredTasks.filter(t => t.status === 'todo').length}</span>
                            </div>
                            <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
                                {filteredTasks.filter(t => t.status === 'todo').map(task => (
                                    <TaskCard key={task.id} task={task} onMove={() => moveTask(task.id, 'in-progress')} />
                                ))}
                            </div>
                        </div>

                        {/* In Progress Column */}
                        <div className="rounded-xl p-4 border border-slate-700/30 flex flex-col gap-4" style={{ background: 'var(--color-bg-tertiary)' }}>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-700/30">
                                <h4 className="text-base font-bold text-accent uppercase tracking-wide flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                    En Curso
                                </h4>
                                <span className="text-xs font-mono text-secondary bg-slate-700/30 px-2 py-0.5 rounded-full">{filteredTasks.filter(t => t.status === 'in-progress').length}</span>
                            </div>
                            <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
                                {filteredTasks.filter(t => t.status === 'in-progress').map(task => (
                                    <TaskCard key={task.id} task={task} onMove={() => moveTask(task.id, 'done')} />
                                ))}
                            </div>
                        </div>

                        {/* Done Column */}
                        <div className="rounded-xl p-4 border border-slate-700/30 flex flex-col gap-4" style={{ background: 'var(--color-bg-tertiary)' }}>
                            <div className="flex justify-between items-center pb-2 border-b border-slate-700/30">
                                <h4 className="text-base font-bold text-success uppercase tracking-wide flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    Completado
                                </h4>
                                <span className="text-xs font-mono text-secondary bg-slate-700/30 px-2 py-0.5 rounded-full">{filteredTasks.filter(t => t.status === 'done').length}</span>
                            </div>
                            <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
                                {filteredTasks.filter(t => t.status === 'done').map(task => (
                                    <TaskCard key={task.id} task={task} isDone />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scenario Simulator */}
                <div className="card flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Play size={20} className="text-warning" />
                        <h3 className="text-lg font-bold">Simulador de Riesgos</h3>
                    </div>
                    <p className="text-xs text-secondary mb-2">Ajusta las variables para prever el impacto en el negocio.</p>

                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span>Bajada Precios Competencia</span>
                                <span className="text-warning">{scenarioInputs.competitorPriceDrop}%</span>
                            </div>
                            <input
                                type="range" min="0" max="50"
                                value={scenarioInputs.competitorPriceDrop}
                                onChange={(e) => setScenarioInputs({ ...scenarioInputs, competitorPriceDrop: Number(e.target.value) })}
                                className="w-full accent-amber-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span>Aumento Costes Transporte</span>
                                <span className="text-rose-400">{scenarioInputs.transportCostIncrease}%</span>
                            </div>
                            <input
                                type="range" min="0" max="50"
                                value={scenarioInputs.transportCostIncrease}
                                onChange={(e) => setScenarioInputs({ ...scenarioInputs, transportCostIncrease: Number(e.target.value) })}
                                className="w-full accent-rose-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span>Caída de Demanda Global</span>
                                <span className="text-slate-400">{scenarioInputs.demandDrop}%</span>
                            </div>
                            <input
                                type="range" min="0" max="30"
                                value={scenarioInputs.demandDrop}
                                onChange={(e) => setScenarioInputs({ ...scenarioInputs, demandDrop: Number(e.target.value) })}
                                className="w-full accent-slate-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={runSimulation}
                        className="mt-6 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center justify-center gap-2 transition-colors"
                    >
                        <RefreshCw size={16} />
                        Ejecutar Simulación
                    </button>

                    {simulationResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-4 p-3 rounded border text-sm ${simulationResult.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' :
                                simulationResult.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' :
                                    'bg-rose-500/10 border-rose-500/30 text-rose-200'
                                }`}
                        >
                            <div className="font-bold mb-1 flex items-center gap-2">
                                <AlertTriangle size={14} />
                                Resultado del Análisis
                            </div>
                            {simulationResult.text}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* New Task Modal */}
            {showNewTaskModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-md shadow-2xl"
                    >
                        <h3 className="text-xl font-bold mb-4">Nueva Tarea</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold text-secondary mb-1 block">Título</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm focus:border-accent outline-none"
                                    placeholder="Ej: Revisar contrato..."
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-secondary mb-1 block">Categoría</label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm outline-none"
                                        value={newTask.category}
                                        onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                                    >
                                        <option>Ventas</option>
                                        <option>Presupuesto</option>
                                        <option>Calidad</option>
                                        <option>Admin</option>
                                        <option>Visita</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-secondary mb-1 block">Prioridad</label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm outline-none"
                                        value={newTask.priority}
                                        onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        <option value="high">Alta</option>
                                        <option value="medium">Media</option>
                                        <option value="low">Baja</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-secondary mb-1 block">Asignado a</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm outline-none"
                                    value={newTask.assignee}
                                    onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowNewTaskModal(false)}
                                className="px-4 py-2 text-sm font-medium text-secondary hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateTask}
                                className="px-4 py-2 text-sm font-bold bg-accent text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Crear Tarea
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

const TaskCard = ({ task, onMove, isDone }) => (
    <motion.div
        layoutId={task.id}
        className={`group p-5 rounded-xl border shadow-sm cursor-pointer transition-all hover:shadow-md ${isDone ? 'opacity-60 grayscale' : ''}`}
        style={{
            background: 'var(--color-bg-secondary)',
            borderColor: 'var(--border-color)',
            borderLeft: `5px solid ${task.priority === 'high' ? 'var(--color-danger)' : task.priority === 'medium' ? 'var(--color-warning)' : 'var(--color-accent-primary)'}`
        }}
        onClick={onMove}
        whileHover={{ y: -3 }}
    >
        <div className="flex justify-between items-start mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide"
                style={{
                    background: task.category === 'Ventas' ? 'rgba(59, 130, 246, 0.1)' : task.category === 'Estrategia' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    color: task.category === 'Ventas' ? '#3b82f6' : task.category === 'Estrategia' ? '#a855f7' : '#10b981'
                }}>
                {task.category}
            </span>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-700/20 rounded">
                <MoreHorizontal size={16} className="text-secondary" />
            </button>
        </div>

        <h4 className="text-base font-bold mb-4 leading-snug tracking-tight" style={{ color: 'var(--color-text-primary)' }}>{task.title}</h4>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/20">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
                    {task.assignee.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm text-secondary font-medium">{task.assignee}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-secondary">
                <Calendar size={14} />
                <span>{task.dueDate}</span>
            </div>
        </div>
    </motion.div>
);

export default OperationsManager;
