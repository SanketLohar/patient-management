import { Typography } from "antd";
import FollowUpRegistry from "../../components/common/FollowUpRegistry";

export default function NurseFollowUps() {
  return (
    <div style={{ padding: "0 0 40px 0" }}>
      <div style={{ marginBottom: "24px" }}>
        <Typography.Title level={3} style={{ margin: 0, fontWeight: 800, color: "#0f172a" }}>
          Follow-Up Action Center
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: "14px" }}>
          Log calls and status updates for patients requiring follow-up care.
        </Typography.Text>
      </div>
      <FollowUpRegistry />
    </div>
  );
}
