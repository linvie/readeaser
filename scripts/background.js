chrome.runtime.setUninstallURL(
  "https://docs.qq.com/form/page/DQWZMYlFFS0VEV1Vu"
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getFont") {
    const request = indexedDB.open("readeaserDB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["fonts"], "readonly");
      const store = transaction.objectStore("fonts");

      const fontRequest = store.get(message.fontName);
      fontRequest.onsuccess = (e) => {
        const fontData = e.target.result?.data;
        if (fontData) {
          // const blob = new Blob([item.data]);
          // let imageUrl = URL.createObjectURL(blob);
          sendResponse({ data: fontData });
        } else {
          sendResponse({ error: "Font not found" });
        }
      };

      fontRequest.onerror = () =>
        sendResponse({ error: "Failed to retrieve font" });
    };

    request.onerror = () => sendResponse({ error: "Failed to open IndexedDB" });

    return true;
  }

  if (message.action === "getTheme") {
    const request = indexedDB.open("readeaserDB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["theme"], "readonly");
      const store = transaction.objectStore("theme");

      const fontRequest = store.get(message.themeName);
      fontRequest.onsuccess = (e) => {
        const fontData = e.target.result?.data;
        if (fontData) {
          sendResponse({ data: fontData });
        } else {
          sendResponse({ error: "Font not found" });
        }
      };

      fontRequest.onerror = () =>
        sendResponse({ error: "Failed to retrieve font" });
    };

    request.onerror = () => sendResponse({ error: "Failed to open IndexedDB" });

    return true;
  }
});
