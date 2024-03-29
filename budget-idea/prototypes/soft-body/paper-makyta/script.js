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
const blobs = [];

cv.width = W;
cv.height = H;

const center = new Vec(W/2, H/2);

blobs.push(
    new Blob(new Vec(W/2, H/3), 100, 12)
)

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

function compute_spring_force() {

    blobs.forEach(b => {

        b.springs.forEach(s => {

            const current_length = s.get_length();

            const rest_length = s.get_rest_length();

            const s_direction = s.get_direction();

            const v12 = Vec.sub(s.p1.vel, s.p2.vel);

            const f = 
                ( current_length - rest_length ) * params.STIFFNESS 
                +
                ( Vec.dot(v12, s_direction)) * params.DAMPING
            ;

            const f_vector = Vec.mult(s_direction, f);
            const f_vector_minus = Vec.mult(f_vector, -1);

            Vec.mult(f_vector_minus, 10).display(ctx, s.p1.pos, "blue" );
            Vec.mult(f_vector, 10).display(ctx, s.p2.pos, "blue" );

            s.p1.add_force(f_vector_minus);
            s.p2.add_force(f_vector);

            s.update_normal();

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
    //t_ant = t;

    clearCanvas();

    blobs.forEach(blob => {

        blob.display(ctx);
        //blob.particles.forEach(p => p.render(ctx));
        //blob.springs.forEach(s => s.display(ctx));

    })

    /*
    particles.forEach( (p, i) => {
        
        p.time_step(dt/params.TIMESTEP);
        p.render(ctx);

    })
    */

    //anim = window.requestAnimationFrame(loop);
}

//window.requestAnimationFrame(get_fr);
