class Blob {

    R;
    center;
    rest_area;
    particles;
    springs;

    constructor(center, r, n) {

        this.R = r;
        this.center = center;
        this.particles = [];
        this.springs = [];

        const theta = 2*Math.PI / n;

        for (let i = 0; i < n; i++) {

            const p = new Particle(
                Vec.fromAngle(r, theta * i, center)
            )

            this.particles.push(p);

        }

        for (let i = 0; i < n; i++) {

            const next_index = i == this.particles.length - 1 ? 0 : i + 1;

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
        ctx.fillStyle = colors["blob-fill"];
        ctx.strokeStyle = colors["blob-stroke"];
        ctx.lineWidth = 6;

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

    display_mesh(ctx) {

        this.springs.forEach(s => s.display(ctx));
        this.particles.forEach(p => p.render(ctx));

    }

    get_blob_center() {

        const xm = this.particles.map(p => p.pos.x).reduce( (previous, current) => previous + current) / this.particles.length;
        const ym = this.particles.map(p => p.pos.y).reduce( (previous, current) => previous + current) / this.particles.length;

        return( [ Math.round(xm), Math.round(ym) ] );

    }

    display_reference_circle(ctx) {

        const [xc, yc] = this.get_blob_center();

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