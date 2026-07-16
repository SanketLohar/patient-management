/**
 * printCasePaper.js
 * Shared utility: fetches case_paper image as Base64, stamps patient data
 * at absolute coordinates over the A4 canvas, and invokes window.print().
 */

// Convert image URL to Base64 so it renders inside isolated print windows
async function toBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * @param {object} patient - Full Firestore patient document
 */
export async function printCasePaper(patient) {
  if (!patient) return;

  const displayName   = patient.fullName || patient.name || "";
  const today         = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const dob           = patient.dateOfBirth || "";
  const ageGender     = `${patient.age || ""} / ${patient.gender || ""}`;
  const maritalStatus = patient.maritalStatus || "";
  const education     = patient.education || "";
  const occupation    = patient.occupation || "";
  const parentsOcc    = patient.parentsOccupation || "";
  const phone         = patient.phone || "";
  const address       = patient.address || "";
  const weight        = patient.weight ? `${patient.weight} kg` : "";
  const complaint     = patient.reasonForVisit || patient.complaint || patient.symptoms || "";
  const historyPresent = patient.historyOfPresentIllness || "";
  const pastHistory   = patient.pastHistory || "";
  const menstrual     = patient.menstrualHistory || "";

  // Resolve image path relative to origin
  const imgUrl = `${window.location.origin}/src/assets/case_paper.jpeg`;
  let base64Img;
  try {
    base64Img = await toBase64(imgUrl);
  } catch {
    // fallback: use direct path (works in dev but may not print cross-origin)
    base64Img = imgUrl;
  }

  const html = `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8"/>
  <title>Case Paper — ${displayName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    @page {
      size: A4 portrait;
      margin: 0;
    }

    @media print {
      html, body { width: 210mm; height: 297mm; }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }

    body {
      width: 210mm;
      height: 297mm;
      background: white;
      font-family: 'Georgia', serif;
    }

    /* A4 canvas locked to the physical letterhead image */
    .canvas {
      position: relative;
      width: 210mm;
      height: 297mm;
      background-image: url('${base64Img}');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center center;
      overflow: hidden;
    }

    /* Base style for every data overlay field */
    .field {
      position: absolute;
      font-family: 'Georgia', serif;
      font-size: 11.5pt;
      color: #111;
      line-height: 1.35;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* Smaller font for long multiline fields */
    .field-sm {
      font-size: 10pt;
      line-height: 1.4;
    }

    /* Larger for name */
    .field-name {
      font-size: 12pt;
      font-weight: bold;
    }
  </style>
</head>
<body>
<div class="canvas">

  <!-- ── ROW 1: Name ──────────────────────────────────── -->
  <div class="field field-name" style="top:17.5%;left:22%;width:55%;">${displayName}</div>

  <!-- ── ROW 1 RIGHT: Visit Date ──────────────────────── -->
  <div class="field" style="top:17.5%;left:80%;width:17%;">${today}</div>

  <!-- ── ROW 2: DOB / Age-Gender ──────────────────────── -->
  <div class="field" style="top:22.5%;left:22%;width:30%;">${dob}</div>
  <div class="field" style="top:22.5%;left:63%;width:30%;">${ageGender}</div>

  <!-- ── ROW 3: Marital Status / Education ────────────── -->
  <div class="field" style="top:27.5%;left:28%;width:22%;">${maritalStatus}</div>
  <div class="field" style="top:27.5%;left:69%;width:26%;">${education}</div>

  <!-- ── ROW 4: Occupation / Parent's Occupation ──────── -->
  <div class="field" style="top:32.5%;left:26%;width:25%;">${occupation}</div>
  <div class="field" style="top:32.5%;left:69%;width:26%;">${parentsOcc}</div>

  <!-- ── ROW 5: Phone / Address ───────────────────────── -->
  <div class="field" style="top:37.5%;left:20%;width:26%;">${phone}</div>
  <div class="field" style="top:37.5%;left:60%;width:36%;">${address}</div>

  <!-- ── SECTION: Chief Complaint ─────────────────────── -->
  <div class="field field-sm" style="top:43%;left:6%;width:88%;max-height:8%;">${complaint}</div>

  <!-- ── SECTION: History of Present Illness ──────────── -->
  <div class="field field-sm" style="top:54%;left:6%;width:88%;max-height:10%;">${historyPresent}</div>

  <!-- ── SECTION: Past History ────────────────────────── -->
  <div class="field field-sm" style="top:68%;left:6%;width:88%;max-height:9%;">${pastHistory}</div>

  <!-- ── SECTION: Menstrual History (Female only) ─────── -->
  ${menstrual ? `<div class="field field-sm" style="top:81%;left:6%;width:88%;max-height:7%;">${menstrual}</div>` : ""}

  <!-- ── Weight ────────────────────────────────────────── -->
  <div class="field" style="top:90%;left:18%;width:12%;">${weight}</div>

</div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=900,height=1200,scrollbars=yes");
  if (!win) {
    alert("Popup blocked! Please allow popups for this site and try again.");
    return;
  }
  win.document.write(html);
  win.document.close();

  // Wait for image to fully load before triggering print
  win.addEventListener("load", () => {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 600);
  });

  // Fallback timeout in case load event already fired
  setTimeout(() => {
    if (win && !win.closed) {
      win.focus();
      win.print();
    }
  }, 1200);
}
