import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import State from "./state";

// InfoCard sub-component remains the same.
const InfoCard = ({ title, emoji, data, isHighlighted, isCorrect }: { 
    title: string, 
    emoji: string, 
    data: { label: string, value: string | number }[],
    isHighlighted: boolean,
    isCorrect: boolean | null
}) => {
    const classNames = [
        "bg-white p-6 rounded-lg shadow-md sm:w-72 flex-shrink-0 transition-all duration-300"
    ];

    if (isHighlighted) {
        classNames.push("transform scale-105 bg-yellow-100");
        if (isCorrect === true) {
            classNames.push("border-4 border-green-500");
        } else if (isCorrect === false) {
            classNames.push("border-4 border-red-500");
        }
    }

    return (
        <div className={classNames.join(' ')}>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                <span>{emoji}</span>
                <span>{title}</span>
            </h3>
            <table className="w-full text-left">
                <tbody>
                    {data.map(({ label, value }, index) => (
                        <tr key={index} className="border-b last:border-b-0 border-gray-100">
                            <td className="py-2 pr-2 text-gray-600">{label}:</td>
                            <td className="py-2 pl-2 font-medium text-gray-800">{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const Component = observer(({ state }: { state: State | undefined }) => {
    const [visibleChoices, setVisibleChoices] = useState<string[]>([]);
    const [currentItem, setCurrentItem] = useState<{ choice: string, isCorrect: boolean } | null>(null);
    
    // This ref is used to prevent an animation from starting while another is running.
    const isAnimating = useRef(false);
    
    // Get the choices array from the MobX state.
    const incomingChoices = state?.choices || [];

    // Update stats when visible chioces change.
    const {
        appleCount, bananaCount, appleMU, bananaMU, appleMUP, bananaMUP, totalCost
    } = useMemo(() => {
        const appleCount = visibleChoices.filter(c => c === "apple").length;
        const bananaCount = visibleChoices.filter(c => c === "banana").length;
        const applePrice = 2;
        const bananaPrice = 1;
        const appleMU = 30 - (10 * appleCount);
        const bananaMU = 20 - (5 * bananaCount);
        const appleMUP = appleMU / applePrice;
        const bananaMUP = bananaMU / bananaPrice;
        const totalCost = appleCount * applePrice + bananaCount * bananaPrice;

        return { appleCount, bananaCount, appleMU, bananaMU, appleMUP, bananaMUP, totalCost };
    }, [visibleChoices]);

    // --- MAIN ANIMATION EFFECT ---
    useEffect(() => {
        // Handle simulation reset
        if (incomingChoices.length === 0 && visibleChoices.length > 0) {
            isAnimating.current = false;
            setVisibleChoices([]);
            setCurrentItem(null);
            return;
        }

        // Check if there's a new item to animate and if we aren't already animating.
        if (incomingChoices.length > visibleChoices.length && !isAnimating.current) {
            isAnimating.current = true; // Set a lock to prevent multiple animations at once

            const nextChoice = incomingChoices[visibleChoices.length];

            const processNextChoice = async () => {
                const isCorrect = nextChoice === 'apple' 
                    ? appleMUP >= bananaMUP 
                    : bananaMUP > appleMUP;

                // 1. Highlight the card
                setCurrentItem({ choice: nextChoice, isCorrect });
                
                // 2. Wait 1 second
                await new Promise(resolve => setTimeout(resolve, 10000));
                
                // 3. Add item to basket, remove highlight, and unlock for the next animation
                setVisibleChoices(prev => [...prev, nextChoice]);
                setCurrentItem(null);
                isAnimating.current = false;
            };
            
            processNextChoice();
        }
    // Dependency array:
    // - `incomingChoices.length`: A stable primitive that detects when MobX adds/removes items.
    // - `visibleChoices`: Triggers the effect to run again after an animation finishes, to check for the next item.
    }, [incomingChoices.length, visibleChoices, appleMUP, bananaMUP]);

    const appleData = [
        { label: "Price", value: "$2" },
        { label: "Marginal Utility", value: appleMU },
        { label: "MU/Price Ratio", value: appleMUP.toFixed(1) },
        { label: "Quantity", value: appleCount }
    ];

    const bananaData = [
        { label: "Price", value: "$1" },
        { label: "Marginal Utility", value: bananaMU },
        { label: "MU/Price Ratio", value: bananaMUP.toFixed(1) },
        { label: "Quantity", value: bananaCount }
    ];
    
    return (
        <div className="w-full min-h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-green-50 p-4 sm:p-6">
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-700 text-center">
                    Marginal Utility Maximization
                </h2>

                <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full justify-center">
                    <InfoCard 
                        title="Apples" 
                        emoji="🍎" 
                        data={appleData}
                        isHighlighted={currentItem?.choice === 'apple'}
                        isCorrect={currentItem?.choice === 'apple' ? currentItem.isCorrect : null}
                    />
                    <InfoCard 
                        title="Bananas" 
                        emoji="🍌" 
                        data={bananaData} 
                        isHighlighted={currentItem?.choice === 'banana'}
                        isCorrect={currentItem?.choice === 'banana' ? currentItem.isCorrect : null}
                    />
                </div>

                <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                        Shopping Basket
                    </h3>
                    <div className="flex flex-wrap gap-3 justify-center items-center p-4 min-h-[6rem] rounded-lg bg-yellow-50 border-2 border-dashed border-yellow-300">
                        {visibleChoices.length > 0 ? (
                            visibleChoices.map((choice, index) => (
                                <span key={index} className="text-4xl">
                                    {choice === 'apple' ? '🍎' : '🍌'}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500">Your basket is empty.</p>
                        )}
                    </div>
                </div>

                <p className="text-xl text-gray-700 font-semibold bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow">
                    Total Cost: ${totalCost}
                    <span className="text-gray-500 font-normal"> / Budget: $7</span>
                </p>
            </div>
        </div>
    );
});

export default Component;