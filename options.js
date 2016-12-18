
function renderSettings(blockedUrls) {
  document.getElementById("blocked-urls").value = blockedUrls;
}

function initialize(settings) {
  renderSettings(settings.blockedUrls);

  // save new setting on textarea change
  // - the actual saving is delayed for performance reasons
  var saveEventId = null;
  document.getElementById("blocked-urls").addEventListener("keyup", function (e) {
    if (saveEventId) {
      window.clearTimeout(saveEventId);
    }
    saveEventId = window.setTimeout(function () {
      settings.blockedUrls = document.getElementById("blocked-urls").value;
      browser.storage.local.set({ settings : settings });
    }, 100);
  });

  browser.storage.onChanged.addListener(function (changes) {
    settings = changes.settings.newValue;
    renderSettings(settings.blockedUrls);
  });
}

loadSettings(initialize);
