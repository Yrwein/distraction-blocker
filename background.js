
function cancelRequest(requestDetails) {
  console.log("Blocking: " + requestDetails.url);
  return { cancel: true };
}

function textToBlockedUrls(text) {
  var blockedUrls = text
    .split("\n")
    .map(u => u.trim())
    .filter(u => u)
    .map(u => "*://*." + u + "/*");
  return blockedUrls;
}

function refreshBlocker(enabled, blockedUrlsText) {
  var blockedUrls = textToBlockedUrls(blockedUrlsText);

  // set correct browser action icon
  browser.browserAction.setIcon({ path: enabled ? "icons/browser-action-enabled.png" : "icons/browser-action-disabled.png" });

  // refresh listener
  browser.webRequest.onBeforeRequest.removeListener(cancelRequest);
  if (enabled && blockedUrls.length) {
    browser.webRequest.onBeforeRequest.addListener(cancelRequest, { urls: blockedUrls }, [ "blocking" ]);
  }
}

function initialize(settings) {
  refreshBlocker(settings.enabled, settings.blockedUrls);

  browser.browserAction.onClicked.addListener(function () {
    settings.enabled = ! settings.enabled;
    browser.storage.local.set({ settings : settings });
  });

  browser.storage.onChanged.addListener(function (changes) {
    settings = changes.settings.newValue;
    refreshBlocker(settings.enabled, settings.blockedUrls);
  });
}

loadSettings(initialize);
