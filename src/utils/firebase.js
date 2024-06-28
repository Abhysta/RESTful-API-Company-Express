import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8D5xvGhf3LJ_5A11WE7deqzqxluAsBmo",
  authDomain: "job-data-c1395.firebaseapp.com",
  projectId: "job-data-c1395",
  storageBucket: "job-data-c1395.appspot.com",
  messagingSenderId: "730540447099",
  appId: "1:730540447099:web:3712d0a415495b612859de",
  measurementId: "G-8C6XHW461K",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, "gs://job-data-c1395.appspot.com");
export { storage };
