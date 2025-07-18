import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC9FiPlGeyiOeozftKiaETPUw4kTzmOMAM",
  authDomain: "coop-farm-web.firebaseapp.com",
  databaseURL: "https://coop-farm-web-default-rtdb.firebaseio.com",
  projectId: "coop-farm-web",
  storageBucket: "coop-farm-web.appspot.com",
  messagingSenderId: "1059416084866",
  appId: "1:1059416084866:web:0b525d30b884f2a9807f9b",
  measurementId: "G-MPS4LXNF63",
};

// Firebase não será reinicializado
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializa serviços
const database = getDatabase(app);
const auth = getAuth(app);

if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics }) => {
    getAnalytics(app);
  });
}

export { app, database, auth };
