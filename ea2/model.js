
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

async function train(model, inputs, labels) {

    console.dir(model)
    console.dir(inputs)
    console.dir(labels)

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

function test(model, inputData) {

    // Generate predictions for a uniform range of x values between -2 and 2;
    const [xs, preds] = tf.tidy(() => {

        const XsToPredictFor = tf.linspace(-2, 2, 100);
        const predictedYs = model.predict(XsToPredictFor.reshape([100, 1]));

        return [XsToPredictFor.dataSync(), predictedYs.dataSync()];
    });

    // Make an array from the input x's and predicted y's
    const predictedPoints = Array.from(xs).map((val, i) => {
        return { x: val, y: preds[i] }
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

    return predictedPoints;
}