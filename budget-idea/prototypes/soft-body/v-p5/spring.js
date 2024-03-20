class Spring {

    constructor(particleA, particleB, leng, stiff) {

      this.particleA = particleA;
      this.particleB = particleB;
      this.restLength = leng;
      this.stiffness = stiff;
      this.damping = 0.05;

    }

    update() {

      const d = p5.Vector.sub(this.particleA.pos, this.particleB.pos);
      const dst = d.mag();

      const distention = dst - this.restLength;
      const restorativeForce = this.stiffness * distention;

      const f = p5.Vector.mult(p5.Vector.div(d, dst), restorativeForce);

      this.particleA.addForce(p5.Vector.mult(f, -1));
      this.particleB.addForce(f);

      const dampingForce = p5.Vector.mult(
        p5.Vector.sub(this.particleA.velocity, this.particleB.velocity),
        this.damping
      );

      this.particleA.addForce(p5.Vector.mult(dampingForce, -1));
      this.particleB.addForce(dampingForce);

    }

    display() {

      stroke(255);

      line(
        this.particleA.pos.x,
        this.particleA.pos.y,
        this.particleB.pos.x,
        this.particleB.pos.y
      );
      
    }
  }