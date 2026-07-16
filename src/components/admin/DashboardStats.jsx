import { Row, Col, Card, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { motion, animate } from "framer-motion";
import {
  UserOutlined,
  CalendarOutlined,
  AlertOutlined,
  TeamOutlined,
  UserAddOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";

// Premium animated count counter
function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);
  
  return <span>{displayValue}</span>;
}

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayRegistrations: 0,
    doctorsOnDuty: 0,
    nursesOnDuty: 0,
    appointmentsToday: 0,
    emergencyPatients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realtime listeners for patients, appointments, users, and doctorProfiles
    const patientsRef = collection(db, "patients");
    const appointmentsRef = collection(db, "appointments");
    const doctorProfilesRef = collection(db, "doctorProfiles");

    const todayStr = new Date().toDateString();

    const unsubPatients = onSnapshot(patientsRef, (snapshot) => {
      const allPatients = snapshot.docs.map((doc) => doc.data());
      
      const todayRegs = allPatients.filter((p) => {
        if (!p.createdAt) return false;
        const pDate = p.createdAt.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
        return pDate.toDateString() === todayStr;
      }).length;

      setStats((prev) => ({
        ...prev,
        totalPatients: snapshot.size,
        todayRegistrations: todayRegs,
      }));
    });

    const unsubAppointments = onSnapshot(appointmentsRef, (snapshot) => {
      const allAppts = snapshot.docs.map((doc) => doc.data());
      
      const todayAppts = allAppts.filter((a) => {
        if (!a.date) return false;
        const aDate = a.date.toDate ? a.date.toDate() : new Date(a.date);
        return aDate.toDateString() === todayStr;
      });

      const todayCount = todayAppts.length;
      const emergencyCount = todayAppts.filter((a) => a.type === "Emergency" || a.priority === "High" || a.isEmergency === true).length;

      setStats((prev) => ({
        ...prev,
        appointmentsToday: todayCount,
        emergencyPatients: emergencyCount,
      }));
    });

    let docCount = 0;
    const unsubDocs = onSnapshot(doctorProfilesRef, (snapshot) => {
      const allDocs = snapshot.docs.map((doc) => doc.data());
      docCount = allDocs.filter(
        (d) => d.isDeleted !== true && d.availability !== "Off Duty" && d.availability !== "On Leave"
      ).length;

      setStats((prev) => ({
        ...prev,
        doctorsOnDuty: docCount,
      }));
      setLoading(false);
    });

    const nurseProfilesRef = collection(db, "nurseProfiles");
    const unsubNurses = onSnapshot(nurseProfilesRef, (snapshot) => {
      const allNurses = snapshot.docs.map((doc) => doc.data());
      const nurseCount = allNurses.filter(
        (n) => n.isDeleted !== true && n.availability !== "Off Duty" && n.availability !== "Break"
      ).length;

      setStats((prev) => ({
        ...prev,
        nursesOnDuty: nurseCount,
      }));
    });

    return () => {
      unsubPatients();
      unsubAppointments();
      unsubDocs();
      unsubNurses();
    };
  }, []);

  const cardConfig = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: <UserOutlined style={{ fontSize: "20px", color: "#0284c7" }} />,
      bgColor: "linear-gradient(135deg, rgba(2, 132, 199, 0.04) 0%, rgba(2, 132, 199, 0.01) 100%)",
      borderColor: "#e0f2fe",
      trend: "Live Database",
      trendColor: "#64748b",
    },
    {
      title: "Today's Registrations",
      value: stats.todayRegistrations,
      icon: <UserAddOutlined style={{ fontSize: "20px", color: "#16a34a" }} />,
      bgColor: "linear-gradient(135deg, rgba(22, 163, 74, 0.04) 0%, rgba(22, 163, 74, 0.01) 100%)",
      borderColor: "#dcfce7",
      trend: "+12% vs yesterday",
      trendColor: "#16a34a",
    },
    {
      title: "Doctors On Duty",
      value: stats.doctorsOnDuty,
      icon: <FileProtectOutlined style={{ fontSize: "20px", color: "#7c3aed" }} />,
      bgColor: "linear-gradient(135deg, rgba(124, 58, 237, 0.04) 0%, rgba(124, 58, 237, 0.01) 100%)",
      borderColor: "#f3e8ff",
      trend: "95% Duty Coverage",
      trendColor: "#7c3aed",
    },
    {
      title: "Nurses On Duty",
      value: stats.nursesOnDuty,
      icon: <TeamOutlined style={{ fontSize: "20px", color: "#0891b2" }} />,
      bgColor: "linear-gradient(135deg, rgba(8, 145, 178, 0.04) 0%, rgba(8, 145, 178, 0.01) 100%)",
      borderColor: "#ecfeff",
      trend: "Active shifts",
      trendColor: "#0891b2",
    },
    {
      title: "Appointments Today",
      value: stats.appointmentsToday,
      icon: <CalendarOutlined style={{ fontSize: "20px", color: "#ea580c" }} />,
      bgColor: "linear-gradient(135deg, rgba(234, 88, 12, 0.04) 0%, rgba(234, 88, 12, 0.01) 100%)",
      borderColor: "#ffedd5",
      trend: "Scheduled slots",
      trendColor: "#ea580c",
    },
    {
      title: "Emergency Patients",
      value: stats.emergencyPatients,
      icon: <AlertOutlined style={{ fontSize: "20px", color: "#dc2626" }} />,
      bgColor: "linear-gradient(135deg, rgba(220, 38, 38, 0.04) 0%, rgba(220, 38, 38, 0.01) 100%)",
      borderColor: "#fee2e2",
      trend: "Immediate response",
      trendColor: "#dc2626",
    },
  ];

  if (loading) {
    return (
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Col xs={24} sm={12} lg={4} key={i}>
            <Card style={{ borderRadius: "12px", border: "1px solid #f1f5f9" }}>
              <Skeleton active paragraph={{ rows: 1 }} title={false} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {cardConfig.map((card, idx) => (
        <Col xs={24} sm={12} lg={4} key={idx}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            style={{ height: "100%" }}
          >
            <Card
              variant="outlined"
              style={{
                borderRadius: "14px",
                background: card.bgColor,
                borderColor: card.borderColor,
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
              styles={{ body: { padding: "18px", width: "100%" } }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ color: "#64748b", fontSize: "12.5px", fontWeight: "600", letterSpacing: "0.01em" }}>
                    {card.title}
                  </span>
                  <div style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "4px 0" }}>
                    <AnimatedNumber value={card.value} />
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: card.trendColor }}>
                    {card.trend}
                  </span>
                </div>
                
                {/* Icon wrapper */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(15, 23, 42, 0.02)",
                  }}
                >
                  {card.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  );
}

