document.addEventListener('DOMContentLoaded', init);

//how many of the previous words should be considered for the prediction
let sequenceLength = 2

let data
let model;

async function init() {
    data = new TextData("training-data/emma_vol1_c123.txt", sequenceLength)
    await data.init()
    await loadOrTrainModel()
}

async function loadOrTrainModel() {
    try {
        //path while deployed
        model = await tf.loadLayersModel('/Deep_Learning/ea3/model-seq2/my-model.json');
        console.log('Model loaded (deployed)');
    } catch (e) {
        try {
            //path while local
            model = await tf.loadLayersModel('/ea3/model-seq2/my-model.json');
            console.log('Model loaded (local)');
        } catch (e) {
            console.log('No saved model found, training a new one...');
            await trainModel();
            console.log("Model has been trained")
        }

    }
}

async function trainModel() {

    model = createModel(data.vocabSize_, data.sequenceLength_);

    const x_input = tf.tensor2d(data.sequences_.map(s => s.input)); // An array of sequence_length words, stored as indexes

    const y_label = tf.oneHot(data.sequences_.map(s => s.label), data.vocabSize_); //for each sequence, there is an array with vocabsize columns. the array is 1 for the index of the word that follows this sequence

    await model.fit(x_input,
        y_label, {
        epochs: 30,
        batchSize: 32,
        callbacks: tfvis.show.fitCallbacks(
            { name: 'Training Performance' },
            ['loss', 'categoricalCrossentropy'],
            { height: 200, callbacks: ['onEpochEnd'] }
        )
    });

    await model.save('downloads://my-model');


}

/**
 * Define and compile a sequential model with LSTM 
 */
function createModel() {
    const model = tf.sequential();

    model.add(tf.layers.embedding({ inputDim: data.vocabSize_, outputDim: 50, inputLength: data.sequenceLength_ }));

    //first LSTM Layer
    // return the entire sequence so the next layer has full data to work with
    model.add(tf.layers.lstm({ units: 100, returnSequences: true }));

    //second LSTM Layer
    model.add(tf.layers.lstm({ units: 100, returnSequences: false }));

    //output layer has as many outputs/units as there are words in the vocabulary
    model.add(tf.layers.dense({ units: data.vocabSize_, activation: 'softmax' }));

    model.compile({
        loss: 'categoricalCrossentropy',
        optimizer: tf.train.adam(0.01),
        metrics: ['accuracy'],
    });


    model.summary()
    return model;
}

/**
 * Predict the next word from the current Text
 * @param {*} currentText what the user has currently entered in the text field
 * @returns the top 10 prediction results and their probabilities
 */
function predictNextWord(currentText) {
    // turn currentText into array of strings and clean
    const currentTextAsArray = makeWords(currentText)

    //The model needs an input of exactly n = sequenceLength.
    //so remove words from the currentText until it has the lenght of n
    let sizedArray = currentTextAsArray.slice(-sequenceLength);

    //or pad it with 0s until it has the lenght of n
    if (sizedArray.length < sequenceLength) {
        sizedArray = Array(sequenceLength - sizedArray.length).fill(0).concat(sizedArray);
    }

    // translate the current text into indexes according to the tokens. If the word is not found in the tokens, it gets index 0
    const currentTextAsIndex = sizedArray.map(w => data.tokens_[w] || 0);

    //create a tensor with 1 row and n columns as input for prediction
    const wordsToPredictFor = tf.tensor2d([currentTextAsIndex]);

    //start prediction
    const result = model.predict(wordsToPredictFor);
    const predictionsAll = result.dataSync()

    //get top 10 predictions
    const topPredictions = sortPredictions(predictionsAll, 10)

    const suggestions = topPredictions.map(({ idx, prob }) => ({
        word: data.reverseTokens_[idx],
        probability: (prob * 100).toFixed(2)
    }));


    return suggestions;
}

/**
 * Predict the next word for sequences from a test text. Evaluate how often the correct word is in the top n results
 */
function evaluateAccuracy(textdata, n) {

    let sequences = textdata.sequences_.slice(0, 100)
    let correct = 0;
    let total = sequences.length;

    sequences.forEach(seq => {
        const wordsToPredictFor = tf.tensor2d([seq.input]);
        const result = model.predict(wordsToPredictFor);
        const predictionsAll = result.dataSync()

        const topPredictions = sortPredictions(predictionsAll, n) // only return the top n predictions
        const topIndexes = topPredictions.map(p => p.idx)

        //check if the actual value is within the top predictions
        if (topIndexes.includes(seq.label)) {
            correct++;
        } else {
            /*
            let actualSentence = "";
            seq.input.forEach(index => {
                actualSentence = actualSentence + textdata.reverseTokens_[index] + " "
            });
            let bestPrediction = topIndexes[0]
            console.log(actualSentence + "... ✅" + textdata.reverseTokens_[seq.label] + " ❌" + textdata.reverseTokens_[bestPrediction])
            */
        }
    });

    return (correct / total) * 100; // accuracy in percent
}

async function evaluate() {
    let testData = new TextData("training-data/emma_vol2_c1.txt", sequenceLength)
    await testData.init()

    let considerTopNs = [1, 5, 10, 20, 100]
    console.log(" ==== ACCURACY ON TRAINING DATA ====")
    for (const n of considerTopNs) {
        console.log(`Top-${n}:`)
        const training_accuracy = evaluateAccuracy(data, n);
        console.log(training_accuracy.toFixed(0));
    }

    console.log(" ==== ACCURACY ON TEST DATA ====")
    for (const n of considerTopNs) {
        console.log(`Top-${n}:`)
        const test_accuracy = evaluateAccuracy(testData, n);
        console.log(test_accuracy.toFixed(0));
    }




}

/**
 * Sort predictions by probability and return the top n 
 */
function sortPredictions(unsortedPredictions, n) {
    return Array.from(unsortedPredictions)
        .map((prob, idx) => ({ idx, prob }))
        .sort((a, b) => b.prob - a.prob)
        .slice(0, n);
}