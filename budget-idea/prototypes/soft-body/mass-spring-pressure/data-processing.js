function get_total(dataset, column_name) {

    const sum = dataset.map(d => d[column_name]).reduce( (previous, current) => previous + current );

    return sum;

}

function get_radius(value, type_of_value) {

    const column_name = type_of_value;

    const total_area = H * W;

    const use_area = total_area / 1.2;

    const total_value = get_total(data["functions"], column_name);

    const factor = value / total_value;

    const area = factor * use_area;

    const radius = Math.round(Math.sqrt(area) / Math.PI);

    return radius;

}

const blobs_data = [];

// flourish colors
const colors_blobs = [
    "#4328e7",
    "#9654e5",
    "#ff6283",
    "#ff8800",
    "#ffc502",
    "#007d8e",
    "#1aa7ee",
    "#29dae4",
    "#88e99a",
    "#019c00",
    "#c11f1f",
    "#730000"
  ];
  
//["#FFB3B5", "#EEBD92", "#CFC982", "#A4D390", "#76D9B1", "#61D8D6", "#85D0F2", "#BCC3FE", "#E7B5F5", "#FEAFDA"];


function place_blobs() {

    //params.GRAVITY = 0.5;
    //params.PRESSURE_FACTOR = 1000;

    data["functions"].forEach(f => {
    
        const blob_entry = {
            
            name: f.Expenditure, 
            r: get_radius(f.Value_RS, "Value_RS")
            
        }
    
        blobs_data.push(blob_entry);
    
    });

    blobs_data.sort( (a, b) => a.r - b.r);

    blobs_data.forEach( (b,i) => {

        window.setTimeout( () => {

            const new_blob = new Blob(new Vec(gap + W/2 + (Math.random() - 0.5) * W/3, gap + b.r + 50), b.r, colors_blobs[i], colors["generic-stroke"]);
            blobs.push(new_blob);
            all_particles.push(...new_blob.particles);
    
        }, i * 5000)
    
    
    })


}

/**** FOR THE USER STUDIES  */

const test_data = [10, 11, 12, 15, 20, 22, 24, 30];

const sum = test_data.reduce( (prev, curr) => prev + curr);

function scale_r(value) {
    const area = value * (W * H) /  ( 3 * sum);
    return Math.sqrt(area / Math.PI);
}

function place_blobs2() {

    if (blob_i > test_data.length - 1) return;

    if (kk % 800 == 0) {
        const new_blob = new Blob(new Vec(gap + (W/2) + ((Math.random() - 0.5) * (W - 2 * radix[blob_i])), gap + radix[blob_i]), radix[blob_i], colors_blobs[blob_i], colors["generic-stroke"], test_data[blob_i]);
        blobs.push(new_blob);
        all_particles.push(...new_blob.particles);
        blob_i++
    }
}

function place_blobs3() {

    const center_data = [
        { label: 10, x: 216, y: 518 },
        { label: 11, x: 218, y: 1000 },
        { label: 12, x: 992, y: 980 },
        { label: 15, x: 754, y: 958 },
        { label: 20, x: 489, y: 964 },
        { label: 22, x: 268, y: 760 },
        { label: 24, x: 589, y: 662 },
        { label: 30, x: 923, y: 685 }
      ];
      
    center_data.forEach( (d,i) => {

        const new_blob = new Blob(new Vec(d.x, d.y), scale_r(d.label), colors_blobs[i], colors["generic-stroke"], d.label);
        blobs.push(new_blob);
        all_particles.push(...new_blob.particles);


    })


}





