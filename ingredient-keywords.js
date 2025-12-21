// ================================================
// INGREDIENT KEYWORD MAPPINGS
// Used to infer shopping items when recipes lack quickAddItems
// ================================================

const ingredientKeywordMap = [
    {
        keywords: ['bread', 'toast'],
        entries: {
            Tesco: { category: '🍞 Bread & Bakery', itemName: 'White Toastie Bread Thick Sliced', unit: 'loaf of 800g', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['avocado'],
        entries: {
            Tesco: { category: '🥬 Vegetables', itemName: 'Avocado (Ripe & Ready)', unit: 'each', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['tomato'],
        entries: {
            Tesco: { category: '🥬 Vegetables', itemName: 'Tomatoes', unit: 'kg', qtyNeeded: 0.2 }
        }
    },
    {
        keywords: ['lemon'],
        entries: {
            Tesco: { category: '🥬 Vegetables', itemName: 'Lemons', unit: 'each', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['salt'],
        entries: {
            Tesco: { category: '🚀 Pantry & Staples', itemName: 'BRITISH COOKING SALT', unit: '1.5kg', qtyNeeded: 0.1 }
        }
    },
    {
        keywords: ['pepper'],
        entries: {
            Tesco: { category: '🚀 Pantry & Staples', itemName: 'Ground Black Pepper', unit: '50g', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['chili', 'chilli'],
        entries: {
            Tesco: { category: '🚀 Pantry & Staples', itemName: 'Chilli Flakes', unit: '40g', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['butter'],
        entries: {
            Tesco: { category: '🥛 Dairy & Eggs', itemName: 'BUTTERPAK', unit: '500g', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['egg'],
        entries: {
            Tesco: { category: '🥛 Dairy & Eggs', itemName: 'British Barn Eggs', unit: 'pack of 10', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['milk'],
        entries: {
            Tesco: { category: '🥛 Dairy & Eggs', itemName: 'Milk (Semi-Skimmed)', unit: '2.272L', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['buckwheat'],
        entries: {
            Tesco: { category: '🚀 Pantry & Staples', itemName: 'Buckwheat Groats', unit: '1kg', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['flour'],
        entries: {
            Tesco: { category: '🚀 Pantry & Staples', itemName: 'Flour (Plain)', unit: '1kg', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['sugar'],
        entries: {
            Tesco: { category: '🚀 Pantry & Staples', itemName: 'Sugar (White)', unit: '1kg', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['rice'],
        entries: {
            Tesco: { category: '🚀 Pantry & Staples', itemName: 'Long Grain Rice', unit: '1kg', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['chicken'],
        entries: {
            Tesco: { category: '🍖 Meat & Fish', itemName: 'Chicken Breast', unit: 'kg', qtyNeeded: 0.5 }
        }
    },
    {
        keywords: ['onion'],
        entries: {
            Tesco: { category: '🥬 Vegetables', itemName: 'BRITISH BROWN ONIONS', unit: 'kg', qtyNeeded: 0.2 }
        }
    },
    {
        keywords: ['garlic'],
        entries: {
            Tesco: { category: '🥬 Vegetables', itemName: 'Garlic', unit: 'each', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['pasta'],
        entries: {
            Tesco: { category: '🚀 Pantry & Staples', itemName: 'Pasta (Penne)', unit: '500g', qtyNeeded: 1 }
        }
    },
    {
        keywords: ['oats', 'oatmeal'],
        entries: {
            Tesco: { category: '🚀 Pantry & Staples', itemName: 'Porridge Oats', unit: '1kg', qtyNeeded: 1 }
        }
    }
];

function findIngredientKeywordMatch(ingredientText, preferredShop) {
    const normalized = (ingredientText || '').toLowerCase();
    if (!normalized) return null;
    
    for (const entry of ingredientKeywordMap) {
        const hit = entry.keywords.some(k => normalized.includes(k));
        if (!hit) continue;
        
        // Try preferred shop first, then Tesco fallback
        const preferred = entry.entries?.[preferredShop];
        if (preferred) {
            return { shop: preferredShop, ...preferred };
        }
        const tesco = entry.entries?.Tesco;
        if (tesco) {
            return { shop: 'Tesco', ...tesco };
        }
    }
    return null;
}

console.log('✅ Ingredient keyword map loaded');
