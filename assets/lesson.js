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

document.addEventListener("DOMContentLoaded", () => {
  addCopyButtons();

  document.querySelectorAll(".answer-gate").forEach((gate) => {
    const openButton = gate.querySelector(".answer-open");
    const form = gate.querySelector(".password-form");
    const input = form.querySelector("input");
    const message = form.querySelector(".password-message");
    const answer = gate.querySelector(".answer-content");
    openButton.addEventListener("click", () => {
      form.hidden = false;
      openButton.hidden = true;
      input.focus();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const password = window.EXERCISE_PASSWORDS?.[gate.dataset.answerId];
      if (password && input.value.trim() === password) {
        answer.hidden = false;
        form.hidden = true;
        answer.querySelector("h4")?.focus();
      } else {
        message.textContent = "รหัสผ่านไม่ถูกต้อง ลองอีกครั้ง";
        input.select();
      }
    });
  });
});
