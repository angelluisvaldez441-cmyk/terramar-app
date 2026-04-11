import { useState, useEffect } from 'react'

// ============================================
// COMPONENTE DE EFECTOS DE FONDO
// Modo oscuro, estrellas y paisaje turístico
// ============================================

export function BackgroundEffects() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })
  const [stars, setStars] = useState([])
  const [shootingStars, setShootingStars] = useState([])

  // Aplicar modo oscuro cuando cambia el estado
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode-active')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.body.classList.remove('dark-mode-active')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  // Generar estrellas para modo oscuro
  useEffect(() => {
    const generateStars = () => {
      const newStars = []
      for (let i = 0; i < 200; i++) {
        newStars.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: 1 + Math.random() * 2.5,
          opacity: 0.4 + Math.random() * 0.6,
          twinkleDelay: Math.random() * 5,
          twinkleDuration: 2 + Math.random() * 3
        })
      }
      setStars(newStars)
    }
    generateStars()
  }, [])

  // Generar estrellas fugaces periódicamente
  useEffect(() => {
    const createShootingStar = () => {
      const id = Date.now()
      const newShootingStar = {
        id,
        top: Math.random() * 40,
        delay: Math.random() * 2,
        duration: 1.5 + Math.random() * 1.5,
        length: 100 + Math.random() * 150
      }

      setShootingStars(prev => [...prev, newShootingStar])

      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== id))
      }, (newShootingStar.duration + newShootingStar.delay) * 1000)
    }

    const interval = setInterval(() => {
      if (darkMode && Math.random() > 0.3) {
        createShootingStar()
      }
    }, 4000 + Math.random() * 4000)

    return () => clearInterval(interval)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <>
      <style>{`
        /* ============================================
           CONTENEDOR PRINCIPAL DE EFECTOS
           ============================================ */
        .background-effects-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        /* ============================================
           MODO CLARO - FONDO VERDE
           ============================================ */
        .tourist-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            180deg,
            #B8E8B8 0%,
            #90C890 50%,
            #6B8E6B 100%
          );
          z-index: -2;
          pointer-events: none;
        }

        /* ============================================
           MODO OSCURO - CIELO NOCTURNO
           ============================================ */
        .dark-mode-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            180deg,
            #0a0a1a 0%,
            #0f0f2e 20%,
            #1a1a3e 40%,
            #16213e 60%,
            #0f0f23 80%,
            #0a0a1a 100%
          );
          z-index: -2;
          pointer-events: none;
        }

        /* Luna en modo oscuro */
        .dark-moon {
          position: fixed;
          top: 80px;
          right: 100px;
          width: 70px;
          height: 70px;
          background: radial-gradient(circle at 30% 30%, #f5f5f5 0%, #e0e0e0 50%, #c0c0c0 100%);
          border-radius: 50%;
          box-shadow: 
            0 0 40px 10px rgba(245, 245, 245, 0.6),
            0 0 80px 20px rgba(245, 245, 245, 0.4),
            inset -10px -10px 20px rgba(0,0,0,0.1);
          z-index: -1;
          animation: moonGlow 5s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes moonGlow {
          0%, 100% {
            box-shadow: 
              0 0 40px 10px rgba(245, 245, 245, 0.6),
              0 0 80px 20px rgba(245, 245, 245, 0.4);
          }
          50% {
            box-shadow: 
              0 0 60px 15px rgba(245, 245, 245, 0.8),
              0 0 100px 30px rgba(245, 245, 245, 0.6);
          }
        }

        /* Estrellas */
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle ease-in-out infinite;
          pointer-events: none;
          box-shadow: 0 0 6px 2px rgba(255, 255, 255, 0.6);
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        /* Estrellas fugaces */
        .shooting-star {
          position: absolute;
          top: 0;
          left: 100%;
          width: 3px;
          height: 3px;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.8) 100%
          );
          border-radius: 50%;
          box-shadow: 
            0 0 10px 2px rgba(255, 255, 255, 0.8),
            0 0 20px 4px rgba(255, 255, 255, 0.5),
            0 0 40px 8px rgba(255, 255, 255, 0.3);
          animation: shoot linear forwards;
          pointer-events: none;
          transform: rotate(-45deg);
        }

        .shooting-star::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: var(--length);
          height: 2px;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 1) 100%
          );
          transform: translateX(100%) rotate(45deg);
          border-radius: 2px;
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(-150vw) translateY(150vh) rotate(-45deg);
            opacity: 0;
          }
        }

        /* ============================================
           BOTÓN FLOTANTE MODO OSCURO/CLARO
           ============================================ */
        .mode-toggle-btn {
          position: fixed;
          top: 80px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            ${darkMode ? '#1a1a3e' : '#f0f8ff'} 0%,
            ${darkMode ? '#0f0f2e' : '#e6f3ff'} 100%
          );
          border: 2px solid ${darkMode ? '#4a9eff' : '#ffd700'};
          box-shadow:
            0 4px 25px rgba(0, 0, 0, 0.4),
            ${darkMode ? '0 0 40px rgba(74, 158, 255, 0.6)' : '0 0 40px rgba(255, 215, 0, 0.6)'};
          cursor: pointer;
          z-index: 10002;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          pointer-events: auto;
        }

        .mode-toggle-btn:hover {
          transform: scale(1.15) rotate(20deg);
          box-shadow:
            0 8px 40px rgba(0, 0, 0, 0.5),
            ${darkMode ? '0 0 60px rgba(74, 158, 255, 0.9)' : '0 0 60px rgba(255, 215, 0, 0.9)'};
        }

        .mode-toggle-btn:active {
          transform: scale(0.9);
        }

        /* Responsive para móviles */
        @media (max-width: 768px) {
          .mode-toggle-btn {
            top: auto;
            bottom: 100px;
            right: 20px;
            width: 45px;
            height: 45px;
            font-size: 1.2rem;
            border-width: 2px;
          }
        }

        /* ============================================
           ESTILOS GLOBALES PARA MODO OSCURO
           ============================================ */

        /* Hacer transparentes los fondos base */
        body.dark-mode-active {
          background: transparent !important;
        }

        body.dark-mode-active .app {
          background: transparent !important;
        }

        body.dark-mode-active main {
          background: transparent !important;
        }

        body.dark-mode-active .section {
          background: transparent !important;
        }

        /* Secciones específicas - hacer transparentes */
        body.dark-mode-active .hero {
          background: transparent !important;
        }

        body.dark-mode-active .hero::before {
          background: transparent !important;
        }

        body.dark-mode-active .animales-section {
          background: transparent !important;
        }

        body.dark-mode-active .por-que-section {
          background: transparent !important;
        }

        body.dark-mode-active .reservas-section {
          background: transparent !important;
        }

        body.dark-mode-active .payment-section {
          background: transparent !important;
        }

        body.dark-mode-active .vision-mision-valores-section {
          background: transparent !important;
        }

        body.dark-mode-active .contacto-section {
          background: transparent !important;
        }

        body.dark-mode-active .footer {
          background: transparent !important;
        }

        /* Navbar */
        body.dark-mode-active .navbar {
          background: rgba(15, 15, 46, 0.85) !important;
          box-shadow: 0 2px 20px rgba(74, 158, 255, 0.3) !important;
          border-bottom: 1px solid rgba(74, 158, 255, 0.2) !important;
        }

        body.dark-mode-active .navbar-logo {
          color: #4a9eff !important;
          text-shadow: 0 0 10px rgba(74, 158, 255, 0.5) !important;
        }

        body.dark-mode-active .navbar-link {
          color: #e0e0e0 !important;
        }

        body.dark-mode-active .navbar-link::after {
          background: #4a9eff !important;
        }

        body.dark-mode-active .navbar-admin {
          border-color: rgba(74, 158, 255, 0.5) !important;
          color: #4a9eff !important;
        }

        body.dark-mode-active .navbar-admin:hover {
          background: rgba(74, 158, 255, 0.2) !important;
          border-color: #4a9eff !important;
        }

        body.dark-mode-active .btn-whatsapp {
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.5) !important;
        }

        /* Hero Section */
        body.dark-mode-active .hero {
          background: rgba(15, 15, 46, 0.7) !important;
        }

        body.dark-mode-active .hero::before {
          opacity: 0.2 !important;
        }

        body.dark-mode-active .hero-badge {
          background: rgba(74, 158, 255, 0.2) !important;
          border-color: rgba(74, 158, 255, 0.3) !important;
          color: #4a9eff !important;
        }

        body.dark-mode-active .hero-title {
          color: #ffffff !important;
          text-shadow: 0 0 30px rgba(74, 158, 255, 0.6) !important;
        }

        body.dark-mode-active .hero-description {
          color: #c0c0c0 !important;
        }

        body.dark-mode-active .hero-scroll {
          color: #4a9eff !important;
        }

        /* Cards */
        body.dark-mode-active .card {
          background: rgba(26, 26, 62, 0.7) !important;
          box-shadow: 0 4px 25px rgba(74, 158, 255, 0.2) !important;
          border: 1px solid rgba(74, 158, 255, 0.3) !important;
        }

        body.dark-mode-active .card:hover {
          box-shadow: 0 12px 50px rgba(74, 158, 255, 0.3) !important;
        }

        body.dark-mode-active .card-title {
          color: #4a9eff !important;
        }

        body.dark-mode-active .card-description {
          color: #b0b0b0 !important;
        }

        body.dark-mode-active .card-price {
          color: #ffd700 !important;
        }

        body.dark-mode-active .card-badge {
          background: linear-gradient(135deg, #ffd700, #ffed4e) !important;
          color: #1a1a1a !important;
        }

        /* Secciones */
        body.dark-mode-active .section-title {
          color: #4a9eff !important;
          text-shadow: 0 0 15px rgba(74, 158, 255, 0.4) !important;
        }

        body.dark-mode-active .section-subtitle {
          color: #a0a0a0 !important;
        }

        body.dark-mode-active .animales-section {
          background: rgba(15, 15, 46, 0.5) !important;
        }

        /* Por Qué Section */
        body.dark-mode-active .por-que-section {
          background: rgba(10, 10, 26, 0.6) !important;
        }

        body.dark-mode-active .por-que-section .section-title,
        body.dark-mode-active .por-que-section .section-subtitle {
          color: #ffffff !important;
        }

        body.dark-mode-active .feature-card {
          background: rgba(26, 26, 62, 0.5) !important;
          border: 1px solid rgba(74, 158, 255, 0.3) !important;
        }

        body.dark-mode-active .feature-card:hover {
          background: rgba(26, 26, 62, 0.7) !important;
        }

        body.dark-mode-active .feature-title {
          color: #ffffff !important;
        }

        body.dark-mode-active .feature-description {
          color: #a0a0a0 !important;
        }

        body.dark-mode-active .feature-icon {
          filter: drop-shadow(0 0 10px rgba(74, 158, 255, 0.5));
        }

        /* Valores - VMV Cards */
        body.dark-mode-active .vmv-description {
          color: #c0c0c0 !important;
        }

        body.dark-mode-active .vmv-list {
          color: #c0c0c0 !important;
        }

        body.dark-mode-active .vmv-list li {
          background: rgba(26, 26, 62, 0.5) !important;
          color: #c0c0c0 !important;
        }

        body.dark-mode-active .vmv-list li:hover {
          background: rgba(26, 26, 62, 0.7) !important;
        }

        body.dark-mode-active .vmv-list li strong {
          color: #4a9eff !important;
        }

        body.dark-mode-active .vmv-list li p {
          color: #c0c0c0 !important;
        }

        body.dark-mode-active .vmv-list {
          background: transparent !important;
        }

        body.dark-mode-active .vmv-list-icon {
          filter: drop-shadow(0 0 5px rgba(74, 158, 255, 0.5));
        }

        /* Formulario de Reservas */
        body.dark-mode-active .booking-container {
          background: rgba(26, 26, 62, 0.7) !important;
          box-shadow: 0 8px 50px rgba(74, 158, 255, 0.25) !important;
          border: 1px solid rgba(74, 158, 255, 0.2) !important;
        }

        body.dark-mode-active .booking-header {
          background: rgba(26, 26, 62, 0.5) !important;
          border-bottom: 1px solid rgba(74, 158, 255, 0.3) !important;
        }

        body.dark-mode-active .booking-header h2 {
          color: #4a9eff !important;
          text-shadow: 0 0 10px rgba(74, 158, 255, 0.4) !important;
        }

        body.dark-mode-active .form-label {
          color: #4a9eff !important;
        }

        body.dark-mode-active .form-input,
        body.dark-mode-active .form-select,
        body.dark-mode-active .form-textarea {
          background: #0a0a1a !important;
          border-color: #2a2a4e !important;
          color: #ffffff !important;
        }

        body.dark-mode-active .form-input:focus,
        body.dark-mode-active .form-select:focus,
        body.dark-mode-active .form-textarea:focus {
          border-color: #4a9eff !important;
          box-shadow: 0 0 0 4px rgba(74, 158, 255, 0.25) !important;
        }

        body.dark-mode-active .price-summary {
          background: rgba(26, 26, 62, 0.5) !important;
          border: 1px solid rgba(74, 158, 255, 0.2) !important;
        }

        body.dark-mode-active .price-label {
          color: #a0a0a0 !important;
        }

        body.dark-mode-active .price-value {
          color: #4a9eff !important;
        }

        body.dark-mode-active .price-value.highlight {
          color: #ffd700 !important;
        }

        /* Botones */
        body.dark-mode-active .btn-primary {
          background: linear-gradient(135deg, #4a9eff 0%, #2d7dd2 100%) !important;
          box-shadow: 0 4px 20px rgba(74, 158, 255, 0.4) !important;
        }

        body.dark-mode-active .btn-primary:hover {
          box-shadow: 0 8px 35px rgba(74, 158, 255, 0.6) !important;
        }

        body.dark-mode-active .btn-secondary {
          border-color: #4a9eff !important;
          color: #4a9eff !important;
        }

        body.dark-mode-active .btn-secondary:hover {
          background: rgba(74, 158, 255, 0.2) !important;
          color: #ffffff !important;
        }

        body.dark-mode-active .btn-gold {
          background: linear-gradient(135deg, #ffd700, #ffed4e) !important;
          color: #1a1a1a !important;
        }

        /* Payment Section */
        body.dark-mode-active .payment-summary {
          background: rgba(26, 26, 62, 0.5) !important;
          border: 1px solid rgba(74, 158, 255, 0.2) !important;
        }

        body.dark-mode-active .payment-summary h3 {
          color: #4a9eff !important;
        }

        body.dark-mode-active .payment-tab {
          background: #0a0a1a !important;
          border-color: #2a2a4e !important;
          color: #a0a0a0 !important;
        }

        body.dark-mode-active .payment-tab:hover {
          border-color: #4a9eff !important;
        }

        body.dark-mode-active .payment-tab.active {
          background: linear-gradient(135deg, #4a9eff 0%, #2d7dd2 100%) !important;
          color: #ffffff !important;
          border-color: #4a9eff !important;
        }

        body.dark-mode-active .payment-content {
          background: rgba(10, 10, 26, 0.5) !important;
          border-color: #2a2a4e !important;
        }

        /* Bank Info - Transferencia */
        body.dark-mode-active .bank-info {
          background: rgba(26, 26, 62, 0.8) !important;
          border: 1px solid rgba(74, 158, 255, 0.3) !important;
        }

        body.dark-mode-active .bank-info-row {
          border-bottom-color: rgba(74, 158, 255, 0.2) !important;
        }

        body.dark-mode-active .bank-info-label {
          color: #a0a0a0 !important;
        }

        body.dark-mode-active .bank-info-value {
          color: #4a9eff !important;
        }

        /* Credit Card Visual */
        body.dark-mode-active .credit-card-visual {
          background: linear-gradient(135deg, #2a2a4e 0%, #1a1a3e 100%) !important;
          border: 1px solid rgba(74, 158, 255, 0.3) !important;
        }

        body.dark-mode-active .credit-card-number-display {
          color: #ffffff !important;
        }

        body.dark-mode-active .credit-card-label {
          color: #a0a0a0 !important;
        }

        body.dark-mode-active .credit-card-value {
          color: #4a9eff !important;
        }

        /* Payment instructions text */
        body.dark-mode-active .payment-content p {
          color: #c0c0c0 !important;
        }

        body.dark-mode-active .payment-content strong {
          color: #e0e0e0 !important;
        }

        /* Booking info box */
        body.dark-mode-active .booking-body > div[style*="rgba(39, 174, 96"] {
          background: rgba(26, 26, 62, 0.6) !important;
          border-color: rgba(74, 158, 255, 0.3) !important;
        }

        body.dark-mode-active .booking-body > div[style*="rgba(39, 174, 96"] p:first-child {
          color: #4a9eff !important;
        }

        body.dark-mode-active .booking-body > div[style*="rgba(39, 174, 96"] p:last-child {
          color: #a0a0a0 !important;
        }

        /* PayPal success message */
        body.dark-mode-active div[style*="background: #d4edda"] {
          background: rgba(26, 92, 56, 0.5) !important;
          color: #4a9eff !important;
        }

        /* Footer */
        body.dark-mode-active footer {
          background: rgba(15, 15, 46, 0.8) !important;
          border-top: 1px solid rgba(74, 158, 255, 0.2) !important;
        }

        body.dark-mode-active .footer-content h3 {
          color: #4a9eff !important;
          text-shadow: 0 0 10px rgba(74, 158, 255, 0.4) !important;
        }

        body.dark-mode-active .footer-content p,
        body.dark-mode-active .footer-content a {
          color: #a0a0a0 !important;
        }

        body.dark-mode-active .footer-content a:hover {
          color: #4a9eff !important;
        }

        body.dark-mode-active .footer-bottom {
          border-top: 1px solid rgba(74, 158, 255, 0.1) !important;
          color: #808080 !important;
        }

        /* WhatsApp Float */
        body.dark-mode-active .whatsapp-float {
          box-shadow: 0 4px 25px rgba(37, 211, 102, 0.5) !important;
        }

        body.dark-mode-active .whatsapp-float:hover {
          box-shadow: 0 8px 40px rgba(37, 211, 102, 0.7) !important;
        }

        /* Admin Panel */
        body.dark-mode-active .admin-panel-overlay {
          background: rgba(0, 0, 0, 0.85) !important;
        }

        body.dark-mode-active .admin-panel {
          background: rgba(15, 15, 46, 0.95) !important;
        }

        body.dark-mode-active .admin-card {
          background: rgba(26, 26, 62, 0.8) !important;
          border: 1px solid rgba(74, 158, 255, 0.2) !important;
          box-shadow: 0 4px 25px rgba(74, 158, 255, 0.15) !important;
        }

        body.dark-mode-active .admin-card-header {
          background: linear-gradient(135deg, #4a9eff 0%, #2d7dd2 100%) !important;
        }

        body.dark-mode-active .admin-tab {
          background: rgba(10, 10, 26, 0.5) !important;
          border-color: #2a2a4e !important;
          color: #a0a0a0 !important;
        }

        body.dark-mode-active .admin-tab.active {
          background: linear-gradient(135deg, #4a9eff 0%, #2d7dd2 100%) !important;
          color: #ffffff !important;
          border-color: #4a9eff !important;
        }

        body.dark-mode-active .form-input,
        body.dark-mode-active .form-select {
          background: #0a0a1a !important;
          border-color: #2a2a4e !important;
          color: #ffffff !important;
        }

        body.dark-mode-active .reservas-table thead tr {
          background: linear-gradient(135deg, #4a9eff 0%, #2d7dd2 100%) !important;
        }

        body.dark-mode-active .reservas-table tbody tr {
          border-bottom-color: rgba(74, 158, 255, 0.2) !important;
        }

        body.dark-mode-active .reservas-table tbody tr:nth-child(even) {
          background: rgba(26, 26, 62, 0.2) !important;
        }

        /* Tabla de reservas - texto blanco */
        body.dark-mode-active .reservas-table td {
          color: #ffffff !important;
        }

        body.dark-mode-active .reservas-table th {
          color: #ffffff !important;
        }

        body.dark-mode-active .reservas-table tbody tr td a {
          color: #4a9eff !important;
        }

        body.dark-mode-active .reservas-table .estado-pendiente {
          color: #ffd700 !important;
        }

        body.dark-mode-active .reservas-table .estado-entregado {
          color: #52c47a !important;
        }

        body.dark-mode-active .reservas-table .numero-reserva {
          color: #ffffff !important;
          font-family: monospace !important;
        }

        /* Vision Mision Section */
        body.dark-mode-active .vision-mision-valores-section {
          background: rgba(10, 10, 26, 0.5) !important;
        }

        body.dark-mode-active .vmv-card {
          background: rgba(26, 26, 62, 0.7) !important;
          border: 1px solid rgba(74, 158, 255, 0.2) !important;
          box-shadow: 0 4px 25px rgba(74, 158, 255, 0.15) !important;
        }

        body.dark-mode-active .vmv-card:hover {
          box-shadow: 0 12px 50px rgba(74, 158, 255, 0.25) !important;
        }

        body.dark-mode-active .vmv-icon {
          filter: drop-shadow(0 0 15px rgba(74, 158, 255, 0.5));
        }

        body.dark-mode-active .vmv-title {
          color: #4a9eff !important;
        }

        body.dark-mode-active .vmv-description {
          color: #a0a0a0 !important;
        }

        /* Contacto Section */
        body.dark-mode-active .contacto-section {
          background: rgba(15, 15, 46, 0.5) !important;
        }

        body.dark-mode-active .contacto-card {
          background: rgba(26, 26, 62, 0.7) !important;
          border: 1px solid rgba(74, 158, 255, 0.2) !important;
        }

        body.dark-mode-active .contacto-card:hover {
          border-color: rgba(74, 158, 255, 0.4) !important;
          box-shadow: 0 8px 35px rgba(74, 158, 255, 0.25) !important;
        }

        body.dark-mode-active .contacto-icon {
          filter: drop-shadow(0 0 10px rgba(74, 158, 255, 0.5));
        }

        body.dark-mode-active .contacto-title {
          color: #4a9eff !important;
        }

        body.dark-mode-active .contacto-info {
          color: #c0c0c0 !important;
        }

        body.dark-mode-active .contacto-info a {
          color: #c0c0c0 !important;
        }

        body.dark-mode-active .contacto-info a:hover {
          color: #4a9eff !important;
          text-decoration: underline !important;
        }

        /* Contacto específico - WhatsApp, Email, Ubicación, Redes */
        body.dark-mode-active .contact-whatsapp {
          color: #c0c0c0 !important;
        }

        body.dark-mode-active .contact-email {
          color: #c0c0c0 !important;
        }

        body.dark-mode-active .contact-ubicacion {
          color: #c0c0c0 !important;
        }

        body.dark-mode-active .contact-redes {
          color: #c0c0c0 !important;
        }

        /* Modal */
        body.dark-mode-active .modal-overlay {
          background: rgba(0, 0, 0, 0.85) !important;
        }

        body.dark-mode-active .modal-container {
          background: rgba(26, 26, 62, 0.95) !important;
          border: 1px solid rgba(74, 158, 255, 0.3) !important;
        }

        body.dark-mode-active .form-label {
          color: #4a9eff !important;
        }

        /* Stripe y PayPal */
        body.dark-mode-active .stripe-card-element {
          background: #0a0a1a !important;
          border-color: #2a2a4e !important;
        }

        body.dark-mode-active .stripe-card-element:focus-within {
          border-color: #4a9eff !important;
          box-shadow: 0 0 0 3px rgba(74, 158, 255, 0.15) !important;
        }

        body.dark-mode-active .paypal-button-container iframe {
          filter: invert(0.9) hue-rotate(180deg);
        }
      `}</style>

      {/* Fondo según el modo */}
      {darkMode ? (
        /* MODO OSCURO */
        <>
          <div className="dark-mode-background">
            {/* Estrellas */}
            {stars.map((star) => (
              <div
                key={star.id}
                className="star"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  opacity: star.opacity,
                  animationDelay: `${star.twinkleDelay}s`,
                  animationDuration: `${star.twinkleDuration}s`
                }}
              />
            ))}

            {/* Estrellas fugaces */}
            {shootingStars.map((shootingStar) => (
              <div
                key={shootingStar.id}
                className="shooting-star"
                style={{
                  top: `${shootingStar.top}%`,
                  animationDelay: `${shootingStar.delay}s`,
                  animationDuration: `${shootingStar.duration}s`,
                  '--length': `${shootingStar.length}px`
                }}
              />
            ))}
          </div>

          {/* Luna */}
          <div className="dark-moon" />
        </>
      ) : (
        /* MODO CLARO - FONDO VERDE */
        <>
          <div className="tourist-background" />
        </>
      )}

      {/* Botón flotante para cambiar modo */}
      <button
        className="mode-toggle-btn"
        onClick={toggleDarkMode}
        aria-label={darkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </>
  )
}

