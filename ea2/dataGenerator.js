// Create 100 random x values and their corresponding y values from function y(x) = 0.5*(x+0.8)*(x+1.8)*(x-0.2)*(x-0.3)*(x-1.9)+1
function createData() {
    const data = []
    for (let index = 0; index < 100; index++) {
        // Generates a random x value between -2 and 2
        let x = Math.random() * 4 - 2;
        // generate y values by feeding it into the function
        let y = 0.5 * (x + 0.8) * (x + 1.8) * (x - 0.2) * (x - 0.3) * (x - 1.9) + 1
        // add a new object with x and y values to the array
        data.push({ x: x, y: y })
    }

    return data;
}

// Split into training and test data (50/50)
function getNoiselessData(data) {
    let training = data.slice(0, 50);
    let test = data.slice(50);
    return [training, test]
}

// Split into training and test data and add noise to y values
function getNoisyData(data) {
    let training = data.slice(0, 50);
    let test = data.slice(50);

    // add noise to y values / labels
    let noisy_training = addGaussianNoise(training);
    let noisy_test = addGaussianNoise(test);

    return [noisy_training, noisy_test]
}

// Add noise to y values
function addGaussianNoise(data) {
    // Standard deviation is sqrt(variance)
    const stdDev = Math.sqrt(0.05);
    return data.map(point => {
        // Box-Muller transform for Gaussian noise
        const u = 1 - Math.random();
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        const noise = z * stdDev;
        return { x: point.x, y: point.y + noise };
    });
}