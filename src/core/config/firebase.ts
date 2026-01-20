import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfigProd } from '@/core/config/firebase.prod';
import { firebaseConfigTest } from '@/core/config/firebase.tests';

console.log({
  mode: process.env.NEXT_PUBLIC_MODE,
  prod: process.env.NEXT_PUBLIC_FIREBASE_PROD_API_KEY,
  test: process.env.NEXT_PUBLIC_FIREBASE_TEST_API_KEY,
});

const env = process.env.NEXT_PUBLIC_MODE;

export const firebaseConfig = env === 'test' ? firebaseConfigTest : firebaseConfigProd;

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
