import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';

const firebase = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebase);
const auth = getAuth(app);

export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

export function signInWithApple() {
    const provider = new OAuthProvider('apple.com');
    return signInWithPopup(auth, provider);
}

export function signInWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}

export function forgotPassword(email) {
    
}

export { app, auth };