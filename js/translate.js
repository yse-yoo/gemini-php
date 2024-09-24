const startButton = document.getElementById('startButton');
const resultElement = document.getElementById('result');
const statusElement = document.getElementById('status');
const fromLangSelect = document.getElementById('fromLang');
const toLangSelect = document.getElementById('toLang');
const uri = 'http://localhost/gemini-php/api/ai_translate.php';

SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;

recognition.onstart = () => {
    resultElement.textContent = "音声認識中...";
};

recognition.onresult = (event) => {
    console.log('onresult')
    var transcript = event.results[0][0].transcript;
    resultElement.textContent = transcript;
    translate(transcript, fromLangSelect.value, toLangSelect.value);
}

recognition.onend = () => {
    console.log('音声認識が終了しました');
    statusElement.textContent = "";
};

recognition.onerror = (event) => {
    statusElement.textContent = `エラーが発生しました: ${event.error}`;
};

// ボタンがクリックされたとき、音声認識を開始
const startSpeech = () => {
    console.log("Lang: ", fromLangSelect.value);
    recognition.lang = fromLangSelect.value;
    recognition.start(); // 音声認識を開始
}

const translate = async (transcript, fromLang, toLang) => {
    statusElement.textContent = "翻訳中...";

    await fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            transcript: transcript,
            fromLang: fromLang,
            toLang: toLang
        })
    })
        .then(response => {
            statusElement.textContent = "";
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            renderTranslation(data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
};

// 翻訳結果を表示
const renderTranslation = (translationData) => {
    addTranslationToHistory(translationData);
};

// 翻訳履歴を追加
const addTranslationToHistory = (result) => {
    const historyElement = document.getElementById('history');
    const toLang = document.createElement('div');
    toLang.classList.add('my-1');

    const translate = result.translate ? result.translate : "Translate error.";
    toLang.innerHTML = translate;
    historyElement.appendChild(toLang);
};
