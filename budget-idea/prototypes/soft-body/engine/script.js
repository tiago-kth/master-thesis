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

const center = new Vec(W/2, H/2);

const p0 = new Particle(
    new Vec(50,200)
)

const p1 = new Particle(
    new Vec(300,50)
)

particles.push(p0, p1);

particles.forEach(p => p.setAcc(new Vec(0, 1)));

function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
}

let anim;
let t_ant = 0;

let t_perf0, t_perf1;
let dt_perfs = Array(100);

let dt;
let started = false;

function get_fr(t) {
    if (!t_ant) t_ant = t;
    dt = t - t_ant;
    t_ant = t;
    if (!started) {

        console.log("First, dt = ", dt);

        started = true;

        window.requestAnimationFrame(get_fr);

    } else {

        anim = window.requestAnimationFrame(loop)

    }
}

function loop(t) {


    //the highest precision available is the duration of a single frame, 16.67ms @60hz
    const dt = 20;//t - t_ant;
    t_ant = t;


    clearCanvas();

    particles.forEach( (p, i) => {
        p.time_step(dt/params.TIMESTEP);
        //p.checkBounds();

        //p.checkCollisions(particles);
        p.render(ctx);

    })

    anim = window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(get_fr);
