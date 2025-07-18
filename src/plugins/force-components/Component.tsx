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
            ctx.lineWidth = 8;

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);

            const scale = Math.min(canvas.width, canvas.height) / 400;
            let arrowHeadLength = 20;

            // Draw vectors.
            for (const vector of state.vectors) {
                const { magnitude, angle } = vector;
                const angleRad = angle * (Math.PI / 180);
                const x = magnitude * Math.cos(angleRad) * scale;
                const y = -magnitude * Math.sin(angleRad) * scale;

                ctx.strokeStyle = "blue";
                ctx.fillStyle = "blue";
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.rotate(-angleRad);
                ctx.lineTo(magnitude * scale - arrowHeadLength + 1, 0);
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(-angleRad);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-arrowHeadLength, -arrowHeadLength / 2);
                ctx.lineTo(-arrowHeadLength, arrowHeadLength / 2);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            // Draw components.
            ctx.lineWidth = 4;
            arrowHeadLength = 15;
            for (const components of state.components) {
                const { xComponent, yComponent } = components;
                const xComponentScaled = xComponent * scale;
                const yComponentScaled = yComponent * scale;
                const xDir = Math.sign(xComponent) || 1;
                const yDir = Math.sign(yComponent) || 1;

                ctx.strokeStyle = "green";
                ctx.fillStyle = "green";
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(xComponentScaled - (arrowHeadLength - 1) * xDir, 0);
                ctx.stroke();

                ctx.save();
                ctx.translate(xComponentScaled, 0);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(xDir * -arrowHeadLength, -arrowHeadLength / 2);
                ctx.lineTo(xDir * -arrowHeadLength, arrowHeadLength / 2);
                ctx.closePath();
                ctx.fill();
                ctx.restore();

                ctx.strokeStyle = "red";
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.moveTo(xComponentScaled, 0);
                ctx.lineTo(
                    xComponentScaled,
                    -yComponentScaled + yDir * (arrowHeadLength - 1)
                );
                ctx.stroke();

                ctx.save();
                ctx.translate(xComponentScaled, -yComponentScaled);
                ctx.rotate(-Math.PI / 2);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(yDir * -arrowHeadLength, -arrowHeadLength / 2);
                ctx.lineTo(yDir * -arrowHeadLength, arrowHeadLength / 2);
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
    }, [vectors.length, components.length, state]);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", height: "100%", boxSizing: "border-box" }}
        >
            <canvas ref={canvasRef}></canvas>
        </div>
    );
});

export default Component;
