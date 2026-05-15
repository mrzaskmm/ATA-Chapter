(function () {
  var STORAGE_KEY = "ata-launch-announcement-v1";
  var BODY_CLASS = "launch-announcement-open";

  function isDismissed() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "dismissed";
    } catch (e) {
      return false;
    }
  }

  function persistDismissed() {
    try {
      localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch (e) {}
  }

  function focusFirst(panel) {
    var focusables = panel.querySelectorAll(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    var first = focusables[0];
    if (first && typeof first.focus === "function") {
      try {
        first.focus({ preventScroll: true });
      } catch (e) {
        first.focus();
      }
    }
  }

  function openAnnouncement(modal) {
    modal.removeAttribute("hidden");
    document.body.classList.add(BODY_CLASS);
    var panel = modal.querySelector(".launch-announcement__panel");
    if (panel) focusFirst(panel);
  }

  function closeAnnouncement(modal) {
    var checkbox = modal.querySelector("[data-launch-dont-show]");
    if (checkbox && checkbox.checked) {
      persistDismissed();
    }
    modal.setAttribute("hidden", "");
    document.body.classList.remove(BODY_CLASS);
  }

  function bindEvents(modal) {
    modal.addEventListener("click", function (e) {
      var closer = e.target.closest("[data-launch-close]");
      if (closer) {
        e.preventDefault();
        closeAnnouncement(modal);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (modal.hasAttribute("hidden")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeAnnouncement(modal);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("launch-announcement");
    if (!modal) return;
    bindEvents(modal);
    if (isDismissed()) return;
    window.setTimeout(function () {
      openAnnouncement(modal);
    }, 350);
  });
})();
