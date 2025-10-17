// firebase Initialization
// think firebase = toy store
// all of our "toys"
// we pick the ones we want to play with only
import { initializeApp, getApps } from "firebase/app";  //give me the toy box that starts my app
import { getFirestore } from "firebase/firestore"; //give me the toy box for the database
import { getAuth, GoogleAuthProvider } from "firebase/auth"; //give me the toy box for google login
import { getStorage } from "firebase/storage"; //get me the toy box for uploading images/files

//the map to the right toy store!
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
// if the toy is already turned on, use it, otherwise turn it on for the first time
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

//if someone wants to use firebase, give them this one we already started!
export default app;