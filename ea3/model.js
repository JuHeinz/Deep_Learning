document.addEventListener('DOMContentLoaded', trainModel);


let tokens;
let sequenceLength = 5
let reverseTokens;
let model;

async function trainModel() {

    let data = new TextData("short.txt", sequenceLength)

    tokens = data.tokens_
    reverseTokens = data.reverseTokens_

    model = createModel(data.vocabSize_, sequenceLength);

    const x_input = tf.tensor2d(data.trainingSequences_.map(s => s.input)); // A sequence of 5 words, with the words replaced as indexes

    const y_label = tf.oneHot(data.trainingSequences_.map(s => s.label), data.vocabSize_); //for each sequence, there is an array with n = #words columns. the array is 1 for the index of the word that follows this sequence

    x_input.print()
    y_label.print()

    await model.fit(x_input,
        y_label, {
        epochs: 50,
        batchSize: 128,
        callbacks: {
            onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: loss = ${logs.loss}`),
        },
    });
}

/**
 * Define and compile a sequential model with LSTM 

 */
function createModel(vocabSize, sequenceLength) {
    const model = tf.sequential();

    const inputLayer = tf.layers.embedding({ inputDim: vocabSize, outputDim: 50, inputLength: sequenceLength });
    model.add(inputLayer);
    model.add(tf.layers.lstm({ units: 100, returnSequences: false }));
    model.add(tf.layers.dense({ units: vocabSize, activation: 'softmax' }));

    model.compile({
        loss: 'categoricalCrossentropy',
        optimizer: 'adam',
        metrics: ['accuracy'],
    });
    return model;
}


function predictNextWord(inputWords) {

    const inputSeq = inputWords.map(w => tokens[w] || 0);  // translate the input words into their indexes according to the tokens. If the word is not found in the tokens, it gets index 0
    const wordsToPredictFor = tf.tensor2d([inputSeq.slice(-sequenceLength)]); //get the last n (=sequenceLength) words, put it in a tensor with 1 row and n columns.
    const prediction = model.predict(wordsToPredictFor);
    const predictedIndex = prediction.argMax(-1).dataSync()[0];
    return reverseTokens[predictedIndex];
}