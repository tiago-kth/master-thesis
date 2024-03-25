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
        this.acc.selfAdd( Vec.mult(this.force_acum, this.inv_mass) );

        // update velocity
        this.vel.selfAdd( Vec.mult(this.acc, dt) );

        // impose drag?

    }

    setMass(mass) {
        this.inv_mass = 1/mass;
    }

    setInvMass(invMass) {
        this.inv_mass = invMass;
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