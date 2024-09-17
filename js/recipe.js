
const createRecipe = () => {
    fetch('http://localhost/gemini-php/ai_recipe.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // レスポンスをJSON形式に変換
    })
    .then(data => {
        // 取得したデータをJSON形式で整形し、<pre>内に表示
        document.getElementById('recipeOutput').textContent = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.getElementById('recipeOutput').textContent = 'レシピの取得に失敗しました。';
    });
}