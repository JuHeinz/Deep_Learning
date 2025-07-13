function createModel() {
    const model = tf.sequential();
    model.add(tf.layers.embedding({ inputDim: vocabSize, outputDim: 50, inputLength: sequenceLength }));
    model.add(tf.layers.lstm({ units: 100, returnSequences: false }));
    model.add(tf.layers.dense({ units: vocabSize, activation: 'softmax' }));

    model.compile({
        loss: 'categoricalCrossentropy',
        optimizer: 'adam',
        metrics: ['accuracy'],
    });

}


async function trainModel() {
    let data = new TextData("short.txt")

    const x_input = tf.tensor2d(data.trainingSequences_.map(s => s.input));
    const y_label = tf.oneHot(data.trainingSequences_.map(s => s.label), data.vocabSize_);

    await model.fit(x_input, y_label, {
        epochs: 50,
        batchSize: 128,
        callbacks: {
            onEpochEnd: (epoch, logs) => console.log(`Epoch ${epoch}: loss = ${logs.loss}`),
        },
    });
}

function predictNextWord(inputWords) {
    const inputSeq = inputWords.map(w => tokenizer[w] || 0);
    const padded = tf.tensor2d([inputSeq.slice(-sequenceLength)]);
    const prediction = model.predict(padded);
    const predictedIndex = prediction.argMax(-1).dataSync()[0];
    return indexWord[predictedIndex];
}