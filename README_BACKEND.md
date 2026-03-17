# 🚀 Backend Stripe - Vercel Serverless

Este proyecto incluye un backend serverless en Vercel para procesar pagos reales con Stripe.

---

## 📁 Estructura del Backend

```
terramar-app/
├── api/
│   ├── create-payment-intent.js    # Endpoint para crear pagos
│   └── package.json                # Dependencias del API
├── .env                            # Variables de entorno (NO subir a GitHub)
├── .env.example                    # Ejemplo de variables (sí subir a GitHub)
└── vercel.json                     # Configuración de Vercel
```

---

## 🔧 Configuración en Vercel

### Paso 1: Subir el código a GitHub

```bash
git add .
git commit -m "Agregar backend Stripe con Vercel Serverless"
git push origin main
```

### Paso 2: Conectar repositorio en Vercel

1. Ve a https://vercel.com
2. Haz clic en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. En **"Configure Project"**, agrega las siguientes **Environment Variables**:

| Variable | Valor |
|----------|-------|
| `STRIPE_SECRET_KEY` | `sk_test_TU_CLAVE_SECRETA_AQUI` |
| `VITE_PAYPAL_CLIENT_ID` | `TU_PAYPAL_CLIENT_ID_AQUI` |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_test_TU_CLAVE_PUBLICA_AQUI` |

5. Haz clic en **"Deploy"**

---

## 🎯 Endpoints del API

### `POST /api/create-payment-intent`

Crea un PaymentIntent de Stripe para procesar un pago.

**Request:**
```json
{
  "amount": 500,
  "currency": "usd"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

---

## 🧪 Probar Pagos en Modo Prueba

### Tarjetas de prueba de Stripe:

| Número | Tipo | CVV |
|--------|------|-----|
| 4242 4242 4242 4242 | Visa | 123 |
| 5555 5555 5555 4444 | Mastercard | 123 |
| 3782 822463 10005 | American Express | 1234 |

**Cualquier fecha futura** y **cualquier ZIP** funciona en modo prueba.

---

## 🔄 Flujo de Pago

1. **Frontend** → Llama a `/api/create-payment-intent` con el monto
2. **Backend** → Crea PaymentIntent en Stripe y devuelve `clientSecret`
3. **Frontend** → Usa `confirmCardPayment` con el `clientSecret`
4. **Stripe** → Procesa el pago y confirma
5. **Frontend** → Recibe confirmación y completa la reserva

---

## ⚠️ Importante: Producción

Para usar en **producción** (pagos reales):

1. Cambia las claves de Stripe a **Live Mode** en tu dashboard de Stripe
2. Actualiza las variables en Vercel:
   - `VITE_STRIPE_PUBLIC_KEY` → `pk_live_...`
   - `STRIPE_SECRET_KEY` → `sk_live_...`
3. Haz un nuevo deploy en Vercel

---

## 🛠️ Comandos Útiles

### Probar localmente con Vercel CLI:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Link al proyecto
vercel link

# Pull environment variables
vercel env pull

# Desarrollo local con funciones serverless
vercel dev
```

---

## 📞 Soporte

Si tienes problemas:

1. Verifica las environment variables en Vercel
2. Revisa los logs en Vercel Dashboard → Functions
3. Asegúrate que las claves de Stripe sean correctas
