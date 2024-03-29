class Spring {

    p1; p2;
    pa; pb;
    rest_length;
    normal;

    constructor(p1, p2) {

        this.p1 = pa;
        this.p2 = pb;

        this.pa = p1.pos;
        this.pb = p2.pos;

        const pa_pb = Vec.sub(this.pa, this.pb);

        // k_s, k_d will be defined as global variables, so we call change them in real time;

        this.rest_length = pa_pb.mod();

    }

    update_normal() {

        const l = this.get_length();

        this.normal = new Vec(
                 ( this.pa.y - this.pb.y ) / l,
            -1 * ( this.pa.x - this.pb.x ) / l
        )

    }

    get_length() {

        return Vec.sub(this.pa, this.pb).mod();

    }

    get_rest_length() {

        return this.rest_length;

    }

    get_direction() {

        return Vec.sub(this.pa, this.pb).getUnitDir();
    }

    display(ctx) {

        const l = this.get_length();

        ctx.save();
        ctx.strokeStyle = colors["spring"];
        //if (l > this.len_0) ctx.strokeStyle = 'dodgerblue';
        //if (l < this.len_0) ctx.strokeStyle = 'tomato';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.pa.x, this.pa.y);
        ctx.lineTo(this.pb.x, this.pb.y);
        ctx.stroke();
        ctx.restore();

    }

}