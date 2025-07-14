document.addEventListener('DOMContentLoaded', init);

//how many of the previous words should be considered for the prediction
let sequenceLength = 5

let data
let model;

async function init() {
    data = new TextData("training-data/emma.txt", sequenceLength)
    await data.init()
    loadOrTrainModel()
}

async function loadOrTrainModel() {
    try {
        model = await tf.loadLayersModel('indexeddb://my-lstm-model');
        console.log('Model loaded from IndexedDB');
    } catch (e) {
        console.log('No saved model found, training a new one...');
        await trainModel();
        await model.save('indexeddb://my-lstm-model');
        console.log("Model has been trained")
    }
}

async function trainModel() {

    model = createModel(data.vocabSize_, data.sequenceLength_);

    const x_input = tf.tensor2d(data.trainingSequences_.map(s => s.input)); // An array of n = sequence_length words as indexes

    const y_label = tf.oneHot(data.trainingSequences_.map(s => s.label), data.vocabSize_); //for each sequence, there is an array with n = vocabsize columns. the array is 1 for the index of the word that follows this sequence

    x_input.print()
    y_label.print()

    await model.fit(x_input,
        y_label, {
        epochs: 50,
        batchSize: 32,
        callbacks: tfvis.show.fitCallbacks(
            { name: 'Training Performance' },
            ['loss', 'categoricalCrossentropy'],
            { height: 200, callbacks: ['onEpochEnd'] }
        )
    });

    await model.save('indexeddb://my-lstm-model');

}

/**
 * Define and compile a sequential model with LSTM 

 */
function createModel() {
    const model = tf.sequential();

    const inputLayer = tf.layers.embedding({ inputDim: data.vocabSize_, outputDim: 50, inputLength: data.sequenceLength_ });
    model.add(inputLayer);
    model.add(tf.layers.lstm({ units: 100, returnSequences: false }));
    model.add(tf.layers.dense({ units: data.vocabSize_, activation: 'softmax' }));

    model.compile({
        loss: 'categoricalCrossentropy',
        optimizer: 'adam',
        metrics: ['accuracy'],
    });


    model.summary()
    return model;
}


function predictNextWord(currentText) {
    // turn currentText into array of strings and clean
    const currentTextAsArray = currentText.toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(/\s+/)
        .filter(Boolean);

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
        .slice(0, 10);

    const suggestions = predictions10.map(({ idx, prob }) => ({
        word: data.reverseTokens_[idx],
        probability: (prob * 100).toFixed(2)
    }));


    return suggestions;
}