import { Card, Typography, Form, Button, Input, message, Divider } from "antd";
import { useState } from "react";
import { AlertOutlined, UserOutlined } from "@ant-design/icons";
import PersonalInfo from "../../components/form/PersonalInfo";
import MedicalInfo from "../../components/form/MedicalInfo";
import EmergencyContact from "../../components/form/EmergencyContact";
import Grainient from "../../components/animations/Grainient";
import logoImg from "../../assets/hospital_logo_1.png";
import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function PatientForm() {
  const [form] = Form.useForm();
  const [gender, setGender] = useState(null);

  const onFinish = async (values) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(values).filter(([, v]) => v !== undefined && v !== null)
      );

      // Convert Dayjs dateOfBirth to string before saving
      if (cleanedData.dateOfBirth && cleanedData.dateOfBirth.format) {
        cleanedData.dateOfBirth = cleanedData.dateOfBirth.format("DD/MM/YYYY");
      }

      // 1. Write master patient profile
      const patientRef = await addDoc(collection(db, "patients"), {
        ...cleanedData,
        name: cleanedData.fullName,
        reasonForVisit: cleanedData.reasonForVisit || cleanedData.symptoms || "",
        // Clinical fields initialized blank — filled by Doctor/Nurse later
        historyOfPresentIllness: cleanedData.historyOfPresentIllness || "",
        pastHistory: cleanedData.pastHistory || "",
        menstrualHistory: cleanedData.menstrualHistory || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 2. Create a corresponding appointment in the triage pipeline
      const token = `T-${String(Math.floor(Math.random() * 900) + 100)}`;
      await addDoc(collection(db, "appointments"), {
        patientId: patientRef.id,
        patientName: cleanedData.fullName,
        age: cleanedData.age || 0,
        gender: cleanedData.gender || "Unknown",
        phone: cleanedData.phone || "",
        complaint: cleanedData.reasonForVisit,
        reasonForVisit: cleanedData.reasonForVisit,
        status: "Waiting",
        assignedDoc: null,
        assignedDoctorId: null,
        token,
        type: "Consultation",
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        createdAt: serverTimestamp(),
      });

      message.success("Registration complete! Your token is " + token);
      form.resetFields();
    } catch (err) {
      console.error("Registration failed:", err);
      message.error("Failed to register. Please try again.");
    }
  };

  return (
    <div
      className="patient-form-wrapper"
      style={{
        minHeight: "100vh",
        position: "relative",
        padding: "120px 20px 48px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
        <Grainient
          color1="#ffffff"
          color2="#f7fee7"
          color3="#e8f5e9"
          timeSpeed={0.03}
          colorBalance={0.7}
          warpStrength={0.5}
          warpFrequency={1.5}
          warpSpeed={0.2}
          warpAmplitude={30}
          blendAngle={0}
          blendSoftness={1}
          rotationAmount={100}
          noiseScale={2}
          grainAmount={0.04}
          grainScale={1.5}
          grainAnimated={true}
          contrast={1.1}
          gamma={1.2}
          saturation={0.8}
        />
      </div>

      <Card
        className="glassmorphic-intake-card"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 860,
          margin: "0 auto",
          borderRadius: 24,
          boxShadow: "0 20px 40px rgba(46, 74, 30, 0.06)",
        }}
        styles={{ body: { padding: "40px 48px" } }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <img src={logoImg} alt="Moolatvam Ayurved" style={{ width: "90px", height: "90px", marginBottom: "16px", objectFit: "contain" }} />
          <Title level={2} style={{ margin: 0, color: "#0f172a", fontWeight: 700, letterSpacing: "-0.01em", fontFamily: "'Georgia', serif" }}>
            Moolatvam Ayurved
          </Title>
          <Text style={{ color: "#64748b", fontSize: 15, fontWeight: 500 }}>
            Patient Registration &amp; Triage Intake Form
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">

          {/* Chief Complaint — rendered first for clinical priority */}
          <div
            style={{
              background: "#fdfaf2",
              border: "1px solid rgba(234, 179, 8, 0.2)",
              borderLeft: "4px solid #eab308",
              borderRadius: 8,
              padding: "20px 24px",
              marginBottom: 28,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <AlertOutlined style={{ color: "#eab308", fontSize: 18 }} />
              <span style={{ fontWeight: 800, fontSize: 15, color: "#1e293b", fontFamily: "'Georgia', serif" }}>
                Chief Complaints &amp; Reason for Visit
              </span>
              <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>* Required</span>
            </div>
            <Form.Item
              name="reasonForVisit"
              style={{ margin: 0 }}
              rules={[
                { required: true, message: "Please describe your symptoms or reason for visit" },
                { min: 10, message: "Please provide at least 10 characters" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="e.g. I have had chest pain and shortness of breath for the past 2 days. Pain worsens on exertion..."
                style={{ borderRadius: 10, fontSize: 14, resize: "none" }}
                maxLength={500}
                showCount
              />
            </Form.Item>
          </div>

          <Divider style={{ borderColor: "rgba(46,74,30,0.15)", margin: "0 0 24px" }}>
            <Text style={{ color: "#1e293b", fontSize: 16, fontWeight: 700, fontFamily: "'Georgia', serif" }}>
              Personal Information
            </Text>
          </Divider>
          <PersonalInfo onGenderChange={setGender} />

          <Divider style={{ borderColor: "rgba(46,74,30,0.15)", margin: "8px 0 24px" }}>
            <Text style={{ color: "#1e293b", fontSize: 16, fontWeight: 700, fontFamily: "'Georgia', serif" }}>
              Medical Information
            </Text>
          </Divider>
          <MedicalInfo gender={gender} />

          <Divider style={{ borderColor: "rgba(46,74,30,0.15)", margin: "8px 0 24px" }}>
            <Text style={{ color: "#1e293b", fontSize: 16, fontWeight: 700, fontFamily: "'Georgia', serif" }}>
              Emergency Contact
            </Text>
          </Divider>
          <EmergencyContact />

          <Form.Item style={{ textAlign: "center", marginTop: 36, marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<UserOutlined />}
              style={{
                height: 52, paddingInline: 48, borderRadius: 14,
                fontWeight: 600, fontSize: 16, fontFamily: "'Georgia', serif",
                background: "#2e4a1e",
                color: "#ffffff",
                border: "none",
                boxShadow: "0 4px 14px rgba(46, 74, 30, 0.2)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1e3a1a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#2e4a1e"; }}
            >
              Submit Registration
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
