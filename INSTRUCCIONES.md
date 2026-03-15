# 🌴 Transporte TerraMar - Guía de Imágenes

## ¡Tu aplicación está lista! 🚀

La aplicación se está ejecutando en: **http://localhost:5173**

---

## 📸 ¿CÓMO CAMBIAR LAS IMÁGENES?

### Opción 1: Desde el Panel de Administración (RECOMENDADA)

1. **Abre tu navegador** y ve a `http://localhost:5173`

2. **Haz clic en el ícono 🔒** (candado) en la esquina superior derecha de la navbar

3. **Inicia sesión** con estas credenciales:
   - **Usuario:** `admin`
   - **Contraseña:** `terramar2025`

4. **Ve a la pestaña "📸 Gestionar Fotos"**

5. **Para cada vehículo/animal:**
   - Haz clic en **"📷 Cambiar foto"**
   - Selecciona la imagen desde tu computadora
   - ¡Listo! La imagen se guarda automáticamente

6. **Las imágenes que debes subir:**

   | Vehículo/Animal | Imagen |
   |-----------------|--------|
   | 🏍️ Moto | `https://kayencorp.com/wp-content/uploads/2025/09/moto-scooter-milano-con-bateria-plomo-acido-scaled.webp` |
   | 🚙 Jeep 4x4 | (usa el base64 que me enviaste o súbelo desde tu computadora) |
   | 🏎️ Quad | (usa el base64 que me enviaste o súbelo desde tu computadora) |
   | 🚤 Lancha | (usa el base64 que me enviaste o súbelo desde tu computadora) |
   | 🐴 Caballo | (usa el base64 que me enviaste o súbelo desde tu computadora) |
   | 🫏 Burro | (usa el base64 que me enviaste o súbelo desde tu computadora) |
   | 🐎 Mula | (usa el base64 que me enviaste o súbelo desde tu computadora) |

---

### Opción 2: Editando el Código

Si prefieres editar el código directamente:

1. Abre el archivo: `src/App.jsx`

2. Busca la sección `VEHICULOS` y `ANIMALES`

3. Cambia el valor de `emoji` por la URL de tu imagen:

```javascript
{
  id: 'moto',
  nombre: 'Moto',
  descripcion: '...',
  precio: 1500,
  precioTexto: 'RD$1,500/día',
  emoji: 'https://tu-url-de-imagen.com/foto.jpg'  // ← Aquí
},
```

---

## 💡 Consejos

- **Las imágenes se guardan en el navegador** (localStorage), así que persisten aunque cierres la app
- **Puedes hacer clic en la vista previa** de la foto para cambiarla más rápido
- **Usa el botón "🔄 Restablecer Fotos"** para volver a las imágenes predeterminadas (emojis)
- **Formatos recomendados:** JPG, PNG, WebP
- **Tamaño máximo recomendado:** 500KB por imagen para mejor rendimiento

---

## 🎨 Características de la App

✅ **Navbar fija** con logo y navegación  
✅ **Hero section** con gradiente verde impactante  
✅ **Catálogo de Vehículos** (Moto, Jeep, Quad, Lancha, Entrega)  
✅ **Catálogo de Animales** (Caballo, Burro, Mula)  
✅ **Sección "¿Por qué elegirnos?"** con íconos  
✅ **Formulario de reservas en 2 pasos**  
✅ **4 métodos de pago** (Tarjeta, PayPal, Transferencia, Efectivo)  
✅ **Botón flotante de WhatsApp** (abre https://wa.me/18297234139)  
✅ **Panel de administración** con gestión de fotos y reservas  
✅ **Diseño responsive** (mobile-first)  
✅ **Animaciones suaves** al hacer scroll  

---

## 🔐 Panel de Administración

- **Login:** `admin` / `terramar2025`
- **Funciones:**
  - 📸 Cambiar fotos de todos los vehículos y animales
  - 📋 Ver listado completo de reservas
  - 🔄 Restablecer todas las fotos

---

## 📞 Contacto

- **WhatsApp:** https://wa.me/18297234139
- **Teléfono:** 829-723-4139
- **Ubicación:** Barahona, República Dominicana

---

**¡Disfruta tu aplicación de Transporte TerraMar! 🌴🚗🐴**
