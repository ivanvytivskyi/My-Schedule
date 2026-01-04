// ================================================
// RECIPE DISPLAY UI SYSTEM
// ================================================

let selectedRecipesThisWeek = JSON.parse(localStorage.getItem('selectedRecipesThisWeek')) || [];

// Get This Week recipes (for external use)
function getThisWeekRecipes() {
    return selectedRecipesThisWeek || [];
}

// Get all recipes from database
function getAllRecipes() {
    const allRecipes = {};
    
    // Get built-in recipes from RECIPE_DATABASE
    if (typeof RECIPE_DATABASE !== 'undefined') {
        Object.assign(allRecipes, RECIPE_DATABASE);
        console.log(`📖 Loaded ${Object.keys(RECIPE_DATABASE).length} built-in recipes`);
    } else {
        console.warn('⚠️ RECIPE_DATABASE not loaded yet');
    }
    
    // Get custom recipes from localStorage
    const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '{}');
    if (Object.keys(customRecipes).length > 0) {
        Object.assign(allRecipes, customRecipes);
        console.log(`✨ Loaded ${Object.keys(customRecipes).length} custom recipes`);
    }
    
    console.log(`📚 Total recipes available: ${Object.keys(allRecipes).length}`);
    return allRecipes;
}

// Add recipe to This Week
function addRecipeToThisWeek(recipeId) {
    // Don't add duplicates to This Week section
    if (!selectedRecipesThisWeek.includes(recipeId)) {
        selectedRecipesThisWeek.push(recipeId);
        localStorage.setItem('selectedRecipesThisWeek', JSON.stringify(selectedRecipesThisWeek));
        renderThisWeekRecipes();
        return true;
    }
    return false;
}
let currentFilters = {
    category: 'all',
    vegetarian: false,
    vegan: false,
    nutFree: false,
    dairyFree: false,
    glutenFree: false
};
let editingRecipeId = null;

// ===================================
// INITIALIZE RECIPE LIBRARY TAB
// ===================================

function initializeRecipeLibrary() {
    // Add recipe library HTML to recipes content
    const recipesContent = document.getElementById('recipesContent');
    
    // Create tabs container
    const tabsHTML = `
        <div class="recipes-tabs" style="display: flex; gap: 10px; margin-bottom: 20px; background: white; padding: 15px; border-radius: 12px;">
            <button class="recipe-tab active" data-tab="library" style="flex: 1; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 15px;">
                📚 Recipe Library
            </button>
            <button class="recipe-tab" data-tab="thisweek" style="flex: 1; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; background: #f0f0f0; color: #333; font-size: 15px;">
                🍽️ This Week
            </button>
        </div>
        
        <div class="recipe-actions-bar" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-bottom: 15px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 16px 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2); border: 2px solid #fbbf24;">
            <div style="flex: 1; min-width: 220px; color: #78350f; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 22px;">✨</span>
                <span>Save your own dishes as Custom Recipes</span>
            </div>
            <button onclick="openCustomRecipeModal()" class="primary-btn">
                ➕ Add Custom Recipe
            </button>
        </div>
        
        <!-- Recipe Library Tab -->
        <div id="recipeLibraryTab" class="recipe-tab-content active">
            <!-- Filters -->
            <div class="recipe-filters" style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center; margin-bottom: 15px;">
                    <select id="categoryFilter" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; font-weight: 600; min-width: 150px;">
                        <option value="all">All Categories</option>
                        <option value="breakfast">🍳 Breakfast</option>
                        <option value="main">🍽️ Main Meal</option>
                        <option value="batch">🍲 Batch Cook</option>
                        <option value="drink">🥤 Drink</option>
                        <option value="snacks">🍎 Snacks</option>
                        <option value="rewards">🍪 Rewards</option>
                    </select>
                    
                    <button onclick="clearFilters()" style="padding: 10px 15px; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                        ✕ Clear Filters
                    </button>
                </div>
                
                <div class="dietary-filters" style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 12px; background: #f8f9fa; border-radius: 8px;">
                        <input type="checkbox" id="filterVegetarian" value="vegetarian" style="width: 18px; height: 18px;">
                        <span style="font-weight: 600;">🥬 Vegetarian</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 12px; background: #f8f9fa; border-radius: 8px;">
                        <input type="checkbox" id="filterVegan" value="vegan" style="width: 18px; height: 18px;">
                        <span style="font-weight: 600;">🌱 Vegan</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 12px; background: #f8f9fa; border-radius: 8px;">
                        <input type="checkbox" id="filterNutFree" value="nutFree" style="width: 18px; height: 18px;">
                        <span style="font-weight: 600;">🥜 Nut-free</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 12px; background: #f8f9fa; border-radius: 8px;">
                        <input type="checkbox" id="filterDairyFree" value="dairyFree" style="width: 18px; height: 18px;">
                        <span style="font-weight: 600;">🥛 Dairy-free</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px 12px; background: #f8f9fa; border-radius: 8px;">
                        <input type="checkbox" id="filterGlutenFree" value="glutenFree" style="width: 18px; height: 18px;">
                        <span style="font-weight: 600;">🌾 Gluten-free</span>
                    </label>
                </div>
            </div>
            
            <!-- Recipe Grid -->
            <div style="background: white; padding: 20px; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div id="recipeGrid" class="recipe-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                    <!-- Cards generated by JS -->
                </div>
            </div>
        </div>
        
        <!-- This Week Tab -->
        <div id="thisWeekTab" class="recipe-tab-content" style="display: none;">
            <div id="thisWeekRecipes" style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 16px;">
                <p style="text-align: center; color: #999; font-size: 16px;">No recipes selected this week. Import a schedule with recipes to see them here!</p>
            </div>
        </div>
    `;
    
    recipesContent.innerHTML = tabsHTML;
    
    // Setup event listeners
    setupRecipeTabListeners();
    setupFilterListeners();
    createCustomRecipeModal();
    
    // Initial render
    renderRecipeGrid();
    
    console.log('✅ Recipe Library initialized!');
}

// ===================================
// TAB SWITCHING
// ===================================

function setupRecipeTabListeners() {
    document.querySelectorAll('.recipe-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update tab buttons
            document.querySelectorAll('.recipe-tab').forEach(t => {
                t.classList.remove('active');
                t.style.background = '#f0f0f0';
                t.style.color = '#333';
            });
            tab.classList.add('active');
            tab.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            tab.style.color = 'white';
            
            // Update tab content
            document.querySelectorAll('.recipe-tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            if (tabName === 'library') {
                document.getElementById('recipeLibraryTab').style.display = 'block';
            } else {
                document.getElementById('thisWeekTab').style.display = 'block';
                renderThisWeekRecipes();
            }
        });
    });
}

// ===================================
// FILTER SYSTEM
// ===================================

function setupFilterListeners() {
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        renderRecipeGrid();
    });
    
    // Dietary filters
    ['filterVegetarian', 'filterVegan', 'filterNutFree', 'filterDairyFree', 'filterGlutenFree'].forEach(id => {
        const checkbox = document.getElementById(id);
        checkbox.addEventListener('change', () => {
            const filterName = checkbox.value;
            currentFilters[filterName] = checkbox.checked;
            renderRecipeGrid();
        });
    });
}

function clearFilters() {
    currentFilters = {
        category: 'all',
        vegetarian: false,
        vegan: false,
        nutFree: false,
        dairyFree: false,
        glutenFree: false
    };
    
    document.getElementById('categoryFilter').value = 'all';
    ['filterVegetarian', 'filterVegan', 'filterNutFree', 'filterDairyFree', 'filterGlutenFree'].forEach(id => {
        document.getElementById(id).checked = false;
    });
    
    renderRecipeGrid();
}

// ===================================
// RECIPE GRID RENDERING
// ===================================

function renderRecipeGrid() {
    if (typeof getAllRecipes !== 'function') {
        console.error('getAllRecipes function not found');
        return;
    }
    
    const grid = document.getElementById('recipeGrid');
    const allRecipes = getAllRecipes();
    
    // Apply filters
    let filteredRecipes = Object.values(allRecipes);
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filteredRecipes = filteredRecipes.filter(r => r.category === currentFilters.category);
    }
    
    // Dietary filters
    filteredRecipes = filteredRecipes.filter(recipe => {
        const dietary = recipe.dietary || {};
        
        if (currentFilters.vegan && !dietary.vegan) return false;
        if (currentFilters.vegetarian && !dietary.vegetarian && !dietary.vegan) return false;
        if (currentFilters.nutFree && dietary.nuts) return false;
        if (currentFilters.dairyFree && dietary.dairy) return false;
        if (currentFilters.glutenFree && dietary.gluten) return false;
        
        return true;
    });
    
    if (filteredRecipes.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #999;">
                <p style="font-size: 48px; margin: 0 0 15px 0;">🔍</p>
                <p style="font-size: 18px; margin: 0;">No recipes match your filters</p>
                <button onclick="clearFilters()" style="margin-top: 20px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Clear Filters
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredRecipes.map(recipe => {
        const isCustom = recipe.id.startsWith('CR');
        const dietary = recipe.dietary || {};
        const dietaryIcons = [];
        
        if (dietary.vegetarian) dietaryIcons.push('🥬');
        if (dietary.vegan) dietaryIcons.push('🌱');
        if (dietary.nuts) dietaryIcons.push('🥜');
        if (dietary.dairy) dietaryIcons.push('🥛');
        if (dietary.gluten) dietaryIcons.push('🌾');
        
        return `
            <div class="recipe-card" onclick="openRecipeModal('${recipe.id}')" style="background: white; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.3s; border: 2px solid #f0f0f0;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 12px;">
                    <div style="font-size: 48px;">${recipe.display.emoji}</div>
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 4px 0; color: #2c3e50; font-size: 18px;">${recipe.name}</h3>
                        ${isCustom ? '<span style="background: #ffd700; color: #333; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">CUSTOM</span>' : ''}
                    </div>
                </div>
                
                <p style="margin: 0 0 12px 0; color: #666; font-size: 14px; line-height: 1.4;">
                    ${recipe.display.description}
                </p>
                
                ${dietaryIcons.length > 0 ? `
                    <div style="display: flex; gap: 6px; margin-bottom: 12px;">
                        ${dietaryIcons.map(icon => `<span style="font-size: 20px;">${icon}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div style="display: flex; gap: 8px; align-items: center; font-size: 13px; color: #888;">
                    <span>⏱️ ${recipe.display.time}</span>
                    <span>•</span>
                    <span>👥 ${recipe.display.servings}</span>
                </div>
            </div>
        `;
    }).join('');
    
    // Add hover effects
    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
            this.style.borderColor = '#667eea';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
            this.style.borderColor = '#f0f0f0';
        });
    });
}

// ===================================
// CUSTOM RECIPE MODAL
// ===================================

function createCustomRecipeModal() {
    const modalHTML = `
        <div id="customRecipeModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; overflow-y: auto;">
            <div class="modal-content" style="background: white; max-width: 1000px; margin: 40px auto; border-radius: 16px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                <h2 id="customRecipeModalTitle" style="margin: 0 0 25px 0; color: #2c3e50; font-size: 26px; border-bottom: 3px solid #667eea; padding-bottom: 15px;">
                    ➕ Add Custom Recipe
                </h2>
                
                <div id="customRecipeForm" style="display: flex; flex-direction: column; gap: 30px;">
                    <!-- Recipe ID (auto-generated) - HIDDEN FROM USERS -->
                    <div style="display: none;">
                        <input type="text" id="customRecipeId" readonly>
                    </div>
                    
                    <!-- Row 1: Recipe Name, Emoji, Category -->
                    <div style="display: grid; grid-template-columns: 1.5fr 1.5fr 1.5fr; gap: 15px;">
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #555;">Recipe Name *</label>
                            <input type="text" id="customRecipeName" placeholder="e.g. Lemon Herb Chicken" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #555;">Emoji *</label>
                            <input type="text" id="customRecipeEmoji" placeholder="🍗" maxlength="2" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #555;">Category *</label>
                            <select id="customRecipeCategory" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                                <option value="">-- Select Category --</option>
                                <option value="breakfast">🍳 Breakfast</option>
                                <option value="main">🍽️ Main Meal</option>
                                <option value="batch">🍲 Batch Cook</option>
                                <option value="drink">🥤 Drink</option>
                                <option value="snacks">🍎 Snacks</option>
                                <option value="rewards">🍪 Rewards</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Row 2: Serves, Prep Time, Cook Time -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #555;">Serves *</label>
                            <input type="text" id="customRecipeServings" placeholder="1" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #555;">Prep Time *</label>
                            <input type="text" id="customRecipeTime" placeholder="10 mins" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #555;">Cook Time *</label>
                            <input type="text" id="customRecipeCookTime" placeholder="20 mins" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <!-- Dietary Tags -->
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 10px; color: #555;">Dietary Tags</label>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" id="customDietaryVegetarian" style="width: 18px; height: 18px;">
                                <span>🥬 Vegetarian</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" id="customDietaryVegan" style="width: 18px; height: 18px;">
                                <span>🌱 Vegan</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" id="customDietaryNuts" style="width: 18px; height: 18px;">
                                <span>🥜 Contains Nuts</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" id="customDietaryDairy" style="width: 18px; height: 18px;">
                                <span>🥛 Contains Dairy</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                <input type="checkbox" id="customDietaryGluten" style="width: 18px; height: 18px;">
                                <span>🌾 Contains Gluten</span>
                            </label>
                        </div>
                    </div>
                    
                    <!-- INGREDIENT SELECTOR - Two Panel Design (FULL WIDTH) -->
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 10px; color: #555;">Ingredients</label>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; height: 280px;">
                            <!-- LEFT PANEL: Product Selection -->
                            <div style="border: 2px solid #e0e0e0; border-radius: 8px; padding: 15px; background: #fafafa; display: flex; flex-direction: column; height: 92%;">
                                <input type="text" id="ingredientSearch" placeholder="🔍 Search products..." style="width: 100%; max-width: 400px; padding: 8px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px; margin-bottom: 10px; box-sizing: border-box;">
                                
                                <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
                                    <button type="button" class="category-filter active" data-category="all" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">All</button>
                                    <button type="button" class="category-filter" data-category="dairy" style="padding: 6px 12px; background: #e0e0e0; color: #666; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Dairy</button>
                                    <button type="button" class="category-filter" data-category="grains" style="padding: 6px 12px; background: #e0e0e0; color: #666; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Grains</button>
                                    <button type="button" class="category-filter" data-category="vegetables" style="padding: 6px 12px; background: #e0e0e0; color: #666; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Veg</button>
                                    <button type="button" class="category-filter" data-category="meat" style="padding: 6px 12px; background: #e0e0e0; color: #666; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Meat</button>
                                </div>
                                
                                <div id="productList" style="overflow-y: auto; display: flex; flex-direction: column; gap: 5px; flex: 1; max-height: 150px;">
                                    <!-- Products will be populated here -->
                                </div>
                                
                                <!-- Can't find it button -->
                                <button type="button" onclick="openProductManagementFromRecipe()" style="margin-top: 10px; padding: 10px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;"
                                        onmouseenter="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 8px rgba(217, 119, 6, 0.3)';"
                                        onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                                    <span>➕</span>
                                    <span>Can't find it? Add custom ingredient</span>
                                </button>
                            </div>
                            
                            <!-- RIGHT PANEL: Selected Ingredients -->
                            <div style="border: 2px solid #667eea; border-radius: 8px; padding: 15px; background: white; display: flex; flex-direction: column; height: 92%;">
                                <div style="font-weight: 600; color: #667eea; margin-bottom: 10px; font-size: 14px;">Selected Ingredients:</div>
                                <div id="selectedIngredients" style="overflow-y: auto; display: flex; flex-direction: column; gap: 8px; flex: 1; max-height: 210px;">
                                    <!-- Selected ingredients will appear here -->
                                    <div style="color: #999; font-size: 13px; text-align: center; padding: 20px;">Click products on the left to add them</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Row: Short Description and Instructions (side by side) -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #555;">Short Description *</label>
                            <textarea id="customRecipeDescription" rows="6" placeholder="A quick summary shown on cards..." style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #555;">Instructions (one step per line) *</label>
                            <textarea id="customRecipeInstructions" rows="6" placeholder="Marinate chicken&#10;Sear for 6 min each side&#10;Rest and serve" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
                        </div>
                    </div>
                    
                    <!-- Row: Optional Tips and Video URL -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #555;">Optional Tips (one per line)</label>
                            <textarea id="customRecipeTips" rows="4" placeholder="Add marinade before cooking&#10;Swap chicken for tofu" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; resize: vertical;"></textarea>
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #555;">Video URL (optional)</label>
                            <input type="url" id="customRecipeVideo" placeholder="https://youtube.com/..." style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; margin-bottom: 10px;">
                            
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #555;">Nutrition (optional)</label>
                            <input type="text" id="customRecipeNutrition" placeholder="Per serving: 450 cal, 30g protein..." style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                        </div>
                    </div>
                    
                    <!-- Buttons -->
                    <div style="display: flex; gap: 12px; margin-top: 10px;">
                        <button onclick="closeCustomRecipeModal()" style="flex: 1; padding: 14px; background: #f0f0f0; color: #333; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px;">
                            Cancel
                        </button>
                        <button onclick="saveCustomRecipe()" style="flex: 2; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px;">
                            💾 Save Custom Recipe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openCustomRecipeModal(recipeId = null) {
    const modal = document.getElementById('customRecipeModal');
    modal.style.display = 'block';
    
    // Check if we're restoring from Product Management
    if (tempRecipeFormData && !recipeId) {
        restoreRecipeFormData();
        return;
    }
    
    if (recipeId) {
        // Edit mode
        editingRecipeId = recipeId;
        const recipe = getRecipe(recipeId);
        
        document.getElementById('customRecipeModalTitle').textContent = '✏️ Edit Custom Recipe';
        document.getElementById('customRecipeId').value = recipe.id;
        document.getElementById('customRecipeName').value = recipe.name;
        document.getElementById('customRecipeCategory').value = recipe.category;
        document.getElementById('customRecipeDescription').value = recipe.display.description;
        document.getElementById('customRecipeTime').value = recipe.display.time;
        if (document.getElementById('customRecipeCookTime')) {
            document.getElementById('customRecipeCookTime').value = recipe.display.cookTime || '';
        }
        document.getElementById('customRecipeServings').value = recipe.display.servings;
        document.getElementById('customRecipeEmoji').value = recipe.display.emoji;
        document.getElementById('customRecipeInstructions').value = recipe.display.instructions || '';
        if (document.getElementById('customRecipeTips')) {
            document.getElementById('customRecipeTips').value = recipe.display.tips || '';
        }
        document.getElementById('customRecipeVideo').value = recipe.display.video || '';
        if (document.getElementById('customRecipeNutrition')) {
            document.getElementById('customRecipeNutrition').value = recipe.display.nutrition || '';
        }
        
        // Dietary tags
        const dietary = recipe.dietary || {};
        document.getElementById('customDietaryVegetarian').checked = dietary.vegetarian || false;
        document.getElementById('customDietaryVegan').checked = dietary.vegan || false;
        document.getElementById('customDietaryNuts').checked = dietary.nuts || false;
        document.getElementById('customDietaryDairy').checked = dietary.dairy || false;
        document.getElementById('customDietaryGluten').checked = dietary.gluten || false;
        
        // Load ingredients
        loadIngredientsIntoForm(recipe.ingredients);
    } else {
        // Add mode
        editingRecipeId = null;
        document.getElementById('customRecipeModalTitle').textContent = '➕ Add Custom Recipe';
        
        // Generate next CR ID
        const nextId = getNextCustomRecipeId();
        document.getElementById('customRecipeId').value = nextId;
        
        // Clear form
        document.getElementById('customRecipeName').value = '';
        document.getElementById('customRecipeCategory').value = '';
        document.getElementById('customRecipeDescription').value = '';
        document.getElementById('customRecipeTime').value = '';
        if (document.getElementById('customRecipeCookTime')) {
            document.getElementById('customRecipeCookTime').value = '';
        }
        document.getElementById('customRecipeServings').value = '';
        document.getElementById('customRecipeEmoji').value = '';
        document.getElementById('customRecipeInstructions').value = '';
        if (document.getElementById('customRecipeTips')) {
            document.getElementById('customRecipeTips').value = '';
        }
        document.getElementById('customRecipeVideo').value = '';
        if (document.getElementById('customRecipeNutrition')) {
            document.getElementById('customRecipeNutrition').value = '';
        }
        document.getElementById('customDietaryVegetarian').checked = false;
        document.getElementById('customDietaryVegan').checked = false;
        document.getElementById('customDietaryNuts').checked = false;
        document.getElementById('customDietaryDairy').checked = false;
        document.getElementById('customDietaryGluten').checked = false;
        
        // Load empty ingredient row
        loadIngredientsIntoForm([]);
    }
}

function closeCustomRecipeModal() {
    document.getElementById('customRecipeModal').style.display = 'none';
    editingRecipeId = null;
}

// Temporary storage for recipe form when switching to Product Management
let tempRecipeFormData = null;

// Open Product Management from recipe modal
function openProductManagementFromRecipe() {
    // Save current form state
    tempRecipeFormData = {
        id: document.getElementById('customRecipeId').value,
        name: document.getElementById('customRecipeName').value,
        category: document.getElementById('customRecipeCategory').value,
        description: document.getElementById('customRecipeDescription').value,
        time: document.getElementById('customRecipeTime').value,
        cookTime: document.getElementById('customRecipeCookTime')?.value || '',
        servings: document.getElementById('customRecipeServings').value,
        emoji: document.getElementById('customRecipeEmoji').value,
        instructions: document.getElementById('customRecipeInstructions').value,
        tips: document.getElementById('customRecipeTips')?.value || '',
        video: document.getElementById('customRecipeVideo').value,
        nutrition: document.getElementById('customRecipeNutrition')?.value || '',
        vegetarian: document.getElementById('customDietaryVegetarian').checked,
        vegan: document.getElementById('customDietaryVegan').checked,
        nuts: document.getElementById('customDietaryNuts').checked,
        dairy: document.getElementById('customDietaryDairy').checked,
        gluten: document.getElementById('customDietaryGluten').checked,
        ingredients: [...selectedIngredientsData],
        editingRecipeId: editingRecipeId
    };
    
    // Close custom recipe modal
    document.getElementById('customRecipeModal').style.display = 'none';
    
    // Open Product Management
    if (typeof openProductManagement === 'function') {
        openProductManagement();
        showToast('💡 After adding ingredients, click "Add Custom Recipe" to return to your recipe');
    } else {
        alert('⚠️ Product Management not available. Please check that product-management.js is loaded.');
    }
}

// Restore recipe form when reopening (call this in openCustomRecipeModal if tempRecipeFormData exists)
function restoreRecipeFormData() {
    if (!tempRecipeFormData) return false;
    
    const data = tempRecipeFormData;
    editingRecipeId = data.editingRecipeId;
    
    // Set modal title
    document.getElementById('customRecipeModalTitle').textContent = editingRecipeId ? '✏️ Edit Custom Recipe' : '➕ Add Custom Recipe';
    
    document.getElementById('customRecipeId').value = data.id;
    document.getElementById('customRecipeName').value = data.name;
    document.getElementById('customRecipeCategory').value = data.category;
    document.getElementById('customRecipeDescription').value = data.description;
    document.getElementById('customRecipeTime').value = data.time;
    if (document.getElementById('customRecipeCookTime')) {
        document.getElementById('customRecipeCookTime').value = data.cookTime;
    }
    document.getElementById('customRecipeServings').value = data.servings;
    document.getElementById('customRecipeEmoji').value = data.emoji;
    document.getElementById('customRecipeInstructions').value = data.instructions;
    if (document.getElementById('customRecipeTips')) {
        document.getElementById('customRecipeTips').value = data.tips;
    }
    document.getElementById('customRecipeVideo').value = data.video;
    if (document.getElementById('customRecipeNutrition')) {
        document.getElementById('customRecipeNutrition').value = data.nutrition;
    }
    
    document.getElementById('customDietaryVegetarian').checked = data.vegetarian;
    document.getElementById('customDietaryVegan').checked = data.vegan;
    document.getElementById('customDietaryNuts').checked = data.nuts;
    document.getElementById('customDietaryDairy').checked = data.dairy;
    document.getElementById('customDietaryGluten').checked = data.gluten;
    
    selectedIngredientsData = data.ingredients;
    renderSelectedIngredients();
    
    // Clear temp data
    tempRecipeFormData = null;
    
    return true;
}

// ===================================
// INGREDIENT MANAGEMENT - TWO PANEL SYSTEM
// ===================================

let selectedIngredientsData = [];
let currentCategoryFilter = 'all';
let currentSearchTerm = '';

// Initialize ingredient selector when modal opens
function initializeIngredientSelector() {
    // Setup search
    const searchInput = document.getElementById('ingredientSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.toLowerCase();
            filterAndDisplayProducts();
        });
    }
    
    // Setup category filters
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-filter').forEach(b => {
                b.style.background = '#e0e0e0';
                b.style.color = '#666';
                b.classList.remove('active');
            });
            btn.style.background = '#667eea';
            btn.style.color = 'white';
            btn.classList.add('active');
            currentCategoryFilter = btn.dataset.category;
            filterAndDisplayProducts();
        });
    });
    
    // Initial product list
    filterAndDisplayProducts();
}

function filterAndDisplayProducts() {
    const productList = document.getElementById('productList');
    if (!productList) return;
    
    // Only show products if user is searching or filtering
    if (!currentSearchTerm && currentCategoryFilter === 'all') {
        productList.innerHTML = '<div style="color: #999; font-size: 13px; text-align: center; padding: 40px 20px; line-height: 1.6;">🔍<br>Search or filter to see products</div>';
        return;
    }
    
    const products = Object.keys(CANONICAL_PRODUCTS).map(key => ({
        key: key,
        ...CANONICAL_PRODUCTS[key]
    }));
    
    // Simple category detection based on canonical key prefixes/patterns
    const getCategory = (key, name) => {
        const keyLower = key.toLowerCase();
        const nameLower = name.toLowerCase();
        
        if (keyLower.includes('milk') || keyLower.includes('cheese') || keyLower.includes('butter') || keyLower.includes('yogurt') || keyLower.includes('cream')) return 'dairy';
        if (keyLower.includes('rice') || keyLower.includes('pasta') || keyLower.includes('bread') || keyLower.includes('flour') || keyLower.includes('oats') || keyLower.includes('buckwheat')) return 'grains';
        if (keyLower.includes('chicken') || keyLower.includes('beef') || keyLower.includes('pork') || keyLower.includes('meat') || keyLower.includes('bacon') || keyLower.includes('sausage')) return 'meat';
        if (keyLower.includes('tomato') || keyLower.includes('onion') || keyLower.includes('garlic') || keyLower.includes('pepper') || keyLower.includes('carrot') || keyLower.includes('potato')) return 'vegetables';
        return 'other';
    };
    
    // Filter by search
    let filtered = products.filter(p => {
        if (currentSearchTerm) {
            return p.name.toLowerCase().includes(currentSearchTerm);
        }
        return true;
    });
    
    // Filter by category
    if (currentCategoryFilter !== 'all') {
        filtered = filtered.filter(p => getCategory(p.key, p.name) === currentCategoryFilter);
    }
    
    // Sort alphabetically
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    
    // Render product list
    productList.innerHTML = filtered.map(p => `
        <div onclick="addIngredientToSelection('${p.key}')" style="padding: 8px 10px; background: white; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s;" 
             onmouseenter="this.style.background='#f0f0ff'; this.style.borderColor='#667eea';"
             onmouseleave="this.style.background='white'; this.style.borderColor='#e0e0e0';">
            ${p.name}
        </div>
    `).join('');
    
    if (filtered.length === 0) {
        productList.innerHTML = '<div style="color: #999; font-size: 13px; text-align: center; padding: 20px;">No products found</div>';
    }
}

function addIngredientToSelection(canonicalKey) {
    // Check if already added
    if (selectedIngredientsData.find(ing => ing.canonicalKey === canonicalKey)) {
        return;
    }
    
    const product = CANONICAL_PRODUCTS[canonicalKey];
    
    // Add to data array
    selectedIngredientsData.push({
        canonicalKey: canonicalKey,
        name: product.name,
        qty: '',
        unit: product.baseUnit
    });
    
    renderSelectedIngredients();
}

function removeIngredientFromSelection(canonicalKey) {
    selectedIngredientsData = selectedIngredientsData.filter(ing => ing.canonicalKey !== canonicalKey);
    renderSelectedIngredients();
}

function updateIngredientQty(canonicalKey, qty) {
    const ing = selectedIngredientsData.find(i => i.canonicalKey === canonicalKey);
    if (ing) {
        ing.qty = qty;
    }
}

function updateIngredientUnit(canonicalKey, unit) {
    const ing = selectedIngredientsData.find(i => i.canonicalKey === canonicalKey);
    if (ing) {
        ing.unit = unit;
    }
}

function renderSelectedIngredients() {
    const container = document.getElementById('selectedIngredients');
    if (!container) return;
    
    if (selectedIngredientsData.length === 0) {
        container.innerHTML = '<div style="color: #999; font-size: 13px; text-align: center; padding: 20px;">Click products on the left to add them</div>';
        return;
    }
    
    container.innerHTML = selectedIngredientsData.map(ing => `
        <div style="display: grid; grid-template-columns: 60px 60px auto; gap: 8px; align-items: center; padding: 8px; background: #f9f9f9; border-radius: 6px;">
            <input type="number" 
                   value="${ing.qty}" 
                   placeholder="Qty" 
                   min="0" 
                   step="0.01"
                   oninput="updateIngredientQty('${ing.canonicalKey}', this.value)"
                   style="width: 100%; padding: 6px; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 12px;">
            <select onchange="updateIngredientUnit('${ing.canonicalKey}', this.value)" style="width: 100%; padding: 6px; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 12px;">
                <option value="g" ${ing.unit === 'g' ? 'selected' : ''}>g</option>
                <option value="ml" ${ing.unit === 'ml' ? 'selected' : ''}>ml</option>
                <option value="count" ${ing.unit === 'count' ? 'selected' : ''}>count</option>
                <option value="slices" ${ing.unit === 'slices' ? 'selected' : ''}>slices</option>
                <option value="tbsp" ${ing.unit === 'tbsp' ? 'selected' : ''}>tbsp</option>
                <option value="tsp" ${ing.unit === 'tsp' ? 'selected' : ''}>tsp</option>
            </select>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="flex: 1; font-size: 13px; color: #333;">${ing.name}</span>
                <button type="button" onclick="removeIngredientFromSelection('${ing.canonicalKey}')" style="padding: 4px 8px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">✕</button>
            </div>
        </div>
    `).join('');
}

function collectIngredients() {
    return selectedIngredientsData.filter(ing => ing.qty && parseFloat(ing.qty) > 0).map(ing => ({
        canonicalKey: ing.canonicalKey,
        qty: parseFloat(ing.qty),
        unit: ing.unit,
        display: `${ing.qty}${ing.unit} ${ing.name}`
    }));
}

function loadIngredientsIntoForm(ingredients) {
    selectedIngredientsData = [];
    
    if (ingredients && ingredients.length > 0) {
        ingredients.forEach(ing => {
            selectedIngredientsData.push({
                canonicalKey: ing.canonicalKey,
                name: CANONICAL_PRODUCTS[ing.canonicalKey]?.name || ing.name || '',
                qty: ing.qty,
                unit: ing.unit
            });
        });
    }
    
    // Initialize the selector after a short delay to ensure DOM is ready
    setTimeout(() => {
        initializeIngredientSelector();
        renderSelectedIngredients();
    }, 100);
}

function saveCustomRecipe() {
    const id = document.getElementById('customRecipeId').value;
    const name = document.getElementById('customRecipeName').value.trim();
    const category = document.getElementById('customRecipeCategory').value;
    const description = document.getElementById('customRecipeDescription').value.trim();
    const time = document.getElementById('customRecipeTime').value.trim();
    const cookTime = document.getElementById('customRecipeCookTime') ? document.getElementById('customRecipeCookTime').value.trim() : '';
    const servings = document.getElementById('customRecipeServings').value.trim();
    const emoji = document.getElementById('customRecipeEmoji').value.trim();
    const instructions = document.getElementById('customRecipeInstructions').value.trim();
    const tips = document.getElementById('customRecipeTips') ? document.getElementById('customRecipeTips').value.trim() : '';
    const video = document.getElementById('customRecipeVideo').value.trim();
    const nutrition = document.getElementById('customRecipeNutrition') ? document.getElementById('customRecipeNutrition').value.trim() : '';
    
    // Validation
    if (!name || !category || !description || !time || !servings || !emoji) {
        alert('Please fill in all required fields (marked with *)');
        return;
    }
    
    // Collect ingredients
    const ingredients = collectIngredients();
    
    // Build recipe object
    const recipe = {
        id: id,
        name: name,
        category: category,
        display: {
            emoji: emoji,
            description: description,
            time: time,
            cookTime: cookTime,
            servings: servings,
            instructions: instructions,
            tips: tips,
            video: video || '',
            nutrition: nutrition || null
        },
        dietary: {
            vegetarian: document.getElementById('customDietaryVegetarian').checked,
            vegan: document.getElementById('customDietaryVegan').checked,
            nuts: document.getElementById('customDietaryNuts').checked,
            dairy: document.getElementById('customDietaryDairy').checked,
            gluten: document.getElementById('customDietaryGluten').checked
        },
        ingredients: ingredients,
        aiPrompt: 'custom recipe'
    };
    
    // Save recipe
    if (typeof saveRecipe === 'function') {
        saveRecipe(recipe);
        closeCustomRecipeModal();
        renderRecipeGrid();
        alert(`✅ Custom recipe "${name}" saved!`);
    } else {
        alert('Error: saveRecipe function not found');
    }
}

function getNextCustomRecipeId() {
    if (typeof getAllRecipes !== 'function') return 'CR1';
    
    const allRecipes = getAllRecipes();
    const customRecipes = Object.keys(allRecipes).filter(id => id.startsWith('CR'));
    
    if (customRecipes.length === 0) return 'CR1';
    
    const numbers = customRecipes.map(id => parseInt(id.substring(2)));
    const maxNumber = Math.max(...numbers);
    
    return `CR${maxNumber + 1}`;
}

// Save recipe to localStorage
function saveRecipe(recipe) {
    // Get existing custom recipes
    const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '{}');
    
    // Add or update this recipe
    customRecipes[recipe.id] = recipe;
    
    // Save back to localStorage
    localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
    
    console.log(`✅ Recipe ${recipe.id} saved to localStorage`);
}

// Delete recipe from localStorage and modal
function deleteFromRecipeModal(recipeId) {
    if (!confirm(`Delete recipe "${recipeId}"?`)) return;
    
    // Get existing custom recipes
    const customRecipes = JSON.parse(localStorage.getItem('customRecipes') || '{}');
    
    // Delete this recipe
    delete customRecipes[recipeId];
    
    // Save back to localStorage
    localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
    
    // Close modal
    closeRecipeModal();
    
    // Refresh recipe grid
    renderRecipeGrid();
    
    showToast(`🗑️ Recipe ${recipeId} deleted`);
}

// ===================================
// RECIPE DETAIL MODAL
// ===================================

function openRecipeModal(recipeId) {
    const recipe = getRecipe(recipeId);
    if (!recipe) {
        alert('Recipe not found');
        return;
    }
    
    console.log('Opening recipe:', recipeId);
    console.log('Recipe data:', recipe);
    console.log('Recipe.ingredients:', recipe.ingredients);
    console.log('Recipe.display.ingredients:', recipe.display?.ingredients);
    
    const isCustom = recipeId.startsWith('CR');
    
    const modal = document.createElement('div');
    modal.id = 'recipeModal';
    modal.className = 'modal';
    modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; overflow-y: auto; padding: 20px; align-items: flex-start; justify-content: center;';
    modal.onclick = (e) => { if (e.target === modal) closeRecipeModal(); };
    
    // Build ingredients list - check both locations
    let ingredientsHTML = '';
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        // New structure: recipe.ingredients[]
        console.log('Using new ingredients structure');
        ingredientsHTML = recipe.ingredients.map(ing => {
            console.log('Ingredient:', ing);
            // Handle both formats: display field OR name/qty/unit fields
            const displayText = ing.display || `${ing.qty}${ing.unit} ${ing.name}`;
            return `<li>${displayText}</li>`;
        }).join('');
    } else if (recipe.display && recipe.display.ingredients && Array.isArray(recipe.display.ingredients)) {
        // Old structure: recipe.display.ingredients[]
        console.log('Using old ingredients structure');
        ingredientsHTML = recipe.display.ingredients.map(ing => `<li>${ing}</li>`).join('');
    } else {
        console.warn('No ingredients found in recipe!');
    }
    
    console.log('Ingredients HTML length:', ingredientsHTML.length);
    
    // Build instructions list
    let instructionsHTML = '';
    if (recipe.display.instructions && Array.isArray(recipe.display.instructions)) {
        instructionsHTML = recipe.display.instructions.map(step => `<li>${step}</li>`).join('');
    }
    
    // Build tips section
    let tipsHTML = '';
    if (recipe.display.tips && Array.isArray(recipe.display.tips) && recipe.display.tips.length > 0) {
        tipsHTML = `
            <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 20px;">💡 Tips</h3>
            <div style="background: #fff8e1; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
                ${recipe.display.tips.map(tip => `<p style="margin: 0 0 8px 0; color: #5d4037; font-size: 14px; line-height: 1.6;">${tip}</p>`).join('')}
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; max-width: 900px; width: 100%; margin: 20px auto; position: relative; padding: 30px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; color: white; text-align: center; position: relative; margin: -30px -30px 20px -30px;">
                <button onclick="closeRecipeModal()" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.2); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px; font-weight: bold;">✕</button>
                <div style="font-size: 64px; margin-bottom: 10px;">${recipe.display.emoji}</div>
                <h2 style="margin: 0 0 10px 0; font-size: 28px;">${recipe.name}</h2>
                <p style="margin: 0; color: rgba(255,255,255,0.95); font-size: 16px; line-height: 1.5;">${recipe.display.description}</p>
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 15px;">
                    <span style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 8px;">⏱️ ${recipe.prepTime || 'N/A'} + ${recipe.cookTime || 'N/A'}</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 8px;">🍽️ Serves ${recipe.serves || 'N/A'}</span>
                </div>
            </div>
            
            <div style="padding: 30px;">
                <!-- Ingredients -->
                <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 20px;">🛒 Ingredients</h3>
                <ul style="list-style: none; padding: 0; margin: 0 0 25px 0;">
                    ${ingredientsHTML || '<li>No ingredients listed</li>'}
                </ul>
                
                <!-- Instructions -->
                <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 20px;">👨‍🍳 Instructions</h3>
                <ol style="padding-left: 20px; margin: 0 0 25px 0;">
                    ${instructionsHTML}
                </ol>
                
                <!-- Tips -->
                ${tipsHTML}
                
                <!-- Video -->
                ${recipe.display.video ? `
                    <a href="${recipe.display.video}" target="_blank" style="display: block; text-decoration: none; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 14px 20px; border-radius: 8px; text-align: center; font-weight: 600; font-size: 15px; margin-bottom: 15px; transition: all 0.2s;">
                        📺 Watch Video Tutorial
                    </a>
                ` : `
                    <div style="background: #f5f5f5; border: 2px solid #e0e0e0; padding: 14px 20px; border-radius: 8px; text-align: center; color: #999; font-weight: 600; font-size: 15px; margin-bottom: 15px;">
                        📺 No video available yet
                    </div>
                `}
                
                <!-- Nutrition -->
                ${recipe.display.nutrition ? `
                    <div style="background: #e8f5e9; padding: 12px; border-radius: 8px; color: #2e7d32;">
                        🥗 ${recipe.display.nutrition}
                    </div>
                ` : ''}
                
                <!-- Buttons -->
                <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: flex-end;">
                    ${isCustom ? `
                        <button onclick="closeRecipeModal(); openCustomRecipeModal('${recipe.id}');" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">✏️ Edit</button>
                        <button onclick="deleteFromRecipeModal('${recipe.id}')" style="padding: 12px 24px; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">🗑️ Delete</button>
                    ` : ''}
                    <button onclick="addRecipeToThisWeek('${recipe.id}')" style="padding: 12px 24px; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px;">✅ Add to This Week</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add proper list styling
    const style = document.createElement('style');
    style.textContent = `
        #recipeModal ul li {
            padding: 10px;
            background: #f8f9fa;
            margin-bottom: 8px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #recipeModal ul li::before {
            content: '';
            width: 8px;
            height: 8px;
            background: #667eea;
            border-radius: 50%;
            flex-shrink: 0;
        }
        #recipeModal ol li {
            padding: 12px 0;
            line-height: 1.6;
            border-bottom: 1px solid #f0f0f0;
        }
    `;
    document.head.appendChild(style);
}

function closeRecipeModal() {
    const modal = document.getElementById('recipeModal');
    if (modal) modal.remove();
}

// ===================================
// THIS WEEK TAB - FIXED DELETION
// ===================================

function addRecipeToThisWeek(recipeId, options = {}) {
    // Don't add duplicates, but don't show alert either
    if (!selectedRecipesThisWeek.includes(recipeId)) {
        selectedRecipesThisWeek.push(recipeId);
        saveSelectedRecipes();
        
        // Only show UI feedback if not silent
        if (!options.silent) {
            closeRecipeModal();
            
            // Switch to This Week tab
            document.querySelector('.recipe-tab[data-tab="thisweek"]').click();
            
            alert('✅ Recipe added to This Week!');
        }
    } else if (!options.silent) {
        // Recipe already in This Week - just close modal, no alert
        closeRecipeModal();
    }
}

function removeRecipeFromThisWeek(recipeId) {
    // Filter out the recipe
    selectedRecipesThisWeek = selectedRecipesThisWeek.filter(id => id !== recipeId);
    
    // Save immediately
    saveSelectedRecipes();
    
    // Re-render
    renderThisWeekRecipes();
}

function renderThisWeekRecipes() {
    const container = document.getElementById('thisWeekRecipes');
    if (!container) return;
    
    const missingIds = [];
    
    if (selectedRecipesThisWeek.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <p style="font-size: 48px; margin: 0 0 20px 0;">🍽️</p>
                <p style="font-size: 18px; color: #666; margin: 0 0 10px 0;">No recipes selected this week</p>
                <p style="font-size: 14px; color: #999; margin: 0 0 20px 0;">Browse the Recipe Library and add recipes, or import a schedule with recipes!</p>
                <button onclick="document.querySelector('.recipe-tab[data-tab=\\'library\\']').click()" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Browse Recipe Library
                </button>
            </div>
        `;
        return;
    }
    
    let html = '<div style="display: grid; gap: 25px;">';
    
    selectedRecipesThisWeek.forEach(recipeId => {
        const recipe = getRecipe(recipeId);
        if (!recipe) {
            missingIds.push(recipeId);
            return;
        }
        
        html += `
            <div style="background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="font-size: 48px;">${recipe.display.emoji}</div>
                        <div>
                            <h3 style="margin: 0 0 5px 0; color: #2c3e50; font-size: 22px;">${recipe.name}</h3>
                            <p style="margin: 0; color: #666; font-size: 14px;">${recipe.display.description}</p>
                        </div>
                    </div>
                    <button onclick="event.stopPropagation(); removeRecipeFromThisWeek('${recipe.id}')" style="background: #ff6b6b; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; flex-shrink: 0;">
                        ✕ Remove
                    </button>
                </div>
                
                <button onclick="openRecipeModal('${recipe.id}')" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                    👁️ View Full Recipe
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Clean up missing recipes
    if (missingIds.length > 0) {
        selectedRecipesThisWeek = selectedRecipesThisWeek.filter(id => !missingIds.includes(id));
        saveSelectedRecipes();
    }
}

function saveSelectedRecipes() {
    localStorage.setItem('selectedRecipesThisWeek', JSON.stringify(selectedRecipesThisWeek));
}

function loadSelectedRecipes() {
    const saved = localStorage.getItem('selectedRecipesThisWeek');
    if (saved) {
        try {
            selectedRecipesThisWeek = JSON.parse(saved);
        } catch (e) {
            selectedRecipesThisWeek = [];
        }
    }
}

// ===================================
// SHOPPING LIST GENERATION (RECIPES)
// ===================================


// ===================================
// INITIALIZE ON LOAD
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    loadSelectedRecipes();
    
    // Wait for RECIPE_DATABASE to load
    if (typeof RECIPE_DATABASE !== 'undefined') {
        initializeRecipeLibrary();
    } else {
        // Retry after a short delay
        setTimeout(() => {
            initializeRecipeLibrary();
        }, 100);
    }
});

console.log('✅ Recipe Display UI loaded!');

// Switch to Recipes tab and specific section
function switchToRecipesTab(section) {
    // Switch main tab to Recipes
    document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.dataset.tab === 'recipes') {
            btn.click();
        }
    });
    
    // Switch to specific recipe section
    setTimeout(() => {
        const tabBtn = document.querySelector(`.recipe-tab[data-tab="${section}"]`);
        if (tabBtn) {
            tabBtn.click();
        }
    }, 100);
}
