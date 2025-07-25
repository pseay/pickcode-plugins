import { observer } from "mobx-react-lite";
import React, { useRef, useEffect, useState } from "react";
import State from "./state";
import { Scene } from "./messages";
import { cursorTo } from "readline";

const Component = observer(({ state }: { state: State | undefined }) => {
    const scenes = state?.scenes || {};
    const [sceneName, setSceneName]: [
        string,
        React.Dispatch<React.SetStateAction<string>>
    ] = useState("start");
    const curScene: Scene | undefined = scenes[sceneName];
    const [mode, setMode]: [
        "Regular" | "Developer",
        React.Dispatch<React.SetStateAction<"Regular" | "Developer">>
    ] = useState<"Regular" | "Developer">("Regular");

    if (!curScene) {
        return (
            <div className="text-lg p-6 space-y-6">
                <p>Error: Invalid scene name "{sceneName}".</p>
                <p>
                    Valid scene names are "{Object.keys(scenes).join('" / "')}".
                </p>
                <p>Try editing your code to fix this issue.</p>
                <button
                    className="bg-blue-300 rounded-sm p-6"
                    onClick={() => setSceneName("start")}
                >
                    Click here to go back to "start"!
                </button>
            </div>
        );
    }

    return (
        <div className="relative p-6">
            <div className="mb-4 bg-gray-200 p-4 rounded-md">
                <label htmlFor="mode-select">Mode:</label>
                <select
                    id="mode-select"
                    value={mode}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setMode(e.target.value as "Regular" | "Developer")
                    }
                    className="ml-3 p-2 rounded border-1 border-black rounded-sm"
                >
                    <option value="Regular">Play</option>
                    <option value="Developer">Developer</option>
                </select>
            </div>
            <p className="font-bold text-white p-5 bg-linear-to-t from-[#926338] to-[#C6A06C] rounded-md shadow-lg">
                {mode === "Developer" && (
                    <>
                        {'current scene = "' + sceneName + '"'}
                        <br />
                        {sceneName + ".message = "}
                    </>
                )}
                {curScene.message}
            </p>
            <div className="flex flex-col gap-3 m-5">
                {curScene.choices.map((choice, index) => (
                    <button
                        className="p-3 bg-[#D2AF78] rounded-sm shadow-md"
                        key={index}
                        onClick={() => setSceneName(choice.nextScene)}
                    >
                        {mode === "Developer" &&
                            sceneName + ".choices[" + index + "] = "}
                        {choice.response}
                        {mode === "Developer" && (
                            <>
                                <br />
                                {sceneName +
                                    ".nextScene = " +
                                    curScene.choices[index].nextScene}
                            </>
                        )}
                    </button>
                ))}
                <button
                    className="mt-6 bg-gray-300 rounded"
                    onClick={() => setSceneName("start")}
                >
                    Reset
                </button>
            </div>
        </div>
    );
});

export default Component;
