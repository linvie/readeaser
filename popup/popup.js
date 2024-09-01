document.addEventListener("DOMContentLoaded", (event) => {
  function updateRangeColor(range, value) {
    const max = range.max || 100;
    const min = range.min || 0;

    const percentage =
      ((((value - min) / (max - min)) * 13) / 15 + 1 / 15) * 100;

    range.style.background = `linear-gradient(to right, var(--primary-color) ${percentage}%, var(--input-right) ${percentage}%)`;
  }

  function realTimeColor(el) {
    el.addEventListener("input", function () {
      updateRangeColor(el, this.value);
    });
  }

  //font-family
  const selectElement = document.querySelector("select");
  chrome.storage.local.get(["weread-fontFamily"], (result) => {
    selectElement.value = result["weread-fontFamily"] || "系统字体";
  });

  selectElement.addEventListener("change", (e) => {
    const value = e.target.value;
    if (value != "addfont") {
      chrome.storage.local.set({ "weread-fontFamily": value });
      chrome.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { fontFamily: value }, () => {
            console.log("send to" + tabs[0].id + { fontFamily: value });
          });
        })
        .catch((error) => {
          console.error("An error occurred: " + error);
        });
    } else {
      chrome.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { message: "localfont" }, () => {
            console.log("sended!");
          });
        })
        .catch((error) => {
          console.error("An error occurred: " + error);
        });
    }
  });

  //background
  const radioButton = document.querySelectorAll(
    "input[type='radio'][name='bg-color']"
  );
  chrome.storage.local.get(["weread-bgcolor"]).then((res) => {
    const color = res["weread-bgcolor"];
    if (color) {
      radioButton.forEach((radio) => {
        if (radio.value === color) {
          radio.checked = true;
        }
      });
    }
  });
  radioButton.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.checked) {
        const value = e.target.value;
        chrome.storage.local.set({ "weread-bgcolor": value }).then(() => {
          console.log("success!");
        });
        chrome.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { bgcolor: value });
          });
      }
    });
  });

  //fontSize
  const fontSize = document.querySelector("input[type='range'][id='fontSize']");
  realTimeColor(fontSize);
  chrome.storage.local.get(["weread-fontSize"]).then((res) => {
    fontSize.value = res["weread-fontSize"] || 3;
    updateRangeColor(fontSize, fontSize.value);
  });
  fontSize.addEventListener("change", (e) => {
    if (e.target.value) {
      chrome.storage.local
        .set({ "weread-fontSize": e.target.value })
        .then(() => {
          console.log("fontSize changed to" + e.target.value);
        });
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { fontSize: e.target.value });
      });
      updateRangeColor(fontSize, e.target.value);
    }
  });

  //topBar
  const topBar = document.querySelector("#topbar");
  realTimeColor(topBar);
  chrome.storage.local.get(["weread-topbar"]).then((res) => {
    topBar.value = res["weread-topbar"] || 0;
    updateRangeColor(topBar, topBar.value);
  });
  topBar.addEventListener("change", (e) => {
    const value = e.target.value;
    if (value) {
      chrome.storage.local.set({ "weread-topbar": value });
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { topBar: value });
      });
      updateRangeColor(topBar, value);
    }
  });

  //pagewidth
  const pw = document.querySelector("#pagewidth");
  realTimeColor(pw);
  chrome.storage.local.get(["weread-pagewidth"]).then((res) => {
    pw.value = res["weread-pagewidth"] || 70;
    updateRangeColor(pw, pw.value);
  });
  pw.addEventListener("change", (e) => {
    const value = e.target.value;
    if (value) {
      chrome.storage.local.set({ "weread-pagewidth": value });
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { pageWidth: value });
      });
      updateRangeColor(pw, value);
    }
  });

  //autoRead
  const speed = document.querySelector("#autoread");
  realTimeColor(speed);
  chrome.storage.local.get(["weread-autospeed"]).then((res) => {
    speed.value = res["weread-autospeed"] || 0;
    updateRangeColor(speed, speed.value);
  });
  speed.addEventListener("change", (e) => {
    const value = e.target.value;
    if (value) {
      chrome.storage.local.set({ "weread-autospeed": value });
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { autoSpeed: value });
      });
      updateRangeColor(speed, value);
    }
  });

  //focusMode
  const focus = document.querySelectorAll("input[name='dyslexia']");
  chrome.storage.local.get(["weread-focusMode"]).then((res) => {
    const mode = res["weread-focusMode"];
    if (mode) {
      focus.forEach((f) => {
        if (f.value == mode) {
          f.checked = true;
        }
      });
    }
  });

  focus.forEach((f) => {
    f.addEventListener("change", (e) => {
      if (e.target.value) {
        const focusMode = e.target.value;
        chrome.storage.local.set({ "weread-focusMode": focusMode });
        chrome.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { focusMode: focusMode });
          });
      }
    });
  });

  //link
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    (function () {
      var ln = links[i];
      var location = ln.href;
      ln.onclick = function () {
        chrome.tabs.create({ active: true, url: location });
      };
    })();
  }

  //option_page
  const sync = document.querySelector(".sync");
  chrome.storage.local.get(["readeaser-sync"]).then((res) => {
    const syncColor = res["readeaser-sync"] || "sync";
    if (syncColor === "sync") {
      document.querySelector("body").classList.remove("normal");
      document.querySelector("body").classList.add("light_default_contrast");
    } else {
      sync.classList.toggle("on");
      document
        .querySelector("body")
        .classList.remove("light_default_contrast");
      document.querySelector("body").classList.add("normal");
    }
  })
  sync.addEventListener("click", () => {
    sync.classList.toggle("on");
    if (sync.classList.contains("on")) {
      if (document.querySelector("body").classList.contains("normal")) {
        document.querySelector("body").classList.remove("normal");
        document.querySelector("body").classList.add("light_default_contrast");
        chrome.storage.local.set({ "readeaser-sync": "sync" });
        // location.reload();
      }
    } else {
      if (
        document
          .querySelector("body")
          .classList.contains("light_default_contrast")
      ) {
        document
          .querySelector("body")
          .classList.remove("light_default_contrast");
        document.querySelector("body").classList.add("normal");
        chrome.storage.local.set({ "readeaser-sync": "unsync" });
        // location.reload();
      }
    }
  });

  document.querySelector(".settings").addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("../options/index.html"));
    }
  });
});
