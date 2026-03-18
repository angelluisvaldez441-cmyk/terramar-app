# ✅ Firebase Configurado - Sincronización en Tiempo Real

## 📦 Lo que se implementó

### 1. **Firebase Firestore - Base de Datos en la Nube**

La aplicación ahora usa **Firebase Firestore** para:
- ✅ Almacenar reservas en la nube
- ✅ Guardar fotos personalizadas
- ✅ **Sincronización en tiempo real** entre dispositivos
- ✅ Acceso desde múltiples dispositivos
- ✅ Persistencia de datos automática

### 2. **Archivos Modificados**

#### `src/db.js`
- ✅ Imports estáticos de Firebase (mejor rendimiento)
- ✅ Funciones optimizadas para reservas
- ✅ Funciones optimizadas para fotos
- ✅ Listeners en tiempo real
- ✅ Fallback a localStorage si Firebase falla

#### `src/main.jsx`
- ✅ React Router configurado
- ✅ Rutas separadas para admin

#### `src/AdminPage.jsx` (NUEVO)
- ✅ Página de login profesional
- ✅ Dashboard de administración
- ✅ Gestión de fotos
- ✅ Gestión de reservas

#### `src/App.jsx`
- ✅ Simplificado (sin modales de admin)
- ✅ Navbar actualizada con enlace a admin

---

## 🔥 Proyecto de Firebase

- **Project ID:** `terramar-app-2865f`
- **Auth:** No configurado (login simple con credenciales fijas)
- **Firestore:** Base de datos configurada
- **Reglas de seguridad:** Modo prueba (puedes ajustarlas en Firebase Console)

---

## 📊 Estructura de la Base de Datos

### Colección: `reservas`
```javascript
{
  numero: "TTM-ABC123",
  nombre: "Juan Pérez",
  telefono: "829-123-4567",
  servicio: "moto",
  servicioNombre: "Moto",
  fecha: "2025-03-20",
  duracion: 2,
  total: 1600,
  deposito: 800,
  resto: 800,
  metodoPago: "tarjeta",
  entregaDomicilio: false,
  direccion: "",
  tipoEntrega: "estandar",
  mensaje: "",
  fechaReserva: "2025-03-18T...",
  estado: "confirmada"
}
```

### Colección: `fotos`
Documento: `imagenes`
```javascript
{
  photo_moto: "data:image/jpeg;base64,...",
  photo_jeep: "data:image/jpeg;base64,...",
  photo_quad: "data:image/jpeg;base64,...",
  // ... más fotos
}
```

---

## 🚀 Cómo Usar

### 1. **Ejecutar la App**
```bash
npm run dev
```

La app estará disponible en: **http://localhost:5173**

### 2. **Acceder al Panel de Administración**

1. Haz clic en el **candado 🔒** en la navbar
2. Serás redirigido a `/admin`
3. Ingresa con:
   - **Usuario:** `admin`
   - **Contraseña:** `terramar2025`

### 3. **Gestionar Fotos**

1. Ve a la pestaña **"📸 Gestionar Fotos"**
2. Haz clic en **"📷 Cambiar foto"** en cualquier vehículo/animal
3. Selecciona una imagen desde tu computadora
4. ¡Listo! La foto se guarda en Firebase y se sincroniza automáticamente

### 4. **Ver Reservas**

1. Ve a la pestaña **"📋 Ver Reservas"**
2. Verás todas las reservas en tiempo real
3. Puedes:
   - 👁️ Ver detalles completos
   - 📱 Contactar por WhatsApp
   - 🗑️ Eliminar reservas
   - 📋 Copiar información

---

## 🌐 Firebase Console

Para ver y gestionar tus datos:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto: **terramar-app-2865f**
3. Ve a **Firestore Database** en el menú izquierdo
4. ¡Verás tus datos en tiempo real!

---

## 🔒 Reglas de Seguridad (Opcional)

Para producción, puedes configurar reglas de seguridad en Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reservas: cualquiera puede leer y escribir
    match /reservas/{reservaId} {
      allow read, write: if true;
    }
    
    // Fotos: cualquiera puede leer y escribir
    match /fotos/{fotoId} {
      allow read, write: if true;
    }
  }
}
```

---

## 💡 Ventajas de Firebase

| Característica | Beneficio |
|---------------|-----------|
| **Tiempo real** | Cambios instantáneos en todos los dispositivos |
| **Nube** | Datos accesibles desde cualquier lugar |
| **Offline** | Funciona sin internet, sincroniza después |
| **Escalable** | Crece con tu negocio |
| **Gratis** | Plan gratuito generoso de Firebase |

---

## 📱 Sincronización en Tiempo Real

### ¿Cómo funciona?

1. **Abres el admin** en tu computadora
2. **Subes una foto nueva**
3. **Automáticamente** se actualiza en:
   - Tu computadora
   - Tu teléfono
   - Cualquier otro dispositivo conectado

### Ejemplo de uso:

1. **En la oficina:** Subes fotos nuevas desde la computadora
2. **En campo:** Ves las fotos actualizadas en tu teléfono
3. **Clientes:** Ven las fotos actualizadas en la web

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 📞 Soporte

- **Firebase Console:** https://console.firebase.google.com/
- **Firebase Docs:** https://firebase.google.com/docs
- **Firestore Docs:** https://firebase.google.com/docs/firestore

---

**¡Tu aplicación ahora tiene poder en la nube! ☁️🚀**
