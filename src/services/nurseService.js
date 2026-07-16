import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, firebaseConfig, auth } from "../firebase/firebase";

// Register nurse credentials in Firebase Auth using a secondary app instance.
// This prevents the active administrator session from being logged out.
export const registerNurseAuth = async (email, password) => {
  const secondaryApp = initializeApp(firebaseConfig, "SecondaryNurseRegisterApp");
  const secondaryAuth = getAuth(secondaryApp);
  try {
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      password
    );
    // Log out from the secondary auth space immediately
    await secondaryAuth.signOut();
    return { success: true, uid: userCredential.user.uid };
  } catch (error) {
    console.error("Secondary nurse registration failed:", error);
    return { success: false, error: error.message || error };
  }
};

// Create a new nurse in users and nurseProfiles collections
export const createNurseProfile = async (uid, email, profileData) => {
  try {
    // 1. Create entry in core users collection
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      role: "Nurse",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 2. Create entry in nurseProfiles
    const cleanedData = {};
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== undefined) {
        cleanedData[key] = profileData[key];
      }
    });

    await setDoc(doc(db, "nurseProfiles", uid), {
      uid,
      ...cleanedData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating nurse profile documents:", error);
    return { success: false, error: error.message || error };
  }
};

// Update nurse profile details
export const updateNurseProfile = async (uid, profileData) => {
  try {
    const cleanedData = {};
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== undefined) {
        cleanedData[key] = profileData[key];
      }
    });

    const docRef = doc(db, "nurseProfiles", uid);
    await updateDoc(docRef, {
      ...cleanedData,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating nurse profile:", error);
    return { success: false, error: error.message || error };
  }
};

// Soft delete nurse profile and auth credential role entry
export const deleteNurseProfile = async (uid) => {
  try {
    const email = auth.currentUser ? auth.currentUser.email : "system";
    await updateDoc(doc(db, "nurseProfiles", uid), {
      isDeleted: true,
      deletedAt: serverTimestamp(),
      deletedBy: email,
    });
    await updateDoc(doc(db, "users", uid), {
      isDeleted: true,
      deletedAt: serverTimestamp(),
      deletedBy: email,
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting nurse:", error);
    return { success: false, error: error.message || error };
  }
};

