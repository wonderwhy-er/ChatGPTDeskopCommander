async function registerPluginIfNeeded() {
    const api = await (await fetch('http://localhost:3000/openapi.yaml')).text();
    const json = await (await fetch('http://localhost:3000/.well-known/ai-plugin.json')).text();
    const lastAPI = localStorage.getItem('lastAPI');
    if (lastAPI !== api + json) {
        console.log('api changed, reregistering');
        function waitForElementRemoval(element) {
            return new Promise((resolve, reject) => {
                // If the element doesn't exist, resolve the promise immediately.
                if (!document.contains(element)) {
                    return resolve();
                }

                // Create a mutation observer that watches for changes in the DOM.
                const observer = new MutationObserver(mutations => {
                    if (!document.contains(element)) {
                        resolve();
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // Set a timeout to reject the promise if the element isn't removed within the given time.
            });
        }

        function waitForElement(selector, content) {
            return new Promise((resolve, reject) => {
                if (document.querySelector(selector) && (!content || document.querySelector(selector).innerText.includes(content))) {
                    return resolve(document.querySelector(selector));
                }

                const observer = new MutationObserver(mutations => {
                    if (document.querySelector(selector) && (!content || document.querySelector(selector).innerText.includes(content))) {
                        resolve(document.querySelector(selector));
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: false,
                    characterData: false,
                });
            });
        }

        function dispatch(e, event) {
            e.dispatchEvent(new MouseEvent(event, {
                'bubbles': true,
                'cancelable': true,
                'view': window
            }));
        }

        const button = await waitForElement('.list-none .w-full:nth-child(2) .w-full.cursor-pointer');
        dispatch(button, 'click');
        console.log('click on gpt4');
        dispatch(await waitForElement('.list-none .w-full:nth-child(2) .w-full.cursor-pointer'), 'mouseover');

        const plugins = await waitForElement('[data-radix-popper-content-wrapper] .w-full .flex .items-center:nth-child(3)');
        dispatch(plugins, 'click');
        console.log('click on plugins');
        const pluginSelector = await waitForElement("[id^=\"headlessui-listbox-button-\"]");
        dispatch(pluginSelector, 'click');
        console.log('click on plugin selector');
        const pluginMenu = await waitForElement("[id^=\"headlessui-listbox-options-\"] > li:last-child");
        dispatch(pluginMenu, 'click');
        console.log('click on pluginMenu');
        const installed = await waitForElement("div.p-4.sm\\:p-6.sm\\:pt-4 > div > div.flex.flex-wrap.gap-3 > button:nth-child(4)");
        dispatch(installed, 'click');
        console.log('click on installed');
        const firstPlugin = await waitForElement("div.p-4.sm\\:p-6.sm\\:pt-4 > div > div.grid.grid-cols-1.gap-3.sm\\:grid-cols-2.sm\\:grid-rows-2.lg\\:grid-cols-3.xl\\:grid-cols-4 > div:nth-child(1)")
        if (firstPlugin.innerText.includes('GodMode')) {
            console.log('firstPlugin');
            const uninstall = firstPlugin.querySelector('button');
            dispatch(uninstall, 'click');
            await waitForElementRemoval(uninstall);
            console.log('click uninstall');
        }
        dispatch(document.querySelector("div.p-4.sm\\:p-6.sm\\:pt-4 > div > div.flex.flex-col.flex-wrap.items-center.justify-center.gap-6.sm\\:flex-row.md\\:justify-between > div.flex.flex-col.items-center.gap-2.sm\\:flex-row > button:nth-child(3)"), 'click');
        console.log('click develop plugin');
        const input = await waitForElement("#url");
        input.value = 'localhost:3000';
        console.log('add url');
        const addPlugin = await waitForElement("div.p-4.sm\\:p-6.sm\\:pt-4 > div.mt-5.sm\\:mt-4 > div > button.btn.relative.btn-primary");
        dispatch(addPlugin, 'click');
        console.log('click addPlugin');
        await new Promise(resolve => setTimeout(resolve, 100));
        const ok = await waitForElement("[role=\"dialog\"][data-state=\"open\"] button:not([disabled])");
        if(!ok.disabled) {
            dispatch(ok, 'click');
            console.log('click ok', ok);
            localStorage.setItem('lastAPI', api + json);
            console.log('added script');
        }
    } else {
        console.log('no need to reregister')
    }
}

module.exports = {registerPluginIfNeeded};
