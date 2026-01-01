const input = document.getElementById("wordInput");
const resultDiv = document.getElementById("result");

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    const word = input.value.trim();

    if (word === "") {
        alert("Please enter a word.");
        return;
    }

    resultDiv.innerHTML = "Loading...";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(data => {
            displayResult(data[0], word);
        })
        .catch(() => {
            resultDiv.innerHTML =
                "<p style='color:red;'>Word not found. Please try another word.</p>";
        });
}

function displayResult(data, searchedWord) {
    const meaning = data.meanings[0];
    const definitionData = meaning.definitions[0];

    const meaningText = definitionData.definition;
    const partOfSpeech = meaning.partOfSpeech || "Not available";

    // ✅ Always provide an example
    const example =
        definitionData.example ||
        `This is an example sentence using the word "${searchedWord}".`;

    const phonetic = data.phonetic || "Not available";

    // Audio pronunciation
    let audioSrc = "";
    if (data.phonetics) {
        for (let item of data.phonetics) {
            if (item.audio) {
                audioSrc = item.audio;
                break;
            }
        }
    }

    resultDiv.innerHTML = `
        <p><strong>Meaning:</strong> ${meaningText}</p>
        <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
        <p><strong>Example:</strong> ${example}</p>
        <p><strong>Phonetic:</strong> ${phonetic}</p>
    `;

    if (audioSrc) {
        const audio = new Audio(audioSrc);
        const btn = document.createElement("button");
        btn.textContent = "Play Pronunciation";
        btn.className = "audio-btn";
        btn.onclick = () => audio.play();
        resultDiv.appendChild(btn);
    }
}
