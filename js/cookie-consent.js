(function () {
  var KEY = "ata-cookie-consent-v1";

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

  function makeLink(href, text) {
    return '<a href="' + href + '" target="_self">' + text + "</a>";
  }

  function renderBanner() {
    var banner = document.createElement("aside");
    banner.className = "cookie-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", t("Çerez bildirimi", "Cookie notice"));

    banner.innerHTML =
      '<p class="cookie-consent__text">' +
      t(
        "Bu site, deneyimi iyileştirmek için çerez ve yerel depolama kullanır. " +
          makeLink("/kullanim-kosullari/", "Kullanım Koşulları") +
          " · " +
          makeLink("/gizlilik-politikasi/", "Gizlilik (site)"),
        "This site uses cookies and local storage to improve your experience. " +
          makeLink("/kullanim-kosullari/", "Terms of Use") +
          " · " +
          makeLink("/gizlilik-politikasi/", "Privacy (website)")
      ) +
      "</p>" +
      '<button type="button" class="cookie-consent__linkbtn" data-cookie-open>' +
      t("Çerez detaylarını göster", "Show cookie details") +
      "</button>" +
      '<div class="cookie-consent__details" data-cookie-details hidden>' +
      "<h3>" +
      t("Çerez detayları", "Cookie details") +
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
      '<div class="cookie-consent__actions">' +
      '<button type="button" class="btn btn--primary cookie-consent__btn" data-cookie-accept>' +
      t("Kabul Et", "Accept") +
      "</button>" +
      '<button type="button" class="btn btn--ghost cookie-consent__btn" data-cookie-reject>' +
      t("Reddet", "Reject") +
      "</button>" +
      "</div>";

    banner.addEventListener("click", function (e) {
      var toggle = e.target.closest("[data-cookie-open]");
      if (toggle) {
        var details = banner.querySelector("[data-cookie-details]");
        if (details) details.hidden = !details.hidden;
      }
      var rejectBtn = e.target.closest("[data-cookie-reject]");
      if (rejectBtn) {
        writeConsent("rejected");
        banner.remove();
      }
      var acceptBtn = e.target.closest("[data-cookie-accept]");
      if (acceptBtn) {
        writeConsent("accepted");
        banner.remove();
      }
    });

    document.body.appendChild(banner);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (readConsent()) return;
    renderBanner();
  });
})();
