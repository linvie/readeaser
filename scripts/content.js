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
});

