import { useState, useEffect } from "react";
import {
  Modal, Tabs, Form, Input, DatePicker, Select, Button,
  Space, Card, Typography, List, Row, Col, Tag, Skeleton, message, Divider,
} from "antd";
import {
  HistoryOutlined, EditOutlined, MedicineBoxOutlined,
  UserOutlined, HeartOutlined, AlertOutlined, FileTextOutlined,
} from "@ant-design/icons";
import { writeBatch, doc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import usePatientClinicalData from "../../hooks/usePatientClinicalData";
import dayjs from "dayjs";

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ConsultationModal({ open, patient, doctorProfile, onCancel, onSaveSuccess }) {
  const [activeTab, setActiveTab] = useState("history");
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const doctorName = doctorProfile?.fullName || "Dr. Sandeep Lohar";
  const doctorUid  = doctorProfile?.uid || "default-doc-uid";

  const clinicalData = usePatientClinicalData(patient?.patientId, patient?.patientName);

  useEffect(() => {
    if (open && patient) {
      setActiveTab("history");
      form.resetFields();
      form.setFieldsValue({
        diagnosis:        patient.diagnosis || "",
        clinicalNotes:    patient.complaint || "",
        treatmentPlan:    "",
        medications:      patient.medications || "",
        recommendedTests: patient.labTests || [],
        followUpDate:     patient.followUpDate ? dayjs(patient.followUpDate) : null,
      });
    }
  }, [open, patient, form]);

  const handleSave = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (err) {
      console.error("VALIDATION ERROR:", JSON.stringify(err));
      return;
    }

    setSaving(true);
    try {
      const isMock = patient.id.startsWith("appt-demo");
      const followUpDateStr = values.followUpDate ? values.followUpDate.format("YYYY-MM-DD") : "";

      const casePaperPayload = {
        patientId:        patient.patientId || patient.id,
        appointmentId:    patient.id,
        patientName:      patient.patientName,
        age:              patient.age || 0,
        complaint:        patient.complaint || "",
        diagnosis:        values.diagnosis,
        clinicalNotes:    values.clinicalNotes || "",
        treatmentPlan:    values.treatmentPlan || "",
        medications:      values.medications || "",
        recommendedTests: values.recommendedTests || [],
        followUpDate:     followUpDateStr,
        doctorName,
        doctorId:         doctorUid,
        createdAt:        serverTimestamp(),
      };

      const reportPayload = {
        ...casePaperPayload,
        labTests:    values.recommendedTests || [],
        completedAt: serverTimestamp(),
      };

      if (!isMock) {
        const batch = writeBatch(db);

        // 1. casePapers collection
        batch.set(doc(collection(db, "casePapers")), casePaperPayload);

        // 2. completedReports — permanent finalized record
        batch.set(doc(collection(db, "completedReports")), reportPayload);

        // 3. Mark appointment Completed
        batch.update(doc(db, "appointments", patient.id), {
          status:      "Completed",
          followUpDate: followUpDateStr,
          diagnosis:   values.diagnosis,
          medications: values.medications,
          updatedAt:   serverTimestamp(),
        });

        // 4. Follow-up notification
        if (followUpDateStr) {
          batch.set(doc(collection(db, "notifications")), {
            title:       "Follow-up Scheduled",
            message:     `${doctorName} scheduled follow-up for ${patient.patientName} on ${followUpDateStr}`,
            patientName: patient.patientName,
            doctorName,
            followUpDate: followUpDateStr,
            read:         false,
            createdAt:    serverTimestamp(),
          });
        }

        await batch.commit();
      }

      message.success(`Consultation finalized for ${patient.patientName}!`);
      if (onSaveSuccess) onSaveSuccess(patient.id, { ...casePaperPayload, status: "Completed" });
    } catch (err) {
      console.error("Failed to finalize consultation:", err);
      message.error("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const vitalsSection = (
    <Card size="small"
      title={<Space><HeartOutlined style={{ color: "#ef4444" }} /><span style={{ fontWeight: 800 }}>Triaged Vitals (Nurse Intake)</span></Space>}
      style={{ borderRadius: 16, border: "1px solid rgba(241,245,249,0.9)", marginBottom: 16 }}
      styles={{ body: { padding: 16 } }}
    >
      <Row gutter={[12, 12]}>
        {[
          { label: "BLOOD PRESSURE", val: clinicalData.vitals?.bp },
          { label: "HEART RATE",     val: clinicalData.vitals?.heartRate },
          { label: "TEMPERATURE",    val: clinicalData.vitals?.temperature },
          { label: "SPO2 LEVEL",     val: clinicalData.vitals?.spo2, color: "#10b981" },
          { label: "RESP. RATE",     val: clinicalData.vitals?.respiratoryRate },
        ].map((v) => (
          <Col span={8} key={v.label}>
            <Text type="secondary" style={{ fontSize: 11, display: "block" }}>{v.label}</Text>
            <span style={{ fontWeight: 700, color: v.color || "#1e293b" }}>{v.val || "—"}</span>
          </Col>
        ))}
      </Row>
    </Card>
  );

  const chiefComplaintSection = clinicalData.profile?.reasonForVisit || patient?.complaint ? (
    <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderLeft: "4px solid #f59e0b", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <AlertOutlined style={{ color: "#f59e0b" }} />
        <span style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>Chief Complaints &amp; Current Condition</span>
      </div>
      <Text style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6 }}>
        {clinicalData.profile?.reasonForVisit || patient?.complaint || "Not specified"}
      </Text>
    </div>
  ) : null;

  const items = [
    {
      key: "history",
      label: <span><HistoryOutlined /> Patient Dossier</span>,
      children: (
        <div style={{ maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
          {clinicalData.loading ? <Skeleton active paragraph={{ rows: 6 }} /> : (
            <div>
              {chiefComplaintSection}
              <Card size="small"
                title={<Space><UserOutlined style={{ color: "#7c3aed" }} /><span style={{ fontWeight: 800 }}>Demographics &amp; Clinical Summary</span></Space>}
                style={{ borderRadius: 16, border: "1px solid rgba(241,245,249,0.9)", marginBottom: 16 }}
                styles={{ body: { padding: 16 } }}
              >
                <Row gutter={[12, 12]}>
                  <Col span={8}><Text type="secondary" style={{ fontSize: 11, display: "block" }}>GENDER &amp; AGE</Text><span style={{ fontWeight: 700 }}>{clinicalData.profile?.gender || "Male"} · {clinicalData.profile?.age || patient?.age} yrs</span></Col>
                  <Col span={8}><Text type="secondary" style={{ fontSize: 11, display: "block" }}>BLOOD GROUP</Text><span style={{ fontWeight: 700 }}>{clinicalData.profile?.bloodGroup || "B+"}</span></Col>
                  <Col span={8}><Text type="secondary" style={{ fontSize: 11, display: "block" }}>ALLERGIES</Text><Tag color="red" style={{ fontWeight: 700, borderRadius: 4 }}>{clinicalData.profile?.allergies || "None"}</Tag></Col>
                  <Col span={24}><Text type="secondary" style={{ fontSize: 11, display: "block" }}>KNOWN CONDITIONS</Text><span style={{ fontWeight: 600 }}>{clinicalData.profile?.medicalHistory || "None"}</span></Col>
                </Row>
              </Card>
              {vitalsSection}
              <div style={{ fontWeight: 800, fontSize: 14, color: "#1e293b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <HistoryOutlined style={{ color: "#7c3aed" }} />
                <span>Historical case papers ({clinicalData.history.length})</span>
              </div>
              {clinicalData.history.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#94a3b8", fontSize: 13 }}>No historical files found.</div>
              ) : (
                <List dataSource={clinicalData.history} renderItem={(item) => (
                  <Card size="small" styles={{ body: { padding: 14 } }} style={{ marginBottom: 10, borderRadius: 14, border: "1px solid rgba(241,245,249,0.9)", backgroundColor: "#f8fafc" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <Text style={{ fontWeight: 800, color: "#4f46e5", fontSize: 13.5 }}>{item.diagnosis}</Text>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString("en-IN") : "Previous Visit"}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "#334155", marginBottom: 4 }}><strong>Notes:</strong> {item.clinicalNotes || "N/A"}</div>
                    <div style={{ fontSize: 12.5, color: "#334155", marginBottom: 4 }}><strong>Meds:</strong> {item.medications || "N/A"}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "right" }}>Dr. {item.doctorName}</div>
                  </Card>
                )} />
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "examination",
      label: <span><EditOutlined /> Examination</span>,
      children: (
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item name="diagnosis" label="Primary Diagnosis" rules={[{ required: true, message: "Please specify a diagnosis" }]}>
            <Input placeholder="e.g. Acute Coronary Syndrome (ACS)" size="large" style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="clinicalNotes" label="Clinical Notes / Findings">
            <TextArea rows={4} placeholder="e.g. Patient presents with sudden chest pain, radiation to left arm." style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="treatmentPlan" label="Treatment Plan / Advice">
            <TextArea rows={3} placeholder="e.g. Immediate cardiac monitoring, bed rest, low sodium diet." style={{ borderRadius: 10 }} />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "prescription",
      label: <span><MedicineBoxOutlined /> Prescription &amp; Follow-up</span>,
      children: (
        <Form form={form} layout="vertical" requiredMark="optional">
          <Form.Item name="medications" label="Prescribed Medications" rules={[{ required: true, message: "Please specify medications" }]}>
            <TextArea rows={5} placeholder={"Tab. Aspirin 75mg — 0-1-0 — 30 Days\nTab. Atorvastatin 20mg — 0-0-1 — 30 Days"} style={{ borderRadius: 10 }} />
          </Form.Item>
          <Form.Item name="recommendedTests" label="Lab / Diagnostic Tests">
            <Select mode="tags" style={{ width: "100%" }} placeholder="Select or enter tests" size="large">
              {["ECG","Troponin-I","CBC","Lipid Profile","Chest X-Ray","2D Echo"].map((t) => <Option key={t} value={t}>{t}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="followUpDate" label="Next Follow-up Date">
            <DatePicker style={{ width: "100%" }} size="large" placeholder="Choose Date" />
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <MedicineBoxOutlined style={{ color: "#7c3aed", fontSize: 20 }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>Clinical Consultation — {patient?.patientName}</span>
        </Space>
      }
      open={open} onCancel={onCancel} width={720} centered forceRender
      mask={{ closable: false }}
      footer={[
        <Button key="cancel" onClick={onCancel} style={{ borderRadius: 10, height: 40, fontWeight: 600 }}>Cancel</Button>,
        <Button key="save" type="primary" onClick={handleSave} loading={saving}
          style={{ borderRadius: 10, height: 40, fontWeight: 700, background: "#7c3aed", borderColor: "#7c3aed", boxShadow: "0 4px 12px rgba(124,58,237,0.2)" }}
        >
          <FileTextOutlined /> Save &amp; Finalize
        </Button>,
      ]}
    >
      <div style={{ marginTop: 12 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
      </div>
    </Modal>
  );
}
