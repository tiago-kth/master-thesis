const cv = document.querySelector('canvas');

const ctx = cv.getContext('2d');

const H = 500;
const W = 500;
const N_PARTICLES = 10;

const particles = [];

cv.width = W;
cv.height = H;

const grid = new Grid(W, H, 100, ctx);

for ( let i = 0; i < N_PARTICLES; i++ ) {

    const r = 5 + Math.random() * 10;
    const x = r + Math.random() * (W - 2 * r);
    const y = r + ( Math.random() ) * (H - 2 * r);

    const p = new Particle( new Vec(x, y), r, grid, i );
    p.updateGridPos(); // we could include the grid in the particle constructor...
    grid.addParticle(p);
    //console.log('Inicio ', p.index, p.cell_col, p.cell_row);

    particles.push(p)

}

console.log(grid.cells);

//const p = new Particle(new Vec(200,200), 5);
//console.log(p);

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
    t_perf0 = window.performance.now();
    // end perf

    if (!t_ant) t_ant = t;

    //the highest precision available is the duration of a single frame, 16.67ms @60hz
    const dT = t - t_ant;
    t_ant = t;

    //console.log(dT);
    clearCanvas();

    grid.display();

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

        p.checkCollisions(particles);
        if (i == 0) p.displayGridCell(ctx);
        p.display(ctx, i == 0);
        p.displayVel(ctx);
    })
    count++

    // perf
    t_perf1 = window.performance.now();
    const dt = t_perf1 - t_perf0;
    dt_perfs.push(dt);
    if (dt_perfs.length > 100) {
        dt_perfs.splice(0, 1);
        const avg_dt_perf = dt_perfs.reduce( (p, c) => (p + c) ) / dt_perfs.length;
        console.log("Average time to execute frame: ", avg_dt_perf.toFixed(2), "ms");
    }
    // end perf


    /*if (count < 100)*/ anim = window.requestAnimationFrame(loop);
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