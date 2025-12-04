# Guía de Despliegue (Hosting)

Esta guía te explica cómo subir tu aplicación a la nube para que sea accesible desde cualquier lugar.

## Arquitectura
*   **Frontend**: Vercel (Gratis y rápido).
*   **Backend**: Render (Gratis para empezar).
*   **Datos**: Archivos Excel (subidos junto con el código).

---

## Paso 1: Subir el Código a GitHub
Antes de nada, tu código debe estar en un repositorio de GitHub.
1.  Crea un repositorio en GitHub (ej: `saas-siacli`).
2.  Sube todo el código de este proyecto.
    *   **Importante**: Asegúrate de que la carpeta `backend/data` (con tus Excel) se sube también. Si está en `.gitignore`, quítala de ahí.

---

## Paso 2: Desplegar el Backend (Render)
El backend es el servidor que procesa los datos.

1.  Crea una cuenta en [render.com](https://render.com).
2.  Haz clic en **"New +"** -> **"Web Service"**.
3.  Conecta tu repositorio de GitHub.
4.  Configura lo siguiente:
    *   **Name**: `saas-siacli-backend`
    *   **Root Directory**: `backend` (Muy importante, porque el servidor está en esa subcarpeta).
    *   **Environment**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
5.  Haz clic en **"Create Web Service"**.
6.  Espera a que termine. Render te dará una URL (ej: `https://saas-siacli-backend.onrender.com`). **Cópiala**.

---

## Paso 3: Desplegar el Frontend (Vercel)
El frontend es la página web que ven tus empleados.

1.  Crea una cuenta en [vercel.com](https://vercel.com).
2.  Haz clic en **"Add New..."** -> **"Project"**.
3.  Importa el mismo repositorio de GitHub.
4.  Configura lo siguiente:
    *   **Framework Preset**: Vite (lo detectará solo).
    *   **Root Directory**: `.` (Déjalo como está).
    *   **Environment Variables**:
        *   Nombre: `VITE_API_URL`
        *   Valor: La URL que copiaste de Render + `/api` (ej: `https://saas-siacli-backend.onrender.com/api`).
5.  Haz clic en **"Deploy"**.

---

## ¡Listo!
Vercel te dará una URL (ej: `https://saas-siacli.vercel.app`). Esa es la dirección que debes dar a tus empleados.

### Notas Importantes
*   **Datos**: Como estamos usando Excel, los datos son "de solo lectura" en la nube. Si cambias un Excel en tu ordenador, tienes que subirlo a GitHub para que Render se actualice (tarda unos minutos).
*   **Tareas**: Las tareas que crees en el Kanban se borrarán si el servidor de Render se reinicia (porque están en memoria). Para que sean permanentes, en el futuro deberíamos conectar una base de datos real (MongoDB).
