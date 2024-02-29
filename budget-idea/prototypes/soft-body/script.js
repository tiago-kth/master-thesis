const cv = document.querySelector('canvas');

const ctx = cv.getContext('2d');

const H = 500;
const W = 500;

cv.width = W;
cv.height = H;

const p = new Particle(new Vec(200,200), 5);
console.log(p);

let count = 0;

function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
}

function loop() {
    clearCanvas();
    p.checkBounds();
    p.update();
    p.display(ctx);
    count++
    /*if (count < 100)*/ window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);