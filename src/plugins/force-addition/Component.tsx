import { observer } from "mobx-react-lite";
import React, { useRef, useEffect, useState } from "react";
import State, { ForceArrow } from "./state";

const Component = observer(({ state }: { state: State | undefined }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scale, setScale] = useState(5); // Pixels per Newton
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const forceArrows = state?.forceArrows || [];

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

            const newScaleX = canvas.width / 100;
            const newScaleY = canvas.height / 100;
            setScale(Math.max(1, Math.min(newScaleX, newScaleY)));
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

        const drawGrid = () => {
            ctx.strokeStyle = "#e0e0e0";
            ctx.lineWidth = 1;
            const gridSize = 10 * scale;

            // Draw vertical lines
            for (let x = offsetX; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let x = offsetX - gridSize; x >= 0; x -= gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            // Draw horizontal lines
            for (let y = offsetY; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            for (let y = offsetY - gridSize; y >= 0; y -= gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
        };

        const drawAxes = () => {
            ctx.strokeStyle = "#a0a0a0";
            ctx.lineWidth = 2;

            // X-axis
            ctx.beginPath();
            ctx.moveTo(0, offsetY);
            ctx.lineTo(canvas.width, offsetY);
            ctx.stroke();

            // Y-axis
            ctx.beginPath();
            ctx.moveTo(offsetX, 0);
            ctx.lineTo(offsetX, canvas.height);
            ctx.stroke();

            // Draw axis labels
            ctx.fillStyle = "black";
            ctx.font = "12px Arial";
            ctx.fillText("X", canvas.width - 20, offsetY - 10);
            ctx.fillText("Y", offsetX + 10, 20);
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            drawAxes();

            // Draw origin
            ctx.beginPath();
            ctx.arc(offsetX, offsetY, 5, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();

            // Draw forces from student's code
            forceArrows.forEach((force) => {
                drawForce(ctx, force);
            });
        };

        const drawForce = (
            ctx: CanvasRenderingContext2D,
            force: ForceArrow
        ) => {
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY);
            ctx.lineTo(offsetX + force.x * scale, offsetY - force.y * scale);
            ctx.strokeStyle = force.color;
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
            ctx.fillStyle = force.color;
            ctx.fill();
            ctx.restore();
        };

        draw();
    }, [forceArrows.length, scale, offsetX, offsetY]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
});

export default Component;
