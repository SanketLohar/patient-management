import { Card, Timeline, Typography, Badge, Empty, Spin } from "antd";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import {
  UserAddOutlined,
  CalendarOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function ActivityTimeline() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const todayStr = new Date().toDateString();
    
    // Listen to recent patients
    const patientsQ = query(
      collection(db, "patients"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    // Listen to recent appointments
    const appointmentsQ = query(
      collection(db, "appointments"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    let patientsList = [];
    let appointmentsList = [];

    const updateCombinedActivities = () => {
      const combined = [
        ...patientsList.map((p) => ({
          id: `p-${p.id}`,
          type: "registration",
          title: `New Patient Registered`,
          description: `Patient name: ${p.name} (${p.age || "?"} yrs), phone: ${p.phone}`,
          time: p.createdAt ? (p.createdAt.toDate ? p.createdAt.toDate() : new Date(p.createdAt)) : new Date(),
          icon: <UserAddOutlined style={{ fontSize: "16px", color: "#10b981" }} />,
          dotColor: "green",
        })),
        ...appointmentsList.map((a) => ({
          id: `a-${a.id}`,
          type: "appointment",
          title: `Appointment Booked`,
          description: `Patient: ${a.patientName || "Walk-in"} for Dept: ${a.department || "General"}`,
          time: a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(),
          icon: <CalendarOutlined style={{ fontSize: "16px", color: "#0d6efd" }} />,
          dotColor: "blue",
        })),
      ];

      // Sort by time descending
      combined.sort((a, b) => b.time.getTime() - a.time.getTime());
      setActivities(combined.slice(0, 7));
      setLoading(false);
    };

    const unsubPatients = onSnapshot(patientsQ, (snapshot) => {
      patientsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      updateCombinedActivities();
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    const unsubAppointments = onSnapshot(appointmentsQ, (snapshot) => {
      appointmentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      updateCombinedActivities();
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => {
      unsubPatients();
      unsubAppointments();
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.015)",
        border: "1px solid #e2e8f0",
        height: "100%",
        minHeight: "400px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <Title level={5} style={{ margin: 0, color: "#0f172a", fontWeight: "700" }}>
          Live ERP Activity Logs
        </Title>
        <Badge status="processing" text="Live Feed" />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin tip="Fetching activity logs..." />
        </div>
      ) : activities.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No recent admissions or appointment actions logged today"
          style={{ padding: "40px 0" }}
        />
      ) : (
        <Timeline
          mode="left"
          items={activities.map((act) => ({
            dot: act.icon,
            color: act.dotColor,
            children: (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Text style={{ fontWeight: "700", color: "#1e293b", fontSize: "14px" }}>{act.title}</Text>
                  <Text type="secondary" style={{ fontSize: "11px" }}>{formatTime(act.time)}</Text>
                </div>
                <Paragraph style={{ color: "#64748b", fontSize: "13px", margin: "4px 0 0 0", lineHeight: "1.5" }}>
                  {act.description}
                </Paragraph>
              </div>
            ),
          }))}
        />
      )}
    </Card>
  );
}

