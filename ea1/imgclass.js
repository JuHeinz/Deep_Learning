let classifier;

const imageFolder = "./image-input/";
const imageFiles = ["input-0.jpg", "input-1.jpg", "input-2.jpg", "input-3.jpg", "input-4.jpg", "input-5.jpg"]

const btn = document.getElementById("upload-btn");
  btn.addEventListener("click", (e) => {
    startUserUpload()})

const upload = document.getElementById("upload-input");

window.addEventListener("DOMContentLoaded", (event) => {
  classifier = ml5.imageClassifier("MobileNet");

  imageFiles.forEach((file, index) => {
    let img = drawImage(imageFolder + file, index);

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
  img.src = file;
  img.className = "img-fluid rounded-start";

  //add image to DOM
  let holderID = `input-holder-${index}`;
  let holder = document.getElementById(holderID);
  holder.innerHTML = "";
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

function startUserUpload() {
  let file = upload.files[0]; // Get the uploaded file
 
  if (!file) {
    console.error("No file uploaded");
    return;
  }

  let reader = new FileReader();

  reader.onload = function (event) {
    let img = null;
    let canvas = null;
    img = drawImage(event.target.result, "user")
    canvas = document.getElementById("chart-user");

    // Classify the uploaded image
    classify(img).then((classification) => {
      chart(classification, canvas);
    }).catch((error) => {
      console.error("Error during classification:", error)
    });
  };

  reader.onerror = function (error) {
    console.error("Error reading file:", error);
  };

  reader.readAsDataURL(file); // Read the file as a data URL
}