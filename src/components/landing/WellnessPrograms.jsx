import { motion } from "framer-motion";
import { Row, Col, Card, Typography, Tag } from "antd";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";
import LightRays from "../animations/LightRays";
import SplitText from "../animations/SplitText";

const { Title, Paragraph } = Typography;

export default function WellnessPrograms() {
  const programs = HOSPITAL_CONFIG.wellnessPrograms;

  const tagColors = {
    "Hair Health": "#2e4a1e",
    "Wellness": "#d4a017",
    "Rejuvenation": "#2e4a1e",
    "Maternity": "#d4a017",
    "Fertility": "#2e4a1e",
    "Digestive Health": "#d4a017",
  };

  return (
    <section
      id="wellness"
      style={{
        position: "relative",
        padding: "110px 5%",
        background: "linear-gradient(180deg, #f0f7ee 0%, #fefdf8 100%)",
        overflow: "hidden",
      }}
    >
      {/* LightRays background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <LightRays
          raysOrigin="top-right"
          raysColor="#d4f2c4"
          raysSpeed={0.6}
          lightSpread={1.3}
          rayLength={2.0}
          pulsating={true}
          fadeDistance={0.85}
          saturation={0.8}
          followMouse={true}
          mouseInfluence={0.04}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "750px", margin: "0 auto 64px auto" }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 18px",
              borderRadius: "20px",
              backgroundColor: "rgba(46, 74, 30, 0.08)",
              color: "#2e4a1e",
              fontSize: "14px",
              fontWeight: "700",
              marginBottom: "20px",
              letterSpacing: "0.04em",
            }}
          >
            Wellness & Chronic Care
          </span>

          <SplitText
            text="Wellness & Chronic Care {Programs}"
            delay={40}
            duration={0.8}
            className="wellness-section-title"
            textAlign="center"
            tag="h2"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
          />

          <Paragraph
            style={{
              color: "#64748b",
              fontSize: "16px",
              lineHeight: "1.7",
              marginTop: "16px",
            }}
          >
            From prenatal care to chronic disease management, our holistic Ayurvedic programs are designed to address root causes and restore lasting health naturally.
          </Paragraph>
        </div>

        {/* 3-column card grid */}
        <Row gutter={[28, 28]} style={{ maxWidth: "1240px", margin: "0 auto" }} justify="center">
          {programs.map((prog, idx) => (
            <Col xs={24} sm={12} lg={8} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(46, 74, 30, 0.12)", transition: { duration: 0.3 } }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="wellness-card-wrapper"
                style={{ borderRadius: "24px" }}
              >
                <Card
                  variant="borderless"
                  styles={{ body: { padding: 0 } }}
                  style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    border: "1px solid rgba(46, 74, 30, 0.12)",
                    boxShadow: "0 8px 24px rgba(46, 74, 30, 0.06)",
                    backgroundColor: "#ffffff",
                    height: "100%",
                  }}
                >
                  {/* Image */}
                  <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
                    <img
                      src={prog.image}
                      alt={prog.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                      className="wellness-card-img"
                    />
                    {/* Tag overlay */}
                    <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          backgroundColor: tagColors[prog.tag] || "#2e4a1e",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: "800",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        {prog.tag}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "20px 22px 24px" }}>
                    <Title
                      level={4}
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "18px",
                        fontWeight: "800",
                        color: "#1e293b",
                      }}
                    >
                      {prog.title}
                    </Title>
                    <Paragraph
                      style={{
                        color: "#64748b",
                        fontSize: "13.5px",
                        lineHeight: "1.7",
                        margin: 0,
                      }}
                      ellipsis={{ rows: 3 }}
                    >
                      {prog.desc}
                    </Paragraph>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>

      <style>{`
        .wellness-section-title {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 800;
          color: #142a1f;
          margin: 0;
          line-height: 1.25;
        }
        .wellness-card-wrapper {
          height: 100%;
        }
        .wellness-card-wrapper:hover .wellness-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
}
