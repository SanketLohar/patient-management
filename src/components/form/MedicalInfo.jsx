// src/components/form/MedicalInfo.jsx
import { Form, Row, Col, Select, Input, InputNumber, Typography } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

export default function MedicalInfo({ gender }) {
  const isFemale = gender === "Female";

  return (
    <>
      <Title
        level={4}
        style={{ marginTop: 30, fontFamily: "'Georgia', serif", color: "#0f172a", fontWeight: 700 }}
      >
        Medical Information
      </Title>

      {/* Blood Group / Height / Weight */}
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item label="Blood Group (रक्तगट)" name="bloodGroup">
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
          <Form.Item label="Height / उंची (cm)" name="height">
            <InputNumber style={{ width: "100%" }} min={30} max={250} placeholder="Height in cm" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Weight / वजन (kg)" name="weight">
            <InputNumber style={{ width: "100%" }} min={1} max={300} placeholder="Weight in kg" />
          </Form.Item>
        </Col>
      </Row>

      {/* Allergies */}
      <Form.Item label="Allergies (ऍलर्जी)" name="allergies">
        <TextArea rows={2} placeholder="Mention any drug or food allergies" />
      </Form.Item>

      {/* Existing Diseases */}
      <Form.Item label="Existing Diseases (विद्यमान आजार)" name="diseases">
        <TextArea rows={2} placeholder="Diabetes, Hypertension, Asthma..." />
      </Form.Item>

      {/* Current Medications */}
      <Form.Item label="Current Medications (सध्याची औषधे)" name="medications">
        <TextArea rows={2} placeholder="Mention any ongoing medications" />
      </Form.Item>

      {/* ── Doctor-filled fields (blank at intake) ─────────────────────────── */}
      <Title
        level={5}
        style={{ marginTop: 24, marginBottom: 4, color: "#64748b", fontWeight: 600, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase" }}
      >
        Clinical History (Filled by Doctor / Nurse during consultation)
      </Title>

      {/* History of Present Illness */}
      <Form.Item
        label="History of Present Illness / सध्याच्या आजाराचा इतिहास"
        name="historyOfPresentIllness"
      >
        <TextArea
          rows={4}
          placeholder="Doctor / Nurse will fill this during consultation..."
          style={{ backgroundColor: "#fafafa", color: "#64748b" }}
        />
      </Form.Item>

      {/* Past History */}
      <Form.Item label="Past History / मागील इतिहास" name="pastHistory">
        <TextArea
          rows={4}
          placeholder="Doctor / Nurse will fill this during consultation..."
          style={{ backgroundColor: "#fafafa", color: "#64748b" }}
        />
      </Form.Item>

      {/* Menstrual History — Female only */}
      {isFemale && (
        <Form.Item label="Menstrual History / पाळीचा इतिहास" name="menstrualHistory">
          <TextArea
            rows={3}
            placeholder="Cycle regularity, last date, any issues..."
            style={{ backgroundColor: "#fafafa", color: "#64748b" }}
          />
        </Form.Item>
      )}
    </>
  );
}
