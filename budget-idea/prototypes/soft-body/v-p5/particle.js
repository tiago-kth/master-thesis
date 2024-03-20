class Particle {

    constructor(pos) {

      this.pos = pos;
      this.velocity = createVector(random(-1, 1), random(-1, 1));
      this.acceleration = createVector(0, 0);
      this.mass = 1.5;
      this.radius = this.mass * 5;
      this.maxSpeed = 7;

    }

    updateState(newPos) {

      this.velocity.add(this.acceleration);
      this.limitVelocities();
      this.pos.add(this.velocity);

    }

    checkEdges() {

      if (this.pos.x - this.radius < 0) {

        this.pos.x = this.radius;
        this.velocity.x *= -1;

      } else if (this.pos.x + this.radius > width) {

        this.pos.x = width - this.radius;
        this.velocity.x *= -1;

      }

      if (this.pos.y - this.radius < 0) {

        this.pos.y = this.radius;
        this.velocity.y *= -1;

      } else if (this.pos.y + this.radius > height) {

        this.pos.y = height - this.radius;
        this.velocity.y *= -1;

      }

    }

    checkCollision() {

      for (let other of particles) {

        if (this != other) {

          const distance = this.pos.dist(other.pos);
          const minDistance = this.radius + other.radius;

          if (distance <= minDistance) {

            const normal = p5.Vector.sub(other.pos, this.pos).normalize();
            const relativeVelocity = p5.Vector.sub(other.velocity, this.velocity);

            const impulse = p5.Vector.mult(
              normal,
              (2 * p5.Vector.dot(relativeVelocity, normal)) / 2
            );

            const repulsion = p5.Vector.mult(normal, minDistance - distance);

            // impulse
            this.velocity.add(p5.Vector.div(impulse, this.mass));
            other.velocity.sub(p5.Vector.div(impulse, other.mass));

            // repulsion
            this.pos.sub(p5.Vector.div(repulsion, this.mass));
            other.pos.add(p5.Vector.div(repulsion, other.mass));

          }

        }

      }

    }

    addForce(f) {

      this.velocity.add(f.div(this.mass));

    }

    limitVelocities() {

      const speed = sqrt(

        this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y

      );

      const maxSpeed = 3;

      if (speed > maxSpeed) {

        this.velocity.mult(maxSpeed / speed);

      }

    }

    display() {

      stroke(255);
      fill(255);
      ellipse(this.pos.x, this.pos.y, this.radius * 2);

    }

    displayDirection() {

      push();
      strokeWeight(3);
      stroke(255, 0, 0);
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.velocity.x * 2,
        this.pos.y + this.velocity.y * 2
      );
      stroke(0, 0, 255);
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + this.acceleration.x * 2,
        this.pos.y + this.acceleration.y * 2
      );
      pop();
    }
    
  }