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
    
    if (!input) {
        alert('⚠️ Please paste schedule first!');
        return;
    }
    
    try {
        parseAndCreateSchedule(input);
        closeImportSchedule();
        document.getElementById('scheduleInput').value = '';
        
        const daysCreated = Object.keys(scheduleData.days).length;
        alert(`🎉 SUCCESS!\n\n${daysCreated} day${daysCreated > 1 ? 's' : ''} imported!`);
    } catch (error) {
        console.error('Import error:', error);
        alert(`❌ Error: ${error.message}\n\nCheck console (F12) for details.`);
    }
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
        // Just display the formatted text with nice styling!
        const container = document.getElementById('shoppingDisplay');
        
        // Convert text to HTML with preserved formatting
        let formattedHTML = input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\n/g, '<br>');
        
        // Wrap in a styled container
        container.innerHTML = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.8; color: #2c3e50;">
                ${formattedHTML}
            </div>
        `;
        
        // Save to localStorage
        localStorage.setItem('shoppingListText', input);
        
        closeImportShopping();
        document.getElementById('shoppingInput').value = '';
        
        // Switch to shopping tab
        document.querySelector('[data-tab="shopping"]').click();
        
        alert(`🛒 SUCCESS!\n\nYour beautifully formatted shopping list is now displayed!\n\nCheck the Shopping tab!`);
        
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
        
        // Display in container
        const container = document.getElementById('recipesDisplay');
        container.innerHTML = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.8; color: #2c3e50;">
                ${formattedHTML}
            </div>
        `;
        
        // Save to localStorage
        localStorage.setItem('recipesText', input);
        
        closeImportRecipes();
        document.getElementById('recipesInput').value = '';
        
        // Switch to recipes tab
        document.querySelector('[data-tab="recipes"]').click();
        
        const videoCount = (input.match(youtubeRegex) || []).length;
        const videoMsg = videoCount > 0 ? `\n\n✨ ${videoCount} video button${videoCount > 1 ? 's' : ''} added!` : '';
        
        alert(`👨‍🍳 SUCCESS!\n\nYour beautifully formatted recipes are now displayed!${videoMsg}\n\nCheck the Recipes tab!`);
        
    } catch (error) {
        console.error('Recipes import error:', error);
        alert(`❌ Error: ${error.message}`);
    }
}

console.log('✅ Import functions loaded!');
