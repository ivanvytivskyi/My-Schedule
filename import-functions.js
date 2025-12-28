// ===================================
// THREE SEPARATE IMPORT MODALS
// ===================================

// Modal Open/Close Functions
function openImportSchedule() {
    document.getElementById('importScheduleModal').classList.add('active');
}

function closeImportSchedule() {
    document.getElementById('importScheduleModal').classList.remove('active');
}

function openImportShopping() {
    document.getElementById('importShoppingModal').classList.add('active');
}

function closeImportShopping() {
    document.getElementById('importShoppingModal').classList.remove('active');
}

function openImportRecipes() {
    document.getElementById('importRecipesModal').classList.add('active');
}

function closeImportRecipes() {
    document.getElementById('importRecipesModal').classList.remove('active');
}

// ===================================
// IMPORT SCHEDULE FUNCTION
// ===================================
function importSchedule() {
    const input = document.getElementById('scheduleInput').value.trim();
    const preFilledBlocks = getPreFilledBlocksForImport();
    
    if (!input) {
        alert('⚠️ Please paste schedule first!');
        return;
    }
    
    try {
        let scheduleText = input;
        
        // Phase 5: Track schedule generation (recipe usage, history, stats)
        if (typeof handleScheduleGenerated === 'function') {
            console.log('🔄 Running Phase 5 tracking for imported schedule with defaults...');
            scheduleText = handleScheduleGenerated(input, preFilledBlocks) || input;
            console.log('✅ Phase 5: Schedule tracking complete');
        } else if (typeof mergeScheduleWithPreFilled === 'function' && Object.keys(preFilledBlocks).length > 0) {
            // Fallback merge when history tracker isn't available
            scheduleText = mergeScheduleWithPreFilled(input, preFilledBlocks);
        }
        
        const result = parseAndCreateSchedule(scheduleText);
        closeImportSchedule();
        document.getElementById('scheduleInput').value = '';
        
        const daysCreated = Object.keys(scheduleData.days).length;
        if (result?.recipeOnly) {
            alert(`✅ Recipes linked (${result.recipeCount || 0}) and shopping list generated from recipe IDs.`);
        } else {
            alert(`🎉 SUCCESS!\n\n${daysCreated} day${daysCreated > 1 ? 's' : ''} imported!`);
        }
    } catch (error) {
        console.error('Import error:', error);
        alert(`❌ Error: ${error.message}\n\nCheck console (F12) for details.`);
    }
}

function getPreFilledBlocksForImport() {
    try {
        const stored = sessionStorage.getItem('lastPreFilledData');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.preFilledBlocks && Object.keys(parsed.preFilledBlocks).length > 0) {
                console.log('🔄 Loaded pre-filled blocks from session');
                return parsed.preFilledBlocks;
            }
        }
    } catch (error) {
        console.warn('⚠️ Unable to load session pre-filled blocks', error);
    }
    
    if (typeof loadDefaultBlocks === 'function') {
        const defaults = loadDefaultBlocks();
        if (defaults && Object.keys(defaults).length > 0) {
            console.log('🔄 Loaded enabled default blocks for import');
            return defaults;
        }
    }
    
    return {};
}

// ===================================
// IMPORT SHOPPING LIST FUNCTION
// Displays beautifully formatted text as-is!
// ===================================
function importShopping() {
    const input = document.getElementById('shoppingInput').value.trim();
    
    if (!input) {
        alert('⚠️ Please paste shopping list first!');
        return;
    }
    
    console.log('=== IMPORTING SHOPPING LIST ===');
    
    try {
        // Parse the input and convert to HTML table format
        const lines = input.split('\n').filter(line => line.trim());
        let currentShop = 'Imported Shopping';
        const listId = Date.now();
        const shopId = `shop-${listId}-imported`;
        
        // Try to detect shop name from first line if it looks like a title
        if (lines[0] && !lines[0].match(/[\d£]/) && lines[0].length < 30) {
            currentShop = lines[0].trim();
            lines.shift();
        }
        
        // Parse items
        const items = [];
        lines.forEach(line => {
            // Skip lines that are just separators or empty
            if (line.match(/^[=\-_]+$/) || !line.trim()) return;
            
            // Try to extract item info
            const match = line.match(/(.+?)\s*(?:[-–—:]|\s+)?\s*(?:(\d+(?:\.\d+)?)\s*(?:x|×|pint|kg|g|L|ml|pack|loaf|of)?)?\s*(?:£|£\s*)?(\d+\.\d{2})?/i);
            
            if (match) {
                const name = match[1].replace(/^[•\-*]\s*/, '').trim();
                const quantity = match[2] || '1';
                const price = match[3] || '0.00';
                
                items.push({
                    name: name,
                    quantity: parseFloat(quantity),
                    price: parseFloat(price),
                    unit: ''
                });
            } else {
                // Add as-is if can't parse
                items.push({
                    name: line.replace(/^[•\-*]\s*/, '').trim(),
                    quantity: 1,
                    price: 0,
                    unit: ''
                });
            }
        });
        
        // Create HTML table
        let shoppingHTML = `
            <div id="${shopId}" style="margin-bottom: 30px; page-break-inside: avoid; border: 2px solid #ddd; border-radius: 8px; overflow: hidden; position: relative;">
                <!-- Delete button -->
                <button onclick="deleteShopList('${shopId}')" 
                    style="position: absolute; top: 10px; right: 10px; z-index: 10; background: #ff4444; color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 18px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; padding: 0;"
                    title="Delete this list">
                    ✕
                </button>
                
                <!-- Store logo/header -->
                <div style="background: linear-gradient(135deg, #0055a5 0%, #003d7a 100%); padding: 20px; text-align: center;">
                    <div style="background: white; display: inline-block; padding: 10px 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                        <h2 style="margin: 0; color: #e31837; font-size: 32px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">${currentShop}</h2>
                    </div>
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
        
        let total = 0;
        items.forEach(item => {
            const itemTotal = item.quantity * item.price;
            total += itemTotal;
            
            shoppingHTML += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 10px;">${item.name}</td>
                    <td style="border: 1px solid #ddd; padding: 10px;">${item.unit}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">£${item.price.toFixed(2)}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">${item.quantity}</td>
                </tr>
            `;
        });
        
        shoppingHTML += `
                        <tr style="background: #f9f9f9; font-weight: bold;">
                            <td colspan="2" style="border: 1px solid #ddd; padding: 10px; text-align: right;">Totals:</td>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">£${total.toFixed(2)}</td>
                            <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">Total Items: ${items.length}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        
        // Get existing shopping list
        const existingHTML = localStorage.getItem('shoppingListHTML') || '';
        
        // Add new items to existing list
        const newHTML = existingHTML + (existingHTML ? '<div style="margin: 40px 0; border-top: 3px solid #ddd;"></div>' : '') + shoppingHTML;
        
        // Save to localStorage
        localStorage.setItem('shoppingListHTML', newHTML);
        
        // Refresh display
        renderShopping();
        
        closeImportShopping();
        document.getElementById('shoppingInput').value = '';
        
        // Switch to shopping tab
        document.querySelector('[data-tab="shopping"]').click();
        
        alert(`🛒 SUCCESS!\n\nYour shopping list is now displayed as a beautiful table!\n\nCheck the Shopping tab!`);
        
    } catch (error) {
        console.error('Shopping import error:', error);
        alert(`❌ Error: ${error.message}`);
    }
}

// Helper function to add shopping row with beautiful styling
function addShoppingRow(item, quantity, price, notes) {
    const tbody = document.getElementById('shoppingTableBody');
    const row = tbody.insertRow();
    
    // Add striped row styling
    if (tbody.rows.length % 2 === 0) {
        row.style.background = '#f8f9fa';
    }
    
    row.innerHTML = `
        <td contenteditable="true" style="font-weight: 600; color: #2c3e50;">${item}</td>
        <td contenteditable="true" style="color: #5a6c7d;">${quantity}</td>
        <td contenteditable="true" style="color: #27ae60; font-weight: 500;">${price}</td>
        <td contenteditable="true" style="color: #7f8c8d; font-style: italic;">${notes}</td>
        <td style="display: none;" class="edit-col">
            <button onclick="this.closest('tr').remove(); saveToLocalStorage();" style="background: #f44336; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600;">Delete</button>
        </td>
    `;
    
    // Add listeners to save on edit
    row.querySelectorAll('[contenteditable="true"]').forEach(cell => {
        cell.addEventListener('blur', saveToLocalStorage);
    });
}

// ===================================
// IMPORT RECIPES FUNCTION
// Displays beautifully formatted text + converts video links to buttons!
// ===================================
function importRecipes() {
    const input = document.getElementById('recipesInput').value.trim();
    
    if (!input) {
        alert('⚠️ Please paste recipes first!');
        return;
    }
    
    console.log('=== IMPORTING RECIPES ===');
    
    try {
        // Convert text to HTML with preserved formatting
        let formattedHTML = input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>');
        
        // Find and replace YouTube links with beautiful video buttons
        const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+[^\s<>"{}|\\^`\[\]]*)/g;
        
        formattedHTML = formattedHTML.replace(youtubeRegex, function(url) {
            // Clean URL
            const cleanUrl = url.replace(/[.,;!?]+$/, '');
            
            return `
<div style="margin: 15px 0; display: inline-block;">
    <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" 
       style="display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%); color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 12px rgba(255,0,0,0.3); transition: all 0.3s ease; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;"
       onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(255,0,0,0.4)';"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(255,0,0,0.3)';">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
        </svg>
        <span>Watch Recipe Video</span>
    </a>
</div>`;
        });
        
        // Display in container (legacy text view)
        const container = document.getElementById('recipesDisplay');
        if (container) {
            container.innerHTML = `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.8; color: #2c3e50;">
                    ${formattedHTML}
                </div>
            `;
        }
        
        // Parse recipe IDs and map to Quick Add / This Week
        const ids = typeof extractRecipeIDs === 'function' ? extractRecipeIDs(input) : [];
        if (ids.length > 0) {
            // Merge into This Week
            if (Array.isArray(selectedRecipesThisWeek)) {
                const merged = [...new Set([...selectedRecipesThisWeek, ...ids])];
                selectedRecipesThisWeek = merged;
                if (typeof saveSelectedRecipes === 'function') saveSelectedRecipes();
                if (typeof renderThisWeekRecipes === 'function') renderThisWeekRecipes();
            }
            
            // Auto-generate shopping list
            if (typeof generateSmartShopping === 'function') {
                setTimeout(() => {
                    generateSmartShopping();
                }, 500);
            }
        }
        
        // Save raw text for edit mode
        localStorage.setItem('recipesText', input);
        
        closeImportRecipes();
        document.getElementById('recipesInput').value = '';
        
        // Switch to shopping tab to show generated list
        setTimeout(() => {
            const shoppingTab = document.querySelector('[data-tab="shopping"]');
            if (shoppingTab) shoppingTab.click();
        }, 600);
        
        const videoCount = (input.match(youtubeRegex) || []).length;
        const videoMsg = videoCount > 0 ? `\n✨ ${videoCount} video button${videoCount > 1 ? 's' : ''} added!` : '';
        const idsMsg = ids.length > 0 ? `\n✅ ${ids.length} recipe${ids.length > 1 ? 's' : ''} added to "This Week"\n🛒 Shopping list generated automatically!` : '';
        
        alert(`👨‍🍳 SUCCESS!\n\nRecipes imported and formatted!${videoMsg}${idsMsg}\n\nCheck the Shopping tab!`);
        
    } catch (error) {
        console.error('Recipes import error:', error);
        alert(`❌ Error: ${error.message}`);
    }
}

console.log('✅ Import functions loaded!');

// Note: toggleShoppingEditMode is now in script.js and uses HTML format

function toggleRecipesEditMode() {
    const button = document.getElementById('toggleRecipesEdit');
    const container = document.getElementById('recipesDisplay');
    
    if (!button || !container) return;
    
    if (button.classList.contains('active')) {
        // EXIT EDIT MODE - Save changes
        button.classList.remove('active');
        button.textContent = '✏️';
        button.title = 'Edit';
        
        // Get the text content
        const content = container.querySelector('[contenteditable]');
        if (content) {
            const text = content.innerText.trim();
            
            if (text) {
                // Save non-empty content
                localStorage.setItem('recipesText', text);
                
                // Display formatted version with YouTube link detection
                let formattedHTML = text
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/\n/g, '<br>');
                
                // Find and replace YouTube links with beautiful video buttons
                const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+[^\s<>"{}|\\^`\[\]]*)/g;
                formattedHTML = formattedHTML.replace(youtubeRegex, function(url) {
                    const cleanUrl = url.replace(/[.,;!?]+$/, '');
                    return `
<div style="margin: 15px 0; display: inline-block;">
    <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" 
       style="display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%); color: white; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; box-shadow: 0 4px 12px rgba(255,0,0,0.3); transition: all 0.3s ease;"
       onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(255,0,0,0.4)';"
       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(255,0,0,0.3)';">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
        </svg>
        <span>Watch Recipe Video</span>
    </a>
</div>`;
                });
                
                container.innerHTML = `
                    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.8; color: #2c3e50;">
                        ${formattedHTML}
                    </div>
                `;
            } else {
                // Empty content - show placeholder
                container.innerHTML = `
                    <div style="text-align: center; color: #999; padding: 40px 20px;">
                        <p style="font-size: 18px; margin: 0;">👨‍🍳 No recipes yet</p>
                        <p style="font-size: 14px; margin: 10px 0 0 0;">Click ✏️ to create or use "👨‍🍳 Import Recipes"</p>
                    </div>
                `;
                localStorage.removeItem('recipesText');
            }
        }
        
    } else {
        // ENTER EDIT MODE
        button.classList.add('active');
        button.textContent = '💾';
        button.title = 'Save';
        
        // Get existing text or create empty editable area
        const existingText = localStorage.getItem('recipesText') || '';
        
        container.innerHTML = `
            <div contenteditable="true" 
                 style="min-height: 200px; 
                        padding: 20px; 
                        border: 2px dashed #667eea; 
                        border-radius: 12px; 
                        background: white; 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                        line-height: 1.8; 
                        color: #2c3e50; 
                        font-size: 16px;
                        outline: none;
                        white-space: pre-wrap;"
                 placeholder="Type your recipe here...
                 
Example:
🍝 Easy Pasta Recipe

Ingredients:
- 200g pasta
- 2 cloves garlic
- Olive oil
- Salt & pepper

Instructions:
1. Boil pasta for 8-10 minutes
2. Fry garlic in olive oil
3. Mix pasta with garlic oil
4. Season and serve!

Video: https://youtube.com/watch?v=...">${existingText}</div>
        `;
        
        // Focus and place cursor at end
        const editableDiv = container.querySelector('[contenteditable]');
        if (editableDiv) {
            editableDiv.focus();
            // Place cursor at end
            const range = document.createRange();
            const sel = window.getSelection();
            if (editableDiv.childNodes.length > 0) {
                range.setStart(editableDiv.childNodes[editableDiv.childNodes.length - 1], editableDiv.textContent.length);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }
}

console.log('✅ Edit mode functions added!');
