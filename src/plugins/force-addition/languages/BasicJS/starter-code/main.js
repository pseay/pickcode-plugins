function sumForces(forces) {
  let netForce = {x: 0, y: 0};
  for (let i = 0; i < forces.length; i++) {
    netForce.x += forces[i].x;
    netForce.y += forces[i].y;
  }
  return netForce;
}

const forces = [
  {x: 10, y: 10},
  {x: 15, y: -5},
  {x: -5, y: 0}
];

for (let i = 0; i < forces.length; i++) {
  drawForce(forces[i]);
}

drawForce(sumForces(forces));