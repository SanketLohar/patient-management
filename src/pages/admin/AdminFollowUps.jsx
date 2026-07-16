import { Typography } from "antd";
import FollowUpRegistry from "../../components/common/FollowUpRegistry";

export default function AdminFollowUps() {
  return (
    <div style={{ padding: "0 0 40px 0" }}>
      <div style={{ marginBottom: "24px" }}>
        <Typography.Title level={3} style={{ margin: 0, fontWeight: 800, color: "#0f172a" }}>
          Centralized Follow-Ups
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: "14px" }}>
          Monitor active patient follow-ups and nurse interaction logs globally.
        </Typography.Text>
      </div>
      <FollowUpRegistry />
    </div>
  );
}
