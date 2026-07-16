import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Row, Col, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { 
  CalendarOutlined, 
  LoginOutlined, 
  PhoneOutlined, 
  SafetyCertificateOutlined, 
  CheckCircleOutlined, 
  HeartOutlined
} from "@ant-design/icons";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";

// Import premium animation components
import { TypewriterEffect } from "../animations/TypewriterEffect";
import Particles from "../animations/Particles";
import TiltedCard from "../animations/TiltedCard";
import CountUp from "../animations/CountUp";

// Import assets
import hero1 from "../../assets/hero1.jpg";
import hero2 from "../../assets/hero2.jpg";
import hero3 from "../../assets/hero3.jpg";
import hero4 from "../../assets/hero4.jpg";

export default function Hero() {
  const navigate = useNavigate();
  const [bgIndex, setBgIndex] = useState(0);
  const backgroundImages = [hero1, hero2, hero3, hero4];

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const words = [
    { text: "Pure" },
    { text: "Ayurvedic" },
    { text: "Healing" },
    { text: "for" },
    { text: "Lasting", className: "hero-highlighted-word" },
    { text: "Wellness.", className: "hero-highlighted-word" },
  ];

  return (
    <section
      id="hero"
      style={{
        minHeight: "95vh",
        display: "flex",
        alignItems: "center",
        padding: "160px 5% 100px 5%",
        backgroundcolor: "#142a1f",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Sliding background images */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${backgroundImages[bgIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>

        {/* Left-to-right fade overlay: dark slate on left for text legibility, transparent on right */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.65) 45%, rgba(15, 23, 42, 0) 85%)",
            pointerEvents: "none"
          }}
        />
      </div>

      {/* Background Particles layer */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.35 }}>
        <Particles
          particleCount={40}
          particleSpread={12}
          speed={0.12}
          particleColors={["#2e4a1e", "#d4a017", "#ffffff"]}
          moveParticlesOnHover
          particleHoverFactor={2.5}
          alphaParticles={true}
          particleBaseSize={70}
          sizeRandomness={0.6}
          cameraDistance={22}
          disableRotation={false}
        />
      </div>

      {/* Decorative ambient glowing blobs */}
      <div 
        style={{
          position: "absolute",
          top: "10%",
          left: "-10%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(46, 74, 30, 0.22) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(60px)",
          zIndex: 1,
          pointerEvents: "none"
        }}
      />
      <div 
        style={{
          position: "absolute",
          bottom: "10%",
          right: "-5%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13, 148, 136, 0.15) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(60px)",
          zIndex: 1,
          pointerEvents: "none"
        }}
      />

      <Row 
        gutter={[48, 48]} 
        align="middle" 
        style={{ 
          width: "100%", 
          zIndex: 2, 
          maxWidth: "1280px", 
          margin: "auto",
          position: "relative"
        }}
      >
        {/* Left Side: Typography, SplitText, CTA & CountUp Stats */}
        <Col xs={24} lg={13}>
          <div>
            {/* Trust Badges row */}
            <div 
              style={{ 
                display: "flex", 
                gap: "18px", 
                flexWrap: "wrap", 
                marginBottom: "28px" 
              }}
              className="animate-float"
            >
              <span 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  color: "#d4a017", 
                  fontSize: "12.5px", 
                  fontWeight: "700", 
                  letterSpacing: "0.03em"
                }}
              >
                <SafetyCertificateOutlined style={{ fontSize: "14px" }} /> NABH ACCREDITED
              </span>
              <span 
                style={{ 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "6px", 
                  color: "#d4a017", 
                  fontSize: "12.5px", 
                  fontWeight: "700", 
                  letterSpacing: "0.03em"
                }}
              >
                <CheckCircleOutlined style={{ fontSize: "14px" }} /> 24x7 EMERGENCY CARE
              </span>
            </div>

            {/* Main Headline with TypewriterEffect */}
            <h1 className="hero-headline-title" style={{ marginBottom: "24px" }}>
              <TypewriterEffect words={words} />
            </h1>

            {/* Subtext description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              style={{
                fontSize: "clamp(16px, 1.8vw, 19px)",
                lineHeight: "1.75",
                color: "#e2e8f0",
                marginBottom: "44px",
                maxWidth: "600px",
                fontWeight: "500"
              }}
            >
              Welcome to a sanctuary of authentic Ayurvedic care. From deep tissue detoxification to specialized chronic disease management, our expert lineage of physicians utilizes nature's purest remedies to restore balance, build immunity, and secure your long-term vitality.
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.8, ease: "easeOut" }}
              style={{ marginBottom: "56px" }}
            >
              <Space size="large" wrap>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CalendarOutlined />}
                    onClick={() => navigate("/patient/register")}
                    style={{
                      borderRadius: "12px",
                      height: "56px",
                      padding: "0 34px",
                      fontSize: "16px",
                      fontWeight: "700",
                      backgroundColor: "#2e4a1e",
                      borderColor: "#2e4a1e",
                      boxShadow: "0 10px 28px rgba(46, 74, 30, 0.4)",
                      display: "flex",
                      alignItems: "center"
                    }}
                    className="hero-primary-btn"
                  >
                    Book Appointment
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="large"
                    icon={<LoginOutlined />}
                    onClick={() => navigate("/login")}
                    style={{
                      borderRadius: "12px",
                      height: "56px",
                      padding: "0 34px",
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#ffffff",
                      borderColor: "rgba(255, 255, 255, 0.35)",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(10px)",
                      display: "flex",
                      alignItems: "center"
                    }}
                    className="hero-secondary-btn"
                  >
                    Staff Login
                  </Button>
                </motion.div>
              </Space>
            </motion.div>

          </div>
        </Col>

        {/* Right Side: 2x2 Grid of Metrics (completely transparent, professional) */}
        <Col xs={24} lg={11} offset={1} style={{ position: "relative", zIndex: 5 }}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "48px 32px",
              padding: "20px 0",
              maxWidth: "460px",
              margin: "auto"
            }}
          >
            {/* Stat 1: Happy Patients */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(46, 74, 30, 0.25)",
                border: "1px solid rgba(166, 124, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#d4a017"
              }}>
                <HeartOutlined style={{ fontSize: "22px" }} />
              </div>
              <div>
                <div style={{ fontSize: "36px", fontWeight: "800", color: "#ffffff", display: "flex", alignItems: "baseline", lineHeight: "1.1", fontFamily: "'Georgia', serif" }}>
                  <CountUp from={0} to={10000} duration={2.0} once={false} />
                  <span style={{ color: "#d4a017", marginLeft: "2px" }}>+</span>
                </div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "6px" }}>
                  Happy Patients
                </div>
              </div>
            </div>

            {/* Stat 2: Happy Customers */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(46, 74, 30, 0.25)",
                border: "1px solid rgba(166, 124, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#d4a017"
              }}>
                <SafetyCertificateOutlined style={{ fontSize: "22px" }} />
              </div>
              <div>
                <div style={{ fontSize: "36px", fontWeight: "800", color: "#ffffff", display: "flex", alignItems: "baseline", lineHeight: "1.1", fontFamily: "'Georgia', serif" }}>
                  <CountUp from={0} to={20000} duration={2.0} once={false} />
                  <span style={{ color: "#d4a017", marginLeft: "2px" }}>+</span>
                </div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "6px" }}>
                  Happy Customers
                </div>
              </div>
            </div>

            {/* Stat 3: Doctors Trained */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(46, 74, 30, 0.25)",
                border: "1px solid rgba(166, 124, 0, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#d4a017"
              }}>
                <CheckCircleOutlined style={{ fontSize: "22px" }} />
              </div>
              <div>
                <div style={{ fontSize: "36px", fontWeight: "800", color: "#ffffff", display: "flex", alignItems: "baseline", lineHeight: "1.1", fontFamily: "'Georgia', serif" }}>
                  <CountUp from={0} to={1500} duration={2.0} once={false} />
                  <span style={{ color: "#d4a017", marginLeft: "2px" }}>+</span>
                </div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "6px" }}>
                  Doctors Trained
                </div>
              </div>
            </div>
          </motion.div>
        </Col>
      </Row>

      {/* Embedded Component Custom Inline CSS Styles */}
      <style>{`
        .hero-headline-title {
          font-family: 'Playfair Display', serif !important;
          font-size: clamp(3.5rem, 5.5vw, 4rem) !important;
          line-height: 1.12 !important;
          font-weight: 600 !important;
          color: #fafaf9 !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
          letter-spacing: -0.03em !important;
          margin: 0 !important;
        }
        .hero-highlighted-word {
          color: #d4a017 !important;
          display: inline-block;
        }
        .hero-primary-btn:hover {
          background-color: #3b5c28 !important;
          border-color: #3b5c28 !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(46, 74, 30, 0.3) !important;
        }
        .hero-secondary-btn:hover {
          background-color: rgba(255, 255, 255, 0.16) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 992px) {
          #hero {
            padding-top: 130px;
            padding-bottom: 70px;
          }
        }
        @media (max-width: 768px) {
          #hero {
            padding: 100px 5% 48px 5% !important;
          }
          .hero-headline-title {
            font-size: clamp(26px, 8vw, 38px) !important;
          }
          .hero-primary-btn, .hero-secondary-btn {
            height: 48px !important;
            padding: 0 24px !important;
            font-size: 14px !important;
          }
        }
        @media (max-width: 480px) {
          #hero {
            padding: 88px 4% 40px 4% !important;
          }
          .hero-headline-title {
            font-size: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

