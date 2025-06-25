import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useRef } from "react";
import State from "./state";

const Component = observer(({ state }: { state: State | undefined }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const choices = state?.choices || [];

    const draw = useCallback((ctx: any, canvas: any) => {
        // Clear the canvas and draw the current state 
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw a pizza with 8 slices
        ctx.fillStyle = "black";
        ctx.font = "10px sans-serif";
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        ctx.textAlign = "center";
        ctx.fillText("Utils: " + state?.choices.join(", "), x, y);
    }, [[...choices]]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        draw(ctx, canvas);
    }, [[...choices]]);

    return (
        <div className="w-full h-full flex items-center justify-center bg-white">
            <canvas ref={canvasRef} style={{ display: "block" }} />
        </div>
    );
});

export default Component;
