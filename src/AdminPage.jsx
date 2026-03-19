import { useState, useEffect } from 'react'
import './index.css'
import { dbService } from './db'

// Storage keys
const STORAGE_KEYS = {
  ADMIN_LOGGED: 'admin_logged_in',
  RESERVAS: 'reservas_terramar',
  FOTOS: 'fotos_terramar'
}

// ============================================
// PÁGINA DE LOGIN DE ADMINISTRACIÓN
// ============================================

function AdminLoginPage({ onLogin, onVolver }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    if (usuario === 'admin' && password === 'terramar2025') {
      await localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED, true)
      onLogin()
    } else {
      setError('Usuario o contraseña incorrectos')
      setCargando(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <span className="admin-login-logo">🌴</span>
            <h1>Panel de Administración</h1>
            <p>Transporte TerraMar</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="form-input"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="login-error">{error}</p>
            )}

            <button
              type="submit"
              className="btn btn-primary admin-login-btn"
              disabled={cargando}
            >
              {cargando ? 'Iniciando sesión...' : '🔐 Iniciar Sesión'}
            </button>

            <button
              type="button"
              className="btn btn-secondary admin-login-btn"
              onClick={onVolver}
            >
              ← Volver al sitio
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ============================================
// DASHBOARD DE ADMINISTRACIÓN
// ============================================

function AdminDashboard({ onLogout, onVolver }) {
  const [tabActiva, setTabActiva] = useState('fotos')
  const [reservas, setReservas] = useState([])
  const [fotos, setFotos] = useState({})
  const [mostrarAyuda, setMostrarAyuda] = useState(true)
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Verificar sesión
    const verificarSesion = async () => {
      try {
        const logged = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED)
        if (!logged || logged !== 'true') {
          onLogout()
          return
        }
        setCargando(false)
      } catch (error) {
        console.error('Error al verificar sesión:', error)
        setError('Error al cargar el dashboard')
        setCargando(false)
      }
    }
    verificarSesion()

    // Escuchar reservas en tiempo real
    const unsubscribeReservas = dbService.escucharReservasEnTiempoReal((reservasData) => {
      try {
        console.log('📋 Reservas recibidas:', reservasData.length)
        const reservasOrdenadas = [...reservasData].sort((a, b) => {
          const fechaA = a.fechaReserva ? new Date(a.fechaReserva).getTime() : 0
          const fechaB = b.fechaReserva ? new Date(b.fechaReserva).getTime() : 0
          return fechaA - fechaB
        })
        setReservas(reservasOrdenadas)
      } catch (error) {
        console.error('Error al ordenar reservas:', error)
        setReservas([])
      }
    })

    // Escuchar fotos en tiempo real
    const unsubscribeFotos = dbService.escucharFotosEnTiempoReal((fotosData) => {
      try {
        setFotos(fotosData)
      } catch (error) {
        console.error('Error al cargar fotos:', error)
        setFotos({})
      }
    })

    return () => {
      unsubscribeReservas()
      unsubscribeFotos()
    }
  }, [onLogout])

  const handleFileChange = async (key, e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result
        const nuevosFotos = { ...fotos, [key]: base64 }
        setFotos(nuevosFotos)
        try {
          await dbService.guardarFoto(key, base64)
        } catch (error) {
          console.error('Error al guardar foto:', error)
          localStorage.setItem(key, base64)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED)
    onLogout()
  }

  const handleResetAllFotos = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las fotos personalizadas?')) {
      const photoKeys = ['photo_moto', 'photo_jeep', 'photo_quad', 'photo_lancha', 'photo_entrega', 'photo_caballo', 'photo_burro', 'photo_mula']
      for (const key of photoKeys) {
        try {
          await dbService.eliminarFoto(key)
        } catch (error) {
          console.error(`Error al eliminar foto ${key}:`, error)
          localStorage.removeItem(key)
        }
      }
      setFotos({})
      alert('Todas las fotos han sido restablecidas')
    }
  }

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

  if (cargando) {
    return (
      <div className="admin-dashboard-page">
        <header className="admin-dashboard-header">
          <div className="container">
            <div className="admin-header-content">
              <div className="admin-logo-section">
                <span className="admin-logo">🌴</span>
                <div>
                  <h1>Transporte TerraMar</h1>
                  <p>Panel de Administración</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="admin-dashboard-main">
          <div className="container">
            <div className="admin-loading">
              <div className="admin-loading-spinner">🌴</div>
              <p>Cargando panel de administración...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-dashboard-page">
        <header className="admin-dashboard-header">
          <div className="container">
            <div className="admin-header-content">
              <div className="admin-logo-section">
                <span className="admin-logo">🌴</span>
                <div>
                  <h1>Transporte TerraMar</h1>
                  <p>Panel de Administración</p>
                </div>
              </div>
              <div className="admin-header-actions">
                <button className="btn btn-secondary" onClick={onVolver}>
                  🏠 Volver al sitio
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="admin-dashboard-main">
          <div className="container">
            <div className="admin-card">
              <div className="admin-card-header">
                <h4>❌ Error</h4>
              </div>
              <div className="admin-card-body">
                <p style={{ marginBottom: '20px' }}>{error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                  🔄 Recargar Página
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-page">
      {/* Header de navegación */}
      <header className="admin-dashboard-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-logo-section">
              <span className="admin-logo">🌴</span>
              <div>
                <h1>Transporte TerraMar</h1>
                <p>Panel de Administración</p>
              </div>
            </div>
            <div className="admin-header-actions">
              <button className="btn btn-secondary" onClick={onVolver}>
                🏠 Volver al sitio
              </button>
              <a href="/" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                🌐 Ver sitio web
              </a>
              <button className="btn btn-secondary" onClick={handleLogout}>
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="admin-dashboard-main">
        <div className="container">
          {/* Mensaje de ayuda */}
          {mostrarAyuda && tabActiva === 'fotos' && (
            <div className="admin-help-banner">
              <div className="help-banner-icon">📸</div>
              <div className="help-banner-content">
                <h3>¿Cómo cambiar las fotos?</h3>
                <ol>
                  <li>Haz clic en <strong>"📷 Cambiar foto"</strong> en cualquier tarjeta</li>
                  <li>Selecciona una imagen de tu computadora</li>
                  <li>¡Listo! La imagen se guarda automáticamente</li>
                </ol>
                <p>💡 <strong>Tip:</strong> También puedes hacer clic directamente en la imagen para cambiarla</p>
              </div>
              <button onClick={() => setMostrarAyuda(false)} className="help-banner-close">×</button>
            </div>
          )}

          {/* Pestañas de navegación */}
          <div className="admin-tabs">
            <button
              className={`admin-tab ${tabActiva === 'fotos' ? 'active' : ''}`}
              onClick={() => setTabActiva('fotos')}
            >
              📸 Gestionar Fotos
            </button>
            <button
              className={`admin-tab ${tabActiva === 'reservas' ? 'active' : ''}`}
              onClick={() => setTabActiva('reservas')}
            >
              📋 Ver Reservas ({reservas.length})
            </button>
          </div>

          {/* Sección de Fotos */}
          {tabActiva === 'fotos' && (
            <div className="admin-grid">
              {itemsAdmin.map((item) => (
                <div key={item.key} className="admin-card">
                  <div className="admin-card-header">
                    <h4>{item.emoji} {item.nombre}</h4>
                  </div>
                  <div className="admin-card-body">
                    <div
                      className="admin-photo-preview"
                      onClick={() => document.getElementById(`input-${item.key}`)?.click()}
                    >
                      {fotos[item.key] ? (
                        <img src={fotos[item.key]} alt={item.nombre} />
                      ) : (
                        <span>{item.emoji}</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      id={`input-${item.key}`}
                      className="admin-file-input"
                      onChange={(e) => handleFileChange(item.key, e)}
                    />
                    <div className="admin-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => document.getElementById(`input-${item.key}`)?.click()}
                      >
                        📷 Cambiar foto
                      </button>
                      {fotos[item.key] && (
                        <button
                          className="btn btn-secondary"
                          onClick={async () => {
                            const nuevosFotos = { ...fotos }
                            delete nuevosFotos[item.key]
                            setFotos(nuevosFotos)
                            localStorage.removeItem(item.key)
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sección de Reservas */}
          {tabActiva === 'reservas' && (
            <div className="admin-card full-width">
              <div className="admin-card-header">
                <h4>📋 Listado de Reservas ({reservas.length})</h4>
                {reservas.length > 0 && (
                  <button className="btn btn-secondary" onClick={handleResetAllFotos} style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
                    🗑️ Eliminar todas
                  </button>
                )}
              </div>
              <div className="admin-card-body">
                {reservas.length === 0 ? (
                  <p className="no-reservas">No hay reservas registradas</p>
                ) : (
                  <>
                    <div className="reservas-table-responsive">
                      <table className="reservas-table">
                        <thead>
                          <tr>
                            <th># Orden</th>
                            <th>Número</th>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Servicio</th>
                            <th>Fecha</th>
                            <th>Duración</th>
                            <th>Total</th>
                            <th>Depósito</th>
                            <th>Método</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservas.map((reserva, index) => (
                            <tr key={index}>
                              <td style={{ fontWeight: '600', color: 'var(--verde-primario)' }}>{index + 1}</td>
                              <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>{reserva.numero}</td>
                              <td>{reserva.nombre}</td>
                              <td>
                                <a
                                  href={`https://wa.me/1${reserva.telefono?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${reserva.nombre}, te contacto por tu reserva del servicio: ${reserva.servicioNombre}`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-whatsapp-link"
                                >
                                  📱 {reserva.telefono}
                                </a>
                              </td>
                              <td>{reserva.servicioNombre}</td>
                              <td>{reserva.fecha}</td>
                              <td>{reserva.duracion} día(s)</td>
                              <td style={{ color: 'var(--dorado)', fontWeight: '600' }}>RD${reserva.total?.toLocaleString()}</td>
                              <td style={{ color: 'var(--verde-acento)', fontWeight: '600' }}>RD${reserva.deposito?.toLocaleString()}</td>
                              <td style={{ textTransform: 'capitalize' }}>{reserva.metodoPago}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    onClick={() => setReservaSeleccionada(reserva)}
                                    className="btn-view"
                                  >
                                    👁️ Ver
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (window.confirm(`¿Eliminar reserva ${reserva.numero}?`)) {
                                        try {
                                          // Eliminar de Firebase (el listener en tiempo real actualizará automáticamente)
                                          await dbService.eliminarReserva(reserva.id || reserva.numero)
                                          // Cerrar el modal si está abierto
                                          if (reservaSeleccionada && reservaSeleccionada.numero === reserva.numero) {
                                            setReservaSeleccionada(null)
                                          }
                                        } catch (error) {
                                          console.error('Error al eliminar reserva:', error)
                                          alert('Error al eliminar la reserva. Por favor intenta de nuevo.')
                                        }
                                      }
                                    }}
                                    className="btn-delete"
                                    disabled={cargando}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Modal de detalles de reserva */}
                    {reservaSeleccionada && (
                      <div className="modal-overlay" onClick={() => setReservaSeleccionada(null)}>
                        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                          <div className="modal-header">
                            <h3>📋 Reserva #{reservaSeleccionada.numero}</h3>
                            <button className="modal-close" onClick={() => setReservaSeleccionada(null)}>×</button>
                          </div>
                          <div className="modal-body">
                            <div className="reserva-detalles-grid">
                              <div className="reserva-detalles-section">
                                <h4>👤 Cliente</h4>
                                <p><strong>Nombre:</strong> {reservaSeleccionada.nombre}</p>
                                <p>
                                  <strong>Teléfono:</strong>{' '}
                                  <a
                                    href={`https://wa.me/1${reservaSeleccionada.telefono?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${reservaSeleccionada.nombre}, te contacto por tu reserva #${reservaSeleccionada.numero}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-whatsapp-link"
                                  >
                                    📱 {reservaSeleccionada.telefono}
                                  </a>
                                </p>
                              </div>

                              <div className="reserva-detalles-section">
                                <h4>🚗 Servicio</h4>
                                <p><strong>Servicio:</strong> {reservaSeleccionada.servicioNombre}</p>
                                <p><strong>Fecha:</strong> {reservaSeleccionada.fecha}</p>
                                <p><strong>Duración:</strong> {reservaSeleccionada.duracion} día(s)</p>
                                {reservaSeleccionada.entregaDomicilio && (
                                  <>
                                    <p style={{ color: 'var(--verde-acento)' }}><strong>🏠 Entrega a domicilio:</strong> Sí</p>
                                    {reservaSeleccionada.tipoEntrega && <p><strong>Tipo:</strong> {reservaSeleccionada.tipoEntrega}</p>}
                                    {reservaSeleccionada.direccion && <p><strong>Dirección:</strong> {reservaSeleccionada.direccion}</p>}
                                  </>
                                )}
                              </div>

                              <div className="reserva-detalles-section">
                                <h4>💰 Pago</h4>
                                <p><strong>Total:</strong> RD${reservaSeleccionada.total?.toLocaleString()}</p>
                                <p><strong>Depósito (50%):</strong> RD${reservaSeleccionada.deposito?.toLocaleString()}</p>
                                <p><strong>Resto al recoger:</strong> RD${(reservaSeleccionada.total - reservaSeleccionada.deposito)?.toLocaleString()}</p>
                                <p><strong>Método:</strong> {reservaSeleccionada.metodoPago?.toUpperCase()}</p>
                              </div>

                              {reservaSeleccionada.mensaje && (
                                <div className="reserva-detalles-section">
                                  <h4>📝 Mensaje del cliente</h4>
                                  <p style={{ fontStyle: 'italic' }}>{reservaSeleccionada.mensaje}</p>
                                </div>
                              )}
                            </div>

                            <div className="reserva-detalles-actions">
                              <a
                                href={`https://wa.me/1${reservaSeleccionada.telefono?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${reservaSeleccionada.nombre}, te contacto por tu reserva #${reservaSeleccionada.numero} del servicio: ${reservaSeleccionada.servicioNombre}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-whatsapp"
                              >
                                📱 Contactar por WhatsApp
                              </a>
                              <button
                                onClick={() => {
                                  const texto = `Reserva #${reservaSeleccionada.numero}
Cliente: ${reservaSeleccionada.nombre}
Teléfono: ${reservaSeleccionada.telefono}
Servicio: ${reservaSeleccionada.servicioNombre}
Fecha: ${reservaSeleccionada.fecha}
Duración: ${reservaSeleccionada.duracion} día(s)
Total: RD$${reservaSeleccionada.total?.toLocaleString()}
Depósito: RD$${reservaSeleccionada.deposito?.toLocaleString()}
Método: ${reservaSeleccionada.metodoPago}`
                                  navigator.clipboard.writeText(texto)
                                  alert('Información copiada al portapapeles')
                                }}
                                className="btn btn-secondary"
                              >
                                📋 Copiar información
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="admin-dashboard-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Transporte TerraMar - Panel de Administración</p>
        </div>
      </footer>
    </div>
  )
}

export { AdminLoginPage, AdminDashboard }
