let i = 0;
class Particle {

    pos;
    vel;
    acc;

    force_acum;

    r;

    inv_mass;

    constructor(pos, vel) {

        this.pos = pos;

        this.vel = vel ? vel : new Vec(0,0);
        this.acc = new Vec(0,0);

        this.force_acum = new Vec(0,0);

        this.r = 5;
        this.inv_mass = 1;

    }

    time_step(dt) {

        //this.accumulate_forces();
        this.integrate(dt);
        //this.satisfy_constraints();

    }

    integrate(dt) {

        //console.log(this.acc, Vec.mult(this.force_acum, this.inv_mass));

        // update position
        this.pos.selfAdd( Vec.mult(this.vel, dt) );

        // get acceleration
        const acc = new Vec(this.acc.x, this.acc.y);
        acc.selfAdd( Vec.mult(this.force_acum, this.inv_mass) );

        Vec.mult(acc, 50).display(ctx, this.pos, "tomato");

        // update velocity
        this.vel.selfAdd( Vec.mult(acc, dt) );

        // impose drag?

        // clear Forces

        this.clear_force_acum();

    }

    add_force(force) {

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

    getInvMass() {
        return this.inv_mass;
    }
    
    setAcc(acc) {
        console.log(acc, this.acc);
        this.acc = acc;
        console.log(this.acc);
    }

    // set all other stuff

    render(ctx) {

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "coral";
        ctx.fillStyle = "white";
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