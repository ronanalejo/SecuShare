import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCkPhIWoev07NcPPY_Hu1M5pcyj1R0uuYA",
  authDomain: "secushare-7e166.firebaseapp.com",
  databaseURL: "https://secushare-7e166-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "secushare-7e166",
  storageBucket: "secushare-7e166.appspot.com",
  messagingSenderId: "79693888840",
  appId: "1:79693888840:web:953c451932d91fbce3c77d",
  measurementId: "G-7NMQCTFZWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };