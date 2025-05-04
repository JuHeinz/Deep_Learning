const btn = document.getElementById("upload-btn");
  btn.addEventListener("click", (e) => {
    startUserUpload()})

const uploadInput = document.querySelector("#upload-input");
const userOutput = document.querySelector('#user-output');
const dropzone = document.querySelector("#dropzone");


function startUserUpload() {
    let file = uploadInput.files[0]; // Get the uploaded file
   
    if (!file) {
      console.error("No file uploaded");
      return;
    }
  
    let reader = new FileReader();
  
    reader.onload = (event) => {
     processImage(event)
    };
  
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  
    reader.readAsDataURL(file); // Read the file as a data URL
}


function processImage(e){
    const card = new Card()
    userOutput.innerHTML = "";
    card.appendTo(userOutput)
    const img = card.addImage(e.target.result)

    // Classify the uploaded image
    classify(img).then((classification) => {
      let canvas = document.createElement("canvas");
      chart(classification, canvas);
      card.addCanvas(canvas);

    }).catch((error) => {
      console.error("Error during classification:", error)
    });
}