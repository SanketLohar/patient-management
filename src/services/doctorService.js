import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, firebaseConfig, auth } from "../firebase/firebase";

// Register doctor credentials in Firebase Auth using a secondary app instance.
// This prevents the active administrator session from being logged out.
export const registerDoctorAuth = async (email, password) => {
  const secondaryApp = initializeApp(firebaseConfig, "SecondaryDocRegisterApp");
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
    console.error("Secondary app registration failed:", error);
    return { success: false, error: error.message || error };
  }
};

// Create a new doctor in users and doctorProfiles collections
export const createDoctorProfile = async (uid, email, profileData) => {
  try {
    // 1. Create entry in core users collection
    await setDoc(doc(db, "users", uid), {
      uid,
      email,
      role: "Doctor",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 2. Create entry in doctorProfiles
    const cleanedData = {};
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== undefined) {
        cleanedData[key] = profileData[key];
      }
    });

    await setDoc(doc(db, "doctorProfiles", uid), {
      uid,
      ...cleanedData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating doctor profile documents:", error);
    return { success: false, error: error.message || error };
  }
};

// Update doctor profile details
export const updateDoctorProfile = async (uid, profileData) => {
  try {
    const cleanedData = {};
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== undefined) {
        cleanedData[key] = profileData[key];
      }
    });

    const docRef = doc(db, "doctorProfiles", uid);
    await updateDoc(docRef, {
      ...cleanedData,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    return { success: false, error: error.message || error };
  }
};

// Delete doctor profile and authentication role entry
export const deleteDoctorProfile = async (uid) => {
  try {
    const email = auth.currentUser ? auth.currentUser.email : "system";
    await updateDoc(doc(db, "doctorProfiles", uid), {
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
    console.error("Error deleting doctor:", error);
    return { success: false, error: error.message || error };
  }
};

