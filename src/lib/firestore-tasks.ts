import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Type for a task
export interface Task {
  id: string;
  title: string;
  status: "Pending" | "In Progress" | "Completed";
  uid: string;
  createdAt?: any;
}

// 1️⃣ Get all tasks for a user
export async function getTasks(uid: string): Promise<Task[]> {
  const q = query(collection(db, "tasks"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const { id, ...data } = doc.data() as Task;
    return {
      id: doc.id,
      ...data,
    };
  });
}

// 2️⃣ Add a new task
export async function addTask(uid: string, title: string): Promise<string> {
  const docRef = await addDoc(collection(db, "tasks"), {
    title,
    status: "Pending",
    uid,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// 3️⃣ Toggle task status
export async function toggleTaskComplete(taskId: string, newStatus: Task["status"]) {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    status: newStatus,
  });
}

// 4️⃣ Delete task
export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db, "tasks", taskId));
}
