# Python programming — Lecture notes

เว็บไซต์บทเรียน Python ภาษาไทยแบบ local สำหรับผู้เรียนที่เขียนโปรแกรมภาษาอื่นได้ แต่ยังไม่เคยใช้ Python บทที่ 1 แนะนำโครงสร้างโปรแกรม, Thonny และการรัน บทที่ 2 รวมตัวแปรกับชนิดข้อมูล ก่อนต่อยอดไปสู่ NumPy, pandas, visualization, machine learning และ GUI ด้วย PySide6

---

## 🧑‍🏫 คู่มือผู้สอน (อ่านตรงนี้ก่อน)

### ภาพรวม: มี 2 รีโป

```text
                      โฟลเดอร์ D:\_claudePython ในเครื่อง
                 ┌──────────────────────────────────────────────┐
                 │  เว็บ (index.html, chapters/, assets/, sw.js) │
                 │  tools/  (ตัวสร้างเว็บ)                        │
                 │  private/ (ต้นฉบับมีเฉลย + รหัส) 🔒            │
                 └──────────────┬──────────────────┬────────────┘
       git push (หรือปุ่ม Sync)  │                  │  .\backup.ps1
         ส่งทุกอย่าง ยกเว้น private/ ▼                  ▼  ส่งทุกอย่าง รวม private/
   ┌───────────────────────────────┐   ┌────────────────────────────────────┐
   │ prymania-python     🌐 Public  │   │ prymania-python-backup   🔒 Private │
   │ เว็บที่นิสิตเปิด (GitHub Pages)    │   │ สำรองไว้กู้คืน ถ้าเครื่องเสีย            │
   │ .git                           │   │ .git-backup                         │
   └───────────────────────────────┘   └────────────────────────────────────┘
```

- `private/` อยู่ใน `.gitignore` จึง**ไม่ขึ้นรีโป Public** นิสิตจึงไม่เห็นเฉลยและรหัส
- รีโป backup ใช้ git อีกชุดในโฟลเดอร์ซ่อน `.git-backup` สั่งด้วย `.\backup.ps1` อย่างเดียว

### อยากทำอะไร แก้ที่ไหน

| อยากทำ | แก้ที่ |
| --- | --- |
| แก้เนื้อหา ตัวอย่าง แบบฝึกหัด เฉลย | `private/course/course-*.mjs` (บท 1–8 basics, 9–13 practice, 14–18 data-ai, 19–20 gui) |
| เปลี่ยนรหัสดูเฉลยของบท | `private/passwords.json` |
| ใส่ลิงก์ Quiz Google Form ของบท | `QUIZ_FORMS` ใน `tools/lesson-builder/build.mjs` (ใส่ id จาก `/forms/d/<id>/`) |
| เปลี่ยนลิงก์เช็คชื่อ | `CHECKIN_URL` ใน `tools/lesson-builder/build.mjs` |
| แก้เกณฑ์คะแนน / ข้อตกลง | `tools/lesson-builder/appendix/a-course.html` **และ** ตาราง "การวัดผล" ใน `index.html` ให้ตรงกัน |
| แก้หน้าวิธีใช้ปากกา | `tools/lesson-builder/appendix/b-pen.html` |
| แก้หน้าแรก | `index.html` (ยกเว้นเมนูซ้ายระหว่าง `<!-- course-nav -->` ซึ่ง build เขียนทับ) |
| แก้สี / หน้าตา / ปากกา | `assets/*.css`, `assets/ink.js` |

**ห้ามแก้ `chapters/*.html` และ `sw.js` ตรง ๆ** เพราะ build เขียนทับทุกครั้ง

### ทุกครั้งที่แก้เว็บ: build → ดู → push 2 ที่

เปิด Terminal ใน VS Code (Ctrl+`) แล้วพิมพ์ทีละบรรทัด:

```powershell
node tools/lesson-builder/build.mjs        # 1. สร้างหน้าเว็บใหม่ (รอจนขึ้น "สร้างเสร็จ")
python -m http.server 8000                 # 2. เปิด http://localhost:8000 ดูก่อน แล้วกด Ctrl+C เพื่อหยุด
git add -A
git commit -m "อธิบายสั้น ๆ ว่าแก้อะไร"
git push                                   # 3. ขึ้นเว็บนิสิต (รอ 1–2 นาที)
.\backup.ps1                               # 4. สำรองทุกอย่างรวม private/ ขึ้นรีโป backup
```

> ⚠️ **ปุ่ม Sync / Commit ใน VS Code ทำได้แค่ข้อ 3** ไม่ได้สำรอง `private/` — ต้องรัน `.\backup.ps1` เองทุกครั้งที่แก้ `private/`
>
> ถ้า PowerShell บอกว่ารันสคริปต์ไม่ได้ (running scripts is disabled) ให้ใช้ `powershell -ExecutionPolicy Bypass -File .\backup.ps1`

### ข้อห้าม

- ❌ ห้ามเอา `private/` ออกจาก `.gitignore` และห้าม `git add -f private` ในรีโปหลัก — เฉลยจะขึ้นรีโป Public
- ❌ ห้ามเปลี่ยนรีโป `prymania-python-backup` เป็น Public
- ❌ ห้ามลบโฟลเดอร์ `.git-backup` (ถ้าลบไปแล้ว ทำตาม "ตั้งเครื่องใหม่" ข้อ 3–4)
- ❌ ห้ามแชร์ไฟล์ `private/passwords.json` ให้นิสิต บอกรหัสในห้องเรียนเท่านั้น
- ⚠️ ประวัติ git เก่าของรีโป Public (ก่อน commit 8136a9e) ยังมีเฉลยและรหัสชุดเก่า (`py0101`…) อยู่ รหัสชุดเก่าใช้กับเว็บปัจจุบันไม่ได้แล้ว

### ตั้งเครื่องใหม่ (หรือกู้คืนเมื่อเครื่องเสีย)

ต้องมี Git, Node.js 18+, Python 3.12+ แล้วพิมพ์ใน PowerShell:

```powershell
cd D:\
git clone https://github.com/prymania/prymania-python.git _claudePython                  # 1. รีโปเว็บ
cd _claudePython
git clone --bare https://github.com/prymania/prymania-python-backup.git .git-backup      # 2. รีโป backup
git --git-dir=.git-backup config core.bare false
git --git-dir=.git-backup --work-tree=. checkout main -- private                        # 3. ดึง private/ กลับมา
git --git-dir=.git-backup --work-tree=. reset -q                                         # 4. ให้ backup รู้สถานะไฟล์ปัจจุบัน
Set-Content .git-backup\info\exclude ".venv/`n.git-backup/`n__pycache__/"
python -m venv .venv                                                                     # 5. แพ็กเกจสำหรับ build
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
node tools/lesson-builder/build.mjs                                                      # 6. ลอง build
```

ถ้ารีโปเว็บหายด้วย: รีโป backup มีทุกไฟล์ ใช้ `git clone https://github.com/prymania/prymania-python-backup.git` ได้ทันที (แต่อย่า push โฟลเดอร์นั้นไปรีโป Public)

### แก้ปัญหา

| อาการ | ทำอย่างไร |
| --- | --- |
| build บอก `ไม่พบ private/passwords.json` | ยังไม่มี `private/` ในเครื่อง → ทำ "ตั้งเครื่องใหม่" ข้อ 2–4 |
| push แล้วเว็บยังเป็นของเก่า | รอ 1–2 นาที แล้วรีเฟรช 1–2 ครั้ง (เว็บมีสำเนา offline โหลดของใหม่ในการเปิดครั้งถัดไป) |
| นิสิตใส่รหัสถูกแต่เปิดเฉลยไม่ได้ | ตรวจว่าแก้ `passwords.json` แล้ว build + push หรือยัง · ต้องเปิดผ่าน https (เว็บจริง) หรือไฟล์ในเครื่อง |
| `backup.ps1` ขึ้น `STOP: private/ is tracked by the PUBLIC repo` | ห้าม push อะไร ให้ถามผู้ช่วยก่อน (มีคนเผลอ add `private/` เข้ารีโปหลัก) |
| `backup.ps1` push ไม่ผ่าน / ถามรหัส | login GitHub ใหม่ใน VS Code แล้วรันซ้ำ |
| หัวข้อ "เก็บคะแนนท้ายบท" ไม่ขึ้น | บทนั้นยังไม่มี id ใน `QUIZ_FORMS` → ใส่แล้ว build + push |

---

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
assets/lesson.css, lesson.js       รูปแบบบทเรียน (layout และธีมโค้ดเดียวกับเว็บ Java) ปุ่มคัดลอก และเปิดเฉลย
assets/course-nav.css, .js         เมนูด้านซ้ายที่ใช้ร่วมกันทุกหน้า (จำบทที่กางและตำแหน่งเมนูข้ามหน้า)
assets/course-extras.css           ฟีเจอร์ที่ย้ายมาจากเว็บ Calculus: ปากกา ภาคผนวก รูปผู้สอน ซ่อน/แสดงเมนู
assets/ink.js                      ปากกาเขียนบนหน้าเว็บ (Apple Pencil/เมาส์) หมึกเก็บใน localStorage คีย์ ink:python/<ไฟล์>
assets/icon/prymania.jpg           รูปผู้สอนท้ายเมนู (ครอปและลบ EXIF/GPS แล้ว ห้ามแทนด้วยไฟล์ต้นฉบับ)
chapters/appendix-*.html           ภาคผนวก A เกณฑ์คะแนน, B วิธีใช้ปากกา (สร้างอัตโนมัติ)
tools/lesson-builder/appendix/     ★ เนื้อหาภาคผนวกเป็น HTML — แก้ที่นี่ (ตัวเลขคะแนนต้องตรงกับตาราง "การวัดผล" ใน index.html)
assets/python-path.svg             ภาพประกอบเส้นทางการเรียนรู้
assets/figures/*.svg               ภาพประกอบแนวคิด (เขียนด้วยมือ)
assets/figures/*.png, assets/gui/  กราฟและภาพหน้าต่างที่ builder สร้างจากการรันโค้ดจริง
private/course/course-basics.mjs   บทที่ 1–8   ┐ ต้นฉบับบทเรียน (มีโค้ดเฉลย) อยู่ใน private/
private/course/course-practice.mjs บทที่ 9–13  │ ซึ่งไม่ขึ้น git — ดู private/README.md
private/course/course-data-ai.mjs  บทที่ 14–18 │
private/course/course-gui.mjs      บทที่ 19–20 ┘
private/passwords.json             รหัสดูเฉลยแบบฝึกหัดต่อบท (ไม่ขึ้น git)
tools/lesson-builder/course-helpers.mjs    รูปแบบข้อมูลบท หัวข้อ ตัวอย่าง และโจทย์
tools/lesson-builder/highlight.mjs         ระบายสี syntax ของ Python ตอน build
tools/lesson-builder/build.mjs     รัน source และสร้างหน้าเว็บ
requirements.txt                   แพ็กเกจ data/AI/GUI สำหรับตัวอย่าง
sw.js                              service worker ให้เปิดเว็บได้แม้ไม่มีเน็ต (builder สร้าง)
```

แก้เนื้อหาที่ `private/course/course-*.mjs` แล้วรัน builder ใหม่ เมนูด้านซ้ายถูกเขียนใหม่ทุกครั้งที่ build ทั้งในหน้าบทและใน `index.html` ระหว่าง `<!-- course-nav -->` กับ `<!-- /course-nav -->` (ถ้าเพิ่มบทใหม่ ให้เพิ่มชื่อสั้นใน `NAV_TITLES` ของ `build.mjs`) อย่าแก้ HTML ใน `chapters/` โดยตรง เพราะการ build จะเขียนทับ

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

เฉลยแบบฝึกหัดท้ายบทแต่ละข้อถูกเข้ารหัสตอน build (AES-GCM, กุญแจ PBKDF2 จากรหัสของบทนั้น) หน้าเว็บจึงไม่มีทั้งรหัสและเฉลยแบบอ่านได้ นิสิตใส่รหัสของบทครั้งเดียวก็เปิดเฉลยได้ทุกข้อในบทนั้นจนปิดแท็บ

- รหัสอยู่ที่ `private/passwords.json` (`exercises` → เลขบท) แก้แล้วรัน builder ใหม่
- `KDF_ITER`/`SALT_TAG` ใน `build.mjs` ต้องตรงกับ `ITER`/`SALT_TAG` ใน `assets/lesson.js`
- การถอดรหัสใช้ WebCrypto ซึ่งทำงานบน https, localhost และการเปิดไฟล์ในเครื่อง

## เก็บคะแนนท้ายบท (Quiz)

ท้ายบทที่มี Quiz จะมีหัวข้อ "📝 เก็บคะแนนท้ายบท": ขั้นที่ 1 เช็คชื่อ → ขั้นที่ 2 เปิด Quiz (Google Form) ใส่ id ฟอร์มใน `QUIZ_FORMS` ของ `build.mjs` (ส่วน `/forms/d/<id>/` ของลิงก์ นิสิตใช้ `/viewform` ไม่ใช่ `/edit`) บทที่ไม่มี id จะไม่มีหัวข้อนี้
