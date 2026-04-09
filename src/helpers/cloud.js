import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCWS80tcrQSX3LT-ay7stU7q2BL4EbUW_I",
  authDomain: "focustube-ai-e7b31.firebaseapp.com",
  projectId: "focustube-ai-e7b31"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// 🔥 SAVE USER DATA
export const saveUserProfile = async (data) => {
  await setDoc(doc(db, "users", "defaultUser"), data)
}

// 🔥 SAVE STATS
export const saveStats = async (stats) => {
  await setDoc(doc(db, "stats", "defaultUser"), stats)
}