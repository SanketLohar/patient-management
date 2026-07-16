import { Drawer, Descriptions, Tag } from "antd";

export default function PatientDetailsDrawer({
  open,
  onClose,
  patient,
}) {
  return (
    <Drawer
      title="Patient Details"
      placement="right"
      size="large"
      open={open}
      onClose={onClose}
    >
      {patient && (
        <Descriptions
          bordered
          column={1}
          size="middle"
        >
          <Descriptions.Item label="Full Name">
            {patient.fullName}
          </Descriptions.Item>

          <Descriptions.Item label="Age">
            {patient.age}
          </Descriptions.Item>

          <Descriptions.Item label="Gender">
            {patient.gender}
          </Descriptions.Item>

          <Descriptions.Item label="Phone">
            {patient.phone}
          </Descriptions.Item>

          <Descriptions.Item label="Address">
            {patient.address}
          </Descriptions.Item>

          <Descriptions.Item label="Symptoms">
            <Tag color="red">
              {patient.symptoms || "N/A"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Medical History">
            {patient.medicalHistory || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Current Medication">
            {patient.currentMedication || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Emergency Contact">
            {patient.emergencyContactName || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Emergency Phone">
            {patient.emergencyContactPhone || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
}
