function getNextPosition(currentPosition, lastVelocity, timestep) {
    // Implement your Forward Euler method here.
    // currentPosition: { x: number, y: number }
    // lastVelocity: { x: number, y: number }
    // timestep: number
    // Return the next position: { x: number, y: number }

    // Example (linear movement, replace with your drag equation):
    let nextPosition = {
        x: currentPosition.x + lastVelocity.x * timestep,
        y: currentPosition.y + lastVelocity.y * timestep,
    };
    return nextPosition;
}

runSimulation(getNextPosition);
