// ============================================
// CONFIGURACIÓN DE FIREBASE
// ============================================
// Proyecto: terramar-app
// ============================================

import { initializeApp } from 'firebase/app'
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDohqotMsD6ddNl5acJQX_V-tkYOKwQopE",
  authDomain: "terramar-app.firebaseapp.com",
  projectId: "terramar-app",
  storageBucket: "terramar-app.firebasestorage.app",
  messagingSenderId: "755582276233",
  appId: "1:755582276233:web:b0e0aebb1dd154e4382c58"
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
