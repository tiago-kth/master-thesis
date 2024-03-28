class Blob {

    R;
    center;
    area;
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

        }

    }

    display(ctx) {

        this.springs.forEach(s => s.display(ctx));
        this.particles.forEach(p => p.render(ctx));

    }

}