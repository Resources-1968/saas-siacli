# Requisitos de Datos para SaaS-SIACLI

Para que el sistema funcione con datos reales de tu empresa, necesitas alimentar la base de datos (actualmente en `server.js`) con la siguiente información estructurada.

## 1. Catálogo de Productos (`productsData`)
Necesitas un inventario de tus soluciones con estos campos para que el **Recomendador IA** funcione:
*   **ID**: Identificador único.
*   **Nombre**: Nombre comercial del producto.
*   **Categoría**: (Ej: Ventilación, Climatización, Calefacción).
*   **Sectores Objetivo**: Lista de sectores para los que es ideal (Ej: ["Hospitales", "Oficinas"]). *Crucial para el filtrado.*
*   **Score de Ajuste (MatchScore)**: (Opcional) Puede ser calculado dinámicamente, o asignado manualmente basado en la prioridad de venta.
*   **Características**: Lista de puntos fuertes (Ej: "Sin Conductos", "Alto COP").

## 2. Datos de Oportunidades Regionales (`opportunitiesData`)
Para el **Mapa Interactivo**, necesitas datos de mercado por región:
*   **Región**: Nombre de la CCAA o zona.
*   **Coordenadas**: Latitud/Longitud para pintar el punto en el mapa.
*   **Valor Potencial**: Estimación en Euros del mercado total accesible.
*   **Factores (0-100)**: *Estos alimentan la IA Predictiva.*
    *   *Mercado*: Demanda general.
    *   *Construcción*: Nivel de obra nueva.
    *   *Industria*: Potencia del tejido industrial.
    *   *Competencia*: Nivel de saturación de rivales.
    *   *Logística*: Facilidad de distribución en la zona.

## 3. Estrategias de Entrada (`strategies`)
Para que el **Modal de Estrategia** sea útil, tu equipo de marketing/ventas debe definir:
*   **Foco**: ¿A qué nicho vamos en esta región?
*   **Logística**: ¿Cómo llegamos allí? (Ej: "Hub en Antequera").
*   **Acción Clave**: ¿Qué debe hacer el comercial primero?
*   **Buyer Persona**: ¿Quién es el cliente tipo? (Rol, Dolor, Ganancia).

## 4. Operativa (`tasksData`)
Inicialmente puede estar vacío, pero el sistema espera:
*   **Tareas**: Título, Estado (todo, in-progress, done), Prioridad, Asignado a (Empleado), Fecha Límite.

## 5. Dashboard (`dashboardData`)
Para los **KPIs**, necesitas conectar tus sistemas actuales (ERP/CRM) para obtener:
*   Ventas mensuales proyectadas.
*   Alertas de stock o demanda.
*   Actividad reciente (licitaciones, competidores).
