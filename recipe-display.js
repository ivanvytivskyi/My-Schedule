// ================================================
// RECIPE DISPLAY UI SYSTEM
// ================================================

let selectedRecipesThisWeek = [];
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
        
        <div class="recipe-actions-bar" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-bottom: 15px;">
            <div style="flex: 1; min-width: 220px; color: #4b5563; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 22px;">✨</span>
                <span>Save your own dishes as Custom Recipes (IDs auto-start at R50)</span>
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
                        <option value="batch">🍲 Batch Cook</option>
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
            <div id="recipeGrid" class="recipe-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                <!-- Cards generated by JS -->
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
    document.getElementById('filterVegetarian').addEventListener('change', (e) => {
        currentFilters.vegetarian = e.target.checked;
        renderRecipeGrid();
    });
    
    document.getElementById('filterVegan').addEventListener('change', (e) => {
        currentFilters.vegan = e.target.checked;
        renderRecipeGrid();
    });
    
    document.getElementById('filterNutFree').addEventListener('change', (e) => {
        currentFilters.nutFree = e.target.checked;
        renderRecipeGrid();
    });
    
    document.getElementById('filterDairyFree').addEventListener('change', (e) => {
        currentFilters.dairyFree = e.target.checked;
        renderRecipeGrid();
    });
    
    document.getElementById('filterGlutenFree').addEventListener('change', (e) => {
        currentFilters.glutenFree = e.target.checked;
        renderRecipeGrid();
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
    document.getElementById('filterVegetarian').checked = false;
    document.getElementById('filterVegan').checked = false;
    document.getElementById('filterNutFree').checked = false;
    document.getElementById('filterDairyFree').checked = false;
    document.getElementById('filterGlutenFree').checked = false;
    
    renderRecipeGrid();
}

function applyFilters(recipes) {
    return recipes.filter(recipe => {
        // Category filter
        if (currentFilters.category !== 'all' && recipe.category !== currentFilters.category) {
            return false;
        }
        
        // Dietary filters
        if (currentFilters.vegetarian && !recipe.dietary.vegetarian) return false;
        if (currentFilters.vegan && !recipe.dietary.vegan) return false;
        if (currentFilters.nutFree && recipe.dietary.nuts) return false;
        if (currentFilters.dairyFree && recipe.dietary.dairy) return false;
        if (currentFilters.glutenFree && recipe.dietary.gluten) return false;
        
        return true;
    });
}

// CUSTOM RECIPE HELPERS
// ===================================

function isCustomRecipeId(recipeId) {
    if (!recipeId || typeof recipeId !== 'string') return false;
    const numeric = parseInt(recipeId.replace(/[^\d]/g, ''), 10);
    return !isNaN(numeric) && numeric >= 50;
}

function refreshRecipeViews() {
    renderRecipeGrid();
    renderThisWeekRecipes();
}

function createCustomRecipeModal() {
    if (document.getElementById('customRecipeModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'customRecipeModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div style="display: flex; justify-content: space-between; gap: 10px; align-items: center; margin-bottom: 10px;">
                <h2 id="customRecipeModalTitle" style="margin: 0;">Add Custom Recipe</h2>
                <div style="display: flex; gap: 8px;">
                    <button type="button" onclick="closeCustomRecipeModal()" class="secondary-btn">✕ Close</button>
                    <button type="button" id="deleteCustomRecipeBtn" class="danger-btn" style="display: none;" onclick="confirmDeleteCustomRecipe()">🗑️ Delete</button>
                </div>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="customRecipeName">Recipe Name *</label>
                    <input type="text" id="customRecipeName" required placeholder="e.g., Lemon Herb Chicken" />
                </div>
                <div class="form-group">
                    <label for="customRecipeEmoji">Emoji *</label>
                    <input type="text" id="customRecipeEmoji" required placeholder="🍋" maxlength="4" />
                </div>
                <div class="form-group">
                    <label for="customRecipeCategory">Category *</label>
                    <select id="customRecipeCategory" required>
                        <option value="breakfast">🍳 Breakfast</option>
                        <option value="batch">🍲 Batch Cook</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="customRecipeServes">Serves *</label>
                    <input type="number" id="customRecipeServes" min="1" value="1" required />
                </div>
                <div class="form-group">
                    <label for="customPrepTime">Prep Time *</label>
                    <input type="text" id="customPrepTime" placeholder="10 mins" required />
                </div>
                <div class="form-group">
                    <label for="customCookTime">Cook Time *</label>
                    <input type="text" id="customCookTime" placeholder="20 mins" required />
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label for="customAiPrompt">AI Prompt (ingredients list) *</label>
                    <input type="text" id="customAiPrompt" placeholder="chicken:300g, rice:200g, garlic:3 cloves" required />
                </div>
            </div>
            
            <div class="form-group">
                <label>Dietary Tags</label>
                <div class="dietary-grid">
                    <label><input type="checkbox" id="customDietVegetarian" /> Vegetarian</label>
                    <label><input type="checkbox" id="customDietVegan" /> Vegan</label>
                    <label><input type="checkbox" id="customDietNuts" /> Contains Nuts</label>
                    <label><input type="checkbox" id="customDietDairy" /> Contains Dairy</label>
                    <label><input type="checkbox" id="customDietGluten" /> Contains Gluten</label>
                </div>
            </div>
            
            <div class="form-group">
                <label for="customDescription">Short Description *</label>
                <textarea id="customDescription" required placeholder="A quick summary shown on cards..."></textarea>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="customIngredients">Ingredients (one per line) *</label>
                    <textarea id="customIngredients" required placeholder="200g chicken breast&#10;1 tbsp olive oil&#10;Salt & pepper"></textarea>
                </div>
                <div class="form-group">
                    <label for="customInstructions">Instructions (one step per line) *</label>
                    <textarea id="customInstructions" required placeholder="Marinate chicken in oil and spices&#10;Sear for 6 minutes each side&#10;Rest, slice, and serve"></textarea>
                </div>
            </div>
            
            <div class="form-group">
                <label>Quick Add Mappings *</label>
                <p style="margin: 6px 0 12px 0; color: #6b7280; font-size: 13px;">Link ingredients to Quick Add items (shop → item → qty & unit). All mappings must be completed before saving.</p>
                <div id="quickAddMappings" style="display: flex; flex-direction: column; gap: 12px;"></div>
                <button type="button" class="secondary-btn" onclick="addQuickAddMappingRow()">➕ Add Mapping</button>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label for="customTips">Optional Tips (one per line)</label>
                    <textarea id="customTips" placeholder="Add marinade before cooking&#10;Swap chicken for tofu for vegan"></textarea>
                </div>
                <div class="form-group">
                    <label for="customVideo">Video URL (optional)</label>
                    <input type="url" id="customVideo" placeholder="https://www.youtube.com/watch?v=..." />
                    <label for="customNutrition" style="margin-top: 12px; display: block;">Nutrition (optional)</label>
                    <input type="text" id="customNutrition" placeholder="Per serving: 450 cal, 30g protein..." />
                </div>
            </div>
            
            <div class="modal-buttons" style="display: flex; gap: 10px; margin-top: 10px;">
                <button type="button" class="secondary-btn" onclick="closeCustomRecipeModal()">Cancel</button>
                <button type="button" class="primary-btn" onclick="saveCustomRecipe()">💾 Save Recipe</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function addQuickAddMappingRow(data = {}) {
    const container = document.getElementById('quickAddMappings');
    if (!container) return;
    
    const row = document.createElement('div');
    row.className = 'quick-add-row';
    row.innerHTML = `
        <div class="quick-add-grid">
            <div>
                <label style="font-size: 12px; color: #6b7280;">Shop</label>
                <select class="quick-add-shop" required>
                    <option value="">Select shop</option>
                </select>
            </div>
            <div>
                <label style="font-size: 12px; color: #6b7280;">Item</label>
                <select class="quick-add-item" required>
                    <option value="">Select item</option>
                </select>
            </div>
            <div>
                <label style="font-size: 12px; color: #6b7280;">Qty</label>
                <input type="number" class="quick-add-qty" min="0" step="0.01" placeholder="1" required />
            </div>
            <div>
                <label style="font-size: 12px; color: #6b7280;">Unit</label>
                <input type="text" class="quick-add-unit" placeholder="g, kg, pcs" required />
            </div>
            <button type="button" class="danger-btn" aria-label="Remove mapping">✕</button>
        </div>
    `;
    
    const shopSelect = row.querySelector('.quick-add-shop');
    const itemSelect = row.querySelector('.quick-add-item');
    const removeBtn = row.querySelector('.danger-btn');
    
    populateShopOptions(shopSelect, data.shop);
    populateItemOptions(itemSelect, shopSelect.value, data.itemName, data.category);
    
    shopSelect.addEventListener('change', () => {
        populateItemOptions(itemSelect, shopSelect.value);
    });
    
    removeBtn.addEventListener('click', () => {
        row.remove();
    });
    
    if (data.qtyNeeded !== undefined) {
        row.querySelector('.quick-add-qty').value = data.qtyNeeded;
    }
    if (data.unit) {
        row.querySelector('.quick-add-unit').value = data.unit;
    }
    
    container.appendChild(row);
}

function populateShopOptions(selectEl, selectedShop) {
    if (!selectEl) return;
    selectEl.innerHTML = '<option value="">Select shop</option>';
    const shops = quickAddProducts ? Object.keys(quickAddProducts) : [];
    
    shops.forEach(shop => {
        const option = document.createElement('option');
        option.value = shop;
        option.textContent = shop;
        if (selectedShop === shop) option.selected = true;
        selectEl.appendChild(option);
    });
    
    if (selectedShop && !shops.includes(selectedShop)) {
        const fallback = document.createElement('option');
        fallback.value = selectedShop;
        fallback.textContent = `${selectedShop} (custom)`;
        fallback.selected = true;
        selectEl.appendChild(fallback);
    }
}

function populateItemOptions(selectEl, shop, selectedItem, selectedCategory) {
    if (!selectEl) return;
    selectEl.innerHTML = '<option value="">Select item</option>';
    if (!shop || !quickAddProducts || !quickAddProducts[shop]) return;
    
    Object.entries(quickAddProducts[shop]).forEach(([category, items]) => {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.name;
            option.textContent = `${category} — ${item.name} (${item.unit})`;
            option.dataset.category = category;
            option.dataset.unit = item.unit || '';
            option.dataset.price = item.price ?? '';
            option.dataset.packsize = item.defaultQty || extractNumericFromUnit(item.unit) || 1;
            if (selectedItem === item.name && (!selectedCategory || selectedCategory === category)) {
                option.selected = true;
            }
            selectEl.appendChild(option);
        });
    });
    
    if (selectedItem && !selectEl.value) {
        const fallback = document.createElement('option');
        fallback.value = selectedItem;
        fallback.dataset.category = selectedCategory || 'Custom';
        fallback.textContent = `${selectedCategory || 'Custom'} — ${selectedItem}`;
        fallback.selected = true;
        selectEl.appendChild(fallback);
    }
}

function openCustomRecipeModal(recipeId = null) {
    const modal = document.getElementById('customRecipeModal');
    if (!modal) return;
    
    editingRecipeId = recipeId;
    const isEdit = Boolean(recipeId);
    const recipe = isEdit ? getRecipe(recipeId) : null;
    
    document.getElementById('customRecipeModalTitle').textContent = isEdit ? 'Edit Custom Recipe' : 'Add Custom Recipe';
    document.getElementById('deleteCustomRecipeBtn').style.display = isEdit ? 'inline-flex' : 'none';
    
    document.getElementById('customRecipeName').value = recipe?.name || '';
    document.getElementById('customRecipeEmoji').value = recipe?.display?.emoji || '';
    document.getElementById('customRecipeCategory').value = recipe?.category || 'breakfast';
    document.getElementById('customRecipeServes').value = recipe?.serves || 1;
    document.getElementById('customPrepTime').value = recipe?.prepTime || '';
    document.getElementById('customCookTime').value = recipe?.cookTime || '';
    document.getElementById('customAiPrompt').value = recipe?.aiPrompt || '';
    
    document.getElementById('customDietVegetarian').checked = recipe?.dietary?.vegetarian || false;
    document.getElementById('customDietVegan').checked = recipe?.dietary?.vegan || false;
    document.getElementById('customDietNuts').checked = recipe?.dietary?.nuts || false;
    document.getElementById('customDietDairy').checked = recipe?.dietary?.dairy || false;
    document.getElementById('customDietGluten').checked = recipe?.dietary?.gluten || false;
    
    document.getElementById('customDescription').value = recipe?.display?.description || '';
    document.getElementById('customIngredients').value = recipe?.display?.ingredients?.join('\n') || '';
    document.getElementById('customInstructions').value = recipe?.display?.instructions?.join('\n') || '';
    document.getElementById('customTips').value = recipe?.display?.tips?.join('\n') || '';
    document.getElementById('customVideo').value = recipe?.display?.video || '';
    document.getElementById('customNutrition').value = recipe?.display?.nutrition || '';
    
    const mappingsContainer = document.getElementById('quickAddMappings');
    mappingsContainer.innerHTML = '';
    const mappings = recipe?.quickAddItems && recipe.quickAddItems.length > 0 ? recipe.quickAddItems : [{}];
    mappings.forEach(mapping => addQuickAddMappingRow(mapping));
    
    modal.classList.add('active');
}

function closeCustomRecipeModal() {
    const modal = document.getElementById('customRecipeModal');
    if (modal) {
        modal.classList.remove('active');
    }
    editingRecipeId = null;
}

function collectQuickAddMappings() {
    const container = document.getElementById('quickAddMappings');
    const rows = Array.from(container.querySelectorAll('.quick-add-row'));
    const mappings = [];
    let hasError = false;
    
    rows.forEach(row => {
        const shop = row.querySelector('.quick-add-shop')?.value;
        const itemSelect = row.querySelector('.quick-add-item');
        const itemName = itemSelect?.value;
        const category = itemSelect?.selectedOptions?.[0]?.dataset.category;
        const qty = parseFloat(row.querySelector('.quick-add-qty')?.value);
        const unit = row.querySelector('.quick-add-unit')?.value?.trim();
        
        if (!shop || !itemName || !unit || isNaN(qty) || qty <= 0 || !category) {
            hasError = true;
            row.classList.add('has-error');
            return;
        }
        row.classList.remove('has-error');
        
        mappings.push({
            shop,
            category,
            itemName,
            qtyNeeded: qty,
            unit
        });
    });
    
    if (hasError || mappings.length === 0) {
        alert('Please complete all Quick Add mappings (shop, item, quantity, and unit).');
        return null;
    }
    
    return mappings;
}

function saveCustomRecipe() {
    const name = document.getElementById('customRecipeName').value.trim();
    const emoji = document.getElementById('customRecipeEmoji').value.trim();
    const category = document.getElementById('customRecipeCategory').value;
    const serves = parseInt(document.getElementById('customRecipeServes').value, 10) || 1;
    const prepTime = document.getElementById('customPrepTime').value.trim();
    const cookTime = document.getElementById('customCookTime').value.trim();
    const aiPrompt = document.getElementById('customAiPrompt').value.trim();
    const description = document.getElementById('customDescription').value.trim();
    
    const ingredients = document.getElementById('customIngredients').value
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
    const instructions = document.getElementById('customInstructions').value
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
    const tips = document.getElementById('customTips').value
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
    const video = document.getElementById('customVideo').value.trim();
    const nutrition = document.getElementById('customNutrition').value.trim();
    
    if (!name || !emoji || !category || !prepTime || !cookTime || !aiPrompt || !description || ingredients.length === 0 || instructions.length === 0) {
        alert('Please fill in all required fields.');
        return;
    }
    
    const quickAddItems = collectQuickAddMappings();
    if (!quickAddItems) return;
    
    const recipeData = {
        name,
        category,
        serves,
        prepTime,
        cookTime,
        aiPrompt,
        dietary: {
            vegetarian: document.getElementById('customDietVegetarian').checked,
            vegan: document.getElementById('customDietVegan').checked,
            nuts: document.getElementById('customDietNuts').checked,
            dairy: document.getElementById('customDietDairy').checked,
            gluten: document.getElementById('customDietGluten').checked
        },
        quickAddItems,
        display: {
            emoji,
            description,
            ingredients,
            instructions,
            tips,
            video: video || null,
            nutrition: nutrition || null
        }
    };
    
    if (editingRecipeId) {
        const updated = updateRecipe(editingRecipeId, recipeData);
        if (!updated) {
            alert('Unable to update recipe. Only custom recipes (R50+) can be edited.');
            return;
        }
        alert('✅ Recipe updated!');
    } else {
        const newId = addCustomRecipe(recipeData);
        editingRecipeId = newId;
        alert(`✅ Recipe saved as ${newId}!`);
    }
    
    refreshRecipeViews();
    closeCustomRecipeModal();
}

function confirmDeleteCustomRecipe() {
    if (!editingRecipeId) return;
    if (!confirm('Delete this custom recipe? This cannot be undone.')) return;
    
    if (deleteRecipe(editingRecipeId)) {
        selectedRecipesThisWeek = selectedRecipesThisWeek.filter(id => id !== editingRecipeId);
        saveSelectedRecipes();
        refreshRecipeViews();
        closeCustomRecipeModal();
        alert('🗑️ Custom recipe deleted.');
    } else {
        alert('Unable to delete this recipe. Only custom recipes (R50+) can be removed.');
    }
}

function handleDeleteFromCard(recipeId) {
    if (!isCustomRecipeId(recipeId)) return;
    if (!confirm('Delete this custom recipe?')) return;
    
    if (deleteRecipe(recipeId)) {
        selectedRecipesThisWeek = selectedRecipesThisWeek.filter(id => id !== recipeId);
        saveSelectedRecipes();
        refreshRecipeViews();
        alert('🗑️ Custom recipe deleted.');
    } else {
        alert('Unable to delete this recipe. Only custom recipes (R50+) can be removed.');
    }
}

function deleteFromRecipeModal(recipeId) {
    const shouldDelete = confirm('Delete this custom recipe?');
    if (!shouldDelete) return;
    closeRecipeModal();
    handleDeleteFromCard(recipeId);
}
// ===================================
// RECIPE GRID RENDERING
// ===================================

function renderRecipeGrid() {
    const grid = document.getElementById('recipeGrid');
    const allRecipes = getAllRecipes();
    const recipesArray = Object.values(allRecipes);
    const filtered = applyFilters(recipesArray);
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 48px; margin: 0 0 20px 0;">🔍</p>
                <p style="font-size: 18px; color: #666; margin: 0;">No recipes match your filters</p>
                <button onclick="clearFilters()" style="margin-top: 20px; padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Clear Filters
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    filtered.forEach(recipe => {
        html += createRecipeCard(recipe);
    });
    
    grid.innerHTML = html;
}

function createRecipeCard(recipe) {
    const tags = [];
    if (recipe.dietary.vegetarian) tags.push('🥬 Vegetarian');
    if (recipe.dietary.vegan) tags.push('🌱 Vegan');
    if (!recipe.dietary.nuts) tags.push('🥜 Nut-free');
    if (!recipe.dietary.dairy) tags.push('🥛 Dairy-free');
    if (!recipe.dietary.gluten) tags.push('🌾 Gluten-free');
    
    const categoryBadge = recipe.category === 'breakfast' ? '🍳 Breakfast' : '🍲 Batch Cook';
    const isCustom = isCustomRecipeId(recipe.id);
    
    return `
        <div class="recipe-card" onclick="openRecipeModal('${recipe.id}')" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.3s ease;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; color: white; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 10px;">${recipe.display.emoji}</div>
                <div style="background: rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 20px; display: inline-block; font-size: 12px; font-weight: 600; margin-bottom: 10px;">
                    ${categoryBadge}
                </div>
                <h3 style="margin: 10px 0 0 0; font-size: 18px;">${recipe.name}</h3>
                ${isCustom ? `<div class="custom-recipe-badge">Custom • ${recipe.id}</div>` : ''}
            </div>
            
            <div style="padding: 20px; position: relative;">
                <p style="color: #666; font-size: 14px; line-height: 1.5; margin: 0 0 15px 0;">${recipe.display.description}</p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 15px; flex-wrap: wrap;">
                    <span style="background: #e8f5e9; color: #2e7d32; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                        ⏱️ ${recipe.prepTime} + ${recipe.cookTime}
                    </span>
                    <span style="background: #fff3e0; color: #e65100; padding: 5px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                        🍽️ Serves ${recipe.serves}
                    </span>
                </div>
                
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    ${tags.map(tag => `<span style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 11px; color: #666;">${tag}</span>`).join('')}
                </div>
                
                ${isCustom ? `
                    <div class="recipe-card-actions">
                        <button class="secondary-btn" onclick="event.stopPropagation(); openCustomRecipeModal('${recipe.id}');">✏️ Edit</button>
                        <button class="danger-btn" onclick="event.stopPropagation(); handleDeleteFromCard('${recipe.id}');">🗑️ Delete</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// ===================================
// RECIPE MODAL
// ===================================

function openRecipeModal(recipeId) {
    const recipe = getRecipe(recipeId);
    if (!recipe) {
        alert('Recipe not found!');
        return;
    }
    const isCustom = isCustomRecipeId(recipe.id);
    
    const modal = document.createElement('div');
    modal.id = 'recipeModal';
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 85vh; overflow-y: auto;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px 12px 0 0; margin: -30px -30px 20px -30px; color: white; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 10px;">${recipe.display.emoji}</div>
                <h2 style="margin: 0 0 10px 0; color: white; font-size: 28px;">${recipe.name}</h2>
                <p style="margin: 0; opacity: 0.9; font-size: 14px;">${recipe.display.description}</p>
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 15px;">
                    <span style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 8px; font-size: 14px;">
                        ⏱️ ${recipe.prepTime} + ${recipe.cookTime}
                    </span>
                    <span style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 8px; font-size: 14px;">
                        🍽️ Serves ${recipe.serves}
                    </span>
                </div>
            </div>
            
            <!-- Ingredients -->
            <div style="margin-bottom: 25px;">
                <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 20px;">🛒 Ingredients</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${recipe.display.ingredients.map(ing => `
                        <li style="padding: 10px; background: #f8f9fa; margin-bottom: 8px; border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                            <span style="width: 8px; height: 8px; background: #667eea; border-radius: 50%; flex-shrink: 0;"></span>
                            <span style="color: #2c3e50;">${ing}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <!-- Instructions -->
            <div style="margin-bottom: 25px;">
                <h3 style="color: #667eea; margin: 0 0 15px 0; font-size: 20px;">👨‍🍳 Instructions</h3>
                <ol style="padding-left: 20px; margin: 0;">
                    ${recipe.display.instructions.map(step => `
                        <li style="padding: 12px 0; color: #2c3e50; line-height: 1.6; border-bottom: 1px solid #f0f0f0;">
                            ${step}
                        </li>
                    `).join('')}
                </ol>
            </div>
            
            <!-- Tips -->
            ${recipe.display.tips && recipe.display.tips.length > 0 ? `
                <div style="margin-bottom: 25px; background: #fff3e0; padding: 20px; border-radius: 12px; border-left: 4px solid #ff9800;">
                    <h3 style="color: #e65100; margin: 0 0 15px 0; font-size: 18px;">💡 Pro Tips</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        ${recipe.display.tips.map(tip => `
                            <li style="color: #5d4037; margin-bottom: 8px; line-height: 1.5;">${tip}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <!-- Video & Nutrition -->
            <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 25px;">
                ${recipe.display.video ? `
                    <a href="${recipe.display.video}" target="_blank" style="flex: 1; min-width: 200px; display: flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%); color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 12px rgba(255,0,0,0.3);">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <span>Watch Video</span>
                    </a>
                ` : ''}
                
                ${recipe.display.nutrition ? `
                    <div style="flex: 1; min-width: 200px; background: #e8f5e9; padding: 12px 20px; border-radius: 10px; display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 20px;">📊</span>
                        <span style="color: #2e7d32; font-size: 13px; font-weight: 600;">${recipe.display.nutrition}</span>
                    </div>
                ` : ''}
            </div>
            
            <!-- Buttons -->
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button onclick="closeRecipeModal()" style="flex: 1; padding: 14px; background: #f0f0f0; color: #333; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px;">
                    ← Back to Library
                </button>
                ${isCustom ? `<button onclick="closeRecipeModal(); openCustomRecipeModal('${recipe.id}');" style="flex: 1; padding: 14px; background: #2d9cdb; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px;">
                    ✏️ Edit Custom
                </button>` : ''}
                ${isCustom ? `<button onclick="deleteFromRecipeModal('${recipe.id}')" style="flex: 1; padding: 14px; background: #ff6b6b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px;">
                    🗑️ Delete
                </button>` : ''}
                <button onclick="addRecipeToThisWeek('${recipe.id}')" style="flex: 2; padding: 14px; background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px;">
                    ✅ Add to This Week
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeRecipeModal() {
    const modal = document.getElementById('recipeModal');
    if (modal) modal.remove();
}

// ===================================
// THIS WEEK TAB
// ===================================

function addRecipeToThisWeek(recipeId) {
    if (!selectedRecipesThisWeek.includes(recipeId)) {
        selectedRecipesThisWeek.push(recipeId);
        saveSelectedRecipes();
        closeRecipeModal();
        
        // Switch to This Week tab
        document.querySelector('.recipe-tab[data-tab="thisweek"]').click();
        
        alert('✅ Recipe added to This Week!');
    } else {
        alert('This recipe is already in This Week!');
    }
}

function removeRecipeFromThisWeek(recipeId) {
    selectedRecipesThisWeek = selectedRecipesThisWeek.filter(id => id !== recipeId);
    saveSelectedRecipes();
    renderThisWeekRecipes();
}

function renderThisWeekRecipes() {
    const container = document.getElementById('thisWeekRecipes');
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
                    <button onclick="removeRecipeFromThisWeek('${recipe.id}')" style="background: #ff6b6b; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;">
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

function generateShoppingListFromRecipes() {
    if (!selectedRecipesThisWeek || selectedRecipesThisWeek.length === 0) {
        alert('Please add at least one recipe to "This Week" first.');
        return;
    }
    
    const preferredShop = document.getElementById('shoppingPreferredShop')?.value || 'Tesco';
    const allRecipes = selectedRecipesThisWeek
        .map(id => getRecipe(id))
        .filter(Boolean);
    
    const aggregated = {};
    const unresolved = [];
    const homeInventory = loadHomeInventoryItems();
    
    allRecipes.forEach(recipe => {
        if (!recipe.quickAddItems || recipe.quickAddItems.length === 0) return;
        
        recipe.quickAddItems.forEach(item => {
            const resolved = resolveRecipeItemPreferredShopOnly(item, preferredShop);
            if (!resolved) {
                unresolved.push(item);
                return;
            }
            
            const key = `${resolved.shop}|${resolved.itemName}`;
            const packSize = resolved.packSize || 1;
            if (!aggregated[key]) {
                aggregated[key] = { ...resolved, totalUnits: 0, packSize };
            }
            aggregated[key].totalUnits += item.qtyNeeded || 0;
        });
    });
    
    // Subtract home inventory (by matching item name, prefer same shop) using unit counts
    Object.values(aggregated).forEach(item => {
        const unitsPerPack = item.packSize || 1;
        const match = findHomeInventoryMatch(homeInventory, item.itemName, item.shop);
        let remainingUnits = item.totalUnits;
        
        if (match) {
            const availableUnits = match.unlimited
                ? Infinity
                : typeof match.qtyUnits === 'number'
                    ? match.qtyUnits
                    : match.qtyAvailablePacks
                        ? match.qtyAvailablePacks * unitsPerPack
                        : 0;
            if (availableUnits === Infinity) {
                remainingUnits = 0;
            } else {
                remainingUnits = Math.max(0, remainingUnits - availableUnits);
            }
        }
        
        item.totalUnits = remainingUnits;
        
        item.qtyNeeded = remainingUnits <= 0
            ? 0
            : Math.ceil(remainingUnits / unitsPerPack);
    });
    
    // Remove zero-need items
    const filtered = Object.values(aggregated).filter(item => item.qtyNeeded > 0);
    
    // Group by shop (primary + optional single fallback)
    const groupedByShop = {};
    filtered.forEach(item => {
        if (!groupedByShop[item.shop]) groupedByShop[item.shop] = [];
        groupedByShop[item.shop].push(item);
    });
    
    let html = '';
    Object.entries(groupedByShop).forEach(([shop, items]) => {
        html += buildShoppingTableForShop(shop, items);
    });
    
    if (unresolved.length > 0) {
        html += buildUnresolvedTable(unresolved);
    }
    
    // Persist into shopping tab (replace existing generated list)
    localStorage.setItem('shoppingListHTML', html);
    
    if (typeof renderShopping === 'function') {
        renderShopping();
    }
    
    const shoppingTab = document.querySelector('[data-tab="shopping"]');
    if (shoppingTab) shoppingTab.click();
    
    alert('✅ Shopping list generated and added to the Shopping tab!');
}

function resolveRecipeItemPreferredShopOnly(item, preferredShop) {
    if (!quickAddProducts || Object.keys(quickAddProducts).length === 0) return null;
    const preferred = findBestProductForShop(item, preferredShop);
    return preferred || null;
}

function findBestProductForShop(item, shopName) {
    const catalog = quickAddProducts?.[shopName];
    if (!catalog) return null;
    
    const normalizedTarget = normalizeName(item.itemName);
    const words = normalizedTarget.split(' ').filter(Boolean);
    let best = null;
    
    Object.entries(catalog).forEach(([category, products]) => {
        products.forEach(product => {
            const normalizedProduct = normalizeName(product.name);
            const score = keywordMatchScore(words, normalizedProduct);
            if (score === 0) return;
            
            const price = typeof product.price === 'number' ? product.price : Infinity;
            let packSize = product.defaultQty || 1;
            const unitCount = extractNumericFromUnit(product.unit);
            if (packSize === 1 && unitCount) {
                packSize = unitCount;
            }
            
            if (!best ||
                score > best.score ||
                (score === best.score && price < best.price) ||
                (score === best.score && price === best.price && product.name.localeCompare(best.itemName) < 0)) {
                best = {
                    shop: shopName,
                    category,
                    itemName: product.name,
                    unit: product.unit || item.unit || '',
                    price,
                    score,
                    packSize
                };
            }
        });
    });
    
    return best;
}

function normalizeName(name) {
    return (name || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractNumericFromUnit(unit) {
    if (!unit) return null;
    const match = unit.replace(',', '.').match(/([\d\.]+)/);
    if (!match) return null;
    const value = parseFloat(match[1]);
    return isNaN(value) ? null : value;
}

function keywordMatchScore(keywords, productNameNormalized) {
    if (!productNameNormalized) return 0;
    let score = 0;
    keywords.forEach(word => {
        if (word && productNameNormalized.includes(word)) score++;
    });
    return score;
}

function buildShoppingTableForShop(shop, items) {
    const style = typeof getShopBrandStyle === 'function' ? getShopBrandStyle(shop) : { header: '', title: '' };
    const currency = typeof getCurrencySymbol === 'function' ? getCurrencySymbol() : '£';
    
    let total = 0;
    const rows = items.map(entry => {
        const itemTotal = (entry.price ?? 0) * entry.qtyNeeded;
        total += isFinite(itemTotal) ? itemTotal : 0;
        const priceDisplay = isFinite(entry.price) ? `${currency}${entry.price.toFixed(2)}` : 'N/A';
        const qtyDisplay = entry.qtyNeeded % 1 === 0 ? entry.qtyNeeded : entry.qtyNeeded.toFixed(2);
        return `
            <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">${entry.itemName}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${entry.unit || ''}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${priceDisplay}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${qtyDisplay}</td>
            </tr>
        `;
    }).join('');
    
    return `
        <div style="margin-bottom: 24px; page-break-inside: avoid; border: 2px solid #e5e7eb; border-radius: 10px; overflow: hidden;">
            <div style="${style.header}">
                <h3 style="${style.title}">${shop}</h3>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f9fafb;">
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Item</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Unit</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Price</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: center;">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                    <tr style="background: #f3f4f6; font-weight: 700;">
                        <td colspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: right;">Subtotal</td>
                        <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${currency}${total.toFixed(2)}</td>
                        <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${items.length} items</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function buildUnresolvedTable(items) {
    const rows = items.map(entry => `
        <tr>
            <td style="border: 1px solid #ddd; padding: 10px;">${entry.itemName}</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${entry.unit || ''}</td>
            <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">—</td>
            <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${entry.qtyNeeded % 1 === 0 ? entry.qtyNeeded : entry.qtyNeeded.toFixed(2)}</td>
        </tr>
    `).join('');
    
    return `
        <div style="margin-bottom: 24px; page-break-inside: avoid; border: 2px dashed #f59e0b; border-radius: 10px; overflow: hidden; background: #fffbeb;">
            <div style="background: #fbbf24; color: #78350f; padding: 14px 16px; font-weight: 800; font-size: 16px;">
                Currently selected shop doesn't have these items – buy elsewhere
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #fef3c7;">
                        <th style="border: 1px solid #fcd34d; padding: 10px; text-align: left;">Item</th>
                        <th style="border: 1px solid #fcd34d; padding: 10px; text-align: left;">Unit</th>
                        <th style="border: 1px solid #fcd34d; padding: 10px; text-align: right;">Price</th>
                        <th style="border: 1px solid #fcd34d; padding: 10px; text-align: center;">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

function findHomeInventoryMatch(inventory, itemName, preferredShop) {
    if (!inventory || inventory.length === 0) return null;
    const normalized = normalizeName(itemName);
    const sameShop = inventory.find(entry => normalizeName(entry.itemName) === normalized && entry.shop === preferredShop);
    if (sameShop) return sameShop;
    const tapMatch = inventory.find(entry => entry.shop === 'Tap' && normalizeName(entry.itemName).includes('water') && normalized.includes('water'));
    if (tapMatch) return tapMatch;
    return inventory.find(entry => normalizeName(entry.itemName) === normalized) || null;
}

function loadHomeInventoryItems() {
    try {
        const data = localStorage.getItem('homeInventory');
        if (!data) return [];
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(item => {
            const isTap = item.shop === 'Tap';
            const unlimited = Boolean(item.unlimited) || isTap || item.qtyUnits === 'unlimited' || item.qtyAvailablePacks === 'unlimited';
            const qtyUnitsRaw = item.qtyUnits ?? item.qtyAvailable ?? item.qtyAvailablePacks ?? 0;
            const unitLabel = item.unit || item.unitLabel || '';
            const sanitizedQty = unlimited ? Infinity : (typeof sanitizeQuantityForUnit === 'function' ? sanitizeQuantityForUnit(qtyUnitsRaw, unitLabel, true) : parseFloat(qtyUnitsRaw));
            const qtyUnits = unlimited ? Infinity : (isNaN(parseFloat(sanitizedQty)) ? 0 : parseFloat(sanitizedQty));
            return {
                shop: item.shop,
                category: item.category,
                itemName: item.itemName,
                unit: unitLabel,
                price: item.price,
                qtyUnits,
                qtyAvailablePacks: unlimited ? Infinity : (item.qtyAvailablePacks ?? item.qtyAvailable ?? null),
                unlimited
            };
        });
    } catch (e) {
        console.error('Failed to load home inventory', e);
        return [];
    }
}

// ===================================
// INITIALIZE ON LOAD
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    loadSelectedRecipes();
    initializeRecipeLibrary();
});

console.log('✅ Recipe Display UI loaded!');
