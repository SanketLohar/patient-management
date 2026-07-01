import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
// import { getPatients, deletePatient } from "../services/patientService";
const patientCollection = collection(db, "patients");

export const savePatient = async (patientData) => {
  try {

    // Remove all undefined values
    const cleanedData = {};

    Object.keys(patientData).forEach((key) => {
      if (patientData[key] !== undefined) {
        cleanedData[key] = patientData[key];
      }
    });

    const docRef = await addDoc(patientCollection, {
      ...cleanedData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      id: docRef.id,
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      error,
    };
  }
};

export const getPatients = async () => {
  try {
    const snapshot = await getDocs(patientCollection);

    const patients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return patients;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deletePatient = async (id) => {
  try {
    await deleteDoc(doc(db, "patients", id));

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error,
    };
  }
};