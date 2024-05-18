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
    if (rt === "N") {
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
        .wr_whiteTheme .app_content,
        .wr_whiteTheme .readerTopBar,
        .wr_whiteTheme .readerCatalog,
        .wr_whiteTheme .readerControls_item {background-color: ${color} !important;}
        .readerChapterContent {color: ${fontColor} !important;}
        `;
    document.head.appendChild(style);
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
        .wr_horizontalReader .readerChapterContent,
        .wr_horizontalReader .readerCatalog,
        .wr_whiteTheme .readerControls_item {background-color: ${color} !important;}
        .readerChapterContent {color: ${fontColor} !important;}
        `;
    document.head.appendChild(style);
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
    const readerType = document.querySelector(
      "button[class*='readerControls_item']:first-child"
    );
    if (readerType.classList.contains("isNormalReader")) {
      return "N";
    } else {
      return "H";
    }
  }

  const whiteBlack = document.querySelectorAll(
    'button[title="深色"], button[title="浅色"]'
  );
  whiteBlack[0].style.display = "none";

  chrome.storage.local.get(["weread-fontFamily"]).then((result) => {
    const fontFamily = result["weread-fontFamily"];
    const fontFamilySetting = document.getElementById("fontFamilySetting");
    changeFontFamily(fontFamily, fontFamilySetting);
  });

  chrome.runtime.onMessage.addListener(function (message, sender) {
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
      const bgcolor = document.getElementById("bgcolorSetting");
      changeColor(color, bgcolor);
      colorLoad(color);
    });
  } else {
    chrome.storage.local.get(["weread-bgcolor"]).then((res) => {
      const color = res["weread-bgcolor"];
      const bgcolor = document.getElementById("bgcolorSetting");
      changeColorHorizontal(color, bgcolor);
    });

    chrome.runtime.onMessage.addListener(function (message, sender) {
      const color = message.bgcolor;
      const bgcolor = document.getElementById("bgcolorSetting");
      changeColorHorizontal(color, bgcolor);
      colorLoad(color);
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

  const isexpand = document.getElementsByClassName("readerControls_fontSize");
  isexpand[0].style.opacity = 0;
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
        if (!isexpand[0].classList.contains("expand")) {
          isexpand[0].click();
        } else {
          let rect = slider[0].getBoundingClientRect();
          const move = (currentSize - ariaValueNow) * 20;
          simulateDrag(slider[0], rect.left, rect.left + move);
        }
      } else {
        if (!isexpand[0].classList.contains("expand")) {
          isexpand[0].click();
        } else {
          let rect = slider[0].getBoundingClientRect();
          const move = (currentSize - ariaValueNow) * 20;
          simulateDrag(slider[0], rect.left, rect.left + move);
        }
      }
    }
  });

  function injectTopbarCss(value) {
    const style = document.createElement("style");
    style.id = "topbarSetting";
    style.innerHTML = `
        .wr_horizontalReader .readerChapterContent {margin-top: ${
          72 - value
        }px !important; height:calc(100% - ${
      132 - (92 * value) / 52
    }px) !important}
        .readerTopBar {height: ${72 - value}px !important;}
        `;
    document.head.appendChild(style);
  }

  const readerTy = readerType();
  if (readerTy === "N") {
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
  } else {
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
    if (readerTp === "N") {
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
        .wr_horizontalReader .readerChapterContent {width: ${
          75 + ((value - 60) / 40) * 23
        }vw !important;}
        // .readerTopBar {max-width: ${value}vw !important;}
        // .readerContent .app_content{max-width:${value}vw !important;}
        `;
      document.head.appendChild(style);
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
        clearInterval(autoScrollTimer);
      }
    }, time);
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
});

window.onload = function () {
  // focus mode
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

          if (focusButton) {
            focusButton.addEventListener("click", () => {
              // focusButton.classList.add("selected");
              // const colorControl = document.createElement("div");
              // colorControl.className =
              //   "reader_toolbar_color_container focusMode_add";
              // colorControl.innerHTML = `
              // <button class="reader_toolbar_color_item" style="background: rgb(255, 144, 156);"><!---->
              // </button><button class="reader_toolbar_color_item" style="background: rgb(184, 159, 255);"><!----></button><button class="reader_toolbar_color_item" style="background: rgb(116, 180, 255);"><!----></button><button class="reader_toolbar_color_item" style="background: rgb(112, 211, 130);"><!----></button><button class="reader_toolbar_color_item" style="background: rgb(255, 203, 126);"><span class="reader_toolbar_color_item_selected"></span></button>
              //     `;
              // const reader_toolbar_container = document.querySelector(
              //   ".reader_toolbar_container"
              // );
              // reader_toolbar_container.appendChild(colorControl);
              // setTimeout(() => {
              //   reader_toolbar_container.style.display = "";
              // }, 200);

              // const color_bar = document.querySelector(
              //   ".reader_toolbar_color_container"
              // );
              // if (color_bar) {
              //   // <span class="reader_toolbar_color_item_selected"></span>
              //   const color_items = color_bar.querySelectorAll(
              //     ".reader_toolbar_color_item"
              //   );
              //   color_items.forEach((item) => {
              //     item.addEventListener("click", () => {
              //       color_items.forEach((button) => {
              //         const span = button.querySelector(
              //           ".reader_toolbar_color_item_selected"
              //         );
              //         if (span) button.removeChild(span);
              //       });
              //       const span = document.createElement("span");
              //       span.className = "reader_toolbar_color_item_selected";
              //       item.appendChild(span);
              //       const color_choose = item.style.background;
              //     });
              //   });
              // }
              //

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
                    ...Array.from(selections).map((el) =>
                      parseFloat(el.style.width)
                    )
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
                const divs =
                  renderTargetContainer.querySelectorAll(":scope >div");
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
                  divs[divs.length - 2].appendChild(focusComponent);
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
                  divs[divs.length - 2].appendChild(focusComponent);
                } else if (mode === "linefocus") {
                  if (color === "black") {
                    alert("深色背景下，聚焦模式不可用");
                  } else {
                    const focusComponent_mask = document.createElement("div");
                    focusComponent_mask.className =
                      "focusMode_component focusMask";
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
                    focusComponent_read.className =
                      "focusMode_component focusRead";
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
                  if (
                    (e.key === "z" || e.key === "Z") &&
                    mode === "linefocus"
                  ) {
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
                let [
                  rowHeight,
                  sectionHeight,
                  sectionWidth,
                  position,
                  lineHeight,
                ] = calcHeight();

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
                  if (
                    message.fontSize ||
                    message.pageWidth ||
                    message.autoSpeed
                  )
                    turnoffFocus();
                  else if (message.focusMode) {
                    let focusComponent;
                    if (mode === "linefocus") {
                      focusComponent = document.querySelector(".focusRead");
                    } else {
                      focusComponent = document.querySelector(
                        ".focusMode_component"
                      );
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
};
