document.addEventListener('DOMContentLoaded', run);



function run() {

    // Create data on every run
    /* const data = createData(100);
    let noiselessData = getNoiselessData(data);
    let noisyData = getNoisyData(data);
    */

    // Use pre-created data
    let noiselessData = [static_noiseless_train, static_noiseless_test]
    let noisyData = [static_noisy_train, static_noisy_test]

    //R1
    showGeneratedData(noiselessData, noisyData)

    //Create the model
    const model = createModel();
    tfvis.show.modelSummary({ name: 'Model Summary' }, model);

    let r3_epochs = 200;
    let r4_epochs = 400;

    //R2: Vorhersage des Modells, das ohne Rauschen trainiert wurde y_unverrauscht(x), links auf den Trainingsdaten, rechts auf den Testdaten (beide ohne Rauschen).
    runModel(model, noiselessData, r3_epochs, r2_canvas_training, r2_canvas_test, r2_mse_training_span, r2_mse_test_span, false)
    //R3: Die Vorhersage Ihres besten Modells y_best(x) trainiert auf den verrauschten Daten, links auf den Trainingsdaten, rechts auf den Testdaten (alles mit Rauschen).
    runModel(model, noisyData, r3_epochs, r3_canvas_training, r3_canvas_test, r3_mse_training_span, r3_mse_test_span, true)
    //R4: Die Vorhersage Ihres Overfit-Modells y_overfit(x) trainiert auf den verrauschten Daten, links auf den Trainingsdaten, rechts auf den Testdaten (alles mit Rauschen).
    runModel(model, noisyData, r4_epochs, r4_canvas_training, r4_canvas_test, r4_mse_training_span, r4_mse_test_span, true)
}


//R1:  Darstellung der Datensätze: links ohne Rauschen, rechts mit Rauschen, Trainingsdaten und Testdaten farblich unterschieden jeweils zusammen in einem Diagramm.
function showGeneratedData(noiselessData, noisyData) {
    //Darstellung im Tensor Flow Visor
    //tfvis.render.scatterplot({ name: 'Noiseless Data', tab: 'Charts' }, { values: [noiselessData[0], noiselessData[1]], series: ['Test', 'Training'] });
    //tfvis.render.scatterplot({ name: 'Noisy Data', tab: 'Charts' }, { values: [noisyData[0], noisyData[1]], series: ['Test', 'Training'] });

    //Darstellung  mit Chart.js
    plotGeneratedData(noiselessData, r1_canvas_noiseless)
    plotGeneratedData(noisyData, r1_canvas_noisy)

}


async function runModel(model, data, epochs, canvas_train, canvas_test, span_train, span_test, isLog) {
    let trainingData = data[0]
    let testData = data[1]

    //Convert data to tensors
    const tensorTrainingData = toTensor(trainingData);
    const trainingInputs = tensorTrainingData.inputTensor;
    const trainingLabels = tensorTrainingData.labelTensor;

    // Train the model
    await train(model, trainingInputs, trainingLabels, epochs);
    console.log('Done Training');

    //Make predictions on model (would usually not be done on training data)
    const predOnTraining = await predict(model, trainingData);
    const predOnTest = await predict(model, testData);

    if (isLog) {
        console.log(predOnTraining.mse + ',' + predOnTest.mse + ',' + epochs)
    }

    //Plot predictions on document
    plotPrediction(predOnTraining, trainingData, canvas_train, 'training')
    span_train.innerHTML = (predOnTraining.mse).toFixed(3)
    plotPrediction(predOnTest, testData, canvas_test, 'test')
    span_test.innerHTML = (predOnTest.mse).toFixed(3)

}


