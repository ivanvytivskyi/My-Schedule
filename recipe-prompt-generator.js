// ================================================
// RECIPE PROMPT GENERATOR HELPERS
// Formats recipe database section for AI prompts
// ================================================

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
    if (!shop) return recipes;
    return recipes.filter((recipe) => {
        if (!recipe.quickAddItems || recipe.quickAddItems.length === 0) return true;
        return recipe.quickAddItems.some((item) => item.shop === shop);
    });
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
    const prompt = recipe.aiPrompt || 'ingredients:not specified';
    return `${recipe.id}: ${recipe.name} (${prompt})${icons ? ` - ${icons}` : ''}`;
}

function formatRecipeDatabase(recipes, batchDuration) {
    const breakfast = recipes
        .filter((r) => r.category === 'breakfast')
        .sort((a, b) => a.id.localeCompare(b.id));
    const batch = recipes
        .filter((r) => r.category === 'batch')
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
    
    lines.push(`BATCH COOK OPTIONS (serves 4, lasts ${batchDuration} day${batchDuration === '1' ? '' : 's'}):`);
    lines.push(batch.length ? batch.map(formatRecipeLine).join('\n') : 'None available for current filters');
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
    rules.push('- Use batch cook for lunch/dinner');
    rules.push('- Respect dietary restrictions');
    rules.push('- Consider pantry items to reduce cost');
    rules.push('');
    rules.push('❌ DON\'T:');
    rules.push('- Use the same breakfast every day');
    rules.push('- Suggest recipes user can\'t eat');
    rules.push('- Ignore dietary restrictions');
    return rules.join('\n');
}

function buildRecipePromptSection({ shop, batchDuration = '1', filters = {} }) {
    const allRecipes = typeof getAllRecipes === 'function' ? Object.values(getAllRecipes()) : [];
    const filtered = filterRecipesByShop(filterRecipesByDietary(allRecipes, filters), shop);
    
    const databaseSection = formatRecipeDatabase(filtered, batchDuration);
    const rulesSection = buildRecipeSelectionRules({ batchDuration, filters });
    
    return `${databaseSection}\n\n${rulesSection}`;
}

console.log('✅ Recipe Prompt Generator loaded!');
