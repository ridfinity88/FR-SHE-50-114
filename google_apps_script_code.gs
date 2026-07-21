/*******************************************************
 * Google Apps Script for HIRA Online Form
 * 1) Create a Google Drive folder for PDF reports.
 * 2) Create a Google Sheet for responses.
 * 3) Replace PDF_FOLDER_ID and SHEET_ID below.
 * 4) Deploy as Web App: Execute as Me, Access Anyone with link.
 * 5) Copy Web App URL to WEB_APP_URL in app.js.
 *******************************************************/
const PDF_FOLDER_ID = 'PUT_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE';
const SHEET_ID = 'PUT_YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Response';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    if (!body.pdf || !body.pdf.base64) {
      throw new Error('No PDF data received');
    }

    const bytes = Utilities.base64Decode(body.pdf.base64);
    const fileName = body.pdf.fileName || ('HIRA_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss') + '.pdf');
    const blob = Utilities.newBlob(bytes, 'application/pdf', fileName);
    const file = DriveApp.getFolderById(PDF_FOLDER_ID).createFile(blob);

    const header = body.header || {};
    const hazards = body.hazards || [];
    const hazardSummary = hazards.map(function(h) {
      return [h.code, h.category, h.remark, h.op ? 'OP' : '', h.mt ? 'MT' : '', h.ot ? 'OT' : ''].filter(String).join(' | ');
    }).join('\n');

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) sh = ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow([
        'Timestamp', 'Hazard_Date', 'Machine', 'Model', 'Plant', 'Serial_No',
        'Intended_Function', 'Hazard_Count', 'Hazard_Summary', 'PDF_File_Name', 'PDF_Link'
      ]);
    }
    sh.appendRow([
      new Date(),
      header.hazard_identification_date || '',
      header.machine || '',
      header.model || '',
      header.plant || '',
      header.serial_no || '',
      header.intended_function || '',
      hazards.length,
      hazardSummary,
      fileName,
      file.getUrl()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ok: true, fileUrl: file.getUrl()}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ok: false, error: err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
