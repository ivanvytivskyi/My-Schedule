// ================================================
// COOKING INTEGRATION - V2.1.0
// ================================================
// Adds cooking checkboxes to schedule blocks with recipes
// Subtracts ingredients from Kitchen Stock when cooked

// Cooking snapshots for undo functionality
let cookingSnapshots = JSON.parse(localStorage.getItem('cookingSnapshots_v2')) || {};

// Toggle cooking for a recipe
function toggleCooking(checkbox) {
    const recipeId = checkbox.dataset.recipeId;
    const recipeName = checkbox.dataset.recipeName;
    const blockId = checkbox.dataset.blockId;
    const isCooked = checkbox.checked;
    
    if (!recipeId) return;
    
    const recipe = getRecipe(recipeId);
    if (!recipe) {
        alert(`Recipe "${recipeName}" not found`);
        checkbox.checked = false;
        return;
    }
    
    if (isCooked) {
        // Check if we have enough ingredients
        const missingIngredients = checkMissingIngredients(recipe);
        
        if (missingIngredients.length > 0) {
            // Block cooking - missing ingredients
            checkbox.checked = false;
            
            const missingList = missingIngredients.map(ing => 
                `• ${ing.display} (need ${ing.needed}, have ${ing.have})`
            ).join('\n');
            
            const message = `❌ Cannot cook "${recipeName}"!\n\n` +
                           `Missing ingredients:\n${missingList}\n\n` +
                           `Would you like to generate a shopping list?`;
            
            if (confirm(message)) {
                // Generate shopping list
                if (typeof generateSmartShopping === 'function') {
                    generateSmartShopping();
                }
            }
            return;
        }
        
        // Have all ingredients - proceed with cooking
        subtractRecipeIngredients(recipe, blockId);
        
        // Track recipe usage in history (only when actually cooked!)
        if (typeof updateRecipeUsageHistory === 'function') {
            updateRecipeUsageHistory([recipeId]);
            console.log(`📊 Recipe ${recipeId} marked as used in history`);
        }
        
        showToast(`🍳 Cooked: ${recipeName}`);
    } else {
        // Restore ingredients to Kitchen Stock
        restoreRecipeIngredients(recipe, blockId);
        showToast(`↩️ Uncooked: ${recipeName}`);
    }
    
    // Save schedule state
    if (typeof saveSchedule === 'function') {
        saveSchedule();
    }
    
    // Refresh Kitchen Stock if modal is open
    const modal = document.getElementById('kitchenStockModal');
    if (modal && modal.classList.contains('active')) {
        if (typeof renderStockView === 'function') {
            renderStockView();
        }
    }
}

// Check if we have enough ingredients for a recipe
function checkMissingIngredients(recipe) {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
        return [];
    }
    
    const missing = [];
    
    recipe.ingredients.forEach(ing => {
        const key = ing.canonicalKey;
        if (!key) return;
        
        const neededQty = convertToBase(ing.qty, ing.unit, key);
        const haveQty = getKitchenStockQty(key);
        
        if (haveQty < neededQty) {
            const product = CANONICAL_PRODUCTS[key];
            const needed = prettyQty(key, neededQty);
            const have = haveQty > 0 ? prettyQty(key, haveQty) : 'none';
            
            missing.push({
                display: product?.name || ing.display,
                needed: needed,
                have: have,
                shortfall: neededQty - haveQty
            });
        }
    });
    
    return missing;
}

// Subtract recipe ingredients from Kitchen Stock
function subtractRecipeIngredients(recipe, blockId) {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
        return;
    }
    
    // Create snapshot for undo
    const snapshot = {};
    
    recipe.ingredients.forEach(ing => {
        const key = ing.canonicalKey;
        if (!key) return;
        
        const neededQty = convertToBase(ing.qty, ing.unit, key);
        
        // Store original quantity
        snapshot[key] = getKitchenStockQty(key);
        
        // Subtract from stock (can go negative = deficit)
        const currentQty = getKitchenStockQty(key);
        const newQty = currentQty - neededQty;
        
        if (newQty <= 0.000001 && newQty >= -0.000001) {
            // Remove if basically zero
            delete kitchenStock[key];
        } else {
            const unitType = CANONICAL_PRODUCTS[key]?.unitType || UNIT_TYPE.MASS;
            kitchenStock[key] = {
                qtyBase: newQty,
                unitType: unitType
            };
        }
    });
    
    // Save snapshot
    saveBlockSnapshot(blockId, snapshot);
    saveKitchenStock();
}

// Restore recipe ingredients to Kitchen Stock
function restoreRecipeIngredients(recipe, blockId) {
    const snapshot = getBlockSnapshot(blockId);
    if (!snapshot) return;
    
    // Restore each ingredient to snapshot state
    Object.keys(snapshot).forEach(key => {
        const originalQty = snapshot[key];
        
        if (originalQty === 0) {
            delete kitchenStock[key];
        } else {
            const unitType = CANONICAL_PRODUCTS[key]?.unitType || UNIT_TYPE.MASS;
            kitchenStock[key] = {
                qtyBase: originalQty,
                unitType: unitType
            };
        }
    });
    
    // Clear snapshot
    clearBlockSnapshot(blockId);
    saveKitchenStock();
}

// Save block snapshot
function saveBlockSnapshot(blockId, snapshot) {
    cookingSnapshots[blockId] = snapshot;
    localStorage.setItem('cookingSnapshots_v2', JSON.stringify(cookingSnapshots));
}

// Get block snapshot
function getBlockSnapshot(blockId) {
    return cookingSnapshots[blockId] || null;
}

// Clear block snapshot
function clearBlockSnapshot(blockId) {
    delete cookingSnapshots[blockId];
    localStorage.setItem('cookingSnapshots_v2', JSON.stringify(cookingSnapshots));
}

// Check if block is cooked
function isBlockCooked(blockId) {
    return cookingSnapshots.hasOwnProperty(blockId);
}

// Extract recipe ID from text
function extractRecipeId(text) {
    if (!text) return null;
    const pattern = /\b(C)?(RB|RBC|RM|RD|RS|RW)(\d+)\b/;
    const match = text.match(pattern);
    return match ? match[0] : null;
}

// Get recipe name from ID (without showing ID to user)
function getRecipeNameOnly(recipeId) {
    const recipe = getRecipe(recipeId);
    return recipe ? recipe.name : null;
}

// Add cooking checkbox HTML to block
function getCookingCheckboxHTML(blockId, recipeId, recipeName) {
    const isCooked = isBlockCooked(blockId);
    
    return `
        <label class="cooking-toggle" style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 6px;
            background: ${isCooked ? '#dcfce7' : '#f0fdf4'};
            border: 1px solid ${isCooked ? '#4ade80' : '#86efac'};
            cursor: pointer;
            transition: all 0.2s ease;
            width: fit-content;
            max-width: fit-content;
            flex: 0 0 auto;
            align-self: flex-start;
        ">
            <input type="checkbox" 
                   class="cooking-checkbox"
                   data-recipe-id="${recipeId}"
                   data-recipe-name="${recipeName}"
                   data-block-id="${blockId}"
                   ${isCooked ? 'checked' : ''}
                   onchange="toggleCooking(this)"
                   style="cursor: pointer; margin: 0;">
            <span style="color: ${isCooked ? '#16a34a' : '#065f46'}; white-space: nowrap;">
                🍳 ${isCooked ? 'Cooked' : 'Cook'}
            </span>
        </label>
    `;
}

console.log('✅ Cooking Integration System loaded - V2.1.0');
