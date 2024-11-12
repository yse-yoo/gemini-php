<?php
$langs = [
    'ja-JP' => 'Japanese',
    'en-US' => 'English',
    'fr-FR' => 'French',
    'de-DE' => 'German',
    'zh-CN' => 'Chinese',
    'vi-VN' => 'Vietnamese',
];

$defaultFromLang = 'ja-JP';
$defaultToLang = 'en-US';

function selected($value, $selected)
{
    return ($value == $selected) ? 'selected' : '';
}
?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat</title>
    <!-- Socket.IOクライアントスクリプトを読み込む -->
    <script src="http://localhost:3000/socket.io/socket.io.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100 font-sans leading-normal tracking-normal">

    <div class="container mx-auto mt-10">
        <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">Chat</h1>

        <div class="bg-white my-2 shadow-md rounded-lg px-6 py-3">
            <div class="flex">
                <div>
                    <label for="fromLang" class="text-gray-800 font-semibold">翻訳前の言語</label>
                    <select id="fromLang" class="bg-white border border-gray-300 rounded-md p-2" onchange="updateFromLang()">
                        <?php foreach ($langs as $value => $lang): ?>
                            <option value="<?= $value ?>" <?= selected($defaultFromLang, $value) ?>><?= $lang ?></option>
                        <?php endforeach ?>
                    </select>
                </div>
                <div class="ml-5">
                    <label for="toLang" class="text-gray-800 font-semibold">翻訳後の言語</label>

                    <select id="toLang" class="bg-white border border-gray-300 rounded-md p-2" onchange="updateToLang()">
                        <?php foreach ($langs as $value => $lang): ?>
                            <option value="<?= $value ?>" <?= selected($defaultToLang, $value) ?>><?= $lang ?></option>
                        <?php endforeach ?>
                    </select>
                </div>
            </div>

            <button id="startButton" class="bg-teal-500 hover:bg-teal-700 text-sm text-white font-bold py-1 px-2 rounded my-2" onclick="startSpeech()">
                音声入力
            </button>
            <p id="status" class="text-red-500"></p>

            <div class="flex mt-3 w-full max-w-lg">
                <input id="inputText" class="p-2 w-3/4 rounded text-gray-700 border">
                <button onclick="onSendMessage()" id="sendButton" class="w-1/4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                    送信
                </button>
            </div>
        </div>

        <div class="bg-white my-2 shadow-md rounded-lg px-6 py-3 w-full">
            <h2 class="text-xl text-center p-3">チャット</h2>
            <div id="chatHistory">
                <!-- チャットメッセージがここに追加されます -->
            </div>
        </div>
    </div>

    <script src="js/env.js" defer></script>
    <script src="js/chat.js" defer></script>
</body>

</html>