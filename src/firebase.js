// ============================================
// CONFIGURACIÓN DE FIREBASE
// ============================================
// Proyecto: terramar-app-2865f
// ============================================

import { initializeApp } from 'firebase/app'
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore'

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

// Inicializar Firestore
const db = getFirestore(app)

// Habilitar persistencia para múltiples pestañas
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Múltiples pestañas abiertas, la persistencia solo puede habilitarse en una
    console.warn('Persistencia de Firebase: múltiples pestañas abiertas')
  } else if (err.code === 'unimplemented') {
    // El navegador no soporta persistencia
    console.warn('Persistencia de Firebase: navegador no soportado')
  }
})

export { db }
