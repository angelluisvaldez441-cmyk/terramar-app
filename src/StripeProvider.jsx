import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// ============================================
// CONFIGURACIÓN DE STRIPE
// ============================================
// Clave pública de Stripe (modo prueba)
// En producción, usa la clave real desde variables de entorno
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
        cssSrc: 'https://fonts.googleapis.com/css?family=Inter',
      },
    ],
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#27ae60',
        colorBackground: '#ffffff',
        colorText: '#333333',
        colorDanger: '#e74c3c',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      },
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}

// Exportar para uso directo si es necesario
export { stripePromise }
