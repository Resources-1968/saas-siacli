# Guía de Mantenimiento y Solución de Problemas

Esta guía te ayudará a identificar y solucionar errores cuando la aplicación esté funcionando con datos reales.

## 1. Arquitectura del Sistema
La aplicación está dividida en dos partes:
- **Frontend (React)**: Lo que ve el usuario. Se encarga de la interfaz y de pedir datos.
- **Backend (Express)**: El "cerebro". Procesa los datos, filtros y lógica de negocio.

## 2. ¿Dónde está el error?

### Caso A: La pantalla se queda en blanco o un botón no funciona
*   **Origen probable**: Frontend.
*   **Cómo investigar**:
    1.  Abre las **Herramientas de Desarrollador** del navegador (F12 o clic derecho -> Inspeccionar).
    2.  Ve a la pestaña **Console**.
    3.  Busca errores en rojo.
*   **Solución**: Revisar el componente React correspondiente en `src/components/`.

### Caso B: Los datos no cargan, están vacíos o son incorrectos
*   **Origen probable**: Backend o Conexión.
*   **Cómo investigar**:
    1.  En el navegador, ve a la pestaña **Network** (Red).
    2.  Recarga la página o realiza la acción.
    3.  Busca la petición en rojo (ej: `dashboard`, `products`).
    4.  Si la petición falló (Status 500 o 400), revisa la terminal donde corre el backend (`npm run start`).
*   **Solución**: Revisar la lógica en `backend/server.js`.

## 3. Pasos para arreglar un Bug

1.  **Reproducir**: Asegúrate de que puedes hacer que el error ocurra consistentemente.
2.  **Localizar**:
    - Si es visual (colores, alineación) -> `src/index.css` o clases Tailwind en el componente.
    - Si es lógica de cliente (el simulador no calcula bien) -> Componente React (ej: `OpportunitiesMap.jsx`).
    - Si es lógica de servidor (el filtro de productos no devuelve lo correcto) -> `backend/server.js`.
3.  **Corregir**: Edita el código.
    - **Frontend**: Los cambios se ven al instante (HMR).
    - **Backend**: `nodemon` reiniciará el servidor automáticamente al guardar.

## 4. Logs Útiles
Hemos dejado `console.log` estratégicos en el código:
- **Frontend**: Muestra qué filtros se están enviando.
- **Backend**: Muestra en la terminal cuándo se inicia el servidor y si hay errores de conexión.

## 5. Escalabilidad Futura
Si el `server.js` crece mucho:
- Mueve los datos a una base de datos real (MongoDB, PostgreSQL).
- Separa las rutas en archivos distintos (`routes/products.js`, `routes/auth.js`).
