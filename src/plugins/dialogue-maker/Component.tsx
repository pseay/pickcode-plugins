import { observer } from "mobx-react-lite";
import React, { useRef, useEffect, useState } from "react";
import State from "./state";
import { Scene } from "./messages";
import { cursorTo } from "readline";

const Component = observer(({ state }: { state: State | undefined }) => {
    const scenes = state?.scenes || {};
    const [sceneName, setSceneName]: [string, Function] = useState("start");
    const curScene: Scene | undefined = scenes[sceneName];

    if (!curScene) {
        return <>Error: Invalid scene</>;
    }

    return (
        <div className="p-6">
            <p className="font-bold text-white p-5 bg-linear-to-t from-[#926338] to-[#C6A06C] rounded-md shadow-lg">
                {curScene.message}
            </p>
            <div className="flex flex-col gap-3 m-5">
                {curScene.choices.map((choice, index) => (
                    <button
                        className="p-3 bg-[#D2AF78] rounded-sm shadow-md"
                        key={index}
                        onClick={() => setSceneName(choice.nextScene)}
                    >
                        {choice.response}
                    </button>
                ))}
            </div>
        </div>
    );
});

export default Component;
