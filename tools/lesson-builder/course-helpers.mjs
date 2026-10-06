// โครงข้อมูลบทเรียน
// concepts: [หัวข้อ, คำอธิบาย, { code, stdin, table, figure, tip, plot, window }]
// examples: { title, idea, code, steps, stdin?, plot?, window? }
// exercises: task(ชื่อ, ระดับ, { task, given, want, checklist, code, explain, stdin?, plot?, window? })
export const chapter = (title, group, summary, outcome, concepts, examples, exercises) =>
  ({ title, group, summary, outcome, concepts, examples, exercises });

export const task = (title, level, fields) => ({ title, level, ...fields });

export const figure = (name, alt) => ({ src: `assets/figures/${name}`, alt });
