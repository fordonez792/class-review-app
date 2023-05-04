import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwVCd041V3TRDywd1R97jGU0jmwSbA34w",
  authDomain: "class-review-website-5eff7.firebaseapp.com",
  projectId: "class-review-website-5eff7",
  storageBucket: "class-review-website-5eff7.appspot.com",
  messagingSenderId: "841875364559",
  appId: "1:841875364559:web:6809b10f9387a0e2eeb5ba",
  measurementId: "G-LJ427G08RY",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
