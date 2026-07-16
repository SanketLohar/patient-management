import { Card, Table, Tag, Typography, Badge, Empty } from "antd";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const { Title } = Typography;

export default function DoctorStatus() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = collection(db, "doctorProfiles");

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(list);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to doctors:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return <Badge status="success" text="Available" />;
      case "In Consultation":
        return <Badge status="processing" text="In Consultation" />;
      case "On Leave":
        return <Badge status="warning" text="On Leave" />;
      case "Off Duty":
        return <Badge status="default" text="Off-Duty" />;
      case "Emergency Call":
        return <Badge status="error" text="Emergency Call" />;
      default:
        return <Badge status="default" text={status || "Off-Duty"} />;
    }
  };

  const getSpecialtyColor = (spec) => {
    const mapping = {
      Cardiology: "red",
      Neurology: "purple",
      Orthopedics: "green",
      Psychology: "orange",
      Radiology: "cyan",
      "General Medicine": "blue",
    };
    return mapping[spec] || "blue";
  };

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <span style={{ fontWeight: "700", color: "#1e293b" }}>{text}</span>,
    },
    {
      title: "Specialty",
      dataIndex: "specialization",
      key: "specialization",
      render: (text) => <Tag color={getSpecialtyColor(text)}>{text || "General Medicine"}</Tag>,
    },
    {
      title: "Duty Status",
      dataIndex: "availability",
      key: "availability",
      render: (text) => getStatusBadge(text || "Available"),
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
        Doctor Duty Status
      </Title>

      <Table
        columns={columns}
        dataSource={doctors}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No consultant profiles registered"
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

