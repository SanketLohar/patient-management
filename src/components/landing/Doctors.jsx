import { motion } from "framer-motion";
import { Row, Col, Typography, Card, Button, Badge, Tag } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";

// Import premium background animation component
import RippleGrid from "../animations/RippleGrid";
import SplitText from "../animations/SplitText";
import TiltedCard from "../animations/TiltedCard";

const { Title, Paragraph, Text } = Typography;

export default function Doctors() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section
      id="doctors"
      style={{
        position: "relative",
        padding: "100px 5%",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Premium RippleGrid Background Layer behind Doctors */}
      <div 
        style={{ 
          position: "absolute", 
          inset: 0, 
          width: "100%", 
          height: "100%", 
          pointerEvents: "none", 
          zIndex: 0,
          opacity: 0.15
        }}
      >
        <RippleGrid
          gridColor="#2e4a1e"
          rippleIntensity={0.02}
          gridSize={12.0}
          gridThickness={6.0}
          glowIntensity={0.04}
          fadeDistance={1.6}
          mouseInteraction={true}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 60px auto" }}>
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
            Meet Our Experts
          </span>
          <SplitText
            tag="h2"
            text="Our Distinguished {Physicians}"
            splitType="words"
            delay={50}
            duration={0.8}
            ease="power3.out"
            textAlign="center"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 4vw, 2.5rem)", fontWeight: "500", color: "#142a1f", margin: "0 0 16px 0", lineHeight: "1.2" }}
          />
          <Paragraph style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.6" }}>
            Moolatvam Ayurved is led by an expert lineage of Ayurvedic physicians dedicated to authentic, personalized healing using classical Panchakarma and herbal treatments.
          </Paragraph>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <Row gutter={[32, 32]} justify="center" style={{ maxWidth: "1000px", margin: "0 auto" }}>
            {HOSPITAL_CONFIG.doctors.map((doc) => (
              <Col xs={24} sm={24} md={12} lg={12} key={doc.id}>
                <motion.div variants={cardVariants} className="doc-card-wrapper" style={{ height: "100%" }}>
                  <TiltedCard
                    containerHeight="100%"
                    containerWidth="100%"
                    scaleOnHover={1.03}
                    rotateAmplitude={8}
                    showMobileWarning={false}
                    showTooltip={false}
                  >
                    <Card
                      hoverable
                      variant="borderless"
                    cover={
                      <div style={{ height: "240px", overflow: "hidden", position: "relative" }}>
                        <img
                          src={doc.photo}
                          alt={doc.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "top center",
                            transition: "transform 0.4s ease",
                          }}
                          className="doc-profile-img"
                        />
                        
                        {/* Department Badge Overlay */}
                        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                          <Tag
                            style={{
                              backgroundColor: "#2e4a1e",
                              color: "#ffffff",
                              fontWeight: "700",
                              borderRadius: "6px",
                              textTransform: "uppercase",
                              fontSize: "11px",
                              padding: "3px 10px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                              border: "none",
                            }}
                          >
                            {doc.badge}
                          </Tag>
                        </div>

                        {/* Status badge */}
                        <div style={{ position: "absolute", bottom: "12px", right: "12px" }}>
                          <Badge
                            status="processing"
                            text={
                              <span style={{ fontSize: "11px", fontWeight: "700", color: "#2e4a1e", backgroundColor: "#ffffff", padding: "4px 8px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                Available Today
                              </span>
                            }
                          />
                        </div>
                      </div>
                    }
                    style={{
                      borderRadius: "16px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
                      border: "1px solid rgba(46, 74, 30, 0.15)",
                      height: "100%",
                      overflow: "hidden",
                    }}
                    styles={{ body: { padding: "24px 20px" } }}
                  >
                    <Title level={4} style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: "800", color: "#1e293b" }}>
                      {doc.name}
                    </Title>
                    <Text style={{ color: "#d4a017", fontWeight: "700", fontSize: "15px", display: "block", marginBottom: "8px" }}>
                      {doc.specialty}
                    </Text>
                    <Text style={{ color: "#64748b", fontSize: "13px", display: "block", marginBottom: "16px" }}>
                      {doc.experience}
                    </Text>
                    
                    <div
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: "12px",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <CalendarOutlined style={{ color: "#64748b", marginTop: "3px" }} />
                      <div>
                        <Text style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", display: "block" }}>
                          OPD Timings
                        </Text>
                        <Text style={{ fontSize: "12px", color: "#334155", fontWeight: "700" }}>
                          {doc.availability}
                        </Text>
                      </div>
                    </div>

                    <Button
                      type="default"
                      block
                      style={{
                        borderRadius: "10px",
                        fontWeight: "700",
                        borderColor: "rgba(212, 160, 23, 0.6)",
                        color: "#2e4a1e",
                      }}
                      onClick={() => {
                        const section = document.getElementById("contact");
                        if (section) section.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Book Appointment
                    </Button>
                  </Card>
                </TiltedCard>
              </motion.div>
            </Col>
            ))}
          </Row>
        </motion.div>
      </div>

      <style>{`
        .doc-card-wrapper:hover .doc-profile-img {
          transform: scale(1.06);
        }
        .doc-card-wrapper:hover > div {
          box-shadow: 0 15px 35px rgba(0,0,0,0.06) !important;
          border-color: #cbd5e1 !important;
        }
      `}</style>
    </section>
  );
}

