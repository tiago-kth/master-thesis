class Spring {

    pa;
    pb;
    len_0;
    stiff;

    constructor(pa, pb, len_0, k) {

        this.pa = pa;
        this.pb = pb;
        this.len_0 = len_0;
        this.k = k;

    }

    update() {

        const len_vector = Vec.sub(this.pa.pos, this.pb.pos);
        // this vector points from pB to pA

        const len_actual = len_vector.mod();

        const f_dir = len_vector.getUnitDir();

        const delta_x = len_actual - this.len_0;

        const f_mag = this.k * delta_x;

        const f = Vec.mult(f_dir, f_mag);

        // signs are very important here
        this.pa.addForce(Vec.mult(f, -1));
        this.pb.addForce(Vec.mult(f, 1));

    }

    display(ctx) {

        ctx.save();
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.pa.pos.x, this.pa.pos.y);
        ctx.lineTo(this.pb.pos.x, this.pb.pos.y);
        ctx.stroke();
        ctx.restore();

    }

}