// utilities.js

// ElementDynamics class for handling dynamic behavior of swarm elements
window.ElementDynamics = class {
    constructor(mass, naturalPeriod, dampingRatio) {
        this.mass = mass;
        this.naturalPeriod = naturalPeriod;
        this.dampingRatio = dampingRatio;
        this.position = { x: 0, y: 0, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
    }

    update(targetPosition, targetVelocity, timeStep) {
        const naturalFrequency = 1 / this.naturalPeriod;
        const omega_n = 2 * Math.PI * naturalFrequency;
        const stiffness = omega_n * omega_n * this.mass;
        const damping = 2 * this.dampingRatio * omega_n * this.mass;

        const forceX = -stiffness * (this.position.x - targetPosition.x) - damping * (this.velocity.x - targetVelocity.x);
        const forceY = -stiffness * (this.position.y - targetPosition.y) - damping * (this.velocity.y - targetVelocity.y);
        const forceZ = -stiffness * (this.position.z - targetPosition.z) - damping * (this.velocity.z - targetVelocity.z);

        const deltaVX = (forceX / this.mass) * timeStep;
        const deltaVY = (forceY / this.mass) * timeStep;
        const deltaVZ = (forceZ / this.mass) * timeStep;

        this.velocity.x += deltaVX;
        this.velocity.y += deltaVY;
        this.velocity.z += deltaVZ;

        this.position.x += this.velocity.x * timeStep;
        this.position.y += this.velocity.y * timeStep;
        this.position.z += this.velocity.z * timeStep;
    }
};

// Utility function to generate random variance: +/- variance/2
window.getRandomVariance = function(value, variance) {
    return value + (Math.random() * variance) - (variance / 2);
};

// Utility function to generate random color variations
window.getRandomColor = function(baseColor, variance) {
    const color = new THREE.Color(baseColor);
    return new THREE.Color(
        Math.min(Math.max(color.r + (Math.random() * variance) - (variance / 2), 0), 1),
        Math.min(Math.max(color.g + (Math.random() * variance) - (variance / 2), 0), 1),
        Math.min(Math.max(color.b + (Math.random() * variance) - (variance / 2), 0), 1)
    );
};

// Linear interpolation between two points
window.interpolate = function (value1, value2, fraction) {
    return value1 + (value2 - value1) * fraction;
};

// Funcation Generates an array of target indices based on the center, range, and spread factor
window.generateFollowedIndices = function(numTargets, targetIndexRange, spreadFactor = 2) {
    const followedIndices = [];
    const centerIndex = Math.floor(numTargets / 2);

    for (let i = -Math.floor(targetIndexRange / 2); i <= Math.floor(targetIndexRange / 2); i++) {
        const targetIndex = centerIndex + i * spreadFactor;
        if (targetIndex >= 0 && targetIndex < numTargets) {
            followedIndices.push(targetIndex);
        }
    }

    return followedIndices;
};


// Utility function to generate radnomized wavelets to overlapping waveforms waveletX Y Z
window.generateWavelet = function(baseLength, baseFrequency, freqVariation, baseTau, tauVariation, numWavelets, overlapPercent = 30) {
    const overlapFactor = 1 - (overlapPercent / 100); // Calculate the overlap factor based on the percentage
    const overlapLength = Math.floor(baseLength * overlapFactor); // Length of the overlap
    const totalLength = baseLength + (numWavelets - 1) * overlapLength; // Total length considering overlap

    let waveletX = new Array(totalLength).fill(0);
    let waveletY = new Array(totalLength).fill(0);
    let waveletZ = new Array(totalLength).fill(0);

    for (let i = 0; i < numWavelets; i++) {
        // Separate randomization for X, Y, and Z
        const tauX = baseTau + (Math.random() - 0.5) * tauVariation;
        const frequencyX = baseFrequency + (Math.random() - 0.5) * freqVariation;

        const tauY = baseTau + (Math.random() - 0.5) * tauVariation;
        const frequencyY = baseFrequency + (Math.random() - 0.5) * freqVariation;

        const tauZ = baseTau + (Math.random() - 0.5) * tauVariation;
        const frequencyZ = baseFrequency + (Math.random() - 0.5) * freqVariation;

        const startOffset = i * overlapLength; // Calculate the start offset based on the overlap

        for (let j = 0; j < baseLength; j++) {
            const time = j / baseLength;
            const sinWeight = Math.sin(Math.PI * time) ** 2;  // sin^2 window for half sine over baseLength

            // Generate wavelet values for X, Y, and Z independently and add them sequentially
            waveletX[startOffset + j] += Math.sin(2 * Math.PI * frequencyX * time) * Math.exp(-tauX * time) * sinWeight;
            waveletY[startOffset + j] += Math.sin(2 * Math.PI * frequencyY * time) * Math.exp(-tauY * time) * sinWeight;
            waveletZ[startOffset + j] += Math.sin(2 * Math.PI * frequencyZ * time) * Math.exp(-tauZ * time) * sinWeight;
        }
    }
    return { waveletX, waveletY, waveletZ };
};

// function to initilaise swarm shape, static target positions
window.generateSwarmElemPositions = function(numElements) {
    const positions = [];
    
    // Define the size of the grid and the flattening factor for z
    const gridSize = Math.ceil(Math.sqrt(numElements)); // Number of elements per row/column for a grid-like arrangement
    const spacing = 0.5; // Spacing between elements in the x and y directions
    const flattenZ = 1.9; // Factor to flatten the z position

    for (let i = 0; i < numElements; i++) {
        // Calculate grid position (x, y)
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        // Set x and y positions for even spacing
        const x = (col - gridSize / 2) * spacing; // Centering the grid around (0, 0)
        const y = (row - gridSize / 2) * spacing;

        // Set z position with minimal variation for a "flat" 3D effect
        const z = (Math.random() - 0.5) * flattenZ; // Small random variation to avoid perfectly flat appearance

        positions.push({ x, y, z });
    }
    return positions;
};

// Function to initialize swarm elements
window.initializeSwarmElements = function(numElements, boxSize) {
    const swarmElements = [];
    for (let i = 0; i < numElements; i++) {
        const dynamics = new window.ElementDynamics(
            window.getRandomVariance(1.5, 0.5),
            window.getRandomVariance(4.0, 2.9),
            window.getRandomVariance(0.2, 0.15)
        );
        dynamics.position = {
            x: Math.random() * boxSize - boxSize / 2,
            y: Math.random() * boxSize - boxSize / 2,
            z: Math.random() * boxSize - boxSize / 2,
        };
        swarmElements.push(dynamics);
    }
    return swarmElements;
};

// Function to initialize target elements with velocity calculation
window.initializeTargetElementsWithOffsets = function(numElements, targetSwarmLocations) {
    const initializedTargets = [];
    console.log(Array.isArray(initializedTargets)); // Tämä tulostaa `true`, jos initializedTargets on taulukko

    let previousPositions = Array(numElements).fill({ x: 0, y: 0, z: 0 });

    for (let i = 0; i < numElements; i++) {
        const offset = targetSwarmLocations[i] || { x: 0, y: 0, z: 0 }; // Default offset if none provided
        const targetDynamics = {
            position: {
                x: offset.x,
                y: offset.y,
                z: offset.z,
            },
            velocity: {
                x: 0,
                y: 0,
                z: 0,
            },
            updateVelocity: function(timeStep) {
                this.velocity.x = (this.position.x - previousPositions[i].x) / timeStep;
                this.velocity.y = (this.position.y - previousPositions[i].y) / timeStep;
                this.velocity.z = (this.position.z - previousPositions[i].z) / timeStep;
                previousPositions[i] = { ...this.position };
            }
        };
        initializedTargets.push(targetDynamics);
    }
    // Debug: Ensure the target elements array is populated before returning
    console.log("Target Elements Initialized:", targetElements);

    return initializedTargets; // Ensure the targetElements array is returned
};

// ///////////////////////////////////////////////      
// optional function to modulate swarm targets sinusoidally

window.modulateTargetBasePositions = function(targetBasePositions) {
    const frequency = 0.2; // Frequency of oscillation
    const amplitude = 0.005; // Amplitude of oscillation
    let oscillationTime = 0; // Time variable to control oscillation

    // Increment time variable
    oscillationTime += 0.2;

    targetBasePositions.forEach((basePos, index) => {
        // Apply a small oscillation based on sine wave
        basePos.x += amplitude * Math.sin(frequency * oscillationTime + index);
        basePos.y += amplitude * Math.sin(frequency * oscillationTime + index); // Phase shift for variety
        basePos.z += 0.2 * amplitude * Math.sin(frequency * oscillationTime + index); // Another phase shift
    });
};

