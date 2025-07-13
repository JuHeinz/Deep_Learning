class TextData {

    constructor(textUrl) {
        this.textUrl_ = textUrl;

        fetch(this.textUrl_)
            .then(res => res.text())
            .then(text => {
                this.words_ = this.makeWords(text)
                this.tokens_ = this.getTokens(this.words_)
                this.trainingSequences_ = this.createTrainingSequences(this.words_, this.tokens_)
            })
            .catch((e) => console.error(e));
    }

    /**
     Clean text and split into words.
     */
    makeWords(text) {
        return text
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .split(/\s+/)
            .filter(Boolean);
    }

    /**
     * Give each word an index
     */
    getTokens(words) {
        const tokens = {}; // an object where each property is a word and its value is an index
        let index = 1;

        words.forEach(word => {
            if (!tokens[word]) { //if there is index for the given property 
                tokens[word] = index; //assign the current index to the property
                index++;
            }
        });
        this.vocabSize_ = index;
        return tokens
    }

    /**
     Create the training data: x/input will be a sequence of 5 words. y/label will be the word that follows this sequence
     */
    createTrainingSequences(words, tokens) {
        const sequenceLength = 5;
        const sequences = [];

        for (let i = 0; i < words.length - sequenceLength; i++) {
            const input = words.slice(i, i + sequenceLength).map(w => tokens[w]); // slice out 5 words and map them to their numeric tokens
            const label = tokens[words[i + sequenceLength]]; //the word that follows right after the input
            sequences.push({ input, label });
        }
        return sequences;
    }

}


