# Python programming — Lecture notes

เว็บไซต์บทเรียน Python ภาษาไทยแบบ local สำหรับผู้เรียนที่เขียนโปรแกรมภาษาอื่นได้ แต่ยังไม่เคยใช้ Python บทที่ 1 แนะนำโครงสร้างโปรแกรม, Thonny และการรัน บทที่ 2 รวมตัวแปรกับชนิดข้อมูล ก่อนต่อยอดไปสู่ NumPy, pandas, visualization, machine learning และ GUI ด้วย PySide6

## เปิดเว็บไซต์

เปิด `index.html` ด้วย browser ได้โดยตรง ไม่ต้องเปิด web server และหน้าบทเรียน/ตัวอย่างข้อความทำงานแบบ offline

## สร้างหน้าใหม่และตรวจตัวอย่าง

ต้องใช้ Node.js 18+ และ Python 3.12+; GUI และบท Data/AI ต้องติดตั้ง dependencies ใน `requirements.txt`

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
node tools/lesson-builder/build.mjs
```

Builder รันตัวอย่างและเฉลยแบบฝึกหัดด้วย Python จริงก่อนสร้าง HTML ถ้าตัวอย่างใดรันไม่ผ่านจะหยุดพร้อมชื่อบท/ข้อและ error ไม่เขียน output จำลองแทน

## โครงสร้าง

```text
index.html                         หน้าแรกพร้อมเมนูบทแบบยุบ/ขยายและหัวข้อย่อยด้านซ้าย ค้นหา และกรองบท
chapters/chapter-01.html ...       หน้าแต่ละบท (สร้างอัตโนมัติ)
assets/site.css, site.js           ธีมหน้าแรกและเครื่องมือค้นหา
assets/lesson.css, lesson.js       รูปแบบบทเรียน ปุ่มคัดลอก และเปิดเฉลย
assets/python-path.svg             ภาพประกอบเส้นทางการเรียนรู้
assets/figures/*.svg               ภาพประกอบแนวคิด (เขียนด้วยมือ)
assets/figures/*.png, assets/gui/  กราฟและภาพหน้าต่างที่ builder สร้างจากการรันโค้ดจริง
tools/lesson-builder/course-basics.mjs     บทที่ 1–8
tools/lesson-builder/course-practice.mjs   บทที่ 9–13
tools/lesson-builder/course-data-ai.mjs    บทที่ 14–18
tools/lesson-builder/course-gui.mjs        บทที่ 19–20
tools/lesson-builder/course-helpers.mjs    รูปแบบข้อมูลบท หัวข้อ ตัวอย่าง และโจทย์
tools/lesson-builder/build.mjs     รัน source และสร้างหน้าเว็บ
requirements.txt                   แพ็กเกจ data/AI/GUI สำหรับตัวอย่าง
password.js                        รหัสผ่านฝั่ง browser สำหรับแบบฝึกหัด
```

แก้เนื้อหาที่ `tools/lesson-builder/course-*.mjs` แล้วรัน builder ใหม่ อย่าแก้ HTML ใน `chapters/` โดยตรง เพราะการ build จะเขียนทับ

แต่ละหัวข้อเป็นย่อหน้าสั้น ๆ และเพิ่ม `code`, `table`, `figure` หรือ `tip` ได้ แบบฝึกหัดมี `given`/`want`/`checklist` ซึ่งแสดงเป็นกล่อง "เข้าใจโจทย์" ฟิลด์เสริมที่ใช้ได้ทั้งหัวข้อ ตัวอย่าง และโจทย์:

- `stdin`: ค่าที่ผู้ใช้พิมพ์ให้ `input()` ซึ่งจะแสดงต่อท้ายคำถามใน output เหมือนหน้าจอจริง
- `files`: ไฟล์ข้อมูล เช่น CSV ที่เตรียมไว้ในโฟลเดอร์ชั่วคราวก่อนรัน และแสดงเนื้อหาบนหน้าเว็บ
- `plot`: path ของ PNG ที่บันทึกกราฟ Matplotlib (โค้ดจบด้วย `plt.show()` ได้ตามปกติ)
- `window: { file, demo }`: จับภาพหน้าต่าง PySide6 แทน `app.exec()` และรัน `demo` เพื่อจำลองการกรอกหรือคลิกก่อนจับภาพ
- `http`: คำตอบจำลองของ `requests.get` ทำให้ build ซ้ำได้โดยไม่ต้องต่ออินเทอร์เน็ต

## กลุ่มแพ็กเกจในรายวิชา

- **NumPy**: array และการคำนวณแบบ vectorized
- **pandas**: ตารางข้อมูลและการทำความสะอาด
- **Matplotlib**: visualization และบันทึกกราฟ
- **scikit-learn**: train/test split, pipeline และโมเดล ML เบื้องต้น
- **PySide6**: widget, layout, signal/slot และ GUI
- โมดูลมาตรฐานที่ใช้: `json`, `csv`, `pathlib`, `random`, `datetime`, `statistics`, `math`
- **requests**: เรียก Web API

ตัวอย่างใช้ข้อมูล fixture หรือชุดข้อมูลที่ติดมากับ scikit-learn เพื่อให้ build ซ้ำได้โดยไม่ต้องพึ่ง Web API ภายนอก ภาพ GUI สร้างจาก widget ที่ render ด้วย PySide6 ในโหมด offscreen จึงไม่ต้องเปิดหน้าต่าง desktop ระหว่าง build

## เฉลยและรหัสผ่าน

รหัสผ่านตัวอย่างคือ `py` ตามด้วยเลขบทสองหลักและเลขข้อสองหลัก เช่น ข้อ 1 ของบท 1 ใช้ `py0101`; ข้อ 4 ของบท 20 ใช้ `py2004`

ข้อจำกัด: เว็บนี้เป็นไฟล์ static และรหัสผ่านตรวจใน JavaScript เพื่อความสะดวกในการสอน ผู้เปิดเว็บสามารถดูรหัสหรือเฉลยจากไฟล์ที่สร้างได้ จึงไม่ใช่ระบบรักษาความลับหรือระบบสอบออนไลน์
