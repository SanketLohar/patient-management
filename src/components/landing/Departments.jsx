import { motion } from "framer-motion";
import { Typography } from "antd";
import {
  ExperimentOutlined,
  EyeOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  FireOutlined,
  AlignCenterOutlined,
} from "@ant-design/icons";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";

// Import premium animation components
import { FocusCards } from "../animations/FocusCards";
import Particles from "../animations/Particles";
import SplitText from "../animations/SplitText";

const { Paragraph } = Typography;

export default function Departments() {
  const icons = [
    <MedicineBoxOutlined style={{ fontSize: "24px", color: "#2e4a1e" }} />,
    <HeartOutlined style={{ fontSize: "24px", color: "#d4a017" }} />,
    <EyeOutlined style={{ fontSize: "24px", color: "#2e4a1e" }} />,
    <ExperimentOutlined style={{ fontSize: "24px", color: "#d4a017" }} />,
    <FireOutlined style={{ fontSize: "24px", color: "#2e4a1e" }} />,
    <AlignCenterOutlined style={{ fontSize: "24px", color: "#d4a017" }} />,
  ];

  const treatments = HOSPITAL_CONFIG.treatments.map((t, i) => ({
    icon: icons[i],
    name: t.name,
    desc: t.desc,
    image: t.image,
  }));

  return (
    <section
      id="departments"
      style={{
        position: "relative",
        padding: "110px 5%",
        background: "linear-gradient(180deg, #fefdf8 0%, #f0f7ee 100%)",
        overflow: "hidden",
      }}
    >
      {/* Premium WebGL Particles Background Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.5,
        }}
      >
        <Particles
          particleCount={200}
          particleColors={["#2e4a1e", "#d4a017", "#a5c890"]}
          particleSpread={10}
          speed={0.1}
          alphaParticles={true}
          particleBaseSize={8}
          sizeRandomness={0.6}
          moveParticlesOnHover={true}
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
              marginBottom: "20px",
            }}
          >
            Panchakarma & Ayurvedic Therapies
          </span>

          <SplitText
            text="Our Specialized {Treatments}"
            delay={40}
            duration={0.8}
            className="specialized-title"
            textAlign="center"
            tag="h2"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
          />

          <Paragraph style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.6", marginTop: "12px" }}>
            Moolatvam Ayurved offers classical Panchakarma and specialized Ayurvedic therapies performed by expert Vaidyas using authentic protocols at our Sangli centre.
          </Paragraph>
        </div>

        <div style={{ maxWidth: "1200px", margin: "auto" }}>
          <FocusCards cards={treatments} />
        </div>
      </div>

      <style>{`
        .specialized-title {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 800;
          color: #142a1f;
          margin: 0;
          line-height: 1.25;
        }
      `}</style>
    </section>
  );
}
