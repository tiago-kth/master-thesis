class CollisionSystem {

    current_collisions_registry;

    constructor() {

        this.current_collisions_registry = new Map;

    }

    update_collisions(particles) {

        this.current_collisions_registry.clear();
        this.detect_collisions(particles);
        if (params.DISPLAY_COLLIDERS) this.render_colliders();
        // resolve penetrations
        // resolve collisions

    }

    detect_collisions(particles) {

        particles.forEach(particle => {

            const cell = particle.grid_cell;

            const group_of_particles = grid.retrieve_neighboring_particles(cell);

            if (group_of_particles) {

                group_of_particles.forEach(other_particle => {

                    if ( other_particle != particle & other_particle != particle.immediate_neighbors[0] & other_particle != particle.immediate_neighbors[1] ) {
    
                        const collision = new PottentialCollision(particle, other_particle);
    
                        //console.log(collision);
    
                    }
    
                })

            }

        })

    }

    render_colliders() {

        this.current_collisions_registry.forEach(collision => {
            collision.p1.render(ctx, "red", "red"); collision.p2.render(ctx, "black", "black")})

    }

}

class PottentialCollision {

    p1;
    p2;

    contact_normal;

    penetration;

    restitution_coefficient;

    constructor(p1, p2) {

        this.p1 = p1;
        this.p2 = p2;

        this.restitution_coefficient = params.RESTITUTION_COEFFICIENT;

        const distance_v = Vec.sub(p1.pos, p2.pos);
        const distance = distance_v.mod();

        this.contact_normal = distance_v.getUnitDir();

        const min_distance = p1.r + p2.r;

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

}

const collision_system = new CollisionSystem();