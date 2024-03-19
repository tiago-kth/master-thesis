class Point {

    x; y; 

    constructor(x, y) {
        this.x = x;
        this.y = y;
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
        this.ctx.strokeStyle = "ghostwhite";

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