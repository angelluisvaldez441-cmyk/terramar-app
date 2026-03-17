# 🎯 DEPLOY EN VERCEL - PASO A PASO

## ✅ Antes de empezar

Asegúrate de tener:
- Tu repositorio en GitHub con todo el código subido
- Cuenta en Vercel (https://vercel.com)

---

## 📦 PASO 1: Subir cambios a GitHub

```bash
cd "c:\Users\pinap\Downloads\proyecto nuevo\terramar-app"
git add .
git commit -m "Agregar backend Stripe para pagos reales"
git push origin main
```

---

## 🚀 PASO 2: Deploy en Vercel

### Opción A: Desde la web de Vercel

1. **Ve a https://vercel.com** e inicia sesión

2. **Haz clic en "Add New Project"**

3. **Importa tu repositorio de GitHub**
   - Busca "terramar-app" en la lista
   - Haz clic en "Import"

4. **Configura las Environment Variables**
   
   Haz clic en **"Environment Variables"** y agrega:

   | Name | Value |
   |------|-------|
   | `STRIPE_SECRET_KEY` | `sk_test_TU_CLAVE_SECRETA_AQUI` |
   | `VITE_PAYPAL_CLIENT_ID` | `TU_PAYPAL_CLIENT_ID_AQUI` |
   | `VITE_STRIPE_PUBLIC_KEY` | `pk_test_TU_CLAVE_PUBLICA_AQUI` |

5. **Haz clic en "Deploy"**

6. **¡Listo!** En ~1 minuto tu app estará online con el backend funcionando

---

### Opción B: Desde Vercel CLI (alternativa)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Luego configura las variables de entorno en el dashboard de Vercel.

---

## ⚙️ PASO 3: Configurar Dominio (Opcional)

1. En Vercel Dashboard, ve a tu proyecto
2. Ve a **"Settings" → "Domains"**
3. Agrega tu dominio personalizado (si tienes uno)

---

## 🧪 PASO 4: Probar Pagos

### En modo prueba:

1. Abre tu app deployada en Vercel
2. Ve a la sección de reservas
3. Selecciona **"Tarjeta"** como método de pago
4. Usa una tarjeta de prueba:

   - **Número:** `4242 4242 4242 4242`
   - **Expiración:** `12/34` (cualquier fecha futura)
   - **CVV:** `123`
   - **ZIP:** `12345`

5. Completa el pago y verifica que se procese correctamente

---

## 🔄 Actualizar el Deploy

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Tu mensaje de cambio"
git push origin main
```

Vercel hará **auto-deploy** automáticamente.

---

## 📊 Ver Logs del Backend

1. Ve a Vercel Dashboard → Tu proyecto
2. Haz clic en **"Functions"**
3. Selecciona `api/create-payment-intent`
4. Haz clic en **"Logs"** para ver errores o depurar

---

## 🎯 Producción (Pagos Reales)

Cuando estés listo para producción:

1. **Obtén claves Live de Stripe:**
   - Ve a https://dashboard.stripe.com/apikeys
   - Copia las claves `pk_live_...` y `sk_live_...`

2. **Actualiza en Vercel:**
   - Settings → Environment Variables
   - Edita `VITE_STRIPE_PUBLIC_KEY` y `STRIPE_SECRET_KEY`
   - Haz clic en "Save"

3. **Redeploy:**
   - Ve a "Deployments"
   - Haz clic en los 3 puntos → "Redeploy"

---

## ❓ Solución de Problemas

### Error: "No client secret"
- Verifica que `STRIPE_SECRET_KEY` esté configurada en Vercel

### Error: "CORS"
- El archivo `vercel.json` ya incluye los headers CORS

### El pago no se procesa
- Revisa los logs en Vercel Functions
- Verifica que las claves de Stripe sean correctas

---

## 📞 ¿Necesitas ayuda?

- Docs de Vercel: https://vercel.com/docs
- Docs de Stripe: https://stripe.com/docs
- Soporte de Vercel: https://vercel.com/support
