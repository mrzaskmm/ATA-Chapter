(function () {
  var KEY = "ata-legal-consent-v2";
  var EJECT_URL = "https://www.google.com";

  function getLang() {
    var l = document.documentElement.getAttribute("data-lang");
    return l === "tr" ? "tr" : "en";
  }

  function t(tr, en) {
    return getLang() === "tr" ? tr : en;
  }

  function readConsent() {
    try {
      return localStorage.getItem(KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function writeConsent(v) {
    try {
      localStorage.setItem(KEY, v);
    } catch (e) {}
  }

  function ejectFromSite() {
    window.location.replace(EJECT_URL);
  }

  function makeLink(href, text) {
    return '<a href="' + href + '" target="_self">' + text + "</a>";
  }

  function renderGate() {
    var gate = document.createElement("section");
    gate.className = "legal-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-label", t("Yasal onay", "Legal consent"));

    gate.innerHTML =
      '<div class="legal-gate__backdrop"></div>' +
      '<div class="legal-gate__panel">' +
      '<h2 class="legal-gate__title">' +
      t("Devam etmeden önce onay gerekli", "Consent required to continue") +
      "</h2>" +
      '<p class="legal-gate__text">' +
      t(
        "Siteyi kullanmak için aşağıdaki metinleri okuyup kabul etmelisiniz:",
        "To use this site, you must read and accept the following:"
      ) +
      "</p>" +
      '<ul class="legal-gate__links">' +
      "<li>" +
      makeLink("kullanim-kosullari.html", t("Kullanım Koşulları", "Terms of Use")) +
      "</li>" +
      "<li>" +
      makeLink(
        "gizlilik-politikasi.html",
        t("Gizlilik Politikası ve Aydınlatma Metni", "Privacy Policy and Disclosure")
      ) +
      "</li>" +
      "<li>" +
      '<button type="button" class="cookie-consent__linkbtn" data-cookie-open>' +
      t("Çerez Onay Metni", "Cookie Consent Notice") +
      "</button>" +
      "</li>" +
      "</ul>" +
      '<div class="cookie-consent__details" data-cookie-details hidden>' +
      "<h3>" +
      t("Çerez Onay Metni", "Cookie Consent Notice") +
      "</h3>" +
      "<ul>" +
      "<li>" +
      t(
        "<strong>Zorunlu:</strong> tema, dil ve güvenlik için gerekli veriler saklanır.",
        "<strong>Required:</strong> theme, language, and security preferences are stored."
      ) +
      "</li>" +
      "<li>" +
      t(
        "<strong>Analitik:</strong> ziyaret istatistikleri hizmet kalitesini artırmak için kullanılabilir.",
        "<strong>Analytics:</strong> visit statistics may be used to improve service quality."
      ) +
      "</li>" +
      "<li>" +
      t(
        "<strong>Reklam:</strong> reklam servisleri kendi çerezlerini kullanabilir.",
        "<strong>Ads:</strong> ad services may set their own cookies."
      ) +
      "</li>" +
      "</ul>" +
      "</div>" +
      '<label class="legal-gate__check">' +
      '<input type="checkbox" data-legal-check>' +
      "<span>" +
      t(
        "Kullanım Koşulları, Gizlilik Politikası ve Çerez Onay Metni'ni okudum, kabul ediyorum.",
        "I have read and agree to the Terms of Use, Privacy Policy, and Cookie Consent Notice."
      ) +
      "</span>" +
      "</label>" +
      '<p class="legal-gate__warn">' +
      t(
        "Bu sitedeki içerik, fikir, tasarım ve uygulama izinsiz kopyalanamaz, taklit edilemez, kötüye kullanılamaz. İhlal halinde hukuki işlem uygulanır.",
        "The content, ideas, design, and application on this site may not be copied, imitated, or misused without permission. Legal action will be taken in case of violations."
      ) +
      "</p>" +
      '<div class="legal-gate__actions">' +
      '<button type="button" class="btn btn--primary cookie-consent__btn" data-cookie-accept disabled>' +
      t("Kabul Et ve Devam Et", "Accept and Continue") +
      "</button>" +
      '<button type="button" class="btn btn--ghost cookie-consent__btn" data-cookie-reject>' +
      t("Kabul Etmiyorum", "I Do Not Accept") +
      "</button>" +
      "</div>" +
      "</div>";

    gate.addEventListener("click", function (e) {
      var toggle = e.target.closest("[data-cookie-open]");
      if (toggle) {
        var details = gate.querySelector("[data-cookie-details]");
        if (details) details.hidden = !details.hidden;
      }
      var rejectBtn = e.target.closest("[data-cookie-reject]");
      if (rejectBtn) {
        writeConsent("rejected");
        ejectFromSite();
      }
      var acceptBtn = e.target.closest("[data-cookie-accept]");
      if (acceptBtn && !acceptBtn.disabled) {
        writeConsent("accepted");
        gate.remove();
      }
    });

    var legalCheck = gate.querySelector("[data-legal-check]");
    var acceptBtn = gate.querySelector("[data-cookie-accept]");
    if (legalCheck && acceptBtn) {
      legalCheck.addEventListener("change", function () {
        acceptBtn.disabled = !legalCheck.checked;
      });
    }

    document.body.appendChild(gate);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var consent = readConsent();
    if (consent === "accepted") return;
    if (consent === "rejected") {
      ejectFromSite();
      return;
    }
    renderGate();
  });
})();
