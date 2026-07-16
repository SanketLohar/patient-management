import { Form, Input, Select, Row, Col } from "antd";

const { Option } = Select;
const { TextArea } = Input;

export default function NurseForm({ form, isEdit = false }) {
  const departments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Psychology",
    "Radiology",
    "General Medicine",
  ];

  const availabilities = [
    "On Duty",
    "Off Duty",
    "With Patient",
    "Break",
    "Emergency Response",
  ];

  const shifts = ["Morning", "Afternoon", "Evening", "Night"];

  return (
    <Form form={form} layout="vertical" requiredMark="optional">
      {/* Auth fields */}
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
              <Input placeholder="nurse@Moolatvam Ayurved.com" size="large" />
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

      {/* Profile info */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Nurse Priya Patel" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Contact Phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="+91 98765 43211" size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="department"
            label="Assigned Department"
            rules={[{ required: true, message: "Please select department" }]}
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
          <Form.Item name="workingShift" label="Working Shift">
            <Select placeholder="Select shift" size="large">
              {shifts.map((shift) => (
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
      </Row>

      <Form.Item name="biography" label="Professional biography / Experience">
        <TextArea rows={4} placeholder="Brief summary of certifications (BLS/ACLS), nurse shift history, and clinical experience..." />
      </Form.Item>
    </Form>
  );
}

