import { Typography, Breadcrumb, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function PageHeader({ title, subtitle, breadcrumbs = [], action }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb
          style={{ fontSize: "12px", color: "#64748b" }}
          items={[
            {
              title: (
                <Link to="/dashboard/admin" style={{ display: "flex", alignItems: "center", gap: "4px", color: "#64748b" }}>
                  <HomeOutlined style={{ fontSize: "12px" }} />
                  <span style={{ fontWeight: 500 }}>Moolatvam Ayurved ERP</span>
                </Link>
              ),
            },
            ...breadcrumbs.map((b) => ({
              title: b.link ? (
                <Link to={b.link} style={{ color: "#64748b", fontWeight: 500 }}>
                  {b.title}
                </Link>
              ) : (
                <span style={{ color: "#0f172a", fontWeight: 600 }}>{b.title}</span>
              ),
            })),
          ]}
        />
      )}

      {/* Title & Action row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.02em" }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#64748b", fontWeight: "500" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div>
            <Button
              className="saas-btn-primary"
              type="primary"
              icon={action.icon}
              onClick={action.onClick}
              size="large"
              style={{ height: "42px", borderRadius: "8px" }}
            >
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

