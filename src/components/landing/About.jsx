import { motion } from "framer-motion";
import { Row, Col } from "antd";
import {
  CompassOutlined,
  EyeOutlined,
  HeartOutlined,
  TrophyOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

// Import premium background animation components
import SpotlightCard from "../animations/SpotlightCard";
import LightRays from "../animations/LightRays";
import RippleGrid from "../animations/RippleGrid";
import SplitText from "../animations/SplitText";

// Import real assets
import hospImg2 from "../../assets/hosp_img2.jpg";
import hospImg3 from "../../assets/hosp_img3.jpg";

export default function About() {
  const values = [
    {
      icon: <CompassOutlined style={{ fontSize: "26px", color: "var(--secondary-color)" }} />,
      title: "Our Mission",
      desc: "To deliver accessible, high-quality medical services using state-of-the-art diagnostic facilities and expert practitioners who treat every patient with empathy.",
      spotlightColor: "rgba(212, 160, 23, 0.15)" // Softer sky blue spotlight
    },
    {
      icon: <EyeOutlined style={{ fontSize: "26px", color: "var(--accent-teal)" }} />,
      title: "Our Vision",
      desc: "To be a leading center of healthcare excellence, recognized internationally for patient satisfaction, advanced medical research, and compassionate healing environments.",
      spotlightColor: "rgba(13, 148, 136, 0.15)" // Softer teal spotlight
    },
    {
      icon: <HeartOutlined style={{ fontSize: "26px", color: "#ef4444" }} />,
      title: "Core Values",
      desc: "Clinical excellence, patient satisfaction, transparent practices, ethical treatment, and compassionate clinical care form our foundational principles.",
      spotlightColor: "rgba(239, 68, 68, 0.12)" // Softer red spotlight
    }
  ];

  const highlights = [
    "Best Ayurvedic Hospital in Sangli",
    "Authentic Panchakarma Centre",
    "Skin, Hair & Reproductive Care",
    "Chronic Disease & Infertility Specialists"
  ];

  return (
    <section
      id="about"
      style={{
        position: "relative",
        padding: "120px 5%",
        background: "#f8fafc",
        overflow: "hidden"
      }}
    >
      {/* Premium LightRays background layer behind About Us */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0
        }}
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#bae6fd" // Soft, light medical cyan
          raysSpeed={0.8}
          lightSpread={1.3}
          rayLength={2.0}
          pulsating={true}
          fadeDistance={0.9}
          saturation={1.0}
          followMouse={true}
          mouseInfluence={0.06}
        />
      </div>

      <div style={{ position: "relative", maxWidth: "1240px", margin: "auto", display: "flex", flexDirection: "column", gap: "100px", zIndex: 1 }}>

        {/* Row 1: Intro - Layered Image Grid (Left) & Narrative Copy (Right) */}
        <Row gutter={[64, 48]} align="middle">

          {/* Asymmetrical Overlapping Image Layout with standard fade-in animation */}
          <Col xs={24} lg={11}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ position: "relative", height: "450px", width: "100%" }}
            >
              {/* Decorative dot grid background */}
              <div
                style={{
                  position: "absolute",
                  top: "-25px",
                  left: "-25px",
                  width: "180px",
                  height: "180px",
                  backgroundImage: "radial-gradient(var(--secondary-color) 1.5px, transparent 1.5px)",
                  backgroundSize: "20px 20px",
                  opacity: 0.15,
                  zIndex: 1
                }}
              />

              {/* Main Image (hosp_img2) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "80%",
                  height: "380px",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(16, 68, 165, 0.12)",
                  border: "6px solid rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                  zIndex: 2
                }}
              >
                <img
                  src={hospImg2}
                  alt="Moolatvam Ayurved Premium Inpatient Care Ward"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>

              {/* Overlapping Secondary Image (hosp_img3) */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  width: "55%",
                  height: "230px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(16, 68, 165, 0.15)",
                  border: "6px solid rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                  zIndex: 3
                }}
              >
                <img
                  src={hospImg3}
                  alt="Moolatvam Ayurved Modular ICU Desk"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </div>

              {/* Floating trophy badge with micro float animation */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: "30%",
                  right: "30%",
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderRadius: "20px",
                  padding: "14px 22px",
                  boxShadow: "0 15px 35px rgba(16, 68, 165, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  zIndex: 4
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(13, 148, 136, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <TrophyOutlined style={{ fontSize: "20px", color: "var(--accent-teal)" }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: "800", fontSize: "16px", color: "var(--primary-color)" }}>10000+ Patients</h4>
                  <span style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: "700" }}>Happy & Healed</span>
                </div>
              </motion.div>
            </motion.div>
          </Col>

          {/* Copywriting Section */}
          <Col xs={24} lg={13}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 18px",
                  borderRadius: "30px",
                  backgroundColor: "rgba(46, 74, 30, 0.08)",
                  border: "1px solid rgba(46, 74, 30, 0.05)",
                  color: "#2e4a1e",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "20px",
                  letterSpacing: "0.05em"
                }}
              >
                ABOUT Moolatvam Ayurved
              </span>

              <SplitText
                tag="h2"
                text="Authentic Ayurveda. {Real Results.}"
                splitType="words"
                delay={50}
                duration={0.8}
                ease="power3.out"
                textAlign="left"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2.2rem, 4vw, 2.5rem)",
                  fontWeight: "500",
                  color: "#142a1f",
                  margin: "0 0 20px 0",
                  lineHeight: "1.2"
                }}
              />

              <p
                style={{
                  color: "#64748b",
                  fontSize: "16px",
                  lineHeight: "1.8",
                  marginBottom: "20px",
                  fontWeight: "500"
                }}
              >
                Welcome to MOOLATVAM AYURVED HOSPITAL, the best Ayurvedic hospital in Sangli offering authentic and trusted treatments. We specialize in authentic Ayurvedic medicine, providing natural healing for a wide range of health issues.
              </p>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "16px",
                  lineHeight: "1.8",
                  marginBottom: "32px",
                  fontWeight: "500"
                }}
              >
                Our expert team offers comprehensive care at our renowned Panchakarma centre in Sangli, helping detoxify and rejuvenate your body. We provide specialized Ayurvedic skin disease treatment, hair care treatment, kidney stone care, infertility clinic services, diabetes management, and weight loss programs — all rooted in classical Ayurvedic science.
              </p>

              {/* Checklist highlights */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "18px"
                }}
              >
                {highlights.map((text, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                    key={i}
                    style={{ display: "flex", gap: "12px", alignItems: "center" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(46, 74, 30, 0.1)"
                      }}
                    >
                      <CheckCircleOutlined style={{ color: "#2e4a1e", fontSize: "14px", fontWeight: "700" }} />
                    </div>
                    <span style={{ fontSize: "14.5px", color: "#1e293b", fontWeight: "600" }}>{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Col>
        </Row>

        {/* Row 2: Foundational Pillars Section */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "60px 4%",
            borderRadius: "32px",
            background: "radial-gradient(100% 100% at 50% 50%, rgba(255, 255, 255, 0.85) 0%, rgba(239, 246, 255, 0.85) 100%)", // Rich CSS radial gradient
            border: "1px solid rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 20px 45px rgba(16, 68, 165, 0.04)"
          }}
        >
          {/* Subtle RippleGrid background overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 0,
              opacity: 0.3
            }}
          >
            <RippleGrid
              gridColor="#2e4a1e"
              rippleIntensity={0.03}
              gridSize={12.0}
              gridThickness={8.0}
              glowIntensity={0.05}
              fadeDistance={1.8}
              mouseInteraction={true}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ textAlign: "center", marginBottom: "52px", position: "relative", zIndex: 1 }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 18px",
                borderRadius: "30px",
                backgroundColor: "rgba(46, 74, 30, 0.08)",
                border: "1px solid rgba(46, 74, 30, 0.05)",
                color: "#2e4a1e",
                fontSize: "13px",
                fontWeight: "700",
                marginBottom: "16px",
                letterSpacing: "0.05em"
              }}
            >
              OUR FOUNDATIONAL PILLARS
            </span>

            <SplitText
              tag="h3"
              text="Guided by a Purpose to {Heal}"
              splitType="words"
              delay={50}
              duration={0.8}
              ease="power3.out"
              textAlign="center"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 4vw, 2.5rem)", fontWeight: "500", color: "#142a1f", margin: 0, lineHeight: "1.2" }}
            />
          </motion.div>

          {/* Equal height grid using display flex stretch */}
          <Row gutter={[28, 28]} style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", position: "relative", zIndex: 1 }}>
            {values.map((val, idx) => (
              <Col xs={24} md={8} key={idx} style={{ display: "flex", flexDirection: "column" }}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                  style={{ display: "flex", flex: 1, flexDirection: "column" }}
                >
                  <SpotlightCard
                    className="glass-card-spotlight"
                    spotlightColor={val.spotlightColor}
                    style={{ height: "100%", display: "flex", flex: 1, flexDirection: "column" }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%", justifyContent: "space-between", flex: 1 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "16px",
                            backgroundColor: "rgba(255, 255, 255, 0.65)",
                            border: "1px solid rgba(16, 68, 165, 0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 8px 16px rgba(16, 68, 165, 0.04)"
                          }}
                        >
                          {val.icon}
                        </div>

                        <div>
                          <h4
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              margin: "0 0 12px 0",
                              fontWeight: "500",
                              color: "#142a1f",
                              fontSize: "19px"
                            }}
                          >
                            {val.title}
                          </h4>
                          <p
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "14.5px",
                              lineHeight: "1.75",
                              margin: 0,
                              fontWeight: "500"
                            }}
                          >
                            {val.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

      </div>
    </section>
  );
}

