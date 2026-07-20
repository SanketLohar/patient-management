import { motion } from "framer-motion";
import { Carousel, Typography } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";

const { Title, Paragraph, Text } = Typography;

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      style={{
        display: "flex",
        flexWrap: "wrap",
        overflow: "hidden",
        backgroundColor: "#142a1f",
      }}
    >
      {/* LEFT COLUMN: Image with Arch */}
      <div 
        className="testimonial-left-col"
        style={{ 
          flex: "1 1 50%", 
          minWidth: "300px", 
          backgroundColor: "#142a1f", 
          display: "flex", 
          alignItems: "flex-end", 
          justifyContent: "center",
          padding: 0 
        }}
      >
        <div className="testimonial-graphic-container" style={{ position: "relative", width: "100%", maxWidth: "480px" }}>
          <img 
            src={HOSPITAL_CONFIG.testimonialsBg} 
            alt="Testimonials Background" 
            style={{
              width: "100%",
              height: "640px",
              objectFit: "cover",
              borderRadius: "240px 240px 16px 16px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            }}
          />
        </div>
      </div>

      {/* RIGHT COLUMN: Reviews Carousel */}
      <div 
        className="testimonial-right-col"
        style={{ 
          flex: "1 1 50%", 
          minWidth: "300px",
          padding: "100px 5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="mobile-hide-heading">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                display: "inline-block",
                color: "#d4a017",
                fontSize: "14px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: "16px",
              }}
            >
              Patient Testimonials
            </motion.span>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Title level={2} style={{ color: "#ffffff", fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 4vw, 2.5rem)", fontWeight: "500", marginBottom: "40px", lineHeight: "1.2" }}>
                Real Stories,<br />Real Healing
              </Title>
            </motion.div>
          </div>

          <div style={{ width: "100%", overflow: "hidden", minWidth: 0 }}>
            <Carousel
              autoplay
              autoplaySpeed={4000}
              speed={800}
              dots
              dotPlacement="bottom"
              style={{ paddingBottom: "40px" }}
            >
              {HOSPITAL_CONFIG.testimonials.map((test) => (
                <div key={test.id}>
                  <div className="testimonial-card-inner" style={{ padding: "20px 10px 40px 0" }}>
                    <Paragraph
                      className="testimonial-text-content"
                      style={{
                        fontSize: "clamp(17px, 2vw, 21px)",
                        color: "#e2e8f0",
                        lineHeight: "1.7",
                        fontStyle: "italic",
                        marginBottom: "36px",
                        fontWeight: "400",
                      }}
                    >
                      "{test.feedback}"
                    </Paragraph>

                    {/* Patient Profile info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                      <img
                        src={test.avatar}
                        alt={test.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #d4a017",
                        }}
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <Text style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", letterSpacing: "0.02em" }}>
                          {test.name}
                        </Text>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                          <CheckCircleFilled style={{ color: "#d4a017", fontSize: "15px" }} />
                          <Text style={{ fontSize: "14px", color: "#94a3b8", fontWeight: "600" }}>
                            {test.location}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>

      <style>{`
        .ant-carousel .slick-dots li button {
          background: rgba(255, 255, 255, 0.2) !important;
          height: 4px !important;
          border-radius: 2px !important;
          transition: all 0.3s ease !important;
        }
        .ant-carousel .slick-dots li.slick-active button {
          background: #d4a017 !important;
          width: 32px !important;
        }
        @media (max-width: 768px) {
          #testimonials {
            display: block !important;
          }
          .testimonial-left-col {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            margin-bottom: 24px !important;
            padding: 0 !important;
          }
          .testimonial-graphic-container {
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            display: block !important;
          }
          .testimonial-graphic-container img {
            width: 100% !important;
            height: auto !important;
            object-fit: cover !important;
            display: block !important;
            margin: 0 auto !important;
            border-radius: 240px 240px 16px 16px !important;
          }
          .mobile-hide-heading {
            display: none !important;
          }
          .testimonial-right-col {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            padding: 0 24px 60px 24px !important;
            clear: both !important;
            text-align: center !important;
          }
          .testimonial-card-inner {
            padding: 24px !important;
            margin-bottom: 24px !important;
            overflow: visible !important;
            height: auto !important;
          }
          .testimonial-text-content {
            overflow: visible !important;
            text-overflow: clip !important;
            white-space: normal !important;
            height: auto !important;
          }
          /* Fix patient profile alignment since right-col is text-center */
          .testimonial-card-inner > div:last-child {
            justify-content: center !important;
            text-align: left !important;
          }
        }
      `}</style>
    </section>
  );
}
