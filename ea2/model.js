
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

function createModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Input layer, always needs an inputshape, in this case one, because we are only providing one value (the x value)
    model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));

    // Hidden layer #1 with 100 neurons and relu activation function
    model.add(tf.layers.dense({ units: 100, activation: 'relu' }));

    // Hidden layer #2 with 100 neurons and relu activation function
    model.add(tf.layers.dense({ units: 100, activation: 'relu' }));

    // Output layer
    model.add(tf.layers.dense({ units: 1, useBias: true }));
    model.summary()

    return model;
}

// Train the model on the training data
async function train(model, inputs, labels, epochs) {

    // Prepare the model for training.
    model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    });

    const batchSize = 32;

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
function predict(model, input) {

    const input_X = Array.from(input).map((d) => d.x);
    const true_y = Array.from(input).map((d) => d.y);

    const predicted_y = tf.tidy(() => {
        const XsToPredictFor = tf.tensor1d(input_X); // make X's into a 1D tensor
        return model.predict(XsToPredictFor).dataSync();
    });

    //Calculate mean squared error
    const mse = tf.losses.meanSquaredError(tf.tensor1d(true_y), tf.tensor1d(predicted_y));

    // Make an array from the input x's and predicted y's
    const predictedPoints = Array.from(input_X).map((x, i) => {
        return { x: x, y: predicted_y[i] }
    });

    return { prediction: predictedPoints, mse: mse.dataSync()[0] };
}