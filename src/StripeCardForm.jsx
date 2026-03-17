import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// ============================================
// ESTILOS DEL ELEMENTO CARD DE STRIPE
// ============================================

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a1a',
      '::placeholder': {
        color: '#8B8B8B',
      },
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    invalid: {
      color: '#d32f2f',
      iconColor: '#d32f2f',
    },
  },
  hidePostalCode: true,
}

// ============================================
// COMPONENTE STRIPE CARD FORM
// ============================================

export function StripeCardForm({ amount, onSuccess, onError, disabled }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [cardComplete, setCardComplete] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe no está cargado correctamente')
      return
    }

    if (error) {
      setError(null)
    }

    if (!cardComplete) {
      setError('Por favor completa los datos de tu tarjeta')
      return
    }

    setProcessing(true)

    try {
      // 1. Llamar al backend para crear el PaymentIntent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'usd',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al crear el pago')
      }

      const { clientSecret, paymentIntentId } = await response.json()

      // 2. Confirmar el pago con Stripe usando el clientSecret del backend
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      )

      if (stripeError) {
        setError(stripeError.message)
        onError?.(stripeError.message)
        setProcessing(false)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        const cardType = paymentIntent.payment_method?.card?.brand || 'visa'
        const last4 = paymentIntent.payment_method?.card?.last4 || '4242'

        onSuccess({
          paymentIntentId: paymentIntent.id,
          cardType,
          last4,
          testMode: true,
        })
      }

      setProcessing(false)
    } catch (err) {
      setError('Error al procesar el pago. Por favor intenta de nuevo.')
      onError?.(err.message)
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="stripe-form-header">
        <h4 style={{ margin: '0 0 16px 0', color: 'var(--verde-primario)' }}>
          💳 Pago con Tarjeta
        </h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#8B8B8B' }}>
          Pago seguro procesado por Stripe - <strong>RD${amount.toLocaleString()}</strong>
        </p>
      </div>

      {/* Elemento Card de Stripe */}
      <div className="stripe-card-element">
        <CardElement
          options={cardElementOptions}
          onChange={(e) => {
            setError(null)
            setCardComplete(e.complete)
          }}
        />
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="stripe-error-message" style={{
          marginTop: '12px',
          padding: '12px',
          background: '#ffebee',
          borderRadius: '8px',
          color: '#c62828',
          fontSize: '0.9rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Botón de pago */}
      <button
        type="submit"
        className="btn btn-stripe"
        disabled={!stripe || processing || !cardComplete || disabled}
        style={{
          width: '100%',
          marginTop: '20px',
          padding: '14px 20px',
          background: 'linear-gradient(135deg, #635bff 0%, #00d4ff 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: !stripe || processing || !cardComplete ? 'not-allowed' : 'pointer',
          opacity: !stripe || processing || !cardComplete ? 0.6 : 1,
          transition: 'all 0.3s ease',
        }}
      >
        {processing ? '⏳ Procesando...' : `Pagar RD$${amount.toLocaleString()}`}
      </button>

      <style>{`
        .stripe-payment-form {
          width: 100%;
        }

        .stripe-form-header {
          margin-bottom: 20px;
        }

        .stripe-card-element {
          padding: 14px 16px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .stripe-card-element:focus-within {
          border-color: #635bff;
          box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.1);
        }

        .btn-stripe:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 91, 255, 0.4);
        }

        .btn-stripe:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </form>
  )
}
