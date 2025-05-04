class Card {
    constructor(isCorrect) {
        this.isCorrect = isCorrect;
        this.cardElement = this.createCard();
    }

    // Create the card structure
    createCard() {
        // Create the card 
        const card = document.createElement("div");
        card.className = "classification-card";

        // Create imnage holder
        this.leftCol = document.createElement("div");
        this.leftCol.className = "left-col";

        // Create chart holder
        this.rightCol = document.createElement("div");
        this.rightCol.className = "right-col";

        // Create result holder
        this.resultHolder = document.createElement("p");
        this.resultHolder.className = "result-holder";

        this.iconHolder = document.createElement("span");
        this.iconHolder.className = "icon";

        this.resultLabel = document.createElement("span")
        this.resultLabel.className = "label";


        // Append elements to build the structure
        card.appendChild(this.leftCol)
        card.appendChild(this.rightCol)


        return card;
    }

    // Append the card to a parent container
    appendTo(parent) {
        parent.appendChild(this.cardElement);
    }

    // Add an image to the input-holder
    addImage(imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        this.leftCol.appendChild(img);
        return img;
    }

    addCanvas(canvas) {
        this.rightCol.appendChild(canvas)
    }

    //Add the topmost guess to the card
    addLabel(label, confidence) {
        this.leftCol.appendChild(this.resultHolder);
        this.resultHolder.appendChild(this.iconHolder);
        this.resultHolder.appendChild(this.resultLabel);
        let symbol;

        switch (this.isCorrect) {
            case "right":
                symbol = "✅ "
                break;
            case "wrong":
                symbol = "❌ "
                break;
            default:
                symbol = ""
                break;
        }

        let roundedConfidence = Math.round(confidence * 100); 
        let resultString = label + " (" + roundedConfidence + " %)"

        this.iconHolder.innerHTML = symbol;
        this.resultLabel.innerHTML = resultString;
    }
}