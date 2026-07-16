import { Descriptions, Tag, Typography, Avatar, Card, Space, Divider } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, SafetyOutlined } from "@ant-design/icons";
import StatusBadge from "../../../components/admin/common/StatusBadge";

const { Title, Paragraph, Text } = Typography;

export default function NurseProfile({ nurse }) {
  if (!nurse) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Profile Header */}
      <Card
        variant="borderless"
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          borderRadius: "16px",
          color: "#ffffff",
        }}
        styles={{ body: { padding: "24px" } }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            src={nurse.profileImage}
            style={{
              backgroundColor: "#ffffff",
              color: "#10b981",
              border: "3px solid rgba(255,255,255,0.2)",
            }}
          />
          <div>
            <Title level={3} style={{ margin: 0, color: "#ffffff", fontWeight: "800" }}>
              {nurse.fullName}
            </Title>
            <Space size="middle" style={{ marginTop: "4px", flexWrap: "wrap" }}>
              <Tag color="rgba(255,255,255,0.15)" style={{ color: "#ffffff", border: "none" }}>
                {nurse.department || "General Ward"}
              </Tag>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px" }}>
                Nursing Care Unit
              </Text>
            </Space>
          </div>
        </div>
      </Card>

      {/* 2. Roster Details */}
      <Descriptions title="Duty & Shift Configurations" bordered column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Duty Status">
          <StatusBadge status={nurse.availability} type="tag" />
        </Descriptions.Item>
        <Descriptions.Item label="Assigned Department">
          {nurse.department || "General Ward"}
        </Descriptions.Item>
        <Descriptions.Item label="Working Shift">
          {nurse.workingShift || "Morning"}
        </Descriptions.Item>
        <Descriptions.Item label="Weekly Off">
          <Tag color="volcano">{nurse.weeklyOff || "Sunday"}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: "12px 0" }} />

      {/* 3. Communication */}
      <Descriptions title="Communication Credentials" bordered column={1}>
        <Descriptions.Item label="Contact Phone">
          <Space>
            <PhoneOutlined style={{ color: "#64748b" }} />
            <span>{nurse.phone || "-"}</span>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Portal Email Address">
          <Space>
            <MailOutlined style={{ color: "#64748b" }} />
            <span>{nurse.email || "-"}</span>
          </Space>
        </Descriptions.Item>
      </Descriptions>

      {/* 4. Biography */}
      {nurse.biography && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <div>
            <Title level={5} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#334155" }}>
              <SafetyOutlined />
              <span>Professional Biography</span>
            </Title>
            <Paragraph style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6", marginTop: "8px" }}>
              {nurse.biography}
            </Paragraph>
          </div>
        </>
      )}
    </div>
  );
}

