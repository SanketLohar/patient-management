import { useState, useEffect } from "react";
import { Card, Typography, Button, Space, Modal, Form, Input, Row, Col, message, Spin, Statistic } from "antd";
import { AppstoreAddOutlined, PlusOutlined, TeamOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const { Title, Text } = Typography;

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "departments"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDepartments(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching departments: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddDepartment = async (values) => {
    setSaving(true);
    try {
      await addDoc(collection(db, "departments"), {
        name: values.name,
        roomNumber: values.roomNumber,
        doctorsCount: 0,
        createdAt: serverTimestamp(),
      });
      message.success("Department added successfully!");
      setModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Failed to add department.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Departments
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>Manage hospital wings and specialties</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => setModalOpen(true)}
          style={{ borderRadius: 8, background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)", fontWeight: 600, border: "none" }}
        >
          Add Department
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {departments.map((dept) => (
            <Col xs={24} sm={12} md={8} lg={6} key={dept.id}>
              <Card 
                hoverable
                styles={{ body: { padding: "20px 24px" } }}
                style={{ 
                  borderRadius: 16, 
                  border: "1px solid rgba(226, 232, 240, 0.8)", 
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(14, 165, 233, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AppstoreAddOutlined style={{ color: "#0ea5e9", fontSize: 20 }} />
                  </div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <Text strong style={{ fontSize: 16, display: "block", color: "#1e293b", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                      {dept.name}
                    </Text>
                  </div>
                </div>

                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                  <Space style={{ color: "#64748b", fontSize: 13 }}>
                    <EnvironmentOutlined /> Room {dept.roomNumber || "N/A"}
                  </Space>
                  <Space style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>
                    <TeamOutlined /> {dept.doctorsCount || 0}
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
          {departments.length === 0 && (
            <Col span={24}>
              <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16, border: "1px dashed #cbd5e1" }}>
                <AppstoreAddOutlined style={{ fontSize: 40, color: "#94a3b8", marginBottom: 16 }} />
                <br />
                <Text type="secondary" style={{ fontSize: 15 }}>No departments found. Add one to get started.</Text>
              </div>
            </Col>
          )}
        </Row>
      )}

      <Modal
        title={
          <div style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
            Add New Department
          </div>
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={saving}
        okText="Create Department"
        okButtonProps={{ style: { borderRadius: 8, background: "#0284c7" } }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        centered
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleAddDepartment} style={{ marginTop: 24 }}>
          <Form.Item 
            name="name" 
            label={<span style={{ fontWeight: 600, color: "#475569" }}>Department Name</span>}
            rules={[{ required: true, message: "Please enter department name" }]}
          >
            <Input placeholder="e.g. Cardiology, Pediatrics" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>
          
          <Form.Item 
            name="roomNumber" 
            label={<span style={{ fontWeight: 600, color: "#475569" }}>Location / Room Block</span>}
            rules={[{ required: true, message: "Please enter location" }]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="e.g. Wing A, Room 101" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
