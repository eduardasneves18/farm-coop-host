import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC9FiPlGeyiOeozftKiaETPUw4kTzmOMAM",
  authDomain: "coop-farm-web.firebaseapp.com",
  databaseURL: "https://coop-farm-web-default-rtdb.firebaseio.com",
  projectId: "coop-farm-web",
  storageBucket: "coop-farm-web.firebasestorage.app",
  messagingSenderId: "1059416084866",
  appId: "1:1059416084866:web:0b525d30b884f2a9807f9b",
  measurementId: "G-MPS4LXNF63",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

if (typeof window !== 'undefined') {
  import("firebase/analytics").then(({ getAnalytics }) => {
    getAnalytics(app);
  });
}

export { app, database };
