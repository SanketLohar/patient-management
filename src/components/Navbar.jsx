import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Drawer, Space } from "antd";
import { MenuOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { HOSPITAL_CONFIG } from "../constants/hospitalConfig";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setDrawerVisible(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { label: "Home", target: "hero" },
    { label: "About Us", target: "about" },
    { label: "Why Choose Us", target: "why-choose-us" },
    { label: "Treatments", target: "departments" },
    { label: "Services", target: "services" },
    { label: "Quick Check-in", target: "qr-appointment" },
    { label: "Contact Us", target: "contact" }
  ];

  return (
    <>
      {/* Top Information Bar */}
      <div
        className="top-bar"
        style={{
          background: "#0f2a1d",
          color: "#cbd5e1",
          fontSize: "12px",
          height: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 5%",
          zIndex: 1001,
          position: "relative",
          fontWeight: "600",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
        }}
      >
        <Space size="large" className="top-bar-left">
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <PhoneOutlined style={{ color: "#eab308", fontSize: "13px" }} />
            24x7 Emergency: <strong style={{ color: "#d4a017" }}>{HOSPITAL_CONFIG.emergencyPhone}</strong>
          </span>
          <span className="hide-on-mobile" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MailOutlined style={{ color: "#eab308", fontSize: "13px" }} />
            {HOSPITAL_CONFIG.email}
          </span>
        </Space>
        <span className="hide-on-tablet" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <EnvironmentOutlined style={{ color: "#eab308", fontSize: "13px" }} />
          {HOSPITAL_CONFIG.address}
        </span>
      </div>

      {/* Main Header / Navigation */}
      <header
        className="navbar-header"
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          right: 0,
          height: scrolled ? "76px" : "90px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "0 5%",
          zIndex: 50,
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          background: scrolled ? "rgba(20, 42, 31, 0.98)" : "#142a1f",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: scrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
        }}
      >
        {/* Left Navigation Links */}
        <div className="desktop-nav" style={{ display: "flex", gap: "28px", justifyContent: "flex-end", paddingRight: "40px" }}>
          {navItems.slice(0, 3).map((item) => (
            <span
              key={item.label}
              onClick={() => handleNavClick(item.target)}
              className="nav-link"
              style={{
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                color: "#cbd5e1",
                transition: "var(--transition-smooth)",
                padding: "6px 0",
              }}
            >
              {item.label}
            </span>
          ))}
        </div>

        {/* Center Brand Logo Only */}
        <div 
          style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} 
          onClick={() => navigate("/")}
        >
          <img
            src={HOSPITAL_CONFIG.logo}
            alt="Moolatvam Ayurved Logo"
            style={{
              height: "75px",
              width: "75px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(212, 160, 23, 0.4)",
              transition: "var(--transition-smooth)"
            }}
          />
        </div>

        {/* Right Navigation Links & Action Buttons */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "28px", justifyContent: "flex-start", paddingLeft: "40px" }}>
          {navItems.slice(3, 6).map((item) => (
            <span
              key={item.label}
              onClick={() => handleNavClick(item.target)}
              className="nav-link"
              style={{
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                color: "#cbd5e1",
                transition: "var(--transition-smooth)",
                padding: "6px 0",
              }}
            >
              {item.label}
            </span>
          ))}

          <Button
            type="primary"
            onClick={() => navigate("/patient/register")}
            style={{
              fontWeight: "700",
              borderRadius: "8px",
              height: "40px",
              padding: "0 20px",
              backgroundColor: "#d4a017",
              borderColor: "#d4a017",
              color: "#142a1f",
              boxShadow: "0 4px 12px rgba(212, 160, 23, 0.2)",
              display: "inline-flex",
              alignItems: "center",
              transition: "var(--transition-smooth)",
              marginLeft: "12px",
              textTransform: "uppercase",
              fontSize: "12px"
            }}
            className="navbar-cta-btn"
          >
            Book Now
          </Button>
        </div>

        {/* Mobile Drawer Trigger Button */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            className="mobile-menu-btn"
            type="text"
            icon={<MenuOutlined style={{ fontSize: "21px", color: "#ffffff" }} />}
            onClick={() => setDrawerVisible(true)}
            style={{ display: "none" }}
          />
        </div>

        {/* Mobile Navigation Drawer */}
        <Drawer
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={HOSPITAL_CONFIG.logo} alt="Logo" style={{ height: "32px", borderRadius: "6px" }} />
              <span style={{ fontSize: "18px", fontWeight: "800", color: "#142a1f" }}>{HOSPITAL_CONFIG.name}</span>
            </div>
          }
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          size="default"
          styles={{
            header: { borderBottom: "1px solid #f1f5f9" },
            body: { padding: "20px 24px" }
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {navItems.map((item) => (
              <div
                key={item.label}
                onClick={() => handleNavClick(item.target)}
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "var(--text-dark)",
                  cursor: "pointer",
                  padding: "10px 0",
                  borderBottom: "1px solid #f8fafc",
                  transition: "color 0.2s"
                }}
                className="mobile-nav-link"
              >
                {item.label}
              </div>
            ))}
            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <Button
                type="default"
                block
                size="large"
                onClick={() => {
                  setDrawerVisible(false);
                  navigate("/login");
                }}
                style={{ borderRadius: "10px", fontWeight: "600", color: "var(--primary-color)" }}
              >
                Staff Login
              </Button>
              <Button
                type="primary"
                block
                size="large"
                onClick={() => {
                  setDrawerVisible(false);
                  navigate("/patient/register");
                }}
                style={{ borderRadius: "10px", backgroundColor: "#d4a017", borderColor: "#d4a017", color: "#142a1f", fontWeight: "700" }}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </Drawer>

        {/* Global Nav CSS Hover Customizations */}
        <style>{`
          .nav-link:hover {
            color: #facc15 !important;
          }
          .nav-link::after {
            background: #facc15;
          }
          .navbar-cta-btn:hover {
            transform: translateY(-2px);
            background-color: #fde047 !important;
            border-color: #fde047 !important;
            color: #0f2a1d !important;
            box-shadow: 0 8px 20px rgba(212, 160, 23, 0.35) !important;
          }
          .mobile-nav-link:hover {
            color: #d4a017;
          }
          @media (max-width: 1150px) {
            .navbar-header {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              width: 100% !important;
            }
            .desktop-nav {
              display: none !important;
            }
            .mobile-menu-btn {
              display: inline-block !important;
            }
          }
          @media (max-width: 768px) {
            .hide-on-mobile {
              display: none !important;
            }
            .top-bar {
              display: none !important;
            }
            .navbar-header {
              height: 70px !important;
              padding: 0 16px !important;
            }
          }
          @media (max-width: 576px) {
            .hide-on-tablet {
              display: none !important;
            }
          }
        `}</style>
      </header>
    </>
  );
}

