document.addEventListener('DOMContentLoaded', run);
const r2_canvas_training = document.getElementById("noiseless-training");
const r2_canvas_test = document.getElementById("noiseless-test");
const r2_mse_training_span = document.getElementById("r2-mse-training");
const r2_mse_test_span = document.getElementById("r2-mse-test");

function run() {
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

    plotGeneratedData(noiselessData, noiseless_canvas)
    plotGeneratedData(noisyData, noisy_canvas)

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

    //Make predictions on model (would usually not be done on training data)
    const predOnTraining = predict(model, noiselessTrainingData);
    const predOnTest = predict(model, noiselessTestData);

    //Plot predictions on document
    plotPrediction(predOnTraining, noiselessTrainingData, r2_canvas_training)
    r2_mse_training_span.innerHTML = (predOnTraining.mse).toFixed(3)
    plotPrediction(predOnTest, noiselessTestData, r2_canvas_test)
    r2_mse_test_span.innerHTML = (predOnTest.mse).toFixed(3)

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