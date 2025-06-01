const noiseless_canvas = document.getElementById("data-without-noise");
const noisy_canvas = document.getElementById("data-with-noise");

function run() {
    let data = createData();
    let noiselessData = getNoiselessData(data);
    let noisyData = getNoisyData(data);

    plotData(noiselessData, noiseless_canvas)
    plotData(noisyData, noisy_canvas)
}


// Create 100 pairs of Data From function y(x) = 0.5*(x+0.8)*(x+1.8)*(x-0.2)*(x-0.3)*(x-1.9)+1
function createData() {
    const data = []
    for (let index = 0; index < 100; index++) {
        // TODO: Werte müssen gleich verteilt sein
        // generate random x value between -2 and 2 (make sure no values are double)
        // Generates a random number between -2 and 2
        let x = Math.random() * 4 - 2;
        // generate y values by feeding it into the function
        let y = 0.5 * (x + 0.8) * (x + 1.8) * (x - 0.2) * (x - 0.3) * (x - 1.9) + 1
        // add a new object with x and y values to the array
        data.push({ x: x, y: y })
    }

    return data;
}

function getNoiselessData(data) {
    // split into training and test data (50/50)
    let training = data.slice(0, 50);
    let test = data.slice(50);
    return [training, test]
}

function getNoisyData(data) {
    let training = data.slice(0, 50);
    let test = data.slice(50);

    // add noise to y data / labels
    let noisy_training = addGaussianNoise(training);
    let noisy_test = addGaussianNoise(test);

    return [noisy_training, noisy_test]
}

function addGaussianNoise(data) {
    // Standard deviation is sqrt(variance)
    const stdDev = Math.sqrt(0.05);
    return data.map(point => {
        // Box-Muller transform for Gaussian noise
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const noise = z0 * stdDev;
        return { x: point.x, y: point.y + noise };
    });
}

function plotData(data, canvas) {
    // Sort data by x for a proper line chart
    let training = data[0];
    let test = data[1];


    const sortedTraining = training.slice().sort((a, b) => a.x - b.x);
    const xTraining = sortedTraining.map(point => point.x);
    const yTraining = sortedTraining.map(point => point.y);

    const sortedTest = test.slice().sort((a, b) => a.x - b.x);
    const xTest = sortedTest.map(point => point.x);
    const yTest = sortedTest.map(point => point.y);


    new Chart(canvas, {
        type: 'line',

        data: {
            labels: xTraining,
            datasets: [{
                label: 'Training',
                data: yTraining,
                borderColor: '#2b7abf',
                backgroundColor: 'rgb(43, 122, 191)',
                fill: false,
                tension: 0.1,
                pointRadius: 0
            },
            {
                label: 'Test',
                data: yTest,
                borderColor: 'rgb(191, 43, 68)',
                backgroundColor: 'rgb(191, 43, 68)',
                fill: false,
                tension: 0.1,
                pointRadius: 0
            }]

        },
        options: {
            scales: {
                x: {

                    title: {
                        display: true,
                        text: 'x'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'y'
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', run);
