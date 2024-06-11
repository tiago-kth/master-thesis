const steps = 20;

const k_ = {
    min: 0.2,
    max: 1.5,
}

const nRT_ = {
    min: 50,
    max: 1000,
    step: 50
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

    if (k == 0) {

        console.log("initial conditions");

        params.STIFFNESS = k_.min;
        params.PRESSURE_FACTOR = nRT_.max;

        return;

    }

    if (k == 300) {

        console.log("new_conditions");

        params.STIFFNESS = k_.max;
        params.PRESSURE_FACTOR = nRT_.min;

        return;

    }

    if (k > 300 & k <= 600) {

        const avg_v = blobs[0].get_avg_vel();

        results_area_stab.push(
            {
                k : k - 300,
                v : avg_v
            }
        )

    }









}

function run_test_area(k) {

    if (k % 180 != 0) return;

    let index = Math.floor(k / 180) - 1;

    if (index >= 0) {

        const current_area = blobs[0].get_area();
        conditions[index].area = current_area;

        console.log(index, current_area, Math.PI * Math.pow(blobs[0].R, 2));

    }

    index++

    params.STIFFNESS = conditions[index].k;
    params.PRESSURE_FACTOR = conditions[index].nRT;

}