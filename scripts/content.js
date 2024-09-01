document.addEventListener("DOMContentLoaded", function () {
  function changeFontFamily(fontFamily, fontFamilySetting) {
    if (fontFamily) {
      if (fontFamily == "系统字体") {
        if (fontFamilySetting) {
          fontFamilySetting.parentNode.removeChild(fontFamilySetting);
        }
      } else {
        if (fontFamilySetting) {
          fontFamilySetting.innerHTML =
            "* { font-family: " + fontFamily + " !important; }";
        } else {
          const style = document.createElement("style");
          style.id = "fontFamilySetting";
          style.innerHTML = "* { font-family: " + fontFamily + " !important; }";
          document.head.appendChild(style);
        }
      }
    }
  }

  function activeSetting() {
    function getCurrentMaxWidth(element) {
      let maxWidth = window.getComputedStyle(element).maxWidth;
      return parseInt(maxWidth, 10);
    }
    const rt = readerType();
    let reader;
    if (rt === "N" || rt === "P") {
      reader = document.querySelector(".readerContent .app_content");
    } else {
      reader = document.querySelector(
        ".wr_horizontalReader .readerChapterContent"
      );
    }
    let currentwith = getCurrentMaxWidth(reader);
    let bool;
    chrome.storage.local.get(["width-bool"]).then((b) => {
      bool = b["width-bool"] === undefined ? 1 : b["width-bool"];
      let change = bool == 0 ? -20 : 20;
      bool = bool == 1 ? 0 : 1;
      chrome.storage.local.set({ "width-bool": bool });
      currentwith += change;
      reader.style["max-width"] = currentwith + "px";
      window.dispatchEvent(new Event("resize"));
    });
  }

  function changeFontColor(color) {
    const targetNodes = document.getElementsByClassName("readerChapterContent");
    const targetNode = targetNodes[0];
    targetNode.style.color = color;
  }

  function injectColorCss(color, bgcolor, fontColor) {
    const style = document.createElement("style");
    style.id = "bgcolorSetting";
    style.innerHTML = `
        .wr_whiteTheme {background-color: ${bgcolor} !important;}
        .wr_whiteTheme .readerTopBar,
        .wr_whiteTheme .readerCatalog,
        .wr_whiteTheme .readerControls_item {background-color: ${color};}
        .readerChapterContent {color: ${fontColor} !important;}
        `;
    document.head.appendChild(style);
    document.querySelector(".app_content").style.backgroundColor = color;
    changeFontColor(fontColor);
  }

  function changeColor(color, bgcolor) {
    if (color === "white") {
      if (bgcolor) {
        bgcolor.parentNode.removeChild(bgcolor);
      }
      document.body.classList.add("wr_whiteTheme");
      injectColorCss(0, 0, "#1c1c1d");
    } else if (color === "black") {
      if (bgcolor) {
        bgcolor.parentNode.removeChild(bgcolor);
      }
      document.body.classList.remove("wr_whiteTheme");
      injectColorCss(0, 0, "#b2b2b2");
    } else if (color === "yellow") {
      if (bgcolor) {
        bgcolor.parentNode.removeChild(bgcolor);
      }
      document.body.classList.add("wr_whiteTheme");
      injectColorCss("#F6F2E1", "#FFFDFC", "#1c1c1d");
    } else if (color === "green") {
      if (bgcolor) {
        bgcolor.parentNode.removeChild(bgcolor);
      }
      document.body.classList.add("wr_whiteTheme");
      injectColorCss("#D3EFD1", "#E4FBE5", "#1c1c1d");
    }
  }

  function injectColorCssHorizontal(color, bgcolor, fontColor) {
    const style = document.createElement("style");
    style.id = "bgcolorSetting";
    style.innerHTML = `
        .wr_whiteTheme .readerTopBar,
        .wr_whiteTheme .wr_horizontalReader .readerChapterContent_container {background-color: ${bgcolor} !important;}
        .wr_horizontalReader .readerCatalog,
        .wr_whiteTheme .readerControls_item {background-color: ${color} ;}
        .readerChapterContent {color: ${fontColor} !important;}
        `;
    document.head.appendChild(style);
    document.querySelector(
      ".wr_horizontalReader .readerChapterContent"
    ).style.backgroundColor = color;
    changeFontColor(fontColor);
  }

  function changeColorHorizontal(color, bgcolor) {
    if (color === "white") {
      if (bgcolor) {
        bgcolor.parentNode.removeChild(bgcolor);
      }
      document.body.classList.add("wr_whiteTheme");
      injectColorCssHorizontal(0, 0, "#1c1c1d");
    } else if (color === "black") {
      if (bgcolor) {
        bgcolor.parentNode.removeChild(bgcolor);
      }
      document.body.classList.remove("wr_whiteTheme");
      injectColorCssHorizontal(0, 0, "#b2b2b2");
    } else if (color === "yellow") {
      if (bgcolor) {
        bgcolor.parentNode.removeChild(bgcolor);
      }
      document.body.classList.add("wr_whiteTheme");
      injectColorCssHorizontal("#F6F2E1", "#FFFDFC", "#1c1c1d");
    } else if (color === "green") {
      if (bgcolor) {
        bgcolor.parentNode.removeChild(bgcolor);
      }
      document.body.classList.add("wr_whiteTheme");
      injectColorCssHorizontal("#D3EFD1", "#E4FBE5", "#1c1c1d");
    }
  }

  function colorLoad(color) {
    if (localStorage.getItem("isdark") === "true") {
      activeSetting();
      localStorage.setItem("isdark", "false");
    }
    if (color === "black") {
      activeSetting();
      localStorage.setItem("isdark", "true");
    }
  }

  function readerType() {
    const readerButtons = document.querySelectorAll(
      "button[class*='readerControls_item']"
    );
    let type = "H";
    readerButtons.forEach((button) => {
      if (button.classList.contains("isNormalReader")) {
        type = "N";
      }
    });
    const reader = document.querySelector(".reader_pdfViewer");
    if (reader) {
      type = "P";
    }
    return type;
  }

  const whiteBlack = document.querySelectorAll(
    'button[title="深色"], button[title="浅色"]'
  );
  if (whiteBlack) {
    whiteBlack[0].style.display = "none";
  }

  chrome.storage.local.get(["weread-fontFamily"]).then((result) => {
    const fontFamily = result["weread-fontFamily"];
    const fontFamilySetting = document.getElementById("fontFamilySetting");
    changeFontFamily(fontFamily, fontFamilySetting);
  });

  chrome.runtime.onMessage.addListener(function (message) {
    // console.log("get", message, typeof (message), message.fontFamily)
    const fontFamily = message.fontFamily;
    const fontFamilySetting = document.getElementById("fontFamilySetting");
    if (fontFamily) {
      changeFontFamily(fontFamily, fontFamilySetting);
      activeSetting();
    }
  });

  const readerTp = readerType();
  if (readerTp === "N") {
    chrome.storage.local.get(["weread-bgcolor"]).then((res) => {
      const color = res["weread-bgcolor"];
      const bgcolor = document.getElementById("bgcolorSetting");
      changeColor(color, bgcolor);
      if (color === "black") {
        localStorage.setItem("isdark", "true");
      }
    });

    chrome.runtime.onMessage.addListener(function (message, sender) {
      const color = message.bgcolor;
      if (color) {
        const bgcolor = document.getElementById("bgcolorSetting");
        changeColor(color, bgcolor);
        colorLoad(color);
        window.location.reload();

      }
    });
  } else if (readerTp === "H") {
    chrome.storage.local.get(["weread-bgcolor"]).then((res) => {
      const color = res["weread-bgcolor"];
      const bgcolor = document.getElementById("bgcolorSetting");
      changeColorHorizontal(color, bgcolor);
    });

    chrome.runtime.onMessage.addListener(function (message, sender) {
      const color = message.bgcolor;
      if (color) {
        const bgcolor = document.getElementById("bgcolorSetting");
        changeColorHorizontal(color, bgcolor);
        colorLoad(color);
        window.location.reload();
      }
    });
  }

  function simulateDrag(slider, startX, endX) {
    let mouseDownEvent = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: false,
      clientX: startX,
    });

    let mouseMoveEvent = new MouseEvent("mousemove", {
      bubbles: true,
      cancelable: false,
      clientX: endX,
    });

    let mouseUpEvent = new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: false,
    });

    slider.dispatchEvent(mouseDownEvent);
    slider.dispatchEvent(mouseMoveEvent);
    slider.dispatchEvent(mouseUpEvent);
  }

  if (readerTp != "P") {
    const isexpand = document.getElementsByClassName("readerControls_fontSize");
    if (isexpand) {
      isexpand[0].style.opacity = 0;
    }
  }

  // const downloadApp = document.querySelector("button[title='下载App'");
  // downloadApp.style.display = "none";

  chrome.runtime.onMessage.addListener(function (message) {
    if (message.fontSize) {
      const currentSize = message.fontSize;
      const slider = document.getElementsByClassName("vue-slider-dot-handle");
      let dotFonts = document.querySelector("div[role='slider']");
      const ariaValueNow = parseInt(dotFonts.getAttribute("aria-valuenow"), 10);
      const content = document.querySelector(".readerChapterContent");

      for (let i = 0; i < 8; i++) {
        let classnameNow = "fontLevel" + i;
        if (content.classList.contains(classnameNow)) {
          content.classList.remove(classnameNow);
        }
      }
      const classnameTo = "fontLevel" + currentSize;
      content.classList.add(classnameTo);

      if (readerTp === "N") {
        const isexpand = document.getElementsByClassName(
          "readerControls_fontSize"
        );

        if (!isexpand[0].classList.contains("expand")) {
          isexpand[0].click();
        } else {
          let rect = slider[0].getBoundingClientRect();
          const move = (currentSize - ariaValueNow) * 20;
          simulateDrag(slider[0], rect.left, rect.left + move);
        }
      } else if (readerTp === "H") {
        const isexpand = document.getElementsByClassName(
          "readerControls_fontSize"
        );

        if (isexpand[0]) {
          if (!isexpand[0].classList.contains("expand")) {
            isexpand[0].click();
          } else {
            let rect = slider[0].getBoundingClientRect();
            const move = (currentSize - ariaValueNow) * 20;
            simulateDrag(slider[0], rect.left, rect.left + move);
          }
        }
      }
    }
  });

  function injectTopbarCss(value) {
    const style = document.createElement("style");
    style.id = "topbarSetting";
    style.innerHTML = `
        .wr_horizontalReader .readerChapterContent {margin-top: ${72 - value
      }px !important; height:calc(100% - ${132 - (92 * value) / 52
      }px) !important}
        .readerTopBar {height: ${72 - value}px !important;}
        `;
    document.head.appendChild(style);
  }

  const readerTy = readerType();
  if (readerTy === "N" || readerTy === "P") {
    const topbar = document.querySelector(".readerTopBar");
    let readerControl = document.querySelector(".readerControls");
    chrome.storage.local.get(["weread-topbar"]).then((res) => {
      const value = res["weread-topbar"];
      const tbs = document.getElementById("topbarSetting");
      if (tbs) {
        tbs.parentNode.removeChild(tbs);
      }
      injectTopbarCss(value);

      if (value > 37) {
        topbar.style.opacity = "0";
        let windowTop = 0;
        window.addEventListener("scroll", function () {
          let scrollS =
            window.pageYOffset || document.documentElement.scrollTop;

          if (scrollS > windowTop) {
            readerControl.style.opacity = "0";
          } else {
            readerControl.style.opacity = "1";
          }
          windowTop = scrollS;
        });
      } else {
        let windowTop = 0;
        window.addEventListener("scroll", function () {
          let scrollS =
            window.pageYOffset || document.documentElement.scrollTop;
          if (scrollS > windowTop) {
            topbar.style.opacity = "0";
            readerControl.style.opacity = "0";
          } else {
            topbar.style.opacity = "1";
            readerControl.style.opacity = "1";
          }
          windowTop = scrollS;
        });
      }
    });
    chrome.runtime.onMessage.addListener((message) => {
      const value = message.topBar;
      if (value) {
        const tbs = document.getElementById("topbarSetting");
        if (tbs) {
          tbs.parentNode.removeChild(tbs);
        }
        injectTopbarCss(value);
        if (value > 37) {
          topbar.style.opacity = "0";
          let windowTop = 0;
          window.addEventListener("scroll", function () {
            let scrollS =
              window.pageYOffset || document.documentElement.scrollTop;
            if (scrollS > windowTop) {
              readerControl.style.opacity = "0";
            } else {
              topbar.style.opacity = "0";

              readerControl.style.opacity = "1";
            }
            windowTop = scrollS;
          });
        } else {
          let windowTop = 0;
          window.addEventListener("scroll", function () {
            let scrollS =
              window.pageYOffset || document.documentElement.scrollTop;
            if (scrollS > windowTop) {
              topbar.style.opacity = "0";
              readerControl.style.opacity = "0";
            } else {
              topbar.style.opacity = "1";
              readerControl.style.opacity = "1";
            }
            windowTop = scrollS;
          });
        }
      }
    });
  } else if (readerTy === "H") {
    const topbar = document.querySelector(".readerTopBar");
    chrome.storage.local.get(["weread-topbar"]).then((res) => {
      const value = res["weread-topbar"];
      const tbs = document.getElementById("topbarSetting");
      if (tbs) {
        tbs.parentNode.removeChild(tbs);
      }
      injectTopbarCss(value);
      if (value > 37) {
        topbar.style.opacity = "0";
      } else {
        topbar.style.opacity = "1";
      }
    });
    chrome.runtime.onMessage.addListener((message) => {
      const value = message.topBar;
      if (value) {
        const tbs = document.getElementById("topbarSetting");
        if (tbs) {
          tbs.parentNode.removeChild(tbs);
        }
        injectTopbarCss(value);
        if (value > 37) {
          topbar.style.opacity = "0";
        } else {
          topbar.style.opacity = "1";
        }
      }
      activeSetting();
    });
  }

  function injectPageWidthCss(value) {
    if (readerTp === "N" || readerTp === "P") {
      const readerTopBar = document.querySelector(".readerTopBar");
      const readerContent = document.querySelector(
        ".readerContent .app_content"
      );
      readerContent.style.maxWidth = value + "vw";
      readerTopBar.style.maxWidth = value + "vw";
    } else {
      const style = document.createElement("style");
      style.id = "pagewidthSetting";
      style.innerHTML = `
        .wr_horizontalReader .readerChapterContent {width: ${75 + ((value - 60) / 40) * 23
        }vw !important;}
        // .readerTopBar {max-width: ${value}vw !important;}
        // .readerContent .app_content{max-width:${value}vw !important;}
        `;
      document.head.appendChild(style);
      document.querySelector(
        ".wr_horizontalReader .readerChapterContent"
      ).style.maxWidth = "100vw";
    }
  }

  chrome.storage.local.get(["weread-pagewidth"]).then((res) => {
    const value = res["weread-pagewidth"];
    const tbs = document.getElementById("pagewidthSetting");
    if (tbs) {
      tbs.parentNode.removeChild(tbs);
    }
    injectPageWidthCss(value);
  });
  chrome.runtime.onMessage.addListener((message) => {
    if (message.pageWidth) {
      const tbs = document.getElementById("pagewidthSetting");
      if (tbs) {
        tbs.parentNode.removeChild(tbs);
      }
      injectPageWidthCss(message.pageWidth);
      activeSetting();
      if (readerTp === "N") {
        window.location.reload();
      }
    }
  });

  var autoScrollTimer;

  function autoScroll(time) {
    const distance = 1;
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
    }
    autoScrollTimer = setInterval(function () {
      const beforeScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollBy(0, distance);
      const afterScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;

      if (
        afterScrollTop >= scrollHeight ||
        afterScrollTop === beforeScrollTop
      ) {
        resetAutoScroll();
        setTimeout(() => {
          nextPage();
          setTimeout(() => autoScroll(time), time * 100);
        }, time * 100);
      }
    }, time);
  }

  function nextPage() {
    const event = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      keyCode: 39,
    });
    document.dispatchEvent(event);
    console.log("next");
  }

  function resetAutoScroll() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
    }
  }

  const speeds = [NaN, 40, 30, 25, 20, 10, 5];
  if (readerTp === "N") {
    window.addEventListener("load", (event) => {
      chrome.storage.local.get(["weread-autospeed"]).then((res) => {
        const value = res["weread-autospeed"];
        if (value != 0) {
          autoScroll(speeds[value]);
        } else {
          resetAutoScroll();
        }
      });
    });
    chrome.runtime.onMessage.addListener((message) => {
      const value = message.autoSpeed;
      if (value) {
        if (value != 0) {
          autoScroll(speeds[value]);
        } else {
          resetAutoScroll();
        }
      }
    });
  }

  window.onload = () => {
    loadedFeature();

    chrome.storage.local.get(["readeaser_theme"]).then((res) => {
      const theme = res["readeaser_theme"];
      chrome.runtime.sendMessage(
        { action: "getTheme", themeName: theme },
        (response) => {
          if (response.data) {
            const blob = base64ToBlob(response.data, "application/json");
            readBlobAsJson(blob).then((data) => {
              if (data) {
                console.log(data);
                //font
                const font = data.fontFamily;
                if (font) {
                  const fontFaceExists = [...document.fonts].some(
                    (fontFace) => fontFace.family === font
                  );

                  if (fontFaceExists) {
                    const fontFamilySetting =
                      document.getElementById("fontFamilySetting");
                    changeFontFamily(font, fontFamilySetting);
                  } else {
                    chrome.runtime.sendMessage(
                      { action: "getFont", fontName: font },
                      (response) => {
                        if (response.data) {
                          const newFontFace = new FontFace(
                            font,
                            `url(${response.data})`
                          );
                          newFontFace
                            .load()
                            .then((loadedFace) => {
                              document.fonts.add(loadedFace);
                              const fontFamilySetting =
                                document.getElementById("fontFamilySetting");
                              changeFontFamily(font, fontFamilySetting);

                              //active setting
                              activeSetting();
                              // function simulateKeyPress(keyCode) {
                              //   const event = new KeyboardEvent("keydown", {
                              //     key:
                              //       keyCode === 39 ? "ArrowRight" : "ArrowLeft",
                              //     code:
                              //       keyCode === 39 ? "ArrowRight" : "ArrowLeft",
                              //     keyCode: keyCode,
                              //     which: keyCode,
                              //     bubbles: true,
                              //     cancelable: true,
                              //   });

                              //   document.dispatchEvent(event);
                              // }

                              // simulateKeyPress(37);
                              // simulateKeyPress(39);
                            })
                            .catch((error) => {
                              console.error("Font loading failed:", error);
                              URL.revokeObjectURL(response.fontUrl);
                            });
                        } else {
                          console.error(response.error);
                        }
                      }
                    );
                  }
                }

                if (readerTp === "H") {
                  const bgcolor = document.getElementById("bgcolorSetting");
                  if (bgcolor) {
                    bgcolor.parentNode.removeChild(bgcolor);
                  }
                  if (data.isdark) {
                    document.body.classList.remove("wr_whiteTheme");
                    injectColorCssHorizontal(
                      data.fcolor,
                      data.bcolor,
                      "#b2b2b2"
                    );
                    colorLoad("black");
                  } else {
                    document.body.classList.add("wr_whiteTheme");
                    injectColorCssHorizontal(
                      data.fcolor,
                      data.bcolor,
                      "#1c1c1d"
                    );
                    colorLoad("white");
                  }
                  const read = document.querySelector(
                    ".wr_horizontalReader .readerChapterContent"
                  );

                  if (data.backgroundImage) {
                    read.style.backgroundImage = `url("${data.image}")`;
                    read.style.backgroundRepeat = data.backgroundRepeat;
                    read.style.backgroundPosition = "center";
                    if (data.backgroundRepeat === "repeat") {
                      read.style.backgroundSize = "contain";
                    } else {
                      read.style.backgroundSize = "cover";
                    }
                  }
                } else if (readerTp === "N") {
                  const bgcolor = document.getElementById("bgcolorSetting");
                  if (bgcolor) {
                    bgcolor.parentNode.removeChild(bgcolor);
                  }
                  if (data.isdark) {
                    document.body.classList.remove("wr_whiteTheme");
                    injectColorCss(data.fcolor, data.bcolor, "#b2b2b2");
                    colorLoad("black");
                  } else {
                    document.body.classList.add("wr_whiteTheme");
                    injectColorCss(data.fcolor, data.bcolor, "#1c1c1d");
                    colorLoad("white");
                  }

                  //add mask
                  const body = document.querySelector("body");
                  const content = document.querySelector(".app_content");

                  const contentWidth = content.offsetWidth;
                  const bodyWidth = body.clientWidth;

                  const left = (bodyWidth - contentWidth) / 2;

                  const BackComponent = document.createElement("div");
                  BackComponent.className = "BackComponent";
                  BackComponent.style.cssText = `
        position: fixed;
        top: 0;
        left: ${left}px;
        width: ${contentWidth}px;
        height: 100%;
        background: rgba(0, 0, 0, 0);
        z-index: -1;
    `;

                  body.appendChild(BackComponent);

                  const read = BackComponent;

                  if (data.backgroundImage && data.backgroundImage != "none") {
                    content.style.backgroundColor = "transparent";
                    read.style.backgroundImage = `url("${data.image}")`;
                    read.style.backgroundRepeat = data.backgroundRepeat;
                    read.style.backgroundPosition = "center";
                    if (data.backgroundRepeat === "repeat") {
                      read.style.backgroundSize = "contain";
                    } else {
                      read.style.backgroundSize = "cover";
                    }
                  }
                }
              }
            });
          }
        }
      );
    });
  };
});

function base64ToBlob(base64, contentType) {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

function readBlobAsJson(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const jsonString = event.target.result;
        const data = JSON.parse(jsonString);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = function (event) {
      reject(new Error("读取 Blob 文件时发生错误"));
    };

    reader.readAsText(blob);
  });
}

function loadedFeature() {
  //localfonts
  async function creatList() {
    const fontlist = document.createElement("div")
    fontlist.classList.add("fontlist")
    fontlist.style.cssText =
      `
        width:60%;
        height:60%;
        top:20%;
        left:20%;
        overflow: auto;
        position: fixed;
        background-color: #D3EFD1;
        z-index: 10;
        box-shadow: -20px 20px 20px 0 rgba(0, 0, 0, .1);
        `;
    const textarea = document.createElement("textarea");
    textarea.classList.add("fontSettingPreview")
    textarea.style.cssText =
      `
                width: 90%;
                height: 80px;
                margin: 10px 3%;
                padding: 20px 2%;
                border-radius: 5%;
                background-color: rgba(13, 20, 30, .04);
                appearance:none;
                font-size:24px;
                resize:none;
                font-family:Founderkai !important;
                overflow: hidden;
              `;
    textarea.value = `人生无根蒂，飘如陌上尘。
分散逐风转，此已非常身。`

    const selectDiv = document.createElement("div");
    selectDiv.style.cssText =
      `
                width: 100%;
                height: 80%;
              `;

    fontlist.appendChild(textarea);
    fontlist.appendChild(selectDiv);

    function createFontOption(name, family, style) {
      const text = document.querySelector(".fontSettingPreview")
      let previewText;
      if (text) {
        previewText = text.value.replace(/\n/g, "");
      } else {
        previewText = `人生无根蒂，飘如陌上尘。分散逐风转，此已非常身。`
      }
      const optionDiv = document.createElement("div");
      // optionDiv.classList.add(family)
      optionDiv.style.cssText = `
      height: 80px;
      margin: 0 3%;
      padding: 0 2%;
      border-bottom: .5px solid #dadce0;
      color:#000;
      `
      optionDiv.innerHTML = `
      <div
    class="font_header"
    style="height: 16px; margin-bottom: 8px; font-size: 14px;"
  >
    <h1 style="margin-right: 5px;display: inline-block;"><b>${name}</b></h1>
    <span style="margin-right: 5px">${style}</span>
    <span>| readeaser </span>
  </div>
  <div
    class="previewText"
    style="height: 54px; line-height: 54px; font-size: 24px; overflow: hidden;font-family: ${family} !important"
  >
    ${previewText}
  </div>
      `
      optionDiv.addEventListener('mouseover', function () {
        this.style.backgroundColor = "rgba(0,0,0,.1)";
        this.style.cursor = "pointer";
      });

      optionDiv.addEventListener('mouseout', function () {
        this.style.backgroundColor = '';
      });

      return optionDiv
    }

    const data = await window.queryLocalFonts();
    if (data) {
      data.forEach(item => {
        // console.log(item.fullName, item.family, item.style)
        const optionDiv = createFontOption(item.fullName, item.family, item.style)
        selectDiv.appendChild(optionDiv);
      });
      const body = document.querySelector("body");
      body.appendChild(fontlist);
    } else {
      console.error("Can't reach localfont")
    }

  }
  chrome.runtime.onMessage.addListener(function (message) {
    const list = document.querySelector(".fontlist");
    if (!list) {
      if (message.message === "localfont") {
        creatList();
      }
    }
  });

  //remove button
  const wetype = document.querySelector(".wetype");
  if (wetype) {
    wetype.remove();
  }

  // focus mode
  function readerType() {
    const readerButtons = document.querySelectorAll(
      "button[class*='readerControls_item']"
    );
    let type = "H";
    readerButtons.forEach((button) => {
      if (button.classList.contains("isNormalReader")) {
        type = "N";
      }
    });
    const reader = document.querySelector(".reader_pdfViewer");
    if (reader) {
      type = "P";
    }
    return type;
  }
  const readerTp = readerType();

  if (readerTp === "N") {
    const buttons = document.querySelector(".readerControls");
    const copyBtn = createSlideCopyButton();
    const focusBtn = createSlideFocusButton();
    buttons.insertBefore(copyBtn, buttons.firstChild);
    runCopyDict(copyBtn);
    buttons.insertBefore(focusBtn, buttons.firstChild);
    runFocusMode(focusBtn);

    function createSlideFocusButton() {
      const focusButton = document.createElement("button");
      focusButton.className = "readerControls_item focus";
      focusButton.title = "专注模式";
      const iconURL = chrome.runtime.getURL("image/icons/focuslide.svg");

      const buttonContent = `
  <span class="icon" style="background:url('${iconURL}') no-repeat center;">
  </span>
  `;
      focusButton.innerHTML = buttonContent;

      return focusButton;
    }

    function createSlideCopyButton() {
      const focusButton = document.createElement("button");
      focusButton.className = "readerControls_item copydic";
      focusButton.title = "复制字典内容";
      const iconURL = chrome.runtime.getURL("image/icons/copy.svg");

      const buttonContent = `
  <span class="icon" style="background:url('${iconURL}') no-repeat center; z-index:10">
  </span>
  `;
      focusButton.innerHTML = buttonContent;

      return focusButton;
    }

    function createFocusButton() {
      const focusButton = document.createElement("button");
      focusButton.className = "toolbarItem focus";
      const iconURL = chrome.runtime.getURL("image/icons/focus.svg");

      const buttonContent = `
  <span class="toolbarItem_icon toolbarItem_icon_3" style="background:url('${iconURL}') no-repeat center;">
  </span>
  <span class="toolbarItem_text">专注</span>
`;

      focusButton.innerHTML = buttonContent;

      return focusButton;
    }

    function runCopyDict(copyBtn) {
      copyBtn.addEventListener("click", () => {
        let m = document.querySelector(".readerDictQueryPanel_item");
        if (m) {
          let text = "";
          Array.from(m.children).forEach((child) => {
            text += child.innerText + "\n";
          });
          text = text.trim();
          copyToClipboard(text);
        } else {
          alert("字典不存在");
        }
      });

      function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(
          function () {
            alert("成功将字典内容复制到剪切板");
          },
          function (err) {
            console.error("复制失败: ", err);
          }
        );
      }
    }

    const renderTargetContainer = document.querySelector(
      ".renderTargetContainer"
    );
    let removefocusControl = null;

    const observer = new MutationObserver((mutations) => {
      console.log("observing!");
      for (const mutation of mutations) {
        //   console.log(mutation);
        if (mutation.addedNodes.length) {
          // console.log(Array.from(mutation.addedNodes));
          const readerToolbarContainer = Array.from(mutation.addedNodes).find(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              node.classList &&
              node.classList.contains("reader_toolbar_container")
          );

          if (readerToolbarContainer) {
            const reader_toolbar_itemContainer = document.querySelector(
              ".reader_toolbar_itemContainer"
            );
            const focusButton = createFocusButton();
            if (reader_toolbar_itemContainer)
              reader_toolbar_itemContainer.appendChild(focusButton);
            observer.disconnect();

            runFocusMode(focusButton);
          }
        }
      }
    });

    const config = { childList: true, subtree: true };
    setTimeout(() => {
      const reader_toolbar_container = document.querySelector(
        ".reader_toolbar_container"
      );
      if (reader_toolbar_container) {
        reader_toolbar_container.remove();
        console.log("remove!");
      }
      observer.observe(renderTargetContainer, config);
    }, 1000);
  }

  function runFocusMode(focusButton) {
    if (focusButton) {
      focusButton.addEventListener("click", () => {
        function focusColor(color) {
          switch (color) {
            case "yellow":
              return "rgba(166,123,58, 0.3);";
              break;
            case "green":
              return "rgba(80, 149, 48, 0.3)";
              break;
            default:
              return "rgba(65,134,230, 0.3)";
          }
        }

        function calcHeight() {
          const selections = document.querySelectorAll(".wr_selection");
          const note =
            "设置失败。\n使用专注模式前，请选中两个相邻正文段落，前一段两行、后一段一行以完成设置。";
          if (selections.length < 3) {
            alert(note);
            return;
          } else {
            const heights = Array.from(selections).map((el) =>
              parseFloat(el.style.height)
            );
            const allHeightsAreSame = new Set(heights).size === 1;

            const tops = Array.from(selections)
              .map((el) => parseFloat(el.style.top))
              .sort((a, b) => a - b);

            const topDifferences = new Set(
              tops.slice(1).map((top, i) => top - tops[i])
            );
            const rowHeight = Math.min(...topDifferences);
            const sectionHeight = Math.max(...topDifferences);
            const maxWidth = Math.max(
              ...Array.from(selections).map((el) => parseFloat(el.style.width))
            );
            if (!allHeightsAreSame) {
              alert(
                "设置失败。\n使用专注模式前，请选中两个相邻正文段落，前一段两行、后一段一行以完成设置。\n问题：请选择正文，不应该包括标题或图片！"
              );
              return;
            } else {
              if (topDifferences.size === 1) {
                alert(
                  "设置失败。\n使用专注模式前，请选中两个相邻正文段落，前一段两行、后一段一行以完成设置。\n问题：未选择同一段落中两行或未选择新的段落！"
                );
                return;
              } else if (topDifferences.size > 2) {
                alert(
                  "设置失败。\n使用专注模式前，请选中两个相邻正文段落，前一段两行、后一段一行以完成设置。"
                );
                return;
              } else {
                return [
                  rowHeight,
                  sectionHeight,
                  maxWidth,
                  tops[0],
                  heights[0],
                ];
              }
            }
          }
        }

        function creatFocusComponent(
          mode,
          color,
          maxWidth,
          position,
          lineHeight
        ) {
          const renderTargetContainer = document.querySelector(
            ".renderTargetContainer"
          );
          const divs = renderTargetContainer.querySelectorAll(":scope >div");
          if (mode === "highlight") {
            const focusComponent = document.createElement("div");
            focusComponent.className =
              "wr_underline_wrapper focusMode_component";
            focusComponent.style.cssText = `height:${lineHeight}px;
            width:${maxWidth}px;
            left:0;
            top:${position}px;
            background:${color};
              `;
            focusComponent.innerHTML =
              "<div class='wr_underline wr_underline_mark'></div>";
            divs[divs.length - 3].appendChild(focusComponent);
          } else if (mode === "underline") {
            const focusComponent = document.createElement("div");
            focusComponent.className =
              "wr_underline_wrapper wr_underline_color_3 focusMode_component";
            focusComponent.style.cssText = `height:${lineHeight}px;
            width:${maxWidth}px;
            left:0;
            top:${position}px;
              `;
            focusComponent.innerHTML =
              '<div class="wr_underline wr_underline_straight"><span class="wr_underline_straight_start"></span><span class="wr_underline_straight_middle"></span><span class="wr_underline_straight_end"></span></div>';
            divs[divs.length - 3].appendChild(focusComponent);
          } else if (mode === "linefocus") {
            if (color === "black") {
              alert("深色背景下，聚焦模式不可用");
            } else {
              const focusComponent_mask = document.createElement("div");
              focusComponent_mask.className = "focusMode_component focusMask";
              focusComponent_mask.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0);
              z-index: 10;
              pointer-events: none;
              `;

              const focusComponent_read = document.createElement("div");
              focusComponent_read.className = "focusMode_component focusRead";
              focusComponent_read.style.cssText = `
              position: absolute;
              top: ${position + 2 * lineHeight}px; 
              left: 0;
              width: 100%;
              height: ${lineHeight}px; 
              box-shadow: 0 0 0 10000px rgba(0, 0, 0, 0.75); 
              pointer-events: none;
            `;

              const body = document.querySelector("body");
              body.appendChild(focusComponent_mask);
              body.appendChild(focusComponent_read);
            }
          }
        }

        function focusControl(mode, position, rowHeight, sectionHeight) {
          let read_bar;
          if (mode === "linefocus") {
            read_bar = document.querySelector(".focusRead");
          } else {
            read_bar = document.querySelector(".focusMode_component");
          }
          function handleKeydown(e) {
            if (e.key === "x" || e.key === "X") {
              position += rowHeight;
              read_bar.style.top = position + "px";
              window.scrollBy(0, rowHeight);
            }
            if (e.key === "S" || e.key === "s") {
              position -= rowHeight;
              read_bar.style.top = position + "px";
              window.scrollBy(0, -rowHeight);
            }
            if (e.key === "C" || e.key === "c") {
              position += sectionHeight;
              read_bar.style.top = position + "px";
              window.scrollBy(0, sectionHeight);
            }
            if (e.key === "D" || e.key === "d") {
              position -= sectionHeight;
              read_bar.style.top = position + "px";
              window.scrollBy(0, -sectionHeight);
            }
            if (e.key === "v" || e.key === "V") {
              position += 5;
              read_bar.style.top = position + "px";
              window.scrollBy(0, 5);
            }
            if (e.key === "F" || e.key === "f") {
              position -= 5;
              read_bar.style.top = position + "px";
              window.scrollBy(0, -5);
            }
            if ((e.key === "z" || e.key === "Z") && mode === "linefocus") {
              if (read_bar.style.opacity == "1") {
                read_bar.style.opacity = "0";
              } else {
                read_bar.style.opacity = "1";
              }
            }
          }
          window.addEventListener("keydown", handleKeydown);
          return function removeEventListener() {
            window.removeEventListener("keydown", handleKeydown);
          };
        }

        function turnoffFocus() {
          focusButton.classList.remove("selected");
          removefocusControl();
          const focusComponent = document.querySelectorAll(
            ".focusMode_component"
          );
          focusComponent.forEach((item) => {
            item.remove();
          });
        }

        function turnonFocus() {
          focusButton.classList.add("selected");
          if (!calcHeight()) {
            focusButton.classList.remove("selected");
            return;
          }
          let [rowHeight, sectionHeight, sectionWidth, position, lineHeight] =
            calcHeight();

          let color;
          let mode;
          chrome.storage.local.get(["wread-bgcolor"]).then((res) => {
            const bgcolor =
              res["weread-bgcolor"] === undefined
                ? "white"
                : res["weread-bgcolor"];
            color = focusColor(bgcolor);
          });
          chrome.storage.local.get(["weread-focusMode"]).then((res) => {
            mode =
              res["weread-focusMode"] === undefined
                ? "highlight"
                : res["weread-focusMode"];
          });

          setTimeout(() => {
            creatFocusComponent(
              mode,
              color,
              sectionWidth,
              position,
              lineHeight
            );
            removefocusControl = focusControl(
              mode,
              position,
              rowHeight,
              sectionHeight
            );
          }, 200);

          chrome.runtime.onMessage.addListener((message) => {
            if (message.fontSize || message.pageWidth || message.autoSpeed)
              turnoffFocus();
            else if (message.focusMode) {
              let focusComponent;
              if (mode === "linefocus") {
                focusComponent = document.querySelector(".focusRead");
              } else {
                focusComponent = document.querySelector(".focusMode_component");
              }
              position = parseInt(focusComponent.style.top);
              mode = message.focusMode;
              console.log(mode);
              color = "rgba(65, 134, 230, 0.3)";
              turnoffFocus();
              focusButton.classList.add("selected");
              setTimeout(() => {
                creatFocusComponent(
                  mode,
                  color,
                  sectionWidth,
                  position,
                  lineHeight
                );
                removefocusControl = focusControl(
                  mode,
                  position,
                  rowHeight,
                  sectionHeight
                );
              }, 50);
            }
          });
        }

        if (focusButton.classList.contains("selected")) {
          turnoffFocus();
        } else {
          turnonFocus();
        }
      });
    }
  }

  // copy dict content
  if (readerTp === "H") {
    const dictHeader = document.querySelector(
      ".reader_float_search_panel_wrapper .reader_float_panel_header"
    );

    const copyBtn = document.createElement("button");

    copyBtn.style.background =
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='16px' viewBox='0 -960 960 960' width='16px' fill='%235f6368'%3E%3Cpath d='M360-240q-29.7 0-50.85-21.15Q288-282.3 288-312v-480q0-29.7 21.15-50.85Q330.3-864 360-864h384q29.7 0 50.85 21.15Q816-821.7 816-792v480q0 29.7-21.15 50.85Q773.7-240 744-240H360Zm0-72h384v-480H360v480ZM216-96q-29.7 0-50.85-21.15Q144-138.3 144-168v-552h72v552h456v72H216Zm144-216v-480 480Z'/%3E%3C/svg%3E\") no-repeat center center";

    copyBtn.id = "copyBtn";
    copyBtn.style.height = "16px";
    copyBtn.style.width = "16px";
    copyBtn.style.position = "absolute";
    copyBtn.style.left = "16px";
    copyBtn.style.pointerEvents = "all";

    dictHeader.appendChild(copyBtn);

    copyBtn.addEventListener("click", () => {
      let m = document.querySelector(".reader_float_search_panel_action_means");
      if (m) {
        let text = "";
        Array.from(m.children).forEach((child) => {
          text += child.innerText + "\n";
        });
        text = text.trim();
        copyToClipboard(text);
      } else {
        alert("字典不存在");
      }
    });

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(
        function () {
          alert("成功将字典内容复制到剪切板");
        },
        function (err) {
          console.error("复制失败: ", err);
        }
      );
    }
  }

  // PDF reader
  if (readerTp === "P") {
    const page = document.querySelector("body");
    if (page) {
      const btn = document.querySelector(".reader_pdf_tool");
      const back = document.createElement("div");
      back.style.position = "fixed";
      back.style.top = 0;
      back.style.left = 0;
      back.style.width = "100px";
      back.style.height = "100%";
      back.style.background = "transparent";
      back.style.zIndex = "1000";
      page.appendChild(back);

      const forward = document.createElement("div");
      forward.style.position = "fixed";
      forward.style.top = 0;
      forward.style.right = 0;
      forward.style.width = "100px";
      forward.style.height = "100%";
      forward.style.background = "transparent";
      forward.style.zIndex = "1000";
      page.appendChild(forward);

      back.onclick = () => {
        document
          .querySelector(".reader_pdf_tool_content_navigator_back")
          .click();
        btn.style.display = "none";
      };
      forward.onclick = () => {
        document
          .querySelector(".reader_pdf_tool_content_navigator_forward")
          .click();
        btn.style.display = "none";
      };

      document.addEventListener("keydown", handleKeyPress);

      function handleKeyPress(event) {
        if (event.key === "ArrowLeft") {
          const backButton = document.querySelector(
            ".reader_pdf_tool_content_navigator_back"
          );
          if (backButton) {
            backButton.click();
          }
        } else if (event.key === "ArrowRight") {
          const forwardButton = document.querySelector(
            ".reader_pdf_tool_content_navigator_forward"
          );
          if (forwardButton) {
            forwardButton.click();
          }
        }
      }
    }
  }
}
