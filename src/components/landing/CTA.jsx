import { motion } from "framer-motion";
import { Button, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { CalendarOutlined, LoginOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section
      id="cta"
      style={{
        padding: "100px 5%",
        background: "linear-gradient(135deg, #f0f7ee 0%, #fefdf8 100%)",
        color: "#142a1f",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Blobs */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(46, 74, 30, 0.04)",
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          right: "-50px",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "rgba(212, 160, 23, 0.04)",
          filter: "blur(30px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: "800px", margin: "auto", position: "relative", zIndex: 2 }}
      >
        <Title
          level={2}
          style={{
            color: "#142a1f",
            fontSize: "clamp(2.2rem, 4vw, 2.5rem)",
            fontWeight: "500",
            marginBottom: "20px",
            lineHeight: "1.2",
            fontFamily: "'Playfair Display', serif"
          }}
        >
          Your Health Is Our Highest Priority
        </Title>
        <Paragraph
          style={{
            color: "var(--text-muted)",
            fontSize: "clamp(15px, 2vw, 18px)",
            lineHeight: "1.7",
            maxWidth: "600px",
            margin: "0 auto 40px auto",
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.02em"
          }}
        >
          Book your clinical check-in ticket online using our queue skip process, or contact our medical desk for comprehensive inquiry response.
        </Paragraph>

        <Space size="middle" wrap style={{ justifyContent: "center" }}>
          <Button
            type="primary"
            size="large"
            icon={<CalendarOutlined />}
            onClick={() => navigate("/patient/register")}
            style={{
              borderRadius: "10px",
              height: "52px",
              padding: "0 28px",
              fontSize: "15px",
              fontWeight: "600",
              backgroundColor: "#2e4a1e",
              color: "#ffffff",
              borderColor: "#2e4a1e",
              boxShadow: "0 10px 20px rgba(46, 74, 30, 0.15)",
            }}
          >
            Book Appointment
          </Button>
          <Button
            size="large"
            icon={<LoginOutlined />}
            onClick={() => navigate("/login")}
            style={{
              borderRadius: "10px",
              height: "52px",
              padding: "0 28px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#142a1f",
              borderColor: "rgba(15, 23, 42, 0.15)",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
            }}
          >
            Staff Login
          </Button>
        </Space>
      </motion.div>
    </section>
  );
}

