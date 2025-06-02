
Chart.defaults.color = 'rgb(255, 255, 255)';

const test_color = 'rgb(35, 229, 200)';
const training_color = 'rgb(43, 122, 191)';
const prediction_color = 'rgb(246, 194, 21)'

const r1_canvas_noiseless = document.getElementById("r1_canvas_noiseless");
const r1_canvas_noisy = document.getElementById("r1_canvas_noisy");

const r2_canvas_training = document.getElementById("r2_canvas_training");
const r2_canvas_test = document.getElementById("r2_canvas_test");
const r2_mse_training_span = document.getElementById("r2-mse-training");
const r2_mse_test_span = document.getElementById("r2-mse-test");

const r3_canvas_training = document.getElementById("r3_canvas_training");
const r3_canvas_test = document.getElementById("r3_canvas_test");
const r3_mse_training_span = document.getElementById("r3_mse_training_span");
const r3_mse_test_span = document.getElementById("r3_mse_test_span");

const r4_canvas_training = document.getElementById("r4_canvas_training");
const r4_canvas_test = document.getElementById("r4_canvas_test");
const r4_mse_training_span = document.getElementById("r4_mse_training_span");
const r4_mse_test_span = document.getElementById("r4_mse_test_span");

const scaleOptions = {
    scales: {
        x: {
            type: 'linear',
            position: 'center',
            title: {
                display: true,
                text: 'x'
            },
            min: -2,
            max: 2
        },
        y: {
            title: {
                display: true,
                text: 'y(x)'
            },
            min: -2.5,
            max: 2.5
        }
    }

}

// Scatterplot where test and training data are both plotted in the same graph
function plotGeneratedData(data, canvas) {

    let training = data[0];
    let test = data[1];

    //Plot data
    new Chart(canvas, {

        type: 'scatter',

        data: {
            datasets: [{
                label: 'Training',
                data: training,
                backgroundColor: training_color,

            },
            {
                label: 'Test',
                data: test,
                backgroundColor: test_color,

            }]

        },
        options: scaleOptions
    });
}


// Plot the prediction vs the input data that the prediction was made on
function plotPrediction(prediction, inputData, canvas, dataName) {

    if (dataName == 'test') {
        inputColor = test_color
        label = 'Test Data'
    } else {
        inputColor = training_color
        label = 'Training Data'

    }

    new Chart(canvas, {
        type: 'scatter',

        data: {
            datasets: [{
                label: label,
                data: inputData,
                backgroundColor: inputColor,

            },
            {
                label: 'Prediction',
                data: prediction.prediction,
                backgroundColor: prediction_color,

            }]

        },
        options: scaleOptions
    });
}