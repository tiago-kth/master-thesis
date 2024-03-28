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


const params = {STIFFNESS: 0.05, REST_LEN: 0, DAMPING: 0.01, TIMESTEP: 10000, SPEEDLIMIT: 15, MASS: 2};
//{STIFFNESS: 0.5, REST_LEN: 60, DAMPING: 0.01, TIMESTEP: 2000};

const particles = [];
const springs = [];

cv.width = W;
cv.height = H;

const center = new Vec(W/2, H/2);

function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
}

let anim;
let t_ant = 0;

let dt;
let started = false;

const g = new Vec(0,1);

function compute_gravity() {

    blobs.forEach(b => {
        b.particles.forEach(p => {
            p.add_force( Vec.mult(g, p.getMass() ) );
        })
    })

}


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
