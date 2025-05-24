import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyALxdmsg31bptxg1KKDyJZmDlO1s5mTGXQ",
  authDomain: "bigshow-ott.firebaseapp.com",
  projectId: "bigshow-ott",
  storageBucket: "bigshow-ott.firebasestorage.app",
  messagingSenderId: "629266811201",
  appId: "1:629266811201:web:9c79c2af0e9109949a39c0",
  measurementId: "G-RHZKKTT05V"
};

let app;
let auth;
let db;
let storage;
let functions;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode. Firebase is initialized.');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  if (!app) app = {} as any; 
  if (!auth) auth = {} as any;
  if (!db) db = {} as any;
  if (!storage) storage = {} as any;
  if (!functions) functions = {} as any;
}

export { app, auth, db, storage, functions }; 