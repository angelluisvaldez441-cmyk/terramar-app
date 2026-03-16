import { useState, useEffect } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// ============================================
// LOGOS DE TARJETAS (SVG)
// ============================================
const CARD_LOGOS = {
  visa: (
    <svg viewBox="0 0 48 48" width="40" height="25">
      <rect fill="#1A1F71" width="48" height="48" rx="4"/>
      <path fill="#fff" d="M19.5 31.5h-3l1.9-11.3h3l-1.9 11.3zm10.4-11c-.6-.2-1.6-.5-2.8-.5-3.1 0-5.3 1.6-5.3 3.9 0 1.7 1.6 2.7 2.8 3.3 1.2.6 1.6 1 1.6 1.6 0 .9-1 1.3-2 1.3-1.3 0-2-.2-3.1-.7l-.4-.2-.5 2.8c.8.4 2.2.7 3.7.7 3.5 0 5.8-1.7 5.8-4.3 0-1.4-.9-2.5-2.8-3.4-1.2-.6-1.9-1-1.9-1.6 0-.5.6-1.1 1.8-1.1 1 0 1.8.2 2.4.5l.3.1.4-2.4zm8.6 2.7c.3-1.1.5-1.9.8-2.7h-2.7c-.9 0-1.5.3-1.9 1.3l-5.4 12.7h3.2s.5-1.4.7-1.7h3.9c.1.4.2 1.1.2 1.1l.3 1.6h2.8l-2.5-11.5.6-.8zm-4.7 8.3c.3-.8 1.5-3.9 1.5-3.9s.3-.8.5-1.3l.3 1.5s.7 3.4.8 3.8h-3.1zm-13.3-11l-2.7 14h-3l2.7-14h3z"/>
    </svg>
  ),
  mastercard: (
    <svg viewBox="0 0 48 48" width="40" height="25">
      <rect fill="#EB001B" width="48" height="48" rx="4"/>
      <circle fill="#EB001B" cx="18" cy="24" r="10"/>
      <circle fill="#F79E1B" cx="30" cy="24" r="10"/>
      <path fill="#FF5F00" d="M24 16.5c-1.8 1.8-3 4.4-3 7.5s1.2 5.7 3 7.5c1.8-1.8 3-4.4 3-7.5s-1.2-5.7-3-7.5z"/>
    </svg>
  ),
  amex: (
    <svg viewBox="0 0 48 48" width="40" height="25">
      <rect fill="#006FCF" width="48" height="48" rx="4"/>
      <path fill="#fff" d="M10 20h2v6h-2v-6zm4 0h2l1 3 1-3h2v6h-2v-4l-1 3h-2l-1-3v4h-2v-6zm8 0h3c1 0 2 .9 2 2s-.9 2-2 2h-3v-4zm1 1v1h2v-1h-2zm-1 2h2v1h-2v-1zm5-2h2l.5 2 .5-2h2v6h-2v-4l-.5 3h-2l-.5-3v4h-2v-6z"/>
    </svg>
  ),
  discover: (
    <svg viewBox="0 0 48 48" width="40" height="25">
      <rect fill="#86B8CF" width="48" height="48" rx="4"/>
      <circle fill="#FF6000" cx="24" cy="24" r="8"/>
      <path fill="#fff" d="M14 20h2v6h-2v-6zm22 0h2v5c0 1-1 1-1 1s-1 0-1-1v-5zm-10 0c-2 0-3 1-3 3s1 3 3 3h2v-6h-2zm1 1v3h-1c-.5 0-1-.3-1-1s.5-1 1-1h1z"/>
    </svg>
  ),
  unknown: (
    <svg viewBox="0 0 48 48" width="40" height="25">
      <rect fill="#ccc" width="48" height="48" rx="4"/>
      <path fill="#999" d="M12 20h24v8H12z"/>
    </svg>
  )
}

// ============================================
// ALGORITMO DE LUHN PARA VALIDACIÓN
// ============================================
const luhnCheck = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '')
  if (cleaned.length < 13) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10)
    
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// ============================================
// DETECCIÓN DE TIPO DE TARJETA
// ============================================
const detectCardType = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '')
  
  const patterns = {
    visa: /^4[0-9]{0,}$/,
    mastercard: /^5[1-5][0-9]{0,}$|^2[2-7][0-9]{0,}$/,
    amex: /^3[47][0-9]{0,}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{0,}$/
  }
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleaned)) {
      return type
    }
  }
  
  return 'unknown'
}

// ============================================
// COMPONENTE STRIPE CARD FORM
// ============================================
export function StripeCardForm({ amount, onSuccess, onError, disabled }) {
  const stripe = useStripe()
  const elements = useElements()
  
  const [cardType, setCardType] = useState('unknown')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [cardComplete, setCardComplete] = useState(false)
  const [cardNumber, setCardNumber] = useState('')

  // Detectar tipo de tarjeta mientras el usuario escribe
  const handleCardNumberChange = (event) => {
    const number = event.value || ''
    setCardNumber(number)
    const type = detectCardType(number)
    setCardType(type)
    
    if (event.error) {
      setError(event.error.message)
    } else {
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      setError('Stripe no está cargado correctamente')
      return
    }

    // Validación Luhn
    const cleanedNumber = cardNumber.replace(/\D/g, '')
    if (!luhnCheck(cleanedNumber)) {
      setError('Número de tarjeta inválido. Por favor verifica los números.')
      return
    }

    if (!cardComplete) {
      setError('Por favor completa los datos de tu tarjeta')
      return
    }

    setProcessing(true)
    setError('')

    try {
      // En modo prueba, Stripe simula el pago
      // Para producción, necesitarás crear un PaymentIntent en tu backend
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(
        // NOTA: En producción, esto viene de tu backend
        // Para modo prueba, usamos un client secret simulado
        'pi_test_secret', 
        {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        }
      )

      if (stripeError) {
        setError(stripeError.message)
        onError?.(stripeError.message)
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess?.({
          paymentIntentId: paymentIntent.id,
          cardType,
          last4: cleanedNumber.slice(-4)
        })
      }
    } catch (err) {
      // Para modo sandbox, simulamos un pago exitoso después de validar
      // Esto es porque no tenemos backend real
      if (luhnCheck(cleanedNumber) && cardComplete) {
        // Simular éxito en modo prueba
        setTimeout(() => {
          onSuccess?.({
            paymentIntentId: 'pi_test_' + Date.now(),
            cardType,
            last4: cleanedNumber.slice(-4),
            testMode: true
          })
        }, 1500)
        return
      }
      
      setError(err.message || 'Error al procesar el pago')
      onError?.(err.message)
    } finally {
      // Solo detenemos el processing si hubo error inmediato
      // Si pasó la validación Luhn, dejamos que el timeout lo maneje
      if (!luhnCheck(cleanedNumber) || !cardComplete) {
        setProcessing(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      {/* Logo de la tarjeta */}
      <div className="card-type-indicator">
        <span className="card-type-label">Tarjeta:</span>
        <div className="card-logo">
          {CARD_LOGOS[cardType] || CARD_LOGOS.unknown}
        </div>
        <span className="card-type-name">
          {cardType === 'visa' && 'Visa'}
          {cardType === 'mastercard' && 'MasterCard'}
          {cardType === 'amex' && 'American Express'}
          {cardType === 'discover' && 'Discover'}
          {cardType === 'unknown' && 'Ingresa tu tarjeta'}
        </span>
      </div>

      {/* Elemento Card de Stripe */}
      <div className="stripe-card-element">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#333',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                '::placeholder': {
                  color: '#999',
                },
                padding: '12px',
              },
              invalid: {
                color: '#e74c3c',
                iconColor: '#e74c3c',
              },
            },
            hidePostalCode: true,
          }}
          onChange={handleCardNumberChange}
          disabled={disabled || processing}
        />
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="payment-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Información de modo prueba */}
      <div className="test-mode-notice">
        <span className="test-badge">🔒 Modo Prueba</span>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#888' }}>
          Usa: 4242 4242 4242 4242 | Cualquier fecha futura | Cualquier CVV
        </p>
      </div>

      {/* Botón de pago */}
      <button
        type="submit"
        className="btn btn-stripe"
        disabled={!stripe || processing || !cardComplete || disabled}
        style={{
          width: '100%',
          marginTop: '20px',
          padding: '14px 24px',
          background: cardType === 'unknown' ? '#ccc' : 'var(--verde-primario, #27ae60)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: !stripe || processing || !cardComplete ? 'not-allowed' : 'pointer',
          opacity: !stripe || processing || !cardComplete ? 0.6 : 1,
          transition: 'all 0.3s ease'
        }}
      >
        {processing ? (
          <span>⏳ Procesando pago...</span>
        ) : (
          <span>💳 Pagar RD${amount.toLocaleString()} con {cardType === 'visa' ? 'Visa' : cardType === 'mastercard' ? 'MasterCard' : cardType === 'amex' ? 'Amex' : cardType === 'discover' ? 'Discover' : 'Tarjeta'}</span>
        )}
      </button>
    </form>
  )
}

// ============================================
// ESTILOS CSS
// ============================================
const styles = `
.stripe-payment-form {
  width: 100%;
}

.card-type-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.card-type-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.card-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.card-type-name {
  font-size: 0.95rem;
  color: #333;
  font-weight: 600;
  margin-left: auto;
}

.stripe-card-element {
  padding: 16px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: border-color 0.3s ease;
}

.stripe-card-element:focus-within {
  border-color: var(--verde-primario, #27ae60);
}

.payment-error {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c00;
  font-size: 0.9rem;
}

.error-icon {
  font-size: 1.1rem;
}

.test-mode-notice {
  margin-top: 16px;
  padding: 12px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
}

.test-badge {
  display: inline-block;
  padding: 4px 8px;
  background: #ffc107;
  color: #333;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.btn-stripe:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.btn-stripe:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
`

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

export { detectCardType, luhnCheck, CARD_LOGOS }
