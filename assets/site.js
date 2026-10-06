document.addEventListener("DOMContentLoaded", () => {
  const chapters = [...document.querySelectorAll(".chapter-nav-item")];
  const filters = [...document.querySelectorAll(".filter")];
  const search = document.querySelector("#chapter-search");
  const status = document.querySelector("#search-status");
  const nav = document.querySelector("#chapter-nav");
  let currentFilter = "all";

  function updateLinks() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    chapters.forEach((chapter) => {
      const matchesFilter = currentFilter === "all" || chapter.dataset.group === currentFilter;
      const matchesSearch = !query || chapter.dataset.search.toLocaleLowerCase().includes(query);
      chapter.hidden = !(matchesFilter && matchesSearch);
      if (!chapter.hidden) visible++;
    });
    nav.querySelectorAll(".toc-label[data-group]").forEach((label) => {
      label.hidden = !chapters.some((chapter) => chapter.dataset.group === label.dataset.group && !chapter.hidden);
    });
    let empty = nav.querySelector(".chapter-empty");
    if (!visible && !empty) {
      empty = document.createElement("p");
      empty.className = "chapter-empty";
      empty.textContent = "ไม่พบบทเรียนที่ตรงกัน";
      nav.append(empty);
    } else if (visible && empty) empty.remove();
    status.textContent = query ? `พบบทเรียน ${visible} บท` : "";
  }

  filters.forEach((button) => button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    updateLinks();
  }));
  search.addEventListener("input", updateLinks);
});
