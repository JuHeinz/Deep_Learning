const noiseless_canvas = document.getElementById("data-without-noise");
const noisy_canvas = document.getElementById("data-with-noise");

function run() {
    let data = createData();
    plotData(data, noiseless_canvas)
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
        data.push({ x: x, y: y })
    }

    console.dir(data)
    return data;
}

function splitAndPrepareData() {
    // split into training and test data (50/50)
    let noiseless_training = new Map();
    let noiseless_test = new Map();
    let noisy_training = new Map();
    let noisy_test = new Map();
    // add noise to y data / labels

}

function plotData(data, canvas) {
    // Sort data by x for a proper line chart
    const sortedData = data.slice().sort((a, b) => a.x - b.x);
    const xValues = sortedData.map(point => point.x);
    const yValues = sortedData.map(point => point.y);

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'y(x)',
                data: yValues,
                borderColor: '#2b7abf',
                backgroundColor: 'rgba(43, 122, 191, 0.2)',
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
