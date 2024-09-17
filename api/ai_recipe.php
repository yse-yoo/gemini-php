<?php
// env.php を読み込み
require_once '../env.php';

// Gemini APIの場合
$posts = json_decode(file_get_contents('php://input'), true);
$data = createByAI($posts);

// テストデータの場合
// $data = testData();

header('Content-Type: application/json');
echo $data;

function createByAI($conditions)
{
    // Google APIキー
    $api_key = GEMINI_API_KEY;

    // TODO 欲しいJSONデータがレスポンスされるようにプロンプトを考える
    $prompot = "つぎの条件でレシピをJSONのみでレスポンス" . PHP_EOL;
    $prompot .= "ジャンル: {$conditions['genre']}" . PHP_EOL;
    $prompot .= "時間帯: {$conditions['time']}" . PHP_EOL;
    $prompot .= "キーワード: {$conditions['keywords']}" . PHP_EOL;
    $prompot .= "JSONテンプレート" . PHP_EOL;
    $prompot .= template();

    $data = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $prompot],
                ]
            ]
        ]
    ];

    // TODO Gemini AI処理
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $api_key);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo json_encode(['error' => curl_error($ch)]);
    } else {
        $response_data = json_decode($response, true);
        if (isset($response_data['candidates'][0]['content']['parts'][0]['text'])) {
            $text = $response_data['candidates'][0]['content']['parts'][0]['text'];
            $json = str_replace(['```json', '```'], '', $text);
        }
    }
    curl_close($ch);
    return $json;
}

function testData()
{
    $data = '
  {
    "name": "チキンと野菜の炒め物",
    "description": "簡単に作れる、おいしいチキンと野菜の炒め物。",
    "ingredients": [
      {
        "name": "鶏むね肉",
        "amount": "1枚",
        "unit": "",
        "notes": "一口大に切る"
      },
      {
        "name": "ピーマン",
        "amount": "2個",
        "unit": "",
        "notes": "種を取り、細切りにする"
      },
      {
        "name": "玉ねぎ",
        "amount": "1/2個",
        "unit": "",
        "notes": "薄切りにする"
      },
      {
        "name": "ニンジン",
        "amount": "1本",
        "unit": "",
        "notes": "薄切りにする"
      },
      {
        "name": "ブロッコリー",
        "amount": "1/2株",
        "unit": "",
        "notes": "小房に分ける"
      },
      {
        "name": "醤油",
        "amount": "大さじ2",
        "unit": "",
        "notes": ""
      },
      {
        "name": "酒",
        "amount": "大さじ1",
        "unit": "",
        "notes": ""
      },
      {
        "name": "砂糖",
        "amount": "小さじ1",
        "unit": "",
        "notes": ""
      },
      {
        "name": "ごま油",
        "amount": "大さじ1",
        "unit": "",
        "notes": ""
      },
      {
        "name": "塩コショウ",
        "amount": "少々",
        "unit": "",
        "notes": ""
      }
    ],
    "instructions": [
      {
        "step": "鶏むね肉に塩コショウを振る。",
        "notes": ""
      },
      {
        "step": "フライパンにごま油を熱し、鶏むね肉を炒める。",
        "notes": ""
      },
      {
        "step": "鶏むね肉に火が通ったら、玉ねぎ、ピーマン、ニンジンを炒める。",
        "notes": ""
      },
      {
        "step": "野菜がしんなりしてきたら、ブロッコリーを加えて炒める。",
        "notes": ""
      },
      {
        "step": "醤油、酒、砂糖を加えて炒め合わせる。",
        "notes": ""
      },
      {
        "step": "全体に味が馴染んだら完成。",
        "notes": ""
      }
    ]
  }';
    return $data;
}


function template()
{
    $template = '
    {
    "title": "xxxxxxxx",
    "description": "xxxxxxxxxxxx",
    "genre": "xxxx",
    "keywords": "xxx,xxx,xxx,xxx",
    "ingredients": [
        {
            "name": "xxxx",
            "quantity": "xxxx",
        },
        {
            "name": "xxxx",
            "quantity": "xxxx",
        }
    ]
    "steps": [
        {
            "stepNumber": 1,
            "instruction": "xxxx",
        },
        {
            "stepNumber": 2,
            "instruction": "xxxx",
        }
    ]
}';
    return $template;
}
