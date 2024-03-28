const cv = document.querySelector('canvas');

const colors = {
    particle : null,
    spring : null
}

function get_colors() {

    const html_styles = getComputedStyle(document.documentElement);

    Object.keys(colors).forEach(color => {

        colors[color] = html_styles.getPropertyValue(`--${color}-color`);

    })

}

get_colors();

const ctx = cv.getContext('2d');
const N_PARTICLES = 20;
const H = 500;
const W = 500;
const R = 10;
let MASS = 2;

const params = {STIFFNESS: 0.05, REST_LEN: 0, DAMPING: 0.01, TIMESTEP: 10000, SPEEDLIMIT: 15};
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

const p2 = new Particle(
    new Vec(100,100)
)

particles.push(p0, p1, p2);


function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
}

let anim;
let t_ant = 0;

let dt;
let started = false;

function get_fr(t) {

    if (!t_ant) t_ant = t;
    dt = t - t_ant;
    t_ant = t;

    if (!started) {

        started = true;

        window.requestAnimationFrame(get_fr);

    } else {

        anim = window.requestAnimationFrame(loop)

    }
}

// accumulate forces: GRAVITY, SPRING, PRESSURE
// integrate
// display

function loop(t) {


    //the highest precision available is the duration of a single frame, 16.67ms @60hz
    const dt = 20;//t - t_ant;
    t_ant = t;

    clearCanvas();

    force_registry.updateForces();

    particles.forEach( (p, i) => {
        
        p.time_step(dt/params.TIMESTEP);
        p.render(ctx);

    })

    anim = window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(get_fr);
