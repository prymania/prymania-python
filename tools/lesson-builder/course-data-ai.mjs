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
Nina,20,12,88
Beam,,8,72
Mali,21,15,
Tom,19,,45
Ploy,22,10,81
`;

const plot = (name) => `assets/figures/${name}.png`;

// ส่วนที่ 3: ข้อมูลและ AI (บทที่ 14–18)
export const dataAi = [
  chapter("NumPy สำหรับการคำนวณตัวเลข", "ai",
    "คำนวณข้อมูลตัวเลขจำนวนมากพร้อมกันด้วย array ซึ่งเป็นพื้นฐานของงาน Data Science และ AI",
    "สร้าง array คำนวณทั้ง array โดยไม่ต้องวนลูป กรองข้อมูลด้วยเงื่อนไข และสรุปค่าตามแถว/คอลัมน์",
    [
      ["array ต่างจาก list อย่างไร",
        "NumPy array เก็บตัวเลขชนิดเดียวกันและคำนวณกับทุกค่าพร้อมกันได้ ส่วน list ต้องวนลูปเอง เริ่มใช้ด้วย `import numpy as np`",
        {
          table: {
            head: ["เขียน", "list", "NumPy array"],
            rows: [
              ["`x * 2`", "`[1, 2, 1, 2]` (ซ้ำรายการ)", "`[2, 4]` (คูณทุกค่า)"],
              ["`x + 10`", "TypeError", "`[11, 12]`"],
              ["ความเร็วกับข้อมูลล้านค่า", "ช้า", "เร็วกว่ามาก"]
            ]
          },
          code: `import numpy as np

prices = np.array([120, 80, 45, 300])
print(prices * 2)
print(prices.shape, prices.dtype)
print([120, 80] * 2)`
        }],
      ["สร้าง array แบบต่าง ๆ",
        "นอกจากแปลงจาก list แล้ว NumPy มีฟังก์ชันสร้าง array ที่ใช้บ่อย",
        {
          table: {
            head: ["คำสั่ง", "ได้"],
            rows: [
              ["`np.arange(0, 10, 2)`", "`[0 2 4 6 8]` (เหมือน range)"],
              ["`np.linspace(0, 1, 5)`", "`[0. 0.25 0.5 0.75 1.]` (แบ่งช่วงเท่า ๆ กัน)"],
              ["`np.zeros(3)` / `np.ones(3)`", "`[0. 0. 0.]` / `[1. 1. 1.]`"],
              ["`np.array([[1, 2], [3, 4]])`", "array 2 มิติ ขนาด (2, 2)"]
            ]
          },
          code: `import numpy as np

print(np.arange(1, 6))
print(np.linspace(0, 100, 5))
grid = np.zeros((2, 3))
print(grid.shape)`
        }],
      ["คำนวณทั้ง array (vectorization)",
        "เครื่องหมายคำนวณทำงานกับทุกค่าทีละตำแหน่ง ทั้ง array กับตัวเลข และ array กับ array ขนาดเท่ากัน",
        {
          code: `import numpy as np

price = np.array([100, 250, 80])
qty = np.array([2, 1, 5])
total = price * qty
print(total)
print(total * 1.07)
print(total.sum())`
        }],
      ["กรองข้อมูลด้วยเงื่อนไข",
        "เปรียบเทียบ array ได้ผลเป็น array ของ True/False (mask) นำไปเลือกเฉพาะค่าที่ตรงเงื่อนไขได้ `np.where` เลือกค่าตามเงื่อนไขทีละตำแหน่ง",
        {
          code: `import numpy as np

scores = np.array([45, 78, 92, 30, 66])
print(scores >= 50)
print(scores[scores >= 50])
print((scores >= 50).sum(), "คนผ่าน")
print(np.where(scores >= 50, "ผ่าน", "ตก"))`
        }],
      ["array 2 มิติและแกน (axis)",
        "array 2 มิติเหมือนตาราง เข้าถึงด้วย `[แถว, คอลัมน์]` เวลาสรุปค่าให้ระบุ `axis`: `axis=0` สรุปลงตามแนวตั้ง (ได้ค่าต่อคอลัมน์) และ `axis=1` สรุปตามแนวนอน (ได้ค่าต่อแถว)",
        {
          figure: figure("numpy-axis.svg", "array 2 มิติ 3 แถว 4 คอลัมน์: axis=0 รวมลงแนวตั้งได้ผลต่อคอลัมน์ axis=1 รวมตามแนวนอนได้ผลต่อแถว"),
          code: `import numpy as np

sales = np.array([[10, 12, 9, 14],
                  [7, 8, 11, 6],
                  [15, 13, 12, 18]])
print(sales[0, 2], sales[2])
print(sales.sum(axis=0))
print(sales.sum(axis=1))`
        }],
      ["ฟังก์ชันสถิติ",
        "array มีฟังก์ชันสรุปข้อมูลในตัว ใช้ได้ทั้งแบบ `arr.mean()` และ `np.mean(arr)`",
        {
          table: {
            head: ["ฟังก์ชัน", "ได้"],
            rows: [
              ["`sum()`, `mean()`", "ผลรวม, ค่าเฉลี่ย"],
              ["`max()`, `min()`", "ค่ามากสุด, น้อยสุด"],
              ["`argmax()`, `argmin()`", "ตำแหน่ง (index) ของค่ามากสุด/น้อยสุด"],
              ["`std()`", "ส่วนเบี่ยงเบนมาตรฐาน"],
              ["`np.round(arr, 2)`", "ปัดทศนิยม"]
            ]
          },
          code: `import numpy as np

temps = np.array([31.5, 33.2, 29.8, 34.6, 32.1])
print(temps.mean().round(2), temps.max())
print("ร้อนสุดวันที่", temps.argmax() + 1)`
        }]
    ],
    [
      {
        title: "ปรับคะแนนทั้งห้อง",
        idea: "บวกคะแนนพิเศษ จำกัดไม่ให้เกิน 100 และสรุปผลโดยไม่ใช้ลูปเลย",
        code: `import numpy as np

scores = np.array([45, 78, 92, 30, 66, 88, 97])
adjusted = np.minimum(scores + 5, 100)

print("ก่อน:", scores)
print("หลัง:", adjusted)
print(f"เฉลี่ย {scores.mean():.1f} → {adjusted.mean():.1f}")
print("ผ่าน", (adjusted >= 50).sum(), "จาก", adjusted.size, "คน")`,
        steps: [
          "`scores + 5` บวกทุกคนพร้อมกัน",
          "`np.minimum(..., 100)` เลือกค่าที่น้อยกว่าทีละตำแหน่ง ค่าที่เกิน 100 จึงกลายเป็น 100",
          "`(adjusted >= 50).sum()` นับ True เป็นจำนวนคนผ่าน"
        ]
      },
      {
        title: "ยอดขายรายสาขา",
        idea: "ใช้ array 2 มิติ (สาขา × วัน) แล้วสรุปตามแกน",
        code: `import numpy as np

branches = ["Bangkok", "Chiang Mai", "Phuket"]
sales = np.array([[120, 135, 98, 150],
                  [80, 92, 101, 88],
                  [60, 75, 70, 95]])

per_branch = sales.sum(axis=1)
per_day = sales.sum(axis=0)
best = per_branch.argmax()

print("รวมรายสาขา:", per_branch)
print("รวมรายวัน:", per_day)
print(f"สาขาที่ขายดีสุด: {branches[best]} ({per_branch[best]})")`,
        steps: [
          "แถว = สาขา คอลัมน์ = วัน",
          "`axis=1` รวมแนวนอนได้ยอดต่อสาขา `axis=0` รวมแนวตั้งได้ยอดต่อวัน",
          "`argmax()` ให้ตำแหน่ง นำไปเปิดชื่อสาขาจาก list"
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
        task: "อุณหภูมิ 7 วัน `[31, 33, 29, 35, 34, 30, 32]` ให้หาค่าเฉลี่ย ค่าสูงสุด และวันที่ร้อนที่สุด (วันที่ 1–7)",
        given: "array อุณหภูมิ 7 ค่า",
        want: "`เฉลี่ย 32.0 สูงสุด 35 (วันที่ 4)`",
        checklist: ["`mean()`, `max()`", "`argmax()` ได้ index เริ่ม 0 ต้อง +1 เป็นวันที่"],
        code: `import numpy as np

temps = np.array([31, 33, 29, 35, 34, 30, 32])
print(f"เฉลี่ย {temps.mean():.1f} สูงสุด {temps.max()} (วันที่ {temps.argmax() + 1})")`,
        explain: "`argmax` บอกตำแหน่ง ไม่ใช่ค่า ใช้เมื่ออยากรู้ว่าค่ามากสุดอยู่ที่ไหน"
      }),
      task("คัดสินค้าราคาเกินงบ", 2, {
        task: "ราคาสินค้า `[250, 1200, 89, 560, 3200, 45]` งบ 600 บาท ให้แสดงสินค้าที่ซื้อได้ จำนวน และราคารวมถ้าซื้อทุกชิ้นที่ซื้อได้",
        given: "array ราคาและงบ 600",
        want: "ราคาที่ ≤ 600, จำนวน 4 ชิ้น, รวม 944",
        checklist: ["สร้าง mask `prices <= 600`", "`prices[mask]` เลือกค่า", "`.size` และ `.sum()`"],
        code: `import numpy as np

prices = np.array([250, 1200, 89, 560, 3200, 45])
affordable = prices[prices <= 600]
print(affordable)
print(f"{affordable.size} ชิ้น รวม {affordable.sum()} บาท")`,
        explain: "mask เป็น array ของ True/False ขนาดเท่าข้อมูล ใช้ในวงเล็บเหลี่ยมเพื่อดึงเฉพาะตำแหน่งที่เป็น True"
      }),
      task("ตัดเกรดทั้งห้อง", 2, {
        task: "ใช้ `np.where` ซ้อนกันตัดเกรดคะแนน `[85, 62, 74, 48, 91]`: ≥ 80 = A, ≥ 60 = B, ที่เหลือ = C",
        given: "array คะแนน 5 ค่า",
        want: "`['A' 'B' 'B' 'C' 'A']`",
        checklist: ["`np.where(เงื่อนไข, ค่าถ้าจริง, ค่าถ้าเท็จ)`", "ใส่ `np.where` อีกชั้นในช่องค่าถ้าเท็จ"],
        code: `import numpy as np

scores = np.array([85, 62, 74, 48, 91])
grades = np.where(scores >= 80, "A", np.where(scores >= 60, "B", "C"))
print(grades)`,
        explain: "`np.where` เหมือน if-else ที่ทำกับทุกตำแหน่งพร้อมกัน ซ้อนได้เมื่อมีหลายเงื่อนไข"
      }),
      task("คะแนนรายวิชา", 3, {
        task: "ตารางคะแนนนักเรียน 3 คน × 4 วิชา ให้หาค่าเฉลี่ยของแต่ละคน ค่าเฉลี่ยของแต่ละวิชา และวิชาที่ยากที่สุด (เฉลี่ยต่ำสุด)",
        given: "`[[80, 72, 90, 65], [70, 68, 85, 60], [90, 75, 95, 70]]` และวิชา Math, Sci, Eng, Thai",
        want: "เฉลี่ยรายคน, เฉลี่ยรายวิชา และ `วิชาที่ยากสุด: Thai`",
        checklist: ["รายคน = เฉลี่ยตามแถว `axis=1`", "รายวิชา = เฉลี่ยตามคอลัมน์ `axis=0`", "`argmin()` หาวิชาเฉลี่ยต่ำสุด"],
        code: `import numpy as np

subjects = ["Math", "Sci", "Eng", "Thai"]
scores = np.array([[80, 72, 90, 65],
                   [70, 68, 85, 60],
                   [90, 75, 95, 70]])
print("รายคน:", scores.mean(axis=1).round(2))
by_subject = scores.mean(axis=0).round(2)
print("รายวิชา:", by_subject)
print("วิชาที่ยากสุด:", subjects[by_subject.argmin()])`,
        explain: "จำง่าย ๆ: `axis` คือแกนที่ถูก “ยุบ” หายไป `axis=1` ยุบคอลัมน์ทิ้งเหลือค่าต่อแถว"
      }),
      task("ปรับสเกลข้อมูล", 3, {
        task: "ปรับส่วนสูง `[150, 165, 172, 180, 158]` ให้อยู่ในช่วง 0–1 ด้วยสูตร (x − min) / (max − min) ซึ่งเป็นขั้นเตรียมข้อมูลก่อนใช้ ML",
        given: "array ส่วนสูง 5 ค่า",
        want: "ค่าตั้งแต่ 0.0 ถึง 1.0 ทศนิยม 2 ตำแหน่ง",
        checklist: ["หา `min()` และ `max()`", "ใช้สูตรกับทั้ง array ครั้งเดียว", "ตรวจว่าค่าน้อยสุดได้ 0 มากสุดได้ 1"],
        code: `import numpy as np

heights = np.array([150, 165, 172, 180, 158])
scaled = (heights - heights.min()) / (heights.max() - heights.min())
print(scaled.round(2))`,
        explain: "การปรับให้ทุก feature อยู่ในช่วงเดียวกัน (min-max scaling) ช่วยให้โมเดล ML บางแบบเรียนรู้ได้ดีขึ้น จะได้ใช้อีกครั้งในบทที่ 17"
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
    "name": ["Nina", "Beam", "Mali"],
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
