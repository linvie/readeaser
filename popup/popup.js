document.addEventListener('DOMContentLoaded', (event) => {
    function updateRangeColor(range, value) {
        const max = range.max || 100;
        const min = range.min || 0;

        const percentage = ((value - min) / (max - min)) * 100 + 1 / 15;

        range.style.background = `linear-gradient(to right, #EDEEEE ${percentage}%, #F8F9F9 ${percentage}%)`;
    }


    //font-family
    const selectElement = document.querySelector('select');
    chrome.storage.local.get(["weread-fontFamily"], (result) => {
        selectElement.value = result["weread-fontFamily"] || '系统字体';
    });

    selectElement.addEventListener('change', (e) => {
        const value = e.target.value;
        chrome.storage.local.set({ "weread-fontFamily": value });
        chrome.tabs.query({ active: true, currentWindow: true })
            .then((tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { fontFamily: value }, () => {
                    console.log("send to" + tabs[0].id + { fontFamily: value })
                });
            })
            .catch((error) => {
                console.error('An error occurred: ' + error);
            });
    });

    //background
    const radioButton = document.querySelectorAll("input[type='radio'][name='bg-color']");
    chrome.storage.local.get(["weread-bgcolor"])
        .then((res) => {
            const color = res['weread-bgcolor'];
            if (color) {
                radioButton.forEach((radio) => {
                    if (radio.value === color) {
                        radio.checked = true;
                    }
                })
            }
        })
    radioButton.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                const value = e.target.value;
                chrome.storage.local.set({ 'weread-bgcolor': value }).then(() => {
                    console.log("success!")
                });
                chrome.tabs.query({ active: true, currentWindow: true })
                    .then((tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, { bgcolor: value })
                    })
            }
        })
    })

    //fontSize
    const fontSize = document.querySelector("input[type='range'][id='fontSize']");
    chrome.storage.local.get(["weread-fontSize"])
        .then((res) => {
            fontSize.value = res["weread-fontSize"] || 3;
            updateRangeColor(fontSize, fontSize.value);
        })
    fontSize.addEventListener('change', (e) => {
        if (e.target.value) {
            chrome.storage.local.set({ 'weread-fontSize': e.target.value }).then(() => {
                console.log("fontSize changed to" + e.target.value);
            })
            chrome.tabs.query({ active: true, currentWindow: true })
                .then((tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { fontSize: e.target.value });
                })
            updateRangeColor(fontSize, e.target.value);

        }
    })
});
