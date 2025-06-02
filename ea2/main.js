document.addEventListener('DOMContentLoaded', run);



function run() {
    const data = createData(100);
    let noiselessData = getNoiselessData(data);
    let noisyData = getNoisyData(data);

    //let noiselessData = [static_noiseless_train, static_noiseless_test]
    //let noisyData = [static_noisy_train, static_noisy_test]

    //R1
    showGeneratedData(noiselessData, noisyData)

    //Create the model
    const model = createModel();
    tfvis.show.modelSummary({ name: 'Model Summary' }, model);


    //R2: Vorhersage des Modells, das ohne Rauschen trainiert wurde y_unverrauscht(x), links auf den Trainingsdaten, rechts auf den Testdaten (beide ohne Rauschen).
    runModel(model, noiselessData, 28, r2_canvas_training, r2_canvas_test, r2_mse_training_span, r2_mse_test_span)

    //R3: Die Vorhersage Ihres besten Modells y_best(x) trainiert auf den verrauschten Daten, links auf den Trainingsdaten, rechts auf den Testdaten (alles mit Rauschen).
    runModel(model, noisyData, 28, r3_canvas_training, r3_canvas_test, r3_mse_training_span, r3_mse_test_span)

    //R4: Die Vorhersage Ihres Overfit-Modells y_overfit(x) trainiert auf den verrauschten Daten, links auf den Trainingsdaten, rechts auf den Testdaten (alles mit Rauschen).
    runModel(model, noisyData, 40, r4_canvas_training, r4_canvas_test, r4_mse_training_span, r4_mse_test_span)

}

//R1:  Darstellung der Datensätze: links ohne Rauschen, rechts mit Rauschen, Trainingsdaten und Testdaten farblich unterschieden jeweils zusammen in einem Diagramm.
function showGeneratedData(noiselessData, noisyData) {
    tfvis.render.scatterplot({ name: 'Noiseless Data', tab: 'Charts' }, { values: [noiselessData[0], noiselessData[1]], series: ['Test', 'Training'] });
    tfvis.render.scatterplot({ name: 'Noisy Data', tab: 'Charts' }, { values: [noisyData[0], noisyData[1]], series: ['Test', 'Training'] });

    plotGeneratedData(noiselessData, r1_canvas_noiseless)
    plotGeneratedData(noisyData, r1_canvas_noisy)

}


async function runModel(model, data, epochs, canvas_train, canvas_test, span_train, span_test) {
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
    const predOnTraining = predict(model, trainingData);
    const predOnTest = predict(model, testData);

    //Plot predictions on document
    plotPrediction(predOnTraining, trainingData, canvas_train, 'training')
    span_train.innerHTML = (predOnTraining.mse).toFixed(3)
    plotPrediction(predOnTest, testData, canvas_test, 'test')
    span_test.innerHTML = (predOnTest.mse).toFixed(3)

}


