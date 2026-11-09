// เมนูด้านซ้าย (ใช้ร่วมกันใน index.html และทุกหน้าบท)
// - คลิกชื่อบทเพื่อเปิดหน้าบทนั้น ส่วนลูกศรด้านขวากาง/พับหัวข้อย่อย โดยไม่พับบทอื่น จึงไม่มีอะไรด้านบนขยับ
// - คลิกหัวข้อย่อยแล้วเปลี่ยนหน้า: หน้าใหม่วางหัวข้อนั้นไว้ตำแหน่งเดิมบนจอ เมนูจึงไม่กระโดด
// - ไฮไลต์หัวข้อย่อยที่กำลังอ่านอยู่
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".course-nav");
  if (!nav) return;
  const aside = nav.closest("aside");
  const toggle = aside.querySelector(".nav-toggle");
  const KEY = "py-course-nav";
  let clicked = false;
  const chaptersInNav = [...nav.querySelectorAll(".nav-chapter")];
  const openChapters = () => chaptersInNav.flatMap((d, i) => (d.open ? [i] : []));
  const scrolls = () => aside.scrollHeight > aside.clientHeight + 1 && getComputedStyle(aside).overflowY !== "visible";

  // จอเล็ก: ปุ่มเปิด/ปิดสารบัญ
  toggle?.addEventListener("click", () => {
    const open = aside.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // จอกว้าง: ปุ่ม « ซ่อนเมนู / ☰ เมนู แสดงกลับ (จำค่าไว้ทุกหน้า) — จาก nav.js ของเว็บ Calculus
  // สคริปต์ใน <head> ของทุกหน้าอ่านค่านี้ก่อนแสดงหน้า เมนูจึงไม่กระพริบ
  const side = (collapsed) => {
    document.documentElement.classList.toggle("side-collapsed", collapsed);
    try { localStorage.setItem("side-collapsed", collapsed ? "1" : "0"); } catch {}
  };
  document.querySelector(".side-hide")?.addEventListener("click", () => side(true));
  document.querySelector(".side-show")?.addEventListener("click", () => side(false));

  // จำลิงก์ที่คลิก (ชื่อบทหรือหัวข้อย่อย) และระยะจากขอบบนของเมนู ก่อนออกจากหน้า
  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    if (aside.classList.contains("nav-open")) {
      aside.classList.remove("nav-open");
      toggle?.setAttribute("aria-expanded", "false");
    }
    clicked = true;
    const target = new URL(link.href, location.href);
    const state = { page: target.pathname, hash: target.hash || "#lesson-content", offset: link.getBoundingClientRect().top - aside.getBoundingClientRect().top, scroll: aside.scrollTop, open: openChapters() };
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  });
  // ออกจากหน้าด้วยวิธีอื่น (ปุ่มบทถัดไป ปุ่มย้อนกลับ): จำแค่ตำแหน่ง scroll ของเมนู
  addEventListener("pagehide", () => {
    if (clicked) return;
    try { sessionStorage.setItem(KEY, JSON.stringify({ scroll: aside.scrollTop, open: openChapters() })); } catch {}
  });

  // เปิดหน้าใหม่: วางลิงก์ที่คลิกไว้ตำแหน่งเดิม ถ้าไม่มีให้ใช้ scroll เดิม หรือเลื่อนให้เห็นบทปัจจุบัน
  const current = nav.querySelector(".nav-chapter[open]");
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch {}
  // เปิดบทเดิมที่กางไว้ในหน้าก่อน ความสูงของเมนูด้านบนจึงเท่าเดิม
  saved?.open?.forEach((i) => { if (chaptersInNav[i]) chaptersInNav[i].open = true; });
  const link = saved?.page === location.pathname
    ? [...nav.querySelectorAll(".nav-chapter[open] .nav-topics a, .nav-chapter[open] a.nav-title")].find((a) => a.getAttribute("href") === saved.hash)
    : null;
  const restore = () => {
    if (!scrolls()) return;
    if (link) aside.scrollTop += link.getBoundingClientRect().top - aside.getBoundingClientRect().top - saved.offset;
    else if (typeof saved?.scroll === "number") aside.scrollTop = saved.scroll;
    else if (current) aside.scrollTop = current.offsetTop - 90;
  };
  restore();
  // ฟอนต์จาก Google Fonts โหลดเสร็จทีหลังทำให้ความสูงบรรทัดเปลี่ยน: จัดตำแหน่งซ้ำถ้าผู้ใช้ยังไม่ได้เลื่อนเมนูเอง
  let userScrolled = false;
  aside.addEventListener("wheel", () => { userScrolled = true; }, { passive: true });
  aside.addEventListener("touchmove", () => { userScrolled = true; }, { passive: true });
  document.fonts?.ready.then(() => { if (!userScrolled) restore(); });

  // ไฮไลต์หัวข้อย่อยที่กำลังอ่านอยู่
  if (!current || !("IntersectionObserver" in window)) return;
  const links = new Map();
  current.querySelectorAll('.nav-topics a[href^="#"]').forEach((a) => {
    const target = document.getElementById(a.getAttribute("href").slice(1));
    if (target && target.id !== "lesson-content") links.set(target, a);
  });
  const visible = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    const first = [...links.keys()].find((t) => visible.has(t));
    links.forEach((a, t) => a.classList.toggle("is-active", t === first));
  }, { rootMargin: "0px 0px -60% 0px" });
  links.forEach((_, target) => observer.observe(target));
});
