# Firebase + Netlify paso a paso

Esta es la ruta recomendada si quieres evitar Supabase y Vercel. La app funciona como sitio estatico en Netlify y guarda datos reales en Firebase.

## 1. Crear proyecto Firebase

1. Entra a Firebase Console: `https://console.firebase.google.com/`.
2. Crea un proyecto llamado `techshield-support-crm`.
3. Agrega una app Web.
4. Copia el objeto de configuracion que Firebase muestra.

## 2. Activar servicios

Activa estos servicios:

- Authentication: proveedor Email/Password.
- Firestore Database: modo production.
- Storage: para adjuntos de tickets y documentos.

## 3. Crear usuarios demo

En Authentication crea:

- `admin@techshieldsv.com` / `TechShield2026!`
- `tecnico@techshieldsv.com` / `TechShield2026!`
- `ventas@techshieldsv.com` / `TechShield2026!`
- `cliente@example.com` / `TechShield2026!`

Cuando estos usuarios entren por primera vez, la app creara automaticamente su perfil en la coleccion `users` con el rol correcto.

## 4. Configurar la app

Abre `web/config.js` y pega los valores de Firebase:

```js
window.TECHSHIELD_CONFIG = {
  APP_ENV: "production",
  DEFAULT_COMPANY_ID: "techshield",
  FIREBASE_CONFIG: {
    apiKey: "AIza...",
    authDomain: "techshield-support-crm.firebaseapp.com",
    projectId: "techshield-support-crm",
    storageBucket: "techshield-support-crm.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:xxxxxxxxxxxxxxxx"
  },
  DEMO_ROLES: {
    "admin@techshieldsv.com": "admin",
    "tecnico@techshieldsv.com": "technician",
    "ventas@techshieldsv.com": "sales",
    "cliente@example.com": "client"
  }
};
```

## 5. Reglas Firestore

En Firebase Console:

1. Ve a Firestore Database.
2. Abre la pestana Rules.
3. Copia el contenido de `../firebase/firestore.rules`.
4. Publica los cambios.

Estas reglas usan roles y `companyId`. Para la demo ya incluyen los correos de prueba.

## 6. Indices Firestore opcionales

La app actual funciona sin crear indices manuales. Firebase crea indices simples automaticamente.

Si mas adelante quieres reportes con filtros y ordenamientos avanzados en servidor, puedes crear estos indices opcionales:

Opcion manual:

1. Ve a Firestore Database > Indexes.
2. Crea un indice para cada coleccion:
   - `tickets`: `companyId` Ascending, `createdAt` Descending.
   - `leads`: `companyId` Ascending, `createdAt` Descending.
   - `opportunities`: `companyId` Ascending, `createdAt` Descending.
   - `activities`: `companyId` Ascending, `createdAt` Descending.

Opcion con Firebase CLI si instalas la CLI:

```bash
firebase deploy --only firestore:indexes
```

## 7. Reglas Storage

1. Ve a Storage.
2. Abre Rules.
3. Copia el contenido de `../firebase/storage.rules`.
4. Publica los cambios.

Los adjuntos se deben guardar bajo rutas como:

```txt
companies/techshield/tickets/TS-1052/archivo.pdf
```

## 8. Publicar en Netlify

Opcion rapida:

1. Entra a Netlify Drop.
2. Arrastra la carpeta `web`.
3. Abre la URL publica.

Opcion con GitHub:

1. Sube este proyecto a GitHub.
2. En Netlify selecciona Add new site > Import an existing project.
3. Build command: dejar vacio.
4. Publish directory: `web`.
5. Deploy.

## 9. Primer inicio

1. Abre la URL publicada.
2. Entra a `#login`.
3. Inicia sesion con `admin@techshieldsv.com`.
4. La app creara `users/{uid}`.
5. Si Firestore esta vacio, la app sembrara tickets, leads, oportunidades y actividades demo.

## Colecciones usadas

- `users`
- `tickets`
- `leads`
- `opportunities`
- `activities`
- `contacts`
- `companies`
- `quotations`
- `knowledge_base`
- `notifications`

La version actual crea `tickets` y `leads` desde la interfaz, lee el pipeline y la agenda desde Firestore, y siembra datos demo la primera vez.
