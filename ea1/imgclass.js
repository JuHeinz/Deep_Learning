
const imageFolder = "./image-input/";
const correctImages = ["input-0.jpg", "input-1.jpg", "input-2.jpg",]
const incorrectImages = ["input-3.jpg", "input-4.jpg", "input-5.jpg"]
const classifier = ml5.imageClassifier("imagenet");


window.addEventListener("DOMContentLoaded", (event) => {

  correctImages.forEach((file) => {
    fromLocal(file, "right");
  });

  incorrectImages.forEach((file) => {
    fromLocal(file, "wrong");
  });
});



function fromLocal(file, isCorrect) {
  const card = new Card(isCorrect)
  card.appendTo(document.querySelector('#part-1'))
  const img = card.addImage(imageFolder + file)

  //get classification, then chart result
  classify(img).then((classification) => {
    let canvas = document.createElement("canvas");
    card.addCanvas(canvas);
    chart(classification, canvas);
    card.addLabel(classification[0].label, classification[0].confidence)

  }).catch((error) => {
    console.error("Error during classification:", error)
  })

}


/* Classify the image, returning the result */
function classify(img) {
  let result = classifier.classify(img, gotResult);
  return result;
}

//TODO: figure out callbacks
function gotResult(result) {
  console.log(result)
  return result;
}

//Chart the result
function chart(results, canvas) {
  Chart.defaults.color = '#e7edf3';

  new Chart(canvas, {

    type: 'bar',
    data: {
      labels: [results[0].label, results[1].label, results[2].label],
      datasets: [{
        data: [results[0].confidence * 100, results[1].confidence * 100, results[2].confidence * 100],
        backgroundColor: [
          '#2b7abf',
          '#0f477b',
          '#14283a',
        ],
        borderWidth: 0,
        clip: 1,

      }]
    },
    options: {

      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Confidence'
          },
          ticks: {
            callback: function (value, index, ticks) {
              return value + '%'
            },
           
          },
          grid: {
            color: '#ffffff50',
            drawOnChartArea: false,
          }
        }
      },
      responsive: true,
      plugins: {
        legend: {
          display: false,
        }
      }

    }
  });
}



