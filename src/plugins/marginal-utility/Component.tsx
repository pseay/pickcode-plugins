import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useMemo, useRef } from "react";
import State from "./state";

// InfoCard is updated to support a separate "pulsing" state for the shrink animation.
const InfoCard = ({
    title,
    emoji,
    data,
    isHighlighted,
    isPulsing,
    isCorrect,
}: {
    title: string;
    emoji: string;
    data: { label: string; value: string | number }[];
    isHighlighted: boolean;
    isPulsing: boolean;
    isCorrect: boolean | null;
}) => {
    const classNames = [
        "bg-white p-6 rounded-lg shadow-md sm:w-72 flex-shrink-0 transition-all duration-300",
    ];

    // The "pulse" or shrink effect is now controlled by isPulsing.
    if (isPulsing) {
        classNames.push("transform scale-95");
    }

    // The border and background highlight is still controlled by isHighlighted.
    if (isHighlighted) {
        if (isCorrect === true) {
            classNames.push("border-4 border-green-500 bg-green-50");
        } else if (isCorrect === false) {
            classNames.push("border-dashed border-4 border-red-500 bg-red-50");
        }
    }

    return (
        <div className={classNames.join(" ")}>
            <h3 className="text-1xl font-semibold mb-2 flex items-center gap-1 text-gray-800">
                <span>{emoji}</span>
                <span>{title}</span>
            </h3>
            <table className="w-full text-left">
                <tbody>
                    {data.map(({ label, value }, index) => (
                        <tr
                            key={index}
                            className="border-b last:border-b-0 border-gray-100"
                        >
                            <td className="py-2 pr-2 text-gray-600">
                                {label}:
                            </td>
                            <td className="py-2 pl-2 font-medium text-gray-800">
                                {value}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Component = observer(({ state }: { state: State | undefined }) => {
    const [visibleChoices, setVisibleChoices] = useState<string[]>([]);
    // This state now controls the 2-second border highlight.
    const [highlightedItem, setHighlightedItem] = useState<{
        choice: string;
        isCorrect: boolean;
    } | null>(null);
    // This new state controls the short 0.5-second pulse animation.
    const [pulsingChoice, setPulsingChoice] = useState<string | null>(null);

    const isAnimating = useRef(false);

    const incomingChoices = state?.choices || [];

    const {
        appleCount,
        bananaCount,
        appleMU,
        bananaMU,
        appleMUP,
        bananaMUP,
        totalCost,
    } = useMemo(() => {
        const appleCount = visibleChoices.filter((c) => c === "apple").length;
        const bananaCount = visibleChoices.filter((c) => c === "banana").length;
        const applePrice = 2;
        const bananaPrice = 1;
        const appleMU = 30 - 10 * appleCount;
        const bananaMU = 20 - 5 * bananaCount;
        const appleMUP = appleMU / applePrice;
        const bananaMUP = bananaMU / bananaPrice;
        const totalCost = appleCount * applePrice + bananaCount * bananaPrice;
        return {
            appleCount,
            bananaCount,
            appleMU,
            bananaMU,
            appleMUP,
            bananaMUP,
            totalCost,
        };
    }, [visibleChoices]);

    useEffect(() => {
        const processNextChoice = async () => {
            if (incomingChoices.length <= visibleChoices.length) {
                isAnimating.current = false;
                return;
            }

            const nextChoice = incomingChoices[visibleChoices.length];
            const isCorrect =
                nextChoice === "apple"
                    ? appleMUP >= bananaMUP
                    : bananaMUP >= appleMUP;

            // 1. HIGHLIGHT & PULSE: Set states to trigger UI changes.
            setHighlightedItem({ choice: nextChoice, isCorrect });
            setVisibleChoices((prev) => [...prev, nextChoice]);
            setPulsingChoice(nextChoice);

            // 2. WAIT & REMOVE PULSE: After 0.5s, remove the pulse effect.
            // This runs in parallel to the main 2s wait.
            setTimeout(() => setPulsingChoice(null), 500);

            // Wait for the full animation duration.
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // 3. UPDATE BASKET: Add the item and clear the border highlight.
            setHighlightedItem(null);

            // 4. UNLOCK: Allow the next animation to start.
            isAnimating.current = false;
        };

        // --- ENTRY POINT FOR THE EFFECT ---
        if (incomingChoices.length === 0 && visibleChoices.length > 0) {
            isAnimating.current = false;
            setVisibleChoices([]);
            setHighlightedItem(null);
            setPulsingChoice(null); // Clear pulse state on reset
            return;
        }

        if (
            !isAnimating.current &&
            incomingChoices.length > visibleChoices.length
        ) {
            isAnimating.current = true;
            processNextChoice();
        }
    }, [incomingChoices.length, visibleChoices.length, isAnimating.current, appleMUP, bananaMUP]);

    const appleData = [
        { label: "Price", value: `$2` },
        { label: "Marginal Utility", value: appleMU },
        { label: "MU/Price Ratio", value: appleMUP.toFixed(1) },
    ];

    const bananaData = [
        { label: "Price", value: `$1` },
        { label: "Marginal Utility", value: bananaMU },
        { label: "MU/Price Ratio", value: bananaMUP.toFixed(1) },
    ];

    return (
        <div className="w-full min-h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-green-50 p-4 sm:p-6">
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-6">
                <h2 className="text-3xl md:text-2xl font-bold text-gray-700 text-center">
                    Fruit Picking
                </h2>

                <div className="flex md:flex-row gap-6 md:gap-8 w-full justify-center">
                    <InfoCard
                        title={"Apple #" + (appleCount + 1)}
                        emoji="🍎"
                        data={appleData}
                        isHighlighted={highlightedItem?.choice === "apple"}
                        isPulsing={pulsingChoice === "apple"}
                        isCorrect={
                            highlightedItem?.choice === "apple"
                                ? highlightedItem.isCorrect
                                : null
                        }
                    />
                    <InfoCard
                        title={"Banana #" + (bananaCount + 1)}
                        emoji="🍌"
                        data={bananaData}
                        isHighlighted={highlightedItem?.choice === "banana"}
                        isPulsing={pulsingChoice === "banana"}
                        isCorrect={
                            highlightedItem?.choice === "banana"
                                ? highlightedItem.isCorrect
                                : null
                        }
                    />
                </div>

                <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
                    <p className="text-xl text-gray-700 font-semibold bg-white/70 px-4 pb-2 rounded-lg">
                        Basket Cost: ${totalCost}
                        <span className="text-gray-500 font-normal">
                            {" "}
                            / Budget: $7
                        </span>
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center items-center p-4 min-h-[6rem] rounded-lg bg-yellow-50 border-2 border-dashed border-yellow-300">
                        {visibleChoices.length > 0 ? (
                            visibleChoices.map((choice, index) => (
                                <span key={index} className="text-4xl">
                                    {choice === "apple" ? "🍎" : "🍌"}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500">
                                Your basket is empty.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Component;