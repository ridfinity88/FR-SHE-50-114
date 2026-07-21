FR-SHE-50-114 HIRA Online Form v4

รายการแก้ไข v4:
- ปรับช่อง INTEND FUNCTION ไม่ให้ทับหัวข้อด้านซ้าย
- ลบปุ่ม พิมพ์ / Save PDF ออกจากระบบ
- ย้ายปุ่ม บันทึกข้อมูล และ ล้างข้อมูล ไปไว้ด้านขวาของกรอบแนบรูป
- วันที่ยังแสดงเป็นวันที่ปัจจุบันอัตโนมัติ
- ช่อง Input ที่ไม่ได้กรอกจะว่างเปล่า

วิธีใช้งาน GitHub Pages:
1. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ไปยัง repository
2. เปิดใช้งาน GitHub Pages
3. ตั้งค่า WEB_APP_URL ใน app.js เมื่อต้องการส่งข้อมูลเข้า Google Apps Script


=== Version 5 Updates ===
- ปรับช่อง INTEND FUCTION ให้ชิดกับเครื่องหมาย : มากขึ้น
- ปุ่มบันทึกข้อมูล / ล้างข้อมูล ขยายให้ใหญ่ขึ้นและอยู่ข้างกรอบแนบรูป
- ปุ่มบันทึกข้อมูลจะสร้าง PDF จากฟอร์มที่กรอกแล้ว
- ถ้ายังไม่ใส่ WEB_APP_URL ระบบจะดาวน์โหลด PDF สำหรับทดสอบ
- ถ้าใส่ WEB_APP_URL แล้ว ระบบจะส่ง PDF base64 ไป Google Apps Script เพื่อบันทึกลง Google Drive

วิธีเชื่อม Google Drive:
1. เปิดไฟล์ google_apps_script_code.gs แล้วคัดลอกโค้ดไปใส่ Google Apps Script
2. ใส่ค่า PDF_FOLDER_ID และ SHEET_ID
3. Deploy เป็น Web App
4. Copy Web App URL มาใส่ในตัวแปร WEB_APP_URL ใน app.js
