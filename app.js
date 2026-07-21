/*
  FR-SHE-50-114 HIRA Online Form
  1) Put this folder on GitHub Pages.
  2) Set WEB_APP_URL to your Google Apps Script Web App URL when ready.
  3) If WEB_APP_URL is blank, Save will download JSON for testing.
*/
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwoiLGqQusCkLl5lUm8rbdwvZ69XSvNT_PXoeYt3aK9Sljt6ZSBerIs0DbAV92lheCm/exec"; // <-- ใส่ URL Google Apps Script ภายหลัง
const PAGE_W = 1241;
const PAGE_H = 1754;
const page = document.getElementById("page");
const statusEl = document.getElementById("saveStatus");
let uploadedImageBase64 = "";

function pct(v, total){ return (v / total * 100).toFixed(5) + "%"; }
function setBox(el, x, y, w, h){
  el.style.left = pct(x, PAGE_W);
  el.style.top = pct(y, PAGE_H);
  el.style.width = pct(w, PAGE_W);
  el.style.height = pct(h, PAGE_H);
}
function formatTodayDDMMYYYY(){
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear() + 543; // ปี พ.ศ. สำหรับเอกสารไทย
  return `${dd}/${mm}/${yyyy}`;
}
function makeInput({name, x, y, w, h, type="text", placeholder="", value="", readOnly=false}){
  const input = document.createElement("input");
  input.className = "field";
  input.name = name;
  input.type = type;
  input.placeholder = placeholder;
  input.value = value;
  input.readOnly = readOnly;
  setBox(input, x, y, w, h);
  page.appendChild(input);
  return input;
}
function makeTextarea({name, x, y, w, h, placeholder=""}){
  const ta = document.createElement("textarea");
  ta.className = "field textarea";
  ta.name = name;
  ta.placeholder = placeholder;
  setBox(ta, x, y, w, h);
  page.appendChild(ta);
  return ta;
}
function makeCheck({name, x, y, value="1"}){
  const cb = document.createElement("input");
  cb.className = "check";
  cb.name = name;
  cb.type = "checkbox";
  cb.value = value;
  cb.style.left = pct(x, PAGE_W);
  cb.style.top = pct(y, PAGE_H);
  page.appendChild(cb);
  return cb;
}

function makeActionButtons({x, y, w, h}){
  const panel = document.createElement("div");
  panel.className = "page-actions no-print";
  panel.innerHTML = `
    <button type="button" id="btnSave">บันทึกข้อมูล</button>
    <button type="button" id="btnClear">ล้างข้อมูล</button>
  `;
  setBox(panel, x, y, w, h);
  page.appendChild(panel);
}

function makeImageBox({x, y, w, h}){
  const box = document.createElement("label");
  box.className = "image-box";
  box.innerHTML = `<span>กดเพื่อแนบรูปภาพ<br/>1 รูป</span><input name="evidence_image" type="file" accept="image/*" />`;
  setBox(box, x, y, w, h);
  page.appendChild(box);
  const file = box.querySelector("input");
  file.addEventListener("change", () => {
    const f = file.files && file.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      uploadedImageBase64 = reader.result;
      box.classList.add("has-image");
      box.style.backgroundImage = `url(${uploadedImageBase64})`;
    };
    reader.readAsDataURL(f);
  });
}

// Header fields
makeInput({name:"hazard_identification_date", x:805, y:150, w:360, h:22, type:"text", value:formatTodayDDMMYYYY(), readOnly:true});
makeInput({name:"machine", x:140, y:176, w:520, h:20});
makeInput({name:"model", x:720, y:176, w:445, h:20});
makeInput({name:"plant", x:115, y:199, w:545, h:20});
makeInput({name:"serial_no", x:760, y:199, w:405, h:20});
makeTextarea({name:"intended_function", x:252, y:224, w:913, h:43});

// Hazard rows: input in the blank middle cell + OP/MT/OT checkboxes.
const leftRows = [
  ["1.1","Mechanical Hazards",388,416],["1.2","Mechanical Hazards",416,445],["1.3","Mechanical Hazards",445,474],
  ["1.4","Mechanical Hazards",474,503],["1.5","Mechanical Hazards",503,531],["1.6","Mechanical Hazards",531,560],
  ["1.7","Mechanical Hazards",560,589],["1.8","Mechanical Hazards",589,618],["1.9","Mechanical Hazards",618,646],
  ["2.1","Electrical Hazards",675,704],["2.2","Electrical Hazards",704,733],["2.3","Electrical Hazards",733,761],
  ["2.4","Electrical Hazards",761,790],["2.5","Electrical Hazards",790,819],
  ["3.1","Thermal Hazards",848,876],["3.1.1","Thermal Hazards",876,905],["3.1.2","Thermal Hazards",905,934],
  ["3.1.3","Thermal Hazards",934,963],["3.1.4","Thermal Hazards",963,991],["3.1.5","Thermal Hazards",991,1020],
  ["3.2","Thermal Hazards",1020,1049],
  ["4.1","Noise Hazards",1078,1106],["4.2","Noise Hazards",1106,1135],
  ["5.1","Confined Space",1164,1193],["5.2","Confined Space",1193,1221],
  ["6.1","Radiation Hazards",1250,1279]
];
const rightRows = [
  // Right-side rows aligned to the actual PDF row positions. Left-side rows are unchanged.
  ["7.1.1","Material/Substances",388,416],["7.1.2","Material/Substances",416,445],["7.1.3","Material/Substances",445,474],
  ["7.1.4","Material/Substances",474,503],["7.1.5","Material/Substances",503,531],
  ["7.2.1","Material/Substances",531,560],["7.2.2","Material/Substances",560,589],
  ["7.3.1","Material/Substances",589,618],["7.3.2","Material/Substances",618,646],
  ["8.1.1","Ergonomics",675,704],["8.1.2","Ergonomics",704,733],["8.1.3","Ergonomics",733,761],["8.1.4","Ergonomics",761,790],
  ["8.2","Ergonomics",790,819],["8.3","Ergonomics",819,848],["8.4","Ergonomics",848,876],
  ["9.1","Falling/Ejected Objects",905,934],
  ["10.1","Loss of Stability/Overturning",963,991],["10.2","Loss of Stability/Overturning",991,1020],
  ["10.3","Loss of Stability/Overturning",1020,1049],["10.4","Loss of Stability/Overturning",1049,1078],
  ["11.1","Slip/Trip/Fall",1106,1135],["11.2","Slip/Trip/Fall",1135,1164],["11.3","Slip/Trip/Fall",1164,1193],
  ["11.4","Slip/Trip/Fall",1193,1221],["11.5","Slip/Trip/Fall",1221,1250],["11.6","Slip/Trip/Fall",1250,1279],["11.7","Slip/Trip/Fall",1279,1308]
];
function addHazardRow([code, category, y1, y2], side){
  const cy = (y1 + y2) / 2;
  const h = Math.max(16, y2-y1-5);
  if (side === "L") {
    makeInput({name:`hazard_${code}_remark`, x:357, y:y1+3, w:176, h});
    makeCheck({name:`hazard_${code}_op`, x:552, y:cy});
    makeCheck({name:`hazard_${code}_mt`, x:588, y:cy});
    makeCheck({name:`hazard_${code}_ot`, x:623, y:cy});
  } else {
    makeInput({name:`hazard_${code}_remark`, x:883, y:y1+3, w:176, h});
    makeCheck({name:`hazard_${code}_op`, x:1081, y:cy});
    makeCheck({name:`hazard_${code}_mt`, x:1117, y:cy});
    makeCheck({name:`hazard_${code}_ot`, x:1154, y:cy});
  }
}
leftRows.forEach(r => addHazardRow(r, "L"));
rightRows.forEach(r => addHazardRow(r, "R"));

// Large image frame at bottom left of the original form.
makeImageBox({x:116, y:1356, w:454, h:222});
// Action buttons moved beside the image frame in the blank area on the right.
makeActionButtons({x:640, y:1368, w:455, h:118});

function collectData(){
  const fd = new FormData(document.getElementById("hiraForm"));
  const data = {
    timestamp:new Date().toISOString(),
    header:{},
    hazards:[],
    evidence_image: uploadedImageBase64 || ""
  };
  ["hazard_identification_date","machine","model","plant","serial_no","intended_function"].forEach(k => data.header[k] = fd.get(k) || "");
  [...leftRows, ...rightRows].forEach(([code, category]) => {
    const item = {
      code, category,
      remark: fd.get(`hazard_${code}_remark`) || "",
      op: fd.get(`hazard_${code}_op`) ? true : false,
      mt: fd.get(`hazard_${code}_mt`) ? true : false,
      ot: fd.get(`hazard_${code}_ot`) ? true : false
    };
    if (item.remark || item.op || item.mt || item.ot) data.hazards.push(item);
  });
  return data;
}
function buildSafeFileName(data){
  const machine = data.header.machine ? data.header.machine.trim().replace(/[\\/:*?"<>|\s]+/g,"_") : "HIRA";
  const dateText = (data.header.hazard_identification_date || new Date().toISOString().slice(0,10)).replace(/[\\/:*?"<>|\s]+/g,"_");
  return `${machine}_${dateText}.pdf`;
}
function downloadPDF(dataUri, fileName){
  const a = document.createElement("a");
  a.href = dataUri;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
async function createPDF(data){
  if (!window.html2canvas || !window.jspdf) {
    throw new Error("ไม่พบไลบรารีสร้าง PDF กรุณาเชื่อมต่ออินเทอร์เน็ตแล้วลองใหม่");
  }
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  document.body.classList.add("exporting");
  const canvas = await html2canvas(page, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false
  });
  document.body.classList.remove("exporting");

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({orientation:"portrait", unit:"mm", format:"a4"});
  const pageWmm = pdf.internal.pageSize.getWidth();
  const pageHmm = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, "JPEG", 0, 0, pageWmm, pageHmm);

  const dataUri = pdf.output("datauristring");
  const base64 = dataUri.split(",")[1];
  const fileName = buildSafeFileName(data);
  return {fileName, dataUri, base64};
}
async function saveData(){
  const data = collectData();
  try{
    statusEl.textContent = "กำลังสร้างไฟล์ PDF...";
    const pdfFile = await createPDF(data);

    if (!WEB_APP_URL) {
      downloadPDF(pdfFile.dataUri, pdfFile.fileName);
      statusEl.textContent = "ดาวน์โหลด PDF แล้ว - ใส่ WEB_APP_URL เพื่อบันทึกไป Google Drive";
      return;
    }

    const payload = {
      ...data,
      pdf: {
        fileName: pdfFile.fileName,
        mimeType: "application/pdf",
        base64: pdfFile.base64
      }
    };

    statusEl.textContent = "กำลังส่ง PDF ไป Google Drive...";
    await fetch(WEB_APP_URL, {
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify(payload)
    });
    statusEl.textContent = "ส่งคำขอบันทึก PDF ไป Google Drive แล้ว";
  }catch(err){
    document.body.classList.remove("exporting");
    statusEl.textContent = "บันทึกไม่สำเร็จ: " + err.message;
  }
}

document.getElementById("btnSave").addEventListener("click", saveData);
document.getElementById("btnClear").addEventListener("click", () => {
  if(confirm("ต้องการล้างข้อมูลทั้งหมดใช่หรือไม่?")) location.reload();
});
