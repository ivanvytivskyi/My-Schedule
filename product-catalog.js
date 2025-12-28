// ================================================
// CANONICAL PRODUCT CATALOG SYSTEM - V2.1.0
// ================================================
// Products organized by canonical keys (internal use only, never shown to users)
// Each product can have multiple shop SKUs with different pack sizes

// Density table for g↔ml conversion
const DENSITY = {
    water: 1.0,
    milk: 1.03,          // ~1.03 g/ml
    vegetable_oil: 0.92, // ~0.92 g/ml
    olive_oil: 0.92,
    butter: 0.911,
    cream: 1.01,
    honey: 1.42,
    yogurt: 1.03
};

// Unit types for base storage
const UNIT_TYPE = {
    COUNT: 'count',
    MASS: 'g',
    VOLUME: 'ml'
};

// ================================================
// COOKING MEASUREMENTS
// ================================================
// Default cooking measurements (base units: ml for volume, g for mass)
const DEFAULT_MEASUREMENTS = {
    // Volume measurements
    tsp: { value: 5, unit: 'ml', label: 'Teaspoon' },
    tbsp: { value: 15, unit: 'ml', label: 'Tablespoon' },
    cup: { value: 240, unit: 'ml', label: 'Cup' },
    
    // Small amounts
    pinch: { value: 0.4, unit: 'g', label: 'Pinch' },
    dash: { value: 0.6, unit: 'g', label: 'Dash' },
    
    // Ingredient-specific (cups in grams)
    cup_flour: { value: 120, unit: 'g', label: 'Cup of Flour' },
    cup_sugar: { value: 200, unit: 'g', label: 'Cup of Sugar' },
    cup_rice: { value: 185, unit: 'g', label: 'Cup of Rice' },
    cup_oats: { value: 80, unit: 'g', label: 'Cup of Oats' },
    
    // Butter/Oil
    tbsp_butter: { value: 14, unit: 'g', label: 'Tablespoon of Butter' },
    tbsp_oil: { value: 13, unit: 'ml', label: 'Tablespoon of Oil' },
    
    // Slices and pieces
    slice_bread: { value: 45, unit: 'g', label: 'Slice of Bread' },
    each_banana: { value: 100, unit: 'g', label: 'Banana (each)' },
    each_apple: { value: 150, unit: 'g', label: 'Apple (each)' },
    each_orange: { value: 120, unit: 'g', label: 'Orange (each)' },
    each_potato: { value: 150, unit: 'g', label: 'Potato (each)' },
    each_tomato: { value: 80, unit: 'g', label: 'Tomato (each)' },
    each_onion: { value: 120, unit: 'g', label: 'Onion (each)' },
    
    // Garlic
    clove: { value: 5, unit: 'g', label: 'Clove of Garlic' },
    bulb: { value: 40, unit: 'g', label: 'Garlic Bulb' },
    each_garlic: { value: 40, unit: 'g', label: 'Garlic Bulb (each)' },
    
    // Cucumber
    each_cucumber: { value: 300, unit: 'g', label: 'Cucumber (each)' },
    
    // Variable amounts
    handful: { value: 40, unit: 'g', label: 'Handful' },
    drizzle: { value: 7, unit: 'ml', label: 'Drizzle' },
    splash: { value: 5, unit: 'ml', label: 'Splash' }
};

// Get measurement value (will be overridden by kitchen-stock.js if customMeasurements exist)
function getMeasurementValue(measureKey) {
    const definition = getMeasurementDefinition(measureKey);
    return definition ? definition.value : null;
}

// Get measurement unit (will be overridden by kitchen-stock.js if customMeasurements exist)
function getMeasurementUnit(measureKey) {
    const definition = getMeasurementDefinition(measureKey);
    return definition ? definition.unit : 'g';
}

// Resolve measurement definition (default + custom support)
function getMeasurementDefinition(measureKey) {
    if (!measureKey) return null;
    
    const key = String(measureKey).toLowerCase();
    const defaultDef = DEFAULT_MEASUREMENTS[key];
    let customDef = null;
    
    if (typeof customMeasurements !== 'undefined' && customMeasurements[key]) {
        const entry = customMeasurements[key];
        if (typeof entry === 'number') {
            customDef = { value: entry, unit: defaultDef?.unit || 'g', label: defaultDef?.label || key };
        } else if (typeof entry === 'object') {
            customDef = {
                value: typeof entry.value === 'number' ? entry.value : parseFloat(entry.value),
                unit: entry.unit || defaultDef?.unit || 'g',
                label: entry.label || defaultDef?.label || key
            };
        }
    }
    
    if (customDef && !isNaN(customDef.value) && customDef.value > 0) {
        return customDef;
    }
    
    if (defaultDef) {
        return { value: defaultDef.value, unit: defaultDef.unit, label: defaultDef.label };
    }
    
    return null;
}

// Canonical Products - the single source of truth
// Key principles:
// 1. Canonical keys are NEVER shown to users
// 2. Users see SKU names (brand names)
// 3. All quantities stored in base units (g, ml, count)
const CANONICAL_PRODUCTS = {
    // === DAIRY & EGGS ===
    milk: {
        name: "Milk",
        unitType: UNIT_TYPE.VOLUME,
        densityKey: "milk",
        shops: {
            Tesco: [
                { sku: "Milk (Semi-Skimmed)", packQty: 2272, packUnit: "ml", price: 1.65, defaultQty: 1 },
                { sku: "Milk (Whole)", packQty: 2272, packUnit: "ml", price: 1.65, defaultQty: 1 },
                { sku: "Milk (Skimmed)", packQty: 2272, packUnit: "ml", price: 1.65, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Milk (Semi-Skimmed)", packQty: 568, packUnit: "ml", price: 1.39, defaultQty: 4 }
            ]
        }
    },
    
    egg: {
        name: "Egg",
        unitType: UNIT_TYPE.COUNT,
        shops: {
            Tesco: [
                { sku: "British Barn Eggs", packQty: 10, packUnit: "count", price: 1.43, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Eggs (Large)", packQty: 10, packUnit: "count", price: 1.89, defaultQty: 1 }
            ]
        }
    },
    
    butter: {
        name: "Butter",
        unitType: UNIT_TYPE.MASS,
        densityKey: "butter",
        shops: {
            Tesco: [
                { sku: "BUTTERPAK (SPREADABLE Slightly Salted)", packQty: 500, packUnit: "g", price: 2.18, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Butter", packQty: 250, packUnit: "g", price: 1.75, defaultQty: 1 }
            ]
        }
    },
    
    cottage_cheese: {
        name: "Cottage Cheese",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Cottage Cheese", packQty: 300, packUnit: "g", price: 1.20, defaultQty: 1 }
            ]
        }
    },
    
    creme_fraiche: {
        name: "Crème Fraîche",
        unitType: UNIT_TYPE.MASS,
        densityKey: "cream",
        shops: {
            Tesco: [
                { sku: "British Crème Fraîche", packQty: 300, packUnit: "ml", price: 0.85, defaultQty: 1 }
            ]
        }
    },
    
    yogurt_greek: {
        name: "Greek Yogurt",
        unitType: UNIT_TYPE.MASS,
        densityKey: "yogurt",
        shops: {
            Tesco: [
                { sku: "Greek Style Yogurt", packQty: 500, packUnit: "g", price: 1.15, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Yogurt", packQty: 500, packUnit: "g", price: 0.99, defaultQty: 1 }
            ]
        }
    },
    
    cheese: {
        name: "Cheese",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Lidl: [
                { sku: "Cheese", packQty: 400, packUnit: "g", price: 2.49, defaultQty: 1 }
            ]
        }
    },
    
    // === BREAD & BAKERY ===
    bread_white: {
        name: "White Bread",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "White Toastie Bread Thick Sliced", packQty: 800, packUnit: "g", price: 0.75, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "White Bread", packQty: 800, packUnit: "g", price: 0.75, defaultQty: 1 }
            ]
        }
    },
    
    bread_brown: {
        name: "Brown Bread",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Lidl: [
                { sku: "Brown Bread", packQty: 800, packUnit: "g", price: 0.85, defaultQty: 1 }
            ]
        }
    },
    
    croissant: {
        name: "Croissant",
        unitType: UNIT_TYPE.COUNT,
        shops: {
            Tesco: [
                { sku: "Nevills Plain Croissants", packQty: 8, packUnit: "count", price: 1.39, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Croissants", packQty: 6, packUnit: "count", price: 1.29, defaultQty: 1 }
            ]
        }
    },
    
    tortilla: {
        name: "Tortilla Wraps",
        unitType: UNIT_TYPE.COUNT,
        shops: {
            Tesco: [
                { sku: "Nevills Plain White Tortilla", packQty: 8, packUnit: "count", price: 0.99, defaultQty: 1 }
            ]
        }
    },
    
    rolls: {
        name: "Bread Rolls",
        unitType: UNIT_TYPE.COUNT,
        shops: {
            Lidl: [
                { sku: "Rolls", packQty: 6, packUnit: "count", price: 0.65, defaultQty: 1 }
            ]
        }
    },
    
    // === MEAT & FISH ===
    chicken_breast: {
        name: "Chicken Breast",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Chicken Breast", packQty: 1, packUnit: "kg", price: 6.50, defaultQty: 0.5, loose: true }
            ],
            Lidl: [
                { sku: "Chicken Breast", packQty: 1, packUnit: "kg", price: 5.99, defaultQty: 0.5, loose: true }
            ]
        }
    },
    
    fish_white: {
        name: "White Fish",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "White Fish", packQty: 1, packUnit: "kg", price: 8.00, defaultQty: 0.3, loose: true }
            ]
        }
    },
    
    beef_mince: {
        name: "Beef Mince",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Lidl: [
                { sku: "Beef Mince", packQty: 500, packUnit: "g", price: 2.99, defaultQty: 1 }
            ]
        }
    },
    
    pork_chops: {
        name: "Pork Chops",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Lidl: [
                { sku: "Pork Chops", packQty: 1, packUnit: "kg", price: 4.49, defaultQty: 0.5, loose: true }
            ]
        }
    },
    
    bacon: {
        name: "Bacon",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Lidl: [
                { sku: "Bacon", packQty: 200, packUnit: "g", price: 1.99, defaultQty: 1 }
            ]
        }
    },
    
    // === VEGETABLES ===
    potato: {
        name: "Potatoes",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "All Rounder Potatoes", packQty: 2000, packUnit: "g", price: 1.20, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Potatoes", packQty: 2500, packUnit: "g", price: 1.49, defaultQty: 1 }
            ]
        }
    },
    
    onion: {
        name: "Onions",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "BRITISH BROWN ONIONS", packQty: 1000, packUnit: "g", price: 0.99, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Onions", packQty: 1000, packUnit: "g", price: 0.79, defaultQty: 1 }
            ]
        }
    },
    
    carrot: {
        name: "Carrots",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Carrots", packQty: 1000, packUnit: "g", price: 0.69, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Carrots", packQty: 1000, packUnit: "g", price: 0.59, defaultQty: 1 }
            ]
        }
    },
    
    pepper_sweet: {
        name: "Sweet Peppers",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Sweet Peppers", packQty: 500, packUnit: "g", price: 2.00, defaultQty: 1 }
            ]
        }
    },
    
    broccoli: {
        name: "Broccoli",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Broccoli", packQty: 375, packUnit: "g", price: 0.82, defaultQty: 1 }
            ]
        }
    },
    
    tomato: {
        name: "Tomatoes",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Tomatoes", packQty: 1000, packUnit: "g", price: 2.00, defaultQty: 0.5 }
            ],
            Lidl: [
                { sku: "Tomatoes", packQty: 500, packUnit: "g", price: 0.99, defaultQty: 1 }
            ]
        }
    },
    
    cucumber: {
        name: "Cucumber",
        unitType: UNIT_TYPE.MASS,  // Store as grams, not count
        shops: {
            Tesco: [
                { sku: "Cucumbers", packQty: 1, packUnit: "count", price: 0.60, defaultQty: 1 }
            ]
        }
    },
    
    spring_onion: {
        name: "Spring Onions",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Bunched Spring Onions", packQty: 100, packUnit: "g", price: 0.69, defaultQty: 1 }
            ]
        }
    },
    
    garlic: {
        name: "Garlic",
        unitType: UNIT_TYPE.MASS,  // Store as grams, not count
        shops: {
            Tesco: [
                { sku: "Garlic", packQty: 4, packUnit: "count", price: 0.88, defaultQty: 1 }
            ]
        }
    },
    
    // === FRUITS ===
    banana: {
        name: "Bananas",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Banana Loose", packQty: 1, packUnit: "kg", price: 0.90, defaultQty: 1, loose: true },
                { sku: "Bananas", packQty: 7, packUnit: "count", price: 1.05, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Bananas Loose", packQty: 1, packUnit: "kg", price: 0.89, defaultQty: 1, loose: true }
            ]
        }
    },
    
    apple: {
        name: "Apples",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Apples (ROSEDENE FARMS)", packQty: 6, packUnit: "count", price: 0.80, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Apples", packQty: 1000, packUnit: "g", price: 1.49, defaultQty: 1 }
            ]
        }
    },
    
    orange: {
        name: "Oranges",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Oranges", packQty: 1000, packUnit: "g", price: 1.50, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Oranges", packQty: 1000, packUnit: "g", price: 1.29, defaultQty: 1 }
            ]
        }
    },
    
    // === PANTRY & STAPLES ===
    rice_long_grain: {
        name: "Long Grain Rice",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Long Grain Rice", packQty: 1000, packUnit: "g", price: 0.52, defaultQty: 1 }
            ]
        }
    },
    
    pasta_spaghetti: {
        name: "Spaghetti",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Pasta (Spaghetti)", packQty: 500, packUnit: "g", price: 0.80, defaultQty: 1 }
            ]
        }
    },
    
    flour_plain: {
        name: "Plain Flour",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Flour (Plain)", packQty: 1500, packUnit: "g", price: 1.10, defaultQty: 1 }
            ]
        }
    },
    
    jam_strawberry: {
        name: "Strawberry Jam",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Strawberry Jam", packQty: 454, packUnit: "g", price: 0.89, defaultQty: 1 }
            ]
        }
    },
    
    sugar_white: {
        name: "White Sugar",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Sugar (White)", packQty: 1000, packUnit: "g", price: 1.20, defaultQty: 1 }
            ]
        }
    },
    
    sultanas: {
        name: "Sultanas",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Grower's Harvest Sultanas", packQty: 500, packUnit: "g", price: 1.15, defaultQty: 1 }
            ]
        }
    },
    
    oats_rolled: {
        name: "Rolled Oats",
        category: "Pantry",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Rolled Oats", packQty: 1000, packUnit: "g", price: 1.25, defaultQty: 1 }
            ],
            Lidl: [
                { sku: "Porridge Oats", packQty: 500, packUnit: "g", price: 0.59, defaultQty: 1 }
            ]
        }
    },
    
    buckwheat: {
        name: "Buckwheat Groats",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Buckwheat Groats", packQty: 1000, packUnit: "g", price: 2.20, defaultQty: 1 }
            ]
        }
    },
    
    lentils_red: {
        name: "Red Lentils",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Red Split Lentils", packQty: 1000, packUnit: "g", price: 2.50, defaultQty: 1 }
            ]
        }
    },
    
    soy_sauce: {
        name: "Soy Sauce",
        unitType: UNIT_TYPE.VOLUME,
        shops: {
            Tesco: [
                { sku: "Light Soy Sauce", packQty: 150, packUnit: "ml", price: 0.55, defaultQty: 1 }
            ]
        }
    },
    
    honey: {
        name: "Honey",
        unitType: UNIT_TYPE.MASS,
        densityKey: "honey",
        shops: {
            Tesco: [
                { sku: "Honey", packQty: 340, packUnit: "g", price: 0.74, defaultQty: 1 }
            ]
        }
    },
    
    vegetable_oil: {
        name: "Vegetable Oil",
        unitType: UNIT_TYPE.VOLUME,
        densityKey: "vegetable_oil",
        shops: {
            Tesco: [
                { sku: "Vegetable Oil", packQty: 1000, packUnit: "ml", price: 2.50, defaultQty: 1 }
            ]
        }
    },
    
    salt: {
        name: "Salt",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "BRITISH COOKING SALT", packQty: 1500, packUnit: "g", price: 1.90, defaultQty: 1 }
            ]
        }
    },
    
    pepper_black: {
        name: "Black Pepper",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Black Peppercorns", packQty: 250, packUnit: "g", price: 4.40, defaultQty: 1 }
            ]
        }
    },
    
    // === CANNED & PACKAGED ===
    tomato_canned: {
        name: "Chopped Tomatoes (Canned)",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Grower's Harvest Chopped Tomatoes", packQty: 400, packUnit: "g", price: 0.43, defaultQty: 1 }
            ]
        }
    },
    
    // === DRINKS ===
    juice_orange: {
        name: "Orange Juice",
        unitType: UNIT_TYPE.VOLUME,
        shops: {
            Tesco: [
                { sku: "Orange Juice", packQty: 1000, packUnit: "ml", price: 1.50, defaultQty: 1 }
            ]
        }
    },
    
    juice_apple: {
        name: "Apple Juice",
        unitType: UNIT_TYPE.VOLUME,
        shops: {
            Tesco: [
                { sku: "Apple Juice", packQty: 1000, packUnit: "ml", price: 1.50, defaultQty: 1 }
            ]
        }
    },
    
    cola: {
        name: "Cola",
        unitType: UNIT_TYPE.VOLUME,
        shops: {
            Tesco: [
                { sku: "Cola", packQty: 2000, packUnit: "ml", price: 1.75, defaultQty: 1 }
            ]
        }
    },
    
    water: {
        name: "Water (Still)",
        unitType: UNIT_TYPE.VOLUME,
        densityKey: "water",
        shops: {
            Tesco: [
                { sku: "Water (Still)", packQty: 2000, packUnit: "ml", price: 0.60, defaultQty: 2 }
            ]
        }
    },
    
    water_tap: {
        name: "Tap Water",
        unitType: UNIT_TYPE.VOLUME,
        densityKey: "water",
        unlimited: true,
        shops: {
            Tesco: [
                { sku: "Tap Water (Unlimited)", packQty: 50000000, packUnit: "ml", price: 0.00, defaultQty: 1 }
            ]
        }
    },
    
    tea: {
        name: "Tea Bags",
        unitType: UNIT_TYPE.COUNT,
        shops: {
            Tesco: [
                { sku: "Tea Bags", packQty: 80, packUnit: "count", price: 2.00, defaultQty: 1 }
            ]
        }
    },
    
    // === FROZEN ===
    peas_frozen: {
        name: "Frozen Peas",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Frozen Peas", packQty: 900, packUnit: "g", price: 1.40, defaultQty: 1 }
            ]
        }
    },
    
    mixed_veg_frozen: {
        name: "Mixed Vegetables (Frozen)",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Tesco: [
                { sku: "Growers Harvest Mixed Veg", packQty: 1000, packUnit: "g", price: 0.99, defaultQty: 1 }
            ]
        }
    },
    
    pizza: {
        name: "Pizza",
        unitType: UNIT_TYPE.COUNT,
        shops: {
            Tesco: [
                { sku: "Pizza (Margherita)", packQty: 1, packUnit: "count", price: 1.50, defaultQty: 1 }
            ]
        }
    },
    
    ice_cream: {
        name: "Ice Cream",
        unitType: UNIT_TYPE.VOLUME,
        shops: {
            Tesco: [
                { sku: "Ice Cream", packQty: 1000, packUnit: "ml", price: 2.50, defaultQty: 1 }
            ]
        }
    },
    
    // === HOUSEHOLD ===
    washing_up_liquid: {
        name: "Washing Up Liquid",
        unitType: UNIT_TYPE.VOLUME,
        shops: {
            Tesco: [
                { sku: "Washing Up Liquid", packQty: 500, packUnit: "ml", price: 1.00, defaultQty: 1 }
            ]
        }
    },
    
    laundry_detergent: {
        name: "Laundry Detergent",
        unitType: UNIT_TYPE.VOLUME,
        shops: {
            Tesco: [
                { sku: "Laundry Detergent", packQty: 1000, packUnit: "ml", price: 4.00, defaultQty: 1 }
            ]
        }
    },
    
    bin_bags: {
        name: "Bin Bags",
        unitType: UNIT_TYPE.COUNT,
        shops: {
            Tesco: [
                { sku: "Bin Bags", packQty: 40, packUnit: "count", price: 1.00, defaultQty: 1 }
            ]
        }
    },
    
    bungee_cords: {
        name: "Bungee Cords",
        unitType: UNIT_TYPE.COUNT,
        shops: {
            Tesco: [
                { sku: "Assorted Bungee Cords", packQty: 2, packUnit: "count", price: 1.50, defaultQty: 1 }
            ]
        }
    },
    
    // === SWEETS (Lidl) ===
    chocolate: {
        name: "Chocolate Bar",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Lidl: [
                { sku: "fin Carre Milk Chocolate", packQty: 100, packUnit: "g", price: 0.99, defaultQty: 1 }
            ]
        }
    },
    
    // === SPREADS (Lidl) ===
    peanut_butter: {
        name: "Peanut Butter",
        unitType: UNIT_TYPE.MASS,
        shops: {
            Lidl: [
                { sku: "Mister CHOC Peanut Butter Crunch", packQty: 340, packUnit: "g", price: 0.99, defaultQty: 1 }
            ]
        }
    }
};

// Apply consistent categories to all products (overrides keyword guessing in UI helpers)
const CATEGORY_OVERRIDES = {
    oats_rolled: "Pantry"
};

function determineCategoryFromKey(canonicalKey) {
    if (!canonicalKey) return "Other";
    if (CATEGORY_OVERRIDES[canonicalKey]) return CATEGORY_OVERRIDES[canonicalKey];
    
    const keyLower = canonicalKey.toLowerCase();
    
    const categoryRules = [
        { category: "Dairy & Eggs", keywords: ["milk", "egg", "butter", "cheese", "yogurt", "cottage"] },
        { category: "Fruit", keywords: ["banana", "apple", "orange", "strawberry", "blueberry", "lemon", "lime", "grape"] },
        { category: "Vegetables", keywords: ["potato", "onion", "carrot", "tomato", "pepper", "broccoli", "cucumber", "garlic", "ginger", "spinach", "lettuce", "leek", "celery", "cauliflower", "mushroom"] },
        { category: "Meat & Fish", keywords: ["chicken", "beef", "pork", "bacon", "fish", "salmon", "cod", "lamb"] },
        { category: "Bread & Bakery", keywords: ["bread", "croissant", "tortilla", "bun", "bap", "baguette", "pitta", "muffin", "bagel", "roll_"] },
        { category: "Pantry", keywords: ["rice", "pasta", "flour", "sugar", "salt", "oil", "honey", "jam", "buckwheat", "lentil", "oats", "cereal", "spice", "herb", "stock", "cocoa", "vinegar", "sauce", "beans", "tuna", "kidney"] },
        { category: "Frozen", keywords: ["frozen", "ice_cream", "peas_frozen", "mixed_veg", "pizza"] },
        { category: "Drinks", keywords: ["juice", "cola", "water", "tea", "coffee"] },
        { category: "Sweets & Spreads", keywords: ["chocolate", "peanut", "sultana", "raisins", "jam", "syrup"] }
    ];
    
    for (const rule of categoryRules) {
        if (rule.keywords.some(keyword => keyLower.includes(keyword))) {
            // Prevent "roll" matching "rolled" by checking exact token where needed
            if (rule.category === "Bread & Bakery" && keyLower.includes("rolled")) continue;
            return rule.category;
        }
    }
    
    return "Other";
}

Object.keys(CANONICAL_PRODUCTS).forEach(key => {
    const product = CANONICAL_PRODUCTS[key];
    if (!product.category) {
        product.category = determineCategoryFromKey(key);
    }
});

// Helper function: Convert any unit to base unit
function convertToBase(qty, unit, canonicalKey) {
    const unitLower = (unit || "").toLowerCase();
    const product = CANONICAL_PRODUCTS[canonicalKey];
    
    // If product is unknown, still try to normalize common units and measurements
    if (!product) {
        const measureKey = unitLower.replace(/s$/, '');
        const measurementDefinition = getMeasurementDefinition(measureKey);
        if (measurementDefinition && measurementDefinition.value) {
            return qty * measurementDefinition.value;
        }
        
        if (unitLower === "kg" || unitLower === "l") return qty * 1000;
        if (unitLower === "g" || unitLower === "ml" || unitLower === "count" || unitLower === "") return qty;
        
        return qty;
    }
    
    const targetUnit = product.unitType;
    
    // Check for cooking measurements first
    // Handle specific cooking measurements
    if (unitLower === 'slice' || unitLower === 'slices') {
        const sliceWeight = getMeasurementValue('slice_bread');
        if (sliceWeight) return qty * sliceWeight;
    }
    
    // Handle "each" measurements for whole items
    const keyLower = canonicalKey.toLowerCase();
    if (unitLower === 'each' || unitLower === 'banana' || unitLower === 'bananas' ||
        unitLower === 'apple' || unitLower === 'apples' ||
        unitLower === 'orange' || unitLower === 'oranges' ||
        unitLower === 'potato' || unitLower === 'potatoes' ||
        unitLower === 'tomato' || unitLower === 'tomatoes' ||
        unitLower === 'onion' || unitLower === 'onions') {
        
        // Map to the right measurement
        if (keyLower.includes('banana')) {
            const weight = getMeasurementValue('each_banana');
            if (weight) return qty * weight;
        } else if (keyLower.includes('apple')) {
            const weight = getMeasurementValue('each_apple');
            if (weight) return qty * weight;
        } else if (keyLower.includes('orange')) {
            const weight = getMeasurementValue('each_orange');
            if (weight) return qty * weight;
        } else if (keyLower.includes('potato')) {
            const weight = getMeasurementValue('each_potato');
            if (weight) return qty * weight;
        } else if (keyLower.includes('tomato')) {
            const weight = getMeasurementValue('each_tomato');
            if (weight) return qty * weight;
        } else if (keyLower.includes('onion')) {
            const weight = getMeasurementValue('each_onion');
            if (weight) return qty * weight;
        }
    }
    
    // Handle other cooking measurements
    const measureKey = unitLower.replace(/s$/, ''); // Remove plural 's'
    const measurementDefinition = getMeasurementDefinition(measureKey);
    if (measurementDefinition && measurementDefinition.value) {
        return qty * measurementDefinition.value;
    }
    
    // Count type
    if (targetUnit === UNIT_TYPE.COUNT) {
        return Math.round(qty);
    }
    
    // Mass type (base: g)
    if (targetUnit === UNIT_TYPE.MASS) {
        if (unitLower === "g" || unitLower === "") return qty;
        if (unitLower === "kg") return qty * 1000;
        
        // Handle count-based packs for mass products (e.g., "6 apples" → grams)
        if (unitLower === "count") {
            if (keyLower.includes('banana')) {
                const weight = getMeasurementValue('each_banana');
                if (weight) return qty * weight;
            } else if (keyLower.includes('apple')) {
                const weight = getMeasurementValue('each_apple');
                if (weight) return qty * weight;
            } else if (keyLower.includes('orange')) {
                const weight = getMeasurementValue('each_orange');
                if (weight) return qty * weight;
            } else if (keyLower.includes('potato')) {
                const weight = getMeasurementValue('each_potato');
                if (weight) return qty * weight;
            } else if (keyLower.includes('tomato')) {
                const weight = getMeasurementValue('each_tomato');
                if (weight) return qty * weight;
            } else if (keyLower.includes('onion')) {
                const weight = getMeasurementValue('each_onion');
                if (weight) return qty * weight;
            } else if (keyLower.includes('garlic')) {
                const weight = getMeasurementValue('each_garlic');
                if (weight) return qty * weight;
            } else if (keyLower.includes('cucumber')) {
                const weight = getMeasurementValue('each_cucumber');
                if (weight) return qty * weight;
            }
        }
        
        // Volume to mass conversion (if density known)
        if (unitLower === "ml" && product.densityKey) {
            const density = DENSITY[product.densityKey] || 1.0;
            return qty * density; // ml * (g/ml) = g
        }
        if (unitLower === "l" && product.densityKey) {
            const density = DENSITY[product.densityKey] || 1.0;
            return qty * 1000 * density; // L * 1000 * (g/ml) = g
        }
    }
    
    // Volume type (base: ml)
    if (targetUnit === UNIT_TYPE.VOLUME) {
        if (unitLower === "ml" || unitLower === "") return qty;
        if (unitLower === "l") return qty * 1000;
        
        // Mass to volume conversion (if density known)
        if (unitLower === "g" && product.densityKey) {
            const density = DENSITY[product.densityKey] || 1.0;
            return qty / density; // g / (g/ml) = ml
        }
        if (unitLower === "kg" && product.densityKey) {
            const density = DENSITY[product.densityKey] || 1.0;
            return (qty * 1000) / density; // kg * 1000 / (g/ml) = ml
        }
    }
    
    return qty;
}

// Helper function: Format quantity nicely for display
function prettyQty(canonicalKey, qtyBase) {
    const product = CANONICAL_PRODUCTS[canonicalKey];
    if (!product) return String(qtyBase);
    
    // Try to use cooking measurements for better readability
    const keyLower = canonicalKey.toLowerCase();
    
    // Check for slices (bread)
    if (keyLower.includes('bread') && DEFAULT_MEASUREMENTS.slice_bread) {
        const sliceWeight = getMeasurementValue('slice_bread');
        if (sliceWeight) {
            const numSlices = Math.round(qtyBase / sliceWeight);
            if (Math.abs(qtyBase - (numSlices * sliceWeight)) < 5) {
                return `${numSlices} ${numSlices === 1 ? 'slice' : 'slices'}`;
            }
        }
    }
    
    // Check for whole items (each)
    const eachMappings = {
        banana: 'each_banana',
        apple: 'each_apple',
        orange: 'each_orange',
        potato: 'each_potato',
        tomato: 'each_tomato',
        onion: 'each_onion'
    };
    
    for (const [productKey, measureKey] of Object.entries(eachMappings)) {
        if (keyLower.includes(productKey) && DEFAULT_MEASUREMENTS[measureKey]) {
            const eachWeight = getMeasurementValue(measureKey);
            if (eachWeight) {
                const numEach = Math.round(qtyBase / eachWeight);
                if (Math.abs(qtyBase - (numEach * eachWeight)) < 10) {
                    return `${numEach} ${numEach === 1 ? productKey : productKey + 's'}`;
                }
            }
        }
    }
    
    // Original logic for standard units
    if (product.unitType === UNIT_TYPE.COUNT) {
        const count = Math.round(qtyBase);
        return `${count} ${count === 1 ? 'piece' : 'pieces'}`;
    }
    
    if (product.unitType === UNIT_TYPE.VOLUME) {
        if (qtyBase >= 1000) {
            const liters = qtyBase / 1000;
            return `${liters.toFixed(2).replace(/\.?0+$/, '')} L`;
        }
        return `${Math.round(qtyBase)} ml`;
    }
    
    // MASS
    if (qtyBase >= 1000) {
        const kg = qtyBase / 1000;
        return `${kg.toFixed(3).replace(/\.?0+$/, '')} kg`;
    }
    return `${Math.round(qtyBase)} g`;
}

// Helper function: Parse user input quantity
function parseQtyInput(input, canonicalKey) {
    const s = (input || "").trim().toLowerCase();
    if (!s) throw new Error("Enter a quantity like 130ml, 0.13L, 200g, 2");
    
    const match = s.match(/^([0-9]*\.?[0-9]+)\s*([a-z]*)$/);
    if (!match) throw new Error("Bad format. Try: 130ml, 0.13L, 200g, 2");
    
    const val = parseFloat(match[1]);
    const unit = (match[2] || "").toLowerCase();
    
    const qtyBase = convertToBase(val, unit, canonicalKey);
    const product = CANONICAL_PRODUCTS[canonicalKey];
    
    return {
        qtyBase,
        unitType: product.unitType
    };
}

// Get all canonical keys
function getAllCanonicalKeys() {
    return Object.keys(CANONICAL_PRODUCTS);
}

// Get product by canonical key
function getProduct(canonicalKey) {
    return CANONICAL_PRODUCTS[canonicalKey] || null;
}

// Get all SKUs for a shop
function getShopSKUs(shop) {
    const skus = [];
    
    Object.keys(CANONICAL_PRODUCTS).forEach(key => {
        const product = CANONICAL_PRODUCTS[key];
        if (product.shops && product.shops[shop]) {
            product.shops[shop].forEach(sku => {
                skus.push({
                    canonicalKey: key,
                    ...sku
                });
            });
        }
    });
    
    return skus;
}

console.log('✅ Product Catalog System loaded - V2.1.0');
