import Stripe from 'stripe'

// ============================================
// CONFIGURACIÓN DE STRIPE
// ============================================

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// ============================================
// HANDLER DE VERCel SERVERLESS FUNCTION
// ============================================

export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  try {
    const { amount, currency = 'usd' } = req.body

    // Validar amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Monto inválido' })
    }

    // Stripe trabaja con centavos, convertir RD$ a centavos de USD
    // Asumiendo tasa de cambio aproximada: 1 USD = 58 DOP
    const amountInUSD = Math.round(amount / 58)
    const amountInCents = amountInUSD * 100

    // Crear PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration: 'terramar-app',
      },
    })

    // Devolver clientSecret al frontend
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creando PaymentIntent:', error)
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    })
  }
}
