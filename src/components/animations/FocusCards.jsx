import React, { useState } from "react";
import { Card as AntdCard, Typography } from "antd";
import "./FocusCards.css";

const { Title, Paragraph } = Typography;

export const FocusCard = React.memo(({ card, index, hovered, setHovered }) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={`focus-card-item ${
      hovered !== null && hovered !== index ? "focus-card-blur" : hovered === index ? "focus-card-active" : ""
    }`}
  >
    <AntdCard
      hoverable
      variant="borderless"
      cover={
        <div style={{ height: "180px", overflow: "hidden", position: "relative" }}>
          <img
            src={card.image}
            alt={card.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="dept-cover-img"
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.1) 100%)",
            }}
          />
          {/* Floating Circle Icon */}
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              right: "20px",
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              zIndex: 2,
            }}
          >
            {card.icon}
          </div>
        </div>
      }
      style={{
        borderRadius: "24px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)",
        border: "1px solid rgba(46, 74, 30, 0.15)",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        backdropFilter: "blur(8px)",
      }}
      styles={{ body: { padding: "24px" } }}
    >
      <Title level={4} style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "800", color: "#1e293b" }}>
        {card.name}
      </Title>
      <Paragraph style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
        {card.desc}
      </Paragraph>
    </AntdCard>
  </div>
));

FocusCard.displayName = "FocusCard";

export function FocusCards({ cards }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="focus-cards-grid">
      {cards.map((card, index) => (
        <div key={index} className="focus-cards-grid-item">
          <FocusCard
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        </div>
      ))}
    </div>
  );
}

