document.addEventListener('DOMContentLoaded', init);

//how many of the previous words should be considered for the prediction
let sequenceLength = 5

let data
let model;

async function init() {
    data = new TextData("training-data/emma_c1.txt", sequenceLength)
    await data.init()
    await loadOrTrainModel()
}

async function loadOrTrainModel() {
    try {
        const model = await tf.loadLayersModel('/Deep_Learning/ea3/my-model.json');
        // model = await tf.loadLayersModel('indexeddb://my-lstm-model');
        console.log('Model loaded');
    } catch (e) {
        console.log('No saved model found, training a new one...');
        await trainModel();
        await model.save('indexeddb://my-lstm-model');
        console.log("Model has been trained")
    }
}

async function trainModel() {

    model = createModel(data.vocabSize_, data.sequenceLength_);

    const x_input = tf.tensor2d(data.sequences_.map(s => s.input)); // An array of n = sequence_length words as indexes

    const y_label = tf.oneHot(data.sequences_.map(s => s.label), data.vocabSize_); //for each sequence, there is an array with n = vocabsize columns. the array is 1 for the index of the word that follows this sequence

    await model.fit(x_input,
        y_label, {
        epochs: 20,
        batchSize: 32,
        callbacks: tfvis.show.fitCallbacks(
            { name: 'Training Performance' },
            ['loss', 'categoricalCrossentropy'],
            { height: 200, callbacks: ['onEpochEnd'] }
        )
    });

    // await model.save('indexeddb://my-lstm-model');
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
    const predictions10 = Array.from(predictionsAll)
        .map((prob, idx) => ({ idx, prob }))
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 20);

    const suggestions = predictions10.map(({ idx, prob }) => ({
        word: data.reverseTokens_[idx],
        probability: (prob * 100).toFixed(2)
    }));


    return suggestions;
}

function evaluateAccuracy(sequences) {
    let correct = 0;
    let total = sequences.length;

    sequences.forEach(seq => {
        const wordsToPredictFor = tf.tensor2d([seq.input]);
        const result = model.predict(wordsToPredictFor);
        const predictionsAll = result.dataSync();
        const bestGuess = predictionsAll.indexOf(Math.max(...predictionsAll));
        if (bestGuess === seq.label) {

            correct++;
        } else {
            let actualSentence = "";
            seq.input.forEach(index => {
                actualSentence = actualSentence + data.reverseTokens_[index] + " "
            });
            console.log(actualSentence + "... ✅" + data.reverseTokens_[seq.label] + " ❌" + data.reverseTokens_[bestGuess])
        }
    });

    return (correct / total) * 100; // accuracy in percent
}

async function evaluate() {
    let testData = new TextData("training-data/emma_c2.txt", sequenceLength)
    await testData.init()
    const training_accuracy = evaluateAccuracy(data.sequences_);
    const test_accuracy = evaluateAccuracy(testData.sequences_);
    console.log("TRAINING")
    console.log(`Top-1 accuracy: ${training_accuracy.toFixed(2)}%`);

    console.log("TEST")
    console.log(`Top-1 accuracy: ${test_accuracy.toFixed(2)}%`);
}

