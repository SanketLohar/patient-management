import { useState, useEffect } from "react";
import {
  Typography, Card, Row, Col, Table, Tag, Badge, Button, Space, Avatar,
  Modal, Drawer, Divider, Tooltip, Timeline, List, Skeleton, message, Segmented
} from "antd";
import {
  UserOutlined, CalendarOutlined, FileTextOutlined, MedicineBoxOutlined,
  HeartOutlined, EyeOutlined, PlayCircleOutlined, ClockCircleOutlined, AlertOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, onSnapshot, writeBatch, serverTimestamp } from "firebase/firestore";
import ConsultationModal from "./ConsultationModal";
import TreatmentReportModal from "../../components/common/TreatmentReportModal";
import usePatientClinicalData from "../../hooks/usePatientClinicalData";
import CasePaperPreviewModal from "../../components/common/CasePaperPreviewModal";

const { Text, Title } = Typography;

const glassCard = {
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  borderRadius: "24px",
  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
};

const DEFAULT_APPOINTMENTS = [];

const AVAILABILITY_OPTIONS = [
  { label: "🟢 Available",  value: "Available"  },
  { label: "🔴 Busy", value: "Busy" },
  { label: "🟡 On Break", value: "On Break" },
];

function PatientDossierDrawer({ patient, open, onClose, onOpenPreview }) {
  const clinicalData = usePatientClinicalData(patient?.patientId, patient?.patientName);

  return (
    <Drawer
      title={
        <div style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          background: "rgba(124,58,237,0.04)",
          borderBottom: "1px solid rgba(124,58,237,0.1)",
          boxSizing: "border-box"
        }}>
          <Space>
            <FileTextOutlined style={{ color: "#7c3aed", fontSize: "18px" }} />
            <span style={{ fontWeight: 800, fontSize: 17, color: "#0f172a" }}>
              Clinical Dossier — {patient?.patientName}
            </span>
          </Space>
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} style={{ color: "#64748b" }} />
        </div>
      }
      closeIcon={null}
      placement="right"
      size="large"
      open={open}
      onClose={onClose}
      mask={{ closable: false }}
      styles={{ 
        body: { padding: "24px", background: "#f8fafc" },
        header: { padding: 0 }
      }}
    >
      {clinicalData.loading ? (
        <Skeleton active paragraph={{ rows: 12 }} />
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size={20}>
          
          {(clinicalData.profile?.reasonForVisit || patient?.complaint) && (
            <Card
              styles={{ body: { padding: "16px" } }}
              style={{
                borderRadius: 16,
                background: "rgba(245,158,11,0.06)",
                borderLeft: "3px solid #f59e0b",
                borderTop: "1px solid rgba(245,158,11,0.2)",
                borderRight: "1px solid rgba(245,158,11,0.2)",
                borderBottom: "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <AlertOutlined style={{ color: "#f59e0b" }} />
                <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a" }}>Chief Complaints & Current Condition</span>
              </div>
              <Text style={{ fontSize: 13, color: "#334155" }}>
                {clinicalData.profile?.reasonForVisit || patient?.complaint}
              </Text>
            </Card>
          )}

          <Card
            title={<span style={{ fontWeight: 800 }}>Profile Details</span>}
            style={{ borderRadius: 16, border: "1px solid rgba(226, 232, 240, 0.8)" }}
          >
            <Row gutter={[16, 12]}>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>AGE / GENDER</Text>
                <span style={{ fontWeight: 700 }}>{clinicalData.profile?.age || patient?.age} Yrs · {clinicalData.profile?.gender || "Male"}</span>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>BLOOD GROUP</Text>
                <span style={{ fontWeight: 700 }}>{clinicalData.profile?.bloodGroup || "O+"}</span>
              </Col>
              <Col span={24}>
                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>DRUG ALLERGIES</Text>
                <Tag color="red" style={{ fontWeight: 700, borderRadius: 4 }}>{clinicalData.profile?.allergies || "None Reported"}</Tag>
              </Col>
              <Col span={24}>
                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>PAST MEDICAL HISTORY</Text>
                <span style={{ fontWeight: 600 }}>{clinicalData.profile?.medicalHistory || "None"}</span>
              </Col>
            </Row>
          </Card>

          <Card
            title={<span style={{ fontWeight: 800 }}>Triaged Vitals (Nurse Station)</span>}
            style={{ borderRadius: 16, border: "1px solid rgba(226, 232, 240, 0.8)" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>BLOOD PRESSURE</Text>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{patient?.triagedVitals?.bp || clinicalData.vitals?.bp || "N/A"}</span>
              </Col>
              <Col span={8}>
                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>HEART RATE</Text>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{patient?.triagedVitals?.heartRate || clinicalData.vitals?.heartRate || "N/A"}</span>
              </Col>
              <Col span={8}>
                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>TEMPERATURE</Text>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{patient?.triagedVitals?.temperature || clinicalData.vitals?.temperature || "N/A"}</span>
              </Col>
              <Col span={8}>
                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>SPO2 LEVEL</Text>
                <span style={{ fontWeight: 700, fontSize: 14, color: "#10b981" }}>{patient?.triagedVitals?.spo2 || clinicalData.vitals?.spo2 || "N/A"}</span>
              </Col>
              <Col span={16}>
                <Text type="secondary" style={{ fontSize: 11, display: "block" }}>RESPIRATORY RATE</Text>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{patient?.triagedVitals?.respiratoryRate || clinicalData.vitals?.respiratoryRate || "N/A"}</span>
              </Col>
            </Row>
          </Card>

          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#1e293b", marginBottom: 12 }}>
              📜 Historical Consultations ({clinicalData.history.length})
            </div>
            {clinicalData.history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#94a3b8" }}>
                No past case paper timeline available.
              </div>
            ) : (
              <Timeline
                items={clinicalData.history.map((h) => ({
                  color: "blue",
                  children: (
                    <Card
                      size="small"
                      style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                      styles={{ body: { padding: "12px" } }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: "#4f46e5" }}>{h.diagnosis}</span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>
                          {h.createdAt?.toDate ? h.createdAt.toDate().toLocaleDateString("en-IN") : "Previous Visit"}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#475569" }}>
                        <strong>Clinical Notes:</strong> {h.clinicalNotes}
                      </div>
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
                        <strong>Meds:</strong> {h.medications}
                      </div>
                      <div style={{ fontSize: 10, color: "#94a3b8", textAlign: "right", marginTop: 4 }}>
                        Dr. {h.doctorName}
                      </div>
                    </Card>
                  ),
                }))}
              />
            )}
          </div>
        </Space>
      )}

      {/* Print Case Paper Button */}
      {patient && (
        <div style={{ padding: "16px 0 0", borderTop: "1px solid #e2e8f0", marginTop: 8 }}>
          <Button
            block
            icon={<FileTextOutlined />}
            onClick={() => {
              // Merge appointment-level data with the full patient profile
              const merged = { ...patient, ...(clinicalData.profile || {}) };
              onOpenPreview(merged);
            }}
            style={{
              height: 44,
              background: "#2e4a1e",
              color: "#ffffff",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontFamily: "'Georgia', serif",
              fontSize: 14,
              boxShadow: "0 4px 14px rgba(46, 74, 30, 0.25)",
            }}
          >
            🖨️ Print Case Paper
          </Button>
        </div>
      )}
    </Drawer>
  );
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [docProfile, setDocProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myAvailability, setMyAvailability] = useState("Available");

  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [dossierPatient, setDossierPatient] = useState(null);
  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPatient, setPreviewPatient] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchDocProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "doctorProfiles", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setDocProfile(data);
          if (data.availability) setMyAvailability(data.availability);
        }
      } catch (err) {
        console.warn("Failed to fetch doctor profile:", err);
      }
    };
    fetchDocProfile();
  }, [user]);

  const handleAvailabilityChange = async (newVal) => {
    setMyAvailability(newVal);
    if (!user) return;
    try {
      const updateData = { availability: newVal };
      if (newVal === "Available") {
        updateData.lastCheckIn = serverTimestamp();
      } else {
        updateData.lastCheckOut = serverTimestamp();
      }
      
      await updateDoc(doc(db, "doctorProfiles", user.uid), updateData);
      
      const notifType = newVal === "Available" ? "checkIn" : "system";
      const title = newVal === "Available" ? `Dr. ${doctorName} checked in` : `Dr. ${doctorName} checked out`;
      
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

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "appointments"),
      where("assignedDoctorId", "==", user.uid),
      where("status", "in", ["Assigned", "In Progress"])
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
        setAppointments(list);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore onSnapshot Error:", err);
        console.error("This may be due to missing composite index or security rules.");
        setAppointments([]); // Avoid silently falling back to mock data
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // For completed patients, we can listen to the new completedReports collection
  const [completedPatients, setCompletedPatients] = useState([]);
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "completedReports"),
      where("doctorId", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      setCompletedPatients(list);
    });
    return () => unsub();
  }, [user]);

  const doctorName = docProfile?.fullName || "Dr. Sandeep Lohar";

  const pipelinePatients = appointments;
  const waitingCount = pipelinePatients.length;
  const completedCount = completedPatients.length;
  const followUpCount = completedPatients.filter((a) => a.followUpDate).length;

  const handleOpenConsultation = (patientRecord) => {
    setSelectedPatient(patientRecord);
    setConsultModalOpen(true);
  };

  const handleOpenDossier = (patientRecord) => {
    setDossierPatient(patientRecord);
    setDossierOpen(true);
  };

  const handleSaveSuccess = (patientId, updatedFields) => {
    setAppointments((prev) => prev.filter(a => a.id !== patientId));
    setConsultModalOpen(false);
  };

  const patientColumns = [
    {
      title: "Patient Info",
      dataIndex: "patient",
      key: "patient",
      render: (name, row) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} style={{ background: "#7c3aed" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{name}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Age {row.age} · Ward {row.ward}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Diagnosis",
      dataIndex: "diagnosis",
      key: "diagnosis",
      render: (d) => <Text style={{ fontSize: 12, fontWeight: 500 }}>{d}</Text>,
    },
    {
      title: "Days",
      dataIndex: "days",
      key: "days",
      render: (d) => <Tag color="blue" style={{ borderRadius: 6, fontWeight: 600 }}>{d}d</Tag>,
      width: 70,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={patientStatusColor[s]} style={{ borderRadius: 6, fontWeight: 700 }}>{s}</Tag>,
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, row) => (
        <Tooltip title="View Case Details">
          <Button
            size="small"
            type="default"
            icon={<EyeOutlined />}
            style={{ borderRadius: 8 }}
            onClick={() => {
              setSelectedPatient({ patientName: row.patient, ...row });
              setHistoryOpen(true);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const openReportModal = (report) => {
    setSelectedReport(report);
    setReportModalOpen(true);
  };

  return (
    <div style={{ padding: "0 0 40px 0" }}>
      <div 
        style={{
          background: "radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.08) 0px, transparent 50%), radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.08) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.08) 0px, transparent 50%)",
          borderRadius: "28px",
          padding: "32px 36px",
          marginBottom: 32,
          border: "1px solid rgba(255, 255, 255, 0.7)",
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.04)",
        }}
      >
        <Row align="middle" justify="space-between" gutter={[16, 24]}>
          <Col>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar 
                size={54} 
                icon={<MedicineBoxOutlined />} 
                style={{ backgroundColor: "rgba(124, 58, 237, 0.15)", color: "#7c3aed", fontSize: "24px" }} 
              />
              <div>
                <h1 style={{ margin: 0, color: "#0f172a", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.03em" }}>
                  Clinical Workspace
                </h1>
                <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14.5px", fontWeight: "500" }}>
                  Welcome back, {doctorName}. Manage today's triaged cases, consultations, and prescriptions.
                </p>
              </div>
            </div>
          </Col>
          <Col>
            <div style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.8)", 
              border: "1px solid rgba(241, 245, 249, 0.9)",
              borderRadius: "16px", 
              padding: "12px 18px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
            }}>
              <Text style={{ color: "#475569", fontSize: "11px", display: "block", marginBottom: 8, fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Active Session Status
              </Text>
              <Segmented
                value={myAvailability}
                onChange={handleAvailabilityChange}
                options={AVAILABILITY_OPTIONS}
                style={{ backgroundColor: "#f1f5f9", padding: "3px", borderRadius: "10px" }}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {[
          { label: "Pipeline Load", value: waitingCount, sub: "Waiting consultations", icon: <ClockCircleOutlined />, color: "#1e293b", bg: "#f1f5f9" },
          { label: "Consults Done", value: completedCount, sub: "Completed today", icon: <CalendarOutlined />, color: "#1e293b", bg: "#f1f5f9" },
          { label: "Follow-ups", value: followUpCount, sub: "Scheduled future visits", icon: <FileTextOutlined />, color: "#1e293b", bg: "#f1f5f9" },
        ].map((kpi) => (
          <Col xs={24} sm={8} lg={8} key={kpi.label}>
            <Card 
              style={{ ...glassCard, border: "1px solid rgba(241, 245, 249, 0.8)", backgroundColor: "#ffffff" }} 
              styles={{ body: { padding: "24px" } }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <Text style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {kpi.label}
                  </Text>
                  <div style={{ fontSize: "36px", fontWeight: "800", color: "#0f172a", lineHeight: 1.1, marginTop: "6px" }}>
                    {kpi.value}
                  </div>
                  <Text style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", display: "block", fontWeight: "500" }}>
                    {kpi.sub}
                  </Text>
                </div>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", color: kpi.color }}>
                  {kpi.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} xl={12}>
          <Space direction="vertical" style={{ width: "100%" }} size={24}>
            
            <Card
              style={glassCard}
              styles={{ body: { padding: "24px" } }}
              title={
                <Space>
                  <CalendarOutlined style={{ color: "#1e293b", fontSize: 18 }} />
                  <span style={{ fontWeight: 800, fontSize: 16, color: "#1e293b", fontFamily: "'Georgia', serif" }}>Active Consultation Pipeline</span>
                  <Tag color="warning" style={{ borderRadius: 6, fontWeight: 700 }}>{waitingCount} Active</Tag>
                </Space>
              }
            >
              <div style={{ maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                    Loading active pipeline...
                  </div>
                ) : pipelinePatients.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                    <CalendarOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                    <div>All triaged consultations are completed.</div>
                  </div>
                ) : (
                  <Timeline
                    items={pipelinePatients.map((appt) => ({
                      color: appt.status === "In Progress" ? "blue" : "gray",
                      children: (
                        <div
                          style={{
                            padding: "16px",
                            borderRadius: "16px",
                            background: appt.status === "In Progress" ? "rgba(99,102,241,0.04)" : "#ffffff",
                            border: appt.status === "In Progress" ? "1.5px solid rgba(99,102,241,0.2)" : "1px solid rgba(241,245,249,0.8)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
                            marginBottom: 4,
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <Text style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b" }}>{appt.patientName}</Text>
                              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                                Age {appt.age} · {appt.complaint || "Routine Triage"}
                              </div>
                            </div>
                            <Tag
                              color={appt.status === "In Progress" ? "blue" : "orange"}
                              style={{ fontWeight: "700", borderRadius: 6, margin: 0 }}
                            >
                              {appt.status}
                            </Tag>
                          </div>
                          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                            <Tag style={{ fontSize: "11px", margin: 0, borderRadius: 4 }}>{appt.time || "OPD"}</Tag>
                            <Tag color="cyan" style={{ fontSize: "11px", margin: 0, borderRadius: 4 }}>{appt.type || "General"}</Tag>
                            <Tag style={{ fontSize: "11px", margin: 0, borderRadius: 4 }}>#{appt.token}</Tag>
                          </div>
                          <Space style={{ marginTop: 12 }}>
                            <Button
                              type="primary"
                              size="middle"
                              icon={<PlayCircleOutlined />}
                              onClick={() => handleOpenConsultation(appt)}
                              style={{
                                borderRadius: 8,
                                fontWeight: 700,
                                background: "#7c3aed",
                                borderColor: "#7c3aed",
                                boxShadow: "0 4px 10px rgba(124,58,237,0.15)",
                              }}
                            >
                              Treat Patient
                            </Button>
                            <Tooltip title="View Patient File (Dossier)">
                              <Button
                                size="middle"
                                type="default"
                                icon={<EyeOutlined />}
                                onClick={() => handleOpenDossier(appt)}
                                style={{ borderRadius: 8 }}
                              />
                            </Tooltip>
                          </Space>
                        </div>
                      ),
                    }))}
                  />
                )}
              </div>
            </Card>
          </Space>
        </Col>

        <Col xs={24} xl={12}>
          <Space direction="vertical" style={{ width: "100%" }} size={24}>
            <Card
              style={glassCard}
              styles={{ body: { padding: "24px" } }}
              title={
                <Space>
                  <FileTextOutlined style={{ color: "#10b981", fontSize: 18 }} />
                  <span style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>Completed Consultations</span>
                  <Tag color="green" style={{ borderRadius: 6, fontWeight: 700 }}>{completedCount} Done</Tag>
                </Space>
              }
            >
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {completedPatients.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8" }}>
                    No completed visits recorded today.
                  </div>
                ) : (
                  <List
                    dataSource={completedPatients}
                    renderItem={(appt) => (
                      <List.Item
                        style={{
                          padding: "12px 16px",
                          background: "#f8fafc",
                          borderRadius: 12,
                          marginBottom: 8,
                          border: "1px solid rgba(241, 245, 249, 0.8)",
                        }}
                      >
                        <div style={{ width: "100%" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 700, color: "#1e293b" }}>{appt.patientName}</span>
                            <Button size="small" type="primary" onClick={() => openReportModal(appt)} style={{ borderRadius: 6 }}>
                              View Report
                            </Button>
                          </div>
                          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                            <strong>Diagnosis:</strong> {appt.diagnosis || "General Consultation"}
                          </div>
                          {appt.followUpDate && (
                            <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 600, marginTop: 4 }}>
                              📅 Follow-up scheduled: {appt.followUpDate}
                            </div>
                          )}
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </Card>
          </Space>
        </Col>
      </Row>

      <ConsultationModal
        open={consultModalOpen}
        patient={selectedPatient}
        doctorProfile={docProfile}
        onCancel={() => setConsultModalOpen(false)}
        onSaveSuccess={handleSaveSuccess}
      />

      <PatientDossierDrawer
        patient={dossierPatient}
        open={dossierOpen}
        onClose={() => setDossierOpen(false)}
        onOpenPreview={(mergedPatient) => {
          setPreviewPatient(mergedPatient);
          setPreviewOpen(true);
        }}
      />

      {/* Case Paper Preview Modal */}
      <CasePaperPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        patient={previewPatient}
      />

      {selectedPatient && (
        <Modal
          title={
            <Space>
              <EyeOutlined style={{ color: "#6366f1" }} />
              <span style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>
                Admission File — {selectedPatient.patientName}
              </span>
            </Space>
          }
          open={historyOpen}
          onCancel={() => setHistoryOpen(false)}
          footer={[
            <Button key="close" onClick={() => setHistoryOpen(false)} style={{ borderRadius: 10, height: 40, fontWeight: 700 }}>
              Close
            </Button>
          ]}
          width={580}
          centered
          mask={{ closable: false }}
        >
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Card size="small" style={{ borderRadius: 12, background: "#f8fafc" }}>
                  <Text style={{ fontSize: 12, color: "#64748b" }}>Diagnosis</Text>
                  <div style={{ fontWeight: 700, marginTop: 2 }}>{selectedPatient.diagnosis || "N/A"}</div>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ borderRadius: 12, background: "#f8fafc" }}>
                  <Text style={{ fontSize: 12, color: "#64748b" }}>Ward / Bed</Text>
                  <div style={{ fontWeight: 700, marginTop: 2 }}>{selectedPatient.ward || "Out-Patient"}</div>
                </Card>
              </Col>
            </Row>
            <Divider style={{ margin: "12px 0" }} />
            <Text style={{ fontWeight: 600, color: "#334155" }}>Admission Timeline</Text>
            <Timeline
              style={{ marginTop: 16 }}
              items={[
                { color: "green",  children: `Admitted — Day 1 · General Checkup & Vitals recorded` },
                { color: "blue",   children: `Day 2 · Lab reports received — CBC, LFT normal` },
                { color: "blue",   children: `Day ${selectedPatient.days - 1 || 3} · Physician round — condition ${selectedPatient.status || "Stable"}` },
                { color: selectedPatient.status === "Critical" ? "red" : "green", children: `Today · Current status: ${selectedPatient.status || "Stable"}` },
              ]}
            />
          </div>
        </Modal>
      )}

      <TreatmentReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        report={selectedReport}
      />

    </div>
  );
}
