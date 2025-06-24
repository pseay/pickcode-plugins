import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import State from "./state";

const Component = observer(({ state }: { state: State | undefined }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Show Utils 
            ctx.fillStyle = "white";
            ctx.font = "14px sans-serif";
            const x = canvas.width / 2;
            const y = canvas.height / 2;
            ctx.fillText("Utils: " + state?.utils, x - 15, y - 20);

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationRef.current);
    }, [state?.utils]);

    return (
        <div className="w-full h-full flex items-center justify-center bg-black">
            <canvas ref={canvasRef} style={{ display: "block" }} />
        </div>
    );
});

export default Component;
