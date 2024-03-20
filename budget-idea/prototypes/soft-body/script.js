const cv = document.querySelector('canvas');

const ctx = cv.getContext('2d');

const H = 500;
const W = 500;
const N_PARTICLES = 20;
const R = 10;
let MASS = 2;

const params = {STIFFNESS: 0.5, REST_LEN: 60, DAMPING: 0.01, TIMESTEP: 2000};

const particles = [];

cv.width = W;
cv.height = H;

const grid = new Grid(W, H, 50, ctx);

const p0 = new Particle( new Vec(100,  50), 10, grid, 0, MASS, new Vec(1,0), new Vec(0,0.1) );
const p1 = new Particle( new Vec(400,  50), 10, grid, 1, MASS, new Vec(-1,1), new Vec(0,0.1) );
const p2 = new Particle( new Vec(200, 150), 10, grid, 2, MASS, new Vec(1,-1), new Vec(0,0.1) );

particles.push(p0, p1, p2);
particles.forEach(p => {
    p.updateGridPos();
    grid.addParticle(p);
})

const springs = [];

const s0 = new Spring(particles[0], particles[1], params.REST_LEN, params.STIFFNESS);
const s1 = new Spring(particles[1], particles[2], params.REST_LEN, params.STIFFNESS);
const s2 = new Spring(particles[2], particles[0], params.REST_LEN, params.STIFFNESS);

springs.push(s0, s1, s2); //,s1 , s2, s3, s4, s5, s6, s7, s8);

console.log(grid.cells);
console.log(particles, particles[0].cell_col);


let count = 0;

function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
}

let anim;
let t_ant = 0;

let t_perf0, t_perf1;
let dt_perfs = Array(100)

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

    springs.forEach(s => s.update(ctx));

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

    springs.forEach(s => s.display(ctx));
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

