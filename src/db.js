// ============================================
// SERVICIO DE BASE DE DATOS - FIREBASE
// ============================================
// Reemplaza el localStorage con Firebase Firestore
// para sincronización en tiempo real entre dispositivos
// Si Firebase no está disponible, usa localStorage como fallback

// Intentar cargar Firebase dinámicamente
let db = null
let firebaseAvailable = false

// Función para inicializar Firebase dinámicamente
const initializeFirebase = async () => {
  if (firebaseAvailable) return

  try {
    // Intentar importar Firebase dinámicamente
    const { initializeApp } = await import('firebase/app')
    const { getFirestore } = await import('firebase/firestore')

    // Configuración de Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDTCCHL_UrdyKa31PlRsOJPJZTdbHwr49g",
      authDomain: "terramar-app-2865f.firebaseapp.com",
      projectId: "terramar-app-2865f",
      storageBucket: "terramar-app-2865f.firebasestorage.app",
      messagingSenderId: "603093572620",
      appId: "1:603093572620:web:d4ed5781cc9b846a8ea229"
    }

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    firebaseAvailable = true

    console.log('✅ Firebase disponible - sincronización en tiempo real activada')
  } catch (error) {
    console.warn('⚠️ Firebase no disponible - usando localStorage como fallback')
    console.warn('Para sincronización entre dispositivos, instala firebase: npm install firebase')
  }
}

// Intentar inicializar Firebase (puede fallar si no está instalado)
initializeFirebase().catch(() => { })

// Storage keys para localStorage
const STORAGE_KEYS = {
  RESERVAS: 'reservas_terramar',
  FOTOS: 'fotos_terramar'
}

// ============================================
// FUNCIONES PARA RESERVAS
// ============================================

export const obtenerReservas = async () => {
  if (firebaseAvailable) {
    try {
      const { collection, getDocs, query, orderBy } = await import('firebase/firestore')
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
  if (firebaseAvailable) {
    try {
      const { collection, doc, setDoc } = await import('firebase/firestore')
      const docRef = doc(collection(db, 'reservas'))
      await setDoc(docRef, {
        ...reserva,
        fechaCreacion: new Date().toISOString()
      })
      return { id: docRef.id, ...reserva }
    } catch (error) {
      console.error('Error al guardar reserva en Firebase:', error)
    }
  }
  // Fallback a localStorage
  try {
    const reservasExistentes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVAS) || '[]')
    const nuevaReserva = {
      ...reserva,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString()
    }
    reservasExistentes.push(nuevaReserva)
    localStorage.setItem(STORAGE_KEYS.RESERVAS, JSON.stringify(reservasExistentes))
    return nuevaReserva
  } catch (error) {
    console.error('Error al guardar reserva en localStorage:', error)
    throw error
  }
}

export const eliminarReserva = async (id) => {
  if (firebaseAvailable) {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'reservas', id))
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
    return true
  } catch (error) {
    console.error('Error al eliminar reserva de localStorage:', error)
    throw error
  }
}

// Escuchar cambios en tiempo real
export const escucharReservasEnTiempoReal = (callback) => {
  if (firebaseAvailable) {
    try {
      import('firebase/firestore').then(({ collection, query, orderBy, onSnapshot }) => {
        const q = query(collection(db, 'reservas'), orderBy('fechaReserva', 'asc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const reservas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          callback(reservas)
        }, (error) => {
          console.error('Error escuchando reservas:', error)
          callback([])
        })
        return unsubscribe
      })
    } catch (error) {
      console.error('Error al establecer listener en tiempo real:', error)
    }
  }

  // Fallback: poll cada 2 segundos
  let ultimoEstado = null
  const verificarCambios = async () => {
    const reservas = await obtenerReservas()
    const estadoActual = JSON.stringify(reservas)
    if (estadoActual !== ultimoEstado) {
      ultimoEstado = estadoActual
      callback(reservas)
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
  if (firebaseAvailable) {
    try {
      const { doc, getDocs } = await import('firebase/firestore')
      const docSnap = await getDocs(doc(db, 'fotos', 'imagenes'))
      return docSnap.data() || {}
    } catch (error) {
      console.error('Error al obtener fotos de Firebase:', error)
    }
  }
  // Fallback a localStorage
  try {
    const item = localStorage.getItem(STORAGE_KEYS.FOTOS)
    return item ? JSON.parse(item) : {}
  } catch (error) {
    console.error('Error al obtener fotos de localStorage:', error)
    return {}
  }
}

export const guardarFoto = async (key, base64) => {
  if (firebaseAvailable) {
    try {
      const { doc, setDoc } = await import('firebase/firestore')
      const docRef = doc(db, 'fotos', 'imagenes')
      await setDoc(docRef, { [key]: base64 }, { merge: true })
    } catch (error) {
      console.error('Error al guardar foto en Firebase:', error)
    }
  }
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

export const eliminarFoto = async (key) => {
  if (firebaseAvailable) {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const docRef = doc(db, 'fotos', 'imagenes')
      await updateDoc(docRef, { [key]: null })
    } catch (error) {
      console.error('Error al eliminar foto de Firebase:', error)
    }
  }
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

export const escucharFotosEnTiempoReal = (callback) => {
  if (firebaseAvailable) {
    try {
      import('firebase/firestore').then(({ doc, onSnapshot }) => {
        const unsubscribe = onSnapshot(doc(db, 'fotos', 'imagenes'), (docSnap) => {
          callback(docSnap.data() || {})
        }, (error) => {
          console.error('Error escuchando fotos:', error)
          callback({})
        })
        return unsubscribe
      })
    } catch (error) {
      console.error('Error al establecer listener en tiempo real:', error)
    }
  }

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
