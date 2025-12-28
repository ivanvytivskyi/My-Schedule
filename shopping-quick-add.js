// ================================================
// QUICK ADD SHOPPING - V2.1.0 REDESIGNED + FIXED
// ================================================

// Currency handling simplified to GBP only (UI does not expose currency switching)
const DISPLAY_CURRENCY = '£';

// Get category icon
function getCategoryIcon(category) {
    const customIcon = (() => {
        if (typeof customCategories === 'undefined' || !Array.isArray(customCategories)) return null;
        const match = customCategories.find(cat => {
            if (!cat) return false;
            if (typeof cat === 'string') return cat === category;
            return cat.name === category;
        });
        if (!match) return null;
        return typeof match === 'string' ? null : (match.icon || '📦');
    })();
    if (customIcon) return customIcon;
    
    const icons = {
        'Dairy & Eggs': '🥛',
        'Fruit': '🍎',
        'Vegetables': '🥕',
        'Meat & Fish': '🥩',
        'Bread & Bakery': '🥖',
        'Grains & Pulses': '🌾',
        'Pantry & Dry Goods': '🧂',
        'Frozen': '❄️',
        'Drinks': '🥤',
        'Snacks': '🍿',
        'Sweets & Spreads': '🍫',
        'Household': '🧽',
        'Personal Care': '🧴',
        'Other': '📦'
    };
    return icons[category] || '📦';
}

// Shop brand styling
function getShopBrandStyle(shopName) {
    // Check for custom shop first
    if (typeof customShops !== 'undefined' && customShops[shopName]) {
        const color = customShops[shopName].color;
        return {
            header: `background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); padding: 20px; text-align: center;`,
            title: "margin: 0; color: white; font-size: clamp(20px, 5vw, 28px); font-weight: 700;"
        };
    }
    
    // Built-in shop styles
    const styles = {
        "Tesco": {
            header: "background: linear-gradient(135deg, #0055a5 0%, #003d7a 100%); padding: 20px; text-align: center;",
            title: "margin: 0; color: #e31837; font-size: clamp(20px, 5vw, 32px); font-weight: 800; text-transform: uppercase; letter-spacing: 3px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); background: white; padding: 15px 30px; border-radius: 8px; display: inline-block;"
        },
        "Lidl": {
            header: "background: linear-gradient(135deg, #0050aa 0%, #003d85 100%); padding: 20px; text-align: center;",
            title: "margin: 0; color: #ffd500; font-size: clamp(20px, 5vw, 32px); font-weight: 900; text-transform: uppercase; letter-spacing: 8px; text-shadow: 3px 3px 6px rgba(0,0,0,0.4);"
        }
    };
    
    return styles[shopName] || {
        header: "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;",
        title: "margin: 0; color: white; font-size: clamp(20px, 5vw, 28px); font-weight: 700;"
    };
}

// Product database
let quickAddProducts = {};

// Selected items
let selectedShoppingItems = {};
let quickAddSearchTerm = '';

// Auto-populate from CANONICAL_PRODUCTS
function populateQuickAddFromCatalog() {
    if (typeof CANONICAL_PRODUCTS === 'undefined') {
        console.log('⏳ Waiting for CANONICAL_PRODUCTS...');
        setTimeout(populateQuickAddFromCatalog, 100);
        return;
    }
    
    quickAddProducts = {};
    
    Object.keys(CANONICAL_PRODUCTS).forEach(canonicalKey => {
        const product = CANONICAL_PRODUCTS[canonicalKey];
        
        // Skip unlimited products (e.g., tap water)
        if (product.unlimited) return;
        
        if (!product.shops) return;
        
        Object.keys(product.shops).forEach(shopName => {
            if (!quickAddProducts[shopName]) {
                quickAddProducts[shopName] = {};
            }
            
            // Determine category
            const keyLower = canonicalKey.toLowerCase();
            let category = 'Other';
            
            // Use stored category if available (for custom products)
            if (product.category) {
                category = product.category;
            } else if (keyLower.includes('milk') || keyLower.includes('egg') || keyLower.includes('butter') || keyLower.includes('cheese') || keyLower.includes('yogurt') || keyLower.includes('cottage')) {
                category = 'Dairy & Eggs';
            } else if (keyLower.includes('banana') || keyLower.includes('apple') || keyLower.includes('orange')) {
                category = 'Fruit';
            } else if (keyLower.includes('potato') || keyLower.includes('onion') || keyLower.includes('carrot') || keyLower.includes('tomato') || keyLower.includes('pepper') || keyLower.includes('broccoli') || keyLower.includes('cucumber') || keyLower.includes('garlic') || keyLower.includes('ginger') || keyLower.includes('spinach') || keyLower.includes('lettuce')) {
                category = 'Vegetables';
            } else if (keyLower.includes('chicken') || keyLower.includes('beef') || keyLower.includes('pork') || keyLower.includes('bacon') || keyLower.includes('fish') || keyLower.includes('salmon') || keyLower.includes('cod') || keyLower.includes('lamb')) {
                category = 'Meat & Fish';
            } else if ((keyLower.includes('bread') || keyLower.includes('croissant') || keyLower.includes('tortilla') || keyLower.includes('roll') || keyLower.includes('bagel') || keyLower.includes('bap') || keyLower.includes('bun')) && !keyLower.includes('oats')) {
                category = 'Bread & Bakery';
            } else if (keyLower.includes('rice') || keyLower.includes('oats') || keyLower.includes('lentil') || keyLower.includes('bean') || keyLower.includes('buckwheat') || keyLower.includes('quinoa') || keyLower.includes('barley') || keyLower.includes('couscous') || keyLower.includes('bulgur') || keyLower.includes('grain') || keyLower.includes('pulse')) {
                category = 'Grains & Pulses';
            } else if (keyLower.includes('pasta') || keyLower.includes('flour') || keyLower.includes('sugar') || keyLower.includes('salt') || keyLower.includes('oil') || keyLower.includes('honey') || keyLower.includes('jam') || keyLower.includes('spice') || keyLower.includes('herb') || keyLower.includes('stock') || keyLower.includes('cocoa') || keyLower.includes('vinegar') || keyLower.includes('sauce')) {
                category = 'Pantry & Dry Goods';
            } else if (keyLower.includes('frozen') || keyLower.includes('peas_frozen') || keyLower.includes('pizza') || keyLower.includes('ice_cream') || keyLower.includes('mixed_veg')) {
                category = 'Frozen';
            } else if (keyLower.includes('juice') || keyLower.includes('cola') || keyLower.includes('water') || keyLower.includes('tea') || keyLower.includes('coffee')) {
                category = 'Drinks';
            } else if (keyLower.includes('crisp') || keyLower.includes('chips') || keyLower.includes('nuts') || keyLower.includes('popcorn') || keyLower.includes('snack') || keyLower.includes('bar')) {
                category = 'Snacks';
            } else if (keyLower.includes('chocolate') || keyLower.includes('peanut') || keyLower.includes('sultana') || keyLower.includes('raisins') || keyLower.includes('syrup') || keyLower.includes('spread')) {
                category = 'Sweets & Spreads';
            } else if (keyLower.includes('foil') || keyLower.includes('wrap') || keyLower.includes('clean') || keyLower.includes('detergent') || keyLower.includes('paper') || keyLower.includes('towel') || keyLower.includes('bag')) {
                category = 'Household';
            } else if (keyLower.includes('soap') || keyLower.includes('shampoo') || keyLower.includes('toothpaste') || keyLower.includes('toothbrush') || keyLower.includes('deodorant') || keyLower.includes('conditioner')) {
                category = 'Personal Care';
            }
            
            if (!quickAddProducts[shopName][category]) {
                quickAddProducts[shopName][category] = [];
            }
            
            // Add each SKU
            product.shops[shopName].forEach(sku => {
                const packInfo = `${sku.packQty}${sku.packUnit}`;
                quickAddProducts[shopName][category].push({
                    name: sku.sku,
                    unit: packInfo,
                    price: sku.price,
                    defaultQty: sku.defaultQty || 1,
                    loose: sku.loose || false,
                    category: category,
                    canonicalKey: canonicalKey
                });
            });
        });
    });
    
    console.log('✅ Quick Add populated from Product Catalog');
    console.log('Shops available:', Object.keys(quickAddProducts));
}

// Initialize
if (typeof CANONICAL_PRODUCTS !== 'undefined') {
    populateQuickAddFromCatalog();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        populateQuickAddFromCatalog();
    });
}

// Open Quick Add Modal
function openQuickAdd() {
    // Ensure products are loaded
    if (Object.keys(quickAddProducts).length === 0) {
        populateQuickAddFromCatalog();
    }
    
    const searchInput = document.getElementById('quickAddSearchInput');
    if (searchInput) {
        searchInput.value = quickAddSearchTerm;
    }
    
    document.getElementById('quickAddModal').classList.add('active');
    
    // Show/hide Manage Products button based on Edit Mode
    const manageProductsBtn = document.getElementById('manageProductsQuickAddBtn');
    if (manageProductsBtn) {
        if (window.quickAddEditMode || document.body.classList.contains('edit-mode')) {
            manageProductsBtn.style.display = 'inline-block';
        } else {
            manageProductsBtn.style.display = 'none';
        }
    }
    
    renderQuickAddModal();
}

// Close Quick Add Modal
function closeQuickAdd() {
    document.getElementById('quickAddModal').classList.remove('active');
}

function handleQuickAddSearch(value) {
    quickAddSearchTerm = value || '';
    renderQuickAddModal();
}

// Render modal
function renderQuickAddModal() {
    const modal = document.getElementById('quickAddModalContent');
    if (!modal) return;
    
    // Show/hide Manage Products button based on edit mode
    const manageBtn = document.getElementById('manageProductsQuickAddBtn');
    if (manageBtn) {
        if (window.quickAddEditMode || document.body.classList.contains('edit-mode')) {
            manageBtn.style.display = 'inline-block';
        } else {
            manageBtn.style.display = 'none';
        }
    }
    
    const shops = Object.keys(quickAddProducts);
    
    if (shops.length === 0) {
        modal.innerHTML = '<p style="padding: 40px; text-align: center; color: #999;">Loading products...</p>';
        return;
    }
    
    const searchTerm = quickAddSearchTerm.trim().toLowerCase();
    
    let html = '';
    
    shops.forEach(shop => {
        const brandStyle = getShopBrandStyle(shop);
        let shopHasResults = false;
        html += `
            <div style="margin-bottom: 30px; border: 2px solid #ddd; border-radius: 12px; overflow: hidden;">
                <div style="${brandStyle.header}">
                    <h3 style="${brandStyle.title}">${shop}</h3>
                </div>
        `;
        
        const categories = Object.keys(quickAddProducts[shop]);
        categories.forEach(category => {
            const items = quickAddProducts[shop][category];
            const filteredItems = searchTerm ? items.filter(prod => prod.name.toLowerCase().includes(searchTerm)) : items;
            if (filteredItems.length === 0) return;
            shopHasResults = true;
            const categoryIcon = getCategoryIcon(category);
            
            html += `
                <div style="padding: 20px; background: #f9f9f9;">
                    <h4 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">${categoryIcon} ${category}</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px;">
            `;
            
            filteredItems.forEach((product, idx) => {
                const originalIndex = items.indexOf(product);
                const itemKey = `${shop}|${category}|${originalIndex}`;
                const isSelected = selectedShoppingItems[itemKey];
                
                // Escape single quotes for onclick handlers
                const escapedShop = shop.replace(/'/g, "\\'");
                const escapedCategory = category.replace(/'/g, "\\'");
                
                html += `
                    <div onclick="toggleQuickItem('${escapedShop}', '${escapedCategory}', ${originalIndex})" 
                         style="padding: 12px; background: white; border: 2px solid ${isSelected ? '#4CAF50' : '#ddd'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 20px; height: 20px; border: 2px solid ${isSelected ? '#4CAF50' : '#999'}; border-radius: 4px; background: ${isSelected ? '#4CAF50' : 'white'}; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                                ${isSelected ? '<span style="color: white; font-size: 14px;">✓</span>' : ''}
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #2c3e50; font-size: 14px;">${product.name}</div>
                                <div style="color: #7f8c8d; font-size: 12px;">${product.unit} · ${DISPLAY_CURRENCY}${product.price.toFixed(2)}</div>
                            </div>
                        </div>
                        ${isSelected ? `
                            <div style="margin-top: 8px; display: flex; gap: 8px; align-items: center;">
                                <span style="font-size: 12px; color: #666;">Qty:</span>
                                <input type="number" value="${selectedShoppingItems[itemKey]?.quantity || product.defaultQty}" 
                                       min="${product.loose ? '0.1' : '1'}" 
                                       step="${product.loose ? '0.1' : '1'}"
                                       onclick="event.stopPropagation()"
                                       onchange="updateQuickItemQty('${escapedShop}', '${escapedCategory}', ${originalIndex}, this.value)"
                                       style="width: 70px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                        ` : ''}
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        if (!shopHasResults && searchTerm) {
            html += `
                <div style="padding: 16px; background: #fff7ed; color: #c2410c; border-top: 1px solid #fde68a;">
                    No matches in ${shop}.
                </div>
            `;
        }
        
        html += `</div>`;
    });
    
    modal.innerHTML = html;
    updateQuickAddTotal();
}

// Toggle item selection
function toggleQuickItem(shop, category, idx) {
    const itemKey = `${shop}|${category}|${idx}`;
    const product = quickAddProducts[shop][category][idx];
    
    if (selectedShoppingItems[itemKey]) {
        delete selectedShoppingItems[itemKey];
    } else {
        selectedShoppingItems[itemKey] = {
            ...product,
            shop: shop,
            quantity: product.defaultQty
        };
    }
    
    renderQuickAddModal();
}

// Update item quantity
function updateQuickItemQty(shop, category, idx, qty) {
    const itemKey = `${shop}|${category}|${idx}`;
    if (selectedShoppingItems[itemKey]) {
        const numQty = parseFloat(qty) || 1;
        // Ensure minimum 0.1 for loose items, 1 for fixed packs
        const product = quickAddProducts[shop][category][idx];
        const minQty = product.loose ? 0.1 : 1;
        selectedShoppingItems[itemKey].quantity = Math.max(numQty, minQty);
        updateQuickAddTotal();
    }
}

// Update total
function updateQuickAddTotal() {
    const selected = Object.values(selectedShoppingItems);
    const count = selected.length;
    const total = selected.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const countEl = document.getElementById('quickAddSelectedCount');
    const totalEl = document.getElementById('quickAddTotal');
    
    if (countEl) countEl.textContent = `Selected: ${count} items`;
    if (totalEl) totalEl.textContent = `Total: ${DISPLAY_CURRENCY}${total.toFixed(2)}`;
}

// Add items to shopping list
function addQuickAddItems() {
    const selected = Object.values(selectedShoppingItems);
    
    if (selected.length === 0) {
        alert('Please select items first');
        return;
    }
    
    // Group by shop
    const byShop = {};
    selected.forEach(item => {
        if (!byShop[item.shop]) byShop[item.shop] = [];
        byShop[item.shop].push(item);
    });
    
    // Get existing HTML
    const existingHTML = localStorage.getItem('shoppingListHTML') || '';
    let newHTML = '';
    
    // Add each shop's table
    Object.keys(byShop).forEach(shop => {
        newHTML += generateShoppingTableHTML(shop, byShop[shop]);
    });
    
    // Combine with existing
    const combinedHTML = existingHTML + newHTML;
    localStorage.setItem('shoppingListHTML', combinedHTML);
    
    // Clear selection
    selectedShoppingItems = {};
    closeQuickAdd();
    
    // Refresh display
    if (typeof renderShopping === 'function') {
        renderShopping();
    }
    
    alert(`✅ Added ${selected.length} items to shopping!`);
}

// Generate shopping table HTML
function generateShoppingTableHTML(shop, items, existingTableId = null) {
    const currencySymbol = DISPLAY_CURRENCY;
    const brandStyle = getShopBrandStyle(shop);
    
    const tableId = existingTableId || `quickadd-${Date.now()}`;
    
    let totalPrice = 0;
    let totalQuantity = 0;
    const rows = items.map((item, index) => {
        const itemId = `${tableId}-item-${index}`;
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        totalQuantity += item.quantity;
        
        const isChecked = trolleyItems.has(itemId);
        
        return `
            <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" 
                               class="trolley-checkbox" 
                               data-table-id="${tableId}"
                               data-item-id="${itemId}"
                               ${isChecked ? 'checked' : ''}
                               onchange="toggleQuickAddTrolleyItem('${itemId}', '${tableId}')">
                        <span style="font-weight: 500;">${item.name}</span>
                    </label>
                </td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">${item.unit}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${currencySymbol}${item.price.toFixed(2)}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; font-weight: 700; font-size: 16px;">${typeof item.quantity === 'number' ? (item.quantity % 1 === 0 ? item.quantity : item.quantity.toFixed(1)) : item.quantity}</td>
            </tr>
        `;
    }).join('');
    
    // Calculate ticked total
    let tickedTotal = 0;
    items.forEach((item, index) => {
        const itemId = `${tableId}-item-${index}`;
        if (trolleyItems.has(itemId)) {
            tickedTotal += item.price * item.quantity;
        }
    });
    
    return `
        <div id="${tableId}" style="margin-bottom: 30px; border-radius: 12px; overflow: hidden; border: 2px solid #ddd; background: white;">
            <!-- Header with Delete Button -->
            <div style="${brandStyle.header}; position: relative;">
                <h3 style="${brandStyle.title}">${shop}</h3>
                <button onclick="deleteQuickAddTable('${tableId}')" 
                        style="position: absolute; top: 10px; right: 10px; background: #ff6b6b; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); z-index: 10;">
                    🗑️
                </button>
            </div>
            
            <!-- Table -->
            <table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: left; font-weight: bold;">Item</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: left; font-weight: bold;">Unit</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Price</th>
                        <th style="padding: 12px; border: 1px solid #ddd; text-align: center; font-weight: bold;">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                    <tr style="background: #f9f9f9; font-weight: bold;">
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: left;"><span>Totals:</span></td>
                        <td style="padding: 12px; border: 1px solid #ddd;"></td>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: right; font-size: 18px;">${currencySymbol}${totalPrice.toFixed(2)}</td>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center; font-size: 18px;">${totalQuantity % 1 === 0 ? totalQuantity : totalQuantity.toFixed(1)}</td>
                    </tr>
                </tbody>
            </table>
            
            <!-- Checkout button -->
            <div style="padding: 20px; text-align: center; background: #f9fafb;">
                <button id="checkout-btn-${tableId}"
                        onclick="checkoutQuickAddTable('${tableId}')" 
                        class="checkout-btn"
                        style="padding: 14px 28px; background: ${tickedTotal > 0 ? '#10b981' : '#d1d5db'}; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: ${tickedTotal > 0 ? 'pointer' : 'not-allowed'}; transition: all 0.2s ease; box-shadow: ${tickedTotal > 0 ? '0 4px 12px rgba(16,185,129,0.3)' : 'none'};"
                        ${tickedTotal === 0 ? 'disabled' : ''}>
                    ✅ Checkout ${currencySymbol}${tickedTotal.toFixed(2)}
                </button>
            </div>
        </div>
    `;
}

// Delete Quick Add table
function deleteQuickAddTable(tableId) {
    const table = document.getElementById(tableId);
    if (table) {
        table.remove();
        
        // Update localStorage - get all remaining Quick Add tables
        const container = document.getElementById('shoppingDisplay');
        if (container) {
            const allDivs = container.querySelectorAll('div[id^="quickadd-"]');
            const remainingHTML = Array.from(allDivs).map(div => div.outerHTML).join('');
            localStorage.setItem('shoppingListHTML', remainingHTML);
        }
        
        // Refresh if no tables left
        if (typeof renderShopping === 'function') {
            renderShopping();
        }
    }
}

// Toggle trolley item for Quick Add (uses shared trolleyItems from smart-shopping.js)
function toggleQuickAddTrolleyItem(itemId, tableId) {
    if (trolleyItems.has(itemId)) {
        trolleyItems.delete(itemId);
    } else {
        trolleyItems.add(itemId);
    }
    
    if (typeof saveTrolleyItems === 'function') {
        saveTrolleyItems();
    } else {
        localStorage.setItem('trolleyItems_v2', JSON.stringify([...trolleyItems]));
    }
    
    updateQuickAddCheckoutButton(tableId);
}

// Update checkout button for Quick Add table
function updateQuickAddCheckoutButton(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // Calculate ticked total from table rows
    let tickedTotal = 0;
    const rows = table.querySelectorAll('tbody tr:not(:last-child)');
    
    rows.forEach((row, index) => {
        const itemId = `${tableId}-item-${index}`;
        const checkbox = row.querySelector(`input[data-item-id="${itemId}"]`);
        
        if (checkbox && checkbox.checked) {
            const priceCell = row.cells[2];
            const quantityCell = row.cells[3];
            
            if (priceCell && quantityCell) {
                const priceText = priceCell.textContent.replace(/[^0-9.]/g, '');
                const price = parseFloat(priceText);
                const quantity = parseFloat(quantityCell.textContent); // Fixed: was parseInt
                
                if (!isNaN(price) && !isNaN(quantity)) {
                    tickedTotal += price * quantity;
                }
            }
        }
    });
    
    const btn = document.getElementById(`checkout-btn-${tableId}`);
    if (!btn) return;
    
    if (tickedTotal === 0) {
        btn.textContent = `✅ Checkout ${DISPLAY_CURRENCY}0.00`;
        btn.disabled = true;
        btn.style.background = '#d1d5db';
        btn.style.cursor = 'not-allowed';
        btn.style.boxShadow = 'none';
    } else {
        btn.textContent = `✅ Checkout ${DISPLAY_CURRENCY}${tickedTotal.toFixed(2)}`;
        btn.disabled = false;
        btn.style.background = '#10b981';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)';
    }
}

// Checkout Quick Add table
function checkoutQuickAddTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // Collect items to checkout AND items to keep
    const tickedItems = [];
    const remainingItems = [];
    const rows = table.querySelectorAll('tbody tr:not(:last-child)');
    
    rows.forEach((row, index) => {
        const itemId = `${tableId}-item-${index}`;
        const checkbox = row.querySelector(`input[data-item-id="${itemId}"]`);
        
        const itemCell = row.cells[0];
        const unitCell = row.cells[1];
        const priceCell = row.cells[2];
        const quantityCell = row.cells[3];
        
        const itemName = itemCell.querySelector('span').textContent;
        const unit = unitCell.textContent;
        const priceText = priceCell.textContent.replace(/[^0-9.]/g, '');
        const price = parseFloat(priceText);
        const quantity = parseFloat(quantityCell.textContent);
        
        const item = {
            name: itemName,
            unit: unit,
            price: price,
            quantity: quantity
        };
        
        if (checkbox && checkbox.checked) {
            tickedItems.push(item);
            // Remove from trolley
            trolleyItems.delete(itemId);
        } else {
            remainingItems.push(item);
        }
    });
    
    if (tickedItems.length === 0) {
        alert('Please select items to checkout');
        return;
    }
    
    // Add to Kitchen Stock
    tickedItems.forEach(item => {
        // Parse pack size to get quantity and unit
        const match = item.unit.match(/^(\d+(?:\.\d+)?)(ml|g|count|L|kg)$/);
        if (!match) return;
        
        const packQty = parseFloat(match[1]);
        let packUnit = match[2];
        
        // Find canonical key from SKU name
        let canonicalKey = null;
        Object.keys(CANONICAL_PRODUCTS).some(key => {
            const product = CANONICAL_PRODUCTS[key];
            return Object.values(product.shops || {}).some(skus => {
                return skus.some(sku => {
                    if (sku.sku === item.name) {
                        canonicalKey = key;
                        return true;
                    }
                    return false;
                });
            });
        });
        
        if (!canonicalKey) return;
        
        // Convert to base units
        let qtyBase = packQty * item.quantity;
        if (packUnit === 'kg') qtyBase *= 1000;
        if (packUnit === 'L') qtyBase *= 1000;
        
        if (typeof addToKitchenStock === 'function') {
            addToKitchenStock(canonicalKey, qtyBase);
        }
    });
    
    // Check if table should be deleted or re-rendered
    if (remainingItems.length === 0) {
        // Delete the entire table
        table.remove();
        
        // Update localStorage
        const container = document.getElementById('shoppingDisplay');
        if (container) {
            const allDivs = container.querySelectorAll('div[id^="quickadd-"]');
            const remainingHTML = Array.from(allDivs).map(div => div.outerHTML).join('');
            localStorage.setItem('shoppingListHTML', remainingHTML);
        }
        
        const total = tickedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        showToast(`✅ Checked out ${tickedItems.length} items (${DISPLAY_CURRENCY}${total.toFixed(2)}) - Table deleted`);
    } else {
        // Re-render table with remaining items (preserve tableId)
        const shop = table.querySelector('h3').textContent;
        const newTableHTML = generateShoppingTableHTML(shop, remainingItems, tableId);
        table.outerHTML = newTableHTML;
        
        // Update localStorage
        const container = document.getElementById('shoppingDisplay');
        if (container) {
            const allDivs = container.querySelectorAll('div[id^="quickadd-"]');
            const remainingHTML = Array.from(allDivs).map(div => div.outerHTML).join('');
            localStorage.setItem('shoppingListHTML', remainingHTML);
        }
        
        const total = tickedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        showToast(`✅ Checked out ${tickedItems.length} items (${DISPLAY_CURRENCY}${total.toFixed(2)}) - Added to Kitchen Stock!`);
    }
}

// Update Quick Add table totals after checkout
function updateQuickAddTableTotals(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr:not(:last-child)');
    let totalPrice = 0;
    let totalQuantity = 0;
    
    rows.forEach(row => {
        const priceCell = row.cells[2];
        const quantityCell = row.cells[3];
        
        const priceText = priceCell.textContent.replace(/[^0-9.]/g, '');
        const price = parseFloat(priceText);
        const quantity = parseFloat(quantityCell.textContent);
        
        totalPrice += price * quantity;
        totalQuantity += quantity;
    });
    
    // Update totals row
    const totalsRow = table.querySelector('tbody tr:last-child');
    if (totalsRow) {
        totalsRow.cells[2].textContent = `${DISPLAY_CURRENCY}${totalPrice.toFixed(2)}`;
        totalsRow.cells[3].textContent = totalQuantity.toFixed(1);
    }
}

console.log('✅ Quick Add Shopping loaded - V2.1.0 FIXED');
