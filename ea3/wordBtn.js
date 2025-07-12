class WordBtn {
    constructor(word, probability) {
        this.probability = probability;
        this.word = word;
        this.btnElement = this.createBtn();
    }

    createBtn() {
        //styling
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-light word-btn";

        //word
        const wordSpan = document.createElement("span");
        wordSpan.innerText = this.word + " "

        //probability
        const probSpan = document.createElement("span");
        probSpan.innerText = "(" + this.probability + "%" + ")"

        btn.append(wordSpan, probSpan)
        btn.addEventListener("click", () => this.addToText(true))
        return btn;
    }

    addToText(isFromUser) {
        //add word to text area
        inputArea.value = currentText + " " + this.word;

        if (isFromUser) {
            //delete all buttons if directly clicked by user
            resetSuggestions()
        }
    }



}