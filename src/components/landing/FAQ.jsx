import { motion } from "framer-motion";
import { Collapse, Typography } from "antd";
import { QuestionCircleOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";

// Import premium animation components
import LightRays from "../animations/LightRays";
import BlurText from "../animations/BlurText";
import ScrollReveal from "../animations/ScrollReveal";

const { Title, Paragraph } = Typography;

export default function FAQ() {
  return (
    <section
      id="faq"
      style={{
        position: "relative",
        padding: "110px 5%",
        background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
        overflow: "hidden",
      }}
    >
      {/* Premium LightRays background layer behind FAQ */}
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
          raysOrigin="bottom-left"
          raysColor="#ccfbf1" // Soft cyan light rays
          raysSpeed={0.5}
          lightSpread={1.4}
          rayLength={2.2}
          pulsating={true}
          fadeDistance={0.8}
          saturation={0.7}
          followMouse={true}
          mouseInfluence={0.03}
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
            Got Questions?
          </span>

          <BlurText 
            text="Frequently Asked {Questions}" 
            delay={80}
            animateBy="words"
            direction="bottom"
            className="section-title-blur-text text-center faq-title"
          />

          <Paragraph className="faq-desc text-center">
            Find quick answers to common questions regarding queue registration, emergency admissions, and diagnostic reports.
          </Paragraph>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <Collapse
            variant="borderless"
            accordion
            expandIcon={({ isActive }) =>
              isActive ? (
                <MinusOutlined style={{ color: "#0d6efd", fontSize: "14px" }} />
              ) : (
                <PlusOutlined style={{ color: "#475569", fontSize: "14px" }} />
              )
            }
            expandIconPlacement="end"
            style={{ background: "transparent" }}
            items={HOSPITAL_CONFIG.faqs.map((faq) => ({
              key: faq.id,
              label: (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0" }}>
                  <QuestionCircleOutlined style={{ color: "#0d6efd", fontSize: "18px" }} />
                  <span style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
                    {faq.question}
                  </span>
                </div>
              ),
              children: (
                <div style={{ padding: "0 16px 16px 30px", color: "#64748b", fontSize: "15px", lineHeight: "1.7" }}>
                  {faq.answer}
                </div>
              ),
              style: {
                marginBottom: "16px",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(8px)",
                borderRadius: "16px",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                boxShadow: "0 10px 25px rgba(16, 68, 165, 0.02)",
                overflow: "hidden",
              }
            }))}
          />
        </motion.div>
      </div>

      {/* Overriding panel header default padding style */}
      <style>{`
        .faq-title {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 800;
          color: #142a1f;
          margin: 0 0 16px 0;
          line-height: 1.25;
        }
        .faq-desc {
          color: #64748b !important;
          font-size: 16px !important;
          line-height: 1.6 !important;
        }
        .ant-collapse > .ant-collapse-item > .ant-collapse-header {
          padding: 16px 24px !important;
          align-items: center !important;
        }
      `}</style>
    </section>
  );
}

