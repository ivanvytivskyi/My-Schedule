// ================================================
// RECIPE UTILITIES
// - Recipe ID extraction and Quick Add mapping
// - Recipe prompt generation for AI
// ================================================

// ===================================
// RECIPE IMPORT PARSER & QUICK ADD MAPPER
// ===================================

function extractRecipeIDs(responseText) {
    if (!responseText) return [];
    const matches = responseText.match(/\b(CR\d+|R[A-Z]*\d+)\b/g) || [];
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
    // Recipes are no longer connected to Quick Add
    return [];
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

// ===================================
// RECIPE PROMPT GENERATOR HELPERS
// ===================================

function filterRecipesByDietary(recipes, filters = {}) {
    return recipes.filter((recipe) => {
        const tags = recipe.dietary || {};
        if (filters.vegan && !tags.vegan) return false;
        if (filters.vegetarian && !(tags.vegetarian || tags.vegan)) return false;
        if (filters.nutFree && tags.nuts) return false;
        if (filters.dairyFree && tags.dairy) return false;
        if (filters.glutenFree && tags.gluten) return false;
        return true;
    });
}

function filterRecipesByShop(recipes, shop) {
    // Recipes are no longer connected to shops via Quick Add
    return recipes;
}

function formatDietaryIcons(recipe) {
    if (!recipe.dietary) return '';
    const icons = [];
    if (recipe.dietary.vegetarian) icons.push('🥬');
    if (recipe.dietary.vegan) icons.push('🌱');
    if (recipe.dietary.nuts) icons.push('🥜');
    if (recipe.dietary.dairy) icons.push('🥛');
    if (recipe.dietary.gluten) icons.push('🌾');
    return icons.join('');
}

function formatRecipeLine(recipe) {
    const icons = formatDietaryIcons(recipe);

    return `${recipe.id}: ${recipe.name}${icons ? ` ${icons}` : ''}`;
}

function formatRecipeDatabase(recipes, batchDuration) {
    const breakfast = recipes
        .filter((r) => r.category === 'breakfast')
        .sort((a, b) => a.id.localeCompare(b.id));
    const batch = recipes
        .filter((r) => r.category === 'batch')
        .sort((a, b) => a.id.localeCompare(b.id));
    const main = recipes
        .filter((r) => r.category === 'main')
        .sort((a, b) => a.id.localeCompare(b.id));
    const drink = recipes
        .filter((r) => r.category === 'drink')
        .sort((a, b) => a.id.localeCompare(b.id));
    const snacks = recipes
        .filter((r) => r.category === 'snacks')
        .sort((a, b) => a.id.localeCompare(b.id));
    const rewards = recipes
        .filter((r) => r.category === 'rewards')
        .sort((a, b) => a.id.localeCompare(b.id));
    
    const lines = [];
    lines.push('=== RECIPE DATABASE ===');
    lines.push(
        'Use the recipe IDs shown here when adding meals in the schedule and in the final comma-separated list.\n' +
        'R1+ are default recipes, CR1+ are custom recipes. Choose whichever best fits available ingredients.'
    ); 
    
    lines.push('BREAKFAST OPTIONS (pick variety, serves 1):');
    lines.push(breakfast.length ? breakfast.map(formatRecipeLine).join('\n') : 'None available for current filters');
    lines.push('');
    
    lines.push(`BATCH COOK OPTIONS (serves 4-8, lasts ${batchDuration} day${batchDuration === '1' ? '' : 's'}):`);
    lines.push(batch.length ? batch.map(formatRecipeLine).join('\n') : 'None available for current filters');
    lines.push('');
    
    lines.push('MAIN MEALS (quick individual meals, serves 1-2):');
    lines.push(main.length ? main.map(formatRecipeLine).join('\n') : 'None available for current filters');
    lines.push('');
    
    lines.push('DRINKS (serves 1):');
    lines.push(drink.length ? drink.map(formatRecipeLine).join('\n') : 'None available for current filters');
    lines.push('');
    
    lines.push('SNACKS (serves 1):');
    lines.push(snacks.length ? snacks.map(formatRecipeLine).join('\n') : 'None available for current filters');
    lines.push('');
    
    lines.push('REWARDS (treats, serves 1):');
    lines.push(rewards.length ? rewards.map(formatRecipeLine).join('\n') : 'None available for current filters');
    lines.push('');
    
    lines.push('Allergy & diet key: 🥬=Vegetarian 🌱=Vegan 🥜=Contains nuts 🥛=Contains dairy 🌾=Contains gluten');
    
    return lines.join('\n');
}

function describeDietaryFilters(filters) {
    const active = [];
    if (filters.vegan) active.push('vegan');
    else if (filters.vegetarian) active.push('vegetarian');
    if (filters.nutFree) active.push('nut-free');
    if (filters.dairyFree) active.push('dairy-free');
    if (filters.glutenFree) active.push('gluten-free');
    return active.length ? active.join(', ') : 'None';
}

function buildRecipeSelectionRules({ batchDuration, filters }) {
    const rules = [];
    rules.push('=== RECIPE SELECTION RULES ===');
    rules.push(`Batch cook lasts: ${batchDuration} day${batchDuration === '1' ? '' : 's'}`);
    rules.push(`Dietary: ${describeDietaryFilters(filters)}`);
    rules.push('');
    rules.push('✅ DO:');
    rules.push('- Pick VARIETY of breakfasts (mix different recipes)');
    rules.push('- Use batch cook for lunch/dinner (reheats well)');
    rules.push('- Use main meals for quick lunches/dinners');
    rules.push('- Add snacks between meals if needed');
    rules.push('- Include drinks with meals or as refreshments');
    rules.push('- Save rewards for special occasions or weekend treats');
    rules.push('- Respect dietary restrictions');
    rules.push('- Consider pantry items to reduce cost');
    rules.push('');
    rules.push('❌ DON\'T:');
    rules.push('- Use the same breakfast every day');
    rules.push('- Suggest recipes user can\'t eat');
    rules.push('- Ignore dietary restrictions');
    rules.push('- Overuse rewards (save for treats)');
    return rules.join('\n');
}

function buildRecipePromptSection({ shop, batchDuration = '1', filters = {} }) {
    const allRecipes = typeof getAllRecipes === 'function' ? Object.values(getAllRecipes()) : [];
    const filtered = filterRecipesByShop(filterRecipesByDietary(allRecipes, filters), shop);
    
    const databaseSection = formatRecipeDatabase(filtered, batchDuration);
    const rulesSection = buildRecipeSelectionRules({ batchDuration, filters });
    
    return `${databaseSection}\n\n${rulesSection}`;
}

// ===================================
// RECIPE ROTATION & SMART FILTERING SYSTEM
// Version 2.0 - With Pre-Fill Integration
// ===================================

// Initialize usage history
function initRecipeUsageHistory() {
    const history = localStorage.getItem('recipeUsageHistory');
    if (!history) {
        localStorage.setItem('recipeUsageHistory', JSON.stringify({}));
        console.log('✅ Recipe usage history initialized');
    }
}

// Initialize generation count
function initGenerationCount() {
    const count = localStorage.getItem('aiGenerationCount');
    if (!count) {
        localStorage.setItem('aiGenerationCount', JSON.stringify({
            count: 0,
            firstGenerated: null,
            lastGenerated: null
        }));
        console.log('✅ AI generation count initialized');
    }
}

// Initialize schedule history
function initScheduleHistory() {
    const history = localStorage.getItem('scheduleHistory_v2');
    if (!history) {
        localStorage.setItem('scheduleHistory_v2', JSON.stringify([]));
        console.log('✅ Schedule history initialized');
    }
}

// Cleanup old data on page load
function cleanupOldData() {
    // Cleanup recipe history (30 days)
    const recipeHistory = JSON.parse(localStorage.getItem('recipeUsageHistory')) || {};
    const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    let cleaned = 0;
    
    Object.keys(recipeHistory).forEach(recipeId => {
        const lastUsed = recipeHistory[recipeId].lastUsed;
        if (lastUsed && new Date(lastUsed) < thirtyDaysAgo) {
            delete recipeHistory[recipeId];
            cleaned++;
        }
    });
    
    if (cleaned > 0) {
        localStorage.setItem('recipeUsageHistory', JSON.stringify(recipeHistory));
        console.log(`🧹 Cleaned ${cleaned} old recipe entries`);
    }
    
    // Cleanup schedule history (14 days)
    const scheduleHistory = JSON.parse(localStorage.getItem('scheduleHistory_v2')) || [];
    const fourteenDaysAgo = new Date(Date.now() - (14 * 24 * 60 * 60 * 1000));
    const filteredSchedules = scheduleHistory.filter(entry => {
        return new Date(entry.generatedAt) >= fourteenDaysAgo;
    });
    
    if (filteredSchedules.length !== scheduleHistory.length) {
        localStorage.setItem('scheduleHistory_v2', JSON.stringify(filteredSchedules));
        console.log(`🧹 Cleaned ${scheduleHistory.length - filteredSchedules.length} old schedules`);
    }
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    initRecipeUsageHistory();
    initGenerationCount();
    initScheduleHistory();
    cleanupOldData();
});

// ===================================
// RECIPE FILTERING ALGORITHMS
// ===================================

/**
 * Determine if user is first-time (no Kitchen Stock)
 * First-time users get random balanced selection
 * Returning users get smart filtered selection
 */
function isFirstTimeUser() {
    const kitchenStock = JSON.parse(localStorage.getItem('kitchenStock_v2')) || {};
    const stockKeys = Object.keys(kitchenStock);
    
    // First time if Kitchen Stock is empty
    const isFirstTime = stockKeys.length === 0;
    
    console.log(`User type: ${isFirstTime ? 'FIRST-TIME' : 'RETURNING'} (${stockKeys.length} items in stock)`);
    
    return isFirstTime;
}

/**
 * Calculate what % of recipe ingredients user has in stock
 * Returns: 0.0 to 1.0 (0% to 100%)
 * Skips unlimited items (always available)
 */
function calculateIngredientMatch(recipe) {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
        return 1.0; // 100% - no ingredients needed
    }
    
    let totalIngredients = 0;
    let availableIngredients = 0;
    
    recipe.ingredients.forEach(ing => {
        const key = ing.canonicalKey;
        const product = CANONICAL_PRODUCTS[key];
        
        // Skip unlimited items (like tap water - always available)
        if (product && product.unlimited) {
            totalIngredients++;
            availableIngredients++;
            return;
        }
        
        totalIngredients++;
        
        const neededQty = convertToBase(ing.qty, ing.unit, key);
        const haveQty = getKitchenStockQty(key);
        
        if (haveQty >= neededQty) {
            availableIngredients++;
        }
    });
    
    const matchPercentage = totalIngredients > 0 ? (availableIngredients / totalIngredients) : 0;
    
    return matchPercentage;
}

function getMissingIngredients(recipe, limit = 3) {
    if (!recipe.ingredients || recipe.ingredients.length === 0) return [];
    
    const missing = [];
    const seen = new Set();
    
    recipe.ingredients.forEach(ing => {
        const key = ing.canonicalKey;
        const product = CANONICAL_PRODUCTS[key];
        
        if (product?.unlimited) return;
        
        const neededQty = convertToBase(ing.qty, ing.unit, key);
        const haveQty = getKitchenStockQty(key);
        
        if (haveQty < neededQty) {
            const name = product ? product.name : key;
            if (!seen.has(name)) {
                missing.push(name);
                seen.add(name);
            }
        }
    });
    
    return typeof limit === 'number' ? missing.slice(0, limit) : missing;
}

function describeRecipeAvailability(recipe) {
    const match = calculateIngredientMatch(recipe);
    const missingList = getMissingIngredients(recipe, 4);
    return {
        match,
        missingList,
        isReady: match >= 0.999
    };
}

function formatRecipeWithAvailability(recipe, availability) {
    const matchPercent = Math.round((availability?.match || 0) * 100);
    const baseLine = formatRecipeLine(recipe);
    if (availability?.isReady) {
        return `${baseLine} — 100% ingredients ready now`;
    }
    
    const missingNote = availability?.missingList?.length ?
        `missing: ${availability.missingList.join(', ')}` :
        'missing items (not in stock yet)';
    
    return `${baseLine} — ${matchPercent}% ingredients (${missingNote})`;
}

/**
 * Remove recipes used in last 30 days
 * Forces variety over time
 */
function filterByUsageHistory(recipes) {
    const history = JSON.parse(localStorage.getItem('recipeUsageHistory')) || {};
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const filtered = recipes.filter(recipe => {
        const usage = history[recipe.id];
        
        // Never used → include
        if (!usage || !usage.lastUsed) {
            return true;
        }
        
        const lastUsedDate = new Date(usage.lastUsed);
        
        // Used more than 30 days ago → include
        return lastUsedDate < thirtyDaysAgo;
    });
    
    const excluded = recipes.length - filtered.length;
    console.log(`📊 Usage filter: ${filtered.length} available, ${excluded} used recently`);
    
    return filtered;
}

/**
 * Randomly select N items from array
 * Used by both smart and balanced selection
 */
function randomSelect(array, count) {
    if (!array || array.length === 0) return [];
    if (count >= array.length) return [...array];
    
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Smart selection for users with Kitchen Stock
 * Ensures category balance while prioritizing ingredient matches
 */
function smartRecipeSelection(allRecipes, targetCount = 15) {
    // First filter by 30-day usage
    const filtered30Day = filterByUsageHistory(allRecipes);
    
    if (filtered30Day.length === 0) {
        console.warn('⚠️ All recipes used recently! Falling back to full list.');
        return randomBalancedSelection(allRecipes, targetCount);
    }
    
    // Group by category
    const byCategory = {
        breakfast: filtered30Day.filter(r => r.category === 'breakfast'),
        batch: filtered30Day.filter(r => r.category === 'batch'),
        main: filtered30Day.filter(r => r.category === 'main'),
        drink: filtered30Day.filter(r => r.category === 'drink'),
        snacks: filtered30Day.filter(r => r.category === 'snacks'),
        rewards: filtered30Day.filter(r => r.category === 'rewards')
    };
    
    // GUARANTEED minimums per category (total: 15)
    const minimums = {
        breakfast: 5,   // 5 breakfasts minimum
        batch: 2,       // 2 batch cooks
        main: 3,        // 3 main meals
        snacks: 2,      // 2 snacks (GUARANTEED!)
        drink: 2,       // 2 drinks
        rewards: 1      // 1 reward (GUARANTEED!)
    };
    
    const selected = [];
    
    // Step 1: Select guaranteed minimums, prioritizing ingredient matches
    Object.keys(minimums).forEach(category => {
        const count = minimums[category];
        const available = byCategory[category];
        
        if (available.length === 0) {
            console.warn(`⚠️ No ${category} recipes available after 30-day filter`);
            // Fallback to all recipes in this category
            const fallback = allRecipes.filter(r => r.category === category);
            if (fallback.length > 0) {
                selected.push(...selectBestMatchRecipes(fallback, count));
            }
            return;
        }
        
        // Sort by ingredient match and select best
        selected.push(...selectBestMatchRecipes(available, count));
    });
    
    console.log(`✅ Smart selection with guaranteed categories: ${selected.length} recipes`);
    
    return selected;
}

/**
 * Select recipes with best ingredient match
 */
function selectBestMatchRecipes(recipes, count) {
    if (recipes.length === 0) return [];
    if (count >= recipes.length) return [...recipes];
    
    // Calculate match for each recipe
    const recipesWithMatch = recipes.map(recipe => ({
        recipe: recipe,
        match: calculateIngredientMatch(recipe)
    }));
    
    // Sort by match (highest first)
    recipesWithMatch.sort((a, b) => b.match - a.match);
    
    // Take top N
    return recipesWithMatch.slice(0, count).map(item => item.recipe);
}

/**
 * Balanced random selection for users with no Kitchen Stock
 * Ensures variety across all meal types
 */
function randomBalancedSelection(allRecipes, targetCount = 18) {
    // Group by category
    const byCategory = {
        breakfast: allRecipes.filter(r => r.category === 'breakfast'),
        batch: allRecipes.filter(r => r.category === 'batch'),
        main: allRecipes.filter(r => r.category === 'main'),
        drink: allRecipes.filter(r => r.category === 'drink'),
        snacks: allRecipes.filter(r => r.category === 'snacks'),
        rewards: allRecipes.filter(r => r.category === 'rewards')
    };
    
    // Dynamic distribution based on target count
    // Priority: Breakfast (7 min) + Lunch/Dinner (majority) + Small extras
    
    const breakfastCount = Math.max(7, Math.min(12, Math.round(targetCount * 0.35)));
    
    // Lunch/Dinner gets the majority of remaining recipes
    // Reserve only 2-3 slots for extras (snacks/drinks/rewards)
    const extrasCount = Math.min(3, Math.max(2, Math.floor(targetCount * 0.15)));
    const lunchDinnerCount = Math.max(targetCount - breakfastCount - extrasCount, 
                                       Math.round(targetCount * 0.6));
    
    // Split lunch/dinner between batch (30%) and main (70%)
    const batchCount = Math.max(2, Math.min(4, Math.round(lunchDinnerCount * 0.3)));
    const mainCount = lunchDinnerCount - batchCount;
    
    const distribution = {
        breakfast: breakfastCount,
        batch: batchCount,
        main: mainCount,
        snacks: Math.max(1, Math.floor(extrasCount * 0.4)),
        drink: Math.max(0, Math.floor(extrasCount * 0.3)),
        rewards: Math.max(0, Math.floor(extrasCount * 0.3))
    };
    
    console.log(`📊 Dynamic distribution for ${targetCount} recipes:`, distribution);
    console.log(`   → Lunch/Dinner total: ${lunchDinnerCount} (batch: ${batchCount}, main: ${mainCount})`);
    
    const selected = [];
    
    Object.keys(distribution).forEach(category => {
        const count = distribution[category];
        const available = byCategory[category];
        
        if (count === 0) return;
        
        if (available.length === 0) {
            console.warn(`⚠️ No ${category} recipes available`);
            return;
        }
        
        selected.push(...randomSelect(available, count));
    });
    
    console.log(`✅ Balanced selection: ${selected.length} recipes (target: ${targetCount})`);
    
    return selected;
}

/**
 * Main entry point for recipe selection
 * Decides between smart vs balanced selection
 */
function selectRecipesForWeek(dietaryFilters = {}, requiredRecipes = null) {
    // Get all recipes
    const allRecipes = Object.values(getAllRecipes());
    
    // Apply dietary filters first
    const dietaryFiltered = filterRecipesByDietary(allRecipes, dietaryFilters);
    
    console.log(`📊 Starting with ${dietaryFiltered.length} recipes after dietary filters`);
    
    // Check user type
    const isFirstTime = isFirstTimeUser();
    
    // Calculate target count
    let targetCount;
    if (requiredRecipes) {
        // Use calculated value from smart leftover system
        targetCount = requiredRecipes;
        console.log(`📊 Using calculated recipe count: ${targetCount} (based on surviving meals)`);
    } else if (isFirstTime) {
        targetCount = 18; // Default for first-time users
    } else {
        targetCount = 15; // Default for returning users
    }
    
    // Select recipes based on user type
    let selectedRecipes;
    
    if (isFirstTime) {
        selectedRecipes = randomBalancedSelection(dietaryFiltered, targetCount);
    } else {
        selectedRecipes = smartRecipeSelection(dietaryFiltered, targetCount);
    }
    
    return selectedRecipes;
}

// ===================================
// PRE-FILL SYSTEM (Work & Defaults)
// ===================================

/**
 * Extract work days and hours from user input
 * Input examples:
 *   "Monday-Friday 9am-5pm"
 *   "Mon/Wed/Fri 10am-6pm"
 *   "Tuesday, Thursday 8am-4pm"
 */
function parseWorkSchedule(workScheduleText) {
    if (!workScheduleText || workScheduleText.trim() === '') {
        return { workDays: [], workHours: null };
    }
    
    const text = workScheduleText.toLowerCase();
    
    // Extract days
    const workDays = [];
    const dayMap = {
        'monday': 'Monday',
        'tuesday': 'Tuesday',
        'wednesday': 'Wednesday',
        'thursday': 'Thursday',
        'friday': 'Friday',
        'saturday': 'Saturday',
        'sunday': 'Sunday',
        'mon': 'Monday',
        'tue': 'Tuesday',
        'wed': 'Wednesday',
        'thu': 'Thursday',
        'fri': 'Friday',
        'sat': 'Saturday',
        'sun': 'Sunday'
    };
    
    // Check for day ranges (Monday-Friday)
    if (text.includes('monday-friday') || text.includes('mon-fri')) {
        workDays.push('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday');
    } else {
        // Check for individual days
        Object.keys(dayMap).forEach(key => {
            if (text.includes(key)) {
                const day = dayMap[key];
                if (!workDays.includes(day)) {
                    workDays.push(day);
                }
            }
        });
    }
    
    // Extract hours (e.g., "9am-5pm" or "09:00-17:00")
    const timePattern = /(\d{1,2})(?::(\d{2}))?([ap]m)?\s*-\s*(\d{1,2})(?::(\d{2}))?([ap]m)?/i;
    const match = text.match(timePattern);
    
    let workHours = null;
    
    if (match) {
        let startHour = parseInt(match[1]);
        const startMin = match[2] || '00';
        const startPeriod = match[3];
        
        let endHour = parseInt(match[4]);
        const endMin = match[5] || '00';
        const endPeriod = match[6];
        
        // Convert to 24-hour format
        if (startPeriod === 'pm' && startHour !== 12) startHour += 12;
        if (startPeriod === 'am' && startHour === 12) startHour = 0;
        if (endPeriod === 'pm' && endHour !== 12) endHour += 12;
        if (endPeriod === 'am' && endHour === 12) endHour = 0;
        
        workHours = {
            start: `${String(startHour).padStart(2, '0')}:${startMin}`,
            end: `${String(endHour).padStart(2, '0')}:${endMin}`
        };
    }
    
    return { workDays, workHours };
}

// Helper: Subtract minutes from time string
function subtractMinutes(timeStr, minutes) {
    const [hours, mins] = timeStr.split(':').map(Number);
    const totalMins = hours * 60 + mins - minutes;
    const newHours = Math.floor(totalMins / 60);
    const newMins = totalMins % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

// Helper: Add minutes to time string
function addMinutes(timeStr, minutes) {
    const [hours, mins] = timeStr.split(':').map(Number);
    const totalMins = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMins / 60);
    const newMins = totalMins % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

/**
 * Generate work and commute blocks for schedule
 */
function createWorkBlocks(formData) {
    const structuredTimes = Array.isArray(formData.workDayTimes) ? formData.workDayTimes : null;
    const commuteMinutes = formData.commuteMinutes || 0;
    const prepMinutes = formData.commutePrepMinutes || 0;
    
    // Prefer structured per-day times directly from the form
    if (structuredTimes && formData.weekDate) {
        const startDate = new Date(formData.weekDate);
        const blocks = {};
        
        for (let i = 0; i < structuredTimes.length; i++) {
            const entry = structuredTimes[i] || {};
            if (!entry.start || !entry.end) continue;
            
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + i);
            const dayName = getDayName(dayDate);
            if (!blocks[dayName]) blocks[dayName] = [];
            
            const leaveForWork = commuteMinutes > 0 ? subtractMinutes(entry.start, commuteMinutes) : entry.start;
            
            if (prepMinutes > 0) {
                const prepStart = subtractMinutes(leaveForWork, prepMinutes);
                blocks[dayName].push({
                    start: prepStart,
                    end: leaveForWork,
                    title: "🧳 Get ready for work",
                    tasks: ["Pack essentials", "Hygiene", "Check travel items"],
                    source: "work_form",
                    locked: true
                });
            }
            
            if (commuteMinutes > 0) {
                blocks[dayName].push({
                    start: leaveForWork,
                    end: entry.start,
                    title: "🚗 Commute",
                    tasks: ["Drive to work"],
                    source: "work_form",
                    locked: true
                });
            }
            
            blocks[dayName].push({
                start: entry.start,
                end: entry.end,
                title: "💼 Work",
                tasks: [],
                source: "work_form",
                locked: true
            });
            
            if (commuteMinutes > 0) {
                const commuteEnd = addMinutes(entry.end, commuteMinutes);
                blocks[dayName].push({
                    start: entry.end,
                    end: commuteEnd,
                    title: "🚗 Commute",
                    tasks: ["Drive home"],
                    source: "work_form",
                    locked: true
                });
            }
        }
        
        if (Object.keys(blocks).length > 0) {
            return blocks;
        }
    }
    
    // Fallback: parse free-text schedule (legacy)
    const { workDays, workHours } = parseWorkSchedule(formData.workSchedule);
    
    if (!workHours || workDays.length === 0) {
        return {}; // No work schedule
    }
    
    const blocks = {};
    
    workDays.forEach(day => {
        blocks[day] = [];
        
        const leaveForWork = commuteMinutes > 0 ? subtractMinutes(workHours.start, commuteMinutes) : workHours.start;
        
        if (prepMinutes > 0) {
            const prepStart = subtractMinutes(leaveForWork, prepMinutes);
            blocks[day].push({
                start: prepStart,
                end: leaveForWork,
                title: "🧳 Get ready for work",
                tasks: ["Pack essentials", "Hygiene", "Check travel items"],
                source: "work_form",
                locked: true
            });
        }
        
        if (commuteMinutes > 0) {
            const commuteStart = leaveForWork;
            blocks[day].push({
                start: commuteStart,
                end: workHours.start,
                title: "🚗 Commute",
                tasks: ["Drive to work"],
                source: "work_form",
                locked: true  // Can't be edited by AI
            });
        }
        
        blocks[day].push({
            start: workHours.start,
            end: workHours.end,
            title: "💼 Work",
            tasks: [],
            source: "work_form",
            locked: true
        });
        
        if (commuteMinutes > 0) {
            const commuteEnd = addMinutes(workHours.end, commuteMinutes);
            blocks[day].push({
                start: workHours.end,
                end: commuteEnd,
                title: "🚗 Commute",
                tasks: ["Drive home"],
                source: "work_form",
                locked: true
            });
        }
    });
    
    return blocks;
}

function getNonWorkDays(formData) {
    const structuredTimes = Array.isArray(formData.workDayTimes) ? formData.workDayTimes : [];
    if (!formData.weekDate || structuredTimes.length === 0) return [];
    const startDate = new Date(formData.weekDate);
    const nonWorkDays = [];
    for (let i = 0; i < structuredTimes.length; i++) {
        const entry = structuredTimes[i] || {};
        if (!entry.start || !entry.end) {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + i);
            nonWorkDays.push(getDayName(dayDate));
        }
    }
    return nonWorkDays;
}

/**
 * Get default blocks from "Manage Defaults" system
 * Returns blocks organized by day
 */
function loadDefaultBlocks() {
    const defaults = scheduleData.defaultBlocks || [];
    
    if (defaults.length === 0) {
        return {};
    }
    
    const blocksByDay = {};
    
    defaults.forEach(defaultBlock => {
        // Only include enabled blocks
        const isEnabled = defaultBlock.enabled !== false;
        if (!isEnabled) return;
        
        // Parse time (format: "09:00-17:00")
        const [start, end] = defaultBlock.time.split('-');
        
        // Get days this block applies to
        const days = defaultBlock.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        days.forEach(day => {
            if (!blocksByDay[day]) {
                blocksByDay[day] = [];
            }
            
            blocksByDay[day].push({
                start: start,
                end: end,
                title: defaultBlock.title,
                tasks: defaultBlock.tasks || [],
                source: "defaults",
                locked: true  // Can't be edited by AI
            });
        });
    });
    
    return blocksByDay;
}

function hasBreakfastDefault(defaultBlocks = []) {
    return defaultBlocks.some(block => {
        if (block.enabled === false) return false;
        return /breakfast/i.test(block.title || '');
    });
}

function buildDayStartOverridesFromDefaults(defaultBlocks) {
    const overrides = {};
    const toMinutes = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };
    defaultBlocks.forEach(block => {
        if (block.enabled === false) return;
        if (!block.dayStartOverride) return;
        const days = block.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        days.forEach(day => {
            if (!overrides[day]) {
                overrides[day] = block.dayStartOverride;
            } else {
                // keep earliest
                overrides[day] = toMinutes(block.dayStartOverride) < toMinutes(overrides[day]) ? block.dayStartOverride : overrides[day];
            }
        });
    });
    return overrides;
}

/**
 * Combine work blocks and default blocks
 * Sort by time within each day
 */
function mergePreFilledBlocks(workBlocks, defaultBlocks) {
    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const merged = {};
    
    allDays.forEach(day => {
        const dayBlocks = [
            ...(workBlocks[day] || []),
            ...(defaultBlocks[day] || [])
        ];
        
        // Sort by start time
        dayBlocks.sort((a, b) => {
            return a.start.localeCompare(b.start);
        });
        
        if (dayBlocks.length > 0) {
            merged[day] = dayBlocks;
        }
    });
    
    return merged;
}

/**
 * Find empty time slots between pre-filled blocks
 * - Uses configurable default day window and per-day start overrides
 * - Expands window to include earlier/later blocks on that specific day
 * - Handles overnight blocks by treating them as ending at dayEnd for the current day
 */
function calculateTimeGaps(preFilledBlocks, options = {}) {
    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const gaps = {};
    const defaultDayStart = options.dayWindowStart || "07:00";
    const defaultDayEnd = options.dayWindowEnd || "23:00";
    const dayStartOverrides = options.dayStartOverrides || {};
    
    const toMinutes = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };
    
    const toTime = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };
 
    allDays.forEach(day => {
        const rawBlocks = preFilledBlocks[day] || [];
        
        // Base window for this day (override > default)
        const baseStartMin = toMinutes(dayStartOverrides[day] || defaultDayStart);
        const baseEndMin = toMinutes(defaultDayEnd);
        const normalized = rawBlocks.map(block => {
            const startMin = toMinutes(block.start);
            let endMin = toMinutes(block.end);
            
            // Handle overnight blocks (end before start): treat as running until dayEnd for gap calc
            if (endMin < startMin) {
                endMin = baseEndMin;
            }
            
            // Clamp within day boundaries
            const clampedStart = Math.max(startMin, baseStartMin);
            const clampedEnd = Math.min(endMin, baseEndMin);
            
            return { start: clampedStart, end: clampedEnd };
        }).filter(b => b.end > b.start);
        
        // Sort by start time
        normalized.sort((a, b) => a.start - b.start);
        
        // Expand window to include any earlier/later blocks for this day
        let dayStartMin = baseStartMin;
        let dayEndMin = baseEndMin;
        normalized.forEach(block => {
            dayStartMin = Math.min(dayStartMin, block.start);
            dayEndMin = Math.max(dayEndMin, block.end);
        });
        
        const dayGaps = [];
        
        if (normalized.length === 0) {
            dayGaps.push({ start: toTime(dayStartMin), end: toTime(dayEndMin) });
        } else {
            // Gap before first block
            if (normalized[0].start > dayStartMin) {
                dayGaps.push({ start: toTime(dayStartMin), end: toTime(normalized[0].start) });
            }
            
            // Gaps between blocks
            for (let i = 0; i < normalized.length - 1; i++) {
                const currentEnd = normalized[i].end;
                const nextStart = normalized[i + 1].start;
                
                if (currentEnd < nextStart) {
                    dayGaps.push({ start: toTime(currentEnd), end: toTime(nextStart) });
                }
            }
            
            // Gap after last block
            const lastBlock = normalized[normalized.length - 1];
            if (lastBlock.end < dayEndMin) {
                dayGaps.push({ start: toTime(lastBlock.end), end: toTime(dayEndMin) });
            }
        }
        
        gaps[day] = dayGaps;
    });
    
    return gaps;
}

/**
 * Convert time gaps to compact string format for AI
 * Example: "Mon: 07:30-08:30, 17:30-18:00, 19:00-22:00"
 */
function formatTimeGapsForPrompt(timeGaps) {
    const lines = [];
    
    Object.keys(timeGaps).forEach(day => {
        const gaps = timeGaps[day];
        
        if (gaps.length === 0) return;
        
        const gapStrings = gaps.map(gap => `${gap.start}-${gap.end}`);
        const dayShort = day.substring(0, 3); // Mon, Tue, etc.
        
        lines.push(`${dayShort}: ${gapStrings.join(', ')}`);
    });
    
    return lines.join('\n');
}

/**
 * Build list of activities already scheduled (to tell AI not to duplicate)
 * Automatically extracts from pre-filled blocks
 */
function getExcludedActivities(preFilledBlocks) {
    const excluded = new Set();
    
    Object.values(preFilledBlocks).forEach(dayBlocks => {
        dayBlocks.forEach(block => {
            // Extract activity name (remove emoji)
            const activityName = block.title.replace(/[^\w\s]/g, '').trim();
            if (activityName) {
                excluded.add(activityName);
            }
        });
    });
    
    return Array.from(excluded);
}

/**
 * Complete pre-fill process
 * Returns: { preFilledBlocks, timeGaps, excludedActivities }
 */
function generatePreFilledData(formData) {
    console.log('🔧 Generating pre-filled data...');
    
    // Step 1: Create work blocks
    const workBlocks = createWorkBlocks(formData);
    console.log(`Work blocks: ${Object.keys(workBlocks).length} days`);
    const nonWorkDays = getNonWorkDays(formData);
    
    // Step 2: Load default blocks
    const defaultBlocks = loadDefaultBlocks();
    console.log(`Default blocks: ${Object.keys(defaultBlocks).length} days`);
    const dayStartOverrides = buildDayStartOverridesFromDefaults(scheduleData.defaultBlocks || []);
    const breakfastDefaultExists = hasBreakfastDefault(scheduleData.defaultBlocks || []);
    
    // Step 3: Merge work + defaults
    const preFilledBlocks = mergePreFilledBlocks(workBlocks, defaultBlocks);
    console.log(`Total pre-filled: ${Object.keys(preFilledBlocks).length} days`);
    
    // Step 4: Calculate time gaps
    const dayWindowStart = (scheduleData.dayWindow && scheduleData.dayWindow.start) ? scheduleData.dayWindow.start : "07:00";
    const dayWindowEnd = (scheduleData.dayWindow && scheduleData.dayWindow.end) ? scheduleData.dayWindow.end : "23:00";
    const timeGaps = calculateTimeGaps(preFilledBlocks, {
        dayWindowStart,
        dayWindowEnd,
        dayStartOverrides
    });
    console.log(`Time gaps calculated for all 7 days`);
    
    // Step 5: Get excluded activities
    const excludedActivities = getExcludedActivities(preFilledBlocks);
    console.log(`Excluded activities: ${excludedActivities.join(', ')}`);
    
    return {
        preFilledBlocks,
        timeGaps,
        excludedActivities,
        nonWorkDays,
        hasBreakfastDefault: breakfastDefaultExists
    };
}

/**
 * Build recipe section with ONLY selected recipes
 * Much smaller than showing all 58 recipes
 */
function buildReducedRecipePrompt(selectedRecipes, batchDuration) {
    const availabilityById = {};
    const readyNow = [];
    const needsShopping = [];
    
    selectedRecipes.forEach(recipe => {
        const availability = describeRecipeAvailability(recipe);
        availabilityById[recipe.id] = availability;
        if (availability.isReady) {
            readyNow.push({ recipe, availability });
        } else {
            needsShopping.push({ recipe, availability });
        }
    });
    
    // Group by category
    const byCategory = {
        breakfast: selectedRecipes.filter(r => r.category === 'breakfast'),
        batch: selectedRecipes.filter(r => r.category === 'batch'),
        main: selectedRecipes.filter(r => r.category === 'main'),
        drink: selectedRecipes.filter(r => r.category === 'drink'),
        snacks: selectedRecipes.filter(r => r.category === 'snacks'),
        rewards: selectedRecipes.filter(r => r.category === 'rewards')
    };
    
    const lines = [];
    lines.push('=== AVAILABLE RECIPES FOR THIS WEEK ===');
    lines.push('These recipes have been pre-selected based on your Kitchen Stock and usage history.');
    lines.push('Use the recipe IDs when adding meals in the schedule and in the final comma-separated list.');
    lines.push('');
    lines.push('Priority rules:');
    lines.push('1) Use READY TO COOK recipes first (100% ingredients available).');
    lines.push('2) Schedule shopping before any recipe listed under "RECIPES NEEDING SHOPPING".');
    lines.push('3) After shopping, you can cook the previously missing-ingredient recipes.');
    lines.push('');
    
    lines.push('READY TO COOK NOW (100% ingredients available):');
    lines.push(readyNow.length ? readyNow.map(item => formatRecipeWithAvailability(item.recipe, item.availability)).join('\n') : 'None at 100% right now — plan a quick shopping trip early in the week.');
    lines.push('');
    
    lines.push('RECIPES NEEDING SHOPPING (missing ingredients):');
    lines.push(needsShopping.length ? needsShopping.map(item => formatRecipeWithAvailability(item.recipe, item.availability)).join('\n') : 'All selected recipes are ready to cook with current stock.');
    lines.push('');
    
    // Breakfast
    if (byCategory.breakfast.length > 0) {
        lines.push('BREAKFAST OPTIONS (serves 1):');
        byCategory.breakfast.forEach(r => lines.push(formatRecipeWithAvailability(r, availabilityById[r.id])));
        lines.push('');
    }
    
    // Batch Cook
    if (byCategory.batch.length > 0) {
        lines.push(`BATCH COOK OPTIONS (serves 4-8, lasts ${batchDuration} day${batchDuration === '1' ? '' : 's'}):`);
        byCategory.batch.forEach(r => lines.push(formatRecipeWithAvailability(r, availabilityById[r.id])));
        lines.push('');
    }
    
    // Main Meals
    if (byCategory.main.length > 0) {
        lines.push('MAIN MEALS (quick individual meals, serves 1-2):');
        byCategory.main.forEach(r => lines.push(formatRecipeWithAvailability(r, availabilityById[r.id])));
        lines.push('');
    }
    
    // Drinks
    if (byCategory.drink.length > 0) {
        lines.push('DRINKS (serves 1):');
        byCategory.drink.forEach(r => lines.push(formatRecipeWithAvailability(r, availabilityById[r.id])));
        lines.push('');
    }
    
    // Snacks
    if (byCategory.snacks.length > 0) {
        lines.push('SNACKS (serves 1):');
        byCategory.snacks.forEach(r => lines.push(formatRecipeWithAvailability(r, availabilityById[r.id])));
        lines.push('');
    }
    
    // Rewards
    if (byCategory.rewards.length > 0) {
        lines.push('REWARDS (treats, serves 1):');
        byCategory.rewards.forEach(r => lines.push(formatRecipeWithAvailability(r, availabilityById[r.id])));
        lines.push('');
    }
    
    lines.push('Allergy & diet key: 🥬=Vegetarian 🌱=Vegan 🥜=Contains nuts 🥛=Contains dairy 🌾=Contains gluten');
    
    return lines.join('\n');
}

/**
 * Build compact time slot section for AI prompt
 */
function buildTimeSlotPrompt(timeGaps, excludedActivities) {
    const timeSlotText = formatTimeGapsForPrompt(timeGaps);
    
    const lines = [];
    lines.push('⏰ FILL THESE TIME SLOTS:');
    lines.push(timeSlotText);
    lines.push('');
    
    if (excludedActivities.length > 0) {
        lines.push(`❌ Skip (already scheduled): ${excludedActivities.join(', ')}`);
        lines.push('');
    }
    
    // All possible activities
    const allActivities = [
        'Morning routine',
        'Breakfast',
        'Lunch',
        'Dinner',
        'Cooking',
        'Study',
        'Hobbies',
        'Evening routine',
        'Sleep'
    ];
    
    // Filter out activities that are already excluded (case-insensitive)
    const excludedLower = excludedActivities.map(a => a.toLowerCase().replace(/[^\w\s]/g, '').trim());
    const remainingActivities = allActivities.filter(activity => {
        const activityLower = activity.toLowerCase();
        return !excludedLower.some(excluded => excluded.includes(activityLower) || activityLower.includes(excluded));
    });
    
    if (remainingActivities.length > 0) {
        lines.push(`📝 Add remaining activities: ${remainingActivities.join(', ')}`);
    }
    
    return lines.join('\n');
}

// ===================================
// POST-GENERATION UPDATES
// ===================================

/**
 * Extract all recipe IDs mentioned in AI-generated schedule
 * Pattern matches: RB1, RBC2, RM5, CR1, CR10, etc.
 */
function extractRecipeIdsFromSchedule(scheduleText) {
    if (!scheduleText) return [];
    
    // Pattern: Optional C + R + (B|BC|M|D|S|W) + digits
    // Matches: RB1, RBC10, RM5, RD2, RS3, RW1, CR1, CR15
    const pattern = /\b(C)?(RB|RBC|RM|RD|RS|RW)(\d+)\b/g;
    
    const matches = scheduleText.match(pattern) || [];
    
    // Get unique IDs only
    const uniqueIds = [...new Set(matches)];
    
    console.log(`📝 Extracted ${uniqueIds.length} unique recipe IDs:`, uniqueIds.join(', '));
    
    return uniqueIds;
}

/**
 * Mark recipes as "used today" in history
 * Auto-cleanup entries older than 30 days
 */
function updateRecipeUsageHistory(recipeIds) {
    if (!recipeIds || recipeIds.length === 0) {
        console.warn('⚠️ No recipe IDs to update');
        return;
    }
    
    const history = JSON.parse(localStorage.getItem('recipeUsageHistory')) || {};
    const today = new Date().toISOString().split('T')[0]; // "2025-12-27"
    
    // Update each recipe
    recipeIds.forEach(recipeId => {
        if (!history[recipeId]) {
            history[recipeId] = {
                lastUsed: today,
                timesUsed: 1
            };
        } else {
            history[recipeId].lastUsed = today;
            history[recipeId].timesUsed++;
        }
    });
    
    // Cleanup old entries (older than 30 days)
    const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    let cleaned = 0;
    
    Object.keys(history).forEach(recipeId => {
        const lastUsed = new Date(history[recipeId].lastUsed);
        if (lastUsed < thirtyDaysAgo) {
            delete history[recipeId];
            cleaned++;
        }
    });
    
    // Save
    localStorage.setItem('recipeUsageHistory', JSON.stringify(history));
    
    console.log(`✅ Updated ${recipeIds.length} recipes in history`);
    if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} old entries`);
    }
}

/**
 * Save generated schedule to 14-day history
 * Auto-cleanup schedules older than 14 days
 */
function saveScheduleToHistory(scheduleText, recipesUsed, weekStart) {
    if (!scheduleText) {
        console.warn('⚠️ No schedule text to save');
        return;
    }
    
    const history = JSON.parse(localStorage.getItem('scheduleHistory_v2')) || [];
    
    const newEntry = {
        id: `schedule_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        weekStart: weekStart || (typeof getNextMonday === 'function' ? getNextMonday() : new Date().toISOString().split('T')[0]),
        recipesUsed: recipesUsed || [],
        scheduleText: scheduleText
    };
    
    // Add to history
    history.push(newEntry);
    
    // Cleanup old entries (older than 14 days)
    const fourteenDaysAgo = new Date(Date.now() - (14 * 24 * 60 * 60 * 1000));
    const filtered = history.filter(entry => {
        return new Date(entry.generatedAt) >= fourteenDaysAgo;
    });
    
    // Save
    localStorage.setItem('scheduleHistory_v2', JSON.stringify(filtered));
    
    console.log(`✅ Schedule saved to history (${filtered.length} total schedules)`);
}

/**
 * Track how many times user has generated schedules
 * Useful for statistics and first-time detection
 */
function incrementGenerationCount() {
    const data = JSON.parse(localStorage.getItem('aiGenerationCount')) || {
        count: 0,
        firstGenerated: null,
        lastGenerated: null
    };
    
    data.count++;
    data.lastGenerated = new Date().toISOString();
    
    if (!data.firstGenerated) {
        data.firstGenerated = data.lastGenerated;
    }
    
    localStorage.setItem('aiGenerationCount', JSON.stringify(data));
    
    console.log(`📊 Generation count: ${data.count}`);
}

/**
 * Combine pre-filled blocks (work/defaults) with AI-generated activities
 * Insert pre-filled blocks into final schedule
 */
function mergeScheduleWithPreFilled(aiScheduleText, preFilledBlocks) {
    if (!preFilledBlocks || Object.keys(preFilledBlocks).length === 0) {
        // No pre-filled blocks, return AI output as-is
        return aiScheduleText;
    }
    
    const lines = aiScheduleText.split('\n');
    const merged = [];
    let currentDay = null;
    let dayBlocks = [];
    
    // Parse AI output
    lines.forEach(line => {
        // Check for day header: === MONDAY — 30 Dec 2025 ===
        const dayHeaderMatch = line.match(/^===\s*(\w+)\s*—/);
        
        if (dayHeaderMatch) {
            // Save previous day's blocks (if any)
            if (currentDay && dayBlocks.length > 0) {
                const mergedDay = mergeDayBlocks(currentDay, dayBlocks, preFilledBlocks[currentDay]);
                merged.push(...mergedDay);
            }
            
            // Start new day
            currentDay = dayHeaderMatch[1]; // "MONDAY"
            dayBlocks = [];
            merged.push(line); // Add header
        } else if (line.match(/^\d{2}:\d{2}/)) {
            // This is a time block from AI
            dayBlocks.push(line);
        } else {
            // Other content (empty lines, final recipe list, etc.)
            merged.push(line);
        }
    });
    
    // Don't forget last day
    if (currentDay && dayBlocks.length > 0) {
        const mergedDay = mergeDayBlocks(currentDay, dayBlocks, preFilledBlocks[currentDay]);
        merged.push(...mergedDay);
    }
    
    return merged.join('\n');
}

/**
 * Merge blocks for a single day
 */
function mergeDayBlocks(dayName, aiBlocks, preFilledBlocks) {
    const allBlocks = [];
    
    // Add pre-filled blocks (work, commute, defaults)
    if (preFilledBlocks && preFilledBlocks.length > 0) {
        preFilledBlocks.forEach(block => {
            const blockLine = `${block.start}–${block.end} | ${block.title}${block.tasks.length > 0 ? ' | ' + block.tasks.join(', ') : ''}`;
            allBlocks.push({ time: block.start, text: blockLine });
        });
    }
    
    // Add AI blocks
    aiBlocks.forEach(line => {
        const timeMatch = line.match(/^(\d{2}:\d{2})/);
        if (timeMatch) {
            allBlocks.push({ time: timeMatch[1], text: line });
        }
    });
    
    // Sort by time
    allBlocks.sort((a, b) => a.time.localeCompare(b.time));
    
    // Return just the text lines
    return allBlocks.map(block => block.text);
}

/**
 * Complete post-generation process
 * Call this AFTER AI returns schedule
 */
function handleScheduleGenerated(aiScheduleText, preFilledBlocks) {
    console.log('🔄 Processing generated schedule...');
    
    // Step 1: Extract recipe IDs
    const recipesUsed = extractRecipeIdsFromSchedule(aiScheduleText);
    
    // Step 2: Merge with pre-filled blocks
    const finalSchedule = mergeScheduleWithPreFilled(aiScheduleText, preFilledBlocks);
    
    // Step 3: Update recipe usage history
    // NOTE: Recipe usage is now tracked when user clicks "Cook" button
    // This just extracts IDs for schedule history purposes
    
    // Step 4: Save to schedule history
    const weekStart = typeof getNextMonday === 'function' ? getNextMonday() : new Date().toISOString().split('T')[0];
    saveScheduleToHistory(finalSchedule, recipesUsed, weekStart);
    
    // Step 5: Increment generation count
    incrementGenerationCount();
    
    console.log('✅ Schedule processing complete!');
    
    return finalSchedule;
}

console.log('✅ Recipe utilities loaded!');
