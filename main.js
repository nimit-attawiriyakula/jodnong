/* Language switch, LINE links, QR code, tap-to-copy examples. No tracking, no cookies. */
(function () {
  var C = window.MOMMORIST || {};
  var id = (C.lineId || "").trim();
  var addUrl = "https://line.me/R/ti/p/" + encodeURIComponent(id);
  var startUrl = function (text) {
    return "https://line.me/R/oaMessage/" + encodeURIComponent(id) + "/?" + encodeURIComponent(text);
  };

  // ---------- language ----------
  function setLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-set-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-set-lang") === lang));
    });
    document.querySelectorAll("[data-start]").forEach(function (a) {
      a.href = startUrl(lang === "en" ? "Hello" : "สวัสดี");
    });
    try { localStorage.setItem("mm-lang", lang); } catch (e) {}
  }
  var q = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("mm-lang"); } catch (e) {}
  document.querySelectorAll("[data-set-lang]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-set-lang")); });
  });

  // ---------- fill values from config.js ----------
  var fill = {
    lineid: id, email: C.email, controller: C.controller, "controller-en": C.controllerEn,
    retention: C.retention, "retention-en": C.retentionEn, date: C.policyDate, "date-en": C.policyDateEn
  };
  document.querySelectorAll("[data-fill]").forEach(function (el) {
    var v = fill[el.getAttribute("data-fill")];
    if (v) el.textContent = v;
    if (v && v.indexOf("[") < 0) el.classList.remove("ph");   // highlighted until filled in config.js
  });
  document.querySelectorAll("[data-mail]").forEach(function (a) { a.href = "mailto:" + (C.email || ""); });
  document.querySelectorAll("[data-add]").forEach(function (a) { a.href = addUrl; });
  setLang(q === "en" || q === "th" ? q : (saved || "th"));

  // ---------- QR (desktop) ----------
  var qr = document.getElementById("qr");
  if (qr && window.QRCode) {
    new QRCode(qr, { text: addUrl, width: 136, height: 136, colorDark: "#4a3f33", colorLight: "#ffffff",
                     correctLevel: QRCode.CorrectLevel.M });
  }

  // ---------- tap an example to copy it ----------
  var toast = document.getElementById("toast");
  var timer;
  document.querySelectorAll("code.cmd").forEach(function (el) {
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    var copy = function () {
      var text = el.textContent;
      var done = function () {
        if (!toast) return;
        toast.querySelector(".th").textContent = "คัดลอก '" + text + "' แล้ว นำไปวางในแชทได้เลย";
        toast.querySelector(".en").textContent = "Copied '" + text + "'. Paste it in the chat.";
        toast.classList.add("show");
        clearTimeout(timer);
        timer = setTimeout(function () { toast.classList.remove("show"); }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    };
    el.addEventListener("click", copy);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); copy(); } });
  });
})();
