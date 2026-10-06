const ex = (title, level, task, checklist, code, explain) =>
  ({ title, level, task, checklist, code, explain });
const sample = (title, idea, code, steps) =>
  ({ title, idea, code, steps });

const extensions = {
  "ตัวดำเนินการและนิพจน์": {
    lessonIntro: "บทนี้ต่อจากการรู้จักชนิดข้อมูล โดยฝึกแปลงโจทย์คำนวณให้เป็น expression ที่ Python เข้าใจ ให้แยกการกำหนดค่า (=) ออกจากการเปรียบเทียบ (==) และลองไล่ผลของ // กับ % ด้วยตัวเลขที่หารไม่ลงตัวก่อนนำไปเขียนโปรแกรมจริง",
    examples: [
      sample("แยกเวลาเป็นชั่วโมงและนาที", "เมื่อมีจำนวนนาทีรวม ใช้ // หา hour เต็ม และ % หาเศษนาทีที่เหลือ",
        `total_minutes = 157
hours = total_minutes // 60
minutes = total_minutes % 60
print(f"{hours} hours {minutes} minutes")
print(157 / 60)`,
        ["// ใช้หารจำนวนเต็ม ไม่ใช่หารแล้วตัดข้อความ", "% คืนเศษหลังหาร", "/ ยังให้ผลลัพธ์แบบทศนิยม จึงตอบโจทย์คนละแบบ"])
    ],
    exercises: [
      ex("แยกธนบัตรและเศษเงิน", 1, "มีเงิน 287 บาท จงหาจำนวนธนบัตร 100 บาทเต็มใบที่ใช้ได้และเงินที่เหลือ โดยยังไม่ต้องทำระบบแลกเหรียญ",
        ["ใช้ // หาจำนวนธนบัตร", "ใช้ % หาเงินที่เหลือ", "แสดงผลพร้อมคำอธิบาย"], `money = 287
hundreds = money // 100
remaining = money % 100
print(f"100-baht bills: {hundreds}")
print(f"Remaining: {remaining} baht")`, "โจทย์แบ่งของเป็นกลุ่มเท่ากันใช้ // หาได้กี่กลุ่ม และ % หาส่วนที่เหลือ"),
      ex("ตรวจช่วงคะแนนสองด้าน", 2, "คะแนนมีค่า 63 ต้องตรวจว่าผ่านช่วงคะแนนกิจกรรม 50 ถึง 80 แบบรวมขอบเขตหรือไม่ และตรวจแยกว่าคะแนนหาร 3 ลงตัวหรือไม่",
        ["สร้าง expression เชื่อมขอบล่างและขอบบนด้วย and", "ใช้ % ตรวจการหารลงตัว", "แสดงผล Boolean ทั้งสองข้อ"], `score = 63
in_range = 50 <= score <= 80
divisible_by_three = score % 3 == 0
print(in_range)
print(divisible_by_three)`, "comparison chaining ใช้เปรียบเทียบขอบเขตต่อเนื่องได้ตรงกับความหมาย")
    ]
  },
  "เงื่อนไขและการตัดสินใจ": {
    lessonIntro: "โปรแกรมที่มีเงื่อนไขต้องตัดสินใจจากข้อมูล ไม่ใช่เลือกคำตอบแบบเดาสุ่ม เริ่มจากเขียนกติกาเป็นประโยคธรรมดา ขีดเส้นใต้กรณีพิเศษ แล้วเรียงตรวจกรณีเฉพาะก่อนกรณีกว้าง เพื่อไม่ให้เงื่อนไขช่วงคะแนนทับกัน",
    examples: [
      sample("แบ่งระดับคะแนนและตรวจข้อมูล", "ตรวจว่าคะแนนอยู่ในช่วงที่รับได้ก่อนจัดระดับ เพื่อไม่ให้ข้อมูลผิดถูกจัดเป็นเกรดปกติ",
        `score = 105
if not 0 <= score <= 100:
    result = "คะแนนอยู่นอกช่วง"
elif score >= 80:
    result = "A"
elif score >= 50:
    result = "ผ่าน"
else:
    result = "ไม่ผ่าน"
print(result)`,
        ["ตรวจค่าที่ไม่ถูกต้องก่อนตรวจเกรด", "elif ใช้เมื่อมีทางเลือกหลายช่วง", "Python เลือกบล็อกแรกที่เงื่อนไขเป็นจริง"])
    ],
    exercises: [
      ex("ตรวจสิทธิ์ทุน", 1, "ให้ทุนเมื่อนักศึกษามีเกรดเฉลี่ยอย่างน้อย 3.5 และไม่มีหน่วยกิตค้าง ให้ตัดสินกรณี GPA 3.6 และ pending_credits เป็น 0",
        ["เปรียบเทียบ GPA กับ 3.5", "ตรวจหน่วยกิตค้างเป็น 0", "ใช้ and เพราะต้องผ่านทั้งสองเกณฑ์"], `gpa = 3.6
pending_credits = 0
eligible = gpa >= 3.5 and pending_credits == 0
print(f"Eligible: {eligible}")`, "กติกาที่ต้องผ่านพร้อมกันทุกข้อควรเชื่อมด้วย and"),
      ex("คำนวณค่าส่งตามสมาชิก", 2, "ยอดซื้อ 450 บาท สมาชิกได้ค่าส่ง 20 บาท ลูกค้าทั่วไปจ่าย 45 บาท แต่ยอดตั้งแต่ 500 บาทส่งฟรีทุกคน",
        ["ตรวจยอดถึงเกณฑ์ส่งฟรีก่อน", "ถ้ายังไม่ถึงให้ตรวจประเภทสมาชิก", "คำนวณและแสดงค่าส่ง"], `total = 450
is_member = True
if total >= 500:
    shipping = 0
elif is_member:
    shipping = 20
else:
    shipping = 45
print(f"Shipping: {shipping} baht")`, "วางเงื่อนไขส่งฟรีก่อนเพราะเป็นกฎที่มีผลเหนือประเภทสมาชิก")
    ]
  },
  "การทำซ้ำด้วยลูป": {
    lessonIntro: "ลูปช่วยเลิกเขียนคำสั่งเดิมซ้ำด้วยมือ ก่อนสร้างลูปให้ระบุสามอย่าง: ค่าเริ่มต้น สิ่งที่เปลี่ยนในแต่ละรอบ และเงื่อนไขหยุด ตัวอย่างแรกใช้จำนวนรอบที่รู้แน่ด้วย for ส่วน while ใช้เมื่อกำลังทำซ้ำจนกว่าจะถึงสถานะหนึ่ง",
    examples: [
      sample("เก็บผลระหว่างวนรอบ", "แสดงค่ารวมสะสมเพื่อดูว่าลูปเปลี่ยนสถานะอย่างไรในแต่ละรอบ",
        `total = 0
for price in [35, 20, 45]:
    total += price
    print(f"added {price}, running total {total}")
print(f"final total {total}")`,
        ["total เริ่มที่ 0 ก่อนเริ่มลูป", "แต่ละรอบเพิ่มราคาหนึ่งรายการ", "print ในลูปเห็นผลสะสม ส่วน print ท้ายลูปแสดงผลสุดท้าย"])
    ],
    exercises: [
      ex("นับวันที่อากาศร้อน", 1, "มีอุณหภูมิ [29, 34, 31, 27, 36] ให้วนรายการและนับจำนวนวันที่อุณหภูมิตั้งแต่ 32 องศาขึ้นไป",
        ["เริ่มตัวนับเป็น 0", "ตรวจสมาชิกแต่ละค่าในลูป", "เพิ่มตัวนับเมื่อเข้าเกณฑ์"], `temps = [29, 34, 31, 27, 36]
hot_days = 0
for temp in temps:
    if temp >= 32:
        hot_days += 1
print(hot_days)`, "ตัวแปรนับต้องเริ่มก่อนเข้าลูปและเพิ่มเฉพาะเมื่อเงื่อนไขเป็นจริง"),
      ex("สร้างตารางคูณย่อ", 2, "แสดงผลคูณของเลข 6 ตั้งแต่ 1 ถึง 8 โดยแสดงเฉพาะผลลัพธ์ที่มากกว่า 30",
        ["วนตัวคูณด้วย range", "คำนวณ product ในแต่ละรอบ", "ใช้ if คัดกรองค่าที่ต้องแสดง"], `for factor in range(1, 9):
    product = 6 * factor
    if product > 30:
        print(f"6 x {factor} = {product}")`, "การวาง if ในลูปช่วยกรองผลของแต่ละรอบโดยไม่ต้องสร้างรายการใหม่")
    ]
  },
  "ข้อความและการจัดการ string": {
    lessonIntro: "ข้อมูลข้อความจากผู้ใช้หรือไฟล์มักมีช่องว่าง ตัวพิมพ์ และตัวคั่นที่ต้องจัดรูปก่อนใช้งาน บทนี้เริ่มจากทำความสะอาดข้อความ ต่อด้วยการแยกส่วนด้วย index/slicing และจบด้วยการประกอบข้อความใหม่ โดยจำไว้ว่า string method คืนค่าใหม่ ไม่ได้แก้ข้อความเดิมในที่",
    examples: [
      sample("แยกชื่อจากอีเมล", "ใช้ find เพื่อหาตัวแบ่ง แล้วตัดข้อความก่อนและหลังตำแหน่งนั้น",
        `email = "mali@example.org"
separator = email.find("@")
username = email[:separator]
domain = email[separator + 1:]
print(username)
print(domain)`,
        ["find คืน index ของ @", "slice ด้านซ้ายไม่รวมตำแหน่ง @", "slice ด้านขวาเริ่มหลัง @ หนึ่งตำแหน่ง"])
    ],
    exercises: [
      ex("ปรับข้อความค้นหาให้เป็นมาตรฐาน", 1, "ทำความสะอาดคำค้น \"  Python   Basics  \" โดยตัดช่องว่างหัวท้าย ทำเป็นตัวพิมพ์เล็ก และแทนช่องว่างระหว่างคำด้วยขีดเดียว",
        ["เริ่มด้วย strip", "ใช้ split เพื่อยุบช่องว่างซ้ำ", "join ด้วยเครื่องหมายขีดและแสดงผล"], `raw = "  Python   Basics  "
words = raw.strip().lower().split()
slug = "-".join(words)
print(slug)`, "split โดยไม่ใส่ตัวคั่นช่วยรวมช่องว่างติดกันให้เป็นคำแยกที่สะอาด"),
      ex("ตรวจรูปแบบรหัส", 2, "รหัสวิชารูปแบบตัวอย่างคือ CS101 ความยาว 5 ตัวอักษร ให้ตรวจว่าข้อความ \"CS101\" เริ่มด้วย CS และมีความยาว 5 หรือไม่",
        ["ใช้ startswith ตรวจ prefix", "ใช้ len ตรวจความยาว", "เชื่อมผลด้วย and"], `course_code = "CS101"
valid = course_code.startswith("CS") and len(course_code) == 5
print(valid)`, "ตรวจหลายข้อแยกกันทำให้เห็นชัดว่ารหัสผิดเพราะเหตุใด")
    ]
  },
  "โครงสร้างข้อมูล: list, tuple, set และ dict": {
    lessonIntro: "เมื่อมีข้อมูลหลายค่า การเลือกโครงสร้างที่เหมาะจะทำให้ค้นหาและแก้ไขง่ายขึ้น ถามตัวเองว่าต้องรักษาลำดับหรือไม่ ต้องแก้สมาชิกหรือไม่ และต้องค้นด้วย key หรือไม่ แล้วเลือก list, tuple, set หรือ dict ตามงานแทนการใช้ชนิดเดียวกับทุกโจทย์",
    examples: [
      sample("ค้นหาและนับจากข้อมูล", "ใช้ list เก็บลำดับคะแนนและสร้าง dict เพื่อจับคู่ชื่อกับคะแนน",
        `scores = [72, 88, 88, 95]
print(f"88 appears {scores.count(88)} times")
student_scores = {"Mali": 88, "Nok": 95}
print(student_scores.get("Beam", "not found"))`,
        ["count นับจำนวนค่าที่สนใจใน list", "dict ใช้ชื่อเป็น key และคะแนนเป็น value", "get กำหนดผลเมื่อไม่พบ key"])
    ],
    exercises: [
      ex("ทำสรุปตะกร้าสินค้า", 1, "รายการราคาคือ [20, 35, 20, 50] ให้หาผลรวม จำนวนรายการ และราคาที่ปรากฏซ้ำว่ามีค่าใดบ้าง",
        ["ใช้ sum และ len สรุป list", "ใช้ set ตัดค่าซ้ำ", "จัดเรียงค่าที่ไม่ซ้ำก่อนแสดง"], `prices = [20, 35, 20, 50]
print(sum(prices), len(prices))
print(sorted(set(prices)))`, "set ตัดค่าซ้ำ ส่วน sorted ทำให้ output มีลำดับแน่นอน"),
      ex("นับคะแนนตามระดับ", 2, "จากคะแนน [45, 62, 81, 55, 90] ให้สร้าง dictionary ที่มีจำนวนคนผ่าน (ตั้งแต่ 50) และจำนวนคนได้ A (ตั้งแต่ 80)",
        ["เริ่มตัวนับทั้งสองค่า", "วนผ่านคะแนนทีละตัว", "เพิ่มตัวนับตามเกณฑ์แล้วสร้าง dict สรุป"], `scores = [45, 62, 81, 55, 90]
passed = sum(score >= 50 for score in scores)
grade_a = sum(score >= 80 for score in scores)
summary = {"passed": passed, "grade_a": grade_a}
print(summary)`, "bool สามารถนำมารวมได้ เพราะ True มีค่าเท่ากับ 1 และ False เท่ากับ 0")
    ]
  },
  "ฟังก์ชันและการแบ่งโปรแกรม": {
    lessonIntro: "ฟังก์ชันช่วยแบ่งโปรแกรมใหญ่ให้เป็นงานย่อยที่อธิบายได้ด้วยประโยคเดียว ในบทนี้ฝึกส่งข้อมูลเข้าทาง parameter คืนผลด้วย return และนำฟังก์ชันเดิมไปใช้หลายครั้ง แยกการคำนวณออกจาก print เพื่อให้ทดสอบและนำผลไปใช้ต่อได้",
    examples: [
      sample("แยกตรวจข้อมูลกับคำนวณ", "สร้างฟังก์ชันย่อยที่มีหน้าที่ชัด แล้วให้ฟังก์ชันหลักเรียกใช้",
        `def is_passing(score):
    return 0 <= score <= 100 and score >= 50

def result_message(score):
    if not 0 <= score <= 100:
        return "invalid score"
    return "pass" if is_passing(score) else "try again"

print(result_message(68))
print(result_message(120))`,
        ["ฟังก์ชันแรกตอบคำถามเดียวคือผ่านเกณฑ์หรือไม่", "ฟังก์ชันที่สองตรวจความถูกต้องก่อน", "การแยกงานทำให้ทดสอบแต่ละส่วนและนำกลับมาใช้ได้"])
    ],
    exercises: [
      ex("สร้างฟังก์ชันแปลงนาที", 1, "เขียนฟังก์ชัน split_minutes(total) คืนค่าเป็นชั่วโมงและนาทีที่เหลือ ทดลองกับ 135 แล้วแสดงผลเป็น tuple",
        ["ใช้ // หาชั่วโมง", "ใช้ % หานาทีที่เหลือ", "return ค่าทั้งสองกลับเป็น tuple"], `def split_minutes(total):
    return total // 60, total % 60

print(split_minutes(135))`, "ฟังก์ชันที่คืนค่าไม่พิมพ์เองช่วยให้ผู้เรียกเลือกนำผลไปใช้ต่อได้"),
      ex("คำนวณยอดสุทธิด้วยฟังก์ชัน", 2, "สร้างฟังก์ชัน final_price รับราคา จำนวน และ discount_rate ซึ่งมีค่าเริ่มต้น 0.0 คืนยอดหลังหักส่วนลด ทดลองส่วนลด 10%",
        ["กำหนด default parameter", "คำนวณยอดก่อนลด", "คูณส่วนลดแล้วคืนค่าที่เหลือ"], `def final_price(price, quantity, discount_rate=0.0):
    subtotal = price * quantity
    return subtotal * (1 - discount_rate)

print(f"{final_price(100, 3, 0.1):.2f}")`, "default argument ทำให้เรียกใช้ง่ายในกรณีทั่วไป และส่งค่าใหม่เมื่อมีส่วนลด")
    ]
  },
  "ข้อผิดพลาด การจัดการ exception และ debug": {
    lessonIntro: "การเจอ error เป็นส่วนหนึ่งของการเขียนโปรแกรม เป้าหมายไม่ใช่ซ่อน traceback แต่ใช้มันระบุจุดที่ผิด แล้วตัดสินใจว่าควรแก้สาเหตุหรือจัดการกรณีข้อมูลไม่ถูกต้อง บทนี้แยก syntax, runtime และ logic error พร้อมฝึกจับ exception เฉพาะชนิดที่คาดหมาย",
    examples: [
      sample("แปลงข้อมูลหลายรายการอย่างปลอดภัย", "จับ error ต่อหนึ่งรายการเพื่อให้ข้อมูลผิดแถวหนึ่งไม่ทำให้การตรวจรายการอื่นหยุด",
        `raw_values = ["12", "?", "8"]
numbers = []
for raw in raw_values:
    try:
        numbers.append(int(raw))
    except ValueError:
        print(f"skip invalid value: {raw}")
print(f"valid total: {sum(numbers)}")`,
        ["แปลงค่าแต่ละรายการแยกกัน", "เมื่อเจอ ValueError แจ้งว่าข้ามค่าใด", "ข้อมูลที่เหลือยังนำมารวมต่อได้"])
    ],
    exercises: [
      ex("ตรวจ input ก่อนหาร", 1, "เขียนฟังก์ชัน safe_average รับ total และ count โดย count ต้องมากกว่า 0 ถ้าไม่ใช่ให้ raise ValueError ทดลองทั้ง count=4 และ count=0",
        ["ตรวจ count ก่อนหาร", "ยก exception พร้อมข้อความอธิบาย", "ทดสอบกรณีถูกต้องและไม่ถูกต้องด้วย try/except"], `def safe_average(total, count):
    if count <= 0:
        raise ValueError("count must be greater than zero")
    return total / count

for count in (4, 0):
    try:
        print(safe_average(20, count))
    except ValueError as error:
        print(error)`, "ข้อมูลไม่ถูกต้องควรถูกปฏิเสธอย่างชัดเจนแทนการคืนค่าปลอม"),
      ex("แยก error จากข้อมูลผิดกับบั๊ก", 2, "แปลงรายการข้อความ [\"8\", \"x\", \"4\"] เป็นจำนวนเต็ม จับเฉพาะ ValueError และแสดงผลรวมของรายการที่แปลงสำเร็จ",
        ["วนข้อมูลทีละค่า", "ใส่เฉพาะ int(raw) ใน try", "เก็บค่าที่ถูกต้องแล้วรวมหลังจบลูป"], `raw_values = ["8", "x", "4"]
numbers = []
for raw in raw_values:
    try:
        numbers.append(int(raw))
    except ValueError:
        print(f"ignored: {raw}")
print(sum(numbers))`, "จำกัดขอบเขต try ให้แคบเพื่อไม่กลบข้อผิดพลาดที่ไม่เกี่ยวกับ input")
    ]
  },
  "ไฟล์ ข้อมูล CSV และ JSON": {
    lessonIntro: "ข้อมูลในโปรแกรมมักต้องอยู่ต่อหลังปิดโปรแกรม จึงต้องอ่านและเขียนไฟล์ให้ปลอดภัย บทนี้เริ่มจาก with ที่ปิดไฟล์อัตโนมัติ ต่อด้วย CSV สำหรับข้อมูลตาราง และ JSON สำหรับโครงสร้างข้อมูลซ้อน พร้อมระบุ encoding เพื่อให้ข้อความภาษาไทยอ่านได้ถูกต้อง",
    examples: [
      sample("ตรวจไฟล์ก่อนอ่าน", "ใช้ pathlib ตรวจว่ามี path ก่อนอ่าน และแยกการจัดการไฟล์ที่ไม่มีออกจากการ parse ข้อมูล",
        `from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory() as folder:
    path = Path(folder) / "message.txt"
    path.write_text("study Python", encoding="utf-8")
    if path.exists():
        print(path.read_text(encoding="utf-8"))`,
        ["Path ประกอบตำแหน่งไฟล์อย่างเป็นระบบ", "exists ตรวจว่ามีไฟล์ก่อนอ่าน", "encoding ระบุการอ่านตัวอักษรให้ตรงกับไฟล์"])
    ],
    exercises: [
      ex("อ่านแถว CSV แล้วเลือกข้อมูล", 1, "มี CSV ของสินค้า 3 แถว ให้ใช้ DictReader เลือกเฉพาะรายการที่ stock น้อยกว่า 5 และพิมพ์ชื่อสินค้า",
        ["ใช้ StringIO เพื่อจำลองไฟล์", "แปลง stock จาก str เป็น int", "กรองและแสดงชื่อสินค้า"], `import csv
from io import StringIO

source = StringIO("item,stock\\npen,8\\nbook,3\\neraser,2\\n")
for row in csv.DictReader(source):
    if int(row["stock"]) < 5:
        print(row["item"])`, "csv reader คืนทุกช่องเป็นข้อความ จึงแปลง stock ก่อนเปรียบเทียบเชิงตัวเลข"),
      ex("เขียนข้อมูล JSON ที่อ่านกลับได้", 2, "สร้าง dictionary ของผู้เรียนสองคน บันทึกเป็น JSON ในโฟลเดอร์ชั่วคราว แล้วอ่านกลับเพื่อแสดงจำนวนรายการ",
        ["ใช้ TemporaryDirectory ป้องกันไฟล์ทดลองตกค้าง", "เขียนและอ่านด้วย encoding UTF-8", "ใช้ json.dump/load กับไฟล์"], `import json
from pathlib import Path
from tempfile import TemporaryDirectory

students = [{"name": "Mali"}, {"name": "Nok"}]
with TemporaryDirectory() as folder:
    path = Path(folder) / "students.json"
    with path.open("w", encoding="utf-8") as file:
        json.dump(students, file, ensure_ascii=False)
    with path.open(encoding="utf-8") as file:
        loaded = json.load(file)
    print(len(loaded))`, "ใช้ context manager กับไฟล์ทุกครั้งเพื่อปิด handle ให้แน่นอนและระบุ encoding")
    ]
  },
  "โมดูล virtual environment และ pip": {
    lessonIntro: "เมื่อโปรแกรมแยกหลายไฟล์หรือใช้ไลบรารีเพิ่ม ต้องรู้ว่า Python กำลัง import จากที่ใดและ pip ติดตั้งลง environment ไหน เริ่มจากโมดูลมาตรฐานที่ไม่ต้องติดตั้ง แล้วค่อยสร้าง venv และใช้ python -m pip เพื่อให้ dependency อยู่กับ interpreter ของโปรเจกต์",
    examples: [
      sample("ใช้โมดูลมาตรฐานจัดข้อมูล", "เริ่มจาก standard library ก่อนติดตั้ง package เพิ่ม และใช้ Counter เพื่อสรุปความถี่",
        `from collections import Counter
from statistics import mean

answers = ["A", "B", "A", "C", "A", "B"]
counts = Counter(answers)
print(counts.most_common(1))
print(f"average length={mean([len(x) for x in answers]):.1f}")`,
        ["collections และ statistics มากับ Python ไม่ต้อง pip install", "Counter นับความถี่โดยไม่ต้องเขียน dict loop เอง", "ติดตั้ง package เพิ่มเฉพาะเมื่อต้องการความสามารถเฉพาะ"])
    ],
    exercises: [
      ex("เลือกใช้ standard library", 1, "มีรายการคำตอบ [\"yes\", \"no\", \"yes\", \"yes\", \"no\"] ใช้ collections.Counter นับจำนวน yes และ no",
        ["import Counter จาก collections", "สร้าง Counter จาก list", "อ่านจำนวนทั้งสอง key"], `from collections import Counter
answers = Counter(["yes", "no", "yes", "yes", "no"])
print(answers["yes"], answers["no"])`, "ควรตรวจ standard library ก่อนเลือกติดตั้ง dependency เพิ่ม"),
      ex("อ่าน dependency จาก environment", 2, "ใช้ importlib.metadata ตรวจเวอร์ชันของ pandas และพิมพ์ข้อความบอกว่าคำสั่งติดตั้งควรใช้ `python -m pip` ไม่ใช่ pip เปล่า",
        ["อ่าน version ของ pandas", "พิมพ์ชื่อแพ็กเกจกับเวอร์ชัน", "พิมพ์คำสั่งติดตั้งที่ผูกกับ interpreter"], `from importlib.metadata import version
print(f"pandas {version('pandas')}")
print("python -m pip install pandas")`, "python -m pip ช่วยติดตั้ง package ลง environment ของ Python ตัวที่เรียกคำสั่งนี้")
    ]
  },
  "เขียนโปรแกรมเชิงวัตถุด้วย class": {
    lessonIntro: "แนวคิด class มีประโยชน์เมื่อข้อมูลกับการกระทำเกี่ยวข้องกันและมีหลาย instance ให้สร้าง บทนี้เริ่มด้วย object ที่เก็บข้อมูลรายวิชา ต่อด้วย method ที่อ่านหรือแก้สถานะ แล้วพิจารณาว่าควรใช้ class เมื่อใดแทนการใช้ dictionary หรือฟังก์ชันธรรมดา",
    examples: [
      sample("กำหนดข้อความแสดง object", "เขียน __str__ เพื่อกำหนดรูปแบบที่อ่านง่ายเมื่อใช้ print กับ object",
        `class Course:
    def __init__(self, code, title):
        self.code = code
        self.title = title

    def __str__(self):
        return f"{self.code}: {self.title}"

print(Course("CS101", "Python"))`,
        ["__init__ จัดเก็บสถานะ", "__str__ คืนข้อความแทน object", "print เรียก __str__ ให้อัตโนมัติ"])
    ],
    exercises: [
      ex("เพิ่มการตรวจใน method", 1, "สร้าง class BankAccount ที่ฝากเงินได้เฉพาะ amount > 0 ถ้าไม่ถูกต้องให้คืน False และไม่เปลี่ยน balance",
        ["กำหนด balance ใน __init__", "ตรวจ amount ก่อนบวก", "ทดสอบจำนวนบวกและศูนย์"], `class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            return False
        self.balance += amount
        return True

account = BankAccount(100)
print(account.deposit(50), account.balance)
print(account.deposit(0), account.balance)`, "การตรวจข้อมูลใน method ปกป้อง invariant ของ object"),
      ex("เก็บรายการสินค้าใน object", 2, "สร้าง class Playlist ที่เก็บชื่อเพลงใน list มี add_song เพิ่มเพลงและ song_count คืนจำนวนเพลง แล้วทดลองเพิ่มสองเพลง",
        ["เริ่ม list ว่างใน __init__", "เพิ่มเพลงผ่าน method", "ใช้ len ใน song_count"], `class Playlist:
    def __init__(self, name):
        self.name = name
        self.songs = []

    def add_song(self, song):
        self.songs.append(song)

    def song_count(self):
        return len(self.songs)

mix = Playlist("Focus")
mix.add_song("Track A")
mix.add_song("Track B")
print(mix.song_count())`, "แต่ละ instance ควรสร้าง list ของตัวเอง ไม่ใช้ mutable class attribute ร่วมกัน")
    ]
  },
  "เรียกใช้ Web API และแลกเปลี่ยน JSON": {
    lessonIntro: "API ทำให้โปรแกรมแลกเปลี่ยนข้อมูลกับบริการอื่นได้ แต่ต้องคิดถึงทั้งคำขอ คำตอบ และความผิดพลาดของเครือข่าย เริ่มจาก encode query และ parse JSON แบบ offline ก่อนขยับไป request จริง โดยกำหนด timeout และตรวจ status ทุกครั้ง",
    examples: [
      sample("ตรวจ status กับเนื้อหา response", "ก่อนใช้ข้อมูลจากบริการให้ตรวจ status ที่คาดหวัง แล้วค่อย parse JSON",
        `import json

status_code = 200
body = '{"ok": true, "items": 3}'
if 200 <= status_code < 300:
    data = json.loads(body)
    print(data["ok"], data["items"])
else:
    print(f"request failed: {status_code}")`,
        ["status code ระบุผลของ request แยกจาก body", "parse body หลังยืนยันว่าเป็น response ที่ใช้ได้", "ระบบจริงต้องเพิ่ม timeout และจัดการ network error"])
    ],
    exercises: [
      ex("ประกอบ query หลายค่า", 1, "สร้าง URL ค้นหาหน้าเว็บโดยส่งคำค้น \"data science & python\" และ page=2 ผ่าน urlencode",
        ["แยก query parameters ใน dict", "ใช้ urlencode แทนต่อ string เอง", "แสดง URL สำเร็จ"], `from urllib.parse import urlencode
params = {"q": "data science & python", "page": 2}
print("https://example.org/search?" + urlencode(params))`, "urlencode ทำ encoding ของช่องว่างและเครื่องหมาย & เพื่อไม่ให้ค่าหนึ่งแยกเป็นหลาย parameter"),
      ex("ปฏิเสธ response ที่ไม่ใช่ success", 2, "จำลอง response status 503 และ body เป็น JSON โดยโปรแกรมต้องไม่อ่าน field items จนกว่าจะเป็น status 2xx",
        ["ตรวจช่วง status 200 ถึง 299", "parse JSON เฉพาะกรณี success", "แจ้ง status เมื่อบริการไม่พร้อม"], `import json
status = 503
body = '{"items": 4}'
if 200 <= status < 300:
    print(json.loads(body)["items"])
else:
    print(f"Service unavailable ({status})")`, "การตรวจ status ก่อนใช้ body แยก server error ออกจากข้อมูลที่ parse ได้")
    ]
  },
  "NumPy สำหรับการคำนวณตัวเลข": {
    lessonIntro: "NumPy ทำให้แทนข้อมูลตัวเลขเป็น array และคำนวณหลายค่าด้วยนิพจน์เดียว ก่อนคำนวณให้ตรวจ shape และ dtype เพราะหลายบั๊กเกิดจากรูปร่าง array ไม่ตรงกัน เริ่มจาก scalar operation แล้วค่อยกรอง mask และรวมค่าตาม axis",
    examples: [
      sample("ปรับข้อมูลด้วย broadcasting", "NumPy ขยายเวกเตอร์ offset ให้เข้ากับแต่ละแถวของ array โดยไม่ต้องวนสร้างแถวใหม่",
        `import numpy as np

measurements = np.array([[20, 21], [22, 23], [24, 25]])
offset = np.array([1, 2])
adjusted = measurements + offset
print(adjusted)
print(adjusted.shape)`,
        ["measurements มี shape 3x2", "offset มีค่า 2 ตัวตรงกับจำนวนคอลัมน์", "broadcasting เพิ่มค่าตามคอลัมน์ให้ทุกแถว"])
    ],
    exercises: [
      ex("ปรับคะแนนรายวิชาทีเดียว", 1, "มีคะแนนสองแถวสามวิชา [[60,70,80],[75,65,90]] ให้บวกคะแนนพิเศษรายวิชา [2,0,5] กับทุกแถว",
        ["สร้าง array สองมิติ", "สร้าง array คะแนนพิเศษยาวเท่าจำนวนคอลัมน์", "บวกด้วย broadcasting"], `import numpy as np
scores = np.array([[60, 70, 80], [75, 65, 90]])
bonus = np.array([2, 0, 5])
print(scores + bonus)`, "shape ของ bonus ตรงกับแกนคอลัมน์จึง broadcast ได้โดยตรง"),
      ex("แปลงข้อมูลและคำนวณส่วนเบี่ยงเบน", 2, "มี array [2,4,6,8] ให้ลบค่าเฉลี่ยออกจากทุกสมาชิกและแสดงค่าเฉลี่ยของค่าที่แปลงแล้ว",
        ["คำนวณ mean", "ลบ mean แบบ vectorized", "ตรวจว่าค่าเฉลี่ยหลัง center ใกล้ศูนย์"], `import numpy as np
values = np.array([2.0, 4.0, 6.0, 8.0])
centered = values - values.mean()
print(centered)
print(round(centered.mean(), 10))`, "การ center ข้อมูลเป็นขั้น preprocessing ที่พบบ่อยก่อนวิเคราะห์หรือฝึกโมเดล")
    ]
  },
  "จัดการตารางข้อมูลด้วย pandas": {
    lessonIntro: "การวิเคราะห์ตารางเริ่มจากตรวจข้อมูล ไม่ใช่รีบวาดกราฟ ให้สำรวจจำนวนแถว ชนิดคอลัมน์ และ missing values ก่อนเลือก/กรองข้อมูล จากนั้นค่อยสร้างคอลัมน์และ groupby เพื่อสรุปผล ระวังว่าตัวเลขที่อ่านจาก CSV อาจถูกอ่านเป็นข้อความ",
    examples: [
      sample("จัดเรียงและเลือกแถว", "เรียงข้อมูลตามคะแนนจากมากไปน้อย แล้วเลือกคอลัมน์ที่จะรายงาน",
        `import pandas as pd

df = pd.DataFrame({"name": ["Nok", "Mali", "Beam"], "score": [76, 92, 84]})
top = df.sort_values("score", ascending=False).head(2)
print(top.to_string(index=False))`,
        ["sort_values เรียงตามคอลัมน์ score", "ascending=False ทำให้ค่าสูงอยู่ก่อน", "head(2) เลือกสองแถวแรกหลังเรียง"])
    ],
    exercises: [
      ex("จัดอันดับข้อมูล", 1, "มีตารางนักศึกษา 3 คนกับคะแนน ให้เรียงจากคะแนนมากไปน้อยและแสดงอันดับหนึ่ง",
        ["สร้าง DataFrame", "ใช้ sort_values โดยกำหนด ascending=False", "เลือกแถวแรกหลังเรียง"], `import pandas as pd
df = pd.DataFrame({"name": ["Aom", "Beam", "Nok"], "score": [81, 95, 88]})
top = df.sort_values("score", ascending=False).iloc[0]
print(top["name"], top["score"])`, "การเรียงก่อนเลือกแถวป้องกันการสมมติว่าข้อมูลต้นฉบับเรียงมาแล้ว"),
      ex("รวมยอดขายแยกหมวดและเรียงผล", 2, "มีข้อมูลยอดขายหมวด A, B, A, B ให้รวมยอดต่อหมวดแล้วเรียงยอดรวมจากมากไปน้อย",
        ["groupby หมวด", "sum ยอดขาย", "sort_values ผลลัพธ์"], `import pandas as pd
df = pd.DataFrame({"category": ["A", "B", "A", "B"], "sales": [12, 30, 25, 15]})
result = df.groupby("category")["sales"].sum().sort_values(ascending=False)
print(result.to_string())`, "ทำ groupby ก่อนแล้วค่อย sort เพื่อจัดอันดับกลุ่มจากผลรวม ไม่ใช่จากแต่ละแถว")
    ]
  },
  "สร้างกราฟด้วย Matplotlib": {
    lessonIntro: "กราฟควรตอบคำถาม ไม่ใช่เพียงตกแต่งข้อมูล ให้เลือก line เมื่อดูแนวโน้ม bar เมื่อเทียบหมวด และ scatter เมื่อดูความสัมพันธ์ ตั้งชื่อกราฟกับแกนให้ครบ แล้วบันทึกภาพก่อนปิด figure เพื่อใช้ในรายงานหรือเว็บ",
    examples: [
      sample("ใส่ annotation ในกราฟ", "เน้นค่าที่สำคัญและบันทึกภาพโดยกำหนดขนาดให้รายงานอ่านได้",
        `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

months = [1, 2, 3]
sales = [12, 18, 15]
fig, ax = plt.subplots(figsize=(5, 3))
ax.plot(months, sales, marker="o")
ax.annotate("peak", (2, 18), xytext=(2.2, 19))
ax.set(xlabel="Month", ylabel="Sales", title="Quarterly trend")
print(f"annotations={len(ax.texts)}")
plt.close(fig)`,
        ["figsize กำหนดขนาดรูปเป็นนิ้ว", "annotate ผูกข้อความกับตำแหน่งข้อมูล", "ตรวจ annotations และปิด figure เพื่อคืน resource"])
    ],
    exercises: [
      ex("ใส่ชื่อค่าในกราฟแท่ง", 1, "วาดแท่งสามหมวด [4,7,5] และใส่ชื่อแกนกับ title ให้ครบ จากนั้นตรวจว่ามีแท่ง 3 แท่ง",
        ["ใช้ bar กับ categories สามค่า", "กำหนด xlabel, ylabel และ title", "ตรวจจำนวน patches"], `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.bar(["A", "B", "C"], [4, 7, 5])
ax.set(xlabel="Category", ylabel="Count", title="Counts")
print(len(ax.patches))
plt.close(fig)`, "ตรวจจำนวน patches ยืนยันว่า axes มี bar ครบตามข้อมูล"),
      ex("บันทึกกราฟและยืนยันไฟล์", 2, "สร้างกราฟเส้นใน TemporaryDirectory บันทึก PNG และแสดงชื่อไฟล์กับขนาดไฟล์ที่มากกว่าศูนย์",
        ["สร้างข้อมูลอย่างน้อยสองจุด", "ใช้ savefig กับ path ชั่วคราว", "ตรวจ exists และ file size"], `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path
from tempfile import TemporaryDirectory
fig, ax = plt.subplots()
ax.plot([1, 2], [3, 5])
with TemporaryDirectory() as folder:
    path = Path(folder) / "trend.png"
    fig.savefig(path)
    print(path.name, path.exists(), path.stat().st_size > 0)
plt.close(fig)`, "ตรวจไฟล์ที่ได้จริงแทนการเดาจากการเรียก savefig ว่าบันทึกสำเร็จ")
    ]
  },
  "Machine Learning เบื้องต้นด้วย scikit-learn": {
    lessonIntro: "โมเดลที่ทำนายได้ไม่เท่ากับโมเดลที่ทำนายได้ดี ต้องเริ่มจากระบุ feature กับ label แบ่งชุด train/test ก่อน fit และวัดผลบนข้อมูลที่โมเดลไม่เคยเห็น บทนี้ใช้ชุดข้อมูลมาตรฐานเพื่อให้ทำซ้ำได้และชี้ให้เห็นว่าค่า accuracy เพียงค่าเดียวอาจซ่อนรูปแบบการทำนายผิด",
    examples: [
      sample("อ่าน confusion matrix", "ดูจำนวนที่ทำนายถูก/ผิดในแต่ละ class แทนการพึ่ง accuracy เพียงค่าเดียว",
        `from sklearn.metrics import confusion_matrix

actual = ["cat", "cat", "dog", "dog", "dog"]
predicted = ["cat", "dog", "dog", "dog", "cat"]
matrix = confusion_matrix(actual, predicted, labels=["cat", "dog"])
print(matrix)
print(f"correct={matrix.trace()} total={matrix.sum()}")`,
        ["กำหนด labels เพื่อให้ลำดับแถวและคอลัมน์แน่นอน", "แนวทแยงเป็นจำนวนที่ทำนายถูก", "ช่องนอกแนวทแยงแสดงการสับสนระหว่าง class"])
    ],
    exercises: [
      ex("เปรียบเทียบ prediction กับความจริง", 1, "มี label จริงและผลทำนาย 5 ค่า ให้แสดงรายการที่ทำนายผิดและนับจำนวนข้อผิดพลาด",
        ["วน actual กับ predicted ด้วย zip", "เก็บเฉพาะคู่ที่ไม่เท่ากัน", "แสดงจำนวนผิด"], `actual = ["A", "B", "A", "C", "B"]
predicted = ["A", "A", "A", "C", "B"]
wrong = [(a, p) for a, p in zip(actual, predicted) if a != p]
print(wrong)
print(f"errors={len(wrong)}")`, "ตรวจรายตัวอย่างช่วยเข้าใจลักษณะผิดพลาด ไม่ใช่แค่ได้ metric รวม"),
      ex("เปรียบเทียบโมเดล baseline", 2, "แบ่ง Iris เป็น train/test ด้วย random_state เดียวกัน แล้วเปรียบเทียบ KNN สองค่าเพื่อนบ้านโดยใช้ accuracy บน test ชุดเดียวกัน",
        ["แบ่งข้อมูลครั้งเดียวและใช้ stratify", "ฝึกโมเดลสองค่า n_neighbors บน train เดียวกัน", "คำนวณ accuracy จาก test เท่านั้น"], `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
X, y = load_iris(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=5, stratify=y)
for neighbors in (1, 5):
    model = KNeighborsClassifier(n_neighbors=neighbors).fit(Xtr, ytr)
    print(neighbors, round(accuracy_score(yte, model.predict(Xte)), 2))`, "การใช้ test ชุดเดิมทำให้เปรียบเทียบโมเดลได้ยุติธรรมขึ้น")
    ]
  },
  "แนวคิด Neural Network และการฝึกโมเดล": {
    lessonIntro: "Neural network ไม่ได้เป็นกล่องวิเศษ แต่เป็นการคำนวณซ้ำ ๆ ด้วย weights, bias, activation และ loss เริ่มจากคำนวณ neuron หนึ่งตัวด้วย NumPy เพื่อเห็น forward pass ก่อนพูดถึงการปรับพารามิเตอร์ด้วย gradient และ framework ที่ใช้จริง",
    examples: [
      sample("แปลงคะแนนเป็นความน่าจะเป็น", "คำนวณ sigmoid เพื่อบีบค่าจริงใด ๆ ให้อยู่ในช่วง 0 ถึง 1",
        `import math

def sigmoid(value):
    return 1 / (1 + math.exp(-value))

for logit in (-2, 0, 2):
    print(f"{logit}: {sigmoid(logit):.3f}")`,
        ["logit ต่ำให้ค่าใกล้ 0", "ค่า 0 ให้ sigmoid เท่ากับ 0.5", "logit สูงให้ค่าใกล้ 1"])
    ],
    exercises: [
      ex("คำนวณ sigmoid", 1, "เขียน sigmoid(value) ด้วย math.exp และแสดงผลสำหรับ -1, 0 และ 1 โดยปัดสามตำแหน่ง",
        ["import math", "ใช้สูตร 1/(1+exp(-x))", "ทดสอบค่าติดลบ ศูนย์ และบวก"], `import math
def sigmoid(value):
    return 1 / (1 + math.exp(-value))
print([round(sigmoid(x), 3) for x in (-1, 0, 1)])`, "sigmoid เป็น activation ที่เปลี่ยน logit เป็นค่าระหว่าง 0 ถึง 1"),
      ex("เลือก class จาก logits", 2, "โมเดลให้ logits [1.2, 0.3, 2.1] ให้ใช้ NumPy หา index ของ class ที่มี logit มากที่สุดและแปลงเป็น label",
        ["สร้าง array ของ logits และ labels", "ใช้ argmax เพื่อหา index", "ใช้ index เดียวกันอ่าน label"], `import numpy as np
logits = np.array([1.2, 0.3, 2.1])
labels = ["cat", "bird", "dog"]
best = int(np.argmax(logits))
print(labels[best], best)`, "argmax เลือก index ของค่ามากที่สุด ไม่ใช่ค่าความน่าจะเป็นโดยตรง")
    ]
  },
  "สร้าง GUI สมัยใหม่ด้วย PySide6": {
    lessonIntro: "GUI เป็นโปรแกรมที่รอ event จากผู้ใช้ แทนการไหลจากบรรทัดแรกถึงบรรทัดสุดท้ายเพียงครั้งเดียว จึงเริ่มจาก QApplication และหน้าต่าง ใช้ layout จัด widget แล้วเชื่อม signal ของปุ่มเข้ากับ slot ที่ทำงาน ตรวจ input ก่อนนำไปคำนวณ",
    examples: [
      sample("ตรวจ input ในหน้าต่าง", "แยกฟังก์ชันตรวจข้อมูลก่อนเปลี่ยนข้อความ เพื่อให้เห็น signal/slot และ feedback",
        `from PySide6.QtWidgets import QApplication, QLabel, QLineEdit, QPushButton

app = QApplication([])
field = QLineEdit()
result = QLabel()
button = QPushButton("Add")
def update_result():
    value = field.text().strip()
    result.setText("Enter a task" if not value else f"Added: {value}")
button.clicked.connect(update_result)
field.setText("Read chapter")
button.click()
app.processEvents()
print(result.text())`,
        ["callback อ่านค่าล่าสุดจาก field", "strip ป้องกัน input ที่มีแต่ช่องว่าง", "signal clicked เรียกฟังก์ชันโดยไม่ผูก logic ไว้ใน widget"])
    ],
    exercises: [
      ex("ปุ่มเพิ่มตัวนับ", 1, "สร้างปุ่มและ label แสดงตัวนับ เริ่มที่ 0 และเมื่อคลิกปุ่มสองครั้งให้ label แสดง 2",
        ["เก็บ count ในตัวแปรที่ callback เข้าถึงได้", "เพิ่มค่าทุกครั้งที่เกิด clicked", "จำลอง click สองครั้งและตรวจ label"], `from PySide6.QtWidgets import QApplication, QLabel, QPushButton
app = QApplication([])
count = 0
label = QLabel("0")
button = QPushButton("Add")
def increment():
    global count
    count += 1
    label.setText(str(count))
button.clicked.connect(increment)
button.click()
button.click()
app.processEvents()
print(label.text())`, "event เกิดได้หลายครั้ง จึงต้องอัปเดตสถานะก่อนแสดงค่าปัจจุบัน"),
      ex("ตรวจฟอร์มตัวเลข", 2, "สร้าง QLineEdit และปุ่มคำนวณพื้นที่สี่เหลี่ยมจัตุรัส เมื่อป้อนด้านเป็น \"4\" แสดงพื้นที่ 16 และเมื่อ input ไม่ใช่ตัวเลขให้แจ้งคำเตือน",
        ["แปลง text เป็น float ใน try", "จับ ValueError และแสดงข้อความ", "คูณด้านกับตัวเองเมื่อข้อมูลถูกต้อง"], `from PySide6.QtWidgets import QApplication, QLabel, QLineEdit, QPushButton
app = QApplication([])
side = QLineEdit()
side.setText("4")
result = QLabel()
button = QPushButton("Calculate")
def calculate():
    try:
        value = float(side.text())
    except ValueError:
        result.setText("Enter a number")
    else:
        result.setText(str(value * value))
button.clicked.connect(calculate)
button.click()
app.processEvents()
print(result.text())`, "การตรวจ input ใน UI ป้องกัน exception จากข้อมูลผู้ใช้และให้คำแนะนำแก้ไขได้")
    ]
  },
  "โปรเจกต์ปลายทาง: Course Planner + AI": {
    lessonIntro: "โปรเจกต์นี้นำความรู้ก่อนหน้ามาต่อกันเป็นชิ้นงาน: ออกแบบข้อมูล แยกกฎแนะนำ ทดสอบผล และสื่อสารข้อจำกัด เริ่มด้วย baseline ที่อธิบายเหตุผลได้ก่อนใช้โมเดล เพราะระบบแนะนำสำหรับการเรียนควรช่วยตัดสินใจ ไม่ควรทำหน้าที่ตัดสินแทนนิสิต",
    examples: [
      sample("แยกข้อมูลวิชาที่แนะนำพร้อมเหตุผล", "คืนทั้งรายชื่อและข้อความอธิบายเกณฑ์ เพื่อให้ผู้ใช้ทราบว่าระบบแนะนำจากข้อมูลใด",
        `catalog = [
    {"name": "Python", "minimum_score": 0},
    {"name": "Data Analysis", "minimum_score": 60},
    {"name": "AI", "minimum_score": 75},
]
score = 68
suggestions = [item for item in catalog if score >= item["minimum_score"]]
for item in suggestions:
    print(f"{item['name']}: score >= {item['minimum_score']}")`,
        ["ข้อมูลแต่ละวิชาเป็น dictionary ที่มีทั้งชื่อและเกณฑ์", "กรองเฉพาะรายการที่ผู้เรียนถึงเกณฑ์", "แสดงเหตุผลควบคู่กับชื่อเพื่อให้ผลโปร่งใส"])
    ],
    exercises: [
      ex("เพิ่มเหตุผลประกอบคำแนะนำ", 1, "กรองวิชาตามคะแนนความพร้อมและแสดงชื่อพร้อมคะแนนขั้นต่ำของแต่ละวิชา ไม่แสดงชื่ออย่างเดียว",
        ["ใช้รายการ dictionary ที่มีชื่อและเกณฑ์", "กรองตามคะแนนผู้เรียน", "แสดงชื่อและเกณฑ์ต่อบรรทัด"], `catalog = [
    {"name": "Python", "minimum": 0},
    {"name": "Data", "minimum": 60},
    {"name": "AI", "minimum": 75},
]
score = 68
for course in catalog:
    if score >= course["minimum"]:
        print(f"{course['name']} (minimum {course['minimum']})")`, "การบอกเหตุผลช่วยให้ผู้ใช้ตรวจสอบว่าระบบใช้เกณฑ์ใด"),
      ex("สร้างรายงานแผนเรียน", 2, "รับรายการวิชาที่แนะนำ สร้างรายงานนับจำนวนวิชาและหน่วยกิตรวม แล้วตรวจกรณีไม่มีวิชาแนะนำ",
        ["แยกกรณีรายการว่าง", "ใช้ sum รวม credits", "แสดงคำอธิบายผลที่ไม่ชวนเข้าใจผิด"], `plan = [{"name": "Python", "credits": 3}, {"name": "Data", "credits": 3}]
if not plan:
    print("No courses meet the current criteria.")
else:
    credits = sum(course["credits"] for course in plan)
    print(f"Recommended courses: {len(plan)}")
    print(f"Total credits: {credits}")`, "ระบบแนะนำควรรองรับกรณีผลลัพธ์ว่างและบอกสถานะอย่างตรงไปตรงมา")
    ]
  }
};

export function extendCourse(chapters) {
  for (const chapter of chapters) {
    const extra = extensions[chapter.title];
    if (!extra) continue;
    chapter.lessonIntro = extra.lessonIntro;
    chapter.examples.push(...extra.examples);
    chapter.exercises.push(...extra.exercises);
  }
  return chapters;
}
