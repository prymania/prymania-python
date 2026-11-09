// ---------- ปากกาเขียนทับหน้าเว็บ (สำหรับสอนด้วย iPad + Apple Pencil) ----------
// • กด ✏️ เพื่อเปิดโหมดปากกา: Apple Pencil / เมาส์ = เขียน · นิ้ว = เลื่อน/ซูมหน้าตามปกติของ iPad
// • หมึกบันทึกอัตโนมัติในเบราว์เซอร์เครื่องนั้น แยกตามหน้า (localStorage คีย์ "ink:python/<ชื่อไฟล์>")
//   เติม "python/" เพราะเว็บวิชาอื่นของผู้สอนอยู่ origin เดียวกัน (prymania.github.io) จึงแชร์ localStorage กัน
// • ⬇️ สำรองหมึกทุกหน้าเป็นไฟล์ .json · ⬆️ นำไฟล์สำรองกลับเข้ามา (ใช้ย้ายเครื่อง หรือกันข้อมูลหาย)
// • หมึกเก็บเป็นเส้น (SVG) ตามตำแหน่งในคอลัมน์เนื้อหา จึงคมทุกขนาดจอและพิมพ์ออก PDF ได้
(function () {
  var main = document.querySelector(".lesson-main") || document.querySelector(".page-content > main");   // หน้าแรกไม่มี .lesson-main
  if (!main) return;
  var NS = "http://www.w3.org/2000/svg";
  var PREFIX = "ink:python/";
  var KEY = PREFIX + (location.pathname.split("/").pop() || "index.html");
  var PENS = [
    { c: "#17202d", w: 2.6, o: 1, label: "ปากกาดำ" },
    { c: "#e0533f", w: 2.6, o: 1, label: "ปากกาแดง" },
    { c: "#2f80ed", w: 2.6, o: 1, label: "ปากกาน้ำเงิน" },
    { c: "#14a08e", w: 2.6, o: 1, label: "ปากกาเขียว" },
    { c: "#FFD6EE", w: 18, o: 1, h: 1, label: "ไฮไลต์ชมพู" },
    { c: "#CED1F8", w: 18, o: 1, h: 1, label: "ไฮไลต์ม่วง" },
    { c: "#EAFF4F", w: 18, o: 1, h: 1, label: "ไฮไลต์เหลืองสะท้อนแสง" }
  ];
  var st = { on: false, pen: 0, eraser: false };
  var data = load();

  // ---- ชั้นหมึก
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "ink-layer");
  svg.setAttribute("aria-hidden", "true");
  main.appendChild(svg);

  // ---- แถบเครื่องมือ
  var bar = document.createElement("div");
  bar.className = "ink-bar";
  bar.innerHTML =
    '<div class="ink-tools">' +
    PENS.map(function (p, i) {
      return '<button type="button" class="ink-pen" data-i="' + i + '" title="' + p.label + '" aria-label="' + p.label + '">' +
        '<span' + (p.h ? ' class="hl"' : "") + ' style="background:' + p.c + '"></span></button>';
    }).join("") +
    '<button type="button" class="ink-eraser" title="ยางลบ (แตะเส้นที่จะลบ)" aria-label="ยางลบ">🧽</button>' +
    '<button type="button" class="ink-undo" title="ย้อนกลับ" aria-label="ย้อนกลับ">↶</button>' +
    '<button type="button" class="ink-clear" title="ล้างหมึกหน้านี้" aria-label="ล้างหมึกหน้านี้">🗑</button>' +
    '<button type="button" class="ink-export" title="สำรองหมึกทุกหน้าเป็นไฟล์" aria-label="สำรองหมึกเป็นไฟล์">⬇️</button>' +
    '<button type="button" class="ink-import" title="นำไฟล์สำรองหมึกเข้ามา" aria-label="นำไฟล์สำรองเข้ามา">⬆️</button>' +
    '<input type="file" accept=".json,application/json" hidden>' +
    '</div>' +
    '<button type="button" class="ink-toggle" title="ปากกา" aria-label="เปิดโหมดปากกา" aria-pressed="false">✏️</button>' +
    '<div class="ink-toast" hidden></div>';
  document.body.appendChild(bar);
  var $ = function (s) { return bar.querySelector(s); };
  var toggle = $(".ink-toggle"), toast = $(".ink-toast"), file = $("input[type=file]");

  function say(msg, ms) {
    toast.textContent = msg; toast.hidden = false;
    clearTimeout(say.t); say.t = setTimeout(function () { toast.hidden = true; }, ms || 2500);
  }
  function refreshBar() {
    document.documentElement.classList.toggle("ink-on", st.on);
    toggle.textContent = st.on ? "✕" : "✏️";
    toggle.setAttribute("aria-pressed", String(st.on));
    toggle.setAttribute("aria-label", st.on ? "ปิดโหมดปากกา" : "เปิดโหมดปากกา");
    bar.querySelectorAll(".ink-pen").forEach(function (b) { b.classList.toggle("active", !st.eraser && +b.dataset.i === st.pen); });
    $(".ink-eraser").classList.toggle("active", st.eraser);
  }

  // ---- เก็บ / โหลด
  function load() {
    try { var d = JSON.parse(localStorage.getItem(KEY)); if (d && d.strokes) return d; } catch (e) {}
    return { w: 0, strokes: [] };
  }
  function save() {
    data.w = main.clientWidth;
    try {
      if (data.strokes.length) localStorage.setItem(KEY, JSON.stringify(plain()));
      else localStorage.removeItem(KEY);
    } catch (e) { say("บันทึกไม่ได้ (พื้นที่เต็มหรือถูกปิด) — กด ⬇️ เพื่อสำรองเป็นไฟล์", 5000); }
  }

  // ---- วาดเส้น
  function pathD(p) {
    if (p.length === 1) return "M" + p[0][0] + " " + p[0][1] + "l0.01 0";
    var d = "M" + p[0][0] + " " + p[0][1];
    for (var i = 1; i < p.length - 1; i++) {
      var xc = (p[i][0] + p[i + 1][0]) / 2, yc = (p[i][1] + p[i + 1][1]) / 2;
      d += "Q" + p[i][0] + " " + p[i][1] + " " + xc.toFixed(1) + " " + yc.toFixed(1);
    }
    var l = p[p.length - 1];
    return d + "L" + l[0] + " " + l[1];
  }
  function draw(s) {
    var el = document.createElementNS(NS, "path");
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", s.c);
    el.setAttribute("stroke-width", s.w);
    el.setAttribute("stroke-linecap", "round");
    el.setAttribute("stroke-linejoin", "round");
    if (s.o < 1) el.setAttribute("stroke-opacity", s.o);
    el.setAttribute("d", pathD(s.p));
    svg.appendChild(el);
    s.el = el;
    return el;
  }
  function renderAll() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    data.strokes.forEach(draw);
  }
  function plain() {   // สำหรับบันทึก: ตัด element ออก
    return { w: data.w, strokes: data.strokes.map(function (s) { return { c: s.c, w: s.w, o: s.o, p: s.p }; }) };
  }

  // ---- อินพุต
  var cur = null, eraseOn = false;
  function pt(e) {
    var r = main.getBoundingClientRect();
    return [Math.round((e.clientX - r.left) * 10) / 10, Math.round((e.clientY - r.top) * 10) / 10];
  }
  function canDraw(e) { return e.pointerType === "pen" || e.pointerType === "mouse"; }   // นิ้ว (touch) ปล่อยให้เบราว์เซอร์เลื่อน/ซูม
  function segDist(q, a, b) {   // ระยะจากจุด q ถึงส่วนของเส้นตรง ab
    var vx = b[0] - a[0], vy = b[1] - a[1], L = vx * vx + vy * vy;
    var t = L ? Math.max(0, Math.min(1, ((q[0] - a[0]) * vx + (q[1] - a[1]) * vy) / L)) : 0;
    var dx = a[0] + t * vx - q[0], dy = a[1] + t * vy - q[1];
    return Math.sqrt(dx * dx + dy * dy);
  }
  function eraseAt(q) {
    var hit = false;
    for (var i = data.strokes.length - 1; i >= 0; i--) {
      var s = data.strokes[i], r = s.w / 2 + 10;
      for (var j = 0; j < s.p.length; j++) {
        if (segDist(q, s.p[j], s.p[j + 1] || s.p[j]) < r) { s.el.remove(); data.strokes.splice(i, 1); hit = true; break; }
      }
    }
    return hit;
  }
  svg.addEventListener("pointerdown", function (e) {
    if (!st.on || !canDraw(e)) return;
    e.preventDefault();
    svg.setPointerCapture(e.pointerId);
    if (st.eraser) { eraseOn = true; if (eraseAt(pt(e))) save(); return; }
    var p = PENS[st.pen];
    cur = { c: p.c, w: p.w, o: p.o, p: [pt(e)] };
    draw(cur);
  });
  svg.addEventListener("pointermove", function (e) {
    if (eraseOn) { if (eraseAt(pt(e))) save(); return; }
    if (!cur) return;
    var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    (evs.length ? evs : [e]).forEach(function (ev) {
      var q = pt(ev), l = cur.p[cur.p.length - 1];
      if (Math.abs(q[0] - l[0]) + Math.abs(q[1] - l[1]) >= 1) cur.p.push(q);
    });
    cur.el.setAttribute("d", pathD(cur.p));
  });
  function end(e) {
    if (eraseOn) { eraseOn = false; return; }
    if (!cur) return;
    data.strokes.push(cur); cur = null; save();
  }
  svg.addEventListener("pointerup", end);
  svg.addEventListener("pointercancel", end);
  // iPad Safari: กันการเลื่อน/เลือกข้อความ/Scribble เฉพาะเมื่อแตะด้วย Apple Pencil (touchType "stylus")
  // ไม่อย่างนั้น Safari จะยกเลิกเส้น (pointercancel) ทำให้ขีดได้แค่เส้นสั้น ๆ — นิ้วไม่ถูกกัน จึงเลื่อน/ซูมได้ตามปกติ
  function stylus(e) {
    for (var i = 0; i < e.changedTouches.length; i++) if (e.changedTouches[i].touchType === "stylus") return true;
    return false;
  }
  ["touchstart", "touchmove"].forEach(function (t) {
    svg.addEventListener(t, function (e) { if (st.on && stylus(e)) e.preventDefault(); }, { passive: false });
  });
  // แตะสั้น ๆ ด้วยนิ้วระหว่างโหมดปากกา → ส่งต่อไปยังปุ่ม/ลิงก์ที่อยู่ใต้ชั้นหมึก (เช่น ดูเฉลย)
  var tap = null;
  svg.addEventListener("pointerdown", function (e) {
    if (st.on && e.pointerType === "touch") tap = { id: e.pointerId, x: e.clientX, y: e.clientY, t: Date.now() };
  });
  svg.addEventListener("pointerup", function (e) {
    if (!tap || e.pointerId !== tap.id) return;
    var quick = Date.now() - tap.t < 500 && Math.abs(e.clientX - tap.x) + Math.abs(e.clientY - tap.y) < 12;
    tap = null;
    if (!quick) return;
    svg.style.pointerEvents = "none";
    var el = document.elementFromPoint(e.clientX, e.clientY);
    svg.style.pointerEvents = "";
    if (!el) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) el.focus();
    el.click();
  });
  svg.addEventListener("pointercancel", function () { tap = null; });

  // ---- ปุ่ม
  toggle.addEventListener("click", function () {
    st.on = !st.on; refreshBar();
    if (st.on) say("โหมดปากกา: Pencil เขียน · นิ้วเลื่อน/ซูมได้ตามปกติ");
  });
  bar.querySelectorAll(".ink-pen").forEach(function (b) {
    b.addEventListener("click", function () { st.pen = +b.dataset.i; st.eraser = false; refreshBar(); });
  });
  $(".ink-eraser").addEventListener("click", function () { st.eraser = !st.eraser; refreshBar(); });
  $(".ink-undo").addEventListener("click", function () {
    var s = data.strokes.pop(); if (s) { s.el.remove(); save(); }
  });
  var clearArmed = 0;
  $(".ink-clear").addEventListener("click", function () {
    if (!data.strokes.length) return;
    if (Date.now() - clearArmed > 3000) { clearArmed = Date.now(); say("แตะ 🗑 อีกครั้งเพื่อล้างหมึกหน้านี้ทั้งหมด", 3000); return; }
    clearArmed = 0; data.strokes = []; renderAll(); save(); say("ล้างหมึกหน้านี้แล้ว");
  });
  $(".ink-export").addEventListener("click", function () {
    var pages = {}, n = 0;
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(PREFIX) === 0) { try { pages[k] = JSON.parse(localStorage.getItem(k)); n++; } catch (e) {} }
    }
    if (!n) { say("ยังไม่มีหมึกให้สำรอง"); return; }
    var blob = new Blob([JSON.stringify({ app: "python-ink", version: 1, saved: new Date().toISOString(), pages: pages })], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "python-ink-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
    say("สำรองหมึก " + n + " หน้าแล้ว");
  });
  $(".ink-import").addEventListener("click", function () { file.click(); });
  file.addEventListener("change", function () {
    var f = file.files[0]; if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      try {
        var d = JSON.parse(rd.result), n = 0;
        if (!d || d.app !== "python-ink" || !d.pages) throw 0;
        Object.keys(d.pages).forEach(function (k) {
          if (k.indexOf(PREFIX) === 0) { localStorage.setItem(k, JSON.stringify(d.pages[k])); n++; }
        });
        data = load(); renderAll();
        say("นำหมึกเข้ามา " + n + " หน้าแล้ว");
      } catch (e) { say("ไฟล์นี้ไม่ใช่ไฟล์สำรองหมึก"); }
      file.value = "";
    };
    rd.readAsText(f);
  });

  renderAll();
  refreshBar();
  if (data.strokes.length && data.w && Math.abs(data.w - main.clientWidth) > 40)
    say("หมึกหน้านี้เขียนตอนจอกว้างต่างจากตอนนี้ ตำแหน่งอาจเลื่อน — หมุนจอให้เหมือนตอนเขียน", 5000);
})();
