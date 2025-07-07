import { observer } from "mobx-react-lite";
import React, { useRef, useEffect, useState } from "react";
import State from "./state";

const Component = observer(({ state }: { state: State | undefined }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scale, setScale] = useState(10); // Pixels per meter
    const [offsetX, setOffsetX] = useState(50); // Offset for x-axis to center the ball
    const [offsetY, setOffsetY] = useState(400); // Offset for y-axis to invert and position

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !state) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw ground
            ctx.beginPath();
            ctx.moveTo(0, offsetY);
            ctx.lineTo(canvas.width, offsetY);
            ctx.strokeStyle = "#555";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw predicted path
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;
            state.predictedPath.forEach((pos, index) => {
                const x = pos.x * scale + offsetX;
                const y = offsetY - pos.y * scale;
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();

            // Draw actual path
            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.lineWidth = 2;
            state.actualPath.forEach((pos, index) => {
                const x = pos.x * scale + offsetX;
                const y = offsetY - pos.y * scale;
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();

            // Draw tennis ball
            ctx.beginPath();
            ctx.arc(state.ballPosition.x * scale + offsetX, offsetY - state.ballPosition.y * scale, 10, 0, Math.PI * 2);
            ctx.fillStyle = "yellow";
            ctx.fill();
            ctx.strokeStyle = "orange";
            ctx.lineWidth = 1;
            ctx.stroke();

            if (state.isComplete) {
                ctx.fillStyle = "black";
                ctx.font = "24px Arial";
                ctx.fillText("Simulation Complete!", 10, 30);
            }

            if (state.error) {
                ctx.fillStyle = "red";
                ctx.font = "16px Arial";
                ctx.fillText(`Error: ${state.error}`, 10, 60);
            }
        };

        draw();

    }, [state?.predictedPath, state?.actualPath, state?.ballPosition, state?.isComplete, state?.error, scale, offsetX, offsetY]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
            <h2 className="text-2xl font-bold mb-4">Tennis Ball Simulation</h2>
            <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="bg-white border border-gray-300 shadow-lg"
            ></canvas>
            <div className="mt-4 text-sm text-gray-600">
                <p>Blue Line: Your Predicted Path</p>
                <p>Green Line: Actual Path</p>
                <p>Yellow Ball: Actual Ball Position</p>
            </div>
        </div>
    );
});

export default Component;
