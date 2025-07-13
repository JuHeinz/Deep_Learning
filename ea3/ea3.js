

const inputArea = document.querySelector('#input');

const predictBtn = document.querySelector('#vorhersage');
const autoBtn = document.querySelector('#auto');
const resetBtn = document.querySelector('#reset');
const acceptBtn = document.querySelector('#weiter');
const suggestionHolder = document.querySelector('#suggestions');

disabledButtons(true);


inputArea.addEventListener("input", () => {
    disabledButtons(inputArea.value === "")
})


resetBtn.addEventListener("click", reset);

predictBtn.addEventListener("click", showSuggestions);
acceptBtn.addEventListener("click", acceptFirst);
autoBtn.addEventListener("click", auto);


let isAutoGenerating = false;
let lastWordCount = 0;
let currentText;
let wordBtns = [];
/*
 * I1) Der Nutzer kann einen Text (Prompt) eingeben.
    Dieser sollte nur aus vollständigen, durch Leerzeichen getrennten Wörtern (Tokens) bestehen. 
    Er kann dann jederzeit (am Ende eines vollständig eingegebenen Wortes) den Button „Vorhersage“ betätigen
     und erhält eine Darstellung der wahrscheinlichsten nun folgenden Wörter mit deren Wahrscheinlichkeiten.
    Er kann eines dieser Wörter auswählen, sodass es an den Text angehängt wird.
     Daraufhin beginnt automatisch eine neue Wortvorhersage.
 */
function showSuggestions() {
    foo()
    resetSuggestions()

    //get currentText 
    currentText = inputArea.value;

    //geneate predictions
    let predictions = getPredictions(currentText);

    for (const p of predictions) {
        let probability = Math.round(Math.random(0, 1) * 100)
        const wordBtn = new WordBtn(p, probability);
        const wordBtnElement = wordBtn.btnElement;
        suggestionHolder.appendChild(wordBtnElement);
        wordBtns.push(wordBtn);
    }

    suggestionHolder.firstChild.className = "btn btn-outline-light word-btn best-suggestion"

}

/*
I2) Der Nutzer kann mittels des „Weiter“ Buttons das wahrscheinlichste vorhergesagte Wort annehmen.
 Diese wird an den bisher eingegebenen Text angehängt, darauf beginnt automatisch eine neue Wortvorhersage.
 Der Nutzer kann also über wiederholtes Betätigen des „Weiter“ Buttons einen Text generieren lassen.
*/
function acceptFirst() {

    showSuggestions();

    //accept first suggestion
    wordBtns[0].addToText(false);
}


/* I3) Der Nutzer kann über einen „Auto“ Button automatisch bis zu 10 Wörter vorhersagen lassen.
 Diese automatische Vorhersage kann mittels eines „Stopp“ Buttons unterbrochen werden. */
function auto() {
    toggleAutoStyle()
    for (let index = 0; index < 10; index++) {

        acceptFirst();
    }
    toggleAutoStyle()
}


function toggleAutoStyle() {
    isAutoGenerating = !isAutoGenerating;

    //Change Button Styling
    if (isAutoGenerating) {
        autoBtn.className = "btn btn-danger";
        autoBtn.innerHTML = "🚫 Stopp"
    } else {
        autoBtn.className = "btn btn-primary my-btn";
        autoBtn.innerHTML = "↬ Auto (10x Beste)"
    }

}


function reset() {
    currentText = "";

    //Reset Text Area
    inputArea.value = "";

    //Reset predicted words
    resetSuggestions()

    //Reset Model

    disabledButtons(true)
}


function resetSuggestions() {
    suggestionHolder.replaceChildren();
    wordBtns = []

}


// Make the model get the predicted text
function getPredictions(currentText) {
    const pred = [];

    for (let index = 1; index < 8; index++) {
        let num = Math.round(Math.random(0, 1) * 100)
        pred.push(num)
    }



    return pred;
}

function disabledButtons(isDisabled) {
    predictBtn.disabled = isDisabled
    autoBtn.disabled = isDisabled
    resetBtn.disabled = isDisabled
    acceptBtn.disabled = isDisabled
}
