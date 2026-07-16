import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

// Hook to subscribe to a Firestore collection in real-time
export function useFirestoreCollection(collectionName, queryConstraints = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    let q = collection(db, collectionName);

    if (queryConstraints && queryConstraints.length > 0) {
      q = query(q, ...queryConstraints);
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
        }));
        setData(list);
        setLoading(false);
      },
      (err) => {
        console.warn(`[useFirestore] Permission denied or missing for "${collectionName}" — using fallback data.`, err.code || err.message);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(queryConstraints)]);

  return { data, loading, error };
}

// Hook exposing standard CRUD operations
export function useFirestoreCrud(collectionName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDocument = async (docData) => {
    setLoading(true);
    setError(null);
    try {
      // Remove undefined fields
      const cleaned = {};
      Object.keys(docData).forEach((key) => {
        if (docData[key] !== undefined) {
          cleaned[key] = docData[key];
        }
      });

      const docRef = await addDoc(collection(db, collectionName), {
        ...cleaned,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setLoading(false);
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error(`Error adding document in ${collectionName}:`, err);
      setError(err);
      setLoading(false);
      return { success: false, error: err };
    }
  };

  const updateDocument = async (id, docData) => {
    setLoading(true);
    setError(null);
    try {
      const cleaned = {};
      Object.keys(docData).forEach((key) => {
        if (docData[key] !== undefined) {
          cleaned[key] = docData[key];
        }
      });

      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...cleaned,
        updatedAt: serverTimestamp(),
      });
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error(`Error updating document ${id} in ${collectionName}:`, err);
      setError(err);
      setLoading(false);
      return { success: false, error: err };
    }
  };

  const deleteDocument = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionName, id));
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error(`Error deleting document ${id} in ${collectionName}:`, err);
      setError(err);
      setLoading(false);
      return { success: false, error: err };
    }
  };

  return { addDocument, updateDocument, deleteDocument, loading, error };
}

