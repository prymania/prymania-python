function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.append(helper);
    helper.select();
    try {
      document.execCommand("copy") ? resolve() : reject(new Error("Clipboard API unavailable"));
    } catch (error) {
      reject(error);
    } finally {
      helper.remove();
    }
  });
}

// ปุ่มคัดลอกอยู่ในแถบชื่อไฟล์ของแผงโค้ด
function addCopyButtons() {
  document.querySelectorAll(".code-block > pre").forEach((pre) => {
    const head = pre.parentElement.querySelector(".code-head");
    if (!head || head.querySelector(".copy-button")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "คัดลอก";
    button.setAttribute("aria-label", "คัดลอก source code");
    button.addEventListener("click", () => {
      copyText(pre.innerText).then(() => {
        button.textContent = "คัดลอกแล้ว ✓";
        button.classList.add("copied");
      }, (error) => {
        button.textContent = "คัดลอกไม่สำเร็จ";
        console.error("Could not copy source code", error);
      }).finally(() => {
        setTimeout(() => {
          button.textContent = "คัดลอก";
          button.classList.remove("copied");
        }, 1600);
      });
    });
    head.append(button);
  });
}

// ---------- ถอดรหัสเฉลย (ดัดแปลงจาก window.__calcUnlock ใน nav.js ของเว็บ Calculus) ----------
// build.mjs เข้ารหัสเฉลยแต่ละข้อด้วย AES-GCM (กุญแจ = PBKDF2 ของรหัสบทนั้น) เว็บไม่มีรหัสเก็บไว้
// รหัสจริงอยู่ใน private/passwords.json ของผู้สอนเท่านั้น · พิมพ์รหัสถูก = ถอดเฉลยได้, ผิด = ถอดไม่ออก
const unlockAnswers = (() => {
  const ITER = 150000;            // ต้องตรงกับ KDF_ITER ใน tools/lesson-builder/build.mjs
  const SALT_TAG = "py-prymania"; // ต้องตรงกับ SALT_TAG ใน build.mjs
  const te = new TextEncoder();
  const bytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  async function deriveKey(kind, chap, pw) {
    const salt = new Uint8Array(await crypto.subtle.digest("SHA-256", te.encode(`${SALT_TAG}:${kind}:${chap}`))).slice(0, 16);
    const base = await crypto.subtle.importKey("raw", te.encode(pw), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
  }
  // ถอดทุกกล่องใน els → true ถ้ารหัสถูก, false ถ้าผิด
  return async (kind, chap, pw, els) => {
    els = els.filter((el) => el.hasAttribute("data-enc"));
    if (!els.length) return true;
    if (!window.crypto?.subtle) throw new Error("เบราว์เซอร์นี้ถอดรหัสไม่ได้ (ต้องเปิดผ่าน https หรือเปิดไฟล์ในเครื่อง)");
    try {
      const key = await deriveKey(kind, chap, pw);
      const pairs = await Promise.all(els.map(async (el) => {
        const u = bytes(el.getAttribute("data-enc"));
        const buf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: u.slice(0, 12) }, key, u.slice(12));
        return [el, new TextDecoder().decode(buf)];
      }));
      pairs.forEach(([el, html]) => { el.innerHTML = html; el.removeAttribute("data-enc"); });
      addCopyButtons();
      return true;
    } catch {
      return false;
    }
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  addCopyButtons();

  // เฉลยแบบฝึกหัดท้ายบท: ใส่รหัสครั้งเดียว ปลดล็อกทุกข้อในบท ใช้ได้จนปิดแท็บ (sessionStorage)
  const gates = [...document.querySelectorAll(".answer-gate")];
  if (!gates.length) return;
  const chap = gates[0].dataset.chapter;
  const KEY = `pyAnswersPw-${chap}`;
  const saved = () => { try { return sessionStorage.getItem(KEY); } catch { return null; } };
  const remember = (pw) => { try { sessionStorage.setItem(KEY, pw); } catch {} };
  const unlock = (pw) => unlockAnswers("exercises", chap, pw, gates.map((g) => g.querySelector(".answer-content")));

  gates.forEach((gate) => {
    const openButton = gate.querySelector(".answer-open");
    const form = gate.querySelector(".password-form");
    const input = form.querySelector("input");
    const message = form.querySelector(".password-message");
    const answer = gate.querySelector(".answer-content");
    const show = (open) => {
      answer.hidden = !open;
      form.hidden = true;
      openButton.hidden = false;
      openButton.textContent = open ? "ซ่อนเฉลย" : "ดูเฉลย";
      openButton.setAttribute("aria-expanded", String(open));
      if (open) answer.querySelector("h4")?.focus();
    };
    openButton.addEventListener("click", async () => {
      if (!answer.hidden) { show(false); return; }
      if (!answer.hasAttribute("data-enc")) { show(true); return; }   // ถอดแล้ว (ใส่รหัสจากข้ออื่นในบทนี้)
      const pw = saved();
      if (pw && await unlock(pw)) { show(true); return; }
      form.hidden = false;
      openButton.hidden = true;
      message.textContent = "";
      input.focus();
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const pw = input.value.trim();
      message.textContent = "กำลังตรวจ…";
      try {
        if (!(await unlock(pw))) {
          message.textContent = "รหัสผ่านไม่ถูกต้อง ลองอีกครั้ง";
          input.select();
          return;
        }
      } catch (error) {
        message.textContent = error.message;
        return;
      }
      remember(pw);
      input.value = "";
      message.textContent = "";
      // ปลดล็อกทั้งบทแล้ว: ปุ่มของข้ออื่นเปลี่ยนเป็น "ดูเฉลย" และซ่อนฟอร์มที่เปิดค้างไว้
      gates.forEach((g) => {
        if (g === gate) return;
        g.querySelector(".password-form").hidden = true;
        const b = g.querySelector(".answer-open");
        b.hidden = false;
        if (g.querySelector(".answer-content").hidden) b.textContent = "ดูเฉลย";
      });
      show(true);
    });
  });
});
