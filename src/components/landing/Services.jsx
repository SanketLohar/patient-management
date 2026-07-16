import { motion } from "framer-motion";
import { Row, Col, Typography, Card, Button, Space } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Activity, Sparkles, Droplets, HeartPulse } from "lucide-react";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";

// Import premium animation components
import LightRays from "../animations/LightRays";
import SplitText from "../animations/SplitText";

const { Title, Paragraph } = Typography;

export default function Services() {
  const services = HOSPITAL_CONFIG.services.map((s, idx) => ({
    ...s,
    icon: [
      <Droplets size={22} color="#2e4a1e" />,
      <Activity size={22} color="#d4a017" />,
      <Sparkles size={22} color="#2e4a1e" />,
      <HeartPulse size={22} color="#d4a017" />,
    ][idx],
  }));

  return (
    <section
      id="services"
      style={{
        position: "relative",
        padding: "110px 5%",
        background: "linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)",
        overflow: "hidden",
      }}
    >
      {/* Premium LightRays background layer behind Services */}
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
          raysColor="#ccfbf1" // Soft, refreshing medical teal
          raysSpeed={0.7}
          lightSpread={1.2}
          rayLength={2.0}
          pulsating={true}
          fadeDistance={0.8}
          saturation={0.8}
          followMouse={true}
          mouseInfluence={0.04}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 80px auto" }}>
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
            Ayurvedic Therapies
          </span>

          <SplitText
            tag="h2"
            text="Core Ayurvedic {Healing Therapies}"
            className="services-title text-center"
            splitType="words"
            delay={50}
            duration={0.8}
            ease="power3.out"
            textAlign="center"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 4vw, 2.5rem)", fontWeight: "500", color: "#142a1f", margin: "0 0 16px 0", lineHeight: "1.2" }}
          />

          <Paragraph className="services-desc text-center">
            From calming Shirodhara to powerful Kati Basti and Swedana detox — experience the transformative power of classical Panchakarma at Moolatvam Ayurved Sangli.
          </Paragraph>
        </div>

        <div style={{ maxWidth: "1100px", margin: "auto", display: "flex", flexDirection: "column", gap: "80px" }}>
          {services.map((service, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <Row gutter={[48, 32]} align="middle" key={idx} style={{ flexDirection: isEven ? "row" : "row-reverse" }}>
                {/* Image side */}
                <Col xs={24} md={12}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
                    className="service-card-hover"
                  >
                    <Card
                      variant="borderless"
                      styles={{ body: { padding: 0 } }}
                      style={{
                        borderRadius: "24px",
                        overflow: "hidden",
                        boxShadow: "0 15px 35px rgba(16, 68, 165, 0.04)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        backgroundColor: "rgba(255, 255, 255, 0.75)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <img
                        src={service.image}
                        alt={service.title}
                        style={{
                          width: "100%",
                          height: "280px",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.5s ease",
                        }}
                        className="service-img"
                      />
                    </Card>
                  </motion.div>
                </Col>

                {/* Text side */}
                <Col xs={24} md={12}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(46, 74, 30, 0.06)",
                        color: "#2e4a1e",
                        fontSize: "12px",
                        fontWeight: "700",
                        marginBottom: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      {service.tag}
                    </span>
                    
                    <Title level={3} style={{ margin: "0 0 16px 0", fontSize: "22px", fontWeight: "800", color: "#1e293b" }}>
                      <Space>
                        {service.icon}
                        {service.title}
                      </Space>
                    </Title>
                    
                    <Paragraph style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.7", marginBottom: "24px" }}>
                      {service.desc}
                    </Paragraph>

                    <Button
                      type="link"
                      icon={<ArrowRightOutlined />}
                      style={{
                        padding: 0,
                        fontWeight: "700",
                        color: "#2e4a1e",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </Col>
              </Row>
            );
          })}
        </div>
      </div>

      <style>{`
        .services-title {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 800;
          color: #142a1f;
          margin: 0 0 16px 0;
          line-height: 1.25;
        }
        .services-desc {
          color: #64748b !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
        }
        .service-card-hover {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .service-card-hover:hover {
          transform: translateY(-6px);
        }
        .service-card-hover:hover .service-img {
          transform: scale(1.04);
        }
      `}</style>
    </section>
  );
}

