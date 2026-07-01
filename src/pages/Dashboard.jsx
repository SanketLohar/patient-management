import { useEffect, useState } from "react";
import {
  Typography,
  Table,
  Card,
  Tag,
  Space,
  Button,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
} from "antd";

import {
  EyeOutlined,
  DeleteOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import { generatePatientPDF } from "../services/pdfService";
import {
  getPatients,
  deletePatient,
} from "../services/patientService";
import { logoutDoctor } from "../services/authService";

import PatientDetailsDrawer from "../components/PatientDetailsDrawer";

const { Title, Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const data = await getPatients();
    setPatients(data);
  };

  const handleDelete = async (id) => {
    const result = await deletePatient(id);

    if (result.success) {
      message.success("Patient deleted successfully.");
      loadPatients();
    } else {
      message.error("Failed to delete patient.");
    }
  };

  const handleLogout = async () => {
    await logoutDoctor();
    message.success("Logged out successfully");
    navigate("/login");
  };

  const totalPatients = patients.length;

  const today = new Date().toDateString();

  const todaysPatients = patients.filter((patient) => {
    if (!patient.createdAt) return false;

    return patient.createdAt.toDate().toDateString() === today;
  }).length;

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Symptoms",
      dataIndex: "symptoms",
      key: "symptoms",
      render: (text) => (
        <Tag color="red">
          {text || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedPatient(record);
              setDrawerOpen(true);
            }}
          >
            View
          </Button>

          <Button
            icon={<FilePdfOutlined />}
            onClick={() => generatePatientPDF(record)}
          >
            PDF
          </Button>

          <Popconfirm
            title="Delete Patient"
            description="Are you sure you want to delete this patient?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: 30,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <Card>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <Title level={2} style={{ margin: 0 }}>
              CarePlus Clinic
            </Title>

            <Text type="secondary">
              Doctor Dashboard - Patient Management System
            </Text>
          </div>

          <Button
            danger
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        {/* Dashboard Summary */}
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col xs={24} md={12}>
            <Card>
              <Statistic
                title="Total Patients"
                value={totalPatients}
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card>
              <Statistic
                title="Today's Patients"
                value={todaysPatients}
              />
            </Card>
          </Col>
        </Row>

        {/* Patient Table */}
        <Table
          columns={columns}
          dataSource={patients}
          rowKey="id"
          pagination={{
            pageSize: 5,
          }}
        />

        {/* Patient Details Drawer */}
        <PatientDetailsDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          patient={selectedPatient}
        />
      </Card>
    </div>
  );
}