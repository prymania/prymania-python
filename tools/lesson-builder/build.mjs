import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { highlightPython } from "./highlight.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(ROOT, "chapters");
const PYTHON = process.env.PYTHON || path.join(ROOT, ".venv", "Scripts", "python.exe");

// ---------------- ของลับอยู่ใน private/ (ไม่ขึ้น git) ----------------
// private/course/*.mjs = ต้นฉบับบทเรียน (มีโค้ดเฉลยแบบฝึกหัด), private/passwords.json = รหัสดูเฉลยต่อบท
const PRIVATE = path.join(ROOT, "private");
if (!fs.existsSync(path.join(PRIVATE, "passwords.json"))) {
  throw new Error("ไม่พบ private/passwords.json และต้นฉบับใน private/course/ — ดู private/README.md (โฟลเดอร์นี้ไม่ขึ้น git ต้องสำรองเอง)");
}
const loadCourse = async (file, name) => (await import(pathToFileURL(path.join(PRIVATE, "course", file)).href))[name];
const chapters = [
  ...await loadCourse("course-basics.mjs", "basics"),
  ...await loadCourse("course-practice.mjs", "practice"),
  ...await loadCourse("course-data-ai.mjs", "dataAi"),
  ...await loadCourse("course-gui.mjs", "guiProject"),
];
const PASSWORDS = JSON.parse(fs.readFileSync(path.join(PRIVATE, "passwords.json"), "utf8"));

// เข้ารหัสเฉลยแต่ละข้อด้วย AES-GCM (กุญแจ = PBKDF2 ของรหัสบทนั้น) แบบเดียวกับเว็บ Calculus
// หน้าเว็บเก็บแค่เฉลยที่เข้ารหัสแล้ว · salt/iv คำนวณจากเนื้อหา → build ซ้ำได้ไฟล์เดิม
const KDF_ITER = 150000;   // ต้องตรงกับ ITER ใน assets/lesson.js
const SALT_TAG = "py-prymania";   // ต้องตรงกับ SALT_TAG ใน assets/lesson.js
const keys = new Map();
function encrypt(kind, chap, plain) {
  const pw = String(PASSWORDS[kind]?.[String(chap)] ?? "");
  if (!pw) throw new Error(`private/passwords.json: ยังไม่มีรหัส ${kind} ของบทที่ ${chap}`);
  const id = `${kind}:${chap}:${pw}`;
  if (!keys.has(id)) {
    const salt = crypto.createHash("sha256").update(`${SALT_TAG}:${kind}:${chap}`).digest().subarray(0, 16);
    keys.set(id, crypto.pbkdf2Sync(pw, salt, KDF_ITER, 32, "sha256"));
  }
  const key = keys.get(id);
  const data = Buffer.from(plain, "utf8");
  const iv = crypto.createHash("sha256").update(Buffer.concat([key, data])).digest().subarray(0, 12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([cipher.update(data), cipher.final(), cipher.getAuthTag()]);
  return Buffer.concat([iv, body]).toString("base64");
}

// ---------------- เก็บคะแนนท้ายบท (เช็คชื่อ → Quiz Google Form) ----------------
// id ฟอร์มคือส่วน /forms/d/<id>/ ของลิงก์ (นิสิตใช้ /viewform ห้ามใช้ลิงก์ /edit)
// บทที่ไม่มี id ในนี้จะไม่มีหัวข้อ "เก็บคะแนนท้ายบท" · เกณฑ์: บทที่ 1–10 บทละ 5 คะแนน (ภาคผนวก A)
const QUIZ_FORMS = {
  // 1: "id ฟอร์ม Quiz บทที่ 1",
};
const QUIZ_POINTS = 5;
// ระบบเช็คชื่อ (Apps Script ชุดเดียวกับวิชา Calculus) — ปุ่มขั้นที่ 1 ก่อนเปิด Quiz ทุกบท
const CHECKIN_URL = "https://script.google.com/a/macros/msu.ac.th/s/AKfycbzpTf65VMcSGo4MXHRpm5UwfOpaCDismTxdNom5TLgBY6_NvAO_mg51YacITznabpgrHw/exec?page=teacher";

// กลุ่มบทในเมนูด้านซ้ายและหัวบท
const GROUPS = {
  foundation: { nav: "เริ่มต้นกับ Python", kicker: "พื้นฐาน" },
  practice: { nav: "ฝึกเขียนและใช้งาน", kicker: "ใช้งานจริง" },
  ai: { nav: "ต่อยอดข้อมูลและ AI", kicker: "ข้อมูลและ AI" },
  gui: { nav: "GUI และโปรเจกต์", kicker: "GUI / โปรเจกต์" },
};

// ชื่อบทแบบสั้นที่แสดงในเมนู (ชื่อเต็มอยู่ในหน้าบท)
const NAV_TITLES = {
  "โครงสร้างโปรแกรม Python, IDE และการรัน": "เริ่มต้น Python และ Thonny",
  "ตัวแปร ชนิดข้อมูล และการรับ/แสดงผล": "ตัวแปรและชนิดข้อมูล",
  "ตัวดำเนินการและนิพจน์": "ตัวดำเนินการ",
  "เงื่อนไขและการตัดสินใจ": "เงื่อนไข",
  "การทำซ้ำด้วยลูป": "การทำซ้ำ (ลูป)",
  "ข้อความและการจัดการ string": "ข้อความ (string)",
  "โครงสร้างข้อมูล: list, tuple, set และ dict": "list · tuple · set · dict",
  "ฟังก์ชันและการแบ่งโปรแกรม": "ฟังก์ชัน",
  "ข้อผิดพลาด การจัดการ exception และ debug": "Error และการ debug",
  "ไฟล์ ข้อมูล CSV และ JSON": "ไฟล์ CSV และ JSON",
  "โมดูล virtual environment และ pip": "โมดูลและ pip",
  "เขียนโปรแกรมเชิงวัตถุด้วย class": "class และ object",
  "เรียกใช้ Web API และแลกเปลี่ยน JSON": "Web API",
  "NumPy สำหรับการคำนวณตัวเลข": "NumPy",
  "จัดการตารางข้อมูลด้วย pandas": "pandas",
  "สร้างกราฟด้วย Matplotlib": "Matplotlib",
  "Machine Learning เบื้องต้นด้วย scikit-learn": "Machine Learning",
  "แนวคิด Neural Network และการฝึกโมเดล": "Neural Network",
  "สร้าง GUI สมัยใหม่ด้วย PySide6": "GUI ด้วย PySide6",
  "โปรเจกต์ปลายทาง: Course Planner + AI": "โปรเจกต์ Course Planner",
};
const LEVELS = { 1: "ง่าย", 2: "ปานกลาง", 3: "ท้าทาย" };

const pad = (n) => String(n).padStart(2, "0");

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

// `code` ในข้อความ → <code>
function fmt(value) {
  return esc(value).replace(/`([^`]+)`/g, "<code>$1</code>");
}

// ---------------- รันโค้ด ----------------

// เมื่อมี stdin ให้ input() พิมพ์ค่าที่ป้อนลง output ด้วย (ครอบด้วย \x01 ... \x02 เพื่อขีดเส้นใต้บนหน้าเว็บ)
const ECHO_INPUT = `import builtins as _b
_raw_input = _b.input
def _echo_input(prompt=""):
    value = _raw_input(prompt)
    print("\\x01" + value + "\\x02")
    return value
_b.input = _echo_input
`;

// plot: บันทึกกราฟ Matplotlib ที่วาดไว้ (โค้ดของผู้เรียนจบด้วย plt.show() ได้ตามปกติ)
function plotHooks(file) {
  return {
    before: `import warnings as _w
_w.filterwarnings("ignore", message=".*non-interactive.*")
`,
    after: `
import matplotlib.pyplot as _plt
_plt.gcf().savefig(${JSON.stringify(abs(file))}, dpi=110, bbox_inches="tight")
`,
  };
}

// window: แทน app.exec() ด้วยการจับภาพหน้าต่าง (รันแบบ offscreen ไม่ต้องรอผู้ใช้ปิดหน้าต่าง)
// demo คือโค้ดจำลองการใช้งาน เช่น พิมพ์ชื่อแล้วกดปุ่ม ก่อนจับภาพ
// ชื่อหน้าต่างส่งกลับทาง stdout หลัง \x03 เพื่อนำไปทำแถบชื่อหน้าต่างบนหน้าเว็บ
function windowHooks(file, demo = "") {
  return {
    before: `import sys as _sys
import PySide6.QtWidgets as _qtw
from PySide6.QtGui import QFont as _QFont
class _CaptureApp(_qtw.QApplication):
    def __init__(self, *args):
        super().__init__(*args)
        self.setFont(_QFont("Leelawadee UI", 10))
    def exec(self):
        exec(${JSON.stringify(demo)}, vars(_sys.modules["__main__"]))
        self.processEvents()
        _shown = [w for w in self.topLevelWidgets() if w.isVisible()]
        _shown[0].grab().save(${JSON.stringify(abs(file))})
        print("\\x03" + _shown[0].windowTitle())
        return 0
_qtw.QApplication = _CaptureApp
`,
    after: "",
  };
}

// http: แทน requests.get ด้วยคำตอบจำลอง เพื่อให้ build ซ้ำได้โดยไม่ต้องต่ออินเทอร์เน็ต
// รับคำตอบเดียว หรือ list ของคำตอบตามลำดับการเรียก: { status, json } หรือ { timeout: true }
function httpHooks(responses) {
  return {
    before: `import json as _json, requests as _requests
_responses = _json.loads(${JSON.stringify(JSON.stringify([responses].flat()))})
class _FakeResponse:
    def __init__(self, url, params, spec):
        self.status_code = spec.get("status", 200)
        self._data = spec.get("json")
        self.text = _json.dumps(self._data, ensure_ascii=False)
        self.url = _requests.Request("GET", url, params=params).prepare().url
        self.ok = self.status_code < 400
    def json(self):
        return self._data
    def raise_for_status(self):
        if not self.ok:
            raise _requests.HTTPError(f"{self.status_code} Client Error for url: {self.url}", response=self)
def _fake_get(url, params=None, **_kwargs):
    spec = _responses.pop(0) if len(_responses) > 1 else _responses[0]
    if spec.get("timeout"):
        raise _requests.Timeout("Read timed out")
    return _FakeResponse(url, params, spec)
_requests.get = _fake_get
`,
    after: "",
  };
}

function abs(file) {
  return path.join(ROOT, file).replaceAll("\\", "/");
}

// รันแต่ละโค้ดในโฟลเดอร์ชั่วคราว พร้อมไฟล์ข้อมูลที่กำหนดใน item.files
// คืน { text, title } — text คือ output, title คือชื่อหน้าต่าง (เฉพาะงาน GUI)
function runPython(code, label, item = {}) {
  const hooks = [
    item.stdin === undefined ? null : { before: ECHO_INPUT, after: "" },
    item.plot ? plotHooks(item.plot) : null,
    item.window ? windowHooks(item.window.file, item.window.demo) : null,
    item.http ? httpHooks(item.http) : null,
  ].filter(Boolean);
  const source = hooks.map((hook) => hook.before).join("") + code + hooks.map((hook) => hook.after).join("");
  const workdir = fs.mkdtempSync(path.join(os.tmpdir(), "pylesson-"));
  for (const [name, content] of Object.entries(item.files ?? {})) fs.writeFileSync(path.join(workdir, name), content, "utf8");
  const result = spawnSync(PYTHON, ["-c", source], {
    cwd: workdir,
    input: item.stdin ?? "",
    encoding: "utf8",
    timeout: 45000,
    env: {
      ...process.env,
      PYTHONIOENCODING: "utf-8",
      MPLBACKEND: "Agg",
      QT_QPA_PLATFORM: "offscreen",
      QT_QPA_FONTDIR: path.join(process.env.WINDIR ?? "C:\\Windows", "Fonts"),
    },
  });
  fs.rmSync(workdir, { recursive: true, force: true });
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  if (result.status !== 0) {
    throw new Error(`${label} failed (exit ${result.status})\n${result.stderr}\n${result.stdout}\n--- source ---\n${code}`);
  }
  let stdout = (result.stdout || "").replace(/\r\n/g, "\n");
  let title = "";
  stdout = stdout.replace(/\x03([^\n]*)\n?/, (_, name) => { title = name; return ""; }).trimEnd();
  const stderr = (result.stderr || "").replace(/\r\n/g, "\n").trim();
  return { text: stderr ? `${stdout}${stdout ? "\n" : ""}[stderr]\n${stderr}` : stdout, title };
}

// ---------------- ส่วนประกอบ HTML ----------------

// output: escape แล้วขีดเส้นใต้ค่าที่ผู้ใช้พิมพ์
function outputHtml(text) {
  return esc(text).replace(/\x01([^\x02]*)\x02/g, '<b class="stdin">$1</b>');
}

// แผงโค้ด: แถบชื่อไฟล์ (ปุ่มคัดลอกถูกเพิ่มโดย lesson.js) + โค้ดที่ระบายสี
function codeBlock(code, file) {
  return `<div class="code-block"><div class="code-head"><span class="code-file">${esc(file)}</span></div><pre class="source-code"><code>${highlightPython(code)}</code></pre></div>`;
}

function renderFiles(item) {
  const files = Object.entries(item.files ?? {});
  if (!files.length) return "";
  return `<div class="data-files">${files.map(([name, content]) =>
    `<div class="file-box"><div class="file-head">ไฟล์ข้อมูล <b>${esc(name)}</b> (อยู่โฟลเดอร์เดียวกับโปรแกรม)</div><pre>${esc(content.trimEnd())}</pre></div>`).join("")}</div>`;
}

function outputLabel(item, base = "ผลลัพธ์") {
  if (item.window) return `${base} · หน้าต่างที่ได้จากการรันโค้ดนี้${item.window.demo ? " (จำลองการกรอกและกดปุ่มแล้ว)" : ""}`;
  if (item.plot) return `${base} · กราฟที่ได้จากการรันโค้ดนี้`;
  if (item.stdin !== undefined) return `${base} · ตัวที่ขีดเส้นใต้คือค่าที่ผู้ใช้พิมพ์`;
  if (item.http) return `${base} · จากข้อมูลตัวอย่างของ API (ไม่ได้ต่ออินเทอร์เน็ตจริงตอนสร้างหน้า)`;
  return base;
}

// ภาพหน้าต่าง GUI หรือกราฟ + ข้อความที่พิมพ์ออกมา (ถ้ามี)
function outputBody(item, run) {
  const text = run.text ? `<pre${item.window || item.plot ? ' class="gui-console"' : ""}>${outputHtml(run.text)}</pre>` : "";
  if (item.window) {
    const shot = `<figure class="gui-shot"><div class="gui-titlebar">${esc(run.title || " ")}</div><img src="../${esc(item.window.file)}" alt="ภาพหน้าต่าง ${esc(run.title)}" loading="lazy"></figure>`;
    return `<div class="gui-stage">${shot}</div>${text}`;
  }
  if (item.plot) {
    return `<div class="gui-stage"><img class="plot-shot" src="../${esc(item.plot)}" alt="${esc(item.alt ?? "กราฟที่ได้จากการรันโค้ด")}" loading="lazy"></div>${text}`;
  }
  return `<pre>${outputHtml(run.text || "(ไม่มีข้อความแสดงผล)")}</pre>`;
}

function runBlock(item, code, file, label) {
  const run = runPython(code, label, item);
  const gui = item.window || item.plot ? " is-gui" : "";
  return `<div class="source-example-grid"><div class="source-field">${codeBlock(code, file)}</div><div class="source-output${gui}"><span>${outputLabel(item)}</span>${outputBody(item, run)}</div></div>`;
}

function renderTopic([heading, detail, extra = {}], chapterNo, topicNo) {
  const num = `${chapterNo}.${topicNo}`;
  const parts = [`<p>${fmt(detail)}</p>`];
  if (extra.figure) {
    parts.push(`<figure class="concept-figure"><img src="../${esc(extra.figure.src)}" alt="${esc(extra.figure.alt)}" loading="lazy"><figcaption>${fmt(extra.figure.caption ?? extra.figure.alt)}</figcaption></figure>`);
  }
  if (extra.table) {
    const head = extra.table.head.map((cell) => `<th>${fmt(cell)}</th>`).join("");
    const rows = extra.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${fmt(cell)}</td>`).join("")}</tr>`).join("");
    parts.push(`<div class="table-scroll"><table class="comparison-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`);
  }
  if (extra.files) parts.push(renderFiles(extra));
  if (extra.code) parts.push(runBlock(extra, extra.code, `topic_${chapterNo}_${topicNo}.py`, `Chapter ${chapterNo}, topic ${topicNo}`));
  if (extra.tip) parts.push(`<div class="callout tip"><span class="box-title">จำง่าย ๆ</span><p>${fmt(extra.tip)}</p></div>`);
  return `<article class="subtopic" id="topic-${topicNo}"><h3>${num} ${esc(heading)}</h3>${parts.join("")}</article>`;
}

function renderExample(example, chapterNo, exampleNo) {
  const walkthrough = `<div class="walkthrough"><strong>อธิบาย</strong><ol>${example.steps.map((step) => `<li>${fmt(step)}</li>`).join("")}</ol></div>`;
  return `<div class="source-example">
    <h4><span class="ex-num">ตัวอย่าง ${chapterNo}.${exampleNo}</span>${esc(example.title)}</h4>
    <p class="concept-line">${fmt(example.idea)}</p>
    ${renderFiles(example)}
    ${runBlock(example, example.code, `example_${chapterNo}_${exampleNo}.py`, `Chapter ${chapterNo}, example ${exampleNo}`)}
    ${walkthrough}
  </div>`;
}

function renderExercise(exercise, chapterNo, exerciseNo) {
  const answerId = `${String(chapterNo).padStart(2, "0")}.${exerciseNo}`;
  const run = runPython(exercise.code, `Exercise ${answerId}`, exercise);
  const checklist = exercise.checklist.map((item) => `<li>${fmt(item)}</li>`).join("");
  const facts = [["โจทย์ให้", exercise.given], ["ต้องหา", exercise.want]]
    .filter(([, value]) => value)
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${fmt(value)}</dd></div>`).join("");
  const spec = `<div class="ex-spec"><strong>เข้าใจโจทย์</strong>${facts ? `<dl class="ex-facts">${facts}</dl>` : ""}<strong>วิธีคิด</strong><ol>${checklist}</ol></div>`;
  return `<article class="end-exercise">
    <h3><span class="exercise-id">ข้อ ${chapterNo}.${exerciseNo}</span>${esc(exercise.title)}<span class="level level-${exercise.level}">${LEVELS[exercise.level]}</span></h3>
    <div class="ex-body"><p>${fmt(exercise.task)}</p></div>
    ${renderFiles(exercise)}
    ${spec}
    <div class="ex-sample"><strong>${outputLabel(exercise, "ตัวอย่างผลลัพธ์")}</strong>${outputBody(exercise, run)}</div>
    <div class="answer-gate" data-answer-id="${answerId}" data-chapter="${chapterNo}">
      <button class="answer-open" type="button">🔒 ใส่รหัสเพื่อดูเฉลย</button>
      <form class="password-form" hidden>
        <label>รหัสดูเฉลยบทที่ ${chapterNo} (ใส่ครั้งเดียว เปิดได้ทุกข้อในบท)<input type="password" autocomplete="off" required></label>
        <button class="password-submit" type="submit">เปิดเฉลย</button>
        <p class="password-message" aria-live="polite"></p>
      </form>
      <div class="answer-content" hidden data-enc="${encrypt("exercises", chapterNo, `<h4 tabindex="-1">แนวคำตอบและเหตุผล</h4>
        <p>${fmt(exercise.explain)}</p>${codeBlock(exercise.code, `ex_${chapterNo}_${exerciseNo}.py`)}`)}"></div>
    </div>
  </article>`;
}

// หัวข้อ "เก็บคะแนนท้ายบท" ต่อจากแบบฝึกหัด: ขั้นที่ 1 เช็คชื่อ → ขั้นที่ 2 ทำ Quiz (คัดลอกจาก quiz_block ของเว็บ Calculus)
function quizBlock(no) {
  const id = QUIZ_FORMS[no];
  if (!id) return "";
  return `<section class="quiz-score" id="quiz" aria-labelledby="quiz-heading">
        <h2 id="quiz-heading">📝 เก็บคะแนนท้ายบท <span class="level level-3">มีคะแนน</span></h2>
        <p class="quiz-login">🔐 Login ด้วยอีเมลมหาวิทยาลัย <b>@msu.ac.th</b> เท่านั้น</p>
        <p class="quiz-lead">คำถามท้ายบทที่ ${no} (Quiz) · ${QUIZ_POINTS} คะแนน · ส่งได้ครั้งเดียว — ทำตามลำดับ 2 ขั้น</p>
        <ol class="quiz-steps">
          <li class="quiz-card checkin"><div class="quiz-ico" aria-hidden="true">🙋</div><div>
            <h4><span class="quiz-no">1</span>เช็คชื่อก่อนสอบ</h4>
            <p>เช็คชื่อเข้าเรียนในคาบ — ไม่ได้เช็คชื่อ = ไม่ได้คะแนนคำถามท้ายบทนี้</p>
            <a class="quiz-btn checkin" href="${esc(CHECKIN_URL)}" target="_blank" rel="noopener">เช็คชื่อ ↗</a>
          </div></li>
          <li class="quiz-card"><div class="quiz-ico" aria-hidden="true">📝</div><div>
            <h4><span class="quiz-no">2</span>ทำ Quiz บทที่ ${no} (Google Form)</h4>
            <p>ต้องใช้ <b>รหัส Quiz</b> ที่อาจารย์บอกในห้องเรียน จึงจะทำส่วนถัดไปได้</p>
            <a class="quiz-btn" href="https://docs.google.com/forms/d/${esc(id)}/viewform" target="_blank" rel="noopener">เปิด Quiz บทที่ ${no} ↗</a>
          </div></li>
        </ol>
        <p class="quiz-note">แบบฝึกหัดท้ายบทด้านบนไม่เก็บคะแนน · ดูกติกาคะแนนทั้งหมดที่ <a href="appendix-a-course.html">ภาคผนวก A · เกณฑ์คะแนน</a></p>
      </section>`;
}

// ---------------- ภาคผนวก (เนื้อหาเขียนเป็น HTML ใน tools/lesson-builder/appendix/) ----------------

// คัดลอกมาจากเว็บ Calculus (D:/_claudeCalculus/build/src/appendix-c-course.html, appendix-d-pen.html)
// หัวข้อในเมนูดึงจาก <h2 id="..."> ของแต่ละไฟล์
const APPENDICES = [
  { letter: "A", file: "appendix-a-course.html", src: "a-course.html", nav: "เกณฑ์คะแนน", title: "เกณฑ์คะแนน",
    kicker: "ภาคผนวก A · COURSE GUIDE", sub: "คะแนนมาจากไหน ตัดเกรดอย่างไร และข้อตกลงที่เราใช้ร่วมกันตลอดเทอม" },
  { letter: "B", file: "appendix-b-pen.html", src: "b-pen.html", nav: "วิธีใช้ปากกา", title: "วิธีใช้ปากกาเขียนบนหน้าเว็บ",
    kicker: "ภาคผนวก B · HOW TO", sub: "เขียน ไฮไลต์ และจดโน้ตทับบทเรียนด้วย Apple Pencil หรือเมาส์ พร้อมวิธีบันทึกและสำรองหมึก" },
].map((appendix) => {
  const body = fs.readFileSync(path.join(HERE, "appendix", appendix.src), "utf8").replace(/^<!--[^\n]*-->\r?\n/, "");
  const topics = [...body.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map(([, id, heading]) => [id, heading]);
  return { ...appendix, body, topics };
});

// ---------------- เมนูด้านซ้าย (ใช้ร่วมกันทุกหน้า รวม index.html) ----------------

// base: path ไปโฟลเดอร์ chapters/ จากหน้าที่แสดง, current: ชื่อไฟล์ของหน้านี้ (ถ้าเป็นหน้าบทหรือภาคผนวก)
// คลิกชื่อบทแล้วเปิดหน้านั้นเลย ส่วนลูกศรด้านขวาใช้กาง/พับหัวข้อย่อย
function renderCourseNav({ base = "", current = null } = {}) {
  const entry = ({ file, number, title, group, links, search }) => {
    const here = file === current;
    const href = (hash) => (here ? hash : `${base}${file}${hash}`);
    const titleHref = here ? "#lesson-content" : `${base}${file}`;
    return `<details class="nav-chapter" data-group="${group}" data-search="${esc(search)}"${here ? " open" : ""}><summary${here ? ' aria-current="page"' : ""}><span class="nav-number">${number}</span><a class="nav-title" href="${titleHref}">${esc(title)}</a></summary><div class="nav-topics">${links(href).join("")}</div></details>`;
  };
  let previousGroup = "";
  const items = chapters.map((chapter, index) => {
    const number = index + 1;
    const label = chapter.group === previousGroup ? "" : `<p class="nav-label" data-group="${chapter.group}">${GROUPS[chapter.group].nav}</p>\n`;
    previousGroup = chapter.group;
    return label + entry({
      file: `chapter-${pad(number)}.html`,
      number: pad(number),
      title: navTitle(chapter),
      group: chapter.group,
      search: `${chapter.title} ${chapter.summary} ${chapter.concepts.map(([heading]) => heading).join(" ")}`,
      links: (href) => [
        ...chapter.concepts.map(([heading], i) => `<a href="${href(`#topic-${i + 1}`)}"><span class="toc-number">${number}.${i + 1}</span>${esc(heading)}</a>`),
        `<a href="${href("#chapter-examples")}"><span class="toc-number">ตย.</span>ตัวอย่างโปรแกรม</a>`,
        `<a href="${href("#chapter-exercises")}"><span class="toc-number">ฝึก</span>แบบฝึกหัดท้ายบท</a>`,
        ...(QUIZ_FORMS[number] ? [`<a href="${href("#quiz")}"><span class="toc-number">📝</span>เก็บคะแนนท้ายบท</a>`] : []),
      ],
    });
  });
  const appendices = APPENDICES.map((appendix) => entry({
    file: appendix.file,
    number: appendix.letter,
    title: appendix.nav,
    group: "appendix",
    search: `ภาคผนวก ${appendix.title} ${appendix.sub} ${appendix.topics.map(([, heading]) => heading).join(" ")}`,
    links: (href) => appendix.topics.map(([id, heading], i) => `<a href="${href(`#${id}`)}"><span class="toc-number">${appendix.letter}.${i + 1}</span>${esc(heading)}</a>`),
  }));
  return `<!-- course-nav -->
<button class="nav-toggle" type="button" aria-expanded="false">☰ สารบัญทุกบท</button>
<nav class="course-nav" aria-label="สารบัญรายวิชา">
${items.join("\n")}
<p class="nav-label" data-group="appendix">ภาคผนวก</p>
${appendices.join("\n")}
</nav>
<!-- /course-nav -->`;
}

function navTitle(chapter) {
  const title = NAV_TITLES[chapter.title];
  if (!title) throw new Error(`build.mjs: add a short menu title for "${chapter.title}" in NAV_TITLES`);
  return title;
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;600;700&family=Bai+Jamjuree:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">`;

// โครงหน้าที่ใช้ร่วมกันทั้งหน้าบทและภาคผนวก
// สคริปต์ใน <head> อ่านค่าซ่อนเมนู โหมดฉายจอ (A+) และโหมดมืดก่อนแสดงหน้า หน้าจึงไม่กระพริบ (index.html ใช้บรรทัดเดียวกัน)
const HEAD_SCRIPT = `<script>document.documentElement.classList.add("js");try{if(localStorage.getItem("side-collapsed")==="1")document.documentElement.classList.add("side-collapsed");if(localStorage.getItem("big-text")==="1")document.documentElement.classList.add("big-text");if(localStorage.getItem("dark")==="1")document.documentElement.classList.add("dark")}catch(e){}</script>`;
function pageShell({ file, title, description, main, mainClass = "" }) {
  return `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ffffff">
  <meta name="description" content="${esc(description)}">
  <title>${title} | Python programming by Prymania</title>
  ${FONTS}
  <link rel="stylesheet" href="../assets/lesson.css">
  <link rel="stylesheet" href="../assets/course-nav.css">
  <link rel="stylesheet" href="../assets/course-extras.css">
  ${HEAD_SCRIPT}
</head>
<body>
  <a class="skip-link" href="#lesson-content">ข้ามไปเนื้อหาบทเรียน</a>
  <div class="lesson-shell">
    <button class="side-show" type="button" aria-label="แสดงเมนูบทเรียน">☰ เมนู</button>
    <aside class="lesson-sidebar" aria-label="เมนูบทเรียน">
      <button class="side-hide" type="button" aria-label="ซ่อนเมนู" title="ซ่อนเมนู">«</button>
      <a class="lesson-brand" href="../index.html"><span class="brand-mark" aria-hidden="true">Py</span><span><span class="brand-title">Python programming<br>by Prymania</span><span class="brand-caption">LECTURE NOTES</span></span></a>
      ${renderCourseNav({ current: file })}
      <figure class="side-photo"><img src="../assets/icon/prymania.jpg" alt="อ. พรทิวา ปะวะระ (อ. พราย)" width="360" height="480" loading="lazy"><figcaption>อ. พรทิวา ปะวะระ (อ. พราย)</figcaption></figure>
      <div class="sidebar-bottom">ตัวอย่างทุกชิ้นรันด้วย Python จริง</div>
    </aside>
    <main class="lesson-main${mainClass}" id="lesson-content">
      ${main}
      <footer class="lesson-footer">Python programming by Prymania · ตัวอย่างทุกข้อรันตรวจด้วย Python จริง</footer>
    </main>
  </div>
  <script src="../assets/lesson.js"></script>
  <script src="../assets/course-nav.js"></script>
  <script defer src="../assets/ink.js"></script>
</body>
</html>`;
}

function renderChapter(chapter, index) {
  const number = index + 1;
  const previous = number === 1
    ? `<a class="pager-link secondary" href="../index.html">← สารบัญรายวิชา</a>`
    : `<a class="pager-link secondary" href="chapter-${pad(number - 1)}.html">← บทที่ ${number - 1}</a>`;
  const next = number === chapters.length
    ? `<a class="pager-link" href="${APPENDICES[0].file}">ภาคผนวก ${APPENDICES[0].letter} · ${APPENDICES[0].nav} →</a>`
    : `<a class="pager-link" href="chapter-${pad(number + 1)}.html">บทที่ ${number + 1} →</a>`;
  const topics = chapter.concepts.map((concept, i) => renderTopic(concept, number, i + 1)).join("\n");
  const examples = chapter.examples.map((example, i) => renderExample(example, number, i + 1)).join("\n");
  const exercises = chapter.exercises.map((exercise, i) => renderExercise(exercise, number, i + 1)).join("\n");
  const legend = Object.entries(LEVELS).map(([level, name]) => `<span class="level level-${level}">${name}</span>`).join(" ");
  return pageShell({
    file: `chapter-${pad(number)}.html`,
    title: `บทที่ ${number}: ${esc(chapter.title)}`,
    description: chapter.summary,
    main: `<div class="utility-row"><a href="../index.html">← สารบัญรายวิชา</a><span class="utility-code">CHAPTER ${pad(number)} / ${pad(chapters.length)}</span></div>
      <header class="lesson-header"><p class="lesson-kicker">บทที่ ${number} · ${GROUPS[chapter.group].kicker}</p><h1>${esc(chapter.title)}</h1><p>${fmt(chapter.summary)}</p></header>
      <section class="learning-goals"><strong>เมื่อจบบทนี้ นิสิตจะทำได้</strong><p>${fmt(chapter.outcome)}</p></section>
      <section class="lesson-section" aria-label="เนื้อหา">
        ${topics}
      </section>
      <section class="lesson-section" id="chapter-examples" aria-labelledby="examples-heading">
        <h2 id="examples-heading">ตัวอย่างโปรแกรม</h2>
        ${examples}
      </section>
      <section class="chapter-end" id="chapter-exercises" aria-labelledby="end-heading">
        <h2 id="end-heading">แบบฝึกหัดท้ายบท</h2>
        <p>เรียงจากง่ายไปยาก ลองเขียนเองให้ได้ผลลัพธ์ตรงตัวอย่างก่อน แล้วค่อยเปิดเฉลย</p>
        <div class="level-legend">ระดับความยาก: ${legend}</div>
        ${exercises}
      </section>
      ${quizBlock(number)}
      <nav class="lesson-pager" aria-label="เปลี่ยนบท">${previous}${next}</nav>`,
  });
}

function renderAppendix(appendix, index) {
  const before = index === 0 ? null : APPENDICES[index - 1];
  const after = APPENDICES[index + 1];
  const previous = before
    ? `<a class="pager-link secondary" href="${before.file}">← ภาคผนวก ${before.letter} · ${before.nav}</a>`
    : `<a class="pager-link secondary" href="chapter-${pad(chapters.length)}.html">← บทที่ ${chapters.length}</a>`;
  const next = after
    ? `<a class="pager-link" href="${after.file}">ภาคผนวก ${after.letter} · ${after.nav} →</a>`
    : `<a class="pager-link" href="../index.html">กลับหน้าสารบัญ →</a>`;
  return pageShell({
    file: appendix.file,
    title: `ภาคผนวก ${appendix.letter}: ${esc(appendix.title)}`,
    description: appendix.sub,
    mainClass: " pastel",
    main: `<div class="utility-row"><a href="../index.html">← สารบัญรายวิชา</a><span class="utility-code">APPENDIX ${appendix.letter}</span></div>
      <header class="lesson-header"><p class="lesson-kicker">${esc(appendix.kicker)}</p><h1>${esc(appendix.title)}</h1><p>${esc(appendix.sub)}</p></header>
      <section class="appendix-body">
${appendix.body}
      </section>
      <nav class="lesson-pager" aria-label="เปลี่ยนหน้า">${previous}${next}</nav>`,
  });
}

// ---------------- สร้างไฟล์ ----------------

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(ROOT, "assets", "gui"), { recursive: true });

for (const [index, chapter] of chapters.entries()) {
  if (chapter.exercises.length < 6) throw new Error(`Chapter ${index + 1} must have at least six exercises.`);
  const file = `chapter-${pad(index + 1)}.html`;
  fs.writeFileSync(path.join(OUT, file), renderChapter(chapter, index), "utf8");
  console.log(`${file}: ${chapter.concepts.length} หัวข้อ, ${chapter.examples.length} ตัวอย่าง, ${chapter.exercises.length} แบบฝึกหัด${QUIZ_FORMS[index + 1] ? " + Quiz" : ""}`);
}
for (const [index, appendix] of APPENDICES.entries()) {
  fs.writeFileSync(path.join(OUT, appendix.file), renderAppendix(appendix, index), "utf8");
  console.log(`${appendix.file}: ภาคผนวก ${appendix.letter}, ${appendix.topics.length} หัวข้อ`);
}

// เมนูใน index.html อยู่ระหว่าง <!-- course-nav --> กับ <!-- /course-nav -->
const indexPath = path.join(ROOT, "index.html");
const indexHtml = fs.readFileSync(indexPath, "utf8");
const NAV_MARKER = /<!-- course-nav -->[\s\S]*?<!-- \/course-nav -->/;
if (!NAV_MARKER.test(indexHtml)) throw new Error("index.html: missing <!-- course-nav --> marker");
const HEAD_MARKER = /<script>document\.documentElement\.classList\.add\("js"\);[^\n]*?<\/script>/;
if (!HEAD_MARKER.test(indexHtml)) throw new Error("index.html: missing the <head> script that sets html.js");
fs.writeFileSync(indexPath, indexHtml
  .replace(NAV_MARKER, () => renderCourseNav({ base: "chapters/" }))
  .replace(HEAD_MARKER, () => HEAD_SCRIPT), "utf8");

// ---------------- sw.js: เปิดเว็บได้แม้ไม่มีเน็ต (จาก write_service_worker ของเว็บ Calculus) ----------------
// มีเน็ต = โหลดของใหม่เสมอ (แล้วเก็บสำเนา) · ไม่มีเน็ต = ใช้สำเนาในเครื่อง
// เลขเวอร์ชันมาจากเนื้อหาทุกไฟล์ที่ cache เมื่อแก้อะไร สำเนาเก่าในเครื่องนิสิตจะถูกแทนที่เอง
const listFiles = (dir, exts) => fs.readdirSync(path.join(ROOT, dir)).filter((f) => exts.test(f)).sort().map((f) => `${dir}/${f}`);
const core = [
  "index.html",
  ...chapters.map((_, i) => `chapters/chapter-${pad(i + 1)}.html`),
  ...APPENDICES.map((a) => `chapters/${a.file}`),
  ...listFiles("assets", /\.(css|js|svg)$/),
  ...listFiles("assets/icon", /\.(png|jpe?g|svg|webp)$/i),
  ...listFiles("assets/figures", /\.(png|jpe?g|svg|webp)$/i),
  ...listFiles("assets/gui", /\.(png|jpe?g|svg|webp)$/i),
];
const swHash = crypto.createHash("sha1");
for (const f of core) swHash.update(fs.readFileSync(path.join(ROOT, f)));
fs.writeFileSync(path.join(ROOT, "sw.js"), `// สร้างโดย tools/lesson-builder/build.mjs — อย่าแก้ไฟล์นี้ตรง ๆ
// เปิดเว็บได้แม้ไม่มีเน็ต: มีเน็ต = โหลดของใหม่เสมอ (แล้วเก็บสำเนา) · ไม่มีเน็ต = ใช้สำเนาในเครื่อง
var CACHE = "py-${swHash.digest("hex").slice(0, 10)}";
var CORE = ${JSON.stringify(["./", ...core])};
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("py-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(function (res) {
    if (res && (res.ok || res.type === "opaque")) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
    }
    return res;
  }).catch(function () {
    return caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      return hit || (e.request.mode === "navigate" ? caches.match("index.html") : undefined);
    });
  }));
});
`, "utf8");
console.log(`sw.js (offline): ${core.length + 1} ไฟล์`);
console.log(`สร้างเสร็จ ${chapters.length} บท + ${APPENDICES.length} ภาคผนวก, Quiz ${Object.keys(QUIZ_FORMS).length} บท`);
