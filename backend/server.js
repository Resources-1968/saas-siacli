const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- DATA ---

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// --- DATA LOADING HELPER ---
const loadExcel = (filename) => {
    const filePath = path.join(__dirname, 'data', filename);
    if (fs.existsSync(filePath)) {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            return XLSX.utils.sheet_to_json(sheet);
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return null;
        }
    }
    return null;
};

// --- DEFAULT DATA (Fallback) ---
const defaultProducts = [
    {
        id: 1,
        name: 'Halton - Difusión y gestión de aire',
        category: 'Ventilación',
        matchScore: 95,
        targetSectors: ['Oficinas', 'Hospitales', 'Laboratorios', 'Corporativo'],
        reason: 'Líder en soluciones de aire exigentes. Ideal para proyectos hospitalarios y de oficinas premium.',
        features: ['Difusión de Alta Precisión', 'Gestión de Flujo', 'Higiene Certificada']
    },
    // ... (keep other defaults if needed, or just rely on the file)
];

// --- LOAD & TRANSFORM DATA ---

// 1. Products
let productsData = [];
const rawProducts = loadExcel('plantilla_productos.xlsx');

if (rawProducts) {
    productsData = rawProducts.map(p => ({
        ...p,
        targetSectors: p.targetSectors ? p.targetSectors.split(',').map(s => s.trim()) : [],
        features: p.features ? p.features.split(',').map(f => f.trim()) : []
    }));
    console.log(`Loaded ${productsData.length} products from Excel.`);
} else {
    console.log('Using default products data.');
    productsData = [
        {
            id: 1,
            name: 'Halton - Difusión y gestión de aire',
            category: 'Ventilación',
            matchScore: 95,
            targetSectors: ['Oficinas', 'Hospitales', 'Laboratorios', 'Corporativo'],
            reason: 'Líder en soluciones de aire exigentes. Ideal para proyectos hospitalarios y de oficinas premium.',
            features: ['Difusión de Alta Precisión', 'Gestión de Flujo', 'Higiene Certificada']
        },
        {
            id: 2,
            name: 'Boreas - Tratamiento de aire y climatización',
            category: 'Climatización',
            matchScore: 92,
            targetSectors: ['Industrial', 'Centros Comerciales', 'Aeropuertos', 'Logística'],
            reason: 'Soluciones robustas para grandes volúmenes de aire. Alta demanda en el sector logístico.',
            features: ['Tratamiento Integral', 'Eficiencia Térmica', 'Personalizable']
        },
        {
            id: 3,
            name: 'Airmaster - Ventilación descentralizada',
            category: 'Ventilación',
            matchScore: 88,
            targetSectors: ['Educación', 'Oficinas Reformadas', 'Edificios Públicos', 'Oficinas'],
            reason: 'Perfecto para renovaciones sin espacio para conductos. Muy solicitado para planes de mejora en escuelas.',
            features: ['Sin Conductos', 'Recuperación Inteligente', 'Instalación Rápida']
        },
        {
            id: 4,
            name: 'ECPower - Microcogeneración',
            category: 'Energía',
            matchScore: 85,
            targetSectors: ['Hospitalidad', 'Hoteles', 'Polideportivos', 'Residencias'],
            reason: 'Generación simultánea de calor y electricidad. ROI excelente para hoteles con piscina y spa.',
            features: ['Cogeneración', 'Ahorro Energético', 'Reducción Emisiones']
        },
        {
            id: 5,
            name: 'Ctiki - Bombas de calor aerotérmicas ACS',
            category: 'Climatización',
            matchScore: 80,
            targetSectors: ['Residencial', 'Hospitalidad', 'Hoteles', 'Gimnasios'],
            reason: 'Producción eficiente de Agua Caliente Sanitaria. Clave para cumplir normativas de eficiencia.',
            features: ['Aerotermia', 'Alto COP', 'Producción ACS']
        },
        {
            id: 6,
            name: 'Ecodense - Calderas de condensación',
            category: 'Calefacción',
            matchScore: 78,
            targetSectors: ['Industrial', 'Grandes Edificios', 'District Heating'],
            reason: 'Calderas a gas de mediana y gran potencia. Solución fiable para industria.',
            features: ['Condensación', 'Gran Potencia', 'Bajas Emisiones NOx']
        }
    ];
}

// 2. Opportunities
let opportunitiesData = [];
const rawOpportunities = loadExcel('plantilla_oportunidades.xlsx');

if (rawOpportunities) {
    opportunitiesData = rawOpportunities.map(o => ({
        id: o.id,
        name: o.name,
        coordinates: [o.lat, o.lng],
        value: o.value,
        potential: o.potential,
        description: o.description,
        factors: {
            market: o.factor_market || 50,
            construction: o.factor_construction || 50,
            industry: o.factor_industry || 50,
            competition: o.factor_competition || 50,
            logistics: o.factor_logistics || 50
        }
    }));
    console.log(`Loaded ${opportunitiesData.length} opportunities from Excel.`);
} else {
    console.log('Using default opportunities data.');
    opportunitiesData = [
        { id: 1, name: 'Comunidad de Madrid', coordinates: [40.4168, -3.7038], value: 85, potential: 'Alto', description: 'Alta demanda en oficinas y sector sanitario.', factors: { market: 95, construction: 90, industry: 60, competition: 80, logistics: 95 } },
        { id: 2, name: 'Cataluña', coordinates: [41.3851, 2.1734], value: 92, potential: 'Muy Alto', description: 'Fuerte tejido industrial y logístico.', factors: { market: 90, construction: 75, industry: 95, competition: 85, logistics: 90 } },
        { id: 3, name: 'País Vasco', coordinates: [43.2630, -2.9350], value: 78, potential: 'Medio', description: 'Oportunidades en industria pesada y naval.', factors: { market: 70, construction: 60, industry: 90, competition: 60, logistics: 80 } },
        { id: 4, name: 'Andalucía', coordinates: [37.3891, -5.9845], value: 70, potential: 'Medio', description: 'Crecimiento en sector turístico y hotelero.', factors: { market: 80, construction: 85, industry: 50, competition: 70, logistics: 75 } },
        { id: 5, name: 'Comunidad Valenciana', coordinates: [39.4699, -0.3763], value: 65, potential: 'Bajo', description: 'Mercado saturado, enfoque en renovación.', factors: { market: 85, construction: 80, industry: 85, competition: 75, logistics: 95 } },
        { id: 6, name: 'Galicia', coordinates: [42.8782, -8.5448], value: 60, potential: 'Medio', description: 'Sector textil y alimentario en expansión.', factors: { market: 70, construction: 65, industry: 80, competition: 60, logistics: 75 } },
        { id: 7, name: 'Castilla y León', coordinates: [41.6523, -4.7245], value: 55, potential: 'Bajo', description: 'Oportunidades en bioenergía y agroindustria.', factors: { market: 60, construction: 50, industry: 70, competition: 40, logistics: 60 } },
        { id: 8, name: 'Canarias', coordinates: [28.2916, -16.6291], value: 88, potential: 'Muy Alto', description: 'Alta demanda hotelera y necesidad de eficiencia energética extrema.', factors: { market: 85, construction: 70, industry: 40, competition: 50, logistics: 40 } },
        { id: 9, name: 'Murcia', coordinates: [37.9922, -1.1307], value: 50, potential: 'Bajo', description: 'Sector agroalimentario fuerte, demanda de frío industrial.', factors: { market: 65, construction: 60, industry: 80, competition: 55, logistics: 70 } },
    ];
}

// 3. Strategies
let strategies = {};
const rawStrategies = loadExcel('plantilla_estrategias.xlsx');

if (rawStrategies) {
    rawStrategies.forEach(s => {
        strategies[s.region] = {
            focus: s.focus,
            logistics: s.logistics,
            marketing: s.marketing,
            keyAction: s.keyAction,
            persona: {
                role: s.persona_role,
                pain: s.persona_pain,
                gain: s.persona_gain
            },
            // Default mix as it wasn't in the simple template
            mix: [
                { name: 'Digital', value: 50, color: '#3b82f6' },
                { name: 'Presencial', value: 50, color: '#10b981' }
            ]
        };
    });
    console.log(`Loaded ${Object.keys(strategies).length} strategies from Excel.`);
} else {
    console.log('Using default strategies data.');
    strategies = {
        'Comunidad de Madrid': {
            focus: 'Rehabilitación de oficinas premium y sector sanitario.',
            logistics: 'Hub centralizado en Coslada.',
            marketing: 'Eventos presenciales en IFEMA y LinkedIn Ads segmentados.',
            keyAction: 'Alianza con estudios de arquitectura top.',
            mix: [
                { name: 'Eventos', value: 40, color: '#3b82f6' },
                { name: 'Digital', value: 30, color: '#10b981' },
                { name: 'PR', value: 30, color: '#f59e0b' }
            ],
            persona: {
                role: 'Director de Facility Management',
                pain: 'Costes operativos altos y quejas de confort.',
                gain: 'Eficiencia energética y bienestar certificado (WELL).'
            }
        },
        // ... (other defaults can be kept or omitted if file is expected)
        'default': {
            focus: 'Análisis de mercado local en curso.',
            logistics: 'Red de distribución estándar.',
            marketing: 'Campaña general de marca.',
            keyAction: 'Prospección telefónica.',
            mix: [
                { name: 'General', value: 100, color: '#94a3b8' }
            ],
            persona: {
                role: 'Gerente General',
                pain: 'Optimización de costes.',
                gain: 'Mejora de rentabilidad.'
            }
        }
    };
}

// Niche Analysis Data
const nicheData = [
    { name: 'Oficinas Madrid', x: 85, y: 45, color: '#10b981', potential: 'Alto' },
    { name: 'Hospitales', x: 75, y: 60, color: '#ef4444', potential: 'Medio' },
    { name: 'Hoteles Costa', x: 80, y: 35, color: '#10b981', potential: 'Alto' },
    { name: 'Industria Norte', x: 70, y: 55, color: '#f59e0b', potential: 'Medio' },
    { name: 'Logística', x: 65, y: 40, color: '#f59e0b', potential: 'Medio' },
    { name: 'Retail', x: 55, y: 70, color: '#6366f1', potential: 'Bajo' },
    { name: 'Educación', x: 60, y: 50, color: '#f59e0b', potential: 'Medio' }
];

const dashboardData = {
    projection: [
        { name: 'Ene 26', value: 4200 },
        { name: 'Feb 26', value: 3500 },
        { name: 'Mar 26', value: 2800 },
        { name: 'Abr 26', value: 3900 },
        { name: 'May 26', value: 4500 },
        { name: 'Jun 26', value: 5100 },
    ],
    topRegions: [
        { region: 'Madrid', score: 85, potential: '€1.2M', trend: 'up' },
        { region: 'Cataluña', score: 78, potential: '€950k', trend: 'stable' },
        { region: 'Com. Valenciana', score: 72, potential: '€800k', trend: 'up' },
        { region: 'Andalucía', score: 65, potential: '€600k', trend: 'down' },
    ],
    productDistribution: [
        { name: 'Halton', value: 35 },
        { name: 'Boreas', value: 25 },
        { name: 'Ecodense', value: 20 },
        { name: 'Otros', value: 20 },
    ],
    activity: [
        { time: '10:30', text: 'Nueva licitación en Madrid (>90%)', type: 'success' },
        { time: '09:15', text: 'Competidor detectado en Cataluña', type: 'warning' },
        { time: 'Ayer', text: 'Informe mensual generado', type: 'info' },
    ],
    alerts: [
        { text: 'Bajada de demanda prevista en Andalucía (-5%)', level: 'high' },
        { text: 'Stock bajo para productos Boreas', level: 'medium' },
    ],
    kpis: {
        opportunities: { value: 24, trend: '+12% vs mes anterior' },
        activeRegions: { value: 3, status: 'Expansión en curso' },
        potentialClients: { value: 156, status: 'Alta probabilidad' }
    }
};

let tasksData = [
    { id: 't1', title: 'Contactar a Director de Compras - Hospital La Paz', status: 'todo', priority: 'high', category: 'Ventas', assignee: 'Ana García', dueDate: '12 Oct' },
    { id: 't2', title: 'Preparar propuesta técnica para Hotel Riu', status: 'in-progress', priority: 'medium', category: 'Presupuesto', assignee: 'Carlos Ruiz', dueDate: '14 Oct' },
    { id: 't3', title: 'Revisión de normativa ISO-9001', status: 'done', priority: 'low', category: 'Calidad', assignee: 'Ana García', dueDate: '10 Oct' },
    { id: 't4', title: 'Actualizar catálogo de Boreas en CRM', status: 'todo', priority: 'low', category: 'Admin', assignee: 'Lucía M.', dueDate: '20 Oct' },
    { id: 't5', title: 'Visita técnica: Planta Seat Martorell', status: 'in-progress', priority: 'high', category: 'Visita', assignee: 'Carlos Ruiz', dueDate: '15 Oct' },
];

// --- ENDPOINTS ---

// Auth
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Get credentials from environment variables
    const validEmail = process.env.LOGIN_EMAIL || 'admin@test.com';
    const validPassword = process.env.LOGIN_PASSWORD || 'admin123';

    if (email === validEmail && password === validPassword) {
        res.json({
            success: true,
            user: {
                id: 1,
                name: 'Usuario Principal',
                email,
                role: 'admin'
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Credenciales inválidas. Verifique su email y contraseña.'
        });
    }
});

// Dashboard
app.get('/api/dashboard', (req, res) => {
    res.json(dashboardData);
});

// Products
app.get('/api/products', (req, res) => {
    const { sector, region } = req.query;
    let filtered = [...productsData];

    // 1. Filter by Sector
    if (sector && sector !== 'Todos') {
        const searchSector = sector.toLowerCase();
        filtered = filtered.filter(p =>
            p.targetSectors.some(s => s.toLowerCase().includes(searchSector))
        );
    }

    // 2. Region Logic (Sorting/Boosting)
    if (region) {
        const warmRegions = ['Andalucía', 'Comunidad Valenciana', 'Murcia', 'Canarias'];
        const coldRegions = ['Galicia', 'Castilla y León', 'País Vasco'];
        const industrialHubs = ['Comunidad de Madrid', 'Cataluña'];

        if (warmRegions.includes(region)) {
            filtered.sort((a, b) => {
                const aIsHeating = a.category === 'Calefacción';
                const bIsHeating = b.category === 'Calefacción';
                if (aIsHeating && !bIsHeating) return 1;
                if (!aIsHeating && bIsHeating) return -1;
                return 0;
            });
        } else if (coldRegions.includes(region)) {
            filtered.sort((a, b) => {
                const aRelevant = a.category === 'Calefacción' || a.category === 'Climatización';
                const bRelevant = b.category === 'Calefacción' || b.category === 'Climatización';
                if (aRelevant && !bRelevant) return -1;
                if (!aRelevant && bRelevant) return 1;
                return 0;
            });
        } else if (industrialHubs.includes(region)) {
            filtered.sort((a, b) => {
                const aTech = a.category === 'Ventilación' || a.category === 'Energía';
                const bTech = b.category === 'Ventilación' || b.category === 'Energía';
                if (aTech && !bTech) return -1;
                if (!aTech && bTech) return 1;
                return 0;
            });
        }
    }

    // 3. Fallback
    if (filtered.length === 0) {
        filtered = [...productsData];
    }

    res.json(filtered);
});

app.get('/api/products/niche', (req, res) => {
    res.json(nicheData);
});

app.get('/api/products/niche-analysis', (req, res) => {
    res.json(nicheData);
});

// Opportunities
app.get('/api/opportunities', (req, res) => {
    res.json(opportunitiesData);
});

app.get('/api/opportunities/strategy/:region', (req, res) => {
    const region = req.params.region;
    const strategy = strategies[region] || strategies['default'];
    res.json(strategy);
});

// Operations
app.get('/api/operations/tasks', (req, res) => {
    res.json(tasksData);
});

app.post('/api/operations/tasks', (req, res) => {
    const newTask = { ...req.body, id: `t${Date.now()}` };
    tasksData.push(newTask);
    res.json(newTask);
});

app.put('/api/operations/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    tasksData = tasksData.map(t => t.id === id ? { ...t, status } : t);
    res.json({ success: true });
});

// Reports
app.get('/api/reports/generate', (req, res) => {
    const { type } = req.query;
    const doc = new PDFDocument();
    const filename = `Informe_${type ? type.toUpperCase() : 'GENERAL'}_${Date.now()}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // --- HEADER ---
    let title = 'Informe Ejecutivo';
    if (type === 'operational') title = 'Informe Operativo (Kanban)';
    if (type === 'sustainability') title = 'Informe de Sostenibilidad (Retrofit)';
    if (type === 'market') title = 'Inteligencia de Mercado';

    doc.fontSize(25).text(title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()} | SaaS-SIACLI`, { align: 'center' });
    doc.moveDown(2);

    // --- CONTENT BASED ON TYPE ---

    if (type === 'operational') {
        doc.fontSize(16).text('Estado de Operaciones', { underline: true });
        doc.moveDown();
        doc.fontSize(12);

        // Group tasks by status
        const tasksByStatus = { 'todo': [], 'in-progress': [], 'done': [] };
        // Assuming tasksData exists (it's in memory in this file)
        // Note: In a real app we would filter tasksData. For now we use the global variable.
        if (typeof tasksData !== 'undefined') {
            tasksData.forEach(t => {
                if (tasksByStatus[t.status]) tasksByStatus[t.status].push(t);
            });
        }

        doc.text(`Tareas Pendientes: ${tasksByStatus['todo'].length}`);
        doc.text(`En Curso: ${tasksByStatus['in-progress'].length}`);
        doc.text(`Completadas: ${tasksByStatus['done'].length}`);
        doc.moveDown();

        doc.fontSize(14).text('Detalle de Tareas en Curso:', { underline: false });
        doc.moveDown(0.5);
        tasksByStatus['in-progress'].forEach(t => {
            doc.fontSize(10).text(`• [${t.priority.toUpperCase()}] ${t.title} - ${t.assignee}`);
        });

    } else if (type === 'sustainability') {
        doc.fontSize(16).text('Análisis de Retrofit', { underline: true });
        doc.moveDown();
        doc.fontSize(12);
        doc.text('Este informe detalla el impacto potencial de la renovación de equipos.');
        doc.moveDown();

        doc.fontSize(14).text('Productos Recomendados para Eficiencia:', { underline: false });
        doc.moveDown(0.5);
        productsData.filter(p => p.category === 'Energía' || p.category === 'Climatización').forEach(p => {
            doc.fontSize(10).text(`• ${p.name}`);
            doc.text(`  Características: ${p.features.join(', ')}`, { color: 'gray' });
            doc.moveDown(0.5);
        });

    } else if (type === 'market') {
        doc.fontSize(16).text('Inteligencia de Mercado', { underline: true });
        doc.moveDown();
        doc.fontSize(12);

        doc.text('Análisis de competidores y saturación por región.');
        doc.moveDown();

        opportunitiesData.forEach(op => {
            doc.text(`Región: ${op.name}`);
            doc.fontSize(10).text(`Competencia: ${op.factors.competition}/100 | Mercado: ${op.factors.market}/100`);
            doc.moveDown(0.5);
            doc.fontSize(12);
        });

    } else {
        // Default: Executive
        doc.fontSize(16).text('Resumen de Oportunidades (Top 5)', { underline: true });
        doc.moveDown();
        doc.fontSize(12);

        opportunitiesData.slice(0, 5).forEach(op => {
            doc.text(`• ${op.name}`);
            doc.fontSize(10).text(`   Potencial: ${op.potential} | Score: ${op.value}/100`, { color: 'gray' });
            doc.text(`   ${op.description}`);
            doc.moveDown();
            doc.fontSize(12).fillColor('black');
        });

        doc.moveDown();
        doc.fontSize(16).text('Estado del Sistema', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(`Total Productos Activos: ${productsData.length}`);
        doc.text(`Total Oportunidades Detectadas: ${opportunitiesData.length}`);
    }

    doc.end();
});

app.listen(port, () => {
    console.log(`SaaS-SIACLI Backend listening on port ${port}`);
});
