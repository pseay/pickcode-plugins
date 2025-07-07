import { SimulationMessage } from "../../messages";

const createExports = (sendMessage: (message: SimulationMessage) => void) => {
    return Promise.resolve({
        runSimulation: (
            getNextPosition: (
                currentPosition: { x: number; y: number },
                lastVelocity: { x: number; y: number },
                timestep: number,
                getDrag: (velocity: { x: number; y: number }) => {
                    x: number;
                    y: number;
                }
            ) => { x: number; y: number }
        ) => {
            const G = 9.81; // Acceleration due to gravity (m/s^2)
            const RHO = 1.225; // Air density (kg/m^3)
            const A = 0.004; // Cross-sectional area of a tennis ball (m^2)
            const CD = 0.5; // Drag coefficient for a sphere
            const M = 0.058; // Mass of a tennis ball (kg)
            const TIMESTEP = 0.01; // seconds

            const getDrag = (velocity: { x: number; y: number }) => {
                const speed = Math.sqrt(
                    velocity.x * velocity.x + velocity.y * velocity.y
                );
                const dragMagnitude = 0.5 * RHO * A * CD * speed * speed;
                const dragX = -dragMagnitude * (velocity.x / speed);
                const dragY = -dragMagnitude * (velocity.y / speed);
                return { x: dragX, y: dragY };
            };

            let predictedPath: { x: number; y: number }[] = [];
            let actualPath: { x: number; y: number }[] = [];

            // Initial conditions
            let currentPositionPredicted = { x: 0, y: 1 };
            let currentVelocityPredicted = { x: 30, y: 10 };

            let currentPositionActual = { x: 0, y: 1 };
            let currentVelocityActual = { x: 30, y: 10 };

            predictedPath.push({ ...currentPositionPredicted });
            actualPath.push({ ...currentPositionActual });

            let isComplete = false;
            let time = 0;

            const getNextPositionActual = (
                currentPos: { x: number; y: number },
                lastVel: { x: number; y: number },
                dt: number
            ) => {
                const dragForce = getDrag(lastVel);
                const accelerationX = dragForce.x / M;
                const accelerationY = dragForce.y / M - G;

                const currentVelX = lastVel.x + accelerationX * dt;
                const currentVelY = lastVel.y + accelerationY * dt;

                const nextPosX = currentPos.x + dt * currentVelX;
                const nextPosY = currentPos.y + dt * currentVelY;

                return {
                    position: { x: nextPosX, y: nextPosY },
                    velocity: { x: currentVelX, y: currentVelY },
                };
            };

            const interval = setInterval(() => {
                if (
                    currentPositionActual.y < 0 ||
                    currentPositionPredicted.y < 0
                ) {
                    isComplete = true;
                    clearInterval(interval);
                }

                if (!isComplete) {
                    // User's predicted path
                    const nextPredicted = getNextPosition(
                        currentPositionPredicted,
                        currentVelocityPredicted,
                        TIMESTEP,
                        getDrag
                    );
                    predictedPath.push(nextPredicted);
                    // For the user's path, we assume they only return position, so we need to re-calculate velocity based on the new position.
                    // This is a simplification for the lesson, as a true Euler method would update velocity first.
                    currentVelocityPredicted.x =
                        (nextPredicted.x - currentPositionPredicted.x) /
                        TIMESTEP;
                    currentVelocityPredicted.y =
                        (nextPredicted.y - currentPositionPredicted.y) /
                        TIMESTEP;
                    currentPositionPredicted = nextPredicted;

                    // Actual path
                    const actualResult = getNextPositionActual(
                        currentPositionActual,
                        currentVelocityActual,
                        TIMESTEP
                    );
                    currentPositionActual = actualResult.position;
                    currentVelocityActual = actualResult.velocity;
                    actualPath.push(currentPositionActual);

                    time += TIMESTEP;
                }

                sendMessage({
                    type: "simulationUpdate",
                    predictedPath: predictedPath,
                    actualPath: actualPath,
                    ballPosition: currentPositionActual, // Animate the actual ball
                    isComplete: isComplete,
                });
            }, 50); // Update every 50ms
        },
    });
};

export default createExports;
