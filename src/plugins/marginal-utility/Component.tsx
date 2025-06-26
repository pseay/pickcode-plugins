import { observer } from "mobx-react-lite";
import React from 'react';
import State from "./state";

// A small sub-component for the info cards to keep the main component clean.
const InfoCard = ({ title, emoji, data }: { title: string, emoji: string, data: { label: string, value: string | number }[] }) => (
    <div className="bg-white p-6 rounded-lg shadow-md sm:w-72 flex-shrink-0">
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

const Component = observer(({ state }: { state: State | undefined }) => {
    // Calculate all needed values from the state object.
    const choices = [...(state?.choices || [])];
    const appleCount = choices.filter(c => c === "apple").length;
    const bananaCount = choices.filter(c => c === "banana").length;
    const applePrice = 2;
    const bananaPrice = 1;
    const appleMU = 30 - (10 * appleCount);
    const bananaMU = 20 - (5 * bananaCount);
    const appleMUP = (appleMU / applePrice).toFixed(1);
    const bananaMUP = (bananaMU / bananaPrice).toFixed(1);
    const totalCost = appleCount * applePrice + bananaCount * bananaPrice;

    const appleData = [
        { label: "Price", value: `$${applePrice}` },
        { label: "Marginal Utility", value: appleMU },
        { label: "MU/Price Ratio", value: appleMUP },
        { label: "Quantity", value: appleCount }
    ];

    const bananaData = [
        { label: "Price", value: `$${bananaPrice}` },
        { label: "Marginal Utility", value: bananaMU },
        { label: "MU/Price Ratio", value: bananaMUP },
        { label: "Quantity", value: bananaCount }
    ];

    return (
        <div className="w-full min-h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-green-50 p-4 sm:p-6">
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-6">
                
                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-700 text-center">
                    Marginal Utility Maximization
                </h2>

                {/* Info Cards Section */}
                <div className="flex flex md:flex-row gap-6 md:gap-8 w-full justify-center">
                    <InfoCard title="Apples" emoji="🍎" data={appleData} />
                    <InfoCard title="Bananas" emoji="🍌" data={bananaData} />
                </div>

                {/* Shopping Basket Section */}
                <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                        Shopping Basket
                    </h3>
                    <div className="flex flex-wrap gap-3 justify-center items-center p-4 min-h-[6rem] rounded-lg bg-yellow-50 border-2 border-dashed border-yellow-300">
                        {choices.length > 0 ? (
                            choices.map((choice, index) => (
                                <span key={index} className="text-4xl animate-pop-in">
                                    {choice === 'apple' ? '🍎' : '🍌'}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500">Your basket is empty.</p>
                        )}
                    </div>
                </div>

                {/* Total Cost and Budget */}
                <p className="text-xl text-gray-700 font-semibold bg-white/70 backdrop-blur-sm px-4 py-2 rounded-lg shadow">
                    Total Cost: ${totalCost}
                    <span className="text-gray-500 font-normal"> / Budget: $7</span>
                </p>

            </div>
        </div>
    );
});

export default Component;