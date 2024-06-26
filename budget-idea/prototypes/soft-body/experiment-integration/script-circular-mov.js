/* 
    the idea here is to see how the different update methods behave in the long run, that is, how they introduce deviations into the expected motion of our particles. I thought this would be clearer by using circular motions, with centripetal accelarations.

    also, I wanted to visualize the velocity and acceleration vectors. 
*/

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
    new Vec(W/2,200),
    10,
    10,
    new Vec(1,0),
    new Vec(0, 1/50),
    "Updates velocity, then position",
    "white"
)

const p0a = new P2(
    new Vec(W/2,100),
    10,
    10,
    new Vec(1,0),
    new Vec(0, 1/150),
    "Updates position, then velocity",
    "yellow"
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

        ctx.beginPath()
        ctx.strokeStyle = "khaki";
        ctx.lineWidth = 1;
        ctx.arc(center.x, center.y, center.y - p.pos0.y, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();

        const v_dir = Vec.sub(center, p.pos).getUnitDir();
        const r_motion = Vec.sub(center, p.pos).mod()
        p.acc = Vec.mult(v_dir, 1 / r_motion);

        p.update(dT);
        p.checkBounds();

        p.checkCollisions(particles);
        p.display(ctx);
        Vec.mult(p.vel, 50).display(ctx, p.pos, "dodgerblue");
        Vec.mult(p.acc, 5000).display(ctx, p.pos, "tomato");

    })

    anim = window.requestAnimationFrame(loop);
}

anim = window.requestAnimationFrame(loop);


