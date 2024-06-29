import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "secret",
  authDomain: "secret",
  projectId: "secret",
  storageBucket: "secret",
  messagingSenderId: "secret",
  appId: "secret",
  measurementId: "secret",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, "secret");
export { storage };
