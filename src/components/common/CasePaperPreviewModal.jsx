import React from "react";
import { Modal, Button, Space, Typography } from "antd";
import { DownloadOutlined, CloseOutlined, FileTextOutlined } from "@ant-design/icons";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import casePaperImg from "../../assets/case_paper.jpeg";

const { Text } = Typography;

/**
 * CasePaperPreviewModal
 * * FINAL HIGH-PRECISION ALIGNMENT MATRIX
 * Locks Date and Weight directly next to their respective baseline labels.
 */
export default function CasePaperPreviewModal({ patient, open, onClose }) {
  if (!patient) return null;

  // ── Data Normalization Mapping ──────────────────────────────────────────────
  const displayName = patient.fullName || patient.name || "";
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
  const dob = patient.dateOfBirth || "";
  const ageGender = [
    patient.age ? `${patient.age} Yrs` : "",
    patient.gender || "",
  ].filter(Boolean).join(" / ");
  const maritalStatus = patient.maritalStatus || "";
  const education = patient.education || "";
  const occupation = patient.occupation || "";
  const parentsOcc = patient.parentsOccupation || "";
  const phone = patient.phone || "";
  const address = patient.address || "";
  const weight = patient.weight ? `${patient.weight} kg` : "";

  const complaint = patient.reasonForVisit || patient.complaint || patient.symptoms || "";
  const historyPresent = patient.historyOfPresentIllness || "";
  const pastHistory = patient.pastHistory || "";
  const menstrual = patient.menstrualHistory || "";

  // ── Unified Style Factory ───────────────────────────────────────────────────
  const base = {
    position: "absolute",
    fontFamily: "'Georgia', serif",
    fontWeight: 600,
    fontSize: "11pt",
    color: "#0f172a",
    lineHeight: 1.2,
    wordBreak: "break-word",
    whiteSpace: "normal",
    zIndex: 10,
  };

  const f = (top, left, width, extra = {}) => ({
    ...base,
    top: `${top}%`,
    left: `${left}%`,
    width: `${width}%`,
    ...extra,
  });

  const handleDownloadPDF = async () => {
    const element = document.querySelector(".case-paper-print-capture");
    if (!element) return;

    try {
      // Capture the element at high resolution scaling (2x) for razor-sharp printed text fields
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Initialize an absolute A4 dimensional portrait layout sheet framework
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // A4 absolute physical document sizes mapping parameters
      const imgWidth = 210; 
      const imgHeight = 297; 

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');

      // Generate the clean file document down the target output storage register pipe
      const fileName = `Case_Paper_${displayName.replace(/\s+/g, "_") || "Patient"}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF generation execution pipeline error:", error);
    }
  };

  return (
    <>


      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        closeIcon={null}
        width={860}
        centered
        destroyOnHidden
        className="case-paper-modal"
        styles={{
          body: { padding: 0, backgroundColor: "#cbd5e1" },
          header: { display: "none" },
          content: { padding: 0, overflow: "hidden", borderRadius: 16 },
        }}
      >
        {/* ── INTERACTIVE TOP TOOLBAR ────────────────────────────────────────── */}
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 24px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <Space>
            <FileTextOutlined style={{ fontSize: 20, color: "#2e4a1e" }} />
            <Text style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", fontFamily: "'Georgia', serif" }}>
              Case Paper Preview
            </Text>
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadPDF}
              style={{ backgroundColor: "#2e4a1e", borderColor: "#2e4a1e", fontWeight: 600 }}
            >
              Download PDF
            </Button>
            <Button icon={<CloseOutlined />} onClick={onClose} style={{ fontWeight: 600 }}>
              Close Preview
            </Button>
          </Space>
        </div>

        {/* ── SCROLL VIEWPANEL ──────────────────────────────────────────────── */}
        <div
          className="no-print"
          style={{
            width: "100%",
            height: "calc(100vh - 200px)",
            overflowY: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "24px 0",
          }}
        >
          {/* ── A4 GRAPHIC OVERLAY CANVAS CONTAINER ─────────────────────────── */}
          <div
            className="case-paper-print-capture"
            style={{
              position: "relative",
              width: "794px",
              height: "1123px",
              flexShrink: 0,
              backgroundColor: "#ffffff",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              overflow: "hidden",
            }}
          >
            {/* Physical background image asset */}
            <img
              src={casePaperImg}
              alt="Stationery Base"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}
            />

            {/* ROW 1: NAME */}
            <div style={f(18.4, 14, 45, { fontSize: "12pt", fontWeight: 700 })}>{displayName}</div>

            {/* ROW 2: DOB | AGE & GENDER */}
            <div style={f(22.0, 14, 16)}>{dob}</div>
            <div style={f(22.0, 48, 20)}>{ageGender}</div>

            {/* ROW 3: PHONE | MARITAL | DATE */}
            <div style={f(25.2, 14, 20)}>{phone}</div>
            <div style={f(25.2, 48, 16)}>{maritalStatus}</div>
            {/* DATE: Lowered and shifted right to fit perfectly next to 'Date :' label */}
            <div style={f(23.5, 71, 22)}>{today}</div>

            {/* ROW 4: ADDRESS | EDUCATION */}
            <div style={f(28.5, 14, 40, { lineHeight: 1.3 })}>{address}</div>
            <div style={f(28.5, 71, 24)}>{education}</div>

            {/* ROW 5: OCCUPATION */}
            <div style={f(31.8, 71, 24)}>{occupation}</div>

            {/* ROW 6: PARENT OCCUPATION */}
            <div style={f(35.1, 71, 24)}>{parentsOcc}</div>

            {/* WEIGHT — Lowered down right next to the 'वजन :' baseline label */}
            <div style={f(36.6, 89, 15, { fontSize: "10pt" })}>{weight}</div>

            {/* CLINICAL HISTORIES ROW STRUCTURE */}
            {/* Column A: Chief Complaints & Notes */}
            <div style={f(43.5, 4, 34, { height: "15%", lineHeight: 1.6, fontSize: "10pt" })}>
              {complaint}
              {historyPresent && complaint ? "\n\n" + historyPresent : historyPresent}
            </div>

            {/* Column B: Menstrual History */}
            <div style={f(43.5, 41, 17, { height: "15%", lineHeight: 1.6, fontSize: "10pt" })}>{menstrual}</div>

            {/* Column C: Past History */}
            <div style={f(43.5, 61, 19, { height: "15%", lineHeight: 1.6, fontSize: "10pt" })}>{pastHistory}</div>
          </div>
        </div>
      </Modal>
    </>
  );
}