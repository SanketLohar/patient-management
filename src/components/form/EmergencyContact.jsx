import { Form, Row, Col, Input, Typography } from "antd";

const { Title } = Typography;

export default function EmergencyContact() {
  return (
    <>
      <Title level={4} style={{ marginTop: 30 }}>
        Emergency Contact
      </Title>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Contact Name"
            name="emergencyName"
          >
            <Input placeholder="Enter contact name" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Relation"
            name="emergencyRelation"
          >
            <Input placeholder="Father / Mother / Spouse" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Emergency Contact Number"
        name="emergencyPhone"
        rules={[
          {
            pattern: /^[6-9]\d{9}$/,
            message: "Enter a valid phone number",
          },
        ]}
      >
        <Input
          placeholder="9876543210"
          maxLength={10}
        />
      </Form.Item>
    </>
  );
}