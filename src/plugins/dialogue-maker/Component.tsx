import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import State from "./state";
import { Scene } from "./messages";

const Component = observer(({ state }: { state: State | undefined }) => {
    const scenes = state?.scenes || {};
    const [sceneName, setSceneName] = useState("start");
    const curScene: Scene | undefined = scenes[sceneName];
    const [mode, setMode] = useState<"Regular" | "Developer">("Regular");

    if (!curScene) {
        return (
            <div className="text-lg p-6 space-y-6 text-red-700">
                <p>Error: Invalid scene name "{sceneName}".</p>
                <p>
                    Valid scene names:{" "}
                    <span className="text-black font-mono">
                        {Object.keys(scenes).join(", ")}
                    </span>
                </p>
                <button
                    className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
                    onClick={() => setSceneName("start")}
                >
                    Go back to "start"
                </button>
            </div>
        );
    }

    const devLabel = (label: string) => (
        <span className="text-gray-200 font-mono text-sm">{label}</span>
    );

    return (
        <div className="relative p-6 max-w-3xl mx-auto">
            {/* Mode Selector */}
            <div className="mb-6 bg-gray-100 p-4 rounded-md">
                <label htmlFor="mode-select" className="mr-3 font-semibold">
                    Mode:
                </label>
                <select
                    id="mode-select"
                    value={mode}
                    onChange={(e) =>
                        setMode(e.target.value as "Regular" | "Developer")
                    }
                    className="p-2 rounded border border-gray-400"
                >
                    <option value="Regular">Play</option>
                    <option value="Developer">Developer</option>
                </select>
            </div>

            {/* Dialogue Box */}
            <div className="p-6 rounded-lg shadow-xl bg-neutral-900 text-white space-y-2">
                {mode === "Developer" && (
                    <>
                        {devLabel(`scene = "${sceneName}"`)}
                        <br />
                        {devLabel(`${sceneName}.message:`)}
                        <br />
                    </>
                )}
                <p className="text-lg leading-relaxed">{curScene.message}</p>
            </div>

            {/* Choices */}
            <div className="flex flex-col gap-4 mt-6">
                {curScene.choices.map((choice, index) => {
                    const next = scenes[choice.nextScene];
                    return (
                        <button
                            key={index}
                            onClick={() => setSceneName(choice.nextScene)}
                            className="p-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-left shadow-md"
                        >
                            {mode === "Developer" && (
                                <div className="mb-2 bg-gray-100 p-2 rounded text-sm font-mono text-gray-700">
                                    <div>{`${sceneName}.choices[${index}].nextScene = "${choice.nextScene}"`}</div>
                                    <div className="mt-1 pl-2">
                                        {next ? (
                                            <>
                                                <div>{`${choice.nextScene}.message:`}</div>
                                                <div className="text-gray-600">
                                                    {next.message}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-red-600 font-semibold">
                                                Error: scene "{choice.nextScene}
                                                " not found.
                                            </div>
                                        )}
                                    </div>
                                    <div>{`${sceneName}.choices[${index}].response =`}</div>
                                </div>
                            )}
                            <span className="text-base">{choice.response}</span>
                        </button>
                    );
                })}
                <button
                    className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 self-start"
                    onClick={() => setSceneName("start")}
                >
                    Reset
                </button>
            </div>
        </div>
    );
});

export default Component;
