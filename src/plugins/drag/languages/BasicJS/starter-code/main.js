function getNextPosition(currentPosition, lastVelocity, timestep, getDrag) {
    const G = 9.81; // Acceleration due to gravity (m/s^2)
    const M = 0.058; // Mass of a tennis ball (kg)

    const dragForce = getDrag(lastVelocity);
    const accelerationX = dragForce.x / M;
    const accelerationY = (dragForce.y / M) - G;

    const currentVelX = lastVelocity.x + (accelerationX * timestep);
    const currentVelY = lastVelocity.y + (accelerationY * timestep);

    const nextPosX = currentPosition.x + (timestep * currentVelX);
    const nextPosY = currentPosition.y + (timestep * currentVelY);

    let nextPosition = {
        x: nextPosX,
        y: nextPosY,
    };
    return nextPosition;
}

runSimulation(getNextPosition);