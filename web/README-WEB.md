# TechShield Web Estatica

Esta version no requiere instalar Node, npm, Git, Docker ni dependencias locales. Funciona como demo con datos locales y puede guardar datos reales con Firebase gratuito.

## Como abrir

1. Entra a la carpeta `web`.
2. Abre `index.html` con doble clic.
3. Usa el menu lateral para navegar entre Dashboard, Tickets, CRM, Portal, Base, Reportes, Ajustes y Acceso.

## Como publicar sin instalaciones

Puedes subir la carpeta `web` completa a cualquier hosting estatico:

- Netlify Drop
- GitHub Pages
- cPanel / hosting compartido
- Cloudflare Pages

Solo asegurate de subir estos archivos:

- `index.html`
- `styles.css`
- `app.js`
- `_redirects`
- `assets/techshield-isotipo.png`
- `assets/techshield-logo.jpg`
- `URLS-PARA-PRUEBA.md`
- `FIREBASE-NETLIFY-PASO-A-PASO.md`

## Base de datos gratis recomendada

Para evitar Supabase y Vercel, la opcion mas simple es:

- Hosting: Netlify gratis.
- Base de datos: Firebase Firestore gratis.
- Login: Firebase Authentication gratis.
- Archivos: Firebase Storage.

Revisa `FIREBASE-NETLIFY-PASO-A-PASO.md`.

## Modo demo

Si `config.js` no tiene Firebase, la app guarda tickets y leads nuevos en `localStorage` del navegador.

## Login demo

- Administrador: `admin@techshieldsv.com` / `TechShield2026!`
- Tecnico: `tecnico@techshieldsv.com` / `TechShield2026!`
- Vendedor: `ventas@techshieldsv.com` / `TechShield2026!`
- Cliente: `cliente@example.com` / `TechShield2026!`
