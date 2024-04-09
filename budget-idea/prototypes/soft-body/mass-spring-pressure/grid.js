class Grid {

    cells;

    w;
    h;
    dim;

    ncols;
    nrows;

    constructor(w, h, dim) {

        this.w = w;
        this.h = h;
        this.dim = dim;
        this.cells = [];

        const ncols = Math.floor(w / dim);
        const nrows = Math.floor(h / dim);

        this.ncols = ncols;
        this.nrows = nrows;

        let index = 0;

        for (let j = 0; j < nrows; j++) {

            for (let i = 0; i < ncols; i++) {

                const cell = new GridCell(index, i, j);

                const i_bf = i - 1;
                const i_af = i + 1;
                const j_bf = j - 1;
                const j_af = j + 1;

                const neighbors = [];

                for (let i_ = i_bf; i_ <= i_af; i_++) {

                    for (let j_ = j_bf; j_ <= j_af; j_++) {

                        if (i_ < 0 | j_ < 0 | i_ >= ncols | j_ >= nrows | (i_ == i & j_ == j) ) continue;

                        else neighbors.push(this.get_index(i_, j_));

                    }

                }

                cell.set_neighbors(neighbors);

                this.cells.push(cell);

                index++

            }

        }

    } 

    get_index(i, j) {

        return j * this.ncols + i;

    }

    get_ij(index) {

        const i = index % this.ncols;
        const j = Math.floor(index / this.ncols);

        return [i,j];

    }

    get_cell(index) {

        return this.cells[index];
    }

    get_index_from_px(x, y) {

        const i = Math.floor(x / this.dim);
        const j = Math.floor(y / this.dim);

        return this.get_index(i, j);

    }

    render_cell(index, ctx, color) {

        const [i, j] = this.get_ij(index);

        ctx.save();
        ctx.fillStyle = color;
        ctx.fillRect(i * this.dim, j * this.dim, this.dim, this.dim);
        ctx.restore();

    }

    render_neighbors(index, ctx, color) {

        const cell = this.get_cell(index);

        const neighbors_list = cell.get_neighbors()
        
        neighbors_list.forEach(neighbor_index => this.render_cell(neighbor_index, ctx, color));

    }

    render_grid(ctx, color) {

        for (let i = 0; i <= this.ncols; i++ ) {

            ctx.save();
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(i * this.dim, 0);
            ctx.lineTo(i * this.dim, this.h);
            ctx.stroke();
            ctx.restore();

        }

        for (let j = 0; j <= this.nrows; j++ ) {

            ctx.save();
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(0, j * this.dim);
            ctx.lineTo(this.w, j * this.dim);
            ctx.stroke();
            ctx.restore();

        }

    }

    retrieve_neighboring_particles(index) {

        let particles_set = this.cells[index].particles;

        let neighboring_cells = this.cells[index].neighbors;

        neighboring_cells.forEach(neighbor_index => {

            particles_set = particles_set.union(
                this.cells[neighbor_index].particles
            )

        })

        return particles_set;


    }

    highlight_particles(particles) {

        //console.log(particles);

        particles.forEach(p => p.render(ctx, "purple", "purple"));


    }


}

class GridCell {

    index;
    i; j;
    neighbors;

    particles;

    constructor(index, i, j) {

        this.particles = new Set;

        this.index = index;
        this.i

    } 

    set_neighbors(list) {

        this.neighbors = list;

    }

    get_neighbors() {

        return this.neighbors;
    }

}