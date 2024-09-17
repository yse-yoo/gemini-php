<?php
// env.php を読み込み
require_once 'env.php';

// Google APIキー
$api_key = GEMINI_API_KEY;

$prompot = "今日の夕食のレシピを作成してください。";
$prompot.= "(JSONフォーマット)";
$prompot.= "（```jsonなどのマークダウンは削除）";

// リクエストのペイロードを作成
$data = [
    'contents' => [
        [
            'parts' => [
                ['text' => $prompot],
            ]
        ]
    ]
];

// RESTプログラム
// cURLセッションを初期化
$ch = curl_init();

// リクエストのオプションを設定
curl_setopt($ch, CURLOPT_URL, "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $api_key);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Gemini APIリクエスト&レスポンス
$response = curl_exec($ch);

// エラーが発生した場合
if (curl_errno($ch)) {
    echo json_encode(['error' => curl_error($ch)]);
} else {
    // JSONレスポンスをデコード
    $response_data = json_decode($response, true);

    // "candidates"フィールドを取得し、```jsonを削除してJSONとして返す
    if (isset($response_data['candidates'][0]['content']['parts'][0]['text'])) {
        $recipe_text = $response_data['candidates'][0]['content']['parts'][0]['text'];
        
        // ```json 部分を削除
        $recipe_cleaned = str_replace(['```json', '```'], '', $recipe_text);

        // JSONとして返す
        header('Content-Type: application/json');
        echo json_encode(json_decode($recipe_cleaned, true), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['error' => 'No recipe found in the response.']);
    }
}

// cURLセッションを閉じる
curl_close($ch);