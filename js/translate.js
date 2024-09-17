document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const resultElement = document.getElementById('result');

    // 音声認識が利用できるか確認
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("このブラウザは音声認識に対応していません。Google Chromeなど最新のブラウザを使用してください。");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP'; // 日本語対応

    // 音声認識が開始されたとき
    recognition.onstart = () => {
        resultElement.textContent = "音声認識中...";
    };

    // 音声認識が終了したとき
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // 音声認識結果
        resultElement.textContent = transcript; // 結果を表示
    };

    // エラーハンドリング
    recognition.onerror = (event) => {
        resultElement.textContent = `エラーが発生しました: ${event.error}`;
    };

    // ボタンがクリックされたとき、音声認識を開始
    startButton.addEventListener('click', () => {
        recognition.start();
    });
});
