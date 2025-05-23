import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Firebase client-side configuration with better error handling
let auth = null;
let db = null;

// Get proper config based on Expo SDK version
const getExpoConfig = () => {
  // For Expo SDK 46 and above
  if (Constants.expoConfig) {
    return Constants.expoConfig;
  }
  
  // For Expo SDK 45 and below
  return Constants.manifest;
};

try {
  // Get configuration from app.json extras
  const expoConfig = getExpoConfig();
  const env = expoConfig?.extra || {};
  
  // For debugging - log out the full config values
  console.log('Raw Firebase Config Values:', {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID, 
    appId: env.FIREBASE_APP_ID
  });
  
  const firebaseConfig = {
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
  };
  
  console.log('Firebase config:', {
    apiKeyExists: Boolean(firebaseConfig.apiKey),
    authDomainExists: Boolean(firebaseConfig.authDomain),
    projectIdExists: Boolean(firebaseConfig.projectId),
    appIdExists: Boolean(firebaseConfig.appId),
  });
  
  // Only initialize if we have the minimum required config
  if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
    // Initialize Firebase
    const firebaseApp = initializeApp(firebaseConfig);
    
    // Initialize Firebase Auth
    auth = getAuth(firebaseApp);
    
    // Initialize Firestore database
    db = getFirestore(firebaseApp);
    
    console.log('✅ Firebase initialized successfully');
  } else {
    console.error('❌ Missing required Firebase configuration. Using mock Firebase client.');
    console.error('Please make sure app.json contains valid Firebase configuration in the "extra" section.');
    
    // Create mock implementations
    auth = {
      currentUser: null,
      onAuthStateChanged: (callback) => {
        callback(null);
        return () => {};
      },
      signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
      createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
      signOut: () => Promise.resolve(),
    };
    
    db = {
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: () => false, data: () => ({}) }),
          set: async () => {},
          update: async () => {},
          delete: async () => {},
        }),
        get: async () => ({ docs: [] }),
        add: async () => ({ id: 'mock-id' }),
      }),
    };
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  
  // Create mock implementations on error
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    },
    signInWithEmailAndPassword: () => Promise.reject(error),
    createUserWithEmailAndPassword: () => Promise.reject(error),
    signOut: () => Promise.resolve(),
  };
  
  db = {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: () => false, data: () => ({}) }),
        set: async () => {},
        update: async () => {},
        delete: async () => {},
      }),
      get: async () => ({ docs: [] }),
      add: async () => ({ id: 'mock-id' }),
    }),
  };
}

export { auth, db }; 