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

const grid = new Grid(W, H, 50, ctx);

function setup_square() {

    const p0 = new Particle( new Vec(200,  50), 10, grid, 0, MASS, new Vec(1,2), new Vec(0,0.2) );
    const p1 = new Particle( new Vec(400,  50), 10, grid, 1, MASS, new Vec(1,-2), new Vec(0,0.2) );
    const p2 = new Particle( new Vec(400, 150), 10, grid, 2, MASS, new Vec(1,1), new Vec(0,0.2) );
    const p3 = new Particle( new Vec(200, 150), 10, grid, 3, MASS, new Vec(1,-1), new Vec(0,0.2) );

    particles.push(p0, p1, p2, p3);

    const s0 = new Spring(particles[0], particles[1], params.REST_LEN, params.STIFFNESS);
    const s1 = new Spring(particles[1], particles[2], params.REST_LEN, params.STIFFNESS);
    const s2 = new Spring(particles[2], particles[3], params.REST_LEN, params.STIFFNESS);
    const s3 = new Spring(particles[3], particles[0], params.REST_LEN, params.STIFFNESS);
    const s4 = new Spring(particles[0], particles[2], params.REST_LEN, params.STIFFNESS);
    const s5 = new Spring(particles[1], particles[3], params.REST_LEN, params.STIFFNESS);

    springs.push(s0, s1, s2, s3, s4, s5); //,s1 , s2, s3, s4, s5, s6, s7, s8);

}

function setup_circle(center, N) {

    const nullvec = new Vec(0,0);
    const acc = new Vec(0, 0.05);
    const r = 100;

    const p0 = new Particle(center, 5, grid, 0, MASS, nullvec, acc);

    const theta = 2*Math.PI / N;
    const l = 2 * r * Math.sin(theta / 2);

    console.log(l, theta * 180 / Math.PI);

    particles.push(p0);

    for (let i = 1; i <= N; i++) {

        const p = new Particle(
            Vec.fromAngle(r, theta * i, center),
            5, grid, i, MASS, nullvec, acc
        )

        /*
        const sr = new Spring(
            p, p0, Vec.dist(p.pos, p0.pos), params.STIFFNESS / 10
        )

        springs.push(sr);
        */

        // particles
        // i: [     0,  1,    , i     ]
        // p: [p0, p1, p2, ..., pi+1, ]

        if (i > 1) {

            const sc = new Spring(
                p, 
                particles[i-1], 
                Vec.dist(p.pos, particles[i-1].pos), params.STIFFNESS
            );

            springs.push(sc);

        }

        if (i == N) {

            const slast = new Spring(
                particles[1],
                p,
                Vec.dist(particles[1].pos, p.pos), params.STIFFNESS
            )

            springs.push(slast);

        }

        particles.push(p);

    }

    /*
    particles.forEach( (p,i,a) => {

        const sc2 = new Spring(
                p,
                particles[ (i+2) % a.length ],
                l, params.STIFFNESS
        )

        springs.push(sc2);

    })
    */

}

function setup_ring(center, N, r) {

    const particles = [];

    const nullvec = new Vec(0,0);
    const acc = new Vec(0, 0.1);

    const theta = 2*Math.PI / N;

    //console.log(l, theta * 180 / Math.PI);

    for (let i = 0; i < N; i++) {

        const p = new Particle(
            Vec.fromAngle(r, theta * i, center),
            5, grid, i, MASS, nullvec, acc
        )

        particles.push(p);

    }

    return particles;

}

function create_perimeter_springs(particles, l) {

    const springs = [];

    particles.forEach( (p, i, array) => {

        const sp = new Spring(

            p, 
            (i < array.length - 1) ? array[i + 1] : array[0],
            l, 
            params.STIFFNESS

        )

        springs.push(sp);

    })

    return springs;
 
}

function create_connecting_springs(inner, outer, d) {

    const N = inner.length;

    const springs = [];

    for (let i = 0; i < N; i++) {

        const sc = new Spring(

            inner[i],
            outer[i],
            d,
            params.STIFFNESS

        )

        springs.push(sc);

    }

    return springs

}

function setup_blob(center, N, R) {

    const outer_particles = setup_ring(center, N, R);
    const inner_particles = setup_ring(center, N, R/3);

    const theta = 2*Math.PI / N;
    const l = 2 * R * Math.sin(theta / 2);

    const perim_springs_outer = create_perimeter_springs(outer_particles, l);
    const perim_springs_inner = create_perimeter_springs(inner_particles, l/3);
    const connecting_springs = create_connecting_springs(inner_particles, outer_particles, l - l/3);

    particles.push(
        ...inner_particles, 
        ...outer_particles
    );


    springs.push(
        ...perim_springs_inner,
        ...perim_springs_outer,
        ...connecting_springs
    )

}

//setup_square();

const center = new Vec(W/2, 150);

//setup_blob(center, 20, 90);

setup_circle(center, 32);

particles.forEach(p => {
    p.updateGridPos();
    grid.addParticle(p);
})

console.log(grid.cells);
console.log(particles, particles[0].cell_col);


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
    //t_perf0 = window.performance.now();
    // end perf

    if (!t_ant) t_ant = t;

    //the highest precision available is the duration of a single frame, 16.67ms @60hz
    const dT = t - t_ant;
    //console.log(dT);
    t_ant = t;

    //console.log(dT);
    clearCanvas();

    grid.display();

    springs.forEach(s => s.update(ctx));

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

        const neighbours = grid.getNeighbours(p);

        p.checkCollisions(neighbours);
        /*
        if (i == 0) {
            //p.displayGridCell(ctx);
            neighbours.forEach(n => n.displayGridCell(ctx));
        }*/
        p.display(ctx);
        //p.displayVel(ctx);
    })

    springs.forEach(s => s.display(ctx));
    count++

    // perf 
    /*
    t_perf1 = window.performance.now();
    const dt = t_perf1 - t_perf0;
    dt_perfs.push(dt);
    if (dt_perfs.length > 100) {
        dt_perfs.splice(0, 1);
        const avg_dt_perf = dt_perfs.reduce( (p, c) => (p + c) ) / dt_perfs.length;
        console.log("Average time to execute frame: ", avg_dt_perf.toFixed(2), "ms");
    } */
    // end perf


    anim = window.requestAnimationFrame(loop);
}

anim = window.requestAnimationFrame(loop);
//loop();

