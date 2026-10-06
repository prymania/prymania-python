const ex = (title, level, task, checklist, code, explain) => ({ title, level, task, checklist, code, explain });
const sample = (title, idea, code, steps, image = "") => ({ title, idea, code, steps, image });
const chapter = (title, group, summary, outcome, concepts, examples, exercises) =>
  ({ title, group, summary, outcome, concepts, examples, exercises });

export const applied = [
  chapter("เขียนโปรแกรมเชิงวัตถุด้วย class", "practice",
    "รวมสถานะและพฤติกรรมที่สัมพันธ์กันไว้ใน class เพื่อสร้าง object หลายตัว",
    "ประกาศ class, สร้าง instance, กำหนด attribute และเรียก method ได้",
    [
      ["class เป็นแบบพิมพ์ object เป็นสิ่งที่สร้าง", "class อธิบายข้อมูลและพฤติกรรมร่วมกัน ส่วน instance แต่ละตัวเก็บสถานะของตัวเอง"],
      ["__init__ กำหนดค่าเริ่มต้น", "เมธอด `__init__` รับ self อ้างถึง instance ที่กำลังสร้าง และกำหนด attribute เช่น self.title"],
      ["method รวมพฤติกรรมกับข้อมูล", "เมธอดปกติรับ self เป็นพารามิเตอร์แรก ใช้ค่า attribute แล้วคืนผลหรือปรับสถานะของ object"]
    ],
    [
      sample("สร้าง object รายวิชา", "กำหนดข้อมูลเริ่มต้นใน initializer และใช้ method คืนคำอธิบาย",
        `class Course:
    def __init__(self, name, credits):
        self.name = name
        self.credits = credits

    def describe(self):
        return f"{self.name} ({self.credits} หน่วยกิต)"

python = Course("Python", 3)
print(python.describe())`,
        ["เรียก Course(...) เพื่อสร้าง instance", "__init__ บันทึก name และ credits ลงใน object", "describe อ่านค่าจาก self แล้วคืนข้อความ"]),
      sample("แยกสถานะของแต่ละ object", "สร้างบัญชีสองรายการเพื่อสังเกตว่าแต่ละ instance มี balance คนละค่า",
        `class Wallet:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

first = Wallet("Nok", 100)
second = Wallet("Beam")
first.deposit(50)
print(first.balance, second.balance)`,
        ["ค่าเริ่มต้น balance ของ second คือ 0", "deposit เปลี่ยนสถานะของ first เท่านั้น", "แต่ละ instance มี attribute แยกจากกัน"])
    ],
    [
      ex("สร้าง class Student", 1, "สร้าง class Student ที่รับชื่อและรหัสนักศึกษา แล้วสร้าง object และแสดงข้อมูลทั้งสอง",
        ["กำหนด __init__ รับ self, name, student_id", "บันทึกเป็น attributes", "สร้าง instance และ print"], `class Student:
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id

student = Student("Ploy", "671234")
print(student.name, student.student_id)`, "instance attribute ผูกข้อมูลของผู้เรียนไว้กับ object เดียว"),
      ex("เพิ่ม method คำนวณ", 1, "สร้าง class Rectangle ที่เก็บ width และ height พร้อม method area คืนค่าพื้นที่",
        ["กำหนดค่าด้านใน __init__", "เขียน method รับ self", "คืนค่า width คูณ height"], `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

print(Rectangle(4, 6).area())`, "method เป็นฟังก์ชันที่ทำงานกับข้อมูลของ instance"),
      ex("ควบคุมการเปลี่ยนสถานะ", 2, "สร้าง class Counter ที่เริ่มค่า 0 มี increment เพิ่มทีละหนึ่งและ reset กลับศูนย์",
        ["เก็บค่าใน self.value", "เขียน method ทั้งสอง", "เรียก increment สองครั้งแล้วแสดงค่า"], `class Counter:
    def __init__(self):
        self.value = 0

    def increment(self):
        self.value += 1

counter = Counter()
counter.increment()
counter.increment()
print(counter.value)`, "การซ่อนรายละเอียดการปรับค่าใน method ช่วยให้ผู้เรียกใช้ object ได้ง่าย"),
      ex("รายการสินค้าและยอดรวม", 3, "สร้าง class CartItem เก็บชื่อ ราคา และจำนวน พร้อม method total คืนยอดของรายการ แล้วรวมสินค้า 2 ชนิด",
        ["เก็บ attributes สามค่า", "คำนวณ subtotal ใน method", "รวมยอดของ object ทั้งสอง"], `class CartItem:
    def __init__(self, name, price, quantity):
        self.name = name
        self.price = price
        self.quantity = quantity

    def total(self):
        return self.price * self.quantity

items = [CartItem("pen", 12, 3), CartItem("book", 45, 2)]
print(sum(item.total() for item in items))`, "ให้ object รับผิดชอบสูตรของตัวเองแล้วใช้ sum รวมผลจากหลายรายการ")
    ]),
  chapter("เรียกใช้ Web API และแลกเปลี่ยน JSON", "practice",
    "เข้าใจ request/response, ส่งพารามิเตอร์ และแปลง JSON เพื่อเชื่อมบริการอื่น",
    "สร้าง URL/query, อ่าน response JSON และจัดการข้อผิดพลาดจากเครือข่ายได้อย่างระมัดระวัง",
    [
      ["API คือสัญญาการสื่อสาร", "โปรแกรมส่ง HTTP request ไปยัง endpoint พร้อม method, header และข้อมูล แล้วรับ status code กับ response กลับ"],
      ["แปลงข้อมูล JSON", "API นิยมส่ง JSON ซึ่งจับคู่กับ dict/list ใน Python ใช้ json.loads กับข้อความ และ json.load กับ file object"],
      ["เครือข่ายผิดพลาดได้", "ตรวจ status, timeout และ exception ที่เกี่ยวข้อง อย่าใส่ API key ใน source code และอย่าพึ่งพา API ภายนอกในตัวอย่างที่ต้องรันซ้ำ"]
    ],
    [
      sample("สร้าง query string", "ประกอบพารามิเตอร์ด้วย urllib.parse เพื่อให้ช่องว่างและอักขระพิเศษถูก encode",
        `from urllib.parse import urlencode

params = {"q": "python programming", "page": 2}
query = urlencode(params)
print(query)
print(f"https://example.org/search?{query}")`,
        ["แยกข้อมูล query เป็น dictionary", "urlencode จัดการ encoding ให้ถูกต้อง", "นำ query ไปต่อท้าย endpoint"]),
      sample("เตรียม request แบบไม่พึ่งอินเทอร์เน็ต", "สร้าง Request object และทดลอง parse response ตัวอย่าง",
        `import json
from urllib.request import Request

request = Request("https://example.org/api/courses",
                  headers={"Accept": "application/json"})
payload = '{"course": "Python", "credits": 3}'
data = json.loads(payload)
print(request.get_header("Accept"))
print(data["course"], data["credits"])`,
        ["Request เก็บ URL และ header ก่อนส่ง", "ตัวอย่าง response ใช้ JSON fixture จึงรันทดสอบได้ offline", "เมื่อต่อระบบจริงให้ใช้ urlopen พร้อม timeout และตรวจ status"])
    ],
    [
      ex("อ่าน response JSON", 1, "แปลงข้อความ JSON ที่มีชื่อวิชาและรายชื่อหัวข้อเป็น Python object แล้วแสดงชื่อวิชากับจำนวนหัวข้อ",
        ["ใช้ json.loads", "เข้าถึง key ของ dict", "ใช้ len นับรายการ"], `import json
payload = '{"course":"Python","topics":["variables","loops","functions"]}'
data = json.loads(payload)
print(data["course"])
print(len(data["topics"]))`, "API response ที่เป็น JSON จะกลายเป็น dict/list ที่ใช้ต่อได้"),
      ex("สร้าง URL ค้นหา", 1, "สร้าง query สำหรับคำค้น \"machine learning\" และหมายเลขหน้า 3 โดยใช้ urlencode",
        ["สร้าง dictionary ของ query", "ใช้ urllib.parse.urlencode", "ประกอบ URL และแสดง"], `from urllib.parse import urlencode
query = urlencode({"q": "machine learning", "page": 3})
print(f"https://example.org/search?{query}")`, "urlencode จัดการช่องว่างเป็นรูปแบบที่ URL ส่งได้"),
      ex("อ่านข้อมูลจาก response จำลอง", 2, "มี response เป็นรายการสินค้าแต่ละชิ้นมี price ให้รวมราคาโดยไม่เรียกอินเทอร์เน็ต",
        ["แปลง JSON เป็น list", "ดึง price จากแต่ละ dictionary", "แสดงยอดรวม"], `import json
response = '[{"name":"pen","price":12},{"name":"book","price":45}]'
items = json.loads(response)
print(sum(item["price"] for item in items))`, "fixture ทำให้ทดสอบการแปลงและประมวลผลข้อมูลได้โดยไม่พึ่งบริการภายนอก"),
      ex("ออกแบบการเรียก API อย่างปลอดภัย", 3, "เขียนโครง request ด้วย urllib ที่กำหนด timeout 5 วินาทีและจับ URLError พร้อมพิมพ์ข้อความให้ผู้ใช้ โดยไม่ hard-code token",
        ["สร้าง Request โดยใส่ Accept header", "ใช้ urlopen กับ timeout", "จับ URLError อย่างเจาะจง"], `from urllib.error import URLError
from urllib.request import Request, urlopen

request = Request("https://example.org/api/status",
                  headers={"Accept": "application/json"})
try:
    with urlopen(request, timeout=5) as response:
        print(response.status)
except URLError as error:
    print(f"ติดต่อบริการไม่ได้: {error.reason}")`, "timeout ป้องกันโปรแกรมค้าง ส่วน token จริงควรอ่านจาก environment และไม่บันทึกลง source")
    ]),
  chapter("NumPy สำหรับการคำนวณตัวเลข", "ai",
    "ใช้ array คำนวณข้อมูลจำนวนมากแบบเวกเตอร์ ซึ่งเป็นฐานของงาน Data Science และ AI",
    "สร้าง ndarray คำนวณแบบ element-wise เลือกข้อมูล และคำนวณสถิติพื้นฐาน",
    [
      ["ndarray เป็นข้อมูลชนิดเดียวกัน", "NumPy array ออกแบบสำหรับการคำนวณเชิงตัวเลข ขนาดใหญ่ และรองรับมิติหลายชั้น ใช้ `shape`, `ndim` และ `dtype` สำรวจโครงสร้าง"],
      ["vectorization แทนการวนทีละค่า", "เขียน `scores + 5` ให้บวกทุกสมาชิกพร้อมกัน ลด boilerplate และโดยทั่วไปทำงานเร็วกว่า loop Python เมื่องานข้อมูลมีขนาดใหญ่"],
      ["เลือกและสรุปตามแกน", "ใช้ boolean mask กรองค่าตามเงื่อนไข และระบุ `axis` เมื่อหาผลรวม/ค่าเฉลี่ยตามแถวหรือคอลัมน์"]
    ],
    [
      sample("คำนวณคะแนนเป็นชุด", "ปรับคะแนนทุกวิชาและสรุปค่าเฉลี่ยด้วย NumPy",
        `import numpy as np

scores = np.array([72, 85, 91, 66])
adjusted = scores + 3
print(adjusted)
print(f"mean={adjusted.mean():.2f}")
print(f"shape={adjusted.shape}")`,
        ["array เก็บคะแนนเป็นค่าตัวเลข", "บวก scalar กับ array จะกระจายการบวกทุกสมาชิก", "mean สรุปค่าเฉลี่ยและ shape บอกรูปร่างข้อมูล"]),
      sample("กรองค่าด้วย boolean mask", "เลือกคะแนนที่ผ่านเกณฑ์ แล้วหาค่าเฉลี่ยเฉพาะกลุ่ม",
        `import numpy as np

scores = np.array([42, 55, 68, 91])
passed = scores[scores >= 50]
print(passed)
print(f"ผ่าน {len(passed)} คน")
print(f"เฉลี่ยผู้ผ่าน {passed.mean():.1f}")`,
        ["scores >= 50 สร้าง mask ของ True/False", "ใช้ mask เลือกเฉพาะสมาชิกที่ผ่าน", "คำนวณสถิติเฉพาะ array ย่อย"])
    ],
    [
      ex("แปลงหน่วยทั้ง array", 1, "สร้าง array อุณหภูมิ Celsius [0, 20, 30] แล้วแปลงทุกค่าเป็น Fahrenheit ด้วยสูตร F=C*9/5+32",
        ["สร้าง np.array", "ใช้สูตรโดยไม่เขียน loop", "แสดงผล array"], `import numpy as np
celsius = np.array([0, 20, 30])
fahrenheit = celsius * 9 / 5 + 32
print(fahrenheit)`, "vectorization ทำให้สูตรเดียวคำนวณได้ทั้งชุดข้อมูล"),
      ex("สรุปยอดขาย", 1, "มี array ยอดขายรายวัน [120, 150, 90, 180] จงแสดงผลรวม ค่าเฉลี่ย และค่าสูงสุด",
        ["สร้าง array จากข้อมูล", "เรียก sum, mean และ max", "จัดรูปแบบค่าเฉลี่ย"], `import numpy as np
sales = np.array([120, 150, 90, 180])
print(sales.sum())
print(f"{sales.mean():.1f}")
print(sales.max())`, "เมธอดของ ndarray ช่วยคำนวณสถิติโดยไม่ต้องเขียน accumulator"),
      ex("กรองค่าต่ำกว่าเกณฑ์", 2, "เลือกค่าจาก [18, 25, 31, 42, 55] ที่ตั้งแต่ 30 ขึ้นไปและนับจำนวน",
        ["สร้าง boolean mask", "ใช้ mask เลือกค่า", "ใช้ size หรือ len นับ"], `import numpy as np
values = np.array([18, 25, 31, 42, 55])
selected = values[values >= 30]
print(selected)
print(selected.size)`, "การกรองด้วย mask อ่านตรงกับเงื่อนไขและคืน array ใหม่"),
      ex("คำนวณคอลัมน์ตามแกน", 3, "ข้อมูลสองแถวสามคอลัมน์เป็น [[1,2,3],[4,5,6]] ให้หาผลรวมรายคอลัมน์และรายแถว",
        ["สร้าง array สองมิติ", "ใช้ sum(axis=0) สำหรับคอลัมน์", "ใช้ sum(axis=1) สำหรับแถว"], `import numpy as np
data = np.array([[1, 2, 3], [4, 5, 6]])
print(data.sum(axis=0))
print(data.sum(axis=1))`, "แกน 0 ยุบแถวเพื่อได้ค่าต่อคอลัมน์ ส่วนแกน 1 ยุบคอลัมน์เพื่อได้ค่าต่อแถว")
    ]),
  chapter("จัดการตารางข้อมูลด้วย pandas", "ai",
    "อ่าน ทำความสะอาด เลือก และสรุปข้อมูลตารางด้วย DataFrame",
    "สร้าง DataFrame กรองแถว จัดการค่าว่าง และ groupby ข้อมูลตามหมวดหมู่ได้",
    [
      ["DataFrame มีแถวและคอลัมน์", "สร้างจาก dict ของ list หรืออ่านจาก CSV; ตรวจ `head()`, `shape`, `dtypes` และ `info()` ก่อนวิเคราะห์"],
      ["เลือกและกรองข้อมูล", "ใช้ `df[\"column\"]` เลือกคอลัมน์ และ boolean condition กรองแถว ควรใช้ `.loc` เมื่อเลือกแถวและคอลัมน์พร้อมกัน"],
      ["ทำความสะอาดและ groupby", "`isna()` ตรวจค่าว่าง, `fillna()` เติมตามเหตุผล และ `groupby()` สรุปตามกลุ่ม คิดก่อนว่าจะทิ้งหรือเติม missing data"]
    ],
    [
      sample("สร้างตารางและกรอง", "สร้าง DataFrame คะแนน แล้วเลือกเฉพาะแถวที่คะแนนถึงเกณฑ์",
        `import pandas as pd

df = pd.DataFrame({
    "name": ["Mali", "Beam", "Nok"],
    "score": [88, 47, 76],
})
passed = df[df["score"] >= 50]
print(passed[["name", "score"]].to_string(index=False))`,
        ["dict กำหนดชื่อคอลัมน์และข้อมูลแต่ละคอลัมน์", "เงื่อนไขคืน Series ของ True/False", "ใช้ mask เลือกแถวผ่านแล้วแสดงเฉพาะคอลัมน์ที่สนใจ"]),
      sample("สรุปด้วย groupby", "รวมยอดขายตามหมวดหมู่ด้วยการจัดกลุ่ม",
        `import pandas as pd

df = pd.DataFrame({
    "category": ["book", "pen", "book", "pen"],
    "sales": [120, 30, 80, 45],
})
summary = df.groupby("category")["sales"].sum()
print(summary.to_string())`,
        ["groupby แบ่งข้อมูลตาม category", "เลือก sales แล้วคำนวณ sum ในแต่ละกลุ่ม", "ผลลัพธ์เป็น Series ที่ index เป็นชื่อหมวด"])
    ],
    [
      ex("คำนวณคอลัมน์ใหม่", 1, "สร้างตารางสินค้า price และ quantity แล้วเพิ่มคอลัมน์ total = price * quantity",
        ["สร้าง DataFrame", "คูณ Series ของสองคอลัมน์", "แสดงตารางผลลัพธ์"], `import pandas as pd
df = pd.DataFrame({"price": [10, 25], "quantity": [3, 2]})
df["total"] = df["price"] * df["quantity"]
print(df.to_string(index=False))`, "การคำนวณระหว่าง Series จะจับคู่ค่าตาม index"),
      ex("กรองข้อมูลหลายเงื่อนไข", 1, "จากตารางชื่อและคะแนน ให้เลือกคนที่คะแนนตั้งแต่ 60 และแสดงเฉพาะชื่อ",
        ["สร้าง mask คะแนน >= 60", "เลือกคอลัมน์ name", "แสดง index=False"], `import pandas as pd
df = pd.DataFrame({"name": ["A", "B", "C"], "score": [55, 72, 90]})
print(df.loc[df["score"] >= 60, ["name"]].to_string(index=False))`, ".loc ระบุทั้งเงื่อนไขแถวและคอลัมน์ที่ต้องการ"),
      ex("จัดการค่าว่าง", 2, "สร้างตารางคะแนนมีค่า None หนึ่งแถว แล้วเติมค่าว่างด้วยค่าเฉลี่ยของคอลัมน์",
        ["ใช้ isna ตรวจค่าว่าง", "คำนวณ mean", "fillna ด้วยค่าเฉลี่ยและแสดงผล"], `import pandas as pd
df = pd.DataFrame({"score": [70, None, 90]})
print(df["score"].isna().sum())
df["score"] = df["score"].fillna(df["score"].mean())
print(df["score"].tolist())`, "การเติมค่าเฉลี่ยเป็นตัวอย่างหนึ่ง ต้องเลือกวิธีตามความหมายของข้อมูลจริง"),
      ex("สรุปยอดขายรายหมวด", 3, "สร้างข้อมูลยอดขาย 4 แถวของหมวด A และ B ให้สรุปจำนวนรายการและยอดรวมต่อหมวด",
        ["groupby category", "aggregate count และ sum", "แสดง DataFrame สรุป"], `import pandas as pd
df = pd.DataFrame({"category": ["A", "B", "A", "B"], "sales": [10, 20, 15, 5]})
result = df.groupby("category")["sales"].agg(["count", "sum"])
print(result.to_string())`, "agg รวมหลายสถิติไว้ในขั้นตอน groupby เดียว")
    ]),
  chapter("สร้างกราฟด้วย Matplotlib", "ai",
    "เปลี่ยนข้อมูลตัวเลขเป็นภาพเพื่อมองแนวโน้ม เปรียบเทียบ และสื่อสารผล",
    "สร้างกราฟเส้น แท่ง และ scatter พร้อมป้ายกำกับและบันทึกภาพได้",
    [
      ["เลือกชนิดกราฟตามคำถาม", "กราฟเส้นสื่อแนวโน้มตามลำดับ, กราฟแท่งเปรียบเทียบหมวดหมู่ และ scatter ดูความสัมพันธ์ของตัวแปรสองตัว"],
      ["label ทำให้กราฟอ่านได้", "กำหนด title, xlabel, ylabel และ legend; ถ้าข้อมูลเป็นภาษาไทยให้เลือกฟอนต์ที่ติดตั้งในระบบเพื่อไม่ให้ตัวอักษรหาย"],
      ["แยกการวาดกับการบันทึก", "ใช้ `fig, ax = plt.subplots()` วาดผ่าน axes และ `fig.savefig(...)` บันทึกภาพก่อนปิด figure ด้วย `plt.close(fig)`"]
    ],
    [
      sample("กราฟเส้น", "วาดแนวโน้มการอ่านหนังสือรายวันและบันทึกเป็น PNG",
        `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path
from tempfile import TemporaryDirectory

days = [1, 2, 3, 4]
minutes = [20, 35, 30, 50]
fig, ax = plt.subplots()
ax.plot(days, minutes, marker="o", label="minutes")
ax.set(xlabel="Day", ylabel="Minutes", title="Study progress")
ax.legend()
with TemporaryDirectory() as folder:
    image = Path(folder) / "study.png"
    fig.savefig(image)
    print(f"saved={image.suffix == '.png'}, points={len(days)}")
plt.close(fig)`,
        ["Agg backend วาดภาพโดยไม่ต้องเปิดหน้าต่าง", "plot แสดงแนวโน้มเป็นเส้นและ marker", "savefig บันทึกภาพก่อนปิด figure"]),
      sample("เปรียบเทียบด้วยกราฟแท่ง", "สร้างกราฟแท่งจากยอดขายสามหมวดแล้วตรวจค่าที่ส่งให้กราฟ",
        `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

categories = ["A", "B", "C"]
sales = [12, 19, 9]
fig, ax = plt.subplots()
ax.bar(categories, sales, color=["#ff755e", "#8de0c7", "#f5c960"])
ax.set(title="Sales by category", ylabel="Units")
print(f"bars={len(ax.patches)}, total={sum(sales)}")
plt.close(fig)`,
        ["bar รับ label กับค่าความสูง", "กำหนดชื่อกราฟและแกนให้คนอ่านเข้าใจ", "จำนวนแท่งตรวจได้จาก patches"])
    ],
    [
      ex("กราฟอุณหภูมิ", 1, "วาดกราฟเส้นอุณหภูมิ [28, 30, 29, 32] ตามวัน 1-4 พร้อมชื่อแกนและ title",
        ["ใช้ pyplot แบบ object-oriented", "กำหนด marker", "พิมพ์จำนวนจุดที่วาด"], `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
days = [1, 2, 3, 4]
temps = [28, 30, 29, 32]
fig, ax = plt.subplots()
ax.plot(days, temps, marker="o")
ax.set(title="Temperature", xlabel="Day", ylabel="Celsius")
print(len(ax.lines[0].get_xdata()))
plt.close(fig)`, "backend Agg เหมาะกับการสร้างภาพบนเครื่องที่ไม่มีจอแสดงผล"),
      ex("กราฟเปรียบเทียบ", 1, "วาดกราฟแท่งคะแนนของวิชา Python, Data และ AI เป็น 82, 76, 91",
        ["ใช้ bar", "ตั้ง label ของแกน x และ y", "แสดงจำนวนแท่ง"], `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
subjects = ["Python", "Data", "AI"]
scores = [82, 76, 91]
fig, ax = plt.subplots()
ax.bar(subjects, scores)
ax.set(ylabel="Score", title="Scores")
print(len(ax.patches))
plt.close(fig)`, "กราฟแท่งเหมาะกับการเปรียบเทียบค่าระหว่างหมวดหมู่"),
      ex("บันทึกภาพกราฟ", 2, "สร้าง scatter ของ [1,2,3] กับ [2,4,5] แล้วบันทึกลงไฟล์ชั่วคราวพร้อมยืนยันว่าไฟล์มีขนาดมากกว่า 0",
        ["ตั้ง Agg ก่อน import pyplot", "วาด scatter", "savefig และตรวจขนาดไฟล์"], `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path
from tempfile import TemporaryDirectory
x, y = [1, 2, 3], [2, 4, 5]
fig, ax = plt.subplots()
ax.scatter(x, y)
with TemporaryDirectory() as folder:
    path = Path(folder) / "plot.png"
    fig.savefig(path)
    print(path.exists(), path.stat().st_size > 0)
plt.close(fig)`, "ตรวจไฟล์ที่สร้างจริงช่วยยืนยันว่ากราฟถูกบันทึก ไม่ใช่แค่คำสั่งวาดผ่าน"),
      ex("เลือกกราฟที่เหมาะสม", 3, "มีข้อมูลอุณหภูมิรายชั่วโมงและข้อมูลยอดขายแยกหมวด ให้สร้างกราฟเส้นกับกราฟแท่งใน figure เดียวด้วย subplots",
        ["สร้าง axes สองช่อง", "วาด line ในแกนแรกและ bar ในแกนที่สอง", "ตั้ง title ให้ทั้งสอง axes"], `import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
fig, axes = plt.subplots(1, 2)
axes[0].plot([1, 2, 3], [25, 27, 26])
axes[0].set_title("Hourly temperature")
axes[1].bar(["A", "B"], [12, 18])
axes[1].set_title("Sales")
print(len(fig.axes))
plt.close(fig)`, "ใช้ axes แยกกันเพื่อให้กราฟสองชนิดอยู่ร่วม figure โดยตั้งค่าของแต่ละกราฟได้อิสระ")
    ]),
  chapter("Machine Learning เบื้องต้นด้วย scikit-learn", "ai",
    "สร้าง pipeline ฝึกและประเมินโมเดลจากข้อมูลตัวอย่าง โดยแยก train กับ test",
    "รู้จัก feature/label, fit/predict, train-test split และ accuracy",
    [
      ["แยก feature กับ target", "X คือข้อมูลนำเข้าและ y คือคำตอบที่ต้องการทำนาย แถวหนึ่งแทนตัวอย่างหนึ่งรายการ คอลัมน์ feature ต้องเป็นข้อมูลที่โมเดลใช้ได้"],
      ["อย่าทดสอบด้วยข้อมูลฝึก", "แบ่ง train/test ก่อน fit เพื่อประเมินกับข้อมูลที่โมเดลไม่เคยเห็น ระวัง data leakage ที่ทำให้ผลดูดีเกินจริง"],
      ["Pipeline ป้องกันขั้นตอนสับสน", "วางการแปลง feature และ estimator ต่อกันใน Pipeline เมื่อมี preprocessing เพื่อให้ fit และ predict ใช้ลำดับเดียวกัน"]
    ],
    [
      sample("ฝึก classifier จากข้อมูล Iris", "ใช้ dataset ที่มาพร้อม scikit-learn แบ่งข้อมูล แล้ววัด accuracy",
        `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

data = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=0.25, random_state=42, stratify=data.target
)
model = KNeighborsClassifier(n_neighbors=3).fit(X_train, y_train)
print(f"accuracy={accuracy_score(y_test, model.predict(X_test)):.2f}")`,
        ["dataset ให้ feature และ label", "stratify รักษาสัดส่วนแต่ละ class ในชุดทดสอบ", "fit ฝึกโมเดลและ predict สร้างผลทำนาย"]),
      sample("ทำนายข้อมูลใหม่", "ฝึก tree บนตัวอย่างเล็กและส่ง feature หนึ่งแถวเข้า predict",
        `from sklearn.tree import DecisionTreeClassifier

X = [[1, 20], [2, 22], [7, 35], [8, 37]]
y = ["small", "small", "large", "large"]
model = DecisionTreeClassifier(max_depth=2, random_state=0)
model.fit(X, y)
prediction = model.predict([[7, 34]])
print(prediction[0])`,
        ["X เป็นรายการ feature ต่อหนึ่งตัวอย่าง", "y เป็น label ที่ต้องการเรียนรู้", "predict ต้องรับข้อมูลในรูปทรงเดียวกับตอน fit"])
    ],
    [
      ex("ฝึกโมเดลใกล้สุด", 1, "ฝึก KNeighborsClassifier ด้วยข้อมูลตัวอย่างสี่รายการ แล้วทำนายรายการ [8, 35]",
        ["import estimator", "เรียก fit ด้วย X และ y", "ทำนายตัวอย่างใหม่"], `from sklearn.neighbors import KNeighborsClassifier
X = [[1, 20], [2, 22], [7, 35], [8, 37]]
y = ["small", "small", "large", "large"]
model = KNeighborsClassifier(n_neighbors=1).fit(X, y)
print(model.predict([[8, 35]])[0])`, "โมเดล nearest neighbor ใช้ label ของข้อมูลฝึกที่ใกล้กับตัวอย่างใหม่ที่สุด"),
      ex("แบ่งข้อมูลเพื่อประเมิน", 1, "ใช้ load_iris แบ่ง train/test แบบ 20 เปอร์เซ็นต์ พร้อม random_state=7 และแสดงจำนวนตัวอย่างแต่ละชุด",
        ["เรียก train_test_split", "เก็บ X_train และ X_test", "ใช้ len แสดงจำนวน"], `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=7, stratify=y
)
print(len(X_train), len(X_test))`, "กำหนด random_state เพื่อให้การแบ่งข้อมูลทำซ้ำได้"),
      ex("คำนวณ accuracy", 2, "สร้าง model decision tree บนข้อมูล Iris ประเมิน accuracy ด้วยชุดทดสอบและแสดงเป็นเปอร์เซ็นต์",
        ["แบ่ง train/test แบบ stratify", "fit เฉพาะ training set", "ใช้ accuracy_score กับ test labels และ predictions"], `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
X, y = load_iris(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=2, stratify=y)
model = DecisionTreeClassifier(max_depth=3, random_state=2).fit(Xtr, ytr)
print(f"{accuracy_score(yte, model.predict(Xte)):.0%}")`, "accuracy คือสัดส่วนคำตอบถูก แต่ควรดู metric อื่นเมื่อ class ไม่สมดุล"),
      ex("สร้าง pipeline ทำ scaling", 3, "ใช้ StandardScaler และ LogisticRegression ใน Pipeline แล้วฝึกกับ Iris แบ่ง train/test ก่อนวัด accuracy",
        ["สร้าง Pipeline สองขั้น", "แยกข้อมูลพร้อม stratify", "fit และประเมินบน test set"], `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
X, y = load_iris(return_X_y=True)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=11, stratify=y)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=300))
model.fit(Xtr, ytr)
print(f"{accuracy_score(yte, model.predict(Xte)):.2f}")`, "pipeline ให้ scaler เรียนรู้จาก training data เท่านั้นและใช้ transformation เดียวกันตอน predict")
    ]),
  chapter("แนวคิด Neural Network และการฝึกโมเดล", "ai",
    "ต่อยอดแนวคิด ML สู่ neuron, activation, loss และวงจรการเรียนรู้ของ deep learning",
    "อธิบายส่วนประกอบ neural network และจำลอง forward pass ด้วย NumPy ก่อนเลือกใช้ framework",
    [
      ["Neuron รวม input ด้วยน้ำหนัก", "คำนวณ weighted sum `x @ w + b` แล้วส่งผ่าน activation เช่น ReLU; น้ำหนักและ bias คือค่าที่เรียนรู้จากข้อมูล"],
      ["Loss วัดความคลาดเคลื่อน", "เปรียบเทียบผลทำนายกับคำตอบจริงด้วย loss function การฝึกพยายามปรับพารามิเตอร์ให้ loss ลดลง โดยใช้ gradient descent หรือ backpropagation"],
      ["Framework ช่วยคำนวณ gradient", "PyTorch และ TensorFlow จัดการ tensor, automatic differentiation และการฝึกบน hardware; เริ่มจากแนวคิดก่อนติดตั้ง framework ที่เหมาะกับเครื่อง"]
    ],
    [
      sample("จำลอง neuron ด้วย NumPy", "คูณ feature ด้วยน้ำหนัก บวก bias และใช้ ReLU",
        `import numpy as np

features = np.array([2.0, 1.0])
weights = np.array([0.5, -1.0])
bias = 0.25
z = features @ weights + bias
activation = max(0, z)
print(f"z={z:.2f}")
print(f"relu={activation:.2f}")`,
        ["@ คำนวณ dot product ของ feature กับ weight", "บวก bias ก่อน activation", "ReLU เปลี่ยนค่าติดลบเป็นศูนย์"]),
      sample("คำนวณ prediction error", "คำนวณ mean squared error ของผลทำนายกับค่าจริงชุดเล็ก",
        `import numpy as np

actual = np.array([1.0, 0.0, 1.0])
predicted = np.array([0.8, 0.3, 0.6])
mse = np.mean((actual - predicted) ** 2)
print(f"MSE={mse:.3f}")`,
        ["หาผลต่างคำตอบจริงกับผลทำนายทีละค่า", "ยกกำลังสองทำให้ error ไม่หักล้างกัน", "mean สรุปความคลาดเคลื่อนเฉลี่ย"])
    ],
    [
      ex("คำนวณ linear neuron", 1, "คำนวณ z = x1*w1 + x2*w2 + bias เมื่อ x=[3,2], w=[0.2,0.5], bias=0.1",
        ["สร้าง array x และ w", "ใช้ dot product", "แสดง z"], `import numpy as np
x = np.array([3.0, 2.0])
w = np.array([0.2, 0.5])
z = x @ w + 0.1
print(f"{z:.1f}")`, "dot product คือการรวมผลคูณของแต่ละ feature กับ weight"),
      ex("ใช้ activation", 1, "เขียนฟังก์ชัน ReLU คืน max(0, x) แล้วทดลองกับ -2, 0 และ 3",
        ["เขียนฟังก์ชันรับค่า", "คืนค่าที่ไม่ต่ำกว่าศูนย์", "แสดงผลทั้งสาม"], `def relu(value):
    return max(0, value)

print([relu(value) for value in (-2, 0, 3)])`, "ReLU ทำให้ค่าติดลบเป็นศูนย์และคงค่าบวกไว้"),
      ex("เปรียบเทียบ loss", 2, "คำนวณ MSE สำหรับ actual [1,0,1] และ prediction [0.8,0.3,0.6] แล้วปัดสามตำแหน่ง",
        ["คำนวณ residual", "ยกกำลังสองแล้วใช้ค่าเฉลี่ย", "จัดรูปแบบ"], `import numpy as np
actual = np.array([1.0, 0.0, 1.0])
predicted = np.array([0.8, 0.3, 0.6])
print(f"{np.mean((actual - predicted) ** 2):.3f}")`, "MSE ให้โทษความผิดพลาดขนาดใหญ่หนักขึ้นเพราะยกกำลังสอง"),
      ex("ทำ forward pass เป็น batch", 3, "คำนวณ neuron สำหรับสองแถวข้อมูลด้วย matrix multiplication, weight หนึ่งชุดและ bias แล้วใช้ ReLU กับผลทุกแถว",
        ["สร้าง X รูปร่าง 2x2", "ใช้ X @ weights + bias", "ใช้ np.maximum แบบ element-wise"], `import numpy as np
X = np.array([[1.0, 2.0], [3.0, 1.0]])
weights = np.array([0.5, -0.2])
z = X @ weights + 0.1
print(np.maximum(0, z))`, "batch computation คำนวณหลายตัวอย่างพร้อมกันและเป็นแนวคิดเดียวกับ tensor framework")
    ]),
  chapter("สร้าง GUI สมัยใหม่ด้วย PySide6", "gui",
    "สร้างแอปหน้าต่างด้วย Qt for Python โดยใช้ widget, layout, signal และ slot",
    "ประกอบหน้าต่างด้วย widget จัด layout เชื่อมปุ่มกับฟังก์ชัน และรัน event loop ได้",
    [
      ["QApplication จัดการแอป", "สร้าง QApplication หนึ่งตัวต่อโปรแกรม สร้างหน้าต่างจาก QWidget/QMainWindow แล้วเรียก `app.exec()` เพื่อรับ event จากผู้ใช้"],
      ["Layout ทำหน้าที่จัดวาง", "QVBoxLayout วาง widget แนวตั้ง และ QHBoxLayout วางแนวนอน ใช้ layout แทนพิกัดตายตัวเพื่อให้หน้าต่างปรับตามขนาดได้"],
      ["signal/slot เชื่อม event กับงาน", "ปุ่มมี signal เช่น `clicked`; ต่อกับ method หรือ function ที่ทำงาน เช่น อ่าน QLineEdit แล้วอัปเดต QLabel"]
    ],
    [
      sample("หน้าต่างทักทาย", "แอป Qt จริงที่รับชื่อ กดปุ่ม แล้วเปลี่ยนข้อความในหน้าต่าง",
        `import os
import sys
from pathlib import Path
from PySide6.QtGui import QFont, QFontDatabase
from PySide6.QtWidgets import QApplication, QLabel, QLineEdit, QPushButton, QVBoxLayout, QWidget

app = QApplication(sys.argv)
font_path = Path(os.environ["WINDIR"]) / "Fonts" / "segoeui.ttf"
font_id = QFontDatabase.addApplicationFont(str(font_path))
font_families = QFontDatabase.applicationFontFamilies(font_id)
if font_id < 0 or not font_families:
    raise RuntimeError(f"Unable to load GUI font: {font_path}")
app.setFont(QFont(font_families[0], 11))
window = QWidget()
window.setWindowTitle("Study Buddy")
window.resize(420, 230)
layout = QVBoxLayout(window)
title = QLabel("What are you learning today?")
title.setObjectName("title")
name = QLineEdit()
name.setPlaceholderText("Enter your name")
button = QPushButton("Start learning")
result = QLabel("Ready to learn")
layout.addWidget(title)
layout.addWidget(name)
layout.addWidget(button)
layout.addWidget(result)
button.clicked.connect(lambda: result.setText(f"Welcome, {name.text()}"))
window.setStyleSheet("QWidget{background:#192044;color:white;font-size:16px;font-family:'Segoe UI'} QPushButton{background:#ff755e;padding:10px}")
window.show()
name.setText("Nina")
button.click()
app.processEvents()
Path("assets/gui").mkdir(parents=True, exist_ok=True)
saved = window.grab().save("assets/gui/study-buddy.png")
print(f"Study Buddy ready · capture={saved}")`,
        ["สร้าง QApplication และ QWidget หลัก", "layout จัดวาง label, ช่องกรอก และปุ่มโดยไม่กำหนดพิกัด", "signal clicked เชื่อมการกดปุ่มกับการอัปเดตผล", "โปรแกรมตัวอย่างเติมชื่อและคลิกปุ่มเพื่อให้เห็นหน้าต่างสถานะที่พร้อมใช้งาน"],
        "assets/gui/study-buddy.png"),
      sample("แสดงผลการคำนวณบนหน้าต่าง", "คำนวณยอดรวมแล้วแสดงผลใน QLabel เมื่อผู้ใช้กดปุ่ม",
        `from PySide6.QtWidgets import QApplication, QLabel, QPushButton, QVBoxLayout, QWidget

app = QApplication([])
window = QWidget()
window.setWindowTitle("Quick Calculator")
layout = QVBoxLayout(window)
result = QLabel("กดปุ่มเพื่อรวม 120 + 80")
button = QPushButton("คำนวณ")
button.clicked.connect(lambda: result.setText(f"รวม {120 + 80} บาท"))
layout.addWidget(result)
layout.addWidget(button)
window.show()
button.click()
app.processEvents()
print(result.text())`,
        ["สร้าง widget สำหรับผลลัพธ์และปุ่ม", "เชื่อม clicked กับการเปลี่ยนข้อความ", "คลิกจากโค้ดเพื่อให้ตัวอย่างทำงานซ้ำได้โดยไม่ต้องโต้ตอบ"])
    ],
    [
      ex("หน้าต่างข้อมูลส่วนตัว", 1, "สร้างหน้าต่าง PySide6 ที่มีชื่อแอปและ QLabel แสดงข้อความ Course Planner",
        ["สร้าง QApplication", "สร้าง QWidget พร้อม title", "เพิ่ม QLabel ผ่าน QVBoxLayout", "แสดงหน้าต่างและพิมพ์ข้อความยืนยัน"], `from PySide6.QtWidgets import QApplication, QLabel, QVBoxLayout, QWidget
app = QApplication([])
window = QWidget()
window.setWindowTitle("Course Planner")
layout = QVBoxLayout(window)
layout.addWidget(QLabel("Course Planner"))
window.show()
app.processEvents()
print("Course Planner")`, "layout ช่วยให้ widget เรียงกันโดยไม่ต้องคำนวณตำแหน่งด้วยมือ"),
      ex("ปุ่มกดเปลี่ยนข้อความ", 1, "สร้าง QLabel และ QPushButton ให้เมื่อคลิกปุ่มแล้ว QLabel เปลี่ยนเป็น \"บันทึกแล้ว\" จากนั้นจำลอง click หนึ่งครั้ง",
        ["สร้าง signal-slot connection", "เรียก button.click เพื่อจำลอง event", "แสดงข้อความผลลัพธ์"], `from PySide6.QtWidgets import QApplication, QLabel, QPushButton
app = QApplication([])
label = QLabel("ยังไม่บันทึก")
button = QPushButton("บันทึก")
button.clicked.connect(lambda: label.setText("บันทึกแล้ว"))
button.click()
app.processEvents()
print(label.text())`, "การเชื่อม signal กับ slot แยกการตอบสนองออกจากโครงหน้าต่าง"),
      ex("รับข้อมูลจากช่องกรอก", 2, "สร้าง QLineEdit และปุ่ม เมื่อคลิกให้นำข้อความ \"Ada\" ไปแสดงใน QLabel",
        ["ตั้งค่า text ให้ช่องกรอก", "อ่าน text ใน callback", "เรียก click เพื่อทดสอบโดยไม่ต้องโต้ตอบ"], `from PySide6.QtWidgets import QApplication, QLabel, QLineEdit, QPushButton
app = QApplication([])
name = QLineEdit()
name.setText("Ada")
result = QLabel()
button = QPushButton("ทักทาย")
button.clicked.connect(lambda: result.setText(f"สวัสดี {name.text()}"))
button.click()
app.processEvents()
print(result.text())`, "อ่านค่าจาก widget ตอน event เกิดขึ้น เพื่อใช้ข้อมูลล่าสุดของผู้ใช้"),
      ex("สร้างแบบฟอร์มพร้อมตรวจค่าว่าง", 3, "สร้างฟอร์มเพิ่มงานที่มี QLineEdit และปุ่ม ถ้าข้อความว่างให้แสดงคำเตือน ถ้ามีข้อความให้แสดงงานที่เพิ่ม",
        ["ตัดช่องว่างหัวท้ายด้วย strip", "ใช้ if/else แยกกรณีว่าง", "ทดสอบทั้งข้อความว่างและข้อความจริง"], `from PySide6.QtWidgets import QApplication, QLabel, QLineEdit, QPushButton
app = QApplication([])
task = QLineEdit()
result = QLabel()
button = QPushButton("เพิ่มงาน")
def add_task():
    value = task.text().strip()
    result.setText("กรุณากรอกงาน" if not value else f"เพิ่มแล้ว: {value}")
button.clicked.connect(add_task)
task.setText("อ่านบทที่ 1")
button.click()
app.processEvents()
print(result.text())`, "ตรวจ input ก่อนทำงานช่วยกันข้อมูลว่างและทำให้ผู้ใช้เข้าใจสิ่งที่ต้องแก้")
    ]),
  chapter("โปรเจกต์ปลายทาง: Course Planner + AI", "gui",
    "นำ Python, ตารางข้อมูล, โมเดล และ GUI มาประกอบเป็นแอปแนะนำแผนเรียนขนาดเล็ก",
    "วางโครงโปรเจกต์ เชื่อมข้อมูลกับกติกา/โมเดล และทดสอบผลลัพธ์จาก UI",
    [
      ["เริ่มจากโจทย์และข้อมูล", "กำหนดผู้ใช้ ปัญหาที่ช่วยแก้ และ schema ข้อมูลให้ชัด เช่น วิชา หน่วยกิต และคะแนนความพร้อม ก่อนเลือกว่าจะใช้กติกาหรือโมเดล"],
      ["แยก UI, logic และ data", "ให้ widget รับ input และแสดงผล ฟังก์ชันแยกทำกติกาแนะนำ และชั้นข้อมูลโหลด/ตรวจตาราง การแยกส่วนทำให้ทดสอบ logic โดยไม่เปิดหน้าต่างได้"],
      ["ประเมินและสื่อสารข้อจำกัด", "ทดสอบกรณีปกติ ค่าว่าง และค่าขอบเขต เปรียบเทียบ baseline ที่อธิบายได้ก่อนโมเดลซับซ้อน และแจ้งผู้ใช้ว่าผลแนะนำไม่ใช่คำตัดสินอัตโนมัติ"]
    ],
    [
      sample("แนะนำวิชาจากคะแนนความพร้อม", "เริ่มด้วยกติกาที่โปร่งใส แล้วค่อยเปลี่ยนเป็นโมเดลเมื่อมีข้อมูลที่เหมาะสม",
        `import pandas as pd

courses = pd.DataFrame({
    "course": ["Python", "Data Analysis", "Machine Learning"],
    "prerequisite_score": [0, 60, 75],
})
student_score = 68
recommended = courses[courses["prerequisite_score"] <= student_score]
print(recommended["course"].tolist())`,
        ["DataFrame เก็บ catalog วิชา", "เงื่อนไขเลือกวิชาที่ prerequisite score ไม่เกินระดับผู้เรียน", "แสดงรายการแนะนำที่ได้จากกติกาที่อธิบายได้"]),
      sample("เชื่อมผลแนะนำกับหน้าต่าง", "ใช้ผลลัพธ์จากฟังก์ชัน logic แสดงใน widget โดยไม่ฝังกติกาไว้ใน callback",
        `def recommend(score, catalog):
    return [course for course, minimum in catalog if score >= minimum]

catalog = [("Python", 0), ("Data Analysis", 60), ("AI", 75)]
suggestions = recommend(68, catalog)
print("แนะนำ:", ", ".join(suggestions))
print("พิจารณาความพร้อมก่อนลงทะเบียน")`,
        ["ฟังก์ชันรับข้อมูลและคืนรายการแนะนำ", "ส่วนแสดงผลนำรายการไปจัดข้อความ", "ข้อความแจ้งข้อจำกัดป้องกันการตีความผลเป็นคำสั่งเด็ดขาด"])
    ],
    [
      ex("แนะนำวิชาตามเกณฑ์", 1, "สร้างรายการวิชาและคะแนนขั้นต่ำ จากนั้นเขียนฟังก์ชันแนะนำวิชาที่คะแนนผู้เรียนถึงเกณฑ์",
        ["ใช้ list ของ tuple (ชื่อวิชา, คะแนนขั้นต่ำ)", "กรองโดยเปรียบเทียบกับคะแนน", "แสดงรายชื่อแนะนำ"], `catalog = [("Python", 0), ("Data", 60), ("AI", 75)]
def recommend(score):
    return [name for name, minimum in catalog if score >= minimum]
print(recommend(68))`, "เริ่มด้วย baseline แบบกฎช่วยอธิบายเหตุผลได้และใช้เป็นจุดเปรียบเทียบโมเดล"),
      ex("สรุปแผนเรียนด้วย pandas", 1, "สร้าง DataFrame วิชาสองรายการพร้อมหน่วยกิต แล้วแสดงจำนวนวิชาและหน่วยกิตรวม",
        ["สร้าง DataFrame", "ใช้ len นับรายการ", "ใช้ sum รวม credits"], `import pandas as pd
plan = pd.DataFrame({"course": ["Python", "Data"], "credits": [3, 3]})
print(f"{len(plan)} วิชา")
print(f"{plan['credits'].sum()} หน่วยกิต")`, "ตารางช่วยตรวจแผนหลายรายการและสรุปข้อมูลได้ตรงไปตรงมา"),
      ex("วัดความแม่นยำ baseline", 2, "เปรียบเทียบคำแนะนำกับ label จริงสำหรับรายการทดสอบ 4 รายการ แล้วคำนวณ accuracy",
        ["สร้าง list actual และ predicted", "นับคู่ที่ตรงกัน", "หารด้วยจำนวนทั้งหมด"], `actual = ["yes", "no", "yes", "yes"]
predicted = ["yes", "no", "no", "yes"]
correct = sum(a == p for a, p in zip(actual, predicted))
print(f"accuracy={correct / len(actual):.2f}")`, "ประเมิน baseline ก่อนเพื่อให้รู้ว่าระบบที่ซับซ้อนขึ้นดีขึ้นจริงหรือไม่"),
      ex("วางแผนทดสอบแอป", 3, "เขียนฟังก์ชันแนะนำที่ตรวจคะแนนช่วง 0-100 และคืนข้อผิดพลาดเมื่อข้อมูลไม่ถูกต้อง พร้อมทดสอบค่าปกติและค่าขอบเขต",
        ["ปฏิเสธคะแนนต่ำกว่า 0 หรือเกิน 100", "ใช้ ValueError พร้อมข้อความชัดเจน", "ทดสอบ 68, -1 และ 101"], `def recommend(score, catalog):
    if not 0 <= score <= 100:
        raise ValueError("คะแนนต้องอยู่ระหว่าง 0 ถึง 100")
    return [name for name, minimum in catalog if score >= minimum]

catalog = [("Python", 0), ("Data", 60), ("AI", 75)]
for score in (68, -1, 101):
    try:
        print(score, recommend(score, catalog))
    except ValueError as error:
        print(error)`, "ตรวจข้อมูลตั้งแต่ขอบเขตฟังก์ชันทำให้ทั้ง command line และ GUI ใช้กติกาเดียวกัน")
    ])
];
