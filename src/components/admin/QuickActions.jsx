import { Card, Row, Col, Typography, Button } from "antd";
import {
  UserAddOutlined,
  TeamOutlined,
  PlusCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Register Patient",
      desc: "Add a new patient admission record",
      icon: <UserAddOutlined style={{ fontSize: "20px", color: "#0d6efd" }} />,
      route: "/dashboard/admin/patients",
      btnText: "New Patient",
      btnType: "primary",
    },
    {
      title: "Add Doctor",
      desc: "Register a medical consultant specialist",
      icon: <PlusCircleOutlined style={{ fontSize: "20px", color: "#8b5cf6" }} />,
      route: "/dashboard/admin/doctors",
      btnText: "Add Doctor",
      btnType: "default",
    },
    {
      title: "Add Nurse",
      desc: "Register a clinical nursing staff member",
      icon: <TeamOutlined style={{ fontSize: "20px", color: "#10b981" }} />,
      route: "/dashboard/admin/nurses",
      btnText: "Add Nurse",
      btnType: "default",
    },
    {
      title: "Generate Report",
      desc: "Review statistics & export PDF log summary",
      icon: <FileTextOutlined style={{ fontSize: "20px", color: "#f59e0b" }} />,
      route: "/dashboard/admin/reports",
      btnText: "Get Report",
      btnType: "default",
    },
  ];

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.015)",
        border: "1px solid #e2e8f0",
      }}
    >
      <Title level={5} style={{ margin: "0 0 20px 0", color: "#0f172a", fontWeight: "700" }}>
        Quick Operations Cockpit
      </Title>

      <Row gutter={[16, 16]}>
        {actions.map((act, idx) => (
          <Col xs={24} sm={12} xl={6} key={idx}>
            <div
              style={{
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                background: "#f8fafc",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                    flexShrink: 0,
                  }}
                >
                  {act.icon}
                </div>
                <div>
                  <Title level={5} style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700" }}>
                    {act.title}
                  </Title>
                  <Paragraph style={{ color: "#64748b", fontSize: "12px", margin: 0, lineHeight: "1.4" }}>
                    {act.desc}
                  </Paragraph>
                </div>
              </div>

              <Button
                type={act.btnType}
                onClick={() => navigate(act.route)}
                block
                style={{ borderRadius: "6px", fontWeight: "600", fontSize: "13px" }}
              >
                {act.btnText}
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

