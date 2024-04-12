class Spring {

    p1; 
    p2;

    rest_length;
    normal;

    constructor(p1, p2) {

        this.p1 = p1;
        this.p2 = p2;

        const p1_p2 = Vec.sub(this.p1.pos, this.p2.pos);

        // k_s, k_d will be defined as global variables, so we call change them in real time;

        this.rest_length = p1_p2.mod();

        this.update_normal();

    }

    update_normal() {

        const l = this.get_length();

        this.normal = new Vec(
                 ( this.p1.pos.y - this.p2.pos.y ) / l,
            -1 * ( this.p1.pos.x - this.p2.pos.x ) / l
        )

    }

    get_normal() {

        return this.normal;

    }

    get_length() {

        return Vec.sub(this.p1.pos, this.p2.pos).mod();

    }

    get_rest_length() {

        return this.rest_length;

    }

    get_direction() {

        return Vec.sub(this.p1.pos, this.p2.pos).getUnitDir();
    }

    display(ctx) {

        const l = this.get_length();

        ctx.save();
        ctx.strokeStyle = colors["spring"];
        //if (l > this.len_0) ctx.strokeStyle = 'dodgerblue';
        //if (l < this.len_0) ctx.strokeStyle = 'tomato';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.p1.pos.x, this.p1.pos.y);
        ctx.lineTo(this.p2.pos.x, this.p2.pos.y);
        ctx.stroke();
        ctx.restore();

    }

    display_normals(ctx) {

        Vec.mult(this.normal, params.VECTOR_SIZE).display(ctx, this.p1.pos, "brown");
        Vec.mult(this.normal, params.VECTOR_SIZE).display(ctx, this.p2.pos, "brown");

    }

}