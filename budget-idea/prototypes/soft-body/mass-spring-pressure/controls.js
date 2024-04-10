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
cv.addEventListener('mouseout', mouseout);

const sensitivity = 10;
let particle_being_dragged;

function mousedown(e) {

    //console.log(e);

    if (particle_being_dragged) return

    blobs.forEach(blob => {

        if (particle_being_dragged) return

        blob.particles.forEach(p => {

            const mouse_pos = new Vec(e.offsetX, e.offsetY);

            const distance = Vec.sub(mouse_pos, p.pos).mod();

            if (distance <= 2 * p.r) {

                dragging = true;

                particle_being_dragged = p;

                console.log('dragging particle ', p);
                
                return

            }

        })

    })

    //ctx.beginPath();
    //ctx.moveTo(e.offsetX, e.offsetY);
    //dragging = true;

}

function mousemove(e) {

    if (params.HIGHLIGHT_CELLS) {
        params._MOUSE_MOVING = true;
        params._x = e.offsetX;
        params._y = e.offsetY;
    }

    if (!dragging) return;

    else {

        const mouse_pos = new Vec(e.offsetX, e.offsetY);
        particle_being_dragged.pos = mouse_pos;
        //particle_being_dragged.render(ctx);
        //ctx.lineTo(e.offsetX, e.offsetY);
        //ctx.stroke();

    }

}

function mouseup(e) {

    dragging = false;
    particle_being_dragged = false;

}

function mouseout(e) {

    params._MOUSE_MOVING = false;
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
            //if (this.name != "TIMESTEP") this.updateModel(value);

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

class Toggle {

    el;
    param_name;

    constructor(ref, param_name) {

        this.el = document.querySelector('.toggle.btn-' + ref);
        this.param_name = param_name ? param_name : ref;

        this.el.addEventListener('click', e => this.click_event(e, this));

    }

    click_event(e, this_obj) {

        this_obj.el.classList.toggle('activated');
        params[this_obj.param_name] = !params[this_obj.param_name];

    }

}

class VectorMainToggle extends Toggle {

    constructor(ref, param_name) {

        super(ref, param_name);

    }

    click_event(e) {

        document.querySelector('.dependent-wrapper').classList.toggle("hidden");
        e.target.classList.toggle('activated');

        if (!params.DISPLAY_VECTORS) {
            toggles.forEach(name => {
                params[name] = false;
                document.querySelector('.toggle.btn-' + name).classList.remove("activated");
            })
        }

    }

}

const slider_stiffness = new Slider("STIFFNESS", 'k');
const slider_damping = new Slider("DAMPING", 'damping');
const slider_vel_damping = new Slider("VEL_DAMPING");
const slider_timestep = new Slider("TIMESTEP");
const slider_gravity = new Slider("GRAVITY");
const slider_mass = new Slider("MASS");
const slider_vector_size = new Slider("VECTOR_SIZE");
const pressure_factor_size = new Slider("PRESSURE_FACTOR");

const btn_display_vector = new VectorMainToggle("DISPLAY_VECTORS");
const btn_display_mesh = new Toggle("DISPLAY_MESH");
const btn_display_blob = new Toggle("DISPLAY_BLOB");
const btn_display_grid = new Toggle("DISPLAY_GRID");
const btn_highlight_cells = new Toggle("HIGHLIGHT_CELLS");

const toggles = [
    'DISPLAY_SPRING_VECTORS',
    'DISPLAY_GRAVITY_VECTORS',
    'DISPLAY_PRESSURE_VECTORS',
    'DISPLAY_RESULTANT_VECTORS'
];

toggles.forEach(name => new Toggle(name));