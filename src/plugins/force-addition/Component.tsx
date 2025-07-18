import { observer } from "mobx-react-lite";
import React, { useRef, useEffect, useState } from "react";
import State, { Force } from "./state";

const Component = observer(({ state }: { state: State | undefined }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scale, setScale] = useState(5); // Pixels per Newton
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [newForce, setNewForce] = useState<Force>({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        const setCanvasDimensions = () => {
            canvas.width = container.clientWidth - 50;
            canvas.height = container.clientHeight - 50;
            setOffsetX(canvas.width / 2);
            setOffsetY(canvas.height / 2);
        };

        setCanvasDimensions();
        window.addEventListener("resize", setCanvasDimensions);

        return () => {
            window.removeEventListener("resize", setCanvasDimensions);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !state) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw origin
            ctx.beginPath();
            ctx.arc(offsetX, offsetY, 5, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            // Draw forces
            state.forces.forEach((force) => {
                drawForce(ctx, force, "black");
            });

            // Draw forces from student's code
            state.drawnForces.forEach((force) => {
                drawForce(ctx, force, "purple");
            });

            // Draw legend
            ctx.font = "16px Arial";
            ctx.fillStyle = "black";
            ctx.fillText("Forces", 10, 30);
            ctx.fillStyle = "orange";
            ctx.fillText("Your Function's Force", 10, 50);
            ctx.fillStyle = "green";
            ctx.fillText("Net Force", 10, 70);
            ctx.fillStyle = "purple";
            ctx.fillText("Student's Drawn Forces", 10, 90);
        };

        const drawForce = (
            ctx: CanvasRenderingContext2D,
            force: Force,
            color: string
        ) => {
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY);
            ctx.lineTo(offsetX + force.x * scale, offsetY - force.y * scale);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw arrowhead
            const angle = Math.atan2(-force.y, force.x);
            ctx.save();
            ctx.translate(offsetX + force.x * scale, offsetY - force.y * scale);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-10, 5);
            ctx.lineTo(-10, -5);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
        };

        draw();
    }, [
        state?.forces,
        state?.netForce,
        state?.drawnForces.length,
        scale,
        offsetX,
        offsetY,
    ]);

    const handleAddForce = () => {
        if (state) {
            state.addForce(newForce);
            setNewForce({ x: 0, y: 0 });
        }
    };

    const handleRemoveForce = (index: number) => {
        if (state) {
            state.removeForce(index);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
            <canvas
                ref={canvasRef}
                className="bg-white border border-gray-300 shadow-lg"
            ></canvas>
            <div className="mt-4">
                <input
                    type="number"
                    placeholder="X component"
                    value={newForce.x}
                    onChange={(e) =>
                        setNewForce({ ...newForce, x: Number(e.target.value) })
                    }
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Y component"
                    value={newForce.y}
                    onChange={(e) =>
                        setNewForce({ ...newForce, y: Number(e.target.value) })
                    }
                    className="p-2 border rounded ml-2"
                />
                <button
                    onClick={handleAddForce}
                    className="p-2 bg-blue-500 text-white rounded ml-2"
                >
                    Add Force
                </button>
            </div>
            <div className="mt-4">
                <h3 className="text-lg font-bold">Forces:</h3>
                <ul>
                    {state?.forces.map((force, index) => (
                        <li key={index}>
                            ({force.x}, {force.y})
                            <button
                                onClick={() => handleRemoveForce(index)}
                                className="p-1 bg-red-500 text-white rounded ml-2"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
});

export default Component;
