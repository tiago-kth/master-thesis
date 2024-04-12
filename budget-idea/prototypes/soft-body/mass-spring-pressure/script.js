const cv = document.querySelector('canvas');

// for every new color, just add the custom variable in :root, and a corresponding line here
const colors = {
    "generic-stroke": null,
    particle : null,
    spring : null,
    "blob-fill" : null,
    "blob-stroke" : null,
    grid : null,
    cell : null,
    "cell-neighbor": null,
    "highlighted-particle": null
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
const H = 1000;
const W = 1000;
const R = 10;

const N_LEFT = new Vec(-1,0);
const N_RIGHT = new Vec(1,0);
const N_TOP = new Vec(0,-1);
const N_BOTTOM = new Vec(0,1);
const NULL_VEC = new Vec(0,0);

const params = {
    "STIFFNESS": 0.45,
    "REST_LEN": 0,
    "DAMPING": 0.9,
    "VEL_DAMPING" : 0.95,
    "TIMESTEP": 50,
    "SPEEDLIMIT": 15,
    "MASS": 2,
    "GRAVITY": 0,
    "VECTOR_SIZE": 20,
    "PRESSURE_FACTOR": 300,
    "RESTITUTION_COEFFICIENT" : 0.6,
    "PARTICLE_RADIUS" : 16,
    "DISPLAY_VECTORS": false,
    'DISPLAY_SPRING_VECTORS': false,
    'DISPLAY_GRAVITY_VECTORS': false,
    'DISPLAY_PRESSURE_VECTORS': false,
    'DISPLAY_RESULTANT_VECTORS': false,
    "DISPLAY_MESH": true,
    "DISPLAY_BLOB": true,
    "DISPLAY_BLOB_CIRCLE": false,
    "DISPLAY_GRID": false,
    "DISPLAY_COLLIDERS": false,
    "HIGHLIGHT_CELLS": false,
    "_MOUSE_MOVING": false,
    "_x": false,
    "_y": false
}

// grid setup //

const grid = new Grid(W, H, 50);

let particles_highlighted = []; // used for debugging

function highlight_particles_color(index) { // used for debugging

    if (!index) {

        particles_highlighted.forEach(p => {
            p.color_particle = colors.particle;
            p.color_stroke = colors.spring;
        })

    } else {

        particles_highlighted = grid.retrieve_neighboring_particles(index);

        particles_highlighted.forEach(p => {
            p.color_stroke = colors["highlighted-particle"];
            p.color_particle = colors["highlighted-particle"];
        })

    }
}

// for the collision system

const all_particles = [];


/*const params = {
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
};*/
//{STIFFNESS: 0.5, REST_LEN: 60, DAMPING: 0.01, TIMESTEP: 2000};

//const particles = [];
const springs = [];
const blobs = [];

cv.width = W;
cv.height = H;

const cssW = +getComputedStyle(cv).width.slice(0,-2);
const cssH = +getComputedStyle(cv).height.slice(0,-2);

const mouseFactorX = W / cssW;
const mouseFactorY = H / cssH;

const center = new Vec(W/2, H/2);

blobs.push(
    new Blob(new Vec(2*W/3, H/4), 60, colors["blob-fill"], colors["generic-stroke"]),
    new Blob(new Vec(W/3, H/2), 50, colors["blob-stroke"], colors["generic-stroke"]),
    new Blob(new Vec(150, 75), 75, "dodgerblue", colors["generic-stroke"])
)

// populate all particles array
blobs.forEach(blob => all_particles.push(...blob.particles));


// fazer uma classe pra isso;
/*const interaction_particle = new Particle(new Vec(0,0));
interaction_particle.r = 50;
all_particles.push(interaction_particle);
*/

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

            let f_vector = Vec.mult( g, params.MASS );//p.getMass() );

            /*if ( (p.pos.y + p.r) > H ) {
                f_vector = NULL_VEC;
            }*/

            p.add_force(f_vector);

            if (params.DISPLAY_GRAVITY_VECTORS) Vec.mult(f_vector, params.VECTOR_SIZE).display(ctx, p.pos, "green");

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

            if (params.DISPLAY_SPRING_VECTORS) {

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

        //const delta_pressure = ( blob.rest_area - blob.get_area() ) * params.PRESSURE_FACTOR; //

        const current_area = blob.get_area();
        const rest_area = blob.rest_area;
        const nRT = params.PRESSURE_FACTOR;

        blob.springs.forEach(spring => {

            const current_length = spring.get_length();

            const f = nRT * current_length / current_area; //delta_pressure * current_length / blob.rest_area;

            spring.update_normal();

            const n = spring.get_normal();

            const f_vector = Vec.mult( n, f );

            spring.p1.add_force( f_vector );
            spring.p2.add_force( f_vector );

            if (params.DISPLAY_PRESSURE_VECTORS) {
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

function satisfy_constraints() {

    edges_constraints();

}

function edges_constraints() {

    blobs.forEach(blob => {
        blob.particles.forEach(p => {

            const pos = p.pos;
            const r = p.r;

            // horizontal borders

            if ( (pos.x + r) > W ) {
                //p.add_force(Vec.mult(N_RIGHT, params.MASS));
                p.vel.selfMult(-1 * params.RESTITUTION_COEFFICIENT * params.VEL_DAMPING);
                p.pos.x = W - r;
            }
            else if ( (pos.x - r) < 0 ) {
                //p.add_force(Vec.mult(N_LEFT, params.MASS));
                p.vel.selfMult(-1 * params.RESTITUTION_COEFFICIENT * params.VEL_DAMPING);
                p.pos.x = r;
            }

            // vertical borders

            if ( (pos.y + r) >= H ) {
                const g_ = new Vec(0, -1 * params.GRAVITY);
                p.add_force(Vec.mult( g_, params.MASS));
                const v_caused_by_one_step_of_acc = Math.abs(Vec.dot( p.acc, N_BOTTOM) * 1)//20 / params.TIMESTEP);
                //console.log(p.vel.mod(), v_caused_by_one_step_of_acc);
                if ( p.vel.mod()  <= v_caused_by_one_step_of_acc ) {

                    //console.log(p.vel.mod(), v_caused_by_one_step_of_acc);

                    p.vel = NULL_VEC;
                    
                } else {

                    p.vel.selfMult(-1 * params.RESTITUTION_COEFFICIENT);

                }
                
                p.pos.y = H - r;
            }
            else if ( (pos.y - r) < 0 ) {
                //p.add_force(Vec.mult(N_BOTTOM, params.MASS));
                p.vel.selfMult(-1 * params.RESTITUTION_COEFFICIENT * params.VEL_DAMPING);
                p.pos.y = r;
            }

            // limit vmax?
            //const v = p.vel.mod();
            //if (v > 20) p.vel.selfMult( 20 / (1.1 * v) );

        })

        
    })

}

function render() {

    blobs.forEach(blob => {

        if (params.DISPLAY_BLOB) blob.display(ctx);
        if (params.DISPLAY_MESH) blob.display_mesh(ctx);
        if (params.DISPLAY_BLOB_CIRCLE) blob.display_reference_circle(ctx);
        //blob.particles.forEach(p => p.render(ctx));
        //blob.springs.forEach(s => s.display_normals(ctx));

    })

}

function loop(t) {

    //let tp0 = performance.now();

    //the highest precision available is the duration of a single frame, 16.67ms @60hz
    const dt = 20;//t - t_ant;
    //t_ant = t;

    //const t0 = performance.now();
    clearCanvas();

    highlight_particles_color(false);

    if (params.HIGHLIGHT_CELLS && params._MOUSE_MOVING && params._x > 0 && params._y > 0) {

        const index = grid.get_index_from_px(
            params._x,
            params._y
        );

        grid.render_cell(index, ctx, colors["cell"]);
        grid.render_neighbors(index, ctx, colors["cell-neighbor"]);

        // to highlight the particles within the selection 
        highlight_particles_color(index); 

        
    } else {

    }

    if (params.DISPLAY_GRID) grid.render_grid(ctx, colors.grid);
    render();

    accumulate_forces();
    integrate(dt/params.TIMESTEP);
    collision_system.update_collisions(all_particles);
    satisfy_constraints();
    

    



    //console.log(blobs[0].particles[0]);

    //const t1 = performance.now();
    //console.log('Rendering time ', t1 - t0);



    /*
    particles.forEach( (p, i) => {
        
        p.time_step(dt/params.TIMESTEP);
        p.render(ctx);

    })
    */

    //let tp1 = performance.now();
    //console.log( (tp1 - tp0).toFixed(2) );

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

/*{
    "STIFFNESS": 0.45,
    "REST_LEN": 0,
    "DAMPING": 0.9,
    "TIMESTEP": 200,
    "SPEEDLIMIT": 15,
    "MASS": 2,
    "GRAVITY": 0,
    "VECTOR_SIZE": 20,
    "PRESSURE_FACTOR": 1.36,
    "DISPLAY_VECTORS": true
}*/