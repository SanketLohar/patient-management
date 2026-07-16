import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { message } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useFirestoreCollection } from "../../hooks/useFirestore";

// ── Shared card style ─────────────────────────────────────────
const glassCard = {
  backgroundColor: "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
};

// ── KPI Stat Cards (replaces Patient Traffic chart) ───────────
function KpiStatsGrid({ appointmentsCount, staffCount, patientsCount, followUpsCount }) {
  const stats = [
    {
      label: "Appointments",
      value: appointmentsCount || 0,
      sub: "Active Queue",
      icon: "📅",
      accent: "#1e293b",
      bg: "#f1f5f9",
      border: "#e2e8f0",
    },
    {
      label: "On-Duty Staff",
      value: staffCount || 0,
      sub: "Doctors & Nurses",
      icon: "🩺",
      accent: "#1e293b",
      bg: "#f1f5f9",
      border: "#e2e8f0",
    },
    {
      label: "Registered Patients",
      value: patientsCount || 0,
      sub: "Total active records",
      icon: "🏥",
      accent: "#1e293b",
      bg: "#f1f5f9",
      border: "#e2e8f0",
    },
    {
      label: "Pending Follow-ups",
      value: followUpsCount || 0,
      sub: "Action required",
      icon: "⚠️",
      accent: "#1e293b",
      bg: "#f1f5f9",
      border: "#e2e8f0",
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "14px",
    }}>
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            backgroundColor: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: "16px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            transition: "transform 0.18s ease, box-shadow 0.18s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Icon Circle */}
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "rgba(255,255,255,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            {s.icon}
          </div>

          {/* Value */}
          <div>
            <div style={{
              fontSize: "30px",
              fontWeight: "800",
              color: s.accent,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: "12.5px",
              fontWeight: "700",
              color: "#0f172a",
              marginTop: "4px",
            }}>
              {s.label}
            </div>
            <div style={{
              fontSize: "11px",
              color: "#64748b",
              marginTop: "2px",
              fontWeight: "500",
            }}>
              {s.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard Component ──────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");
  const [appointments, setAppointments] = useState([]);
  
  // Real-time aggregates
  const { data: allAppointments } = useFirestoreCollection("appointments");
  const { data: allDoctors } = useFirestoreCollection("doctorProfiles");
  const { data: allNurses } = useFirestoreCollection("nurseProfiles");
  const { data: allPatients } = useFirestoreCollection("patients");
  const { data: allReports } = useFirestoreCollection("completedReports");

  const appointmentsCount = allAppointments ? allAppointments.length : 0;
  const staffCount = (allDoctors ? allDoctors.length : 0) + (allNurses ? allNurses.length : 0);
  const patientsCount = allPatients ? allPatients.length : 0;
  const followUpsCount = allReports ? allReports.filter(r => r.followUpDate && r.followUpDate !== "None").length : 0;

  const defaultAppointments = [
    { id: "d1", patientName: "Jane Doe",     status: "Admitted",     dept: "Cardiology",    room: "ICU-102", time: "10m ago" },
    { id: "d2", patientName: "Arthur Dent",  status: "Observation",  dept: "General Ward",  room: "Ward-4B", time: "45m ago" },
    { id: "d3", patientName: "John Smith",   status: "Admitted",     dept: "Neurology",     room: "ICU-205", time: "2h ago" },
    { id: "d4", patientName: "Sarah Connor", status: "Discharged",   dept: "Emergency Room",room: "ER-04",   time: "3h ago" },
  ];

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const prefix = (user.email || "").split("@")[0];
      setAdminName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
    }

    const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"), limit(4));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data();
        let formattedDate = "Today";
        if (data.date) {
          const dt = data.date.toDate ? data.date.toDate() : new Date(data.date);
          formattedDate = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
        return {
          id: d.id,
          patientName: data.patientName || "Walk-in Patient",
          status: data.status || "Pending",
          dept: data.department || "General",
          room: data.room || "—",
          time: formattedDate,
        };
      });
      setAppointments(list);
    }, (err) => {
      console.warn("Appointments read failed:", err.code || err.message);
    });

    return () => unsub();
  }, []);

  const admissionsList = appointments.length > 0
    ? appointments
    : defaultAppointments;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Welcome Banner ── */}
      <div className="saas-welcome-panel">
        <div>
          <h1 className="saas-welcome-title">Welcome, {adminName}!</h1>
          <p className="saas-welcome-desc">Here's what's happening at Moolatvam Ayurved today.</p>
        </div>

        <div className="saas-quick-actions-row">
          {/* Add Patient shortcut */}
          <div
            onClick={() => navigate("/dashboard/admin/patients")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "48px", height: "48px", borderRadius: "12px",
              backgroundColor: "#0f172a", color: "#ffffff", cursor: "pointer",
              fontSize: "22px", fontWeight: "500", flexShrink: 0,
              transition: "transform 0.2s", boxShadow: "0 4px 12px rgba(15,23,42,0.1)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.06)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            +
          </div>

          {[
            { title: "Doctor Roster",     desc: "Register specialists",  route: "/dashboard/admin/doctors" },
            { title: "Nurse Station",     desc: "Onboard new staff",     route: "/dashboard/admin/nurses" },
            { title: "Patient Admission", desc: "Create case record",    route: "/dashboard/admin/patients" },
          ].map((act, i) => (
            <div
              key={i}
              onClick={() => navigate(act.route)}
              className="saas-quick-action-card"
            >
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{act.title}</span>
                <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "500" }}>{act.desc}</span>
              </div>
              <RightOutlined style={{ fontSize: "10px", color: "#94a3b8" }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── 2 × 2 Main Grid ── */}
      <div className="saas-dashboard-grid">

        {/* CARD 1 (Left Top): KPI Stats Grid */}
        <div style={{ ...glassCard, gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Live Overview</span>
            <span style={{
              fontSize: "11px", fontWeight: "700",
              backgroundColor: "rgba(2,132,199,0.08)", color: "#0284c7",
              padding: "3px 10px", borderRadius: "50px",
            }}>
              Real-time
            </span>
          </div>
          <KpiStatsGrid 
            appointmentsCount={appointmentsCount} 
            staffCount={staffCount} 
            patientsCount={patientsCount} 
            followUpsCount={followUpsCount} 
          />
        </div>

        {/* CARD 2: Recent Admissions */}
        <div style={{ ...glassCard, gridColumn: "1 / -1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Recent Arrivals</span>
            <span
              onClick={() => navigate("/dashboard/admin/appointments")}
              style={{ fontSize: "12px", fontWeight: "700", color: "#0284c7", cursor: "pointer" }}
            >
              View Queue &gt;
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {admissionsList.map((adm, i) => {
              const isAdmitted = adm.status === "Assigned";
              const isObs      = adm.status === "In Progress";
              const badgeBg    = isAdmitted ? "#e8f5e9" : isObs ? "#e3f2fd" : "#f5f5f5";
              const badgeText  = isAdmitted ? "#2e7d32"  : isObs ? "#1565c0" : "#616161";

              return (
                <div
                  key={adm.id || i}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.03)", paddingBottom: "10px" }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{adm.patientName || adm.name}</span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>{adm.dept} • {adm.room}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ backgroundColor: badgeBg, color: badgeText, padding: "3px 8px", borderRadius: "50px", fontSize: "10.5px", fontWeight: "700" }}>
                      {adm.status}
                    </span>
                    <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>{adm.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
