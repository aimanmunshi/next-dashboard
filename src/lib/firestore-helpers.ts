import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const saveUserToFirestore = async (uid: string, name: string, email: string) => {
  const userRef = doc(db, "users", uid);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    await setDoc(userRef, {
      name,
      email,
    });
  }
};

export const getUserData = async (uid: string) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (err) {
    console.error("Error fetching user data:", err);
    return null;
  }
};
