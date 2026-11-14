// ============================================================
//  widget ในหน้าภาคผนวก (คัดลอกจาก docs/assets/widgets.js ของเว็บ Calculus)
//  ใช้: <div class="widget" data-w="stats|feedback|faq" ...></div>
// ============================================================
(function () {
  "use strict";

  // ---------- สถิติผู้เข้าชม (ภาคผนวก C) · <div class="widget" data-w="stats" data-gc="https://CODE.goatcounter.com"> ----------
  // ใช้ตัวนับสาธารณะของ GoatCounter (/counter/PATH.json, server cache ~4 ชม., วันตามเวลา UTC)
  // ?start=D&end=D รวมชั่วโมง 00:00 ของวันถัดไปด้วย → ดึงยอดสะสม "ตั้งแต่วัน D" แล้วลบกันทีละวันแทน
  function stats(box) {
    var base = box.dataset.gc, DAYS = 14;
    var TH_M = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    function get(path, start) {
      return fetch(base + "/counter/" + encodeURIComponent(path) + ".json" + (start ? "?start=" + start : ""))
        .then(function (r) {
          if (r.status === 404) return 0;   // หน้านี้ยังไม่มีคนเข้า
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json().then(function (j) { return parseInt(String(j.count).replace(/\D/g, ""), 10) || 0; });
        });
    }
    function fmt(n) { return n.toLocaleString("en-US"); }
    var now = new Date(), days = [];
    for (var i = DAYS - 1; i >= 0; i--) days.push(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)));
    box.innerHTML = '<div class="widget-head">📊 ผู้เข้าชมเว็บ <span class="tag">' + DAYS + ' วันล่าสุด</span></div>' +
      '<div class="widget-body"><p class="gc-msg">กำลังโหลดสถิติ…</p></div>';
    var body = box.querySelector(".widget-body");
    Promise.all([get("TOTAL")].concat(days.map(function (d) { return get("TOTAL", d.toISOString().slice(0, 10)); })))
      .then(function (r) {
        var total = r[0], cum = r.slice(1), daily = cum.map(function (c, k) { return c - (k + 1 < cum.length ? cum[k + 1] : 0); });
        var max = Math.max.apply(null, daily.concat([1]));
        var tiles = [["วันนี้", daily[DAYS - 1]], ["7 วันล่าสุด", cum[DAYS - 7]], ["ทั้งหมด", total]];
        body.innerHTML = '<div class="gc-tiles">' + tiles.map(function (t) {
            return '<div class="gc-tile"><span>' + t[0] + '</span><b>' + fmt(t[1]) + '</b></div>';
          }).join("") + '</div>' +
          '<div class="gc-chart" role="img" aria-label="จำนวนผู้เข้าชมรายวัน ' + DAYS + ' วันล่าสุด">' + daily.map(function (n, k) {
            return '<div class="gc-col' + (k === DAYS - 1 ? " today" : "") + '" title="' + days[k].getUTCDate() + " " + TH_M[days[k].getUTCMonth()] + ": " + fmt(n) + ' คน">' +
              '<span class="gc-v">' + (n ? fmt(n) : "") + '</span><i style="height:' + (n / max * 100).toFixed(1) + '%"></i></div>';
          }).join("") + '</div>' +
          '<div class="gc-days">' + days.map(function (d, k) {
            return '<span>' + (k === DAYS - 1 ? "วันนี้" : d.getUTCDate() + (k === 0 || d.getUTCDate() === 1 ? " " + TH_M[d.getUTCMonth()] : "")) + '</span>';
          }).join("") + '</div>';
      })
      .catch(function () {
        body.innerHTML = '<p class="gc-msg">⚠ โหลดสถิติไม่ได้ — ต้องต่ออินเทอร์เน็ต และบางครั้ง ad blocker บล็อกไว้</p>';
      });
    // ตารางแยกรายบท: <tr data-gc-path="chapter-01.html"> … <td class="gc-n"></td>
    // path เทียบจากหน้านี้ (เว็บนี้หน้าบทอยู่ใน chapters/ ส่วนหน้าแรกคือ ../index.html) · หน้าแรกนับเป็น ".../" แบบเดียวกับ ANALYTICS ใน build.mjs
    document.querySelectorAll("[data-gc-path]").forEach(function (tr) {
      var cell = tr.querySelector(".gc-n");
      var path = new URL(tr.dataset.gcPath, location.href).pathname.replace(/\/index\.html$/, "/");
      get(path).then(function (n) { cell.textContent = fmt(n); }, function () { cell.textContent = "–"; });
    });
  }

  // ---------- ส่งข้อความถึงอาจารย์ (ภาคผนวก D) · <div class="widget" data-w="feedback" data-url="WEB_APP_EXEC_URL"><form class="fb-form">… ----------
  // ฟอร์มเขียนไว้ในไฟล์ภาคผนวกแล้ว widget นี้แค่ผูกการทำงาน · POST แบบ x-www-form-urlencoded (ไม่มี preflight) ไป Apps Script
  // ปุ่มท้ายบทลิงก์มาที่ #ask-N → เลือก "บทที่ N" ให้และเลื่อนมาที่ฟอร์ม · ร่างที่ยังไม่ส่งจำไว้ใน localStorage
  function feedback(box) {
    var url = box.dataset.url, form = box.querySelector("form"), msg = form.msg, btn = form.querySelector("button[type=submit]");
    var status = form.querySelector(".fb-status"), count = form.querySelector(".fb-count"), KEY = "python:fb-draft", MAX = 2000;
    function say(t, kind) { status.textContent = t; status.className = "fb-status" + (kind ? " " + kind : ""); }
    function upd() { count.textContent = msg.value.length + " / " + MAX; }
    try { var d = localStorage.getItem(KEY); if (d && !msg.value) msg.value = d; } catch (e) {}
    upd();
    msg.addEventListener("input", function () { upd(); try { localStorage.setItem(KEY, msg.value); } catch (e) {} });
    function fromHash() {
      var m = /^#ask-(\d+)$/.exec(location.hash);
      if (!m) return;
      form.chapter.value = "บทที่ " + m[1];
      box.scrollIntoView({ block: "start" });
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    if (!url) { btn.disabled = true; say("⚠ ระบบส่งข้อความยังไม่เปิด", "err"); return; }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (msg.value.trim().length < 3) { say("พิมพ์ข้อความก่อนนะ", "err"); msg.focus(); return; }
      btn.disabled = true; btn.textContent = "กำลังส่ง…"; say("");
      fetch(url, { method: "POST", body: new URLSearchParams(new FormData(form)) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j.ok) throw new Error(j.error || "ส่งไม่สำเร็จ");
          msg.value = ""; upd();
          try { localStorage.removeItem(KEY); } catch (e) {}
          say("✓ ส่งแล้ว ขอบคุณนะ อาจารย์จะอ่านทุกข้อความ", "ok");
        })
        .catch(function (e) {
          say("⚠ " + (e instanceof TypeError ? "ส่งไม่ได้ ตรวจอินเทอร์เน็ตแล้วลองใหม่" : e.message) + " (ข้อความยังอยู่ในช่อง ไม่หาย)", "err");
        })
        .then(function () { btn.disabled = false; btn.textContent = "ส่งข้อความ"; });
    });
  }

  // ---------- คำถามที่พบบ่อย (ภาคผนวก D) · <div class="widget" data-w="faq" data-url="WEB_APP_EXEC_URL"> ----------
  // GET ?action=faq → {ok, items:[{type, chapter, q, a, date}]} เฉพาะข้อที่อาจารย์ติ๊กในชีต · ข้อความใส่ด้วย textContent (กัน HTML)
  function faq(box) {
    var url = box.dataset.url;
    box.innerHTML = '<div class="widget-head">📚 คำถามที่พบบ่อย <span class="tag faq-n"></span></div>' +
      '<div class="widget-body"><div class="faq-ctl"></div><div class="faq-list"><p class="gc-msg">กำลังโหลดคำถาม…</p></div></div>';
    var list = box.querySelector(".faq-list"), ctl = box.querySelector(".faq-ctl");
    if (!url) { list.innerHTML = '<p class="gc-msg">ยังไม่มีคำถามที่พบบ่อย</p>'; return; }
    function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
    fetch(url + "?action=faq").then(function (r) { return r.json(); }).then(function (j) {
      var items = (j && j.items) || [];
      box.querySelector(".faq-n").textContent = items.length + " ข้อ";
      if (!items.length) { list.innerHTML = '<p class="gc-msg">ยังไม่มีคำถามที่ตอบไว้ ถามเป็นคนแรกได้เลย</p>'; return; }
      var chs = [];
      items.forEach(function (it) { if (it.chapter && chs.indexOf(it.chapter) < 0) chs.push(it.chapter); });
      chs.sort(function (a, b) { return a.localeCompare(b, "th", { numeric: true }); });
      var sel = el("select"), q = el("input");
      sel.setAttribute("aria-label", "เลือกบท"); q.type = "search"; q.placeholder = "ค้นคำถาม…"; q.setAttribute("aria-label", "ค้นคำถาม");
      sel.appendChild(el("option", null, "ทุกบท")).value = "";
      chs.forEach(function (c) { sel.appendChild(el("option", null, c)).value = c; });
      ctl.appendChild(sel); ctl.appendChild(q);
      var m = /^#ask-(\d+)$/.exec(location.hash);
      if (m && chs.indexOf("บทที่ " + m[1]) >= 0) sel.value = "บทที่ " + m[1];
      list.innerHTML = "";
      var rows = items.map(function (it) {
        var d = el("details", "faq-item"), s = el("summary");
        s.appendChild(el("span", "faq-chip", it.chapter || "ทั่วไป"));
        s.appendChild(el("span", "faq-q", it.q));
        d.appendChild(s);
        var a = el("div", "faq-a"); a.appendChild(el("div", "faq-at", "อาจารย์ตอบ" + (it.date ? " · " + it.date : "")));
        a.appendChild(el("div", "faq-text", it.a));
        d.appendChild(a); list.appendChild(d);
        return { d: d, it: it, text: (it.q + " " + it.a).toLowerCase() };
      });
      var none = list.appendChild(el("p", "gc-msg", "ไม่พบคำถามที่ตรงกับที่เลือก"));
      function filter() {
        var c = sel.value, t = q.value.trim().toLowerCase(), n = 0;
        rows.forEach(function (r) {
          var show = (!c || r.it.chapter === c) && (!t || r.text.indexOf(t) >= 0);
          r.d.hidden = !show; if (show) n++;
        });
        none.hidden = n > 0;
      }
      sel.addEventListener("change", filter); q.addEventListener("input", filter);
      filter();
    }).catch(function () {
      list.innerHTML = '<p class="gc-msg">⚠ โหลดคำถามไม่ได้ ต้องต่ออินเทอร์เน็ต ลองรีเฟรชอีกครั้ง</p>';
    });
  }

  var W = { stats: stats, feedback: feedback, faq: faq };
  function init() {
    document.querySelectorAll(".widget[data-w]").forEach(function (box) {
      try { W[box.dataset.w](box); } catch (e) { box.innerHTML = '<div class="widget-body">⚠ widget error: ' + e.message + "</div>"; }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
