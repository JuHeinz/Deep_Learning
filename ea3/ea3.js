
const inputArea = document.querySelector('#input');

inputArea.addEventListener("input", checkInput)

let lastWordCount = 0;

function checkInput() {
    const value = inputArea.value;
    // Split by spaces, filter out empty strings
    const words = value.trim().split(/\s+/).filter(Boolean);
    console.log(words)
    if (words.length > lastWordCount) {
        process(words[words.length - 1]); // Pass the new word to process
    }
    lastWordCount = words.length;
}


function process(newWord) {

}