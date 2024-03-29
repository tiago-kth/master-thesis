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
let dragging = false;
cv.addEventListener('mousedown', mousedown);
cv.addEventListener('mousemove', mousemove);
cv.addEventListener('mouseup', mouseup);

function mousedown(e) {

    console.log(e);

    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);

    dragging = true;

}

function mousemove(e) {

    if (!dragging) return;

    else {

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

    }

}

function mouseup(e) {

    dragging = false;

}

class Slider {

    el;
    el_text;
    name;
    prop_name;

    constructor(ref, prop_name) {

        this.name = ref;
        this.prop_name = prop_name ? prop_name : ref;

        this.el = document.querySelector('#input-' + ref);
        this.el_text = document.querySelector(`.input-${ref}-value`);

        this.updateSlider();

        this.el.addEventListener("change", e => {

            const value = +this.el.value;
            this.updateParams(value);
            if (this.name != "TIMESTEP") this.updateModel(value);

        })

    }

    updateSlider() {

        this.el.value = params[this.name];
        this.el_text.innerText = params[this.name];

    }

    updateParams(value) {

        params[this.name] = value;
        this.el_text.innerText = value;

    }

    updateModel(value) {

        springs.forEach(s => {
            s[this.prop_name] = value;
        })

    }

}

const slider_stiffness = new Slider("STIFFNESS", 'k');
const slider_restlen = new Slider("REST_LEN", 'len_0');
const slider_damping = new Slider("DAMPING", 'damping');
const slider_timestep = new Slider("TIMESTEP");