function getNextPosition(currentPosition, lastVelocity, timestep, getDrag) {
    const dragAcceleration = getDrag(lastVelocity);
    const accelerationX = dragAcceleration.x;
    const accelerationY = dragAcceleration.y;

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