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
            const TIMESTEP = 0.05; // seconds

            const INITIAL_SPEED = 45; // Initial speed
            const INITIAL_ANGLE = 0.25 * Math.PI; // Angle of inclination for launch
            const WIND_SPEED_X = -12; // Headwind speed in m/s (negative for headwind)

            const getDrag = (velocity: { x: number; y: number }) => {
                const relativeVelocityX = velocity.x - WIND_SPEED_X;
                const relativeVelocityY = velocity.y;
                const relativeSpeed = Math.sqrt(
                    relativeVelocityX * relativeVelocityX +
                        relativeVelocityY * relativeVelocityY
                );
                // Calculate drag acceleration directly (drag force / mass)
                const dragAccelerationMagnitude =
                    (0.5 * RHO * A * CD * relativeSpeed * relativeSpeed) / M;
                const dragX =
                    -dragAccelerationMagnitude *
                    (relativeVelocityX / relativeSpeed);
                const dragY =
                    -dragAccelerationMagnitude *
                    (relativeVelocityY / relativeSpeed);
                return { x: dragX, y: dragY };
            };

            let predictedPath: { x: number; y: number }[] = [];
            let actualPath: { x: number; y: number }[] = [];

            // Initial conditions
            let initial_velocity = {
                x: INITIAL_SPEED * Math.cos(INITIAL_ANGLE),
                y: INITIAL_SPEED * Math.sin(INITIAL_ANGLE),
            };
            let currentPositionPredicted = { x: 0, y: 1 };
            let currentVelocityPredicted = { ...initial_velocity };

            let currentPositionActual = { x: 0, y: 1 };
            let currentVelocityActual = { ...initial_velocity };

            predictedPath.push({ ...currentPositionPredicted });
            actualPath.push({ ...currentPositionActual });

            let isComplete = false;
            let time = 0;

            const getNextPositionActual = (
                currentPos: { x: number; y: number },
                lastVel: { x: number; y: number },
                dt: number
            ) => {
                const dragAcceleration = getDrag(lastVel); // Now returns acceleration
                const accelerationX = dragAcceleration.x;
                const accelerationY = dragAcceleration.y - G;

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
