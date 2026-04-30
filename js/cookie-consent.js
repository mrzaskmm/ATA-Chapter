(function () {
  var KEY = "ata-cookie-consent-v1";
  var v = "";
  try {
    v = localStorage.getItem(KEY) || "";
  } catch (e) {}
  if (v === "accepted" || v === "rejected") return;

  function makeLink(href, text) {
    return '<a href="' + href + '" target="_self">' + text + "</a>";
  }

  var box = document.createElement("aside");
  box.className = "cookie-consent";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Çerez onayı");
  box.innerHTML =
    '<p class="cookie-consent__text">' +
    "Bu site; " +
    makeLink("kullanim-kosullari.html", "Kullanım Koşulları") +
    ", " +
    makeLink("gizlilik-politikasi.html", "Gizlilik Politikası") +
    " ve " +
    '<button type="button" class="cookie-consent__linkbtn" data-cookie-open>Çerezler</button>' +
    " kapsamında çalışır." +
    "</p>" +
    '<div class="cookie-consent__actions">' +
    '<button type="button" class="btn btn--primary cookie-consent__btn" data-cookie-accept>Kabul et</button>' +
    '<button type="button" class="btn btn--outline cookie-consent__btn" data-cookie-reject>Reddet</button>' +
    "</div>" +
    '<div class="cookie-consent__details" data-cookie-details hidden>' +
    "<h3>Çerezler</h3>" +
    "<ul>" +
    "<li><strong>Zorunlu:</strong> tema, dil ve güvenlik için gerekli.</li>" +
    "<li><strong>Analitik:</strong> trafik istatistikleri için kullanılabilir.</li>" +
    "<li><strong>Reklam:</strong> AdSense doğrulama/reklam servisleri için kullanılabilir.</li>" +
    "</ul>" +
    "</div>";

  function closeWith(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {}
    box.remove();
  }

  box.addEventListener("click", function (e) {
    var a = e.target.closest("[data-cookie-accept]");
    if (a) return closeWith("accepted");
    var r = e.target.closest("[data-cookie-reject]");
    if (r) return closeWith("rejected");
    var t = e.target.closest("[data-cookie-open]");
    if (t) {
      var details = box.querySelector("[data-cookie-details]");
      if (details) details.hidden = !details.hidden;
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(box);
  });
})();
