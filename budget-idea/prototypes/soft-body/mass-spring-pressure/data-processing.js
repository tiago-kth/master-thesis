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
const colors_blobs = ["#FFB3B5", "#EEBD92", "#CFC982", "#A4D390", "#76D9B1", "#61D8D6", 
"#85D0F2", "#BCC3FE", "#E7B5F5", "#FEAFDA"];


function place_blobs() {

    params.GRAVITY = 0.5;
    params.PRESSURE_FACTOR = 1000;

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

            const new_blob = new Blob(new Vec(W/2 + (Math.random() - 0.5) * W/3, b.r + 50), b.r, colors_blobs[i], colors["generic-stroke"]);
            blobs.push(new_blob);
            all_particles.push(...new_blob.particles);
    
        }, i * 5000)
    
    
    })


}

