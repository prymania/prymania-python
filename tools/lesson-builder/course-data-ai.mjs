import { chapter, task, figure } from "./course-helpers.mjs";

const salesCsv = `date,branch,product,qty,price
2026-01-05,Bangkok,Coffee,30,55
2026-01-05,Chiang Mai,Coffee,18,50
2026-01-05,Bangkok,Tea,12,45
2026-01-06,Phuket,Coffee,22,60
2026-01-06,Chiang Mai,Tea,15,40
2026-01-06,Bangkok,Cake,8,85
2026-01-07,Phuket,Tea,10,50
2026-01-07,Bangkok,Coffee,35,55
2026-01-07,Chiang Mai,Cake,6,80
`;

const surveyCsv = `name,age,hours,score
Hobi,20,12,88
SUGA,,8,72
RM,21,15,
Jungkook,19,,45
Mark,22,10,81
`;

const plot = (name) => `assets/figures/${name}.png`;

// ส่วนที่ 3: ข้อมูลและ AI (บทที่ 14–18)
export const dataAi = [
  chapter("NumPy สำหรับการคำนวณตัวเลข", "ai",
    "คำนวณข้อมูลตัวเลขจำนวนมากพร้อมกันด้วย array ซึ่งเป็นพื้นฐานของ pandas, Matplotlib, scikit-learn และงาน AI ทั้งหมด",
    "สร้างและปรับรูปร่าง array เลือกข้อมูลด้วย index/slicing คำนวณทั้งชุดโดยไม่ต้องวนลูป ใช้ broadcasting กรองข้อมูลด้วยเงื่อนไข สรุปตามแถว/คอลัมน์ และนำไปแก้โจทย์จริงได้",
    [
      ["ทำไมต้อง NumPy",
        "NumPy (Numerical Python) คือแพ็กเกจสำหรับคำนวณตัวเลขจำนวนมาก หัวใจของมันคือ `ndarray` ที่เก็บตัวเลขชนิดเดียวกันเรียงติดกันในหน่วยความจำ จึงสั่งคำนวณทั้งชุดได้ในคำสั่งเดียว (เรียกว่า vectorization) และทำงานเร็วกว่าการวนลูปกับ list หลายสิบเท่า pandas, Matplotlib และ scikit-learn ที่จะเรียนต่อจากนี้ล้วนสร้างอยู่บน NumPy ติดตั้งด้วย `pip install numpy` แล้ว import ด้วยชื่อย่อ `np` ตามธรรมเนียม",
        {
          table: {
            head: ["เขียน", "list", "NumPy array"],
            rows: [
              ["`x * 2`", "`[1, 2, 1, 2]` (ทำซ้ำรายการ)", "`[2 4]` (คูณทุกค่า)"],
              ["`x + 10`", "TypeError", "`[11 12]`"],
              ["ชนิดข้อมูลในตัว", "ปนกันได้", "ชนิดเดียวทั้ง array"],
              ["ข้อมูลล้านค่า", "ช้า ต้องวนลูป", "เร็ว คำนวณทั้งชุด"]
            ]
          },
          code: `import numpy as np

prices = [120, 80, 45, 300]

# list: ต้องวนลูปเอง
with_vat = []
for p in prices:
    with_vat.append(round(p * 1.07, 2))
print(with_vat)

# NumPy: คำนวณทั้งชุดในบรรทัดเดียว
arr = np.array(prices)
print(np.round(arr * 1.07, 2))`,
          tip: "คิดแบบ NumPy คือ “สั่งทั้งชุด” แทน “วนทีละตัว” ถ้าเห็นตัวเองเขียน for กับ array ให้ลองหาคำสั่งที่ทำทั้งชุดได้ก่อน"
        }],
      ["สร้าง array",
        "สร้างจาก list ด้วย `np.array()` หรือใช้ฟังก์ชันสร้างอัตโนมัติ ทุกค่าใน array ต้องเป็นชนิดเดียวกัน (ดูได้จาก `dtype`) ถ้ามีทศนิยมแม้ค่าเดียว ทั้ง array จะเป็น float การสุ่มให้ใช้ `np.random.default_rng(seed)` ซึ่งใส่ seed แล้วจะได้ผลเดิมทุกครั้ง เหมาะกับการทดลองและตรวจงาน",
        {
          table: {
            head: ["คำสั่ง", "ได้"],
            rows: [
              ["`np.array([3, 1, 4])`", "จาก list"],
              ["`np.arange(0, 20, 5)`", "`[0 5 10 15]` เหมือน range"],
              ["`np.linspace(0, 1, 5)`", "`[0. 0.25 0.5 0.75 1.]` แบ่งช่วงเท่า ๆ กัน (รวมปลาย)"],
              ["`np.zeros(3)`, `np.ones(3)`, `np.full(3, 7)`", "เติมด้วย 0, 1 หรือค่าที่กำหนด"],
              ["`rng.integers(1, 7, size=10)`", "จำนวนเต็มสุ่ม 1–6 จำนวน 10 ค่า"],
              ["`rng.normal(65, 10, size=5)`", "ค่าสุ่มแบบกระจายปกติ เฉลี่ย 65 ส่วนเบี่ยงเบน 10"]
            ]
          },
          code: `import numpy as np

a = np.array([3, 1, 4, 1, 5])
print(a, a.dtype)
print(np.array([1.5, 2, 3]).dtype)      # มีทศนิยม ทั้งหมดจึงเป็น float
print(np.arange(0, 20, 5))
print(np.linspace(0, 1, 5))
print(np.full(4, 7))

rng = np.random.default_rng(42)         # seed เดิม = สุ่มได้ผลเดิม
print(rng.integers(1, 7, size=10))      # ทอยลูกเต๋า 10 ครั้ง`
        }],
      ["รูปร่าง: shape และ reshape",
        "array มีได้หลายมิติ `shape` บอกขนาดแต่ละมิติ (เช่น `(3, 4)` คือ 3 แถว 4 คอลัมน์) `ndim` บอกจำนวนมิติ และ `size` บอกจำนวนสมาชิกทั้งหมด `reshape()` จัดข้อมูลชุดเดิมเป็นรูปร่างใหม่ ใส่ `-1` ได้หนึ่งมิติเพื่อให้ NumPy คำนวณขนาดเอง และ `.T` สลับแถวกับคอลัมน์",
        {
          code: `import numpy as np

a = np.arange(1, 13)
print(a.shape, a.ndim, a.size)
m = a.reshape(3, 4)          # 3 แถว 4 คอลัมน์
print(m)
print(m.shape, m.ndim)
print(a.reshape(2, -1).shape)    # -1 = ให้ NumPy คำนวณเอง
print(m.T.shape)                  # สลับแถวกับคอลัมน์`,
          tip: "reshape ต้องมีจำนวนสมาชิกเท่าเดิม 12 ค่าจัดเป็น 3×4 หรือ 2×6 ได้ แต่ 5×3 ไม่ได้"
        }],
      ["เลือกข้อมูล: index และ slicing",
        "array 1 มิติใช้ index และ slicing เหมือน list ส่วน array 2 มิติเขียน `m[แถว, คอลัมน์]` ในวงเล็บเดียว ใช้ `:` แทน “ทั้งหมด” ในมิตินั้น และส่ง list ของ index เพื่อเลือกหลายตำแหน่งพร้อมกันได้",
        {
          figure: figure("numpy-slicing.svg", "m[1] เลือกทั้งแถว 1, m[:, 0] เลือกทั้งคอลัมน์ 0 และ m[1:, 2:] เลือกมุมขวาล่าง"),
          code: `import numpy as np

m = np.arange(1, 13).reshape(3, 4)
print(m[0, 2])          # แถว 0 คอลัมน์ 2
print(m[1])             # ทั้งแถว 1
print(m[:, 0])          # ทั้งคอลัมน์ 0
print(m[1:, 2:])        # มุมขวาล่าง
print(m[[0, 2], -1])    # แถว 0 กับ 2 คอลัมน์สุดท้าย`
        }],
      ["คำนวณทั้ง array และฟังก์ชันคณิตศาสตร์",
        "เครื่องหมาย `+ - * / ** // %` ทำงานกับทุกค่าทีละตำแหน่ง ทั้ง array กับตัวเลข และ array กับ array ที่ขนาดเท่ากัน นอกจากนี้ NumPy มีฟังก์ชันคณิตศาสตร์ (ufunc) ที่ทำกับทุกค่าพร้อมกัน",
        {
          table: {
            head: ["ฟังก์ชัน", "ทำอะไร"],
            rows: [
              ["`np.sqrt`, `np.abs`, `np.exp`, `np.log`", "รากที่สอง ค่าสัมบูรณ์ เลขชี้กำลัง ลอการิทึม"],
              ["`np.round(a, 2)`", "ปัดทศนิยม"],
              ["`np.maximum(a, b)`, `np.minimum(a, b)`", "เลือกค่ามาก/น้อยกว่าทีละตำแหน่ง"],
              ["`np.sin`, `np.cos`, `np.pi`", "ตรีโกณมิติ"]
            ]
          },
          code: `import numpy as np

price = np.array([100, 250, 80])
qty = np.array([2, 1, 5])
total = price * qty               # คูณคู่ตำแหน่งเดียวกัน
print(total, total.sum())
print(np.sqrt(np.array([4, 9, 16])))
print(np.round(np.array([2.456, 3.14159]), 1))
print(np.maximum(np.array([3, 8, 1]), 5))   # ค่าที่น้อยกว่า 5 กลายเป็น 5`
        }],
      ["broadcasting: คำนวณกับ array คนละขนาด",
        "เมื่อขนาดไม่เท่ากัน NumPy จะ “ยืด” array ที่เล็กกว่าให้เท่ากับอีกตัวโดยไม่ต้องคัดลอกจริง เช่น บวกคะแนนพิเศษรายวิชา (3 ค่า) ให้ทุกคนในตาราง 2×3 กติกาคือเทียบ shape จากขวาไปซ้าย แต่ละมิติต้องเท่ากัน หรือฝั่งใดฝั่งหนึ่งเป็น 1",
        {
          figure: figure("numpy-broadcast.svg", "scores (2,3) + bonus (3,) → NumPy ยืด bonus ให้ทุกแถวแล้วบวกทีละตำแหน่ง ได้ผล (2,3)"),
          code: `import numpy as np

scores = np.array([[70, 80, 65],
                   [55, 90, 72]])       # 2 คน × 3 วิชา
bonus = np.array([5, 0, 10])            # คะแนนพิเศษรายวิชา
print(scores + bonus)                   # bonus ถูกบวกให้ทุกแถว

weights = np.array([0.3, 0.3, 0.4])
print((scores * weights).sum(axis=1))   # คะแนนถ่วงน้ำหนักของแต่ละคน

per_person = np.array([2, -3]).reshape(-1, 1)   # (2, 1) = หนึ่งค่าต่อคน
print(scores + per_person)              # บวกตามแถวแทนตามคอลัมน์`,
          tip: "ถ้าต้องการให้ค่าหนึ่งชุดไปตามแถว (หนึ่งค่าต่อคน) ให้ `reshape(-1, 1)` ก่อน ไม่อย่างนั้น `(2, 3) + (2,)` จะเกิด ValueError: operands could not be broadcast"
        }],
      ["กรองข้อมูลด้วยเงื่อนไข",
        "เปรียบเทียบ array ได้ผลเป็น array ของ True/False ที่เรียกว่า mask นำ mask ไปใส่ในวงเล็บเหลี่ยมเพื่อดึงเฉพาะค่าที่ตรงเงื่อนไข หรือใช้แก้ค่าเฉพาะตำแหน่งนั้นก็ได้ หลายเงื่อนไขเชื่อมด้วย `&` (และ) `|` (หรือ) `~` (ไม่) และต้องใส่วงเล็บครอบแต่ละเงื่อนไข",
        {
          code: `import numpy as np

scores = np.array([45, 78, 92, 30, 66, 88])
passed = scores >= 50
print(passed)
print(scores[passed], passed.sum(), "คนผ่าน")
print(scores[(scores >= 60) & (scores < 90)])
print(np.where(scores >= 50, "ผ่าน", "ตก"))
print(np.clip(scores + 15, 0, 100))     # บวก 15 แต่ไม่ให้เกิน 100
scores[scores < 40] = 40                # แก้เฉพาะค่าที่ตรงเงื่อนไข
print(scores)`,
          tip: "`True` นับเป็น 1 จึงนับจำนวนที่ผ่านได้ด้วย `mask.sum()` และหาสัดส่วนได้ด้วย `mask.mean()`"
        }],
      ["สรุปตามแกน (axis)",
        "ฟังก์ชันสรุป เช่น `sum`, `mean`, `max` ถ้าไม่ระบุ axis จะสรุปทั้ง array เป็นค่าเดียว `axis=0` สรุปลงตามแนวตั้งได้ผลต่อคอลัมน์ `axis=1` สรุปตามแนวนอนได้ผลต่อแถว `argmax` บอกตำแหน่งของค่ามากสุด และ `cumsum` ให้ผลรวมสะสม",
        {
          figure: figure("numpy-axis.svg", "array 2 มิติ 3 แถว 4 คอลัมน์: axis=0 รวมลงแนวตั้งได้ผลต่อคอลัมน์ axis=1 รวมตามแนวนอนได้ผลต่อแถว"),
          code: `import numpy as np

sales = np.array([[10, 12, 9, 14],
                  [7, 8, 11, 6],
                  [15, 13, 12, 18]])
print(sales.sum())               # ทั้งตาราง
print(sales.sum(axis=0))         # ต่อคอลัมน์
print(sales.sum(axis=1))         # ต่อแถว
print(sales.argmax(axis=1))      # คอลัมน์ที่มากสุดของแต่ละแถว
print(sales[0].cumsum())         # ผลรวมสะสมของแถวแรก`,
          tip: "จำง่าย ๆ: axis คือมิติที่ถูก “ยุบหาย” ตาราง (3, 4) ยุบ axis=1 เหลือ (3,) คือหนึ่งค่าต่อแถว"
        }],
      ["สถิติ เรียงลำดับ และนับ",
        "NumPy มีฟังก์ชันสถิติพร้อมใช้ และ `argsort()` คืนตำแหน่ง (index) ที่เรียงจากน้อยไปมาก นำไปเปิดค่าอื่นที่ผูกกันอยู่ได้ เช่น เรียงชื่อตามคะแนน ส่วน `np.unique(..., return_counts=True)` นับว่าแต่ละค่ามีกี่ตัว",
        {
          table: {
            head: ["ฟังก์ชัน", "ได้"],
            rows: [
              ["`mean`, `median`, `std`", "ค่าเฉลี่ย มัธยฐาน ส่วนเบี่ยงเบนมาตรฐาน"],
              ["`np.percentile(a, 75)`", "ค่าที่ 75% ของข้อมูลต่ำกว่า"],
              ["`np.sort(a)`", "ค่าเรียงจากน้อยไปมาก"],
              ["`np.argsort(a)`", "index ที่ทำให้เรียงได้ (ใช้จัดอันดับ)"],
              ["`np.unique(a, return_counts=True)`", "ค่าที่ไม่ซ้ำ + จำนวนของแต่ละค่า"]
            ]
          },
          code: `import numpy as np

names = np.array(["Hobi", "SUGA", "RM", "Jungkook", "Mark", "JayB"])
scores = np.array([82, 67, 91, 75, 58, 75])

order = np.argsort(scores)[::-1]       # index เรียงจากมากไปน้อย
print(names[order])
print(scores[order])
print("มัธยฐาน", np.median(scores), "P75", np.percentile(scores, 75))

grades = np.array(["A", "C", "A", "B", "D", "B"])
values, counts = np.unique(grades, return_counts=True)
print(dict(zip(values.tolist(), counts.tolist())))`
        }],
      ["ข้อผิดพลาดที่พบบ่อย",
        "ความผิดพลาดกับ NumPy ส่วนใหญ่มาจากเรื่องขนาด ชนิดข้อมูล และการที่ slice ยังเชื่อมกับข้อมูลเดิม (เรียกว่า view) ถ้าแก้ค่าใน slice ข้อมูลต้นฉบับจะเปลี่ยนตาม ให้ใช้ `.copy()` เมื่อต้องการแยกออกมา",
        {
          table: {
            head: ["อาการ", "สาเหตุ", "แก้โดย"],
            rows: [
              ["`ValueError: operands could not be broadcast`", "shape ไม่เข้ากัน", "ตรวจ `.shape` แล้ว `reshape`"],
              ["`ValueError: The truth value of an array ... is ambiguous`", "ใช้ `and`/`or`/`if` กับ array", "ใช้ `&` `|` และ `.any()`/`.all()`"],
              ["ทศนิยมหายไป", "ใส่ทศนิยมลง array ชนิด int", "สร้างเป็น float ตั้งแต่แรก"],
              ["ข้อมูลเดิมเปลี่ยนเอง", "แก้ค่าใน slice (view)", "ใช้ `.copy()`"]
            ]
          },
          code: `import numpy as np

a = np.array([10, 20, 30, 40])
part = a[1:3]          # slice คือ view ของข้อมูลเดิม
part[0] = 99
print(a)               # a เปลี่ยนตามด้วย
safe = a[1:3].copy()   # copy() แยกออกจากของเดิม
safe[0] = 0
print(a)

b = np.array([1, 2, 3])
b[0] = 2.9             # array ชนิด int จึงถูกตัดเหลือ 2
print(b, b.dtype)`
        }],
      ["NumPy ในงานจริง",
        "ข้อมูลแทบทุกชนิดในคอมพิวเตอร์เก็บเป็นตัวเลขหลายมิติได้ จึงใช้ NumPy ได้กว้างมาก ตัวอย่างนี้สร้างภาพขาวดำ 8×8 จาก array (0 = ดำ, 255 = ขาว) แล้วกลับสีด้วยการลบเพียงครั้งเดียว ซึ่งเป็นหลักเดียวกับโปรแกรมแต่งภาพ",
        {
          table: {
            head: ["งาน", "ข้อมูลในรูป array"],
            rows: [
              ["ตารางข้อมูล (pandas)", "แต่ละคอลัมน์คือ array 1 มิติ"],
              ["ภาพถ่าย", "array (สูง, กว้าง, 3) ค่าสี RGB 0–255"],
              ["เสียง", "array 1 มิติของความดังในแต่ละช่วงเวลา"],
              ["Machine Learning", "X เป็น array (ตัวอย่าง, feature)"],
              ["จำลองสถานการณ์", "สุ่มค่าจำนวนมากด้วย `rng` แล้วสรุปผล"]
            ]
          },
          plot: "assets/figures/ch14-image.png",
          code: `import numpy as np
import matplotlib.pyplot as plt

img = np.zeros((8, 8), dtype=int)   # ภาพดำทั้งภาพ
img[2:6, 2:6] = 255                 # สี่เหลี่ยมสีขาวตรงกลาง
img[3:5, 3:5] = 120                 # จุดสีเทาด้านใน
print(img.shape, img.min(), img.max())

fig, (left, right) = plt.subplots(1, 2, figsize=(6, 3))
left.imshow(img, cmap="gray", vmin=0, vmax=255)
left.set_title("img")
right.imshow(255 - img, cmap="gray", vmin=0, vmax=255)
right.set_title("255 - img")
for ax in (left, right):
    ax.set_xticks([])        # ซ่อนตัวเลขแกน แต่คงกรอบภาพไว้
    ax.set_yticks([])
plt.show()`
        }]
    ],
    [
      {
        title: "วิเคราะห์คะแนนทั้งห้อง",
        idea: "คะแนน 3 ครั้งของนักเรียน 6 คน → คะแนนถ่วงน้ำหนัก → ตัดเกรด → จัดอันดับ โดยไม่ใช้ลูปในการคำนวณเลย",
        code: `import numpy as np

names = np.array(["Hobi", "SUGA", "RM", "Jungkook", "Mark", "JayB"])
scores = np.array([[78, 85, 90],
                   [62, 70, 58],
                   [95, 88, 92],
                   [45, 52, 60],
                   [88, 79, 84],
                   [70, 65, 73]])
weights = np.array([0.3, 0.3, 0.4])

final = (scores * weights).sum(axis=1)
grades = np.select([final >= 80, final >= 70, final >= 60, final >= 50],
                   ["A", "B", "C", "D"], default="F")
order = np.argsort(final)[::-1]

print(f"เฉลี่ยทั้งห้อง {final.mean():.2f}  ส่วนเบี่ยงเบน {final.std():.2f}")
print("เฉลี่ยรายครั้ง:", scores.mean(axis=0).round(1))
print("ครั้งที่ยากที่สุด: ครั้งที่", scores.mean(axis=0).argmin() + 1)
for rank, i in enumerate(order, start=1):
    print(f"{rank}. {names[i]:<9}{final[i]:6.1f}  {grades[i]}")`,
        steps: [
          "`scores * weights` ใช้ broadcasting คูณน้ำหนักให้ทุกแถว แล้ว `sum(axis=1)` รวมเป็นหนึ่งค่าต่อคน",
          "`np.select` คือ if/elif หลายชั้นแบบทำทั้ง array: เลือกค่าตามเงื่อนไขแรกที่เป็นจริง",
          "`argsort()[::-1]` ได้ลำดับ index จากคะแนนมากไปน้อย ใช้เปิดทั้งชื่อ คะแนน และเกรดที่ตำแหน่งเดียวกัน",
          "ลูป for ที่เหลือใช้แค่จัดรูปแบบการแสดงผล ไม่ได้ใช้คำนวณ"
        ]
      },
      {
        title: "ยอดขายรายสาขาและอัตราการเติบโต",
        idea: "ตารางสาขา × เดือน: หายอดรายเดือน การเติบโตเทียบเดือนก่อน สัดส่วนของแต่ละสาขา และจุดที่ขายดีที่สุด",
        code: `import numpy as np

branches = np.array(["Bangkok", "Chiang Mai", "Phuket"])
months = np.array(["Jan", "Feb", "Mar", "Apr"])
sales = np.array([[120, 135, 98, 150],
                  [80, 92, 101, 88],
                  [60, 75, 70, 95]])        # หน่วย: พันบาท

monthly = sales.sum(axis=0)
growth = np.diff(monthly) / monthly[:-1] * 100
share = sales.sum(axis=1) / sales.sum() * 100

print("ยอดรวมรายเดือน:", monthly)
for month, g in zip(months[1:], growth):
    print(f"  {month}: {g:+.1f}% จากเดือนก่อน")
for name, s in zip(branches, share):
    print(f"  {name:<11}{s:5.1f}% ของยอดทั้งหมด")
row, col = np.unravel_index(sales.argmax(), sales.shape)
print(f"สูงสุด {sales.max()} พันบาท: {branches[row]} เดือน {months[col]}")`,
        steps: [
          "`np.diff` หาผลต่างของค่าที่อยู่ติดกัน หารด้วยเดือนก่อนหน้า (`monthly[:-1]`) ได้อัตราการเติบโต",
          "`:+.1f` แสดงเครื่องหมาย + หรือ − ทุกครั้ง อ่านทิศทางได้ทันที",
          "`argmax()` ของตาราง 2 มิติให้ตำแหน่งแบบนับเรียง `np.unravel_index` แปลงกลับเป็น (แถว, คอลัมน์)"
        ]
      },
      {
        title: "ข้อมูลเซ็นเซอร์: ทำให้เรียบและหาค่าผิดปกติ",
        idea: "อุณหภูมิ 48 ชั่วโมงที่มีสัญญาณรบกวน หาค่าเฉลี่ยเคลื่อนที่ แล้วตรวจจุดที่ห่างจากแนวโน้มมากผิดปกติ",
        plot: "assets/figures/ch14-sensor.png",
        code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(7)
hours = np.arange(48)
temp = 30 + 3 * np.sin(hours / 24 * 2 * np.pi) + rng.normal(0, 0.4, 48)
temp[[15, 33]] += [4, -5]                  # จำลองค่าผิดปกติจากเซ็นเซอร์

smooth = np.convolve(temp, np.ones(5) / 5, mode="same")
residual = temp - smooth
outliers = np.abs(residual) > 2.5 * residual[2:-2].std()
outliers[[0, 1, -2, -1]] = False           # ขอบข้อมูลเฉลี่ยได้ไม่ครบ 5 ค่า
print("ชั่วโมงที่ผิดปกติ:", hours[outliers])
print(f"เฉลี่ย {temp.mean():.2f} °C  สูงสุด {temp.max():.2f} °C")

plt.figure(figsize=(8, 3.2))
plt.plot(hours, temp, alpha=0.6, label="sensor")
plt.plot(hours[2:-2], smooth[2:-2], label="moving average (5 h)")
plt.scatter(hours[outliers], temp[outliers], color="red", zorder=3, label="outlier")
plt.xlabel("hour")
plt.ylabel("°C")
plt.legend()
plt.show()`,
        steps: [
          "`np.convolve(temp, np.ones(5) / 5, mode=\"same\")` คือค่าเฉลี่ยของ 5 ชั่วโมงรอบ ๆ แต่ละจุด ทำให้เส้นเรียบขึ้น",
          "`residual` คือระยะห่างจากแนวโน้ม จุดที่ห่างเกิน 2.5 เท่าของส่วนเบี่ยงเบนมาตรฐานถือว่าผิดปกติ",
          "2 ค่าแรกและ 2 ค่าท้ายมีข้อมูลรอบ ๆ ไม่ครบ 5 ค่า (`mode=\"same\"` เติม 0 ให้) ค่าเฉลี่ยตรงขอบจึงต่ำผิดปกติ ทั้งการตรวจและการวาดจึงใช้เฉพาะ `[2:-2]`", "ทั้งหมดเป็นการคำนวณทั้ง array ใช้ได้เหมือนเดิมแม้ข้อมูลมีเป็นล้านจุด"
        ]
      },
      {
        title: "จำลองทอยลูกเต๋า 100,000 ครั้ง",
        idea: "ใช้การสุ่มจำนวนมากประมาณความน่าจะเป็น (Monte Carlo) แล้วเทียบกับทฤษฎี",
        plot: "assets/figures/ch14-dice.png",
        code: `import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(2024)
rolls = rng.integers(1, 7, size=(100_000, 2))    # 100,000 แถว × ลูกเต๋า 2 ลูก
sums = rolls.sum(axis=1)
counts = np.bincount(sums, minlength=13)[2:]     # นับผลรวม 2 ถึง 12
prob = counts / counts.sum()

print(f"โอกาสได้ 7  ≈ {prob[5]:.3f} (ทฤษฎี 6/36 = {6 / 36:.3f})")
print(f"โอกาสได้ 10 ขึ้นไป ≈ {(sums >= 10).mean():.3f} (ทฤษฎี 6/36 = {6 / 36:.3f})")
print(f"โอกาสได้ดับเบิล ≈ {(rolls[:, 0] == rolls[:, 1]).mean():.3f}")

plt.bar(np.arange(2, 13), prob, color="#3776ab")
plt.xticks(range(2, 13))
plt.xlabel("sum of two dice")
plt.ylabel("probability")
plt.show()`,
        steps: [
          "สร้างผลทอยทั้งหมดในคำสั่งเดียวเป็นตาราง (100000, 2) ไม่ต้องวนลูปแสนรอบ",
          "`np.bincount` นับว่าแต่ละผลรวมเกิดกี่ครั้ง แล้วหารด้วยจำนวนทั้งหมดได้ความน่าจะเป็น",
          "`(เงื่อนไข).mean()` คือสัดส่วนของ True ใช้ประมาณความน่าจะเป็นของเหตุการณ์ใดก็ได้"
        ]
      },
      {
        title: "หาร้านที่ใกล้ลูกค้าที่สุด",
        idea: "คำนวณระยะทางจากลูกค้าทุกคนไปทุกร้านพร้อมกันด้วย broadcasting 3 มิติ",
        code: `import numpy as np

shops = np.array([[2.0, 3.0], [8.0, 1.0], [5.0, 7.0], [1.0, 9.0]])   # พิกัด (x, y) กม.
shop_names = np.array(["A", "B", "C", "D"])
customers = np.array([[1.0, 1.0], [6.0, 6.0], [9.0, 2.0]])

diff = customers[:, np.newaxis, :] - shops[np.newaxis, :, :]   # (3,1,2) - (1,4,2) → (3,4,2)
dist = np.sqrt((diff ** 2).sum(axis=2))                         # (3, 4): ลูกค้า × ร้าน
print(dist.round(2))

nearest = dist.argmin(axis=1)
for k, i in enumerate(nearest):
    print(f"ลูกค้า {k + 1} {customers[k]} → ร้าน {shop_names[i]} ({dist[k, i]:.2f} กม.)")`,
        steps: [
          "`np.newaxis` เพิ่มมิติขนาด 1 ทำให้ลูกค้า (3,1,2) กับร้าน (1,4,2) ยืดเป็น (3,4,2) ได้ทุกคู่ลูกค้า–ร้าน",
          "ระยะทาง = √(Δx² + Δy²) คำนวณทุกคู่พร้อมกัน ได้ตาราง 3 × 4",
          "`argmin(axis=1)` เลือกร้านที่ระยะน้อยสุดของแต่ละลูกค้า แนวคิดเดียวกันนี้ใช้ใน KNN ของบทที่ 17"
        ]
      }
    ],
    [
      task("แปลงสกุลเงิน", 1, {
        task: "ราคาสินค้าเป็นดอลลาร์ `[12.5, 40, 7.99, 120]` ให้แปลงเป็นบาท (1 USD = 35.5 บาท) ปัดทศนิยม 2 ตำแหน่ง",
        given: "array ราคา USD และอัตราแลกเปลี่ยน",
        want: "array ราคาเป็นบาท",
        checklist: ["สร้าง `np.array`", "คูณด้วย 35.5 ทั้ง array", "`np.round(..., 2)`"],
        code: `import numpy as np

usd = np.array([12.5, 40, 7.99, 120])
thb = np.round(usd * 35.5, 2)
print(thb)`,
        explain: "คูณครั้งเดียวได้ทุกค่า ไม่ต้องเขียนลูปเหมือน list"
      }),
      task("สถิติอุณหภูมิ", 1, {
        task: "อุณหภูมิ 7 วัน `[31, 33, 29, 35, 34, 30, 32]` ให้หาค่าเฉลี่ย ค่าสูงสุด วันที่ร้อนที่สุด (วันที่ 1–7) และจำนวนวันที่สูงกว่าค่าเฉลี่ย",
        given: "array อุณหภูมิ 7 ค่า",
        want: "`เฉลี่ย 32.0 สูงสุด 35 (วันที่ 4)` และ `สูงกว่าค่าเฉลี่ย 3 วัน`",
        checklist: ["`mean()`, `max()`", "`argmax()` ได้ index เริ่ม 0 ต้อง +1 เป็นวันที่", "`(temps > temps.mean()).sum()` นับวัน"],
        code: `import numpy as np

temps = np.array([31, 33, 29, 35, 34, 30, 32])
print(f"เฉลี่ย {temps.mean():.1f} สูงสุด {temps.max()} (วันที่ {temps.argmax() + 1})")
print(f"สูงกว่าค่าเฉลี่ย {(temps > temps.mean()).sum()} วัน")`,
        explain: "`argmax` บอกตำแหน่ง ไม่ใช่ค่า และผลเปรียบเทียบเป็น True/False ที่นำมา `sum()` นับได้ทันที"
      }),
      task("สำรวจตารางข้อมูล", 1, {
        task: "สร้างตัวเลข 1–24 แล้วจัดเป็นตาราง 4 แถว 6 คอลัมน์ จากนั้นแสดง shape, แถวที่ 3 (index 2), คอลัมน์สุดท้าย และผลรวมของ 2 แถวแรก",
        given: "ตัวเลข 1 ถึง 24",
        want: "`(4, 6)`, `[13 14 15 16 17 18]`, `[ 6 12 18 24]` และ `78`",
        checklist: ["`np.arange(1, 25).reshape(4, 6)`", "แถวใช้ `t[2]` คอลัมน์ใช้ `t[:, -1]`", "2 แถวแรกคือ `t[:2]` แล้ว `.sum()`"],
        code: `import numpy as np

t = np.arange(1, 25).reshape(4, 6)
print(t.shape)
print(t[2])
print(t[:, -1])
print(t[:2].sum())`,
        explain: "`t[2]` ได้ทั้งแถว ส่วนคอลัมน์ต้องใช้ `t[:, ...]` คือ “ทุกแถว ที่คอลัมน์นี้” และ slicing `t[:2]` ใช้กับแถวได้เหมือน list"
      }),
      task("คัดสินค้าราคาไม่เกินงบ", 2, {
        task: "ราคาสินค้า `[250, 1200, 89, 560, 3200, 45]` งบ 600 บาท ให้แสดงสินค้าที่ซื้อได้ จำนวน และราคารวมถ้าซื้อทุกชิ้นที่ซื้อได้",
        given: "array ราคาและงบ 600",
        want: "ราคาที่ ≤ 600, `4 ชิ้น รวม 944 บาท`",
        checklist: ["สร้าง mask `prices <= 600`", "`prices[mask]` เลือกค่า", "`.size` และ `.sum()`"],
        code: `import numpy as np

prices = np.array([250, 1200, 89, 560, 3200, 45])
affordable = prices[prices <= 600]
print(affordable)
print(f"{affordable.size} ชิ้น รวม {affordable.sum()} บาท")`,
        explain: "mask เป็น array ของ True/False ขนาดเท่าข้อมูล ใช้ในวงเล็บเหลี่ยมเพื่อดึงเฉพาะตำแหน่งที่เป็น True"
      }),
      task("ตัดเกรดด้วย np.select", 2, {
        task: "คะแนน `[85, 62, 74, 48, 91, 55]` ของ Hobi, SUGA, RM, Jungkook, Mark, JayB ให้ตัดเกรด ≥ 80 = A, ≥ 70 = B, ≥ 60 = C, ≥ 50 = D, ที่เหลือ = F แล้วแสดงชื่อคู่กับเกรด",
        given: "array ชื่อและคะแนน 6 คน",
        want: "`Hobi: A`, `SUGA: C`, `RM: B`, `Jungkook: F`, `Mark: A`, `JayB: D`",
        checklist: ["`np.select(รายการเงื่อนไข, รายการค่า, default=\"F\")`", "เรียงเงื่อนไขจากมากไปน้อยเหมือน elif", "ใช้ `zip` แสดงคู่ชื่อ–เกรด"],
        code: `import numpy as np

names = np.array(["Hobi", "SUGA", "RM", "Jungkook", "Mark", "JayB"])
scores = np.array([85, 62, 74, 48, 91, 55])
grades = np.select([scores >= 80, scores >= 70, scores >= 60, scores >= 50],
                   ["A", "B", "C", "D"], default="F")
for name, grade in zip(names, grades):
    print(f"{name}: {grade}")`,
        explain: "`np.select` เลือกค่าจากเงื่อนไขแรกที่เป็นจริงของแต่ละตำแหน่ง เหมือน if/elif แต่ทำกับทั้ง array และอ่านง่ายกว่า `np.where` ซ้อนหลายชั้น"
      }),
      task("ค่าไฟฟ้าแบบขั้นบันได", 2, {
        task: "บ้าน 4 หลังใช้ไฟ `[90, 150, 230, 410]` หน่วย คิดค่าไฟ: 150 หน่วยแรกหน่วยละ 3.25 บาท ส่วนที่เกิน 150 หน่วยละ 4.22 บาท คำนวณค่าไฟทุกหลังโดยไม่ใช้ if หรือลูป",
        given: "หน่วยไฟของ 4 หลังและอัตราค่าไฟ 2 ขั้น",
        want: "ค่าไฟ 292.5, 487.5, 825.1 และ 1584.7 บาท",
        checklist: ["ส่วนขั้นแรก = `np.minimum(units, 150)`", "ส่วนที่เกิน = `np.maximum(units - 150, 0)`", "คูณอัตราแต่ละขั้นแล้วบวกกัน"],
        code: `import numpy as np

units = np.array([90, 150, 230, 410])
first = np.minimum(units, 150)
extra = np.maximum(units - 150, 0)
bill = first * 3.25 + extra * 4.22
print(np.round(bill, 2))`,
        explain: "`minimum` และ `maximum` แทน if ได้: บ้านที่ใช้ไม่ถึง 150 หน่วย ส่วนเกินจะเป็น 0 อัตโนมัติ แนวคิดนี้ใช้คิดภาษีหรือค่าส่งแบบขั้นบันไดได้เหมือนกัน"
      }),
      task("ตารางสูตรคูณด้วย broadcasting", 2, {
        task: "สร้างตารางสูตรคูณแม่ 1–9 ขนาด 9×9 ในบรรทัดเดียวด้วย broadcasting แล้วแสดงแถวของแม่ 7 และผลของ 7 × 8",
        given: "ตัวเลข 1 ถึง 9",
        want: "`(9, 9)`, `[ 7 14 21 28 35 42 49 56 63]` และ `56`",
        checklist: ["`n = np.arange(1, 10)`", "`n.reshape(-1, 1) * n` ได้ (9, 1) × (9,) → (9, 9)", "แม่ 7 อยู่แถว index 6"],
        code: `import numpy as np

n = np.arange(1, 10)
table = n.reshape(-1, 1) * n
print(table.shape)
print(table[6])
print(table[6, 7])`,
        explain: "คอลัมน์ (9, 1) คูณกับแถว (9,) ถูกยืดเป็น 9 × 9 ทุกคู่ เป็นรูปแบบเดียวกับการหาระยะทางทุกคู่ในตัวอย่างร้านใกล้ที่สุด"
      }),
      task("คะแนนรายวิชา", 3, {
        task: "ตารางคะแนนนักเรียน 3 คน × 4 วิชา ให้หาค่าเฉลี่ยของแต่ละคน ค่าเฉลี่ยของแต่ละวิชา และวิชาที่ยากที่สุด (เฉลี่ยต่ำสุด)",
        given: "`[[80, 72, 90, 65], [70, 68, 85, 60], [90, 75, 95, 70]]` และวิชา Math, Sci, Eng, Thai",
        want: "เฉลี่ยรายคน, เฉลี่ยรายวิชา และ `วิชาที่ยากสุด: Thai`",
        checklist: ["รายคน = เฉลี่ยตามแถว `axis=1`", "รายวิชา = เฉลี่ยตามคอลัมน์ `axis=0`", "`argmin()` หาวิชาเฉลี่ยต่ำสุด"],
        code: `import numpy as np

subjects = np.array(["Math", "Sci", "Eng", "Thai"])
scores = np.array([[80, 72, 90, 65],
                   [70, 68, 85, 60],
                   [90, 75, 95, 70]])
print("รายคน:", scores.mean(axis=1).round(2))
by_subject = scores.mean(axis=0).round(2)
print("รายวิชา:", by_subject)
print("วิชาที่ยากสุด:", subjects[by_subject.argmin()])`,
        explain: "จำง่าย ๆ: `axis` คือแกนที่ถูกยุบหายไป `axis=1` ยุบคอลัมน์ทิ้งเหลือค่าต่อแถว"
      }),
      task("ปรับสเกลข้อมูลทุกคอลัมน์", 3, {
        task: "ข้อมูลคน 5 คน 3 feature (ส่วนสูง ซม., น้ำหนัก กก., อายุ ปี) ให้ปรับทุกคอลัมน์เป็นช่วง 0–1 ด้วยสูตร (x − min) / (max − min) ของคอลัมน์นั้น ซึ่งเป็นขั้นเตรียมข้อมูลก่อนใช้ ML",
        given: "`[[150, 45, 19], [165, 60, 22], [172, 68, 20], [180, 75, 25], [158, 52, 21]]`",
        want: "ตาราง 5 × 3 ทุกคอลัมน์มีค่าต่ำสุด 0 และสูงสุด 1",
        checklist: ["`X.min(axis=0)` และ `X.max(axis=0)` ได้ค่าของแต่ละคอลัมน์ (3 ค่า)", "broadcasting ลบและหารให้ทุกแถวในบรรทัดเดียว", "ตรวจด้วย `.min(axis=0)` และ `.max(axis=0)` ของผลลัพธ์"],
        code: `import numpy as np

X = np.array([[150, 45, 19],
              [165, 60, 22],
              [172, 68, 20],
              [180, 75, 25],
              [158, 52, 21]], dtype=float)
low, high = X.min(axis=0), X.max(axis=0)
scaled = (X - low) / (high - low)
print(scaled.round(2))
print(scaled.min(axis=0), scaled.max(axis=0))`,
        explain: "แต่ละ feature มีหน่วยและช่วงต่างกันมาก การปรับให้อยู่ช่วงเดียวกันช่วยให้โมเดลอย่าง KNN ไม่ถูก feature ที่ตัวเลขใหญ่ครอบงำ (บทที่ 17 ทำแบบเดียวกันด้วย StandardScaler)"
      }),
      task("ระยะทางรวมของเส้นทาง", 3, {
        task: "เส้นทางวิ่งผ่านจุด (x, y) เป็นกิโลเมตร `[[0, 0], [3, 4], [6, 8], [6, 12], [9, 16]]` ให้หาระยะของแต่ละช่วง ระยะรวม และช่วงที่ยาวที่สุด",
        given: "พิกัด 5 จุดตามลำดับ",
        want: "`[5. 5. 4. 5.]`, `รวม 19.0 กม.` และ `ช่วงที่ยาวสุด: ช่วงที่ 1`",
        checklist: ["`np.diff(points, axis=0)` ได้ Δx, Δy ของแต่ละช่วง (4 แถว)", "ระยะแต่ละช่วง = `np.sqrt((d ** 2).sum(axis=1))`", "`argmax()` + 1 ได้หมายเลขช่วง"],
        code: `import numpy as np

points = np.array([[0, 0], [3, 4], [6, 8], [6, 12], [9, 16]])
steps = np.diff(points, axis=0)
lengths = np.sqrt((steps ** 2).sum(axis=1))
print(lengths)
print(f"รวม {lengths.sum():.1f} กม.")
print(f"ช่วงที่ยาวสุด: ช่วงที่ {lengths.argmax() + 1}")`,
        explain: "`np.diff` ตามแกน 0 ลบแถวถัดไปด้วยแถวก่อนหน้า ได้การเปลี่ยนแปลงของแต่ละช่วง ถ้ามีหลายช่วงยาวเท่ากัน `argmax` จะคืนช่วงแรกที่เจอ"
      }),
      task("ค่าเฉลี่ยเคลื่อนที่ของยอดขาย", 3, {
        task: "ยอดขาย 10 วัน `[20, 22, 19, 25, 30, 24, 35, 28, 40, 33]` ให้หาค่าเฉลี่ยเคลื่อนที่ 3 วัน และหาว่าวันไหนบ้าง (วันที่ 4 เป็นต้นไป) ที่ขายได้มากกว่าค่าเฉลี่ยของ 3 วันก่อนหน้า",
        given: "array ยอดขาย 10 วัน",
        want: "ค่าเฉลี่ยเคลื่อนที่ 8 ค่า และวันที่ `[4 5 7 9]`",
        checklist: ["`np.convolve(sales, np.ones(3) / 3, mode=\"valid\")` ได้ค่าเฉลี่ยของทุกช่วง 3 วัน", "ค่าเฉลี่ยของ 3 วันก่อนวันที่ i คือ `ma[i - 3]` จึงเทียบ `sales[3:]` กับ `ma[:-1]`", "แปลง index เป็นวันที่ด้วย +4"],
        code: `import numpy as np

sales = np.array([20, 22, 19, 25, 30, 24, 35, 28, 40, 33])
ma = np.convolve(sales, np.ones(3) / 3, mode="valid")
print(ma.round(1))
above = sales[3:] > ma[:-1]
print("วันที่ขายเกินค่าเฉลี่ย 3 วันก่อนหน้า:", np.flatnonzero(above) + 4)`,
        explain: "`mode=\"valid\"` คืนเฉพาะช่วงที่มีข้อมูลครบ 3 วัน จึงได้ 8 ค่าจาก 10 วัน การจับตำแหน่งให้ตรงกัน (`sales[3:]` คู่กับ `ma[:-1]`) คือจุดที่ต้องคิดให้ดีในโจทย์ข้อมูลตามเวลา"
      }),
      task("ประมาณความน่าจะเป็นด้วยการสุ่ม", 3, {
        task: "ทอยลูกเต๋า 4 ลูกพร้อมกัน โอกาสที่จะมีเลข 6 อย่างน้อย 1 ลูกเป็นเท่าไร ให้จำลอง 200,000 ครั้งด้วย `default_rng(1)` แล้วเทียบกับทฤษฎี 1 − (5/6)⁴",
        given: "ลูกเต๋า 4 ลูก จำลอง 200,000 ครั้ง",
        want: "ค่าจากการจำลองใกล้ 0.518",
        checklist: ["`rng.integers(1, 7, size=(200_000, 4))`", "`(rolls == 6).any(axis=1)` ได้ True เมื่อแถวนั้นมี 6 อย่างน้อยหนึ่งลูก", "`.mean()` คือความน่าจะเป็นโดยประมาณ"],
        code: `import numpy as np

rng = np.random.default_rng(1)
rolls = rng.integers(1, 7, size=(200_000, 4))
has_six = (rolls == 6).any(axis=1)
print(f"จำลอง  {has_six.mean():.4f}")
print(f"ทฤษฎี {1 - (5 / 6) ** 4:.4f}")`,
        explain: "`any(axis=1)` ตรวจทีละแถวว่ามี True อย่างน้อยหนึ่งค่าหรือไม่ การจำลองจำนวนมากให้คำตอบใกล้ทฤษฎี และใช้ได้แม้กับปัญหาที่คำนวณด้วยสูตรยาก"
      })
    ]),

  chapter("จัดการตารางข้อมูลด้วย pandas", "ai",
    "อ่าน สำรวจ กรอง ทำความสะอาด และสรุปข้อมูลตารางด้วย pandas DataFrame",
    "อ่านไฟล์ CSV เป็น DataFrame เลือกและกรองข้อมูล เพิ่มคอลัมน์ จัดการค่าว่าง และสรุปด้วย groupby",
    [
      ["DataFrame: ตารางข้อมูล",
        "DataFrame คือตารางที่มีแถวและคอลัมน์เหมือน Excel แต่ละคอลัมน์คือ Series สร้างจาก dict ได้ โดย key เป็นชื่อคอลัมน์",
        {
          code: `import pandas as pd

df = pd.DataFrame({
    "name": ["Hobi", "SUGA", "RM"],
    "score": [88, 72, 95],
})
print(df)
print(df.shape)`,
          tip: "ตัวเลขด้านซ้ายสุด (0, 1, 2) คือ index ของแถว"
        }],
      ["อ่าน CSV และสำรวจข้อมูล",
        "`pd.read_csv()` อ่านไฟล์เป็น DataFrame ในบรรทัดเดียว แล้วใช้คำสั่งสำรวจข้อมูลก่อนวิเคราะห์ทุกครั้ง",
        {
          files: { "sales.csv": salesCsv },
          table: {
            head: ["คำสั่ง", "ดูอะไร"],
            rows: [
              ["`df.head()`", "5 แถวแรก"],
              ["`df.shape`", "(จำนวนแถว, จำนวนคอลัมน์)"],
              ["`df.columns`", "ชื่อคอลัมน์"],
              ["`df.info()`", "ชนิดข้อมูลและจำนวนค่าที่ไม่ว่าง"],
              ["`df.describe()`", "สถิติของคอลัมน์ตัวเลข"]
            ]
          },
          code: `import pandas as pd

df = pd.read_csv("sales.csv")
print(df.head(3))
print(df.shape)
print(df["qty"].describe()[["mean", "min", "max"]])`
        }],
      ["เลือกและกรองข้อมูล",
        "เลือกคอลัมน์ด้วยชื่อ กรองแถวด้วยเงื่อนไขในวงเล็บเหลี่ยม ถ้ามีหลายเงื่อนไขใช้ `&` (และ) `|` (หรือ) และต้องใส่วงเล็บครอบแต่ละเงื่อนไข",
        {
          files: { "sales.csv": salesCsv },
          table: {
            head: ["เขียน", "ได้"],
            rows: [
              ["`df[\"qty\"]`", "คอลัมน์เดียว (Series)"],
              ["`df[[\"branch\", \"qty\"]]`", "หลายคอลัมน์ (DataFrame)"],
              ["`df[df[\"qty\"] > 20]`", "แถวที่ qty มากกว่า 20"],
              ["`df[(df[\"branch\"] == \"Bangkok\") & (df[\"qty\"] > 20)]`", "สองเงื่อนไขพร้อมกัน"]
            ]
          },
          code: `import pandas as pd

df = pd.read_csv("sales.csv")
coffee = df[df["product"] == "Coffee"]
print(coffee[["date", "branch", "qty"]])`
        }],
      ["เพิ่มคอลัมน์และเรียงข้อมูล",
        "คำนวณคอลัมน์ใหม่จากคอลัมน์เดิมได้ทั้งคอลัมน์ในบรรทัดเดียว และเรียงด้วย `sort_values()`",
        {
          files: { "sales.csv": salesCsv },
          code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["qty"] * df["price"]
top = df.sort_values("revenue", ascending=False).head(3)
print(top[["branch", "product", "revenue"]])`
        }],
      ["จัดการค่าว่าง",
        "ข้อมูลจริงมักมีช่องว่าง pandas แสดงเป็น `NaN` ตรวจด้วย `isna().sum()` แล้วเลือกจะเติมค่า (`fillna`) หรือลบแถวทิ้ง (`dropna`)",
        {
          files: { "survey.csv": surveyCsv },
          code: `import pandas as pd

df = pd.read_csv("survey.csv")
print(df.isna().sum())
df["age"] = df["age"].fillna(df["age"].mean())
clean = df.dropna(subset=["score"])
print(clean)`,
          tip: "ก่อนลบแถวให้ดูว่าหายไปกี่แถว ถ้าหายเยอะเกินไปการเติมค่าอาจดีกว่า"
        }],
      ["สรุปตามกลุ่มด้วย groupby",
        "`groupby(\"คอลัมน์\")` แบ่งข้อมูลเป็นกลุ่มตามค่าในคอลัมน์ แล้วสรุปแต่ละกลุ่มด้วย `sum`, `mean`, `count` หรือหลายอย่างพร้อมกันด้วย `agg`",
        {
          files: { "sales.csv": salesCsv },
          code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["qty"] * df["price"]
print(df.groupby("branch")["revenue"].sum())
print(df.groupby("product")["qty"].agg(["sum", "mean"]))`
        }]
    ],
    [
      {
        title: "รายงานยอดขาย",
        idea: "อ่านไฟล์ → เพิ่มคอลัมน์รายได้ → สรุปตามสาขาและสินค้า → หาสาขาที่ดีที่สุด",
        files: { "sales.csv": salesCsv },
        code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["qty"] * df["price"]

by_branch = df.groupby("branch")["revenue"].sum().sort_values(ascending=False)
print(by_branch)
print()
print(df.pivot_table(index="branch", columns="product",
                     values="qty", aggfunc="sum", fill_value=0))
print()
print(f"รายได้รวม {df['revenue'].sum():,} บาท")
print(f"สาขาที่ดีที่สุด: {by_branch.index[0]}")`,
        steps: [
          "`groupby` แล้ว `sort_values` ได้สาขาเรียงจากรายได้มากไปน้อย",
          "`pivot_table` ทำตารางไขว้ สาขา × สินค้า เหมือน Pivot ใน Excel",
          "`by_branch.index[0]` คือชื่อสาขาแถวแรกหลังเรียงแล้ว"
        ]
      },
      {
        title: "ทำความสะอาดข้อมูลแบบสอบถาม",
        idea: "ตรวจค่าว่าง เติมค่าที่เหมาะสม ลบแถวที่ใช้ไม่ได้ แล้วจึงวิเคราะห์",
        files: { "survey.csv": surveyCsv },
        code: `import pandas as pd

df = pd.read_csv("survey.csv")
print("ค่าว่างก่อนทำความสะอาด:")
print(df.isna().sum())

df["age"] = df["age"].fillna(df["age"].median())
df["hours"] = df["hours"].fillna(0)
df = df.dropna(subset=["score"])

print()
print(df)
print(f"ชั่วโมงอ่านหนังสือเฉลี่ย {df['hours'].mean():.1f}")`,
        steps: [
          "อายุที่ว่างเติมด้วยค่ามัธยฐาน ซึ่งไม่ถูกดึงด้วยค่าผิดปกติเท่าค่าเฉลี่ย",
          "ชั่วโมงที่ว่างตีความว่าไม่ได้อ่าน จึงเติม 0",
          "คะแนนคือสิ่งที่จะวิเคราะห์ แถวที่ไม่มีคะแนนจึงลบทิ้ง"
        ]
      }
    ],
    [
      task("สร้างตารางและสรุป", 1, {
        task: "สร้าง DataFrame สินค้า 4 ชนิด (ชื่อ, ราคา, จำนวน) แล้วแสดงตาราง ราคาเฉลี่ย และจำนวนรวม",
        given: "pen 12/30, book 45/10, bag 350/3, ruler 15/20",
        want: "ตาราง 4 แถว, ราคาเฉลี่ย 105.50, จำนวนรวม 63",
        checklist: ["สร้างจาก dict ที่ key เป็นชื่อคอลัมน์", "`df[\"price\"].mean()`", "`df[\"qty\"].sum()`"],
        code: `import pandas as pd

df = pd.DataFrame({
    "name": ["pen", "book", "bag", "ruler"],
    "price": [12, 45, 350, 15],
    "qty": [30, 10, 3, 20],
})
print(df)
print(f"ราคาเฉลี่ย {df['price'].mean():.2f}")
print("จำนวนรวม", df["qty"].sum())`,
        explain: "แต่ละคอลัมน์เป็น Series ที่มีฟังก์ชันสถิติในตัวเหมือน NumPy array"
      }),
      task("กรองยอดขาย", 1, {
        task: "อ่าน `sales.csv` แล้วแสดงเฉพาะแถวของสาขา Bangkok ที่ขายได้ตั้งแต่ 20 ชิ้น",
        given: "ไฟล์ sales.csv",
        want: "2 แถว (Coffee 30 และ Coffee 35)",
        files: { "sales.csv": salesCsv },
        checklist: ["สองเงื่อนไขเชื่อมด้วย `&`", "ครอบแต่ละเงื่อนไขด้วยวงเล็บ"],
        code: `import pandas as pd

df = pd.read_csv("sales.csv")
result = df[(df["branch"] == "Bangkok") & (df["qty"] >= 20)]
print(result)`,
        explain: "pandas ใช้ `&` แทน `and` เพราะต้องเทียบทีละแถว ถ้าลืมวงเล็บจะเกิด error เพราะ `&` ทำก่อน `==`"
      }),
      task("10 อันดับรายได้", 2, {
        task: "อ่าน `sales.csv` เพิ่มคอลัมน์ revenue แล้วแสดงรายการที่ทำรายได้สูงสุด 3 อันดับ เฉพาะคอลัมน์ date, branch, product, revenue",
        given: "ไฟล์ sales.csv",
        want: "3 แถวเรียงรายได้จากมากไปน้อย",
        files: { "sales.csv": salesCsv },
        checklist: ["`df[\"revenue\"] = df[\"qty\"] * df[\"price\"]`", "`sort_values(..., ascending=False)`", "`.head(3)` และเลือกคอลัมน์"],
        code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["qty"] * df["price"]
top = df.sort_values("revenue", ascending=False).head(3)
print(top[["date", "branch", "product", "revenue"]])`,
        explain: "การเรียงแล้วตัดด้วย `head()` เป็นรูปแบบมาตรฐานของการหา Top N"
      }),
      task("ยอดขายรายวัน", 2, {
        task: "สรุปจำนวนชิ้นที่ขายได้ในแต่ละวัน และบอกวันที่ขายได้มากที่สุด",
        given: "ไฟล์ sales.csv",
        want: "ยอดรายวัน 3 วัน และ `ขายดีสุดวันที่ 2026-01-07`",
        files: { "sales.csv": salesCsv },
        checklist: ["`groupby(\"date\")[\"qty\"].sum()`", "`.idxmax()` คืน index (วันที่) ของค่ามากสุด"],
        code: `import pandas as pd

df = pd.read_csv("sales.csv")
daily = df.groupby("date")["qty"].sum()
print(daily)
print("ขายดีสุดวันที่", daily.idxmax())`,
        explain: "หลัง groupby ค่าที่ใช้จัดกลุ่มกลายเป็น index `idxmax()` จึงคืนวันที่แทนตัวเลขลำดับ"
      }),
      task("ทำความสะอาดแล้ววิเคราะห์", 3, {
        task: "จาก `survey.csv` ให้ลบแถวที่ไม่มีคะแนน เติมชั่วโมงที่ว่างด้วยค่าเฉลี่ย แล้วเปรียบเทียบคะแนนเฉลี่ยของคนที่อ่าน ≥ 10 ชั่วโมงกับ < 10 ชั่วโมง",
        given: "ไฟล์ survey.csv ที่มีค่าว่าง",
        want: "คะแนนเฉลี่ย 2 กลุ่ม",
        files: { "survey.csv": surveyCsv },
        checklist: ["`dropna(subset=[\"score\"])` ก่อน", "`fillna(df[\"hours\"].mean())`", "สร้างคอลัมน์กลุ่มด้วย `np.where` หรือเงื่อนไข แล้ว groupby"],
        code: `import pandas as pd

df = pd.read_csv("survey.csv")
df = df.dropna(subset=["score"])
df["hours"] = df["hours"].fillna(df["hours"].mean())
df["group"] = df["hours"].apply(lambda h: ">= 10 ชม." if h >= 10 else "< 10 ชม.")
print(df[["name", "hours", "score", "group"]])
print(df.groupby("group")["score"].mean().round(1))`,
        explain: "ลำดับการทำความสะอาดสำคัญ: ลบแถวที่ใช้ไม่ได้ก่อน แล้วค่อยคำนวณค่าเฉลี่ยมาเติม ค่าที่เติมจะได้มาจากข้อมูลที่ใช้จริง"
      }),
      task("ตาราง pivot", 3, {
        task: "สร้างตารางรายได้ (qty × price) แยกสาขาเป็นแถว สินค้าเป็นคอลัมน์ และเพิ่มคอลัมน์รวมของแต่ละสาขา",
        given: "ไฟล์ sales.csv",
        want: "ตาราง 3 สาขา × (Cake, Coffee, Tea, Total)",
        files: { "sales.csv": salesCsv },
        checklist: ["สร้างคอลัมน์ revenue", "`pivot_table(index=..., columns=..., values=..., aggfunc=\"sum\", fill_value=0)`", "`table[\"Total\"] = table.sum(axis=1)`"],
        code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["qty"] * df["price"]
table = df.pivot_table(index="branch", columns="product",
                       values="revenue", aggfunc="sum", fill_value=0)
table["Total"] = table.sum(axis=1)
print(table)`,
        explain: "`fill_value=0` เติม 0 ให้คู่สาขา-สินค้าที่ไม่มียอดขาย และ `sum(axis=1)` รวมตามแถวเหมือน NumPy"
      })
    ]),

  chapter("สร้างกราฟด้วย Matplotlib", "ai",
    "แปลงตัวเลขเป็นกราฟที่อ่านง่าย เลือกชนิดกราฟให้ตรงคำถาม และบันทึกเป็นไฟล์ภาพ",
    "วาดกราฟเส้น แท่ง กระจาย และฮิสโทแกรม ใส่ชื่อกราฟ/แกน/legend และบันทึกกราฟเป็นไฟล์",
    [
      ["กราฟแรก",
        "`import matplotlib.pyplot as plt` แล้ววาดด้วย `plt.plot(x, y)` ใส่ชื่อกราฟและชื่อแกน แล้ว `plt.show()` เพื่อเปิดหน้าต่างกราฟ",
        {
          plot: plot("ch16-first"),
          code: `import matplotlib.pyplot as plt

days = [1, 2, 3, 4, 5]
hours = [1.5, 2, 1, 3, 2.5]

plt.plot(days, hours, marker="o")
plt.title("Study hours")
plt.xlabel("Day")
plt.ylabel("Hours")
plt.show()`
        }],
      ["เลือกชนิดกราฟจากคำถาม",
        "เริ่มจากถามว่าอยากให้คนดูเห็นอะไร แล้วเลือกกราฟที่ตอบคำถามนั้น",
        {
          table: {
            head: ["อยากเห็น", "กราฟ", "คำสั่ง"],
            rows: [
              ["การเปลี่ยนแปลงตามเวลา", "เส้น", "`plt.plot(x, y)`"],
              ["เปรียบเทียบกลุ่ม", "แท่ง", "`plt.bar(names, values)`"],
              ["ความสัมพันธ์ 2 ตัวแปร", "กระจาย", "`plt.scatter(x, y)`"],
              ["การกระจายของข้อมูล", "ฮิสโทแกรม", "`plt.hist(values, bins=10)`"],
              ["สัดส่วนของทั้งหมด (ไม่เกิน 5 ส่วน)", "วงกลม", "`plt.pie(values, labels=names)`"]
            ]
          }
        }],
      ["กราฟแท่ง",
        "กราฟแท่งเหมาะกับเปรียบเทียบค่าของแต่ละกลุ่ม ใส่ตัวเลขบนแท่งด้วย `plt.bar_label()` ช่วยให้อ่านค่าได้ทันที",
        {
          plot: plot("ch16-bar"),
          code: `import matplotlib.pyplot as plt

branches = ["Bangkok", "Chiang Mai", "Phuket"]
revenue = [5005, 1860, 1820]

bars = plt.bar(branches, revenue, color="#4a6fa5")
plt.bar_label(bars)
plt.title("Revenue by branch")
plt.ylabel("Baht")
plt.show()`
        }],
      ["หลายเส้นในกราฟเดียว",
        "เรียก `plot` หลายครั้งเพื่อวาดหลายเส้น ใส่ `label=` ให้แต่ละเส้น แล้ว `plt.legend()` แสดงคำอธิบาย สำหรับงานที่ซับซ้อนขึ้นนิยมเขียนแบบ `fig, ax = plt.subplots()`",
        {
          plot: plot("ch16-multi"),
          code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May"]
coffee = [120, 135, 150, 160, 155]
tea = [80, 78, 95, 110, 120]

fig, ax = plt.subplots()
ax.plot(months, coffee, marker="o", label="Coffee")
ax.plot(months, tea, marker="s", label="Tea")
ax.set_title("Monthly sales")
ax.set_ylabel("Cups")
ax.legend()
ax.grid(alpha=0.3)
plt.show()`
        }],
      ["กราฟกระจายและฮิสโทแกรม",
        "`scatter` ดูว่า 2 ตัวแปรสัมพันธ์กันไหม ส่วน `hist` ดูว่าข้อมูลส่วนใหญ่อยู่ช่วงไหน ใช้ `subplots(1, 2)` วาดสองกราฟคู่กันได้",
        {
          plot: plot("ch16-scatter-hist"),
          code: `import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(0)
hours = rng.uniform(0, 10, 60)
scores = np.clip(45 + 5 * hours + rng.normal(0, 6, 60), 0, 100)

fig, (left, right) = plt.subplots(1, 2, figsize=(9, 3.5))
left.scatter(hours, scores, alpha=0.7)
left.set_title("Hours vs score")
left.set_xlabel("Study hours")
right.hist(scores, bins=8, color="#e07a5f", edgecolor="white")
right.set_title("Score distribution")
fig.tight_layout()
plt.show()`
        }],
      ["บันทึกกราฟและภาษาไทย",
        "`plt.savefig(\"chart.png\", dpi=150)` บันทึกกราฟเป็นไฟล์ภาพ ต้องเรียกก่อน `plt.show()` ถ้าจะใช้ชื่อภาษาไทยในกราฟ ให้ตั้งฟอนต์ที่มีภาษาไทยก่อนวาด",
        {
          plot: plot("ch16-thai"),
          code: `import matplotlib.pyplot as plt

plt.rcParams["font.family"] = "Tahoma"     # ฟอนต์ที่มีภาษาไทยใน Windows

plt.bar(["กาแฟ", "ชา", "เค้ก"], [83, 37, 14], color="#81b29a")
plt.title("จำนวนที่ขายได้")
plt.savefig("sales_th.png", dpi=150, bbox_inches="tight")
plt.show()`,
          tip: "ถ้าภาษาไทยขึ้นเป็นสี่เหลี่ยม แปลว่าฟอนต์ไม่มีภาษาไทย บน Mac ลองใช้ `\"Thonburi\"`"
        }]
    ],
    [
      {
        title: "กราฟยอดขายจาก CSV",
        idea: "ใช้ pandas สรุปข้อมูล แล้วส่งผลให้ Matplotlib วาด",
        files: { "sales.csv": salesCsv },
        plot: plot("ch16-example-pandas"),
        code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv")
df["revenue"] = df["qty"] * df["price"]
by_product = df.groupby("product")["revenue"].sum().sort_values()

fig, ax = plt.subplots(figsize=(6, 3.2))
bars = ax.barh(by_product.index, by_product.values, color="#3d5a80")
ax.bar_label(bars, fmt="{:,.0f}", padding=3)
ax.set_title("Revenue by product")
ax.set_xlabel("Baht")
fig.tight_layout()
plt.show()`,
        steps: [
          "pandas ทำงานคำนวณ Matplotlib ทำงานวาด แยกหน้าที่กันชัดเจน",
          "`sort_values()` ก่อนวาด ทำให้แท่งเรียงจากน้อยไปมาก อ่านง่าย",
          "`barh` คือแท่งแนวนอน เหมาะเมื่อชื่อกลุ่มยาว"
        ]
      },
      {
        title: "แดชบอร์ด 2 กราฟ",
        idea: "รวมกราฟเส้นและกราฟวงกลมในภาพเดียวด้วย `subplots`",
        plot: plot("ch16-example-dashboard"),
        code: `import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
visitors = [320, 410, 380, 520, 610, 580]
channels = {"Search": 45, "Social": 30, "Direct": 25}

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 3.6))
ax1.plot(months, visitors, marker="o", color="#2a9d8f")
ax1.fill_between(months, visitors, alpha=0.15, color="#2a9d8f")
ax1.set_title("Website visitors")
ax2.pie(channels.values(), labels=channels.keys(), autopct="%1.0f%%",
        colors=["#264653", "#e9c46a", "#f4a261"])
ax2.set_title("Traffic source")
fig.tight_layout()
plt.show()`,
        steps: [
          "`subplots(1, 2)` สร้าง 1 แถว 2 กราฟ ได้ ax1 และ ax2 แยกกัน",
          "`fill_between` แรเงาใต้เส้นให้เห็นปริมาณ",
          "`autopct` แสดงเปอร์เซ็นต์บนกราฟวงกลม"
        ]
      }
    ],
    [
      task("กราฟน้ำหนักรายสัปดาห์", 1, {
        task: "วาดกราฟเส้นน้ำหนัก 6 สัปดาห์ `[68, 67.5, 67.2, 66.8, 66.9, 66.1]` มีจุดที่แต่ละค่า ชื่อกราฟ และชื่อแกน",
        given: "น้ำหนัก 6 สัปดาห์",
        want: "กราฟเส้นที่มี marker ชื่อกราฟ แกน x = Week แกน y = kg",
        plot: plot("ch16-ex1"),
        checklist: ["สร้าง x ด้วย `range(1, 7)`", "`plt.plot(x, y, marker=\"o\")`", "`title`, `xlabel`, `ylabel` แล้ว `show()`"],
        code: `import matplotlib.pyplot as plt

weight = [68, 67.5, 67.2, 66.8, 66.9, 66.1]
plt.plot(range(1, 7), weight, marker="o")
plt.title("Weight per week")
plt.xlabel("Week")
plt.ylabel("kg")
plt.show()`,
        explain: "ข้อมูลตามเวลาใช้กราฟเส้น marker ช่วยให้เห็นว่าค่าจริงอยู่ตรงไหน"
      }),
      task("กราฟแท่งคะแนนวิชา", 1, {
        task: "วาดกราฟแท่งคะแนนเฉลี่ย 4 วิชา (Math 72, Sci 68, Eng 85, Art 90) พร้อมตัวเลขบนแท่ง",
        given: "ชื่อวิชาและคะแนน",
        want: "กราฟแท่ง 4 แท่ง มีตัวเลขบนแท่ง",
        plot: plot("ch16-ex2"),
        checklist: ["`bars = plt.bar(names, values)`", "`plt.bar_label(bars)`"],
        code: `import matplotlib.pyplot as plt

subjects = ["Math", "Sci", "Eng", "Art"]
scores = [72, 68, 85, 90]
bars = plt.bar(subjects, scores, color="#6d597a")
plt.bar_label(bars)
plt.title("Average score by subject")
plt.ylim(0, 100)
plt.show()`,
        explain: "`ylim(0, 100)` ให้แกน y เริ่มที่ 0 กราฟแท่งที่ไม่เริ่มที่ 0 จะทำให้ความต่างดูเกินจริง"
      }),
      task("เปรียบเทียบ 2 เส้น", 2, {
        task: "วาดอุณหภูมิสูงสุดของกรุงเทพฯ และเชียงใหม่ 7 วันในกราฟเดียว มี legend และเส้นตาราง",
        given: "BKK `[34, 35, 33, 36, 35, 34, 33]` CNX `[30, 31, 29, 32, 33, 31, 30]`",
        want: "2 เส้นสีต่างกัน มี legend",
        plot: plot("ch16-ex3"),
        checklist: ["`plot` สองครั้งพร้อม `label=`", "`plt.legend()`", "`plt.grid(alpha=0.3)`"],
        code: `import matplotlib.pyplot as plt

days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
plt.plot(days, [34, 35, 33, 36, 35, 34, 33], marker="o", label="Bangkok")
plt.plot(days, [30, 31, 29, 32, 33, 31, 30], marker="o", label="Chiang Mai")
plt.title("Max temperature (C)")
plt.legend()
plt.grid(alpha=0.3)
plt.show()`,
        explain: "ถ้าไม่ใส่ `label` คำสั่ง `legend()` จะไม่รู้ว่าจะเขียนชื่ออะไร"
      }),
      task("ฮิสโทแกรมคะแนน", 2, {
        task: "สร้างคะแนนสุ่ม 200 คน (ค่าเฉลี่ย 65 ส่วนเบี่ยงเบน 12) ด้วย `np.random.default_rng(1)` แล้ววาดฮิสโทแกรม 15 ช่อง พร้อมเส้นแนวตั้งที่ค่าเฉลี่ย",
        given: "คะแนนสุ่ม 200 ค่า",
        want: "ฮิสโทแกรมและเส้นค่าเฉลี่ยสีแดง",
        plot: plot("ch16-ex4"),
        checklist: ["`rng.normal(65, 12, 200)`", "`plt.hist(scores, bins=15)`", "`plt.axvline(scores.mean(), color=\"red\")`"],
        code: `import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(1)
scores = rng.normal(65, 12, 200)
plt.hist(scores, bins=15, color="#90be6d", edgecolor="white")
plt.axvline(scores.mean(), color="red", linestyle="--", label=f"mean {scores.mean():.1f}")
plt.title("Score distribution")
plt.legend()
plt.show()`,
        explain: "ฮิสโทแกรมแสดงว่าคะแนนส่วนใหญ่อยู่ช่วงไหน เส้นค่าเฉลี่ยช่วยให้เห็นจุดกลางทันที"
      }),
      task("กราฟจาก DataFrame", 3, {
        task: "อ่าน `sales.csv` สรุปจำนวนชิ้นรายวันแยกสินค้า (pivot) แล้ววาดกราฟแท่งแบบกลุ่มด้วย `table.plot(kind=\"bar\")`",
        given: "ไฟล์ sales.csv",
        want: "กราฟแท่งกลุ่ม: แกน x เป็นวัน แต่ละวันมีแท่งของ Cake, Coffee, Tea",
        files: { "sales.csv": salesCsv },
        plot: plot("ch16-ex5"),
        checklist: ["`pivot_table(index=\"date\", columns=\"product\", values=\"qty\", aggfunc=\"sum\", fill_value=0)`", "DataFrame มี `.plot()` ที่เรียก Matplotlib ให้", "หมุนชื่อแกน x ด้วย `rot=0`"],
        code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv")
table = df.pivot_table(index="date", columns="product", values="qty",
                       aggfunc="sum", fill_value=0)
ax = table.plot(kind="bar", rot=0, figsize=(7, 3.5))
ax.set_title("Units sold per day")
ax.set_ylabel("Units")
plt.tight_layout()
plt.show()`,
        explain: "`DataFrame.plot()` ใช้ index เป็นแกน x และวาดแต่ละคอลัมน์เป็นหนึ่งชุดข้อมูลให้อัตโนมัติ"
      }),
      task("ความสัมพันธ์ชั่วโมงเรียนกับคะแนน", 3, {
        task: "วาด scatter ชั่วโมงอ่านหนังสือกับคะแนนของนักเรียน 8 คน แล้วลากเส้นแนวโน้มด้วย `np.polyfit` (ดีกรี 1)",
        given: "hours `[2, 4, 5, 6, 7, 8, 9, 10]` scores `[50, 58, 62, 65, 70, 74, 80, 85]`",
        want: "จุด 8 จุด และเส้นตรงแนวโน้ม",
        plot: plot("ch16-ex6"),
        checklist: ["`plt.scatter(x, y)`", "`slope, intercept = np.polyfit(x, y, 1)`", "วาดเส้น `slope * x + intercept`"],
        code: `import matplotlib.pyplot as plt
import numpy as np

hours = np.array([2, 4, 5, 6, 7, 8, 9, 10])
scores = np.array([50, 58, 62, 65, 70, 74, 80, 85])
slope, intercept = np.polyfit(hours, scores, 1)

plt.scatter(hours, scores, label="students")
plt.plot(hours, slope * hours + intercept, color="red",
         label=f"trend: {slope:.1f} points/hour")
plt.xlabel("Study hours")
plt.ylabel("Score")
plt.legend()
plt.show()`,
        explain: "`polyfit` หาเส้นตรงที่ใกล้ทุกจุดที่สุด ความชัน (slope) บอกว่าอ่านเพิ่ม 1 ชั่วโมง คะแนนเพิ่มประมาณเท่าไร ซึ่งเป็นแนวคิดเดียวกับ Linear Regression ในบทถัดไป"
      })
    ]),

  chapter("Machine Learning เบื้องต้นด้วย scikit-learn", "ai",
    "ให้คอมพิวเตอร์เรียนรู้รูปแบบจากตัวอย่าง แล้วทำนายข้อมูลใหม่ ด้วยขั้นตอนมาตรฐานของ scikit-learn",
    "แยก feature กับ target แบ่ง train/test ฝึกโมเดลด้วย fit ทำนายด้วย predict และวัดผลด้วย accuracy/error",
    [
      ["Machine Learning คืออะไร",
        "แทนที่จะเขียนกติกาเอง เราให้ตัวอย่างที่มีคำตอบจำนวนมากกับโมเดล แล้วโมเดลหารูปแบบเอง ข้อมูลแบ่งเป็น feature (`X` สิ่งที่รู้) และ target (`y` สิ่งที่อยากทำนาย)",
        {
          table: {
            head: ["งาน", "X (feature)", "y (target)", "ประเภท"],
            rows: [
              ["แยกพันธุ์ดอกไม้", "ความยาว/กว้างกลีบ", "ชื่อพันธุ์", "Classification (ทำนายกลุ่ม)"],
              ["ตรวจอีเมลขยะ", "คำในอีเมล", "spam / ไม่ใช่", "Classification"],
              ["ทำนายราคาบ้าน", "ขนาด ทำเล จำนวนห้อง", "ราคา", "Regression (ทำนายตัวเลข)"],
              ["ทำนายคะแนน", "ชั่วโมงอ่านหนังสือ", "คะแนน", "Regression"]
            ]
          }
        }],
      ["ขั้นตอนมาตรฐาน",
        "งาน ML เกือบทุกงานใน scikit-learn ทำตามขั้นตอนเดียวกัน 5 ขั้น เปลี่ยนแค่ชนิดโมเดล",
        {
          figure: figure("ml-flow.svg", "ขั้นตอน ML: เตรียมข้อมูล X, y → แบ่ง train/test → fit กับ train → predict กับ test → วัดผล"),
          code: `from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
print(X.shape, y.shape)
print("ตัวอย่างแรก:", X[0], "→ พันธุ์", y[0])`
        }],
      ["แบ่งข้อมูล train/test",
        "ต้องเก็บข้อมูลส่วนหนึ่งไว้ทดสอบ เหมือนข้อสอบที่นักเรียนไม่เคยเห็น ถ้าวัดผลด้วยข้อมูลที่ใช้ฝึก คะแนนจะสูงเกินจริง",
        {
          code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y)
print(len(X_train), "train /", len(X_test), "test")`,
          tip: "`random_state` ทำให้แบ่งเหมือนเดิมทุกครั้ง `stratify=y` ให้สัดส่วนแต่ละคลาสในชุด train/test เท่ากัน"
        }],
      ["fit และ predict",
        "ทุกโมเดลใช้ 2 คำสั่งหลัก: `model.fit(X_train, y_train)` ฝึกโมเดล และ `model.predict(X_new)` ทำนาย ลองเปลี่ยนโมเดลได้โดยแก้บรรทัดเดียว",
        {
          code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y)

model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)
print("ทำนาย:", model.predict(X_test[:6]))
print("เฉลย: ", y_test[:6])`
        }],
      ["วัดผลโมเดล",
        "Classification วัดด้วย accuracy (สัดส่วนที่ทายถูก) และ confusion matrix (ทายผิดเป็นคลาสไหน) ส่วน Regression วัดด้วยค่าคลาดเคลื่อน เช่น MAE",
        {
          table: {
            head: ["ตัววัด", "ใช้กับ", "อ่านค่า"],
            rows: [
              ["`accuracy_score`", "Classification", "ใกล้ 1 ดี (1 = ถูกทั้งหมด)"],
              ["`confusion_matrix`", "Classification", "แนวทแยง = ทายถูก ช่องอื่น = ทายผิด"],
              ["`mean_absolute_error`", "Regression", "ทายพลาดเฉลี่ยกี่หน่วย ยิ่งน้อยยิ่งดี"],
              ["`r2_score`", "Regression", "ใกล้ 1 ดี"]
            ]
          },
          code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y)
model = DecisionTreeClassifier(random_state=0).fit(X_train, y_train)
pred = model.predict(X_test)
print("accuracy", round(accuracy_score(y_test, pred), 3))
print(confusion_matrix(y_test, pred))`
        }],
      ["Pipeline: รวมการเตรียมข้อมูลกับโมเดล",
        "โมเดลหลายแบบทำงานดีขึ้นเมื่อปรับสเกล feature ก่อน `Pipeline` รวมขั้นปรับสเกลกับโมเดลเป็นก้อนเดียว ช่วยไม่ให้ลืมขั้นตอนตอนทำนาย และไม่ให้ข้อมูล test รั่วไปตอนฝึก",
        {
          code: `from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

X, y = load_wine(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=0, stratify=y)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
model.fit(X_train, y_train)
print("accuracy", round(model.score(X_test, y_test), 3))`
        }]
    ],
    [
      {
        title: "ทำนายพันธุ์ดอกไม้ทั้งกระบวนการ",
        idea: "ครบ 5 ขั้น: ข้อมูล → แบ่ง → ฝึก → ทำนาย → วัดผล แล้วทำนายดอกไม้ดอกใหม่",
        code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.25, random_state=42, stratify=iris.target)

model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)
print(f"accuracy {accuracy_score(y_test, model.predict(X_test)):.3f}")

new_flower = [[5.0, 3.4, 1.5, 0.2]]
species = model.predict(new_flower)[0]
print("ดอกใหม่เป็นพันธุ์", iris.target_names[species])`,
        steps: [
          "`load_iris()` ให้ทั้งข้อมูลและชื่อพันธุ์ (`target_names`)",
          "KNN ทายจากเพื่อนบ้านที่ใกล้ที่สุด 5 ตัวในข้อมูลฝึก",
          "ข้อมูลใหม่ต้องเป็นรูปแบบเดียวกับ X: list ของแถว แต่ละแถวมี 4 feature"
        ]
      },
      {
        title: "ทำนายคะแนนจากชั่วโมงอ่านหนังสือ",
        idea: "Regression: ทำนายตัวเลข แล้ววาดเส้นที่โมเดลเรียนรู้",
        plot: plot("ch17-regression"),
        code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error

hours = np.array([[1], [2], [3], [4], [5], [6], [7], [8]])
scores = np.array([52, 55, 61, 64, 70, 72, 79, 83])

model = LinearRegression().fit(hours, scores)
print(f"คะแนน = {model.coef_[0]:.2f} x ชั่วโมง + {model.intercept_:.2f}")
print(f"อ่าน 5.5 ชั่วโมง ทำนายได้ {model.predict([[5.5]])[0]:.1f} คะแนน")
print(f"MAE {mean_absolute_error(scores, model.predict(hours)):.2f}")

plt.scatter(hours, scores, label="data")
plt.plot(hours, model.predict(hours), color="red", label="model")
plt.xlabel("Study hours")
plt.ylabel("Score")
plt.legend()
plt.show()`,
        steps: [
          "X ต้องเป็น 2 มิติ (`[[1], [2], ...]`) แม้มี feature เดียว",
          "`coef_` คือความชัน `intercept_` คือจุดตัดแกน y โมเดลนี้อธิบายได้เป็นสมการ",
          "MAE บอกว่าโดยเฉลี่ยทายพลาดกี่คะแนน (ตัวอย่างนี้วัดกับข้อมูลฝึกเพื่อดูภาพรวมเท่านั้น)"
        ]
      }
    ],
    [
      task("สำรวจชุดข้อมูล", 1, {
        task: "โหลด `load_wine()` แล้วแสดงจำนวนตัวอย่าง จำนวน feature ชื่อ feature 3 ตัวแรก และชื่อคลาส",
        given: "ชุดข้อมูลไวน์ใน scikit-learn",
        want: "`178 ตัวอย่าง 13 feature` และชื่อต่าง ๆ",
        checklist: ["`data = load_wine()`", "`data.data.shape`", "`data.feature_names`, `data.target_names`"],
        code: `from sklearn.datasets import load_wine

data = load_wine()
rows, cols = data.data.shape
print(f"{rows} ตัวอย่าง {cols} feature")
print(data.feature_names[:3])
print(list(data.target_names))`,
        explain: "สำรวจข้อมูลก่อนเสมอ จะรู้ว่ามี feature อะไร และเป็นงาน classification กี่คลาส"
      }),
      task("แบ่งข้อมูล 80/20", 1, {
        task: "แบ่ง iris เป็น train 80% test 20% แบบ stratify แล้วนับจำนวนแต่ละคลาสในชุด test",
        given: "iris 150 ตัวอย่าง 3 คลาส",
        want: "30 ตัวอย่างทดสอบ คลาสละ 10",
        checklist: ["`test_size=0.2`, `stratify=y`, `random_state=1`", "`np.bincount(y_test)` นับแต่ละคลาส"],
        code: `import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=1)
print(len(X_train), len(X_test))
print(np.bincount(y_test))`,
        explain: "stratify ทำให้ทุกคลาสมีสัดส่วนเท่ากันในชุดทดสอบ ผลวัดจึงไม่เอียงไปทางคลาสใดคลาสหนึ่ง"
      }),
      task("เปรียบเทียบโมเดล", 2, {
        task: "ฝึก KNN, Decision Tree และ Logistic Regression กับข้อมูลไวน์ชุดเดียวกัน แล้วเทียบ accuracy",
        given: "load_wine แบ่ง 75/25 random_state=0 stratify",
        want: "accuracy ของ 3 โมเดล",
        checklist: ["เก็บโมเดลใน dict ชื่อ → โมเดล", "วนลูป fit แล้ว `score(X_test, y_test)`", "Logistic Regression ใส่ `max_iter=5000`"],
        code: `from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression

X, y = load_wine(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=0, stratify=y)
models = {
    "KNN": KNeighborsClassifier(),
    "Decision Tree": DecisionTreeClassifier(random_state=0),
    "Logistic": LogisticRegression(max_iter=5000),
}
for name, model in models.items():
    model.fit(X_train, y_train)
    print(f"{name:<14} {model.score(X_test, y_test):.3f}")`,
        explain: "ทุกโมเดลใช้ fit/score เหมือนกัน การเปรียบเทียบจึงเขียนเป็นลูปได้ KNN ได้คะแนนต่ำเพราะ feature ของไวน์มีสเกลต่างกันมาก ซึ่งแก้ได้ในข้อถัดไป"
      }),
      task("ปรับสเกลด้วย Pipeline", 2, {
        task: "ทำ KNN กับข้อมูลไวน์อีกครั้ง โดยใช้ Pipeline ที่มี StandardScaler นำหน้า แล้วเทียบกับ KNN แบบไม่ปรับสเกล",
        given: "load_wine แบ่งเหมือนข้อที่แล้ว",
        want: "accuracy ของ KNN ก่อนและหลังปรับสเกล",
        checklist: ["`make_pipeline(StandardScaler(), KNeighborsClassifier())`", "ฝึกและวัดผลทั้งสองแบบ"],
        code: `from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X, y = load_wine(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=0, stratify=y)
raw = KNeighborsClassifier().fit(X_train, y_train)
scaled = make_pipeline(StandardScaler(), KNeighborsClassifier()).fit(X_train, y_train)
print(f"ไม่ปรับสเกล {raw.score(X_test, y_test):.3f}")
print(f"ปรับสเกล   {scaled.score(X_test, y_test):.3f}")`,
        explain: "KNN วัดระยะห่าง feature ที่ค่าใหญ่ (เช่น 1000) จะกลบ feature ค่าเล็ก (เช่น 0.5) การปรับสเกลให้ทุก feature มีน้ำหนักใกล้กัน"
      }),
      task("ทำนายราคาบ้านจำลอง", 3, {
        task: "ข้อมูลบ้าน 8 หลัง (พื้นที่ ตร.ม., จำนวนห้องนอน) กับราคา (ล้านบาท) ให้ฝึก LinearRegression แล้วทำนายบ้าน 120 ตร.ม. 3 ห้องนอน",
        given: "X `[[50,1],[65,2],[80,2],[95,3],[110,3],[130,4],[150,4],[170,5]]` y `[1.8,2.4,2.9,3.5,3.9,4.7,5.3,6.1]`",
        want: "ราคาที่ทำนาย และสมการที่โมเดลเรียนรู้",
        checklist: ["X มี 2 feature ต่อแถว", "`coef_` มี 2 ค่า (ต่อ ตร.ม. และต่อห้อง)", "`predict([[120, 3]])`"],
        code: `from sklearn.linear_model import LinearRegression

X = [[50, 1], [65, 2], [80, 2], [95, 3], [110, 3], [130, 4], [150, 4], [170, 5]]
y = [1.8, 2.4, 2.9, 3.5, 3.9, 4.7, 5.3, 6.1]
model = LinearRegression().fit(X, y)
a, b = model.coef_
print(f"ราคา = {a:.4f} x ตร.ม. + {b:.3f} x ห้อง + {model.intercept_:.3f}")
print(f"บ้าน 120 ตร.ม. 3 ห้อง ≈ {model.predict([[120, 3]])[0]:.2f} ล้านบาท")`,
        explain: "Linear Regression หาน้ำหนักของแต่ละ feature ผลที่ได้อ่านเป็นสมการได้ จึงอธิบายเหตุผลของการทำนายได้ ต่างจากโมเดลซับซ้อนหลายแบบ"
      }),
      task("ตรวจว่าโมเดลจำข้อสอบหรือไม่", 3, {
        task: "ฝึก Decision Tree แบบไม่จำกัดความลึกกับ `load_breast_cancer` แล้วเทียบ accuracy บน train กับ test จากนั้นจำกัด `max_depth=3` แล้วเทียบอีกครั้ง",
        given: "load_breast_cancer แบ่ง 75/25 random_state=0 stratify",
        want: "accuracy train/test ของทั้งสองแบบ",
        checklist: ["`score` กับ train และ test", "train สูงมากแต่ test ต่ำกว่า = overfitting", "เปลี่ยน `max_depth` แล้วสังเกตช่องว่างระหว่างสองค่า"],
        code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=0, stratify=y)
for depth in [None, 3]:
    tree = DecisionTreeClassifier(max_depth=depth, random_state=0).fit(X_train, y_train)
    print(f"max_depth={depth}: train {tree.score(X_train, y_train):.3f} test {tree.score(X_test, y_test):.3f}")`,
        explain: "ต้นไม้ที่ไม่จำกัดความลึกได้ train = 1.000 คือจำข้อมูลฝึกได้หมด (overfitting) การจำกัดความลึกทำให้ช่องว่าง train/test แคบลง ซึ่งเป็นสัญญาณว่าโมเดลเรียนรู้รูปแบบทั่วไปมากกว่าการท่องจำ"
      })
    ]),

  chapter("แนวคิด Neural Network และการฝึกโมเดล", "ai",
    "เข้าใจส่วนประกอบของ neural network ตั้งแต่ neuron, activation, loss จนถึงการเรียนรู้ด้วย gradient descent",
    "อธิบายการทำงานของ neuron คำนวณ forward pass ด้วย NumPy เข้าใจ loss และการปรับ weight และใช้ MLPClassifier ได้",
    [
      ["neuron: หน่วยคำนวณพื้นฐาน",
        "neuron รับ input หลายค่า คูณแต่ละค่าด้วยน้ำหนัก (weight) รวมกันแล้วบวก bias ได้ค่า `z` จากนั้นส่งผ่าน activation function ได้ output weight และ bias คือค่าที่โมเดล “เรียนรู้”",
        {
          figure: figure("neuron.svg", "neuron: input x1, x2, x3 คูณ weight w1, w2, w3 รวมกันบวก bias ได้ z แล้วผ่าน activation ได้ output"),
          code: `import numpy as np

x = np.array([2.0, 1.0, 3.0])     # input
w = np.array([0.5, -1.0, 0.25])   # weight
b = 0.1                           # bias
z = x @ w + b                     # x1*w1 + x2*w2 + x3*w3 + b
print(f"z = {z:.2f}")`,
          tip: "`@` คือ dot product: คูณทีละตำแหน่งแล้วรวม"
        }],
      ["activation function",
        "activation ทำให้ network เรียนรู้รูปแบบที่ไม่เป็นเส้นตรงได้ ถ้าไม่มี ต่อกี่ชั้นก็ยังเท่ากับสมการเส้นตรงหนึ่งเส้น",
        {
          table: {
            head: ["ชื่อ", "สูตร", "ผล", "ใช้บ่อยที่"],
            rows: [
              ["ReLU", "`max(0, z)`", "ค่าลบเป็น 0 ค่าบวกคงเดิม", "ชั้นซ่อน (hidden layer)"],
              ["Sigmoid", "`1 / (1 + e^-z)`", "ค่าระหว่าง 0–1", "ชั้นสุดท้ายของงาน 2 คลาส"],
              ["Softmax", "`e^z / sum(e^z)`", "ความน่าจะเป็นรวมกันได้ 1", "ชั้นสุดท้ายของงานหลายคลาส"]
            ]
          },
          code: `import numpy as np

z = np.array([-2.0, 0.0, 1.5])
relu = np.maximum(0, z)
sigmoid = 1 / (1 + np.exp(-z))
print("ReLU   ", relu)
print("Sigmoid", sigmoid.round(3))`
        }],
      ["layer: หลาย neuron พร้อมกัน",
        "หนึ่ง layer คือ neuron หลายตัวที่รับ input ชุดเดียวกัน คำนวณพร้อมกันด้วย matrix multiplication `X @ W + b` network คือ layer หลายชั้นต่อกัน output ของชั้นหนึ่งเป็น input ของชั้นถัดไป",
        {
          code: `import numpy as np

X = np.array([[1.0, 2.0],          # 3 ตัวอย่าง × 2 feature
              [0.5, -1.0],
              [3.0, 0.0]])
W1 = np.array([[0.2, -0.5, 1.0],    # 2 input → 3 neuron
               [0.7, 0.1, -0.3]])
b1 = np.array([0.0, 0.1, 0.2])
hidden = np.maximum(0, X @ W1 + b1)
print(hidden.shape)
print(hidden.round(2))`
        }],
      ["loss: วัดว่าผิดมากแค่ไหน",
        "loss function เทียบผลทำนายกับคำตอบจริงเป็นตัวเลขตัวเดียว ยิ่งน้อยยิ่งดี เป้าหมายของการฝึกคือหา weight ที่ทำให้ loss ต่ำที่สุด",
        {
          code: `import numpy as np

actual = np.array([3.0, 5.0, 7.0])
good = np.array([2.9, 5.2, 6.8])
bad = np.array([1.0, 8.0, 4.0])
mse = lambda pred: np.mean((actual - pred) ** 2)
print(f"MSE โมเดลดี  {mse(good):.3f}")
print(f"MSE โมเดลแย่ {mse(bad):.3f}")`
        }],
      ["การเรียนรู้: gradient descent",
        "เริ่มจาก weight สุ่ม แล้ววนซ้ำ: ทำนาย → คำนวณ loss → หาทิศทางที่ loss ลด (gradient) → ขยับ weight ไปทางนั้นทีละน้อย (ขนาดก้าวคือ learning rate) กราฟด้านขวาแสดง loss ที่ลดลงทุกรอบ",
        {
          plot: plot("ch18-loss"),
          code: `import numpy as np
import matplotlib.pyplot as plt

x = np.array([1, 2, 3, 4, 5], dtype=float)
y = 2 * x + 1                       # คำตอบจริง: w=2, b=1
w, b, lr = 0.0, 0.0, 0.02
losses = []
for epoch in range(200):
    pred = w * x + b
    error = pred - y
    losses.append(np.mean(error ** 2))
    w -= lr * 2 * np.mean(error * x)   # ขยับตาม gradient
    b -= lr * 2 * np.mean(error)
print(f"w={w:.2f} b={b:.2f} loss={losses[-1]:.4f}")

plt.plot(losses)
plt.xlabel("epoch")
plt.ylabel("MSE loss")
plt.title("Loss decreases while training")
plt.show()`,
          tip: "learning rate ใหญ่ไปจะกระโดดข้ามจุดต่ำสุด เล็กไปจะเรียนรู้ช้า"
        }],
      ["ใช้ library แทนการเขียนเอง",
        "งานจริงไม่ต้องเขียน gradient เอง scikit-learn มี `MLPClassifier` (neural network แบบหลายชั้น) ใช้ fit/predict เหมือนโมเดลอื่น ส่วนงานใหญ่อย่างภาพหรือภาษาใช้ PyTorch หรือ TensorFlow ซึ่งคำนวณ gradient ให้อัตโนมัติและใช้ GPU ได้",
        {
          code: `from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier

X, y = load_digits(return_X_y=True)          # ภาพตัวเลข 8x8 = 64 feature
X_train, X_test, y_train, y_test = train_test_split(
    X / 16, y, test_size=0.25, random_state=0, stratify=y)
net = MLPClassifier(hidden_layer_sizes=(64,), max_iter=500, random_state=0)
net.fit(X_train, y_train)
print(f"accuracy {net.score(X_test, y_test):.3f}")`
        }]
    ],
    [
      {
        title: "forward pass ของ network 2 ชั้น",
        idea: "คำนวณ input → hidden (ReLU) → output (softmax) ด้วย NumPy เพื่อเห็นว่า network คือการคูณเมทริกซ์ต่อกัน",
        code: `import numpy as np

rng = np.random.default_rng(0)
x = np.array([[0.8, 0.2, 0.5]])            # 1 ตัวอย่าง 3 feature

W1, b1 = rng.normal(0, 0.5, (3, 4)), np.zeros(4)   # 3 → 4
W2, b2 = rng.normal(0, 0.5, (4, 2)), np.zeros(2)   # 4 → 2 คลาส

hidden = np.maximum(0, x @ W1 + b1)
scores = hidden @ W2 + b2
probs = np.exp(scores) / np.exp(scores).sum()

print("hidden:", hidden.round(3))
print("ความน่าจะเป็น:", probs.round(3))
print("ทำนายคลาส", probs.argmax())`,
        steps: [
          "ขนาดเมทริกซ์ต้องต่อกันได้: (1×3) @ (3×4) = (1×4) แล้ว (1×4) @ (4×2) = (1×2)",
          "softmax แปลงคะแนนเป็นความน่าจะเป็นที่รวมกันได้ 1",
          "weight ยังสุ่มอยู่ ผลทำนายจึงยังไม่มีความหมาย ต้องฝึกก่อน"
        ]
      },
      {
        title: "ฝึก MLP ทายตัวเลขเขียนมือ",
        idea: "ใช้ MLPClassifier กับภาพตัวเลข 0–9 แล้วดูตัวอย่างที่ทายผิด",
        plot: plot("ch18-digits"),
        code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier

digits = load_digits()
X_train, X_test, y_train, y_test = train_test_split(
    digits.data / 16, digits.target, test_size=0.25, random_state=0, stratify=digits.target)
net = MLPClassifier(hidden_layer_sizes=(64,), max_iter=500, random_state=0)
net.fit(X_train, y_train)
pred = net.predict(X_test)
print(f"accuracy {np.mean(pred == y_test):.3f}")

fig, axes = plt.subplots(1, 6, figsize=(9, 2))
for ax, image, p, t in zip(axes, X_test[:6], pred[:6], y_test[:6]):
    ax.imshow(image.reshape(8, 8), cmap="gray_r")
    ax.set_title(f"pred {p} / true {t}", fontsize=8)
    ax.axis("off")
plt.show()`,
        steps: [
          "หารด้วย 16 ปรับค่าพิกเซล (0–16) ให้อยู่ช่วง 0–1 ช่วยให้ฝึกได้ดีขึ้น",
          "hidden layer 64 neuron เพียงชั้นเดียวก็ได้ accuracy สูงกับงานนี้",
          "แสดงภาพพร้อมผลทาย ช่วยให้เห็นว่าโมเดลทำงานอย่างไรจริง ๆ"
        ]
      }
    ],
    [
      task("คำนวณ neuron 1 ตัว", 1, {
        task: "คำนวณ z = x·w + b เมื่อ x = [3, 2], w = [0.2, 0.5], b = 0.1 แล้วผ่าน ReLU",
        given: "x, w, b",
        want: "`z = 1.70 output = 1.70`",
        checklist: ["`x @ w + b`", "`max(0, z)`"],
        code: `import numpy as np

x = np.array([3.0, 2.0])
w = np.array([0.2, 0.5])
z = x @ w + 0.1
print(f"z = {z:.2f} output = {max(0, z):.2f}")`,
        explain: "3×0.2 + 2×0.5 + 0.1 = 1.7 เป็นบวก ReLU จึงคงค่าเดิม"
      }),
      task("เปรียบเทียบ activation", 1, {
        task: "คำนวณ ReLU และ Sigmoid ของ z = −3, −1, 0, 1, 3 แสดงเป็นตาราง",
        given: "ค่า z 5 ค่า",
        want: "ตาราง z, ReLU, Sigmoid (ทศนิยม 3 ตำแหน่ง)",
        checklist: ["`np.maximum(0, z)`", "`1 / (1 + np.exp(-z))`", "วนแสดงทีละแถว"],
        code: `import numpy as np

z = np.array([-3, -1, 0, 1, 3], dtype=float)
relu = np.maximum(0, z)
sigmoid = 1 / (1 + np.exp(-z))
print(" z    ReLU  Sigmoid")
for a, r, s in zip(z, relu, sigmoid):
    print(f"{a:>4.0f} {r:>6.1f} {s:>8.3f}")`,
        explain: "Sigmoid บีบทุกค่าให้อยู่ 0–1 (z = 0 ได้ 0.5 พอดี) ส่วน ReLU ตัดค่าลบทิ้งเท่านั้น"
      }),
      task("layer แบบ batch", 2, {
        task: "คำนวณ hidden layer ของข้อมูล 2 ตัวอย่างพร้อมกัน: X ขนาด 2×3, W ขนาด 3×2, b = [0.1, −0.2] แล้วผ่าน ReLU",
        given: "X `[[1, 0, 2], [0, 1, 1]]` W `[[0.5, -0.3], [0.2, 0.8], [-0.1, 0.4]]`",
        want: "array ขนาด (2, 2)",
        checklist: ["`X @ W + b` คำนวณทุกตัวอย่างพร้อมกัน", "`np.maximum(0, ...)`", "แสดง shape เพื่อตรวจ"],
        code: `import numpy as np

X = np.array([[1, 0, 2], [0, 1, 1]], dtype=float)
W = np.array([[0.5, -0.3], [0.2, 0.8], [-0.1, 0.4]])
b = np.array([0.1, -0.2])
out = np.maximum(0, X @ W + b)
print(out.shape)
print(out.round(2))`,
        explain: "matrix multiplication คำนวณทุกตัวอย่างและทุก neuron ในคำสั่งเดียว นี่คือเหตุผลที่ GPU ซึ่งคูณเมทริกซ์เร็วมาก สำคัญกับ deep learning"
      }),
      task("loss ของงานจำแนก 2 คลาส", 2, {
        task: "คำนวณ binary cross-entropy ของคำตอบจริง [1, 0, 1, 1] กับความน่าจะเป็นที่ทาย [0.9, 0.2, 0.6, 0.95]",
        given: "y จริง และความน่าจะเป็น p",
        want: "ค่า loss ทศนิยม 3 ตำแหน่ง",
        checklist: ["สูตร `-mean(y*log(p) + (1-y)*log(1-p))`", "ใช้ `np.log`"],
        code: `import numpy as np

y = np.array([1, 0, 1, 1])
p = np.array([0.9, 0.2, 0.6, 0.95])
loss = -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))
print(f"cross-entropy = {loss:.3f}")`,
        explain: "cross-entropy ลงโทษหนักเมื่อมั่นใจแต่ทายผิด เช่น ตอบจริงเป็น 1 แต่ทาย 0.01 จะได้ loss สูงมาก จึงนิยมใช้กับงานจำแนก"
      }),
      task("ฝึกด้วย gradient descent", 3, {
        task: "ใช้ gradient descent หา w, b ของเส้น y = 3x − 2 จากข้อมูล x = 0..9 เริ่มจาก w = b = 0, learning rate 0.01 ฝึก 1000 รอบ แสดงค่าทุก 250 รอบ",
        given: "x = 0..9 และ y = 3x − 2",
        want: "w เข้าใกล้ 3 และ b เข้าใกล้ −2",
        checklist: ["วนรอบ: ทำนาย → error → อัปเดต w, b", "gradient ของ w คือ `2 * mean(error * x)` ของ b คือ `2 * mean(error)`", "พิมพ์เมื่อ `epoch % 250 == 0`"],
        code: `import numpy as np

x = np.arange(10, dtype=float)
y = 3 * x - 2
w, b, lr = 0.0, 0.0, 0.01
for epoch in range(1001):
    error = (w * x + b) - y
    if epoch % 250 == 0:
        print(f"epoch {epoch:>4}: w={w:.3f} b={b:.3f} loss={np.mean(error ** 2):.4f}")
    w -= lr * 2 * np.mean(error * x)
    b -= lr * 2 * np.mean(error)`,
        explain: "loss ลดลงทุกช่วง และ w, b เข้าใกล้คำตอบจริง นี่คือหลักการเดียวกับการฝึก neural network ขนาดใหญ่ ต่างกันแค่จำนวน weight"
      }),
      task("ปรับขนาด network", 3, {
        task: "ฝึก MLPClassifier กับ `load_digits` โดยลอง hidden layer 3 แบบ: (8,), (32,), (64, 32) แล้วเทียบ accuracy",
        given: "load_digits แบ่ง 75/25 random_state=0 stratify, หารข้อมูลด้วย 16",
        want: "accuracy ของ 3 ขนาด",
        checklist: ["วนผ่าน tuple ของขนาด layer", "`MLPClassifier(hidden_layer_sizes=size, max_iter=3000, random_state=0)`", "เทียบ `score` บน test"],
        code: `from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier

X, y = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X / 16, y, test_size=0.25, random_state=0, stratify=y)
for size in [(8,), (32,), (64, 32)]:
    net = MLPClassifier(hidden_layer_sizes=size, max_iter=3000, random_state=0)
    net.fit(X_train, y_train)
    print(f"{str(size):<9} accuracy {net.score(X_test, y_test):.3f}")`,
        explain: "network ที่เล็กเกินไปเรียนรู้รูปแบบได้ไม่พอ การเพิ่มขนาดช่วยได้ถึงจุดหนึ่ง หลังจากนั้นผลเพิ่มขึ้นน้อยแต่ฝึกนานขึ้น จึงควรทดลองและวัดผลบน test เสมอ"
      })
    ])
];
