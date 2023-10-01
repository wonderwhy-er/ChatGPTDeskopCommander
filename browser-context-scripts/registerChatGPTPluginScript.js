async function registerPluginIfNeeded() {
        console.log('api changed, reregistering');
        function forElementRemoval(element) {
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

        function forElements(selector, content) {
            return new Promise((resolve, reject) => {
                let elements = Array.from(document.querySelectorAll(selector));
                if(content) elements = elements.filter(el => el.innerText.includes(content));

                if (elements.length>0) {
                    return resolve(elements);
                }

                const observer = new MutationObserver(mutations => {
                    let elements = Array.from(document.querySelectorAll(selector));
                    if(content) elements = elements.filter(el => el.innerText.includes(content));
                    if (elements.length > 0) {
                        resolve(elements);
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

        function delay(n) {
            return new Promise(r => setTimeout(r, n));
        }

        function dispatch(e, event) {
            e.dispatchEvent(new MouseEvent(event, {
                'bubbles': true,
                'cancelable': true,
                'view': window
            }));
        }
        //debugger;

        const button = (await forElements('.list-none .w-full:nth-child(2) .w-full.cursor-pointer'))[0];
        dispatch(button, 'click');
        console.log('click on gpt4', button);
        await delay(100);
        dispatch((await forElements('.list-none .w-full:nth-child(2) .w-full.cursor-pointer'))[0], 'mouseover');
        await delay(100);
        const plugins = (await forElements('[data-radix-popper-content-wrapper] .w-full .flex .items-center', 'Plugins'))[0];
        dispatch(plugins, 'click');
        console.log('click on plugins', plugins);
        const pluginSelector = (await forElements("[id^=\"headlessui-listbox-button-\"]"))[0];
        dispatch(pluginSelector, 'click');
        console.log('click on plugin selector', pluginSelector);
        const pluginMenu = (await forElements("[id^=\"headlessui-listbox-options-\"] > li:last-child"))[0];
        dispatch(pluginMenu, 'click');
        console.log('click on pluginMenu');
        const installed = (await forElements("div.p-4.sm\\:p-6.sm\\:pt-4 > div > div.flex.flex-wrap.gap-3 > button:nth-child(4)"))[0];
        const currentPluggin = (await forElements("div.p-4.sm\\:p-6.sm\\:pt-4 > div > div.grid.grid-cols-1.gap-3.sm\\:grid-cols-2.sm\\:grid-rows-2.lg\\:grid-cols-3.xl\\:grid-cols-4 > div"))[0];
        dispatch(installed, 'click');
        console.log('click on installed');
        await forElementRemoval(currentPluggin);
        const pluginBlocks = (await forElements("div.p-4.sm\\:p-6.sm\\:pt-4 > div > div.grid.grid-cols-1.gap-3.sm\\:grid-cols-2.sm\\:grid-rows-2.lg\\:grid-cols-3.xl\\:grid-cols-4 > div"));
        const Plugin = pluginBlocks.filter(el => el.innerText.includes('DesktopCommander'))[0];
        if (Plugin) {
            console.log('firstPlugin');
            const uninstall = Plugin.querySelector('button');
            dispatch(uninstall, 'click');
            await forElementRemoval(uninstall);
            console.log('click uninstall');
        }
        dispatch(document.querySelector("div.p-4.sm\\:p-6.sm\\:pt-4 > div > div.flex.flex-col.flex-wrap.items-center.justify-center.gap-6.sm\\:flex-row.md\\:justify-between > div.flex.flex-col.items-center.gap-2.sm\\:flex-row > button:nth-child(3)"), 'click');
        console.log('click develop plugin');
        const input = (await forElements("#url"))[0];
        input.value = 'localhost:3000';
        console.log('add url');
        const addPlugin = (await forElements("div.p-4.sm\\:p-6.sm\\:pt-4 > div.mt-5.sm\\:mt-4 > div > button.btn.relative.btn-primary"))[0];
        dispatch(addPlugin, 'click');
        await forElementRemoval(input);
        console.log('click addPlugin');
        const ok = (await forElements("[role=\"dialog\"][data-state=\"open\"] button:not([disabled])",'Install localhost plugin'))[0];
        dispatch(ok, 'click');
        console.log('click ok', ok);
        //debugger;
        await forElementRemoval(ok);
        const plugin = (await forElements('[id^="headlessui-listbox-option-"]', 'DesktopCommander'))[0];
        if (plugin.getAttribute('aria-selected') === 'false') {
            dispatch(plugin, 'click');
        }
        await delay(100);
        const a = (await forElements('a','New Chat'))[0];
        dispatch(a,'click');
}

module.exports = {registerPluginIfNeeded};
