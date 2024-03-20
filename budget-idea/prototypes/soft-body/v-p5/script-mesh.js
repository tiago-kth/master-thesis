let N_PARTICLES_X;
let N_PARTICLES_Y;
const particles = [];
const springs = [];
const WID = 600;
const HEI = 600;
const PAD = 50;
const particleCounter = 0;


function setup() {

  createCanvas(WID, HEI);

  N_PARTICLES_X = int(random(2, 7));
  N_PARTICLES_Y = int(random(2, 7));

  const xspc = (WID - PAD * 2) / N_PARTICLES_X;

  const yspc = (HEI - PAD * 2) / N_PARTICLES_Y;

  const particle_grid = [];

  for (let x = 0; x < N_PARTICLES_X; x++) {

    const col = [];

    for (let y = 0; y < N_PARTICLES_Y; y++) {

      col.push(
        new Particle(new createVector(PAD + x * xspc, PAD + y * yspc))
      );
    }

    particle_grid.push(col);

  }

  for (let x = 0; x < N_PARTICLES_X - 1; x++) {

    for (let y = 0; y < N_PARTICLES_Y - 1; y++) {

      springs.push(
        new Spring(
            particle_grid[x][y], 
            particle_grid[x + 1][y], 
            50, 
            0.13)
      );

      springs.push(
        new Spring(
            particle_grid[x][y], 
            particle_grid[x][y + 1], 
            50, 
            0.13)
      );

      springs.push(
        new Spring(
          particle_grid[x][y],
          particle_grid[x + 1][y + 1],
          50 * sqrt(2),
          0.13
        )
      );

      springs.push(
        new Spring(
          particle_grid[x][y + 1],
          particle_grid[x + 1][y],
          50 * sqrt(2),
          0.13
        )
      );
    }
  }

  for (let y = 0; y < N_PARTICLES_Y - 1; y++) {

    springs.push(
      new Spring(
        particle_grid[N_PARTICLES_X - 1][y],
        particle_grid[N_PARTICLES_X - 1][y + 1],
        50,
        0.13
      )
    );

  }

  for (let x = 0; x < N_PARTICLES_X - 1; x++) {

    springs.push(
      new Spring(
        particle_grid[x][N_PARTICLES_Y - 1],
        particle_grid[x + 1][N_PARTICLES_Y - 1],
        50,
        0.13
      )
    );

  }

  for (let x = 0; x < N_PARTICLES_X; x++) {
    for (let y = 0; y < N_PARTICLES_Y; y++) {
      particles.push(particle_grid[x][y]);
    }
  }
}

function draw() {

  background(0);

  for (let s of springs) {
    s.update();
    s.display();
  }

  for (let p of particles) {
    p.checkCollision();
    p.checkEdges();
    p.updateState();
    p.limitVelocities();
    p.display();
    p.displayDirection();
  }

}

let dragging = !1;
let dragParticle = null;

function mousePressed() {
  for (let p of particles) {
    let distance = dist(mouseX, mouseY, p.pos.x, p.pos.y);
    if (distance <= p.radius) {
      dragging = !0;
      dragParticle = p;
      break;
    }
  }
}

function mouseDragged() {

  if (dragging && dragParticle) {
    dragParticle.pos.x = mouseX;
    dragParticle.pos.y = mouseY;
  }

}

function mouseReleased() {

  dragging = !1;
  dragParticle = null;

}
