document.addEventListener('DOMContentLoaded', function () {
    function changeFontFamily(fontFamily, fontFamilySetting) {
        if (fontFamily) {
            if (fontFamily == "系统字体") {
                if (fontFamilySetting) {
                    fontFamilySetting.parentNode.removeChild(fontFamilySetting);
                }
            } else {
                if (fontFamilySetting) {
                    fontFamilySetting.innerHTML = "* { font-family: " + fontFamily
                        + " !important; }";
                } else {
                    const style = document.createElement('style');
                    style.id = 'fontFamilySetting';
                    style.innerHTML = "* { font-family: " + fontFamily
                        + " !important; }";
                    document.head.appendChild(style);
                };
            };
        };
    };

    function activeSetting() {
        function getCurrentMaxWidth(element) {
            let maxWidth = window.getComputedStyle(element).maxWidth;
            return parseInt(maxWidth, 10);
        }
        const rt = readerType();
        let reader;
        if (rt === "N") { reader = document.querySelector(".readerContent .app_content"); }
        else { reader = document.querySelector(".wr_horizontalReader .readerChapterContent"); }
        let currentwith = getCurrentMaxWidth(reader);
        let bool;
        chrome.storage.local.get(['width-bool']).then((b) => {
            bool = b['width-bool'] === undefined ? 1 : b['width-bool'];
            let change = bool == 0 ? -20 : 20;
            bool = bool == 1 ? 0 : 1;
            chrome.storage.local.set({ "width-bool": bool });
            currentwith += change;
            reader.style['max-width'] = currentwith + 'px';
            window.dispatchEvent(new Event("resize"));
        });
    }


    function changeFontColor(color) {
        const targetNodes = document.getElementsByClassName("readerChapterContent");
        const targetNode = targetNodes[0];
        targetNode.style.color = color;
    }

    function injectColorCss(color, bgcolor, fontColor) {
        const style = document.createElement('style');
        style.id = 'bgcolorSetting';
        style.innerHTML = `
        .wr_whiteTheme {background-color: ${bgcolor} !important;}
        .wr_whiteTheme .app_content,
        .wr_whiteTheme .readerTopBar,
        .wr_whiteTheme .readerCatalog,
        .wr_whiteTheme .readerControls_item {background-color: ${color} !important;}
        .readerChapterContent {color: ${fontColor} !important;}
        `
        document.head.appendChild(style);
        changeFontColor(fontColor);
    }

    function changeColor(color, bgcolor) {
        if (color === 'white') {
            if (bgcolor) {
                bgcolor.parentNode.removeChild(bgcolor);
            }
            document.body.classList.add('wr_whiteTheme');
            injectColorCss(0, 0, "#1c1c1d");
        } else if (color === 'black') {
            if (bgcolor) {
                bgcolor.parentNode.removeChild(bgcolor);
            }
            document.body.classList.remove('wr_whiteTheme');
            injectColorCss(0, 0, "#b2b2b2");
        } else if (color === "yellow") {
            if (bgcolor) {
                bgcolor.parentNode.removeChild(bgcolor);
            }
            document.body.classList.add('wr_whiteTheme');
            injectColorCss("#F6F2E1", "#FFFDFC", "#1c1c1d");
        } else if (color === "green") {
            if (bgcolor) {
                bgcolor.parentNode.removeChild(bgcolor);
            }
            document.body.classList.add('wr_whiteTheme');
            injectColorCss("#D3EFD1", "#E4FBE5", "#1c1c1d");
        }
    }

    function injectColorCssHorizontal(color, bgcolor, fontColor) {
        const style = document.createElement('style');
        style.id = 'bgcolorSetting';
        style.innerHTML = `
        .wr_whiteTheme .readerTopBar,
        .wr_whiteTheme .wr_horizontalReader .readerChapterContent_container {background-color: ${bgcolor} !important;}
        .wr_horizontalReader .readerChapterContent,
        .wr_horizontalReader .readerCatalog,
        .wr_whiteTheme .readerControls_item {background-color: ${color} !important;}
        .readerChapterContent {color: ${fontColor} !important;}
        `
        document.head.appendChild(style);
        changeFontColor(fontColor);
    }

    function changeColorHorizontal(color, bgcolor) {
        if (color === 'white') {
            if (bgcolor) {
                bgcolor.parentNode.removeChild(bgcolor);
            }
            document.body.classList.add('wr_whiteTheme');
            injectColorCssHorizontal(0, 0, "#1c1c1d");

        } else if (color === 'black') {
            if (bgcolor) {
                bgcolor.parentNode.removeChild(bgcolor);
            }
            document.body.classList.remove('wr_whiteTheme');
            injectColorCssHorizontal(0, 0, "#b2b2b2");
        } else if (color === "yellow") {
            if (bgcolor) {
                bgcolor.parentNode.removeChild(bgcolor);
            }
            document.body.classList.add('wr_whiteTheme');
            injectColorCssHorizontal("#F6F2E1", "#FFFDFC", "#1c1c1d");
        } else if (color === "green") {
            if (bgcolor) {
                bgcolor.parentNode.removeChild(bgcolor);
            }
            document.body.classList.add('wr_whiteTheme');
            injectColorCssHorizontal("#D3EFD1", "#E4FBE5", "#1c1c1d");
        }
    }

    function colorLoad(color) {
        if (localStorage.getItem('isdark') === 'true') {
            activeSetting();
            localStorage.setItem("isdark", "false");
        }
        if (color === 'black') {
            activeSetting();
            localStorage.setItem('isdark', 'true');
        }
    }

    function readerType() {
        const readerType = document.querySelector("button[class*='readerControls_item']:first-child");
        if (readerType.classList.contains("isNormalReader")) {
            return "N";
        } else {
            return "H";
        }
    }


    const whiteBlack = document.querySelectorAll('button[title="深色"], button[title="浅色"]');
    whiteBlack[0].style.display = "none";




    chrome.storage.local.get(["weread-fontFamily"])
        .then((result) => {
            const fontFamily = result["weread-fontFamily"];
            const fontFamilySetting = document.getElementById('fontFamilySetting');
            changeFontFamily(fontFamily, fontFamilySetting);
        });

    chrome.runtime.onMessage.addListener(function (message, sender) {
        // console.log("get", message, typeof (message), message.fontFamily)
        const fontFamily = message.fontFamily;
        const fontFamilySetting = document.getElementById('fontFamilySetting');
        if (fontFamily) {
            changeFontFamily(fontFamily, fontFamilySetting);
            activeSetting();
        }
    });

    // const targetNodes = document.getElementsByClassName("readerChapterContent");
    // const targetNode = targetNodes[0];
    // const config = { attributes: true, attributeFilter: ['style'] };
    // const callback = function (mutationsList) {
    //     for (const mutation of mutationsList) {
    //         if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
    //             const newColor = targetNode.style.color;
    //             console.log(`color 属性被修改为: ${newColor}`);
    //             activeSetting();
    //         }
    //     }
    // };
    // const observer = new MutationObserver(callback);

    localStorage.setItem("isdark", "false");

    const readerTp = readerType();
    if (readerTp === "N") {
        chrome.storage.local.get(["weread-bgcolor"])
            .then((res) => {
                const color = res["weread-bgcolor"];
                const bgcolor = document.getElementById('bgcolorSetting');
                changeColor(color, bgcolor);
                if (color === 'black') {
                    localStorage.setItem("isdark", "true");
                }
            })

        chrome.runtime.onMessage.addListener(function (message, sender) {
            const color = message.bgcolor;
            const bgcolor = document.getElementById('bgcolorSetting');
            changeColor(color, bgcolor);
            colorLoad(color);
        })
    } else {
        chrome.storage.local.get(["weread-bgcolor"])
            .then((res) => {
                const color = res["weread-bgcolor"];
                const bgcolor = document.getElementById('bgcolorSetting');
                changeColorHorizontal(color, bgcolor);
            })

        chrome.runtime.onMessage.addListener(function (message, sender) {
            const color = message.bgcolor;
            const bgcolor = document.getElementById('bgcolorSetting');
            changeColorHorizontal(color, bgcolor);
            colorLoad(color);
        })
    }


    function simulateDrag(slider, startX, endX) {
        let mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: startX,
        });

        let mouseMoveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: endX,
        });

        let mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
        });

        slider.dispatchEvent(mouseDownEvent);
        slider.dispatchEvent(mouseMoveEvent);
        slider.dispatchEvent(mouseUpEvent);
    }

    const isexpand = document.getElementsByClassName("readerControls_fontSize");
    isexpand[0].style.opacity = 0;
    const downloadApp = document.querySelector("button[title='下载App'");
    downloadApp.style.display = "none";


    chrome.runtime.onMessage.addListener(function (message) {
        if (message.fontSize) {
            const currentSize = message.fontSize;
            const slider = document.getElementsByClassName("vue-slider-dot-handle");
            let dotFonts = document.querySelector("div[role='slider']");
            const ariaValueNow = parseInt(dotFonts.getAttribute('aria-valuenow'), 10);


            if (!isexpand[0].classList.contains("expand")) {
                isexpand[0].click();
            } else {
                let rect = slider[0].getBoundingClientRect();
                const move = (currentSize - ariaValueNow) * 20;
                simulateDrag(slider[0], rect.left, rect.left + move);
                console.log(currentSize, ariaValueNow, rect.left, move)
            }

        }
    })



});

