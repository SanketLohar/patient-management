import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Row, Col, Card, Typography, Tag } from "antd";
import { ShoppingOutlined, GiftOutlined } from "@ant-design/icons";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";

// Import premium animation components strictly from the library
import BorderGlow from "../animations/BorderGlow";
import FloatingLines from "../animations/FloatingLines";
import BlurText from "../animations/BlurText";
import ScrollReveal from "../animations/ScrollReveal";
import CountUp from "../animations/CountUp";

const { Title, Paragraph, Text } = Typography;

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const products = HOSPITAL_CONFIG.products;

  const categoryColors = {
    "Hair Care": { bg: "rgba(46, 74, 30, 0.08)", color: "#2e4a1e", border: "rgba(46, 74, 30, 0.2)" },
    "Immunity": { bg: "rgba(212, 160, 23, 0.08)", color: "#b08000", border: "rgba(212, 160, 23, 0.25)" },
    "Energy": { bg: "rgba(46, 74, 30, 0.08)", color: "#2e4a1e", border: "rgba(46, 74, 30, 0.2)" },
    "Herbal Cosmetics": { bg: "rgba(212, 160, 23, 0.08)", color: "#b08000", border: "rgba(212, 160, 23, 0.25)" },
  };

  return (
    <section
      id="why-choose-us"
      style={{
        position: "relative",
        padding: "120px 5%",
        background: "linear-gradient(180deg, #fefdf8 0%, #f0f7ee 100%)",
        overflow: "hidden",
      }}
    >
      {/* Subtle FloatingLines background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.12,
        }}
      >
        <FloatingLines
          linesGradient={["#2e4a1e", "#d4a017", "#a5c890"]}
          animationSpeed={0.8}
          interactive={true}
          bendRadius={6.0}
          bendStrength={-0.6}
          mouseDamping={0.06}
          parallax={true}
          parallaxStrength={0.25}
          mixBlendMode="screen"
        />
      </div>

      <div ref={sectionRef} style={{ position: "relative", zIndex: 1 }}>

        {/* Section Header */}
        <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 64px auto" }}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "inline-block",
              padding: "8px 18px",
              borderRadius: "30px",
              backgroundColor: "rgba(46, 74, 30, 0.08)",
              border: "1px solid rgba(46, 74, 30, 0.15)",
              color: "#2e4a1e",
              fontSize: "13px",
              fontWeight: "700",
              marginBottom: "16px",
              letterSpacing: "0.05em",
            }}
          >
            🌿 OUR PROPRIETARY PRODUCTS
          </motion.span>

          <BlurText
            text="Natural Products by {Moolatvam}"
            delay={80}
            animateBy="words"
            direction="bottom"
            className="section-title-blur-text text-center products-section-title"
          />

          <ScrollReveal
            enableBlur={true}
            baseOpacity={0.15}
            blurStrength={6}
            textClassName="paragraph-scroll-reveal text-center"
          >
            Crafted from authentic Ayurvedic formulations — our proprietary range of hair care, immunity, and herbal cosmetics products deliver real, measurable results without side effects.
          </ScrollReveal>
        </div>

        {/* Products Grid */}
        <Row gutter={[24, 28]} style={{ maxWidth: "1240px", margin: "0 auto 72px auto" }} justify="center">
          {products.map((product, idx) => {
            const catStyle = categoryColors[product.category] || categoryColors["Hair Care"];
            return (
              <Col xs={24} sm={12} lg={8} xl={6} key={idx} style={{ display: "flex", flexDirection: "column" }}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(212, 160, 23, 0.12)", transition: { duration: 0.3 } }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.7, delay: (idx % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: "flex", flex: 1, flexDirection: "column", borderRadius: "20px" }}
                  className="product-card-wrapper"
                >
                  <Card
                    variant="borderless"
                    styles={{ body: { padding: 0 } }}
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    {/* Product image */}
                    <div
                      style={{
                        height: "200px",
                        backgroundColor: "#ffffff",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                        position: "relative",
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          maxHeight: "148px",
                          maxWidth: "100%",
                          objectFit: "contain",
                          transition: "transform 0.4s ease",
                        }}
                        className="product-img"
                      />
                      {/* Category tag */}
                      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
                        <Tag
                          style={{
                            backgroundColor: "#f8fafc",
                            color: "#475569",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            fontWeight: "800",
                            fontSize: "10px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {product.category}
                        </Tag>
                      </div>
                    </div>

                    {/* Card body */}
                    <div
                      style={{
                        padding: "18px 20px 20px",
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        gap: "10px",
                      }}
                    >
                      <Title
                        level={5}
                        style={{
                          margin: 0,
                          fontSize: "15px",
                          fontWeight: "800",
                          color: "#1e293b",
                          lineHeight: "1.3",
                        }}
                      >
                        {product.name}
                      </Title>

                      <div style={{ marginTop: "4px", marginBottom: "8px" }}>
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: "700",
                            color: "#475569",
                          }}
                        >
                          {product.price}
                        </span>
                      </div>

                      <Paragraph
                        style={{
                          color: "#64748b",
                          fontSize: "12.5px",
                          lineHeight: "1.6",
                          margin: 0,
                          flex: 1,
                        }}
                        ellipsis={{ rows: 3 }}
                      >
                        {product.desc}
                      </Paragraph>

                      {/* Composition detail */}
                      {product.composition && (
                        <div
                          style={{
                            borderTop: "1px solid #f1f5f9",
                            paddingTop: "10px",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#94a3b8",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              display: "block",
                              marginBottom: "4px",
                            }}
                          >
                            Composition
                          </Text>
                          <Text
                            style={{
                              fontSize: "12px",
                              color: "#334155",
                              lineHeight: "1.5",
                            }}
                          >
                            {product.composition}
                          </Text>
                        </div>
                      )}

                      {/* Storage note */}
                      {product.storage && (
                        <Text
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            fontStyle: "italic",
                          }}
                        >
                          {product.storage}
                        </Text>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </Col>
            );
          })}
        </Row>

        {/* Premium stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          <BorderGlow
            className="glass-border-glow"
            glowColor="60 74 30"
            backgroundColor="rgba(255, 255, 255, 0.45)"
            borderRadius={28}
            glowRadius={60}
            glowIntensity={1.5}
            coneSpread={25}
            animated={false}
            colors={["#2e4a1e", "#d4a017", "#a5c890"]}
            fillOpacity={0.12}
          >
            <div style={{ padding: "40px 32px" }}>
              <Row gutter={[32, 32]} align="middle" style={{ textAlign: "center" }}>
                {[
                  { label: "Happy Patients", value: "10000+", icon: "❤️" },
                  { label: "Happy Customers", value: "20000+", icon: "😊" },
                  { label: "Doctors Trained", value: "1500+", icon: "🏥" },
                ].map((stat, idx) => (
                  <Col xs={24} md={8} key={idx}>
                    <div style={{ fontSize: "28px", marginBottom: "4px" }}>{stat.icon}</div>
                    <div
                      style={{
                        color: "#2e4a1e",
                        fontSize: "clamp(26px, 4vw, 40px)",
                        fontWeight: "800",
                        lineHeight: "1.1",
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "center",
                        fontFamily: "'Georgia', serif",
                      }}
                    >
                      <CountUp from={0} to={parseInt(stat.value)} duration={2.0} startWhen={isInView} once={false} />
                      <span style={{ color: "#d4a017", marginLeft: "2px" }}>+</span>
                    </div>
                    <p style={{ color: "#64748b", fontWeight: "700", margin: "10px 0 0 0", fontSize: "14px" }}>
                      {stat.label}
                    </p>
                  </Col>
                ))}
              </Row>
            </div>
          </BorderGlow>
        </motion.div>
      </div>

      <style>{`
        .products-section-title {
          font-size: clamp(24px, 3vw, 36px) !important;
          font-weight: 800 !important;
          color: #142a1f !important;
        }
        .product-card-wrapper {
          height: 100%;
        }
        .product-card-wrapper:hover .product-img {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
}
