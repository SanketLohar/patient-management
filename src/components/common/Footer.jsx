import { Layout, Row, Col, Typography, Space, Input, Button } from "antd";
import {
  FacebookOutlined,
  YoutubeOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function Footer() {
  const navigate = useNavigate();

  const handleLinkClick = (targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const footerStyle = {
    background: "#142a1f",
    color: "#f8fafc",
    padding: "80px 5% 40px 5%",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    fontSize: "14px",
  };

  const linkStyle = {
    color: "#f8fafc",
    cursor: "pointer",
    display: "block",
    marginBottom: "14px",
    transition: "color 0.3s ease",
    fontSize: "14.5px"
  };

  const departmentsList = [
    "Uttar Basti Treatment",
    "Nasya Therapy",
    "Netra Tarpan",
    "Virechana Therapy",
    "Raktamokshana Therapy",
    "Greeva Basti",
  ];

  return (
    <AntFooter style={footerStyle} id="contact">
      <Row gutter={[64, 64]} justify="center" style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {/* Column 1: Brand Info */}
        <Col xs={24} md={8}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px", cursor: "pointer" }} onClick={() => navigate("/")}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={HOSPITAL_CONFIG.logo}
                alt="Logo"
                style={{
                  height: "64px",
                  borderRadius: "10px",
                  objectFit: "cover",
                  border: "2px solid #d4a017"
                }}
              />
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "800", color: "#d4a017", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {HOSPITAL_CONFIG.name}
            </span>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "24px" }}>
            <Text style={{ color: "#ffffff", fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>Contact Details:</Text>
            <Text style={{ color: "#f8fafc" }}>Support: India <strong style={{ color: "#d4a017" }}>{HOSPITAL_CONFIG.phone}</strong></Text>
            <Text style={{ color: "#f8fafc" }}>Emergency: <strong style={{ color: "#d4a017" }}>{HOSPITAL_CONFIG.emergencyPhone}</strong></Text>
            <Text style={{ color: "#f8fafc" }}>Email: <span style={{ textDecoration: "underline" }}>{HOSPITAL_CONFIG.email}</span></Text>
            <Text style={{ color: "#f8fafc", marginTop: "8px", lineHeight: "1.6" }}>{HOSPITAL_CONFIG.address}</Text>
          </div>
        </Col>

        {/* Column 2: Company */}
        <Col xs={24} sm={8} md={4}>
          <Title level={5} style={{ color: "#ffffff", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "32px", fontWeight: "700", fontSize: "18px", letterSpacing: "0.05em" }}>
            Company
          </Title>
          <span className="footer-link" style={linkStyle} onClick={() => handleLinkClick("hero")}>Home</span>
          <span className="footer-link" style={linkStyle} onClick={() => handleLinkClick("about")}>About Us</span>
          <span className="footer-link" style={linkStyle} onClick={() => handleLinkClick("why-choose-us")}>Why Choose Us</span>
          <span className="footer-link" style={linkStyle} onClick={() => navigate("/patient/register")}>Book Appointment</span>
          <span className="footer-link" style={linkStyle} onClick={() => navigate("/login")}>Staff Login</span>
        </Col>

        {/* Column 3: Links */}
        <Col xs={24} sm={8} md={4}>
          <Title level={5} style={{ color: "#ffffff", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "32px", fontWeight: "700", fontSize: "18px", letterSpacing: "0.05em" }}>
            Treatments
          </Title>
          {departmentsList.map((dept, idx) => (
            <span
              key={idx}
              className="footer-link"
              style={linkStyle}
              onClick={() => handleLinkClick("departments")}
            >
              {dept}
            </span>
          ))}
        </Col>

        {/* Column 4: Newsletter & Social */}
        <Col xs={24} sm={8} md={8}>
          <Title level={5} style={{ color: "#ffffff", fontFamily: "'Playfair Display', serif", textTransform: "uppercase", marginBottom: "32px", fontWeight: "700", fontSize: "18px", letterSpacing: "0.05em" }}>
            Stay Updated
          </Title>
          <Paragraph style={{ color: "#f8fafc", marginBottom: "20px" }}>
            Subscribe to our newsletter for health tips and Ayurvedic insights.
          </Paragraph>
          
          <div style={{ display: "flex", gap: "8px", marginBottom: "40px" }}>
            <Input 
              placeholder="Enter your email address" 
              style={{ 
                borderRadius: "30px", 
                padding: "10px 20px", 
                backgroundColor: "#ffffff",
                border: "none"
              }} 
            />
            <Button 
              type="primary" 
              style={{ 
                borderRadius: "30px", 
                padding: "0 24px", 
                height: "auto", 
                backgroundColor: "#d4a017", 
                borderColor: "#d4a017", 
                color: "#142a1f", 
                fontWeight: "700" 
              }}
            >
              Get Started
            </Button>
          </div>

          <Space size="large">
            <a href={HOSPITAL_CONFIG.socials.facebook} target="_blank" rel="noopener noreferrer" className="social-icon-wrapper">
              <FacebookOutlined style={{ fontSize: "20px" }} />
            </a>
            <a href={HOSPITAL_CONFIG.socials.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-wrapper">
              <InstagramOutlined style={{ fontSize: "20px" }} />
            </a>
            <a href={HOSPITAL_CONFIG.socials.youtube} target="_blank" rel="noopener noreferrer" className="social-icon-wrapper">
              <YoutubeOutlined style={{ fontSize: "20px" }} />
            </a>
          </Space>
        </Col>
      </Row>

      {/* Copyright Divider */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "64px auto 0 auto",
          paddingTop: "24px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <Text style={{ color: "#94a3b8", fontSize: "12px", maxWidth: "800px", lineHeight: "1.6" }}>
          *These statements have not been evaluated by the Food and Drug Administration. Moolatvam products and virtual consultations are not intended to diagnose, treat, cure, or prevent any disease. Always consult with your healthcare provider before starting any new supplement or health program.
          <br /><br />
          Copyright © {new Date().getFullYear()} {HOSPITAL_CONFIG.name}. All Rights Reserved.
        </Text>
        <Space size="large">
          <span style={{ color: "#94a3b8", cursor: "pointer", fontSize: "13px" }}>Privacy Policy</span>
          <span style={{ color: "#94a3b8", cursor: "pointer", fontSize: "13px" }}>Terms of Service</span>
        </Space>
      </div>

      <style>{`
        .footer-link:hover {
          color: #d4a017 !important;
        }
        .social-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(212, 160, 23, 0.5);
          color: #d4a017;
          transition: all 0.3s ease;
        }
        .social-icon-wrapper:hover {
          color: #142a1f !important;
          background-color: #d4a017;
          border-color: #d4a017;
          transform: translateY(-2px);
        }
      `}</style>
    </AntFooter>
  );
}
