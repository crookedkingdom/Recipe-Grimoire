// Recipe.js

document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipe-form');
    const searchButton = document.getElementById('search-button');
    const grimoire = document.querySelector('.grimoire');
    const recipeList = document.getElementById('recipe-list');
    const recipeDetails = document.getElementById('recipe-details');
    const detailsContent = document.getElementById('details-content');
    const backButton = document.getElementById('back-button');

    if (recipeForm) {
        recipeForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const ingredients = document.getElementById('ingredients').value.split(',').map(item => item.trim()).filter(item => item);
            const cuisine = document.getElementById('cuisine').value;
            const maxCalories = document.getElementById('calories').value;

            if (searchButton) {
                searchButton.classList.add('loading');
            }

            if (grimoire) {
                grimoire.classList.add('flip');
            }

            const appId = '5dd3f9f9'; // Replace with your actual app ID
            const appKey = '1297a80a64b08bc3bcade4e08ac5bc95'; // Replace with your actual app key

            const apiEndpoint = 'https://api.edamam.com/api/recipes/v2';
            const apiUrl = `${apiEndpoint}?type=public&q=${encodeURIComponent(ingredients.join(','))}&cuisineType=${encodeURIComponent(cuisine)}&calories=${encodeURIComponent(maxCalories)}&app_id=${appId}&app_key=${appKey}`;

            console.log(`API Request URL: ${apiUrl}`); // Log API request URL for debugging

            fetch(apiUrl)
                .then(response => {
                    console.log('API Response Status:', response.status); // Log response status for debugging

                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (searchButton) {
                        searchButton.classList.remove('loading');
                    }

                    if (grimoire) {
                        grimoire.classList.remove('flip');
                    }

                    console.log('API Response Data:', data); // Log API response data for debugging

                    recipeList.innerHTML = '';

                    if (data.hits && data.hits.length > 0) {
                        data.hits.forEach(hit => {
                            const recipe = hit.recipe;
                            const listItem = document.createElement('li');
                            listItem.innerHTML = `
                                <strong>Recipe Name:</strong> <a href="#" class="recipe-link" data-url="${recipe.url}" data-label="${recipe.label}" data-cuisine="${recipe.cuisineType || 'N/A'}" data-calories="${Math.round(recipe.calories)}" data-diet="${recipe.dietLabels.join(', ')}">${recipe.label}</a>
                            `;
                            recipeList.appendChild(listItem);
                        });

                        document.querySelectorAll('.recipe-link').forEach(link => {
                            link.addEventListener('click', function(event) {
                                event.preventDefault();
                                showRecipeDetails(this);
                            });
                        });
                    } else {
                        recipeList.innerHTML = '<li>No recipes found.</li>';
                    }
                })
                .catch(error => {
                    if (searchButton) {
                        searchButton.classList.remove('loading');
                    }

                    if (grimoire) {
                        grimoire.classList.remove('flip');
                    }

                    console.error('Error fetching recipes:', error.message); // Log detailed error message
                    recipeList.innerHTML = '<li>Error fetching recipes. Please try again later.</li>';
                });
        });
    }

    if (backButton) {
        backButton.addEventListener('click', function() {
            if (recipeDetails) {
                recipeDetails.style.display = 'none';
            }
            if (document.querySelector('.form-section')) {
                document.querySelector('.form-section').style.display = 'block';
            }
        });
    }
});

function showRecipeDetails(link) {
    const recipeDetails = document.getElementById('recipe-details');
    const formSection = document.querySelector('.form-section');
    const detailsContent = document.getElementById('details-content');

    if (formSection) {
        formSection.style.display = 'none';
    }

    if (recipeDetails) {
        recipeDetails.style.display = 'block';
    }

    if (detailsContent) {
        detailsContent.innerHTML = `
            <h2>${link.getAttribute('data-label')}</h2>
            <p><strong>Cuisine Type:</strong> ${link.getAttribute('data-cuisine')}</p>
            <p><strong>Calories:</strong> ${link.getAttribute('data-calories')}</p>
            <p><strong>Diet Labels:</strong> ${link.getAttribute('data-diet')}</p>
            <p><strong>Recipe URL:</strong> <a href="${link.getAttribute('data-url')}" target="_blank">${link.getAttribute('data-url')}</a></p>
        `;
    }
}
