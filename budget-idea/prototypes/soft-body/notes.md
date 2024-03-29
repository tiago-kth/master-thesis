First reference: https://www.gorillasun.de/blog/an-algorithm-for-particle-systems-with-collisions/

He is not using the masses to calculate the impulse, as mentioned in the post's code block (it's different from the actual P5 code).

We shouldn't use the particle's masses for the repulsion, but their radix(?).

Improvements for the particle version with grid lookup (from https://www.gorillasun.de/blog/particle-system-optimization-grid-lookup-spatial-hashing/):
* We only need to check for collision with the canvas boundaries if the particle is in one of the grid cells located at the border of the grid.
* [already implemented] We also only need to update a particle's grid cell if it's new position falls into a new grid cell.

https://en.wikipedia.org/wiki/Elastic_collision

![](./prints/ellastic-collision.png)

bola pequena às vezes orbita a grande

### 2024.03.20

Particle system seems to be working. Going to try implementing the spring-mass system.

Worked. But not the circular structures.

> It kind of blows my mind that with relatively little such an interesting system emerges. The beauty of emergence: the mesh doesn't really know that it exists, it's simply the particles and springs working in tandem to create this intricate and dynamic structure.
(https://www.gorillasun.de/blog/spring-physics-and-connecting-particles-with-springs/)

Refatorar tudo.

## 2024.03.29

Seguindo agora o Makyta

Gauss formula para área de polígono:
https://www.thecivilengineer.org/education/professional-examinations-preparation/calculation-examples/calculation-example-three-point-resection

Melhor aqui (Shoelace formula): https://en.wikipedia.org/wiki/Shoelace_formula

Verlet integration: 
https://en.wikipedia.org/wiki/Verlet_integration

Leapfrog integration
https://en.wikipedia.org/wiki/Leapfrog_integration

Velocity Verlet

Pressure factor can be used to deflate / inflate the blobs
