const cv = document.querySelector('canvas');

const ctx = cv.getContext('2d');

const H = 500;
const W = 500;
const N_PARTICLES = 20;
const STIFFNESS = 0.001;
const REST_LEN = 100;
const R = 5;
const MASS = 1;
const TIMESTEP = 10;

cv.width = W;
cv.height = H;

const grid = new Grid(W, H, 100, ctx);
/*
const p0 = new Particle( new Vec(100, 100), 10, grid, 0, MASS );
const p1 = new Particle( new Vec(200, 100), 10, grid, 1, MASS );
const p2 = new Particle( new Vec(200, 200), 10, grid, 2, MASS );
const p3 = new Particle( new Vec(100, 200), 10, grid, 2, MASS);

particles.push(p0, p1, p2, p3);
particles.forEach(p => {
    p.updateGridPos();
    grid.addParticle(p);
})
*/

const p1 = new Particle(
    new Vec(200,200),
    100,
    grid,
    0,
    100,
    new Vec(2, 0.1),
    new Vec(0, 0)
)

const p2 = new Particle(
    new Vec(400,200),
    10,
    grid,
    1,
    10,
    new Vec(-1, 0),
    new Vec(0, 0)
)

const particles = [p1, p2];

particles.forEach(p => {
    p.updateGridPos();
    grid.addParticle(p);
})


function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
}

let anim;
let t_ant = 0;

let t_perf0, t_perf1;
let dt_perfs = Array(100)

let count = 0;

function loop(t) {

    //perf
    //t_perf0 = window.performance.now();
    // end perf

    if (!t_ant) t_ant = t;

    //the highest precision available is the duration of a single frame, 16.67ms @60hz
    const dT = t - t_ant;
    //console.log(dT);
    t_ant = t;

    //console.log(dT);
    clearCanvas();

    grid.display();

    //springs.forEach(s => s.update(ctx));

    particles.forEach( (p, i) => {
        p.update(dT);
        p.checkBounds();
    
        p.updateGridPos();

        // update grid information, if the particle changed cell
        if ( p.getChangedCell() ) {
            //console.log('Particula ', p.index, ' mudou de célula');
            grid.removeParticle(p);
            grid.addParticle(p);
        } else {
            //console.log('Particula ', p.index, ' NÃO mudou de célula');
        }

        const neighbours = grid.getNeighbours(p);

        p.checkCollisions(neighbours);
        /*
        if (i == 0) {
            //p.displayGridCell(ctx);
            neighbours.forEach(n => n.displayGridCell(ctx));
        }*/
        p.display(ctx);
        //p.displayVel(ctx);
    })

    //springs.forEach(s => s.display(ctx));
    count++

    // perf 
    /*
    t_perf1 = window.performance.now();
    const dt = t_perf1 - t_perf0;
    dt_perfs.push(dt);
    if (dt_perfs.length > 100) {
        dt_perfs.splice(0, 1);
        const avg_dt_perf = dt_perfs.reduce( (p, c) => (p + c) ) / dt_perfs.length;
        console.log("Average time to execute frame: ", avg_dt_perf.toFixed(2), "ms");
    } */
    // end perf


    anim = window.requestAnimationFrame(loop);
}

anim = window.requestAnimationFrame(loop);
//loop();

// interac

const stopBTN = document.querySelector('[data-btn="stop"]');
stopBTN.addEventListener('click', e => {
    if (e.target.innerText == 'stop') {
        e.target.innerText = "resume";
        window.cancelAnimationFrame(anim);
    } else {
        e.target.innerText = "stop";
        anim = window.requestAnimationFrame(loop);
    }
    
})