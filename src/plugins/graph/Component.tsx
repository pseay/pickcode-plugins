import { observer } from "mobx-react-lite";
import React, { useRef, useEffect, useState } from "react";
import State from "./state";

const Component = observer(({ state }: { state: State | undefined }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scale, setScale] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const drawables = state?.drawables || [];
    const minSize = 200; // The canvas will be no smaller than minSize x minSize units

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement;
        if (!container) return;

        const setCanvasDimensions = () => {
            const { clientWidth, clientHeight } = container;
            canvas.width = clientWidth;
            canvas.height = clientHeight;
            setOffsetX(clientWidth / 2);
            setOffsetY(clientHeight / 2);

            const newScale = Math.min(
                clientWidth / minSize,
                clientHeight / minSize
            );
            setScale(newScale);
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

            // Draw grid labels
            const gridSize = 10 * scale;

            // X-axis labels
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            for (
                let x = offsetX + gridSize, i = 10;
                x < canvas.width;
                x += gridSize, i += 10
            ) {
                ctx.save();
                ctx.translate(x, offsetY + 10);
                ctx.rotate(Math.PI / 4);
                ctx.fillText(i.toString(), 0, 0);
                ctx.restore();
            }
            for (
                let x = offsetX - gridSize, i = -10;
                x >= 0;
                x -= gridSize, i -= 10
            ) {
                ctx.save();
                ctx.translate(x, offsetY + 10);
                ctx.rotate(Math.PI / 4);
                ctx.fillText(i.toString(), 0, 0);
                ctx.restore();
            }

            // Y-axis labels
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            for (
                let y = offsetY + gridSize, i = -10;
                y < canvas.height;
                y += gridSize, i -= 10
            ) {
                ctx.fillText(i.toString(), offsetX - 20, y);
            }
            for (
                let y = offsetY - gridSize, i = 10;
                y >= 0;
                y -= gridSize, i += 10
            ) {
                ctx.fillText(i.toString(), offsetX - 20, y);
            }
        };

        const drawVector = (
            x1: number,
            y1: number,
            color: string,
            lineWidth = 2
        ) => {
            const x2 = offsetX + x1 * scale;
            const y2 = offsetY - y1 * scale;
            const x1_canvas = offsetX;
            const y1_canvas = offsetY;

            ctx.beginPath();
            ctx.moveTo(x1_canvas, y1_canvas);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.stroke();

            const angle = Math.atan2(y2 - y1_canvas, x2 - x1_canvas);
            ctx.save();
            ctx.translate(x2, y2);
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

        const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string) => {
            ctx.beginPath();
            ctx.moveTo(offsetX + x1 * scale, offsetY - y1 * scale);
            ctx.lineTo(offsetX + x2 * scale, offsetY - y2 * scale);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        const drawPoint = (x: number, y: number, color: string) => {
            ctx.beginPath();
            ctx.arc(offsetX + x * scale, offsetY - y * scale, 3, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        };

        const drawCircle = (x: number, y: number, radius: number, color: string) => {
            ctx.beginPath();
            ctx.arc(offsetX + x * scale, offsetY - y * scale, radius * scale, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
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

            // Draw drawables.
            for (const drawable of drawables) {
                switch (drawable.type) {
                    case "line":
                        drawLine(drawable.x1, drawable.y1, drawable.x2, drawable.y2, drawable.color);
                        break;
                    case "point":
                        drawPoint(drawable.x, drawable.y, drawable.color);
                        break;
                    case "circle":
                        drawCircle(drawable.x, drawable.y, drawable.radius, drawable.color);
                        break;
                    case "vector":
                        drawVector(drawable.x1, drawable.y1, drawable.color);
                        break;
                }
            }
        };

        draw();
    }, [drawables.length, scale, offsetX, offsetY]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
});

export default Component;
