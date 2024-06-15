
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