import { getApps, initializeApp, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

const apps = getApps();

if (!apps.length) {
    initializeApp(firebaseConfig);
}

const app = getApp();
const firestore = getFirestore(app);

export { app, firestore };
