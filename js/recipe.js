document.addEventListener('DOMContentLoaded', function() {
    // ボタンがクリックされたときにレシピを取得
    document.getElementById('fetchRecipe').addEventListener('click', createRecipe);
});

// URL
//（テストデータ）
const uri = 'http://localhost/gemini-php/data/test_recipe.json';
// (作成プログラムの APIURL)
// const uri = 'http://localhost/gemini-php/ai_recipe.php';

const createRecipe = async () => {
    await fetch(uri)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // JSONを返す
        })
        .then(recipeData => {
            console.log(recipeData);
            renderRecipe(recipeData);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

const renderRecipe = (recipeData) => {
    // レシピの表示用DOM要素
    const recipeDiv = document.getElementById('recipe');
    
    // 既存の内容をクリア
    recipeDiv.innerHTML = '';

    // レシピタイトルと説明を追加
    const title = document.createElement('h2');
    title.textContent = recipeData.name;
    title.classList.add('text-2xl', 'font-bold', 'mb-4', 'text-gray-800');
    recipeDiv.appendChild(title);

    const description = document.createElement('p');
    description.textContent = recipeData.description;
    description.classList.add('text-gray-700', 'mb-6');
    recipeDiv.appendChild(description);

    // 材料リストを生成
    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.textContent = '材料';
    ingredientsTitle.classList.add('text-xl', 'font-semibold', 'mb-4', 'text-gray-800');
    recipeDiv.appendChild(ingredientsTitle);

    const ingredientsList = document.createElement('ul');
    ingredientsList.classList.add('list-disc', 'pl-5', 'mb-6');
    recipeData.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${ingredient.name}</strong>: ${ingredient.amount} <span class="text-gray-500">(${ingredient.notes})</span>`;
        li.classList.add('mb-2');
        ingredientsList.appendChild(li);
    });
    recipeDiv.appendChild(ingredientsList);

    // 作り方リストを生成
    const instructionsTitle = document.createElement('h3');
    instructionsTitle.textContent = '作り方';
    instructionsTitle.classList.add('text-xl', 'font-semibold', 'mb-4', 'text-gray-800');
    recipeDiv.appendChild(instructionsTitle);

    const instructionsList = document.createElement('ol');
    instructionsList.classList.add('list-decimal', 'pl-5');
    recipeData.instructions.forEach((instruction, index) => {
        const li = document.createElement('li');
        li.textContent = `ステップ ${index + 1}: ${instruction.step}`;
        li.classList.add('mb-2');
        instructionsList.appendChild(li);
    });
    recipeDiv.appendChild(instructionsList);
}