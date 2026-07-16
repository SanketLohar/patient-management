import { useState, useEffect } from "react";
import { Tabs, Table, Tag, Typography, Button, Space, Input, Card } from "antd";
import { SearchOutlined, CalendarOutlined, SyncOutlined } from "@ant-design/icons";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const { Title, Text } = Typography;

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching appointments: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Waiting": return "orange";
      case "Assigned": return "cyan";
      case "In Progress": return "blue";
      case "Completed": return "green";
      default: return "default";
    }
  };

  const columns = [
    {
      title: "Token",
      dataIndex: "token",
      key: "token",
      width: 100,
      render: (text) => <Text strong style={{ color: "#4f46e5" }}>#{text}</Text>,
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
      render: (text) => <Text strong>{text || "N/A"}</Text>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 80,
    },
    {
      title: "Assigned Doctor",
      key: "assignedDoctor",
      render: (_, record) => {
        const docName = record.assignedDoctorName || record.assignedDoc;
        return docName ? `Dr. ${docName}` : <Text type="secondary">Unassigned</Text>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        if (status === "Assigned" || status === "In Progress") {
          return (
            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "6px", fontSize: 13, fontWeight: 600, color: "#2e4a1e", background: "#f7fee7", border: "1px solid #d9f99d" }}>
              {status.toUpperCase()}
            </span>
          );
        }
        return (
          <Tag color={getStatusColor(status)} style={{ borderRadius: 6, fontWeight: 600 }}>
            {status ? status.toUpperCase() : "UNKNOWN"}
          </Tag>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => {
        if (!createdAt) return "N/A";
        const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
        return date.toLocaleString("en-IN", {
          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
        });
      },
    },
  ];

  const followUpColumns = [
    ...columns.filter(c => c.key !== "status"),
    {
      title: "Follow-Up Date",
      dataIndex: "followUpDate",
      key: "followUpDate",
      render: (date) => <Tag color="purple" style={{ borderRadius: 6, fontWeight: 700 }}>{date}</Tag>
    }
  ];

  // Filters
  const filteredAppointments = appointments.filter(appt => 
    (appt.patientName || "").toLowerCase().includes(searchText.toLowerCase()) ||
    (appt.token || "").toString().includes(searchText)
  );

  const waitingQueue = filteredAppointments.filter(a => a.status === "Waiting");
  const inConsultation = filteredAppointments.filter(a => a.status === "Assigned" || a.status === "In Progress");
  
  const todayStr = new Date().toISOString().split('T')[0];
  const followUpPipeline = filteredAppointments.filter(a => a.followUpDate && a.followUpDate >= todayStr);
  
  const completedQueue = filteredAppointments.filter(a => a.status === "Completed");

  const tabItems = [
    {
      key: "1",
      label: <span style={{ fontWeight: 600 }}>Waiting Queue ({waitingQueue.length})</span>,
      children: <Table dataSource={waitingQueue} columns={columns} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} />
    },
    {
      key: "2",
      label: <span style={{ fontWeight: 600 }}>In Consultation ({inConsultation.length})</span>,
      children: <Table dataSource={inConsultation} columns={columns} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} />
    },
    {
      key: "3",
      label: <span style={{ fontWeight: 600 }}>Follow-Up Pipeline ({followUpPipeline.length})</span>,
      children: <Table dataSource={followUpPipeline} columns={followUpColumns} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} />
    },
    {
      key: "4",
      label: <span style={{ fontWeight: 600 }}>Completed ({completedQueue.length})</span>,
      children: <Table dataSource={completedQueue} columns={columns} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} />
    }
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Appointments Tracker
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>Real-time monitoring of all patient interactions</Text>
        </div>
        <Space>
          <Input 
            prefix={<SearchOutlined style={{ color: "#94a3b8" }} />} 
            placeholder="Search by name or token..." 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250, borderRadius: 8, height: 40 }}
          />
          <Button icon={<SyncOutlined />} onClick={() => {}} style={{ height: 40, borderRadius: 8 }}>
            Refresh
          </Button>
        </Space>
      </div>

      <Card 
        styles={{ body: { padding: 0 } }} 
        style={{ borderRadius: 16, border: "none", boxShadow: "0 10px 40px rgba(15, 23, 42, 0.04)" }}
      >
        <Tabs 
          defaultActiveKey="1" 
          items={tabItems} 
          style={{ padding: "16px 24px" }}
          tabBarStyle={{ marginBottom: 16 }}
        />
      </Card>
    </div>
  );
}
