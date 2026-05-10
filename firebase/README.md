# Configuracion Firebase para TechShield

Esta carpeta contiene las reglas e indices recomendados para usar Firebase como backend gratuito.

## Archivos

- `firestore.rules`: permisos por rol y compania.
- `storage.rules`: reglas base para adjuntos.
- `firestore.indexes.json`: indices opcionales para reportes y ordenamientos avanzados.
- `firebase.json`: referencia para Firebase CLI si decides usarlo.

## Orden recomendado

1. Crear proyecto Firebase.
2. Activar Authentication con Email/Password.
3. Crear los usuarios demo.
4. Activar Firestore en modo production.
5. Pegar `firestore.rules` en Firestore Rules.
6. Opcional: crear los indices de `firestore.indexes.json` desde Firebase Console o Firebase CLI si agregas reportes avanzados.
7. Activar Storage y pegar `storage.rules`.
8. Pegar la configuracion Web SDK en `web/config.js`.

La app crea automaticamente el documento `users/{uid}` al iniciar sesion y siembra datos demo la primera vez que Firestore esta vacio.
