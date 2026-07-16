import { Descriptions, Tag, Typography, Avatar, Card, Space, Divider } from "antd";
import { UserOutlined, MedicineBoxOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import StatusBadge from "../../../components/admin/common/StatusBadge";

const { Title, Paragraph, Text } = Typography;

export default function DoctorProfile({ doctor }) {
  if (!doctor) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* 1. Header Banner Profile */}
      <Card
        variant="borderless"
        style={{
          background: "linear-gradient(135deg, #0d6efd 0%, #0056b3 100%)",
          borderRadius: "16px",
          color: "#ffffff",
        }}
        styles={{ body: { padding: "24px" } }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            src={doctor.profileImage}
            style={{
              backgroundColor: "#ffffff",
              color: "#0d6efd",
              border: "3px solid rgba(255,255,255,0.2)",
            }}
          />
          <div>
            <Title level={3} style={{ margin: 0, color: "#ffffff", fontWeight: "800" }}>
              {doctor.fullName}
            </Title>
            <Space size="middle" style={{ marginTop: "4px", flexWrap: "wrap" }}>
              <Tag color="rgba(255,255,255,0.15)" style={{ color: "#ffffff", border: "none" }}>
                {doctor.department || "General Medicine"}
              </Tag>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px" }}>
                {doctor.specialization || "Consultant Specialist"}
              </Text>
            </Space>
          </div>
        </div>
      </Card>

      {/* 2. Contact details and Quick Stats */}
      <Descriptions title="Roster & Logistics Details" bordered column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Duty Status">
          <StatusBadge status={doctor.availability} type="tag" />
        </Descriptions.Item>
        <Descriptions.Item label="Consulting Room">
          <Tag color="blue">{doctor.roomNumber || "Not Assigned"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Working Shift">
          {doctor.workingShift || "Day Shift"}
        </Descriptions.Item>
        <Descriptions.Item label="Clinical Experience">
          {doctor.experience ? `${doctor.experience} Years` : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Weekly Off">
          <Tag color="volcano">{doctor.weeklyOff || "None"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Consultation Hours">
          {doctor.consultationTimings || "Not Configured"}
        </Descriptions.Item>
        <Descriptions.Item label="Languages Spoken">
          {doctor.languages || "English"}
        </Descriptions.Item>
        <Descriptions.Item label="Qualification">
          <Text strong>{doctor.qualification || "MD"}</Text>
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: "12px 0" }} />

      {/* 3. Contact Coordinates */}
      <Descriptions title="Communication Credentials" bordered column={1}>
        <Descriptions.Item label="Contact Phone">
          <Space>
            <PhoneOutlined style={{ color: "#64748b" }} />
            <span>{doctor.phone || "-"}</span>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Portal Email Address">
          <Space>
            <MailOutlined style={{ color: "#64748b" }} />
            <span>{doctor.email || "-"}</span>
          </Space>
        </Descriptions.Item>
      </Descriptions>

      {/* 4. Biography */}
      {doctor.biography && (
        <>
          <Divider style={{ margin: "12px 0" }} />
          <div>
            <Title level={5} style={{ display: "flex", alignItems: "center", gap: "8px", color: "#334155" }}>
              <MedicineBoxOutlined />
              <span>Professional Biography</span>
            </Title>
            <Paragraph style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6", marginTop: "8px" }}>
              {doctor.biography}
            </Paragraph>
          </div>
        </>
      )}
    </div>
  );
}

