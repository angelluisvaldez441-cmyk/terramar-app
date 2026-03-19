# 🔍 Diagnóstico de Problemas

## Por favor, sigue estos pasos:

### 1. Abre la aplicación
```
http://localhost:5173
```

### 2. Abre la consola (F12)

### 3. Verifica estos mensajes:

#### ✅ Si todo está bien, deberías ver:
```
✅ Firebase inicializado correctamente (terramar-app)
```

#### ❌ Si hay error, podrías ver:
```
❌ Error al inicializar Firebase: ...
```

### 4. Haz una reserva de prueba

### 5. Verifica en la consola:
```
✅ Reserva guardada en Firebase: TTM-XXXXX
```
O
```
⚠️ Reserva guardada en localStorage: TTM-XXXXX
```

### 6. Ve al admin (click en 🔒 → login)

### 7. Verifica si ves las reservas

---

## Posibles Problemas y Soluciones:

### Problema 1: Pantalla blanca
**Causa:** Error en JavaScript
**Solución:** Revisa la consola (F12) y busca errores en rojo

### Problema 2: Admin no carga
**Causa:** Sesión no verificada
**Solución:** 
```javascript
// En la consola, ejecuta:
localStorage.setItem('admin_logged_in', 'true')
location.reload()
```

### Problema 3: Reservas no aparecen
**Causa:** Firebase no está sincronizando
**Solución:**
1. Verifica Firebase Console: https://console.firebase.google.com/
2. Selecciona: terramar-app
3. Ve a: Firestore Database
4. ¿Ves la colección "reservas"?

### Problema 4: Fotos no aparecen
**Causa:** No hay fotos guardadas
**Solución:** Ve al admin → Gestionar Fotos → Sube fotos

---

## Comandos de Diagnóstico:

### En la consola del navegador (F12):

```javascript
// Verificar Firebase
console.log('Firebase disponible:', window.firebaseDisponible)

// Verificar sesión admin
console.log('Admin logged:', localStorage.getItem('admin_logged_in'))

// Verificar reservas en localStorage
console.log('Reservas en localStorage:', localStorage.getItem('reservas_terramar'))

// Forzar recarga de sesión
localStorage.setItem('admin_logged_in', 'true')
location.reload()
```

---

## Por favor, reporta:

1. ¿Qué URL estás usando?
2. ¿Qué página no carga?
3. ¿Qué errores ves en la consola (F12)?
4. ¿Puedes hacer login en el admin?
5. ¿Ves las reservas en el admin?
