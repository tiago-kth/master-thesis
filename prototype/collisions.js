class CollisionSystem {

    current_collisions_registry;

    constructor() {

        this.current_collisions_registry = new Map;

    }

    update_collisions(particles) {

        this.current_collisions_registry.clear();
        this.detect_collisions(particles);
        //if (params.DISPLAY_COLLIDERS) this.render_colliders();
        // resolve penetrations
        // resolve collisions
        this.resolve_collisions();
        this.resolve_penetrations();

    }

    detect_internal_collisions(blob) {
        blob.particles.forEach(this_particle => {


        })
    }

    detect_collisions(particles) {

        particles.forEach(particle => {

            const cell = particle.grid_cell;

            const group_of_particles = grid.retrieve_neighboring_particles(cell);

            if (group_of_particles) {

                group_of_particles.forEach(other_particle => {

                    // external collisions

                    if ( other_particle != particle & particle.immediate_neighbors.indexOf(other_particle) < 0 ) {
    
                        const type = (particle.blob != other_particle.blob) ? "external" : "internal";

                        const collision = new PottentialCollision(particle, other_particle, type);
    
                        //console.log(collision);
    
                    }   
    
                })

            }

        })

    }

    resolve_collisions() {

        this.current_collisions_registry.forEach(collision => collision.resolve_collision());

    }

    resolve_penetrations() {

        this.current_collisions_registry.forEach(collision => collision.resolve_penetration());

    }

    render_collisions() {

        this.current_collisions_registry.forEach(collision => {

            //collision.p1.render(ctx, "red", "transparent"); collision.p2.render(ctx, "black", "transparent")
            const type = collision.type;

            collision.p1.render_colliders(ctx, type); 
            collision.p2.render_colliders(ctx, type);

        
        })


    }

}

class PottentialCollision {

    p1;
    p2;

    type;

    contact_normal;

    penetration;

    restitution_coefficient;

    constructor(p1, p2, type = "external") {

        this.p1 = p1;
        this.p2 = p2;
        this.type = type;

        // talvez colocar um "type" no constructor? Para saber qual collider usar?

        this.restitution_coefficient = params.RESTITUTION_COEFFICIENT;

        let center = type == "internal" ? "internal_collider_center" : "collider_center";
        //if (type == "interaction") console.log(center, p1[center], p2[center]);
        //console.log(type);
        const distance_v = Vec.sub(p1[center], p2[center]);//p1.pos, p2.pos);
        const distance = distance_v.mod();

        this.contact_normal = distance_v.getUnitDir();

        const min_distance = p1.collider_radius + p2.collider_radius;//p1.r + p2.r;

        this.penetration = min_distance - distance;

        // d < 0, no penetration;
        // d = 0, touch
        // d > 0, penetration

        if (this.penetration >= 0) {

            this.register_collision();

            // add to registry

        }

    }

    register_collision() {

        if ( collision_system.current_collisions_registry.has( [this.p2, this.p1] ) ) return

        collision_system.current_collisions_registry.set([this.p1, this.p2], this);

        //console.log(collision_system.current_collisions_registry);

    }

    resolve_collision() {

        const delta_velocity = Vec.sub(
            this.p1.vel,
            this.p2.vel
        );

        // delta_velocity_component_on_contact_normal
        const separating_velocity = Vec.dot(delta_velocity, this.contact_normal);

        if (separating_velocity > 0) {
            //console.log("ALERT!");
            return;
        }

        const new_separating_velocity = -1 * separating_velocity * this.restitution_coefficient;

        const delta_separating_velocity = new_separating_velocity - separating_velocity;

        const m1 = this.p1.getMass();
        const m2 = this.p2.getMass();
        const m_total = m1 + m2;

        const v1_delta = Vec.mult(this.contact_normal,      delta_separating_velocity * m2 / m_total);
        const v2_delta = Vec.mult(this.contact_normal, -1 * delta_separating_velocity * m1 / m_total);

        // we don't want to resolve collision for the interaction particle
        if (this.p1.type != "interaction") this.p1.vel.selfAdd(v1_delta);
        if (this.p2.type != "interaction") this.p2.vel.selfAdd(v2_delta);

        // collision debug

        /*

        console.log(
            " ======================================= \n",
            "COLLISION REPORT \n",
            "======================================= \n",
            "p1 vel: ", this.p1.vel, "\n",
            "p2 vel: ", this.p2.vel, "\n",
            "delta_vel : ", delta_velocity, "\n",
            "separating_velocity: ", separating_velocity, "\n",
            "new separating velocity: ", new_separating_velocity, "\n",
            "m1, m2, m_total: ", m1, ", ", m2, ", ", m_total, "\n",
            "v1_delta: ", v1_delta, "\n",
            "v2_delta: ", v2_delta, "\n",
            "new v1: ", this.p1.vel, "\n",
            "new v2: ", this.p2.vel, "\n",
            "========================================"
        )

        this.p1.render(ctx, "red", "yellow"); 
        this.p2.render(ctx, "black", "yellow");

        */

    }

    resolve_penetration() {

        const m1 = this.p1.getMass();
        const m2 = this.p2.getMass();
        const m_total = m1 + m2;

        const pos1_delta = Vec.mult(this.contact_normal,      this.penetration * m2 / m_total);
        const pos2_delta = Vec.mult(this.contact_normal, -1 * this.penetration * m1 / m_total);

        // we don't want to resolve penetration for the interaction particle
        if (this.p1.type != "interaction") this.p1.pos.selfAdd(pos1_delta);
        if (this.p2.type != "interaction") this.p2.pos.selfAdd(pos2_delta);

    }

}

const collision_system = new CollisionSystem();