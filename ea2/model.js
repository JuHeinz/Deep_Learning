
function toTensor(data) {
    // Wrapping these calculations in a tidy will dispose any
    // intermediate tensors.

    return tf.tidy(() => {
        // Shuffle the data
        tf.util.shuffle(data);

        //Convert data to Tensor
        const inputs = data.map(d => d.x)
        const labels = data.map(d => d.y);

        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        return {
            inputTensor,
            labelTensor
        }
    });
}

// Train the model on the training data
async function train(model, inputs, labels) {

    // Prepare the model for training.
    model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    });

    const batchSize = 32;
    const epochs = 50;

    return await model.fit(inputs, labels, {
        batchSize,
        epochs,
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks(
            { name: 'Training Performance' },
            ['loss', 'mse'],
            { height: 200, callbacks: ['onEpochEnd'] }
        )
    });
}

// Create a prediction with the given model on the given data
function test(model, inputData) {

    const [input_X, predicted_y] = tf.tidy(() => {

        // makes X's into a 1D tensor
        const XAsArray = Array.from(inputData).map((d) => d.x);
        const XsToPredictFor = tf.tensor1d(XAsArray);

        const predictedYs = model.predict(XsToPredictFor);
        return [XsToPredictFor.dataSync(), predictedYs.dataSync()];
    });

    const trueY_AsArray = Array.from(inputData).map((d) => d.y);
    const true_Y = tf.tensor1d(trueY_AsArray);

    const predYAsTensor = tf.tensor1d(predicted_y)

    const mse = tf.losses.meanSquaredError(true_Y, predYAsTensor);

    // Make an array from the input x's and predicted y's
    const predictedPoints = Array.from(input_X).map((val, i) => {
        return { x: val, y: predicted_y[i] }
    });

    tfvis.render.scatterplot(
        { name: 'Model Predictions vs Original Data' },
        { values: [inputData, predictedPoints], series: ['original', 'predicted'] },
        {
            xLabel: 'x',
            yLabel: 'y(x)',
            height: 300
        }
    );


    return { prediction: predictedPoints, mse: mse.dataSync()[0] };
}