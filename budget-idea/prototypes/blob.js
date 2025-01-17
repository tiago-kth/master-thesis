class Blob {

    R;
    center;
    rest_area;
    particles;
    springs;

    blob_fill_color;
    blob_stroke_color;

    name;

    constructor(center, r, blob_fill_color, blob_stroke_color, name) {

        this.R = r;
        this.center = center;
        this.particles = [];
        this.springs = [];

        this.blob_fill_color = blob_fill_color ? blob_fill_color : colors["blob-fill"];
        this.blob_stroke_color = blob_stroke_color ? blob_stroke_color : colors["blob-stroke"];
        this.name = name ? name : "NA"

        //const theta = 2*Math.PI / n;
        let theta = Math.atan( params.PARTICLE_RADIUS * 2 / r); // 20 = 2 * r_particles
        console.log(theta);
        const n = Math.round(2 * Math.PI / theta);
        console.log(n);
        theta = 2*Math.PI / n;


        for (let i = 0; i < n; i++) {

            const p = new Particle(
                Vec.fromAngle(r, theta * i, center),
                this
            )

            this.particles.push(p);

        }

        for (let i = 0; i < n; i++) {

            const next_index = i == this.particles.length - 1 ? 0 : i + 1;
            const next_index_plus = next_index == this.particles.length - 1 ? 0 : next_index + 1;
            const next_index_plus2 = next_index_plus == this.particles.length - 1 ? 0 : next_index_plus + 1;

            // saves neighbors, for the collision system
            const previous_index = i == 0 ? this.particles.length - 1 : i - 1;
            const previous_index_minus = previous_index == 0 ? this.particles.length - 1 : previous_index - 1;
            const previous_index_minus2 = previous_index_minus == 0 ? this.particles.length - 1 : previous_index_minus - 1;

            this.particles[i].immediate_neighbors = [
                this.particles[previous_index_minus2],
                this.particles[previous_index_minus], 
                this.particles[previous_index], 
                this.particles[next_index],
                this.particles[next_index_plus],
                this.particles[next_index_plus2]
            ];
            //

            const s = new Spring(this.particles[i], this.particles[next_index]);
            s.type = "perimeter";
            this.particles[i].springs.push(s);
            this.particles[next_index].springs.push(s);

            this.springs.push(s);

            const s2 = new Spring(this.particles[i], this.particles[ (i + 2) % (this.particles.length) ]);

            this.springs.push(s2);

            //const s3 = new Spring(this.particles[i], this.particles[ (i + 4) % (this.particles.length) ]);

            //this.springs.push(s3);

        }

        this.particles.forEach(p => {
            p.update_normal();
            p.update_collider_position();
        });

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

    get_avg_vel() {

        return this.particles.map(p => p.vel.mod()).reduce( (pv, cv) => pv + cv ) / this.particles.length;

    }

    get_length() {

        /*
        let length = 0;

        this.particles.map(d => d.pos).forEach( (pos, i, a) => {

            const inext = i + 1 > this.particles.length - 1 ? 0            : i + 1;

            length += Vec.sub(pos, a[inext]).mod();

        })*/

        const length = this.springs
            .filter(s => s.type == "perimeter")
            .map(s => s.get_length())
            .reduce( (accum_l, current_l) => accum_l + current_l);


        return length;

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

    display_name(ctx) {

        ctx.save();
        ctx.font = "20px monospace";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(this.name, this.center.x, this.center.y);
        ctx.restore();

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

        this.particles.forEach(p => {
            p.render_colliders(ctx, "internal");
            p.render_colliders(ctx, "external");
        });

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

        const {x, y} = this.center;//this.get_blob_center();

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, this.R, 0, Math.PI * 2);
        ctx.closePath();
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

    }



}