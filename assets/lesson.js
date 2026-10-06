async function copyCode(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.append(helper);
  helper.select();
  try {
    if (!document.execCommand("copy")) throw new Error("Clipboard API unavailable");
  } finally {
    helper.remove();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre.copyable").forEach((pre) => {
    const wrap = document.createElement("div");
    wrap.className = "code-wrap";
    pre.replaceWith(wrap);
    wrap.append(pre);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "คัดลอกโค้ด";
    button.setAttribute("aria-label", "คัดลอก source code");
    button.addEventListener("click", async () => {
      try {
        await copyCode(pre.innerText);
        button.textContent = "คัดลอกแล้ว ✓";
        button.classList.add("copied");
      } catch (error) {
        button.textContent = "คัดลอกไม่สำเร็จ";
        console.error("Could not copy source code", error);
      }
      setTimeout(() => {
        button.textContent = "คัดลอกโค้ด";
        button.classList.remove("copied");
      }, 1600);
    });
    wrap.append(button);
  });

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
      if (password && input.value === password) {
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
