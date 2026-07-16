import { useState, useEffect, useRef } from "react";
import { Card, Typography, Table, Space, Button, Tag, Modal } from "antd";
import { AreaChartOutlined, PrinterOutlined, FileTextOutlined } from "@ant-design/icons";
import { db } from "../../firebase/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import TreatmentReportModal from "../../components/common/TreatmentReportModal";

const { Title, Text } = Typography;

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "completedReports"), orderBy("completedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setReports(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handlePrint = (report) => {
    // Dynamic fallbacks matching user specs
    const hospitalName = "Moolatvam Ayurved"; 
    const doctorName = report.doctorName || "Physician";
    const doctorSpecialty = "Medical Officer"; 

    const printContent = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Georgia:ital,wght@0,400;0,700;1,400&display=swap');
        @media print {
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
            margin: 0;
            padding: 0;
          }
          @page { size: A4; margin: 0; }
        }
        body {
          font-family: 'Georgia', serif;
          color: #000;
          background: #fff;
          margin: 0;
          padding: 0;
        }
        .print-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          min-height: 1122px; /* A4 height roughly */
          position: relative;
          background-color: #fff;
          box-sizing: border-box;
        }
        /* Top Banner */
        .header-banner {
          background-color: #f59e0b;
          color: #000;
          padding: 30px 40px;
          border-bottom: 8px solid #d97706;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
        }
        .header-left h1 {
          margin: 0 0 5px 0;
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .header-left p {
          margin: 0;
          font-size: 14px;
          font-weight: bold;
          color: #451a03;
        }
        .header-right h2 {
          margin: 0 0 5px 0;
          font-size: 20px;
          font-weight: bold;
        }
        .header-right p {
          margin: 0;
          font-size: 13px;
          text-align: right;
          font-weight: bold;
          color: #451a03;
        }
        /* Content Area */
        .content-area {
          padding: 40px;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px 30px;
          margin-bottom: 40px;
          font-size: 13px;
        }
        .meta-item {
          display: flex;
        }
        .meta-label {
          font-weight: bold;
          width: 130px;
        }
        .meta-value {
          border-bottom: 1px dotted #ccc;
          flex: 1;
        }
        .clinical-section {
          margin-bottom: 25px;
        }
        .clinical-section h3 {
          font-size: 15px;
          font-weight: bold;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .clinical-section p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        /* Footer Signature */
        .signature-block {
          position: absolute;
          bottom: 50px;
          right: 50px;
          text-align: right;
        }
        .signature-line {
          border-top: 1px solid #000;
          width: 200px;
          margin-bottom: 5px;
        }
        .signature-text {
          font-size: 13px;
          font-weight: bold;
        }
        .signature-sub {
          font-size: 11px;
          color: #555;
        }
      </style>
      <div class="print-container">
        <!-- Brand Header -->
        <div class="header-banner">
          <div class="header-left">
            <h1>${hospitalName}</h1>
            <p>Clinical Case Paper</p>
          </div>
          <div class="header-right">
            <h2>Dr. ${doctorName}</h2>
            <p>${doctorSpecialty}</p>
          </div>
        </div>

        <div class="content-area">
          <div class="meta-grid">
            <div class="meta-item"><div class="meta-label">Patient Name :</div><div class="meta-value">${report.patientName}</div></div>
            <div class="meta-item"><div class="meta-label">Date :</div><div class="meta-value">${report.completedAt ? report.completedAt.toDate().toLocaleDateString() : 'N/A'}</div></div>
            <div class="meta-item"><div class="meta-label">Age & Gender :</div><div class="meta-value">${report.age || 'N/A'} / ${report.gender || 'N/A'}</div></div>
            <div class="meta-item"><div class="meta-label">Phone No. :</div><div class="meta-value">${report.phone || 'N/A'}</div></div>
            <div class="meta-item"><div class="meta-label">Follow Up :</div><div class="meta-value">${report.followUpDate || 'None'}</div></div>
          </div>

          <div class="clinical-section">
            <h3>Primary Diagnosis</h3>
            <p><strong>${report.diagnosis || 'N/A'}</strong></p>
          </div>
          <div class="clinical-section">
            <h3>Clinical Notes</h3>
            <p>${report.clinicalNotes || 'None'}</p>
          </div>
          <div class="clinical-section">
            <h3>Treatment Plan</h3>
            <p>${report.treatmentPlan || 'None'}</p>
          </div>
          <div class="clinical-section">
            <h3>Medications</h3>
            <p style="font-family: inherit;">${report.medications || 'None'}</p>
          </div>
          <div class="clinical-section">
            <h3>Lab Tests</h3>
            <p>${(report.labTests || []).join(', ') || 'None'}</p>
          </div>
          ${report.followUpRemark ? `
            <div class="clinical-section">
              <h3>Nurse Remarks</h3>
              <p><em>"${report.followUpRemark}"</em><br><small>— ${report.remarkAuthor}</small></p>
            </div>
          ` : ''}
        </div>

        <div class="signature-block">
          <div class="signature-line"></div>
          <div class="signature-text">Authorized Clinical Signature</div>
          <div class="signature-sub">Dr. ${doctorName}</div>
        </div>
      </div>
    `;
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write(`<html><head><title>Case Paper - ${report.patientName}</title></head><body>${printContent}</body></html>`);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
      render: (t) => <Text style={{ fontWeight: 600 }}>{t}</Text>
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Diagnosis",
      dataIndex: "diagnosis",
      key: "diagnosis",
    },
    {
      title: "Completed At",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (val) => val?.toDate ? val.toDate().toLocaleString() : 'N/A',
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button 
            size="small" 
            type="primary" 
            icon={<FileTextOutlined />} 
            onClick={() => { setSelectedReport(record); setReportModalOpen(true); }}
            style={{ borderRadius: 6 }}
          >
            View
          </Button>
          <Button 
            size="small" 
            icon={<PrinterOutlined />} 
            onClick={() => handlePrint(record)}
            style={{ borderRadius: 6 }}
          >
            Print
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: "0 0 40px 0" }}>
      <div 
        style={{
          background: "radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.08) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.08) 0px, transparent 50%)",
          borderRadius: "28px",
          padding: "32px 36px",
          marginBottom: 32,
          border: "1px solid rgba(255, 255, 255, 0.7)",
          backgroundColor: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Space size="large">
          <AreaChartOutlined style={{ color: "#8b5cf6", fontSize: 32 }} />
          <div>
            <h1 style={{ margin: 0, color: "#0f172a", fontSize: "28px", fontWeight: "800" }}>Analytical Reports & PDF Export</h1>
            <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14.5px" }}>View completed consultations and print treatment reports.</p>
          </div>
        </Space>
      </div>

      <Card style={{ borderRadius: 24, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.5)" }}>
        <Table 
          columns={columns} 
          dataSource={reports} 
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <TreatmentReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        report={selectedReport}
        onPrint={handlePrint}
      />
    </div>
  );
}
