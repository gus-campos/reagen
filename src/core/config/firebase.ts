import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'reagentcontrol.firebaseapp.com',
  projectId: 'reagentcontrol',
  storageBucket: 'reagentcontrol.firebasestorage.app',
  messagingSenderId: '1056614611242',
  appId: '1:1056614611242:web:09fa4a40ff7bad28838653',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
