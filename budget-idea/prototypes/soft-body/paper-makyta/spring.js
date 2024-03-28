class Spring {

    pa;
    pb;
    rest_length;
    normal;

    constructor(pa, pb) {

        this.pa = pa.pos;
        this.pb = pb.pos;

        const pa_pb = Vec.sub(this.pa, this.pb);

        this.normal = pa_pb.getUnitDir();
        this.rest_length = pa_pb.mod();

    }

    get_length() {

        return Vec.sub(this.pa, this.pb).mod();

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