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

    getProjectionOn(vec_b) {

        const unit_vec_b = vec_b.getUnitDirectionVector();
        const dot_product = this.getDotProduct(vec_b);

        return unit_vec_b.mult(dot_product);

    }

    draw(canvas) {

        const ctx = canvas.getContext('2d');

        const x0 = canvas.W / 2;
        const y0 = canvas.H / 2;

        



    }

    /* this make it possible to use the utility function without instantiating an object */
    static fromAngle(ang) {

        let x = Math.cos(ang);
        let y = Math.sin(ang);

        return new Vec(x, y, ang)

    }

}

class Grid {

    w; h;
    cell_size;
    nCols;
    nRows;

    cells = [];

    constructor(w, h, cell_size, ctx) {

        this.ctx = ctx;

        this.w = w;
        this.h = h;

        this.cell_size = cell_size;

        this.nRows = Math.ceil(h / cell_size);
        this.nCols = Math.ceil(w / cell_size);

        for (let i = 0; i < this.nCols; i++) {
            
            this.cells[i] = [];
            
            for (let j = 0; j < this.nRows; j++) {

                this.cells[i][j] = [];

            }
        }

    }

    addParticle(particle) {

        const [col, row] = particle.getGridPos();

        //console.log('Célula (', col, ',', row, ') ', this.cells[col][row]);
          
        this.cells[col][row].push(particle);

        //console.log('Adicionada a particula ', particle.index, ' à célula (', col, ',', row, ') ', this.cells[col][row]);

        //particle.updateGridPos(col, row);

    }

    removeParticle(particle) {

        const [col, row] = particle.getPreviousGridPos(); // getting the previous grid position because we're calling this method only if the particle changed cell, and the its currents grid position corresponds to the new cell, not the last one, from which it needs to be removed.
        const cell = this.cells[col][row];

        //console.log('Removendo particula ', particle.index, ' da célula (', col, ',', row, ')');

        if (cell.length > 0) {

            const particle_index_in_the_cell = cell.indexOf(particle);

            //console.log('antes splice', cell, this.cells[col][row], particle_index_in_the_cell);

            cell.splice(particle_index_in_the_cell, 1);
            //console.log('depois splice', cell, this.cells[col][row]);

        } else {
            //console.log(particle.index, col, row, cell, this.cells[col][row], 'empty cell');
        }
        
    }

    getNeighbours(particle) {

        const [x, y, r] = [particle.pos.x, particle.pos.y, particle.rad];

        const l = this.cell_size;

        const top_left = [
            Math.floor( (x-r) / l ),
            Math.floor( (y-r) / l )
        ];

        const bottom_right = [
            Math.floor( (x+r) / l ),
            Math.floor( (y+r) / l )
        ];

        //console.log(x, y, r, top_left, bottom_right);

        let neighbours = [];

        for (let i = top_left[0]; i <= bottom_right[0]; i++) {
            for (let j = top_left[1]; j <= bottom_right[1]; j++) {

                //console.log(i,j);

                // out of bounds test
                if (i < 0 || j < 0 || i >= this.nCols || j >= this.nRows) continue
                
                const cell = this.cells[i][j];

                //console.log(cell);
                
                cell.forEach(p => {

                    // avoiding adding the particle itself

                    if (p != particle) neighbours.push(p)

                })

            }
        
        }

        return neighbours;

    }

    /*
    displayParticleCell(particle) {

        const [col, row] = particle.getGridPos();
        const cell = this.cells[col][row];)

        const l = this.cell_size;
        const x = l * col;
        const y = l * row;

        this.ctx.save();
        this.ctx.fillStyle = "lightgreen";
        
        this.ctx.fillRect(x, y, l, l);
        this.ctx.restore();

    }*/

    display() {

        this.ctx.save();
        this.ctx.strokeStyle = "blue";

        for (let i = 0; i < this.nCols; i++) {

            const x = i * this.cell_size;

            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.h);
            this.ctx.stroke();
            
        }

        for (let j = 0; j < this.nRows; j++) {

            const y = j * this.cell_size;

            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.w, y);
            this.ctx.stroke();

        }

        this.ctx.restore();

    }



}

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

    constructor(pos, rad, grid, index) {
        this.index = index;
        this.grid = grid;
        this.hits = 0;
        this.pos = pos;
        this.rad = rad;
        this.mass = rad * rad / 200;
        this.vel = new Vec( 0.5 * (Math.random() - 0.5), 0.05 * (Math.random() - 0.5) );
        this.acc = new Vec( 0, .3); 
    }

    applyAcc(array_of_accelerations) {
        // to-do
        // sum all acceleration vectors to get a resultant, and assign this vector to this.acc
    }

    limitSpeed() {
        const speed = this.vel.mod();
        if (speed > 8) this.vel.mult(8 / speed);
    }

    update(dT) {
        //this.acc.mult(dT);
        this.vel.add(this.acc);
        //this.vel.mult(dT/25);
        this.pos.add(this.vel);
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

        let count = 1;

        particles.forEach(that => {

            if (this != that) {

                const difference_vector = this.getDifferenceVecFrom(that);

                const distance = difference_vector.mod();
                const min_distance = this.rad + that.rad;

                if (distance <= min_distance) {

                    count++

                    this.hits++
                    that.hits++

                    const normal = difference_vector.getUnitDirectionVector();

                    const velocity_difference = this.vel.getDifferenceVec(that.vel);

                    const vel_difference_component_on_normal = velocity_difference.getDotProduct(normal);

                    const impulse = new Vec(normal.x, normal.y);
                    //impulse.mult(vel_difference_component_on_normal);
                   // if (count < 10) console.log(this.vel, that.vel, velocity_difference, normal, vel_difference_component_on_normal, impulse);

                    //impulse.mult( 2 * vel_difference_component_on_normal / (this.mass + that.mass) );//vel_difference_component_on_normal);

                    //console.log(impulse.mod());
                    //console.log(normal, velocity_difference, vel_difference_component_on_normal, this.vel, impulse);

                    const impulse_this = new Vec(impulse.x, impulse.y);
                    impulse_this.mult( .98 / this.mass);
                    this.vel.add(impulse_this);
                    
                    const impulse_that = new Vec(impulse.x, impulse.y);
                    impulse_that.mult( .98 / that.mass);
                    that.vel.sub(impulse_that);

                    // REPULSION, to avoid balls sticking together

                    
                    const repulsion = new Vec(normal.x, normal.y);
                    //console.log(distance / min_distance);
                    repulsion.mult( min_distance - distance );

                    const this_repulsion = new Vec( repulsion.x, repulsion.y );
                    this_repulsion.mult( 1 / this.rad);

                    const that_repulsion = new Vec( repulsion.x, repulsion.y );
                    that_repulsion.mult( 1 / that.rad);

                    this.pos.sub(this_repulsion);
                    that.pos.add(that_repulsion);

                    
                    

                }
            }

        })

    }

    updateGridPos() {

        let col = Math.floor( this.pos.x / this.grid.cell_size);
        let row = Math.floor( this.pos.y / this.grid.cell_size);

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
        ctx.strokeStyle = "black";
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
        ctx.fillStyle = "lightgreen";
        
        ctx.fillRect(x, y, l, l);
        ctx.restore();
    
    }

}