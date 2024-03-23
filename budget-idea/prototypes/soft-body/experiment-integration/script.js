const cv = document.querySelector('canvas');

const ctx = cv.getContext('2d');
const N_PARTICLES = 20;
const H = 500;
const W = 500;
const R = 10;
let MASS = 2;

const params = {STIFFNESS: 0.05, REST_LEN: 0, DAMPING: 0.01, TIMESTEP: 1000, SPEEDLIMIT: 15};
//{STIFFNESS: 0.5, REST_LEN: 60, DAMPING: 0.01, TIMESTEP: 2000};

const particles = [];
const springs = [];

cv.width = W;
cv.height = H;

const center = new Vec(W/2, 150);

const p0 = new Particle(
    new Vec(50,200),
    10,
    10,
    new Vec(1,0),
    new Vec(1,0),
    "Updates velocity, then position"
)

const p0a = new P2(
    new Vec(50,400),
    10,
    10,
    new Vec(1,0),
    new Vec(1,0),
    "Updates position, then velocity"
)

particles.push(p0, p0a);

function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
}

let anim;
let t_ant = 0;

let t_perf0, t_perf1;
let dt_perfs = Array(100)

function loop(t) {

    if (!t_ant) t_ant = t;
    //the highest precision available is the duration of a single frame, 16.67ms @60hz
    const dT = 20;//t - t_ant;
    t_ant = t;


    clearCanvas();

    particles.forEach( (p, i) => {
        p.update(dT);
        p.checkBounds();

        p.checkCollisions(particles);
        p.display(ctx);

    })

    anim = window.requestAnimationFrame(loop);
}

anim = window.requestAnimationFrame(loop);


