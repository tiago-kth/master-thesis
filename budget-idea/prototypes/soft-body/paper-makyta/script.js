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


const params = {
    STIFFNESS: 0.05, 
    REST_LEN: 0, 
    DAMPING: 0.2, 
    TIMESTEP: 200, 
    SPEEDLIMIT: 15, 
    MASS: 2, 
    GRAVITY: 0, 
    VECTOR_SIZE: 20,
    PRESSURE_FACTOR: 0.2,
    DISPLAY_VECTORS: true
};
//{STIFFNESS: 0.5, REST_LEN: 60, DAMPING: 0.01, TIMESTEP: 2000};

const particles = [];
const springs = [];
const blobs = [];

cv.width = W;
cv.height = H;

const center = new Vec(W/2, H/2);

blobs.push(
    new Blob(new Vec(W/2, H/2), 100, 24)
)

function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
}

let anim;
let t_ant = 0;

let dt;
let started = false;

function compute_gravity() {

    const g = new Vec(0, params.GRAVITY);

    blobs.forEach(b => {

        b.particles.forEach(p => {

            const f_vector = Vec.mult( g, params.MASS );//p.getMass() );

            p.add_force(f_vector);

            if (params.DISPLAY_VECTORS) Vec.mult(f_vector, params.VECTOR_SIZE).display(ctx, p.pos, "green");

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

            let f = 
                ( current_length - rest_length ) * params.STIFFNESS 
                +
                ( Vec.dot(v12, s_direction)) * params.DAMPING
            ;

            //if (f < 1e-9) f = 0;

            const f_vector = Vec.mult(s_direction, f);
            const f_vector_minus = Vec.mult(f_vector, -1);

            if (params.DISPLAY_VECTORS) {

                Vec.mult(f_vector_minus, params.VECTOR_SIZE).display(ctx, s.p1.pos, "blue" );
                Vec.mult(f_vector, params.VECTOR_SIZE).display(ctx, s.p2.pos, "blue" );

            }

            s.p1.add_force(f_vector_minus);
            s.p2.add_force(f_vector);

            s.update_normal();

        })

    })

}

function compute_pressure() {

    blobs.forEach(blob => {

        const delta_pressure = ( blob.rest_area - blob.get_area() ) * params.PRESSURE_FACTOR;

        blob.springs.forEach(spring => {

            const current_length = spring.get_length();

            const f = delta_pressure * current_length / blob.rest_area;

            spring.update_normal();

            const n = spring.get_normal();

            const f_vector = Vec.mult( n, f );

            spring.p1.add_force( f_vector );
            spring.p2.add_force( f_vector );

            if (params.DISPLAY_VECTORS) {
                //spring.display_normals(ctx);
                Vec.mult( f_vector, params.VECTOR_SIZE ).display(ctx, spring.p1.pos, "hotpink");
                Vec.mult( f_vector, params.VECTOR_SIZE ).display(ctx, spring.p2.pos, "hotpink");

            }

        })


    })



}

/*
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
}*/

// accumulate forces: GRAVITY, SPRING, PRESSURE
// integrate
// display

function accumulate_forces() {

    compute_gravity();
    compute_spring_force();
    compute_pressure();

}

function integrate(dt) {

    blobs.forEach(blob => {
        blob.particles.forEach(p => p.integrate(dt));
    })

}

function render() {

    blobs.forEach(blob => {

        blob.display(ctx);
        //blob.particles.forEach(p => p.render(ctx));
        //blob.springs.forEach(s => s.display_normals(ctx));

    })

}

function loop(t) {


    //the highest precision available is the duration of a single frame, 16.67ms @60hz
    const dt = 20;//t - t_ant;
    //t_ant = t;

    //const t0 = performance.now();
    clearCanvas();
    render();
    accumulate_forces();
    integrate(dt/params.TIMESTEP);

    //console.log(blobs[0].particles[0]);

    //const t1 = performance.now();
    //console.log('Rendering time ', t1 - t0);



    /*
    particles.forEach( (p, i) => {
        
        p.time_step(dt/params.TIMESTEP);
        p.render(ctx);

    })
    */

    anim = window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);//get_fr);



/* ============ TEST FUNCTIONS ============ */

function test_shoelace_formula() {

    let ns = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 1000];

    const pad_len = ns.reduce( (a,b) => Math.max(a.toString().length, b.toString().length));
    
    ns.forEach(n => {
    
        const R = 10;
        const blob = new Blob( new Vec(100,100), R, n);
    
        const area_shoelace = blob.get_area();
        const area_circle = Math.PI * Math.pow(R,2);
        const error = (100 * Math.abs(area_shoelace - area_circle)/area_circle).toFixed(2) + "%";
    
        console.log(`N: ${n.toString().padStart(pad_len, " ")} | Shoelace Formula: ${area_shoelace.toFixed(4)} | Circle Area: ${area_circle.toFixed4} | Error: ${error}`)
        
    })

}