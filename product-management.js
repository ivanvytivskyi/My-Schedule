// ================================================
// PRODUCT MANAGEMENT SYSTEM
// ================================================
// Manages custom products, shops, and categories
// Saves to localStorage and merges with CANONICAL_PRODUCTS

// Custom products stored in localStorage
let customProducts = JSON.parse(localStorage.getItem('customProducts')) || {};
let customShops = JSON.parse(localStorage.getItem('customShops')) || {};
let customCategories = normalizeCustomCategories(JSON.parse(localStorage.getItem('customCategories')) || []);

const DEFAULT_CATEGORY_ICONS = {
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

// Open Product Management Modal
function openProductManagement() {
    const modal = document.getElementById('productManagementModal');
    if (!modal) return;
    
    modal.classList.add('active');
    
    // Populate dropdowns and lists
    populateShopDropdown();
    populateCategoryDropdown();
    renderExistingShops();
    renderExistingCategories();
    renderCustomProducts();
    
    // Reset to first tab
    switchProductTab('addItem');
}

// Close Product Management Modal
function closeProductManagement() {
    const modal = document.getElementById('productManagementModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    
    // Clear forms
    document.getElementById('addItemForm').reset();
    document.getElementById('newShopForm').reset();
    document.getElementById('newCategoryForm').reset();
}

// Switch between tabs
function switchProductTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.product-tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.product-mgmt-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.style.borderBottom = '3px solid transparent';
        tab.style.color = '#6b7280';
    });
    
    // Show selected tab
    const tabContent = document.getElementById(`${tabName}TabContent`);
    const tabButton = document.getElementById(`${tabName}Tab`);
    
    if (tabContent) tabContent.style.display = 'block';
    if (tabButton) {
        tabButton.classList.add('active');
        tabButton.style.borderBottom = '3px solid #f59e0b';
        tabButton.style.color = '#f59e0b';
    }
}

// Populate shop dropdown
function populateShopDropdown() {
    const select = document.getElementById('addItemShop');
    if (!select) return;
    
    // Get all shops (built-in + custom)
    const allShops = new Set();
    
    // Add shops from CANONICAL_PRODUCTS
    if (typeof CANONICAL_PRODUCTS !== 'undefined') {
        Object.values(CANONICAL_PRODUCTS).forEach(product => {
            if (product.shops) {
                Object.keys(product.shops).forEach(shop => allShops.add(shop));
            }
        });
    }
    
    // Add custom shops
    Object.keys(customShops).forEach(shop => allShops.add(shop));
    
    // Sort and populate
    const shops = Array.from(allShops).sort();
    select.innerHTML = '<option value="">Choose a shop...</option>';
    shops.forEach(shop => {
        select.innerHTML += `<option value="${shop}">${shop}</option>`;
    });
}

// Populate category dropdown
function populateCategoryDropdown() {
    const select = document.getElementById('addItemCategory');
    if (!select) return;
    
    const defaultCategories = Object.keys(DEFAULT_CATEGORY_ICONS);
    const customCategoryNames = customCategories.map(cat => cat.name);
    
    const allCategories = [...new Set([...defaultCategories, ...customCategoryNames])]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
    
    select.innerHTML = '<option value="">Choose a category...</option>';
    allCategories.forEach(category => {
        const icon = getCategoryIconForName(category);
        select.innerHTML += `<option value="${category}">${icon ? icon + ' ' : ''}${category}</option>`;
    });
}

// Add new item to product catalog
function addNewItem(event) {
    event.preventDefault();
    
    const shop = document.getElementById('addItemShop').value;
    const category = document.getElementById('addItemCategory').value;
    const name = document.getElementById('addItemName').value;
    const packQty = parseFloat(document.getElementById('addItemPackQty').value);
    const packUnit = document.getElementById('addItemPackUnit').value;
    const price = parseFloat(document.getElementById('addItemPrice').value);
    const defaultQty = parseFloat(document.getElementById('addItemDefaultQty').value);
    const loose = document.getElementById('addItemLoose').checked;
    
    // Validate loose flag (only for kg/L)
    if (loose && packUnit !== 'kg' && packUnit !== 'L') {
        alert('⚠️ Loose items can only use kg or L units');
        return;
    }
    
    // Check if we're editing an existing product
    if (window.editingProduct) {
        const { canonicalKey, shop: oldShop, skuIndex } = window.editingProduct;
        
        // Update existing product
        if (customProducts[canonicalKey] && customProducts[canonicalKey].shops[oldShop]) {
            // If shop changed, move the SKU
            if (shop !== oldShop) {
                const sku = customProducts[canonicalKey].shops[oldShop][skuIndex];
                customProducts[canonicalKey].shops[oldShop].splice(skuIndex, 1);
                
                // Remove old shop if empty
                if (customProducts[canonicalKey].shops[oldShop].length === 0) {
                    delete customProducts[canonicalKey].shops[oldShop];
                }
                
                // Add to new shop
                if (!customProducts[canonicalKey].shops[shop]) {
                    customProducts[canonicalKey].shops[shop] = [];
                }
                customProducts[canonicalKey].shops[shop].push({
                    sku: name,
                    packQty,
                    packUnit,
                    price,
                    defaultQty,
                    ...(loose ? { loose: true } : {})
                });
            } else {
                // Update in same shop
                customProducts[canonicalKey].shops[oldShop][skuIndex] = {
                    sku: name,
                    packQty,
                    packUnit,
                    price,
                    defaultQty,
                    ...(loose ? { loose: true } : {})
                };
            }
            
            // Update product name and category
            customProducts[canonicalKey].name = name;
            customProducts[canonicalKey].category = category;
        }
        
        // Clear edit mode
        window.editingProduct = null;
        
        // Reset button
        const submitBtn = document.querySelector('#addItemForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = '✅ Add Product';
            submitBtn.style.background = '#f59e0b';
        }
        
        showToast(`✅ Updated ${name}!`);
    } else {
        // Create new product
        const canonicalKey = `custom_${name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
        
        // Determine unit type
        let unitType;
        if (packUnit === 'count') {
            unitType = 'count';
        } else if (packUnit === 'kg' || packUnit === 'g') {
            unitType = 'g';
        } else {
            unitType = 'ml';
        }
        
        // Create product entry
        if (!customProducts[canonicalKey]) {
            customProducts[canonicalKey] = {
                name: name,
                unitType: unitType,
                shops: {},
                custom: true,
                category: category
            };
        }
        
        // Add shop data
        if (!customProducts[canonicalKey].shops[shop]) {
            customProducts[canonicalKey].shops[shop] = [];
        }
        
        const skuData = {
            sku: name,
            packQty: packQty,
            packUnit: packUnit,
            price: price,
            defaultQty: defaultQty
        };
        
        if (loose) {
            skuData.loose = true;
        }
        
        customProducts[canonicalKey].shops[shop].push(skuData);
        
        showToast(`✅ Added ${name} to ${shop}!`);
    }
    
    // Save to localStorage
    saveCustomProducts();
    
    // Merge with CANONICAL_PRODUCTS
    mergeCustomProducts();
    
    // Refresh dependent UIs
    notifyCatalogConsumers();
    
    // Refresh custom products list
    renderCustomProducts();
    
    // Clear form
    document.getElementById('addItemForm').reset();
}

// Add new shop
function addNewShop(event) {
    event.preventDefault();
    
    const shopName = document.getElementById('newShopName').value.trim();
    const shopColor = document.getElementById('newShopColor').value;
    
    if (!shopName) {
        alert('⚠️ Please enter a shop name');
        return;
    }
    
    // Check if shop already exists
    const allShops = new Set();
    if (typeof CANONICAL_PRODUCTS !== 'undefined') {
        Object.values(CANONICAL_PRODUCTS).forEach(product => {
            if (product.shops) {
                Object.keys(product.shops).forEach(shop => allShops.add(shop.toLowerCase()));
            }
        });
    }
    
    if (allShops.has(shopName.toLowerCase())) {
        alert(`⚠️ Shop "${shopName}" already exists`);
        return;
    }
    
    // Add to custom shops
    customShops[shopName] = {
        color: shopColor,
        custom: true
    };
    
    // Save to localStorage
    saveCustomShops();
    
    // Refresh UI
    populateShopDropdown();
    renderExistingShops();
    
    // Show success message
    showToast(`🏪 Created shop: ${shopName}!`);
    
    // Clear form
    document.getElementById('newShopForm').reset();
}

// Add new category
function addNewCategory(event) {
    event.preventDefault();
    
    const categoryName = document.getElementById('newCategoryName').value.trim();
    const categoryIcon = document.getElementById('newCategoryIcon').value.trim();
    
    if (!categoryName) {
        alert('⚠️ Please enter a category name');
        return;
    }
    
    // Check if category already exists
    if (categoryExists(categoryName)) {
        alert(`⚠️ Category "${categoryName}" already exists`);
        return;
    }
    
    // Add to custom categories
    customCategories.push({
        name: categoryName,
        icon: categoryIcon || getCategoryIconForName(categoryName)
    });
    
    // Save to localStorage
    saveCustomCategories();
    
    // Refresh UI
    populateCategoryDropdown();
    renderExistingCategories();
    notifyCatalogConsumers();
    
    // Show success message
    showToast(`📦 Created category: ${categoryName}!`);
    
    // Clear form
    document.getElementById('newCategoryForm').reset();
}

// Render existing shops
function renderExistingShops() {
    const container = document.getElementById('existingShopsList');
    if (!container) return;
    
    // Get all shops
    const allShops = new Set();
    if (typeof CANONICAL_PRODUCTS !== 'undefined') {
        Object.values(CANONICAL_PRODUCTS).forEach(product => {
            if (product.shops) {
                Object.keys(product.shops).forEach(shop => allShops.add(shop));
            }
        });
    }
    Object.keys(customShops).forEach(shop => allShops.add(shop));
    
    const shops = Array.from(allShops).sort();
    
    container.innerHTML = '';
    shops.forEach(shop => {
        const isCustom = customShops[shop] !== undefined;
        const color = customShops[shop]?.color || '#0055a5';
        const escapedShop = shop.replace(/'/g, "\\'");
        
        container.innerHTML += `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f9fafb; border-radius: 8px; border: 2px solid #e5e7eb;">
                <div style="width: 30px; height: 30px; background: ${color}; border-radius: 6px; flex-shrink: 0;"></div>
                <span style="flex: 1; font-weight: 600; color: #374151;">${shop}</span>
                ${isCustom ? `
                    <span style="padding: 4px 8px; background: #fbbf24; color: white; border-radius: 4px; font-size: 12px; font-weight: 600;">CUSTOM</span>
                    <button onclick="deleteCustomShop('${escapedShop}')" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">🗑️</button>
                ` : ''}
            </div>
        `;
    });
}

// Render existing categories
function renderExistingCategories() {
    const container = document.getElementById('existingCategoriesList');
    if (!container) return;
    
    const defaultCategories = Object.keys(DEFAULT_CATEGORY_ICONS).map(name => ({
        name,
        icon: DEFAULT_CATEGORY_ICONS[name],
        custom: false
    }));
    
    const customCategoryCards = customCategories.map(cat => ({
        name: cat.name,
        icon: cat.icon || '📦',
        custom: true
    }));
    
    const allCategories = [...defaultCategories, ...customCategoryCards].sort((a, b) => a.name.localeCompare(b.name));
    
    container.innerHTML = '';
    allCategories.forEach(category => {
        const escapedCategory = category.name.replace(/'/g, "\\'");
        
        container.innerHTML += `
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: ${category.custom ? '#fbbf24' : '#e5e7eb'}; color: ${category.custom ? 'white' : '#374151'}; border-radius: 8px; font-weight: 600; font-size: 14px;">
                <span>${category.icon}</span>
                <span style="flex: 1;">${category.name}</span>
                ${category.custom ? `<button onclick="editCustomCategory('${escapedCategory}')" style="background: #2563eb; color: white; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 4px;">✏️</button>` : ''}
                ${category.custom ? `<button onclick="deleteCustomCategory('${escapedCategory}')" style="background: #dc2626; color: white; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 4px;">🗑️</button>` : ''}
            </div>
        `;
    });
}

function normalizeCustomCategories(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(entry => {
        if (!entry) return null;
        if (typeof entry === 'string') return { name: entry, icon: '' };
        if (typeof entry === 'object') {
            return { name: entry.name, icon: entry.icon || '' };
        }
        return null;
    }).filter(Boolean);
}

function categoryExists(categoryName) {
    if (!categoryName) return false;
    const nameLower = categoryName.toLowerCase();
    const defaults = Object.keys(DEFAULT_CATEGORY_ICONS);
    if (defaults.some(cat => cat.toLowerCase() === nameLower)) return true;
    return customCategories.some(cat => cat.name.toLowerCase() === nameLower);
}

function getCategoryIconForName(name) {
    if (!name) return '📦';
    const custom = customCategories.find(cat => cat.name === name);
    if (custom) return custom.icon || '📦';
    return DEFAULT_CATEGORY_ICONS[name] || '📦';
}

function editCustomCategory(categoryName) {
    const category = customCategories.find(cat => cat.name === categoryName);
    if (!category) {
        alert('⚠️ Category not found');
        return;
    }
    
    const newName = prompt('Edit category name', category.name)?.trim();
    if (!newName) return;
    
    const newIcon = prompt('Choose an emoji for this category', category.icon || '📦')?.trim() || getCategoryIconForName(newName);
    
    if (categoryExists(newName) && newName.toLowerCase() !== category.name.toLowerCase()) {
        alert(`⚠️ Category "${newName}" already exists`);
        return;
    }
    
    const oldName = category.name;
    category.name = newName;
    category.icon = newIcon;
    
    updateProductsCategoryName(oldName, newName);
    saveCustomCategories();
    populateCategoryDropdown();
    renderExistingCategories();
    notifyCatalogConsumers();
    showToast(`✏️ Updated category: ${newName}`);
}

// Save custom products to localStorage
function saveCustomProducts() {
    localStorage.setItem('customProducts', JSON.stringify(customProducts));
}

// Save custom shops to localStorage
function saveCustomShops() {
    localStorage.setItem('customShops', JSON.stringify(customShops));
}

// Save custom categories to localStorage
function saveCustomCategories() {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
}

function updateProductsCategoryName(oldName, newName) {
    const oldLower = oldName.toLowerCase();
    Object.keys(customProducts).forEach(key => {
        const product = customProducts[key];
        if (product.category && product.category.toLowerCase() === oldLower) {
            product.category = newName;
        }
    });
    saveCustomProducts();
    mergeCustomProducts();
    
    if (typeof renderCustomProducts === 'function') {
        renderCustomProducts();
    }
}

function notifyCatalogConsumers() {
    if (typeof populateQuickAddFromCatalog === 'function') {
        populateQuickAddFromCatalog();
        
        const quickAddModal = document.getElementById('quickAddModal');
        if (quickAddModal && quickAddModal.classList.contains('active') && typeof renderQuickAddModal === 'function') {
            renderQuickAddModal();
        }
    }
    
    if (typeof refreshKitchenStockCatalog === 'function') {
        refreshKitchenStockCatalog();
    }
}

// Merge custom products with CANONICAL_PRODUCTS
function mergeCustomProducts() {
    if (typeof CANONICAL_PRODUCTS === 'undefined') {
        console.warn('CANONICAL_PRODUCTS not yet loaded');
        return;
    }
    
    // Add custom products to CANONICAL_PRODUCTS
    Object.keys(customProducts).forEach(key => {
        if (!CANONICAL_PRODUCTS[key]) {
            CANONICAL_PRODUCTS[key] = customProducts[key];
        } else {
            // Merge shops if product already exists
            Object.keys(customProducts[key].shops).forEach(shop => {
                if (!CANONICAL_PRODUCTS[key].shops[shop]) {
                    CANONICAL_PRODUCTS[key].shops[shop] = [];
                }
                customProducts[key].shops[shop].forEach(sku => {
                    // Check if SKU already exists
                    const existingSku = CANONICAL_PRODUCTS[key].shops[shop].find(s => s.sku === sku.sku);
                    if (!existingSku) {
                        CANONICAL_PRODUCTS[key].shops[shop].push(sku);
                    }
                });
            });
        }
    });
}

// Render custom products list
function renderCustomProducts() {
    const container = document.getElementById('customProductsList');
    if (!container) return;
    
    // Get all custom products
    const customItems = [];
    Object.keys(customProducts).forEach(canonicalKey => {
        const product = customProducts[canonicalKey];
        Object.keys(product.shops).forEach(shop => {
            product.shops[shop].forEach((sku, idx) => {
                customItems.push({
                    canonicalKey,
                    shop,
                    sku,
                    skuIndex: idx,
                    productName: product.name,
                    category: product.category
                });
            });
        });
    });
    
    if (customItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No custom products yet. Add your first product above!</p>';
        return;
    }
    
    container.innerHTML = '';
    customItems.forEach(item => {
        // Escape single quotes for onclick handlers
        const escapedShop = item.shop.replace(/'/g, "\\'");
        const escapedCanonical = item.canonicalKey.replace(/'/g, "\\'");
        
        container.innerHTML += `
            <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #fef3c7; border-radius: 8px; border: 2px solid #fbbf24;">
                <div style="flex: 1;">
                    <div style="font-weight: 700; color: #374151; margin-bottom: 4px;">${item.productName}</div>
                    <div style="font-size: 12px; color: #6b7280;">
                        ${item.shop} • ${item.category} • ${item.sku.packQty}${item.sku.packUnit} • £${item.sku.price.toFixed(2)}
                        ${item.sku.loose ? ' • <span style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-weight: 600;">LOOSE</span>' : ''}
                    </div>
                </div>
                <button onclick="editCustomProduct('${escapedCanonical}', '${escapedShop}', ${item.skuIndex})" style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">✏️ Edit</button>
                <button onclick="deleteCustomProduct('${escapedCanonical}', '${escapedShop}', ${item.skuIndex})" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">🗑️ Delete</button>
            </div>
        `;
    });
}

// Edit custom product
function editCustomProduct(canonicalKey, shop, skuIndex) {
    const product = customProducts[canonicalKey];
    if (!product || !product.shops[shop] || !product.shops[shop][skuIndex]) {
        alert('⚠️ Product not found');
        return;
    }
    
    const sku = product.shops[shop][skuIndex];
    
    // Populate form with existing data
    document.getElementById('addItemShop').value = shop;
    document.getElementById('addItemCategory').value = product.category || 'Other';
    document.getElementById('addItemName').value = product.name;
    document.getElementById('addItemPackQty').value = sku.packQty;
    document.getElementById('addItemPackUnit').value = sku.packUnit;
    document.getElementById('addItemPrice').value = sku.price;
    document.getElementById('addItemDefaultQty').value = sku.defaultQty || 1;
    document.getElementById('addItemLoose').checked = sku.loose || false;
    
    // Change button text to "Update"
    const submitBtn = document.querySelector('#addItemForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = '✅ Update Product';
        submitBtn.style.background = '#3b82f6';
    }
    
    // Store edit mode data
    window.editingProduct = {
        canonicalKey,
        shop,
        skuIndex
    };
    
    // Scroll to form
    document.getElementById('addItemTabContent').scrollTop = 0;
}

// Delete custom product
function deleteCustomProduct(canonicalKey, shop, skuIndex) {
    if (!confirm('Delete this custom product?')) return;
    
    const product = customProducts[canonicalKey];
    if (!product || !product.shops[shop]) return;
    
    // Remove SKU
    product.shops[shop].splice(skuIndex, 1);
    
    // If shop has no more SKUs, remove shop
    if (product.shops[shop].length === 0) {
        delete product.shops[shop];
    }
    
    // If product has no more shops, remove product
    if (Object.keys(product.shops).length === 0) {
        delete customProducts[canonicalKey];
        
        // Also remove from CANONICAL_PRODUCTS if it exists
        if (typeof CANONICAL_PRODUCTS !== 'undefined' && CANONICAL_PRODUCTS[canonicalKey]?.custom) {
            delete CANONICAL_PRODUCTS[canonicalKey];
        }
    }
    
    // Save and refresh
    saveCustomProducts();
    mergeCustomProducts();
    
    notifyCatalogConsumers();
    
    renderCustomProducts();
    showToast('🗑️ Product deleted');
}

// Delete custom shop
function deleteCustomShop(shopName) {
    // Check if any custom products use this shop
    const productsUsingShop = [];
    Object.keys(customProducts).forEach(canonicalKey => {
        const product = customProducts[canonicalKey];
        if (product.shops && product.shops[shopName]) {
            productsUsingShop.push(product.name);
        }
    });
    
    if (productsUsingShop.length > 0) {
        alert(`⚠️ Cannot delete shop "${shopName}" because ${productsUsingShop.length} custom product(s) use it:\n\n${productsUsingShop.join(', ')}\n\nPlease delete or move these products first.`);
        return;
    }
    
    if (!confirm(`Delete custom shop "${shopName}"?`)) return;
    
    // Remove from custom shops
    delete customShops[shopName];
    
    // Save and refresh
    saveCustomShops();
    renderExistingShops();
    populateShopDropdown();
    
    showToast(`🗑️ Deleted shop: ${shopName}`);
}

// Delete custom category
function deleteCustomCategory(categoryName) {
    // Check if any custom products use this category
    const productsUsingCategory = [];
    Object.keys(customProducts).forEach(canonicalKey => {
        const product = customProducts[canonicalKey];
        if (product.category && product.category.toLowerCase() === categoryName.toLowerCase()) {
            productsUsingCategory.push(product.name);
        }
    });
    
    if (productsUsingCategory.length > 0) {
        alert(`⚠️ Cannot delete category "${categoryName}" because ${productsUsingCategory.length} custom product(s) use it:\n\n${productsUsingCategory.join(', ')}\n\nPlease delete or recategorize these products first.`);
        return;
    }
    
    if (!confirm(`Delete custom category "${categoryName}"?`)) return;
    
    // Remove from custom categories
    const index = customCategories.findIndex(cat => cat.name === categoryName);
    if (index > -1) customCategories.splice(index, 1);
    
    // Save and refresh
    saveCustomCategories();
    renderExistingCategories();
    populateCategoryDropdown();
    notifyCatalogConsumers();
    
    showToast(`🗑️ Deleted category: ${categoryName}`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for CANONICAL_PRODUCTS to be loaded, then merge
    const checkAndMerge = setInterval(() => {
        if (typeof CANONICAL_PRODUCTS !== 'undefined') {
            mergeCustomProducts();
            clearInterval(checkAndMerge);
            console.log('✅ Custom products merged with catalog');
        }
    }, 100);
});
