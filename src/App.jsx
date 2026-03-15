import { useState, useEffect } from 'react'
import './index.css'

// ============================================
// DATOS INICIALES
// ============================================

const VEHICULOS = [
  {
    id: 'moto',
    nombre: 'Moto',
    descripcion: 'Perfecta para explorar la ciudad y caminos cercanos. Ágil y económica.',
    precio: 1500,
    precioTexto: 'RD$1,500/día',
    emoji: 'https://kayencorp.com/wp-content/uploads/2025/09/moto-scooter-milano-con-bateria-plomo-acido-scaled.webp'
  },
  {
    id: 'jeep',
    nombre: 'Jeep 4x4',
    descripcion: 'Ideal para aventuras off-road y terrenos difíciles. Capacidad para 4 personas.',
    precio: 4000,
    precioTexto: 'RD$4,000/día',
    emoji: '🚙'
  },
  {
    id: 'quad',
    nombre: 'Quad',
    descripcion: 'Diversión garantizada en playas y montañas. Potencia y estabilidad.',
    precio: 3000,
    precioTexto: 'RD$3,000/día',
    emoji: '🏎️'
  },
  {
    id: 'lancha',
    nombre: 'Lancha',
    descripcion: 'Explora las costas de Barahona. Capacidad para 4-6 personas.',
    precio: 8000,
    precioTexto: 'RD$8,000–15,000/medio día',
    emoji: '🚤'
  },
  {
    id: 'entrega',
    nombre: 'Entrega a Domicilio',
    descripcion: 'Llevamos el vehículo hasta donde lo necesites. Comodidad total.',
    precio: 500,
    precioTexto: 'RD$500–1,500',
    emoji: '🏠'
  }
]

const ANIMALES = [
  {
    id: 'caballo',
    nombre: 'Caballo',
    descripcion: 'Ideal para paseos turísticos y ecoturismo. Experiencia auténtica.',
    precio: 800,
    precioMax: 1200,
    precioTexto: 'RD$800–1,200/día',
    uso: 'Paseos turísticos y ecoturismo',
    emoji: '🐴'
  },
  {
    id: 'burro',
    nombre: 'Burro',
    descripcion: 'Perfecto para carga agrícola y caminos difíciles. Resistente y confiable.',
    precio: 800,
    precioTexto: 'RD$800/día',
    uso: 'Carga agrícola y caminos difíciles',
    emoji: '🫏'
  },
  {
    id: 'mula',
    nombre: 'Mula',
    descripcion: 'Excelente para terrenos montañosos y carga pesada. Fortaleza natural.',
    precio: 800,
    precioMax: 1200,
    precioTexto: 'RD$800–1,200/día',
    uso: 'Terrenos montañosos y carga pesada',
    emoji: '🐎'
  }
]

const FEATURES = [
  { icono: '🚗🐴', titulo: 'Servicio Único', descripcion: 'Único servicio que combina vehículos motorizados y animales en Barahona' },
  { icono: '💰', titulo: 'Precios Accesibles', descripcion: 'Precios accesibles para turistas y residentes locales' },
  { icono: '🗺️', titulo: 'Conocimiento Local', descripcion: 'Conocemos cada camino de la provincia' },
  { icono: '🏠', titulo: 'Entrega a Domicilio', descripcion: 'Llevamos el transporte hasta donde lo necesites' },
  { icono: '🎓', titulo: 'Equipo UCATEBA', descripcion: 'Equipo joven, local y comprometido de UCATEBA' },
  { icono: '🏝️', titulo: 'Adaptados al Terreno', descripcion: 'Adaptados a la geografía real: playas, montañas y caminos rurales' }
]

// ============================================
// FUNCIONES DE STORAGE
// ============================================

const STORAGE_KEYS = {
  PHOTO_MOTO: 'photo_moto',
  PHOTO_JEEP: 'photo_jeep',
  PHOTO_QUAD: 'photo_quad',
  PHOTO_LANCHA: 'photo_lancha',
  PHOTO_ENTREGA: 'photo_entrega',
  PHOTO_CABALLO: 'photo_caballo',
  PHOTO_BURRO: 'photo_burro',
  PHOTO_MULA: 'photo_mula',
  RESERVAS: 'reservas_terramar',
  ADMIN_LOGGED: 'admin_logged_terramar'
}

const storage = {
  async get(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (e) {
      console.error('Error reading from storage:', e)
      return null
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      console.error('Error writing to storage:', e)
      return false
    }
  },
  async remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (e) {
      console.error('Error removing from storage:', e)
      return false
    }
  }
}

// ============================================
// COMPONENTES
// ============================================

function WhatsAppFloat() {
  const handleClick = () => {
    window.open('https://wa.me/18297234139?text=Hola,%20me%20interesa%20alquilar%20un%20servicio%20de%20Transporte%20TerraMar.', '_blank')
  }
  return (
    <button className="whatsapp-float pulse" onClick={handleClick}>
      <span className="whatsapp-float-icon">💬</span>
      <span>Escríbenos</span>
    </button>
  )
}

function Navbar({ onAdminClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#vehiculos', label: 'Servicios' },
    { href: '#animales', label: 'Animales' },
    { href: '#por-que', label: '¿Por qué nosotros?' },
    { href: '#reservas', label: 'Reservas' },
    { href: '#contacto', label: 'Contacto' }
  ]

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <a href="#inicio" className="navbar-logo" onClick={(e) => handleNavClick(e, '#inicio')}>
          <span className="navbar-logo-icon">🌴</span>
          <span>Transporte TerraMar</span>
        </a>
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="navbar-link" onClick={(e) => handleNavClick(e, link.href)}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className="navbar-actions">
          <button className="navbar-admin" onClick={onAdminClick} aria-label="Panel de administración">🔒</button>
          <a href="#reservas" className="btn btn-primary navbar-cta" onClick={(e) => handleNavClick(e, '#reservas')}>Reservar ahora</a>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <span className="hero-badge fade-in">🌿 Barahona, República Dominicana</span>
        <h1 className="hero-title slide-up">Explora Barahona como nunca antes — sobre ruedas o sobre lomo</h1>
        <p className="hero-description slide-up">
          Alquiler de vehículos y animales para aventuras ecoturísticas.
          Desde motos ágiles hasta caballos majestuosos, tenemos el transporte perfecto
          para cada camino, playa y montaña.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary btn-whatsapp" onClick={() => document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' })}>
            🚀 Reservar mi aventura
          </button>
          <button className="btn btn-secondary" style={{ borderColor: 'white', color: 'white' }} onClick={() => document.querySelector('#vehiculos')?.scrollIntoView({ behavior: 'smooth' })}>
            📋 Ver catálogo
          </button>
        </div>
      </div>
      <div className="hero-scroll">
        <span>↓</span>
        <span style={{ fontSize: '0.85rem' }}>Desliza para explorar</span>
      </div>
    </section>
  )
}

function Card({ item, tipo, foto, onReservar }) {
  const displayImage = foto || item.emoji
  const isImage = typeof displayImage === 'string' && (displayImage.startsWith('http') || displayImage.startsWith('data:image'))
  return (
    <div className="card animate-on-scroll">
      <div className="card-image">
        {isImage ? (
          <img src={displayImage} alt={item.nombre} />
        ) : (
          <span>{displayImage}</span>
        )}
        <span className="card-badge">{tipo === 'vehiculo' ? '🚗 Vehículo' : '🐴 Animal'}</span>
      </div>
      <div className="card-content">
        <h3 className="card-title">{item.nombre}</h3>
        <p className="card-description">{item.descripcion}</p>
        {item.uso && <p style={{ fontSize: '0.9rem', color: '#8B8B8B', marginBottom: '12px' }}>💡 {item.uso}</p>}
        <p className="card-price">{item.precioTexto}</p>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={() => onReservar(item)}>Reservar</button>
        </div>
      </div>
    </div>
  )
}

function VehiculosSection({ fotos, onReservar }) {
  return (
    <section id="vehiculos" className="section">
      <div className="container">
        <h2 className="section-title">Nuestros Vehículos</h2>
        <p className="section-subtitle">Desde motos ágiles hasta lanchas impresionantes, elige tu aventura sobre ruedas</p>
        <div className="cards-grid">
          {VEHICULOS.map((vehiculo) => (
            <Card key={vehiculo.id} item={vehiculo} tipo="vehiculo" foto={fotos[`photo_${vehiculo.id}`]} onReservar={onReservar} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AnimalesSection({ fotos, onReservar }) {
  return (
    <section id="animales" className="section animales-section">
      <div className="container">
        <h2 className="section-title">🐴 Transporte Tradicional</h2>
        <p className="section-subtitle">Donde los carros no llegan, nuestros animales te llevan. Ideal para caminos rurales, agricultura y ecoturismo auténtico.</p>
        <div className="cards-grid">
          {ANIMALES.map((animal) => (
            <Card key={animal.id} item={animal} tipo="animal" foto={fotos[`photo_${animal.id}`]} onReservar={onReservar} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PorQueSection() {
  return (
    <section id="por-que" className="section por-que-section">
      <div className="container">
        <h2 className="section-title">¿Por qué elegir Transporte TerraMar?</h2>
        <p className="section-subtitle">Somos más que un servicio de alquiler, somos tu compañero de aventura en Barahona</p>
        <div className="features-grid">
          {FEATURES.map((feature, index) => (
            <div key={index} className="feature-card animate-on-scroll">
              <span className="feature-icon">{feature.icono}</span>
              <h3 className="feature-title">{feature.titulo}</h3>
              <p className="feature-description">{feature.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReservasSection({ onReservaCompletada, itemPreseleccionado }) {
  const [paso, setPaso] = useState(1)
  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [formData, setFormData] = useState({
    nombre: '', telefono: '', servicio: '', fecha: '', duracion: 1,
    entregaDomicilio: false, direccion: '', tipoEntrega: 'estandar', mensaje: ''
  })
  const [datosTarjeta, setDatosTarjeta] = useState({ numero: '', nombre: '', vencimiento: '', cvv: '' })
  const [reservaConfirmada, setReservaConfirmada] = useState(null)
  const [procesando, setProcesando] = useState(false)

  useEffect(() => {
    if (itemPreseleccionado) {
      setFormData(prev => ({ ...prev, servicio: itemPreseleccionado.id }))
      document.querySelector('#reservas')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [itemPreseleccionado])

  const servicioSeleccionado = [...VEHICULOS, ...ANIMALES].find(s => s.id === formData.servicio)
  const precioBase = servicioSeleccionado?.precio || 0
  const preciosEntrega = { estandar: 500, playa: 1000, montana: 1500 }
  const entregaExtra = formData.entregaDomicilio ? (preciosEntrega[formData.tipoEntrega] || 1000) : 0
  const subtotal = precioBase * formData.duracion
  const total = subtotal + entregaExtra
  const deposito = Math.round(total * 0.5)
  const resto = total - deposito

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleTarjetaChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value
    if (name === 'numero') formattedValue = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim()
    else if (name === 'vencimiento') formattedValue = value.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d{2})/, '$1/$2')
    else if (name === 'cvv') formattedValue = value.replace(/\D/g, '').slice(0, 4)
    setDatosTarjeta(prev => ({ ...prev, [name]: formattedValue }))
  }

  const generarNumeroReserva = () => 'TTM-' + Math.random().toString(36).substring(2, 8).toUpperCase()

  const confirmarReserva = async () => {
    setProcesando(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const numeroReserva = generarNumeroReserva()
    const reserva = {
      numero: numeroReserva, ...formData, servicioNombre: servicioSeleccionado?.nombre,
      total, deposito, resto, metodoPago, fechaReserva: new Date().toISOString(), estado: 'confirmada'
    }
    const reservasExistentes = await storage.get(STORAGE_KEYS.RESERVAS) || []
    await storage.set(STORAGE_KEYS.RESERVAS, [...reservasExistentes, reserva])
    setReservaConfirmada(reserva)
    setProcesando(false)
    onReservaCompletada(reserva)
  }

  const generarMensajeWhatsApp = () => {
    const tiposEntrega = { estandar: 'Estándar (ciudad)', playa: 'Playa (zona costera)', montana: 'Montaña (zona montañosa)' }
    const mensaje = `🌴 *Reserva Transporte TerraMar* 🌴

*Nombre:* ${formData.nombre}
*Teléfono:* ${formData.telefono}
*Servicio:* ${servicioSeleccionado?.nombre}
*Fecha:* ${formData.fecha}
*Duración:* ${formData.duracion} día(s)
*Entrega a domicilio:* ${formData.entregaDomicilio ? 'Sí' : 'No'}
${formData.entregaDomicilio ? `*Tipo de entrega:* ${tiposEntrega[formData.tipoEntrega] || 'Estándar'}
*Dirección:* ${formData.direccion}` : '*Entrega a domicilio:* No'}

*💰 Resumen:*
Total: RD$${total.toLocaleString()}
Depósito (50%): RD$${deposito.toLocaleString()}
Resto al recoger: RD$${resto.toLocaleString()}

*Método de pago:* ${metodoPago}
${reservaConfirmada ? `*Número de reserva:* ${reservaConfirmada.numero}` : ''}
${formData.mensaje ? `*Mensaje:* ${formData.mensaje}` : ''}`
    return encodeURIComponent(mensaje)
  }

  const abrirWhatsApp = () => {
    window.open(`https://wa.me/18297234139?text=${generarMensajeWhatsApp()}`, '_blank')
  }

  if (reservaConfirmada) {
    return (
      <section id="reservas" className="section reservas-section">
        <div className="container">
          <div className="booking-container">
            <div className="confirmation-container">
              <div className="confirmation-check"><span className="confirmation-check-icon">✓</span></div>
              <h2 className="confirmation-title">¡Reserva Confirmada!</h2>
              <p className="confirmation-message">Gracias {formData.nombre.split(' ')[0]}, tu reserva ha sido procesada exitosamente.</p>
              <div className="confirmation-number">
                <div className="confirmation-number-label">Número de Reserva</div>
                <div className="confirmation-number-value">{reservaConfirmada.numero}</div>
              </div>
              <div className="confirmation-details">
                <h4>📋 Resumen de tu Reserva</h4>
                <div className="confirmation-row"><span>Servicio:</span><strong>{reservaConfirmada.servicioNombre}</strong></div>
                <div className="confirmation-row"><span>Fecha:</span><strong>{reservaConfirmada.fecha}</strong></div>
                <div className="confirmation-row"><span>Duración:</span><strong>{reservaConfirmada.duracion} día(s)</strong></div>
                <div className="confirmation-row"><span>Total:</span><strong style={{ color: 'var(--dorado)' }}>RD${reservaConfirmada.total.toLocaleString()}</strong></div>
                <div className="confirmation-row"><span>Depósito:</span><strong style={{ color: 'var(--verde-acento)' }}>RD${reservaConfirmada.deposito.toLocaleString()}</strong></div>
                <div className="confirmation-row"><span>Resto:</span><strong>RD${reservaConfirmada.resto.toLocaleString()}</strong></div>
              </div>
              <div className="booking-actions">
                <button className="btn btn-whatsapp" onClick={abrirWhatsApp}>📱 Confirmar por WhatsApp</button>
                <button className="btn btn-secondary" onClick={() => { setReservaConfirmada(null); setFormData({ nombre: '', telefono: '', servicio: '', fecha: '', duracion: 1, entregaDomicilio: false, direccion: '', tipoEntrega: 'estandar', mensaje: '' }); setPaso(1) }}>Hacer otra reserva</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (paso === 2) {
    return (
      <section id="reservas" className="section reservas-section">
        <div className="container">
          <div className="booking-container">
            <div className="booking-header"><h2>Paso 2: Completa tu Pago</h2><p>Elige tu método de pago preferido</p></div>
            <div className="booking-body">
              <div className="payment-summary">
                <h3>📋 Resumen de Reserva</h3>
                <div className="price-row"><span className="price-label">Servicio:</span><span className="price-value">{servicioSeleccionado?.nombre}</span></div>
                <div className="price-row"><span className="price-label">Duración:</span><span className="price-value">{formData.duracion} día(s)</span></div>
                <div className="price-row"><span className="price-label">Total:</span><span className="price-value highlight">RD${total.toLocaleString()}</span></div>
                <div className="price-row"><span className="price-label">Depósito (50%):</span><span className="price-value highlight">RD${deposito.toLocaleString()}</span></div>
                <div className="price-row" style={{ borderBottom: 'none' }}><span className="price-label">Resto al recoger:</span><span className="price-value">RD${resto.toLocaleString()}</span></div>
              </div>
              <div className="payment-tabs">
                <button className={`payment-tab ${metodoPago === 'tarjeta' ? 'active' : ''}`} onClick={() => setMetodoPago('tarjeta')}><span className="payment-tab-icon">💳</span><span className="payment-tab-label">Tarjeta</span></button>
                <button className={`payment-tab ${metodoPago === 'paypal' ? 'active' : ''}`} onClick={() => setMetodoPago('paypal')}><span className="payment-tab-icon">🅿️</span><span className="payment-tab-label">PayPal</span></button>
                <button className={`payment-tab ${metodoPago === 'transferencia' ? 'active' : ''}`} onClick={() => setMetodoPago('transferencia')}><span className="payment-tab-icon">🏦</span><span className="payment-tab-label">Transferencia</span></button>
                <button className={`payment-tab ${metodoPago === 'efectivo' ? 'active' : ''}`} onClick={() => setMetodoPago('efectivo')}><span className="payment-tab-icon">💵</span><span className="payment-tab-label">Efectivo</span></button>
              </div>
              {metodoPago === 'tarjeta' && (
                <div className="payment-content active">
                  <div className="credit-card-visual">
                    <div className="credit-card-chip"></div>
                    <div className="credit-card-number-display">{datosTarjeta.numero || '•••• •••• •••• ••••'}</div>
                    <div className="credit-card-info">
                      <div><div className="credit-card-label">Titular</div><div className="credit-card-value">{datosTarjeta.nombre || 'NOMBRE APELLIDO'}</div></div>
                      <div><div className="credit-card-label">Vencimiento</div><div className="credit-card-value">{datosTarjeta.vencimiento || 'MM/AA'}</div></div>
                    </div>
                  </div>
                  <div className="form-group"><label className="form-label">Número de Tarjeta</label><input type="text" name="numero" className="form-card-input" placeholder="1234 5678 9012 3456" value={datosTarjeta.numero} onChange={handleTarjetaChange} /></div>
                  <div className="form-group"><label className="form-label">Nombre del Titular</label><input type="text" name="nombre" className="form-card-input" placeholder="Como aparece en la tarjeta" value={datosTarjeta.nombre} onChange={(e) => setDatosTarjeta(prev => ({ ...prev, nombre: e.target.value.toUpperCase() }))} /></div>
                  <div className="form-card-row">
                    <div className="form-group"><label className="form-label">Vencimiento</label><input type="text" name="vencimiento" className="form-card-input" placeholder="MM/AA" value={datosTarjeta.vencimiento} onChange={handleTarjetaChange} /></div>
                    <div className="form-group"><label className="form-label">CVV</label><input type="text" name="cvv" className="form-card-input" placeholder="123" value={datosTarjeta.cvv} onChange={handleTarjetaChange} /></div>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={confirmarReserva} disabled={procesando}>{procesando ? '⏳ Procesando...' : `Pagar RD$${deposito.toLocaleString()} y Confirmar`}</button>
                </div>
              )}
              {metodoPago === 'paypal' && (
                <div className="payment-content active">
                  <p style={{ textAlign: 'center', marginBottom: '24px', color: '#8B8B8B' }}>Serás redirigido a PayPal para completar tu pago seguro de <strong>RD${deposito.toLocaleString()}</strong></p>
                  <button className="paypal-button" onClick={confirmarReserva} disabled={procesando}>{procesando ? '⏳ Redirigiendo...' : '🅿️ Pagar con PayPal'}</button>
                </div>
              )}
              {metodoPago === 'transferencia' && (
                <div className="payment-content active">
                  <div className="bank-info">
                    <div className="bank-info-row"><span className="bank-info-label">Banco:</span><span className="bank-info-value">Banco Popular Dominicano</span></div>
                    <div className="bank-info-row"><span className="bank-info-label">Tipo:</span><span className="bank-info-value">Corriente</span></div>
                    <div className="bank-info-row"><span className="bank-info-label">Número:</span><span className="bank-info-value">****-****-1234</span></div>
                    <div className="bank-info-row"><span className="bank-info-label">Titular:</span><span className="bank-info-value">Transporte TerraMar SRL</span></div>
                  </div>
                  <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>💡 <strong>Instrucciones:</strong> Realiza una transferencia por RD${deposito.toLocaleString()} y envía el comprobante por WhatsApp.</p>
                  <button className="btn btn-whatsapp" onClick={abrirWhatsApp}>📱 Enviar comprobante</button>
                  <button className="btn btn-secondary" style={{ width: '100%', marginTop: '12px' }} onClick={confirmarReserva}>✓ Ya envié el comprobante</button>
                </div>
              )}
              {metodoPago === 'efectivo' && (
                <div className="payment-content active">
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <span style={{ fontSize: '3rem' }}>💵</span>
                    <h3 style={{ margin: '16px 0', color: 'var(--verde-primario)' }}>Pago en Efectivo al Recoger</h3>
                    <p style={{ lineHeight: '1.6', marginBottom: '24px' }}>Deberás pagar el depósito de <strong>RD${deposito.toLocaleString()}</strong> en efectivo cuando recojas el servicio.</p>
                  </div>
                  <button className="btn btn-whatsapp" onClick={abrirWhatsApp}>📱 Confirmar por WhatsApp</button>
                  <button className="btn btn-secondary" style={{ width: '100%', marginTop: '12px' }} onClick={confirmarReserva}>✓ Confirmar reserva</button>
                </div>
              )}
              <button className="btn btn-secondary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setPaso(1)}>← Volver al formulario</button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="reservas" className="section reservas-section">
      <div className="container">
        <div className="booking-container">
          <div className="booking-header"><h2>Reserva tu Transporte</h2><p>Completa el formulario y prepárate para la aventura</p></div>
          <div className="booking-body">
            <div className="form-row">
              <div className="form-group"><label className="form-label">Nombre Completo *</label><input type="text" name="nombre" className="form-input" placeholder="Ej: Juan Pérez" value={formData.nombre} onChange={handleInputChange} /></div>
              <div className="form-group"><label className="form-label">Teléfono / WhatsApp *</label><input type="tel" name="telefono" className="form-input" placeholder="Ej: 829-123-4567" value={formData.telefono} onChange={handleInputChange} /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de Transporte *</label>
              <select name="servicio" className="form-select" value={formData.servicio} onChange={handleInputChange}>
                <option value="">Selecciona un transporte</option>
                <optgroup label="🚗 Vehículos">
                  {VEHICULOS.map(v => <option key={v.id} value={v.id}>{v.nombre} - {v.precioTexto}</option>)}
                </optgroup>
                <optgroup label="🐴 Animales">
                  {ANIMALES.map(a => <option key={a.id} value={a.id}>{a.nombre} - {a.precioTexto}</option>)}
                </optgroup>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Fecha de Inicio *</label><input type="date" name="fecha" className="form-input" value={formData.fecha} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} /></div>
              <div className="form-group"><label className="form-label">Duración (días) *</label><input type="number" name="duracion" className="form-input" min="1" max="30" value={formData.duracion} onChange={handleInputChange} /></div>
            </div>
            <div className="form-group">
              <div className="form-checkbox-group">
                <input type="checkbox" name="entregaDomicilio" id="entregaDomicilio" className="form-checkbox" checked={formData.entregaDomicilio} onChange={handleInputChange} />
                <label htmlFor="entregaDomicilio" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>¿Necesitas entrega a domicilio? (+RD$500-1,500)</label>
              </div>
            </div>
            {formData.entregaDomicilio && formData.servicio && (
              <>
                <div className="form-group" style={{ background: 'var(--verde-claro)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ margin: 0, color: 'var(--verde-primario)', fontWeight: '600' }}>
                    🚚 Entrega de: <strong>{servicioSeleccionado?.nombre}</strong>
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'var(--gris-texto)' }}>
                    Llevaremos {servicioSeleccionado?.nombre.toLowerCase()} hasta la dirección que indiques
                  </p>
                </div>
                <div className="form-group">
                  <label className="form-label">Dirección de Entrega</label>
                  <input type="text" name="direccion" className="form-input" placeholder="Ej: Calle Principal #123, Barahona" value={formData.direccion} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo de Entrega</label>
                  <select name="tipoEntrega" className="form-select" value={formData.tipoEntrega || 'estandar'} onChange={handleInputChange}>
                    <option value="estandar">Estándar - RD$500 (dentro de la ciudad)</option>
                    <option value="playa">Playa - RD$1,000 (zonas costeras)</option>
                    <option value="montana">Montaña - RD$1,500 (zonas montañosas)</option>
                  </select>
                </div>
              </>
            )}
            <div className="form-group"><label className="form-label">Mensaje Opcional</label><textarea name="mensaje" className="form-textarea" placeholder="Cuéntanos más sobre tu aventura..." value={formData.mensaje} onChange={handleInputChange}></textarea></div>
            {formData.servicio && formData.duracion && (
              <div className="price-summary">
                <div className="price-row"><span className="price-label">Precio por día:</span><span className="price-value">RD${precioBase.toLocaleString()}</span></div>
                <div className="price-row"><span className="price-label">Días:</span><span className="price-value">{formData.duracion}</span></div>
                {formData.entregaDomicilio && <div className="price-row"><span className="price-label">Entrega:</span><span className="price-value">RD${entregaExtra.toLocaleString()}</span></div>}
                <div className="price-row" style={{ borderBottom: 'none', marginTop: '12px', paddingTop: '12px' }}><span className="price-label" style={{ fontSize: '1.2rem' }}>Total estimado:</span><span className="price-value highlight">RD${total.toLocaleString()}</span></div>
                <div className="price-row" style={{ borderBottom: 'none' }}><span className="price-label">Depósito (50%):</span><span className="price-value">RD${deposito.toLocaleString()}</span></div>
              </div>
            )}
            <div className="booking-actions">
              <button className="btn btn-primary" onClick={() => setPaso(2)} disabled={!formData.nombre || !formData.telefono || !formData.servicio || !formData.fecha}>Continuar al Pago →</button>
              <button className="btn btn-whatsapp" onClick={abrirWhatsApp}>📱 Reservar por WhatsApp</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactoSection() {
  return (
    <section id="contacto" className="section contacto-section">
      <div className="container">
        <h2 className="section-title">Contáctanos</h2>
        <p className="section-subtitle">¿Tienes preguntas? Estamos aquí para ayudarte</p>
        <div className="contacto-grid">
          <div className="contacto-card animate-on-scroll"><span className="contacto-icon">📱</span><h3 className="contacto-title">WhatsApp</h3><p className="contacto-info"><a href="https://wa.me/18297234139" target="_blank" rel="noopener noreferrer">829-723-4139</a></p></div>
          <div className="contacto-card animate-on-scroll"><span className="contacto-icon">📧</span><h3 className="contacto-title">Email</h3><p className="contacto-info"><a href="mailto:info@terramar.do">info@terramar.do</a></p></div>
          <div className="contacto-card animate-on-scroll"><span className="contacto-icon">📍</span><h3 className="contacto-title">Ubicación</h3><p className="contacto-info">Barahona, República Dominicana</p></div>
          <div className="contacto-card animate-on-scroll"><span className="contacto-icon">🌐</span><h3 className="contacto-title">Redes Sociales</h3><p className="contacto-info"><a href="#" style={{ marginRight: '12px' }}>Instagram</a><a href="#">Facebook</a></p></div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="https://wa.me/18297234139" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>💬 Escríbenos por WhatsApp</a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <div className="footer-logo"><span>🌴</span><span>Transporte TerraMar</span></div>
            <p className="footer-slogan">Explora Barahona como nunca antes. Alquiler de vehículos y animales para aventuras ecoturísticas auténticas.</p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Instagram">📷</a>
              <a href="#" className="footer-social-link" aria-label="Facebook">👍</a>
              <a href="https://wa.me/18297234139" className="footer-social-link" aria-label="WhatsApp">💬</a>
            </div>
          </div>
          <div>
            <h4 className="footer-title">Enlaces Rápidos</h4>
            <ul className="footer-links">
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#vehiculos">Vehículos</a></li>
              <li><a href="#animales">Animales</a></li>
              <li><a href="#reservas">Reservas</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Contacto</h4>
            <ul className="footer-links">
              <li><a href="https://wa.me/18297234139" className="footer-whatsapp" target="_blank" rel="noopener noreferrer">💬 829-723-4139</a></li>
              <li>Barahona, República Dominicana</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Transporte TerraMar. Todos los derechos reservados.</p>
          <p style={{ marginTop: '8px', fontSize: '0.85rem', opacity: 0.7 }}>🎓 Equipo fundador UCATEBA - Universidad Católica de Barahona</p>
        </div>
      </div>
    </footer>
  )
}

function AdminLoginModal({ isOpen, onClose, onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (usuario === 'admin' && password === 'terramar2025') {
      onLogin()
      onClose()
      setUsuario('')
      setPassword('')
      setError('')
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔐 Panel de Administración</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleLogin}>
            <div className="form-group"><label className="form-label">Usuario</label><input type="text" className="form-input" value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="admin" /></div>
            <div className="form-group"><label className="form-label">Contraseña</label><input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></div>
            {error && <p style={{ color: '#d32f2f', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  )
}

function AdminPanel({ isOpen, onClose, fotos, setFotos }) {
  const [tabActiva, setTabActiva] = useState('fotos')
  const [reservas, setReservas] = useState([])
  const [mostrarAyuda, setMostrarAyuda] = useState(true)

  useEffect(() => {
    if (isOpen) {
      const cargarReservas = async () => {
        const reservasGuardadas = await storage.get(STORAGE_KEYS.RESERVAS) || []
        setReservas(reservasGuardadas)
      }
      cargarReservas()
    }
  }, [isOpen])

  const handleFileChange = async (key, e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result
        const nuevosFotos = { ...fotos, [key]: base64 }
        setFotos(nuevosFotos)
        await storage.set(key, base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = async () => {
    await storage.remove(STORAGE_KEYS.ADMIN_LOGGED)
    onClose()
  }

  const handleResetAllFotos = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las fotos personalizadas?')) {
      const photoKeys = ['photo_moto', 'photo_jeep', 'photo_quad', 'photo_lancha', 'photo_entrega', 'photo_caballo', 'photo_burro', 'photo_mula']
      for (const key of photoKeys) await storage.remove(key)
      setFotos({})
      alert('Todas las fotos han sido restablecidas')
    }
  }

  if (!isOpen) return null

  const itemsAdmin = [
    { key: 'photo_moto', nombre: 'Moto', emoji: '🏍️' },
    { key: 'photo_jeep', nombre: 'Jeep 4x4', emoji: '🚙' },
    { key: 'photo_quad', nombre: 'Quad', emoji: '🏎️' },
    { key: 'photo_lancha', nombre: 'Lancha', emoji: '🚤' },
    { key: 'photo_entrega', nombre: 'Entrega', emoji: '🏠' },
    { key: 'photo_caballo', nombre: 'Caballo', emoji: '🐴' },
    { key: 'photo_burro', nombre: 'Burro', emoji: '🫏' },
    { key: 'photo_mula', nombre: 'Mula', emoji: '🐎' }
  ]

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="admin-header">
          <h2>🔧 Panel de Administración</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={handleResetAllFotos}>🔄 Restablecer Fotos</button>
            <button className="btn btn-secondary" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </div>

        {mostrarAyuda && (
          <div style={{ background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', border: '2px solid #52C47A', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ fontSize: '2rem' }}>📸</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ color: '#1A5C38', marginBottom: '8px', marginTop: 0 }}>¿Cómo cambiar las fotos?</h3>
              <ol style={{ margin: 0, paddingLeft: '20px', color: '#4A4A4A', lineHeight: 1.6 }}>
                <li>Haz clic en <strong>"📷 Cambiar foto"</strong> en cualquier tarjeta</li>
                <li>Selecciona una imagen de tu computadora</li>
                <li>¡Listo! La imagen se guarda automáticamente</li>
              </ol>
              <p style={{ margin: '12px 0 0 0', fontSize: '0.9rem', color: '#8B8B8B' }}>💡 <strong>Tip:</strong> También puedes hacer clic directamente en la imagen para cambiarla</p>
            </div>
            <button onClick={() => setMostrarAyuda(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#1A5C38', padding: '0', lineHeight: 1 }}>×</button>
          </div>
        )}

        <div className="admin-tabs">
          <button className={`admin-tab ${tabActiva === 'fotos' ? 'active' : ''}`} onClick={() => setTabActiva('fotos')}>📸 Gestionar Fotos</button>
          <button className={`admin-tab ${tabActiva === 'reservas' ? 'active' : ''}`} onClick={() => setTabActiva('reservas')}>📋 Ver Reservas ({reservas.length})</button>
        </div>

        {tabActiva === 'fotos' && (
          <div className="admin-grid">
            {itemsAdmin.map((item) => (
              <div key={item.key} className="admin-card">
                <div className="admin-card-header"><h4>{item.emoji} {item.nombre}</h4></div>
                <div className="admin-card-body">
                  <div className="admin-photo-preview" onClick={() => document.getElementById(`input-${item.key}`)?.click()} style={{ cursor: 'pointer' }}>
                    {fotos[item.key] ? <img src={fotos[item.key]} alt={item.nombre} /> : <span>{item.emoji}</span>}
                  </div>
                  <input type="file" accept="image/*" id={`input-${item.key}`} style={{ display: 'none' }} onChange={(e) => handleFileChange(item.key, e)} />
                  <div className="admin-actions">
                    <button className="btn btn-primary" onClick={() => document.getElementById(`input-${item.key}`)?.click()}>📷 Cambiar foto</button>
                    {fotos[item.key] && <button className="btn btn-secondary" onClick={async () => { const nuevosFotos = { ...fotos }; delete nuevosFotos[item.key]; setFotos(nuevosFotos); await storage.remove(item.key) }}>🗑️ Eliminar</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tabActiva === 'reservas' && (
          <div className="admin-card">
            <div className="admin-card-header"><h4>📋 Listado de Reservas ({reservas.length})</h4></div>
            <div className="admin-card-body">
              {reservas.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px', color: '#8B8B8B' }}>No hay reservas registradas</p>
              ) : (
                <div className="reservas-table-responsive">
                  <table className="reservas-table">
                    <thead>
                      <tr><th>Número</th><th>Nombre</th><th>Servicio</th><th>Fecha</th><th>Duración</th><th>Total</th><th>Depósito</th><th>Método</th></tr>
                    </thead>
                    <tbody>
                      {reservas.map((reserva, index) => (
                        <tr key={index}>
                          <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{reserva.numero}</td>
                          <td>{reserva.nombre}</td>
                          <td>{reserva.servicioNombre}</td>
                          <td>{reserva.fecha}</td>
                          <td>{reserva.duracion} día(s)</td>
                          <td style={{ color: 'var(--dorado)', fontWeight: '600' }}>RD${reserva.total?.toLocaleString()}</td>
                          <td style={{ color: 'var(--verde-acento)', fontWeight: '600' }}>RD${reserva.deposito?.toLocaleString()}</td>
                          <td style={{ textTransform: 'capitalize' }}>{reserva.metodoPago}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [fotos, setFotos] = useState({})
  const [itemPreseleccionado, setItemPreseleccionado] = useState(null)

  useEffect(() => {
    const cargarFotos = async () => {
      const keys = Object.values(STORAGE_KEYS).filter(k => k.startsWith('photo_'))
      const fotosGuardadas = {}
      for (const key of keys) {
        const foto = await storage.get(key)
        if (foto) fotosGuardadas[key] = foto
      }
      setFotos(fotosGuardadas)
    }
    cargarFotos()
  }, [])

  useEffect(() => {
    const verificarSesion = async () => {
      const logged = await storage.get(STORAGE_KEYS.ADMIN_LOGGED)
      if (logged) setShowAdminPanel(true)
    }
    verificarSesion()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const handleAdminLogin = async () => {
    await storage.set(STORAGE_KEYS.ADMIN_LOGGED, true)
    setShowAdminPanel(true)
    setShowAdminLogin(false)
  }

  const handleReservaCompletada = (reserva) => console.log('Reserva completada:', reserva)
  const handleReservarItem = (item) => setItemPreseleccionado(item)

  return (
    <div className="app">
      <Navbar onAdminClick={() => setShowAdminLogin(true)} />
      <main>
        <Hero />
        <VehiculosSection fotos={fotos} onReservar={handleReservarItem} />
        <AnimalesSection fotos={fotos} onReservar={handleReservarItem} />
        <PorQueSection />
        <ReservasSection onReservaCompletada={handleReservaCompletada} itemPreseleccionado={itemPreseleccionado} />
        <ContactoSection />
      </main>
      <Footer />
      <WhatsAppFloat />
      <AdminLoginModal isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} onLogin={handleAdminLogin} />
      <AdminPanel isOpen={showAdminPanel} onClose={() => { setShowAdminPanel(false); storage.remove(STORAGE_KEYS.ADMIN_LOGGED) }} fotos={fotos} setFotos={setFotos} />
    </div>
  )
}

export default App
