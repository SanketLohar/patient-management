import jsPDF from "jspdf";

export const generatePatientPDF = (patient) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text("CarePlus Clinic", 105, 20, { align: "center" });

  doc.setFontSize(16);
  doc.text("Patient Case Paper", 105, 30, { align: "center" });

  // Line
  doc.line(20, 35, 190, 35);

  // Patient Details
  doc.setFontSize(14);
  doc.text("Patient Information", 20, 45);

  doc.setFontSize(12);

  let y = 55;

  doc.text(`Name: ${patient.fullName || "-"}`, 20, y);
  y += 10;

  doc.text(`Age: ${patient.age || "-"}`, 20, y);
  y += 10;

  doc.text(`Gender: ${patient.gender || "-"}`, 20, y);
  y += 10;

  doc.text(`Phone: ${patient.phone || "-"}`, 20, y);
  y += 10;

  doc.text(`Address: ${patient.address || "-"}`, 20, y);

  // Medical Information
  y += 20;

  doc.setFontSize(14);
  doc.text("Medical Information", 20, y);

  y += 10;

  doc.setFontSize(12);

  doc.text(`Blood Group: ${patient.bloodGroup || "-"}`, 20, y);
  y += 10;

  doc.text(`Height: ${patient.height || "-"}`, 20, y);
  y += 10;

  doc.text(`Weight: ${patient.weight || "-"}`, 20, y);
  y += 10;

  doc.text(`Symptoms: ${patient.symptoms || "-"}`, 20, y);
  y += 10;

  doc.text(`Diseases: ${patient.diseases || "-"}`, 20, y);
  y += 10;

  doc.text(`Medications: ${patient.medications || "-"}`, 20, y);
  y += 10;

  doc.text(`Allergies: ${patient.allergies || "-"}`, 20, y);

  // Emergency Contact
  y += 20;

  doc.setFontSize(14);
  doc.text("Emergency Contact", 20, y);

  y += 10;

  doc.setFontSize(12);

  doc.text(`Name: ${patient.emergencyName || "-"}`, 20, y);
  y += 10;

  doc.text(`Relation: ${patient.emergencyRelation || "-"}`, 20, y);
  y += 10;

  doc.text(`Phone: ${patient.emergencyPhone || "-"}`, 20, y);

  // Footer
  y += 30;

  doc.line(20, y, 190, y);

  y += 15;

  doc.text(
    `Generated On: ${new Date().toLocaleDateString()}`,
    20,
    y
  );

  doc.text("Doctor Signature", 140, y);

  doc.save(`${patient.fullName}-CasePaper.pdf`);
};
