// สร้างโดย tools/lesson-builder/build.mjs — อย่าแก้ไฟล์นี้ตรง ๆ
// เปิดเว็บได้แม้ไม่มีเน็ต: มีเน็ต = โหลดของใหม่เสมอ (แล้วเก็บสำเนา) · ไม่มีเน็ต = ใช้สำเนาในเครื่อง
var CACHE = "py-d5b9ed2cb6";
var CORE = ["./","index.html","chapters/chapter-01.html","chapters/chapter-02.html","chapters/chapter-03.html","chapters/chapter-04.html","chapters/chapter-05.html","chapters/chapter-06.html","chapters/chapter-07.html","chapters/chapter-08.html","chapters/chapter-09.html","chapters/chapter-10.html","chapters/chapter-11.html","chapters/chapter-12.html","chapters/chapter-13.html","chapters/chapter-14.html","chapters/chapter-15.html","chapters/chapter-16.html","chapters/chapter-17.html","chapters/chapter-18.html","chapters/chapter-19.html","chapters/chapter-20.html","chapters/appendix-a-course.html","chapters/appendix-b-pen.html","chapters/appendix-c-stats.html","chapters/appendix-d-feedback.html","assets/course-extras.css","assets/course-nav.css","assets/course-nav.js","assets/ink.js","assets/lesson.css","assets/lesson.js","assets/python-path.svg","assets/site.css","assets/site.js","assets/widgets.js","assets/icon/prymania.jpg","assets/figures/app-layers.svg","assets/figures/ch14-dice.png","assets/figures/ch14-image.png","assets/figures/ch14-sensor.png","assets/figures/ch16-bar.png","assets/figures/ch16-ex1.png","assets/figures/ch16-ex2.png","assets/figures/ch16-ex3.png","assets/figures/ch16-ex4.png","assets/figures/ch16-ex5.png","assets/figures/ch16-ex6.png","assets/figures/ch16-example-dashboard.png","assets/figures/ch16-example-pandas.png","assets/figures/ch16-first.png","assets/figures/ch16-multi.png","assets/figures/ch16-scatter-hist.png","assets/figures/ch16-thai.png","assets/figures/ch17-regression.png","assets/figures/ch18-digits.png","assets/figures/ch18-loss.png","assets/figures/class-object.svg","assets/figures/function.svg","assets/figures/http.svg","assets/figures/if-flow.svg","assets/figures/input-flow.svg","assets/figures/ml-flow.svg","assets/figures/neuron.svg","assets/figures/numpy-axis.svg","assets/figures/numpy-broadcast.svg","assets/figures/numpy-slicing.svg","assets/figures/string-index.svg","assets/figures/thonny.svg","assets/figures/variables.svg","assets/gui/ch19-bmi.png","assets/gui/ch19-class.png","assets/gui/ch19-ex1.png","assets/gui/ch19-ex2.png","assets/gui/ch19-ex3.png","assets/gui/ch19-ex4.png","assets/gui/ch19-ex5.png","assets/gui/ch19-ex6.png","assets/gui/ch19-first.png","assets/gui/ch19-layout.png","assets/gui/ch19-signal.png","assets/gui/ch19-todo.png","assets/gui/ch20-ex5.png","assets/gui/ch20-planner.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf("py-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  if (/goatcounter.com|gc.zgo.at|script.google(usercontent)?.com/.test(e.request.url)) return;   // สถิติผู้เข้าชม / FAQ (Apps Script): ไม่เก็บลง cache
  e.respondWith(fetch(e.request).then(function (res) {
    if (res && (res.ok || res.type === "opaque")) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
    }
    return res;
  }).catch(function () {
    return caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      return hit || (e.request.mode === "navigate" ? caches.match("index.html") : undefined);
    });
  }));
});
