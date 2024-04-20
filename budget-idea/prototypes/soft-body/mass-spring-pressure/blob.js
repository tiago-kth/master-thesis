class Blob {

    R;
    center;
    rest_area;
    particles;
    springs;

    blob_fill_color;
    blob_stroke_color;

    constructor(center, r, blob_fill_color, blob_stroke_color) {

        this.R = r;
        this.center = center;
        this.particles = [];
        this.springs = [];

        this.blob_fill_color = blob_fill_color ? blob_fill_color : colors["blob-fill"];
        this.blob_stroke_color = blob_stroke_color ? blob_stroke_color : colors["blob-stroke"];

        //const theta = 2*Math.PI / n;
        let theta = Math.atan( params.PARTICLE_RADIUS * 2 / r); // 20 = 2 * r_particles
        console.log(theta);
        const n = Math.round(2 * Math.PI / theta);
        console.log(n);
        theta = 2*Math.PI / n;


        for (let i = 0; i < n; i++) {

            const p = new Particle(
                Vec.fromAngle(r, theta * i, center),
                this.R,
                this.center
            )

            this.particles.push(p);

        }

        for (let i = 0; i < n; i++) {

            const next_index = i == this.particles.length - 1 ? 0 : i + 1;

            // saves neighbors, for the collision system
            const previous_index = i == 0 ? this.particles.length - 1 : i - 1;
            this.particles[i].immediate_neighbors = [
                this.particles[previous_index], this.particles[next_index]
            ];
            //

            const s = new Spring(this.particles[i], this.particles[next_index]);

            this.springs.push(s);

            const s2 = new Spring(this.particles[i], this.particles[ (i + 2) % (this.particles.length) ]);

            this.springs.push(s2);

        }

        this.rest_area = this.get_area();

    }

    get_area() {

        let area = 0;
        let area2 = 0;

        this.particles.map(d => d.pos).forEach( (d, i, a) => {

            const inext = i + 1 > this.particles.length - 1 ? 0            : i + 1;

            area  += a[i].x * a[inext].y - a[inext].x * a[i].y;
            
        })

        return Math.abs(area / 2);

    }

    display(ctx) {

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.blob_fill_color;
        ctx.strokeStyle = this.blob_stroke_color; 
        ctx.lineWidth = 8;

        this.particles.forEach( (p,i) => {

            if (i == 0) ctx.moveTo(p.pos.x, p.pos.y);
            else {
                ctx.lineTo(p.pos.x, p.pos.y);
            }
            if (i == this.particles.length - 1) {
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        })

    }

    display_exp_art(ctx) {

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = colors["blob-fill"];
        ctx.strokeStyle = colors["blob-stroke"];
        ctx.lineWidth = 6;

        const [xc, yc] = this.get_blob_center();
        const p_center = new Vec(xc, yc);

        let lastx, lasty;

        this.particles.forEach( (p,i) => {

            if (i == 0) {
                ctx.moveTo(p.pos.x, p.pos.y);
                lastx = p.pos.x; 
                lasty = p.pos.y;
            }
            else {

                const pa = new Vec(lastx, lasty);
                const pb = p.pos;

                let va = Vec.sub(pa, p_center);
                let vb = Vec.sub(p_center, pb);

                const cp = Vec.mult( Vec.add(va, vb), 0.5 );

                ctx.quadraticCurveTo(cp.x, cp.y, pb.x, pb.y);

                lastx = p.pos.x; 
                lasty = p.pos.y;

                //ctx.lineTo(p.pos.x, p.pos.y);
            }
            if (i == this.particles.length - 1) {
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        })

    }

    display_exp(ctx) {

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = colors["blob-fill"];
        ctx.strokeStyle = colors["blob-stroke"];
        ctx.lineWidth = 6;

        const [xc, yc] = this.get_blob_center();
        const p_center = new Vec(xc, yc);

        let lastx, lasty;

        this.particles.forEach( (p,i) => {

            if (i == 0) {
                ctx.moveTo(p.pos.x, p.pos.y);
                lastx = p.pos.x; 
                lasty = p.pos.y;
            }
            else {

                const pa = new Vec(lastx, lasty);
                const pb = p.pos;

                let va = Vec.sub(pa, p_center);
                let vb = Vec.sub(pb, p_center);

                const cp = Vec.mult( Vec.add(va, vb), 0.52 );

                ctx.quadraticCurveTo(cp.x + xc, cp.y + yc, pb.x, pb.y);

                lastx = p.pos.x; 
                lasty = p.pos.y;

                //ctx.lineTo(p.pos.x, p.pos.y);
            }
            if (i == this.particles.length - 1) {
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        })

    }

    display_exp_wrong(ctx) {

        //ctx.save();
        //ctx.globalAlpha = 0.7;
        //ctx.beginPath();
        //ctx.fillStyle = colors["blob-fill"];
        //ctx.strokeStyle = colors["blob-stroke"];
        ctx.lineWidth = 6;

        const [xc, yc] = this.get_blob_center();
        const p_center = new Vec(xc, yc);

        let lastx, lasty;

        this.particles.forEach( (p,i) => {

            if (i == 0) {
                //ctx.moveTo(p.pos.x, p.pos.y);
                lastx = p.pos.x; 
                lasty = p.pos.y;
            }
            else {

                const pa = new Vec(lastx, lasty);
                const pb = p.pos;

                let va = Vec.sub(pa, p_center);
                let vb = Vec.sub(pb, p_center);

                const cp = Vec.mult( Vec.add(va, vb), 0.6 );

                if (i == 5) {

                    va.display(ctx, p_center, "blue");
                    vb.display(ctx, p_center, "red");
                    cp.display(ctx, p_center, "green");

                    ctx.save();
                    ctx.beginPath();
                    ctx.fillStyle = colors["blob-fill"];
                    ctx.strokeStyle = colors["blob-stroke"];
                    ctx.moveTo(va.x, va.y);
                    ctx.quadraticCurveTo(cp.x, cp.y, pb.x, pb.y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();

                }


                //ctx.quadraticCurveTo(pa.x, pa.y, pb.x, pb.y);

                lastx = p.pos.x; 
                lasty = p.pos.y;

                //ctx.lineTo(p.pos.x, p.pos.y);
            }
            if (i == this.particles.length - 1) {
                //ctx.closePath();
                //ctx.fill();
                //ctx.stroke();
                ctx.restore();
            }
        })

    }

    display_mesh(ctx) {

        this.springs.forEach(s => s.display(ctx));
        this.particles.forEach(p => p.render(ctx));

    }

    display_colliders(ctx) {

        this.particles.forEach(p => p.render_colliders(ctx, "red"));

    }

    get_blob_center() {

        const xm = this.particles.map(p => p.pos.x).reduce( (previous, current) => previous + current) / this.particles.length;
        const ym = this.particles.map(p => p.pos.y).reduce( (previous, current) => previous + current) / this.particles.length;

        return( [ Math.round(xm), Math.round(ym) ] );

    }

    update_blob_center() {

        // this will be called at all frames

        const [x, y] = this.get_blob_center();

        this.center = new Vec(x, y);

    }

    display_reference_circle(ctx) {

        const [xc, yc] = this.center;//this.get_blob_center();

        ctx.save();
        ctx.beginPath();
        ctx.arc(xc, yc, this.R, 0, Math.PI * 2);
        ctx.closePath();
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

    }



}