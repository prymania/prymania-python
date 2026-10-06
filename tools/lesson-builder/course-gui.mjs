import { chapter, task, figure } from "./course-helpers.mjs";

const shot = (name, demo = "") => ({ file: `assets/gui/${name}.png`, demo });

const coursesCsv = `code,name,credits,min_score,track
CS101,Python Programming,3,0,core
CS102,Data Structures,3,55,core
DS201,Data Analysis with pandas,3,60,data
DS202,Data Visualization,2,60,data
AI301,Machine Learning,3,70,ai
AI302,Neural Networks,3,80,ai
UI201,GUI with PySide6,2,55,app
`;

const historyCsv = `study_hours,prior_score,passed
2,45,0
3,50,0
4,62,0
5,58,1
6,70,1
7,65,1
8,75,1
3,72,0
9,80,1
1,55,0
6,52,0
8,68,1
`;

// ส่วนที่ 4: GUI และโปรเจกต์ (บทที่ 19–20)
export const guiProject = [
  chapter("สร้าง GUI สมัยใหม่ด้วย PySide6", "gui",
    "สร้างแอปที่มีหน้าต่าง ปุ่ม และช่องกรอกข้อมูลด้วย PySide6 (Qt for Python)",
    "สร้างหน้าต่างด้วย widget จัดวางด้วย layout เชื่อมปุ่มกับฟังก์ชันด้วย signal/slot และเขียนแอปเป็น class",
    [
      ["โครงสร้างแอปพื้นฐาน",
        "ทุกแอป PySide6 มี 4 ขั้น: สร้าง `QApplication` 1 ตัว → สร้างหน้าต่าง → `show()` → `app.exec()` เพื่อรอรับการคลิก/พิมพ์จากผู้ใช้จนกว่าจะปิดหน้าต่าง ติดตั้งด้วย `pip install PySide6`",
        {
          window: shot("ch19-first"),
          code: `import sys
from PySide6.QtWidgets import QApplication, QLabel

app = QApplication(sys.argv)
label = QLabel("สวัสดี PySide6!")
label.setWindowTitle("แอปแรก")
label.resize(280, 100)
label.show()
sys.exit(app.exec())`,
          tip: "โค้ดหลัง `app.exec()` จะทำงานเมื่อปิดหน้าต่างแล้วเท่านั้น"
        }],
      ["widget ที่ใช้บ่อย",
        "widget คือส่วนประกอบบนหน้าจอ ทุกตัว import จาก `PySide6.QtWidgets`",
        {
          table: {
            head: ["widget", "ใช้ทำ", "อ่าน/ตั้งค่า"],
            rows: [
              ["`QLabel`", "แสดงข้อความ", "`setText()`"],
              ["`QPushButton`", "ปุ่มกด", "signal `clicked`"],
              ["`QLineEdit`", "ช่องกรอกข้อความ 1 บรรทัด", "`text()`, `setPlaceholderText()`"],
              ["`QSpinBox` / `QDoubleSpinBox`", "ช่องตัวเลขมีปุ่มเพิ่ม/ลด", "`value()`, `setRange()`"],
              ["`QComboBox`", "รายการให้เลือก", "`addItems()`, `currentText()`"],
              ["`QCheckBox`", "ช่องติ๊ก", "`isChecked()`"],
              ["`QListWidget`", "รายการหลายบรรทัด", "`addItem()`, `count()`"]
            ]
          }
        }],
      ["layout: จัดวาง widget",
        "ใช้ layout แทนการกำหนดพิกัดเอง หน้าต่างจะปรับขนาดได้สวยงาม `QVBoxLayout` เรียงแนวตั้ง `QHBoxLayout` เรียงแนวนอน `QFormLayout` จัดเป็นคู่ ป้าย–ช่องกรอก และซ้อน layout กันได้",
        {
          window: shot("ch19-layout"),
          code: `import sys
from PySide6.QtWidgets import (QApplication, QWidget, QVBoxLayout, QHBoxLayout,
                               QFormLayout, QLineEdit, QPushButton)

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("ลงทะเบียน")

form = QFormLayout()
form.addRow("ชื่อ", QLineEdit())
form.addRow("อีเมล", QLineEdit())

buttons = QHBoxLayout()
buttons.addWidget(QPushButton("ยกเลิก"))
buttons.addWidget(QPushButton("บันทึก"))

layout = QVBoxLayout(window)
layout.addLayout(form)
layout.addLayout(buttons)
window.resize(320, 140)
window.show()
sys.exit(app.exec())`
        }],
      ["signal และ slot: ทำงานเมื่อผู้ใช้กด",
        "เมื่อผู้ใช้ทำอะไรกับ widget จะเกิด signal เช่น ปุ่มส่ง `clicked` เราเชื่อม signal กับฟังก์ชัน (slot) ด้วย `.connect(ฟังก์ชัน)` ใส่แค่ชื่อฟังก์ชัน ไม่ต้องมีวงเล็บ",
        {
          window: shot("ch19-signal", "name.setText('Nina')\nbutton.click()"),
          code: `import sys
from PySide6.QtWidgets import (QApplication, QWidget, QVBoxLayout,
                               QLineEdit, QPushButton, QLabel)

def greet():
    result.setText(f"ยินดีต้อนรับ {name.text()}!")

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("ทักทาย")
name = QLineEdit()
name.setPlaceholderText("พิมพ์ชื่อ")
button = QPushButton("ทักทาย")
result = QLabel("")
button.clicked.connect(greet)

layout = QVBoxLayout(window)
for widget in (name, button, result):
    layout.addWidget(widget)
window.resize(300, 130)
window.show()
sys.exit(app.exec())`,
          tip: "`connect(greet())` ผิด เพราะจะเรียกฟังก์ชันทันทีตอนเริ่มโปรแกรม ต้องเป็น `connect(greet)`"
        }],
      ["เขียนหน้าต่างเป็น class",
        "เมื่อแอปใหญ่ขึ้น ให้สร้าง class ที่สืบทอดจาก `QWidget` สร้าง widget ใน `__init__` เก็บเป็น `self.xxx` และเขียน slot เป็น method โค้ดจะเป็นระเบียบและไม่ต้องใช้ตัวแปร global",
        {
          window: shot("ch19-class", "window.button.click()\nwindow.button.click()\nwindow.button.click()"),
          code: `import sys
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel, QPushButton

class CounterWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("ตัวนับ")
        self.count = 0
        self.label = QLabel("กดแล้ว 0 ครั้ง")
        self.button = QPushButton("กด +1")
        self.button.clicked.connect(self.increase)
        layout = QVBoxLayout(self)
        layout.addWidget(self.label)
        layout.addWidget(self.button)

    def increase(self):
        self.count += 1
        self.label.setText(f"กดแล้ว {self.count} ครั้ง")

app = QApplication(sys.argv)
window = CounterWindow()
window.resize(260, 110)
window.show()
sys.exit(app.exec())`,
          tip: "`super().__init__()` เรียก `__init__` ของ QWidget ก่อน ต้องมีเสมอเมื่อสืบทอดจาก widget"
        }]
    ],
    [
      {
        title: "เครื่องคำนวณ BMI",
        idea: "รับตัวเลขด้วย QDoubleSpinBox คำนวณเมื่อกดปุ่ม และใช้ stylesheet ตกแต่ง",
        window: shot("ch19-bmi", "window.weight.setValue(68)\nwindow.height.setValue(170)\nwindow.button.click()"),
        code: `import sys
from PySide6.QtWidgets import (QApplication, QWidget, QFormLayout,
                               QDoubleSpinBox, QPushButton, QLabel)

class BmiWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("BMI Calculator")
        self.weight = QDoubleSpinBox(suffix=" kg", maximum=300)
        self.height = QDoubleSpinBox(suffix=" cm", maximum=250)
        self.button = QPushButton("คำนวณ")
        self.result = QLabel("กรอกข้อมูลแล้วกดคำนวณ")
        self.button.clicked.connect(self.calculate)

        form = QFormLayout(self)
        form.addRow("น้ำหนัก", self.weight)
        form.addRow("ส่วนสูง", self.height)
        form.addRow(self.button)
        form.addRow(self.result)
        self.setStyleSheet("QPushButton { background: #192044; color: white; padding: 6px; }"
                           "QLabel#result { font-size: 16px; }")
        self.result.setObjectName("result")

    def calculate(self):
        h = self.height.value() / 100
        if h == 0:
            self.result.setText("กรุณากรอกส่วนสูง")
            return
        bmi = self.weight.value() / (h * h)
        level = "ปกติ" if 18.5 <= bmi < 23 else "ควรดูแลสุขภาพ"
        self.result.setText(f"BMI {bmi:.1f} ({level})")

app = QApplication(sys.argv)
window = BmiWindow()
window.resize(300, 170)
window.show()
sys.exit(app.exec())`,
        steps: [
          "QDoubleSpinBox รับเฉพาะตัวเลข จึงไม่ต้องแปลงข้อความหรือดัก ValueError เอง",
          "method `calculate` ทำงานเมื่อกดปุ่ม อ่านค่าด้วย `value()` แล้วแสดงผลด้วย `setText()`",
          "`setStyleSheet` ตกแต่งด้วยรูปแบบคล้าย CSS ภาพด้านขวาคือหน้าต่างหลังกรอก 68 kg, 170 cm แล้วกดคำนวณ"
        ]
      },
      {
        title: "แอปรายการสิ่งที่ต้องทำ",
        idea: "เพิ่ม/ลบรายการใน QListWidget และกด Enter ในช่องกรอกเพื่อเพิ่มได้",
        window: shot("ch19-todo", "for t in ['อ่านบทที่ 19', 'ทำแบบฝึกหัด GUI', 'ส่งโปรเจกต์']:\n    window.entry.setText(t)\n    window.add_task()\nwindow.tasks.setCurrentRow(1)"),
        code: `import sys
from PySide6.QtWidgets import (QApplication, QWidget, QVBoxLayout, QHBoxLayout,
                               QLineEdit, QPushButton, QListWidget, QLabel)

class TodoWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("To-do")
        self.entry = QLineEdit(placeholderText="งานใหม่…")
        add = QPushButton("เพิ่ม")
        remove = QPushButton("ลบที่เลือก")
        self.tasks = QListWidget()
        self.status = QLabel("0 งาน")

        add.clicked.connect(self.add_task)
        self.entry.returnPressed.connect(self.add_task)
        remove.clicked.connect(self.remove_task)

        row = QHBoxLayout()
        row.addWidget(self.entry)
        row.addWidget(add)
        layout = QVBoxLayout(self)
        layout.addLayout(row)
        layout.addWidget(self.tasks)
        layout.addWidget(remove)
        layout.addWidget(self.status)

    def add_task(self):
        text = self.entry.text().strip()
        if text:
            self.tasks.addItem(text)
            self.entry.clear()
        self.status.setText(f"{self.tasks.count()} งาน")

    def remove_task(self):
        for item in self.tasks.selectedItems():
            self.tasks.takeItem(self.tasks.row(item))
        self.status.setText(f"{self.tasks.count()} งาน")

app = QApplication(sys.argv)
window = TodoWindow()
window.resize(340, 300)
window.show()
sys.exit(app.exec())`,
        steps: [
          "`returnPressed` คือ signal เมื่อกด Enter ในช่องกรอก เชื่อมกับ method เดียวกับปุ่มเพิ่มได้",
          "`strip()` แล้วตรวจ `if text:` ป้องกันการเพิ่มงานว่าง",
          "ภาพด้านขวาคือหน้าต่างหลังเพิ่ม 3 งานและเลือกงานที่ 2"
        ]
      }
    ],
    [
      task("หน้าต่างแนะนำตัว", 1, {
        task: "สร้างหน้าต่างชื่อ `About me` ที่มี QLabel 3 บรรทัด (ชื่อ, สาขา, งานอดิเรก) เรียงแนวตั้ง",
        given: "ข้อมูลของตัวเอง",
        want: "หน้าต่างที่มีข้อความ 3 บรรทัด",
        window: shot("ch19-ex1"),
        checklist: ["`QWidget` + `QVBoxLayout`", "`addWidget(QLabel(...))` 3 ครั้ง", "`show()` แล้ว `app.exec()`"],
        code: `import sys
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLabel

app = QApplication(sys.argv)
window = QWidget()
window.setWindowTitle("About me")
layout = QVBoxLayout(window)
for text in ["ชื่อ: Nina", "สาขา: Computer Science", "งานอดิเรก: ถ่ายภาพ"]:
    layout.addWidget(QLabel(text))
window.resize(260, 120)
window.show()
sys.exit(app.exec())`,
        explain: "layout จัดตำแหน่งให้ทั้งหมด เราแค่เพิ่ม widget ตามลำดับที่อยากให้แสดง"
      }),
      task("ปุ่มนับคะแนน", 1, {
        task: "สร้างหน้าต่างที่มี QLabel แสดงคะแนน และปุ่ม `+1` กับ `รีเซ็ต`",
        given: "คะแนนเริ่มที่ 0",
        want: "กด +1 แล้วคะแนนเพิ่ม กดรีเซ็ตแล้วกลับเป็น 0 (ภาพ: หลังกด +1 สองครั้ง)",
        window: shot("ch19-ex2", "window.plus.click()\nwindow.plus.click()"),
        checklist: ["เขียนเป็น class เก็บ `self.score`", "method `add_one` และ `reset`", "`connect` ปุ่มทั้งสอง"],
        code: `import sys
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton

class ScoreWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Score")
        self.score = 0
        self.label = QLabel("คะแนน: 0")
        self.plus = QPushButton("+1")
        reset = QPushButton("รีเซ็ต")
        self.plus.clicked.connect(self.add_one)
        reset.clicked.connect(self.reset)
        row = QHBoxLayout()
        row.addWidget(self.plus)
        row.addWidget(reset)
        layout = QVBoxLayout(self)
        layout.addWidget(self.label)
        layout.addLayout(row)

    def add_one(self):
        self.score += 1
        self.label.setText(f"คะแนน: {self.score}")

    def reset(self):
        self.score = 0
        self.label.setText("คะแนน: 0")

app = QApplication(sys.argv)
window = ScoreWindow()
window.resize(240, 100)
window.show()
sys.exit(app.exec())`,
        explain: "object จำค่า `self.score` ไว้ระหว่างการกดแต่ละครั้ง เหมือน class Counter ในบทที่ 12"
      }),
      task("แปลงอุณหภูมิ", 2, {
        task: "สร้างแอปที่มี QDoubleSpinBox รับองศาเซลเซียส และแสดงฟาเรนไฮต์ทันทีที่ตัวเลขเปลี่ยน (ไม่ต้องกดปุ่ม)",
        given: "องศาเซลเซียส เช่น 37",
        want: "ป้ายแสดง `37.0 °C = 98.6 °F`",
        window: shot("ch19-ex3", "window.celsius.setValue(37)"),
        checklist: ["`setRange(-100, 100)`", "signal `valueChanged` ของ spin box", "เรียก method อัปเดตครั้งแรกใน `__init__` ด้วย"],
        code: `import sys
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QDoubleSpinBox, QLabel

class TempWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Temperature")
        self.celsius = QDoubleSpinBox(suffix=" °C")
        self.celsius.setRange(-100, 100)
        self.result = QLabel()
        self.celsius.valueChanged.connect(self.update_result)
        layout = QVBoxLayout(self)
        layout.addWidget(self.celsius)
        layout.addWidget(self.result)
        self.update_result()

    def update_result(self):
        c = self.celsius.value()
        self.result.setText(f"{c:.1f} °C = {c * 9 / 5 + 32:.1f} °F")

app = QApplication(sys.argv)
window = TempWindow()
window.resize(240, 90)
window.show()
sys.exit(app.exec())`,
        explain: "`valueChanged` เกิดทุกครั้งที่ค่าเปลี่ยน ผู้ใช้จึงเห็นผลทันที การเรียก `update_result()` ใน `__init__` ทำให้ป้ายมีข้อความตั้งแต่เปิดแอป"
      }),
      task("ฟอร์มสั่งเครื่องดื่ม", 2, {
        task: "สร้างฟอร์มด้วย QFormLayout: เลือกเมนูจาก QComboBox (ราคาต่างกัน), จำนวนจาก QSpinBox และติ๊ก `เพิ่มวิปครีม (+10)` แล้วกดปุ่มสรุปราคา",
        given: "เมนู Latte 60, Mocha 65, Tea 45",
        want: "ภาพ: Mocha 2 แก้ว เพิ่มวิป = `รวม 150 บาท`",
        window: shot("ch19-ex4", "window.menu.setCurrentText('Mocha')\nwindow.qty.setValue(2)\nwindow.cream.setChecked(True)\nwindow.button.click()"),
        checklist: ["เก็บราคาใน dict แล้ว `addItems(dict.keys())`", "อ่าน `currentText()`, `value()`, `isChecked()`", "ราคา = (ราคาเมนู + วิป) × จำนวน"],
        code: `import sys
from PySide6.QtWidgets import (QApplication, QWidget, QFormLayout, QComboBox,
                               QSpinBox, QCheckBox, QPushButton, QLabel)

PRICES = {"Latte": 60, "Mocha": 65, "Tea": 45}

class OrderWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Order")
        self.menu = QComboBox()
        self.menu.addItems(PRICES.keys())
        self.qty = QSpinBox(minimum=1, maximum=20)
        self.cream = QCheckBox("เพิ่มวิปครีม (+10)")
        self.button = QPushButton("สรุปราคา")
        self.total = QLabel("-")
        self.button.clicked.connect(self.summarize)
        form = QFormLayout(self)
        form.addRow("เมนู", self.menu)
        form.addRow("จำนวน", self.qty)
        form.addRow(self.cream)
        form.addRow(self.button)
        form.addRow("ราคา", self.total)

    def summarize(self):
        each = PRICES[self.menu.currentText()] + (10 if self.cream.isChecked() else 0)
        self.total.setText(f"รวม {each * self.qty.value()} บาท")

app = QApplication(sys.argv)
window = OrderWindow()
window.resize(280, 180)
window.show()
sys.exit(app.exec())`,
        explain: "ข้อมูลราคาแยกไว้ใน dict ด้านบน เพิ่มเมนูใหม่ได้โดยไม่ต้องแก้ส่วนหน้าต่าง"
      }),
      task("To-do ที่ไม่รับงานซ้ำ", 3, {
        task: "ต่อยอดตัวอย่างแอป To-do: ห้ามเพิ่มงานว่างและงานที่มีอยู่แล้ว โดยแสดงข้อความเตือนสีแดงใน QLabel",
        given: "เพิ่ม `อ่านหนังสือ` 2 ครั้ง",
        want: "ครั้งที่สองขึ้นเตือน `มีงานนี้อยู่แล้ว`",
        window: shot("ch19-ex5", "for t in ['อ่านหนังสือ', 'ออกกำลังกาย', 'อ่านหนังสือ']:\n    window.entry.setText(t)\n    window.add_task()"),
        checklist: ["เก็บชื่องานที่มีใน list หรืออ่านจาก QListWidget", "ตรวจกรณีว่างก่อน แล้วตรวจซ้ำ", "`setStyleSheet(\"color: #c0392b\")` ให้ข้อความเตือนเป็นสีแดง"],
        code: `import sys
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QLineEdit, QListWidget, QLabel

class TodoWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("To-do")
        self.entry = QLineEdit(placeholderText="งานใหม่ แล้วกด Enter")
        self.tasks = QListWidget()
        self.message = QLabel("")
        self.message.setStyleSheet("color: #c0392b")
        self.entry.returnPressed.connect(self.add_task)
        layout = QVBoxLayout(self)
        for widget in (self.entry, self.tasks, self.message):
            layout.addWidget(widget)

    def add_task(self):
        text = self.entry.text().strip()
        existing = [self.tasks.item(i).text() for i in range(self.tasks.count())]
        if not text:
            self.message.setText("กรุณาพิมพ์ชื่องาน")
        elif text in existing:
            self.message.setText("มีงานนี้อยู่แล้ว")
        else:
            self.tasks.addItem(text)
            self.message.setText("")
        self.entry.clear()

app = QApplication(sys.argv)
window = TodoWindow()
window.resize(300, 220)
window.show()
sys.exit(app.exec())`,
        explain: "ตรวจข้อมูลก่อนเพิ่มเหมือนบทที่ 4 แต่แสดงผลบนหน้าต่างแทน `print` ผู้ใช้จึงรู้ทันทีว่าต้องแก้อะไร"
      }),
      task("เครื่องคิดค่าทิป", 3, {
        task: "สร้างแอปที่รับยอดบิล (QDoubleSpinBox) เปอร์เซ็นต์ทิป (QComboBox: 0, 5, 10, 15) และจำนวนคน (QSpinBox) แล้วแสดงยอดต่อคนทันทีเมื่อค่าใดเปลี่ยน",
        given: "บิล 1,250 บาท ทิป 10% 4 คน",
        want: "`คนละ 343.75 บาท`",
        window: shot("ch19-ex6", "window.bill.setValue(1250)\nwindow.tip.setCurrentText('10')\nwindow.people.setValue(4)"),
        checklist: ["เชื่อม `valueChanged` / `currentTextChanged` ทั้ง 3 widget เข้า method เดียว", "ยอดต่อคน = บิล × (1 + ทิป/100) ÷ คน", "`setRange` ให้จำนวนคนเริ่มที่ 1 ป้องกันหารด้วยศูนย์"],
        code: `import sys
from PySide6.QtWidgets import (QApplication, QWidget, QFormLayout, QDoubleSpinBox,
                               QComboBox, QSpinBox, QLabel)

class TipWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Tip calculator")
        self.bill = QDoubleSpinBox(maximum=100000, suffix=" บาท")
        self.tip = QComboBox()
        self.tip.addItems(["0", "5", "10", "15"])
        self.people = QSpinBox(minimum=1, maximum=50)
        self.result = QLabel()
        self.bill.valueChanged.connect(self.update_result)
        self.tip.currentTextChanged.connect(self.update_result)
        self.people.valueChanged.connect(self.update_result)
        form = QFormLayout(self)
        form.addRow("ยอดบิล", self.bill)
        form.addRow("ทิป (%)", self.tip)
        form.addRow("จำนวนคน", self.people)
        form.addRow(self.result)
        self.update_result()

    def update_result(self):
        total = self.bill.value() * (1 + int(self.tip.currentText()) / 100)
        self.result.setText(f"คนละ {total / self.people.value():,.2f} บาท")

app = QApplication(sys.argv)
window = TipWindow()
window.resize(280, 150)
window.show()
sys.exit(app.exec())`,
        explain: "signal หลายตัวต่อเข้า slot เดียวได้ ทุกครั้งที่ค่าใดเปลี่ยนจะคำนวณใหม่ทั้งหมด และ `minimum=1` ป้องกันหารด้วยศูนย์ตั้งแต่ต้นทาง"
      })
    ]),

  chapter("โปรเจกต์ปลายทาง: Course Planner + AI", "gui",
    "รวมทุกอย่างที่เรียนมาเป็นแอปแนะนำรายวิชา: ข้อมูลจาก CSV, กติกาแนะนำ, โมเดลทำนาย และหน้าต่าง PySide6",
    "วางแผนโปรเจกต์ แยกโค้ดเป็นชั้นข้อมูล/logic/UI ทดสอบ logic ด้วย assert เพิ่มโมเดล ML และเชื่อมทุกส่วนเข้ากับหน้าต่าง",
    [
      ["เริ่มจากโจทย์ ไม่ใช่โค้ด",
        "ก่อนเขียนโค้ด ตอบให้ได้ว่าใครใช้ แก้ปัญหาอะไร ใช้ข้อมูลอะไร และผลลัพธ์หน้าตาแบบไหน แล้วแบ่งงานเป็นขั้นเล็ก ๆ ที่ทดสอบได้ทีละขั้น",
        {
          table: {
            head: ["คำถาม", "Course Planner"],
            rows: [
              ["ผู้ใช้", "นักศึกษาที่กำลังเลือกวิชาเรียน"],
              ["ปัญหา", "ไม่รู้ว่าพร้อมลงวิชาไหน และวิชาไหนเสี่ยงไม่ผ่าน"],
              ["ข้อมูล", "รายวิชา (`courses.csv`) และผลการเรียนรุ่นก่อน (`history.csv`)"],
              ["ผลลัพธ์", "รายการวิชาที่แนะนำ + โอกาสผ่านโดยประมาณ"],
              ["ขั้นตอน", "โหลดข้อมูล → กติกาแนะนำ → ทดสอบ → โมเดล → หน้าต่าง"]
            ]
          }
        }],
      ["แยกเป็น 3 ชั้น",
        "แยกโค้ดเป็น ชั้นข้อมูล (อ่านไฟล์) ชั้น logic (กติกาและโมเดล) และชั้น UI (หน้าต่าง) logic ไม่ควรรู้ว่ามีหน้าต่าง จึงทดสอบได้โดยไม่ต้องเปิดแอป และนำไปใช้กับหน้าเว็บหรือ command line ได้ด้วย",
        {
          figure: figure("app-layers.svg", "3 ชั้นของแอป: UI (PySide6) เรียก Logic (recommend, predict) ซึ่งใช้ Data (courses.csv, history.csv) ผ่าน pandas")
        }],
      ["ชั้นข้อมูล: โหลดรายวิชา",
        "ฟังก์ชันชั้นข้อมูลอ่านไฟล์แล้วคืน DataFrame ที่พร้อมใช้ ตรวจคอลัมน์ที่จำเป็นไว้ตรงนี้ ถ้าไฟล์ผิดรูปแบบจะรู้ทันที",
        {
          files: { "courses.csv": coursesCsv },
          code: `import pandas as pd

def load_courses(path="courses.csv"):
    df = pd.read_csv(path)
    required = {"code", "name", "credits", "min_score"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"ไฟล์ขาดคอลัมน์: {missing}")
    return df

courses = load_courses()
print(courses[["code", "name", "min_score"]])`
        }],
      ["ชั้น logic: กติกาแนะนำ + ทดสอบ",
        "เริ่มจากกติกาง่าย ๆ ที่อธิบายได้ (baseline): แนะนำวิชาที่คะแนนพื้นฐานถึงเกณฑ์ แล้วเขียน `assert` ทดสอบกรณีปกติ ค่าขอบ และค่าผิด ทุกครั้งที่แก้โค้ดให้รันทดสอบซ้ำ",
        {
          files: { "courses.csv": coursesCsv },
          code: `import pandas as pd

def recommend(courses, score, max_credits=9):
    if not 0 <= score <= 100:
        raise ValueError("คะแนนต้องอยู่ระหว่าง 0-100")
    ready = courses[courses["min_score"] <= score].sort_values("min_score", ascending=False, kind="stable")
    picked, total = [], 0
    for _, row in ready.iterrows():
        if total + row["credits"] <= max_credits:
            picked.append(row["code"])
            total += row["credits"]
    return picked

courses = pd.read_csv("courses.csv")
assert recommend(courses, 50) == ["CS101"]
assert "AI302" in recommend(courses, 80, max_credits=12)
assert recommend(courses, 0) == ["CS101"]
try:
    recommend(courses, 120)
    raise AssertionError("ควร raise ValueError")
except ValueError:
    pass
print("ผ่านการทดสอบทั้งหมด")
print(recommend(courses, 72))`,
          tip: "`assert เงื่อนไข` จะเงียบถ้าจริง และหยุดโปรแกรมทันทีถ้าเท็จ เป็นการทดสอบแบบง่ายที่สุด"
        }],
      ["เพิ่มโมเดล ML: ทำนายโอกาสผ่าน",
        "ใช้ข้อมูลรุ่นก่อน (ชั่วโมงอ่านหนังสือ, คะแนนพื้นฐาน → ผ่าน/ไม่ผ่าน) ฝึก LogisticRegression ซึ่งให้ความน่าจะเป็นด้วย `predict_proba` ใช้เสริมกติกา ไม่ใช่แทนที่ และต้องบอกผู้ใช้ว่าเป็นค่าประมาณ",
        {
          files: { "history.csv": historyCsv },
          code: `import pandas as pd
from sklearn.linear_model import LogisticRegression

history = pd.read_csv("history.csv")
X = history[["study_hours", "prior_score"]]
model = LogisticRegression().fit(X, history["passed"])

for hours, score in [(3, 60), (7, 72)]:
    new = pd.DataFrame({"study_hours": [hours], "prior_score": [score]})
    chance = model.predict_proba(new)[0, 1]
    print(f"อ่าน {hours} ชม./สัปดาห์ คะแนนพื้นฐาน {score}: โอกาสผ่าน {chance:.0%}")`,
          tip: "ข้อมูล 12 แถวน้อยเกินไปสำหรับงานจริง ตัวอย่างนี้ใช้แสดงวิธีต่อโมเดลเข้ากับแอป ก่อนใช้จริงต้องมีข้อมูลมากพอและแบ่ง train/test วัดผลแบบบทที่ 17"
        }],
      ["ชั้น UI และสิ่งที่ต้องตรวจก่อนส่ง",
        "ชั้น UI แค่รับค่า เรียกฟังก์ชัน logic แล้วแสดงผล ไม่มีกติกาซ่อนอยู่ในหน้าต่าง ก่อนส่งงานให้ตรวจตามรายการนี้",
        {
          table: {
            head: ["ตรวจ", "วิธี"],
            rows: [
              ["logic ถูกต้อง", "รัน assert ทั้งหมดผ่าน รวมค่าขอบและค่าผิด"],
              ["ข้อมูลผิดรูปแบบ", "ลองลบคอลัมน์หรือใส่ค่าว่างใน CSV แล้วดูว่าแจ้ง error ชัดเจน"],
              ["UI ใช้งานได้", "กรอกค่าสุดขอบ (0, 100) กดปุ่มรัว ๆ ปรับขนาดหน้าต่าง"],
              ["สื่อสารข้อจำกัด", "หน้าต่างบอกว่าผลทำนายเป็นค่าประมาณ"],
              ["ติดตั้งได้บนเครื่องอื่น", "มี `requirements.txt` และ README วิธีรัน"]
            ]
          }
        }]
    ],
    [
      {
        title: "Course Planner ฉบับสมบูรณ์",
        idea: "รวมชั้นข้อมูล logic โมเดล และ UI เป็นแอปเดียว (ในงานจริงแยกเป็นไฟล์ data.py, logic.py, app.py)",
        files: { "courses.csv": coursesCsv, "history.csv": historyCsv },
        window: shot("ch20-planner", "window.score.setValue(72)\nwindow.hours.setValue(6)\nwindow.button.click()"),
        code: `import sys
import pandas as pd
from sklearn.linear_model import LogisticRegression
from PySide6.QtWidgets import (QApplication, QWidget, QFormLayout, QSpinBox,
                               QPushButton, QListWidget, QLabel)

# ---- data ----
courses = pd.read_csv("courses.csv")
history = pd.read_csv("history.csv")

# ---- logic ----
def recommend(score, max_credits=9):
    ready = courses[courses["min_score"] <= score].sort_values("min_score", ascending=False, kind="stable")
    picked, total = [], 0
    for _, row in ready.iterrows():
        if total + row["credits"] <= max_credits:
            picked.append(row)
            total += row["credits"]
    return picked

model = LogisticRegression().fit(history[["study_hours", "prior_score"]], history["passed"])

def pass_chance(hours, score):
    new = pd.DataFrame({"study_hours": [hours], "prior_score": [score]})
    return model.predict_proba(new)[0, 1]

# ---- UI ----
class PlannerWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Course Planner + AI")
        self.score = QSpinBox(maximum=100)
        self.hours = QSpinBox(maximum=40, suffix=" ชม./สัปดาห์")
        self.button = QPushButton("แนะนำวิชา")
        self.courses = QListWidget()
        self.chance = QLabel("")
        note = QLabel("* โอกาสผ่านเป็นค่าประมาณจากข้อมูลรุ่นก่อน ใช้ประกอบการตัดสินใจเท่านั้น")
        note.setWordWrap(True)
        note.setStyleSheet("color: #62677b; font-size: 11px")
        self.button.clicked.connect(self.show_plan)
        form = QFormLayout(self)
        form.addRow("คะแนนพื้นฐาน", self.score)
        form.addRow("เวลาอ่านหนังสือ", self.hours)
        form.addRow(self.button)
        form.addRow(self.courses)
        form.addRow(self.chance)
        form.addRow(note)

    def show_plan(self):
        self.courses.clear()
        plan = recommend(self.score.value())
        for row in plan:
            self.courses.addItem(f"{row['code']}  {row['name']} ({row['credits']} หน่วยกิต)")
        chance = pass_chance(self.hours.value(), self.score.value())
        self.chance.setText(f"แนะนำ {len(plan)} วิชา · โอกาสผ่านโดยประมาณ {chance:.0%}")

app = QApplication(sys.argv)
window = PlannerWindow()
window.resize(430, 330)
window.show()
sys.exit(app.exec())`,
        steps: [
          "ชั้น data และ logic อยู่ด้านบน ไม่มีโค้ด PySide6 ปนเลย จึงทดสอบแยกได้",
          "`show_plan` ใน UI แค่อ่านค่า เรียก `recommend` และ `pass_chance` แล้วแสดงผล",
          "ภาพด้านขวาคือหน้าต่างหลังกรอกคะแนน 72 อ่าน 6 ชม./สัปดาห์ แล้วกดแนะนำวิชา"
        ]
      },
      {
        title: "ทดสอบ logic แบบรวม",
        idea: "รวมกรณีทดสอบไว้ในตาราง แล้ววนตรวจทีละกรณีพร้อมรายงานผล",
        files: { "courses.csv": coursesCsv },
        code: `import pandas as pd

courses = pd.read_csv("courses.csv")

def recommend(score, max_credits=9):
    if not 0 <= score <= 100:
        raise ValueError("คะแนนต้องอยู่ระหว่าง 0-100")
    ready = courses[courses["min_score"] <= score].sort_values("min_score", ascending=False, kind="stable")
    picked, total = [], 0
    for _, row in ready.iterrows():
        if total + row["credits"] <= max_credits:
            picked.append(row["code"])
            total += row["credits"]
    return picked

cases = [
    (0, 9, ["CS101"]),
    (55, 9, ["CS102", "UI201", "CS101"]),
    (100, 6, ["AI302", "AI301"]),
]
for score, credits, expected in cases:
    result = recommend(score, credits)
    status = "ผ่าน" if result == expected else f"ไม่ผ่าน (ได้ {result})"
    print(f"score={score:<3} credits={credits}: {status}")`,
        steps: [
          "แต่ละกรณีเก็บ input และผลที่คาดไว้ (expected) เพิ่มกรณีใหม่ได้ง่าย",
          "เลือกกรณีขอบ: คะแนนต่ำสุด, คะแนนพอดีเกณฑ์ (55), และหน่วยกิตจำกัด",
          "เมื่อแก้ logic ในอนาคต รันไฟล์นี้ซ้ำเพื่อยืนยันว่าของเดิมไม่พัง"
        ]
      }
    ],
    [
      task("สรุปข้อมูลรายวิชา", 1, {
        task: "อ่าน `courses.csv` แล้วแสดงจำนวนวิชา หน่วยกิตรวม และจำนวนวิชาในแต่ละ track",
        given: "ไฟล์ courses.csv",
        want: "7 วิชา, 19 หน่วยกิต และจำนวนวิชาต่อ track",
        files: { "courses.csv": coursesCsv },
        checklist: ["`pd.read_csv`", "`len(df)`, `df[\"credits\"].sum()`", "`df[\"track\"].value_counts()`"],
        code: `import pandas as pd

df = pd.read_csv("courses.csv")
print(f"{len(df)} วิชา รวม {df['credits'].sum()} หน่วยกิต")
print(df["track"].value_counts())`,
        explain: "สำรวจข้อมูลก่อนเริ่มเขียน logic ทุกครั้ง จะรู้ว่าข้อมูลมีอะไรและครบหรือไม่"
      }),
      task("กรองวิชาตาม track", 1, {
        task: "เขียนฟังก์ชัน `courses_in_track(df, track)` คืนรายชื่อวิชาใน track ที่กำหนด แล้วทดสอบกับ `data` และ `ai`",
        given: "ไฟล์ courses.csv",
        want: "รายชื่อวิชาของ track data และ ai",
        files: { "courses.csv": coursesCsv },
        checklist: ["กรอง `df[df[\"track\"] == track]`", "คืน `[\"name\"].tolist()`"],
        code: `import pandas as pd

def courses_in_track(df, track):
    return df[df["track"] == track]["name"].tolist()

df = pd.read_csv("courses.csv")
print("data:", courses_in_track(df, "data"))
print("ai:", courses_in_track(df, "ai"))`,
        explain: "ฟังก์ชันรับ DataFrame เป็นพารามิเตอร์ ไม่ได้อ่านไฟล์เอง จึงทดสอบกับข้อมูลชุดอื่นได้ง่าย"
      }),
      task("เขียน assert ทดสอบ", 2, {
        task: "เขียนฟังก์ชัน `level(score)` คืน `beginner` (< 55), `intermediate` (55–69), `advanced` (≥ 70) และเขียน assert ทดสอบค่าขอบทุกจุด",
        given: "ค่าขอบ 0, 54, 55, 69, 70, 100",
        want: "`ผ่านการทดสอบ 6 กรณี`",
        checklist: ["เก็บกรณีทดสอบเป็น list ของ (input, expected)", "วน `assert level(x) == expected`", "ทดสอบทั้งสองฝั่งของทุกขอบ"],
        code: `def level(score):
    if score >= 70:
        return "advanced"
    if score >= 55:
        return "intermediate"
    return "beginner"

cases = [(0, "beginner"), (54, "beginner"), (55, "intermediate"),
         (69, "intermediate"), (70, "advanced"), (100, "advanced")]
for score, expected in cases:
    assert level(score) == expected, f"level({score}) ควรได้ {expected}"
print(f"ผ่านการทดสอบ {len(cases)} กรณี")`,
        explain: "บั๊กเงื่อนไขส่วนใหญ่อยู่ที่ค่าขอบ (เช่น ใช้ `>` แทน `>=`) การทดสอบทั้ง 54/55 และ 69/70 จับได้ทันที"
      }),
      task("วัดผลโมเดลทำนายผ่าน", 2, {
        task: "ฝึก LogisticRegression ด้วย `history.csv` แล้ววัด accuracy กับข้อมูลชุดเดียวกัน และเทียบกับ baseline ที่ทายว่า “ผ่าน” เมื่อคะแนนพื้นฐาน ≥ 60",
        given: "ไฟล์ history.csv",
        want: "accuracy ของ baseline และโมเดล",
        files: { "history.csv": historyCsv },
        checklist: ["baseline: `(df[\"prior_score\"] >= 60).astype(int)`", "accuracy = `(pred == y).mean()`", "อภิปรายว่าข้อมูลน้อยทำให้ผลเชื่อถือได้แค่ไหน"],
        code: `import pandas as pd
from sklearn.linear_model import LogisticRegression

df = pd.read_csv("history.csv")
X, y = df[["study_hours", "prior_score"]], df["passed"]

baseline = (df["prior_score"] >= 60).astype(int)
model = LogisticRegression().fit(X, y)
print(f"baseline accuracy {(baseline == y).mean():.2f}")
print(f"model accuracy    {(model.predict(X) == y).mean():.2f}")`,
        explain: "โมเดลต้องชนะกติกาง่าย ๆ ได้ก่อนจึงคุ้มที่จะใช้ ข้อนี้วัดกับข้อมูลที่ใช้ฝึกซึ่งให้ผลดีเกินจริง กับข้อมูลจริงควรแบ่ง train/test แบบบทที่ 17"
      }),
      task("หน้าต่างค้นหาวิชา", 3, {
        task: "สร้างหน้าต่าง PySide6 ที่มี QComboBox เลือก track และ QListWidget แสดงวิชาใน track นั้น อัปเดตทันทีเมื่อเปลี่ยนตัวเลือก",
        given: "ไฟล์ courses.csv",
        want: "ภาพ: เลือก track `data` แล้วแสดง 2 วิชา",
        files: { "courses.csv": coursesCsv },
        window: shot("ch20-ex5", "window.track.setCurrentText('data')"),
        checklist: ["`addItems(sorted(df[\"track\"].unique()))`", "เชื่อม `currentTextChanged` กับ method อัปเดตรายการ", "แยกฟังก์ชันกรองข้อมูลไว้นอก class"],
        code: `import sys
import pandas as pd
from PySide6.QtWidgets import QApplication, QWidget, QVBoxLayout, QComboBox, QListWidget

courses = pd.read_csv("courses.csv")

def courses_in_track(track):
    rows = courses[courses["track"] == track]
    return [f"{r.code} {r.name}" for r in rows.itertuples()]

class TrackWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Course finder")
        self.track = QComboBox()
        self.track.addItems(sorted(courses["track"].unique()))
        self.list = QListWidget()
        self.track.currentTextChanged.connect(self.refresh)
        layout = QVBoxLayout(self)
        layout.addWidget(self.track)
        layout.addWidget(self.list)
        self.refresh(self.track.currentText())

    def refresh(self, track):
        self.list.clear()
        self.list.addItems(courses_in_track(track))

app = QApplication(sys.argv)
window = TrackWindow()
window.resize(320, 200)
window.show()
sys.exit(app.exec())`,
        explain: "`currentTextChanged` ส่งข้อความที่เลือกมาเป็นอาร์กิวเมนต์ให้ slot โดยตรง ฟังก์ชันกรองอยู่นอก class จึงเป็นชั้น logic ที่ทดสอบแยกได้"
      }),
      task("ขยายโปรเจกต์ด้วยตัวเอง", 3, {
        task: "เพิ่มฟีเจอร์ให้ `recommend`: รับ `track` (ไม่บังคับ) เพื่อแนะนำเฉพาะ track ที่สนใจ แต่ต้องรวม `core` เสมอ พร้อม assert ทดสอบอย่างน้อย 3 กรณี",
        given: "ไฟล์ courses.csv",
        want: "`ผ่านการทดสอบ` และตัวอย่างผลแนะนำ track ai",
        files: { "courses.csv": coursesCsv },
        checklist: ["พารามิเตอร์ `track=None` (ไม่ส่ง = ทุก track)", "กรอง `track.isin([\"core\", track])` เมื่อมีการระบุ", "ทดสอบ: ไม่ระบุ track, ระบุ ai, ระบุ track ที่ไม่มีในข้อมูล"],
        code: `import pandas as pd

courses = pd.read_csv("courses.csv")

def recommend(score, max_credits=9, track=None):
    pool = courses if track is None else courses[courses["track"].isin(["core", track])]
    ready = pool[pool["min_score"] <= score].sort_values("min_score", ascending=False, kind="stable")
    picked, total = [], 0
    for _, row in ready.iterrows():
        if total + row["credits"] <= max_credits:
            picked.append(row["code"])
            total += row["credits"]
    return picked

assert recommend(75, 12) == ["AI301", "DS201", "DS202", "CS102"]
assert set(recommend(85, 9, track="ai")) <= {"AI301", "AI302", "CS101", "CS102"}
assert recommend(60, 9, track="music") == ["CS102", "CS101"]
print("ผ่านการทดสอบ")
print("track ai:", recommend(85, 9, track="ai"))`,
        explain: "การเพิ่มพารามิเตอร์แบบมีค่าเริ่มต้น `track=None` ทำให้โค้ดเดิมที่เรียก `recommend(score)` ยังทำงานเหมือนเดิม และ assert ช่วยยืนยันว่าฟีเจอร์ใหม่ไม่ทำของเดิมพัง"
      })
    ])
];
