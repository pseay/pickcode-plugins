import { observer } from "mobx-react-lite";
import State from "./state";
import { useEffect, useRef } from "react";

const Component = observer(({ state }: { state: State | undefined }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const vectors = state?.vectors || [];
    const components = state?.components || [];

    useEffect(() => {
        if (!canvasRef.current || !state) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        for (const vector of state.vectors) {
            const { magnitude, angle } = vector;
            const angleRad = angle * (Math.PI / 180);
            const x = magnitude * Math.cos(angleRad);
            const y = -magnitude * Math.sin(angleRad);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(x, y);
            ctx.stroke();

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(-angleRad);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-10, -5);
            ctx.lineTo(-10, 5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        for (const components of state.components) {
            const { xComponent, yComponent } = components;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(xComponent, 0);
            ctx.stroke();

            ctx.save();
            ctx.translate(xComponent, 0);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-10, -5);
            ctx.lineTo(-10, 5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            ctx.beginPath();
            ctx.moveTo(xComponent, 0);
            ctx.lineTo(xComponent, -yComponent);
            ctx.stroke();

            ctx.save();
            ctx.translate(xComponent, -yComponent);
            ctx.rotate(-Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-10, -5);
            ctx.lineTo(-10, 5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        ctx.restore();
    }, [vectors.length, components.length]);

    return (
        <div>
            <canvas
                ref={canvasRef}
                width="500"
                height="500"
                style={{ border: "1px solid black" }}
            ></canvas>
        </div>
    );
});

export default Component;
