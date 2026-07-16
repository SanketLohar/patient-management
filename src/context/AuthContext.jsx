/**
 * AuthContext.jsx
 *
 * Single source of truth for Firebase authentication.
 * ONE onAuthStateChanged listener for the entire app.
 * - isAppReady: false until the first Firebase auth event fires → show global loader
 * - After that it is permanently true → NO MORE flicker on navigation
 */
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext(null);

function resolveRoleFromEmail(email) {
  const e = (email || "").toLowerCase();
  if (e.includes("admin")) return "Admin";
  if (e.includes("nurse")) return "Nurse";
  return "Doctor";
}

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);   // Firebase user object or null
  const [role, setRole]           = useState(null);   // "Admin" | "Nurse" | "Doctor" | null
  const [isAppReady, setIsAppReady] = useState(false); // true once first auth event fires

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Try Firestore first, fall back to email pattern
        let resolvedRole = null;
        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          if (snap.exists() && snap.data().role) {
            resolvedRole = snap.data().role;
          }
        } catch {
          // Firestore permission blocked – use email pattern
        }
        if (!resolvedRole) {
          resolvedRole = resolveRoleFromEmail(currentUser.email);
        }
        setRole(resolvedRole);
      } else {
        setUser(null);
        setRole(null);
      }

      // Mark app as ready — this runs exactly once per session
      setIsAppReady(true);
    });

    return () => unsubscribe();
  }, []); // ← empty dep array = runs once, never re-subscribes

  return (
    <AuthContext.Provider value={{ user, role, isAppReady }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
