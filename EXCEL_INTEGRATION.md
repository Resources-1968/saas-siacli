# Guía de Integración de Datos (Excel)

He generado 3 plantillas Excel en la carpeta `backend/templates/`. Sigue estos pasos para integrar tus datos reales.

## 1. Descarga y Rellena las Plantillas
Encontrarás estos archivos en tu proyecto. Ábrelos con Excel y rellena tus datos respetando las columnas.

### `plantilla_productos.xlsx`
*   **targetSectors**: Separa los sectores con comas (ej: "Hospitales, Oficinas").
*   **features**: Separa las características con comas.

### `plantilla_oportunidades.xlsx`
*   **lat/lng**: Coordenadas geográficas (puedes sacarlas de Google Maps).
*   **factores**: Números del 0 al 100.

### `plantilla_estrategias.xlsx`
*   **region**: Debe coincidir exactamente con el nombre en `plantilla_oportunidades.xlsx`.

## 2. Cómo Integrar los Datos (Automático)
Una vez tengas los Excel rellenos:

1.  Guárdalos en la carpeta `backend/data/` (tendrás que crearla).
2.  El sistema necesita un pequeño script para leer estos Excel al arrancar.

### Pasos Técnicos para el Desarrollador (o para ti):
1.  Instalar la librería `xlsx` en el backend (ya hecho).
2.  Modificar `server.js` para que, en lugar de usar las variables `const productsData = [...]`, lea directamente del archivo Excel.

**Ejemplo de código para `server.js`:**
```javascript
const XLSX = require('xlsx');

function loadExcel(filename) {
    const workbook = XLSX.readFile(`./data/${filename}`);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
}

// Reemplazar datos estáticos
const productsData = loadExcel('mis_productos.xlsx').map(p => ({
    ...p,
    targetSectors: p.targetSectors.split(','), // Convertir texto a lista
    features: p.features.split(',')
}));
```

## 3. Flujo de Actualización
Cada vez que quieras actualizar el catálogo o las estrategias:
1.  Editas el Excel en tu ordenador.
2.  Lo subes a la carpeta `backend/data/` del servidor.
3.  Reinicias el servidor.
