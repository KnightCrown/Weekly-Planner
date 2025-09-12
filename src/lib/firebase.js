import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Prefer environment variables (local dev). If missing (e.g. on Firebase Hosting),
// fall back to the static firebaseConfig provided by the user.
function buildFirebaseConfig() {
  const envConfig = {
    apiKey: import.meta?.env?.VITE_FIREBASE_API_KEY,
    authDomain: import.meta?.env?.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta?.env?.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta?.env?.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta?.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta?.env?.VITE_FIREBASE_APP_ID,
    measurementId: import.meta?.env?.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const required = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const hasAllEnv = required.every((key) => !!envConfig[key]);

  if (hasAllEnv) {
    return envConfig;
  }

  // Fallback: static config for Firebase Hosting deployments
  return {
    apiKey: "AIzaSyDCBMkBUCVTw14z-afeVEqy5OK0SCO11B8",
    authDomain: "weeklyblocks.firebaseapp.com",
    projectId: "weeklyblocks",
    storageBucket: "weeklyblocks.firebasestorage.app",
    messagingSenderId: "156948258662",
    appId: "1:156948258662:web:01199a8d5d5fcf90d8f2a7",
    measurementId: "G-4T0JVTX8E6"
  };
}

const firebaseConfig = buildFirebaseConfig();

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
