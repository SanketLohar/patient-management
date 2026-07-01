// src/components/form/PersonalInfo.jsx

import { Form, Input, Row, Col, Select, InputNumber } from "antd";

const { TextArea } = Input;

export default function PersonalInfo() {
  return (
    <>
      <h2>Personal Information</h2>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please enter your full name",
              },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Age"
            name="age"
            rules={[
              {
                required: true,
                message: "Please enter age",
              },
            ]}
          >
            <InputNumber
              min={0}
              max={120}
              placeholder="Age"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[
              {
                required: true,
                message: "Please select gender",
              },
            ]}
          >
            <Select
              placeholder="Select Gender"
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please enter phone number",
              },
              {
                pattern: /^[6-9]\d{9}$/,
                message: "Enter a valid 10-digit phone number",
              },
            ]}
          >
            <Input placeholder="9876543210" maxLength={10} />
          </Form.Item>
        </Col>
      </Row>

     

      <Form.Item
        label="Address"
        name="address"
        rules={[
          {
            required: true,
            message: "Please enter address",
          },
        ]}
      >
        <TextArea rows={3} placeholder="Enter address" />
      </Form.Item>
    </>
  );
}