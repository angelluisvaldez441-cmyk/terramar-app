// ============================================
// SERVICIO DE BASE DE DATOS - FIREBASE
// ============================================
// Reemplaza el localStorage con Firebase Firestore
// para sincronización en tiempo real entre dispositivos

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'

// Configuración de Firebase - Proyecto: terramar-app
const firebaseConfig = {
  apiKey: "AIzaSyDohqotMsD6ddNl5acJQX_V-tkYOKwQopE",
  authDomain: "terramar-app.firebaseapp.com",
  projectId: "terramar-app",
  storageBucket: "terramar-app.firebasestorage.app",
  messagingSenderId: "755582276233",
  appId: "1:755582276233:web:b0e0aebb1dd154e4382c58"
}

// Inicializar Firebase
let db
let firebaseDisponible = false

try {
  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  firebaseDisponible = true
  console.log('✅ Firebase inicializado correctamente (terramar-app)')
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error)
  firebaseDisponible = false
}

// Storage keys para localStorage (fallback)
const STORAGE_KEYS = {
  RESERVAS: 'reservas_terramar',
  FOTOS: 'fotos_terramar'
}

// ============================================
// FUNCIONES PARA RESERVAS
// ============================================

export const obtenerReservas = async () => {
  if (firebaseDisponible) {
    try {
      const q = query(collection(db, 'reservas'), orderBy('fechaReserva', 'asc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error al obtener reservas de Firebase:', error)
    }
  }
  // Fallback a localStorage
  try {
    const item = localStorage.getItem(STORAGE_KEYS.RESERVAS)
    return item ? JSON.parse(item) : []
  } catch (error) {
    console.error('Error al obtener reservas de localStorage:', error)
    return []
  }
}

export const guardarReserva = async (reserva) => {
  if (firebaseDisponible) {
    try {
      const docRef = doc(collection(db, 'reservas'))
      const reservaConId = {
        ...reserva,
        id: docRef.id,
        fechaCreacion: new Date().toISOString()
      }
      await setDoc(docRef, reservaConId)
      console.log('✅ Reserva guardada en Firebase:', reservaConId.numero)
      return { id: docRef.id, ...reservaConId }
    } catch (error) {
      console.error('Error al guardar reserva en Firebase:', error)
    }
  }
  // Fallback a localStorage
  try {
    const reservasExistentes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVAS) || '[]')
    const nuevaReserva = {
      ...reserva,
      id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9),
      fechaCreacion: new Date().toISOString()
    }
    reservasExistentes.push(nuevaReserva)
    localStorage.setItem(STORAGE_KEYS.RESERVAS, JSON.stringify(reservasExistentes))
    console.log('✅ Reserva guardada en localStorage:', nuevaReserva.numero)
    return nuevaReserva
  } catch (error) {
    console.error('Error al guardar reserva en localStorage:', error)
    throw error
  }
}

export const eliminarReserva = async (id) => {
  if (!id) {
    console.error('ID de reserva no válido')
    throw new Error('ID de reserva no válido')
  }

  if (firebaseDisponible) {
    try {
      await deleteDoc(doc(db, 'reservas', id))
      console.log('✅ Reserva eliminada de Firebase:', id)
      return true
    } catch (error) {
      console.error('Error al eliminar reserva de Firebase:', error)
    }
  }
  // Fallback a localStorage
  try {
    const reservas = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVAS) || '[]')
    const nuevasReservas = reservas.filter(r => r.id !== id)
    localStorage.setItem(STORAGE_KEYS.RESERVAS, JSON.stringify(nuevasReservas))
    console.log('✅ Reserva eliminada de localStorage:', id)
    return true
  } catch (error) {
    console.error('Error al eliminar reserva de localStorage:', error)
    throw error
  }
}

// Escuchar cambios en tiempo real
export const escucharReservasEnTiempoReal = (callback) => {
  if (firebaseDisponible) {
    try {
      const q = query(collection(db, 'reservas'), orderBy('fechaReserva', 'asc'))
      const unsubscribe = onSnapshot(q, (snapshot) => {
        try {
          const reservas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          console.log('🔄 Reservas actualizadas (Firebase):', reservas.length)
          callback(reservas)
        } catch (error) {
          console.error('Error al procesar snapshot de reservas:', error)
          callback([])
        }
      }, (error) => {
        console.error('Error escuchando reservas de Firebase:', error)
        // Si falla Firebase, usar localStorage
        callback([])
      })
      return unsubscribe
    } catch (error) {
      console.error('Error al establecer listener en Firebase:', error)
    }
  }

  // Fallback: poll cada 2 segundos desde localStorage
  console.log('⚠️ Usando localStorage para reservas (polling cada 2s)')
  let ultimoEstado = null
  const verificarCambios = async () => {
    try {
      const reservas = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVAS) || '[]')
      const estadoActual = JSON.stringify(reservas)
      if (estadoActual !== ultimoEstado) {
        ultimoEstado = estadoActual
        console.log('🔄 Reservas actualizadas (localStorage):', reservas.length)
        callback(reservas)
      }
    } catch (error) {
      console.error('Error al verificar cambios en localStorage:', error)
    }
  }
  verificarCambios()
  const interval = setInterval(verificarCambios, 2000)
  return () => clearInterval(interval)
}

// ============================================
// FUNCIONES PARA FOTOS
// ============================================

export const obtenerFotos = async () => {
  try {
    const docSnap = await getDoc(doc(db, 'fotos', 'imagenes'))
    return docSnap.data() || {}
  } catch (error) {
    console.error('Error al obtener fotos de Firebase:', error)
    // Fallback a localStorage
    try {
      const item = localStorage.getItem(STORAGE_KEYS.FOTOS)
      return item ? JSON.parse(item) : {}
    } catch (error) {
      console.error('Error al obtener fotos de localStorage:', error)
      return {}
    }
  }
}

export const guardarFoto = async (key, base64) => {
  try {
    const docRef = doc(db, 'fotos', 'imagenes')
    await setDoc(docRef, { [key]: base64 }, { merge: true })
  } catch (error) {
    console.error('Error al guardar foto en Firebase:', error)
    // Fallback a localStorage
    try {
      const fotos = JSON.parse(localStorage.getItem(STORAGE_KEYS.FOTOS) || '{}')
      fotos[key] = base64
      localStorage.setItem(STORAGE_KEYS.FOTOS, JSON.stringify(fotos))
    } catch (error) {
      console.error('Error al guardar foto en localStorage:', error)
      throw error
    }
  }
}

export const eliminarFoto = async (key) => {
  try {
    const docRef = doc(db, 'fotos', 'imagenes')
    const docSnap = await getDoc(docRef)
    const data = docSnap.data() || {}
    delete data[key]
    await setDoc(docRef, data)
  } catch (error) {
    console.error('Error al eliminar foto de Firebase:', error)
    // Fallback a localStorage
    try {
      const fotos = JSON.parse(localStorage.getItem(STORAGE_KEYS.FOTOS) || '{}')
      delete fotos[key]
      localStorage.setItem(STORAGE_KEYS.FOTOS, JSON.stringify(fotos))
    } catch (error) {
      console.error('Error al eliminar foto de localStorage:', error)
      throw error
    }
  }
}

export const escucharFotosEnTiempoReal = (callback) => {
  try {
    const unsubscribe = onSnapshot(doc(db, 'fotos', 'imagenes'), (docSnap) => {
      callback(docSnap.data() || {})
    }, (error) => {
      console.error('Error escuchando fotos:', error)
      callback({})
    })
    return unsubscribe
  } catch (error) {
    console.error('Error al establecer listener en tiempo real:', error)
    // Fallback: poll cada 2 segundos
    let ultimoEstado = null
    const verificarCambios = async () => {
      const fotos = await obtenerFotos()
      const estadoActual = JSON.stringify(fotos)
      if (estadoActual !== ultimoEstado) {
        ultimoEstado = estadoActual
        callback(fotos)
      }
    }
    verificarCambios()
    const interval = setInterval(verificarCambios, 2000)
    return () => clearInterval(interval)
  }
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

export const dbService = {
  // Reservas
  obtenerReservas,
  guardarReserva,
  eliminarReserva,
  escucharReservasEnTiempoReal,

  // Fotos
  obtenerFotos,
  guardarFoto,
  eliminarFoto,
  escucharFotosEnTiempoReal
}
