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
        const reader = document.querySelector(".readerContent .app_content");
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

    function injectColorCss(color, bgcolor, fontColor) {
        const style = document.createElement('style');
        style.id = 'bgcolorSetting';
        style.innerHTML = `
        .wr_whiteTheme {background-color: ${bgcolor} !important;}
        .wr_whiteTheme .app_content,
        .wr_whiteTheme .readerTopBar,
        .wr_whiteTheme .readerControls_item {background-color: ${color} !important;}
        .readerChapterContent {color: ${fontColor} !important;}
        `
        document.head.appendChild(style);
    }

    function changeColor(color, bgcolor) {
        if (color === 'white') {
            if (bgcolor) {
                bgcolor.parentNode.removeChild(bgcolor);
            }
            document.body.classList.add('wr_whiteTheme');
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
            injectColorCss("#F6F2E1", "#FFFDFC", "##1c1c1d");
        } else if (color === "green") {
            if (bgcolor) {
                bgcolor.parentNode.removeChild(bgcolor);
            }
            document.body.classList.add('wr_whiteTheme');
            injectColorCss("#D3EFD1", "#E4FBE5", "##1c1c1d");
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
        changeFontFamily(fontFamily, fontFamilySetting);
        activeSetting();
    });

    chrome.storage.local.get(["weread-bgcolor"])
        .then((res) => {
            const color = res["weread-bgcolor"];
            const bgcolor = document.getElementById('bgcolorSetting');
            changeColor(color, bgcolor);
        })

    chrome.runtime.onMessage.addListener(function (message, sender) {
        const color = message.bgcolor;
        const bgcolor = document.getElementById('bgcolorSetting');
        changeColor(color, bgcolor);
    })
});

