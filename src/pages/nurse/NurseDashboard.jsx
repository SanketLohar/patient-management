import { useState, useEffect } from "react";
import {
  Typography, Card, Row, Col, Table, Tag, Badge,
  Button, Avatar, Space, Modal, Select, message,
  Segmented, Form, InputNumber, Empty,
} from "antd";
import {
  UserOutlined, MedicineBoxOutlined, TeamOutlined,
  ClockCircleOutlined, CheckCircleOutlined, CompassOutlined,
  HeartOutlined, EyeOutlined, FileTextOutlined
} from "@ant-design/icons";
import { useFirestoreCollection, useFirestoreCrud } from "../../hooks/useFirestore";
import { db } from "../../firebase/firebase";
import { doc, updateDoc, serverTimestamp, query, collection, where, getDocs, addDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import TreatmentReportModal from "../../components/common/TreatmentReportModal";
import CasePaperPreviewModal from "../../components/common/CasePaperPreviewModal";

const { Text } = Typography;
const { Option } = Select;

const glassCard = {
  backgroundColor: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.5)",
  borderRadius: "24px",
  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
};

const INITIAL_DOCTORS = [
  { id: "d1", name: "Dr. Amit Sharma",  dept: "Cardiology",      status: "Available" },
  { id: "d2", name: "Dr. Priya Rao",    dept: "General Medicine", status: "Busy"      },
  { id: "d3", name: "Dr. Suresh Mehta", dept: "Orthopedics",      status: "On Break"  },
  { id: "d4", name: "Dr. Kavita Joshi", dept: "Neurology",        status: "Available" },
  { id: "d5", name: "Dr. Rajan Verma",  dept: "Radiology",        status: "Busy"      },
];



const DOC_STATUS_COLORS = { Available: "#10b981", Busy: "#ef4444", "On Break": "#f59e0b" };
const QUEUE_STATUS_TAG  = { Waiting: "orange", Assigned: "blue", Completed: "green", "In Progress": "processing" };

const AVAILABILITY_OPTIONS = [
  { label: "🟢 On Duty",  value: "On Duty"  },
  { label: "🔴 Off Duty", value: "Off Duty" },
  { label: "🟡 On Break", value: "On Break" },
];

export default function NurseDashboard() {
  const [doctors, setDoctors]               = useState(INITIAL_DOCTORS);
  const [queue, setQueue]                   = useState([]);
  const { user } = useAuth();
  const [myAvailability, setMyAvailability] = useState("On Duty");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPatient, setPreviewPatient] = useState(null);

  const handleAvailabilityChange = async (newVal) => {
    setMyAvailability(newVal);
    if (!user) return;
    try {
      const updateData = { availability: newVal };
      if (newVal === "On Duty") {
        updateData.lastCheckIn = serverTimestamp();
      } else {
        updateData.lastCheckOut = serverTimestamp();
      }
      
      // Update nurse profile in users collection (or nurseProfiles if exists, here using users)
      await updateDoc(doc(db, "users", user.uid), updateData);
      
      const notifType = newVal === "On Duty" ? "checkIn" : "system";
      const nurseName = user.email ? user.email.split("@")[0] : "Nurse";
      const title = newVal === "On Duty" ? `Nurse ${nurseName} checked in` : `Nurse ${nurseName} checked out`;
      
      await addDoc(collection(db, "notifications"), {
        title,
        type: notifType,
        createdAt: serverTimestamp(),
        read: false
      });
      
      message.success(`Status updated to ${newVal}`);
    } catch (err) {
      console.error(err);
      message.error("Failed to update status");
    }
  };

  const { data: fbDoctors }                         = useFirestoreCollection("doctorProfiles");
  const { data: fbAppts, loading: apptsLoading }    = useFirestoreCollection("appointments");
  const { addDocument, updateDocument }             = useFirestoreCrud("appointments");
  const { updateDocument: updateDoctorStatus }      = useFirestoreCrud("doctorProfiles");

  // Assign modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assigningPatient, setAssigningPatient] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [assigning, setAssigning]               = useState(false);

  // Vitals modal
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [vitalsPatient, setVitalsPatient]     = useState(null);
  const [savingVitals, setSavingVitals]       = useState(false);
  const [vitalsForm]                          = Form.useForm();

  useEffect(() => {
    if (fbDoctors && fbDoctors.length > 0) {
      setDoctors(
        fbDoctors.filter((d) => !d.isDeleted).map((d) => ({
          id: d.uid || d.id,
          name: d.fullName,
          dept: d.department || "General",
          status: d.availability || "Available",
        }))
      );
    } else {
      setDoctors(INITIAL_DOCTORS);
    }
  }, [fbDoctors]);

  useEffect(() => {
    if (fbAppts) {
      setQueue(fbAppts);
    }
  }, [fbAppts]);

  const waitingCount   = queue.filter((p) => p.status === "Waiting").length;
  const assignedCount  = queue.filter((p) => p.status === "Assigned" || p.status === "In Progress").length;
  const completedCount = queue.filter((p) => p.status === "Completed").length;
  const availDoctors   = doctors.filter((d) => d.status === "Available");

  // ── Assign logic ─────────────────────────────────────────────────────────────
  const openAssign = (record) => {
    if (availDoctors.length === 0) { message.warning("No doctors available."); return; }
    setAssigningPatient(record);
    setSelectedDoctorId(null);
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedDoctorId) { message.error("Please select a doctor."); return; }
    setAssigning(true);
    const doctor = doctors.find((d) => d.id === selectedDoctorId);

    const res = await updateDocument(assigningPatient.id, {
      status: "Assigned", 
      assignedDoctorId: doctor.id, 
      assignedDoctorName: doctor.name, 
      assignedAt: serverTimestamp()
    });

    if (!doctor.id.startsWith("d")) {
      await updateDoctorStatus(doctor.id, { availability: "Busy" });
    }

    if (res.success) {
      message.success(`${assigningPatient.patientName} assigned to ${doctor.name}`);
    } else {
      message.error("Failed to assign.");
    }
    
    setAssigning(false);
    setAssignModalOpen(false);
  };

  // ── Vitals logic ─────────────────────────────────────────────────────────────
  const openVitals = (record) => {
    setVitalsPatient(record);
    vitalsForm.resetFields();
    setVitalsModalOpen(true);
  };

  const handleSaveVitals = async () => {
    try {
      const vals = await vitalsForm.validateFields();
      setSavingVitals(true);
      const isMock = vitalsPatient.id.startsWith("appt-demo");

      const vitalsPayload = {
        triagedVitals: {
          bp:              `${vals.bp} mmHg`,
          heartRate:       `${vals.heartRate} bpm`,
          temperature:     `${vals.temperature} °F`,
          spo2:            `${vals.spo2}%`,
          respiratoryRate: `${vals.respiratoryRate} bpm`,
        },
        triagedAt: serverTimestamp(),
      };

      if (!isMock) {
        await updateDoc(doc(db, "appointments", vitalsPatient.id), vitalsPayload);
        message.success(`Vitals recorded for ${vitalsPatient.patientName}`);
      } else {
        setQueue((prev) => prev.map((p) => p.id === vitalsPatient.id ? { ...p, ...vitalsPayload } : p));
        message.success(`[Demo] Vitals saved for ${vitalsPatient.patientName}`);
      }

      setVitalsModalOpen(false);
    } catch (err) {
      if (err?.errorFields) return; // validation only
      console.error("Vitals save failed:", err);
      message.error("Failed to save vitals.");
    } finally {
      setSavingVitals(false);
    }
  };

  // ── Report Summary ────────────────────────────────────────────────────────────
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport]   = useState(null);

  const openReportSummary = async (record) => {
    try {
      // First try to match explicitly by appointmentId (new schema)
      let q = query(collection(db, "completedReports"), where("appointmentId", "==", record.id));
      let snap = await getDocs(q);
      
      if (snap.empty) {
        // Fallback for older reports where patientId was incorrectly set to the appointment ID
        q = query(collection(db, "completedReports"), where("patientId", "==", record.id));
        snap = await getDocs(q);
      }

      if (!snap.empty) {
        setSelectedReport(snap.docs[0].data());
        setReportModalOpen(true);
      } else {
        message.warning("Summary report not yet available for this patient.");
      }
    } catch (err) {
      console.error("Failed to load report", err);
      message.error("Failed to load summary.");
    }
  };

  // ── Queue columns ─────────────────────────────────────────────────────────────
  const queueColumns = [
    {
      title: "Token", dataIndex: "token", key: "token", width: 90,
      render: (t) => (
        <Tag color="blue" style={{ fontWeight: 800, fontSize: 13, padding: "4px 10px", borderRadius: 8 }}>{t}</Tag>
      ),
    },
    {
      title: "Patient Info", dataIndex: "patientName", key: "patientName",
      render: (name, row) => (
        <Space size="middle">
          <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#6366f1" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{name}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Age {row.age} · {row.complaint}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Status", dataIndex: "status", key: "status", width: 120,
      render: (s) => (
        <Tag color={QUEUE_STATUS_TAG[s]} style={{ fontWeight: 700, fontSize: 12, padding: "3px 10px", borderRadius: 6 }}>{s}</Tag>
      ),
    },
    {
      title: "Assigned Doctor", key: "assignedDoctor",
      render: (_, record) => {
        const docName = record.assignedDoctorName || record.assignedDoc;
        if ((record.status === "Assigned" || record.status === "In Progress" || record.status === "Completed") && docName) {
           return <Text style={{ fontSize: 13.5, color: "#4f46e5", fontWeight: 600 }}>{docName}</Text>;
        }
        return <Text style={{ fontSize: 13, color: "#94a3b8" }}>Not Assigned</Text>;
      }
    },
    {
      title: "Actions", key: "action", width: 280,
      render: (_, record) => record.status === "Waiting" ? (
        <Space size={8}>
          <Button
            type="primary" size="small" icon={<TeamOutlined />}
            onClick={() => openAssign(record)}
            style={{ borderRadius: 8, fontWeight: 700, background: "#10b981", borderColor: "#10b981", fontSize: 12 }}
          >Assign</Button>
          <Button
            size="small" icon={<HeartOutlined />}
            onClick={() => openVitals(record)}
            style={{ borderRadius: 8, fontWeight: 700, background: "#2e4a1e", color: "#ffffff", borderColor: "#2e4a1e", boxShadow: "0 0 10px rgba(234, 179, 8, 0.6)", fontSize: 12 }}
          >Vitals</Button>
          <Button
            size="small" icon={<FileTextOutlined />}
            onClick={() => { setPreviewPatient(record); setPreviewOpen(true); }}
            style={{ borderRadius: 8, fontWeight: 700, background: "#f8fafc", color: "#2e4a1e", borderColor: "#d1fae5", fontSize: 12 }}
          >View Case Paper</Button>
        </Space>
      ) : record.status === "Assigned" ? (
        <Space size={8}>
          <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "6px", fontSize: 13, fontWeight: 600, color: "#2e4a1e", background: "#f7fee7", border: "1px solid #d9f99d" }}>Assigned</span>
          <Button
            size="small" icon={<FileTextOutlined />}
            onClick={() => { setPreviewPatient(record); setPreviewOpen(true); }}
            style={{ borderRadius: 8, fontWeight: 700, background: "#f8fafc", color: "#2e4a1e", borderColor: "#d1fae5", fontSize: 12 }}
          >View Case Paper</Button>
        </Space>
      ) : record.status === "In Progress" ? (
        <Space size={8}>
          <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "6px", fontSize: 13, fontWeight: 600, color: "#2e4a1e", background: "#f7fee7", border: "1px solid #d9f99d" }}>In Consultation</span>
          <Button
            size="small" icon={<FileTextOutlined />}
            onClick={() => { setPreviewPatient(record); setPreviewOpen(true); }}
            style={{ borderRadius: 8, fontWeight: 700, background: "#f8fafc", color: "#2e4a1e", borderColor: "#d1fae5", fontSize: 12 }}
          >View Case Paper</Button>
        </Space>
      ) : (
        <Space size={8}>
          <Badge status="success" text={<Text style={{ fontSize: 13, fontWeight: 600, color: "#059669", whiteSpace: "nowrap" }}>Completed</Text>} />
          <Button size="small" type="primary" ghost icon={<EyeOutlined />} onClick={() => openReportSummary(record)} style={{ borderRadius: 8, fontSize: 12 }}>View Summary</Button>
          <Button
            size="small" icon={<FileTextOutlined />}
            onClick={() => { setPreviewPatient(record); setPreviewOpen(true); }}
            style={{ borderRadius: 8, fontWeight: 700, background: "#f8fafc", color: "#2e4a1e", borderColor: "#d1fae5", fontSize: 12 }}
          >View Case Paper</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 0 40px 0" }}>

      {/* Header */}
      <div style={{
        background: "radial-gradient(at 0% 0%,rgba(16,185,129,0.08) 0,transparent 50%),radial-gradient(at 50% 0%,rgba(99,102,241,0.08) 0,transparent 50%),radial-gradient(at 100% 0%,rgba(6,182,212,0.08) 0,transparent 50%)",
        borderRadius: 28, padding: "32px 36px", marginBottom: 32,
        border: "1px solid rgba(255,255,255,0.7)", backgroundColor: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(20px)", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.04)",
      }}>
        <Row align="middle" justify="space-between" gutter={[16, 24]}>
          <Col>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={54} icon={<MedicineBoxOutlined />} style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 24 }} />
              <div>
                <h1 style={{ margin: 0, color: "#0f172a", fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>Nurse Station</h1>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14.5, fontWeight: 500 }}>Triage patient flows, check doctor states, and coordinate assignments.</p>
              </div>
            </div>
          </Col>
          <Col>
            <div style={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid rgba(241,245,249,0.9)", borderRadius: 16, padding: "12px 18px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <Text style={{ color: "#475569", fontSize: 11, display: "block", marginBottom: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Active Session Status</Text>
              <Segmented value={myAvailability} onChange={handleAvailabilityChange} options={AVAILABILITY_OPTIONS} style={{ backgroundColor: "#f1f5f9", padding: 3, borderRadius: 10 }} />
            </div>
          </Col>
        </Row>
      </div>

      {/* KPIs */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        {[
          { label: "Waiting Queue",  value: waitingCount,        color: "#1e293b", bg: "#f1f5f9", border: "#e2e8f0", icon: <ClockCircleOutlined /> },
          { label: "Active Admits",  value: assignedCount,       color: "#1e293b", bg: "#f1f5f9", border: "#e2e8f0", icon: <TeamOutlined /> },
          { label: "Consults Done",  value: completedCount,      color: "#1e293b", bg: "#f1f5f9", border: "#e2e8f0", icon: <CheckCircleOutlined /> },
          { label: "Available Docs", value: availDoctors.length, color: "#1e293b", bg: "#f1f5f9", border: "#e2e8f0", icon: <UserOutlined /> },
        ].map((k) => (
          <Col xs={12} sm={12} lg={6} key={k.label}>
            <div style={{ backgroundColor: k.bg, border: `1px solid ${k.border}`, borderRadius: 20, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "transform 0.18s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
            >
              <div>
                <Text style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</Text>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", lineHeight: 1.1, marginTop: 6 }}>{k.value}</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: k.color, boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>{k.icon}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Doctor Tracker */}
      <Card style={{ ...glassCard, marginBottom: 32 }} styles={{ body: { padding: 28 } }}
        title={<Space size="middle"><CompassOutlined style={{ color: "#1e293b", fontSize: 20 }} /><span style={{ fontWeight: 800, fontSize: 16, color: "#1e293b", fontFamily: "'Georgia', serif" }}>Doctor Availability Tracker</span></Space>}
      >
        <Row gutter={[20, 20]}>
          {doctors.map((doc) => {
            const sc = DOC_STATUS_COLORS[doc.status] || "#64748b";
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={doc.id}>
                <div style={{ padding: "20px 24px", borderRadius: 20, backgroundColor: "#fff", border: "1px solid rgba(241,245,249,0.8)", boxShadow: "0 4px 20px -2px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: 16 }}>
                  <Avatar size={44} icon={<UserOutlined />} style={{ backgroundColor: "rgba(100,116,139,0.08)", color: "#64748b", flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", backgroundColor: sc, boxShadow: `0 0 8px ${sc}`, flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{doc.dept}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: sc, marginTop: 4 }}>{doc.status}</div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Patient Queue */}
      <Card style={glassCard} styles={{ body: { padding: 28 } }}
        title={
          <Space size="middle">
            <ClockCircleOutlined style={{ color: "#1e293b", fontSize: 20 }} />
            <span style={{ fontWeight: 800, fontSize: 16, color: "#1e293b", fontFamily: "'Georgia', serif" }}>Patient Queue &amp; Token System</span>
            <Tag color="warning" style={{ borderRadius: 6, fontWeight: 700, padding: "2px 8px" }}>{waitingCount} Waiting</Tag>
          </Space>
        }
      >
        <Table dataSource={queue} columns={queueColumns} rowKey="id" pagination={false} scroll={{ x: 680 }} size="middle"
          rowClassName={(row) => row.status === "Waiting" ? "triage-waiting-row" : ""} style={{ fontSize: 14 }}
          locale={{ emptyText: <Empty description={<span style={{ color: "#64748b", fontWeight: 600 }}>No active patients in the triage queue.</span>} /> }} />
      </Card>

      {/* Assign Doctor Modal */}
      <Modal
        title={<Space><TeamOutlined style={{ color: "#10b981" }} /><span style={{ fontWeight: 800, fontSize: 17, color: "#0f172a" }}>Assign Doctor — {assigningPatient?.patientName}</span></Space>}
        open={assignModalOpen} onCancel={() => setAssignModalOpen(false)} onOk={handleConfirmAssign}
        okText="Confirm Assignment" confirmLoading={assigning} centered width={420}
        mask={{ closable: false }}
        okButtonProps={{ style: { borderRadius: 10, fontWeight: 700, height: 40, background: "#10b981", borderColor: "#10b981" } }}
        cancelButtonProps={{ style: { borderRadius: 10, height: 40 } }}
      >
        <div style={{ padding: "12px 0" }}>
          <Text style={{ fontSize: 13, color: "#475569" }}>Token <strong>{assigningPatient?.token}</strong> · Complaint: {assigningPatient?.complaint}</Text>
          <div style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: 600, color: "#334155", display: "block", marginBottom: 8 }}>Select Available Doctor</Text>
            <Select placeholder="Choose a doctor..." style={{ width: "100%" }} size="large" value={selectedDoctorId} onChange={setSelectedDoctorId}>
              {availDoctors.map((d) => (
                <Option key={d.id} value={d.id}>
                  <Space><Badge status="success" /><span style={{ fontWeight: 600 }}>{d.name}</span><Tag color="cyan" style={{ fontSize: 11 }}>{d.dept}</Tag></Space>
                </Option>
              ))}
            </Select>
            {availDoctors.length === 0 && <Text style={{ fontSize: 12, color: "#ef4444", marginTop: 8, display: "block" }}>⚠️ No doctors available. Try again shortly.</Text>}
          </div>
        </div>
      </Modal>

      {/* Record Vitals Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HeartOutlined style={{ color: "#fff", fontSize: 18 }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>Record Vitals — {vitalsPatient?.patientName}</div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Token {vitalsPatient?.token} · Nurse Triage Intake</div>
            </div>
          </div>
        }
        open={vitalsModalOpen} onCancel={() => setVitalsModalOpen(false)} onOk={handleSaveVitals}
        okText="Save Vitals to Record" confirmLoading={savingVitals} centered width={520}
        mask={{ closable: false }}
        okButtonProps={{ style: { borderRadius: 10, fontWeight: 700, height: 40, background: "linear-gradient(135deg,#7c3aed,#6366f1)", border: "none", boxShadow: "0 4px 12px rgba(124,58,237,0.25)" } }}
        cancelButtonProps={{ style: { borderRadius: 10, height: 40 } }}
      >
        <div style={{ background: "rgba(124,58,237,0.03)", border: "1px solid rgba(124,58,237,0.1)", borderRadius: 14, padding: "20px 20px 8px", margin: "16px 0 8px" }}>
          <Form form={vitalsForm} layout="vertical" requiredMark={false}>
            <Row gutter={[16, 0]}>
              <Col span={12}>
                <Form.Item name="bp" label={<span style={{ fontWeight: 700, fontSize: 12, color: "#334155" }}>BLOOD PRESSURE (mmHg)</span>}
                  rules={[{ required: true, message: "Required" }, { type: "number", min: 50, max: 250, message: "Enter 50–250" }]}
                >
                  <InputNumber placeholder="e.g. 120" style={{ width: "100%", borderRadius: 10 }} size="large" min={50} max={250} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="heartRate" label={<span style={{ fontWeight: 700, fontSize: 12, color: "#334155" }}>HEART RATE (bpm)</span>}
                  rules={[{ required: true, message: "Required" }, { type: "number", min: 20, max: 250, message: "Enter 20–250" }]}
                >
                  <InputNumber placeholder="e.g. 72" style={{ width: "100%", borderRadius: 10 }} size="large" min={20} max={250} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="temperature" label={<span style={{ fontWeight: 700, fontSize: 12, color: "#334155" }}>TEMPERATURE (°F)</span>}
                  rules={[{ required: true, message: "Required" }, { type: "number", min: 90, max: 110, message: "Enter 90–110°F" }]}
                >
                  <InputNumber placeholder="e.g. 98.6" step={0.1} style={{ width: "100%", borderRadius: 10 }} size="large" min={90} max={110} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="spo2" label={<span style={{ fontWeight: 700, fontSize: 12, color: "#10b981" }}>SPO2 LEVEL (%)</span>}
                  rules={[{ required: true, message: "Required" }, { type: "number", min: 50, max: 100, message: "Enter 50–100%" }]}
                >
                  <InputNumber placeholder="e.g. 98" style={{ width: "100%", borderRadius: 10 }} size="large" min={50} max={100} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="respiratoryRate" label={<span style={{ fontWeight: 700, fontSize: 12, color: "#334155" }}>RESPIRATORY RATE (bpm)</span>}
                  rules={[{ required: true, message: "Required" }, { type: "number", min: 5, max: 60, message: "Enter 5–60" }]}
                >
                  <InputNumber placeholder="e.g. 16" style={{ width: "100%", borderRadius: 10 }} size="large" min={5} max={60} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>

      {/* View Summary Modal */}
      <TreatmentReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        report={selectedReport}
      />

      {/* Case Paper Preview Modal */}
      <CasePaperPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        patient={previewPatient}
      />

    </div>
  );
}
