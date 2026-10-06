import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { basics } from "./course-basics.mjs";
import { practice } from "./course-practice.mjs";
import { dataAi } from "./course-data-ai.mjs";
import { guiProject } from "./course-gui.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(ROOT, "chapters");
const PYTHON = process.env.PYTHON || path.join(ROOT, ".venv", "Scripts", "python.exe");
const chapters = [...basics, ...practice, ...dataAi, ...guiProject];
const groups = {
  foundation: "พื้นฐาน",
  practice: "ใช้งานจริง",
  ai: "ข้อมูลและ AI",
  gui: "GUI / โปรเจกต์",
};
const levels = { 1: "★ ง่าย", 2: "★★ ปานกลาง", 3: "★★★ ท้าทาย" };

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

// `code` ในข้อความ → <code>
function fmt(value) {
  return esc(value).replace(/`([^`]+)`/g, "<code>$1</code>");
}

// เมื่อมี stdin ให้ input() พิมพ์ค่าที่ป้อนลง output ด้วย เหมือนที่เห็นในหน้าจอจริง
const ECHO_INPUT = `import builtins as _b
_raw_input = _b.input
def _echo_input(prompt=""):
    value = _raw_input(prompt)
    print(value)
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
  const stdout = (result.stdout || "").replace(/\r\n/g, "\n").trimEnd();
  const stderr = (result.stderr || "").replace(/\r\n/g, "\n").trim();
  return stderr ? `${stdout}${stdout ? "\n" : ""}[stderr]\n${stderr}` : stdout;
}

function renderFiles(item) {
  const files = Object.entries(item.files ?? {});
  if (!files.length) return "";
  return `<div class="data-files">${files.map(([name, content]) => `<div class="file-box"><span>ไฟล์ ${esc(name)}</span><pre>${esc(content.trimEnd())}</pre></div>`).join("")}</div>`;
}

function outputNote(item) {
  if (item.stdin !== undefined) return " · ค่าที่ผู้ใช้พิมพ์แสดงต่อท้ายคำถาม";
  if (item.http) return " · จากข้อมูลตัวอย่างของ API (ไม่ได้ต่ออินเทอร์เน็ตจริงตอนสร้างหน้า)";
  return "";
}

function renderShot(item) {
  if (item.plot) return `<figure class="screenshot"><img src="../${esc(item.plot)}" alt="${esc(item.alt ?? "กราฟที่ได้จากการรันโค้ด")}"><figcaption>กราฟที่ได้จากการรันโค้ดนี้จริง</figcaption></figure>`;
  if (item.window) return `<figure class="screenshot"><img src="../${esc(item.window.file)}" alt="${esc(item.alt ?? "หน้าต่างโปรแกรมที่ได้จากการรันโค้ด")}"><figcaption>หน้าต่างที่ได้จากการรันโค้ดนี้จริง${item.window.demo ? " (หลังจำลองการกรอกและกดปุ่ม)" : ""}</figcaption></figure>`;
  return "";
}

function renderExample(example, chapterNo, exampleNo) {
  const output = runPython(example.code, `Chapter ${chapterNo}, example ${exampleNo}`, example);
  const image = renderShot(example);
  const walkthrough = `<div class="walkthrough"><strong>อธิบาย</strong><ol>${example.steps.map((step) => `<li>${fmt(step)}</li>`).join("")}</ol></div>`;
  return `<div class="source-example">
    <h4>ตัวอย่าง ${chapterNo}.${exampleNo} · ${esc(example.title)}</h4>
    <p class="concept-line">${fmt(example.idea)}</p>
    ${renderFiles(example)}
    <div class="source-grid">
      <div class="source-field"><span>Python source</span><pre class="copyable"><code>${esc(example.code)}</code></pre></div>
      <div class="output-field"><span>Output${outputNote(example)}</span>${output || !image ? `<pre>${esc(output || "(ไม่มีข้อความแสดงผล)")}</pre>` : ""}${image}</div>
    </div>
    ${walkthrough}
  </div>`;
}

function renderExercise(exercise, chapterNo, exerciseNo) {
  const id = `${String(chapterNo).padStart(2, "0")}.${exerciseNo}`;
  const output = runPython(exercise.code, `Exercise ${id}`, exercise);
  const shot = renderShot(exercise);
  const checklist = exercise.checklist.map((item) => `<li>${fmt(item)}</li>`).join("");
  const facts = [["โจทย์ให้", exercise.given], ["ต้องหา", exercise.want]]
    .filter(([, value]) => value)
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${fmt(value)}</dd></div>`).join("");
  const brief = facts
    ? `<div class="task-brief"><strong>เข้าใจโจทย์</strong><dl>${facts}</dl><p class="brief-label">วิธีคิด</p><ol>${checklist}</ol></div>`
    : `<ul>${checklist}</ul>`;
  return `<article class="exercise">
    <h3 class="exercise-heading"><span class="exercise-id">ข้อ ${id}</span><strong>${esc(exercise.title)}</strong><span class="difficulty difficulty-${exercise.level}">${levels[exercise.level]}</span></h3>
    <p>${fmt(exercise.task)}</p>
    ${renderFiles(exercise)}
    ${brief}
    <div class="sample-output"><strong>ตัวอย่างผลลัพธ์${outputNote(exercise).replace(" · ค่าที่ผู้ใช้พิมพ์แสดงต่อท้ายคำถาม", "")}</strong>${output || !shot ? `<pre>${esc(output || "(ไม่มีข้อความแสดงผล)")}</pre>` : ""}${shot}</div>
    <div class="answer-gate" data-answer-id="${id}">
      <button class="answer-open" type="button">🔒 ใส่รหัสเพื่อดูเฉลย</button>
      <form class="password-form" hidden>
        <label>รหัสผ่านข้อ ${id}<input type="password" autocomplete="off" required></label>
        <button class="password-submit" type="submit">เปิดเฉลย</button>
        <p class="password-message" aria-live="polite"></p>
      </form>
      <div class="answer-content" hidden><h4 tabindex="-1">แนวคำตอบและเหตุผล</h4>
        <p>${fmt(exercise.explain)}</p><pre class="copyable"><code>${esc(exercise.code)}</code></pre>
      </div>
    </div>
  </article>`;
}

function renderTopic([heading, detail, extra = {}], label, topicNo) {
  const parts = [`<p>${fmt(detail)}</p>`];
  if (extra.figure) {
    parts.push(`<figure class="figure"><img src="../${esc(extra.figure.src)}" alt="${esc(extra.figure.alt)}"><figcaption>${fmt(extra.figure.caption ?? extra.figure.alt)}</figcaption></figure>`);
  }
  if (extra.table) {
    const head = extra.table.head.map((cell) => `<th>${fmt(cell)}</th>`).join("");
    const rows = extra.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${fmt(cell)}</td>`).join("")}</tr>`).join("");
    parts.push(`<div class="table-wrap"><table class="concept-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`);
  }
  if (extra.files) parts.push(renderFiles(extra));
  if (extra.code) {
    const output = runPython(extra.code, `Chapter ${label}, topic ${topicNo}`, extra);
    const shot = renderShot(extra);
    const text = output || !shot ? `<pre class="mini-output" aria-label="Output">${esc(output || "(ไม่มีข้อความแสดงผล)")}</pre>` : "";
    const result = shot ? `<div class="mini-result">${text}${shot}</div>` : text;
    parts.push(`<div class="mini-run${shot ? " has-shot" : ""}"><pre class="copyable"><code>${esc(extra.code)}</code></pre>${result}</div>`);
  }
  if (extra.tip) parts.push(`<p class="tip"><strong>จำง่าย ๆ</strong> ${fmt(extra.tip)}</p>`);
  return `<article class="subtopic" id="topic-${topicNo}"><h3>${label}.${topicNo} ${esc(heading)}</h3>${parts.join("")}</article>`;
}

function renderChapterNavigation(currentNo = null, prefix = "chapters/") {
  const groupLabels = {
    foundation: "เริ่มต้นกับ Python",
    practice: "ฝึกเขียนและใช้งาน",
    ai: "ต่อยอดข้อมูลและ AI",
    gui: "GUI และโปรเจกต์",
  };
  let previousGroup = "";
  return chapters.map((chapter, index) => {
    const number = index + 1;
    const label = String(number).padStart(2, "0");
    const href = `${prefix}chapter-${label}.html`;
    const section = chapter.group === previousGroup
      ? ""
      : `<p class="toc-label" data-group="${esc(chapter.group)}">${esc(groupLabels[chapter.group])}</p>`;
    previousGroup = chapter.group;
    const overviewTarget = currentNo === number ? "#lesson-content" : `${href}#lesson-content`;
    const exerciseTarget = currentNo === number ? "#chapter-exercises" : `${href}#chapter-exercises`;
    const topicLinks = chapter.concepts.map(([heading], topicIndex) => {
      const target = currentNo === number ? `#topic-${topicIndex + 1}` : `${href}#topic-${topicIndex + 1}`;
      return `<li><a href="${target}"><span class="topic-number">${label}.${topicIndex + 1}</span>${esc(heading)}</a></li>`;
    }).join("");
    const searchText = `${chapter.title} ${chapter.summary} ${chapter.concepts.map(([heading]) => heading).join(" ")}`;
    return `${section}<details class="chapter-nav-item" data-group="${esc(chapter.group)}" data-search="${esc(searchText)}"${currentNo === number ? " open" : ""}>
      <summary><span class="toc-number">${label}</span><span class="chapter-nav-title">${esc(chapter.title)}</span></summary>
      <ul class="chapter-subnav"><li><a href="${overviewTarget}"><span class="topic-number">↳</span>ภาพรวมและตัวอย่าง</a></li>${topicLinks}<li><a href="${exerciseTarget}"><span class="topic-number">✎</span>แบบฝึกหัดท้ายบท</a></li></ul>
    </details>`;
  }).join("\n");
}

function renderChapter(chapter, index) {
  const number = index + 1;
  const label = String(number).padStart(2, "0");
  const previous = number === 1
    ? `<a class="pager-link secondary" href="../index.html">← สารบัญรายวิชา</a>`
    : `<a class="pager-link secondary" href="chapter-${String(number - 1).padStart(2, "0")}.html">← บทก่อนหน้า</a>`;
  const next = number === chapters.length
    ? `<a class="pager-link" href="../index.html">จบบทเรียน · กลับหน้าสารบัญ →</a>`
    : `<a class="pager-link" href="chapter-${String(number + 1).padStart(2, "0")}.html">บทถัดไป →</a>`;
  const topics = chapter.concepts.map((concept, i) => renderTopic(concept, label, i + 1)).join("");
  const examples = chapter.examples.map((example, i) => renderExample(example, label, i + 1)).join("\n");
  const exercises = chapter.exercises.map((exercise, i) => renderExercise(exercise, number, i + 1)).join("\n");
  return `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#192044">
  <meta name="description" content="${esc(chapter.summary)}">
  <title>บทที่ ${label} · ${esc(chapter.title)} | Python programming</title>
  <link rel="stylesheet" href="../assets/lesson.css">
</head>
<body>
  <a class="skip-link" href="#lesson-content">ข้ามไปเนื้อหาบทเรียน</a>
  <div class="lesson-shell">
    <aside class="lesson-sidebar" aria-label="สารบัญบทเรียน">
      <a class="lesson-brand" href="../index.html"><span class="brand-mark">Py</span><span><span class="brand-title">Python programming by Prymania</span><span class="brand-caption">LECTURE NOTES</span></span></a>
      <nav class="lesson-toc chapter-navigation" aria-label="สารบัญรายวิชา">
        <p class="toc-label">สารบัญ · ${chapters.length} บทเรียน</p>
        ${renderChapterNavigation(number, "")}
      </nav>
      <div class="sidebar-bottom">ตัวอย่างรันด้วย Python จริง<br>เลื่อนเพื่ออ่านหัวข้อถัดไป</div>
    </aside>
    <main class="lesson-main" id="lesson-content">
      <div class="utility-row"><a href="../index.html">← สารบัญรายวิชา</a><span class="utility-code">CHAPTER ${label} / ${String(chapters.length).padStart(2, "0")}</span></div>
      <header class="lesson-header"><p class="lesson-kicker">CHAPTER ${label} · ${esc(groups[chapter.group])}</p><h1>${esc(chapter.title)}</h1><p>${esc(chapter.summary)}</p></header>
      <section class="learning-goals"><strong>จบบทนี้แล้วทำได้</strong><p>${fmt(chapter.outcome)}</p></section>
      <section class="lesson-section" aria-labelledby="lesson-heading"><h2 id="lesson-heading">เนื้อหา</h2>
        ${topics}
        <h2 class="examples-heading">ตัวอย่างโปรแกรม</h2>
        ${examples}
      </section>
      <section class="exercise-section" id="chapter-exercises" aria-labelledby="exercise-heading">
        <h2 id="exercise-heading">แบบฝึกหัดท้ายบท</h2>
        <p class="exercise-intro">เรียงจากง่ายไปยาก ลองเขียนเองให้ได้ output ตรงตัวอย่างก่อน แล้วค่อยเปิดเฉลย</p>
        <div class="exercise-list">${exercises}</div>
      </section>
      <nav class="lesson-pager" aria-label="เปลี่ยนบท">${previous}${next}</nav>
      <footer class="lesson-footer">Python programming by Prymania · ตัวอย่างทุกข้อรันตรวจด้วย Python จริง</footer>
    </main>
  </div>
  <script src="../password.js"></script><script src="../assets/lesson.js"></script>
</body>
</html>`;
}

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(ROOT, "assets", "gui"), { recursive: true });
const passwordEntries = [];

for (const [index, chapter] of chapters.entries()) {
  if (chapter.exercises.length < 6) throw new Error(`Chapter ${index + 1} must have at least six exercises.`);
  const file = `chapter-${String(index + 1).padStart(2, "0")}.html`;
  fs.writeFileSync(path.join(OUT, file), renderChapter(chapter, index), "utf8");
  chapter.exercises.forEach((_, exerciseIndex) => {
    const exerciseId = `${String(index + 1).padStart(2, "0")}.${exerciseIndex + 1}`;
    passwordEntries.push(`  "${exerciseId}": "py${String(index + 1).padStart(2, "0")}${String(exerciseIndex + 1).padStart(2, "0")}"`);
  });
  console.log(`${file}: ${chapter.concepts.length} หัวข้อ, ${chapter.examples.length} ตัวอย่าง, ${chapter.exercises.length} แบบฝึกหัด`);
}

const indexPath = path.join(ROOT, "index.html");
const indexHtml = fs.readFileSync(indexPath, "utf8");
const navStartMarker = "<!-- BEGIN GENERATED CHAPTER LINKS -->";
const navEndMarker = "<!-- END GENERATED CHAPTER LINKS -->";
const navStart = indexHtml.indexOf(navStartMarker);
const navEnd = indexHtml.indexOf(navEndMarker, navStart + navStartMarker.length);
if (navStart < 0 || navEnd < 0) throw new Error("Generated chapter navigation markers not found in index.html");
const navContentStart = navStart + navStartMarker.length;
fs.writeFileSync(indexPath, indexHtml.slice(0, navContentStart) + `\n${renderChapterNavigation()}\n        ` + indexHtml.slice(navEnd), "utf8");
fs.writeFileSync(path.join(ROOT, "password.js"), `window.EXERCISE_PASSWORDS = {\n${passwordEntries.join(",\n")}\n};\n`, "utf8");
console.log(`สร้างเสร็จ ${chapters.length} บท, ${passwordEntries.length} ชุดรหัสเฉลย`);
