class Particle {

    pos;
    vel;
    acc;
    dragging;

    force_acum;

    r;

    mass;
    inv_mass;

    grid_cell;

    constructor(pos) {

        this.pos = pos;
        this.dragging = false;

        this.vel = new Vec(0,0);
        this.acc = new Vec(0,0);
        this.force_acum = new Vec(0,0);
        this.r = 8;
        // commenting to let the mass be update by the global parameters
        //this.mass = params.MASS;
        //this.inv_mass = 1 / params.MASS;   
        
        const index = grid.get_index_from_px(this.pos.x, this.pos.y);
        this.grid_cell = index;
        grid.cells[index].particles.add(this);

    }

    update_grid(grid) {

        const index = grid.get_index_from_px(this.pos.x, this.pos.y);
        const old_index = this.grid_cell;

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

        // clear Forces

        if (params.DISPLAY_RESULTANT_VECTORS) Vec.mult(this.force_acum, params.VECTOR_SIZE).display(ctx, this.pos, "tomato");

        this.clear_force_acum();
        this.update_grid(grid);

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

    // set all other stuff

    render(ctx, stroke, fill) {

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = stroke ? stroke : colors["spring"];
        ctx.fillStyle = fill? fill : colors["particle"];
        ctx.fill();
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