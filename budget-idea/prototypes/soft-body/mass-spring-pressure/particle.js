class Particle {

    pos;
    vel;
    acc;
    dragging;

    collider_center;
    collider_radius;
    blob_radius;
    blob_center;

    internal_collider_center;

    force_acum;

    springs;
    normal;

    r;

    mass;
    inv_mass;

    grid_cell;

    color_stroke;
    color_particle;

    immediate_neighbors;

    blob;
    blob_radius;
    blob_center;

    constructor(pos, blob) {

        this.pos = pos;
        this.dragging = false;

        this.vel = new Vec(0,0);
        this.acc = new Vec(0,0);
        this.force_acum = new Vec(0,0);
        this.r = params.PARTICLE_RADIUS;
        // commenting to let the mass be update by the global parameters
        this.mass = params.MASS;
        //this.inv_mass = 1 / params.MASS;   

        this.color_stroke = colors["spring"];
        this.color_particle = colors["particle"];
        
        const index = grid.get_index_from_px(this.pos.x, this.pos.y);
        this.grid_cell = index;
        grid.cells[index].particles.add(this);

        this.blob = blob;
        this.blob_radius = blob.R;

        this.springs = [];

        // this will be done in the blob creation
        //this.update_collider_position();


    }

    update_collider_position() {

        this.blob_center = this.blob.center;
        this.collider_radius = params.COLLIDERS_RADIUS >= (this.blob_radius + this.r) ? this.blob_radius + this.r : params.COLLIDERS_RADIUS; 
        //const distance_from_blob_center = this.blob_radius + this.r  - this.collider_radius;
        const distance_from_particle_center = this.collider_radius - this.r;
        const unit_radial_vector = this.get_normal();//Vec.sub(this.pos, this.blob_center).getUnitDir();
        this.collider_center = Vec.add(
            this.pos,
            //this.blob_center,
            Vec.mult(
                unit_radial_vector, 
                //distance_from_blob_center + this.r
                -1 * distance_from_particle_center
            )
        );
        this.internal_collider_center = Vec.add(
            this.pos,
            Vec.mult(
                unit_radial_vector,
                distance_from_particle_center - this.r
            )
        );

        //console.log(distance_from_blob_center, this.r, this.blob_center, this.collider_radius, this.collider_center);

    }

    update_grid(grid) {

        const index = grid.get_index_from_px(this.pos.x, this.pos.y);
        const old_index = this.grid_cell;

        //console.log(index, old_index);

        if ( index != old_index ) {

            grid.cells[old_index].particles.delete(this);
            grid.cells[index].particles.add(this);
            this.grid_cell = index;

        }

    }

    time_step(dt) {

        //this.accumulate_forces();
        this.integrate(dt);
        //this.satisfy_constraints();
        this.update_collider_position();

    }

    integrate(dt) {

        // new position
        let new_pos = Vec.add(this.pos, Vec.mult(this.vel, dt));
        new_pos = Vec.add(new_pos, Vec.mult(this.acc, dt * dt * 0.5));

        // new acceleration
        const new_acc = Vec.mult(this.force_acum, 1 / params.MASS);

        //console.log(this.force_acum, new_acc);

        // new velocity
        const new_vel = Vec.add(

            Vec.mult(
                this.vel,
                params.VEL_DAMPING // damping
            ),

            Vec.mult(

                Vec.add(this.acc, new_acc), // not sure about this procedure
                dt * 0.5

            )

        )

        // update particle vectors
        this.pos = new_pos;
        this.vel = new_vel;
        this.acc = new_acc;

        const v = new_vel.mod();
        if (v > 15) {
            this.vel.selfMult( params.VEL_DAMPING * 15 / v );
            console.log("limiting");
        }

        // clear Forces

        if (params.DISPLAY_RESULTANT_VECTORS) Vec.mult(this.force_acum, params.VECTOR_SIZE).display(ctx, this.pos, "tomato");

        this.clear_force_acum();
        this.update_normal();

    }

    add_force(force) {

        //console.log(force, this.force_acum);
        this.force_acum.selfAdd(force);

    }

    clear_force_acum() {

        this.force_acum = new Vec(0,0);

    }

    setMass(mass) {
        this.inv_mass = 1/mass;
    }

    setInvMass(invMass) {
        this.inv_mass = invMass;
    }

    getMass() {
        return this.mass;
    }

    getInvMass() {
        return this.inv_mass;
    }
    
    setAcc(acc) {
        console.log(acc, this.acc);
        this.acc = acc;
        console.log(this.acc);
    }

    update_normal() {

        const n_sum = Vec.add(this.springs[0].get_normal(), this.springs[1].get_normal());

        this.normal = n_sum.getUnitDir();

    }

    render_normal(ctx) {

        Vec.mult(this.normal, 100).display(ctx, this.pos, "violet");

    }

    get_normal() {

        return this.normal;

    }

    // set all other stuff

    render(ctx, stroke, fill) {

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = stroke ? stroke : this.color_stroke;
        ctx.fillStyle = fill? fill : "transparent";//this.color_particle;
        ctx.stroke();
        ctx.fill();
        ctx.restore();

    }

    render_colliders(ctx, type) {

        let center, color;
        if (type == "external") {
            center = "collider_center";
            color = "red";
        } else {
            center = "internal_collider_center";
            color = "green";
        }

        ctx.save();

        ctx.beginPath();
        ctx.arc(this[center].x, this[center].y, this.collider_radius, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();

        /*
        ctx.beginPath();
        ctx.arc(this.collider_center.x, this.collider_center.y, this.collider_radius, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = stroke ? stroke : "blue";
        ctx.stroke();
        ctx.closePath();

        
        ctx.beginPath();
        ctx.arc(this.internal_collider_center.x, this.internal_collider_center.y, this.collider_radius, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.closePath();
        */


        ctx.restore();

    }
}

class Force {

    static updateForce(particle, t) {

    }

}

class Gravity extends Force {

    gravity;

    constructor(gravity) {
        super();
        this.gravity = gravity;
    }

    updateForce(particle) {

        particle.add_force( Vec.mult(this.gravity, particle.getInvMass() ) );

    }

}

class ForceRegistry {

    registry;

    constructor() {

        this.registry = [];

    }

    add(particle, force) {

        this.registry.push({

            particle: particle,
            force: force

        })

    }

    remove(particle, force) {

        if (!particle && !force) return;

        let entries_found;

        if (!particle) {

            entries_found = this.registry.filter(r => r.force == force);

            console.log(entries_found);

        } else {

            if (!force) {

                entries_found = this.registry.filter(r => r.particle == particle);

            }  else {

                entries_found = this.registry.filter(r => r.particle == particle && r.force == force)

            }

        }

        entries_found.forEach( (entry, i, a) => {

            const index = this.registry.indexOf(entry);

            console.log(i, a, this.registry);

            this.registry.splice(index, 1);

            console.log(i, a, this.registry);

        })

    }

    updateForces() {

        this.registry.forEach(entry => {

            entry.force.updateForce(entry.particle);

        })

    }

}