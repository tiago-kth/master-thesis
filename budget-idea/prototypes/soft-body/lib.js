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

    sub(vec_b) {

        this.x -= vec_b.x;
        this.y -= vec_b.y;

    }

    getDifferenceVec(vec_b) {

        const x = this.x - vec_b.x;
        const y = this.y - vec_b.y;

        return new Vec(x, y);

    }

    getUnitDirectionVector() {

        const mod = this.mod();

        return new Vec(this.x / mod, this.y / mod);

    }

    mult(scalar) {

        this.x *= scalar;
        this.y *= scalar;

    }

    getDotProduct(vec_b) {

        return this.x * vec_b.x + this.y * vec_b.y;

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
        this.acc = new Vec( 0, .1); 
    }

    applyAcc(array_of_accelerations) {
        // to-do
        // sum all acceleration vectors to get a resultant, and assign this vector to this.acc
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
    }

    checkBounds() {
        //let opa = false;
        if ( (this.pos.x + this.rad) > W ) {
            this.pos.x = W - this.rad;
            this.vel.x *= -1;
            //opa = true;
        } else if ( (this.pos.x - this.rad) < 0 ) {
            this.pos.x = this.rad;
            this.vel.x *= -1;
            //opa = true;
        }

        if ( (this.pos.y + this.rad) > H ) {
            this.pos.y = H - this.rad;
            this.vel.y *= -1;
            //opa = true;
        } else if ( (this.pos.y - this.rad) < 0 ) {
            this.pos.y = this.rad;
            this.vel.y *= -1;
            //opa = true;
        }

        //if (opa) console.log("Opa!");
    }

    getDifferenceVecFrom(particle) {

        // the basis for the direction and the distance
        return this.pos.getDifferenceVec(particle.pos);

    }

    getDistanceFrom(particle) {

        const difference_vector = this.getDifferenceVecFrom(particle);
        return difference_vector.mod();

    }

    getDirectionFrom(particle) {

        const difference_vector = this.getDifferenceVecFrom(particle);
        return difference_vector.getUnitDirectionVector();

    }

    checkCollisions(particles) {

        particles.forEach(that => {

            if (this != that) {

                const difference_vector = this.getDifferenceVecFrom(that);

                const distance = difference_vector.mod();
                const min_distance = this.rad + that.rad;

                if (distance <= min_distance) {

                    const normal = difference_vector.getUnitDirectionVector();

                    const velocity_difference = this.vel.getDifferenceVec(that.vel);

                }
            }

        })

    }

    display(ctx) {

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    displayVel(ctx) {


        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "tomato";
        ctx.lineWidth = 3;
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x + this.vel.x * 2, this.pos.y + this.vel.y * 2);
        ctx.stroke();
        ctx.restore();

    }

}