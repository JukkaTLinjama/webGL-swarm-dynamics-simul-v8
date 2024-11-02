# 3D Wavelet Simulation - Version 10

## Yleiskuvaus
Tämä simulaatio perustuu aaltofunktioihin ja dynaamisiin parvielementteihin, jotka seuraavat kohde-elementtien liikeratoja. Kohteet ja parvielementit liikkuvat määriteltyjen aaltofunktioiden mukaan kolmiulotteisessa avaruudessa. Versio 10 sisältää uuden ominaisuuden, joka mahdollistaa parvielementtien joustavan kohdentamisen tiettyihin kohteisiin hajautetusti.

## Uudet ominaisuudet ja muutokset
- **`targetIndexRange`-parametri**: Määrittää alueen, jolle valitut kohdeindeksit jakautuvat. Tämä mahdollistaa sen, että seurattavat kohteet eivät ole peräkkäisiä vaan hajautettuja, luoden realistisemman ja vaihtelevamman liikkeen.
- **`generateFollowedIndices`-funktio**: Apufunktio, joka generoi kohdeindeksit (`followedIndices`) valittujen parametrien perusteella. Tämä mahdollistaa joustavan indeksien valinnan ja hajautuksen.
  - Parametrit:
    - `numTargets`: Kohde-elementtien kokonaismäärä.
    - `targetIndexRange`: Valittujen kohteiden lukumäärä alueen keskellä.
    - `spreadFactor`: Indeksien hajautuskerroin, joka määrittää, kuinka etäällä valitut indeksit ovat toisistaan.
- **`followedIndices`-muuttuja**: Globaali taulukko, joka sisältää generoidut kohdeindeksit, joita parvielementit seuraavat. `generateFollowedIndices`-funktion avulla tätä voidaan helposti päivittää.

## Muutettu `animate`-loop
`animate`-loopissa parvielementit päivittävät sijaintinsa ja nopeutensa `followedIndices`-taulukon pohjalta. Tämä mahdollistaa sen, että jokainen parvielementti voi seurata hajautettuja kohdeindeksejä, jolloin liike on dynaamisempaa ja realistisempaa.

## Esimerkki asetuksista
```javascript
const targetIndexRange = 10; // Valittujen kohteiden alueen suuruus
const spreadFactor = 2;      // Indeksien hajautuskerroin
const followedIndices = generateFollowedIndices(simCfg.target.numElements, targetIndexRange, spreadFactor);

------------------------------------------------------------------------
# Floating Swarm Simulation with 3D Dynamics - Version 9

## Overview
Version 9 of the Floating Swarm Simulation project includes several key updates and improvements to create a more dynamic and visually appealing swarm of elements using 3D dynamics. The goal is to have the target elements evenly distributed in 2D while maintaining a subtle 3D structure, with some movement in the z-direction.

### Key Features
1. **Even Distribution in 2D Space**: The target elements are distributed evenly in a 2D grid while still existing in 3D space. This is achieved by generating initial positions in a grid layout, making the swarm appear balanced when viewed from the screen.
2. **Flattened Depth (Z-Axis)**: The swarm has been flattened along the z-axis to create a more 2D-like appearance while retaining a slight 3D effect. This makes the swarm look good on the screen without excessive depth, creating a balanced visualization.
3. **Sinusoidal Oscillation Added to Base Positions**: The static base positions of the target elements now include a sinusoidal oscillation component, adding natural, smooth back-and-forth movement. This movement keeps the formation dynamic and prevents it from appearing too static.
4. **Simple Incremental Updates to Base Positions**: The base positions are periodically updated with small increments, allowing the swarm to gradually adapt its base shape over time.

### Changes Made
- **Base Position Updates**: Introduced a new function (`updateTargetBasePositions`) that incrementally adjusts the base positions of the target elements. This keeps the base positions evolving during the simulation.
- **Oscillation Component**: Added an oscillation factor to the base position updates, creating a more organic movement. Each target element's base position now oscillates using sine waves with a small amplitude and frequency.
- **Flattened Swarm Distribution**: Modified the function `generateSwarmElemPositions()` to create an evenly distributed grid in the x-y plane, while flattening the z-axis for a subtle depth effect. This approach works well with a small number of elements (e.g., 10) while keeping the distribution visually pleasing.

### Updated Functions
- **`generateSwarmElemPositions(numElements)`**: Generates an evenly spaced distribution of target elements in a 2D grid, with a flattened z-axis to add slight depth. The targets are centered around (0, 0) in the x-y plane.
- **`updateTargetBasePositions(targetBasePositions)`**: Updates the base positions of the target elements with a small incremental value and includes a sinusoidal oscillation to create dynamic movement over time.

### How to Run
1. Open the `index.html` file in a web browser.
2. The simulation will automatically initialize and start animating the swarm elements.
3. Use the provided controls to adjust zoom and FPS for the visualization.

### Controls
- **Zoom Slider**: Adjusts the camera's zoom level to get a closer or wider view of the swarm.
- **FPS Slider**: Adjusts the frames per second to control the simulation speed.

### Future Improvements
- **Enhanced Interaction**: Add user interaction capabilities, allowing the user to directly influence the swarm's movement or configuration.
- **Further Evenness Optimization**: Improve the evenness of the distribution through adaptive algorithms that adjust the grid based on the current state.
- **3D Visualization Enhancements**: Experiment with different visual styles for representing the depth dimension, such as adding shadows or color variations based on depth.

### Acknowledgments
- **Three.js**: The simulation utilizes Three.js for 3D rendering.
- **OpenAI ChatGPT 4.0**: Assisted in integrating and improving the simulation logic.

### Version History
- **Version 8**: Introduced wavelet modulation and initial 3D dynamics.
- **Version 9**: Added even distribution in 2D, flattened depth for visual balance, and introduced oscillatory movement for more dynamic behavior.
