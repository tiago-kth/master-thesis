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

class Slider {

    el;
    el_text;
    name;
    prop_name;

    constructor(ref, prop_name) {

        this.name = ref;
        this.prop_name = prop_name;

        this.el = document.querySelector('#input-' + ref);
        this.el_text = document.querySelector(`.input-${ref}-value`);

        this.updateSlider();

        this.el.addEventListener("change", e => {

            const value = +this.el.value;
            this.updateParams(value);
            this.updateModel(value);

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