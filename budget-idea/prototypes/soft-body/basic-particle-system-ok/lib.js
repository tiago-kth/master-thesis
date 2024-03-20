class Spring {

    pA;
    pB;
    rest_len;
    stiffness;
    damping;

    constructor(pA, pB, rest_len, stiffness) {

        this.pA = pA;
        this.pB = pB;

        const difference_vector = this.pA.pos.getDifferenceVec(this.pB.pos);
        this.rest_len = rest_len;//difference_vector.mod();;
        this.stiffness = stiffness;

        this.damping = .1;

    }

    update(ctx) {

        const difference_vector = this.pA.pos.getDifferenceVec(this.pB.pos);
        const direction_vector = difference_vector.getUnitDirectionVector();

        const actual_length = difference_vector.mod();

        //console.log(actual_length);

        const deform = actual_length - this.rest_len;

        const f_el = this.stiffness * deform;

        const f_el_vector = new Vec(direction_vector.x, direction_vector.y);
        f_el_vector.mult(f_el);

        const f_el_vector_inv = new Vec(direction_vector.x, direction_vector.y);
        f_el_vector_inv.mult(f_el * -1);

        this.pA.addForce(f_el_vector_inv);
        this.pB.addForce(f_el_vector);

        //f_el_vector.display(this.pA.pos, ctx);
        //f_el_vector_inv.display(this.pB.pos, ctx);
        //console.log(f_el_vector);

        // damping force
        const dampingForce = new Vec(this.pA.vel.x, this.pA.vel.y);
        dampingForce.mult(this.damping);

        const dampingForce_inv = new Vec(dampingForce.x, dampingForce.y);
        dampingForce_inv.mult(-1);

        //console.log(dampingForce);

        
        this.pA.addForce(dampingForce_inv);
        this.pB.addForce(dampingForce);
        //dampingForce_inv.display(this.pA.pos, ctx);

    }

    display(ctx) {

        ctx.save();
        ctx.strokeStyle = 'gold';
        ctx.beginPath();
        ctx.moveTo(this.pA.pos.x, this.pA.pos.y);
        ctx.lineTo(this.pB.pos.x, this.pB.pos.y);
        ctx.stroke();
        ctx.restore();

    }

}