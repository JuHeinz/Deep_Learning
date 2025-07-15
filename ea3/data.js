class TextData {


    constructor(textUrl, sequenceLength) {
        this.textUrl_ = textUrl;
        this.sequenceLength_ = sequenceLength
    }

    /*can not use await in constructor, therefore call this method after initalizing TextData */
    async init() {
        const response = await fetch(this.textUrl_);
        const text = await response.text();
        this.words_ = makeWords(text);
        this.tokens_ = this.getTokens(this.words_);
        this.sequences_ = this.createTrainingSequences(this.words_, this.tokens_, this.sequenceLength_);
    }


    /**
     * Give each word an index
     */
    getTokens(words) {
        const tokens = {}; //an object where each property is a word and its value is its index e.g. {the: 1, and: 2}
        const reverseTokens = {}; // the reverse of the above e.g. {1: 'the', 2: 'and'}, to find the predicted word again later

        let index = 1;

        words.forEach(word => {
            if (!tokens[word]) { //if there isn't already index for the given word 
                tokens[word] = index; //assign the current index to the word
                reverseTokens[index] = word;
                index++;
            }
        });

        this.vocabSize_ = index;
        console.log("Vocab Size= ", this.vocabSize_)
        this.reverseTokens_ = reverseTokens
        return tokens
    }

    /**
     Create the training data: x/input will be a sequence of 5 words. y/label will be the word that follows this sequence
     */
    createTrainingSequences(words, tokens, sequenceLength) {
        const sequences = [];
        for (let i = 0; i < words.length - sequenceLength; i++) {
            const input = words.slice(i, i + sequenceLength).map(w => tokens[w]); // slice out 5 words and map them to their numeric tokens
            const label = tokens[words[i + sequenceLength]]; //the word that follows right after the input
            sequences.push({ input, label });
        }
        console.dir(sequences)
        return sequences;
    }

}

/**
 Clean text and split into words.
 */
function makeWords(text) {
    return text
        .replace(/—/g, ' ')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s']/g, '')
        .split(/\s+/)
        .filter(Boolean);
}
