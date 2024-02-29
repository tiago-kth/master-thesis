class Point {

    x; y; 

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vec {

    x;
    y;
    angle;

    constructor(x, y, angle = false) {

        this.x = x;
        this.y = y;
        this.angle = angle;

    }

    mod() {

        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) )

    }

    add(vec_b) {

        this.x += vec_b.x;
        this.y += vec_b.y

    }

    mult(scalar) {

        this.x *= scalar;
        this.y *= scalar;

    }

    /* this make it possible to use the utility function without instantiating an object */
    static fromAngle(ang) {

        let x = Math.cos(ang);
        let y = Math.sin(ang);

        return new Vec(x, y, ang)

    }

}

class Particle {

    pos;
    vel;
    acc;
    rad;

    constructor(pos, rad) {
        this.pos = pos;
        this.rad = rad;
        this.vel = new Vec( (Math.random() - 0.5), (Math.random() - 0.5) );
        this.acc = new Vec( (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1 ); 
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
    }

    checkBounds() {
        let opa = false;
        if ( (this.pos.x + this.rad) > W ) {
            this.pos.x = W - this.rad;
            this.vel.x *= -1;
            opa = true;
        } else if ( (this.pos.x - this.rad) < 0 ) {
            this.pos.x = this.rad;
            this.vel.x *= -1;
            opa = true;
        }

        if ( (this.pos.y + this.rad) > H ) {
            this.pos.y = H - this.rad;
            this.vel.y *= -1;
            opa = true;
        } else if ( (this.pos.y - this.rad) < 0 ) {
            this.pos.y = this.rad;
            this.vel.y *= -1;
            opa = true;
        }

        if (opa) console.log("Opa!");
    }

    display(ctx) {

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

}