let classifier;

const imageFolder = "./image-input/";
const imageFiles = ["input-0.jpg", "input-1.jpg", "input-2.jpg"]

window.addEventListener("DOMContentLoaded", (event) => {
  classifier = ml5.imageClassifier("MobileNet");

  imageFiles.forEach((file, index) => {
    let img = drawImage(file, index);

    // Get canvas for image
    let canvasID = `chart-${index}`;
    let canvas = document.getElementById(canvasID);

    //get classification, then chart result
    classify(img).then((classification) => {
      chart(classification, canvas);
    }).catch((error) => {
      console.error("Error during classification:", error)
    })


  });
});


/* Draw the images to the DOM */
function drawImage(file, index) {
  let img = new Image(500, 500);
  img.src = imageFolder + file;
  img.className = "img-fluid rounded-start";

  //add image to DOM
  let holderID = `input-holder-${index}`;
  let holder = document.getElementById(holderID);
  holder.appendChild(img)
  return img;
}


/* Classify the image, returning the result */
function classify(img) {
  let result = classifier.classify(img, gotResult);
  return result;
}

//TODO: figure out callbacks
function gotResult(result) {
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
