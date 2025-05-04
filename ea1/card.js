class Card {
    constructor(isCorrect) {
        this.isCorrect = isCorrect;
        this.cardElement = this.createCard();
    }

    // Create the card structure
    createCard() {
        // Create the card container
        const card = document.createElement("div");
        card.className = "card border";
        card.style.maxWidth = "80vw";

        // Create the row
        const row = document.createElement("div");
        row.className = "row g-0";

        // Create the input-holder column
        this.inputHolder = document.createElement("div");
        this.inputHolder.className = "col-md-4 input-holder";

        // Create the chart-holder column
        const colChartHolder = document.createElement("div");
        colChartHolder.className = "col-md-8";

        // Create the card body
        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        // Create the card title
        const cardTitle = document.createElement("h5");
        cardTitle.className = "card-title";
        let symbol;
        let judgement;

        switch (this.isCorrect) {
            case "right":
                judgement = "Korrekte"
                symbol = "✅"
                break;
            case "wrong":
                judgement = "Inkorrekte"
                symbol = "❌"
                break;
            default:
                judgement = ""
                symbol = ""
                break;
        }
        cardTitle.textContent = symbol + judgement + " " + "Klassifikation";

        // Create the card text
        this.cardText = document.createElement("div");

        // Append elements to build the structure
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(this.cardText);
        colChartHolder.appendChild(cardBody);
        row.appendChild(this.inputHolder);
        row.appendChild(colChartHolder);
        card.appendChild(row);

        return card;
    }

    // Append the card to a parent container
    appendTo(parent) {
        parent.appendChild(this.cardElement);
    }

    // Add an image to the input-holder
    addImage(imageSrc) {
        const img = new Image(500, 500);
        img.src = imageSrc;
        img.className = "img-fluid rounded-start";
        this.inputHolder.appendChild(img);
        return img;
    }

    addCanvas(canvas) {
        this.cardText.appendChild(canvas)
    }
}