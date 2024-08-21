let palette = ["#0a0a0a", "#f7f3f2", "#0077e1", "#f5d216", "#fc3503"],
  N_PARTICLES_X,
  N_PARTICLES_Y,
  particles = [],
  springs = [],
  grid,
  WID = 400,
  HEI = 400,
  PAD = 50;
function setup() {
  createCanvas(WID, HEI),
    (grid = new Grid(WID, HEI, 22)),
    (blob = new Blob(
      { x: WID / 4 + 20, y: HEI / 4 + 20 },
      120,
      39
    )).makeParticlesAndSprings(),
    (blob2 = new Blob(
      { x: (WID / 4) * 3, y: (HEI / 4) * 3 },
      80,
      33
    )).makeParticlesAndSprings();
}
function draw() {
  background(0), blob.display(), blob.run(), blob2.display(), blob2.run();
}
class Blob {
  constructor(s, t, i) {
    (this.startPos = s),
      (this.radius = t),
      (this.detail = i),
      (this.col = random(palette)),
      (this.particles = []),
      (this.springs = []);
  }
  makeParticlesAndSprings() {
    let s = [];
    for (let t = 0; t < TAU; t += TAU / this.detail) {
      let i = this.startPos.x + this.radius * cos(t),
        e = this.startPos.y + this.radius * sin(t),
        o = new Particle(new createVector(i, e));
      s.push(o);
    }
    for (let l = 0; l < 5; l++)
      for (let r = 0; r < s.length; r++) {
        let h = s[r],
          c = s[(r + l) % s.length];
        this.springs.push(
          new Spring(h, c, dist(h.pos.x, h.pos.y, c.pos.x, c.pos.y), 0.25 / l)
        );
      }
    for (let a of s) this.particles.push(a), grid.addParticle(a);
    particles.push(...this.particles);
  }
  run() {
    for (let s of this.springs) s.update();
    for (let t of this.particles) {
      let i = grid.getNeighbors(t);
      t.checkCollision(i), t.checkEdges(), t.updateState(), t.limitVelocities();
    }
    for (let e of this.particles) grid.removeParticle(e), grid.addParticle(e);
  }
  display() {
    for (let s of this.particles) s.display();
    for (let t of this.springs) t.display();
  }
}
class Particle {
  constructor(s) {
    (this.pos = s),
      (this.velocity = createVector(random(-1, 1), random(-1, 1))),
      (this.acceleration = createVector(0, 0)),
      (this.mass = 1.25),
      (this.radius = 5 * this.mass),
      (this.maxSpeed = 7),
      (this.dragging = !1);
  }
  mousePressed() {
    dist(mouseX, mouseY, this.pos.x, this.pos.y) < this.radius &&
      (this.dragging = !0);
  }
  mouseReleased() {
    this.dragging = !1;
  }
  updateState(s) {
    this.dragging
      ? ((this.velocity = p5.Vector.sub(
          createVector(mouseX, mouseY),
          this.pos
        )),
        this.pos.add(this.velocity))
      : (this.addForce(this.acceleration),
        this.limitVelocities(),
        this.pos.add(this.velocity));
  }
  checkEdges() {
    this.pos.x - this.radius < 0
      ? ((this.pos.x = this.radius),
        (this.velocity.x *= -0.25),
        this.addForce(createVector(1, 0)))
      : this.pos.x + this.radius > width &&
        ((this.pos.x = width - this.radius),
        (this.velocity.x *= -0.25),
        this.addForce(createVector(-1, 0))),
      this.pos.y - this.radius < 0
        ? ((this.pos.y = this.radius),
          (this.velocity.y *= -0.25),
          this.addForce(createVector(0, 1)))
        : this.pos.y + this.radius > height &&
          ((this.pos.y = height - this.radius),
          (this.velocity.y *= -0.25),
          this.addForce(createVector(0, -1)));
  }
  checkCollision(s) {
    for (let t of s)
      if (this != t) {
        let i = this.pos.dist(t.pos),
          e = this.radius + t.radius;
        if (i <= e) {
          let o = p5.Vector.sub(t.pos, this.pos).normalize(),
            l = p5.Vector.sub(t.velocity, this.velocity),
            r = p5.Vector.mult(o, (2 * p5.Vector.dot(l, o)) / 2),
            h = p5.Vector.mult(o, e - i);
          this.addForce(p5.Vector.div(r, this.mass)),
            t.addForce(p5.Vector.div(r, -t.mass)),
            this.addForce(p5.Vector.div(h, -this.mass)),
            t.addForce(p5.Vector.div(h, t.mass));
        }
      }
  }
  addForce(s) {
    this.velocity.add(s.div(this.mass));
  }
  limitVelocities() {
    var s = sqrt(
      this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y
    );
    s > this.maxSpeed && this.velocity.mult(this.maxSpeed / s);
  }
  display() {
    stroke(255), fill(255), ellipse(this.pos.x, this.pos.y, 2 * this.radius);
  }
  displayDirection() {
    push(),
      strokeWeight(3),
      stroke(255, 0, 0),
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + 2 * this.velocity.x,
        this.pos.y + 2 * this.velocity.y
      ),
      stroke(0, 0, 255),
      line(
        this.pos.x,
        this.pos.y,
        this.pos.x + 2 * this.acceleration.x,
        this.pos.y + 2 * this.acceleration.y
      ),
      pop();
  }
}
function mousePressed() {
  for (let s = 0; s < particles.length; s++) particles[s].mousePressed();
}
function mouseReleased() {
  for (let s = 0; s < particles.length; s++) particles[s].mouseReleased();
}
class Grid {
  constructor(s, t, i) {
    (this.cellSize = i),
      (this.numCols = Math.ceil(s / i)),
      (this.numRows = Math.ceil(t / i)),
      (this.cells = []);
    for (let e = 0; e < this.numCols; e++) {
      this.cells[e] = [];
      for (let o = 0; o < this.numRows; o++) this.cells[e][o] = [];
    }
  }
  addParticle(s) {
    let t = Math.floor(s.pos.x / this.cellSize),
      i = Math.floor(s.pos.y / this.cellSize);
    this.cells[t][i].push(s), (s.gridCell = { col: t, row: i });
  }
  removeParticle(s) {
    let { col: t, row: i } = s.gridCell,
      e = this.cells[t][i],
      o = e.indexOf(s);
    e.splice(o, 1);
  }
  getNeighbors(s) {
    let t = [
        floor((s.pos.x - s.radius) / this.cellSize),
        floor((s.pos.y - s.radius) / this.cellSize),
      ],
      i = [
        floor((s.pos.x + s.radius) / this.cellSize),
        floor((s.pos.y + s.radius) / this.cellSize),
      ],
      e = [];
    for (let o = t[0]; o <= i[0]; o++)
      for (let l = t[1]; l <= i[1]; l++) {
        if (o < 0 || l < 0 || o >= this.numCols || l >= this.numRows) continue;
        let r = this.cells[o][l];
        for (let h of r) h != s && e.push(h);
      }
    return e;
  }
}
class Spring {
  constructor(s, t, i, e) {
    (this.particleA = s),
      (this.particleB = t),
      (this.restLength = i),
      (this.stiffness = e),
      (this.damping = 0.05);
  }
  update() {
    let s = p5.Vector.sub(this.particleA.pos, this.particleB.pos),
      t = s.mag();
    var i = t - this.restLength,
      e = this.stiffness * i;
    let o = p5.Vector.mult(p5.Vector.div(s, t), e);
    this.particleA.addForce(p5.Vector.mult(o, -1)), this.particleB.addForce(o);
    let l = p5.Vector.mult(
      p5.Vector.sub(this.particleA.velocity, this.particleB.velocity),
      this.damping
    );
    this.particleA.addForce(p5.Vector.mult(l, -1)), this.particleB.addForce(l);
  }
  display() {
    stroke(255),
      line(
        this.particleA.pos.x,
        this.particleA.pos.y,
        this.particleB.pos.x,
        this.particleB.pos.y
      );
  }
}
