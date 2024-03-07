const cv = document.querySelector('canvas');

const ctx = cv.getContext('2d');

const H = 500;
const W = 500;
const N_PARTICLES = 10;

const particles = [];

cv.width = W;
cv.height = H;

for ( let i = 0; i < N_PARTICLES; i++ ) {

    const r = 5 + Math.random() * 10;
    const x = r + Math.random() * (W - 2 * r);
    const y = r + ( Math.random() ) * (H - 2 * r);

    particles.push(
        new Particle( new Vec(x, y), r)
    )

}

//const p = new Particle(new Vec(200,200), 5);
//console.log(p);

let count = 0;

function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
}

let anim;

function loop() {
    clearCanvas();

    particles.forEach(p => {
        p.checkBounds();
        p.update();
        p.checkCollisions(particles);
        p.display(ctx);
        p.displayVel(ctx);
    })
    count++
    /*if (count < 100)*/ anim = window.requestAnimationFrame(loop);
}

anim = window.requestAnimationFrame(loop);

// interac

const stopBTN = document.querySelector('[data-btn="stop"]');
stopBTN.addEventListener('click', e => {
    if (e.target.innerText == 'stop') {
        e.target.innerText = "resume";
        window.cancelAnimationFrame(anim);
    } else {
        e.target.innerText = "stop";
        anim = window.requestAnimationFrame(loop);
    }
    
})