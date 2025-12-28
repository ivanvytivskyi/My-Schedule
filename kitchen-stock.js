// ================================================
// KITCHEN STOCK SYSTEM - V2.1.0 PRODUCTS AT HOME
// ================================================
// Old design: checkbox grid with all products shown
// Integrated with V2.1.0 product catalog

// Kitchen Stock state (stored in localStorage)
let kitchenStock = JSON.parse(localStorage.getItem('kitchenStock_v2')) || {};

// UI State
let selectedKitchenShop = localStorage.getItem('kitchenStockShop') || 'Tesco';
let kitchenStockSelections = {}; // Temporary selections before saving
let kitchenStockSearchTerm = '';
let activeKitchenTab = 'select';

// ================================================
// COOKING MEASUREMENTS SYSTEM
// ================================================
// Note: DEFAULT_MEASUREMENTS is defined in product-catalog.js
// This file only manages custom user adjustments

// Custom measurements (user adjustments)
let customMeasurements = normalizeCustomMeasurements(JSON.parse(localStorage.getItem('customMeasurements')) || {});

// Normalize stored measurement entries (supports legacy number-only storage)
function normalizeCustomMeasurements(raw) {
    const normalized = {};
    if (!raw || typeof raw !== 'object') return normalized;
    
    Object.keys(raw).forEach(key => {
        const entry = raw[key];
        const defaultUnit = DEFAULT_MEASUREMENTS[key]?.unit || 'g';
        const defaultLabel = DEFAULT_MEASUREMENTS[key]?.label || prettifyMeasurementLabel(key);
        
        if (typeof entry === 'number') {
            normalized[key] = { value: entry, unit: defaultUnit, label: defaultLabel };
        } else if (entry && typeof entry === 'object') {
            const value = typeof entry.value === 'number' ? entry.value : parseFloat(entry.value);
            if (isNaN(value) || value <= 0) return;
            
            normalized[key] = {
                value,
                unit: entry.unit || defaultUnit,
                label: entry.label || defaultLabel
            };
        }
    });
    
    return normalized;
}

function prettifyMeasurementLabel(key) {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
}

function saveCustomMeasurements() {
    localStorage.setItem('customMeasurements', JSON.stringify(customMeasurements));
}

// Get measurement value (custom or default) - overrides version in product-catalog.js
function getMeasurementValue(measureKey) {
    const definition = getMeasurementDefinition(measureKey);
    return definition ? definition.value : null;
}

// Get measurement unit (custom or default)
function getMeasurementUnit(measureKey) {
    const definition = getMeasurementDefinition(measureKey);
    return definition ? definition.unit : 'g';
}

// Update custom measurement
function updateCustomMeasurement(measureKey, newValue) {
    const key = String(measureKey).toLowerCase();
    const baseDefinition = getMeasurementDefinition(key);
    const value = parseFloat(newValue);
    
    if (isNaN(value) || value <= 0) {
        delete customMeasurements[key];
        saveCustomMeasurements();
        renderMeasuresTab();
        return;
    }
    
    const unit = baseDefinition?.unit || DEFAULT_MEASUREMENTS[key]?.unit || 'g';
    const label = baseDefinition?.label || DEFAULT_MEASUREMENTS[key]?.label || prettifyMeasurementLabel(key);
    
    customMeasurements[key] = { value, unit, label };
    saveCustomMeasurements();
}

// Reset measurement to default
function resetMeasurement(measureKey) {
    const key = String(measureKey).toLowerCase();
    delete customMeasurements[key];
    saveCustomMeasurements();
    renderMeasuresTab();
}

// Reset all measurements to defaults
function resetAllMeasurements() {
    if (!confirm('Reset all measurements to defaults?')) return;
    customMeasurements = {};
    saveCustomMeasurements();
    renderMeasuresTab();
    showToast('✅ All measurements reset to defaults');
}

// Add or update item in Kitchen Stock
function addToKitchenStock(canonicalKey, qtyBaseToAdd) {
    if (!CANONICAL_PRODUCTS[canonicalKey]) {
        console.error(`Unknown product: ${canonicalKey}`);
        return false;
    }
    
    const unitType = CANONICAL_PRODUCTS[canonicalKey].unitType;
    
    if (!kitchenStock[canonicalKey]) {
        // Don't allow adding negative quantities
        if (qtyBaseToAdd <= 0) {
            console.warn(`Cannot add negative or zero quantity: ${qtyBaseToAdd}`);
            return false;
        }
        kitchenStock[canonicalKey] = {
            qtyBase: qtyBaseToAdd,
            unitType: unitType
        };
    } else {
        kitchenStock[canonicalKey].qtyBase += qtyBaseToAdd;
    }
    
    // Remove if quantity is zero or negative (prevents deficits)
    if (kitchenStock[canonicalKey].qtyBase <= 0.000001) {
        delete kitchenStock[canonicalKey];
    }
    
    saveKitchenStock();
    return true;
}

// Adjust Kitchen Stock (add or subtract)
function adjustKitchenStock(canonicalKey, amount) {
    if (!kitchenStock[canonicalKey]) return;
    
    const product = CANONICAL_PRODUCTS[canonicalKey];
    if (!product) return;
    
    // Ensure qtyBase is a number
    if (typeof kitchenStock[canonicalKey].qtyBase !== 'number' || isNaN(kitchenStock[canonicalKey].qtyBase)) {
        delete kitchenStock[canonicalKey];
        saveKitchenStock();
        return;
    }
    
    // Adjust based on unit type
    let adjustAmount = amount;
    if (product.unitType === 'count') {
        adjustAmount = amount > 0 ? 1 : -1; // +1 or -1 for count items
    }
    
    kitchenStock[canonicalKey].qtyBase += adjustAmount;
    
    // Minimum 1g/ml or 1 piece - delete if below
    const minimum = product.unitType === 'count' ? 1 : 1;
    if (kitchenStock[canonicalKey].qtyBase < minimum) {
        delete kitchenStock[canonicalKey];
    }
    
    saveKitchenStock();
}

// Remove item from Kitchen Stock
function removeFromKitchenStock(canonicalKey) {
    delete kitchenStock[canonicalKey];
    saveKitchenStock();
}

// Get quantity of item in Kitchen Stock
function getKitchenStockQty(canonicalKey) {
    return kitchenStock[canonicalKey]?.qtyBase || 0;
}

// Check if have enough in stock
function hasEnoughInStock(canonicalKey, qtyNeeded) {
    const qtyHave = getKitchenStockQty(canonicalKey);
    return qtyHave >= qtyNeeded;
}

// Save to localStorage
function saveKitchenStock() {
    localStorage.setItem('kitchenStock_v2', JSON.stringify(kitchenStock));
}

// Save shop selection
function saveKitchenShopSelection() {
    localStorage.setItem('kitchenStockShop', selectedKitchenShop);
}

// Clear all Kitchen Stock
function clearAllKitchenStock() {
    if (confirm('Clear all items? This cannot be undone.')) {
        kitchenStock = {};
        kitchenStockSelections = {};
        saveKitchenStock();
        renderStockView();
        renderKitchenStockGrid();
        showToast('🗑️ All items cleared');
    }
}

// Remove negative quantities (cleanup function)
function cleanupNegativeStock() {
    let cleaned = 0;
    Object.keys(kitchenStock).forEach(key => {
        if (kitchenStock[key].qtyBase < 0) {
            delete kitchenStock[key];
            cleaned++;
        }
    });
    if (cleaned > 0) {
        saveKitchenStock();
        console.log(`Cleaned ${cleaned} negative stock items`);
    }
    return cleaned;
}

// Auto-cleanup on load
cleanupNegativeStock();

// Close Kitchen Stock Modal
function closeKitchenStock() {
    document.getElementById('kitchenStockModal').classList.remove('active');
}

function handleKitchenStockSearch(value) {
    kitchenStockSearchTerm = (value || '').toLowerCase();
    if (activeKitchenTab === 'stock') {
        renderStockView();
    } else if (activeKitchenTab === 'measures') {
        renderMeasuresTab();
    } else {
        renderKitchenStockGrid();
    }
}

// Switch between tabs
function switchKitchenTab(tabName) {
    activeKitchenTab = tabName;
    // Update tab buttons with proper colors and borders
    document.querySelectorAll('.kitchen-tab').forEach(tab => {
        const isActive = tab.dataset.tab === tabName;
        
        if (tab.dataset.tab === 'select') {
            // Select tab - blue when active
            tab.style.borderColor = isActive ? '#667eea' : 'transparent';
            tab.style.color = isActive ? '#667eea' : '#6b7280';
            tab.style.background = isActive ? '#eff6ff' : 'white';
        } else if (tab.dataset.tab === 'stock') {
            // Stock tab - green when active
            tab.style.borderColor = isActive ? '#10b981' : 'transparent';
            tab.style.color = isActive ? '#10b981' : '#6b7280';
            tab.style.background = isActive ? '#ecfdf5' : 'white';
        } else if (tab.dataset.tab === 'measures') {
            // Measures tab - orange when active
            tab.style.borderColor = isActive ? '#f59e0b' : 'transparent';
            tab.style.color = isActive ? '#f59e0b' : '#6b7280';
            tab.style.background = isActive ? '#fffbeb' : 'white';
        }
    });
    
    // Show/hide counters and buttons based on tab
    const selectedCounter = document.getElementById('kitchenStockSelectedCount');
    const stockCounter = document.getElementById('kitchenStockItemCount');
    const saveBtn = document.getElementById('saveToStockBtn');
    const clearBtn = document.getElementById('clearStockBtn');
    const resetMeasuresBtn = document.getElementById('resetMeasuresBtn');
    const shopSelect = document.getElementById('kitchenStockShopSelect');
    const shopDivider = document.getElementById('kitchenShopDivider');
    
    if (tabName === 'select') {
        // Select tab
        if (selectedCounter) selectedCounter.style.display = 'inline';
        if (stockCounter) stockCounter.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'inline-block';
        if (clearBtn) clearBtn.style.display = 'none';
        if (resetMeasuresBtn) resetMeasuresBtn.style.display = 'none';
        if (shopSelect) shopSelect.style.display = 'inline-block';
        if (shopDivider) shopDivider.style.display = 'block';
        
        document.getElementById('kitchenSelectTab').style.display = 'flex';
        document.getElementById('kitchenStockTab').style.display = 'none';
        document.getElementById('kitchenMeasuresTab').style.display = 'none';
    } else if (tabName === 'stock') {
        // Stock tab
        if (selectedCounter) selectedCounter.style.display = 'none';
        if (stockCounter) stockCounter.style.display = 'inline';
        if (saveBtn) saveBtn.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'inline-block';
        if (resetMeasuresBtn) resetMeasuresBtn.style.display = 'none';
        if (shopSelect) shopSelect.style.display = 'none';
        if (shopDivider) shopDivider.style.display = 'none';
        
        document.getElementById('kitchenSelectTab').style.display = 'none';
        document.getElementById('kitchenStockTab').style.display = 'flex';
        document.getElementById('kitchenMeasuresTab').style.display = 'none';
        renderStockView();
    } else if (tabName === 'measures') {
        // Measures tab
        if (selectedCounter) selectedCounter.style.display = 'none';
        if (stockCounter) stockCounter.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'none';
        if (resetMeasuresBtn) resetMeasuresBtn.style.display = 'inline-block';
        if (shopSelect) shopSelect.style.display = 'none';
        if (shopDivider) shopDivider.style.display = 'none';
        
        document.getElementById('kitchenSelectTab').style.display = 'none';
        document.getElementById('kitchenStockTab').style.display = 'none';
        document.getElementById('kitchenMeasuresTab').style.display = 'flex';
        renderMeasuresTab();
    }
}

// Open Kitchen Stock Modal
function openKitchenStock() {
    document.getElementById('kitchenStockModal').classList.add('active');
    
    populateKitchenShopOptions();
    
    // Clear selections to start fresh
    kitchenStockSelections = {};
    
    // Start on Select tab
    switchKitchenTab('select');
    
    renderKitchenStockGrid();
}

// Load current kitchen stock into selections for editing
function loadKitchenStockToSelections() {
    kitchenStockSelections = {};
    
    Object.keys(kitchenStock).forEach(canonicalKey => {
        const product = CANONICAL_PRODUCTS[canonicalKey];
        if (!product) return;
        
        // Find matching SKU for selected shop
        const shopData = product.shops[selectedKitchenShop];
        if (!shopData || !shopData[0]) return;
        
        const sku = shopData[0];
        const displayQty = formatQuantityForDisplay(kitchenStock[canonicalKey].qtyBase, canonicalKey);
        
        kitchenStockSelections[canonicalKey] = {
            name: sku.sku,
            unit: `${sku.packQty}${sku.packUnit}`,
            price: sku.price,
            quantity: displayQty.value,
            quantityUnit: displayQty.unit,
            shop: selectedKitchenShop,
            canonicalKey: canonicalKey
        };
    });
}

// Format quantity for display
function formatQuantityForDisplay(qtyBase, canonicalKey) {
    const product = CANONICAL_PRODUCTS[canonicalKey];
    if (!product) return { value: qtyBase, unit: 'g' };
    
    const unitType = product.unitType;
    
    if (unitType === 'g') {
        if (qtyBase >= 1000) {
            return { value: (qtyBase / 1000).toFixed(2), unit: 'kg' };
        }
        return { value: qtyBase.toFixed(0), unit: 'g' };
    } else if (unitType === 'ml') {
        if (qtyBase >= 1000) {
            return { value: (qtyBase / 1000).toFixed(2), unit: 'L' };
        }
        return { value: qtyBase.toFixed(0), unit: 'ml' };
    } else {
        return { value: qtyBase.toFixed(0), unit: 'count' };
    }
}

// Render Kitchen Stock Grid
function renderKitchenStockGrid() {
    const container = document.getElementById('kitchenStockGridContainer');
    if (!container) return;
    
    // Build product grid by category
    const productsByCategory = organizeProductsByCategory(selectedKitchenShop);
    const categories = Object.keys(productsByCategory).sort();
    const searchTerm = kitchenStockSearchTerm.trim().toLowerCase();
    
    if (categories.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #999;">
                <p style="font-size: 48px; margin: 0 0 20px 0;">📦</p>
                <p style="font-size: 18px; margin: 0;">No products available for ${selectedKitchenShop}</p>
            </div>
        `;
        updateKitchenStockCounter();
        return;
    }
    
    let html = '';
    
    categories.forEach(category => {
        const products = productsByCategory[category].filter(({ canonicalKey, sku }) => {
            if (!searchTerm) return true;
            const product = CANONICAL_PRODUCTS[canonicalKey];
            return (product?.name?.toLowerCase().includes(searchTerm)) ||
                   canonicalKey.toLowerCase().includes(searchTerm) ||
                   sku.sku.toLowerCase().includes(searchTerm);
        });
        
        if (products.length === 0) return;
        
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 12px 0; padding: 8px 12px; background: #f3f4f6; border-radius: 6px; color: #1f2937; font-size: 15px; font-weight: 600;">
                    ${getCategoryIcon(category)} ${category}
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 10px;">
        `;
        
        products.forEach(({ canonicalKey, sku }) => {
            const isSelected = kitchenStockSelections[canonicalKey];
            const product = CANONICAL_PRODUCTS[canonicalKey];
            const isUnlimited = product.unlimited || false;
            
            html += `
                <div onclick="toggleKitchenItem('${canonicalKey}')" 
                     style="padding: 12px; background: white; border: 2px solid ${isSelected ? '#10b981' : '#e5e7eb'}; border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 20px; height: 20px; border: 2px solid ${isSelected ? '#10b981' : '#9ca3af'}; border-radius: 4px; background: ${isSelected ? '#10b981' : 'white'}; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                            ${isSelected ? '<span style="color: white; font-size: 14px;">✓</span>' : ''}
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: #1f2937; font-size: 13px;">${sku.sku}</div>
                            ${!isUnlimited ? `<div style="color: #6b7280; font-size: 11px;">${sku.packQty}${sku.packUnit} · £${sku.price.toFixed(2)}</div>` : ''}
                        </div>
                    </div>
                    ${isSelected && !isUnlimited ? `
                        <div style="margin-top: 8px; display: flex; gap: 6px; align-items: center;">
                            <span style="font-size: 11px; color: #6b7280; width: 30px;">Qty:</span>
                            <input type="number" 
                                   value="${isSelected.quantity}" 
                                   min="0.1" 
                                   step="0.1"
                                   onclick="event.stopPropagation()"
                                   onchange="updateKitchenItemQty('${canonicalKey}', this.value)"
                                   style="flex: 1; padding: 4px 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
                            <select onchange="updateKitchenItemUnit('${canonicalKey}', this.value)" 
                                    onclick="event.stopPropagation()"
                                    style="padding: 4px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 11px;">
                                ${getUnitOptions(product.unitType, isSelected.quantityUnit, canonicalKey)}
                            </select>
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
    
    if (!html) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #9ca3af;">
                <p style="font-size: 42px; margin: 0 0 10px 0;">🔎</p>
                <p style="font-size: 16px; margin: 0;">No products match your search.</p>
            </div>
        `;
        updateKitchenStockCounter();
        return;
    }
    
    container.innerHTML = html;
    updateKitchenStockCounter();
}

// Get unit options based on unit type
function getUnitOptions(unitType, selectedUnit, canonicalKey) {
    // Custom units for specific products
    const customUnits = {
        'bread_white': { unit: 'slices', weight: 35 },      // 1 slice = 35g
        'banana': { unit: 'pieces', weight: 120 },          // 1 banana = 120g
        'apple': { unit: 'pieces', weight: 180 }            // 1 apple = 180g
    };
    
    if (unitType === 'g') {
        let options = `
            <option value="g" ${selectedUnit === 'g' ? 'selected' : ''}>g</option>
            <option value="kg" ${selectedUnit === 'kg' ? 'selected' : ''}>kg</option>
        `;
        
        // Add custom unit if applicable
        if (customUnits[canonicalKey]) {
            const custom = customUnits[canonicalKey];
            options += `<option value="${custom.unit}" ${selectedUnit === custom.unit ? 'selected' : ''}>${custom.unit}</option>`;
        }
        
        getMeasurementOptionsForUnit('g').forEach(option => {
            options += `<option value="${option.key}" ${selectedUnit === option.key ? 'selected' : ''}>${option.label}</option>`;
        });
        
        return options;
    } else if (unitType === 'ml') {
        let options = `
            <option value="ml" ${selectedUnit === 'ml' ? 'selected' : ''}>ml</option>
            <option value="L" ${selectedUnit === 'L' ? 'selected' : ''}>L</option>
        `;
        
        getMeasurementOptionsForUnit('ml').forEach(option => {
            options += `<option value="${option.key}" ${selectedUnit === option.key ? 'selected' : ''}>${option.label}</option>`;
        });
        
        return options;
    } else {
        let options = `<option value="count" ${selectedUnit === 'count' ? 'selected' : ''}>count</option>`;
        
        getMeasurementOptionsForUnit('count').forEach(option => {
            options += `<option value="${option.key}" ${selectedUnit === option.key ? 'selected' : ''}>${option.label}</option>`;
        });
        
        return options;
    }
}

function getMeasurementOptionsForUnit(unitType) {
    const matches = [];
    const allKeys = new Set([
        ...Object.keys(DEFAULT_MEASUREMENTS),
        ...Object.keys(customMeasurements)
    ]);
    
    allKeys.forEach(key => {
        const def = getMeasurementDefinition(key);
        if (!def) return;
        if ((unitType === 'g' && def.unit === 'g') ||
            (unitType === 'ml' && def.unit === 'ml') ||
            (unitType === 'count' && def.unit === 'count')) {
            matches.push({ key, label: `${def.label} (${def.unit})` });
        }
    });
    
    return matches.sort((a, b) => a.label.localeCompare(b.label));
}

// Convert custom units to base units (g, ml, count)
function convertCustomUnitToBase(quantity, unit, canonicalKey) {
    const customUnits = {
        'bread_white': { unit: 'slices', weight: 35 },
        'banana': { unit: 'pieces', weight: 120 },
        'apple': { unit: 'pieces', weight: 180 }
    };
    
    if (customUnits[canonicalKey] && unit === customUnits[canonicalKey].unit) {
        return quantity * customUnits[canonicalKey].weight; // Convert to grams
    }
    
    const measurementDefinition = getMeasurementDefinition(String(unit).toLowerCase().replace(/s$/, ''));
    if (measurementDefinition && measurementDefinition.value) {
        return quantity * measurementDefinition.value;
    }
    
    // Standard conversions
    if (unit === 'kg') return quantity * 1000;
    if (unit === 'L') return quantity * 1000;
    
    return quantity;
}

// Organize products by category for selected shop
function organizeProductsByCategory(shop) {
    const byCategory = {};
    
    Object.keys(CANONICAL_PRODUCTS).forEach(canonicalKey => {
        const product = CANONICAL_PRODUCTS[canonicalKey];
        const shopData = product.shops[shop];
        
        if (!shopData || !shopData[0]) return;
        
        const sku = shopData[0];
        const category = product.category || getCategoryFromKey(canonicalKey);
        
        if (!byCategory[category]) {
            byCategory[category] = [];
        }
        
        byCategory[category].push({ canonicalKey, sku });
    });
    
    // Sort items within each category
    Object.keys(byCategory).forEach(category => {
        byCategory[category].sort((a, b) => a.sku.sku.localeCompare(b.sku.sku));
    });
    
    return byCategory;
}

// Get category from canonical key
function getCategoryFromKey(key) {
    const keyLower = key.toLowerCase();
    
    if (keyLower.includes('milk') || keyLower.includes('egg') || keyLower.includes('butter') || keyLower.includes('cheese') || keyLower.includes('yogurt') || keyLower.includes('cottage')) {
        return 'Dairy & Eggs';
    } else if (keyLower.includes('banana') || keyLower.includes('apple') || keyLower.includes('orange')) {
        return 'Fruit';
    } else if (keyLower.includes('potato') || keyLower.includes('onion') || keyLower.includes('carrot') || keyLower.includes('tomato') || keyLower.includes('pepper') || keyLower.includes('broccoli') || keyLower.includes('cucumber') || keyLower.includes('garlic')) {
        return 'Vegetables';
    } else if (keyLower.includes('chicken') || keyLower.includes('beef') || keyLower.includes('pork') || keyLower.includes('bacon') || keyLower.includes('fish')) {
        return 'Meat & Fish';
    } else if ((keyLower.includes('bread') || keyLower.includes('croissant') || keyLower.includes('tortilla') || keyLower.includes('roll')) && !keyLower.includes('oats')) {
        return 'Bread & Bakery';
    } else if (keyLower.includes('rice') || keyLower.includes('oats') || keyLower.includes('lentil') || keyLower.includes('bean') || keyLower.includes('buckwheat') || keyLower.includes('quinoa') || keyLower.includes('barley') || keyLower.includes('couscous') || keyLower.includes('bulgur') || keyLower.includes('grain') || keyLower.includes('pulse')) {
        return 'Grains & Pulses';
    } else if (keyLower.includes('pasta') || keyLower.includes('flour') || keyLower.includes('sugar') || keyLower.includes('salt') || keyLower.includes('oil') || keyLower.includes('honey') || keyLower.includes('jam') || keyLower.includes('spice') || keyLower.includes('herb') || keyLower.includes('stock') || keyLower.includes('cocoa') || keyLower.includes('vinegar') || keyLower.includes('sauce')) {
        return 'Pantry & Dry Goods';
    } else if (keyLower.includes('frozen') || keyLower.includes('peas_frozen') || keyLower.includes('pizza') || keyLower.includes('ice_cream') || keyLower.includes('mixed_veg')) {
        return 'Frozen';
    } else if (keyLower.includes('juice') || keyLower.includes('cola') || keyLower.includes('water') || keyLower.includes('tea')) {
        return 'Drinks';
    } else if (keyLower.includes('crisp') || keyLower.includes('chips') || keyLower.includes('nuts') || keyLower.includes('popcorn') || keyLower.includes('snack') || keyLower.includes('bar')) {
        return 'Snacks';
    } else if (keyLower.includes('chocolate') || keyLower.includes('peanut') || keyLower.includes('sultana') || keyLower.includes('raisins') || keyLower.includes('syrup') || keyLower.includes('spread')) {
        return 'Sweets & Spreads';
    } else if (keyLower.includes('foil') || keyLower.includes('wrap') || keyLower.includes('clean') || keyLower.includes('detergent') || keyLower.includes('paper') || keyLower.includes('towel') || keyLower.includes('bag')) {
        return 'Household';
    } else if (keyLower.includes('soap') || keyLower.includes('shampoo') || keyLower.includes('toothpaste') || keyLower.includes('toothbrush') || keyLower.includes('deodorant') || keyLower.includes('conditioner')) {
        return 'Personal Care';
    }
    
    return 'Other';
}

// Get category icon
function getCategoryIcon(category) {
    const customIcon = findCustomCategoryIcon(category);
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

function findCustomCategoryIcon(category) {
    if (typeof customCategories === 'undefined' || !Array.isArray(customCategories)) return null;
    const match = customCategories.find(cat => {
        if (!cat) return false;
        if (typeof cat === 'string') return cat === category;
        return cat.name === category;
    });
    if (!match) return null;
    return typeof match === 'string' ? null : (match.icon || '📦');
}

// Toggle item selection
function toggleKitchenItem(canonicalKey) {
    const product = CANONICAL_PRODUCTS[canonicalKey];
    if (!product) return;
    
    if (kitchenStockSelections[canonicalKey]) {
        delete kitchenStockSelections[canonicalKey];
    } else {
        const shopData = product.shops[selectedKitchenShop];
        if (!shopData || !shopData[0]) return;
        
        const sku = shopData[0];
        const defaultUnit = product.unitType === 'g' ? 'g' : (product.unitType === 'ml' ? 'ml' : 'count');
        
        kitchenStockSelections[canonicalKey] = {
            name: sku.sku,
            unit: `${sku.packQty}${sku.packUnit}`,
            price: sku.price,
            quantity: 1,
            quantityUnit: defaultUnit,
            shop: selectedKitchenShop,
            canonicalKey: canonicalKey
        };
    }
    
    renderKitchenStockGrid();
}

// Update item quantity
function updateKitchenItemQty(canonicalKey, qty) {
    if (kitchenStockSelections[canonicalKey]) {
        kitchenStockSelections[canonicalKey].quantity = parseFloat(qty) || 0.1;
        updateKitchenStockCounter();
    }
}

// Update item unit
function updateKitchenItemUnit(canonicalKey, unit) {
    if (kitchenStockSelections[canonicalKey]) {
        kitchenStockSelections[canonicalKey].quantityUnit = unit;
    }
}

// Update counter
function updateKitchenStockCounter() {
    const count = Object.keys(kitchenStockSelections).length;
    const countEl = document.getElementById('kitchenStockSelectedCount');
    if (countEl) {
        countEl.textContent = `Selected: ${count} items`;
    }
}

// Change shop selection
function changeKitchenShop() {
    const select = document.getElementById('kitchenStockShopSelect');
    selectedKitchenShop = select.value;
    saveKitchenShopSelection();
    
    // Re-map current selections to new shop
    const tempSelections = {};
    Object.keys(kitchenStockSelections).forEach(canonicalKey => {
        const product = CANONICAL_PRODUCTS[canonicalKey];
        if (!product) return;
        
        const shopData = product.shops[selectedKitchenShop];
        if (!shopData || !shopData[0]) return; // Product not available in new shop
        
        const sku = shopData[0];
        tempSelections[canonicalKey] = {
            ...kitchenStockSelections[canonicalKey],
            name: sku.sku,
            unit: `${sku.packQty}${sku.packUnit}`,
            price: sku.price,
            shop: selectedKitchenShop
        };
    });
    
    kitchenStockSelections = tempSelections;
    renderKitchenStockGrid();
}

function populateKitchenShopOptions() {
    const select = document.getElementById('kitchenStockShopSelect');
    if (!select) return;
    
    const shops = getAllShopNames();
    if (shops.length === 0) return;
    
    select.innerHTML = shops.map(shop => `<option value="${shop}">${shop}</option>`).join('');
    
    if (!shops.includes(selectedKitchenShop)) {
        selectedKitchenShop = shops[0];
        saveKitchenShopSelection();
    }
    
    select.value = selectedKitchenShop;
}

function getAllShopNames() {
    const shopSet = new Set();
    Object.values(CANONICAL_PRODUCTS).forEach(product => {
        if (product.shops) {
            Object.keys(product.shops).forEach(shop => shopSet.add(shop));
        }
    });
    
    if (typeof customShops !== 'undefined' && customShops && typeof customShops === 'object') {
        Object.keys(customShops).forEach(shop => shopSet.add(shop));
    }
    
    return Array.from(shopSet).sort();
}

// Save selections to kitchen stock
function saveKitchenStockSelections() {
    // Add to existing stock (don't replace)
    Object.keys(kitchenStockSelections).forEach(canonicalKey => {
        const selection = kitchenStockSelections[canonicalKey];
        const product = CANONICAL_PRODUCTS[canonicalKey];
        if (!product) return;
        
        // Convert quantity to base units (handles custom units like slices, pieces)
        const qtyBase = convertCustomUnitToBase(selection.quantity, selection.quantityUnit, canonicalKey);
        
        // Add to existing stock or create new
        if (kitchenStock[canonicalKey]) {
            kitchenStock[canonicalKey].qtyBase += qtyBase;
        } else {
            kitchenStock[canonicalKey] = {
                qtyBase: qtyBase,
                unitType: product.unitType
            };
        }
    });
    
    saveKitchenStock();
    
    // Clear selections
    kitchenStockSelections = {};
    
    // Re-render grid to uncheck items
    renderKitchenStockGrid();
    
    showToast('✅ Saved to Stock!');
    
    // Switch to Stock tab
    switchKitchenTab('stock');
}

// Render Stock View
function renderStockView() {
    const container = document.getElementById('kitchenStockDisplay');
    if (!container) {
        console.error('Stock display container not found');
        return;
    }
    
    console.log('Rendering stock view. Items in stock:', Object.keys(kitchenStock).length);
    
    // Organize stock by category
    const byCategory = {};
    const searchTerm = kitchenStockSearchTerm.trim();
    const searchTermLower = searchTerm.toLowerCase();
    
    Object.keys(kitchenStock).forEach(canonicalKey => {
        const product = CANONICAL_PRODUCTS[canonicalKey];
        if (!product) {
            console.warn(`Product not found for key: ${canonicalKey}`);
            return;
        }
        
        const matchesSearch = !searchTermLower || 
            product.name.toLowerCase().includes(searchTermLower) || 
            canonicalKey.toLowerCase().includes(searchTermLower);
        if (!matchesSearch) return;
        
        const category = getCategoryFromKey(canonicalKey);
        if (!byCategory[category]) {
            byCategory[category] = [];
        }
        
        byCategory[category].push({
            key: canonicalKey,
            product: product,
            data: kitchenStock[canonicalKey]
        });
    });
    
    const categories = Object.keys(byCategory).sort();
    
    console.log('Categories:', categories);
    
    if (categories.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #999;">
                <p style="font-size: 48px; margin: 0 0 20px 0;">🏠</p>
                <p style="font-size: 18px; margin: 0 0 10px 0;">${searchTerm ? 'No items match your search' : 'No items in stock'}</p>
                <p style="font-size: 14px; margin: 0 0 20px 0;">${searchTerm ? 'Try a different term or clear the search box.' : 'Go to \"Select\" tab to add items'}</p>
                ${searchTerm ? '' : `<button onclick="switchKitchenTab('select')" style="padding: 12px 24px; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    📋 Select Items
                </button>`}
            </div>
        `;
        updateStockCounter();
        return;
    }
    
    let html = '';
    
    categories.forEach(category => {
        const items = byCategory[category];
        
        html += `
            <div style="margin-bottom: 24px;">
                <h4 style="margin: 0 0 12px 0; padding: 10px 12px; background: white; border-radius: 8px; color: #1f2937; font-size: 16px; font-weight: 700; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    ${getCategoryIcon(category)} ${category}
                </h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;">
        `;
        
        items.forEach(({ key, product, data }) => {
            const isNegative = data.qtyBase < 0;
            const isUnlimited = product.unlimited || false;
            const displayQty = isUnlimited ? '' : prettyQty(key, Math.abs(data.qtyBase));
            
            html += `
                <div style="padding: 14px; background: white; border: 2px solid ${isNegative ? '#fee2e2' : '#10b981'}; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: flex-start; gap: 10px;">
                        <div style="width: 20px; height: 20px; border: 2px solid #10b981; border-radius: 4px; background: #10b981; flex-shrink: 0; display: flex; align-items: center; justify-content: center; margin-top: 2px;">
                            <span style="color: white; font-size: 14px;">✓</span>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: #1f2937; font-size: 14px; margin-bottom: 6px;">${product.name}</div>
                            ${displayQty ? `
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="color: ${isNegative ? '#dc2626' : '#059669'}; font-size: 15px; font-weight: 700;">
                                    ${isNegative ? '⚠️ Deficit: ' : ''}${displayQty}
                                </div>
                                <div style="display: flex; gap: 4px;">
                                    <button onclick="adjustKitchenStock('${key}', -50); renderStockView();" 
                                            title="Subtract"
                                            style="background: #f59e0b; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 700; line-height: 1;">
                                        −
                                    </button>
                                    <button onclick="adjustKitchenStock('${key}', 50); renderStockView();" 
                                            title="Add"
                                            style="background: #10b981; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 700; line-height: 1;">
                                        +
                                    </button>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                        ${!isUnlimited ? `
                        <button onclick="removeFromKitchenStock('${key}'); renderStockView();" 
                                style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; flex-shrink: 0;">
                            ✕
                        </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    updateStockCounter();
}

// Update stock counter
function updateStockCounter() {
    const count = Object.keys(kitchenStock).length;
    const countEl = document.getElementById('kitchenStockItemCount');
    if (countEl) {
        countEl.textContent = `Items in Stock: ${count}`;
    }
}

// Show toast notification
function showToast(message, duration = 3000) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Add CSS for toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyles);

// ================================================
// RENDER MEASURES TAB
// ================================================

function renderMeasuresTab() {
    const container = document.getElementById('kitchenMeasuresDisplay');
    if (!container) return;
    
    const defaultKeys = Object.keys(DEFAULT_MEASUREMENTS);
    const customOnlyKeys = Object.keys(customMeasurements).filter(key => !DEFAULT_MEASUREMENTS[key]);
    const measureKeys = [...defaultKeys, ...customOnlyKeys.sort((a, b) => a.localeCompare(b))];
    const searchTerm = kitchenStockSearchTerm.trim().toLowerCase();
    
    let html = `
        <div style="max-width: 900px; margin: 0 auto;">
            <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #fed7aa; margin-bottom: 20px;">
                <h3 style="margin: 0 0 8px 0; color: #92400e; font-size: 18px;">📏 Cooking Measurements</h3>
                <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">
                    Customize your cooking measurements. These are used when converting recipes to shopping lists.
                    Adjust values to match your measuring tools (cups, spoons, handfuls). Changes save automatically.
                </p>
            </div>
            
            <div style="background: #fff7ed; border: 2px dashed #fdba74; padding: 16px; border-radius: 12px; margin-bottom: 18px;">
                <h4 style="margin: 0 0 10px 0; color: #c2410c;">➕ Add a new measurement</h4>
                <form onsubmit="addNewMeasurement(event)" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; align-items: end;">
                    <div>
                        <label style="display: block; font-weight: 600; color: #7c2d12; margin-bottom: 4px;">Keyword (used in recipes)</label>
                        <input id="newMeasureKey" type="text" required placeholder="e.g., cup_quinoa" style="width: 100%; padding: 10px; border: 2px solid #fdba74; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: #7c2d12; margin-bottom: 4px;">Label (display)</label>
                        <input id="newMeasureLabel" type="text" placeholder="Quinoa Cup" style="width: 100%; padding: 10px; border: 2px solid #fdba74; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: #7c2d12; margin-bottom: 4px;">Value</label>
                        <input id="newMeasureValue" type="number" step="0.1" min="0.1" required placeholder="180" style="width: 100%; padding: 10px; border: 2px solid #fdba74; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; color: #7c2d12; margin-bottom: 4px;">Base unit</label>
                        <select id="newMeasureUnit" required style="width: 100%; padding: 10px; border: 2px solid #fdba74; border-radius: 8px; font-size: 14px;">
                            <option value="g">g (mass)</option>
                            <option value="ml">ml (volume)</option>
                            <option value="count">count (pieces)</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit" style="width: 100%; padding: 12px; background: #f97316; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Add measurement</button>
                    </div>
                </form>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #9a3412;">Use the keyword in recipe units (e.g., "2 cup_quinoa"). We store values in base units so shopping and smart cooking stay accurate.</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 16px;">
    `;
    
    measureKeys.forEach(key => {
        const definition = getMeasurementDefinition(key);
        if (!definition) return;
        
        if (searchTerm) {
            const labelText = `${definition.label || ''}`.toLowerCase();
            if (!key.toLowerCase().includes(searchTerm) && !labelText.includes(searchTerm)) return;
        }
        
        const defaultData = DEFAULT_MEASUREMENTS[key];
        
        const currentValue = definition.value;
        const isCustomized = customMeasurements.hasOwnProperty(key);
        const isCustomOnly = !defaultData;
        const unit = definition.unit;
        
        const unitControl = isCustomOnly ? `
            <select onchange="updateCustomMeasurementUnit('${key}', this.value)" style="padding: 10px; border: 2px solid #d1d5db; border-radius: 8px; font-size: 14px; font-weight: 600; color: #1f2937;">
                <option value="g" ${unit === 'g' ? 'selected' : ''}>g</option>
                <option value="ml" ${unit === 'ml' ? 'selected' : ''}>ml</option>
                <option value="count" ${unit === 'count' ? 'selected' : ''}>count</option>
            </select>
        ` : `
            <div style="padding: 10px 16px; background: #f3f4f6; border-radius: 8px; color: #4b5563; font-weight: 600; font-size: 14px; min-width: 50px; text-align: center;">
                ${unit}
            </div>
        `;
        
        const actionButton = isCustomOnly ? `
            <button onclick="deleteCustomMeasurement('${key}')" 
                    style="background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
                🗑️ Delete
            </button>
        ` : (isCustomized ? `
            <button onclick="resetMeasurement('${key}')" 
                    style="background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
                ↺ Reset
            </button>
        ` : '');
        
        html += `
            <div style="background: white; padding: 16px; border-radius: 10px; border: 2px solid ${isCustomized ? '#f59e0b' : '#e5e7eb'}; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <div style="font-weight: 600; color: #1f2937; font-size: 15px;">
                        ${definition.label}
                        <div style="color: #6b7280; font-size: 11px; font-weight: 500;">Key: ${key}</div>
                    </div>
                    ${actionButton}
                </div>
                
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="number" 
                           value="${currentValue}" 
                           step="${unit === 'ml' || unit === 'g' ? '0.1' : '1'}"
                           min="0.1"
                           oninput="updateCustomMeasurement('${key}', this.value)"
                           style="flex: 1; padding: 10px; border: 2px solid ${isCustomized ? '#f59e0b' : '#d1d5db'}; border-radius: 8px; font-size: 14px; font-weight: 600; color: #1f2937;">
                    ${unitControl}
                </div>
                
                ${!isCustomOnly && isCustomized ? `
                    <div style="margin-top: 8px; font-size: 12px; color: #92400e; font-weight: 500;">
                        Default: ${defaultData.value} ${defaultData.unit}
                    </div>
                ` : ''}
                
                ${isCustomOnly ? `
                    <div style="margin-top: 8px; font-size: 12px; color: #2563eb; font-weight: 500;">
                        Custom measurement (stored in ${unit})
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function addNewMeasurement(event) {
    event.preventDefault();
    
    const keyInput = document.getElementById('newMeasureKey');
    const labelInput = document.getElementById('newMeasureLabel');
    const valueInput = document.getElementById('newMeasureValue');
    const unitInput = document.getElementById('newMeasureUnit');
    
    if (!keyInput || !valueInput || !unitInput) return;
    
    const rawKey = keyInput.value.trim().toLowerCase();
    const sanitizedKey = rawKey.replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    if (!sanitizedKey) {
        alert('Please enter a measurement keyword (letters/numbers only)');
        return;
    }
    
    if (DEFAULT_MEASUREMENTS[sanitizedKey]) {
        alert('This measurement already exists. Edit it in the list below.');
        return;
    }
    
    const value = parseFloat(valueInput.value);
    if (isNaN(value) || value <= 0) {
        alert('Please enter a valid measurement value');
        return;
    }
    
    const unit = unitInput.value;
    const label = labelInput.value.trim() || prettifyMeasurementLabel(sanitizedKey);
    
    customMeasurements[sanitizedKey] = { value, unit, label };
    saveCustomMeasurements();
    renderMeasuresTab();
    
    keyInput.value = '';
    labelInput.value = '';
    valueInput.value = '';
    unitInput.value = 'g';
    
    showToast(`✅ Added measurement: ${label}`);
}

function deleteCustomMeasurement(measureKey) {
    const key = String(measureKey).toLowerCase();
    if (DEFAULT_MEASUREMENTS[key]) {
        resetMeasurement(key);
        return;
    }
    
    if (!customMeasurements[key]) return;
    if (!confirm(`Delete measurement "${key}"?`)) return;
    
    delete customMeasurements[key];
    saveCustomMeasurements();
    renderMeasuresTab();
}

function updateCustomMeasurementUnit(measureKey, newUnit) {
    const key = String(measureKey).toLowerCase();
    if (!customMeasurements[key]) return;
    customMeasurements[key].unit = newUnit;
    saveCustomMeasurements();
}

function refreshKitchenStockCatalog() {
    populateKitchenShopOptions();
    
    const modal = document.getElementById('kitchenStockModal');
    if (modal && modal.classList.contains('active')) {
        renderKitchenStockGrid();
        if (typeof renderStockView === 'function') {
            renderStockView();
        }
    }
}

console.log('✅ Kitchen Stock System loaded - V2.1.0 Products at Home');
