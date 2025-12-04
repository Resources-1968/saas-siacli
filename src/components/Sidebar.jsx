import { LayoutDashboard, Map, Package, BarChart2, Settings, Crosshair, Activity, Swords, Zap, FileText } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Oportunidades', icon: Map },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'market', label: 'Mercado', icon: BarChart2 },
    { id: 'strategy', label: 'Análisis Estratégico', icon: Crosshair },
    { id: 'operations', label: 'Operativa', icon: Activity },
    { id: 'competitive', label: 'Inteligencia Competitiva', icon: Swords },
    { id: 'retrofit', label: 'Retrofit Inteligente', icon: Zap },
    { id: 'reports', label: 'Centro de Informes', icon: FileText },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const filteredItems = menuItems.filter(item => {
    if (user?.role === 'admin') return true;
    // Viewer role restrictions
    return ['dashboard', 'opportunities', 'products', 'market'].includes(item.id);
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight">SaaS-<span className="text-accent">SIACLI</span></h1>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-700/30">
        <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-secondary">Versión 2.1.0</p>
          <p className="text-[10px] text-slate-500 mt-1">Conectado a: {user?.role === 'admin' ? 'Producción (Admin)' : 'Modo Lectura'}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
