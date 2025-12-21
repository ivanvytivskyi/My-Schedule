# 🍳 RECIPE AUTOMATION SYSTEM - MASTER IMPLEMENTATION PLAN

**Version:** 1.0  
**Date Created:** 20 Dec 2025  
**App:** Weekly Schedule Manager V6.2  
**Purpose:** Automated meal planning with AI-powered recipe selection and shopping list generation

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [User Workflow](#user-workflow)
3. [Decisions Made](#decisions-made)
4. [Technical Architecture](#technical-architecture)
5. [Implementation Steps](#implementation-steps)
6. [File Structure](#file-structure)
7. [Data Structures](#data-structures)
8. [Testing Checklist](#testing-checklist)
9. [Progress Tracker](#progress-tracker)

---

## 🎯 SYSTEM OVERVIEW

### **What We're Building:**

A fully automated meal planning system where:
- User fills a form in the app
- App generates AI prompt with recipe IDs
- User copies prompt → pastes into ChatGPT/Claude.ai
- AI selects recipes based on schedule, budget, preferences
- User copies AI response → pastes back into app
- App automatically:
  - Creates weekly schedule
  - Displays selected recipes with full instructions
  - Auto-selects items in Quick Add
  - Generates shopping list
  - **ZERO manual work!**

### **Key Features:**

✅ 30 built-in recipes (10 breakfast + 20 batch cook)  
✅ User can add unlimited custom recipes  
✅ Recipe library with full instructions, tips, videos  
✅ Dietary filters (vegetarian, vegan, allergies)  
✅ Auto-mapping recipes → Quick Add items  
✅ Smart pantry integration  
✅ Clean AI prompt format (no extra comments)  
✅ One-click shopping list generation  

---

## 👤 USER WORKFLOW

```
┌─────────────────────────────────────────────┐
│ STEP 1: Fill Prompt Generator Form         │
│ - Work schedule                             │
│ - Study hours                               │
│ - Preferred shop (Tesco/Lidl)              │
│ - Batch cook duration (1 or 2 days)       │
│ - Dietary preferences                       │
│ - Pantry items                             │
│ - Budget                                    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ STEP 2: App Generates AI Prompt            │
│ - Includes recipe IDs (R1-R30, R50+)       │
│ - Clean format, no fluff                   │
│ - User copies prompt                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ STEP 3: User Goes to ChatGPT/Claude.ai     │
│ - Pastes prompt                             │
│ - AI analyzes and responds                  │
│ - AI chooses recipes (R1, R11, R15...)     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ STEP 4: User Copies AI Response            │
│ - Schedule with recipe IDs                  │
│ - Shopping list with exact items            │
│ - Recipe IDs clearly marked                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ STEP 5: User Pastes into Import Modal      │
│ - App parses response                       │
│ - Extracts recipe IDs (R1, R11...)         │
│ - Maps to Quick Add items                   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ STEP 6: Magic Happens! ✨                   │
│ ✅ Weekly schedule created                  │
│ ✅ Recipes displayed with instructions      │
│ ✅ Quick Add items auto-selected            │
│ ✅ Shopping list ready                      │
│ ✅ User can review/edit before finalizing   │
└─────────────────────────────────────────────┘
```

---

## ⚙️ DECISIONS MADE

### **1. Recipe Count:**
- **10 breakfast recipes** (R1-R10)
- **20 batch cook recipes** (R11-R30)
- **User custom recipes** (R50+)
- **Total default: 30 recipes**

### **2. Categories:**
- Breakfast (quick, 1 serving)
- Batch Cook (serves 4, lunch/dinner)

### **3. Dietary Filters:**
- ✅ Vegetarian 🥬
- ✅ Vegan 🌱
- ✅ Contains nuts 🥜
- ✅ Contains dairy 🥛
- ✅ Contains gluten 🌾
- **Note:** All labels/functions implemented, general recipes for now

### **4. Shopping - One Shop:**
- User selects ONE preferred shop in form
- AI uses only that shop's items
- Simpler, realistic shopping behavior

### **5. Leftovers Format:**
```
First meal:
18:00-19:00 | 🍽️ Dinner: R11 | Chicken Rice Bowl

Second meal:
12:00-13:00 | 🍽️ Lunch: R11 (leftover) | Chicken Rice Bowl
```

### **6. Portion Scaling:**
- Default: Full recipe (serves 4)
- Tick boxes in form:
  - ☐ Batch lasts 1 day (lunch + dinner)
  - ☐ Batch lasts 2 days (4 meals)

### **7. Recipe Display:**
- **Tab 1:** "Recipe Library" (browse all 30+ recipes)
- **Tab 2:** "This Week's Recipes" (only AI-selected ones)

### **8. Custom Recipe Mapping:**
- User writes 2 sections:
  1. **Short AI Prompt:** "chicken:200g, rice:100g, veg:150g"
  2. **Full Recipe:** Instructions, tips, video
- ID auto-generated (R50, R51, R52...)
- All required fields must be filled

### **9. Import Behavior:**
- Show warning dialog:
  - "You have 5 existing days. Clear all or append?"
  - [Clear All] [Add to Existing] [Cancel]

### **10. Pantry Integration:**
- AI considers pantry when **choosing recipes**
- AI excludes pantry items from **shopping list**
- **Both functions active**

### **11. Nutritional Info:**
- Optional field in recipe
- User can add when creating custom recipe
- Display if available

### **12. Meal Timing:**
- AI schedules exact times
- Format: `07:30-08:00 | 🍳 Breakfast: R1 | Scrambled Eggs`

---

## 🏗️ TECHNICAL ARCHITECTURE

### **Core Components:**

```
recipe-database.js
├─ defaultRecipes {} (R1-R30)
├─ userRecipes {} (R50+)
├─ getRecipe(id)
├─ getAllRecipes()
├─ addCustomRecipe()
└─ deleteRecipe(id)

recipe-display.js
├─ renderRecipeLibrary()
├─ renderThisWeeksRecipes()
├─ displayRecipeCard(id)
└─ openRecipeModal(id)

recipe-prompt-generator.js
├─ generateRecipePrompt()
├─ includeRecipeDatabase()
├─ formatRecipeForAI()
└─ getShopSelection()

recipe-import-parser.js
├─ parseRecipeIDs()
├─ extractRecipesFromResponse()
├─ mapRecipeToQuickAdd()
├─ autoSelectItems()
└─ generateShoppingFromRecipes()

recipe-quick-add-mapper.js
├─ recipeToQuickAddMap {}
├─ aggregateIngredients()
├─ calculatePortions()
└─ scaleRecipe()
```

### **Data Flow:**

```
Form Input → Generate Prompt → User → AI Tool
                                        ↓
                                   AI Response
                                        ↓
Import Parser ← User Pastes ← AI Response
      ↓
Extract Recipe IDs (R1, R11, R15...)
      ↓
Get Recipe Data from Database
      ↓
Map to Quick Add Items
      ↓
Auto-Select in Quick Add Modal
      ↓
Generate Shopping List
      ↓
Display Recipes in Recipe Tab
```

---

## 📝 IMPLEMENTATION STEPS

### **PHASE 1: Recipe Database (Foundation)**

#### **STEP 1.1: Create Recipe Data Structure** ✅ / ❌
**File:** `/recipe-database.js`

**Tasks:**
- [ ] Define recipe schema
- [ ] Create 10 breakfast recipes (R1-R10)
- [ ] Create 20 batch cook recipes (R11-R30)
- [ ] Add dietary tags to each
- [ ] Map each recipe to Quick Add items
- [ ] Test: `console.log(defaultRecipes)`

**Recipe Schema:**
```javascript
{
  id: "R1",
  name: "Perfect Scrambled Eggs",
  category: "breakfast",
  serves: 1,
  prepTime: "5 mins",
  cookTime: "5 mins",
  
  // For AI Prompt (compact)
  aiPrompt: "eggs:3, butter:20g",
  
  // Dietary tags
  dietary: {
    vegetarian: true,
    vegan: false,
    nuts: false,
    dairy: true,
    gluten: false
  },
  
  // Quick Add mapping
  quickAddItems: [
    { 
      shop: "Tesco",
      category: "🥛 Dairy & Eggs",
      itemName: "British Barn Eggs",
      qtyNeeded: 3,
      unit: "eggs"
    },
    // ...
  ],
  
  // Display data
  display: {
    emoji: "🍳",
    description: "Creamy, fluffy scrambled eggs",
    ingredients: ["3 large eggs", "20g butter", ...],
    instructions: ["Step 1...", "Step 2...", ...],
    tips: ["Tip 1...", "Tip 2...", ...],
    video: "https://youtube.com/...",
    nutrition: "280 cal, 18g protein" // optional
  }
}
```

**Validation:**
```javascript
// Test each recipe
Object.values(defaultRecipes).forEach(recipe => {
  console.assert(recipe.id, "Missing ID");
  console.assert(recipe.name, "Missing name");
  console.assert(recipe.quickAddItems.length > 0, "No Quick Add items");
  console.assert(recipe.display.instructions.length > 0, "No instructions");
});
```

---

#### **STEP 1.2: Create Recipe Storage System** ✅ / ❌
**File:** `/recipe-database.js`

**Tasks:**
- [ ] Load user recipes from localStorage
- [ ] Merge with default recipes
- [ ] Auto-generate IDs for user recipes (R50+)
- [ ] Save/load functions
- [ ] Test: Add custom recipe, reload page, verify it persists

**Code Structure:**
```javascript
let defaultRecipes = { R1: {...}, R2: {...}, ... };
let userRecipes = {};

function loadUserRecipes() {
  const saved = localStorage.getItem('userRecipes');
  if (saved) {
    userRecipes = JSON.parse(saved);
  }
}

function saveUserRecipes() {
  localStorage.setItem('userRecipes', JSON.stringify(userRecipes));
}

function getAllRecipes() {
  return { ...defaultRecipes, ...userRecipes };
}

function getNextUserRecipeID() {
  const ids = Object.keys(userRecipes).map(id => parseInt(id.slice(1)));
  const maxID = ids.length > 0 ? Math.max(...ids) : 49;
  return `R${maxID + 1}`;
}
```

---

### **PHASE 2: Recipe Display UI**

#### **STEP 2.1: Create Recipe Library Tab** ✅ / ❌
**File:** `/recipe-display.js`

**Tasks:**
- [ ] Add "Recipe Library" tab to Recipes section
- [ ] Grid layout for recipe cards
- [ ] Filter by category (Breakfast / Batch Cook)
- [ ] Filter by dietary tags
- [ ] Click card → Open full recipe modal
- [ ] Test: Browse all 30 recipes

**HTML Structure:**
```html
<div id="recipesContent">
  <div class="recipes-tabs">
    <button class="active" data-tab="library">📚 Recipe Library</button>
    <button data-tab="thisweek">🍽️ This Week</button>
  </div>
  
  <div id="recipeLibraryTab" class="active">
    <!-- Filters -->
    <div class="recipe-filters">
      <select id="categoryFilter">
        <option value="all">All Categories</option>
        <option value="breakfast">Breakfast</option>
        <option value="batch">Batch Cook</option>
      </select>
      
      <div class="dietary-filters">
        <label><input type="checkbox" value="vegetarian"> 🥬 Vegetarian</label>
        <label><input type="checkbox" value="vegan"> 🌱 Vegan</label>
        <label><input type="checkbox" value="nuts"> 🥜 Nut-free</label>
      </div>
    </div>
    
    <!-- Recipe Grid -->
    <div id="recipeGrid" class="recipe-grid">
      <!-- Cards generated by JS -->
    </div>
  </div>
  
  <div id="thisWeekTab" style="display: none;">
    <!-- This week's selected recipes -->
  </div>
</div>
```

**Recipe Card:**
```html
<div class="recipe-card" onclick="openRecipeModal('R1')">
  <div class="recipe-card-header">
    <span class="recipe-emoji">🍳</span>
    <span class="recipe-id">R1</span>
  </div>
  <h3>Perfect Scrambled Eggs</h3>
  <div class="recipe-meta">
    <span>⏱️ 10 min</span>
    <span>🍽️ Serves 1</span>
  </div>
  <div class="recipe-tags">
    <span class="tag vegetarian">🥬</span>
    <span class="tag dairy">🥛</span>
  </div>
</div>
```

---

#### **STEP 2.2: Create Recipe Detail Modal** ✅ / ❌
**File:** `/recipe-display.js`

**Tasks:**
- [ ] Full-screen recipe modal
- [ ] Display all recipe details
- [ ] YouTube video embed/button
- [ ] Print-friendly format
- [ ] Edit button (for custom recipes only)
- [ ] Delete button (for custom recipes only)
- [ ] Test: Open recipe, view all sections

**Modal Structure:**
```html
<div id="recipeModal" class="modal">
  <div class="modal-content recipe-modal">
    <button class="close-btn">✕</button>
    
    <div class="recipe-header">
      <h1>🍳 Perfect Scrambled Eggs</h1>
      <div class="recipe-id-badge">R1</div>
    </div>
    
    <div class="recipe-meta-bar">
      <span>⏱️ Prep: 5 min</span>
      <span>🔥 Cook: 5 min</span>
      <span>🍽️ Serves: 1</span>
    </div>
    
    <div class="recipe-tags">
      <span class="tag vegetarian">🥬 Vegetarian</span>
      <span class="tag dairy">🥛 Contains Dairy</span>
    </div>
    
    <section class="recipe-section">
      <h3>📝 Ingredients</h3>
      <ul>
        <li>3 large eggs</li>
        <li>20g butter (about 1 tablespoon)</li>
        <li>Pinch of salt</li>
        <li>Freshly ground black pepper</li>
      </ul>
    </section>
    
    <section class="recipe-section">
      <h3>👨‍🍳 Instructions</h3>
      <ol>
        <li>Crack eggs into bowl...</li>
        <li>Heat pan on LOW-MEDIUM...</li>
        <!-- ... -->
      </ol>
    </section>
    
    <section class="recipe-section">
      <h3>💡 Pro Tips</h3>
      <ul>
        <li>Low heat is the secret...</li>
        <!-- ... -->
      </ul>
    </section>
    
    <section class="recipe-section">
      <h3>🎥 Video Tutorial</h3>
      <a href="https://youtube.com/..." target="_blank" class="video-btn">
        ▶️ Watch on YouTube
      </a>
    </section>
    
    <section class="recipe-section" *ngIf="nutrition">
      <h3>🥗 Nutrition</h3>
      <p>Per serving: 280 cal, 18g protein, 22g fat</p>
    </section>
    
    <!-- Edit/Delete buttons for custom recipes -->
    <div class="recipe-actions" *ngIf="isCustomRecipe">
      <button onclick="editRecipe('R50')">✏️ Edit</button>
      <button onclick="deleteRecipe('R50')">🗑️ Delete</button>
    </div>
  </div>
</div>
```

---

#### **STEP 2.3: "This Week" Tab** ✅ / ❌
**File:** `/recipe-display.js`

**Tasks:**
- [ ] Shows only AI-selected recipes
- [ ] Populated after import
- [ ] Same card format as library
- [ ] Empty state: "No recipes selected yet"
- [ ] Test: Import schedule → Check recipes appear

---

### **PHASE 3: Custom Recipe Creation**

#### **STEP 3.1: Add Recipe Form** ✅ / ❌
**File:** `/recipe-display.js`

**Tasks:**
- [ ] "➕ Add Custom Recipe" button
- [ ] Modal form with all fields
- [ ] AI prompt section (required)
- [ ] Full recipe section (required)
- [ ] Quick Add mapping interface
- [ ] Validation (all required fields)
- [ ] Auto-generate ID
- [ ] Save to localStorage
- [ ] Test: Create recipe, verify in library

**Form Fields:**
```javascript
{
  // Auto-generated
  id: "R50",
  
  // Basic Info (required)
  name: "My Special Stir Fry",
  category: "breakfast" | "batch",
  serves: 1-10,
  prepTime: "15 mins",
  cookTime: "20 mins",
  
  // AI Prompt (required)
  aiPrompt: "chicken:200g, veg:300g, rice:150g",
  
  // Dietary (checkboxes)
  dietary: {
    vegetarian: false,
    vegan: false,
    nuts: false,
    dairy: false,
    gluten: false
  },
  
  // Quick Add Mapping (required)
  quickAddItems: [
    // User selects from dropdown
  ],
  
  // Display (required)
  display: {
    emoji: "🍜" // emoji picker,
    description: "Delicious stir fry...",
    ingredients: ["Item 1", "Item 2"], // textarea, line-by-line
    instructions: ["Step 1", "Step 2"], // textarea, line-by-line
    tips: ["Tip 1", "Tip 2"], // optional, textarea
    video: "https://youtube.com/...", // optional
    nutrition: "500 cal, 30g protein" // optional
  }
}
```

---

#### **STEP 3.2: Quick Add Mapping Interface** ✅ / ❌
**File:** `/recipe-display.js`

**Tasks:**
- [ ] Ingredient input section
- [ ] For each ingredient:
  - Search/select Quick Add item
  - Enter quantity needed
- [ ] Add/remove ingredient rows
- [ ] Validate: All ingredients mapped
- [ ] Test: Map 5 ingredients successfully

**Interface:**
```html
<div class="quick-add-mapping">
  <h4>🛒 Map to Quick Add Items</h4>
  
  <div id="ingredientMappings">
    <!-- Repeatable row -->
    <div class="mapping-row">
      <input type="text" placeholder="Search item..." 
             onkeyup="searchQuickAddItems(this.value)">
      
      <select class="shop-select">
        <option value="Tesco">Tesco</option>
        <option value="Lidl">Lidl</option>
      </select>
      
      <select class="item-select">
        <!-- Populated based on shop + search -->
      </select>
      
      <input type="number" placeholder="Qty" step="0.1">
      <input type="text" placeholder="Unit" value="g">
      
      <button onclick="removeMapping()">🗑️</button>
    </div>
  </div>
  
  <button onclick="addMappingRow()">➕ Add Ingredient</button>
</div>
```

---

### **PHASE 4: AI Prompt Generator Enhancement**

#### **STEP 4.1: Update Prompt Generator Form** ✅ / ❌
**File:** `/script.js` (modify existing `generatePrompt()`)

**Tasks:**
- [ ] Add shop selection dropdown
- [ ] Add batch duration checkboxes
- [ ] Add dietary preference checkboxes
- [ ] Generate recipe database section in prompt
- [ ] Test: Generate prompt, verify recipe IDs included

**New Form Sections:**
```html
<!-- Shop Selection -->
<div class="form-section">
  <h4>🏪 Shopping Preference</h4>
  <select id="promptShop">
    <!-- Populated from user's Quick Add shops -->
  </select>
</div>

<!-- Batch Cook Duration -->
<div class="form-section">
  <h4>🍲 Batch Cook Settings</h4>
  <label>
    <input type="radio" name="batchDuration" value="1" checked>
    1 day (lunch + dinner)
  </label>
  <label>
    <input type="radio" name="batchDuration" value="2">
    2 days (4 meals)
  </label>
</div>

<!-- Dietary Preferences -->
<div class="form-section">
  <h4>🥗 Dietary Preferences</h4>
  <label>
    <input type="checkbox" id="dietVegetarian">
    🥬 I'm vegetarian
  </label>
  <label>
    <input type="checkbox" id="dietVegan">
    🌱 I'm vegan
  </label>
  <label>
    <input type="checkbox" id="dietNutFree">
    🥜 Nut allergy
  </label>
  <label>
    <input type="checkbox" id="dietDairyFree">
    🥛 Dairy-free
  </label>
  <label>
    <input type="checkbox" id="dietGlutenFree">
    🌾 Gluten-free
  </label>
</div>
```

---

#### **STEP 4.2: Generate Recipe Database in Prompt** ✅ / ❌
**File:** `/recipe-prompt-generator.js`

**Tasks:**
- [ ] Filter recipes by dietary preferences
- [ ] Filter by selected shop availability
- [ ] Format as compact list
- [ ] Include only necessary info (ID, name, aiPrompt)
- [ ] Test: Generate with vegetarian filter → Verify only veggie recipes

**Prompt Format:**
```
=== RECIPE DATABASE ===

BREAKFAST OPTIONS (pick variety, serves 1):
R1: Scrambled Eggs (eggs:3, butter:20g) - 🥬🥛
R2: Oatmeal Bowl (oats:50g, milk:200ml, honey:10g) - 🥬🥛
R3: Toast & Jam (bread:2, butter:10g, jam:15g) - 🥬🥛
R5: Smoothie (banana:1, yogurt:200g, berries:50g) - 🥬🥛
R7: Avocado Toast (bread:2, avocado:1, tomato:1) - 🥬🌱

BATCH COOK OPTIONS (serves 4, lasts [1/2] day[s]):
R11: Chicken Rice (chicken:400g, rice:200g, veg:300g)
R12: Pasta Bake (pasta:400g, cheese:150g, tomatoes:500g) - 🥬🥛
R13: Beef Chili (beef:500g, beans:800g, tomatoes:400g)
R15: Veg Curry (chickpeas:800g, veg:500g, rice:300g) - 🥬🌱
R20: Fish & Chips (fish:600g, potatoes:800g, peas:200g)

CUSTOM RECIPES:
R50: My Stir Fry (chicken:200g, veg:300g, rice:150g)

Legend: 🥬=Vegetarian 🌱=Vegan 🥜=Contains nuts 🥛=Contains dairy 🌾=Contains gluten

=== RECIPE SELECTION RULES ===

Shop: [Tesco/Lidl]
Batch cook lasts: [1/2] day(s)
Dietary: [List restrictions if any]

✅ DO:
- Pick VARIETY of breakfasts (mix different recipes)
- Use batch cook for lunch/dinner
- Respect dietary restrictions
- Consider pantry items to reduce cost
- Stay within budget: £[amount]

❌ DON'T:
- Use same breakfast every day
- Suggest recipes user can't eat
- Exceed budget
- Include items not in shop

---

=== YOUR RESPONSE FORMAT ===

CRITICAL: Use EXACT format below. NO extra notes, NO comments in schedule.

=== MONDAY — 23 Dec 2025 ===
07:00-07:30 | 🌅 Morning Routine | Wake up, shower
07:30-08:00 | 🍳 Breakfast: R1 | Scrambled Eggs
08:00-09:00 | 🚶 Commute | Travel to work
09:00-17:00 | 💼 Work | Office
17:00-18:00 | 🚶 Commute | Travel home
18:00-19:00 | 🍽️ Dinner: R11 | Chicken Rice Bowl
...

=== TUESDAY — 24 Dec 2025 ===
07:00-07:30 | 🌅 Morning Routine | Wake up, shower
07:30-08:00 | 🍳 Breakfast: R2 | Oatmeal Bowl
12:00-13:00 | 🍽️ Lunch: R11 (leftover) | Chicken Rice Bowl
18:00-19:00 | 🍽️ Dinner: R11 (leftover) | Chicken Rice Bowl
...

[Continue for all 7 days]

=== SHOPPING LIST ===

Shop: Tesco

🥛 Dairy & Eggs:
British Barn Eggs, pack of 10, £1.43, 1
BUTTERPAK, 500g, £2.18, 1

🍖 Meat & Fish:
Chicken Breast, kg, £6.50, 0.5

[... all categories ...]

TOTAL: £[calculate]

=== RECIPES SELECTED ===

R1, R2, R5, R11, R15
```

---

### **PHASE 5: Import Parser with Recipe Recognition**

#### **STEP 5.1: Extract Recipe IDs from Response** ✅ / ❌
**File:** `/recipe-import-parser.js`

**Tasks:**
- [ ] Parse AI response
- [ ] Find all recipe IDs (R1, R11, R15...)
- [ ] Create unique list
- [ ] Validate IDs exist in database
- [ ] Log found recipes
- [ ] Test: Paste sample response → Verify IDs extracted

**Code:**
```javascript
function extractRecipeIDs(response) {
  const recipeIDPattern = /R\d+/g;
  const matches = response.match(recipeIDPattern) || [];
  
  // Remove duplicates
  const uniqueIDs = [...new Set(matches)];
  
  // Validate
  const validIDs = uniqueIDs.filter(id => {
    const recipe = getRecipe(id);
    if (!recipe) {
      console.warn(`Recipe ${id} not found in database`);
      return false;
    }
    return true;
  });
  
  console.log(`Found ${validIDs.length} recipes:`, validIDs);
  return validIDs;
}
```

---

#### **STEP 5.2: Map Recipes to Quick Add Items** ✅ / ❌
**File:** `/recipe-import-parser.js`

**Tasks:**
- [ ] For each recipe ID:
  - Get recipe from database
  - Extract quickAddItems
  - Add to master list
- [ ] Aggregate duplicate items (combine quantities)
- [ ] Handle portion scaling (1 day vs 2 days)
- [ ] Test: R11 used 3 times → Multiply quantities correctly

**Code:**
```javascript
function mapRecipesToQuickAdd(recipeIDs) {
  const allItems = [];
  
  recipeIDs.forEach(id => {
    const recipe = getRecipe(id);
    if (!recipe) return;
    
    // Get how many times this recipe appears
    const occurrences = recipeIDs.filter(rid => rid === id).length;
    
    recipe.quickAddItems.forEach(item => {
      allItems.push({
        ...item,
        qtyNeeded: item.qtyNeeded * occurrences
      });
    });
  });
  
  // Aggregate duplicates
  const aggregated = aggregateItems(allItems);
  
  console.log(`Total unique items: ${aggregated.length}`);
  return aggregated;
}

function aggregateItems(items) {
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
```

---

#### **STEP 5.3: Auto-Select in Quick Add** ✅ / ❌
**File:** `/recipe-import-parser.js`

**Tasks:**
- [ ] Open Quick Add modal programmatically
- [ ] Pre-select all recipe items
- [ ] Set quantities automatically
- [ ] User can review/adjust before adding
- [ ] Test: Import → Quick Add opens with items selected

**Code:**
```javascript
function autoSelectQuickAddItems(items) {
  // Clear existing selections
  selectedShoppingItems = {};
  
  items.forEach(item => {
    // Find matching item in Quick Add database
    const quickAddItem = findQuickAddItem(
      item.shop,
      item.category,
      item.itemName
    );
    
    if (quickAddItem) {
      const itemId = `${item.shop}|${item.category}|${quickAddItem.index}`;
      
      selectedShoppingItems[itemId] = {
        name: quickAddItem.name,
        unit: quickAddItem.unit,
        quantity: item.qtyNeeded,
        price: quickAddItem.price,
        shop: item.shop,
        category: item.category
      };
    } else {
      console.warn(`Item not found in Quick Add: ${item.itemName}`);
    }
  });
  
  // Open Quick Add modal with pre-selections
  openQuickAdd();
  renderQuickAddModal();
}
```

---

#### **STEP 5.4: Parse Schedule with Recipe References** ✅ / ❌
**File:** Modify existing `parseAndCreateSchedule()`

**Tasks:**
- [ ] Detect recipe IDs in schedule blocks
- [ ] Extract R1, R11, etc. from titles
- [ ] Mark leftover meals
- [ ] Preserve schedule parsing logic
- [ ] Test: Parse schedule → All recipe references detected

**Enhanced Parsing:**
```javascript
// In existing schedule parser
const blockMatch = /(\d{1,2}:\d{2})-(\d{1,2}:\d{2})\s*\|\s*([^|]+?)\s*\|\s*([^\n]+)/g;

// Check if title contains recipe ID
const recipeMatch = title.match(/R\d+/);
if (recipeMatch) {
  const recipeID = recipeMatch[0];
  const recipe = getRecipe(recipeID);
  
  block.recipeID = recipeID;
  block.recipeName = recipe ? recipe.name : 'Unknown Recipe';
  block.isLeftover = title.includes('leftover');
}
```

---

### **PHASE 6: Integration & Testing**

#### **STEP 6.1: Full Workflow Test** ✅ / ❌

**Tasks:**
- [ ] Fill prompt form completely
- [ ] Copy generated prompt
- [ ] Paste into ChatGPT/Claude.ai
- [ ] Get AI response
- [ ] Paste response into import
- [ ] Verify:
  - Schedule created ✅
  - Recipe IDs detected ✅
  - Quick Add opens with items ✅
  - Shopping list generated ✅
  - Recipes displayed in tab ✅

---

#### **STEP 6.2: Edge Case Testing** ✅ / ❌

**Test Cases:**
- [ ] Import with no recipes selected
- [ ] Import with invalid recipe ID (R999)
- [ ] Import with custom recipe (R50+)
- [ ] Import same recipe multiple times
- [ ] Import with leftover notation
- [ ] Import with dietary filters active
- [ ] Import when pantry items exist
- [ ] Import with 2-day batch cook
- [ ] Import → Clear all → Import again
- [ ] Import → Append to existing

---

#### **STEP 6.3: UI Polish** ✅ / ❌

**Tasks:**
- [ ] Recipe cards responsive (mobile)
- [ ] Modal scrolling works on mobile
- [ ] Filters work smoothly
- [ ] Loading states for import
- [ ] Success/error messages
- [ ] Tooltips for help
- [ ] Print-friendly recipe view

---

### **PHASE 7: Documentation**

#### **STEP 7.1: User Guide** ✅ / ❌

**Create:** `RECIPE-USER-GUIDE.md`

**Sections:**
- How to use recipe system
- How to add custom recipes
- How to generate AI prompts
- How to import schedules
- Troubleshooting

---

#### **STEP 7.2: Developer Docs** ✅ / ❌

**Create:** `RECIPE-DEV-DOCS.md`

**Sections:**
- System architecture
- Data structures
- API reference
- Adding new recipes
- Extending functionality

---

## 📁 FILE STRUCTURE

```
/mnt/project/
├── index.html (modified - add recipe tabs)
├── script.js (modified - integrate recipe system)
├── styles.css (modified - recipe UI styles)
├── shopping-quick-add.js (modified - auto-selection)
│
├── recipe-database.js (NEW)
│   ├── defaultRecipes = { R1: {...}, R2: {...}, ... }
│   ├── userRecipes = { R50: {...}, R51: {...}, ... }
│   ├── getRecipe(id)
│   ├── getAllRecipes()
│   ├── getRecipesByCategory(category)
│   ├── filterByDietary(filters)
│   ├── addCustomRecipe(recipe)
│   ├── updateRecipe(id, recipe)
│   ├── deleteRecipe(id)
│   ├── loadUserRecipes()
│   └── saveUserRecipes()
│
├── recipe-display.js (NEW)
│   ├── renderRecipeLibrary()
│   ├── renderThisWeeksRecipes()
│   ├── displayRecipeCard(id)
│   ├── openRecipeModal(id)
│   ├── closeRecipeModal()
│   ├── applyFilters()
│   ├── searchRecipes(query)
│   └── toggleRecipeTab(tab)
│
├── recipe-form.js (NEW)
│   ├── openAddRecipeModal()
│   ├── closeAddRecipeModal()
│   ├── validateRecipeForm()
│   ├── saveCustomRecipe()
│   ├── openEditRecipeModal(id)
│   ├── updateCustomRecipe(id)
│   ├── deleteCustomRecipe(id)
│   ├── searchQuickAddItems(query)
│   └── addIngredientMapping()
│
├── recipe-prompt-generator.js (NEW)
│   ├── enhancePromptWithRecipes()
│   ├── formatRecipeDatabase()
│   ├── filterRecipesByDietary()
│   ├── filterRecipesByShop()
│   └── generateRecipeInstructions()
│
└── recipe-import-parser.js (NEW)
    ├── extractRecipeIDs(response)
    ├── mapRecipesToQuickAdd(ids)
    ├── aggregateIngredients(items)
    ├── autoSelectQuickAddItems(items)
    ├── displaySelectedRecipes(ids)
    ├── calculateTotalFromRecipes()
    └── findQuickAddItem(shop, category, name)
```

---

## 🗂️ DATA STRUCTURES

### **Recipe Object:**
```javascript
{
  id: "R1",
  name: "Perfect Scrambled Eggs",
  category: "breakfast" | "batch",
  serves: 1,
  prepTime: "5 mins",
  cookTime: "5 mins",
  aiPrompt: "eggs:3, butter:20g",
  dietary: {
    vegetarian: true,
    vegan: false,
    nuts: false,
    dairy: true,
    gluten: false
  },
  quickAddItems: [
    {
      shop: "Tesco",
      category: "🥛 Dairy & Eggs",
      itemName: "British Barn Eggs",
      qtyNeeded: 3,
      unit: "eggs"
    }
  ],
  display: {
    emoji: "🍳",
    description: "...",
    ingredients: ["...", "..."],
    instructions: ["...", "..."],
    tips: ["...", "..."],
    video: "https://...",
    nutrition: "..." // optional
  }
}
```

### **Quick Add Mapping:**
```javascript
{
  shop: "Tesco",
  category: "🥛 Dairy & Eggs",
  itemName: "British Barn Eggs",
  qtyNeeded: 3,
  unit: "eggs"
}
```

### **localStorage Keys:**
```javascript
userRecipes: JSON.stringify({ R50: {...}, R51: {...} })
thisWeeksRecipes: JSON.stringify(["R1", "R11", "R15"])
```

---

## ✅ TESTING CHECKLIST

### **Recipe Database:**
- [ ] All 30 recipes have valid structure
- [ ] All recipes map to Quick Add items
- [ ] Dietary tags are accurate
- [ ] Custom recipes save/load correctly
- [ ] IDs auto-generate correctly (R50, R51...)

### **Recipe Display:**
- [ ] Library shows all recipes
- [ ] Filters work (category, dietary)
- [ ] Recipe modal displays correctly
- [ ] This Week tab updates after import
- [ ] Mobile responsive

### **Custom Recipes:**
- [ ] Form validates all required fields
- [ ] Quick Add mapping works
- [ ] Recipe saves to localStorage
- [ ] Recipe appears in library
- [ ] Edit/delete works
- [ ] ID increments correctly

### **Prompt Generation:**
- [ ] Recipes included in prompt
- [ ] Dietary filters work
- [ ] Shop selection works
- [ ] Batch duration reflects in prompt
- [ ] Format is clean (no extra text)

### **Import Parsing:**
- [ ] Recipe IDs extracted correctly
- [ ] Invalid IDs handled gracefully
- [ ] Items mapped to Quick Add
- [ ] Quantities aggregated correctly
- [ ] Leftover notation works
- [ ] This Week tab updates

### **Quick Add Integration:**
- [ ] Auto-selection works
- [ ] Quantities pre-filled
- [ ] User can adjust before adding
- [ ] Shopping list generated correctly

### **Full Workflow:**
- [ ] End-to-end test passes
- [ ] All edge cases handled
- [ ] No console errors
- [ ] Data persists across reloads

---

## 📊 PROGRESS TRACKER

### **PHASE 1: Recipe Database** ⬜
- [ ] STEP 1.1: Create Recipe Data Structure
- [ ] STEP 1.2: Create Recipe Storage System

### **PHASE 2: Recipe Display UI** ⬜
- [ ] STEP 2.1: Create Recipe Library Tab
- [ ] STEP 2.2: Create Recipe Detail Modal
- [ ] STEP 2.3: "This Week" Tab

### **PHASE 3: Custom Recipe Creation** ⬜
- [ ] STEP 3.1: Add Recipe Form
- [ ] STEP 3.2: Quick Add Mapping Interface

### **PHASE 4: AI Prompt Enhancement** ⬜
- [ ] STEP 4.1: Update Prompt Generator Form
- [ ] STEP 4.2: Generate Recipe Database in Prompt

### **PHASE 5: Import Parser** ⬜
- [ ] STEP 5.1: Extract Recipe IDs from Response
- [ ] STEP 5.2: Map Recipes to Quick Add Items
- [ ] STEP 5.3: Auto-Select in Quick Add
- [ ] STEP 5.4: Parse Schedule with Recipe References

### **PHASE 6: Integration & Testing** ⬜
- [ ] STEP 6.1: Full Workflow Test
- [ ] STEP 6.2: Edge Case Testing
- [ ] STEP 6.3: UI Polish

### **PHASE 7: Documentation** ⬜
- [ ] STEP 7.1: User Guide
- [ ] STEP 7.2: Developer Docs

---

## 🎯 CURRENT STATUS

**Last Updated:** [Date]  
**Current Phase:** [Phase Number]  
**Current Step:** [Step Number]  
**Progress:** [X%]

**Next Steps:**
1. [Next action item]
2. [Next action item]
3. [Next action item]

**Blockers:**
- [Any issues or dependencies]

**Notes:**
- [Any important observations or decisions made]

---

## 🚀 QUICK START (New Chat Session)

**Paste this in new chat:**

> I'm building a Recipe Automation System for my Weekly Schedule Manager app. Here's the master plan: [paste full document]
> 
> We're currently on: **PHASE [X], STEP [X.X]**
> 
> Please review the plan and help me continue from this point.

---

## 📝 CHANGELOG

**Version 1.0 - 20 Dec 2025**
- Initial master plan created
- All decisions documented
- 7 phases defined with detailed steps
- Data structures designed
- File architecture planned

---

## 🎓 LEARNING NOTES

**Key Concepts:**
- Recipe ID system (R1-R30, R50+)
- Dual representation (AI prompt vs user display)
- Quick Add mapping
- Ingredient aggregation
- Pantry integration
- Import parsing with recipe recognition

**Best Practices:**
- Keep AI prompts clean (no comments)
- Validate all recipe structures
- Handle missing recipes gracefully
- Aggregate duplicate ingredients
- Scale portions based on servings
- Preserve user data during import

---

## 🎯 SUCCESS CRITERIA

**The system is complete when:**
1. ✅ User can browse 30+ recipes in library
2. ✅ User can add custom recipes
3. ✅ Prompt generator includes all recipes
4. ✅ AI can select recipes and create schedule
5. ✅ Import parser extracts recipe IDs
6. ✅ Quick Add auto-selects items from recipes
7. ✅ Shopping list generated automatically
8. ✅ Selected recipes display in "This Week" tab
9. ✅ Full workflow works end-to-end
10. ✅ All edge cases handled
11. ✅ Mobile responsive
12. ✅ Data persists across sessions

**DREAM APP ACHIEVED! 🎉**

---

**END OF MASTER PLAN**
