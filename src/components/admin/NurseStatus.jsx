import { Card, Table, Tag, Typography, Badge, Empty } from "antd";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const { Title } = Typography;

export default function NurseStatus() {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, "nurseProfiles");

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((n) => n.isDeleted !== true);
      setNurses(list);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to nurses:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "On Duty":
        return <Badge status="success" text="On Duty" />;
      case "Off Duty":
        return <Badge status="default" text="Off Duty" />;
      case "With Patient":
        return <Badge status="processing" text="With Patient" />;
      case "Break":
        return <Badge status="warning" text="Break" />;
      case "Emergency Response":
        return <Badge status="error" text="Emergency" />;
      default:
        return <Badge status="success" text={status || "On Duty"} />;
    }
  };

  const columns = [
    {
      title: "Nurse Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span style={{ fontWeight: "700", color: "#1e293b" }}>{text}</span>,
    },
    {
      title: "Assigned Ward / Unit",
      dataIndex: "department",
      key: "department",
      render: (text) => <Tag color="cyan">{text || "General Ward"}</Tag>,
    },
    {
      title: "Shift",
      dataIndex: "workingShift",
      key: "workingShift",
      render: (text) => <Tag color="blue">{text || "Morning"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "availability",
      key: "availability",
      render: (text) => getStatusBadge(text || "On Duty"),
    },
  ];

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.015)",
        border: "1px solid #e2e8f0",
        height: "100%",
      }}
    >
      <Title level={5} style={{ margin: "0 0 20px 0", color: "#0f172a", fontWeight: "700" }}>
        Nurse Duty Roster
      </Title>

      <Table
        columns={columns}
        dataSource={nurses}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No nursing staff registered"
              style={{ padding: "20px 0" }}
            />
          ),
        }}
        size="middle"
        style={{ overflowX: "auto" }}
      />
    </Card>
  );
}

