import { chapter, task, figure } from "./course-helpers.mjs";

const studentsCsv = `name,score
Nina,88
Beam,72
Mali,95
Tom,45
`;

// ส่วนที่ 2: ฝึกเขียนและใช้งาน (บทที่ 9–13)
export const practice = [
  chapter("ข้อผิดพลาด การจัดการ exception และ debug", "practice",
    "อ่าน error ให้เข้าใจ ดักจับข้อผิดพลาดด้วย try/except และหาสาเหตุเมื่อผลลัพธ์ผิด",
    "อ่าน traceback หาบรรทัดที่ผิด ใช้ try/except กับ error ที่คาดได้ แจ้ง error เองด้วย raise และไล่หาบั๊กอย่างเป็นขั้นตอน",
    [
      ["อ่าน traceback",
        "เมื่อโปรแกรมพัง Python แสดง traceback ให้อ่านจากล่างขึ้นบน: บรรทัดสุดท้ายบอกชนิดและสาเหตุ บรรทัดเหนือขึ้นไปบอกไฟล์และเลขบรรทัดที่เกิดปัญหา",
        {
          table: {
            head: ["บรรทัดใน traceback", "ความหมาย"],
            rows: [
              ["`Traceback (most recent call last):`", "เริ่มรายงาน error"],
              ["`File \"score.py\", line 2, in <module>`", "เกิดที่ไฟล์ score.py บรรทัดที่ 2"],
              ["`score = int(text)`", "โค้ดบรรทัดนั้น"],
              ["`ValueError: invalid literal for int() with base 10: 'abc'`", "ชนิด error: สาเหตุ ← อ่านบรรทัดนี้ก่อน"]
            ]
          }
        }],
      ["error ที่พบบ่อย",
        "error แต่ละชนิดบอกสาเหตุคนละแบบ รู้ชื่อไว้จะเดาที่มาได้เร็ว",
        {
          table: {
            head: ["Error", "เกิดเมื่อ", "ตัวอย่าง"],
            rows: [
              ["`ValueError`", "ค่าชนิดถูกแต่ใช้ไม่ได้", "`int(\"abc\")`"],
              ["`TypeError`", "ใช้ชนิดข้อมูลผิด", "`\"5\" + 1`"],
              ["`ZeroDivisionError`", "หารด้วยศูนย์", "`10 / 0`"],
              ["`IndexError`", "index เกินขนาด list", "`[1, 2][5]`"],
              ["`KeyError`", "ไม่มี key ใน dict", "`{\"a\": 1}[\"b\"]`"],
              ["`FileNotFoundError`", "ไม่พบไฟล์", "`open(\"no.txt\")`"]
            ]
          }
        }],
      ["try / except: ดักจับ error",
        "ใส่โค้ดที่อาจพังไว้ใน `try:` ถ้าเกิด error ชนิดที่ระบุ โปรแกรมจะไปทำ `except` แทนการหยุดทำงาน ระบุชนิด error ให้ชัด อย่าใช้ `except:` เปล่า ๆ เพราะจะซ่อนบั๊กอื่น",
        {
          code: `text = input("ตัวเลข: ")
try:
    n = int(text)
    print("สองเท่าคือ", n * 2)
except ValueError:
    print(f"'{text}' ไม่ใช่ตัวเลข")
print("โปรแกรมทำงานต่อได้")`,
          stdin: "abc\n"
        }],
      ["ดักหลายชนิด และดูข้อความ error",
        "มี `except` ได้หลายอันสำหรับ error ต่างชนิด และใช้ `as e` เก็บรายละเอียดของ error ไว้แสดงได้",
        {
          code: `for a, b in [("10", "2"), ("10", "0"), ("ten", "2")]:
    try:
        print(int(a) / int(b))
    except ZeroDivisionError:
        print("หารด้วยศูนย์ไม่ได้")
    except ValueError as e:
        print("ข้อมูลผิด:", e)`
        }],
      ["raise: แจ้ง error เอง",
        "เมื่อข้อมูลผิดกติกาของเรา เช่น อายุติดลบ ให้ `raise ValueError(\"ข้อความ\")` เพื่อหยุดทันทีพร้อมบอกเหตุผล ผู้เรียกจะดักจับด้วย try/except ได้",
        {
          code: `def set_age(age):
    if age < 0:
        raise ValueError("อายุติดลบไม่ได้")
    return age

try:
    set_age(-5)
except ValueError as e:
    print("ผิดพลาด:", e)`
        }],
      ["ไล่หาบั๊กเมื่อผลลัพธ์ผิด",
        "บางบั๊กไม่มี error แต่คำตอบผิด (logic error) ให้พิมพ์ค่าระหว่างทางออกมาดู หรือใช้ debugger ของ Thonny เดินโค้ดทีละบรรทัดแล้วดูค่าตัวแปร",
        {
          table: {
            head: ["Thonny", "ทำอะไร"],
            rows: [
              ["`Ctrl + F5` (ปุ่มแมลง)", "เริ่ม debug"],
              ["`F6` Step over", "ไปบรรทัดถัดไป"],
              ["`F7` Step into", "เข้าไปในฟังก์ชัน"],
              ["View → Variables", "ดูค่าตัวแปรทุกตัวขณะรัน"]
            ]
          },
          code: `scores = [80, 90, 70]
total = 0
for s in scores:
    total += s
    print("debug:", s, total)   # ดูค่าระหว่างทาง
print("เฉลี่ย", total / len(scores))`
        }]
    ],
    [
      {
        title: "ถามจนกว่าจะได้ตัวเลขที่ถูกต้อง",
        idea: "ใช้ `while True` คู่กับ try/except และ `break` เมื่อได้ค่าที่ใช้ได้",
        stdin: "abc\n-5\n20\n",
        code: `while True:
    text = input("อายุ: ")
    try:
        age = int(text)
        if age < 0:
            raise ValueError("อายุติดลบไม่ได้")
        break
    except ValueError as e:
        print("ลองใหม่:", e)

print(f"อายุ {age} ปี")`,
        steps: [
          "`while True` วนไม่จบจนกว่าจะเจอ `break`",
          "`abc` ทำให้ `int()` เกิด ValueError ส่วน `-5` แปลงได้แต่ผิดกติกา เราจึง raise เอง",
          "ทั้งสองกรณีไปที่ `except` เดียวกัน เมื่อได้ค่าถูกจึง `break` ออกจากลูป"
        ]
      },
      {
        title: "ฟังก์ชันหารที่ปลอดภัย",
        idea: "ฟังก์ชันรับผิดชอบจัดการ error เอง แล้วคืนผลที่ผู้เรียกใช้ต่อได้",
        code: `def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None

for a, b in [(10, 4), (7, 0)]:
    result = safe_divide(a, b)
    if result is None:
        print(f"{a} / {b} = หารไม่ได้")
    else:
        print(f"{a} / {b} = {result}")`,
        steps: [
          "ถ้าหารได้คืนผลหาร ถ้าหารด้วยศูนย์คืน `None` (ค่าว่าง)",
          "ผู้เรียกตรวจด้วย `is None` แล้วเลือกข้อความที่เหมาะ",
          "โปรแกรมไม่หยุดกลางทาง แม้ข้อมูลบางชุดผิด"
        ]
      }
    ],
    [
      task("แปลงตัวเลขอย่างปลอดภัย", 1, {
        task: "รับข้อความจากผู้ใช้ ถ้าแปลงเป็นจำนวนเต็มได้ให้แสดงค่ายกกำลังสอง ถ้าไม่ได้ให้แสดง `กรุณาพิมพ์ตัวเลข`",
        given: "ข้อความที่ผู้ใช้พิมพ์ เช่น `12a`",
        want: "`กรุณาพิมพ์ตัวเลข`",
        checklist: ["ใส่ `int(input(...))` ใน `try`", "ดัก `ValueError`"],
        stdin: "12a\n",
        code: `try:
    n = int(input("ตัวเลข: "))
    print(n ** 2)
except ValueError:
    print("กรุณาพิมพ์ตัวเลข")`,
        explain: "`int(\"12a\")` เกิด ValueError โปรแกรมจึงกระโดดไปที่ except โดยไม่ทำบรรทัด print ใน try"
      }),
      task("ระบุชนิด error", 1, {
        task: "ก่อนรัน ให้ทายว่าแต่ละคำสั่งเกิด error ชนิดใด: `[1, 2, 3][3]`, `{\"a\": 1}[\"b\"]`, `\"5\" + 5` แล้วตรวจด้วย try/except",
        given: "คำสั่ง 3 แบบ",
        want: "ชื่อ error ของแต่ละคำสั่ง",
        checklist: ["ใส่แต่ละคำสั่งใน try แยกกัน", "ใช้ `except Exception as e` แล้วพิมพ์ `type(e).__name__`"],
        code: `try:
    [1, 2, 3][3]
except Exception as e:
    print(type(e).__name__)
try:
    {"a": 1}["b"]
except Exception as e:
    print(type(e).__name__)
try:
    "5" + 5
except Exception as e:
    print(type(e).__name__)`,
        explain: "list มีตำแหน่ง 0–2 จึงเกิน (IndexError), dict ไม่มี key `b` (KeyError) และบวกข้อความกับตัวเลขไม่ได้ (TypeError) ข้อนี้ใช้ `Exception` เพื่อสำรวจเท่านั้น งานจริงควรระบุชนิด"
      }),
      task("เครื่องคิดเลขหาร", 2, {
        task: "รับตัวเลข 2 ค่าแล้วหารกัน ให้รับมือทั้งกรณีพิมพ์ไม่ใช่ตัวเลขและหารด้วยศูนย์ โดยแสดงข้อความต่างกัน",
        given: "ตัวตั้ง 15 และตัวหาร 0",
        want: "`หารด้วยศูนย์ไม่ได้`",
        checklist: ["รับและหารใน try เดียวกัน", "except แยก 2 อัน: `ValueError` และ `ZeroDivisionError`"],
        stdin: "15\n0\n",
        code: `try:
    a = float(input("ตัวตั้ง: "))
    b = float(input("ตัวหาร: "))
    print(f"ผลหาร {a / b:.2f}")
except ValueError:
    print("กรุณาพิมพ์ตัวเลข")
except ZeroDivisionError:
    print("หารด้วยศูนย์ไม่ได้")`,
        explain: "Python เลือก except ที่ตรงกับชนิด error ที่เกิดจริง จึงบอกผู้ใช้ได้ตรงสาเหตุ"
      }),
      task("ตรวจคะแนนด้วย raise", 2, {
        task: "เขียน `check_score(score)` ที่ raise `ValueError` เมื่อคะแนนไม่อยู่ในช่วง 0–100 แล้วทดสอบกับ 85, 120, -3",
        given: "คะแนน 85, 120, -3",
        want: "85 ผ่าน, อีก 2 ค่าแสดงข้อความ error",
        checklist: ["ใช้ `if not 0 <= score <= 100: raise ValueError(...)`", "วนทดสอบทั้ง 3 ค่าใน try/except"],
        code: `def check_score(score):
    if not 0 <= score <= 100:
        raise ValueError(f"คะแนน {score} อยู่นอกช่วง 0-100")
    return score

for s in [85, 120, -3]:
    try:
        print("ใช้ได้:", check_score(s))
    except ValueError as e:
        print("ผิดพลาด:", e)`,
        explain: "ฟังก์ชันตรวจกติกาแล้ว raise ส่วนผู้เรียกตัดสินใจเองว่าจะแสดงผลหรือจัดการอย่างไร"
      }),
      task("แก้บั๊กค่าเฉลี่ย", 3, {
        task: "โปรแกรมนี้ควรได้ค่าเฉลี่ย 80 แต่ได้ 23.33: `total = 0` แล้ว `for s in [80, 90, 70]:` ข้างในเยื้อง `total = s` จากนั้นนอกลูป `average = total / 3` ให้หาบั๊กด้วยการพิมพ์ค่าระหว่างทางแล้วแก้",
        given: "โค้ดที่รันได้แต่ผลผิด (logic error)",
        want: "`เฉลี่ย 80.00`",
        checklist: ["พิมพ์ `total` ทุกรอบ จะเห็นว่าไม่สะสม", "`total = s` ทับค่าเดิม ต้องเป็น `total += s`", "ลบบรรทัด debug ออกเมื่อแก้เสร็จ"],
        code: `scores = [80, 90, 70]
total = 0
for s in scores:
    total += s
average = total / len(scores)
print(f"เฉลี่ย {average:.2f}")`,
        explain: "โค้ดเดิม `total = s` ทับค่าทุกรอบ จึงเหลือแค่ค่าสุดท้าย (70) แล้วหาร 3 ได้ 23.33 การพิมพ์ `total` ทุกรอบจะเห็นทันทีว่าไม่สะสม และการใช้ `len()` แทนเลข 3 ป้องกันบั๊กเมื่อจำนวนคะแนนเปลี่ยน"
      }),
      task("รวมราคาจากข้อมูลที่ปนข้อผิดพลาด", 3, {
        task: "รายการราคาเป็นข้อความ `[\"120\", \"abc\", \"80.5\", \"\", \"45\"]` ให้รวมเฉพาะค่าที่แปลงได้ และนับว่าข้ามไปกี่ค่า",
        given: "list ราคาที่บางค่าแปลงไม่ได้",
        want: "`รวม 245.50 บาท (ข้าม 2 ค่า)`",
        checklist: ["วนทีละค่า แปลงด้วย `float()` ใน try", "สำเร็จ: บวกเข้า total / ล้มเหลว: เพิ่มตัวนับ skipped", "try อยู่ในลูป ค่าที่ผิดจึงไม่หยุดทั้งโปรแกรม"],
        code: `prices = ["120", "abc", "80.5", "", "45"]
total = 0
skipped = 0
for text in prices:
    try:
        total += float(text)
    except ValueError:
        skipped += 1
print(f"รวม {total:.2f} บาท (ข้าม {skipped} ค่า)")`,
        explain: "ข้อมูลจริงมักมีค่าเสีย การวาง try ไว้ในลูปทำให้จัดการทีละค่า และนับค่าที่ข้ามไว้รายงานได้"
      })
    ]),

  chapter("ไฟล์ ข้อมูล CSV และ JSON", "practice",
    "อ่านและเขียนไฟล์ข้อความ CSV และ JSON เพื่อเก็บข้อมูลไว้ใช้ต่อหลังปิดโปรแกรม",
    "เปิดไฟล์ด้วย with เขียน/อ่านไฟล์ข้อความ อ่านตาราง CSV และบันทึก/โหลดข้อมูลด้วย JSON",
    [
      ["เปิดไฟล์ด้วย with open()",
        "`with open(ชื่อไฟล์, โหมด, encoding=\"utf-8\") as f:` เปิดไฟล์และปิดให้อัตโนมัติเมื่อจบบล็อก ใส่ `encoding=\"utf-8\"` เสมอเพื่อให้อ่านภาษาไทยได้",
        {
          table: {
            head: ["โหมด", "ความหมาย", "ถ้ามีไฟล์อยู่แล้ว"],
            rows: [
              ["`\"r\"`", "อ่าน (ค่าเริ่มต้น)", "อ่านได้ / ไม่มีไฟล์ → FileNotFoundError"],
              ["`\"w\"`", "เขียนใหม่", "ลบเนื้อหาเดิมทิ้ง"],
              ["`\"a\"`", "เขียนต่อท้าย", "เพิ่มต่อจากเนื้อหาเดิม"]
            ]
          },
          code: `with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("บรรทัดที่ 1\\n")
    f.write("บรรทัดที่ 2\\n")

with open("notes.txt", encoding="utf-8") as f:
    print(f.read())`,
          tip: "`\\n` คือขึ้นบรรทัดใหม่ `write()` ไม่ขึ้นบรรทัดให้เองเหมือน `print()`"
        }],
      ["อ่านทีละบรรทัด",
        "วน for ผ่านไฟล์ได้ทีละบรรทัด แต่ละบรรทัดมี `\\n` ติดมาด้วย ให้ใช้ `strip()` ตัดออกก่อนใช้งาน",
        {
          files: { "todo.txt": "ซื้อนม\nอ่านบทที่ 10\nส่งการบ้าน\n" },
          code: `with open("todo.txt", encoding="utf-8") as f:
    for number, line in enumerate(f, start=1):
        print(number, line.strip())`,
          tip: "`enumerate()` ให้ทั้งลำดับและค่าในแต่ละรอบ"
        }],
      ["CSV: ข้อมูลตาราง",
        "CSV คือไฟล์ตารางที่คั่นคอลัมน์ด้วย `,` เปิดใน Excel ได้ ใช้โมดูล `csv` อ่านด้วย `DictReader` จะได้แต่ละแถวเป็น dict ที่ใช้ชื่อคอลัมน์เป็น key",
        {
          files: { "students.csv": studentsCsv },
          code: `import csv

with open("students.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["name"], int(row["score"]))`,
          tip: "ค่าที่อ่านจาก CSV เป็นข้อความเสมอ ต้องแปลงด้วย `int()` หรือ `float()` ก่อนคำนวณ"
        }],
      ["JSON: บันทึก list/dict ทั้งก้อน",
        "JSON เก็บข้อมูลที่ซ้อนกันได้ เช่น dict ที่มี list อยู่ข้างใน `json.dump()` บันทึกลงไฟล์ และ `json.load()` โหลดกลับมาเป็น dict/list เหมือนเดิม",
        {
          code: `import json

profile = {"name": "Nina", "skills": ["Python", "SQL"], "year": 2}
with open("profile.json", "w", encoding="utf-8") as f:
    json.dump(profile, f, ensure_ascii=False, indent=2)

with open("profile.json", encoding="utf-8") as f:
    data = json.load(f)
print(data["skills"][0], data["year"])`,
          tip: "`ensure_ascii=False` ให้เก็บภาษาไทยเป็นตัวอักษรที่อ่านออก `indent=2` จัดย่อหน้าให้อ่านง่าย"
        }],
      ["เลือก CSV หรือ JSON",
        "ทั้งสองแบบเป็นไฟล์ข้อความธรรมดา เลือกตามรูปร่างของข้อมูล",
        {
          table: {
            head: ["", "CSV", "JSON"],
            rows: [
              ["รูปร่างข้อมูล", "ตาราง แถว × คอลัมน์", "ซ้อนกันได้ (dict ใน list ใน dict)"],
              ["เปิดด้วย Excel", "ได้", "ไม่สะดวก"],
              ["ชนิดข้อมูลเมื่ออ่านกลับ", "ข้อความทั้งหมด", "ตัวเลข/ข้อความ/list ตามเดิม"],
              ["เหมาะกับ", "ข้อมูลรายชื่อ คะแนน ยอดขาย", "การตั้งค่าโปรแกรม ข้อมูลจาก Web API"]
            ]
          }
        }]
    ],
    [
      {
        title: "สรุปคะแนนจากไฟล์ CSV",
        idea: "อ่านไฟล์ คำนวณสถิติ แล้วเขียนรายชื่อคนที่ผ่านลงไฟล์ใหม่",
        files: { "students.csv": studentsCsv },
        code: `import csv

with open("students.csv", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

scores = [int(row["score"]) for row in rows]
print(f"{len(rows)} คน เฉลี่ย {sum(scores) / len(scores):.1f}")

with open("passed.txt", "w", encoding="utf-8") as f:
    for row in rows:
        if int(row["score"]) >= 50:
            f.write(row["name"] + "\\n")

with open("passed.txt", encoding="utf-8") as f:
    print("ผ่าน:", f.read().split())`,
        steps: [
          "`list(csv.DictReader(f))` อ่านทุกแถวเก็บไว้ใช้หลายรอบหลังปิดไฟล์",
          "`[int(row[\"score\"]) for row in rows]` สร้าง list คะแนนเป็นตัวเลขในบรรทัดเดียว (list comprehension)",
          "เขียนชื่อคนผ่านลงไฟล์ใหม่ทีละบรรทัด แล้วเปิดอ่านกลับเพื่อตรวจ"
        ]
      },
      {
        title: "รายการสิ่งที่ต้องทำที่จำค่าได้",
        idea: "โหลดรายการจาก JSON (ถ้ามี) เพิ่มงานใหม่ แล้วบันทึกกลับ",
        code: `import json
from pathlib import Path

path = Path("todo.json")
todos = json.loads(path.read_text(encoding="utf-8")) if path.exists() else []
print("ก่อนเพิ่ม:", todos)

todos.append({"task": "อ่านบทที่ 10", "done": False})
todos.append({"task": "ทำแบบฝึกหัด", "done": True})
path.write_text(json.dumps(todos, ensure_ascii=False, indent=2), encoding="utf-8")

for item in json.loads(path.read_text(encoding="utf-8")):
    mark = "✓" if item["done"] else " "
    print(f"[{mark}] {item['task']}")`,
        steps: [
          "`Path(...).exists()` ตรวจว่ามีไฟล์หรือยัง รอบแรกจึงเริ่มจาก list ว่าง",
          "`read_text()` / `write_text()` ของ pathlib อ่าน-เขียนทั้งไฟล์ได้ในคำสั่งเดียว",
          "`json.dumps()` / `json.loads()` (มี s) แปลงกับข้อความ ส่วน `dump()` / `load()` ทำงานกับไฟล์"
        ]
      }
    ],
    [
      task("เขียนบันทึกประจำวัน", 1, {
        task: "รับข้อความ 1 บรรทัดจากผู้ใช้ เขียนต่อท้ายไฟล์ `diary.txt` 2 ครั้ง (จำลองการเปิดโปรแกรม 2 วัน) แล้วอ่านทั้งไฟล์มาแสดง",
        given: "ข้อความวันแรกและวันที่สอง",
        want: "ไฟล์มี 2 บรรทัด ไม่ถูกเขียนทับ",
        checklist: ["ใช้โหมด `\"a\"` เพื่อเขียนต่อท้าย", "เติม `\\n` ท้ายข้อความ", "อ่านด้วยโหมด `\"r\"`"],
        stdin: "เรียนเรื่องไฟล์\nทำแบบฝึกหัดเสร็จ\n",
        code: `for _ in range(2):
    text = input("บันทึก: ")
    with open("diary.txt", "a", encoding="utf-8") as f:
        f.write(text + "\\n")

with open("diary.txt", encoding="utf-8") as f:
    print(f.read())`,
        explain: "ถ้าใช้ `\"w\"` บันทึกวันที่สองจะลบวันแรกทิ้ง โหมด `\"a\"` จึงเหมาะกับ log หรือบันทึกสะสม"
      }),
      task("นับบรรทัดและคำ", 1, {
        task: "อ่านไฟล์ `poem.txt` แล้วนับจำนวนบรรทัดและจำนวนคำทั้งหมด",
        given: "ไฟล์ poem.txt (3 บรรทัด)",
        want: "`3 บรรทัด 12 คำ`",
        files: { "poem.txt": "Python is simple\nPython is powerful\nlearn it step by step today\n" },
        checklist: ["วนอ่านทีละบรรทัด นับบรรทัด", "`len(line.split())` นับคำในบรรทัด", "สะสมทั้งสองค่า"],
        code: `lines = 0
words = 0
with open("poem.txt", encoding="utf-8") as f:
    for line in f:
        lines += 1
        words += len(line.split())
print(f"{lines} บรรทัด {words} คำ")`,
        explain: "การวนทีละบรรทัดใช้หน่วยความจำน้อย อ่านไฟล์ขนาดใหญ่ได้ และ `split()` ตัด `\\n` ท้ายบรรทัดให้เอง"
      }),
      task("หาคนคะแนนสูงสุดจาก CSV", 2, {
        task: "อ่าน `students.csv` แล้วแสดงชื่อและคะแนนของคนที่ได้คะแนนสูงสุด",
        given: "ไฟล์ students.csv",
        want: "`สูงสุด: Mali 95 คะแนน`",
        files: { "students.csv": studentsCsv },
        checklist: ["ใช้ `csv.DictReader`", "แปลงคะแนนเป็น `int` ก่อนเปรียบเทียบ", "เก็บแถวที่ดีที่สุดระหว่างวน"],
        code: `import csv

best = None
with open("students.csv", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        if best is None or int(row["score"]) > int(best["score"]):
            best = row
print(f"สูงสุด: {best['name']} {best['score']} คะแนน")`,
        explain: "ถ้าไม่แปลงเป็น int การเปรียบเทียบข้อความ `\"95\" > \"100\"` จะได้ True เพราะเทียบทีละตัวอักษร"
      }),
      task("เขียนไฟล์ CSV", 2, {
        task: "บันทึกรายการสินค้า 3 ชิ้นลงไฟล์ `products.csv` ที่มีหัวตาราง `name,price` แล้วอ่านทั้งไฟล์มาแสดง",
        given: "สินค้า pen 12, notebook 45, eraser 8",
        want: "ไฟล์ CSV 4 บรรทัด (หัวตาราง + 3 แถว)",
        checklist: ["`csv.writer(f)` แล้ว `writerow()` หัวตาราง", "`writerows()` เขียนหลายแถวพร้อมกัน", "เปิดด้วย `newline=\"\"` ป้องกันบรรทัดว่างแทรกบน Windows"],
        code: `import csv

products = [["pen", 12], ["notebook", 45], ["eraser", 8]]
with open("products.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "price"])
    writer.writerows(products)

with open("products.csv", encoding="utf-8") as f:
    print(f.read())`,
        explain: "`csv.writer` ใส่ `,` และจัดการข้อความที่มีจุลภาคให้เอง ปลอดภัยกว่าการต่อข้อความด้วยมือ"
      }),
      task("ไฟล์ตั้งค่าโปรแกรม", 3, {
        task: "โหลดการตั้งค่าจาก `settings.json` ถ้าไม่มีไฟล์ให้ใช้ค่าเริ่มต้น `{\"theme\": \"light\", \"font_size\": 14}` จากนั้นเปลี่ยน theme เป็น dark แล้วบันทึกกลับ",
        given: "ยังไม่มีไฟล์ settings.json",
        want: "แสดงค่าก่อนและหลังเปลี่ยน และไฟล์ถูกสร้างขึ้น",
        checklist: ["ใช้ try/except `FileNotFoundError` ตอนโหลด", "แก้ค่าใน dict", "บันทึกด้วย `json.dump(..., indent=2)`"],
        code: `import json

try:
    with open("settings.json", encoding="utf-8") as f:
        settings = json.load(f)
except FileNotFoundError:
    settings = {"theme": "light", "font_size": 14}
print("ก่อน:", settings)

settings["theme"] = "dark"
with open("settings.json", "w", encoding="utf-8") as f:
    json.dump(settings, f, indent=2)

with open("settings.json", encoding="utf-8") as f:
    print("ในไฟล์:", json.load(f))`,
        explain: "การดัก FileNotFoundError ทำให้โปรแกรมทำงานได้ตั้งแต่ครั้งแรกที่ยังไม่มีไฟล์ ครั้งต่อไปจะโหลดค่าที่บันทึกไว้"
      }),
      task("แปลง CSV เป็น JSON", 3, {
        task: "อ่าน `students.csv` แปลงคะแนนเป็นตัวเลข เพิ่มคีย์ `passed` (คะแนน ≥ 50) แล้วบันทึกเป็น `students.json`",
        given: "ไฟล์ students.csv",
        want: "ไฟล์ JSON ที่แต่ละคนมี name, score (ตัวเลข), passed (True/False)",
        files: { "students.csv": studentsCsv },
        checklist: ["อ่านด้วย DictReader", "แปลงและเพิ่มคีย์ในแต่ละแถว", "`json.dump(rows, f, indent=2)`"],
        code: `import csv
import json

with open("students.csv", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))
for row in rows:
    row["score"] = int(row["score"])
    row["passed"] = row["score"] >= 50

with open("students.json", "w", encoding="utf-8") as f:
    json.dump(rows, f, indent=2)
with open("students.json", encoding="utf-8") as f:
    print(f.read())`,
        explain: "JSON เก็บชนิดข้อมูลไว้ได้ ตัวเลขจึงยังเป็นตัวเลขและ True กลายเป็น `true` ในไฟล์ ซึ่งโหลดกลับเป็น True ได้"
      })
    ]),

  chapter("โมดูล virtual environment และ pip", "practice",
    "นำโมดูลมาตรฐานมาใช้ สร้างโมดูลของตัวเอง และติดตั้งแพ็กเกจเพิ่มด้วย pip ใน virtual environment",
    "import โมดูลได้หลายรูปแบบ ใช้โมดูลมาตรฐานที่พบบ่อย แยกโค้ดเป็นไฟล์โมดูลเอง และติดตั้งแพ็กเกจด้วย pip/venv",
    [
      ["import: นำโมดูลมาใช้",
        "โมดูลคือไฟล์ Python ที่มีฟังก์ชันพร้อมใช้ Python มีโมดูลมาตรฐานมาให้หลายร้อยตัว ไม่ต้องติดตั้งเพิ่ม",
        {
          table: {
            head: ["รูปแบบ", "เรียกใช้", "ใช้เมื่อ"],
            rows: [
              ["`import math`", "`math.sqrt(16)`", "รู้ชัดว่าฟังก์ชันมาจากไหน (แนะนำ)"],
              ["`from math import sqrt`", "`sqrt(16)`", "ใช้ไม่กี่ฟังก์ชันบ่อย ๆ"],
              ["`import numpy as np`", "`np.array(...)`", "ชื่อโมดูลยาว ใช้ชื่อย่อตามธรรมเนียม"]
            ]
          },
          code: `import math
from statistics import mean

print(math.sqrt(16), math.pi)
print(math.ceil(4.1), math.floor(4.9))
print(mean([70, 85, 90]))`
        }],
      ["โมดูลมาตรฐานที่ใช้บ่อย",
        "ตัวอย่างโมดูลที่ติดมากับ Python และงานที่ใช้",
        {
          table: {
            head: ["โมดูล", "ใช้ทำ", "ตัวอย่าง"],
            rows: [
              ["`math`", "คณิตศาสตร์", "`math.sqrt(2)`"],
              ["`random`", "สุ่ม", "`random.randint(1, 6)`, `random.choice(list)`"],
              ["`statistics`", "สถิติ", "`mean`, `median`, `stdev`"],
              ["`datetime`", "วันที่และเวลา", "`date(2026, 12, 25) - date.today()`"],
              ["`pathlib`", "จัดการไฟล์/โฟลเดอร์", "`Path(\"data\") / \"a.csv\"`"],
              ["`json`, `csv`", "อ่าน-เขียนข้อมูล", "บทที่ 10"]
            ]
          },
          code: `import random
from datetime import date

random.seed(1)                      # ทำให้สุ่มได้ผลเดิมทุกครั้ง (ไว้ทดสอบ)
print(random.randint(1, 6))
print(random.choice(["ค้อน", "กรรไกร", "กระดาษ"]))

exam = date(2026, 12, 15)
print((exam - date(2026, 11, 1)).days, "วัน")`
        }],
      ["สร้างโมดูลเอง",
        "ไฟล์ `.py` ทุกไฟล์เป็นโมดูลได้ เก็บฟังก์ชันที่ใช้บ่อยไว้ในไฟล์หนึ่ง แล้ว import จากอีกไฟล์ที่อยู่ในโฟลเดอร์เดียวกัน",
        {
          files: { "mytools.py": "def vat(amount, rate=0.07):\n    return amount * rate\n\ndef baht(amount):\n    return f\"{amount:,.2f} บาท\"\n" },
          code: `import mytools

price = 1500
print(mytools.baht(price))
print("VAT", mytools.baht(mytools.vat(price)))`,
          tip: "ห้ามตั้งชื่อไฟล์ซ้ำกับโมดูลที่มีอยู่ เช่น `random.py` เพราะ Python จะ import ไฟล์ของเราแทนของจริง"
        }],
      ["pip และ virtual environment",
        "แพ็กเกจที่ไม่ได้มากับ Python (เช่น numpy, pandas) ติดตั้งด้วย `pip` และควรติดตั้งใน virtual environment (venv) ซึ่งเป็นโฟลเดอร์ Python แยกของแต่ละโปรเจกต์ ทำให้เวอร์ชันแพ็กเกจของแต่ละงานไม่ชนกัน",
        {
          table: {
            head: ["ทำอะไร", "คำสั่ง (Windows Terminal ในโฟลเดอร์โปรเจกต์)"],
            rows: [
              ["สร้าง venv", "`python -m venv .venv`"],
              ["เปิดใช้งาน", "`.venv\\Scripts\\activate`"],
              ["ติดตั้งแพ็กเกจ", "`python -m pip install numpy`"],
              ["ดูที่ติดตั้งแล้ว", "`python -m pip list`"],
              ["บันทึกรายการแพ็กเกจ", "`python -m pip freeze > requirements.txt`"],
              ["ติดตั้งตามรายการ", "`python -m pip install -r requirements.txt`"]
            ]
          },
          tip: "ใน Thonny ใช้เมนู Tools → Manage packages… ค้นชื่อแพ็กเกจแล้วกด Install ได้เลย ไม่ต้องพิมพ์คำสั่ง"
        }],
      ["ตรวจว่าติดตั้งแล้วหรือยัง",
        "ถ้า import แล้วเกิด `ModuleNotFoundError` แปลว่ายังไม่ได้ติดตั้งแพ็กเกจนั้นใน Python ที่กำลังใช้ ใช้ try/except ตรวจและบอกวิธีแก้ได้",
        {
          code: `try:
    import numpy as np
    print("numpy เวอร์ชัน", np.__version__.split(".")[0] + ".x พร้อมใช้")
except ModuleNotFoundError:
    print("ยังไม่ได้ติดตั้ง: python -m pip install numpy")`
        }]
    ],
    [
      {
        title: "สุ่มแบ่งกลุ่มงาน",
        idea: "ใช้ `random.shuffle` สลับรายชื่อ แล้วตัดเป็นกลุ่มละ 2 คน",
        code: `import random

random.seed(7)
names = ["Nina", "Beam", "Mali", "Tom", "Ploy", "Arun"]
random.shuffle(names)

for i in range(0, len(names), 2):
    group = names[i:i + 2]
    print(f"กลุ่ม {i // 2 + 1}: {', '.join(group)}")`,
        steps: [
          "`random.seed(7)` ทำให้ผลสุ่มเหมือนเดิมทุกครั้ง ลบออกเมื่อใช้จริง",
          "`shuffle` สลับลำดับใน list เดิม",
          "`range(0, len(names), 2)` กระโดดทีละ 2 แล้ว slicing `[i:i + 2]` ตัดกลุ่ม"
        ]
      },
      {
        title: "สถิติคะแนนด้วยโมดูล statistics",
        idea: "ใช้ฟังก์ชันสำเร็จรูปแทนการเขียนสูตรเอง",
        code: `import statistics as st

scores = [67, 82, 75, 91, 58, 75, 88]
print("ค่าเฉลี่ย", round(st.mean(scores), 2))
print("มัธยฐาน", st.median(scores))
print("ฐานนิยม", st.mode(scores))
print("ส่วนเบี่ยงเบนมาตรฐาน", round(st.stdev(scores), 2))`,
        steps: [
          "`import statistics as st` ตั้งชื่อย่อให้เรียกสั้นลง",
          "`median` คือค่ากลางเมื่อเรียงแล้ว `mode` คือค่าที่ซ้ำมากที่สุด",
          "`round(x, 2)` ปัดทศนิยม 2 ตำแหน่ง"
        ]
      }
    ],
    [
      task("รากที่สองและปัดเศษ", 1, {
        task: "รับตัวเลข แล้วแสดงรากที่สอง ค่าปัดขึ้น และค่าปัดลง ด้วยโมดูล `math`",
        given: "ตัวเลข เช่น 20",
        want: "รากที่สอง 4.47, ปัดขึ้น 5, ปัดลง 4",
        checklist: ["`import math`", "`math.sqrt()`, `math.ceil()`, `math.floor()`"],
        stdin: "20\n",
        code: `import math

n = float(input("ตัวเลข: "))
root = math.sqrt(n)
print(f"รากที่สอง {root:.2f}")
print("ปัดขึ้น", math.ceil(root), "ปัดลง", math.floor(root))`,
        explain: "`ceil` ปัดขึ้นเสมอ `floor` ปัดลงเสมอ ต่างจาก `round` ที่ปัดตามค่าใกล้สุด"
      }),
      task("ทอยลูกเต๋า", 1, {
        task: "ทอยลูกเต๋า 2 ลูก 5 ครั้ง แสดงแต้มแต่ละครั้งและผลรวม (ใช้ `random.seed(3)` เพื่อให้ผลตรวจได้)",
        given: "ลูกเต๋า 2 ลูก หน้า 1–6",
        want: "5 บรรทัด แต่ละบรรทัดมีแต้ม 2 ลูกและผลรวม",
        checklist: ["`random.randint(1, 6)` สุ่ม 1 ถึง 6 รวมทั้งสองค่า", "วน 5 รอบ"],
        code: `import random

random.seed(3)
for roll in range(1, 6):
    a = random.randint(1, 6)
    b = random.randint(1, 6)
    print(f"ครั้งที่ {roll}: {a} + {b} = {a + b}")`,
        explain: "`randint` รวมค่าปลายทั้งสองข้าง ต่างจาก `range` ที่ไม่รวมตัวท้าย"
      }),
      task("นับวันถึงวันสอบ", 2, {
        task: "กำหนดวันนี้เป็น 1 พ.ย. 2026 และวันสอบเป็น 15 ธ.ค. 2026 ให้คำนวณจำนวนวันที่เหลือและจำนวนสัปดาห์",
        given: "2 วันที่",
        want: "`เหลือ 44 วัน (6 สัปดาห์ 2 วัน)`",
        checklist: ["`from datetime import date`", "ลบ date กันได้ผลเป็นช่วงเวลา ใช้ `.days`", "แยกสัปดาห์ด้วย `//` และ `%`"],
        code: `from datetime import date

today = date(2026, 11, 1)
exam = date(2026, 12, 15)
days = (exam - today).days
print(f"เหลือ {days} วัน ({days // 7} สัปดาห์ {days % 7} วัน)")`,
        explain: "ใช้งานจริงให้เปลี่ยน `today` เป็น `date.today()` ตัวอย่างนี้กำหนดวันตายตัวเพื่อให้ตรวจคำตอบได้"
      }),
      task("สุ่มรหัส OTP", 2, {
        task: "สร้างรหัส OTP ตัวเลข 6 หลัก 3 ชุด (ใช้ `random.seed(10)`)",
        given: "ความยาว 6 หลัก",
        want: "รหัส 6 หลัก 3 ชุด (อาจขึ้นต้นด้วย 0 ได้)",
        checklist: ["สุ่ม `random.choice(\"0123456789\")` ทีละหลัก", "ต่อข้อความด้วย `\"\".join(...)`"],
        code: `import random

random.seed(10)
for _ in range(3):
    otp = "".join(random.choice("0123456789") for _ in range(6))
    print(otp)`,
        explain: "สุ่มทีละหลักทำให้ได้เลข 0 นำหน้าได้ ถ้าสุ่ม `randint(0, 999999)` ต้องจัดรูป `:06d` เพิ่ม (งานจริงด้านความปลอดภัยควรใช้โมดูล `secrets`)"
      }),
      task("โมดูลแปลงหน่วย", 3, {
        task: "มีไฟล์ `units.py` ที่มีฟังก์ชัน `km_to_mile` และ `kg_to_lb` ให้ import มาใช้แปลง 10 km และ 60 kg",
        given: "ไฟล์โมดูล units.py",
        want: "`10 km = 6.21 mile` และ `60 kg = 132.28 lb`",
        files: { "units.py": "def km_to_mile(km):\n    return km * 0.621371\n\ndef kg_to_lb(kg):\n    return kg * 2.20462\n" },
        checklist: ["`from units import km_to_mile, kg_to_lb`", "เรียกฟังก์ชันแล้วจัดรูปทศนิยม 2 ตำแหน่ง"],
        code: `from units import km_to_mile, kg_to_lb

print(f"10 km = {km_to_mile(10):.2f} mile")
print(f"60 kg = {kg_to_lb(60):.2f} lb")`,
        explain: "การแยกฟังก์ชันไว้ในโมดูลทำให้หลายโปรแกรมใช้สูตรเดียวกันได้ แก้ที่ไฟล์เดียวก็มีผลทุกที่"
      }),
      task("เขียน requirements.txt", 3, {
        task: "โปรเจกต์ใช้ numpy, pandas และ matplotlib ให้เขียนโปรแกรมสร้างไฟล์ `requirements.txt` ที่ระบุเวอร์ชันขั้นต่ำ แล้วอ่านกลับมาแสดงชื่อแพ็กเกจ",
        given: "numpy ≥ 2.2, pandas ≥ 2.2, matplotlib ≥ 3.10",
        want: "ไฟล์ 3 บรรทัด และรายชื่อแพ็กเกจที่อ่านกลับมา",
        checklist: ["เขียนบรรทัดละแพ็กเกจในรูป `ชื่อ>=เวอร์ชัน`", "อ่านกลับแล้ว `split(\">=\")` เอาเฉพาะชื่อ"],
        code: `packages = {"numpy": "2.2", "pandas": "2.2", "matplotlib": "3.10"}
with open("requirements.txt", "w", encoding="utf-8") as f:
    for name, version in packages.items():
        f.write(f"{name}>={version}\\n")

with open("requirements.txt", encoding="utf-8") as f:
    content = f.read()
print(content)
print([line.split(">=")[0] for line in content.split()])`,
        explain: "ไฟล์นี้ทำให้คนอื่นติดตั้งแพ็กเกจครบด้วยคำสั่งเดียว `python -m pip install -r requirements.txt`"
      })
    ]),

  chapter("เขียนโปรแกรมเชิงวัตถุด้วย class", "practice",
    "รวมข้อมูลและการทำงานที่เกี่ยวข้องกันไว้ใน class แล้วสร้าง object ได้หลายตัว",
    "สร้าง class กำหนด attribute ใน __init__ เขียน method สร้าง object หลายตัว และจัดการ list ของ object ได้",
    [
      ["class คือแม่แบบ object คือของจริง",
        "class อธิบายว่าสิ่งหนึ่งมีข้อมูล (attribute) อะไร และทำอะไรได้ (method) ส่วน object คือของจริงที่สร้างจาก class แต่ละตัวมีข้อมูลของตัวเอง",
        {
          figure: figure("class-object.svg", "class Student เป็นแม่แบบที่มี name, score และ method grade() สร้าง object ได้หลายตัว เช่น Nina 88 และ Beam 72")
        }],
      ["__init__ และ self",
        "`__init__` ทำงานอัตโนมัติตอนสร้าง object ใช้กำหนดค่าเริ่มต้น `self` คือ object ตัวที่กำลังสร้าง/ใช้งานอยู่ `self.name = name` จึงหมายถึงเก็บ name ไว้ใน object นี้",
        {
          code: `class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

a = Student("Nina", 88)
b = Student("Beam", 72)
print(a.name, a.score)
print(b.name, b.score)`,
          tip: "ตอนสร้าง `Student(\"Nina\", 88)` ไม่ต้องส่ง self Python ใส่ให้เอง"
        }],
      ["method: การทำงานของ object",
        "method คือฟังก์ชันใน class รับ `self` เป็นพารามิเตอร์แรกเสมอ จึงอ่านและแก้ข้อมูลของ object ได้",
        {
          code: `class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def grade(self):
        return "ผ่าน" if self.score >= 50 else "ไม่ผ่าน"

    def add_bonus(self, points):
        self.score += points

s = Student("Tom", 45)
print(s.grade())
s.add_bonus(10)
print(s.score, s.grade())`
        }],
      ["__str__: กำหนดวิธีแสดงผล",
        "ถ้า `print(object)` ตรง ๆ จะได้ข้อความอ่านยาก เช่น `<__main__.Student object at 0x...>` เขียน method `__str__` คืนข้อความที่ต้องการแสดงแทน",
        {
          code: `class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __str__(self):
        return f"{self.name} ราคา {self.price:,.2f} บาท"

print(Product("Notebook", 1290))`
        }],
      ["ทำงานกับ object หลายตัว",
        "เก็บ object ไว้ใน list แล้ววนลูปเรียก method หรืออ่าน attribute ได้เหมือนข้อมูลชนิดอื่น",
        {
          code: `class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

students = [Student("Nina", 88), Student("Beam", 72), Student("Mali", 95)]
for s in students:
    print(s.name, s.score)
best = max(students, key=lambda s: s.score)
print("สูงสุด:", best.name)`,
          tip: "`key=lambda s: s.score` บอก `max` ให้เทียบด้วยคะแนน"
        }]
    ],
    [
      {
        title: "บัญชีเงินฝาก",
        idea: "object เก็บยอดเงินของตัวเอง และ method ตรวจกติกาก่อนเปลี่ยนยอด",
        code: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            print(f"{self.owner}: ยอดเงินไม่พอ")
            return
        self.balance -= amount

    def __str__(self):
        return f"{self.owner}: {self.balance:,} บาท"

a = BankAccount("Nina", 1000)
b = BankAccount("Beam")
a.deposit(500)
a.withdraw(300)
b.withdraw(100)
print(a)
print(b)`,
        steps: [
          "`balance=0` เป็นค่าเริ่มต้น บัญชีของ Beam จึงเริ่มที่ 0",
          "`withdraw` ตรวจยอดก่อนหัก ผู้ใช้ class ไม่ต้องเขียนเงื่อนไขนี้ซ้ำเอง",
          "a และ b เป็นคนละ object ยอดเงินจึงแยกกัน"
        ]
      },
      {
        title: "ตะกร้าสินค้าแบบ object",
        idea: "class หนึ่งเก็บ object ของอีก class ไว้ใน list",
        code: `class Item:
    def __init__(self, name, price, qty):
        self.name = name
        self.price = price
        self.qty = qty

    def total(self):
        return self.price * self.qty

class Cart:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)

    def total(self):
        return sum(item.total() for item in self.items)

cart = Cart()
cart.add(Item("ปากกา", 12, 3))
cart.add(Item("สมุด", 45, 2))
for item in cart.items:
    print(f"{item.name:<6} {item.total():>5}")
print(f"{'รวม':<6} {cart.total():>5}")`,
        steps: [
          "`Item` รู้วิธีคิดราคาของตัวเอง",
          "`Cart` เก็บ Item หลายตัว และรวมยอดด้วยการเรียก `total()` ของแต่ละชิ้น",
          "แต่ละ class รับผิดชอบงานของตัวเอง โค้ดจึงแก้ไขง่าย"
        ]
      }
    ],
    [
      task("class สี่เหลี่ยม", 1, {
        task: "สร้าง class `Rectangle` เก็บ width และ height มี method `area()` และ `perimeter()` แล้วทดสอบกับ 4 × 6",
        given: "กว้าง 4 ยาว 6",
        want: "`พื้นที่ 24 เส้นรอบรูป 20`",
        checklist: ["`__init__(self, width, height)` เก็บเป็น attribute", "method คืนค่าด้วย return", "สร้าง object แล้วเรียก method"],
        code: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

r = Rectangle(4, 6)
print("พื้นที่", r.area(), "เส้นรอบรูป", r.perimeter())`,
        explain: "method เข้าถึงความกว้างยาวผ่าน self ได้ จึงไม่ต้องส่งค่าเข้าไปซ้ำทุกครั้ง"
      }),
      task("ตัวนับ", 1, {
        task: "สร้าง class `Counter` เริ่มที่ 0 มี method `increment()` เพิ่มทีละ 1 และ `reset()` กลับเป็น 0",
        given: "เรียก increment 3 ครั้ง แล้ว reset",
        want: "`3` แล้ว `0`",
        checklist: ["`self.value = 0` ใน `__init__`", "method เปลี่ยนค่า `self.value`"],
        code: `class Counter:
    def __init__(self):
        self.value = 0

    def increment(self):
        self.value += 1

    def reset(self):
        self.value = 0

c = Counter()
for _ in range(3):
    c.increment()
print(c.value)
c.reset()
print(c.value)`,
        explain: "object จำสถานะ (value) ไว้ระหว่างการเรียก method แต่ละครั้ง"
      }),
      task("แสดง object ให้อ่านง่าย", 2, {
        task: "สร้าง class `Book` มี title, author, pages และ `__str__` ให้ `print(book)` ได้ `\"Python 101\" โดย Ada (320 หน้า)`",
        given: "หนังสือ Python 101, Ada, 320 หน้า",
        want: "`\"Python 101\" โดย Ada (320 หน้า)`",
        checklist: ["เขียน `__str__(self)` คืนข้อความ", "ใช้ f-string รวม attribute"],
        code: `class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages

    def __str__(self):
        return f'"{self.title}" โดย {self.author} ({self.pages} หน้า)'

print(Book("Python 101", "Ada", 320))`,
        explain: "`print()` เรียก `__str__` ให้อัตโนมัติ ใช้ `'...'` ครอบ f-string เพราะข้างในมี `\"` อยู่แล้ว"
      }),
      task("กระปุกออมสิน", 2, {
        task: "สร้าง class `PiggyBank` มีเป้าหมายเงินออม method `save(amount)` และ `progress()` คืนเปอร์เซ็นต์ที่ออมได้",
        given: "เป้าหมาย 2000 บาท ออม 500, 300, 450",
        want: "`ออมแล้ว 1250 / 2000 บาท (62.5%)`",
        checklist: ["เก็บ `goal` และ `saved`", "`progress()` คืน `saved / goal * 100`"],
        code: `class PiggyBank:
    def __init__(self, goal):
        self.goal = goal
        self.saved = 0

    def save(self, amount):
        self.saved += amount

    def progress(self):
        return self.saved / self.goal * 100

bank = PiggyBank(2000)
for amount in [500, 300, 450]:
    bank.save(amount)
print(f"ออมแล้ว {bank.saved} / {bank.goal} บาท ({bank.progress():.1f}%)")`,
        explain: "ค่าที่คำนวณได้จากข้อมูลอื่น (progress) ทำเป็น method ดีกว่าเก็บเป็น attribute เพราะไม่ต้องคอยอัปเดตตาม"
      }),
      task("ห้องเรียน", 3, {
        task: "สร้าง class `Student` (name, score) และ `Classroom` ที่มี method `add()`, `average()` และ `top()` คืนนักเรียนคะแนนสูงสุด",
        given: "Nina 88, Beam 72, Mali 95",
        want: "`เฉลี่ย 85.00` และ `สูงสุด Mali`",
        checklist: ["Classroom เก็บ list ของ Student", "`average()` ใช้ sum ของคะแนนทุกคน", "`top()` ใช้ `max(..., key=lambda s: s.score)`"],
        code: `class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

class Classroom:
    def __init__(self):
        self.students = []

    def add(self, student):
        self.students.append(student)

    def average(self):
        return sum(s.score for s in self.students) / len(self.students)

    def top(self):
        return max(self.students, key=lambda s: s.score)

room = Classroom()
for name, score in [("Nina", 88), ("Beam", 72), ("Mali", 95)]:
    room.add(Student(name, score))
print(f"เฉลี่ย {room.average():.2f}")
print("สูงสุด", room.top().name)`,
        explain: "Classroom ไม่ต้องรู้รายละเอียดของ Student มากกว่า name และ score การแบ่งหน้าที่แบบนี้ทำให้ขยายโปรแกรมได้ง่าย"
      }),
      task("สินค้าในคลัง", 3, {
        task: "สร้าง class `Stock` มี name และ qty method `sell(n)` ที่ raise `ValueError` ถ้าขายเกินจำนวนที่มี แล้วทดสอบขาย 3 และ 10 จากของ 8 ชิ้น",
        given: "สินค้า 8 ชิ้น ขาย 3 แล้วขาย 10",
        want: "ขายครั้งแรกได้ เหลือ 5 ครั้งที่สองแสดงข้อความ error",
        checklist: ["ใน `sell` ตรวจ `n > self.qty` แล้ว raise", "ผู้เรียกใช้ try/except", "ยอดคงเหลือต้องไม่เปลี่ยนเมื่อขายไม่สำเร็จ"],
        code: `class Stock:
    def __init__(self, name, qty):
        self.name = name
        self.qty = qty

    def sell(self, n):
        if n > self.qty:
            raise ValueError(f"{self.name} เหลือ {self.qty} ชิ้น ขาย {n} ไม่ได้")
        self.qty -= n

pen = Stock("ปากกา", 8)
for n in [3, 10]:
    try:
        pen.sell(n)
        print(f"ขาย {n} ชิ้น เหลือ {pen.qty}")
    except ValueError as e:
        print("ผิดพลาด:", e)`,
        explain: "ตรวจก่อนเปลี่ยนค่าทำให้ object อยู่ในสถานะถูกต้องเสมอ ใช้ความรู้ raise จากบทที่ 9 ร่วมกับ class"
      })
    ]),

  chapter("เรียกใช้ Web API และแลกเปลี่ยน JSON", "practice",
    "ขอข้อมูลจากบริการบนอินเทอร์เน็ตด้วย requests อ่านผลที่เป็น JSON และจัดการเมื่อเชื่อมต่อไม่สำเร็จ",
    "เข้าใจ request/response และ status code เรียก API ด้วย requests.get ส่ง parameter อ่าน JSON และรับมือ error จากเครือข่าย",
    [
      ["API ทำงานอย่างไร",
        "Web API คือบริการที่ให้โปรแกรมขอข้อมูลผ่าน URL โปรแกรมเราส่ง request ไป เซิร์ฟเวอร์ตอบกลับเป็น response ซึ่งมี status code บอกผล และข้อมูลส่วนใหญ่อยู่ในรูป JSON",
        {
          figure: figure("http.svg", "โปรแกรม Python ส่ง GET request พร้อม URL ไปยังเซิร์ฟเวอร์ API แล้วได้ response กลับมาพร้อม status 200 และข้อมูล JSON"),
          table: {
            head: ["status code", "ความหมาย"],
            rows: [
              ["`200`", "สำเร็จ"],
              ["`400`", "request ผิดรูปแบบ"],
              ["`401` / `403`", "ไม่มีสิทธิ์ / ต้องใช้ API key"],
              ["`404`", "ไม่พบข้อมูลที่ขอ"],
              ["`500`", "เซิร์ฟเวอร์ขัดข้อง"]
            ]
          }
        }],
      ["JSON กับ Python",
        "JSON หน้าตาคล้าย dict และ list ของ Python แปลงไปมาได้ด้วยโมดูล `json`: `json.loads()` แปลงข้อความ JSON เป็น Python และ `json.dumps()` แปลงกลับ",
        {
          table: {
            head: ["JSON", "Python"],
            rows: [
              ["`{\"a\": 1}` object", "`dict`"],
              ["`[1, 2]` array", "`list`"],
              ["`\"text\"`", "`str`"],
              ["`true` / `false`", "`True` / `False`"],
              ["`null`", "`None`"]
            ]
          },
          code: `import json

text = '{"course": "Python", "credits": 3, "online": true, "tags": ["basic", "data"]}'
data = json.loads(text)
print(data["course"], data["credits"], data["online"])
print(data["tags"][1])
print(json.dumps({"ok": True, "note": None}))`
        }],
      ["requests.get(): ขอข้อมูล",
        "แพ็กเกจ `requests` (ติดตั้งด้วย `pip install requests`) ทำให้เรียก API ได้ในบรรทัดเดียว ใส่ `timeout` เสมอเพื่อไม่ให้โปรแกรมรอไม่สิ้นสุด แล้วใช้ `.json()` แปลงผลเป็น dict/list",
        {
          http: { status: 200, json: { id: 1, name: "Leanne Graham", email: "Sincere@april.biz", address: { city: "Gwenborough" } } },
          code: `import requests

response = requests.get("https://jsonplaceholder.typicode.com/users/1", timeout=5)
print(response.status_code)
user = response.json()
print(user["name"])
print(user["address"]["city"])`,
          tip: "jsonplaceholder.typicode.com เป็น API ฟรีสำหรับฝึก ไม่ต้องสมัคร ลองเปลี่ยนเลขท้าย URL ดูได้"
        }],
      ["ส่ง parameter",
        "ส่งเงื่อนไขการค้นหาด้วย `params=` เป็น dict แล้ว requests จะต่อท้าย URL ให้ในรูป `?key=value&...` และจัดการช่องว่าง/ภาษาไทยให้เอง",
        {
          http: { status: 200, json: [{ id: 1, title: "delectus aut autem", completed: false }, { id: 2, title: "quis ut nam facilis", completed: false }] },
          code: `import requests

params = {"userId": 1, "completed": "false", "_limit": 2}
response = requests.get("https://jsonplaceholder.typicode.com/todos", params=params, timeout=5)
print(response.url)
for todo in response.json():
    print("-", todo["title"])`
        }],
      ["รับมือเมื่อเรียกไม่สำเร็จ",
        "เครือข่ายล่มหรือเซิร์ฟเวอร์ตอบ error ได้เสมอ ใช้ `raise_for_status()` เปลี่ยน status 4xx/5xx เป็น error แล้วดักด้วย try/except",
        {
          http: { status: 404, json: {} },
          code: `import requests

try:
    response = requests.get("https://jsonplaceholder.typicode.com/users/999", timeout=5)
    response.raise_for_status()
    print(response.json()["name"])
except requests.Timeout:
    print("เซิร์ฟเวอร์ตอบช้าเกินไป")
except requests.RequestException as e:
    print("เรียก API ไม่สำเร็จ:", e)`,
          tip: "API ที่ต้องใช้ key อย่าเขียน key ไว้ในโค้ด ให้อ่านจาก environment variable เช่น `os.environ[\"API_KEY\"]`"
        }]
    ],
    [
      {
        title: "ค้นหาโพสต์ของผู้ใช้",
        idea: "เรียก API ด้วย parameter แล้วสรุปผลที่ได้",
        http: { status: 200, json: [
          { userId: 1, id: 1, title: "sunt aut facere repellat", body: "quia et suscipit" },
          { userId: 1, id: 2, title: "qui est esse", body: "est rerum tempore vitae" },
          { userId: 1, id: 3, title: "ea molestias quasi exercitationem", body: "et iusto sed quo iure" }
        ] },
        stdin: "1\n",
        code: `import requests

user_id = int(input("userId: "))
response = requests.get(
    "https://jsonplaceholder.typicode.com/posts",
    params={"userId": user_id},
    timeout=5,
)
response.raise_for_status()
posts = response.json()

print(f"ผู้ใช้ {user_id} มี {len(posts)} โพสต์")
for post in posts:
    print(f"#{post['id']} {post['title']}")`,
        steps: [
          "`params` สร้าง URL `.../posts?userId=1` ให้อัตโนมัติ",
          "`raise_for_status()` หยุดทันทีถ้า status ไม่ใช่ 2xx",
          "ผลเป็น list ของ dict จึงใช้ `len()` และวน for ได้ตามปกติ"
        ]
      },
      {
        title: "ดึงข้อมูลแล้วบันทึกเป็นไฟล์",
        idea: "เก็บผลจาก API ลงไฟล์ JSON ไว้ใช้ต่อโดยไม่ต้องเรียกซ้ำ",
        http: { status: 200, json: [
          { id: 1, name: "Leanne Graham", email: "Sincere@april.biz" },
          { id: 2, name: "Ervin Howell", email: "Shanna@melissa.tv" },
          { id: 3, name: "Clementine Bauch", email: "Nathan@yesenia.net" }
        ] },
        code: `import json
import requests

response = requests.get("https://jsonplaceholder.typicode.com/users", timeout=5)
response.raise_for_status()
users = [{"name": u["name"], "email": u["email"]} for u in response.json()]

with open("users.json", "w", encoding="utf-8") as f:
    json.dump(users, f, indent=2)
print(f"บันทึก {len(users)} คนลง users.json")
print(users[0])`,
        steps: [
          "เลือกเก็บเฉพาะข้อมูลที่ต้องใช้ (name, email) ด้วย list comprehension",
          "`json.dump` บันทึกลงไฟล์เหมือนบทที่ 10",
          "ครั้งต่อไปอ่านจากไฟล์ได้เลย ลดการเรียก API ซ้ำ"
        ]
      }
    ],
    [
      task("อ่าน JSON ซ้อนชั้น", 1, {
        task: "จากข้อความ JSON `{\"course\": \"Python\", \"teacher\": {\"name\": \"Ada\"}, \"topics\": [\"loop\", \"function\", \"class\"]}` ให้แสดงชื่อผู้สอนและจำนวนหัวข้อ",
        given: "ข้อความ JSON",
        want: "`ผู้สอน Ada สอน 3 หัวข้อ`",
        checklist: ["`json.loads()` แปลงเป็น dict", "ซ้อนชั้นใช้ `data[\"teacher\"][\"name\"]`", "`len()` นับ list"],
        code: `import json

text = '{"course": "Python", "teacher": {"name": "Ada"}, "topics": ["loop", "function", "class"]}'
data = json.loads(text)
print(f"ผู้สอน {data['teacher']['name']} สอน {len(data['topics'])} หัวข้อ")`,
        explain: "JSON ที่ซ้อนกันเข้าถึงทีละชั้นด้วยวงเล็บเหลี่ยมต่อกัน เหมือน dict ใน dict"
      }),
      task("ดูข้อมูลผู้ใช้จาก API", 1, {
        task: "เรียก `https://jsonplaceholder.typicode.com/users/2` แล้วแสดงชื่อ อีเมล และเมือง",
        given: "URL ของผู้ใช้หมายเลข 2",
        want: "ชื่อ อีเมล และเมืองของผู้ใช้",
        http: { status: 200, json: { id: 2, name: "Ervin Howell", email: "Shanna@melissa.tv", address: { city: "Wisokyburgh" } } },
        checklist: ["`requests.get(url, timeout=5)`", "`.json()` ได้ dict", "เมืองอยู่ใน `address`"],
        code: `import requests

user = requests.get("https://jsonplaceholder.typicode.com/users/2", timeout=5).json()
print("ชื่อ:", user["name"])
print("อีเมล:", user["email"])
print("เมือง:", user["address"]["city"])`,
        explain: "เปิด URL นี้ในเบราว์เซอร์ก่อนจะเห็นโครงสร้าง JSON ทั้งหมด ช่วยให้รู้ว่าต้องใช้ key อะไร"
      }),
      task("นับงานที่เสร็จแล้ว", 2, {
        task: "เรียกรายการ todo ของ userId 1 แล้วนับว่าเสร็จกี่งาน ยังไม่เสร็จกี่งาน",
        given: "API `/todos` พร้อม `params={\"userId\": 1}`",
        want: "`เสร็จ 2 งาน ค้าง 2 งาน`",
        http: { status: 200, json: [
          { id: 1, title: "delectus aut autem", completed: false },
          { id: 2, title: "quis ut nam facilis", completed: false },
          { id: 3, title: "fugiat veniam minus", completed: true },
          { id: 4, title: "et porro tempora", completed: true }
        ] },
        checklist: ["ส่ง `params` แทนการต่อ URL เอง", "`completed` เป็น True/False", "`sum(t[\"completed\"] for t in todos)` นับ True"],
        code: `import requests

todos = requests.get(
    "https://jsonplaceholder.typicode.com/todos",
    params={"userId": 1},
    timeout=5,
).json()
done = sum(t["completed"] for t in todos)
print(f"เสร็จ {done} งาน ค้าง {len(todos) - done} งาน")`,
        explain: "`true` ใน JSON กลายเป็น `True` ของ Python และ True นับเป็น 1 เมื่อนำมา `sum`"
      }),
      task("สร้าง JSON ส่งให้ API", 2, {
        task: "สร้าง dict ข้อมูลการลงทะเบียน (ชื่อ, วิชา, ยืนยันแล้ว = True, หมายเหตุ = ไม่มี) แล้วแปลงเป็นข้อความ JSON ที่จัดย่อหน้า",
        given: "Nina, ลงวิชา Python และ Data, ยืนยันแล้ว, ไม่มีหมายเหตุ",
        want: "ข้อความ JSON ที่มี `true` และ `null`",
        checklist: ["ใช้ `True` และ `None` ใน Python", "`json.dumps(data, indent=2, ensure_ascii=False)`"],
        code: `import json

data = {"name": "Nina", "courses": ["Python", "Data"], "confirmed": True, "note": None}
print(json.dumps(data, indent=2, ensure_ascii=False))`,
        explain: "ตอนส่งข้อมูลไป API ต้องแปลงเป็น JSON ก่อน `True` กลายเป็น `true` และ `None` กลายเป็น `null` ตามมาตรฐาน JSON"
      }),
      task("เรียก API อย่างปลอดภัย", 3, {
        task: "เขียนฟังก์ชัน `get_user(user_id)` ที่คืน dict ผู้ใช้ หรือคืน `None` เมื่อไม่พบ (404) หรือเชื่อมต่อไม่ได้ แล้วทดสอบกับ id ที่ไม่มีอยู่",
        given: "user_id = 999 (API ตอบ 404)",
        want: "`ไม่พบผู้ใช้ 999`",
        http: { status: 404, json: {} },
        checklist: ["ใส่ `timeout=5`", "`raise_for_status()` แล้วดัก `requests.RequestException`", "ผู้เรียกตรวจ `is None`"],
        code: `import requests

def get_user(user_id):
    try:
        response = requests.get(f"https://jsonplaceholder.typicode.com/users/{user_id}", timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        return None

user = get_user(999)
if user is None:
    print("ไม่พบผู้ใช้ 999")
else:
    print(user["name"])`,
        explain: "`RequestException` เป็นแม่ของ error ทุกแบบใน requests (Timeout, ConnectionError, HTTPError) ดักตัวเดียวครอบคลุมทุกกรณี"
      }),
      task("รายงานจาก API", 3, {
        task: "เรียก `/posts` (ได้หลายโพสต์จากหลายผู้ใช้) แล้วนับว่าแต่ละ userId มีกี่โพสต์ แสดงเรียงตาม userId",
        given: "รายการโพสต์ที่มี userId",
        want: "`userId 1: 2 โพสต์` และ `userId 2: 3 โพสต์`",
        http: { status: 200, json: [
          { userId: 1, id: 1, title: "a" }, { userId: 1, id: 2, title: "b" },
          { userId: 2, id: 11, title: "c" }, { userId: 2, id: 12, title: "d" }, { userId: 2, id: 13, title: "e" }
        ] },
        checklist: ["นับด้วย dict และ `get(key, 0) + 1` (บทที่ 7)", "`sorted(counts.items())` เรียงตาม key"],
        code: `import requests

posts = requests.get("https://jsonplaceholder.typicode.com/posts", timeout=5).json()
counts = {}
for post in posts:
    counts[post["userId"]] = counts.get(post["userId"], 0) + 1

for user_id, n in sorted(counts.items()):
    print(f"userId {user_id}: {n} โพสต์")`,
        explain: "ข้อมูลจาก API คือ list/dict ธรรมดา จึงใช้เทคนิคการนับจากบทก่อน ๆ ได้ทั้งหมด"
      })
    ])
];
