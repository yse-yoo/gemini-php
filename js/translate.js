const uri = 'http://localhost/gemini-php/api/translate/ai_translate.php';

const startButton = document.getElementById('startButton');
const resultElement = document.getElementById('result');
const statusElement = document.getElementById('status');
const fromLangSelect = document.getElementById('fromLang');
const toLangSelect = document.getElementById('toLang');

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
    speakTranslation(translationData.translate); // 翻訳結果を読み上げる
};

// 翻訳履歴を追加
const addTranslationToHistory = (result) => {
    const historyElement = document.getElementById('history');

    // 翻訳結果を格納するdivを作成
    const translationDiv = document.createElement('div');
    translationDiv.classList.add('translation-item', 'my-1');

    // 翻訳結果テキストを表示する要素を作成
    const translationText = document.createElement('span');
    const translate = result.translate ? result.translate : "Translate error.";
    translationText.innerHTML = translate;

    // 再生ボタンを作成
    const playButton = document.createElement('button');
    playButton.innerText = '再生';
    playButton.classList.add('play-btn', 'text-xs', 'rounded', 'mx-2', 'px-3', 'py-1', 'bg-blue-500', 'text-white');

    // 再生ボタンのクリックイベント
    playButton.addEventListener('click', () => {
        speakTranslation(translate); // クリックされた翻訳結果を読み上げ
    });

    // 各要素を翻訳結果divに追加
    translationDiv.appendChild(translationText);
    translationDiv.appendChild(playButton);

    // 履歴に翻訳結果divを追加
    historyElement.appendChild(translationDiv);
};

const playText = () => {
    if (lastTranslation) {
        speakTranslation(lastTranslation); // 最後の翻訳結果を読み上げ
    } else {
        console.log('再生する翻訳結果がありません');
    }
}


// 翻訳結果を音声で読み上げ
const speakTranslation = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = toLangSelect.value; // 翻訳先の言語で読み上げ
    console.log(toLangSelect.value);
    synth.speak(utterance);
};