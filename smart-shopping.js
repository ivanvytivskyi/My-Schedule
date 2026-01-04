// ================================================
// SMART SHOPPING GENERATION - V2.1.0
// ================================================

// Shopping state
let shoppingTables = JSON.parse(localStorage.getItem('shoppingTables_v2')) || [];
let trolleyItems = new Set(JSON.parse(localStorage.getItem('trolleyItems_v2')) || []);

// Generate smart shopping list from recipes
function generateSmartShopping() {
    try {
        // Get all recipe IDs from the schedule
        const recipeIds = getAllRecipeIdsFromSchedule();
        
        if (recipeIds.length === 0) {
            alert('❌ No recipes found!\n\n' + 
                  'To generate a shopping list:\n' +
                  '1. Go to Recipes tab\n' +
                  '2. Add recipes to "This Week"\n' +
                  '   OR\n' +
                  '3. Import recipe IDs (R1, RB2, etc.)\n\n' +
                  'Then come back and click Generate Shopping List.');
            return;
        }
        
        // Aggregate all recipe needs by canonical key
        const { needs, missingItems: uncataloguedItems } = aggregateRecipeNeeds(recipeIds);
        
        if (Object.keys(needs).length === 0 && uncataloguedItems.length === 0) {
            alert('No ingredients found in recipes');
            return;
        }
        
        // Subtract what we have in Kitchen Stock
        const remaining = subtractKitchenStock(needs);
        
        // Get selected shop
        const selectedShop = getSelectedShop();
        
        // Choose packs for the shop
        const { shoppingItems, missingItems } = choosePacksForShop(remaining, selectedShop, uncataloguedItems);
        
        if (shoppingItems.length === 0 && missingItems.length === 0) {
            alert('🎉 You have everything you need in Kitchen Stock!');
            return;
        }
        
        // Create shopping table for this shop
        const tableId = `shop-${Date.now()}`;
        const newTable = {
            id: tableId,
            shop: selectedShop,
            items: shoppingItems,
            missingItems: missingItems,
            createdAt: new Date().toISOString()
        };
        
        shoppingTables.push(newTable);
        saveShoppingTables();
        
        // Switch to shopping tab and render
        switchToTab('shopping');
        renderAllShoppingTables();
        
        showToast(`✅ Shopping list generated for ${selectedShop}!`);
        
    } catch (error) {
        console.error('Error generating shopping:', error);
        alert(`Error: ${error.message}`);
    }
}

// Get all recipe IDs from "This Week" section
function getAllRecipeIdsFromSchedule() {
    const recipeIds = [];
    
    // First check "This Week" recipes
    if (typeof getThisWeekRecipes === 'function') {
        const thisWeekRecipes = getThisWeekRecipes();
        if (thisWeekRecipes && thisWeekRecipes.length > 0) {
            thisWeekRecipes.forEach(id => {
                if (!recipeIds.includes(id)) {
                    recipeIds.push(id);
                }
            });
        }
    }
    
    // Also check schedule blocks for recipe IDs
    const recipePattern = /\b(C)?(RB|RBC|RM|RD|RS|RW)(\d+)\b/g;
    if (window.scheduleData && window.scheduleData.days) {
        Object.values(window.scheduleData.days).forEach(day => {
            if (day.blocks) {
                day.blocks.forEach(block => {
                    const text = `${block.title || ''} ${(block.tasks || []).join(' ')}`;
                    const matches = text.match(recipePattern);
                    if (matches) {
                        matches.forEach(id => {
                            if (!recipeIds.includes(id)) {
                                recipeIds.push(id);
                            }
                        });
                    }
                });
            }
        });
    }
    
    return recipeIds;
}

// Format quantity for display - decimals for kg/L, whole numbers for g/ml/count
function formatQuantityDisplay(quantity, packSize) {
    const packUnit = packSize.match(/(kg|l|g|ml|count)$/i);
    if (!packUnit) return Math.round(quantity);
    
    const unit = packUnit[0].toLowerCase();
    
    // Allow decimals for kg and L
    if (unit === 'kg' || unit === 'l') {
        // Check if it's a whole number
        if (quantity === Math.floor(quantity)) {
            return Math.round(quantity);
        }
        // Show 1 decimal place
        return quantity.toFixed(1);
    }
    
    // Whole numbers only for g, ml, count
    return Math.round(quantity);
}

// Aggregate recipe needs
function aggregateRecipeNeeds(recipeIds) {
    const needs = {}; // { canonicalKey: qtyBase }
    const uncataloguedMap = {};
    
    recipeIds.forEach(recipeId => {
        const recipe = getRecipe(recipeId);
        if (!recipe || !recipe.ingredients) return;
        
        recipe.ingredients.forEach(ing => {
            const key = ing.canonicalKey;
            const product = CANONICAL_PRODUCTS[key];
            const qtyBase = convertToBase(ing.qty, ing.unit, key);
            
            if (!product) {
                // Track uncatalogued items so they still appear in the shopping output
                if (!uncataloguedMap[key]) {
                    uncataloguedMap[key] = {
                        canonicalKey: key,
                        productName: prettifyCanonicalKey(key),
                        neededQty: 0,
                        unitHint: ing.unit || ''
                    };
                }
                uncataloguedMap[key].neededQty += qtyBase;
                uncataloguedMap[key].prettyQty = formatMissingQty(uncataloguedMap[key].neededQty, uncataloguedMap[key].unitHint);
                return;
            }
            
            if (!needs[key]) {
                needs[key] = 0;
            }
            needs[key] += qtyBase;
        });
    });
    
    const missingItems = Object.values(uncataloguedMap);
    return { needs, missingItems };
}

// Format missing items nicely even if they are not in the catalog
function prettifyCanonicalKey(key) {
    if (!key) return 'Unknown item';
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

function formatMissingQty(qtyBase, unitHint = '') {
    const safeQty = typeof qtyBase === 'number' ? qtyBase : parseFloat(qtyBase) || 0;
    const unit = (unitHint || '').toLowerCase();
    const formatNumber = (num) => {
        if (Number.isInteger(num)) return String(num);
        return num.toFixed(2).replace(/\.?0+$/, '');
    };
    
    if (unit === 'kg') return `${formatNumber(safeQty / 1000)} kg`;
    if (unit === 'g') return `${formatNumber(safeQty)} g`;
    if (unit === 'l') return `${formatNumber(safeQty / 1000)} L`;
    if (unit === 'ml') return `${formatNumber(safeQty)} ml`;
    if (unit === 'count' || unit === 'piece' || unit === 'pieces' || unit === '') {
        return `${formatNumber(Math.round(safeQty))} pcs`;
    }
    
    return `${formatNumber(safeQty)} ${unit || 'units'}`;
}

// Subtract Kitchen Stock from needs
function subtractKitchenStock(needs) {
    const remaining = {};
    
    // Special case: If recipe needs "water" (bottled) but user has "water_tap", treat as covered
    if (needs.water && getKitchenStockQty('water_tap') > 0) {
        // User has tap water, no need to buy bottled water
        delete needs.water;
    }
    
    Object.keys(needs).forEach(key => {
        const needed = needs[key];
        const have = getKitchenStockQty(key);
        const stillNeed = needed - have;
        
        if (stillNeed > 0.001) { // Need more
            remaining[key] = stillNeed;
        }
    });
    
    return remaining;
}

// Choose best packs for shop
function choosePacksForShop(needs, shop, baseMissingItems = []) {
    const shoppingItems = [];
    const missingItems = [...baseMissingItems];
    
    Object.keys(needs).forEach(canonicalKey => {
        const neededQty = needs[canonicalKey];
        const product = CANONICAL_PRODUCTS[canonicalKey];
        
        if (!product) {
            missingItems.push({
                canonicalKey,
                productName: prettifyCanonicalKey(canonicalKey),
                neededQty,
                prettyQty: formatMissingQty(neededQty)
            });
            return;
        }
        
        // Check if shop has this product
        if (!product.shops || !product.shops[shop]) {
            missingItems.push({
                canonicalKey,
                productName: product.name,
                neededQty,
                prettyQty: prettyQty(canonicalKey, neededQty)
            });
            return;
        }
        
        // Get available packs
        const availablePacks = product.shops[shop];
        
        // Select best pack
        const selection = selectBestPack(neededQty, availablePacks, canonicalKey);
        
        if (selection) {
            shoppingItems.push({
                canonicalKey,
                productName: product.name,
                sku: selection.pack.sku,
                packSize: `${selection.pack.packQty}${selection.pack.packUnit}`,
                price: selection.pack.price,
                quantity: selection.quantity,
                totalPrice: selection.totalPrice,
                totalQtyBase: selection.totalQty,
                neededQty: neededQty,
                checked: false
            });
        }
    });
    
    return { shoppingItems, missingItems };
}

// Smart pack selection algorithm
function selectBestPack(neededQty, availablePacks, canonicalKey) {
    if (!availablePacks || availablePacks.length === 0) return null;
    
    // Convert all packs to base units
    const packsInBase = availablePacks.map(pack => {
        const qtyBase = convertToBase(pack.packQty, pack.packUnit, canonicalKey);
        return {
            ...pack,
            qtyBase,
            pricePerUnit: pack.price / qtyBase
        };
    });
    
    // Find packs that satisfy the need
    const validPacks = packsInBase.filter(p => p.qtyBase >= neededQty);
    
    if (validPacks.length === 0) {
        // No single pack covers need - buy multiple of smallest
        const smallest = packsInBase.sort((a, b) => a.qtyBase - b.qtyBase)[0];
        
        // Only allow decimals for loose items (sold by weight/volume)
        let packsNeeded;
        if (smallest.loose) {
            // Allow decimals - calculate precise amount
            packsNeeded = neededQty / smallest.qtyBase;
            // Round to 1 decimal place
            packsNeeded = Math.round(packsNeeded * 10) / 10;
            // Minimum 0.1
            if (packsNeeded < 0.1) packsNeeded = 0.1;
        } else {
            // Whole numbers only for fixed packs
            packsNeeded = Math.ceil(neededQty / smallest.qtyBase);
        }
        
        return {
            pack: smallest,
            quantity: packsNeeded,
            totalQty: smallest.qtyBase * packsNeeded,
            totalPrice: smallest.price * packsNeeded
        };
    }
    
    // Sort by size (ascending)
    validPacks.sort((a, b) => a.qtyBase - b.qtyBase);
    
    const smallest = validPacks[0];
    
    // For loose items that are bigger than needed, allow fractional purchase
    if (smallest.loose && smallest.qtyBase > neededQty) {
        // Calculate exact fraction needed
        let quantity = neededQty / smallest.qtyBase;
        // Round to 1 decimal place
        quantity = Math.round(quantity * 10) / 10;
        // Minimum 0.1
        if (quantity < 0.1) quantity = 0.1;
        
        return {
            pack: smallest,
            quantity: quantity,
            totalQty: smallest.qtyBase * quantity,
            totalPrice: smallest.price * quantity
        };
    }
    
    // Check if smallest pack is way too big (>2x needed) and we have alternatives
    if (smallest.qtyBase > neededQty * 2 && validPacks.length > 1) {
        const nextSize = validPacks[1];
        const priceDiff = ((nextSize.price - smallest.price) / smallest.price) * 100;
        
        // If next size is less than 30% more expensive, take it
        if (priceDiff < 30) {
            return {
                pack: nextSize,
                quantity: 1,
                totalQty: nextSize.qtyBase,
                totalPrice: nextSize.price
            };
        }
    }
    
    // Pick smallest valid pack with quantity 1
    return {
        pack: smallest,
        quantity: 1,
        totalQty: smallest.qtyBase,
        totalPrice: smallest.price
    };
}

// Get selected shop
function getSelectedShop() {
    const shopSelect = document.getElementById('preferredShopSelect');
    return shopSelect ? shopSelect.value : 'Tesco';
}

// Render all shopping tables
function renderAllShoppingTables() {
    const container = document.getElementById('shoppingListsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Check for Quick Add tables
    const shoppingDisplay = document.getElementById('shoppingDisplay');
    const hasQuickAddTables = shoppingDisplay && shoppingDisplay.querySelectorAll('div[id^="quickadd-"]').length > 0;
    
    // Show "No shopping lists yet" only if BOTH systems are empty
    if (shoppingTables.length === 0 && !hasQuickAddTables) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #999;">
                <div style="font-size: 48px; margin-bottom: 20px;">🛒</div>
                <h3 style="margin: 0 0 10px 0; color: #666;">No shopping lists yet</h3>
                <p style="margin: 0; color: #999;">Generate a smart shopping list from your recipes or use Quick Add</p>
            </div>
        `;
        return;
    }
    
    // Render recipe-generated tables
    shoppingTables.forEach(table => {
        const tableHtml = renderShoppingTable(table);
        container.insertAdjacentHTML('beforeend', tableHtml);
    });
}

// Render single shopping table
function renderShoppingTable(table) {
    const shopStyle = getShopBrandStyle(table.shop);
    const totals = calculateTableTotals(table.items);
    const tickedTotal = calculateTickedTotal(table.items, table.id);
    
    let html = `
        <div class="shopping-table-block" data-table-id="${table.id}" style="border: 2px solid #0055a5; border-radius: 12px; overflow: hidden; background: white; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="${shopStyle.header}; position: relative;">
                <h2 style="${shopStyle.title}">${table.shop}</h2>
                <button onclick="deleteShoppingTable('${table.id}')" 
                        style="position: absolute; top: 10px; right: 10px; background: #ff6b6b; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                    🗑️
                </button>
            </div>
            
            <!-- Table -->
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Item</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold;">Unit</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold;">Price</th>
                        <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold;">Quantity</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add items
    table.items.forEach((item, index) => {
        const itemId = `${table.id}-item-${index}`;
        const isChecked = trolleyItems.has(itemId);
        
        html += `
            <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" 
                               class="trolley-checkbox" 
                               data-table-id="${table.id}"
                               data-item-id="${itemId}"
                               ${isChecked ? 'checked' : ''}
                               onchange="toggleTrolleyItem('${itemId}', '${table.id}')">
                        <span style="font-weight: 500;">${item.sku}</span>
                    </label>
                </td>
                <td style="border: 1px solid #ddd; padding: 10px;">${item.packSize}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: 600;">£${item.price.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: 700; font-size: 16px;">${formatQuantityDisplay(item.quantity, item.packSize)}</td>
            </tr>
        `;
    });
    
    // Totals row
    html += `
                    <tr style="background: #f9f9f9; font-weight: bold;">
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: left;">Totals:</td>
                        <td style="border: 1px solid #ddd; padding: 12px;"></td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-size: 18px;">£${totals.totalPrice.toFixed(2)}</td>
                        <td style="border: 1px solid #ddd; padding: 12px; text-align: center; font-size: 18px;">${totals.totalQuantity}</td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Checkout button -->
            <div style="padding: 20px; text-align: center; background: #f9fafb;">
                <button id="checkout-btn-${table.id}"
                        onclick="checkoutTable('${table.id}')" 
                        class="checkout-btn"
                        style="padding: 14px 28px; background: ${tickedTotal > 0 ? '#10b981' : '#d1d5db'}; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: ${tickedTotal > 0 ? 'pointer' : 'not-allowed'}; transition: all 0.2s ease; box-shadow: ${tickedTotal > 0 ? '0 4px 12px rgba(16,185,129,0.3)' : 'none'};"
                        ${tickedTotal === 0 ? 'disabled' : ''}>
                    ✅ Checkout £${tickedTotal.toFixed(2)}
                </button>
            </div>
    `;
    
    // Missing items section
    if (table.missingItems && table.missingItems.length > 0) {
        html += `
            <div style="background: #fff3cd; border-top: 2px solid #ff9800; padding: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #e65100; font-size: 18px;">🛍️ Buy These Too</h3>
                <p style="margin: 0 0 15px 0; color: #e65100; font-size: 14px;">These items are not in your ${table.shop} catalog:</p>
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ffcc80;">
        `;
        
        table.missingItems.forEach(item => {
            html += `
                <div style="margin-bottom: 8px; padding: 8px; background: #fff8e1; border-radius: 6px;">
                    <strong>${item.productName}</strong> — Need: ${item.prettyQty}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    return html;
}

// Calculate table totals
function calculateTableTotals(items) {
    let totalPrice = 0;
    let totalQuantity = 0;
    
    items.forEach(item => {
        totalPrice += item.price * item.quantity;
        totalQuantity += item.quantity;
    });
    
    return { totalPrice, totalQuantity };
}

// Calculate ticked total
function calculateTickedTotal(items, tableId) {
    let tickedTotal = 0;
    
    items.forEach((item, index) => {
        const itemId = `${tableId}-item-${index}`;
        if (trolleyItems.has(itemId)) {
            tickedTotal += item.price * item.quantity;
        }
    });
    
    return tickedTotal;
}

// Toggle trolley item
function toggleTrolleyItem(itemId, tableId) {
    if (trolleyItems.has(itemId)) {
        trolleyItems.delete(itemId);
    } else {
        trolleyItems.add(itemId);
    }
    
    saveTrolleyItems();
    updateCheckoutButton(tableId);
}

// Update checkout button
function updateCheckoutButton(tableId) {
    const table = shoppingTables.find(t => t.id === tableId);
    if (!table) return;
    
    const tickedTotal = calculateTickedTotal(table.items, table.id);
    const btn = document.getElementById(`checkout-btn-${tableId}`);
    
    if (!btn) return;
    
    if (tickedTotal === 0) {
        btn.textContent = '✅ Checkout £0.00';
        btn.disabled = true;
        btn.style.background = '#d1d5db';
        btn.style.cursor = 'not-allowed';
        btn.style.boxShadow = 'none';
    } else {
        btn.textContent = `✅ Checkout £${tickedTotal.toFixed(2)}`;
        btn.disabled = false;
        btn.style.background = '#10b981';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)';
    }
}

// Checkout table
function checkoutTable(tableId) {
    const table = shoppingTables.find(t => t.id === tableId);
    if (!table) return;
    
    const tickedItems = [];
    
    table.items.forEach((item, index) => {
        const itemId = `${tableId}-item-${index}`;
        if (trolleyItems.has(itemId)) {
            tickedItems.push({
                ...item,
                itemId
            });
        }
    });
    
    if (tickedItems.length === 0) {
        alert('Please tick items you want to checkout');
        return;
    }
    
    // Add to Kitchen Stock
    tickedItems.forEach(item => {
        const qtyToAdd = item.totalQtyBase;
        addToKitchenStock(item.canonicalKey, qtyToAdd);
    });
    
    // Remove ticked items from table
    tickedItems.forEach(item => {
        const index = table.items.findIndex(i => 
            i.canonicalKey === item.canonicalKey && 
            i.sku === item.sku
        );
        if (index !== -1) {
            table.items.splice(index, 1);
        }
        trolleyItems.delete(item.itemId);
    });
    
    // Delete entire table if no items left
    if (table.items.length === 0) {
        const tableIndex = shoppingTables.findIndex(t => t.id === tableId);
        if (tableIndex !== -1) {
            shoppingTables.splice(tableIndex, 1);
        }
    }
    
    // Save changes
    saveShoppingTables();
    saveTrolleyItems();
    
    // Re-render
    renderAllShoppingTables();
    
    showToast(`✅ ${tickedItems.length} item${tickedItems.length > 1 ? 's' : ''} added to Kitchen Stock!`);
}

// Delete shopping table
function deleteShoppingTable(tableId) {
    const table = shoppingTables.find(t => t.id === tableId);
    if (!table) return;
    
    // Check if any items are ticked
    const tickedTotal = calculateTickedTotal(table.items, table.id);
    
    if (tickedTotal > 0) {
        // Show warning with options
        if (confirm(`⚠️ You have £${tickedTotal.toFixed(2)} of ticked items.\n\nClick OK to checkout first, or Cancel to delete anyway.`)) {
            // Checkout first
            checkoutTable(tableId);
            // Then delete
            setTimeout(() => {
                deleteTableNow(tableId);
            }, 100);
        } else {
            // Ask for final confirmation
            if (confirm(`Delete entire ${table.shop} shopping list?`)) {
                deleteTableNow(tableId);
            }
        }
    } else {
        // No ticked items, simple confirm
        if (confirm(`Delete entire ${table.shop} shopping list?`)) {
            deleteTableNow(tableId);
        }
    }
}

// Delete table now
function deleteTableNow(tableId) {
    const index = shoppingTables.findIndex(t => t.id === tableId);
    if (index !== -1) {
        shoppingTables.splice(index, 1);
        saveShoppingTables();
        renderAllShoppingTables();
        showToast('🗑️ Shopping list deleted');
    }
}

// Save shopping tables
function saveShoppingTables() {
    localStorage.setItem('shoppingTables_v2', JSON.stringify(shoppingTables));
}

// Save trolley items
function saveTrolleyItems() {
    localStorage.setItem('trolleyItems_v2', JSON.stringify([...trolleyItems]));
}

// Switch to tab
function switchToTab(tabName) {
    const tabs = ['schedule', 'shopping', 'recipes', 'home'];
    tabs.forEach(tab => {
        const page = document.getElementById(`${tab}Page`);
        const btn = document.querySelector(`[data-tab="${tab}"]`);
        
        if (page) page.style.display = tab === tabName ? 'block' : 'none';
        if (btn) {
            if (tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });
}

console.log('✅ Smart Shopping System loaded - V2.1.0');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Delay to allow Quick Add tables to load from localStorage
    setTimeout(renderAllShoppingTables, 100);
    
    // Also render when switching to shopping tab
    const shoppingTab = document.querySelector('.nav-item[data-tab="shopping"]');
    if (shoppingTab) {
        shoppingTab.addEventListener('click', () => {
            setTimeout(renderAllShoppingTables, 100);
        });
    }
});
