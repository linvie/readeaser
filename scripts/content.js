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
            cancelable: false,
            clientX: startX,
        });

        let mouseMoveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: false,
            clientX: endX,
        });

        let mouseUpEvent = new MouseEvent('mouseup', {
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
            const ariaValueNow = parseInt(dotFonts.getAttribute('aria-valuenow'), 10);
            const content = document.querySelector(".readerChapterContent");

            for (let i = 0; i < 8; i++) {
                let classnameNow = 'fontLevel' + i;
                if (content.classList.contains(classnameNow)) {
                    content.classList.remove(classnameNow)
                }
            }
            const classnameTo = 'fontLevel' + currentSize;
            content.classList.add(classnameTo);

            if (readerTp === 'N') {
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
    })

    function injectTopbarCss(value) {
        const style = document.createElement('style');
        style.id = 'topbarSetting';
        style.innerHTML = `
        .wr_horizontalReader .readerChapterContent {margin-top: ${72 - value}px !important; height:calc(100% - ${132 - 92 * value / 52}px) !important}
        .readerTopBar {height: ${72 - value}px !important;}
        `
        document.head.appendChild(style);
    }

    const readerTy = readerType();
    if (readerTy === "N") {
        const topbar = document.querySelector(".readerTopBar");
        let readerControl = document.querySelector('.readerControls');
        chrome.storage.local.get(["weread-topbar"])
            .then((res) => {
                const value = res["weread-topbar"]
                const tbs = document.getElementById("topbarSetting");
                if (tbs) { tbs.parentNode.removeChild(tbs); }
                injectTopbarCss(value);

                if (value > 37) {
                    topbar.style.opacity = '0';
                    let windowTop = 0;
                    window.addEventListener('scroll', function () {
                        let scrollS = window.pageYOffset || document.documentElement.scrollTop;

                        if (scrollS > windowTop) {
                            readerControl.style.opacity = '0';
                        } else {
                            readerControl.style.opacity = '1';
                        }
                        windowTop = scrollS;
                    });
                } else {
                    let windowTop = 0;
                    window.addEventListener('scroll', function () {
                        let scrollS = window.pageYOffset || document.documentElement.scrollTop;
                        if (scrollS > windowTop) {
                            topbar.style.opacity = '0';
                            readerControl.style.opacity = '0';
                        } else {
                            topbar.style.opacity = '1';
                            readerControl.style.opacity = '1';
                        }
                        windowTop = scrollS;
                    });
                }
            })
        chrome.runtime.onMessage.addListener((message) => {
            const value = message.topBar;
            if (value) {
                const tbs = document.getElementById("topbarSetting");
                if (tbs) { tbs.parentNode.removeChild(tbs); }
                injectTopbarCss(value);
                if (value > 37) {
                    topbar.style.opacity = '0';
                    let windowTop = 0;
                    window.addEventListener('scroll', function () {
                        let scrollS = window.pageYOffset || document.documentElement.scrollTop;
                        if (scrollS > windowTop) {
                            readerControl.style.opacity = '0';
                        } else {
                            topbar.style.opacity = '0';

                            readerControl.style.opacity = '1';
                        }
                        windowTop = scrollS;
                    });
                } else {
                    let windowTop = 0;
                    window.addEventListener('scroll', function () {
                        let scrollS = window.pageYOffset || document.documentElement.scrollTop;
                        if (scrollS > windowTop) {
                            topbar.style.opacity = '0';
                            readerControl.style.opacity = '0';
                        } else {
                            topbar.style.opacity = '1';
                            readerControl.style.opacity = '1';
                        }
                        windowTop = scrollS;
                    });
                }
            }
        })
    } else {
        const topbar = document.querySelector(".readerTopBar");
        chrome.storage.local.get(["weread-topbar"])
            .then((res) => {
                const value = res["weread-topbar"]
                const tbs = document.getElementById("topbarSetting");
                if (tbs) { tbs.parentNode.removeChild(tbs); }
                injectTopbarCss(value);
                if (value > 37) {
                    topbar.style.opacity = '0';
                } else {
                    topbar.style.opacity = '1';
                }
            })
        chrome.runtime.onMessage.addListener((message) => {
            const value = message.topBar;
            if (value) {
                const tbs = document.getElementById("topbarSetting");
                if (tbs) { tbs.parentNode.removeChild(tbs); }
                injectTopbarCss(value);
                if (value > 37) {
                    topbar.style.opacity = '0';
                } else {
                    topbar.style.opacity = '1';
                }
            }
            activeSetting();

        })
    }

    function injectPageWidthCss(value) {
        if (readerTp === 'N') {
            const readerTopBar = document.querySelector(".readerTopBar");
            const readerContent = document.querySelector(".readerContent .app_content");
            readerContent.style.maxWidth = value + "vw";
            readerTopBar.style.maxWidth = value + "vw";
        } else {
            const style = document.createElement('style');
            style.id = 'pagewidthSetting';
            style.innerHTML = `
        .wr_horizontalReader .readerChapterContent {width: ${75 + (value - 60) / 40 * 23}vw !important;}
        // .readerTopBar {max-width: ${value}vw !important;}
        // .readerContent .app_content{max-width:${value}vw !important;}
        `
            document.head.appendChild(style);
        }
    }

    chrome.storage.local.get(["weread-pagewidth"])
        .then((res) => {
            const value = res['weread-pagewidth'];
            const tbs = document.getElementById("pagewidthSetting");
            if (tbs) { tbs.parentNode.removeChild(tbs); }
            injectPageWidthCss(value);
        })
    chrome.runtime.onMessage.addListener((message) => {
        if (message.pageWidth) {
            const tbs = document.getElementById("pagewidthSetting");
            if (tbs) { tbs.parentNode.removeChild(tbs); }
            injectPageWidthCss(message.pageWidth);
            activeSetting();

        }
    })

    var autoScrollTimer;

    function autoScroll(time) {
        const distance = 1;
        if (autoScrollTimer) {
            clearInterval(autoScrollTimer);
        }
        autoScrollTimer = setInterval(function () {
            const beforeScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            window.scrollBy(0, distance);
            const afterScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

            if (afterScrollTop >= scrollHeight || afterScrollTop === beforeScrollTop) {
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

        window.addEventListener('load', (event) => {
            chrome.storage.local.get(['weread-autospeed'])
                .then((res) => {
                    const value = res['weread-autospeed']
                    if (value != 0) {
                        autoScroll(speeds[value]);
                    } else {
                        resetAutoScroll();
                    }
                })
        })
        chrome.runtime.onMessage.addListener((message) => {
            const value = message.autoSpeed
            if (value) {
                if (value != 0) {
                    autoScroll(speeds[value]);
                } else {
                    resetAutoScroll();
                }
            }
        })
    }

});

