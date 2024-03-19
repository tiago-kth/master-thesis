class Particle {

    index;

    pos;
    vel;
    acc;
    rad;
    mass;
    hits;

    grid;
    cell_col;
    cell_row;
    changed_cell = false;
    previous_cell_col;
    previous_cell_row;

    constructor(pos, rad, grid, index, mass) {
        this.index = index;
        this.grid = grid;
        this.hits = 0;
        this.pos = pos;
        this.rad = rad;
        this.mass = mass;
        this.vel = index == 0 ? new Vec( 2, 1) : new Vec( 0, 0 );
        this.acc = new Vec( 0, .02); 
    }

    applyAcc(array_of_accelerations) {
        // to-do
        // sum all acceleration vectors to get a resultant, and assign this vector to this.acc
    }

    addForce(f) {
        f = Vec.mult(f, 1/this.mass);
        this.acc = Vec.add(this.acc + f);
    }

    limitSpeed() {
        const speed = this.vel.mod();
        if (speed > 3) {
            this.vel.selfMult(3 / speed)
        }
    }

    update(dT) {
        // v = v0 + a.t
        this.vel.selfAdd(Vec.mult(this.acc, dT / TIMESTEP));
        // s = s0 + v.t
        this.pos.selfAdd(Vec.mult(this.vel, dT / TIMESTEP));
        //this.updateGridPos();
        this.limitSpeed();

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
        return Vec.sub(this.pos - particle.pos);

    }

    getDistanceFrom(particle) {

        const difference_vector = this.getDifferenceVecFrom(particle);
        return difference_vector.mod();

    }

    getDirectionFrom(particle) {

        const difference_vector = this.getDifferenceVecFrom(particle);
        return difference_vector.getUnitDir();

    }

    checkCollisions(particles) {

        let count = 1;

        particles.forEach(that => {

            if (this != that) {

                const difference_vector = Vec.sub(this.pos, that.pos);//this.getDifferenceVecFrom(that);

                const distance = difference_vector.mod()
                const min_distance = this.rad + that.rad;

                if (distance <= min_distance) {

                    count++

                    this.hits++
                    that.hits++

                    const normal = difference_vector.getUnitDir();

                    const velocity_difference = Vec.sub(this.vel, that.vel);

                    const vel_difference_component_on_normal = Vec.proj(velocity_difference, normal);//velocity_difference.getDotProduct(normal);

                    const impulse_scalar = vel_difference_component_on_normal.mod() /// (this.mass + that.mass);
                    //console.log(impulse_scalar);

                    const impulse = Vec.mult(normal, impulse_scalar);//2 * Vec.dot(velocity_difference, normal) / 2);
                    //console.log(vel_difference_component_on_normal.mod(), impulse.mod());
                    //const impulse = new Vec(normal.x, normal.y);
                    //impulse.mult(vel_difference_component_on_normal);
                   // if (count < 10) console.log(this.vel, that.vel, velocity_difference, normal, vel_difference_component_on_normal, impulse);

                    //impulse.mult( 2 * vel_difference_component_on_normal / (this.mass + that.mass) );//vel_difference_component_on_normal);

                    //console.log(impulse.mod());
                    //console.log(normal, velocity_difference, vel_difference_component_on_normal, this.vel, impulse);

                    //const impulse_this = new Vec(impulse.x, impulse.y);
                    //impulse_this.mult( .98 / this.mass);
                    this.vel.selfAdd(Vec.mult(impulse, 1/ this.mass));
                    
                    //const impulse_that = new Vec(impulse.x, impulse.y);
                    //impulse_that.mult( .98 / that.mass);
                    that.vel.selfSub(Vec.mult(impulse, 1 / that.mass));

                    // REPULSION, to avoid balls sticking together

                    
                    //const repulsion = new Vec(normal.x, normal.y);
                    //console.log(distance / min_distance);
                    //repulsion.mult( min_distance - distance );

                    const repulsion = Vec.mult(normal, min_distance - distance);

                    // Apply repulsion force
                    this.pos.selfAdd(Vec.mult(repulsion, 1 / this.mass));
                    that.pos.selfSub(Vec.mult(repulsion, 1 / that.mass));

                    //const this_repulsion = new Vec( repulsion.x, repulsion.y );
                    //this_repulsion.mult( 1 / this.rad);

                    //const that_repulsion = new Vec( repulsion.x, repulsion.y );
                    //that_repulsion.mult( 1 / that.rad);

                    //this.pos.sub(this_repulsion);
                    //that.pos.add(that_repulsion);

                    
                    

                }
            }

        })

    }

    updateGridPos() {

        let col = Math.floor( this.pos.x / this.grid.cell_size);
        let row = Math.floor( this.pos.y / this.grid.cell_size);

        //console.log(this.index, col, row);

        if ( (col == this.cell_col) & (row == this.cell_row) ) {

            this.changed_cell = false;

        } else {

            // saving the last cell indices to remove the particle from the proper cell -- the previous one;
            this.cell_previous_row = this.cell_row;
            this.cell_previous_col = this.cell_col;

            this.cell_col = col;
            this.cell_row = row;

            this.changed_cell = true;

            //this.grid.removeParticle(this);
            //this.grid.addParticle(this);

        }

    }

    getPreviousGridPos() {
        return [this.cell_previous_col, this.cell_previous_row];

    }

    getGridPos() {
        return [this.cell_col, this.cell_row];
    }

    getChangedCell() {
        return this.changed_cell;
    }

    display(ctx, highlight = false) {

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.rad, 0, Math.PI * 2);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "goldenrod";
        ctx.fillStyle = "khaki";
        //let red;
        //if (this.hits > 255) red = 255;
        //else red = Math.floor(this.hits);
        //console.log(red);
        ctx.fill();
        if (highlight) {
            ctx.lineWidth = 6;
            ctx.strokeStyle = "hotpink";
            ctx.fillStyle = "hotpink";
        } else {

            //ctx.fillStyle = `rgb(${255} ${255-red} ${255-red})`;
        }
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.font = "14px Serif";
        ctx.fillStyle = "black";
        ctx.fillText(this.index, this.pos.x, this.pos.y);
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

    displayGridCell(ctx) {

        const l = this.grid.cell_size;
        const x = l * this.cell_col;
        const y = l * this.cell_row;

        //console.log(this.cell_col, this.cell_row, this.changed_cell);

        ctx.save();
        ctx.fillStyle = "lightyellow";
        
        ctx.fillRect(x, y, l, l);
        ctx.restore();
    
    }

}