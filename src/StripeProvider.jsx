import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// ============================================
// CONFIGURACIÓN DE STRIPE
// ============================================

// Clave pública de Stripe (modo prueba)
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TU_CLAVE_PUBLICA_AQUI'

// Cargar Stripe una sola vez
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)

// ============================================
// PROVEEDOR STRIPE
// ============================================

export function StripeProvider({ children }) {
  const options = {
    // Opciones personalizadas para Stripe Elements
    fonts: [
      {
        cssName: 'Inter',
        font: {
          family: 'Inter, system-ui, sans-serif',
        },
      },
    ],
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2E7D32',
        colorBackground: '#ffffff',
        colorText: '#1a1a1a',
        colorDanger: '#d32f2f',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}

export { stripePromise }
