import { useState } from "react";
import { Card, Space, Button, Input, message, Descriptions, Badge } from "antd";
import { SearchOutlined, EyeOutlined, PrinterOutlined } from "@ant-design/icons";
import { useFirestoreCollection } from "../../hooks/useFirestore";
import PageHeader from "../../components/admin/common/PageHeader";
import DataTable from "../../components/admin/common/DataTable";
import FormModal from "../../components/admin/common/FormModal";
import CasePaperPreviewModal from "../../components/common/CasePaperPreviewModal";

export default function AdminPatients() {
  const { data: rawPatients, loading } = useFirestoreCollection("patients");
  const [searchVal, setSearchVal] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [previewPatient, setPreviewPatient] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // High-fidelity fallback presets if Firestore is empty
  const defaultPatients = [
    {
      id: "p-demo-1",
      name: "Jane Doe",
      age: 28,
      gender: "Female",
      email: "jane.doe@example.com",
      phone: "+91 98765 43210",
      bloodGroup: "O+",
      allergies: "Penicillin",
      currentMedication: "Paracetamol 500mg as needed",
      medicalHistory: "Asthma since childhood",
      emergencyContactName: "John Doe",
      emergencyContactPhone: "+91 98765 43211",
      emergencyContactRelation: "Spouse",
      createdAt: { toDate: () => new Date() }
    },
    {
      id: "p-demo-2",
      name: "Arthur Dent",
      age: 42,
      gender: "Male",
      email: "arthur.dent@example.com",
      phone: "+91 98765 12345",
      bloodGroup: "A-",
      allergies: "None reported",
      currentMedication: "None",
      medicalHistory: "Frequent stress and anxiety",
      emergencyContactName: "Trillian",
      emergencyContactPhone: "+91 98765 54321",
      emergencyContactRelation: "Partner",
      createdAt: { toDate: () => new Date() }
    }
  ];

  const patientsList = rawPatients.length > 0 ? rawPatients : defaultPatients;

  // Filter patients locally by search term
  const filteredPatients = patientsList.filter((p) => {
    const term = searchVal.toLowerCase();
    const name = (p.fullName || p.name || "").toLowerCase();
    const email = (p.email || "").toLowerCase();
    const phone = (p.phone || "").toLowerCase();
    return name.includes(term) || email.includes(term) || phone.includes(term);
  });

  const handleViewProfile = (patient) => {
    setSelectedPatient(patient);
    setViewModalOpen(true);
  };

  const handleDownloadCasePaper = (patient) => {
    setPreviewPatient(patient);
    setPreviewOpen(true);
  };

  const columns = [
    {
      title: "Patient Name",
      key: "name",
      render: (_, record) => {
        const displayName = record.fullName || record.name || "Unknown Patient";
        return (
          <div>
            <span style={{ fontWeight: "700", color: "#0f172a" }}>{displayName}</span>
            <span style={{ display: "block", fontSize: "11px", color: "#64748b" }}>
              {record.age ? `${record.age} yrs` : "Age N/A"} • {record.gender || "Gender N/A"}
            </span>
          </div>
        );
      }
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      render: (text) => <span style={{ color: "#475569" }}>{text || "N/A"}</span>
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <span style={{ color: "#475569", fontWeight: "500" }}>{text || "N/A"}</span>
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      key: "bloodGroup",
      render: (text) => (
        <span style={{
          backgroundColor: "#fef2f2",
          color: "#dc2626",
          padding: "2px 8px",
          borderRadius: "50px",
          fontSize: "11px",
          fontWeight: "700"
        }}>
          {text || "N/A"}
        </span>
      )
    },
    {
      title: "Allergies",
      dataIndex: "allergies",
      key: "allergies",
      render: (text) => (
        <span style={{ color: text && text !== "None" ? "#ea580c" : "#64748b" }}>
          {text || "None"}
        </span>
      )
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewProfile(record)}
            className="saas-action-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              color: "#475569",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              height: "32px",
              padding: "0 12px"
            }}
          >
            View Profile
          </Button>
          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => handleDownloadCasePaper(record)}
            className="saas-action-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              border: "1px solid #d1fae5",
              background: "#f7fee7",
              color: "#2e4a1e",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              height: "32px",
              padding: "0 12px"
            }}
          >
            View Case Paper
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Header Banner */}
      <PageHeader
        title="Patient Admissions Registry"
        subtitle="Access all registered case files, medical summaries, and emergency contacts in real-time."
        breadcrumbs={[
          { title: "Dashboard", link: "/dashboard/admin" },
          { title: "Patients" }
        ]}
      />

      {/* Search Filter Header */}
      <div className="saas-search-filter-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
        <Input
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          placeholder="Search patient name, email, or phone..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          style={{
            maxWidth: "320px",
            borderRadius: "10px",
            height: "40px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff"
          }}
        />
        <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
          <span>Total Admissions:</span>
          <span style={{ color: "#0f172a", fontWeight: "800" }}>{patientsList.length}</span>
        </div>
      </div>

      {/* Table Container */}
      <Card
        variant="borderless"
        style={{
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.7)",
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)"
        }}
      >
        <DataTable
          columns={columns}
          dataSource={filteredPatients}
          loading={loading}
          rowKey="id"
        />
      </Card>

      {/* Case Sheet Profile Modal Viewer */}
      {selectedPatient && (
        <FormModal
          title={`Clinical Case File: ${selectedPatient.fullName || selectedPatient.name || "Unknown Patient"}`}
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          showSubmit={false}
          cancelLabel="Close"
          width={800}
        >
          <Descriptions bordered column={{ xs: 1, sm: 2 }} size="middle" className="saas-descriptions">
            <Descriptions.Item label="Full Name" span={2}>
              <strong style={{ color: "#0f172a" }}>{selectedPatient.fullName || selectedPatient.name || "N/A"}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Contact Number" span={1}>
              {selectedPatient.phone || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Age / Gender" span={1}>
              {selectedPatient.age ? `${selectedPatient.age} yrs` : "N/A"} / {selectedPatient.gender || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Email Address" span={1}>
              {selectedPatient.email || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Blood Group" span={1}>
              <span style={{ color: "#dc2626", fontWeight: "700" }}>{selectedPatient.bloodGroup || "N/A"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Home Address" span={1}>
              {selectedPatient.address || "N/A"}
            </Descriptions.Item>

            {/* Medical Info Section */}
            <Descriptions.Item label="Allergies Summary" span={2}>
              <span style={{ color: selectedPatient.allergies && selectedPatient.allergies !== "None" ? "#ea580c" : "inherit", fontWeight: "500" }}>
                {selectedPatient.allergies || "None reported"}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Current Prescriptions" span={2}>
              {selectedPatient.currentMedication || "None active"}
            </Descriptions.Item>
            <Descriptions.Item label="Clinical History Remarks" span={2}>
              {selectedPatient.medicalHistory || "No previous chronic history records found."}
            </Descriptions.Item>

            {/* Emergency Contact */}
            <Descriptions.Item label="Emergency Contact" span={2}>
              {selectedPatient.emergencyContactName ? (
                <div>
                  <strong>{selectedPatient.emergencyContactName}</strong> ({selectedPatient.emergencyContactRelation || "Relation N/A"})
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                    Phone: {selectedPatient.emergencyContactPhone || "N/A"}
                  </div>
                </div>
              ) : (
                "No Emergency Contact Registered"
              )}
            </Descriptions.Item>
          </Descriptions>
        </FormModal>
      )}

      {/* Case Paper Preview Modal */}
      <CasePaperPreviewModal 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        patient={previewPatient} 
      />

      <style>{`
        .saas-action-btn:hover {
          background-color: #f8fafc !important;
          border-color: #cbd5e1 !important;
        }
      `}</style>
    </div>
  );
}

