class Vec {

    x;
    y;
    angle;
    mag;

    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.angle = this.#getAngle();
        this.mag = this.mod();

    }

    #getAngle() {

        const angle = Math.atan( Math.abs(this.y) / Math.abs(this.x) );

        if (this.y == 0) {
            if (this.x >= 0) return 0;
            else return Math.PI;
        } else {
            if (this.x == 0) {
                if (this.y >= 0) return Math.PI/2;
                else return Math.PI * 3/2
            }
        }

        let mult = 0; // because for canvas 0 degrees is the y axis pointing up
        
        if (this.x < 0 & this.y > 0) mult = 1;
        if (this.x < 0 & this.y < 0) mult = 2;
        if (this.x > 0 & this.y < 0) mult = 3;
        //if (this.x > 0 & this.y > 0) mult = 3;

        // to test: [new Vec(1,1), new Vec(-1,1), new Vec(-1,-1), new Vec(1,-1)].forEach(v => console.log(v.angle * 180 / Math.PI))

        return angle + mult * Math.PI/2;

    }

    mod() {

        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) )

    }

    selfAdd(vec_b) {

        this.x += vec_b.x;
        this.y += vec_b.y;

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

        return (vec_a.x * vec_b.x) + (vec_a.y * vec_b.y);

    }

    static proj(vec_a, vec_b) {

        const vec_bU = vec_b.getUnitDir();

        const dot_product = Vec.dot(vec_a, vec_b);
        
        return Vec.mult(vec_bU, dot_product / vec_b.mag);

    }

    display(ctx, p0, color) {

        const h = ctx.canvas.height;
        const w = ctx.canvas.width;

        if (!p0) {

            p0 = new Vec(w/2, h/2);

        } 
        
        ctx.save();
        ctx.strokeStyle = color ? color : "hotpink";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.translate(p0.x, p0.y);
        ctx.rotate(-1 * this.angle);
        ctx.moveTo(0,0);
        ctx.lineTo(this.mag, 0);
        ctx.translate(this.mag, 0);
        ctx.rotate(-Math.PI * 5/6);
        ctx.lineTo(10,0);
        ctx.moveTo(0,0);
        ctx.rotate(Math.PI*10/6);
        ctx.lineTo(10,0);
        ctx.stroke();
        ctx.restore();

        /* test
        const vs = [new Vec(100,100), new Vec(-100,100), new Vec(-100,-100), new Vec(100,-100)]
        vs.forEach(v => v.display(ctx, new Vec(W/2, H/2)))

        const p_0 = new Vec(W/2, H/2);
        const v1 = new Vec(100,0);
        const v2 = new Vec(50,70);
        const v3 = Vec.proj(v2, v1);
        v1.display(ctx, p_0, "blue");
        v2.display(ctx, p_0, "white");
        v3.display(ctx, p_0, "gold");

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