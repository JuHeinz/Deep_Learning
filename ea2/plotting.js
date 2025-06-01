const noiseless_canvas = document.getElementById("data-without-noise");
const noisy_canvas = document.getElementById("data-with-noise");

const scaleOptions = {
    scales: {
        x: {
            type: 'linear',
            position: 'center',
            title: {
                display: true,
                text: 'x'
            }
        },
        y: {
            title: {
                display: true,
                text: 'y(x)'
            }
        }
    }
}

// Scatterplot where test and training data are both plotted in the same graph
function plotTestAndTraining(data, canvas) {

    let training = data[0];
    let test = data[1];

    //Sort data from smallest to biggest x value
    const sortedTraining = training.slice().sort((a, b) => a.x - b.x);
    const sortedTest = test.slice().sort((a, b) => a.x - b.x);

    //Plot data
    new Chart(canvas, {
        type: 'scatter',

        data: {
            datasets: [{
                label: 'Training',
                data: sortedTraining,
                borderColor: '#2b7abf',
                backgroundColor: 'rgb(43, 122, 191)',

            },
            {
                label: 'Test',
                data: sortedTest,
                borderColor: 'rgb(191, 43, 68)',
                backgroundColor: 'rgb(191, 43, 68)',

            }]

        },
        options: scaleOptions
    });
}