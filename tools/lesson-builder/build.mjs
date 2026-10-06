import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { core } from "./course-core.mjs";
import { applied } from "./course-applied.mjs";
import { extendCourse } from "./course-extensions.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(ROOT, "chapters");
const PYTHON = process.env.PYTHON || path.join(ROOT, ".venv", "Scripts", "python.exe");
const chapters = extendCourse([...core, ...applied]);
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

function runPython(code, label) {
  const result = spawnSync(PYTHON, ["-c", code], {
    cwd: ROOT,
    encoding: "utf8",
    timeout: 45000,
    env: {
      ...process.env,
      PYTHONIOENCODING: "utf-8",
      MPLBACKEND: "Agg",
      QT_QPA_PLATFORM: "offscreen",
    },
  });
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  if (result.status !== 0) {
    throw new Error(`${label} failed (exit ${result.status})\n${result.stderr}\n${result.stdout}\n--- source ---\n${code}`);
  }
  const stdout = (result.stdout || "").replace(/\r\n/g, "\n").trimEnd();
  const stderr = (result.stderr || "").replace(/\r\n/g, "\n").trim();
  return stderr ? `${stdout}${stdout ? "\n" : ""}[stderr]\n${stderr}` : stdout;
}

function renderExample(example, chapterNo, exampleNo) {
  const output = runPython(example.code, `Chapter ${chapterNo}, example ${exampleNo}`);
  const image = example.image
    ? `<figure class="screenshot"><img src="../${esc(example.image)}" alt="ภาพหน้าต่าง PySide6 ที่สร้างจากการรันตัวอย่างจริง"><figcaption>ภาพหน้าต่างจากโปรแกรม PySide6 ที่รันจริงในสภาพแวดล้อม offscreen</figcaption></figure>`
    : "";
  const walkthrough = `<div class="walkthrough"><strong>อธิบายทีละขั้น</strong><ol>${example.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol></div>`;
  return `<div class="source-example">
    <h4>ตัวอย่าง ${chapterNo}.${exampleNo} · ${esc(example.title)}</h4>
    <p class="concept-line"><strong>แนวคิด:</strong> ${esc(example.idea)}</p>
    <div class="source-grid">
      <div class="source-field"><span>Python source</span><pre class="copyable"><code>${esc(example.code)}</code></pre></div>
      <div class="output-field"><span>Output${example.image ? " · ภาพหน้าต่างจริง" : ""}</span><pre>${esc(output || "(ไม่มีข้อความแสดงผล)")}</pre>${image}</div>
    </div>
    ${walkthrough}
  </div>`;
}

function renderExercise(exercise, chapterNo, exerciseNo) {
  const id = `${String(chapterNo).padStart(2, "0")}.${exerciseNo}`;
  const password = `py${String(chapterNo).padStart(2, "0")}${String(exerciseNo).padStart(2, "0")}`;
  const output = runPython(exercise.code, `Exercise ${id}`);
  const checklist = exercise.checklist.map((item) => `<li>${esc(item)}</li>`).join("");
  return `<article class="exercise">
    <h3 class="exercise-heading"><span class="exercise-id">ข้อ ${id}</span><strong>${esc(exercise.title)}</strong><span class="difficulty difficulty-${exercise.level}">${levels[exercise.level]}</span></h3>
    <p>${esc(exercise.task)}</p>
    <ul>${checklist}</ul>
    <div class="sample-output"><strong>ตัวอย่างผลลัพธ์</strong><pre>${esc(output || "(ไม่มีข้อความแสดงผล)")}</pre></div>
    <div class="answer-gate" data-answer-id="${id}">
      <button class="answer-open" type="button">🔒 ใส่รหัสเพื่อดูเฉลย</button>
      <form class="password-form" hidden>
        <label>รหัสผ่านข้อ ${id}<input type="password" autocomplete="off" required></label>
        <button class="password-submit" type="submit">เปิดเฉลย</button>
        <p class="password-message" aria-live="polite"></p>
      </form>
      <div class="answer-content" hidden><h4 tabindex="-1">แนวคำตอบและเหตุผล</h4>
        <p>${esc(exercise.explain)}</p><pre class="copyable"><code>${esc(exercise.code)}</code></pre>
      </div>
    </div>
  </article>`;
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
  const topics = chapter.concepts.map(([heading, detail], i) =>
    `<article class="subtopic" id="topic-${i + 1}"><h3>${label}.${i + 1} ${esc(heading)}</h3><p>${esc(detail)}</p><div class="teaching-prompt"><strong>ลองคิดเป็นขั้น</strong><p>ก่อนเขียน ให้แยกข้อมูลที่โจทย์ให้ สิ่งที่ต้องการให้โปรแกรมทำ และผลลัพธ์ที่ควรได้ จากนั้นเลือกแนวคิดนี้มาจัดลำดับวิธีทำ ทดลองรันด้วยค่าตัวอย่าง แล้วตรวจผลทีละบรรทัด ถ้าผลไม่ตรง ให้เทียบค่าตั้งต้นและแต่ละขั้นกับสิ่งที่คาดไว้ก่อนเปลี่ยนโค้ด</p></div></article>`).join("");
  const examples = chapter.examples.map((example, i) => renderExample(example, label, i + 1)).join("\n");
  const exercises = chapter.exercises.map((exercise, i) => renderExercise(exercise, number, i + 1)).join("\n");
  const goals = [chapter.outcome, ...chapter.concepts.slice(0, 2).map((concept) => concept[0])];
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
      <section class="learning-goals"><strong>เมื่อจบบทนี้ นิสิตจะทำได้</strong><ul>${goals.map((goal) => `<li>${esc(goal)}</li>`).join("")}</ul></section>
      <section class="lesson-section" aria-labelledby="lesson-heading"><h2 id="lesson-heading">แนวคิดและตัวอย่าง</h2>
        <div class="chapter-intro"><strong>แผนการเรียนบทนี้</strong><p>${esc(chapter.lessonIntro || chapter.summary)}</p><p>วิธีฝึก: อ่านโจทย์ → ระบุข้อมูลเข้าและผลที่ต้องการ → ทำนาย output → รันและตรวจทีละขั้น → อธิบายด้วยคำของตนเองว่าเหตุใดจึงได้ผลเช่นนั้น</p></div>
        ${topics}${examples}
      </section>
      <section class="exercise-section" id="chapter-exercises" aria-labelledby="exercise-heading">
        <h2 id="exercise-heading">แบบฝึกหัดท้ายบท</h2>
        <p class="exercise-intro">ทำจากข้อพื้นฐานไปข้อท้าทาย ก่อนเขียนให้จดข้อมูลที่โจทย์ให้ สิ่งที่ต้องหา และลำดับการทำงานสั้น ๆ จากนั้นทำนาย output แล้วรันตรวจ รายการตรวจช่วยไล่เงื่อนไขทีละข้อ หากยังติดให้ย้อนอ่านหัวข้อที่เกี่ยวข้องก่อนเปิดเฉลย ซึ่งมีแนวคิดและ source code ที่รันตรวจแล้ว</p>
        <div class="exercise-list">${exercises}</div>
      </section>
      <nav class="lesson-pager" aria-label="เปลี่ยนบท">${previous}${next}</nav>
      <footer class="lesson-footer">Python programming · Lecture notes · ตัวอย่างรันตรวจด้วย Python จริง</footer>
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
