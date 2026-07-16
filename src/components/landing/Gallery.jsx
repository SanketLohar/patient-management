import { useState } from "react";
import { motion } from "framer-motion";
import { Row, Col, Typography, Tag, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";

// Import premium background animation component
import LightRays from "../animations/LightRays";
import SplitText from "../animations/SplitText";
import TiltedCard from "../animations/TiltedCard";

const { Title, Paragraph } = Typography;

export default function Gallery() {
  const [activeItem, setActiveItem] = useState(null);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section
      id="gallery"
      style={{
        position: "relative",
        padding: "100px 5%",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Premium LightRays background layer behind Hospital Tour */}
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
          raysColor="#bae6fd" // Soft cyan light rays
          raysSpeed={0.5}
          lightSpread={1.4}
          rayLength={2.0}
          pulsating={true}
          fadeDistance={0.9}
          saturation={0.8}
          followMouse={true}
          mouseInfluence={0.04}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 60px auto" }}>
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "20px",
              backgroundColor: "rgba(212, 160, 23, 0.08)",
              color: "var(--secondary-color)",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            Hospital Tour
          </span>
          <SplitText
            tag="h2"
            text="Explore Our {Facilities}"
            splitType="words"
            delay={50}
            duration={0.8}
            ease="power3.out"
            textAlign="center"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 4vw, 2.5rem)", fontWeight: "500", color: "#142a1f", margin: "0 0 16px 0", lineHeight: "1.2" }}
          />
          <Paragraph style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.6" }}>
            Take a visual tour around our modern wards, state-of-the-art operation theaters, and diagnostic labs.
          </Paragraph>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="gallery-masonry-grid">
            {HOSPITAL_CONFIG.gallery.map((item, idx) => {
              const height = idx % 3 === 0 ? "345px" : idx % 3 === 1 ? "255px" : "300px";
              return (
                <div key={item.id} className="gallery-masonry-item">
                  <motion.div
                    variants={itemVariants}
                    onClick={() => setActiveItem(item)}
                    style={{ cursor: "pointer" }}
                    className="gallery-item-wrapper"
                  >
                    <TiltedCard
                      containerHeight={height}
                      containerWidth="100%"
                      scaleOnHover={1.03}
                      rotateAmplitude={10}
                      showMobileWarning={false}
                      showTooltip={false}
                    >
                      <div
                        style={{
                          position: "relative",
                          height: "100%",
                          width: "100%",
                          borderRadius: "24px",
                          overflow: "hidden",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.4s ease",
                          }}
                          className="gallery-img"
                        />

                        {/* Gradient Overlay */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: "24px",
                            background: "linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 60%, rgba(15, 23, 42, 0) 100%)",
                            color: "#ffffff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            height: "70%",
                            transform: "translateZ(30px)",
                            transformStyle: "preserve-3d",
                          }}
                        >
                          <div style={{ transform: "translateZ(45px)", display: "inline-block", alignSelf: "flex-start" }}>
                            <Tag
                              color="blue"
                              style={{
                                marginBottom: "8px",
                                fontWeight: "700",
                                borderRadius: "6px",
                                fontSize: "11px",
                                border: "none",
                              }}
                            >
                              {item.category}
                            </Tag>
                          </div>
                          <div style={{ transform: "translateZ(55px)" }}>
                            <Title level={4} style={{ color: "#ffffff", margin: 0, fontSize: "18px", fontWeight: "800" }}>
                              {item.title}
                            </Title>
                          </div>
                          <div style={{ transform: "translateZ(35px)" }}>
                            <span style={{ fontSize: "11px", opacity: 0.8, marginTop: "4px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <EyeOutlined /> Click to expand
                            </span>
                          </div>
                        </div>
                      </div>
                    </TiltedCard>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <Modal
        open={!!activeItem}
        onCancel={() => setActiveItem(null)}
        footer={null}
        destroyOnHidden
        centered
        styles={{ body: { padding: 0 } }}
        width={650}
        closeIcon={
          <span style={{ color: "#ffffff", fontSize: "16px", backgroundColor: "rgba(15,23,42,0.6)", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "all 0.2s" }}>
            ✕
          </span>
        }
      >
        {activeItem && (
          <div style={{ borderRadius: "24px", overflow: "hidden", background: "#0f172a" }}>
            <img
              src={activeItem.image}
              alt={activeItem.title}
              style={{ width: "100%", height: "350px", objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "30px 40px", color: "#ffffff" }}>
              <Tag color="blue" style={{ marginBottom: "12px", fontWeight: "700", border: "none" }}>{activeItem.category}</Tag>
              <Title level={3} style={{ color: "#ffffff", margin: "0 0 10px 0", fontWeight: "800" }}>
                {activeItem.title}
              </Title>
              <Paragraph style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                {activeItem.desc}
              </Paragraph>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .gallery-masonry-grid {
          column-count: 3;
          column-gap: 24px;
          max-width: 1200px;
          margin: auto;
        }
        @media (max-width: 992px) {
          .gallery-masonry-grid {
            column-count: 2;
          }
        }
        @media (max-width: 576px) {
          .gallery-masonry-grid {
            column-count: 1;
          }
        }
        .gallery-masonry-item {
          break-inside: avoid;
          margin-bottom: 24px;
        }
        .gallery-item-wrapper:hover .gallery-img {
          transform: scale(1.08);
        }
      `}</style>
    </section>
  );
}

