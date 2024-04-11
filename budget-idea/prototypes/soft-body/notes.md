First reference: https://www.gorillasun.de/blog/an-algorithm-for-particle-systems-with-collisions/

He is not using the masses to calculate the impulse, as mentioned in the post's code block (it's different from the actual P5 code).

We shouldn't use the particle's masses for the repulsion, but their radix(?).

Improvements for the particle version with grid lookup (from https://www.gorillasun.de/blog/particle-system-optimization-grid-lookup-spatial-hashing/):
* We only need to check for collision with the canvas boundaries if the particle is in one of the grid cells located at the border of the grid.
* [already implemented] We also only need to update a particle's grid cell if it's new position falls into a new grid cell.

https://en.wikipedia.org/wiki/Elastic_collision

![](./prints/ellastic-collision.png)

bola pequena às vezes orbita a grande

## COISAS A RESOLVER NA FRENTE

* Usar bézier em vez de linhas? `quadraticCurveTo(cpx, cpy, x, y)`

`(cpx, cpy)` poderiam ser encontrados usando `[ (pa - pcenter) + (pb - pcenter) ] * c`, onde `c > 1/2` (`c = 1/2` posicionaria o ponto de controle no ponto médio dos dois pontos). Fazer interativo.

* colliders maiores que os pontos, para evitar penetração

## 2024.03.20

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

## 2024.03.30, madrugada

it works! for one blob, no collisions, though.

Check wall collisions

## 2024.04.04

Millington, Chapter 7. Collision resolution.

## 2024.04.09

Back to work.

Trying to build the grid lookup for the spatial hashing.

Playing with some of the parameters, those will be fundamental to achieve the visual effect we're aiming at.

For lower timesteps, we need lower (meaning, stronger) velocity damping to help stabilise the system. Time steps of 50 seem to work well.

## 2024.04.10

Higher stiffness make the blobs blobbier when under contact.

Gas constant and stiffness constant impact in the final blob size compared to its reference circle.

## 2024.04.11

Building the collision system. Based on Millington, chapter 7. Thinking if I need to iterate over all particles or over all cells, and whether that makes any difference.

Collisions with rods / springs? Not on this version.

Smaller radius seem more unstable for lower time steps.

Parametrizar particle radius.

No collision detection, ignorar as partículas adjacentes. Talvez adicionar índice às partículas.