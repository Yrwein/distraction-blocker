
function cancelRequest(requestDetails) {
  console.log("Blocking: " + requestDetails.url);
  return { cancel: true };
}

function refreshBlocker(enabled, blockedUrls) {
  // set correct browser action icon
  browser.browserAction.setIcon({ path: enabled ? "icons/browser-action-enabled.png" : "icons/browser-action-disabled.png" });

  // refresh listener
  browser.webRequest.onBeforeRequest.removeListener(cancelRequest);
  if (enabled && blockedUrls.length) {
    browser.webRequest.onBeforeRequest.addListener(cancelRequest, { urls: blockedUrls }, [ "blocking" ]);
  }
}

function initialize(settings) {
  function saveSettings() {
    browser.storage.local.set({ settings : {
      enabled: enabled,
      blockedUrls: blockedUrls
    }});
  }

  var enabled = settings.enabled;
  var blockedUrls = settings.blockedUrls;

  refreshBlocker(enabled, blockedUrls);

  browser.browserAction.onClicked.addListener(function () {
    enabled = ! enabled;
    saveSettings();
    refreshBlocker(enabled, blockedUrls);
  });
}

var defaultSettings = {
  enabled: true,
  blockedUrls: [
    "*://*.facebook.com/*"
  ]
}
var settingsPromise = browser.storage.local.get("settings");
settingsPromise.then(function (item) {
  if (item.settings && item.settings[0]) {
    initialize(item.settings[0]);
  } else if (item.settings) {
    initialize(item.settings);
  } else {
    initialize(defaultSettings);
  }
}, function (error) {
  console.log(`Error: ${error}`);
  initialize(defaultSettings);
});
