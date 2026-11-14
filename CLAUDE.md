# Python programming — Lecture notes

เว็บบทเรียน Python ของ อ. พราย (Prymania) · ผู้ใช้สื่อสารภาษาไทย · คู่มือผู้สอนอยู่ต้น `README.md`

## แก้ที่ต้นฉบับ แล้ว build

- เนื้อหาบทเรียนอยู่ที่ `private/course/course-*.mjs` → `node tools/lesson-builder/build.mjs` → ได้ `chapters/*.html`, เมนูใน `index.html`, `sw.js` (ห้ามแก้ไฟล์ที่ build สร้างตรง ๆ)
- ภาคผนวกแก้ที่ `tools/lesson-builder/appendix/*.html` · ตัวเลขคะแนนต้องตรงกับตาราง "การวัดผล" ใน `index.html`
- หน้าสถิติ (`c-stats`) และส่งข้อความ (`d-feedback`) ขึ้นเฉพาะเมื่อใส่ `GOATCOUNTER` / `FEEDBACK_URL` ใน build.mjs · Apps Script อยู่ `private/feedback/`
- ฟีเจอร์ปากกา/โหมดมืด/A+/ซ่อนเมนู/Quiz ย้ายมาจาก `D:\_claudeCalculus` (ดู `D:\_claudeCalculus\PORTING-GUIDE.md`)

## ของลับอยู่ใน `private/` (ไม่ขึ้นรีโป Public)

- `private/course/` ต้นฉบับมีเฉลย, `private/passwords.json` รหัสดูเฉลยต่อบท (`exercises`)
- build เข้ารหัสเฉลยแต่ละข้อ (AES-GCM, PBKDF2) เป็น `data-enc` · `KDF_ITER`/`SALT_TAG` ใน build.mjs ต้องตรงกับ `ITER`/`SALT_TAG` ใน `assets/lesson.js`
- ห้ามเขียนรหัสหรือเฉลยลงไฟล์ที่ขึ้น git (README, CLAUDE.md, chapters/ ฯลฯ)

## Git (2 รีโป)

| git dir ในเครื่อง | รีโป | สถานะ | ได้อะไร | คำสั่ง |
| --- | --- | --- | --- | --- |
| `.git` (remote `origin`) | `prymania/prymania-python` | Public + Pages (main, root) | ทุกอย่าง ยกเว้น `private/` (อยู่ใน .gitignore) | `git push origin main` |
| `.git-backup` | `prymania/prymania-python-backup` | Private | ทุกอย่าง รวม `private/` | `.\backup.ps1` |

- "push" หมายถึงทั้งสองคำสั่ง (push รีโปหลัก แล้วรัน `backup.ps1`) — ทำเมื่อผู้ใช้สั่งเท่านั้น
- ห้ามเอา `private/` ออกจาก `.gitignore` หรือ `git add -f private` ในรีโปหลัก
- ห้ามเปลี่ยนรีโป backup เป็น Public · ห้ามลบหรือ commit `.git-backup/`
- คำสั่ง git กับรีโป backup ต้องใช้ `git --git-dir=.git-backup --work-tree=. …` เสมอ
