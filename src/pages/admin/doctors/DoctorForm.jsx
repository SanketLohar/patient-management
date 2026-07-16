import { Form, Input, Select, InputNumber, Row, Col } from "antd";

const { Option } = Select;
const { TextArea } = Input;

export default function DoctorForm({ form, isEdit = false }) {
  const departments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Psychology",
    "Radiology",
    "General Medicine",
  ];

  const availabilities = [
    "Available",
    "In Consultation",
    "On Leave",
    "Off Duty",
    "Emergency Call",
  ];


  return (
    <Form form={form} layout="vertical" requiredMark="optional">
      {/* 1. Auth fields - only shown when registering a new user */}
      {!isEdit && (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="doctor@Moolatvam Ayurved.com" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Default Login Password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="••••••" size="large" />
            </Form.Item>
          </Col>
        </Row>
      )}

      {/* 2. Profile core information */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Dr. Sandeep Lohar" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Contact Phone"
          >
            <Input placeholder="+91 98765 43210" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="department"
            label="Clinical Department"
          >
            <Select placeholder="Select department" size="large">
              {departments.map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="specialization"
            label="Specialization / Specialty"
          >
            <Input placeholder="Interventional Cardiology" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="qualification"
            label="Qualification"
          >
            <Input placeholder="MD, DM (Cardiology)" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="experience"
            label="Years of Experience"
          >
            <InputNumber min={0} max={60} style={{ width: "100%" }} placeholder="10" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="roomNumber" label="Consultation Room Number">
            <Input placeholder="OPD Room 204" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="workingShift" label="Working Shift">
            <Select placeholder="Select shift" size="large">
              {["Morning", "Afternoon", "Evening", "Night"].map((shift) => (
                <Option key={shift} value={shift}>
                  {shift}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="weeklyOff" label="Weekly Off Day">
            <Select placeholder="Select off day" size="large">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <Option key={day} value={day}>
                  {day}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="consultationTimings" label="Consultation Timings">
            <Input placeholder="09:00 AM - 01:00 PM, 04:00 PM - 08:00 PM" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="availability"
            label="Availability Status"
          >
            <Select placeholder="Select availability" size="large">
              {availabilities.map((avail) => (
                <Option key={avail} value={avail}>
                  {avail}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="languages" label="Languages Spoken">
            <Input placeholder="English, Hindi, Marathi" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="biography" label="Biography / Professional Summary">
        <TextArea rows={4} placeholder="Brief summary of professional accolades, clinical interest, and history..." />
      </Form.Item>
    </Form>
  );
}

