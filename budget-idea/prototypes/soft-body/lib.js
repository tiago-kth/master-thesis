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

    constructor(pos) {
        this.pos = pos;
        this.vel = new Vec( (Math.random() - 0.5), (Math.random() - 0.5) );
        this.acc = new Vec( (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1 ); 
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
    }

    display(ctx) {

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

}