// // Add a module declaration for the external pyodide import
// declare module "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.mjs" {
//     export const loadPyodide: any;
// }

// // @ts-ignore
// const { loadPyodide } = await import(
//     "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.mjs"
// );

// @ts-ignore
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.mjs";

let pyodide: any;
async function load() {
    pyodide = await loadPyodide();
    postMessage({ type: "console", messageText: "Loaded!" });
}
load();

const pyMessageSubscribers: { [key: symbol]: (message: any) => void } = {};
const pySubscribeToMessages = (onMessage: any) => {
    const key = Symbol();
    pyMessageSubscribers[key] = onMessage;
    return () => {
        delete pyMessageSubscribers[key];
    };
};

const pyOverrideGlobalFns = (onTermination: () => void) => {
    const originalSetTimeout = globalThis.setTimeout;
    const originalClearTimeout = globalThis.clearTimeout;
    const originalSetInterval = globalThis.setInterval;
    const originalClearInterval = globalThis.clearInterval;
    const originalConsole = globalThis.console;

    const handleTermination = () => {
        globalThis.setTimeout = originalSetTimeout;
        globalThis.clearTimeout = originalClearTimeout;
        globalThis.setInterval = originalSetInterval;
        globalThis.clearInterval = originalClearInterval;
        globalThis.console = originalConsole;

        onTermination();
    };

    // globalThis.console = overriddenConsole;

    const timeouts = new Set<any>();
    const intervals = new Set<any>();
    const maybeTerminate = () => {
        if (timeouts.size === 0 && intervals.size === 0) {
            void Promise.resolve().then(() => {
                if (timeouts.size === 0 && intervals.size === 0) {
                    handleTermination();
                }
            });
        }
    };

    (globalThis.setTimeout as any) = (
        ...[callback, ...args]: Parameters<typeof setTimeout>
    ) => {
        const id = originalSetTimeout(() => {
            let result: any;
            if (typeof callback === "string") {
                result = eval(callback);
            } else {
                result = callback();
            }
            timeouts.delete(id);
            maybeTerminate();
            return result;
        }, ...args);
        timeouts.add(id);
        return id;
    };
    (globalThis.clearTimeout as any) = (
        ...[id]: Parameters<typeof clearTimeout>
    ) => {
        const result = originalClearTimeout(id);
        timeouts.delete(id);
        maybeTerminate();
        return result;
    };

    (globalThis.setInterval as any) = (
        ...args: Parameters<typeof setInterval>
    ) => {
        const id = originalSetInterval(...args);
        intervals.add(id);
        return id;
    };
    (globalThis.clearInterval as any) = (
        ...[id]: Parameters<typeof clearInterval>
    ) => {
        const result = originalClearInterval(id);
        intervals.delete(id);
        maybeTerminate();
        return result;
    };

    return { maybeTerminate };
};

// Imports the plugin implementation code.
function pyImportString(str: string) {
    const blob = new Blob([str], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const module = import(/* @vite-ignore */ url);
    URL.revokeObjectURL(url);
    return module;
}

const postMessageQueue: any[] = [];

function flushQueue() {
    while (postMessageQueue.length > 0) {
        let mes = postMessageQueue.shift();
        self.postMessage({
            type: "console",
            messageText: `${mes}\n`,
        });
        self.postMessage({
            type: "module",
            contents: { forceToDraw: JSON.parse(mes).contents },
        });
    }
}

setInterval(flushQueue, 0); // dispatch messages constantly

// Main window (browser) receives all types of messages here.
// TODO: We have to combine the implementation and student's python code, and run it with Pyodide.
const pyHandleMessage = async (message: any) => {
    switch (message.type) {
        case "startPy": {
            const { maybeTerminate } = pyOverrideGlobalFns(() =>
                postMessage({ type: "finished" })
            );

            // This imports the implementation.
            // The main window sends over the module code (implementation) as a string here.
            let moduleCode;
            try {
                moduleCode = await pyImportString(message.moduleCode);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error("error importing module code", e);
                throw e;
            }

            // This awaits the promise of the implementation.
            let exports;
            try {
                exports =
                    (await moduleCode.default((contents: any) => {
                        postMessage({
                            type: "module",
                            contents,
                        });
                    }, pySubscribeToMessages)) || {};
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error("error executing module code", e);
                throw e;
            }

            // Add the exports to the globals of Python.
            try {
                // for (let [key, value] of Object.entries(exports)) {
                //     pyodide.globals.set(key, value);
                // }
                function drawForce(force: any, color: string): void {
                    postMessageQueue.push(
                        JSON.stringify({
                            type: "module",
                            contents: {
                                x: force.has("x") ? force.get("x") : 0,
                                y: force.has("y") ? force.get("y") : 0,
                                color,
                            },
                        })
                    );
                }

                pyodide.globals.set("drawForce", pyodide.toPy(drawForce));
            } catch (e) {
                if (e instanceof Error) {
                    postMessage({
                        type: "console",
                        stream: "stderr",
                        messageText: `${e.name}: ${e.message}\n`,
                    });
                    maybeTerminate();
                }
                throw e;
            }

            // Run the user's code in Pyodide
            let userCode = message.userCode;
            try {
                pyodide.runPython(userCode);
            } catch (e) {
                if (e instanceof Error) {
                    postMessage({
                        type: "console",
                        stream: "stderr",
                        messageText: `${e.name}: ${e.message}\n`,
                    });
                    maybeTerminate();
                }
                throw e;
            }
            break;
        }
        case "module": {
            Object.getOwnPropertySymbols(pyMessageSubscribers).forEach(
                (key) => {
                    pyMessageSubscribers[key](message.contents);
                }
            );
        }
    }
};

self.onmessage = (event) => {
    if (!event.data.type) return;
    // void tells typescript we don't care when this async thing returns.
    void pyHandleMessage(event.data);
};

export {};
