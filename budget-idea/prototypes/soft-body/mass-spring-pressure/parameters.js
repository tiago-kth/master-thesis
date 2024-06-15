
function formatNumber(num, minDigits) {
    // Convert the number to a string
    let numStr = num.toFixed(6);
    
    // Split the number into integer and fractional parts
    let parts = numStr.split('.');
    
    // Pad the integer part with leading zeros if necessary
    while (parts[0].length < minDigits) {
        parts[0] = '0' + parts[0];
    }
    
    // Join the integer and fractional parts back together
    return parts.join('.');
}

const steps = 20;
const ticks = 420;

const k_ = {
    min: 0.2,
    max: 1.0//1.8
}

const nRT_ = {
    min: 500,//50,
    max: 2000//1000
}

let k = k_.min;

const conditions = [];

while (k <= k_.max) {

    let nRT = nRT_.min;

    while (nRT <= nRT_.max) {

        conditions.push({
            k : k,
            nRT : nRT
        })

        nRT = nRT + (nRT_.max - nRT_.min) / steps;
        nRT = Math.round(nRT * 100) / 100;

    }

    console.log(k);
    k = k + (k_.max - k_.min) / steps;
    k = Math.round(k * 100) / 100;

}

const results_area_stab = [];

function run_test_area_stabilizer(k) {

    ctx.font = "30px monospace";
    const avg_v = blobs[0].get_avg_vel();
    ctx.fillText("avg vel. mag.: " + formatNumber(avg_v, 2) + "   Frame " + (k - 300), 400, 20);


    if (k == 0) {

        console.log("initial conditions");

        params.STIFFNESS = k_.min;
        params.PRESSURE_FACTOR = nRT_.max;

        return;

    }

    ctx.fillText("Initial condition // K = " + k_.min.toFixed(2) + " // P = " + nRT_.max, 100, 110);

    if (k == 300) {

        console.log("new_conditions");

        params.STIFFNESS = k_.max;
        params.PRESSURE_FACTOR = nRT_.min;

        return;

    }

    if (k > 300 & k <= 900) {

        ctx.fillText("Final condition   // K = " + k_.max.toFixed(2) + " // P = " + nRT_.min, 100, 160);

        results_area_stab.push(
            {
                k : k - 300,
                v : avg_v
            }
        )

        //console.log(avg_v, k - 300, chart_aux.x())
        chart_aux.plot(k - 300, avg_v);

    }

    if (k == 901) {

        ctx.fillText("Final condition   // K = " + k_.max.toFixed(2) + " // P = " + nRT_.min, 100, 160);
        ctx.fillText("End.", 100, 210);
        console.log("End.", results_area_stab);
    }

    if (k > 901) {

        ctx.fillText("Final condition   // K = " + k_.max.toFixed(2) + " // P = " + nRT_.min, 100, 160);
        ctx.fillText("End.", 100, 210);

    }









}

function run_test_area(k) {

    if (k % (ticks / 2) == 0) {
        params.TIMESTEP = 60;
    }

    if (k % ticks != 0) return;

    let index = Math.floor(k / ticks) - 1;

    //if ( index % 20 == 0 ) {console.log("skipping to give it more time"); return;}

    if (index >= 0) {

        const current_area = blobs[0].get_area();
        const avg_v = blobs[0].get_avg_vel();
        conditions[index].area = current_area;
        conditions[index].vel = avg_v;


        console.log(index, current_area, avg_v);

    }

    index++

    params.STIFFNESS = conditions[index].k;
    params.PRESSURE_FACTOR = conditions[index].nRT;
    params.TIMESTEP = 50;

}

class Chart {

    ref_canvas;
    el;
    ctx;
    H;
    W;
    gap = 50;
    res = 2;

    last_point;

    axis_x;
    axis_y;
    origin;
    


    constructor(ref_canvas) {

        this.ref_canvas = ref_canvas;
        this.el = document.querySelector(ref_canvas);

        this.el.style.display = "block";
        this.ctx = this.el.getContext("2d");

        this.W = 2 * +getComputedStyle(this.el).width.slice(0,-2);
        this.H = 2 * +getComputedStyle(this.el).height.slice(0,-2);

        this.el.width = this.W;
        this.el.height = this.H;

        this.w = this.W - 2 * this.gap;
        this.h = this.H - 2 * this.gap;

        this.make_axis();
        this.make_scales();
        this.plot_axis();

    }

    make_axis() {

        this.axis_x = new Vec(this.w, 0);
        this.axis_y = new Vec(0, this.h);

        this.origin = new Vec(this.gap, this.gap + this.h);

    }

    make_scales() {

        this.y_domain = [0, 15];
        this.x_domain = [0, 600];

        this.x_range = [this.gap, this.gap + this.w];
        this.y_range = [this.gap + this.h, this.gap];

        this.y = function(y) {
            return this.y_range[0] + ( (this.y_range[1] - this.y_range[0]) / (this.y_domain[1] - this.y_domain[0]) * (y - this.y_domain[0]) )
        }

        this.x = function(x) {
            return this.x_range[0] + ( (this.x_range[1] - this.x_range[0]) / (this.x_domain[1] - this.x_domain[0]) * (x - this.x_domain[0]) )
        }

    }

    plot_axis() {

        this.axis_x.display(this.ctx, this.origin, "gray");
        this.axis_y.display(this.ctx, new Vec(this.gap, this.gap), "gray");

        this.ctx.font = "30px monospace";
        this.ctx.textBaseline = "bottom";
        this.ctx.fillText("AVG |V|", this.gap, this.gap);
        this.ctx.textBaseline = "top";
        this.ctx.textAlign = "right";
        this.ctx.fillText("Frames", this.W - this.gap, this.H - this.gap + 10);

    }

    plot(v1,v2) {

        const x = this.x(v1);
        const y = this.y(v2);

        this.ctx.strokeStyle = "tomato";
        this.ctx.lineWidth = 5;

        if (!this.last_point) {
            this.last_point = new Vec(x,y);
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(this.last_point.x, this.last_point.y);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            this.last_point.x = x;
            this.last_point.y = y;
        }



    }

}

const chart_aux = new Chart("canvas.aux-chart");

function plot_vel(ctx) {

}