import { useState, useEffect } from 'react'
import './index.css'
import { dbService } from './db'

const STORAGE_KEYS = {
  ADMIN_LOGGED: 'admin_logged_in'
}

// ============================================
// MODAL DE LOGIN
// ============================================

function AdminLoginModal({ isOpen, onClose, onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (usuario === 'admin' && password === 'terramar2025') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED, 'true')
      onLogin()
      setUsuario('')
      setPassword('')
      setError('')
    } else {
      setError('Usuario o contraseña incorrectos')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{
        background: 'var(--blanco)',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'slideUp 0.3s ease forwards'
      }}>
        <div className="modal-header" style={{
          background: 'linear-gradient(135deg, var(--verde-primario), var(--verde-secundario))',
          color: 'var(--blanco)',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ color: 'var(--blanco)', fontSize: '1.5rem', margin: 0 }}>🔐 Panel de Administración</h3>
          <button className="modal-close" onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--blanco)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>×</button>
        </div>
        <div className="modal-body" style={{ padding: '32px 24px' }}>
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--gris-texto)' }}>Usuario</label>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--verde-claro)', borderRadius: '8px', fontSize: '1rem' }}
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="admin"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--gris-texto)' }}>Contraseña</label>
              <input
                type="password"
                className="form-input"
                style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--verde-claro)', borderRadius: '8px', fontSize: '1rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p style={{ color: '#d32f2f', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px 24px', fontSize: '1rem', fontWeight: '600' }}>Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PANEL DE ADMINISTRACIÓN
// ============================================

function AdminPanelContent({ onClose, fotos, setFotos }) {
  const [tabActiva, setTabActiva] = useState('fotos')
  const [reservas, setReservas] = useState([])
  const [mostrarAyuda, setMostrarAyuda] = useState(true)

  useEffect(() => {
    // Escuchar reservas en tiempo real
    const unsubscribeReservas = dbService.escucharReservasEnTiempoReal((reservasData) => {
      const reservasOrdenadas = [...reservasData].sort((a, b) => {
        const fechaA = a.fechaReserva ? new Date(a.fechaReserva).getTime() : 0
        const fechaB = b.fechaReserva ? new Date(b.fechaReserva).getTime() : 0
        return fechaA - fechaB
      })
      setReservas(reservasOrdenadas)
    })

    return () => {
      unsubscribeReservas()
    }
  }, [])

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
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED)
    onClose()
  }

  const handleResetAllFotos = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las fotos personalizadas?')) {
      const photoKeys = ['photo_moto', 'photo_jeep', 'photo_quad', 'photo_lancha', 'photo_entrega', 'photo_caballo', 'photo_burro', 'photo_mula']
      for (const key of photoKeys) {
        try {
          await dbService.eliminarFoto(key)
        } catch (error) {
          console.error(`Error al eliminar foto ${key}:`, error)
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

  return (
    <div className="admin-panel-overlay" onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      overflow: 'auto'
    }}>
      <div className="admin-panel" onClick={(e) => e.stopPropagation()} style={{
        minHeight: '100vh',
        background: 'var(--blanco-natural)',
        padding: '100px 20px 40px'
      }}>
        <div className="container">
          <div className="admin-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <h2 style={{ color: 'var(--verde-primario)', fontSize: '2rem' }}>🔧 Panel de Administración</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={handleResetAllFotos}>🔄 Restablecer Fotos</button>
              <button className="btn btn-secondary" onClick={handleLogout}>🚪 Cerrar Sesión</button>
              <button className="btn btn-secondary" onClick={onClose}>❌ Cerrar Panel</button>
            </div>
          </div>

          {mostrarAyuda && tabActiva === 'fotos' && (
            <div style={{
              background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
              border: '2px solid #52C47A',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              <div style={{ fontSize: '2rem' }}>📸</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#1A5C38', marginBottom: '8px', marginTop: 0 }}>¿Cómo cambiar las fotos?</h3>
                <ol style={{ margin: 0, paddingLeft: '20px', color: '#4A4A4A', lineHeight: 1.6 }}>
                  <li>Haz clic en <strong>"📷 Cambiar foto"</strong> en cualquier tarjeta</li>
                  <li>Selecciona una imagen de tu computadora</li>
                  <li>¡Listo! La imagen se guarda automáticamente en Firebase</li>
                </ol>
                <p style={{ margin: '12px 0 0 0', fontSize: '0.9rem', color: '#8B8B8B' }}>💡 <strong>Tip:</strong> Las fotos se sincronizan en todos los dispositivos automáticamente</p>
              </div>
              <button onClick={() => setMostrarAyuda(false)} style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#1A5C38',
                padding: '0',
                lineHeight: 1
              }}>×</button>
            </div>
          )}

          <div className="admin-tabs" style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <button
              className={`admin-tab ${tabActiva === 'fotos' ? 'active' : ''}`}
              onClick={() => setTabActiva('fotos')}
              style={{
                padding: '12px 24px',
                background: tabActiva === 'fotos' ? 'var(--verde-primario)' : 'var(--blanco)',
                border: '2px solid var(--verde-claro)',
                borderRadius: '8px',
                fontWeight: '600',
                color: tabActiva === 'fotos' ? 'var(--blanco)' : 'var(--gris-texto)',
                cursor: 'pointer'
              }}
            >
              📸 Gestionar Fotos
            </button>
            <button
              className={`admin-tab ${tabActiva === 'reservas' ? 'active' : ''}`}
              onClick={() => setTabActiva('reservas')}
              style={{
                padding: '12px 24px',
                background: tabActiva === 'reservas' ? 'var(--verde-primario)' : 'var(--blanco)',
                border: '2px solid var(--verde-claro)',
                borderRadius: '8px',
                fontWeight: '600',
                color: tabActiva === 'reservas' ? 'var(--blanco)' : 'var(--gris-texto)',
                cursor: 'pointer'
              }}
            >
              📋 Ver Reservas ({reservas.length}) - Tiempo Real
            </button>
          </div>

          {tabActiva === 'fotos' && (
            <div className="admin-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {itemsAdmin.map((item) => (
                <div key={item.key} className="admin-card" style={{
                  background: 'var(--blanco)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(26, 92, 56, 0.15)'
                }}>
                  <div className="admin-card-header" style={{
                    background: 'linear-gradient(135deg, var(--verde-primario), var(--verde-secundario))',
                    color: 'var(--blanco)',
                    padding: '16px 20px'
                  }}>
                    <h4 style={{ color: 'var(--blanco)', fontSize: '1.2rem', margin: 0 }}>{item.emoji} {item.nombre}</h4>
                  </div>
                  <div className="admin-card-body" style={{ padding: '20px' }}>
                    <div
                      className="admin-photo-preview"
                      onClick={() => document.getElementById(`input-${item.key}`)?.click()}
                      style={{
                        width: '100%',
                        height: '180px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        background: 'var(--verde-claro)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        cursor: 'pointer',
                        overflow: 'hidden'
                      }}
                    >
                      {fotos[item.key] ? (
                        <img src={fotos[item.key]} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span>{item.emoji}</span>
                      )}
                    </div>
                    <input type="file" accept="image/*" id={`input-${item.key}`} style={{ display: 'none' }} onChange={(e) => handleFileChange(item.key, e)} />
                    <div className="admin-actions" style={{ display: 'flex', gap: '12px' }}>
                      <button className="btn btn-primary" onClick={() => document.getElementById(`input-${item.key}`)?.click()} style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem' }}>📷 Cambiar foto</button>
                      {fotos[item.key] && (
                        <button className="btn btn-secondary" onClick={async () => {
                          const nuevosFotos = { ...fotos }
                          delete nuevosFotos[item.key]
                          setFotos(nuevosFotos)
                          try {
                            await dbService.eliminarFoto(item.key)
                          } catch (error) {
                            console.error('Error:', error)
                          }
                        }} style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem' }}>🗑️ Eliminar</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tabActiva === 'reservas' && (
            <div className="admin-card" style={{
              background: 'var(--blanco)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(26, 92, 56, 0.15)',
              gridColumn: '1 / -1'
            }}>
              <div className="admin-card-header" style={{
                background: 'linear-gradient(135deg, var(--verde-primario), var(--verde-secundario))',
                color: 'var(--blanco)',
                padding: '16px 20px'
              }}>
                <h4 style={{ color: 'var(--blanco)', fontSize: '1.2rem', margin: 0 }}>
                  📋 Listado de Reservas ({reservas.length}) - Sincronización en Tiempo Real
                </h4>
              </div>
              <div className="admin-card-body" style={{ padding: '20px' }}>
                {reservas.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '40px', color: '#8B8B8B' }}>No hay reservas registradas</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="reservas-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: 'var(--verde-primario)', color: 'var(--blanco)' }}>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>#</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>Número</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>Nombre</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>Teléfono</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>Servicio</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>Fecha</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>Total</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>Depósito</th>
                          <th style={{ padding: '12px 8px', textAlign: 'left' }}>Método</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservas.map((reserva, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid var(--verde-claro)' }}>
                            <td style={{ padding: '12px 8px', fontWeight: '600', color: 'var(--verde-primario)' }}>{index + 1}</td>
                            <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontWeight: '600' }}>{reserva.numero}</td>
                            <td style={{ padding: '12px 8px' }}>{reserva.nombre}</td>
                            <td style={{ padding: '12px 8px' }}>
                              <a
                                href={`https://wa.me/1${reserva.telefono?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${reserva.nombre}, te contacto por tu reserva: ${reserva.servicioNombre}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#25D366', textDecoration: 'none', fontWeight: '600' }}
                              >
                                📱 {reserva.telefono}
                              </a>
                            </td>
                            <td style={{ padding: '12px 8px' }}>{reserva.servicioNombre}</td>
                            <td style={{ padding: '12px 8px' }}>{reserva.fecha}</td>
                            <td style={{ padding: '12px 8px', color: 'var(--dorado)', fontWeight: '600' }}>RD${reserva.total?.toLocaleString()}</td>
                            <td style={{ padding: '12px 8px', color: 'var(--verde-acento)', fontWeight: '600' }}>RD${reserva.deposito?.toLocaleString()}</td>
                            <td style={{ padding: '12px 8px', textTransform: 'capitalize' }}>{reserva.metodoPago}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p style={{ marginTop: '20px', padding: '12px', background: '#E8F5E9', borderRadius: '8px', color: '#1A5C38', fontSize: '0.9rem' }}>
                      ✅ Las reservas se sincronizan automáticamente entre todos los dispositivos vía Firebase
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// COMPONENTE PRINCIPAL DE ADMIN
// ============================================

export function AdminPanel({ isOpen, onClose, fotos, setFotos }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const logged = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED)
      if (logged === 'true') {
        setIsLoggedIn(true)
      } else {
        setShowLogin(true)
      }
    } else {
      setIsLoggedIn(false)
      setShowLogin(false)
    }
  }, [isOpen])

  const handleLogin = () => {
    setShowLogin(false)
    setIsLoggedIn(true)
  }

  const handleClose = () => {
    setIsLoggedIn(false)
    setShowLogin(false)
    onClose()
  }

  if (!isOpen) return null

  if (showLogin || !isLoggedIn) {
    return <AdminLoginModal isOpen={showLogin || !isLoggedIn} onClose={handleClose} onLogin={handleLogin} />
  }

  return <AdminPanelContent onClose={handleClose} fotos={fotos} setFotos={setFotos} />
}
