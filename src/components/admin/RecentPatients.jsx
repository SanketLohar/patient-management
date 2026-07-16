import { Card, Table, Tag, Typography, Button, Empty } from "antd";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function RecentPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "patients"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(list);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to recent patients:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const columns = [
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val) => {
        if (!val) return "-";
        const date = val.toDate ? val.toDate() : new Date(val);
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
      },
    },
    {
      title: "Patient Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span style={{ fontWeight: "700", color: "#1e293b" }}>{text}</span>,
    },
    {
      title: "Gender / Age",
      key: "genderAge",
      render: (_, record) => (
        <span>
          {record.gender || "-"} {record.age ? `(${record.age} yrs)` : ""}
        </span>
      ),
    },
    {
      title: "Contact Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Assigned Doctor",
      dataIndex: "doctor",
      key: "doctor",
      render: (text) => text ? <Tag color="blue">{text}</Tag> : <Tag color="default">Pending Roster</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/dashboard/admin/casepapers`)}
          style={{ color: "#0d6efd" }}
        >
          View Case
        </Button>
      ),
    },
  ];

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.015)",
        border: "1px solid #e2e8f0",
        marginTop: "16px",
      }}
    >
      <Title level={5} style={{ margin: "0 0 20px 0", color: "#0f172a", fontWeight: "700" }}>
        Recent Patient Registrations
      </Title>

      <Table
        columns={columns}
        dataSource={patients}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No registrations submitted yet"
              style={{ padding: "20px 0" }}
            />
          ),
        }}
        style={{ overflowX: "auto" }}
      />
    </Card>
  );
}

