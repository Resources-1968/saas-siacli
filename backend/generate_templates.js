const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'templates');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 1. Products Template
const productsHeaders = [
    ['id', 'name', 'category', 'matchScore', 'targetSectors', 'reason', 'features']
];
const productsExample = [
    [1, 'Halton - Difusión', 'Ventilación', 95, 'Oficinas, Hospitales', 'Líder en aire exigente', 'Difusión Alta Precisión, Higiene']
];
const wbProducts = XLSX.utils.book_new();
const wsProducts = XLSX.utils.aoa_to_sheet([...productsHeaders, ...productsExample]);
XLSX.utils.book_append_sheet(wbProducts, wsProducts, 'Productos');
XLSX.writeFile(wbProducts, path.join(outputDir, 'plantilla_productos.xlsx'));

// 2. Opportunities Template
const opportunitiesHeaders = [
    ['id', 'name', 'lat', 'lng', 'value', 'potential', 'description', 'factor_market', 'factor_construction', 'factor_industry', 'factor_competition', 'factor_logistics']
];
const opportunitiesExample = [
    [1, 'Comunidad de Madrid', 40.4168, -3.7038, 85, 'Alto', 'Alta demanda oficinas', 95, 90, 60, 80, 95]
];
const wbOpportunities = XLSX.utils.book_new();
const wsOpportunities = XLSX.utils.aoa_to_sheet([...opportunitiesHeaders, ...opportunitiesExample]);
XLSX.utils.book_append_sheet(wbOpportunities, wsOpportunities, 'Oportunidades');
XLSX.writeFile(wbOpportunities, path.join(outputDir, 'plantilla_oportunidades.xlsx'));

// 3. Strategies Template
const strategiesHeaders = [
    ['region', 'focus', 'logistics', 'marketing', 'keyAction', 'persona_role', 'persona_pain', 'persona_gain']
];
const strategiesExample = [
    ['Comunidad de Madrid', 'Rehabilitación oficinas', 'Hub Coslada', 'Eventos IFEMA', 'Alianza arquitectos', 'Facility Manager', 'Costes altos', 'Eficiencia']
];
const wbStrategies = XLSX.utils.book_new();
const wsStrategies = XLSX.utils.aoa_to_sheet([...strategiesHeaders, ...strategiesExample]);
XLSX.utils.book_append_sheet(wbStrategies, wsStrategies, 'Estrategias');
XLSX.writeFile(wbStrategies, path.join(outputDir, 'plantilla_estrategias.xlsx'));

console.log('Templates generated in backend/templates/');
