// ระบายสี source code Python ตอน build (ใช้คลาสสีชุดเดียวกับเว็บ Java: tok-kw, tok-str, ...)

const KEYWORDS = new Set(("and as assert async await break class continue def del elif else except finally for from global if "
  + "import in is lambda nonlocal not or pass raise return try while with yield match case").split(" "));
const CONSTANTS = new Set(["True", "False", "None", "self", "cls"]);
const BUILTINS = new Set(("abs all any bool dict divmod enumerate filter float format input int isinstance len list map max min "
  + "next open print range repr reversed round set sorted str sum super tuple type zip").split(" "));

const TOKEN = new RegExp([
  /(#[^\n]*)/,                                                                  // 1 comment
  /((?:\b[rRbBfFuU]{1,2})?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))/, // 2 string
  /((?<=^[ \t]*)@[A-Za-z_][\w.]*)/,                                              // 3 decorator
  /(\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?j?\b)/,                                 // 4 number
  /([A-Za-z_]\w*)(?=(\s*\()?)/,                                                  // 5 word, 6 followed by "("
].map((r) => r.source).join("|"), "gm");

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function highlightPython(code) {
  let html = "";
  let last = 0;
  let previous = "";
  const span = (cls, text) => `<span class="tok-${cls}">${esc(text)}</span>`;
  for (const m of code.matchAll(TOKEN)) {
    html += esc(code.slice(last, m.index));
    last = m.index + m[0].length;
    const [text, comment, string, decorator, number, word, call] = m;
    if (comment) html += span("com", text);
    else if (string) html += span("str", text);
    else if (decorator) html += span("ann", text);
    else if (number) html += span("num", text);
    else if (previous === "def") html += span("fn", text);
    else if (previous === "class") html += span("type", text);
    else if (KEYWORDS.has(word)) html += span("kw", text);
    else if (CONSTANTS.has(word)) html += span("const", text);
    else if (/^[A-Z][A-Z0-9_]+$/.test(word)) html += span("const", text);
    else if (/^[A-Z]/.test(word)) html += span("type", text);
    else if (BUILTINS.has(word) || call !== undefined) html += span("fn", text);
    else html += esc(text);
    previous = word ?? "";
  }
  return html + esc(code.slice(last));
}
