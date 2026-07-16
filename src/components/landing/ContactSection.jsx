import { motion } from "framer-motion";
import { Row, Col, Typography, Card, Form, Input, Button, Select, Space, message } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { HOSPITAL_CONFIG } from "../../constants/hospitalConfig";
import BlurText from "../animations/BlurText";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

export default function ContactSection() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    message.success("Thank you! Your enquiry has been received. Our clinical helpdesk will contact you shortly.");
    form.resetFields();
  };

  const contactInfo = [
    {
      icon: <EnvironmentOutlined style={{ fontSize: "20px", color: "var(--secondary-color)" }} />,
      title: "Hospital Address",
      content: HOSPITAL_CONFIG.address,
    },
    {
      icon: <PhoneOutlined style={{ fontSize: "20px", color: "#10b981" }} />,
      title: "Phone & Email",
      content: `${HOSPITAL_CONFIG.phone} / ${HOSPITAL_CONFIG.email}`,
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: "20px", color: "#f59e0b" }} />,
      title: "Working Hours",
      content: HOSPITAL_CONFIG.workingHours,
    },
  ];

  return (
    <section
      id="contact"
      style={{
        padding: "100px 5%",
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.9)), url(${HOSPITAL_CONFIG.contactBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        overflow: "hidden",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 60px auto" }}>
        <span
          style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: "20px",
            backgroundColor: "rgba(212, 160, 23, 0.08)",
            color: "var(--secondary-color)",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "16px",
          }}
        >
          Get In Touch
        </span>
        <BlurText
          text="Contact & Location {Details}"
          delay={80}
          animateBy="words"
          direction="bottom"
          className="section-title-blur-text text-center"
        />
        <Paragraph style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.6" }}>
          Send an enquiry message to our medical team or visit us at our main clinical branch.
        </Paragraph>
      </div>

      <Row gutter={[48, 48]} style={{ maxWidth: "1200px", margin: "auto" }}>
        {/* Left Side: Contact Cards & Google Maps */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Info Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {contactInfo.map((info, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    background: "#ffffff",
                    padding: "20px",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      backgroundColor: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <Title level={5} style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "700", color: "#1e293b" }}>
                      {info.title}
                    </Title>
                    <Text style={{ color: "#64748b", fontSize: "13px", lineHeight: "1.6" }}>
                      {info.content}
                    </Text>
                  </div>
                </div>
              ))}
            </div>

            {/* Embedded Live Google Maps Iframe */}
            <Card
              variant="borderless"
              styles={{ body: { padding: 0 } }}
              style={{
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                overflow: "hidden",
                height: "260px",
              }}
            >
              <iframe
                title="Moolatvam Ayurved Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9790518712613!2d77.72895697593259!3d12.973167114842186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae11f3089ef0af%3A0xe7f9cb894982a7f5!2sMoolatvam Ayurved%20Main%20Rd%2C%20Whitefield%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1717312345678!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </motion.div>
        </Col>

        {/* Right Side: Premium Enquiry Form */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card
              variant="borderless"
              style={{
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 15px 35px rgba(0,0,0,0.04)",
                padding: "24px",
                background: "#ffffff",
              }}
            >
              <Title level={4} style={{ margin: "0 0 8px 0", fontWeight: "800", color: "#1e293b" }}>
                Quick Enquiry Desk
              </Title>
              <Paragraph style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
                Fill out the form below, and our patient hospitality desk will respond within 24 business hours.
              </Paragraph>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
              >
                <Form.Item
                  label={<span style={{ fontWeight: "600", fontSize: "13px", color: "#475569" }}>Your Name</span>}
                  name="name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                    { min: 2, message: "Name must be at least 2 characters long" },
                    { pattern: /^[a-zA-Z\s]+$/, message: "Name can only contain letters and spaces" }
                  ]}
                >
                  <Input placeholder="Enter your full name" style={{ height: "42px", borderRadius: "8px" }} />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={<span style={{ fontWeight: "600", fontSize: "13px", color: "#475569" }}>Email Address</span>}
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" },
                      ]}
                    >
                      <Input placeholder="name@domain.com" style={{ height: "42px", borderRadius: "8px" }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={<span style={{ fontWeight: "600", fontSize: "13px", color: "#475569" }}>Phone Number</span>}
                      name="phone"
                      rules={[
                        { required: true, message: "Please enter phone number" },
                        { pattern: /^[6-9]\d{9}$/, message: "Please enter a valid 10-digit phone number" }
                      ]}
                    >
                      <Input placeholder="Enter 10-digit phone number" style={{ height: "42px", borderRadius: "8px" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label={<span style={{ fontWeight: "600", fontSize: "13px", color: "#475569" }}>Clinical Department</span>}
                  name="department"
                  rules={[{ required: true, message: "Please select department" }]}
                >
                  <Select placeholder="Select department of inquiry" style={{ height: "42px" }} styles={{ popup: { root: { borderRadius: "8px" } } }}>
                    <Option value="cardiology">Cardiology</Option>
                    <Option value="neurology">Neurology</Option>
                    <Option value="orthopedics">Orthopedics</Option>
                    <Option value="pediatrics">Pediatrics</Option>
                    <Option value="general">General Medicine</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span style={{ fontWeight: "600", fontSize: "13px", color: "#475569" }}>Message</span>}
                  name="message"
                  rules={[
                    { required: true, message: "Please enter message" },
                    { min: 10, message: "Message must be at least 10 characters long" }
                  ]}
                >
                  <Input.TextArea placeholder="Describe your query or check-in request..." rows={4} style={{ borderRadius: "8px" }} />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  block
                  style={{
                    height: "46px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "14px",
                    backgroundColor: "var(--secondary-color)",
                    borderColor: "var(--secondary-color)",
                    marginTop: "8px",
                  }}
                >
                  Submit Enquiry
                </Button>
              </Form>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </section>
  );
}

