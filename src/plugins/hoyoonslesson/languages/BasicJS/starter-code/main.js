// Base curves are created automatically when you use shift functions!

// Shift the curves using simple functions
addCoconuts(0.5);  // Shift supply curve right by 0.5
addPeople(0.3);    // Shift demand curve right by 0.3
addDrought(5);    // Shift supply curve left by 50 (5 * 10)

// Show equilibrium point and helper lines
drawHelpers(); 


// Cool animation to see the equilibrium point move
let counter = 0;

let id = setInterval(() => {
     addPeople(0.001);
     drawHelpers();
     if (++counter == 1000) clearInterval(id);
}, 5);