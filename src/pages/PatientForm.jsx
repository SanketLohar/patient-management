import { Card, Typography, Form,Button,message } from "antd";
import PersonalInfo from "../components/form/PersonalInfo";
import { savePatient } from "../services/patientService";
import MedicalInfo from "../components/form/MedicalInfo";
import EmergencyContact from "../components/form/EmergencyContact";
const { Title, Text } = Typography;

export default function PatientForm() {
  const [form] = Form.useForm();


  const onFinish = async (values) => {
  const result = await savePatient(values);

  if (result.success) {
    message.success("Patient registered successfully!");

    form.resetFields();
  } else {
    message.error("Failed to register patient.");
  }
};
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      <Card
        style={{
          maxWidth: 900,
          margin: "auto",
          borderRadius: 12,
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 0 }}>
          CarePlus Clinic
        </Title>

        <Text
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          Patient Registration Form
        </Text>

<Form
    form={form}
    layout="vertical"
    onFinish={onFinish}
>          <PersonalInfo />
          <MedicalInfo />
          <EmergencyContact />
          <Form.Item style={{ textAlign: "center", marginTop: 30 }}>
  <Button
    type="primary"
    htmlType="submit"
    size="large"
  >
    Submit Registration
  </Button>
</Form.Item>
        </Form>
      </Card>
    </div>
  );
}