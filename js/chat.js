const TRANSLATION_URI = "http://localhost/gemini-php/api/translate/ai_translate.php";
const CHAT_URI = "http://localhost:3000";

const socket = io(CHAT_URI);

const startButton = document.getElementById('startButton');
const resultElement = document.getElementById('result');
const statusElement = document.getElementById('status');
const fromLangSelect = document.getElementById('fromLang');
const toLangSelect = document.getElementById('toLang');
const chatHistoryElement = document.getElementById('chatHistory');

// 音声認識の初期化
var recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert("このブラウザは音声認識をサポートしていません");
}
recognition.lang = fromLangSelect.value;
recognition.interimResults = false;

// 翻訳前のテキストを表示
const addOrigin = (text, isOwnMessage = false) => {
    const originalMessageDiv = document.createElement('div');
    originalMessageDiv.classList.add('flex', isOwnMessage ? 'justify-start' : 'justify-end');

    const originalBubble = document.createElement('div');
    originalBubble.classList.add(
        isOwnMessage ? 'bg-teal-500' : 'bg-blue-500',
        'text-white', 'rounded-lg', 'p-3', 'max-w-xs', 'text-left', 'mb-1'
    );
    originalBubble.innerHTML = text;
    originalMessageDiv.appendChild(originalBubble);

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
    translationBubble.innerHTML = text;
    translationMessageDiv.appendChild(translationBubble);

    chatHistoryElement.appendChild(translationMessageDiv);
};

// メッセージをサーバーに送信する関数
async function sendMessage() {
    // 入力欄のテキストを取得
    const message = document.getElementById('inputText').value;
    const fromLang = fromLangSelect.value;
    const toLang = toLangSelect.value;

    console.log(message, fromLang, toLang)
    if (!message) return alert("メッセージを入力してください");

    // チャットに翻訳前のテキストを追加
    addOrigin(message, true);

    // 翻訳を行い、翻訳されたテキストをサーバーに送信
    try {
        const response  = await fetch(TRANSLATION_URI, {
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

        // 翻訳されたテキストをチャットに追加
        addTranslation(translatedText, true);

        // 翻訳前と翻訳後のテキストをオブジェクトにまとめてサーバーに送信
        if (translatedText) {
            socket.emit('message', { original: message, translated: translatedText });
        }

        document.getElementById('inputText').value = '';
    } catch (error) {
        console.error('翻訳エラー:', error);
    }
}

// fromLang の変更を反映
function updateFromLang() {
    recognition.lang = fromLangSelect.value;
    console.log("音声認識の言語が変更されました:", fromLangSelect.value);
}

// toLang の変更を反映
function updateToLang() {
    console.log("翻訳後の言語が変更されました:", toLangSelect.value);
}

// サーバーからのメッセージを受信
socket.on('message', (msg) => {
    // 他のユーザーからのメッセージを表示（翻訳前を上、翻訳後を下に表示）
    addOrigin(msg.original, false); // 翻訳前テキスト
    addTranslation(msg.translated, false); // 翻訳後テキスト
});


// テキストの翻訳と送信
const translateAndSend = async (text, fromLang, toLang) => {
    statusElement.textContent = "翻訳中...";
    try {
        const response = await fetch(TRANSLATION_URI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origin: text, fromLang, toLang })
        });
        const data = await response.json();
        const translatedText = data.translate || "翻訳エラー";
        addTranslation(translatedText);

        // サーバーにメッセージを送信
        socket.emit('message', translatedText);
    } catch (error) {
        console.error('翻訳エラー:', error);
    } finally {
        statusElement.textContent = "";
    }
};

recognition.onstart = () => {
    statusElement.textContent = "音声認識中...";
};

recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    resultElement.value = text;
    addOrigin(text);
    translateAndSend(text, fromLangSelect.value, toLangSelect.value);
};

recognition.onend = () => {
    statusElement.textContent = "";
};

recognition.onerror = (event) => {
    statusElement.textContent = `エラー: ${event.error}`;
};

// 音声認識の開始
const startSpeech = () => {
    recognition.lang = fromLangSelect.value;
    recognition.start();
};
