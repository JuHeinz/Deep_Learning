
const imageFolder = "./image-input/";
const correctImages = ["input-0.jpg", "input-1.jpg", "input-2.jpg",]
const incorrectImages = ["input-3.jpg", "input-4.jpg", "input-5.jpg"]
const classifier = ml5.imageClassifier("MobileNet");


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
    chart(classification, canvas);
    card.addCanvas(canvas);

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

  new Chart(canvas, {

    type: 'bar',
    data: {
      labels: [results[0].label, results[1].label, results[2].label],
      datasets: [{
        label: '% confidence',
        data: [results[0].confidence, results[1].confidence, results[2].confidence],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}



