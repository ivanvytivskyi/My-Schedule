// ================================================
// QUICK ADD SHOPPING - REDESIGNED VERSION
// ================================================

// Currency symbols
const currencySymbols = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€'
};

// Current currency (load from localStorage)
let currentCurrency = localStorage.getItem('currentCurrency') || 'GBP';

// Function to get currency symbol
function getCurrencySymbol() {
    return currencySymbols[currentCurrency] || '£';
}

// Function to get shop-specific brand styling
function getShopBrandStyle(shopName) {
    const styles = {
        "Tesco": {
            header: "background: linear-gradient(135deg, #0055a5 0%, #003d7a 100%); padding: 20px; text-align: center; position: relative;",
            title: "margin: 0; color: #e31837; font-size: clamp(20px, 5vw, 32px); font-weight: 800; text-transform: uppercase; letter-spacing: 3px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); background: white; padding: 15px 30px; border-radius: 8px; display: inline-block;"
        },
        "Lidl": {
            header: "background: linear-gradient(135deg, #0050aa 0%, #003d85 100%); padding: 20px; text-align: center; position: relative;",
            title: "margin: 0; color: #ffd500; font-size: clamp(20px, 5vw, 32px); font-weight: 900; text-transform: uppercase; letter-spacing: 8px; text-shadow: 3px 3px 6px rgba(0,0,0,0.4); font-family: Arial Black, sans-serif;"
        },
        "Aldi": {
            header: "background: linear-gradient(135deg, #0082c3 0%, #006399 100%); padding: 20px; text-align: center; position: relative;",
            title: "margin: 0; color: #ff6600; font-size: clamp(20px, 5vw, 32px); font-weight: 800; text-transform: uppercase; letter-spacing: 4px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
        },
        "Asda": {
            header: "background: linear-gradient(135deg, #78be20 0%, #5a9617 100%); padding: 20px; text-align: center; position: relative;",
            title: "margin: 0; color: white; font-size: clamp(20px, 5vw, 32px); font-weight: 800; text-transform: uppercase; letter-spacing: 3px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
        },
        "Sainsburys": {
            header: "background: linear-gradient(135deg, #ff8200 0%, #cc6800 100%); padding: 20px; text-align: center; position: relative;",
            title: "margin: 0; color: white; font-size: clamp(20px, 5vw, 28px); font-weight: 700; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
        },
        "Morrisons": {
            header: "background: linear-gradient(135deg, #fdb813 0%, #e5a410 100%); padding: 20px; text-align: center; position: relative;",
            title: "margin: 0; color: #2c5234; font-size: clamp(20px, 5vw, 32px); font-weight: 800; text-transform: uppercase; letter-spacing: 3px; text-shadow: 1px 1px 2px rgba(255,255,255,0.5);"
        },
        "Waitrose": {
            header: "background: linear-gradient(135deg, #006633 0%, #004d26 100%); padding: 20px; text-align: center; position: relative;",
            title: "margin: 0; color: white; font-size: clamp(20px, 5vw, 28px); font-weight: 700; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
        },
        "Iceland": {
            header: "background: linear-gradient(135deg, #e30613 0%, #b30510 100%); padding: 20px; text-align: center; position: relative;",
            title: "margin: 0; color: white; font-size: clamp(20px, 5vw, 32px); font-weight: 800; text-transform: uppercase; letter-spacing: 3px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
        },
        "Co-op": {
            header: "background: linear-gradient(135deg, #00b1e7 0%, #0090c5 100%); padding: 20px; text-align: center; position: relative;",
            title: "margin: 0; color: white; font-size: clamp(20px, 5vw, 32px); font-weight: 800; text-transform: uppercase; letter-spacing: 3px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
        }
    };
    
    return styles[shopName] || {
        header: "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; position: relative;",
        title: "margin: 0; color: white; font-size: clamp(20px, 5vw, 28px); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);"
    };
}

// Product database organized by shop and category
let quickAddProducts = {
      "Tesco": {
        "🥛 Dairy & Eggs": [
            { name: "Milk (Semi-Skimmed)", unit: "2.272L", price: 1.65, defaultQty: 1},
            { name: "Milk (Whole)", unit: "2.272L", price: 1.65, defaultQty: 1 },
            { name: "Milk (Skimmed)", unit: "2.272L", price: 1.65, defaultQty: 1 },
            { name: "British Barn Eggs", unit: "pack of 10", price: 1.43, defaultQty: 1 },
            { name: "BUTTERPAK (SPRESDABLE Slightly Salted)", unit: "500g", price:2.18, defaultQty: 1 },
            { name: "Cottage Cheese", unit: "300g", price: 1.20, defaultQty: 1 },
            { name: "British Crème Fraîche", unit: "300ml", price: 0.85, defaultQty: 1 },
            { name: "Greek Style Yogurt", unit: "500g", price: 1.15, defaultQty: 1 },
        ],
        "🍞 Bread & Bakery": [
            { name: "White Toastie Bread Thick Sliced", unit: "800g", price: 0.75, defaultQty: 1 },
            { name: "Nevills Plain Croissants", unit: "pack of 8", price: 1.39, defaultQty: 1 },
            { name: "Nevills Plain White Tortilla", unit: "pack of 8", price: 0.99, defaultQty: 1 }
        ],
        "🍖 Meat & Fish": [
            { name: "Chicken Breast", unit: "kg", price: 6.50, defaultQty: 0.5 },
            { name: "White Fish", unit: "kg", price: 8.00, defaultQty: 0.3 }
        ],
        "🥬 Vegetables": [
            { name: "All Rounder Potatoes", unit: "Pack of 2kg", price: 1.20, defaultQty: 1 },
            { name: "BRITISH BROWN ONIONS", unit: "kg", price: 0.99, defaultQty: 1 },
            { name: "Carrots", unit: "kg", price: 0.69, defaultQty: 1 },
            { name: "Sweet Peppers", unit: "500g", price: 2.00, defaultQty: 1 },
            { name: "Broccoli", unit: "375g", price: 0.82, defaultQty: 1 },
            { name: "Tomatoes", unit: "kg", price: 2.00, defaultQty: 0.5 },
            { name: "Cucumbers", unit: "each", price: 0.60, defaultQty: 1 },
            { name: "Broccoli", unit: "head", price: 0.85, defaultQty: 1 },
            { name: "Bunched Spring Onions", unit: "100g", price: 0.69, defaultQty: 1 },
            { name: "Garlic", unit: "4 pack", price: 0.88, defaultQty: 1 },
            
        ],
        "🍎 Fruits": [
            { name: "Apples (ROSEDENE FARMS)", unit: "pack of 6", price: 0.80, defaultQty: 1 },
            { name: "Banana Loose", unit: "kg", price: 0.90, defaultQty: 1 },
            { name: "Oranges", unit: "kg", price: 1.50, defaultQty: 1 },
            { name: "Bananas", unit: "7 pack", price: 1.05, defaultQty: 1 }
        ],
        "🍚 Pantry & Staples": [
            { name: "Long Grain Rice", unit: "1kg", price: 0.52, defaultQty: 1 },
            { name: "Pasta (Spaghetti)", unit: "500g", price: 0.80, defaultQty: 1 },
            { name: "Flour (Plain)", unit: "1.5kg", price: 1.10, defaultQty: 1 },
            { name: "Strawberry Jam", unit: "454g", price: 0.89, defaultQty: 1 },
            { name: "Sugar (White)", unit: "1kg", price: 1.20, defaultQty: 1 },
            { name: "Buckwheat Groats", unit: "1kg", price: 2.20, defaultQty: 1 },
            { name: "Red Split Lentils", unit: "pack of 1kg", price: 2.50, defaultQty: 1},
            { name: "Light Soy Sauce", unit: "150ml", price: 0.55, defaultQty: 1 },
            { name: "Honey", unit: "340g", price: 0.74, defaultQty: 1 },
            { name: "Vegetable Oil", unit: "1L", price: 2.50, defaultQty: 1 },
            { name: "BRITISH COOKING SALT", unit: "1.5kg", price: 1.90, defaultQty: 1 },
            { name: "Black Peppercorns", unit: "250g", price: 4.40, defaultQty: 1 }
        ],
        "🥫 Canned & Packaged": [
            { name: "Grower's Harvest Chopped Tomatoes", unit: "400g tin", price: 0.43, defaultQty: 1 }
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
            { name: "Growes Harvest Mixed Veg", unit: "pack of 1kg", price: 0.99, defaultQty: 1 },
            { name: "Pizza (Margherita)", unit: "each", price: 1.50, defaultQty: 1 },
            { name: "Ice Cream", unit: "1L", price: 2.50, defaultQty: 1 }
        ],
        "🧼 Household": [
            { name: "Washing Up Liquid", unit: "500ml", price: 1.00, defaultQty: 1 },
            { name: "Laundry Detergent", unit: "1L", price: 4.00, defaultQty: 1 },
            { name: "Bin Bags", unit: "pack of 40", price: 1.00, defaultQty: 1 },
            { name: "Assorted Bungee Cords", unit: "2 pack", price: 1.50, defaultQty: 1 }
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
        ],
        "🍫 Sweets": [
            { name: "fin Carre Milk Chocolate", unit: "Chocolate bar of 100g", price: 0.99, defaultQty: 1 },
            { name: "Onions", unit: "1kg", price: 0.79, defaultQty: 1 },
            { name: "Carrots", unit: "1kg", price: 0.59, defaultQty: 1 },
            { name: "Tomatoes", unit: "500g", price: 0.99, defaultQty: 1 }
        ],
        "🥜 Spreads":[
            {name:" Mister CHOC Peanut Butter Crunch", unit: "Bottle of 340g", price: 0.99, defautQty: 1 },
        ]
    }
};

// State for selected items
let selectedShoppingItems = {};

// State for category editing
let editingCategory = null;

// Index registries for safe onclick handling (Solution B)
let shopsArray = [];
let categoriesMap = {};
let itemsMap = {};

// Open Quick Add Modal
function openQuickAdd() {
    window.quickAddEditMode = document.body.classList.contains('edit-mode');
    document.getElementById('quickAddModal').classList.add('active');
    renderQuickAddModal();
}

// Close Quick Add Modal
function closeQuickAdd() {
    document.getElementById('quickAddModal').classList.remove('active');
    editingCategory = null;
}

// Change currency
function changeCurrency(currency) {
    currentCurrency = currency;
    localStorage.setItem('currentCurrency', currency);
    renderQuickAddModal();
}

// Show add shop form
function showAddShopForm() {
    const existing = document.getElementById('addShopForm');
    if (existing) {
        existing.remove();
        return;
    }
    
    const form = document.createElement('div');
    form.id = 'addShopForm';
    form.style.cssText = 'background: #f0f8ff; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 2px solid #667eea;';
    form.innerHTML = `
        <h4 style="margin: 0 0 15px 0; color: #667eea;">➕ Add New Shop</h4>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <input type="text" id="newShopNameInput" list="shopsList" placeholder="Shop name (e.g., Tesco)" 
                style="flex: 1; min-width: 200px; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px;">
            <datalist id="shopsList">
                <option value="Tesco">
                <option value="Lidl">
                <option value="Sainsburys">
                <option value="Aldi">
                <option value="Asda">
                <option value="Morrisons">
                <option value="Waitrose">
                <option value="Iceland">
                <option value="Co-op">
            </datalist>
            <button onclick="addNewShop()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Add Shop</button>
            <button onclick="document.getElementById('addShopForm').remove()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Cancel</button>
        </div>
    `;
    
    const container = document.getElementById('quickAddContent');
    container.insertBefore(form, container.firstChild);
    document.getElementById('newShopNameInput').focus();
}

// Add new shop
function addNewShop() {
    const input = document.getElementById('newShopNameInput');
    const shopName = input.value.trim();
    
    if (!shopName) {
        alert('⚠️ Please enter a shop name!');
        return;
    }
    
    if (quickAddProducts[shopName]) {
        alert('⚠️ This shop already exists!');
        return;
    }
    
    quickAddProducts[shopName] = {};
    localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
    
    document.getElementById('addShopForm').remove();
    renderQuickAddModal();
}

// Edit shop name
function editShop(shopName) {
    const newName = prompt('Edit shop name:', shopName);
    if (newName && newName !== shopName && newName.trim()) {
        if (quickAddProducts[newName]) {
            alert('⚠️ A shop with this name already exists!');
            return;
        }
        quickAddProducts[newName] = quickAddProducts[shopName];
        delete quickAddProducts[shopName];
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

// Show add category form
function showAddCategoryForm(shop) {
    const formId = `addCatForm-${shop.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const existing = document.getElementById(formId);
    if (existing) {
        existing.remove();
        return;
    }
    
    const form = document.createElement('div');
    form.id = formId;
    form.style.cssText = 'background: #fff3e0; padding: 15px; border-radius: 8px; margin: 10px 0; border: 2px solid #ff9800;';
    form.innerHTML = `
        <h5 style="margin: 0 0 10px 0; color: #ff9800;">➕ Add Category</h5>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <input type="text" id="newCatInput-${shop.replace(/[^a-zA-Z0-9]/g, '-')}" list="categoriesList" placeholder="Category name" 
                style="flex: 1; min-width: 200px; padding: 8px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px;">
            <datalist id="categoriesList">
                <option value="🥛 Dairy & Eggs">
                <option value="🍞 Bread & Bakery">
                <option value="🍖 Meat & Fish">
                <option value="🥬 Vegetables">
                <option value="🍎 Fruits">
                <option value="🍚 Pantry & Staples">
                <option value="🥫 Canned & Packaged">
                <option value="🥤 Drinks">
                <option value="🧊 Frozen">
                <option value="🧼 Household">
            </datalist>
            <button onclick="addNewCategoryForShop('${shop.replace(/'/g, "\\'")}', '${formId}')" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Add</button>
            <button onclick="document.getElementById('${formId}').remove()" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Cancel</button>
        </div>
    `;
    
    const shopDiv = document.querySelector(`[data-shop="${shop}"]`);
    if (shopDiv) {
        shopDiv.insertBefore(form, shopDiv.querySelector('.categories-container'));
    }
}

// Add new category (helper for form button)
function addNewCategoryForShop(shop, formId) {
    const inputId = `newCatInput-${shop.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const input = document.getElementById(inputId);
    const categoryName = input.value.trim();
    
    if (!categoryName) {
        alert('⚠️ Please enter a category name!');
        return;
    }
    
    if (quickAddProducts[shop][categoryName]) {
        alert('⚠️ This category already exists!');
        return;
    }
    
    quickAddProducts[shop][categoryName] = [];
    localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
    
    document.getElementById(formId).remove();
    renderQuickAddModal();
}

// Add new category
function addNewCategory(shop) {
    const input = document.getElementById(`newCatInput-${shop}`);
    const categoryName = input.value.trim();
    
    if (!categoryName) {
        alert('⚠️ Please enter a category name!');
        return;
    }
    
    if (quickAddProducts[shop][categoryName]) {
        alert('⚠️ This category already exists!');
        return;
    }
    
    quickAddProducts[shop][categoryName] = [];
    localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
    
    const formId = `addCatForm-${shop}`;
    document.getElementById(formId).remove();
    renderQuickAddModal();
}

// Edit category - show inline editable table
function editCategory(shop, category) {
    if (editingCategory === `${shop}|${category}`) {
        cancelEditCategory(shop, category);
        return;
    }
    
    editingCategory = `${shop}|${category}`;
    renderQuickAddModal();
}

// Save category changes
function saveCategory(shop, category) {
    // Find the shop and category indices
    const shopIndex = shopsArray.indexOf(shop);
    if (shopIndex === -1) return;
    
    const catIndex = categoriesMap[shopIndex].indexOf(category);
    if (catIndex === -1) return;
    
    // Use same catId format as rendering
    const catId = `${shopIndex}-${catIndex}`;
    const table = document.getElementById(`edit-table-${catId}`);
    
    if (!table) {
        console.error('Table not found:', `edit-table-${catId}`);
        return;
    }
    
    const rows = table.querySelectorAll('tbody tr');
    
    const items = [];
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const name = cells[0].textContent.trim();
            const unit = cells[1].textContent.trim();
            const priceText = cells[2].textContent.trim();
            const qtyText = cells[3].textContent.trim();
            
            if (name) {
                items.push({
                    name: name,
                    unit: unit || 'each',
                    price: parseFloat(priceText) || 0,
                    defaultQty: parseFloat(qtyText) || 1
                });
            }
        }
    });
    
    quickAddProducts[shop][category] = items;
    localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
    editingCategory = null;
    renderQuickAddModal();
}

// Cancel category editing
function cancelEditCategory(shop, category) {
    editingCategory = null;
    renderQuickAddModal();
}

// Delete category
function deleteCategory(shop, category) {
    if (confirm(`Delete category "${category}"?`)) {
        delete quickAddProducts[shop][category];
        localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
        renderQuickAddModal();
    }
}

// Show add item form in edit table
function showAddItemForm(shop, category) {
    // Find the shop and category indices
    const shopIndex = shopsArray.indexOf(shop);
    if (shopIndex === -1) return;
    
    const catIndex = categoriesMap[shopIndex].indexOf(category);
    if (catIndex === -1) return;
    
    // Use same catId format as rendering
    const catId = `${shopIndex}-${catIndex}`;
    const tbody = document.querySelector(`#edit-table-${catId} tbody`);
    
    if (!tbody) {
        console.error('Table body not found:', `#edit-table-${catId}`);
        return;
    }
    
    const existingForm = document.getElementById(`addItemRow-${catId}`);
    if (existingForm) {
        existingForm.remove();
        return;
    }
    
    const row = document.createElement('tr');
    row.id = `addItemRow-${catId}`;
    row.style.background = '#e8f5e9';
    row.innerHTML = `
        <td><input type="text" id="newItemName-${catId}" placeholder="Item name" style="width: 100%; padding: 6px; border: 2px solid #4CAF50; border-radius: 4px;"></td>
        <td><input type="text" id="newItemUnit-${catId}" placeholder="Unit" style="width: 100%; padding: 6px; border: 2px solid #4CAF50; border-radius: 4px;"></td>
        <td><input type="number" id="newItemPrice-${catId}" placeholder="0.00" step="0.01" style="width: 100%; padding: 6px; border: 2px solid #4CAF50; border-radius: 4px;"></td>
        <td><input type="number" id="newItemQty-${catId}" placeholder="1" step="0.1" style="width: 100%; padding: 6px; border: 2px solid #4CAF50; border-radius: 4px;"></td>
        <td>
            <button onclick="addNewItemFromFormByIndex(${shopIndex}, ${catIndex})" style="background: #4CAF50; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: 600;">✓</button>
            <button onclick="document.getElementById('addItemRow-${catId}').remove()" style="background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: 600; margin-left: 5px;">✕</button>
        </td>
    `;
    
    tbody.appendChild(row);
    document.getElementById(`newItemName-${catId}`).focus();
}

// Add new item from form
function addNewItemFromForm(shop, category, catId) {
    if (!catId) {
        catId = `${shop}|${category}`.replace(/[^a-zA-Z0-9]/g, '-');
    }
    const name = document.getElementById(`newItemName-${catId}`).value.trim();
    const unit = document.getElementById(`newItemUnit-${catId}`).value.trim();
    const price = parseFloat(document.getElementById(`newItemPrice-${catId}`).value) || 0;
    const qty = parseFloat(document.getElementById(`newItemQty-${catId}`).value) || 1;
    
    if (!name) {
        alert('⚠️ Please enter an item name!');
        return;
    }
    
    quickAddProducts[shop][category].push({
        name: name,
        unit: unit || 'each',
        price: price,
        defaultQty: qty
    });
    
    localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
    document.getElementById(`addItemRow-${catId}`).remove();
    renderQuickAddModal();
}

// Delete item
function deleteItem(shop, category, index) {
    if (confirm('Delete this item?')) {
        quickAddProducts[shop][category].splice(index, 1);
        
        if (quickAddProducts[shop][category].length === 0) {
            delete quickAddProducts[shop][category];
        }
        
        if (Object.keys(quickAddProducts[shop]).length === 0) {
            delete quickAddProducts[shop];
        }
        
        localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
        renderQuickAddModal();
    }
}

// Render the Quick Add Modal
function renderQuickAddModal() {
    const container = document.getElementById('quickAddContent');
    const isEditMode = window.quickAddEditMode || false;
    const currencySymbol = getCurrencySymbol();
    
    // Save scroll position before re-rendering
    const scrollContainer = document.getElementById('quickAddScrollContent');
    const savedScrollPosition = scrollContainer ? scrollContainer.scrollTop : 0;
    
    // Build index arrays for safe onclick handling
    shopsArray = Object.keys(quickAddProducts);
    categoriesMap = {};
    itemsMap = {};
    
    shopsArray.forEach((shop, shopIndex) => {
        categoriesMap[shopIndex] = Object.keys(quickAddProducts[shop]);
        categoriesMap[shopIndex].forEach((category, catIndex) => {
            const key = `${shopIndex}|${catIndex}`;
            itemsMap[key] = quickAddProducts[shop][category];
        });
    });
    
    let html = `
        <div style="margin-bottom: 20px;">
            <!-- Currency Selector -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <label style="font-weight: 600; color: #333;">Currency:</label>
                    <select onchange="changeCurrency(this.value)" style="padding: 8px 12px; border: 2px solid #667eea; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
                        <option value="GBP" ${currentCurrency === 'GBP' ? 'selected' : ''}>£ GBP</option>
                        <option value="USD" ${currentCurrency === 'USD' ? 'selected' : ''}>$ USD</option>
                        <option value="EUR" ${currentCurrency === 'EUR' ? 'selected' : ''}>€ EUR</option>
                    </select>
                </div>
                ${isEditMode ? `
                    <button onclick="showAddShopForm()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">➕ Create Shop</button>
                ` : ''}
            </div>
            
            <p style="color: #666; margin: 10px 0;">Click items to select, then adjust quantity and price</p>
            <button onclick="clearAllItems()" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">✕ Clear All</button>
        </div>
        
        <!-- Scrollable content wrapper -->
        <div id="quickAddScrollContent" style="max-height: calc(90vh - 350px); overflow-y: auto; padding-right: 5px; margin-bottom: 15px;">
    `;
    
    // Loop through shops
    shopsArray.forEach((shop, shopIndex) => {
        const shopStyles = getShopBrandStyle(shop);
        
        html += `
            <div data-shop="${shop}" style="margin-bottom: 30px;">
                <div style="${shopStyles.header}; position: relative;">
                    <h3 id="shop-name-${shopIndex}" ${isEditMode ? 'contenteditable="true"' : ''} 
                        onblur="${isEditMode ? `saveShopNameInline(${shopIndex}, this.textContent)` : ''}"
                        style="${shopStyles.title}${isEditMode ? '; cursor: text; border: 2px dashed rgba(255,255,255,0.5); padding: 12px; background: rgba(255,255,255,0.1);' : ''}"
                        title="${isEditMode ? 'Click to edit shop name' : ''}">${shop}</h3>
                    ${isEditMode ? `
                        <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
                            <button onclick="deleteShopByIndex(${shopIndex})" style="background: rgba(255,100,100,0.9); color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 16px;" title="Delete shop">🗑️</button>
                        </div>
                    ` : ''}
                </div>
                
                ${isEditMode ? `
                    <div style="padding: 15px; background: #f8f9fa;">
                        <button onclick="showAddCategoryFormByIndex(${shopIndex})" style="padding: 8px 16px; background: #ff9800; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px;">➕ Add Category</button>
                    </div>
                ` : ''}
                
                <div class="categories-container">
        `;
        
        const categories = categoriesMap[shopIndex];
        
        // Loop through categories
        categories.forEach((category, catIndex) => {
            const shop = shopsArray[shopIndex];
            const catId = `${shopIndex}-${catIndex}`;
            const isEditing = editingCategory === `${shop}|${category}`;
            
            html += `
                <div style="margin-bottom: 25px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                        <h4 id="cat-name-${shopIndex}-${catIndex}" 
                            ${isEditMode && !isEditing ? 'contenteditable="true"' : ''} 
                            onblur="${isEditMode && !isEditing ? `saveCategoryNameInline(${shopIndex}, ${catIndex}, this.textContent)` : ''}"
                            style="margin: 0; color: #333; font-size: 16px;${isEditMode && !isEditing ? ' cursor: text; border: 2px dashed #667eea; padding: 6px; background: white; border-radius: 4px;' : ''}"
                            title="${isEditMode && !isEditing ? 'Click to edit category name' : ''}">${category}</h4>
                        ${isEditMode ? `
                            <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                                <button onclick="editCategoryByIndex(${shopIndex}, ${catIndex})" style="background: ${isEditing ? '#f093fb' : 'white'}; border: 1px solid #ddd; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;" title="Edit items in category">${isEditing ? '📝 Editing...' : '✏️ Edit Items'}</button>
                                <button onclick="deleteCategoryByIndex(${shopIndex}, ${catIndex})" style="background: #ff6b6b; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 14px;" title="Delete category">🗑️</button>
                            </div>
                        ` : ''}
                    </div>
            `;
            
            if (isEditing && isEditMode) {
                // Show editable table
                const items = itemsMap[`${shopIndex}|${catIndex}`];
                html += `
                    <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 2px solid #667eea;">
                        <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; margin-bottom: 10px;">
                            <table id="edit-table-${catId}" style="width: 100%; border-collapse: collapse; min-width: 480px;">
                                <thead>
                                    <tr style="background: #667eea; color: white;">
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd; min-width: 120px;">Item Name</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd; min-width: 70px;">Unit</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd; min-width: 65px;">Price</th>
                                        <th style="padding: 10px; text-align: left; border: 1px solid #ddd; min-width: 50px;">Qty</th>
                                        <th style="padding: 10px; text-align: center; border: 1px solid #ddd; width: 60px;">Del</th>
                                    </tr>
                                </thead>
                                <tbody>
                `;
                
                items.forEach((product, itemIndex) => {
                    html += `
                        <tr>
                            <td contenteditable="true" style="padding: 8px; border: 1px solid #ddd; background: white;">${product.name}</td>
                            <td contenteditable="true" style="padding: 8px; border: 1px solid #ddd; background: white;">${product.unit}</td>
                            <td contenteditable="true" style="padding: 8px; border: 1px solid #ddd; background: white;">${product.price}</td>
                            <td contenteditable="true" style="padding: 8px; border: 1px solid #ddd; background: white;">${product.defaultQty}</td>
                            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                                <button onclick="deleteItemByIndex(${shopIndex}, ${catIndex}, ${itemIndex})" style="background: #ff6b6b; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 16px;">✕</button>
                            </td>
                        </tr>
                    `;
                });
                
                html += `
                                </tbody>
                            </table>
                        </div>
                        <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                            <button onclick="showAddItemFormByIndex(${shopIndex}, ${catIndex})" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">➕ Add Item</button>
                            <button onclick="saveCategoryByIndex(${shopIndex}, ${catIndex})" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">💾 Save</button>
                            <button onclick="cancelEditCategoryByIndex(${shopIndex}, ${catIndex})" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">✕ Cancel</button>
                        </div>
                    </div>
                `;
            } else {
                // Show normal item grid
                const items = itemsMap[`${shopIndex}|${catIndex}`];
                html += `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px;">
                `;
                
                items.forEach((product, itemIndex) => {
                    const itemId = `${shop}|${category}|${itemIndex}`;
                    const isSelected = selectedShoppingItems[itemId];
                    
                    html += `
                        <div class="quick-add-item ${isSelected ? 'selected' : ''}" 
                             onclick="${isEditMode ? '' : `toggleQuickItemByIndex(${shopIndex}, ${catIndex}, ${itemIndex})`}"
                             style="padding: 12px; background: white; border: 2px solid ${isSelected ? '#4CAF50' : '#ddd'}; border-radius: 6px; ${isEditMode ? '' : 'cursor: pointer;'} transition: all 0.2s; position: relative;">
                            ${!isEditMode ? `
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: ${isSelected ? '8px' : '0'};">
                                    <div style="width: 20px; height: 20px; border: 2px solid ${isSelected ? '#4CAF50' : '#999'}; border-radius: 4px; background: ${isSelected ? '#4CAF50' : 'white'}; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                                        ${isSelected ? '<span style="color: white; font-size: 14px;">✓</span>' : ''}
                                    </div>
                                    <div style="flex: 1;">
                                        <div style="font-weight: 600; color: #2c3e50; font-size: 14px;">${product.name}</div>
                                        <div style="color: #7f8c8d; font-size: 12px;">${product.unit} · ${currencySymbol}${(parseFloat(product.price) || 0).toFixed(2)}</div>
                                    </div>
                                </div>
                            ` : `
                                <div style="font-weight: 600; color: #2c3e50; font-size: 14px;">${product.name}</div>
                                <div style="color: #7f8c8d; font-size: 12px;">${product.unit} · ${currencySymbol}${(parseFloat(product.price) || 0).toFixed(2)}</div>
                            `}
                            ${isSelected && !isEditMode ? `
                                <div style="display: flex; gap: 8px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #e0e0e0;">
                                    <input type="number" 
                                           value="${selectedShoppingItems[itemId].quantity || product.defaultQty}" 
                                           step="${product.unit.toLowerCase().includes('kg') ? '0.1' : '1'}" 
                                           min="${product.unit.toLowerCase().includes('kg') ? '0.1' : '1'}"
                                           onclick="event.stopPropagation()"
                                           oninput="updateQuantity('${itemId}', this.value, this)"
                                           onchange="updateQuantity('${itemId}', this.value, this)"
                                           style="width: 70px; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
                                    <input type="number" 
                                           value="${selectedShoppingItems[itemId].price || product.price}" 
                                           step="0.01" 
                                           min="0"
                                           onclick="event.stopPropagation()"
                                           oninput="updatePrice('${itemId}', this.value, this)"
                                           onchange="updatePrice('${itemId}', this.value, this)"
                                           style="width: 70px; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;"
                                           placeholder="${currencySymbol}">
                                    <div class="quick-add-line-total" data-item-id="${itemId}" style="flex: 1; text-align: right; padding: 6px; background: #e8f5e9; border-radius: 4px; font-weight: 600; color: #2e7d32; font-size: 13px;">
                                        ${currencySymbol}${((parseFloat(selectedShoppingItems[itemId].quantity) || parseFloat(product.defaultQty) || 0) * (parseFloat(selectedShoppingItems[itemId].price) || parseFloat(product.price) || 0)).toFixed(2)}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `;
                });
                
                html += `
                    </div>
                `;
            }
            
            html += `
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    // Calculate totals
    const selectedCount = Object.keys(selectedShoppingItems).length;
    const totalPrice = Object.values(selectedShoppingItems).reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        return sum + (qty * price);
    }, 0);
    
    // Close the scrollable content wrapper
    html += `</div>`; // Close quickAddScrollContent
    
    // Sticky footer - flex-shrink: 0 keeps it at bottom
    html += `
        <div style="flex-shrink: 0; background: white; padding: 15px 0 0 0; border-top: 3px solid #e0e0e0; margin-top: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                <div id="quickAddSelectedCount" style="font-size: 16px; font-weight: 600; color: #2c3e50;">
                    Selected: ${selectedCount} items
                </div>
                <div id="quickAddTotalValue" style="font-size: 18px; font-weight: bold; color: #27ae60;">
                    Total: ${currencySymbol}${(totalPrice || 0).toFixed(2)}
                </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button onclick="closeQuickAdd()" style="flex: 1; min-width: 100px; padding: 12px; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                    ✕ Cancel
                </button>
                <button onclick="addSelectedToShopping()" style="flex: 2; min-width: 150px; padding: 12px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                    🛒 Add ${selectedCount} Items
                </button>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Restore scroll position after re-rendering (immediately and next frame to avoid flicker)
    const newScrollContainer = document.getElementById('quickAddScrollContent');
    if (newScrollContainer) {
        newScrollContainer.scrollTop = savedScrollPosition;
        requestAnimationFrame(() => {
            newScrollContainer.scrollTop = savedScrollPosition;
        });
    }
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
function updateQuantity(itemId, value, inputEl) {
    if (!selectedShoppingItems[itemId]) return;
    const numeric = parseFloat(value);
    selectedShoppingItems[itemId].quantity = isNaN(numeric) ? '' : numeric;
    refreshQuickAddLine(itemId, inputEl);
}

// Update price
function updatePrice(itemId, value, inputEl) {
    if (!selectedShoppingItems[itemId]) return;
    const numeric = parseFloat(value);
    selectedShoppingItems[itemId].price = isNaN(numeric) ? '' : numeric;
    refreshQuickAddLine(itemId, inputEl);
}

// Clear all items
function clearAllItems() {
    selectedShoppingItems = {};
    renderQuickAddModal();
}

function refreshQuickAddFooterTotals() {
    const selectedCount = Object.keys(selectedShoppingItems).length;
    const currencySymbol = getCurrencySymbol();
    const totalPrice = Object.values(selectedShoppingItems).reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        return sum + (qty * price);
    }, 0);
    const selectedEl = document.getElementById('quickAddSelectedCount');
    const totalEl = document.getElementById('quickAddTotalValue');
    if (selectedEl) selectedEl.textContent = `Selected: ${selectedCount} items`;
    if (totalEl) totalEl.textContent = `Total: ${currencySymbol}${(totalPrice || 0).toFixed(2)}`;
}

function refreshQuickAddLine(itemId, inputEl) {
    const currencySymbol = getCurrencySymbol();
    const item = selectedShoppingItems[itemId];
    if (!item) return;
    const safeId = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(itemId) : itemId.replace(/"/g, '\\"');
    const line = document.querySelector(`.quick-add-line-total[data-item-id="${safeId}"]`);
    const card = inputEl?.closest('.quick-add-item');
    const qtyInput = inputEl?.closest('.quick-add-item')?.querySelector('input[type="number"]');
    const priceInput = card?.querySelector('input[type="number"]:not([oninput*="updateQuantity"])');
    const qty = parseFloat(qtyInput?.value ?? item.quantity) || 0;
    const price = parseFloat(priceInput?.value ?? item.price) || 0;
    if (line) {
        line.textContent = `${currencySymbol}${(qty * price).toFixed(2)}`;
    }
    refreshQuickAddFooterTotals();
}
// Add selected items to shopping list
function addSelectedToShopping() {
    const itemCount = Object.keys(selectedShoppingItems).length;
    
    if (itemCount === 0) {
        alert('⚠️ Please select at least one item!');
        return;
    }
    
    const currencySymbol = getCurrencySymbol();
    
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
    
    // Generate HTML table
    let shoppingHTML = '';
    let grandTotal = 0;
    let listId = Date.now();
    
    Object.keys(itemsByShop).forEach(shop => {
        const shopId = `shop-${listId}-${shop.replace(/[^a-zA-Z0-9]/g, '-')}`;
        const shopStyles = getShopBrandStyle(shop);
        
        shoppingHTML += `
            <div id="${shopId}" style="margin-bottom: 30px; page-break-inside: avoid; border: 2px solid #ddd; border-radius: 8px; overflow: hidden; position: relative;">
                <button onclick="deleteShopList('${shopId}')" 
                    style="position: absolute; top: 10px; right: 10px; z-index: 10; background: #ff4444; color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 18px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; padding: 0;"
                    title="Delete this list">
                    ✕
                </button>
                
                <div style="${shopStyles.header}">
                    <h2 style="${shopStyles.title}">${shop}</h2>
                </div>
                
                <div style="overflow-x: auto; -webkit-overflow-scrolling: touch;">
                    <table style="width: 100%; border-collapse: collapse; min-width: 400px;">
                        <thead>
                            <tr style="background: #f5f5f5;">
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold; min-width: 120px;">Item</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left; font-weight: bold; min-width: 80px;">Unit</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: bold; min-width: 70px;">Price</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: center; font-weight: bold; min-width: 80px;">Quantity</th>
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
                
                let qtyDisplay = qty;
                if (qty % 1 !== 0) {
                    qtyDisplay = qty.toFixed(1);
                }
                
                shoppingHTML += `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;">${item.name || ''}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${item.unit || ''}</td>
                        <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${currencySymbol}${price.toFixed(2)}</td>
                        <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${qtyDisplay}</td>
                    </tr>
                `;
            });
        });
        
        let totalQtyDisplay = shopTotalQuantity;
        if (shopTotalQuantity % 1 !== 0) {
            totalQtyDisplay = shopTotalQuantity.toFixed(1);
        }
        
        shoppingHTML += `
                        <tr class="totals-row" style="background: #f9f9f9; font-weight: bold;">
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: right;" colspan="2">Totals:</td>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${currencySymbol}${(shopTotal || 0).toFixed(2)}</td>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">Total Qty: ${totalQtyDisplay}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        `;
    });
    
    // Save to localStorage
    const existingHTML = localStorage.getItem('shoppingListHTML') || '';
    const newHTML = existingHTML + (existingHTML ? '<div style="margin: 40px 0; border-top: 3px solid #ddd;"></div>' : '') + shoppingHTML;
    localStorage.setItem('shoppingListHTML', newHTML);
    
    // Update display and switch tab
    renderShopping();
    document.querySelector('[data-tab="shopping"]').click();
    
    closeQuickAdd();
    alert(`✅ Added ${itemCount} items!\n\nTotal: ${currencySymbol}${(grandTotal || 0).toFixed(2)}`);
    
    selectedShoppingItems = {};
}

// Delete shop list
function deleteShopList(shopId) {
    if (confirm('Delete this shopping list?')) {
        const container = document.getElementById('shoppingDisplay');
        const quickSection = document.getElementById('quickAddLists') || container;
        if (!quickSection) return;
        
        const shopDiv = document.getElementById(shopId);
        if (shopDiv) {
            const nextSibling = shopDiv.nextElementSibling;
            const prevSibling = shopDiv.previousElementSibling;
            
            // Remove the shop div
            shopDiv.remove();
            
            // Only remove dividers (not other shop lists)
            // Divider has specific style: "margin: 40px 0; border-top: 3px solid #ddd;"
            // Shop list has id starting with "shop-"
            if (nextSibling && !nextSibling.id && nextSibling.tagName === 'DIV') {
                // This is likely a divider
                const style = nextSibling.getAttribute('style');
                if (style && style.includes('border-top: 3px solid #ddd')) {
                    nextSibling.remove();
                }
            } else if (prevSibling && !prevSibling.id && prevSibling.tagName === 'DIV') {
                // This is likely a divider
                const style = prevSibling.getAttribute('style');
                if (style && style.includes('border-top: 3px solid #ddd')) {
                    prevSibling.remove();
                }
            }
            
            let updatedHTML = quickSection.innerHTML.trim();
            updatedHTML = updatedHTML.replace(/(<div style="margin: 40px 0; border-top: 3px solid #ddd;"><\/div>\s*){2,}/g, '<div style="margin: 40px 0; border-top: 3px solid #ddd;"></div>');
            updatedHTML = updatedHTML.replace(/^<div style="margin: 40px 0; border-top: 3px solid #ddd;"><\/div>\s*/g, '');
            updatedHTML = updatedHTML.replace(/\s*<div style="margin: 40px 0; border-top: 3px solid #ddd;"><\/div>$/g, '');
            
            if (updatedHTML === '' || !updatedHTML.includes('shop-')) {
                localStorage.removeItem('shoppingListHTML');
            } else {
                localStorage.setItem('shoppingListHTML', updatedHTML);
            }
            
            // Always refresh display after deletion
            renderShopping();
        }
    }
}

// Index-based wrapper functions (Solution B)
function editShopByIndex(shopIndex) {
    const shopName = shopsArray[shopIndex];
    editShop(shopName);
}

function deleteShopByIndex(shopIndex) {
    const shopName = shopsArray[shopIndex];
    deleteShop(shopName);
}

function showAddCategoryFormByIndex(shopIndex) {
    const shopName = shopsArray[shopIndex];
    showAddCategoryForm(shopName);
}

function editCategoryByIndex(shopIndex, catIndex) {
    const shop = shopsArray[shopIndex];
    const category = categoriesMap[shopIndex][catIndex];
    editCategory(shop, category);
}

function saveCategoryByIndex(shopIndex, catIndex) {
    const shop = shopsArray[shopIndex];
    const category = categoriesMap[shopIndex][catIndex];
    saveCategory(shop, category);
}

function cancelEditCategoryByIndex(shopIndex, catIndex) {
    const shop = shopsArray[shopIndex];
    const category = categoriesMap[shopIndex][catIndex];
    cancelEditCategory(shop, category);
}

function deleteCategoryByIndex(shopIndex, catIndex) {
    const shop = shopsArray[shopIndex];
    const category = categoriesMap[shopIndex][catIndex];
    deleteCategory(shop, category);
}

function showAddItemFormByIndex(shopIndex, catIndex) {
    const shop = shopsArray[shopIndex];
    const category = categoriesMap[shopIndex][catIndex];
    showAddItemForm(shop, category);
}

function showAddItemFormByIndex(shopIndex, catIndex) {
    const shop = shopsArray[shopIndex];
    const category = categoriesMap[shopIndex][catIndex];
    showAddItemForm(shop, category);
}

function addNewItemFromFormByIndex(shopIndex, catIndex) {
    const shop = shopsArray[shopIndex];
    const category = categoriesMap[shopIndex][catIndex];
    const catId = `${shopIndex}-${catIndex}`;
    
    const name = document.getElementById(`newItemName-${catId}`).value.trim();
    const unit = document.getElementById(`newItemUnit-${catId}`).value.trim();
    const price = parseFloat(document.getElementById(`newItemPrice-${catId}`).value) || 0;
    const qty = parseFloat(document.getElementById(`newItemQty-${catId}`).value) || 1;
    
    if (!name) {
        alert('⚠️ Please enter an item name!');
        return;
    }
    
    quickAddProducts[shop][category].push({
        name: name,
        unit: unit || 'each',
        price: price,
        defaultQty: qty
    });
    
    localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
    document.getElementById(`addItemRow-${catId}`).remove();
    renderQuickAddModal();
}

function deleteItemByIndex(shopIndex, catIndex, itemIndex) {
    const shop = shopsArray[shopIndex];
    const category = categoriesMap[shopIndex][catIndex];
    deleteItem(shop, category, itemIndex);
}

function toggleQuickItemByIndex(shopIndex, catIndex, itemIndex) {
    const shop = shopsArray[shopIndex];
    const category = categoriesMap[shopIndex][catIndex];
    const product = itemsMap[`${shopIndex}|${catIndex}`][itemIndex];
    const itemId = `${shop}|${category}|${itemIndex}`;
    
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

// ========================================
// INLINE EDITING - Shop & Category Names
// ========================================

function saveShopNameInline(shopIndex, newName) {
    newName = newName.trim();
    
    if (!newName) {
        alert('⚠️ Shop name cannot be empty!');
        renderQuickAddModal();
        return;
    }
    
    const oldName = shopsArray[shopIndex];
    
    // Check if name already exists
    if (newName !== oldName && quickAddProducts[newName]) {
        alert('⚠️ A shop with this name already exists!');
        renderQuickAddModal();
        return;
    }
    
    // Update shop name
    if (newName !== oldName) {
        quickAddProducts[newName] = quickAddProducts[oldName];
        delete quickAddProducts[oldName];
        
        // Save and refresh
        localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
        renderQuickAddModal();
    }
}

function saveCategoryNameInline(shopIndex, catIndex, newName) {
    newName = newName.trim();
    
    if (!newName) {
        alert('⚠️ Category name cannot be empty!');
        renderQuickAddModal();
        return;
    }
    
    const shop = shopsArray[shopIndex];
    const oldName = categoriesMap[shopIndex][catIndex];
    
    // Check if category already exists in this shop
    if (newName !== oldName && quickAddProducts[shop][newName]) {
        alert('⚠️ A category with this name already exists in this shop!');
        renderQuickAddModal();
        return;
    }
    
    // Update category name
    if (newName !== oldName) {
        quickAddProducts[shop][newName] = quickAddProducts[shop][oldName];
        delete quickAddProducts[shop][oldName];
        
        // Save and refresh
        localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));
        renderQuickAddModal();
    }
}

// ========================================
// SMART MERGE - Preserve user data + add new defaults
// ========================================
function loadCustomProducts() {
    const saved = localStorage.getItem('quickAddProducts');

    // 1. If user never saved anything, just use defaults
    if (!saved) return;

    try {
        const userData = JSON.parse(saved);
        const defaults = quickAddProducts;

        // 2. Loop default shops
        Object.keys(defaults).forEach(shop => {
            if (!userData[shop]) {
                // New shop → add fully
                userData[shop] = defaults[shop];
                return;
            }

            // 3. Loop default categories
            Object.keys(defaults[shop]).forEach(category => {
                if (!userData[shop][category]) {
                    // New category → add fully
                    userData[shop][category] = defaults[shop][category];
                    return;
                }

                // 4. Loop default items
                defaults[shop][category].forEach(defaultItem => {
                    const exists = userData[shop][category].some(userItem =>
                        userItem.name.toLowerCase() === defaultItem.name.toLowerCase()
                    );

                    // 5. Add ONLY missing items
                    if (!exists) {
                        userData[shop][category].push(defaultItem);
                    }
                });
            });
        });

        // 6. Use merged result
        quickAddProducts = userData;

        // 7. Save back (safe)
        localStorage.setItem('quickAddProducts', JSON.stringify(quickAddProducts));

    } catch (e) {
        console.error('Quick Add load failed:', e);
    }
}

// Initialize
loadCustomProducts();

console.log('✅ Quick Add Shopping redesigned and loaded!');
console.log('Available shops:', Object.keys(quickAddProducts));
