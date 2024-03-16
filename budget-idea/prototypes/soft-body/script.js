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

    const p = new Particle( new Vec(x, y), r, grid );
    p.updateGridPos(); // we could include the grid in the particle constructor...
    grid.addParticle(p);

    particles.push(p)

}

//const p = new Particle(new Vec(200,200), 5);
//console.log(p);

let count = 0;

function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
}

let anim;
let t_ant = 0;

function loop(t) {

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
            grid.removeParticle(p);
            grid.addParticle(p);
        }

        p.checkCollisions(particles);
        if (i == 0) p.displayGridCell(ctx);
        p.display(ctx);
        p.displayVel(ctx);
    })
    count++
    /*if (count < 100)*/ anim = window.requestAnimationFrame(loop);
}

anim = window.requestAnimationFrame(loop);

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