import { Result, Button } from "antd";
import { FileProtectOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function AdminCasePapers() {
  const navigate = useNavigate();
  return (
    <Result
      icon={<FileProtectOutlined style={{ color: "#f59e0b" }} />}
      title="Digital Case Papers"
      subTitle="Digital prescriptions, symptoms logs, and doctor referrals will be managed here in the next phase."
      extra={<Button type="primary" onClick={() => navigate("/dashboard/admin")}>Back to Dashboard</Button>}
    />
  );
}

