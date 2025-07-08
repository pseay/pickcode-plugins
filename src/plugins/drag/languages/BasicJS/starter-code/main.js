function getNextPosition(currentPosition, currentVelocity, timestep, getDrag) {
  const nextPosX = currentPosition.x + (timestep * currentVelocity.x);
  const nextPosY = currentPosition.y + (timestep * currentVelocity.y);
  
  const dragAcceleration = getDrag(currentVelocity);
  const accelerationX = dragAcceleration.x;
  const accelerationY = dragAcceleration.y - 9.81;

  const nextVelX = currentVelocity.x + (accelerationX * timestep);
  const nextVelY = currentVelocity.y + (accelerationY * timestep);

  return {
    x: nextPosX,
    y: nextPosY,
    xVel: nextVelX,
    yVel: nextVelY,
  };
}

function getNextPositionMidpoint(currentPosition, currentVelocity, timestep, getDrag) {
  const startDrag = getDrag(currentVelocity);
  const startAccX = startDrag.x;
  const startAccY = startDrag.y - 9.81;

  const midVel = {
    x: currentVelocity.x + (startAccX * timestep * 0.5),
    y: currentVelocity.y + (startAccY * timestep * 0.5)
  };

  const midDrag = getDrag(midVel);
  const midAcc = {x: midDrag.x, y: midDrag.y - 9.81};

  const nextPos = {
    x: currentPosition.x + midVel.x * timestep,
    y: currentPosition.y + midVel.y * timestep,
  };

  const nextVel = {
    x: currentVelocity.x + midAcc.x * timestep,
    y: currentVelocity.y + midAcc.y * timestep,
  };

  return {
    x: nextPos.x,
    y: nextPos.y,
    xVel: nextVel.x,
    yVel: nextVel.y,
  };
}

runSimulation(getNextPosition);