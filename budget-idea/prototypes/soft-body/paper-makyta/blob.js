class Blob {

    R;
    center;
    rest_area;
    particles;
    springs;

    constructor(center, r, n) {

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

    display_mesh(ctx) {

        this.springs.forEach(s => s.display(ctx));
        this.particles.forEach(p => p.render(ctx));

    }



}