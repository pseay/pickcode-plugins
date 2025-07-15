//law of supply demo
for (let i = -0.8; i < 0.8; i+= 0.0001) {
     setPrice(i)
     setQuantity(i)
     }
     
     
     

     //law of demand demo:
     for (let i = -0.8; i < 0.8; i+= 0.0001) {
     setPrice(-i)
     setQuantity(i)
     }
     
     
     for (let i =0; i < 0.8; i +=0.0001) {
     addDemand(0.0001)
     }
     

     for (let i = 0; i < 1; i+= 0.1) {
          setPrice(i)
          setQuantity(i)
          draw()
          
        }
// Cool animation to see the equilibrium point move
let counter = 0;

let id = setInterval(() => {
     addDemand(0.001);
     drawHelpers();
     if (++counter == 1000) clearInterval(id);
}, 5);