import { observer } from "mobx-react-lite";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import State from "./state";

const Component = observer(({ state }: { state: State | undefined }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const choices = [...(state?.choices || [])];

    const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        // If state is not available, do nothing.
        if (!state) return;

        // Calculate all needed values from the state object.
        const appleCount = choices.filter(c => c == "apple").length;
        const bananaCount = choices.filter(c => c == "banana").length;
        const applePrice = 2;
        const bananaPrice = 1;
        const appleMU = 30 - (10 * appleCount);
        const bananaMU = 20 - (5 * bananaCount);
        const appleMUP = appleMU/applePrice;
        const bananaMUP = bananaMU/bananaPrice;
        const totalCost = appleCount * applePrice + bananaCount * bananaPrice;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set up colors
        const basketColor = '#8B4513';
        const appleColor = '#FF6B6B';
        const bananaColor = '#FFE66D';
        const textColor = '#333';

        // Draw title
        ctx.fillStyle = textColor;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Marginal Utility Maximization', canvas.width / 2, 40);

        // Draw price and utility information
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';

        // Apple info
        ctx.fillStyle = appleColor;
        ctx.fillText('🍎 Apples', 50, 80);
        ctx.fillStyle = textColor;
        ctx.fillText(`Price: $${applePrice}`, 50, 105);
        ctx.fillText(`Marginal Utility: ${appleMU}`, 50, 125);
        ctx.fillText(`MU/P Ratio: ${appleMUP.toFixed(1)}`, 50, 145);
        ctx.fillText(`Quantity: ${appleCount}`, 50, 165);

        // Banana info
        ctx.fillStyle = bananaColor;
        ctx.fillText('🍌 Bananas', 300, 80);
        ctx.fillStyle = textColor;
        ctx.fillText(`Price: $${bananaPrice}`, 300, 105);
        ctx.fillText(`Marginal Utility: ${bananaMU}`, 300, 125);
        ctx.fillText(`MU/P Ratio: ${bananaMUP.toFixed(1)}`, 300, 145);
        ctx.fillText(`Quantity: ${bananaCount}`, 300, 165);

        // Draw basket at bottom
        const basketX = canvas.width / 2 - 150;
        const basketY = canvas.height - 120;
        const basketWidth = 300;
        const basketHeight = 80;

        ctx.fillStyle = basketColor;
        ctx.fillRect(basketX, basketY, basketWidth, basketHeight);
        ctx.fillStyle = '#654321';
        ctx.fillRect(basketX - 10, basketY - 10, basketWidth + 20, 15);
        ctx.fillStyle = textColor;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Shopping Basket', canvas.width / 2, basketY - 20);

        // Draw items in basket
        const itemsPerRow = 8;
        choices.forEach((choice, index) => {
            const row = Math.floor(index / itemsPerRow);
            const col = index % itemsPerRow;
            const x = basketX + 20 + (col * 35);
            const y = basketY + 20 + (row * 35);

            if (choice === 'apple') {
                ctx.font = '28px Arial';
                ctx.textAlign = 'left';
                ctx.fillText('🍎', x + 5, y + 28);
            } else if (choice === 'banana') {
                ctx.font = '28px Arial';
                ctx.textAlign = 'left';
                ctx.fillText('🍌', x + 5, y + 28);
            }
        });

        // Total cost and instructions
        ctx.fillStyle = textColor;
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Total Cost: $${totalCost}. Budget: $7.`, canvas.width / 2, canvas.height - 20);
    }, [state, [...choices]]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 600;
        canvas.height = 400;

        draw(ctx, canvas);
    }, [draw]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-green-50 p-4">
            <canvas
                ref={canvasRef}
                className="border-2 border-gray-300 rounded-lg shadow-lg bg-white mb-4"
            />
        </div>
    );
});

export default Component;