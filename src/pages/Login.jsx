import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { loginDoctor } from "../services/authService";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useState } from "react";
import logoImg from "../assets/hospital_logo_1.png";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    let result = await loginDoctor(values.email, values.password);

    // Auto-seed admin user if not exists
    if (
      !result.success &&
      values.email === "admin@Moolatvam Ayurved.com" &&
      values.password === "password123"
    ) {
      try {
        const { createUserWithEmailAndPassword } = await import("firebase/auth");
        const { setDoc, doc, serverTimestamp } = await import("firebase/firestore");
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: values.email,
          role: "Admin",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        result = { success: true, user: userCredential.user };
      } catch (seedErr) {
        console.error("Auto-seeding admin failed:", seedErr);
      }
    }

    if (result.success) {
      console.log("[Login.jsx] Authenticated user email:", result.user.email);
      console.log("[Login.jsx] Authenticated user uid:", result.user.uid);
      message.success("Login Successful");
      
      let role = null;
      try {
        // Guarantee admin user is properly registered in users collection
        if (values.email.toLowerCase() === "admin@Moolatvam Ayurved.com") {
          const { setDoc, doc, serverTimestamp } = await import("firebase/firestore");
          await setDoc(doc(db, "users", result.user.uid), {
            uid: result.user.uid,
            email: values.email,
            role: "Admin",
            updatedAt: serverTimestamp(),
          }, { merge: true });
          console.log("[Login.jsx] Upserted Admin document in users collection");
        }
      } catch (upsertErr) {
        console.warn("[Login.jsx] Admin document upsert failed (likely permission rule):", upsertErr);
      }

      try {
        const userDoc = await getDoc(doc(db, "users", result.user.uid));
        console.log("[Login.jsx] Firestore users document data:", userDoc.exists() ? userDoc.data() : "does not exist");
        if (userDoc.exists() && userDoc.data().role) {
          role = userDoc.data().role;
          console.log("[Login.jsx] Resolved role from Firestore users doc:", role);
        }
      } catch (readErr) {
        console.warn("[Login.jsx] Firestore role read failed (permission or missing doc):", readErr);
      }

      if (!role) {
        // Email-based fallback when Firestore read fails or document is missing
        const email = values.email.toLowerCase();
        if (email.includes("admin")) {
          role = "Admin";
        } else if (email.includes("nurse")) {
          role = "Nurse";
        } else {
          role = "Doctor";
        }
        console.log("[Login.jsx] Fallback resolved role from email:", role);
      }

      const targetPath = role === "Admin" ? "/dashboard/admin" : role === "Nurse" ? "/dashboard/nurse" : "/dashboard/doctor";
      console.log("[Login.jsx] Navigating to:", targetPath);
      navigate(targetPath);
      setLoading(false);
    } else {
      message.error("Invalid Email or Password");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#ffffff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div
        className="login-branding-panel"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1e3a1a 0%, #2e4a1e 50%, #0f172a 100%)",
          borderRight: "1px solid #1e3a1a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Fluid Mesh Layers */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, transparent 60%)",
            backgroundSize: "300% 300%",
            animation: "shiftMesh 12s ease-in-out infinite alternate",
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "180%",
            height: "180%",
            background: "radial-gradient(circle, rgba(22, 163, 74, 0.15) 0%, transparent 55%)",
            backgroundSize: "250% 250%",
            animation: "shiftMesh 16s ease-in-out infinite alternate-reverse",
            pointerEvents: "none",
            mixBlendMode: "multiply",
          }}
        />
        
        {/* Branding Elements in Glassmorphic Container */}
        <div style={{ 
          textAlign: "center", 
          zIndex: 2, 
          animation: "pulseLogo 4s ease-in-out infinite",
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)",
          padding: "48px 56px",
          borderRadius: "28px",
        }}>
          <img
            src={logoImg}
            alt="Moolatvam Ayurved Logo"
            style={{
              height: "140px",
              width: "auto",
              marginBottom: "24px",
              filter: "drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3))",
            }}
          />
          <h1
            style={{
              color: "#ffffff",
              fontSize: "36px",
              fontWeight: "800",
              letterSpacing: "-0.02em",
              margin: "0 0 8px 0",
            }}
          >
            Moolatvam Ayurved
          </h1>
          <p style={{ color: "#fef08a", fontSize: "17px", margin: "4px 0 0 0", fontWeight: "600", fontFamily: "'Georgia', serif", letterSpacing: "0.5px", opacity: 0.95 }}>
            स्वास्थ्यरक्षणार्थ...व्याधीमोक्षणार्थ...
          </p>
        </div>
      </div>

      {/* Right Panel - Form (Always visible) */}
      <div
        className="login-form-panel"
        style={{
          width: "100%",
          maxWidth: "580px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 24px",
          background: "#ffffff",
          position: "relative",
        }}
      >
        <Button 
          type="text" 
          onClick={() => navigate("/")} 
          style={{ position: "absolute", top: 24, left: 24, color: "#2e4a1e", fontWeight: 600 }}
        >
          ← Back to Home
        </Button>
        <div style={{ width: "100%", maxWidth: "380px", pointerEvents: loading ? "none" : "auto" }}>
          <div style={{ filter: loading ? "blur(4px)" : "none", opacity: loading ? 0.6 : 1, transition: "all 0.4s ease" }}>
            {/* Header */}
            <div className="animate-stagger-0" style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  color: "#0f172a",
                  fontSize: "30px",
                  fontWeight: "700",
                  letterSpacing: "-0.01em",
                  margin: "0 0 8px 0",
                }}
              >
                Login
              </h2>
              <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
                Welcome back! Please enter your details to continue.
              </p>
            </div>

            {/* Form */}
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                className="light-form-label animate-stagger-1"
                label="Email address"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Enter a valid email" }
                ]}
              >
                <Input className="light-form-input" placeholder="hello@app.com" size="large" />
              </Form.Item>

              <Form.Item
                className="light-form-label animate-stagger-2"
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter password" }]}
                style={{ marginBottom: "24px" }}
              >
                <Input.Password className="light-form-input" placeholder="••••••••" size="large" />
              </Form.Item>

              <Button
                className="login-btn animate-stagger-3"
                htmlType="submit"
                type="primary"
                block
                size="large"
                loading={loading}
              >
                {loading ? "Authenticating..." : "Login"}
              </Button>
            </Form>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            color: "#2e4a1e",
            fontSize: "13px",
            letterSpacing: "0.01em",
            fontWeight: "500",
          }}
        >
          © Moolatvam Ayurved · Privacy · Terms
        </div>
      </div>

      {/* Embedded Component Custom Inline CSS Styles */}
      <style>{`
        @keyframes pulseLogo {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
        @keyframes shiftMesh {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-stagger-0 { opacity: 0; animation: slideUpFade 400ms ease-out 0ms forwards; }
        .animate-stagger-1 { opacity: 0; animation: slideUpFade 400ms ease-out 100ms forwards; }
        .animate-stagger-2 { opacity: 0; animation: slideUpFade 400ms ease-out 200ms forwards; }
        .animate-stagger-3 { opacity: 0; animation: slideUpFade 400ms ease-out 300ms forwards; }

        .light-form-input {
          background-color: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          color: #0f172a !important;
          border-radius: 8px !important;
          height: 48px !important;
          font-size: 15px !important;
          transition: all 0.2s ease !important;
        }
        .light-form-input input {
          background-color: transparent !important;
          color: #0f172a !important;
        }
        .light-form-input:focus, .light-form-input:hover, .light-form-input-focused {
          border-color: #2e4a1e !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 2px rgba(46, 74, 30, 0.1) !important;
        }
        .light-form-label label {
          color: #2e4a1e !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        .login-btn {
          background: linear-gradient(135deg, #2e4a1e 0%, #1e3a1a 100%) !important;
          border: none !important;
          border-radius: 8px !important;
          height: 48px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          color: #ffffff !important;
          box-shadow: 0 4px 20px rgba(46, 74, 30, 0.15) !important;
          transition: all 0.3s ease !important;
        }
        .login-btn:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 24px rgba(46, 74, 30, 0.3) !important;
          opacity: 0.95 !important;
        }
        @media (max-width: 768px) {
          .login-branding-panel {
            display: none !important;
          }
          .login-form-panel {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
