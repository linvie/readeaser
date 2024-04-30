document.addEventListener('DOMContentLoaded', (event) => {
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
    const radioButton = document.querySelectorAll("input[type='radio'][name='bg=color']");
    radioButton.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                const value = e.target.value;
                chrome.storage.local.set({ 'weread-bgcolor': value });
                chrome.tabs.query({ active: true, currentWindow: true })
                    .then((tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, { bgcole: value })
                    })
            }
        })
    })

});
