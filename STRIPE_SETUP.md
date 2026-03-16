# 🌴 Integración de Stripe - TerraMar App

## Configuración de Stripe

### 1. Obtener las API Keys

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/register) y crea una cuenta gratuita
2. Activa el **Modo Prueba** (toggle en la parte superior)
3. Ve a **Developers > API keys**
4. Copia las claves:
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### 2. Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita `.env` y reemplaza las claves:
   ```env
   VITE_STRIPE_PUBLIC_KEY=pk_test_tu_clave_publica_aqui
   VITE_STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
   ```

### 3. Tarjetas de Prueba

Stripe proporciona números de tarjeta especiales para pruebas:

| Resultado | Número de Tarjeta |
|-----------|-------------------|
| **Éxito** (Visa) | 4242 4242 4242 4242 |
| **Éxito** (Mastercard) | 5555 5555 5555 4444 |
| **Éxito** (Amex) | 3782 822463 10005 |
| **Éxito** (Discover) | 6011 1111 1111 1117 |
| **Fallo** | 4000 0000 0000 0002 |

- **Fecha de vencimiento**: Cualquier fecha futura (ej: 12/30)
- **CVV**: Cualquier número de 3 dígitos (ej: 123)
- **Código postal**: Cualquier código de 5 dígitos (ej: 10001)

## Características Implementadas

### ✅ Detección Automática de Tarjeta
- El sistema detecta automáticamente el tipo de tarjeta mientras escribes
- Muestra el logo correspondiente (Visa, MasterCard, American Express, Discover)

### ✅ Validación Luhn
- Implementación del algoritmo Luhn para validar números de tarjeta
- Previene errores de digitación antes de enviar el pago

### ✅ Elemento Card de Stripe
- Formulario seguro proporcionado por Stripe
- Los datos de la tarjeta nunca tocan tu servidor
- Cumple con PCI DSS Level 1

### ✅ Modo Prueba (Sandbox)
- Inicialmente configurado en modo prueba
- No se realizan cobros reales
- Permite probar todo el flujo de pago

### ✅ Flujo de Reserva
1. El usuario completa el formulario de reserva
2. Selecciona pago con tarjeta
3. Ingresa los datos de su tarjeta
4. El sistema valida la tarjeta (Luhn + Stripe)
5. Se cobra el depósito (50% del total)
6. Se guarda la reserva en localStorage
7. Se muestra confirmación
8. Se envía mensaje por WhatsApp con los detalles

## Estructura de Archivos

```
terramar-app/
├── src/
│   ├── App.jsx                 # Componente principal actualizado
│   ├── StripeProvider.jsx      # Proveedor de Stripe Elements
│   └── StripeCardForm.jsx      # Formulario de tarjeta con Stripe
├── .env                        # Variables de entorno (no subir a Git)
└── .env.example                # Ejemplo de variables de entorno
```

## Componentes

### StripeProvider
Envuelve la aplicación con el contexto de Stripe Elements.

```jsx
<StripeProvider>
  <App />
</StripeProvider>
```

### StripeCardForm
Componente del formulario de pago con:
- Detección de tipo de tarjeta
- Logos de las marcas
- Validación Luhn
- Manejo de errores
- Confirmación de pago

```jsx
<StripeCardForm
  amount={deposito}
  onSuccess={handleSuccess}
  onError={handleError}
  disabled={false}
/>
```

## Producción

Para pasar a producción:

1. **Desactiva el modo prueba** en Stripe Dashboard
2. **Obtén las claves reales** (pk_live_... y sk_live_...)
3. **Actualiza las variables de entorno** en tu servidor
4. **Implementa un backend** para crear PaymentIntents (necesario para pagos reales)

### Backend Requerido para Producción

Para pagos reales, necesitarás un backend que cree PaymentIntents:

```javascript
// Ejemplo con Node.js + Express
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe usa centavos
    currency: 'usd',
  });
  
  res.send({ clientSecret: paymentIntent.client_secret });
});
```

## Soporte

Para problemas o preguntas:
- [Documentación de Stripe](https://stripe.com/docs)
- [Soporte de Stripe](https://support.stripe.com)

## Notas de Seguridad

- ⚠️ **NUNCA** subas el archivo `.env` a Git
- ⚠️ **NUNCA** compartas tu Secret Key
- ✅ Los datos de tarjeta se manejan directamente por Stripe
- ✅ Tu aplicación solo recibe un token de pago
