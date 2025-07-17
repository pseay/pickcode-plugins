import { observer } from "mobx-react-lite";
import State from "./state";
import { useEffect, useRef } from "react";

const Component = observer(({ state }: { state: State | undefined }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const vectors = state?.vectors || [];
    const components = state?.components || [];

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || !state) {
            return;
        }

        const draw = () => {
            const { width, height } = container.getBoundingClientRect();
            canvas.width = width - 10;
            canvas.height = height - 10;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);

            const scale = Math.min(canvas.width, canvas.height) / 400;

            for (const vector of state.vectors) {
                const { magnitude, angle } = vector;
                const angleRad = angle * (Math.PI / 180);
                const x = magnitude * Math.cos(angleRad) * scale;
                const y = -magnitude * Math.sin(angleRad) * scale;

                ctx.strokeStyle = "blue";
                ctx.fillStyle = "blue";
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
                const xComponentScaled = xComponent * scale;
                const yComponentScaled = yComponent * scale;

                ctx.strokeStyle = "green";
                ctx.fillStyle = "green";
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(xComponentScaled, 0);
                ctx.stroke();

                ctx.save();
                ctx.translate(xComponentScaled, 0);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                const xDir = Math.sign(xComponent) || 1;
                ctx.lineTo(xDir * -10, -5);
                ctx.lineTo(xDir * -10, 5);
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                ctx.strokeStyle = "red";
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.moveTo(xComponentScaled, 0);
                ctx.lineTo(xComponentScaled, -yComponentScaled);
                ctx.stroke();

                ctx.save();
                ctx.translate(xComponentScaled, -yComponentScaled);
                ctx.rotate(-Math.PI / 2);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                const yDir = Math.sign(yComponent) || 1;
                ctx.lineTo(yDir * -10, -5);
                ctx.lineTo(yDir * -10, 5);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            ctx.restore();
        };

        const resizeObserver = new ResizeObserver(draw);
        resizeObserver.observe(container);
        draw();

        return () => resizeObserver.disconnect();
    }, [vectors, components, state]);

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%", boxSizing: "border-box" }}>
            <canvas
                ref={canvasRef}
                style={{ border: "1px solid black" }}
            ></canvas>
        </div>
    );
});

export default Component;
