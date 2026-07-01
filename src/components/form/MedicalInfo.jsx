import { Form, Row, Col, Select, Input, InputNumber, Typography } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

export default function MedicalInfo() {
  return (
    <>
      <Title level={4} style={{ marginTop: 30 }}>
        Medical Information
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            label="Blood Group"
            name="bloodGroup"
          >
            <Select
              placeholder="Select Blood Group"
              options={[
                { value: "A+", label: "A+" },
                { value: "A-", label: "A-" },
                { value: "B+", label: "B+" },
                { value: "B-", label: "B-" },
                { value: "AB+", label: "AB+" },
                { value: "AB-", label: "AB-" },
                { value: "O+", label: "O+" },
                { value: "O-", label: "O-" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label="Height (cm)"
            name="height"
          >
            <InputNumber
              style={{ width: "100%" }}
              min={30}
              max={250}
              placeholder="Height"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label="Weight (kg)"
            name="weight"
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              max={300}
              placeholder="Weight"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Allergies"
        name="allergies"
      >
        <TextArea
          rows={2}
          placeholder="Mention allergies if any"
        />
      </Form.Item>

      <Form.Item
        label="Existing Diseases"
        name="diseases"
      >
        <TextArea
          rows={2}
          placeholder="Diabetes, BP, Asthma..."
        />
      </Form.Item>

      <Form.Item
        label="Current Medications"
        name="medications"
      >
        <TextArea
          rows={2}
          placeholder="Mention current medications"
        />
      </Form.Item>

      <Form.Item
        label="Symptoms / Chief Complaint"
        name="symptoms"
        rules={[
          {
            required: true,
            message: "Please describe the symptoms",
          },
        ]}
      >
        <TextArea
          rows={4}
          placeholder="Describe your symptoms..."
        />
      </Form.Item>
    </>
  );
}