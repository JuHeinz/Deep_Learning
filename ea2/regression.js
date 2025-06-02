document.addEventListener('DOMContentLoaded', run);
const r2_canvas_training = document.getElementById("noiseless-training");
const r2_canvas_test = document.getElementById("noiseless-test");
const r2_mse_training_span = document.getElementById("r2-mse-training");
const r2_mse_test_span = document.getElementById("r2-mse-test");

async function run() {
    const data = createData();
    let noiselessData = getNoiselessData(data);
    let noisyData = getNoisyData(data);

    //R1
    showGeneratedData(noiselessData, noisyData)

    //R2
    predictOnNoiseless(noiselessData)

}

//R1:  Darstellung der Datensätze: links ohne Rauschen, rechts mit Rauschen, Trainingsdaten und Testdaten farblich unterschieden jeweils zusammen in einem Diagramm.
function showGeneratedData(noiselessData, noisyData) {
    tfvis.render.scatterplot({ name: 'Noiseless Data', tab: 'Charts' }, { values: [noiselessData[0], noiselessData[1]], series: ['Test', 'Training'] });
    tfvis.render.scatterplot({ name: 'Noisy Data', tab: 'Charts' }, { values: [noisyData[0], noisyData[1]], series: ['Test', 'Training'] });

    plotTestAndTraining(noiselessData, noiseless_canvas)
    plotTestAndTraining(noisyData, noisy_canvas)

}

//R2: Vorhersage des Modells, das ohne Rauschen trainiert wurde y_unverrauscht(x), links auf den Trainingsdaten, rechts auf den Testdaten (beide ohne Rauschen).
async function predictOnNoiseless(noiselessData) {

    let noiselessTestData = noiselessData[0]
    let noiselessTrainingData = noiselessData[1]

    //Create the model
    const model = createModel();
    tfvis.show.modelSummary({ name: 'Model Summary' }, model);

    //Convert data to tensors
    const tensorTrainingData = toTensor(noiselessTrainingData);
    const trainingInputs = tensorTrainingData.inputTensor;
    const trainingLabels = tensorTrainingData.labelTensor;


    // Train the model
    await train(model, trainingInputs, trainingLabels);
    console.log('Done Training');

    // Make some predictions using the model and compare them to the
    // original data
    const predOnTraining = test(model, noiselessTrainingData);
    const predOnTest = test(model, noiselessTestData);

    //Plot on document
    plotPrediction(predOnTraining, noiselessTrainingData, r2_canvas_training)
    r2_mse_training_span.innerHTML = predOnTraining.mse
    plotPrediction(predOnTest, noiselessTestData, r2_canvas_test)
    r2_mse_test_span.innerHTML = predOnTest.mse


}

// Create 100 pairs of Data From function y(x) = 0.5*(x+0.8)*(x+1.8)*(x-0.2)*(x-0.3)*(x-1.9)+1
function createData() {
    const data = []
    for (let index = 0; index < 100; index++) {
        // Generates a random  x Value between -2 and 2
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
        const u = 1 - Math.random();
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        const noise = z * stdDev;
        return { x: point.x, y: point.y + noise };
    });
}



function createModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single input layer
    model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));

    // introduce a non-linear activation function
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    // Add an output layer
    model.add(tf.layers.dense({ units: 1, useBias: true }));


    return model;
}