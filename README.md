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
assets/gui/study-buddy.png         ภาพหน้าต่าง PySide6 ที่ render จากโปรแกรมจริง
tools/lesson-builder/course-*.mjs  เนื้อหาบทเรียน ตัวอย่าง และโจทย์
tools/lesson-builder/build.mjs     รัน source และสร้างหน้าเว็บ
requirements.txt                   แพ็กเกจ data/AI/GUI สำหรับตัวอย่าง
password.js                        รหัสผ่านฝั่ง browser สำหรับแบบฝึกหัด
```

แก้เนื้อหาที่ `tools/lesson-builder/course-core.mjs`, `course-applied.mjs` หรือเนื้อหาเสริมที่ `course-extensions.mjs` แล้วรัน builder ใหม่ บทเรียนมีตัวอย่างพร้อม output ที่รันจริงและแบบฝึกหัดเรียงระดับ อย่าแก้ HTML ที่สร้างใน `chapters/` โดยตรง เพราะการ build จะเขียนทับ

## กลุ่มแพ็กเกจในรายวิชา

- **NumPy**: array และการคำนวณแบบ vectorized
- **pandas**: ตารางข้อมูลและการทำความสะอาด
- **Matplotlib**: visualization และบันทึกกราฟ
- **scikit-learn**: train/test split, pipeline และโมเดล ML เบื้องต้น
- **PySide6**: widget, layout, signal/slot และ GUI
- โมดูลมาตรฐานที่ใช้: `json`, `csv`, `pathlib`, `urllib`, `statistics`, `math`

ตัวอย่างใช้ข้อมูล fixture หรือชุดข้อมูลที่ติดมากับ scikit-learn เพื่อให้ build ซ้ำได้โดยไม่ต้องพึ่ง Web API ภายนอก ภาพ GUI สร้างจาก widget ที่ render ด้วย PySide6 ในโหมด offscreen จึงไม่ต้องเปิดหน้าต่าง desktop ระหว่าง build

## เฉลยและรหัสผ่าน

รหัสผ่านตัวอย่างคือ `py` ตามด้วยเลขบทสองหลักและเลขข้อสองหลัก เช่น ข้อ 1 ของบท 1 ใช้ `py0101`; ข้อ 4 ของบท 20 ใช้ `py2004`

ข้อจำกัด: เว็บนี้เป็นไฟล์ static และรหัสผ่านตรวจใน JavaScript เพื่อความสะดวกในการสอน ผู้เปิดเว็บสามารถดูรหัสหรือเฉลยจากไฟล์ที่สร้างได้ จึงไม่ใช่ระบบรักษาความลับหรือระบบสอบออนไลน์
