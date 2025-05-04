
const fileDialogue = document.querySelector("#dialogue-input");
const userOutput = document.querySelector('#user-output');
const dropzone = document.querySelector("#dropzone");


//Event listener for File Dialogue
fileDialogue.addEventListener("change", (event) => {
    startUserUpload(event.target.files[0]);
})


//Event listeners for Drag and Drop
dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("dragover");

    const file = event.dataTransfer.files[0];
    if (file) {
        startUserUpload(file);
    }

});

// Click on dropzone opens upload dialogue 
dropzone.addEventListener("click", () => {
    fileDialogue.click();
});

//Reading file and checking if its valid
function startUserUpload(file) {

    if (!file) {
        console.error("No file uploaded");
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
    }

    let reader = new FileReader();

    reader.onload = (event) => {
        processImage(event)
    };

    reader.onerror = (error) => {
        console.error("Error reading file:", error);
    };

    reader.readAsDataURL(file); // Reader reads image
}

// Add image to page and trigger classification
function processImage(e) {

    //Add image to page
    const card = new Card()
    userOutput.innerHTML = "";
    card.appendTo(userOutput)
    const img = card.addImage(e.target.result)

    // Classify the uploaded image
    classify(img).then((classification) => {
        let canvas = document.createElement("canvas");
        card.addCanvas(canvas);
        chart(classification, canvas);
        card.addLabel(classification[0].label, classification[0].confidence)

    }).catch((error) => {
        console.error("Error during classification:", error)
    });
}