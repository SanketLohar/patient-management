import React, { useState, useEffect } from "react";
import Hero from "../../components/landing/Hero";
import About from "../../components/landing/About";
import WhyChooseUs from "../../components/landing/WhyChooseUs";
import Departments from "../../components/landing/Departments";
import Services from "../../components/landing/Services";
import WellnessPrograms from "../../components/landing/WellnessPrograms";
import Doctors from "../../components/landing/Doctors";
import Gallery from "../../components/landing/Gallery";
import Testimonials from "../../components/landing/Testimonials";
import FAQ from "../../components/landing/FAQ";
import QRSection from "../../components/landing/QRSection";
import ContactSection from "../../components/landing/ContactSection";
import CTA from "../../components/landing/CTA";

export default function LandingPage() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      // Capture scroll position from whatever container is actually scrolling
      const scrollPos = e.target?.scrollTop || window.scrollY || document.documentElement.scrollTop;
      if (scrollPos > 200) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    
    // Using capture phase (true) ensures we catch the scroll event even if a child container is the one scrolling
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Fallback for custom scroll containers
    const scrollContainers = document.querySelectorAll('.ant-layout-content, main, body, html');
    scrollContainers.forEach(el => el.scrollTo({ top: 0, behavior: "smooth" }));
  };

  return (
    <main style={{ minHeight: "100vh" }}>
      <Hero />
      <About />
      <Departments />
      <Services />
      <WellnessPrograms />
      <WhyChooseUs />
      <Doctors />
      <Testimonials />
      <FAQ />
      <QRSection />
      <ContactSection />
      <CTA />
      
      {showTopBtn && (
        <button
          onClick={goToTop}
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            zIndex: 999999,
            backgroundColor: "#2e4a1e",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "56px",
            height: "56px",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 8px 16px rgba(46, 74, 30, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          ↑
        </button>
      )}
    </main>
  );
}

