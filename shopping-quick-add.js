// ================================================
// QUICK ADD SHOPPING - Product Database & Modal
// ================================================

// Function to get shop-specific brand styling
function getShopBrandStyle(shopName) {
    const styles = {
        "Tesco": {
            header: "background: linear-gradient(135deg, #0055a5 0%, #003d7a 100%); padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0, 85, 165, 0.3);",
            title: "margin: 0; color: #e31937; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); background: white; padding: 10px 20px; border-radius: 6px; display: inline-block; width: 100%; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);"
        },
        "Lidl": {
            header: "background: linear-gradient(135deg, #0050aa 0%, #003d85 100%); padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0, 80, 170, 0.3);",
            title: "margin: 0; color: #ffd500; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: 8px; text-align: center; text-shadow: 3px 3px 6px rgba(0,0,0,0.4); font-family: Arial Black, sans-serif;"
        },
        "Aldi": {
            header: "background: linear-gradient(135deg, #0082c3 0%, #006399 100%); padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0, 130, 195, 0.3);",
            title: "margin: 0; color: #ff6600; font-size: 30px; font-weight: 800; text-transform: uppercase; letter-spacing: 4px; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
        },
        "Asda": {
            header: "background: linear-gradient(135deg, #78be20 0%, #5a9617 100%); padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(120, 190, 32, 0.3);",
            title: "margin: 0; color: white; font-size: 30px; font-weight: 800; text-transform: uppercase; letter-spacing: 3px; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
        },
        "Sainsbury's": {
            header: "background: linear-gradient(135deg, #ff8200 0%, #cc6800 100%); padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(255, 130, 0, 0.3);",
            title: "margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: 2px; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
        }
    };
    
    return styles[shopName] || {
        header: "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);",
        title: "margin: 0; color: white; font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);"
    };
}

// Product database organized by shop and category
let quickAddProducts = {
     "Tesco": {
        "🥛 Dairy & Eggs": [
            { name: "Milk (Semi-Skimmed)", unit: "2.272L", price: 1.65, defaultQty: 1},
            { name: "Milk (Whole)", unit: "2.272L", price: 1.65, defaultQty: 1 },
            { name: "Milk (Skimmed)", unit: "2.272L", price: 1.65, defaultQty: 1 },
            { name: "Eggs (Barn)", unit: "pack of 10", price: 1.43, defaultQty: 1 },
            { name: "Cream (Double)", unit: "300ml", price: 1.50, defaultQty: 1 }
        ],
        "🍞 Bread & Bakery": [
            { name: "White Toastie Bread Sliced", unit: "loaf of 800g", price: 0.75, defaultQty: 1 },
            { name: "Nevills Plain Croissants", unit: "pack of 8", price: 1.39, defaultQty: 1 },
            { name: "Nevills Plain White Tortilla", unit: "pack of 8", price: 0.99, defaultQty: 1 }
        ],
        "🍖 Meat & Fish": [
            { name: "Chicken Breast", unit: "kg", price: 6.50, defaultQty: 0.5 },
            { name: "White Fish", unit: "kg", price: 8.00, defaultQty: 0.3 }
        ],
        "🥬 Vegetables": [
            { name: "Potatoes", unit: "kg", price: 1.20, defaultQty: 1 },
            { name: "Onions", unit: "kg", price: 0.90, defaultQty: 1 },
            { name: "Carrots", unit: "kg", price: 0.70, defaultQty: 1 },
            { name: "Tomatoes", unit: "kg", price: 2.00, defaultQty: 0.5 },
            { name: "Cucumbers", unit: "each", price: 0.60, defaultQty: 1 },
            { name: "Broccoli", unit: "head", price: 0.85, defaultQty: 1 }
            
        ],
        "🍎 Fruits": [
            { name: "Apples (Gala)", unit: "kg", price: 1.80, defaultQty: 1 },
            { name: "Bananas", unit: "kg", price: 1.00, defaultQty: 1 },
            { name: "Oranges", unit: "kg", price: 1.50, defaultQty: 1 }
        ],
        "🍚 Pantry & Staples": [
            { name: "Rice (Basmati)", unit: "1kg", price: 2.50, defaultQty: 1 },
            { name: "Pasta (Spaghetti)", unit: "500g", price: 0.80, defaultQty: 1 },
            { name: "Flour (Plain)", unit: "1.5kg", price: 1.10, defaultQty: 1 },
            { name: "Sugar (White)", unit: "1kg", price: 1.20, defaultQty: 1 },
            
            { name: "Vegetable Oil", unit: "1L", price: 2.50, defaultQty: 1 },
            { name: "Salt", unit: "750g", price: 0.55, defaultQty: 1 },
            { name: "Black Pepper", unit: "100g", price: 1.50, defaultQty: 1 }
        ],
        "🥫 Canned & Packaged": [
            { name: "Chopped Tomatoes", unit: "400g tin", price: 0.45, defaultQty: 2 },
            { name: "Baked Beans", unit: "420g tin", price: 0.50, defaultQty: 2 },
            { name: "Chickpeas", unit: "400g tin", price: 0.50, defaultQty: 1 },
            { name: "Tuna Chunks", unit: "145g tin", price: 1.00, defaultQty: 2 },
            { name: "Soup (Tomato)", unit: "400g tin", price: 0.70, defaultQty: 1 }
        ],
        "🥤 Drinks": [
            { name: "Orange Juice", unit: "1L", price: 1.50, defaultQty: 1 },
            { name: "Apple Juice", unit: "1L", price: 1.50, defaultQty: 1 },
            { name: "Cola", unit: "2L", price: 1.75, defaultQty: 1 },
            { name: "Water (Still)", unit: "2L", price: 0.60, defaultQty: 2 },
            { name: "Tea Bags", unit: "pack of 80", price: 2.00, defaultQty: 1 }
            
        ],
        "🧊 Frozen": [
            { name: "Frozen Peas", unit: "900g", price: 1.40, defaultQty: 1 },
            { name: "Frozen Mixed Veg", unit: "1kg", price: 1.50, defaultQty: 1 },
            { name: "Pizza (Margherita)", unit: "each", price: 1.50, defaultQty: 1 },
            { name: "Ice Cream", unit: "1L", price: 2.50, defaultQty: 1 }
        ],
        "🧼 Household": [
            { name: "Washing Up Liquid", unit: "500ml", price: 1.00, defaultQty: 1 },
            { name: "Laundry Detergent", unit: "1L", price: 4.00, defaultQty: 1 },
            { name: "Bin Bags", unit: "pack of 40", price: 1.00, defaultQty: 1 }
        ]
    },
    "Lidl": {
        "🥛 Dairy & Eggs": [
            { name: "Milk (Semi-Skimmed)", unit: "pint", price: 1.39, defaultQty: 4 },
            { name: "Eggs (Large)", unit: "pack of 10", price: 1.89, defaultQty: 1 },
            { name: "Butter", unit: "250g", price: 1.75, defaultQty: 1 },
            { name: "Cheese", unit: "400g", price: 2.49, defaultQty: 1 },
            { name: "Yogurt", unit: "500g", price: 0.99, defaultQty: 1 }
        ],
        "🍞 Bread & Bakery": [
            { name: "White Bread", unit: "loaf", price: 0.75, defaultQty: 1 },
            { name: "Brown Bread", unit: "loaf", price: 0.85, defaultQty: 1 },
            { name: "Rolls", unit: "pack of 6", price: 0.65, defaultQty: 1 },
            { name: "Croissants", unit: "pack of 6", price: 1.29, defaultQty: 1 }
        ],
        "🍖 Meat & Fish": [
            { name: "Chicken Breast", unit: "kg", price: 5.99, defaultQty: 0.5 },
            { name: "Beef Mince", unit: "500g", price: 2.99, defaultQty: 1 },
            { name: "Pork Chops", unit: "kg", price: 4.49, defaultQty: 0.5 },
            { name: "Bacon", unit: "200g", price: 1.99, defaultQty: 1 }
        ],
        "🥬 Vegetables": [
            { name: "Potatoes", unit: "2.5kg", price: 1.49, defaultQty: 1 },
            { name: "Onions", unit: "1kg", price: 0.79, defaultQty: 1 },
            { name: "Carrots", unit: "1kg", price: 0.59, defaultQty: 1 },
            { name: "Tomatoes", unit: "500g", price: 0.99, defaultQty: 1 }
        ],
        "🍎 Fruits": [
            { name: "Apples", unit: "kg", price: 1.49, defaultQty: 1 },
            { name: "Bananas", unit: "kg", price: 0.89, defaultQty: 1 },
            { name: "Oranges", unit: "kg", price: 1.29, defaultQty: 1 }
        ]
    }
};

// State for selected items
let selectedShoppingItems = {};

// Open Quick Add Modal
function openQuickAdd() {
    // Sync edit mode state
    window.quickAddEditMode = document.body.classList.contains('edit-mode');
    
    document.getElementById('quickAddModal').classList.add('active');
    renderQuickAddModal();
}

// Close Quick Add Modal
function closeQuickAdd() {
    document.getElementById('quickAddModal').classList.remove('active');
}

// Render the Quick Add Modal
function renderQuickAddModal() {
    const container = document.getElementById('quickAddContent');
    const shops = Object.keys(quickAddProducts);
    
    // Check if we're in edit mode
    const isEditMode = window.quickAddEditMode || false;
    
    let html = `
        <div style="margin-bottom: 20px;">
            <p style="color: #666; margin: 0 0 10px 0;">Click items to select, then choose quantity and price</p>
            <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                ${isEditMode ? 
                    '<button onclick="openCreateShopModal()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; flex: 1; min-width: 150px;">➕ Create new Shop and Items</button>' : 
                    ''
                }
                <button onclick="clearAllItems()" style="max-width: 100px; padding: 10px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">✕ Clear All</button>
            </div>
        </div>
    `;
    
    // Loop through shops
    shops.forEach(shop => {
        // Get shop-specific styling
        const shopStyles = getShopBrandStyle(shop);
        
        html += `
            <div style="margin-bottom: 30px;">
                <div style="${shopStyles.header}; position: relative;">
                    <h3 style="${shopStyles.title}">${shop}</h3>
                    ${isEditMode ? `
                        <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
                            <button onclick="editShop('${shop}')" style="background: rgba(255,255,255,0.9); border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 16px;" title="Edit shop">✏️</button>
                            <button onclick="deleteShop('${shop}')" style="background: rgba(255,100,100,0.9); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 16px;" title="Delete shop">🗑️</button>
                        </div>
                    ` : ''}
                </div>
        `;
        
        const categories = quickAddProducts[shop];
        
        // Loop through categories
        Object.keys(categories).forEach(category => {
            html += `
                <div style="margin-bottom: 25px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="margin: 0; color: #333; font-size: 16px;">${category}</h4>
                        ${isEditMode ? `
                            <div style="display: flex; gap: 5px;">
                                <button onclick="editCategory('${shop}', '${category}')" style="background: white; border: 1px solid #ddd; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 14px;" title="Edit category">✏️</button>
                                <button onclick="deleteCategory('${shop}', '${category}')" style="background: #ff6b6b; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 14px;" title="Delete category">🗑️</button>
                            </div>
                        ` : ''}
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px;">
            `;
            
            // Loop through products
            categories[category].forEach((product, index) => {
                const itemId = `${shop}|${category}|${index}`;
                const isSelected = selectedShoppingItems[itemId];
                const productJson = JSON.stringify(product);
                
                html += `
                    <div class="quick-add-item ${isSelected ? 'selected' : ''}" 
                         data-item-id="${itemId}"
                         data-product='${productJson}'
                         data-shop="${shop}"
                         data-category="${category}"
                         onclick="${isEditMode ? '' : 'toggleQuickItemFromElement(this)'}"
                         style="padding: 12px; background: white; border: 2px solid ${isSelected ? '#4CAF50' : '#ddd'}; border-radius: 6px; ${isEditMode ? '' : 'cursor: pointer;'} transition: all 0.2s; position: relative;">
                        ${isEditMode ? `
                            <div style="position: absolute; top: 5px; right: 5px; display: flex; gap: 3px;">
                                <button onclick="event.stopPropagation(); editItem('${shop}', '${category}', ${index})" style="background: white; border: 1px solid #ddd; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;" title="Edit item">✏️</button>
                                <button onclick="event.stopPropagation(); deleteItem('${shop}', '${category}', ${index})" style="background: #ff6b6b; color: white; border: none; padding: 3px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;" title="Delete item">🗑️</button>
                            </div>
                        ` : ''}
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: ${isSelected && !isEditMode ? '8px' : '0'};">
                            ${!isEditMode ? `
                                <div style="width: 20px; height: 20px; border: 2px solid ${isSelected ? '#4CAF50' : '#999'}; border-radius: 4px; background: ${isSelected ? '#4CAF50' : 'white'}; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                                    ${isSelected ? '<span style="color: white; font-size: 14px;">✓</span>' : ''}
                                </div>
                            ` : ''}
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #2c3e50; font-size: 14px;">${product.name}</div>
                                <div style="color: #7f8c8d; font-size: 12px;">${product.unit} · £${(parseFloat(product.price) || 0).toFixed(2)}</div>
                            </div>
                        </div>
                        ${isSelected && !isEditMode ? `
                            <div style="display: flex; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #e0e0e0;">
                                <input type="number" 
                                       value="${selectedShoppingItems[itemId].quantity || product.defaultQty}" 
                                       step="${product.unit.toLowerCase().includes('kg') ? '0.1' : '1'}" 
                                       min="${product.unit.toLowerCase().includes('kg') ? '0.1' : '1'}"
                                       onclick="event.stopPropagation()"
                                       onchange="updateQuantity('${itemId}', this.value)"
                                       style="width: 70px; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
                                <input type="number" 
                                       value="${selectedShoppingItems[itemId].price || product.price}" 
                                       step="0.01" 
                                       min="0"
                                       onclick="event.stopPropagation()"
                                       onchange="updatePrice('${itemId}', this.value)"
                                       style="width: 70px; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;"
                                       placeholder="£">
                                <div style="flex: 1; text-align: right; padding: 6px; background: #e8f5e9; border-radius: 4px; font-weight: 600; color: #2e7d32; font-size: 13px;">
                                    £${((parseFloat(selectedShoppingItems[itemId].quantity) || parseFloat(product.defaultQty) || 0) * (parseFloat(selectedShoppingItems[itemId].price) || parseFloat(product.price) || 0)).toFixed(2)}
                                </div>
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
        
        html += `</div>`;
    });
    
    // Add total and action buttons
    const selectedCount = Object.keys(selectedShoppingItems).length;
    const totalPrice = Object.values(selectedShoppingItems).reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        return sum + (qty * price);
    }, 0);
    
    html += `
        <div style="position: sticky; bottom: 0; background: white; padding: 20px; margin: 0 -20px -20px -20px; border-top: 2px solid #e0e0e0; border-radius: 0 0 12px 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div style="font-size: 18px; font-weight: 600; color: #2c3e50;">
                    Selected: ${selectedCount} items
                </div>
                <div style="font-size: 20px; font-weight: bold; color: #27ae60;">
                    Total: £${(totalPrice || 0).toFixed(2)}
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="closeQuickAdd()" style="flex: 1; padding: 15px; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px;">
                    ✕ Cancel
                </button>
                <button onclick="addSelectedToShopping()" style="flex: 2; padding: 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px;">
                    🛒 Add ${selectedCount} Items to Shopping List
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Toggle item selection from element
function toggleQuickItemFromElement(element) {
    const itemId = element.dataset.itemId;
    const product = JSON.parse(element.dataset.product);
    const shop = element.dataset.shop;
    const category = element.dataset.category;
    
    toggleQuickItem(itemId, product, shop, category);
}

// Toggle item selection
function toggleQuickItem(itemId, product, shop, category) {
    if (selectedShoppingItems[itemId]) {
        delete selectedShoppingItems[itemId];
    } else {
        selectedShoppingItems[itemId] = {
            name: product.name,
            unit: product.unit,
            quantity: product.defaultQty,
            price: product.price,
            shop: shop,
            category: category
        };
    }
    renderQuickAddModal();
}

// Update quantity
function updateQuantity(itemId, value) {
    if (selectedShoppingItems[itemId]) {
        selectedShoppingItems[itemId].quantity = parseFloat(value) || 1;
        renderQuickAddModal();
    }
}

// Update price
function updatePrice(itemId, value) {
    if (selectedShoppingItems[itemId]) {
        selectedShoppingItems[itemId].price = parseFloat(value) || 0;
        renderQuickAddModal();
    }
}

// Select all items
function selectAllItems() {
    Object.keys(quickAddProducts).forEach(shop => {
        Object.keys(quickAddProducts[shop]).forEach(category => {
            quickAddProducts[shop][category].forEach((product, index) => {
                const itemId = `${shop}|${category}|${index}`;
                if (!selectedShoppingItems[itemId]) {
                    selectedShoppingItems[itemId] = {
                        name: product.name,
                        unit: product.unit,
                        quantity: product.defaultQty,
                        price: product.price,
                        shop: shop,
                        category: category
                    };
                }
            });
        });
    });
    renderQuickAddModal();
}

// Clear all items
function clearAllItems() {
    selectedShoppingItems = {};
    renderQuickAddModal();
}

// Add selected items to shopping list
function addSelectedToShopping() {
    const itemCount = Object.keys(selectedShoppingItems).length;
    
    if (itemCount === 0) {
        alert('⚠️ Please select at least one item!');
        return;
    }
    
    // Group items by shop
    const itemsByShop = {};
    Object.values(selectedShoppingItems).forEach(item => {
        if (!itemsByShop[item.shop]) {
            itemsByShop[item.shop] = {};
        }
        if (!itemsByShop[item.shop][item.category]) {
            itemsByShop[item.shop][item.category] = [];
        }
        itemsByShop[item.shop][item.category].push(item);
    });
    
    // Format the shopping list as HTML table
    let shoppingHTML = '';
    let grandTotal = 0;
    let listId = Date.now(); // Unique ID for this shopping list
    
    Object.keys(itemsByShop).forEach(shop => {
        const shopId = `shop-${listId}-${shop.replace(/\s+/g, '-')}`;
        const shopStyles = getShopBrandStyle(shop);
        
        shoppingHTML += `
            <div id="${shopId}" style="margin-bottom: 30px; page-break-inside: avoid; border: 2px solid #ddd; border-radius: 8px; overflow: hidden; position: relative;">
                <!-- Delete button for this shop list -->
                <button onclick="deleteShopList('${shopId}')" 
                    style="position: absolute; top: 10px; right: 10px; z-index: 10; background: #ff4444; color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 18px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; padding: 0;"
                    title="Delete this list">
                    ✕
                </button>
                
                <!-- Store logo/header with brand styling -->
                <div style="${shopStyles.header}">
                    <h2 style="${shopStyles.title}">${shop}</h2>
                </div>
                
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
        
        let shopTotal = 0;
        let shopTotalQuantity = 0;
        
        Object.keys(itemsByShop[shop]).forEach(category => {
            itemsByShop[shop][category].forEach(item => {
                const qty = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.price) || 0;
                const itemTotal = qty * price;
                shopTotal += itemTotal;
                grandTotal += itemTotal;
                shopTotalQuantity += qty;
                
                // Format quantity display
                let qtyDisplay = qty;
                if (qty % 1 !== 0) {
                    qtyDisplay = qty.toFixed(1);
                }
                
                shoppingHTML += `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;">${item.name || ''}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${item.unit || ''}</td>
                        <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">£${price.toFixed(2)}</td>
                        <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${qtyDisplay}</td>
                    </tr>
                `;
            });
        });
        
        // Format total quantity display
        let totalQtyDisplay = shopTotalQuantity;
        if (shopTotalQuantity % 1 !== 0) {
            totalQtyDisplay = shopTotalQuantity.toFixed(1);
        }
        
        shoppingHTML += `
                        <tr style="background: #f9f9f9; font-weight: bold;">
                            <td colspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: right;">Totals:</td>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">£${(shopTotal || 0).toFixed(2)}</td>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">Total Qty: ${totalQtyDisplay}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    });
    
    // Get existing shopping list
    const existingHTML = localStorage.getItem('shoppingListHTML') || '';
    
    // Add new items to existing list
    const newHTML = existingHTML + (existingHTML ? '<div style="margin: 40px 0; border-top: 3px solid #ddd;"></div>' : '') + shoppingHTML;
    
    // Save to localStorage
    localStorage.setItem('shoppingListHTML', newHTML);
    
    // Update display
    renderShopping();
    
    // Switch to shopping tab
    document.querySelector('[data-tab="shopping"]').click();
    
    // Close modal
    closeQuickAdd();
    
    // Show success message BEFORE resetting
    alert(`✅ Added ${itemCount} items to your shopping list!\n\nTotal: £${(grandTotal || 0).toFixed(2)}`);
    
    // Reset selections
    selectedShoppingItems = {};
}

// Delete a specific shop list
function deleteShopList(shopId) {
    if (confirm('Delete this shopping list?')) {
        // Get current HTML
        const container = document.getElementById('shoppingDisplay');
        if (!container) return;
        
        // Remove the specific shop div
        const shopDiv = document.getElementById(shopId);
        if (shopDiv) {
            // Check if there's a divider before or after this shop
            const nextSibling = shopDiv.nextElementSibling;
            const prevSibling = shopDiv.previousElementSibling;
            
            // Remove the shop div
            shopDiv.remove();
            
            // Clean up dividers - remove orphaned dividers
            if (nextSibling && nextSibling.style.borderTop) {
                nextSibling.remove();
            } else if (prevSibling && prevSibling.style.borderTop) {
                prevSibling.remove();
            }
            
            // Get cleaned HTML and remove any multiple consecutive dividers
            let updatedHTML = container.innerHTML.trim();
            
            // Remove multiple consecutive dividers
            updatedHTML = updatedHTML.replace(/(<div style="margin: 40px 0; border-top: 3px solid #ddd;"><\/div>\s*){2,}/g, '<div style="margin: 40px 0; border-top: 3px solid #ddd;"></div>');
            
            // Remove leading/trailing dividers
            updatedHTML = updatedHTML.replace(/^<div style="margin: 40px 0; border-top: 3px solid #ddd;"><\/div>\s*/g, '');
            updatedHTML = updatedHTML.replace(/\s*<div style="margin: 40px 0; border-top: 3px solid #ddd;"><\/div>$/g, '');
            
            if (updatedHTML === '' || !updatedHTML.includes('shop-')) {
                localStorage.removeItem('shoppingListHTML');
                renderShopping(); // Re-render to show empty state
            } else {
                localStorage.setItem('shoppingListHTML', updatedHTML);
            }
        }
    }
}

// Toggle Edit Mode for Quick Add
// Initialize based on current edit mode state
window.quickAddEditMode = document.body.classList.contains('edit-mode');

// Edit shop name
function editShop(oldShopName) {
    const newShopName = prompt('Edit shop name:', oldShopName);
    if (newShopName && newShopName !== oldShopName) {
        quickAddProducts[newShopName] = quickAddProducts[oldShopName];
        delete quickAddProducts[oldShopName];
        localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
        renderQuickAddModal();
    }
}

// Delete shop
function deleteShop(shopName) {
    if (confirm(`Delete shop "${shopName}" and all its items?`)) {
        delete quickAddProducts[shopName];
        localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
        renderQuickAddModal();
    }
}

// Edit category name
function editCategory(shopName, oldCategory) {
    const newCategory = prompt('Edit category name:', oldCategory);
    if (newCategory && newCategory !== oldCategory) {
        quickAddProducts[shopName][newCategory] = quickAddProducts[shopName][oldCategory];
        delete quickAddProducts[shopName][oldCategory];
        localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
        renderQuickAddModal();
    }
}

// Delete category
function deleteCategory(shopName, category) {
    if (confirm(`Delete category "${category}" and all its items?`)) {
        delete quickAddProducts[shopName][category];
        localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
        renderQuickAddModal();
    }
}

// Edit item
function editItem(shopName, category, itemIndex) {
    const item = quickAddProducts[shopName][category][itemIndex];
    const currentData = `${item.name} | ${item.unit} | ${item.price} | ${item.defaultQty}`;
    const newData = prompt('Edit item (Name | Unit | Price | DefaultQty):', currentData);
    
    if (newData) {
        const parts = newData.split('|').map(p => p.trim());
        if (parts.length === 4) {
            quickAddProducts[shopName][category][itemIndex] = {
                name: parts[0],
                unit: parts[1],
                price: parseFloat(parts[2]),
                defaultQty: parseFloat(parts[3])
            };
            localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
            renderQuickAddModal();
        } else {
            alert('⚠️ Invalid format! Use: Name | Unit | Price | DefaultQty');
        }
    }
}

// Delete item
function deleteItem(shopName, category, itemIndex) {
    const item = quickAddProducts[shopName][category][itemIndex];
    if (confirm(`Delete "${item.name}"?`)) {
        quickAddProducts[shopName][category].splice(itemIndex, 1);
        
        // If category is empty, delete it
        if (quickAddProducts[shopName][category].length === 0) {
            delete quickAddProducts[shopName][category];
        }
        
        // If shop is empty, delete it
        if (Object.keys(quickAddProducts[shopName]).length === 0) {
            delete quickAddProducts[shopName];
        }
        
        localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
        renderQuickAddModal();
    }
}

// Create new shop and items modal
function openCreateShopModal() {
    const modalHTML = `
        <div id="createShopModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 12px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <h3 style="margin: 0 0 20px 0; color: #2196F3;">➕ Create New Shop and Items</h3>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Shop Name:</label>
                    <div style="position: relative;">
                        <input type="text" id="newShopName" placeholder="e.g., Asda, Sainsbury's" 
                            style="width: 100%; padding: 10px 40px 10px 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px;">
                        <button onclick="toggleShopDropdown()" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 20px; cursor: pointer; padding: 5px;">🏪</button>
                        <div id="shopDropdown" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 2px solid #ddd; border-radius: 6px; margin-top: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; max-height: 200px; overflow-y: auto; width: 200px;">
                            <div onclick="selectShop('Tesco')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">Tesco</div>
                            <div onclick="selectShop('Lidl')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">Lidl</div>
                            <div onclick="selectShop('Asda')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">Asda</div>
                            <div onclick="selectShop('Sainsbury\\'s')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">Sainsbury's</div>
                            <div onclick="selectShop('Aldi')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">Aldi</div>
                            <div onclick="selectShop('Morrisons')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">Morrisons</div>
                            <div onclick="selectShop('Waitrose')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">Waitrose</div>
                            <div onclick="selectShop('Iceland')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">Iceland</div>
                            <div onclick="selectShop('Co-op')" style="padding: 10px; cursor: pointer;">Co-op</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Category:</label>
                    <div style="position: relative;">
                        <input type="text" id="newCategory" placeholder="e.g., 🥛 Dairy & Eggs" 
                            style="width: 100%; padding: 10px 40px 10px 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px;">
                        <button onclick="toggleCategoryDropdown()" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 20px; cursor: pointer; padding: 5px;">📁</button>
                        <div id="categoryDropdown" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 2px solid #ddd; border-radius: 6px; margin-top: 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; max-height: 200px; overflow-y: auto; width: 200px;">
                            <div onclick="selectCategory('🥛 Dairy & Eggs')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">🥛 Dairy & Eggs</div>
                            <div onclick="selectCategory('🍞 Bread & Bakery')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">🍞 Bread & Bakery</div>
                            <div onclick="selectCategory('🍖 Meat & Fish')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">🍖 Meat & Fish</div>
                            <div onclick="selectCategory('🥬 Vegetables')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">🥬 Vegetables</div>
                            <div onclick="selectCategory('🍎 Fruits')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">🍎 Fruits</div>
                            <div onclick="selectCategory('🍚 Pantry & Staples')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">🍚 Pantry & Staples</div>
                            <div onclick="selectCategory('🥫 Canned & Packaged')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">🥫 Canned & Packaged</div>
                            <div onclick="selectCategory('🥤 Drinks')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">🥤 Drinks</div>
                            <div onclick="selectCategory('🧊 Frozen')" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;">🧊 Frozen</div>
                            <div onclick="selectCategory('🧼 Household')" style="padding: 10px; cursor: pointer;">🧼 Household</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Items (one per line in format: Name | Unit | Price | DefaultQty):</label>
                    <textarea id="newItems" onfocus="this.select()" style="width: 100%; height: 200px; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 13px; font-family: monospace; color: #666;">Milk (Semi-Skimmed) | 2.272L | 1.65 | 1
Eggs (Barn) | pack of 10 | 1.43 | 1</textarea>
                    <p style="font-size: 12px; color: #e67e22; margin: 5px 0 0 0; font-weight: 600;">⚠️ Delete the example above and add your items | Format: Name | Unit | Price | DefaultQty</p>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="saveNewShop()" style="flex: 1; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">✓ Save</button>
                    <button onclick="closeCreateShopModal()" style="flex: 1; padding: 12px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">✕ Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function toggleShopDropdown() {
    const dropdown = document.getElementById('shopDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

function toggleCategoryDropdown() {
    const dropdown = document.getElementById('categoryDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

function selectShop(shopName) {
    document.getElementById('newShopName').value = shopName;
    document.getElementById('shopDropdown').style.display = 'none';
}

function selectCategory(categoryName) {
    document.getElementById('newCategory').value = categoryName;
    document.getElementById('categoryDropdown').style.display = 'none';
}

function closeCreateShopModal() {
    const modal = document.getElementById('createShopModal');
    if (modal) modal.remove();
}

function saveNewShop() {
    const shopName = document.getElementById('newShopName').value.trim();
    const category = document.getElementById('newCategory').value.trim();
    const itemsText = document.getElementById('newItems').value.trim();
    
    if (!shopName || !category || !itemsText) {
        alert('⚠️ Please fill in all fields!');
        return;
    }
    
    // Parse items
    const items = [];
    const lines = itemsText.split('\n');
    for (const line of lines) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length === 4) {
            items.push({
                name: parts[0],
                unit: parts[1],
                price: parseFloat(parts[2]),
                defaultQty: parseFloat(parts[3])
            });
        }
    }
    
    if (items.length === 0) {
        alert('⚠️ No valid items found! Check the format.');
        return;
    }
    
    // Add to product database
    if (!quickAddProducts[shopName]) {
        quickAddProducts[shopName] = {};
    }
    quickAddProducts[shopName][category] = items;
    
    // Save to localStorage
    localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
    
    closeCreateShopModal();
    renderQuickAddModal();
    alert(`✅ Added ${items.length} items to ${shopName} - ${category}!`);
}

// Load custom products from localStorage on page load
function loadCustomProducts() {
    const saved = localStorage.getItem('quickAddProducts');
    if (saved) {
        try {
            quickAddProducts = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading custom products:', e);
        }
    }
}

// Initialize on load
loadCustomProducts();

console.log('✅ Quick Add Shopping feature loaded!');
console.log('Available shops:', Object.keys(quickAddProducts));
