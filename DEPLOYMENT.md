# Manual de despliegue TechShield

## Ruta recomendada: Netlify + Firebase

Esta ruta evita servidores complejos, Docker, Vercel y Supabase.

## 1. GitHub

1. Crea un repositorio llamado `techshield-support-crm`.
2. Sube el proyecto completo.
3. La carpeta que se publica es `web`.

## 2. Firebase gratis

1. Crea un proyecto en Firebase Console.
2. Activa Authentication con Email/Password.
3. Activa Firestore Database.
4. Activa Storage si usaras adjuntos.
5. Crea usuarios demo:
   - `admin@techshieldsv.com` / `TechShield2026!`
   - `tecnico@techshieldsv.com` / `TechShield2026!`
   - `ventas@techshieldsv.com` / `TechShield2026!`
   - `cliente@example.com` / `TechShield2026!`
6. Copia la configuracion web de Firebase.
7. Pega esa configuracion en `web/config.js`.
8. En Firestore Rules pega `firebase/firestore.rules`.
9. En Storage Rules pega `firebase/storage.rules`.
10. Opcional: crea los indices descritos en `firebase/firestore.indexes.json` si agregas reportes avanzados.

## 3. Netlify

Opcion rapida:

1. Entra a Netlify Drop.
2. Arrastra la carpeta `web`.
3. Abre la URL publicada.

Opcion profesional:

1. En Netlify, selecciona Add new site > Import an existing project.
2. Conecta GitHub.
3. Build command: vacio.
4. Publish directory: `web`.
5. Deploy.

El archivo `web/_redirects` ya permite que las rutas internas carguen `index.html`.

## 4. Verificacion

1. Abre la URL de Netlify.
2. Valida Dashboard, Tickets, CRM, Portal, Base, Reportes y Ajustes.
3. Entra con las credenciales demo.
4. Crea un ticket desde Tickets.
5. Crea un lead desde CRM.
6. Refresca la pagina y confirma que los datos se conservan.
7. Si Firebase esta configurado, revisa que se creen documentos en Firestore.

## 5. Checklist de produccion

- Dominio configurado en Netlify.
- Firebase Auth activo.
- Firestore Rules por rol y compania.
- Firebase Storage Rules para adjuntos.
- Backups/exportaciones de Firestore planificados.
- Proveedor de correo conectado.
- WhatsApp Cloud API o proveedor local conectado.
- Politica de privacidad y terminos publicados.
