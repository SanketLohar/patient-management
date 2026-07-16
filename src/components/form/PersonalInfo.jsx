// src/components/form/PersonalInfo.jsx
import { useState } from "react";
import { Form, Input, Row, Col, Select, InputNumber, DatePicker } from "antd";

const { TextArea } = Input;

export default function PersonalInfo({ onGenderChange }) {
  const [gender, setGender] = useState(null);

  const handleGenderChange = (val) => {
    setGender(val);
    if (onGenderChange) onGenderChange(val);
  };

  return (
    <>
      <h2 style={{ fontFamily: "'Georgia', serif", color: "#0f172a", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
        Personal Information
      </h2>

      {/* Row 1: Full Name */}
      <Row gutter={16}>
        <Col xs={24} md={16}>
          <Form.Item
            label="Full Name (नाव)"
            name="fullName"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Date of Birth (जन्मतारीख)"
            name="dateOfBirth"
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placeholder="DD/MM/YYYY"
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Row 2: Age / Gender */}
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Form.Item
            label="Age (वय)"
            name="age"
            rules={[{ required: true, message: "Please enter age" }]}
          >
            <InputNumber min={0} max={120} placeholder="Age" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={10}>
          <Form.Item
            label="Gender (लिंग)"
            name="gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select
              placeholder="Select Gender"
              onChange={handleGenderChange}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Marital Status (वैवाहिक स्थिती)" name="maritalStatus">
            <Select
              placeholder="Select Status"
              options={[
                { value: "Married", label: "Married / विवाहित" },
                { value: "Unmarried", label: "Unmarried / अविवाहित" },
                { value: "Widowed", label: "Widowed / विधवा" },
                { value: "Divorced", label: "Divorced / घटस्फोटित" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Row 3: Education / Occupation */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Education (शिक्षण)" name="education">
            <Input placeholder="e.g. B.Com, 10th Pass" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Occupation (व्यवसाय)" name="occupation">
            <Input placeholder="e.g. Farmer, Teacher, Business" />
          </Form.Item>
        </Col>
      </Row>

      {/* Row 4: Parent's Occupation / Phone */}
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item label="Parent's / Spouse Occupation (पालकांचा व्यवसाय)" name="parentsOccupation">
            <Input placeholder="e.g. Retired Govt. Officer" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Phone Number (फोन नंबर)"
            name="phone"
            rules={[
              { required: true, message: "Please enter phone number" },
              { pattern: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit number" },
            ]}
          >
            <Input placeholder="9876543210" maxLength={10} />
          </Form.Item>
        </Col>
      </Row>

      {/* Row 5: Address */}
      <Form.Item
        label="Address (पत्ता)"
        name="address"
        rules={[{ required: true, message: "Please enter address" }]}
      >
        <TextArea rows={2} placeholder="Enter full address" />
      </Form.Item>
    </>
  );
}
