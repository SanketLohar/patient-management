import { useState, useEffect } from "react";
import { Typography, Card, Form, Input, Button, TimePicker, Row, Col, Divider, message, Spin, Space } from "antd";
import { SettingOutlined, SaveOutlined, ReloadOutlined, SafetyOutlined } from "@ant-design/icons";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function AdminSettings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "globalSettings", "config");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        form.setFieldsValue({
          hospitalName: data.hospitalName || "Moolatvam Ayurved",
          operationalStart: data.operationalStart ? dayjs(data.operationalStart, "HH:mm") : dayjs("09:00", "HH:mm"),
          operationalEnd: data.operationalEnd ? dayjs(data.operationalEnd, "HH:mm") : dayjs("17:00", "HH:mm"),
        });
      } else {
        // Initialize default settings if not exists
        form.setFieldsValue({
          hospitalName: "Moolatvam Ayurved",
          operationalStart: dayjs("09:00", "HH:mm"),
          operationalEnd: dayjs("17:00", "HH:mm"),
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
      message.error("Could not load system settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (values) => {
    setSaving(true);
    try {
      const docRef = doc(db, "globalSettings", "config");
      await setDoc(docRef, {
        hospitalName: values.hospitalName,
        operationalStart: values.operationalStart ? values.operationalStart.format("HH:mm") : "09:00",
        operationalEnd: values.operationalEnd ? values.operationalEnd.format("HH:mm") : "17:00",
        updatedAt: new Date().toISOString()
      }, { merge: true });
      message.success("Global settings successfully updated.");
    } catch (error) {
      console.error(error);
      message.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToken = async () => {
    setResetting(true);
    try {
      const counterRef = doc(db, "metadata", "counters");
      const snap = await getDoc(counterRef);
      if (snap.exists()) {
        await updateDoc(counterRef, { currentToken: 0 });
      } else {
        await setDoc(counterRef, { currentToken: 0 });
      }
      message.success("Patient token counter has been explicitly reset to 0.");
    } catch (error) {
      console.error(error);
      message.error("Failed to reset token counter.");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: 100 }}><Spin size="large" /></div>;
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <SettingOutlined style={{ color: "#fff", fontSize: 24 }} />
        </div>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Global System Settings
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>Configure core hospital operational parameters</Text>
        </div>
      </div>

      <Card 
        styles={{ body: { padding: 32 } }} 
        style={{ borderRadius: 16, border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 10px 40px rgba(15, 23, 42, 0.04)" }}
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSaveSettings}
          requiredMark={false}
        >
          <Title level={4} style={{ color: "#1e293b", marginBottom: 24 }}>General Information</Title>
          
          <Form.Item 
            label={<span style={{ fontWeight: 600, color: "#475569" }}>Hospital Display Name</span>}
            name="hospitalName"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input size="large" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Divider style={{ margin: "32px 0" }} />

          <Title level={4} style={{ color: "#1e293b", marginBottom: 24 }}>Operational Hours</Title>
          
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item 
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Opening Time</span>}
                name="operationalStart"
              >
                <TimePicker format="HH:mm" size="large" style={{ width: "100%", borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Closing Time</span>}
                name="operationalEnd"
              >
                <TimePicker format="HH:mm" size="large" style={{ width: "100%", borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ marginTop: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />} 
              loading={saving}
              size="large"
              style={{ borderRadius: 8, background: "#0284c7", fontWeight: 600, paddingInline: 32 }}
            >
              Save Configuration
            </Button>
          </div>
        </Form>
      </Card>

      <Card 
        styles={{ body: { padding: 32 } }} 
        style={{ borderRadius: 16, border: "1px solid rgba(239, 68, 68, 0.2)", background: "rgba(239, 68, 68, 0.02)", marginTop: 24 }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <SafetyOutlined style={{ fontSize: 24, color: "#ef4444", marginTop: 4 }} />
          <div style={{ flex: 1 }}>
            <Title level={5} style={{ color: "#ef4444", margin: "0 0 8px 0" }}>Danger Zone: Reset Token Sequence</Title>
            <Text style={{ color: "#64748b", display: "block", marginBottom: 16 }}>
              Manually resetting the token counter will revert the sequence generator back to 0. All new patients registered today will start from Token #1. Use this strictly during start-of-day operations or emergency system resets to prevent token collisions.
            </Text>
            <Button 
              danger 
              icon={<ReloadOutlined />} 
              onClick={handleResetToken}
              loading={resetting}
              style={{ borderRadius: 8, fontWeight: 600 }}
            >
              Reset Token Counter
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
