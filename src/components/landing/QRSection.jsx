import { motion } from "framer-motion";
import { Row, Col, Typography, Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import {
  ScanOutlined,
  FormOutlined,
  UsergroupAddOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";

// Import premium animation components
import RippleGrid from "../animations/RippleGrid";
import BlurText from "../animations/BlurText";
import ScrollReveal from "../animations/ScrollReveal";

const { Title, Paragraph, Text } = Typography;

export default function QRSection() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <ScanOutlined style={{ fontSize: "20px", color: "#2e4a1e" }} />,
      title: "1. Scan the QR Code",
      desc: "Scan the hospital QR code using your smartphone's camera before reaching the counter.",
    },
    {
      icon: <FormOutlined style={{ fontSize: "20px", color: "#10b981" }} />,
      title: "2. Fill Registration",
      desc: "Complete the simple patient details intake form online in under two minutes.",
    },
    {
      icon: <UsergroupAddOutlined style={{ fontSize: "20px", color: "#f59e0b" }} />,
      title: "3. Nurse Queue Assignment",
      desc: "The triage nurse reviews your digital ticket instantly upon your arrival in the lobby.",
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: "20px", color: "#8b5cf6" }} />,
      title: "4. Doctor Consultation",
      desc: "Proceed straight to the consulting specialist cabin with zero ticket queue delay.",
    },
  ];

  return (
    <section
      id="qr-appointment"
      style={{
        position: "relative",
        padding: "110px 5%",
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        overflow: "hidden",
      }}
    >
      {/* Premium RippleGrid Background Layer behind QR Section */}
      <div 
        style={{ 
          position: "absolute", 
          inset: 0, 
          width: "100%", 
          height: "100%", 
          pointerEvents: "none", 
          zIndex: 0,
          opacity: 0.2
        }}
      >
        <RippleGrid
          gridColor="#2e4a1e"
          rippleIntensity={0.02}
          gridSize={12.0}
          gridThickness={6.0}
          glowIntensity={0.04}
          fadeDistance={1.8}
          mouseInteraction={true}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Row gutter={[48, 48]} align="middle" style={{ maxWidth: "1200px", margin: "auto" }}>
          {/* Left Side: Explaining the patient flow */}
          <Col xs={24} lg={13}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  backgroundColor: "rgba(46, 74, 30, 0.08)",
                  color: "#2e4a1e",
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Skip The Waiting Lobby Queue
              </span>

              <BlurText 
                text="Register Before Reaching the {Hospital}" 
                delay={50}
                animateBy="words"
                direction="bottom"
                className="qr-title text-left"
              />

              <ScrollReveal
                enableBlur={true}
                baseOpacity={0.2}
                blurStrength={4}
                textClassName="qr-desc text-left"
              >
                Our pre-arrival check-in process lets patients queue up digitally, saving average check-in time at checkout desks. Follow these four simple steps:
              </ScrollReveal>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>
                {steps.map((step, idx) => (
                  <div key={idx} className="qr-step-item" style={{ display: "flex", gap: "16px", alignItems: "flex-start", transition: "transform 0.2s ease" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                      }}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <Title level={5} style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>
                        {step.title}
                      </Title>
                      <Text style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.5" }}>
                        {step.desc}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "36px" }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<CalendarOutlined />}
                  onClick={() => navigate("/patient/register")}
                  style={{
                    borderRadius: "10px",
                    height: "48px",
                    padding: "0 24px",
                    fontWeight: "700",
                    backgroundColor: "#2e4a1e",
                    borderColor: "#2e4a1e",
                    boxShadow: "0 6px 16px rgba(46, 74, 30, 0.15)",
                  }}
                >
                  Register Online Now
                </Button>
              </div>
            </motion.div>
          </Col>

          {/* Right Side: QR Image Display with Laser Line */}
          <Col xs={24} lg={11} style={{ display: "flex", justifyContent: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
              style={{ width: "100%", maxWidth: "340px" }}
            >
              <Card
                variant="borderless"
                style={{
                  borderRadius: "24px",
                  boxShadow: "0 15px 35px rgba(16, 68, 165, 0.04)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  padding: "24px",
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {/* QR Container holding scanning line */}
                <div
                  style={{
                    width: "220px",
                    height: "220px",
                    margin: "0 auto 20px auto",
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    padding: "10px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {/* Real QR Image */}
                  <img
                    src={HOSPITAL_CONFIG.qrCode}
                    alt="Moolatvam Ayurved Patient Registration QR Code"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />

                  {/* Scanning Laser Line */}
                  <motion.div
                    animate={{
                      top: ["0%", "100%", "0%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: "linear-gradient(90deg, rgba(239, 68, 68, 0) 0%, #ef4444 50%, rgba(239, 68, 68, 0) 100%)",
                      boxShadow: "0 0 10px #ef4444",
                      zIndex: 2,
                    }}
                  />
                </div>

                <Title level={4} style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "800", color: "#1e293b" }}>
                  Scan To Pre-Register
                </Title>
                <Paragraph style={{ color: "#64748b", fontSize: "12px", margin: 0 }}>
                  Point your phone camera to access the form directly.
                </Paragraph>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>

      <style>{`
        .qr-title {
          font-family: 'Playfair Display', serif !important;
          font-size: clamp(2.2rem, 4vw, 2.5rem);
          font-weight: 500;
          color: #142a1f;
          margin: 0 0 16px 0;
          line-height: 1.2;
        }
        .qr-desc {
          color: #64748b !important;
          font-size: 15px !important;
          line-height: 1.7 !important;
          margin-bottom: 24px !important;
          font-family: 'Montserrat', sans-serif !important;
          letter-spacing: 0.02em !important;
        }
        .qr-step-item:hover {
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}

