class Vec {

    x;
    y;
    angle;
    mag;

    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.angle = this.#getAngle();
        this.mag = this.#getMod();

    }

    #getAngle() {

        const angle = Math.atan( Math.abs(this.y) / Math.abs(this.x) );

        let mult = 0;
        
        if (this.x < 0 & this.y > 0) mult = 1;
        if (this.x < 0 & this.y < 0) mult = 2;
        if (this.x > 0 & this.y < 0) mult = 3;

        // to test: [new Vec(1,1), new Vec(-1,1), new Vec(-1,-1), new Vec(1,-1)].forEach(v => console.log(v.angle * 180 / Math.PI))

        return angle + mult * Math.PI/2;

    }

    #getMod() {

        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) )

    }

    selfAdd(vec_b) {

        this.x += vec_b.x;
        this.y += vec_b.y

    }

    selfSub(vec_b) {

        this.x -= vec_b.x;
        this.y -= vec_b.y;

    }

    selfMult(scalar) {

        this.x *= scalar;
        this.y *= scalar;

    }

    getDifferenceVec(vec_b) {

        const x = this.x - vec_b.x;
        const y = this.y - vec_b.y;

        return new Vec(x, y);

    }

    getUnitDir() {

        return new Vec(this.x / this.mag, this.y / this.mag);

    }

    static add(vec_a, vec_b) {

        return new Vec(vec_a.x + vec_b.x, vec_a.y + vec_b.y);

    }

    static sub(vec_a, vec_b) {

        return new Vec(vec_a.x - vec_b.x, vec_a.y - vec_b.y);

    }

    static mult(vec, scalar) {

        return new Vec(vec.x * scalar, vec.y * scalar);

    }

    static dot(vec_a, vec_b) {

        return vec_a.x * vec_b.x + vec_b.y * vec_b.y;

    }

    static proj(vec_a, vec_b) {

        const vec_bU = vec_b.getUnitDir();

        const dot_product = Vec.dot(vec_a, vec_b);
        
        return Vec.mult(vec_bU, dot_product / vec_b.mag);

    }

    display(ctx, p0) {

        const p1 = Vec.add(p0, this);

        ctx.save();

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        ctx.lineWidth = 1;

        /* test
        const vs = [new Vec(100,100), new Vec(-100,100), new Vec(-100,-100), new Vec(100,-100)]
        vs.forEach(v => v.display(ctx, new Vec(W/2, H/2)))
        */

    }

    draw(canvas) {

        const ctx = canvas.getContext('2d');

        const x0 = canvas.W / 2;
        const y0 = canvas.H / 2;

        



    }

    /* this make it possible to use the utility function without instantiating an object */
    static fromAngle(mag, ang) {

        let x = Math.cos(ang) * mag;
        let y = Math.sin(ang) * mag;

        return new Vec(x, y)

    }

}