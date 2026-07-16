import { Modal, Button, Typography, Row, Col, Divider, Tag } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function TreatmentReportModal({ 
  open, 
  onClose, 
  report, 
  onPrint = null 
}) {
  if (!report) return null;

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FileTextOutlined style={{ color: "#7c3aed", fontSize: "20px" }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>Treatment Report</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={800} // Luxury layout width
      footer={[
        onPrint && (
          <Button key="print" type="default" onClick={() => onPrint(report)} style={{ borderRadius: 8, fontWeight: 600, marginRight: 8 }}>
            Print PDF
          </Button>
        ),
        <Button key="close" type="primary" onClick={onClose} style={{ borderRadius: 8, background: "#7c3aed", fontWeight: 700, paddingInline: 24 }}>
          Close Dossier
        </Button>
      ]}
      style={{ top: 40 }}
    >
      <div style={{ padding: "10px 0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        
        {/* Full-width Metadata Section */}
        <div style={{ backgroundColor: "#f8fafc", padding: "16px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Patient Name</Text>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>{report.patientName}</div>
            </Col>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Age / Gender</Text>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#334155" }}>{report.age || "N/A"} Yrs / {report.gender || "Unspecified"}</div>
            </Col>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Contact Number</Text>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#334155" }}>{report.phone || "Not Provided"}</div>
            </Col>
            <Col span={12}>
              <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Assigning Doctor</Text>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#0284c7" }}>Dr. {report.doctorName}</div>
            </Col>
          </Row>
        </div>

        {/* Diagnosis & Follow-up Row */}
        <Row align="middle" justify="space-between" style={{ marginBottom: "24px" }}>
          <Col>
            <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, display: "block" }}>Primary Diagnosis</Text>
            <Text style={{ fontWeight: 800, color: "#4f46e5", fontSize: 18 }}>{report.diagnosis || "N/A"}</Text>
          </Col>
          <Col>
            {report.followUpDate && report.followUpDate !== "None" && (
              <Tag color="purple" style={{ padding: "4px 12px", borderRadius: "50px", fontSize: "13px", fontWeight: 700 }}>
                Follow-up: {report.followUpDate}
              </Tag>
            )}
          </Col>
        </Row>

        <Divider style={{ margin: "16px 0" }} />

        {/* Clinical Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, display: "block", marginBottom: "4px" }}>Clinical Notes</Text>
            <Text style={{ fontSize: "14px", color: "#334155", lineHeight: 1.6 }}>{report.clinicalNotes || "No notes provided."}</Text>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, display: "block", marginBottom: "4px" }}>Treatment Plan</Text>
            <Text style={{ fontSize: "14px", color: "#334155", lineHeight: 1.6 }}>{report.treatmentPlan || "No treatment plan specified."}</Text>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, display: "block", marginBottom: "4px" }}>Medications Prescribed</Text>
            <div style={{ backgroundColor: "#fafaf9", padding: "12px", borderRadius: "8px", border: "1px dashed #d6d3d1" }}>
              <pre style={{ margin: 0, fontFamily: "inherit", fontSize: "14px", color: "#44403c", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                {report.medications || "No medications prescribed."}
              </pre>
            </div>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, display: "block", marginBottom: "4px" }}>Lab Tests Requested</Text>
            {report.labTests && report.labTests.length > 0 ? (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {report.labTests.map(test => (
                  <Tag key={test} color="blue" style={{ borderRadius: 6, padding: "2px 8px" }}>{test}</Tag>
                ))}
              </div>
            ) : (
              <Text style={{ fontSize: "14px", color: "#334155" }}>None requested.</Text>
            )}
          </div>

          {/* Render Nurse Follow-up Remark if present */}
          {report.followUpRemark && (
            <div style={{ backgroundColor: "#fef3c7", padding: "12px 16px", borderRadius: "8px", border: "1px solid #fde68a", marginTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 800, color: "#d97706" }}>Nurse Remarks (Follow-Up)</Text>
                <Text style={{ fontSize: "10px", color: "#d97706", fontWeight: 700 }}>{report.remarkAuthor}</Text>
              </div>
              <Text style={{ fontSize: "14px", color: "#92400e", fontStyle: "italic", lineHeight: 1.5 }}>
                "{report.followUpRemark}"
              </Text>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
