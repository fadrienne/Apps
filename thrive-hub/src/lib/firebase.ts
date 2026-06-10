import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Paste your Firebase project config here.
// How to get it: Firebase Console → Project Settings → General → Your apps → Web app → SDK setup & config
const firebaseConfig = {
  apiKey: 'AIzaSyAFjKoBbJ2CTVGnv4lBtZBHDS3qbinBkPY',
  authDomain: 'thrive-hub-32bfd.firebaseapp.com',
  projectId: 'thrive-hub-32bfd',
  storageBucket: 'thrive-hub-32bfd.firebasestorage.app',
  messagingSenderId: '606936342441',
  appId: '1:606936342441:web:f031aa571694dc689a6eb8',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
