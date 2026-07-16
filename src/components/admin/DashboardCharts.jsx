import { Row, Col, Card, Empty, Typography, Progress, Badge } from "antd";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const { Title } = Typography;

export default function DashboardCharts() {
  const [patientsHistory, setPatientsHistory] = useState([]); // Array of { dateStr: string, count: number }
  const [deptStats, setDeptStats] = useState([]); // Array of { name: string, count: number, percent: number }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patientsRef = collection(db, "patients");
    const appointmentsRef = collection(db, "appointments");

    const unsubPatients = onSnapshot(patientsRef, (snapshot) => {
      const datesMap = {};
      
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.createdAt) return;
        const pDate = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        const dateStr = pDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        datesMap[dateStr] = (datesMap[dateStr] || 0) + 1;
      });

      // Sort and map to last 7 days of entries
      const sortedHistory = Object.entries(datesMap)
        .map(([dateStr, count]) => ({ dateStr, count }))
        .slice(-7);

      setPatientsHistory(sortedHistory);
      setLoading(false);
    });

    const unsubAppointments = onSnapshot(appointmentsRef, (snapshot) => {
      const deptMap = {};
      let total = 0;
      
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.department) return;
        deptMap[data.department] = (deptMap[data.department] || 0) + 1;
        total += 1;
      });

      const stats = Object.entries(deptMap).map(([name, count]) => ({
        name,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      })).sort((a, b) => b.count - a.count);

      setDeptStats(stats);
    });

    return () => {
      unsubPatients();
      unsubAppointments();
    };
  }, []);

  // Custom SVG Line Chart coordinates generator
  const renderSvgLineChart = () => {
    if (patientsHistory.length === 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No registration records to display" style={{ margin: "40px 0" }} />;
    }

    const width = 500;
    const height = 200;
    const padding = 30;

    const maxVal = Math.max(...patientsHistory.map((d) => d.count), 5);
    const minVal = 0;

    const points = patientsHistory.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / Math.max(patientsHistory.length - 1, 1);
      const y = height - padding - ((d.count - minVal) * (height - 2 * padding)) / (maxVal - minVal);
      return { x, y, ...d };
    });

    const linePath = points.reduce((path, p, i) => {
      return path + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    }, "");

    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : "";

    return (
      <div style={{ position: "relative", width: "100%", height: "220px" }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d6efd" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0d6efd" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding + ratio * (height - 2 * padding);
            return (
              <line
                key={idx}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#f1f5f9"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Fill Area */}
          {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}

          {/* Line Path */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#0d6efd"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill="#ffffff"
                stroke="#0d6efd"
                strokeWidth={2}
              />
              <text
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fill="#64748b"
                fontSize="10px"
                fontWeight="600"
              >
                {p.dateStr}
              </text>
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fill="#0f172a"
                fontSize="10px"
                fontWeight="700"
              >
                {p.count}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const getDeptColor = (idx) => {
    const colors = ["#0d6efd", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4", "#ef4444"];
    return colors[idx % colors.length];
  };

  return (
    <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
      {/* Patients Per Day Line Chart */}
      <Col xs={24} lg={12}>
        <Card
          variant="borderless"
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.015)",
            border: "1px solid #e2e8f0",
          }}
        >
          <Title level={5} style={{ margin: "0 0 20px 0", color: "#0f172a", fontWeight: "700" }}>
            Patient Registration Trend (Last 7 Active Days)
          </Title>
          {loading ? (
            <div style={{ height: "220px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Progress type="circle" percent={40} strokeColor="#0d6efd" />
            </div>
          ) : (
            renderSvgLineChart()
          )}
        </Card>
      </Col>

      {/* Department Distribution Progress bar chart */}
      <Col xs={24} lg={12}>
        <Card
          variant="borderless"
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.015)",
            border: "1px solid #e2e8f0",
            minHeight: "288px",
          }}
        >
          <Title level={5} style={{ margin: "0 0 20px 0", color: "#0f172a", fontWeight: "700" }}>
            Appointment Distribution by Department
          </Title>
          {deptStats.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No active departments registered yet" style={{ margin: "40px 0" }} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {deptStats.slice(0, 5).map((dept, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <Badge color={getDeptColor(idx)} text={<span style={{ fontWeight: "600", color: "#334155" }}>{dept.name}</span>} />
                    <span style={{ fontWeight: "700", color: "#0f172a" }}>{dept.count} ({dept.percent}%)</span>
                  </div>
                  <Progress
                    percent={dept.percent}
                    showInfo={false}
                    strokeColor={getDeptColor(idx)}
                    trailColor="#f1f5f9"
                    strokeWidth={8}
                    style={{ margin: 0 }}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
}

