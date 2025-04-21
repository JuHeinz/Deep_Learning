let classifier;
const canvas1 = document.getElementById('chart1');


window.addEventListener("DOMContentLoaded", (event) => {
  classifier = ml5.imageClassifier("MobileNet");
  console.log("setup")
  classifier.classify(img, gotResult)
});

let img = new Image(100, 100);
img.src = "../images/placeholder.jpg"


function gotResult(results) {
  console.log(results);
  chart(results)
}

function chart(results) {


  new Chart(canvas1, {

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
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}