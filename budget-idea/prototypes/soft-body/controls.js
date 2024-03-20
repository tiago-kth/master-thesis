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

    constructor(ref) {

        this.name = ref;

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

        if (this.name == "STIFFNESS") {
            springs.forEach(s => {
                s.k = value;
            })
        }

        if (this.name == "REST_LEN") {
            springs.forEach(s => {
                s.len_0 = value;
            })
        }

    }

}

const slider_stiffness = new Slider("STIFFNESS");
const slider_restlen = new Slider("REST_LEN");