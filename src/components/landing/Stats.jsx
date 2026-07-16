import { motion } from "framer-motion";
import { Card, Row, Col, Typography } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Stats() {
  const statsData = [
    {
      value: "50+",
      label: "Expert Doctors",
      desc: "Dedicated clinical specialists",
      icon: <UserOutlined style={{ fontSize: "28px", color: "#0d6efd" }} />,
      bg: "rgba(13, 110, 253, 0.08)",
    },
    {
      value: "15+",
      label: "Specialist Departments",
      desc: "Full-spectrum medical fields",
      icon: <AppstoreOutlined style={{ fontSize: "28px", color: "#0dcaf0" }} />,
      bg: "rgba(13, 202, 240, 0.08)",
    },
    {
      value: "10k+",
      label: "Patients Treated",
      desc: "Trust and recovery success",
      icon: <HeartOutlined style={{ fontSize: "28px", color: "#ed63d2" }} />,
      bg: "rgba(237, 99, 210, 0.08)",
    },
    {
      value: "24/7",
      label: "Trauma & Emergency",
      desc: "Round-the-clock immediate care",
      icon: <MedicineBoxOutlined style={{ fontSize: "28px", color: "#ef4444" }} />,
      bg: "rgba(239, 68, 68, 0.08)",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="stats"
      style={{
        padding: "80px 5%",
        background: "#ffffff",
        position: "relative",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <Row gutter={[24, 24]}>
          {statsData.map((stat, idx) => (
            <Col xs={24} sm={12} lg={6} key={idx}>
              <motion.div variants={cardVariants} className="hover-card">
                <Card
                  variant="borderless"
                  style={{
                    borderRadius: "16px",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)",
                    border: "1px solid #f1f5f9",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "12px",
                      backgroundColor: stat.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {stat.icon}
                  </div>
                  <Title
                    level={2}
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "36px",
                      fontWeight: "800",
                      color: "#142a1f",
                    }}
                  >
                    {stat.value}
                  </Title>
                  <Title
                    level={5}
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#1e293b",
                    }}
                  >
                    {stat.label}
                  </Title>
                  <Text style={{ color: "#64748b", fontSize: "14px" }}>
                    {stat.desc}
                  </Text>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </section>
  );
}

