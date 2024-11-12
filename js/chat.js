// HTML Element
const startButton = document.getElementById('startButton');
const inputTextElement = document.getElementById('inputText');
const statusElement = document.getElementById('status');
const fromLangSelect = document.getElementById('fromLang');
const toLangSelect = document.getElementById('toLang');
const chatHistoryElement = document.getElementById('chatHistory');

// Socket IO開始
const socket = io(CHAT_URI);

// 音声認識
var recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert("このブラウザは音声認識をサポートしていません");
}

// recognition.lang = fromLangSelect.value;
recognition.interimResults = false;

recognition.onstart = () => {
    statusElement.textContent = "音声認識中...";
};

recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    console.log("text:", text)
    if (text) {
        // 入力欄のテキストを取得
        const fromLang = fromLangSelect.value;
        const toLang = toLangSelect.value;
        sendMessage(text, fromLang, toLang);
    }
};

recognition.onend = () => {
    statusElement.textContent = "";
};

recognition.onerror = (event) => {
    statusElement.textContent = `エラー: ${event.error}`;
};

// 翻訳前のテキストを表示
const addOrigin = (text, isOwnMessage = false) => {
    const originalMessageDiv = document.createElement('div');
    originalMessageDiv.classList.add('flex', isOwnMessage ? 'justify-start' : 'justify-end');

    const originalBubble = document.createElement('div');
    originalBubble.classList.add(
        isOwnMessage ? 'bg-teal-500' : 'bg-blue-500',
        'text-white', 'rounded-lg', 'p-3', 'max-w-xs', 'text-left', 'mb-1'
    );

    // 会話作成
    originalBubble.innerHTML = text;
    originalMessageDiv.appendChild(originalBubble);

    // 会話履歴に追加
    chatHistoryElement.appendChild(originalMessageDiv);
};

// 翻訳後のテキストを表示
const addTranslation = (text, isOwnMessage = false) => {
    const translationMessageDiv = document.createElement('div');
    translationMessageDiv.classList.add('flex', isOwnMessage ? 'justify-start' : 'justify-end');

    const translationBubble = document.createElement('div');
    translationBubble.classList.add(
        isOwnMessage ? 'bg-gray-300' : 'bg-gray-400',
        'text-gray-800', 'rounded-lg', 'p-3', 'max-w-xs', 'text-left'
    );

    // 会話作成
    translationBubble.innerHTML = text;
    translationMessageDiv.appendChild(translationBubble);

    // 会話履歴に追加
    chatHistoryElement.appendChild(translationMessageDiv);
};

// fromLang の変更を反映
function updateFromLang() {
    recognition.lang = fromLangSelect.value;
    console.log("音声認識の言語が変更されました:", fromLangSelect.value);
}

// toLang の変更を反映
function updateToLang() {
    console.log("翻訳後の言語が変更されました:", toLangSelect.value);
}

async function onSendMessage() {
    const message = inputTextElement.value;
    const fromLang = fromLangSelect.value;
    const toLang = toLangSelect.value;

    console.log(message, fromLang, toLang)

    statusElement.textContent = "";
    if (!message) {
        statusElement.textContent = "メッセージを入力してください";
        return;
    }
    await sendMessage(message, fromLang, toLang);
}

// メッセージをサーバーに送信する関数
async function sendMessage(message, fromLang, toLang) {
    if (!message) return;
    if (!fromLang) return;
    if (!toLang) return;

    // チャットに翻訳前のテキストを追加
    addOrigin(message, true);

    // 翻訳を行い、翻訳されたテキストをサーバーに送信
    try {
        const response = await fetch(TRANSLATION_URI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origin: message,
                fromLang: fromLang,
                toLang: toLang
            })
        })
        // 入力欄をクリア
        const data = await response.json();
        const translatedText = data.translate || "翻訳エラー";

        if (translatedText) {
            // 翻訳されたテキストをチャットに追加
            addTranslation(translatedText, true);
            // チャットメッセージ
            socket.emit('message', { original: message, translated: translatedText });
        }
    } catch (error) {
        console.error('翻訳エラー:', error);
    }
}

// TODO: Chromeで利用できない
// 翻訳結果を音声で読み上げ
const speakTranslation = (text, lang) => {
    console.log('speakTranslation', text, lang)
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    synth.speak(utterance);
};

// サーバーからのメッセージを受信
socket.on('message', (msg) => {
    // 他のユーザーからのメッセージを表示
    addOrigin(msg.original, false);
    addTranslation(msg.translated, false);

    // 音声読み上げ
    // TODO: send chat lang
    speakTranslation(msg.translated, fromLangSelect.value);
});

// 音声認識の開始
const startSpeech = () => {
    recognition.lang = fromLangSelect.value;
    recognition.start();
};
