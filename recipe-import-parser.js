// ================================================
// RECIPE IMPORT PARSER & QUICK ADD MAPPER
// ================================================

function extractRecipeIDs(responseText) {
    if (!responseText) return [];
    const matches = responseText.match(/R\d+/g) || [];
    const uniqueIDs = [...new Set(matches)];
    return uniqueIDs.filter(id => {
        const recipe = typeof getRecipe === 'function' ? getRecipe(id) : null;
        if (!recipe) {
            console.warn(`Recipe ${id} not found in database`);
            return false;
        }
        return true;
    });
}

function aggregateRecipeItems(items) {
    const grouped = {};
    items.forEach(item => {
        const key = `${item.shop}|${item.category}|${item.itemName}`;
        if (!grouped[key]) {
            grouped[key] = { ...item };
        } else {
            grouped[key].qtyNeeded += item.qtyNeeded;
        }
    });
    return Object.values(grouped);
}

function mapRecipesToQuickAdd(recipeIDs) {
    if (!Array.isArray(recipeIDs)) return [];
    const allItems = [];
    
    recipeIDs.forEach(id => {
        const recipe = typeof getRecipe === 'function' ? getRecipe(id) : null;
        if (!recipe || !Array.isArray(recipe.quickAddItems)) return;
        
        const occurrences = recipeIDs.filter(rid => rid === id).length;
        recipe.quickAddItems.forEach(item => {
            allItems.push({
                ...item,
                qtyNeeded: (item.qtyNeeded || 0) * occurrences
            });
        });
    });
    
    return aggregateRecipeItems(allItems);
}

function findQuickAddItem(shop, category, itemName) {
    if (!quickAddProducts || !quickAddProducts[shop] || !quickAddProducts[shop][category]) return null;
    const items = quickAddProducts[shop][category];
    const index = items.findIndex(prod => normalizeName(prod.name) === normalizeName(itemName));
    if (index === -1) return null;
    return { item: items[index], index };
}

function autoSelectQuickAddItems(items) {
    if (!Array.isArray(items) || items.length === 0) return;
    if (typeof openQuickAdd !== 'function' || typeof renderQuickAddModal !== 'function') {
        console.warn('Quick Add functions not available');
        return;
    }
    
    // Reset selection
    if (typeof selectedShoppingItems === 'object') {
        selectedShoppingItems = {};
    }
    
    items.forEach(entry => {
        const match = findQuickAddItem(entry.shop, entry.category, entry.itemName);
        if (!match) {
            console.warn(`Item not found in Quick Add catalog: ${entry.itemName}`);
            return;
        }
        const { item, index } = match;
        const itemId = `${entry.shop}|${entry.category}|${index}`;
        selectedShoppingItems[itemId] = {
            name: item.name,
            unit: item.unit,
            quantity: entry.qtyNeeded || item.defaultQty || 1,
            price: item.price,
            shop: entry.shop,
            category: entry.category
        };
    });
    
    openQuickAdd();
    renderQuickAddModal();
}

console.log('✅ Recipe Import Parser loaded!');
