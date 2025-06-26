import { observer } from "mobx-react-lite";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import State from "./state";

const Component = observer(({ state }: { state: State | undefined }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const choices = [...(state?.choices || [])];

    // Define the base dimensions for the drawing logic. All drawing will be relative to this.
    const baseWidth = 600;
    const baseHeight = 400;

    // 2. State to hold the calculated, responsive size of the canvas.
    const [size, setSize] = useState({ width: baseWidth, height: baseHeight });

    // 3. The draw function is now resolution-independent.
    const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        // If state is not available, do nothing.
        if (!state) return;

        // Calculate the scale factor based on the current canvas size vs. the base size.
        const scale = canvas.width / baseWidth;

        // Calculate all needed values from the state object.
        const appleCount = choices.filter(c => c == "apple").length;
        const bananaCount = choices.filter(c => c == "banana").length;
        const applePrice = 2;
        const bananaPrice = 1;
        const appleMU = 30 - (10 * appleCount);
        const bananaMU = 20 - (5 * bananaCount);
        const appleMUP = appleMU / applePrice;
        const bananaMUP = bananaMU / bananaPrice;
        const totalCost = appleCount * applePrice + bananaCount * bananaPrice;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set up colors
        const basketColor = '#8B4513';
        const appleColor = '#FF6B6B';
        const bananaColor = '#FFE66D';
        const textColor = '#333';

        // Draw title (scaled font and position)
        ctx.fillStyle = textColor;
        ctx.font = `bold ${24 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('Marginal Utility Maximization', canvas.width / 2, 40 * scale);

        // Draw price and utility information (scaled font and positions)
        ctx.font = `${18 * scale}px Arial`;
        ctx.textAlign = 'left';

        // Apple info
        ctx.fillStyle = appleColor;
        ctx.fillText('🍎 Apples', 50 * scale, 80 * scale);
        ctx.fillStyle = textColor;
        ctx.fillText(`Price: $${applePrice}`, 50 * scale, 105 * scale);
        ctx.fillText(`Marginal Utility: ${appleMU}`, 50 * scale, 125 * scale);
        ctx.fillText(`MU/P Ratio: ${appleMUP.toFixed(1)}`, 50 * scale, 145 * scale);
        ctx.fillText(`Quantity: ${appleCount}`, 50 * scale, 165 * scale);

        // Banana info
        ctx.fillStyle = bananaColor;
        ctx.fillText('🍌 Bananas', 300 * scale, 80 * scale);
        ctx.fillStyle = textColor;
        ctx.fillText(`Price: $${bananaPrice}`, 300 * scale, 105 * scale);
        ctx.fillText(`Marginal Utility: ${bananaMU}`, 300 * scale, 125 * scale);
        ctx.fillText(`MU/P Ratio: ${bananaMUP.toFixed(1)}`, 300 * scale, 145 * scale);
        ctx.fillText(`Quantity: ${bananaCount}`, 300 * scale, 165 * scale);

        // Draw basket at bottom (scaled dimensions and positions)
        const basketWidth = 300 * scale;
        const basketHeight = 80 * scale;
        const basketX = canvas.width / 2 - basketWidth / 2;
        const basketY = canvas.height - 140 * scale;

        ctx.fillStyle = basketColor;
        ctx.fillRect(basketX, basketY, basketWidth, basketHeight);
        ctx.fillStyle = '#654321'; // Basket rim
        ctx.fillRect(basketX - 10 * scale, basketY - 10 * scale, basketWidth + 20 * scale, 15 * scale);
        
        ctx.fillStyle = textColor;
        ctx.font = `${16 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('Shopping Basket', canvas.width / 2, basketY - 20 * scale);

        // Draw items in basket (scaled)
        choices.forEach((choice, index) => {
            const col = index;
            const x = basketX + (20 * scale) + (col * 35 * scale);
            const y = basketY + (50 * scale);
            
            ctx.font = `${28 * scale}px Arial`;
            ctx.textAlign = 'left';

            if (choice === 'apple') {
                ctx.fillText('🍎', x, y);
            } else if (choice === 'banana') {
                ctx.fillText('🍌', x, y);
            }
        });

        // Total cost and instructions (scaled)
        ctx.fillStyle = textColor;
        ctx.font = `${18 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(`Total Cost: $${totalCost}. Budget: $7.`, canvas.width / 2, canvas.height - 20 * scale);
    }, [[...choices]]); // Dependency is just the state object.

    // 4. This effect runs once to set up the resize listener.
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
                
                // Calculate scale to fit the content within the container, maintaining aspect ratio.
                const scale = Math.min(containerWidth / baseWidth, containerHeight / baseHeight);
                
                setSize({
                    width: baseWidth * scale,
                    height: baseHeight * scale,
                });
            }
        };
        // Set the initial size.
        handleResize();
        // Add event listener for window resizing.
        window.addEventListener('resize', handleResize);
        // Cleanup listener on component unmount.
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures this runs only once on mount.

    // This effect handles the actual drawing, re-running whenever the data or canvas size changes.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set the canvas element's resolution.
        canvas.width = size.width;
        canvas.height = size.height;

        draw(ctx, canvas);
    }, [draw, size]); // Re-draw if the drawing logic or size changes.

    return (
        // Assign the container ref and ensure it fills the available space.
        <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-green-50 p-4">
            <canvas
                ref={canvasRef}
                className="border-2 border-gray-300 rounded-lg shadow-lg bg-white"
            />
        </div>
    );
});

export default Component;