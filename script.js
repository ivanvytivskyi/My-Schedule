// ========================================
// SCHEDULE MANAGER V5.1 - Main JavaScript
// ========================================

// Common title suggestions
const commonTitles = [
    '🌅 Morning Routine',
    '🍳 Breakfast',
    '🚿 Shower & Get Ready',
    '💼 Work',
    '📚 Study Session',
    '🍽️ Lunch Break',
    '☕ Coffee Break',
    '🍴 Dinner',
    '🏋️ Exercise / Gym',
    '🚴 Bike Ride',
    '👨‍🍳 Cooking',
    '🛒 Shopping',
    '🧹 Cleaning',
    '📖 Reading',
    '✍️ Writing',
    '💻 Coding Project',
    '👥 Meeting',
    '📱 Phone Calls',
    '📧 Email Time',
    '😌 Relaxation',
    '🎮 Gaming',
    '📺 TV / Entertainment',
    '🌙 Evening Routine',
    '😴 Sleep',
    '🧘 Meditation',
    '🎵 Music Practice'
];

// Emoji suggestions based on keywords
const emojiMap = {
    'morning': ['🌅', '☀️', '🌄', '🌞'],
    'breakfast': ['🍳', '🥞', '🥐', '☕'],
    'lunch': ['🍽️', '🥗', '🍕', '🍜'],
    'dinner': ['🍴', '🍖', '🍝', '🍲'],
    'study': ['📚', '📖', '✏️', '🎓'],
    'work': ['💼', '👔', '💻', '🏢'],
    'exercise': ['🏃', '💪', '🏋️', '🚴'],
    'gym': ['🏋️', '💪', '🏃'],
    'sleep': ['😴', '🌙', '🛏️', '💤'],
    'shower': ['🚿', '🛁', '🧼'],
    'shopping': ['🛒', '🛍️', '🏪'],
    'cooking': ['👨‍🍳', '🍳', '🔥'],
    'cleaning': ['🧹', '🧽', '🧼'],
    'meeting': ['👥', '🤝', '💼'],
    'phone': ['📱', '☎️', '📞'],
    'email': ['📧', '✉️', '📬'],
    'reading': ['📖', '📚', '📰'],
    'writing': ['✍️', '📝', '✏️'],
    'relaxing': ['😌', '🧘', '🛋️'],
    'relax': ['😌', '🧘', '🛋️'],
    'travel': ['🚗', '🚆', '✈️', '🚴'],
    'bike': ['🚴', '🚲'],
    'coffee': ['☕', '☕'],
    'tea': ['🍵', '☕'],
    'music': ['🎵', '🎶', '🎸'],
    'game': ['🎮', '🕹️'],
    'tv': ['📺', '🎬'],
    'meditation': ['🧘', '🕉️'],
    'coding': ['💻', '⌨️', '🖥️'],
    'project': ['💼', '📊', '📈']
};

// Month-specific emojis
function getMonthEmoji(monthName) {
    const monthEmojis = {
        'January': '❄️',
        'February': '💝',
        'March': '🌸',
        'April': '🌷',
        'May': '🌺',
        'June': '☀️',
        'July': '🏖️',
        'August': '🌻',
        'September': '🍂',
        'October': '🎃',
        'November': '🍁',
        'December': '🎄'
    };
    return monthEmojis[monthName] || '📅';
}

// Get current month with emoji
function getCurrentMonthWithEmoji() {
    const now = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const emoji = getMonthEmoji(monthName);
    return `${monthName} ${year} ${emoji}`;
}

// Default schedule data structure
let scheduleData = {
    userName: 'Name',
    dateInfo: getCurrentMonthWithEmoji(),
    events: [],
    days: {},
    defaultBlocks: [], // Default blocks that can be applied to all days
    shopping: [],
    recipes: []
};

let currentEditingBlock = null;
let currentEditingDay = null;
let currentDay = null;
let autoScrollTimeout = null;
let isToday = false;
const PROMPT_FORM_STORAGE_KEY = 'promptGeneratorFormState_v1';
const WORK_MEAL_STRATEGIES = {
    COOK_MORNING: 'cook_morning',
    COOK_EVENING: 'cook_evening',
    BUY: 'buy'
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", function () {
    loadFromLocalStorage();
    initializeApp();
    setupModeButtons();
    setupNameEditing();
    setupDateEditing();
    setupTimePicker();
    setupTitleSuggestions();
    startLiveClock();
    setupScrollButton();
    populateBlockRecipeSelect();
});

function initializeApp() {
    try {
        // Don't auto-create a week - let user import or manually add days
        if (!scheduleData.days || Object.keys(scheduleData.days).length === 0) {
            console.log('No days loaded - schedule is empty. Use Import or Add Day to get started.');
            scheduleData.days = {};
        }

        renderDayTabs();
        renderSchedule();
        renderEvents();
        renderShopping();
        renderRecipes();
        setupNavigation();
        setupDayNavigation();
        
        // Set default active day to today if available
        setDefaultActiveDay();

        // Update highlighting every minute
        setInterval(() => {
            if (currentDay && isToday) {
                updateCurrentTimeHighlight(currentDay);
            }
        }, 60000);
        
        console.log('App initialized successfully!');
    } catch (error) {
        console.error('Initialization error:', error);
        showErrorScreen(error.message);
    }
}

function showErrorScreen(errorMsg) {
    const container = document.getElementById('scheduleContent');
    container.innerHTML = `
        <div style="background: white; border-radius: 15px; padding: 40px; text-align: center; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #ff6b6b; margin-bottom: 20px;">⚠️ Something went wrong!</h2>
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Error: ${errorMsg}</p>
            <button onclick="resetApp()" style="background: #ff6b6b; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600; margin-right: 10px;">
                🔄 Reset App
            </button>
            <button onclick="location.reload()" style="background: #667eea; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
                ↻ Reload Page
            </button>
        </div>
    `;
}

function resetApp() {
    if (confirm('⚠️ This will delete all your data and start fresh. Are you sure?')) {
        localStorage.clear();
        location.reload();
    }
}

function createDefaultWeek() {
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayKey = `day_${date.getTime()}`;
        const dayName = getDayName(date); // Use actual day name from calendar
        
        scheduleData.days[dayKey] = {
            name: dayName,
            date: date.toISOString().split('T')[0],
            displayDate: date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
            subtitle: 'Plan your day',
            motivation: '✨ Make today count!',
            blocks: [] // Empty blocks - user can add default blocks via "Apply to all days"
        };
    }
    saveToLocalStorage();
    
    const uniqueRecipeIDs = [...detectedRecipeIDs];
}

function setDefaultActiveDay() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Find today's day in schedule
    let todayDayKey = null;
    for (const dayKey in scheduleData.days) {
        if (scheduleData.days[dayKey].date === todayStr) {
            todayDayKey = dayKey;
            break;
        }
    }
    
    // If today exists, use it; otherwise use first day
    const defaultDayKey = todayDayKey || Object.keys(scheduleData.days)[0];
    
    if (defaultDayKey) {
        currentDay = defaultDayKey;
        isToday = (defaultDayKey === todayDayKey);
        showDay(defaultDayKey);
        
        // Set active tab
        setTimeout(() => {
            const defaultTab = document.querySelector(`.day-tab[data-day="${defaultDayKey}"]`);
            if (defaultTab) {
                document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
                defaultTab.classList.add('active');
            }
            
            // Scroll to show the active tab
            updateNavButtons();
        }, 100);
        
        // Auto-scroll to current time if it's today
        if (isToday) {
            setTimeout(() => scrollToCurrentTime(), 500);
        }
    } else {
        // No days exist - show welcome screen
        showWelcomeScreen();
    }
}

function showWelcomeScreen() {
    const container = document.getElementById('scheduleContent');
    container.innerHTML = `
        <div style="background: white; border-radius: 15px; padding: 40px; text-align: center; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #667eea; margin-bottom: 20px; font-size: 32px;">👋 Welcome to Your Schedule Manager!</h2>
            <p style="color: #666; font-size: 18px; margin-bottom: 30px; line-height: 1.6;">
                Your schedule is empty. Let's get started by adding your first day or week!
            </p>
            <div style="margin: 30px 0;">
                <h3 style="color: #2d3436; margin-bottom: 15px;">Quick Start:</h3>
                <ol style="text-align: left; max-width: 500px; margin: 0 auto; line-height: 2;">
                    <li>Click <strong>"Edit"</strong> mode button above</li>
                    <li>Click the <strong>➕</strong> button in the navigation bar</li>
                    <li>Choose "Single Day" or "Whole Week"</li>
                    <li>Enter a date and click Add</li>
                    <li>Start scheduling! 🎉</li>
                </ol>
            </div>
            <button onclick="document.getElementById('toggleModeBtn').click(); setTimeout(() => document.getElementById('addDayBtn').click(), 100);" 
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; border: none; border-radius: 10px; cursor: pointer; font-size: 18px; font-weight: 600; margin-top: 20px; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);">
                🚀 Get Started
            </button>
        </div>
    `;
}

// ========================================
// MODE SWITCHING
// ========================================

function setupModeButtons() {
    const toggleBtn = document.getElementById('toggleModeBtn');
    const calendarSection = document.getElementById('calendarSection');
    const editSection = document.getElementById('editSection');
    
    if (!toggleBtn) {
        console.error('Toggle button not found!');
        return;
    }
    
    let isEditMode = false;
    
    // Initialize edit mode state
    function switchToCalendarMode() {
        isEditMode = false;
        
        // Update button visuals
        calendarSection.style.background = 'linear-gradient(135deg, #7B68EE, #6B5FD8)';
        editSection.style.background = '#FFD700';
        
        // Update app state
        document.body.classList.remove('edit-mode');
        hideEditElements();
        
        // Show entire date section in Calendar mode
        const dateInfoContainer = document.getElementById('dateInfoContainer');
        if (dateInfoContainer) dateInfoContainer.style.display = 'block';
        
        // Disable shopping edit mode
        disableShoppingEditMode();
        
        // Disable Quick Add edit mode
        window.quickAddEditMode = false;
        
        // Re-render Quick Add modal if it's open
        const quickAddModal = document.getElementById('quickAddModal');
        if (quickAddModal && quickAddModal.classList.contains('active')) {
            renderQuickAddModal();
        }
    }
    
    function switchToEditMode() {
        isEditMode = true;
        
        // Update button visuals
        calendarSection.style.background = '#FFD700';
        editSection.style.background = 'linear-gradient(135deg, #7B68EE, #6B5FD8)';
        
        // Update app state
        document.body.classList.add('edit-mode');
        showEditElements();
        
        // Hide entire date section in Edit mode
        const dateInfoContainer = document.getElementById('dateInfoContainer');
        if (dateInfoContainer) dateInfoContainer.style.display = 'none';
        
        // Enable shopping edit mode
        enableShoppingEditMode();
        
        // Enable Quick Add edit mode
        window.quickAddEditMode = true;
        
        // Re-render Quick Add modal if it's open
        const quickAddModal = document.getElementById('quickAddModal');
        if (quickAddModal && quickAddModal.classList.contains('active')) {
            renderQuickAddModal();
        }
    }
    
    // Toggle button click handler
    toggleBtn.addEventListener('click', () => {
        if (isEditMode) {
            switchToCalendarMode();
        } else {
            switchToEditMode();
        }
    });
    
    // Initialize to calendar mode
    switchToCalendarMode();
    
    if (manageDefaultsBtn) {
        manageDefaultsBtn.addEventListener('click', () => {
            openDefaultsModal();
        });
    }
}

function hideEditElements() {
    document.querySelectorAll('.edit-col').forEach(el => el.style.display = 'none');
    const addShoppingItem = document.getElementById('addShoppingItem');
    if (addShoppingItem) addShoppingItem.style.display = 'none';
    const addRecipeItem = document.getElementById('addRecipeItem');
    if (addRecipeItem) addRecipeItem.style.display = 'none';
}

function showEditElements() {
    document.querySelectorAll('.edit-col').forEach(el => el.style.display = 'table-cell');
    const addShoppingItem = document.getElementById('addShoppingItem');
    if (addShoppingItem) addShoppingItem.style.display = 'block';
    const addRecipeItem = document.getElementById('addRecipeItem');
    if (addRecipeItem) addRecipeItem.style.display = 'block';
}

// ========================================
// NAME AND DATE EDITING
// ========================================

function setupNameEditing() {
    const staticName = document.getElementById('staticName');
    const editableName = document.getElementById('editableName');

    staticName.textContent = scheduleData.userName;
    editableName.value = scheduleData.userName;

    editableName.addEventListener('change', () => {
        scheduleData.userName = editableName.value;
        staticName.textContent = editableName.value;
        saveToLocalStorage();
    });

    editableName.addEventListener('input', () => {
        editableName.style.width = ((editableName.value.length + 2) * 12) + 'px';
    });
}

function setupDateEditing() {
    const dateDisplay = document.getElementById('dateDisplay');
    const editableDate = document.getElementById('editableDate');

    // Function to update date display based on current days
    function updateDateDisplayFromCalendar() {
        const days = Object.values(scheduleData.days);
        if (days.length === 0) {
            dateDisplay.textContent = 'No schedule yet';
            editableDate.value = 'No schedule yet';
            scheduleData.dateInfo = 'No schedule yet';
            return;
        }
        
        // Get all dates and find the most common month/year
        const monthCounts = {};
        days.forEach(day => {
            if (day.date) {
                const date = new Date(day.date);
                const monthName = date.toLocaleDateString('en-GB', { month: 'long' });
                const year = date.getFullYear();
                const monthYear = `${monthName} ${year}`;
                monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
            }
        });
        
        // Find most common month
        let maxCount = 0;
        let currentMonth = getCurrentMonthWithEmoji();
        for (const [monthYear, count] of Object.entries(monthCounts)) {
            if (count > maxCount) {
                maxCount = count;
                // Extract month name to get emoji
                const monthName = monthYear.split(' ')[0];
                const emoji = getMonthEmoji(monthName);
                currentMonth = monthYear + ' ' + emoji;
            }
        }
        
        dateDisplay.textContent = currentMonth;
        editableDate.value = currentMonth;
        scheduleData.dateInfo = currentMonth;
        saveToLocalStorage();
    }
    
    // Update on load
    updateDateDisplayFromCalendar();
    
    // Make date field read-only
    editableDate.setAttribute('readonly', 'true');
    editableDate.style.cursor = 'not-allowed';
    editableDate.style.opacity = '0.7';
    editableDate.title = 'Month auto-updates from your schedule';
    
    // Store globally so it can be called after adding/deleting days
    window.updateDateDisplayFromCalendar = updateDateDisplayFromCalendar;
}

// ========================================
// TIME PICKER
// ========================================

function setupTimePicker() {
    // Auto-update blockTime when start/end times change
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const blockTimeInput = document.getElementById('blockTime');
    
    function updateBlockTime() {
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        
        if (startTime && endTime) {
            blockTimeInput.value = `${startTime}-${endTime}`;
        } else if (startTime) {
            blockTimeInput.value = `${startTime}-`;
        } else {
            blockTimeInput.value = '';
        }
    }
    
    if (startTimeInput) {
        startTimeInput.addEventListener('change', updateBlockTime);
        startTimeInput.addEventListener('input', updateBlockTime);
    }
    
    if (endTimeInput) {
        endTimeInput.addEventListener('change', updateBlockTime);
        endTimeInput.addEventListener('input', updateBlockTime);
    }
}

// Removed applyTimePicker function - no longer needed

// ========================================
// TITLE SUGGESTIONS
// ========================================

function setupTitleSuggestions() {
    const titleSuggestBtn = document.getElementById('titleSuggestBtn');
    const titleSuggestions = document.getElementById('titleSuggestions');
    const titleInput = document.getElementById('blockTitle');
    
    if (!titleSuggestBtn || !titleSuggestions || !titleInput) {
        console.warn('Title suggestions elements not found');
        return;
    }
    
    titleSuggestBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('📋 Title suggestions button clicked!');
        console.log('Current display:', titleSuggestions.style.display);
        
        if (titleSuggestions.style.display === 'none' || !titleSuggestions.style.display) {
            titleSuggestions.style.display = 'block';
            titleSuggestions.innerHTML = '';
            
            console.log('Adding', commonTitles.length, 'title suggestions');
            
            commonTitles.forEach(title => {
                const div = document.createElement('div');
                div.className = 'title-suggestion-item';
                div.textContent = title;
                div.onclick = () => {
                    titleInput.value = title;
                    titleSuggestions.style.display = 'none';
                    showEmojiSuggestions(title);
                };
                titleSuggestions.appendChild(div);
            });
        } else {
            titleSuggestions.style.display = 'none';
        }
    });
    
    // Show emoji suggestions as user types
    titleInput.addEventListener('input', (e) => {
        showEmojiSuggestions(e.target.value);
        
        // Limit to one emoji - comprehensive regex for ALL emojis
        const emojiRegex = /[\u{1F300}-\u{1F9FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F600}-\u{1F64F}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}]/gu;
        const emojis = e.target.value.match(emojiRegex) || [];
        
        if (emojis.length > 1) {
            // Keep only the first emoji
            let cleaned = e.target.value;
            // Remove all emojis
            cleaned = cleaned.replace(emojiRegex, '');
            // Add back the first emoji at the start
            e.target.value = emojis[0] + ' ' + cleaned.trim();
            
            // Show warning
            const errorMsg = document.getElementById('errorMessage');
            errorMsg.textContent = '⚠️ Only one emoji allowed! Keeping the first emoji.';
            errorMsg.classList.add('show');
            setTimeout(() => {
                errorMsg.classList.remove('show');
            }, 2000);
        }
    });
}

function showEmojiSuggestions(title) {
    const container = document.getElementById('emojiSuggestions');
    const titleLower = title.toLowerCase();
    let emojis = [];

    for (const keyword in emojiMap) {
        if (titleLower.includes(keyword)) {
            emojis = emojis.concat(emojiMap[keyword]);
        }
    }

    if (emojis.length === 0) {
        container.innerHTML = '';
        return;
    }

    emojis = [...new Set(emojis)];

    let html = '<div style="font-size: 12px; color: #666; margin-bottom: 5px;">Suggested emojis:</div>';
    emojis.slice(0, 8).forEach(emoji => {
        html += `<button type="button" class="emoji-btn" onclick="addEmojiToTitle('${emoji}')">${emoji}</button>`;
    });

    container.innerHTML = html;
}

function addEmojiToTitle(emoji) {
    const titleInput = document.getElementById('blockTitle');
    // Remove any existing emojis from the title - comprehensive regex
    const emojiRegex = /[\u{1F300}-\u{1F9FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F600}-\u{1F64F}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}]\s*/gu;
    let title = titleInput.value.replace(emojiRegex, '').trim();
    // Add the new emoji at the start
    titleInput.value = `${emoji} ${title}`;
    
    // Trigger input event to update emoji suggestions
    titleInput.dispatchEvent(new Event('input'));
}

// ========================================
// DATE PARSING
// ========================================

function parseFlexibleDate(dateStr) {
    // Remove extra spaces
    dateStr = dateStr.trim();
    
    // Try various formats
    const formats = [
        // dd/mm/yyyy or dd-mm-yyyy
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
        // dd/mm/yy or dd-mm-yy
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/,
        // yyyy-mm-dd or yyyy/mm/dd
        /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,
    ];
    
    for (let i = 0; i < formats.length; i++) {
        const match = dateStr.match(formats[i]);
        if (match) {
            if (i === 0 || i === 1) {
                // dd/mm/yyyy or dd/mm/yy format
                let day = parseInt(match[1]);
                let month = parseInt(match[2]);
                let year = parseInt(match[3]);
                
                // Handle 2-digit year
                if (i === 1) {
                    year = year < 50 ? 2000 + year : 1900 + year;
                }
                
                // Validate
                if (day > 0 && day <= 31 && month > 0 && month <= 12) {
                    return new Date(year, month - 1, day);
                }
            } else if (i === 2) {
                // yyyy-mm-dd format
                let year = parseInt(match[1]);
                let month = parseInt(match[2]);
                let day = parseInt(match[3]);
                
                if (day > 0 && day <= 31 && month > 0 && month <= 12) {
                    return new Date(year, month - 1, day);
                }
            }
        }
    }
    
    return null;
}

function getDayName(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

// ========================================
// EVENTS
// ========================================

function renderEvents() {
    const container = document.getElementById('eventsContainer');
    let html = '';

    scheduleData.events.forEach((event, index) => {
        const eventDate = new Date(event.date);
        const now = new Date();
        const diff = eventDate.getTime() - now.getTime();
        
        let countdown = '';
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            countdown = `${days}d ${hours}h`;
        } else {
            countdown = 'Completed! 🎉';
        }

        html += `
            <div class="event-box ${event.color}">
                <div class="event-edit-controls">
                    <button class="event-delete-btn" onclick="deleteEvent(${index})">✕</button>
                </div>
                <h3>${event.name}</h3>
                <div class="time">${countdown}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function openEventModal() {
    document.getElementById('eventModal').classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    document.getElementById('eventForm').reset();
}

document.getElementById('eventForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('eventName').value;
    const date = document.getElementById('eventDate').value;
    const color = document.querySelector('input[name="color"]:checked').value;

    scheduleData.events.push({ name, date, color });
    renderEvents();
    saveToLocalStorage();
    closeEventModal();
});

function deleteEvent(index) {
    if (confirm('Delete this event?')) {
        scheduleData.events.splice(index, 1);
        renderEvents();
        saveToLocalStorage();
    }
}

// ========================================
// DAY MANAGEMENT
// ========================================

function renderDayTabs() {
    const container = document.getElementById('dayTabsContainer');
    
    // Check if days object exists and has entries
    if (!scheduleData.days || Object.keys(scheduleData.days).length === 0) {
        console.warn('No days to render!');
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No days yet. Click Edit mode and add a day to start!</div>';
        return;
    }
    
    let html = '';

    // Sort days by date
    const sortedDays = Object.entries(scheduleData.days).sort((a, b) => {
        return new Date(a[1].date) - new Date(b[1].date);
    });
    
    console.log('Rendering', sortedDays.length, 'day tabs');

    sortedDays.forEach(([dayKey, day]) => {
        html += `
            <div class="day-tab" data-day="${dayKey}">
                <button class="day-delete-btn" onclick="deleteDay('${dayKey}', event)">✕</button>
                <div class="day-name">${day.name}</div>
                <div class="day-date">${day.displayDate}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function deleteDay(dayKey, event) {
    event.stopPropagation();
    
    // Delete day instantly without confirmation
    delete scheduleData.days[dayKey];
    renderDayTabs();
    renderSchedule();
    saveToLocalStorage();
    
    // Check if any days left
    if (Object.keys(scheduleData.days).length === 0) {
        // Show empty message
        const scheduleContent = document.getElementById('scheduleContent');
        scheduleContent.innerHTML = `
            <div style="background: white; border-radius: 15px; padding: 40px; text-align: center; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #667eea; margin-bottom: 20px;">📅 No Days Added Yet</h2>
                <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Add a day to start scheduling!</p>
                <button onclick="document.getElementById('addDayBtn').click()" style="background: #4caf50; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">
                    ➕ Add Your First Day
                </button>
            </div>
        `;
        currentDay = null;
        isToday = false;
    } else {
        // Show next available day
        const firstDay = Object.keys(scheduleData.days)[0];
        if (firstDay) {
            currentDay = firstDay;
            showDay(firstDay);
            
            // Set active tab and scroll to it
            setTimeout(() => {
                const firstTab = document.querySelector(`.day-tab[data-day="${firstDay}"]`);
                if (firstTab) {
                    document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
                    firstTab.classList.add('active');
                }
                updateNavButtons();
            }, 100);
        }
    }
}

// Add Day/Week Modal
document.getElementById('addDayBtn').addEventListener('click', () => {
    document.getElementById('addDayModal').classList.add('active');
});

function closeAddDayModal() {
    document.getElementById('addDayModal').classList.remove('active');
    document.getElementById('addDayForm').reset();
    document.getElementById('dayDateGroup').style.display = 'block';
    document.getElementById('weekDateGroup').style.display = 'none';
    document.getElementById('workScheduleGroup').style.display = 'none';
}

// Handle add type radio buttons
document.querySelectorAll('input[name="addType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'day') {
            document.getElementById('dayDateGroup').style.display = 'block';
            document.getElementById('weekDateGroup').style.display = 'none';
            document.getElementById('workScheduleGroup').style.display = 'none';
        } else {
            document.getElementById('dayDateGroup').style.display = 'none';
            document.getElementById('weekDateGroup').style.display = 'block';
            document.getElementById('workScheduleGroup').style.display = 'block';
        }
    });
});

// Handle work schedule checkbox
document.getElementById('addWorkSchedule').addEventListener('change', (e) => {
    document.getElementById('workScheduleDetails').style.display = e.target.checked ? 'block' : 'none';
});

// Handle commute checkbox
document.getElementById('addCommute').addEventListener('change', (e) => {
    document.getElementById('commuteSettings').style.display = e.target.checked ? 'block' : 'none';
});

// Handle individual work day checkboxes to show/hide time inputs
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('work-day-check')) {
        const workDayItem = e.target.closest('.work-day-item');
        const timesDiv = workDayItem.querySelector('.work-day-times');
        timesDiv.style.display = e.target.checked ? 'block' : 'none';
    }
});

document.getElementById('addDayForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const addType = document.querySelector('input[name="addType"]:checked').value;
    
    if (addType === 'day') {
        addSingleDay();
    } else {
        addWeek();
    }
    
    closeAddDayModal();
});

function addSingleDay() {
    const dateStr = document.getElementById('dayDate').value;
    
    if (!dateStr) {
        alert('Please enter a date!');
        return;
    }
    
    const date = parseFlexibleDate(dateStr);
    
    if (!date) {
        alert('Invalid date format! Please use dd/mm/yyyy, yyyy-mm-dd, or similar.');
        return;
    }
    
    const dateKey = date.toISOString().split('T')[0];
    
    // Check if this date already exists
    for (const dayKey in scheduleData.days) {
        if (scheduleData.days[dayKey].date === dateKey) {
            alert('⚠️ This date already exists!\n\nDate: ' + dateKey + '\nPlease choose a different date.');
            return;
        }
    }
    
    const dayKey = `day_${date.getTime()}`;
    const dayName = getDayName(date);
    
    // Start with empty blocks
    const blocks = [];
    
    // Add default blocks if any (only enabled ones that match this day)
    if (scheduleData.defaultBlocks && scheduleData.defaultBlocks.length > 0) {
        scheduleData.defaultBlocks.forEach(defaultBlock => {
            // Check if enabled (default to true for old blocks)
            const isEnabled = defaultBlock.enabled !== false;
            
            // Check if this block applies to this day
            const days = defaultBlock.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const appliesToThisDay = days.includes(dayName);
            
            if (isEnabled && appliesToThisDay) {
                blocks.push({...defaultBlock}); // Copy the block
            }
        });
    }
    
    scheduleData.days[dayKey] = {
        name: dayName,
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
        subtitle: 'Plan your day',
        motivation: '✨ Make today count!',
        blocks: blocks
    };
    
    renderDayTabs();
    renderSchedule();
    saveToLocalStorage();
    
    // Activate new day
    showDay(dayKey);
    
    // Set active class on tab
    setTimeout(() => {
        const newTab = document.querySelector(`.day-tab[data-day="${dayKey}"]`);
        if (newTab) {
            document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
            newTab.classList.add('active');
        }
        updateNavButtons();
    }, 100);
}

function addWeek() {
    const dateStr = document.getElementById('weekStartDate').value;
    
    if (!dateStr) {
        alert('Please enter a start date for the week!');
        return;
    }
    
    const startDate = parseFlexibleDate(dateStr);
    
    if (!startDate) {
        alert('Invalid date format!');
        return;
    }
    
    // Use the selected date as the actual start of the week (no Monday adjustment)
    const weekStart = new Date(startDate);
    
    // Check for duplicate dates before creating the week
    const duplicates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        
        // Check if this date already exists
        for (const dayKey in scheduleData.days) {
            if (scheduleData.days[dayKey].date === dateKey) {
                duplicates.push(dateKey);
                break;
            }
        }
    }
    
    // If any duplicates found, alert and stop
    if (duplicates.length > 0) {
        alert('⚠️ Cannot add week - the following dates already exist:\n\n' + 
              duplicates.join('\n') + 
              '\n\nPlease delete these days first or choose a different week.');
        return;
    }
    
    // Get work schedule if checkbox is checked
    const addWorkSchedule = document.getElementById('addWorkSchedule').checked;
    const workSchedule = {}; // Map of dayOfWeek -> {start, end}
    
    if (addWorkSchedule) {
        const workDayChecks = document.querySelectorAll('.work-day-check:checked');
        workDayChecks.forEach(checkbox => {
            const dayValue = parseInt(checkbox.value);
            const workDayItem = checkbox.closest('.work-day-item');
            const startTime = workDayItem.querySelector('.work-start').value;
            const endTime = workDayItem.querySelector('.work-end').value;
            workSchedule[dayValue] = { start: startTime, end: endTime };
        });
    }
    
    // Get commute settings
    const addCommute = document.getElementById('addCommute').checked;
    const commuteDuration = addCommute ? parseInt(document.getElementById('commuteDuration').value) : 0;
    
    // Helper function to add minutes to a time string
    function addMinutesToTime(timeStr, minutes) {
        const [hours, mins] = timeStr.split(':').map(Number);
        const totalMins = hours * 60 + mins + minutes;
        const newHours = Math.floor(totalMins / 60) % 24;
        const newMins = totalMins % 60;
        return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
    }
    
    // Helper function to subtract minutes from a time string
    function subtractMinutesFromTime(timeStr, minutes) {
        const [hours, mins] = timeStr.split(':').map(Number);
        let totalMins = hours * 60 + mins - minutes;
        if (totalMins < 0) totalMins += 24 * 60; // Handle day wrap
        const newHours = Math.floor(totalMins / 60) % 24;
        const newMins = totalMins % 60;
        return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
    }
    
    // Create 7 days starting from the selected date
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        
        const dayKey = `day_${date.getTime()}`;
        const dayName = getDayName(date);
        const dayOfWeek = date.getDay();
        
        // Start with empty blocks
        const blocks = [];
        
        // Check if this is a work day
        const isWorkDay = addWorkSchedule && workSchedule[dayOfWeek];
        
        if (isWorkDay) {
            // Add commute TO work if enabled
            if (addCommute) {
                const commuteStart = subtractMinutesFromTime(workSchedule[dayOfWeek].start, commuteDuration);
                blocks.push({
                    time: `${commuteStart}-${workSchedule[dayOfWeek].start}`,
                    title: '🚶 Commute to work',
                    tasks: ['Travel to work'],
                    note: '',
                    video: ''
                });
            }
            
            // Add WORK block
            blocks.push({
                time: `${workSchedule[dayOfWeek].start}-${workSchedule[dayOfWeek].end}`,
                title: '💼 Work',
                tasks: ['Work shift'],
                note: '',
                video: ''
            });
            
            // Add commute FROM work if enabled
            if (addCommute) {
                const commuteEnd = addMinutesToTime(workSchedule[dayOfWeek].end, commuteDuration);
                blocks.push({
                    time: `${workSchedule[dayOfWeek].end}-${commuteEnd}`,
                    title: '🚶 Commute home',
                    tasks: ['Travel home'],
                    note: '',
                    video: ''
                });
            }
        }
        
        // ALWAYS add default blocks (for both work and non-work days)
        if (scheduleData.defaultBlocks && scheduleData.defaultBlocks.length > 0) {
            scheduleData.defaultBlocks.forEach(defaultBlock => {
                // Check if enabled (default to true for old blocks)
                const isEnabled = defaultBlock.enabled !== false;
                
                // Check if this block applies to this day
                const days = defaultBlock.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                const appliesToThisDay = days.includes(dayName);
                
                if (isEnabled && appliesToThisDay) {
                    blocks.push({...defaultBlock});
                }
            });
        }
        
        scheduleData.days[dayKey] = {
            name: dayName,
            date: date.toISOString().split('T')[0],
            displayDate: date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
            subtitle: 'Plan your day',
            motivation: '✨ Make today count!',
            blocks: blocks
        };
    }
    
    renderDayTabs();
    renderSchedule();
    saveToLocalStorage();
    
    // Show first day of new week
    const firstDayKey = `day_${monday.getTime()}`;
    showDay(firstDayKey);
    
    // Set active tab and scroll to it
    setTimeout(() => {
        const firstTab = document.querySelector(`.day-tab[data-day="${firstDayKey}"]`);
        if (firstTab) {
            document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
            firstTab.classList.add('active');
        }
        updateNavButtons();
    }, 100);
}

// ========================================
// SCHEDULE RENDERING
// ========================================

function renderSchedule() {
    const container = document.getElementById('scheduleContent');
    let html = '';

    for (const dayKey in scheduleData.days) {
        const day = scheduleData.days[dayKey];
        html += `
            <div class="day-content" id="${dayKey}Content">
                <div class="day-header">
                    <div class="day-header-display">
                        <h2>${day.name} ${day.displayDate}</h2>
                        <div class="subtitle">${day.subtitle}</div>
                        <div class="motivation">${day.motivation}</div>
                    </div>
                    <div class="day-header-edit">
                        <input type="text" value="${day.subtitle}" 
                            onchange="updateDayInfo('${dayKey}', 'subtitle', this.value)" 
                            placeholder="Subtitle" />
                        <textarea onchange="updateDayInfo('${dayKey}', 'motivation', this.value)" 
                            placeholder="Motivation message">${day.motivation}</textarea>
                    </div>
                </div>
        `;

        // Sort blocks chronologically (00:00 today to 00:00 tomorrow)
        // Store original indices before sorting
        const blocksWithIndices = day.blocks.map((block, idx) => ({ block, originalIndex: idx }));
        
        blocksWithIndices.sort((a, b) => {
            const aStartTime = a.block.time.split('-')[0];
            const bStartTime = b.block.time.split('-')[0];
            return aStartTime.localeCompare(bStartTime);
        });

        // Add button at the beginning
        html += `<div class="add-block-container">
            <button class="add-block-btn" onclick="addNewBlock('${dayKey}', -1)">➕</button>
        </div>`;

        blocksWithIndices.forEach((item, displayIndex) => {
            // Pass original index for editing/deleting
            html += renderTimeBlock(dayKey, item.block, item.originalIndex);
            // Add button between blocks - use original index for insertion
            html += `<div class="add-block-container">
                <button class="add-block-btn" onclick="addNewBlock('${dayKey}', ${item.originalIndex})">➕</button>
            </div>`;
        });

        html += `</div>`;
    }

    container.innerHTML = html;
    
    // Update date display to reflect current month
    if (window.updateDateDisplayFromCalendar) {
        window.updateDateDisplayFromCalendar();
    }
}

function populateBlockRecipeSelect() {
    const select = document.getElementById('blockRecipeSelect');
    if (!select) return;
    
    const recipes = typeof getAllRecipes === 'function' ? Object.values(getAllRecipes()) : [];
    const sorted = recipes.sort((a, b) => a.id.localeCompare(b.id));
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">No recipe linked</option>';
    sorted.forEach(recipe => {
        const option = document.createElement('option');
        option.value = recipe.id;
        option.textContent = recipe.name;
        if (recipe.id === currentValue) option.selected = true;
        select.appendChild(option);
    });
}

function updateDayInfo(dayKey, field, value) {
    scheduleData.days[dayKey][field] = value;
    saveToLocalStorage();
}

function renderTimeBlock(dayKey, block, index) {
    const blockId = `${dayKey}-block-${index}`;
    
    let html = `
        <div class="time-block" data-time="${block.time}" data-day="${dayKey}" data-index="${index}">
            <div class="time">${block.time}</div>
            <div class="title">
                ${block.title}
                ${block.video ? `<a href="${block.video}" target="_blank" class="youtube-btn">▶ YouTube</a>` : ''}
                ${block.recipeID ? `
                    <button
                        type="button"
                        onclick="event.stopPropagation(); if (typeof openRecipeModal === 'function') openRecipeModal('${block.recipeID}');"
                        class="recipe-chip"
                        style="display:inline-flex;align-items:center;gap:6px;margin-left:8px;padding:4px 10px;border-radius:999px;background:#f0f4ff;color:#364152;font-size:12px;font-weight:600;vertical-align:middle;border:none;cursor:pointer;box-shadow:0 0 0 1px #d9e2ec inset;">
                        <span style="display:inline-flex;align-items:center;gap:4px;">
                            🍽️ ${block.recipeName || 'Recipe'}
                        </span>
                        ${block.isLeftover ? `<span style="background:#ffe8d9;color:#ad4d00;padding:2px 8px;border-radius:999px;font-weight:700;">Leftover</span>` : ''}
                    </button>
                    ${typeof getCookingCheckboxHTML === 'function' && !block.isLeftover ? getCookingCheckboxHTML(blockId, block.recipeID, block.recipeName || 'Recipe') : ''}
                ` : ''}
            </div>
    `;

    if (block.note) {
        html += `<div class="note">${block.note}</div>`;
    }

    if (block.tasks && block.tasks.length > 0) {
        html += '<div class="tasks">';
        block.tasks.forEach((task, taskIndex) => {
            const taskId = `${blockId}-task-${taskIndex}`;
            const isChecked = localStorage.getItem(taskId) === 'true' ? 'checked' : '';
            html += `
                <div class="task-item">
                    <input type="checkbox" id="${taskId}" ${isChecked} 
                        onchange="saveCheckboxState('${taskId}', this.checked)" />
                    <label for="${taskId}">${task}</label>
                </div>
            `;
        });
        html += '</div>';
    }

    html += `
        <div class="edit-controls">
            <button class="edit-btn" onclick="editBlock('${dayKey}', ${index})" title="Edit">✏️</button>
            <button class="delete-btn" onclick="deleteBlock('${dayKey}', ${index})" title="Delete">🗑️</button>
        </div>
    </div>`;

    return html;
}

function editBlock(dayKey, index) {
    currentEditingDay = dayKey;
    currentEditingBlock = index;
    
    const block = scheduleData.days[dayKey].blocks[index];
    document.getElementById('modalTitle').textContent = 'Edit Time Block';
    populateBlockRecipeSelect();
    
    // Parse and set time inputs
    if (block.time && block.time.includes('-')) {
        const [start, end] = block.time.split('-');
        document.getElementById('startTime').value = start || '';
        document.getElementById('endTime').value = end || '';
        document.getElementById('blockTime').value = block.time;
    } else {
        document.getElementById('startTime').value = '';
        document.getElementById('endTime').value = '';
        document.getElementById('blockTime').value = '';
    }
    
    document.getElementById('blockTitle').value = block.title || '';
    document.getElementById('blockTasks').value = (block.tasks || []).join('\n');
    document.getElementById('blockNote').value = block.note || '';
    document.getElementById('blockVideo').value = block.video || '';
    document.getElementById('blockRecipeSelect').value = block.recipeID || '';
    document.getElementById('blockLeftoverToggle').checked = !!block.isLeftover;
    document.getElementById('applyToAllDays').checked = false;
    
    showEmojiSuggestions(block.title || '');
    document.getElementById('editModal').classList.add('active');
    
    // Re-attach title suggestions (fixes dropdown not working)
    setupTitleSuggestions();
}

function addNewBlock(dayKey, afterIndex) {
    currentEditingDay = dayKey;
    currentEditingBlock = afterIndex + 1;
    
    document.getElementById('modalTitle').textContent = 'Add New Time Block';
    populateBlockRecipeSelect();
    
    // Auto-fill time from previous block
    if (afterIndex >= 0 && scheduleData.days[dayKey].blocks[afterIndex]) {
        const previousBlock = scheduleData.days[dayKey].blocks[afterIndex];
        const previousEndTime = previousBlock.time.split('-')[1];
        // Set start time to previous block's end time
        document.getElementById('blockTime').value = `${previousEndTime}-`;
        
        // Pre-populate time picker
        document.getElementById('startTime').value = previousEndTime;
    } else {
        document.getElementById('blockTime').value = '';
        document.getElementById('startTime').value = '';
    }
    
    document.getElementById('endTime').value = '';
    document.getElementById('blockTitle').value = '';
    document.getElementById('blockTasks').value = '';
    document.getElementById('blockNote').value = '';
    document.getElementById('blockVideo').value = '';
    document.getElementById('blockRecipeSelect').value = '';
    document.getElementById('blockLeftoverToggle').checked = false;
    document.getElementById('applyToAllDays').checked = false;
    document.getElementById('emojiSuggestions').innerHTML = '';
    
    document.getElementById('editModal').classList.add('active');
    
    // Re-attach title suggestions (fixes dropdown not working)
    setupTitleSuggestions();
}

function deleteBlock(dayKey, index) {
    // Delete instantly without confirmation
    scheduleData.days[dayKey].blocks.splice(index, 1);
    renderSchedule();
    showDay(dayKey);
    saveToLocalStorage();
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('errorMessage').classList.remove('show');
    document.getElementById('titleSuggestions').style.display = 'none';
    const recipeSelect = document.getElementById('blockRecipeSelect');
    if (recipeSelect) recipeSelect.value = '';
    const leftoverToggle = document.getElementById('blockLeftoverToggle');
    if (leftoverToggle) leftoverToggle.checked = false;
    currentEditingBlock = null;
    currentEditingDay = null;
}

// Time validation
function timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function checkTimeConflict(dayKey, timeRange, excludeIndex = -1) {
    const [startStr, endStr] = timeRange.split('-');
    let startMin = timeToMinutes(startStr);
    let endMin = timeToMinutes(endStr);

    if (endMin < startMin) {
        endMin += 24 * 60;
    }

    const blocks = scheduleData.days[dayKey].blocks;

    for (let i = 0; i < blocks.length; i++) {
        if (i === excludeIndex) continue;

        const [blockStartStr, blockEndStr] = blocks[i].time.split('-');
        let blockStart = timeToMinutes(blockStartStr);
        let blockEnd = timeToMinutes(blockEndStr);

        if (blockEnd < blockStart) {
            blockEnd += 24 * 60;
        }

        if (!(endMin <= blockStart || startMin >= blockEnd)) {
            return true;
        }
    }

    return false;
}

document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.classList.remove('show');

    const time = document.getElementById('blockTime').value;
    const title = document.getElementById('blockTitle').value;
    const tasks = document.getElementById('blockTasks').value.split('\n').filter(t => t.trim());
    const note = document.getElementById('blockNote').value;
    const video = document.getElementById('blockVideo').value;
    const applyToAll = document.getElementById('applyToAllDays').checked;
    const selectedRecipeId = document.getElementById('blockRecipeSelect').value;
    const isLeftover = document.getElementById('blockLeftoverToggle').checked;
    const selectedRecipe = selectedRecipeId && typeof getRecipe === 'function' ? getRecipe(selectedRecipeId) : null;

    // Validate time format
    if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(time)) {
        errorMsg.textContent = 'Invalid time format! Use HH:MM-HH:MM (e.g., 07:00-08:00)';
        errorMsg.classList.add('show');
        return;
    }

    // Check for single emoji only - comprehensive regex for ALL emojis
    const emojiCount = (title.match(/[\u{1F300}-\u{1F9FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}|\u{1F600}-\u{1F64F}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
    if (emojiCount > 1) {
        errorMsg.textContent = 'Only one emoji allowed in title!';
        errorMsg.classList.add('show');
        return;
    }

    // Check for time conflicts
    if (checkTimeConflict(currentEditingDay, time, currentEditingBlock >= 0 ? currentEditingBlock : -1)) {
        errorMsg.textContent = 'Time conflict! This time overlaps with another task.';
        errorMsg.classList.add('show');
        return;
    }

    const existingBlock = (currentEditingBlock !== null && currentEditingBlock >= 0 && scheduleData.days[currentEditingDay]?.blocks?.[currentEditingBlock])
        ? scheduleData.days[currentEditingDay].blocks[currentEditingBlock]
        : {};
    
    const newBlock = {
        ...existingBlock,
        time: time,
        title: title,
        tasks: tasks,
        note: note,
        video: video,
        recipeID: selectedRecipeId || null,
        recipeName: selectedRecipe ? selectedRecipe.name : (selectedRecipeId ? existingBlock.recipeName || 'Recipe' : null),
        isLeftover: !!isLeftover
    };

    // Apply to current day
    if (currentEditingBlock === -1 || currentEditingBlock >= scheduleData.days[currentEditingDay].blocks.length) {
        scheduleData.days[currentEditingDay].blocks.push(newBlock);
    } else {
        scheduleData.days[currentEditingDay].blocks[currentEditingBlock] = newBlock;
    }

    // Check if recipe has missing ingredients (only if recipe selected)
    if (selectedRecipe && typeof checkMissingIngredients === 'function') {
        const missing = checkMissingIngredients(selectedRecipe);
        if (missing.length > 0) {
            const missingList = missing.map(ing => `• ${ing.display}`).join('\n');
            setTimeout(() => {
                const msg = `⚠️ Recipe added: "${selectedRecipe.name}"\n\n` +
                           `Missing ingredients in Kitchen Stock:\n${missingList}\n\n` +
                           `Generate shopping list?`;
                if (confirm(msg)) {
                    if (typeof generateSmartShopping === 'function') {
                        generateSmartShopping();
                    }
                }
            }, 100);
        }
    }
    
    // Auto-add recipe to "This Week" section (only if not already there)
    if (selectedRecipeId && typeof addRecipeToThisWeek === 'function') {
        if (!selectedRecipesThisWeek.includes(selectedRecipeId)) {
            addRecipeToThisWeek(selectedRecipeId);
        }
    }

    // If "Apply to all days" is checked, add to defaultBlocks for NEW days
    if (applyToAll) {
        const defaultBlock = {
            time: time,
            title: title,
            tasks: tasks,
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            enabled: true
        };
        
        // Check if this block already exists in defaults
        const existingIndex = scheduleData.defaultBlocks.findIndex(b => b.time === time);
        if (existingIndex >= 0) {
            scheduleData.defaultBlocks[existingIndex] = defaultBlock;
        } else {
            scheduleData.defaultBlocks.push(defaultBlock);
        }
        
        alert('✅ Added to default blocks!\n\nThis will appear on all NEW days you create.\n\nManage it in Edit Mode → Manage Defaults.');
    }

    renderSchedule();
    showDay(currentEditingDay);
    saveToLocalStorage();
    closeModal();
});

// ========================================
// TIME TRACKING & AUTO-SCROLL
// ========================================

function showDay(dayKey) {
    currentDay = dayKey;
    
    // Check if this is today
    const today = new Date().toISOString().split('T')[0];
    const dayDate = scheduleData.days[dayKey].date;
    isToday = (dayDate === today);
    
    document.querySelectorAll('.day-content').forEach(c => c.classList.remove('active'));
    const dayContent = document.getElementById(`${dayKey}Content`);
    if (dayContent) {
        dayContent.classList.add('active');
        if (isToday) {
            updateCurrentTimeHighlight(dayKey);
            setTimeout(() => scrollToCurrentTime(), 300);
            startAutoScrollTimer();
        }
    }
    
    // Make sure the tab is visible
    setTimeout(() => updateNavButtons(), 100);
}

function updateCurrentTimeHighlight(dayKey) {
    if (!isToday) return;
    
    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const blocks = document.querySelectorAll(`#${dayKey}Content .time-block`);
    
    // Track past blocks for hiding
    let pastBlocks = [];
    let currentBlockIndex = -1;
    let futureBlockIndex = -1;
    
    blocks.forEach((block, index) => {
        block.classList.remove('current-time', 'past-time', 'hidden-past');
        block.removeAttribute('data-current-time');

        const timeStr = block.dataset.time;
        const [startStr, endStr] = timeStr.split('-');
        
        let startMin = timeToMinutes(startStr);
        let endMin = timeToMinutes(endStr);

        if (endMin < startMin) {
            endMin += 24 * 60;
        }

        if (currentMinutes >= startMin && currentMinutes < endMin) {
            block.classList.add('current-time');
            block.setAttribute('data-current-time', currentTimeStr);
            currentBlockIndex = index;
        } else if (currentMinutes >= endMin) {
            block.classList.add('past-time');
            pastBlocks.push({ block, index });
        } else if (currentMinutes < startMin && futureBlockIndex === -1) {
            // First future block
            futureBlockIndex = index;
        }
    });
    
    // Hide past blocks but keep 3 visible
    // If we have a current block, hide based on that
    // If we're between blocks, hide based on the next future block
    if (pastBlocks.length > 0) {
        const blocksToKeepVisible = 3;
        let blocksToHide;
        
        if (currentBlockIndex >= 0) {
            // Current time is within a block
            blocksToHide = pastBlocks.length - blocksToKeepVisible;
        } else if (futureBlockIndex >= 0) {
            // Current time is between blocks - hide all past blocks except last 3
            blocksToHide = pastBlocks.length - blocksToKeepVisible;
        } else {
            // All blocks are in the past
            blocksToHide = pastBlocks.length - blocksToKeepVisible;
        }
        
        if (blocksToHide > 0) {
            pastBlocks.slice(0, blocksToHide).forEach(item => {
                item.block.classList.add('hidden-past');
            });
        }
    }
    
    // Update time line between blocks
    updateCurrentTimeLine(dayKey, currentMinutes);
}

// NEW: Update current time line between blocks
function updateCurrentTimeLine(dayKey, currentMinutes) {
    // Remove existing time lines
    document.querySelectorAll('.current-time-line').forEach(el => el.remove());
    
    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const currentDateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    
    const blocks = document.querySelectorAll(`#${dayKey}Content .time-block`);
    
    // Find where to insert the time line
    for (let i = 0; i < blocks.length - 1; i++) {
        const currentBlock = blocks[i];
        const nextBlock = blocks[i + 1];
        
        const currentEndTime = currentBlock.dataset.time.split('-')[1];
        const nextStartTime = nextBlock.dataset.time.split('-')[0];
        
        const currentEndMin = timeToMinutes(currentEndTime);
        const nextStartMin = timeToMinutes(nextStartTime);
        
        // Check if current time is between these two blocks
        if (currentMinutes >= currentEndMin && currentMinutes < nextStartMin) {
            // Insert time line after current block
            const timeLine = document.createElement('div');
            timeLine.className = 'current-time-line';
            timeLine.innerHTML = `
                <div class="current-time-line-content">
                    <div class="current-time-date">${currentDateStr}</div>
                    <div class="current-time-now">⏰ NOW</div>
                    <div class="current-time-clock">${currentTimeStr}</div>
                </div>
            `;
            
            // Insert after the current block's parent container
            const addContainer = currentBlock.nextElementSibling;
            if (addContainer && addContainer.classList.contains('add-block-container')) {
                addContainer.after(timeLine);
            } else {
                currentBlock.after(timeLine);
            }
            break;
        }
    }
}

function scrollToCurrentTime() {
    if (!isToday) return;
    
    // First try to scroll to current block
    const currentBlock = document.querySelector('.time-block.current-time');
    if (currentBlock) {
        currentBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    // If no current block, scroll to the current time line (between blocks)
    const currentTimeLine = document.querySelector('.current-time-line');
    if (currentTimeLine) {
        currentTimeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
}

function startAutoScrollTimer() {
    // Clear existing timer
    if (autoScrollTimeout) {
        clearTimeout(autoScrollTimeout);
    }
    
    // Set new timer for 20 seconds
    autoScrollTimeout = setTimeout(() => {
        if (isToday && currentDay) {
            scrollToCurrentTime();
            startAutoScrollTimer(); // Restart timer
        }
    }, 20000);
}

// Reset timer on user scroll
let scrolling = false;
window.addEventListener('scroll', () => {
    if (!scrolling) {
        scrolling = true;
        if (isToday) {
            startAutoScrollTimer();
        }
        setTimeout(() => {
            scrolling = false;
        }, 100);
    }
});

function startLiveClock() {
    setInterval(() => {
        if (currentDay && isToday) {
            updateCurrentTimeHighlight(currentDay);
        }
    }, 1000);
}

// ========================================
// NAVIGATION
// ========================================

function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const contents = document.querySelectorAll(".content");

    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            const tab = item.dataset.tab;
            navItems.forEach((n) => n.classList.remove("active"));
            contents.forEach((c) => c.classList.remove("active"));
            item.classList.add("active");
            document.getElementById(tab + "Content").classList.add("active");
            
            // When clicking schedule tab, switch to today's exact date if available
            if (tab === 'schedule') {
                const today = new Date();
                const todayDateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
                const dayKeys = Object.keys(scheduleData.days);
                
                // Try to find today's exact date
                let todayKey = null;
                for (const key of dayKeys) {
                    if (scheduleData.days[key].date === todayDateStr) {
                        todayKey = key;
                        break;
                    }
                }
                
                // If today's exact date exists, switch to it
                if (todayKey) {
                    const todayTab = document.querySelector(`.day-tab[data-day="${todayKey}"]`);
                    if (todayTab) {
                        todayTab.click();
                    }
                } else {
                    // Today's date doesn't exist - show alert with option to add
                    const todayFormatted = today.toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                    });
                    
                    if (confirm(`Today (${todayFormatted}) is not in your schedule.\n\nWould you like to add it now?`)) {
                        // Open the Add Day modal and pre-fill with today's date
                        document.getElementById('addDayModal').classList.add('active');
                        document.getElementById('dayTypeRadio').checked = true;
                        
                        // Set today's date
                        const dayDate = document.getElementById('dayDate');
                        const singleDayDateInput = document.getElementById('singleDayDateInput');
                        if (dayDate) {
                            dayDate.value = today.toLocaleDateString('en-GB');
                        }
                        if (singleDayDateInput) {
                            singleDayDateInput.value = todayDateStr;
                        }
                        
                        // Switch to Single Day mode
                        switchAddType('day');
                    }
                }
            }
        });
    });
}

function setupDayNavigation() {
    const prevBtn = document.getElementById("prevDay");
    const nextBtn = document.getElementById("nextDay");

    document.addEventListener('click', (e) => {
        const tab = e.target.closest('.day-tab');
        if (tab && !e.target.classList.contains('day-delete-btn')) {
            const dayKey = tab.dataset.day;
            
            document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showDay(dayKey);
            
            // Force scroll update immediately
            setTimeout(() => updateNavButtons(), 50);
        }
    });

    prevBtn.addEventListener("click", () => {
        const tabs = Array.from(document.querySelectorAll('.day-tab'));
        const activeIndex = tabs.findIndex(t => t.classList.contains('active'));
        if (activeIndex > 0) {
            tabs[activeIndex - 1].click();
        }
    });

    nextBtn.addEventListener("click", () => {
        const tabs = Array.from(document.querySelectorAll('.day-tab'));
        const activeIndex = tabs.findIndex(t => t.classList.contains('active'));
        if (activeIndex < tabs.length - 1) {
            tabs[activeIndex + 1].click();
        }
    });

    // Initial update
    setTimeout(() => updateNavButtons(), 100);
}

function updateNavButtons() {
    const tabs = Array.from(document.querySelectorAll('.day-tab'));
    const activeIndex = tabs.findIndex(t => t.classList.contains('active'));
    
    if (activeIndex === -1) {
        console.warn('No active tab found');
        return;
    }
    
    document.getElementById('prevDay').disabled = activeIndex === 0;
    document.getElementById('nextDay').disabled = activeIndex === tabs.length - 1;

    const activeTab = tabs[activeIndex];
    const container = document.querySelector('.day-tabs-container');
    
    if (activeTab && container) {
        // Force reflow to ensure accurate measurements
        container.offsetHeight;
        
        // Get the tab's position relative to the container's scrollable area
        const tabLeft = activeTab.offsetLeft;
        const tabWidth = activeTab.offsetWidth;
        const containerWidth = container.clientWidth;
        
        // ZOOM-INDEPENDENT: Use 25% of container width as offset instead of fixed -300px
        // This works at any zoom level (100%, 75%, 50%, etc.)
        const dynamicOffset = containerWidth * 0.50;
        
        // Calculate position to center the tab with dynamic offset
        const centerPosition = tabLeft + (tabWidth / 2) - (containerWidth / 2) - dynamicOffset;
        
        // Scroll to center the active tab
        container.scrollTo({ 
            left: centerPosition,
            behavior: 'smooth' 
        });
        
        console.log('Centering tab:', activeIndex, 'Position:', centerPosition, 'Offset:', dynamicOffset);
    }
}

function setupScrollButton() {
    const scrollBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// SHOPPING & RECIPES
// ========================================

function renderShopping() {
    const container = document.getElementById('shoppingDisplay');
    
    // Load saved shopping HTML from localStorage
    const quickHTML = localStorage.getItem('shoppingListHTML') || '';
    const hasContent = Boolean(quickHTML);
    
    if (!hasContent) {
        container.innerHTML = '';
    } else {
        // Clean up old Totals row checkboxes from cached HTML
        let cleanedHTML = quickHTML;
        
        // Remove checkboxes from Totals rows (old format had them)
        // Pattern: <td>...<input type="checkbox"...>...Totals:...</td>
        cleanedHTML = cleanedHTML.replace(
            /<td[^>]*>\s*<label[^>]*>[\s\S]*?<input[^>]*type="checkbox"[^>]*>[\s\S]*?Totals:[\s\S]*?<\/label>\s*<\/td>/gi,
            '<td style="padding: 12px; border: 1px solid #ddd; text-align: left;">Totals:</td>'
        );
        
        // Display only Quick Add shopping tables
        container.innerHTML = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                ${cleanedHTML}
            </div>
        `;
        
        // Update recipe shopping display after Quick Add tables are loaded
        if (typeof renderAllShoppingTables === 'function') {
            setTimeout(renderAllShoppingTables, 50);
        }
    }
    decorateShoppingTablesForTrolley();
}

function clearGeneratedShopping() {
    localStorage.removeItem('shoppingListHTML');
    localStorage.removeItem('recipeShoppingListHTML');
    localStorage.removeItem('shoppingTrolleyState');
    localStorage.removeItem('hiddenRecipeShoppingIds');
    if (typeof renderShopping === 'function') renderShopping();
    alert('🗑️ Shopping list cleared.');
}

function ensureShoppingTrolleyStyles() {
    if (document.getElementById('trolleyStyles')) return;
    const style = document.createElement('style');
    style.id = 'trolleyStyles';
    style.textContent = `
        .trolley-checkbox { margin-right: 6px; transform: scale(1.05); }
        .in-trolley td { text-decoration: line-through; color: #6b7280 !important; opacity: 0.75; }
        .shopping-list-block { margin-bottom: 24px; }
        .shopping-list-block .list-delete-btn { background: white; border: 1px solid #d1d5db; border-radius: 6px; padding: 4px 8px; cursor: pointer; font-weight: 700; color: #6b7280; }
        .shopping-list-block .list-delete-btn:hover { background: #fee2e2; color: #b91c1c; }
        .shopping-list-block table { width: 100%; max-width: 100%; }
        .shopping-list-block .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    `;
    document.head.appendChild(style);
}

function loadShoppingTrolleyState() {
    try {
        const raw = localStorage.getItem('shoppingTrolleyState');
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function saveShoppingTrolleyState(state) {
    localStorage.setItem('shoppingTrolleyState', JSON.stringify(state));
}

function toggleRowTrolleyState(row, checked) {
    if (!row) return;
    row.classList.toggle('in-trolley', checked);
}

function decorateShoppingTablesForTrolley() {
    const container = document.getElementById('shoppingDisplay');
    if (!container) return;
    ensureShoppingTrolleyStyles();
    ensureShoppingListBlocks(container);
    attachFoldLabels(container);
    const state = loadShoppingTrolleyState();
    const tables = container.querySelectorAll('table');
    tables.forEach(table => {
        const header = table.previousElementSibling;
        const shopName = header?.querySelector('h3')?.textContent?.trim() || table.dataset.shop || 'Shopping';
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        rows.forEach((row, idx) => {
            if (row.dataset.trolleyDecorated === 'true') return;
            const cells = row.querySelectorAll('td');
            if (!cells.length) return;
            const isTotalsRow = row.classList.contains('totals-row') || 
                               (idx === rows.length - 1 && 
                                (row.textContent.toLowerCase().includes('subtotal') || 
                                 row.textContent.toLowerCase().includes('totals')));
            if (isTotalsRow) return;
            const itemCell = cells[0];
            if (!itemCell) return;
            const existingCheckbox = itemCell.querySelector('.trolley-checkbox');
            if (existingCheckbox) {
                row.dataset.trolleyDecorated = 'true';
                return;
            }
            const itemName = (itemCell.textContent || `item-${idx}`).trim();
            const key = `${shopName}|${itemName}`;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'trolley-checkbox';
            checkbox.checked = Boolean(state[key]);
            
            const updateState = (checked) => {
                state[key] = checked;
                saveShoppingTrolleyState(state);
                toggleRowTrolleyState(row, checked);
            };
            
            checkbox.addEventListener('click', (e) => e.stopPropagation());
            checkbox.addEventListener('change', () => updateState(checkbox.checked));
            itemCell.style.display = 'flex';
            itemCell.style.alignItems = 'center';
            itemCell.style.gap = '8px';
            itemCell.insertBefore(checkbox, itemCell.firstChild);
            row.addEventListener('click', (e) => {
                if (e.target.closest('.trolley-checkbox')) return;
                const next = !checkbox.checked;
                checkbox.checked = next;
                updateState(next);
            });
            toggleRowTrolleyState(row, checkbox.checked);
            row.dataset.trolleyDecorated = 'true';
        });
    });
}

function ensureShoppingListBlocks(container) {
    const tables = container.querySelectorAll('table[data-shop]');
    tables.forEach(table => {
        let block = table.closest('.shopping-list-block');
        if (!block) {
            block = table.parentElement;
            if (!block) return;
            block.classList.add('shopping-list-block');
            block.dataset.shop = table.dataset.shop || block.querySelector('h3')?.textContent?.trim() || 'Shopping';
        } else if (!block.dataset.shop) {
            block.dataset.shop = table.dataset.shop || block.querySelector('h3')?.textContent?.trim() || 'Shopping';
        }
        if (!block.dataset.source) {
            block.dataset.source = block.closest('#recipeLists') ? 'recipes' : 'quick';
        }
    });
    attachShoppingListDeleteButtons(container);
}

function attachShoppingListDeleteButtons(container) {
    const blocks = container.querySelectorAll('.shopping-list-block');
    blocks.forEach(block => {
        if (block.dataset.deleteAttached === 'true') return;
        const header = block.querySelector('summary') || block.querySelector('h3')?.parentElement || block.firstElementChild;
        if (header) {
            header.style.display = 'flex';
            header.style.alignItems = 'center';
            header.style.justifyContent = 'space-between';
            let btn = header.querySelector('.list-delete-btn');
            if (!btn) {
                btn = document.createElement('button');
                btn.textContent = '✕';
                btn.className = 'list-delete-btn';
                header.appendChild(btn);
            }
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const state = loadShoppingTrolleyState();
                const isRecipeBlock = block.closest('#recipeLists');
                const recipeSection = document.getElementById('recipeLists');
                const quickSection = document.getElementById('quickAddLists');
                block.querySelectorAll('tbody tr').forEach(row => {
                    const shopName = block.dataset.shop || 'Shopping';
                    const itemName = (row.querySelector('td')?.textContent || '').trim();
                    const key = `${shopName}|${itemName}`;
                    delete state[key];
                });
                saveShoppingTrolleyState(state);
                const recipeId = block.dataset.recipeId;
                if (recipeId && block.closest('#recipeLists')) {
                    const hidden = loadHiddenRecipeShoppingIds();
                    hidden.add(normalizeRecipeShoppingId(recipeId));
                    saveHiddenRecipeShoppingIds(hidden);
                }
                block.remove();
                
                if (isRecipeBlock) {
                    const html = recipeSection ? recipeSection.innerHTML.trim() : '';
                    if (html) localStorage.setItem('recipeShoppingListHTML', html);
                    else localStorage.removeItem('recipeShoppingListHTML');
                } else {
                    const html = quickSection ? quickSection.innerHTML.trim() : '';
                    if (html) localStorage.setItem('shoppingListHTML', html);
                    else localStorage.removeItem('shoppingListHTML');
                }
            });
        }
        block.dataset.deleteAttached = 'true';
    });
}

function updateFoldLabel(detailsEl) {
    const label = detailsEl.querySelector('.fold-label');
    if (!label) return;
    const openText = label.dataset.open || 'Fold';
    const closedText = label.dataset.closed || 'Unfold';
    label.textContent = detailsEl.hasAttribute('open') ? openText : closedText;
}

function attachFoldLabels(container) {
    const details = container.querySelectorAll('.shopping-list-block details');
    details.forEach(det => {
        updateFoldLabel(det);
        det.addEventListener('toggle', () => updateFoldLabel(det));
    });
}

function normalizeRecipeShoppingId(val) {
    return (val || '').toString().trim().toLowerCase();
}

function loadHiddenRecipeShoppingIds() {
    try {
        const saved = localStorage.getItem('hiddenRecipeShoppingIds');
        const parsed = saved ? JSON.parse(saved) : [];
        const normalized = Array.isArray(parsed) ? parsed.map(normalizeRecipeShoppingId) : [];
        return new Set(normalized);
    } catch {
        return new Set();
    }
}

function saveHiddenRecipeShoppingIds(set) {
    localStorage.setItem('hiddenRecipeShoppingIds', JSON.stringify(Array.from(set || []).map(normalizeRecipeShoppingId)));
}

// Shopping Edit Mode
let shoppingEditMode = false;

function enableShoppingEditMode() {
    if (shoppingEditMode) return; // Already enabled
    
    const container = document.getElementById('shoppingDisplay');
    if (!container) return;
    
    shoppingEditMode = true;
    window.quickAddEditMode = true; // Sync with Quick Add
    
    // Enable edit mode - make table cells editable
    const tables = container.querySelectorAll('table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr:not(:last-child)');
        rows.forEach(row => {
            if (row.classList.contains('totals-row')) return;
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (cell.querySelector('.trolley-checkbox')) return;
                if (index < 4) { // Item, Unit, Price, Quantity
                    cell.contentEditable = 'true';
                    cell.style.background = '#fffacd';
                    cell.style.cursor = 'text';
                    
                    // Add input listener for auto-recalculation
                    if (index === 2 || index === 3) { // Price or Quantity
                        cell.addEventListener('input', () => recalculateShopTotals(table));
                    }
                }
            });
        });
    });
    
    // Add instruction
    const instruction = document.createElement('div');
    instruction.id = 'editInstruction';
    instruction.style.cssText = 'position: sticky; top: 0; background: #667eea; color: white; padding: 10px; text-align: center; border-radius: 8px; margin-bottom: 10px; z-index: 100;';
    instruction.innerHTML = '✏️ Edit Mode Active - Edit items, prices, quantities. Totals recalculate automatically! Quick Add also in edit mode.';
    container.insertBefore(instruction, container.firstChild);
}

function disableShoppingEditMode() {
    if (!shoppingEditMode) return; // Already disabled
    
    const container = document.getElementById('shoppingDisplay');
    if (!container) return;
    
    shoppingEditMode = false;
    window.quickAddEditMode = false;
    
    // Disable edit mode
    const tables = container.querySelectorAll('table');
    tables.forEach(table => {
        const cells = table.querySelectorAll('td[contenteditable="true"]');
        cells.forEach(cell => {
            cell.contentEditable = 'false';
            cell.style.background = '';
            cell.style.cursor = '';
        });
    });
    
    // Remove instruction
    const instruction = document.getElementById('editInstruction');
    if (instruction) {
        instruction.remove();
    }
    
    // Save the edited HTML
    const editedHTML = container.innerHTML;
    localStorage.setItem('shoppingListHTML', editedHTML);
}

function recalculateShopTotals(table) {
    const rows = table.querySelectorAll('tbody tr');
    let totalPrice = 0;
    let totalQty = 0;
    
    rows.forEach(row => {
        const isTotalsRow = row.classList.contains('totals-row');
        const priceCell = row.querySelector('.price-cell') || row.querySelectorAll('td')[2];
        const qtyCell = row.querySelector('.qty-cell') || row.querySelectorAll('td')[3];
        if (!priceCell || !qtyCell) return;
        const priceText = priceCell.textContent.replace('£', '').replace('€', '').replace('$', '').trim();
        const qtyText = qtyCell.textContent.trim();
        
        const price = parseFloat(priceText) || 0;
        const qty = parseFloat(qtyText) || 0;
        
        if (!isTotalsRow) {
            totalPrice += price * qty;
            totalQty += qty;
        }
    });
    
    // Update totals row
    const totalRow = table.querySelector('tbody tr.totals-row') || table.querySelector('tbody tr:last-child');
    if (totalRow) {
        const totalPriceCell = totalRow.querySelector('.total-price-cell') || totalRow.querySelectorAll('td')[1];
        const totalQtyCell = totalRow.querySelector('.total-qty-cell') || totalRow.querySelectorAll('td')[2];
        if (totalPriceCell) totalPriceCell.textContent = `£${totalPrice.toFixed(2)}`;
        if (totalQtyCell) totalQtyCell.textContent = `Total Qty: ${totalQty % 1 !== 0 ? totalQty.toFixed(1) : totalQty}`;
    }
}

// ========================================
// HOME INVENTORY ("PRODUCTS AT HOME")
// ========================================

function populateShopOptions(select, selectedValue = null, includeTap = false) {
    if (!select) return;
    const shops = quickAddProducts ? Object.keys(quickAddProducts) : [];
    const options = [...shops];
    if (options.length === 0) {
        options.push('Tesco');
    }
    select.innerHTML = options.map(shop => `<option value="${shop}">${shop}</option>`).join('');
    const defaultValue = (selectedValue && options.includes(selectedValue))
        ? selectedValue
        : options[0];
    select.value = defaultValue;
}

function openHomeInventoryModal() {
    const modal = document.getElementById('homeInventoryModal');
    if (!modal) return;
    modal.classList.add('active');
    
    const shopSelect = document.getElementById('homeInventoryShop');
    if (shopSelect) {
        populateShopOptions(shopSelect, null, false);
    }
    
    const saved = loadHomeInventory();
    const defaultShop = shopSelect?.value || 'Tesco';
    renderHomeInventoryChecklist(defaultShop, saved);
    
    if (shopSelect) {
        shopSelect.onchange = () => renderHomeInventoryChecklist(shopSelect.value, saved);
    }
}

function closeHomeInventoryModal() {
    const modal = document.getElementById('homeInventoryModal');
    if (modal) modal.classList.remove('active');
}

function saveHomeInventory() {
    const shopSelect = document.getElementById('homeInventoryShop');
    const currentShop = shopSelect?.value || 'Tesco';
    const saved = loadHomeInventory();
    const currentSelections = collectHomeChecklistSelections(currentShop);
    const hasTapSelection = currentSelections.some(item => item.shop === 'Tap');
    const kept = saved.filter(item => {
        // Drop items for the currently edited shop
        if (item.shop === currentShop) return false;
        // Drop Tap water if it is not selected this save
        if (item.shop === 'Tap' && !hasTapSelection) return false;
        return true;
    });
    const items = [...kept, ...currentSelections];
    
    localStorage.setItem('homeInventory', JSON.stringify(items));
    renderHomeInventoryTable();
    closeHomeInventoryModal();
    alert('✅ Saved products at home.');
}

function loadHomeInventory() {
    try {
        const data = localStorage.getItem('homeInventory');
        if (!data) return [];
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) return [];
        
        return parsed.map(raw => {
            const packUnit = raw.packUnit || raw.unit || raw.unitLabel || '';
            const meta = deriveUnitMetadata(packUnit);
            const homeUnitRaw = raw.homeUnit || raw.homeDisplayUnit || meta.homeUnit;
            const homeUnit = normalizeHomeUnit(homeUnitRaw);
            const baseUnit = normalizeHomeUnit(raw.baseUnit) || baseUnitFor(homeUnit);
            const unitsPerPack = raw.unitsPerPack || meta.unitsPerPack || 1;
            const isTap = raw.shop === 'Tap';
            const unlimited = Boolean(raw.unlimited) || isTap || raw.qtyUnits === 'unlimited' || raw.qtyAvailablePacks === 'unlimited';
            const qtyUnitsRaw = raw.qtyUnits ?? raw.qtyUnitsBase ?? raw.qtyAvailable ?? raw.qtyAvailablePacks ?? 0;
            const sourceUnit = normalizeHomeUnit(raw.baseUnit || raw.homeUnit || raw.unitLabel || raw.unit || homeUnit);
            const unitLabel = homeUnit;
            const convertedQty = (!unlimited && sourceUnit && sourceUnit !== baseUnit)
                ? convertUnitsToTarget(qtyUnitsRaw, sourceUnit, baseUnit)
                : qtyUnitsRaw;
            let sanitizedQty = unlimited ? Infinity : sanitizeQuantityForUnit(convertedQty, baseUnit, true);
            if (!unlimited && (sanitizedQty === null || !isFinite(sanitizedQty))) {
                const packs = sanitizeQuantityForUnit(raw.qtyAvailablePacks ?? qtyUnitsRaw, 'each', true);
                if (packs !== null && isFinite(packs)) {
                    sanitizedQty = packs * unitsPerPack;
                }
            }
            const qtyUnits = unlimited ? Infinity : (sanitizedQty ?? 0);
            const displayQty = !unlimited
                ? convertUnitsToTarget(qtyUnits, baseUnit, homeUnit) ?? qtyUnits
                : qtyUnits;
            
            return {
                shop: raw.shop,
                category: raw.category,
                itemName: raw.itemName,
                unit: packUnit,
                price: raw.price,
                qtyAvailablePacks: unlimited ? Infinity : (raw.qtyAvailablePacks ?? raw.qtyAvailable ?? (qtyUnits / unitsPerPack)),
                qtyUnits, // stored in base unit
                displayQty,
                unitLabel: homeUnit,
                homeUnit, // display unit
                baseUnit,
                packUnit,
                unitsPerPack,
                unlimited,
                gramsPerSlice: raw.gramsPerSlice || ''
            };
        });
    } catch (e) {
        console.error('Failed to parse homeInventory', e);
        return [];
    }
}

function normalizeUnitKey(unit = '') {
    return (unit || '').toLowerCase().trim();
}

function normalizeHomeUnit(unit = '') {
    const key = normalizeUnitKey(unit);
    if (['kg', 'kgs', 'kilogram', 'kilograms'].includes(key)) return 'kg';
    if (['g', 'gram', 'grams'].includes(key)) return 'g';
    if (['l', 'liter', 'liters', 'litre', 'litres'].includes(key)) return 'L';
    if (['ml', 'milliliter', 'millilitre', 'milliliters', 'millilitres'].includes(key)) return 'ml';
    if (key.includes('slice')) return 'slices';
    if (key === 'each' || key === 'pcs' || key === 'piece' || key === 'pieces') return 'each';
    return unit || '';
}

function baseUnitFor(unit = '') {
    const key = normalizeHomeUnit(unit);
    if (key === 'kg' || key === 'g') return 'g';
    if (key === 'L' || key === 'ml') return 'ml';
    if (key === 'slices') return 'slices';
    return 'each';
}

function unitAllowsDecimals(unit = '') {
    const cleaned = normalizeUnitKey(unit);
    return ['kg', 'kgs', 'kilogram', 'kilograms', 'l', 'liter', 'liters', 'litre', 'litres'].includes(cleaned);
}

function getQuantityStep(unit = '') {
    const cleaned = normalizeUnitKey(unit);
    if (['kg', 'kgs', 'kilogram', 'kilograms', 'l', 'liter', 'liters', 'litre', 'litres'].includes(cleaned)) {
        return '0.01';
    }
    return '1';
}

function deriveUnitMetadata(unit = '') {
    const packUnit = (unit || '').trim();
    const lower = packUnit.toLowerCase();
    
    const numeric = typeof extractNumericFromUnit === 'function' ? extractNumericFromUnit(packUnit) : parseFloat(packUnit);
    const literMatch = packUnit.match(/([\d\.,]+)\s*(l|liter|litre)\b/i);
    const mlMatch = packUnit.match(/([\d\.,]+)\s*ml\b/i);
    const pintMatch = packUnit.match(/([\d\.,]+)?\s*pint\b/i);
    const kgMatch = packUnit.match(/([\d\.,]+)\s*kg\b/i);
    const gMatch = packUnit.match(/([\d\.,]+)\s*g\b/i);
    
    let homeUnit = 'each';
    let unitsPerPack = 1;
    
    if (literMatch || mlMatch || pintMatch || /\b(liter|litre|\bl\b|ml|pint)\b/.test(lower)) {
        homeUnit = mlMatch ? 'ml' : 'L';
        if (literMatch) {
            unitsPerPack = parseFloat(literMatch[1].replace(',', '.')) || 1;
        } else if (mlMatch) {
            const mlVal = parseFloat(mlMatch[1].replace(',', '.'));
            unitsPerPack = isFinite(mlVal) ? mlVal : 1;
        } else if (pintMatch) {
            const pints = parseFloat((pintMatch[1] || '1').replace(',', '.'));
            unitsPerPack = isFinite(pints) ? pints * 0.568 : 0.568;
        } else if (/ml\b/.test(lower) && numeric) {
            unitsPerPack = numeric;
        } else {
            unitsPerPack = numeric && isFinite(numeric) ? numeric : 1;
        }
    } else if (kgMatch || /\bkg\b|kilogram/.test(lower)) {
        homeUnit = 'kg';
        unitsPerPack = kgMatch ? parseFloat(kgMatch[1].replace(',', '.')) || 1 : (numeric && isFinite(numeric) ? numeric : 1);
    } else if (gMatch || /\d+\s*g\b/i.test(lower)) {
        homeUnit = 'g';
        unitsPerPack = gMatch ? parseFloat(gMatch[1].replace(',', '.')) || 1 : (numeric && isFinite(numeric) ? numeric : 1);
    } else if (/pack of\s*(\d+)/i.test(lower)) {
        const match = lower.match(/pack of\s*(\d+)/i);
        homeUnit = 'each';
        unitsPerPack = match ? parseInt(match[1], 10) || 1 : 1;
    } else if (/each/.test(lower)) {
        homeUnit = 'each';
        unitsPerPack = numeric && isFinite(numeric) ? numeric : 1;
    } else if (/pack\b/.test(lower)) {
        homeUnit = 'each';
        unitsPerPack = 1;
    }
    
    if (!unitsPerPack || !isFinite(unitsPerPack)) unitsPerPack = 1;
    return { packUnit, homeUnit, unitsPerPack };
}

function convertUnitsToTarget(value, fromUnit = '', toUnit = '') {
    if (!isFinite(value)) return value;
    const normalize = (u) => {
        const key = normalizeUnitKey(u);
        if (['kg', 'kgs', 'kilogram', 'kilograms'].includes(key)) return 'kg';
        if (['g', 'gram', 'grams'].includes(key)) return 'g';
        if (['l', 'liter', 'liters', 'litre', 'litres'].includes(key)) return 'l';
        if (['ml', 'milliliter', 'millilitre', 'milliliters', 'millilitres'].includes(key)) return 'ml';
        return key;
    };
    const from = normalize(fromUnit);
    const to = normalize(toUnit);
    if (!from || !to) return value;
    
    const weight = { kg: 1000, g: 1 };
    const volume = { l: 1000, ml: 1 };
    
    if (from === to) return value;
    
    if (from in weight && to in weight) {
        return value * (weight[from] / weight[to]);
    }
    if (from in volume && to in volume) {
        return value * (volume[from] / volume[to]);
    }
    // Units not comparable
    return null;
}

function sanitizeQuantityForUnit(value, unit = '', allowZero = false) {
    const numeric = parseFloat(value);
    if (!isFinite(numeric)) return null;
    if (numeric < 0) return null;

    const decimalsOk = unitAllowsDecimals(unit);
    if (decimalsOk) {
        const step = parseFloat(getQuantityStep(unit)) || 0.01;
        const precision = step === 0.01 ? 2 : 3;
        const rounded = Number(numeric.toFixed(precision));
        if (!allowZero && rounded <= 0) return null;
        return rounded;
    }
    const whole = Math.floor(numeric);
    if (!allowZero && whole <= 0) return null;
    return allowZero ? Math.max(0, whole) : whole;
}

function formatQuantityForDisplay(qty, unit = '') {
    if (!isFinite(qty)) return '0';
    const decimalsOk = unitAllowsDecimals(unit);
    const step = parseFloat(getQuantityStep(unit)) || 0.01;
    const precision = decimalsOk ? (step === 0.01 ? 2 : 3) : 0;
    const safeQty = decimalsOk ? Number(qty.toFixed(precision)) : Math.floor(qty);
    const str = decimalsOk ? safeQty.toFixed(precision) : String(safeQty);
    return str.replace(/\.0+$/, '').replace(/\.([1-9]*)0+$/, '.$1');
}

function formatHomeUnitLabel(unit = '', qty = null) {
    const key = normalizeUnitKey(unit);
    if (['kg', 'kgs', 'kilogram', 'kilograms'].includes(key) && qty !== null && isFinite(qty)) {
        const grams = Math.round(qty * 1000);
        return `kg (${grams} g)`;
    }
    if (['l', 'liter', 'liters', 'litre', 'litres'].includes(key) && qty !== null && isFinite(qty)) {
        const ml = Math.round(qty * 1000);
        return `L${ml > 0 ? ` (${ml} ml)` : ''}`;
    }
    return unit || '';
}

function applyQuantityInputRules(input, unit = '') {
    if (!input) return;
    input.step = getQuantityStep(unit);
    input.min = '0';
    input.inputMode = 'decimal';
    if (input._applyQuantityBlurListener) {
        input.removeEventListener('blur', input._applyQuantityBlurListener);
    }
    const blurHandler = () => {
        if (input.value === '') return;
        const sanitized = sanitizeQuantityForUnit(input.value, unit, true);
        if (sanitized === null) {
            input.value = '';
            return;
        }
        input.value = formatQuantityForDisplay(sanitized, unit);
    };
    input._applyQuantityBlurListener = blurHandler;
    input.addEventListener('blur', blurHandler);
}

// Backwards compatibility wrapper
function decimalsAllowed(unit = '') {
    return unitAllowsDecimals(unit);
}

function renderHomeInventoryTable() {
    const container = document.getElementById('homeInventoryDisplay');
    if (!container) return;
    
    const inventory = loadHomeInventory();
    if (!inventory || inventory.length === 0) {
        container.innerHTML = `
            <div style="margin-top: 12px; background: #f9fafb; border: 1px dashed #d1d5db; border-radius: 12px; padding: 16px; color: #6b7280;">
                🏠 No products at home yet. Click "Products at Home" to add them.
            </div>
        `;
        return;
    }
    
    const collapsed = localStorage.getItem('homeInventoryCollapsed') === 'true';
    const rows = inventory.map(item => {
        let qtyDisplay = '0';
        const unitLabel = item.homeUnit || item.unitLabel || item.unit;
        const baseUnit = item.baseUnit || baseUnitFor(unitLabel);
        const displayQty = typeof item.displayQty === 'number' ? item.displayQty : item.qtyUnits;
        if (item.unlimited || item.qtyUnits === Infinity) {
            qtyDisplay = 'Unlimited';
        } else if (typeof displayQty === 'number' && !isNaN(displayQty)) {
            const mainVal = formatQuantityForDisplay(displayQty, unitLabel);
            let conversion = '';
            if (unitLabel === 'kg' && baseUnit === 'g') {
                const grams = Math.round((item.qtyUnits || 0));
                conversion = ` (${grams} g)`;
            } else if (unitLabel === 'L' && baseUnit === 'ml') {
                const ml = Math.round((item.qtyUnits || 0));
                conversion = ` (${ml} ml)`;
            }
            qtyDisplay = `${mainVal}${conversion}`;
        } else if (item.qtyAvailablePacks && isFinite(item.qtyAvailablePacks)) {
            qtyDisplay = formatQuantityForDisplay(item.qtyAvailablePacks, unitLabel);
        }
        const sourceLabel = item.unlimited || item.shop === 'Tap'
            ? 'Utility (Tap water)'
            : (item.shop || 'Home');
        return `
            <tr>
                <td style="border: 1px solid #e5e7eb; padding: 10px;">${sourceLabel}</td>
                <td style="border: 1px solid #e5e7eb; padding: 10px;">${item.itemName}</td>
                <td style="border: 1px solid #e5e7eb; padding: 10px;">${unitLabel}</td>
                <td style="border: 1px solid #e5e7eb; padding: 10px; text-align: center;">${qtyDisplay}</td>
            </tr>
        `;
    }).join('');
    
    container.innerHTML = `
        <div style="margin-top: 12px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <div style="padding: 12px 16px; background: #fff7ed; color: #9a3412; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                <span>🏠 Products at Home</span>
                <button id="toggleHomeInventorySection" style="margin-left: auto; background: white; border: 1px solid #d1d5db; border-radius: 8px; padding: 6px 10px; cursor: pointer; font-weight: 700; color: #374151;">
                    ${collapsed ? 'Expand' : 'Collapse'}
                </button>
            </div>
            <div id="homeInventoryTableBody" style="display: ${collapsed ? 'none' : 'block'};">
                <table style="width: 100%; border-collapse: collapse; background: white;">
                    <thead>
                        <tr style="background: #f9fafb; color: #374151;">
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left;">Source/Shop</th>
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left;">Item</th>
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left;">Home unit</th>
                            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: center;">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    const toggleBtn = document.getElementById('toggleHomeInventorySection');
    const tableBody = document.getElementById('homeInventoryTableBody');
    if (toggleBtn && tableBody) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = tableBody.style.display === 'none';
            tableBody.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? 'Collapse' : 'Expand';
            localStorage.setItem('homeInventoryCollapsed', (!isHidden).toString());
        });
    }
}

function buildHomeInventoryPromptString() {
    // Load from Kitchen Stock V2
    const kitchenStock = JSON.parse(localStorage.getItem('kitchenStock_v2')) || {};
    
    if (!kitchenStock || Object.keys(kitchenStock).length === 0) return 'None';
    
    const entries = [];
    
    Object.keys(kitchenStock).forEach(canonicalKey => {
        const stockData = kitchenStock[canonicalKey];
        const product = typeof CANONICAL_PRODUCTS !== 'undefined' ? CANONICAL_PRODUCTS[canonicalKey] : null;
        
        if (!product) return;
        
        const productName = product.name;
        
        // Check if product is unlimited
        if (product.unlimited) {
            entries.push(`${productName} (unlimited)`);
            return;
        }
        
        const qtyBase = stockData.qtyBase;
        
        // Format quantity nicely
        let qtyLabel = '';
        if (typeof prettyQty === 'function') {
            qtyLabel = prettyQty(canonicalKey, qtyBase);
        } else {
            qtyLabel = `${qtyBase}${product.unitType}`;
        }
        
        entries.push(`${productName} (${qtyLabel})`);
    });
    
    return entries.length > 0 ? entries.join('; ') : 'None';
}

function renderHomeInventoryChecklist(shop, savedInventory) {
    const container = document.getElementById('homeInventoryChecklist');
    if (!container) return;
    container.innerHTML = '';
    
    const checklistData = buildChecklistDataForShop(shop);
    const currentSaved = Array.isArray(savedInventory) ? savedInventory : loadHomeInventory();
    const savedForShop = currentSaved.filter(item => item.shop === shop);
    const tapSaved = currentSaved.filter(item => item.shop === 'Tap');
    const grouped = checklistData.reduce((acc, item) => {
        const category = item.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {});
    
    const header = document.createElement('div');
    header.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-bottom: 12px; flex-wrap: wrap;';
    const badge = document.createElement('div');
    badge.id = 'homeInventorySelectedCount';
    badge.style.cssText = 'background: #eef2ff; color: #4338ca; padding: 8px 12px; border-radius: 999px; font-weight: 700;';
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear all';
    clearButton.style.cssText = 'border: 1px solid #d1d5db; background: white; color: #374151; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-weight: 600;';
    header.appendChild(badge);
    header.appendChild(clearButton);
    
    const gridWrapper = document.createElement('div');
    gridWrapper.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';
    
    const updateSelectedCount = () => {
        const selected = container.querySelectorAll('.home-card input[type="checkbox"]:checked').length;
        badge.textContent = `${selected} selected`;
    };
    
    const clearSelections = () => {
        const checkboxes = container.querySelectorAll('.home-card input[type="checkbox"]');
        checkboxes.forEach(box => {
            box.checked = false;
            const card = box.closest('.home-card');
            if (!card) return;
            card.style.borderColor = '#e5e7eb';
            card.style.background = '#ffffff';
            card.style.boxShadow = 'none';
            const qtyRow = card.querySelector('.home-card-qty');
            if (qtyRow) qtyRow.style.display = 'none';
            const qtyInput = card.querySelector('.home-qty-input');
            if (qtyInput) qtyInput.disabled = true;
        });
        updateSelectedCount();
    };
    
    clearButton.addEventListener('click', clearSelections);
    
    Object.entries(grouped).forEach(([category, items]) => {
        const section = document.createElement('div');
        section.style.cssText = 'border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: white;';
        const sectionHeader = document.createElement('div');
        sectionHeader.style.cssText = 'background: linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%); padding: 10px 14px; font-weight: 800; color: #4338ca; display: flex; align-items: center; gap: 8px;';
        sectionHeader.innerHTML = `<span>${category}</span>`;
        section.appendChild(sectionHeader);
        
        const grid = document.createElement('div');
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; padding: 12px;';
        
        items.forEach(item => {
            const savedPool = (item.tapSource || item.name.toLowerCase().includes('tap water')) ? tapSaved : savedForShop;
            const saved = savedPool.find(s => normalizeName(s.itemName) === normalizeName(item.name));
            const isChecked = Boolean(saved);
            const isTap = item.tapSource || shop === 'Tap' || item.name.toLowerCase().includes('tap water');
            const meta = deriveUnitMetadata(item.packUnit || item.unit);
            const defaultHomeUnit = normalizeHomeUnit(item.homeUnit || meta.homeUnit);
            const packUnit = meta.packUnit || item.packUnit || item.unit;
            const unitsPerPack = item.unitsPerPack || meta.unitsPerPack || item.packSize || 1;
            const isBread = /bread/i.test(item.name) || /loaf/.test(packUnit);
            const baseTrackingOptions = ['each', 'slices', 'g', 'kg', 'ml', 'L'];
            const trackingOptions = Array.from(new Set(baseTrackingOptions));
            const savedHomeUnit = saved?.homeUnit && trackingOptions.includes(saved.homeUnit) ? saved.homeUnit : null;
            let selectedHomeUnit = savedHomeUnit || (trackingOptions.includes(defaultHomeUnit) ? defaultHomeUnit : 'each');
            const qtyVal = saved?.qtyUnits === Infinity || saved?.unlimited
                ? ''
                : (typeof saved?.qtyUnits === 'number'
                    ? formatQuantityForDisplay(
                        convertUnitsToTarget(saved.qtyUnits, saved.baseUnit || baseUnitFor(saved?.homeUnit || selectedHomeUnit), selectedHomeUnit) ?? saved.qtyUnits,
                        selectedHomeUnit)
                    : '');
            const savedGramsPerSlice = saved?.gramsPerSlice;
            let qtyDisplayValue = qtyVal;
            if (qtyVal && saved?.homeUnit && saved.homeUnit !== selectedHomeUnit && typeof saved.qtyUnits === 'number') {
                let convertedVal = null;
                if (savedGramsPerSlice && isFinite(savedGramsPerSlice)) {
                    if (saved.homeUnit === 'g' && selectedHomeUnit === 'slices') {
                        convertedVal = saved.qtyUnits / savedGramsPerSlice;
                    } else if (saved.homeUnit === 'slices' && selectedHomeUnit === 'g') {
                        convertedVal = saved.qtyUnits * savedGramsPerSlice;
                    }
                }
                if (convertedVal === null) {
                    convertedVal = convertUnitsToTarget(saved.qtyUnits, saved.baseUnit || saved.homeUnit, selectedHomeUnit);
                }
                if (convertedVal !== null && isFinite(convertedVal)) {
                    qtyDisplayValue = formatQuantityForDisplay(convertedVal, selectedHomeUnit);
                }
            }
            const card = document.createElement('div');
            card.className = 'home-card';
            card.style.cssText = `
                border: 1px solid ${isChecked ? '#10b981' : '#e5e7eb'};
                border-radius: 12px;
                padding: 12px;
                background: ${isChecked ? '#ecfdf3' : '#ffffff'};
                display: flex;
                flex-direction: column;
                gap: 8px;
                transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
                box-shadow: ${isChecked ? '0 8px 24px rgba(16, 185, 129, 0.15)' : 'none'};
            `;
            card.dataset.itemName = item.name;
            card.dataset.unit = packUnit;
            card.dataset.packunit = packUnit;
            card.dataset.homeunit = selectedHomeUnit;
            card.dataset.unitsperpack = unitsPerPack;
            card.dataset.price = item.price;
            card.dataset.packsize = unitsPerPack;
            card.dataset.category = category;
            card.dataset.tap = isTap ? 'true' : 'false';
            card.dataset.unlimited = (isTap || saved?.unlimited) ? 'true' : 'false';
            card.dataset.trackingoptions = trackingOptions.join(',');
            card.dataset.gramsperslice = saved?.gramsPerSlice || '';
            card.dataset.baseunit = baseUnitFor(selectedHomeUnit);
            
            const topRow = document.createElement('div');
            topRow.style.cssText = 'display: flex; gap: 10px; align-items: flex-start;';
            topRow.innerHTML = `
                <input type="checkbox" class="home-card-check" ${isChecked ? 'checked' : ''} style="margin-top: 4px; transform: scale(1.1);" />
                <div style="flex: 1;">
                    <div style="font-weight: 800; color: #111827;">${item.name}</div>
                    <div style="color: #6b7280; font-size: 12px;">Sold as: ${packUnit} · Qty at home = what's left (${selectedHomeUnit === 'slices' ? 'slices' : selectedHomeUnit})</div>
                </div>
                <div style="padding: 6px 10px; background: #f3f4f6; border-radius: 8px; font-weight: 700; color: #374151; font-size: 12px;">${packUnit}</div>
            `;
            
            const qtyRow = document.createElement('div');
            qtyRow.className = 'home-card-qty';
            qtyRow.style.cssText = `display: ${isChecked ? 'flex' : 'none'}; align-items: center; gap: 8px; margin-left: 32px; flex-wrap: wrap;`;
            
            if (isTap || saved?.unlimited) {
                qtyRow.innerHTML = `<span style="background: #ecfdf3; color: #047857; padding: 6px 10px; border-radius: 999px; font-weight: 700;">Unlimited (tap)</span>`;
            } else {
                const qtyLabel = document.createElement('span');
                const homeUnitLabel = selectedHomeUnit === 'slices'
                    ? 'slices'
                    : selectedHomeUnit;
                qtyLabel.style.cssText = 'color: #374151; font-weight: 700;';
                qtyLabel.textContent = `Qty left (${homeUnitLabel}):`;
                
                const inputWrap = document.createElement('div');
                inputWrap.style.cssText = 'display: flex; align-items: center; gap: 6px;';
                const qtyInput = document.createElement('input');
                qtyInput.type = 'number';
                qtyInput.className = 'home-qty-input';
                qtyInput.min = '0';
                qtyInput.step = getQuantityStep(selectedHomeUnit);
                qtyInput.placeholder = unitsPerPack || 1;
                qtyInput.value = qtyDisplayValue;
                qtyInput.style.cssText = 'padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 8px; width: 90px;';
                qtyInput.disabled = !isChecked;
                qtyInput.removeAttribute('max');
                applyQuantityInputRules(qtyInput, selectedHomeUnit);
                qtyInput.addEventListener('click', (e) => e.stopPropagation());
                qtyInput.addEventListener('input', () => {
                    // no cap; just let sanitize on blur
                });
                
                const unitBadge = document.createElement('span');
                unitBadge.style.cssText = 'color: #6b7280; font-weight: 700;';
                unitBadge.textContent = selectedHomeUnit === 'slices' ? 'slices' : selectedHomeUnit;
                
                inputWrap.appendChild(qtyInput);
                inputWrap.appendChild(unitBadge);
                qtyRow.appendChild(qtyLabel);
                qtyRow.appendChild(inputWrap);
                
                const helper = document.createElement('div');
                helper.style.cssText = 'color: #6b7280; font-size: 12px; font-weight: 600; display: flex; gap: 6px; align-items: center;';
                const updateHelperText = () => {
                    const packHint = unitsPerPack > 1 ? `Pack size: ${unitsPerPack} (enter total if multiple packs)` : '';
                    const unitHint = selectedHomeUnit === 'slices' ? 'Enter slices left' : `Track ${selectedHomeUnit} left`;
                    helper.textContent = [unitHint, packHint].filter(Boolean).join(' • ');
                };
                updateHelperText();
                qtyRow.appendChild(helper);
                
                let gramsInputWrapper;
                if (trackingOptions.length > 1) {
                    const trackWrap = document.createElement('div');
                    trackWrap.style.cssText = 'display: flex; align-items: center; gap: 6px;';
                    const trackLabel = document.createElement('span');
                    trackLabel.style.cssText = 'color: #6b7280; font-weight: 600;';
                    trackLabel.textContent = 'Track at home as:';
                    const trackSelect = document.createElement('select');
                    trackSelect.className = 'home-track-select';
                    trackSelect.style.cssText = 'padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 8px; font-weight: 700;';
                    trackingOptions.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt;
                        option.textContent = opt === 'slices' ? 'slices' : opt;
                        if (opt === selectedHomeUnit) option.selected = true;
                        trackSelect.appendChild(option);
                    });
                    trackSelect.addEventListener('click', (e) => e.stopPropagation());
                    trackSelect.addEventListener('change', () => {
                        const previousUnit = card.dataset.homeunit || selectedHomeUnit;
                        selectedHomeUnit = trackSelect.value;
                        card.dataset.homeunit = selectedHomeUnit;
                        qtyInput.step = getQuantityStep(selectedHomeUnit);
                        applyQuantityInputRules(qtyInput, selectedHomeUnit);
                        qtyInput.removeAttribute('max');
                        qtyLabel.textContent = `Qty left (${selectedHomeUnit === 'slices' ? 'slices' : selectedHomeUnit}):`;
                        unitBadge.textContent = selectedHomeUnit === 'slices' ? 'slices' : selectedHomeUnit;
                        updateHelperText();
                        
                        const gramsPerSlice = parseFloat(card.dataset.gramsperslice);
                        if (previousUnit !== selectedHomeUnit && qtyInput.value) {
                            let converted = null;
                            if (gramsPerSlice && isFinite(gramsPerSlice)) {
                                if (previousUnit === 'g' && selectedHomeUnit === 'slices') {
                                    converted = qtyInput.value ? (parseFloat(qtyInput.value) / gramsPerSlice) : null;
                                } else if (previousUnit === 'slices' && selectedHomeUnit === 'g') {
                                    converted = qtyInput.value ? (parseFloat(qtyInput.value) * gramsPerSlice) : null;
                                }
                            }
                            if (converted === null) {
                                const safeConverted = convertUnitsToTarget(parseFloat(qtyInput.value), previousUnit, selectedHomeUnit);
                                converted = safeConverted;
                            }
                            if (converted !== null && isFinite(converted)) {
                                qtyInput.value = formatQuantityForDisplay(converted, selectedHomeUnit);
                            }
                        }
                        if (gramsInputWrapper) {
                            gramsInputWrapper.style.display = selectedHomeUnit === 'slices' ? 'flex' : 'none';
                        }
                    });
                    trackWrap.appendChild(trackLabel);
                    trackWrap.appendChild(trackSelect);
                    qtyRow.appendChild(trackWrap);
                }
                
                if (trackingOptions.length > 1) {
                    gramsInputWrapper = document.createElement('div');
                    gramsInputWrapper.style.cssText = `display: ${selectedHomeUnit === 'slices' ? 'flex' : 'none'}; align-items: center; gap: 6px;`;
                    const gramsLabel = document.createElement('span');
                    gramsLabel.style.cssText = 'color: #6b7280; font-weight: 600;';
                    gramsLabel.textContent = 'Grams per slice (optional):';
                    const gramsInput = document.createElement('input');
                    gramsInput.type = 'number';
                    gramsInput.step = '0.1';
                    gramsInput.min = '0';
                    gramsInput.placeholder = 'e.g., 30';
                    gramsInput.value = card.dataset.gramsperslice || '';
                    gramsInput.style.cssText = 'padding: 6px 8px; border: 1px solid #d1d5db; border-radius: 8px; width: 90px;';
                    gramsInput.addEventListener('click', (e) => e.stopPropagation());
                    gramsInput.addEventListener('input', () => {
                        card.dataset.gramsperslice = gramsInput.value;
                    });
                    gramsInputWrapper.appendChild(gramsLabel);
                    gramsInputWrapper.appendChild(gramsInput);
                    qtyRow.appendChild(gramsInputWrapper);
                }
            }
            
            card.appendChild(topRow);
            card.appendChild(qtyRow);
            grid.appendChild(card);
            
            const checkbox = card.querySelector('.home-card-check');
            
            const syncSelection = (isSelected) => {
                card.style.borderColor = isSelected ? '#10b981' : '#e5e7eb';
                card.style.background = isSelected ? '#ecfdf3' : '#ffffff';
                card.style.boxShadow = isSelected ? '0 8px 24px rgba(16, 185, 129, 0.15)' : 'none';
                qtyRow.style.display = isSelected ? 'flex' : 'none';
                const qtyInputEl = card.querySelector('.home-qty-input');
                if (qtyInputEl) qtyInputEl.disabled = !isSelected;
                updateSelectedCount();
            };
            
            checkbox?.addEventListener('change', () => syncSelection(checkbox.checked));
            checkbox?.addEventListener('click', (e) => e.stopPropagation());
            card.addEventListener('click', (e) => {
                if (['INPUT', 'SELECT', 'OPTION', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName) || e.target.classList.contains('home-qty-input')) return;
                if (!checkbox.checked) {
                    checkbox.checked = true;
                    syncSelection(true);
                }
            });

            const qtyInput = card.querySelector('.home-qty-input');
            if (qtyInput) {
                applyQuantityInputRules(qtyInput, selectedHomeUnit);
                qtyInput.addEventListener('click', (e) => e.stopPropagation());
            }
        });
        
        section.appendChild(grid);
        gridWrapper.appendChild(section);
    });
    
    container.appendChild(header);
    container.appendChild(gridWrapper);
    updateSelectedCount();
}

function buildChecklistDataForShop(shop) {
    const catalog = quickAddProducts?.[shop] || {};
    const list = [];
    Object.entries(catalog).forEach(([category, items]) => {
        items.forEach(item => {
            const meta = deriveUnitMetadata(item.unit);
            list.push({
                name: item.name,
                unit: item.unit || '',
                packUnit: item.unit || '',
                homeUnit: meta.homeUnit,
                unitsPerPack: meta.unitsPerPack,
                price: item.price ?? 0,
                packSize: item.defaultQty || meta.unitsPerPack || extractNumericFromUnit(item.unit) || 1,
                category
            });
        });
    });
    
    // Always include tap water as an unlimited home source
    const tapAlreadyPresent = list.some(entry => entry.tapSource || (entry.name && entry.name.toLowerCase().includes('tap water')));
    if (!tapAlreadyPresent) {
        list.push({
            name: 'Tap water',
            unit: 'L',
            packUnit: 'L',
            homeUnit: 'L',
            unitsPerPack: 1,
            price: 0,
            packSize: 1,
            category: '💧 Home Sources',
            tapSource: true
        });
    }
    return list;
}

function collectHomeChecklistSelections(shop) {
    const container = document.getElementById('homeInventoryChecklist');
    if (!container) return [];
    const cards = Array.from(container.querySelectorAll('.home-card'));
    const selections = [];
    
    cards.forEach(card => {
        const checked = card.querySelector('.home-card-check')?.checked;
        if (!checked) return;
        const qtyInput = card.querySelector('.home-qty-input');
        const itemName = card.dataset.itemName;
        const packUnit = card.dataset.packunit || card.dataset.unit;
        const homeUnit = card.dataset.homeunit || deriveUnitMetadata(packUnit).homeUnit;
        const baseUnit = baseUnitFor(homeUnit);
        const price = parseFloat(card.dataset.price) || 0;
        const unitsPerPack = parseFloat(card.dataset.unitsperpack) || parseFloat(card.dataset.packsize) || 1;
        const category = card.dataset.category || '';
        const gramsPerSlice = parseFloat(card.dataset.gramsperslice);
        const trackingOptions = (card.dataset.trackingoptions || '').split(',').map(s => s.trim());
        const targetShop = card.dataset.tap === 'true' ? 'Tap' : shop;
        
        const isTap = card.dataset.tap === 'true' || (targetShop === 'Tap' && itemName.toLowerCase().includes('tap water'));
        const unlimited = isTap || card.dataset.unlimited === 'true';
        const rawValue = qtyInput?.value;
        const qtyUnits = unlimited ? null : sanitizeQuantityForUnit(rawValue, homeUnit);
        if (!unlimited && (qtyUnits === null || qtyUnits <= 0)) return;
        
        const convertedPackSize = convertUnitsToTarget(unitsPerPack, homeUnit, baseUnit);
        const storedUnitsPerPack = isFinite(convertedPackSize) ? convertedPackSize : (unitsPerPack || 1);
        const qtyBase = unlimited
            ? null
            : (convertUnitsToTarget(qtyUnits, homeUnit, baseUnit) ?? qtyUnits);
        
        if (unlimited || qtyUnits > 0) {
            selections.push({
                shop: targetShop,
                category,
                itemName,
                unit: packUnit,
                price,
                qtyAvailablePacks: unlimited ? 'unlimited' : qtyBase / storedUnitsPerPack,
                qtyUnits: unlimited ? 'unlimited' : qtyBase,
                displayQty: unlimited ? 'unlimited' : qtyUnits,
                unitLabel: homeUnit,
                homeUnit,
                baseUnit,
                packUnit,
                unitsPerPack: storedUnitsPerPack,
                unlimited,
                gramsPerSlice: gramsPerSlice && isFinite(gramsPerSlice) ? gramsPerSlice : ''
            });
        }
    });
    
    return selections;
}

function populatePreferredShopSelect() {
    const select = document.getElementById('shoppingPreferredShop');
    if (!select) return;
    const shops = quickAddProducts ? Object.keys(quickAddProducts) : [];
    if (shops.length === 0) {
        select.innerHTML = `<option value="Tesco">Tesco</option>`;
        select.value = 'Tesco';
        return;
    }
    select.innerHTML = shops.map(shop => `<option value="${shop}">${shop}</option>`).join('');
    select.value = shops.includes('Tesco') ? 'Tesco' : shops[0];
}

function renderRecipes() {
    // If the new recipe library UI is present, refresh it instead of using legacy text mode
    const recipeGrid = document.getElementById('recipeGrid');
    if (recipeGrid) {
        if (typeof renderRecipeGrid === 'function') renderRecipeGrid();
        if (typeof renderThisWeekRecipes === 'function') renderThisWeekRecipes();
        return;
    }
    
    const container = document.getElementById('recipesDisplay');
    
    // Load saved recipes text from localStorage
    const savedText = localStorage.getItem('recipesText');
    
    if (!savedText) {
        container.innerHTML = `
            <div style="text-align: center; color: #999; padding: 40px 20px;">
                <p style="font-size: 18px; margin: 0;">👨‍🍳 No recipes yet</p>
                <p style="font-size: 14px; margin: 10px 0 0 0;">Use "👨‍🍳 Import Recipes" to add recipes</p>
            </div>
        `;
    } else {
        // Convert text to HTML with preserved formatting
        let formattedHTML = savedText
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
        
        container.innerHTML = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.8; color: #2c3e50;">
                ${formattedHTML}
            </div>
        `;
    }
}

// ========================================
// LOCAL STORAGE
// ========================================

function saveToLocalStorage() {
    localStorage.setItem('weeklySchedule', JSON.stringify(scheduleData));
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('weeklySchedule');
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Validate the loaded data
            if (parsed && typeof parsed === 'object') {
                // Ensure all required properties exist
                scheduleData = {
                    userName: parsed.userName || 'Ivan',
                    dateInfo: parsed.dateInfo || 'December 2025 🚴',
                    events: Array.isArray(parsed.events) ? parsed.events : [],
                    days: parsed.days && typeof parsed.days === 'object' ? parsed.days : {},
                    defaultBlocks: Array.isArray(parsed.defaultBlocks) ? parsed.defaultBlocks : [],
                    shopping: Array.isArray(parsed.shopping) ? parsed.shopping : [],
                    recipes: Array.isArray(parsed.recipes) ? parsed.recipes : []
                };
                
                console.log('Loaded data from localStorage:', Object.keys(scheduleData.days).length, 'days');
            } else {
                console.warn('Invalid data structure in localStorage, using defaults');
            }
        } else {
            console.log('No saved data found, using defaults');
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        // If localStorage is corrupted, clear it
        localStorage.removeItem('weeklySchedule');
        alert('⚠️ Your saved data was corrupted and has been cleared. The app will start fresh.');
    }
}

function saveCheckboxState(id, checked) {
    localStorage.setItem(id, checked);
}

// ========================================
// MANAGE DEFAULT BLOCKS
// ========================================

// Time picker for clock icon clicks

function openDefaultsModal() {
    const modal = document.getElementById('manageDefaultsModal');
    if (!modal) {
        console.error('Manage Defaults modal not found in HTML');
        return;
    }
    renderDefaultBlocksList();
    modal.classList.add('active');
}

function closeDefaultsModal() {
    const modal = document.getElementById('manageDefaultsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function openAddDefaultModal() {
    // Reset form
    document.getElementById('defaultModalTitle').textContent = '➕ Add Default Block';
    document.getElementById('defaultBlockForm').reset();
    document.getElementById('defaultBlockIndex').value = '-1';
    
    // Set default checkboxes (Mon-Fri checked by default)
    document.querySelectorAll('.default-day-checkbox').forEach(checkbox => {
        const day = checkbox.value;
        checkbox.checked = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day);
    });
    
    document.getElementById('addEditDefaultModal').classList.add('active');
}

function closeAddEditDefaultModal() {
    document.getElementById('addEditDefaultModal').classList.remove('active');
}

function saveDefaultBlock(event) {
    event.preventDefault();
    
    const index = parseInt(document.getElementById('defaultBlockIndex').value);
    const startTime = document.getElementById('defaultStartTime').value;
    const endTime = document.getElementById('defaultEndTime').value;
    const title = document.getElementById('defaultTitle').value;
    const tasks = document.getElementById('defaultTasks').value.split('\n').filter(t => t.trim());
    
    // Get selected days
    const selectedDays = [];
    document.querySelectorAll('.default-day-checkbox:checked').forEach(checkbox => {
        selectedDays.push(checkbox.value);
    });
    
    if (selectedDays.length === 0) {
        alert('⚠️ Please select at least one day!');
        return;
    }
    
    const newBlock = {
        time: `${startTime}-${endTime}`,
        title: title,
        tasks: tasks,
        days: selectedDays,
        enabled: true
    };
    
    if (index >= 0) {
        // Edit existing
        scheduleData.defaultBlocks[index] = newBlock;
    } else {
        // Add new
        if (!scheduleData.defaultBlocks) {
            scheduleData.defaultBlocks = [];
        }
        scheduleData.defaultBlocks.push(newBlock);
    }
    
    saveToLocalStorage();
    renderDefaultBlocksList();
    closeAddEditDefaultModal();
    
    const action = index >= 0 ? 'updated' : 'added';
    alert(`✅ Default block ${action}!`);
}

function editDefaultBlock(index) {
    const block = scheduleData.defaultBlocks[index];
    if (!block) return;
    
    document.getElementById('defaultModalTitle').textContent = '✏️ Edit Default Block';
    document.getElementById('defaultBlockIndex').value = index;
    
    // Parse time
    const [start, end] = block.time.split('-');
    document.getElementById('defaultStartTime').value = start;
    document.getElementById('defaultEndTime').value = end;
    document.getElementById('defaultTitle').value = block.title;
    document.getElementById('defaultTasks').value = (block.tasks || []).join('\n');
    
    // Set day checkboxes
    const days = block.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    document.querySelectorAll('.default-day-checkbox').forEach(checkbox => {
        checkbox.checked = days.includes(checkbox.value);
    });
    
    document.getElementById('addEditDefaultModal').classList.add('active');
}

function toggleDefaultBlock(index) {
    const block = scheduleData.defaultBlocks[index];
    if (!block) return;
    
    block.enabled = !block.enabled;
    saveToLocalStorage();
    renderDefaultBlocksList();
    
    const status = block.enabled ? 'enabled' : 'disabled';
    showToast(`Default block ${status}`);
}

function addMorningRoutineTemplate() {
    if (!scheduleData.defaultBlocks) {
        scheduleData.defaultBlocks = [];
    }
    
    const morningRoutine = {
        time: "07:00-07:30",
        title: "🌅 Morning Routine",
        tasks: [
            "Wake up",
            "Turn off alarm clock",
            "Drink a glass of water",
            "Brush your teeth"
        ],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        enabled: true
    };
    
    scheduleData.defaultBlocks.push(morningRoutine);
    saveToLocalStorage();
    renderDefaultBlocksList();
    showToast('🌅 Morning Routine added to defaults!');
}

function addBedtimeRoutineTemplate() {
    if (!scheduleData.defaultBlocks) {
        scheduleData.defaultBlocks = [];
    }
    
    const bedtimeRoutine = {
        time: "22:30-23:00",
        title: "🌙 Bedtime Routine",
        tasks: [
            "Shower",
            "Brush your teeth",
            "No phone in bedroom",
            "Drink a glass of water"
        ],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        enabled: true
    };
    
    scheduleData.defaultBlocks.push(bedtimeRoutine);
    saveToLocalStorage();
    renderDefaultBlocksList();
    showToast('🌙 Bedtime Routine added to defaults!');
}

function renderDefaultBlocksList() {
    const container = document.getElementById('defaultBlocksList');
    
    if (!container) {
        console.warn('defaultBlocksList element not found');
        return;
    }
    
    if (!scheduleData.defaultBlocks || scheduleData.defaultBlocks.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 12px; border: 2px dashed #ddd;">
                <div style="font-size: 48px; margin-bottom: 10px;">📋</div>
                <p style="color: #999; font-size: 16px; margin: 0;">No default blocks yet.</p>
                <p style="color: #999; font-size: 14px; margin: 10px 0 0 0;">Click "Add New Default Block" above to create one.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    scheduleData.defaultBlocks.forEach((block, index) => {
        const isEnabled = block.enabled !== false; // Default to true if not specified
        const days = block.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const daysShort = days.map(d => d.substring(0, 3)).join(', ');
        
        html += `
            <div style="background: ${isEnabled ? '#ffffff' : '#f5f5f5'}; padding: 18px; border-radius: 12px; margin-bottom: 12px; border: 2px solid ${isEnabled ? '#667eea' : '#ddd'}; position: relative; ${!isEnabled ? 'opacity: 0.6;' : ''}">
                <!-- Enable/Disable Toggle -->
                <div style="position: absolute; top: 15px; right: 15px; display: flex; gap: 8px; align-items: center;">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; background: ${isEnabled ? '#dcfce7' : '#f3f4f6'}; padding: 6px 12px; border-radius: 20px; border: 2px solid ${isEnabled ? '#4ade80' : '#d1d5db'};">
                        <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="toggleDefaultBlock(${index})" style="width: 16px; height: 16px; cursor: pointer;">
                        <span style="font-size: 13px; font-weight: 600; color: ${isEnabled ? '#16a34a' : '#6b7280'};">${isEnabled ? 'ON' : 'OFF'}</span>
                    </label>
                </div>
                
                <!-- Block Info -->
                <div style="margin-right: 100px;">
                    <div style="font-weight: 700; color: #667eea; font-size: 16px; margin-bottom: 8px;">${block.time}</div>
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${block.title}</div>
                    ${block.tasks && block.tasks.length > 0 ? `<div style="font-size: 14px; color: #666; margin-bottom: 8px;">Tasks: ${block.tasks.join(', ')}</div>` : ''}
                    <div style="font-size: 13px; color: #667eea; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                        <span>📅</span>
                        <span>${daysShort}</span>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; display: flex; gap: 8px;">
                    <button onclick="editDefaultBlock(${index})" style="flex: 1; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
                        ✏️ Edit
                    </button>
                    <button onclick="removeDefaultBlock(${index})" style="flex: 1; padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function removeDefaultBlock(index) {
    if (confirm('❌ Delete this default block?\n\nThis will not affect existing days, only new days you create.')) {
        scheduleData.defaultBlocks.splice(index, 1);
        renderDefaultBlocksList();
        saveToLocalStorage();
        showToast('Default block deleted');
    }
}

function emergencyReset() {
    if (confirm('⚠️ EMERGENCY RESET\n\nThis will delete ALL your data and start fresh.\n\nAre you absolutely sure?')) {
        localStorage.clear();
        alert('✅ App has been reset! The page will now reload.');
        location.reload();
    }
}

// ========================================
// PROMPT GENERATOR & RESPONSE IMPORTER
// ========================================

function loadPromptFormState() {
    try {
        const raw = localStorage.getItem(PROMPT_FORM_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.warn('Unable to load prompt form state:', error);
        return null;
    }
}

function getWorkDayTimesFromDOM() {
    const times = [];
    for (let i = 0; i < 7; i++) {
        const startInput = document.getElementById(`workDay${i}Start`);
        const endInput = document.getElementById(`workDay${i}End`);
        times.push({
            start: startInput?.value || '',
            end: endInput?.value || ''
        });
    }
    return times;
}

function collectPromptFormState() {
    return {
        weekDate: document.getElementById('promptWeekDate')?.value || '',
        workDayTimes: getWorkDayTimesFromDOM(),
        addCommute: document.getElementById('promptAddCommute')?.checked || false,
        commuteMinutes: document.getElementById('promptAddCommute')?.checked ?
            (parseInt(document.getElementById('promptCommuteDuration')?.value) || 0) : 0,
        commutePrepMinutes: document.getElementById('promptAddCommute')?.checked ?
            (parseInt(document.getElementById('promptCommutePrepDuration')?.value) || 0) : 0,
        studySubjects: document.getElementById('promptStudySubjects')?.value || '',
        examDates: document.getElementById('promptExamDates')?.value || '',
        studyHours: document.getElementById('promptStudyHours')?.value || '',
        studyAIDecide: document.getElementById('promptStudyAIDecide')?.checked || false,
        studyTopics: document.getElementById('promptStudyTopics')?.value || '',
        foodPrefs: document.getElementById('promptFoodPrefs')?.value || '',
        batchDuration: document.querySelector('input[name="batchDuration"]:checked')?.value || '1',
        hobbies: document.getElementById('promptHobbies')?.value || '',
        hobbyHours: document.getElementById('promptHobbyHours')?.value || '',
        hobbyAIDecide: document.getElementById('promptHobbyAIDecide')?.checked || false,
        oneOffTasks: document.getElementById('promptOneOffTasks')?.value || '',
        sleepSchedule: document.getElementById('promptSleep')?.value || '',
        includeRelax: document.getElementById('promptRelax')?.checked || false,
        workMealsProvided: document.getElementById('promptWorkMealsProvided')?.checked || false,
        workMealStrategy: document.getElementById('promptWorkMealStrategy')?.value || WORK_MEAL_STRATEGIES.COOK_MORNING,
        workMealCookMinutes: parseInt(document.getElementById('promptWorkMealCookMinutes')?.value) || 30,
        workMealNotes: document.getElementById('promptWorkMealNotes')?.value || '',
        dietary: {
            vegetarian: document.getElementById('dietVegetarian')?.checked || false,
            vegan: document.getElementById('dietVegan')?.checked || false,
            nutFree: document.getElementById('dietNutFree')?.checked || false,
            dairyFree: document.getElementById('dietDairyFree')?.checked || false,
            glutenFree: document.getElementById('dietGlutenFree')?.checked || false
        }
    };
}

function savePromptFormState() {
    try {
        const state = collectPromptFormState();
        localStorage.setItem(PROMPT_FORM_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn('Unable to save prompt form state:', error);
    }
}

function applyWorkDayTimes(times) {
    if (!Array.isArray(times)) return;
    times.forEach((entry, index) => {
        const startInput = document.getElementById(`workDay${index}Start`);
        const endInput = document.getElementById(`workDay${index}End`);
        if (startInput && entry.start) startInput.value = entry.start;
        if (endInput && entry.end) endInput.value = entry.end;
    });
}

function applyPromptFormState(state, options = {}) {
    if (!state) return;
    
    if (!options.skipWeekDate && state.weekDate) {
        const dateInput = document.getElementById('promptWeekDate');
        if (dateInput) dateInput.value = state.weekDate;
    }
    
    const studySubjects = document.getElementById('promptStudySubjects');
    if (studySubjects) studySubjects.value = state.studySubjects || '';
    const examDates = document.getElementById('promptExamDates');
    if (examDates) examDates.value = state.examDates || '';
    const studyHours = document.getElementById('promptStudyHours');
    if (studyHours) studyHours.value = state.studyHours || '';
    const studyAIDecide = document.getElementById('promptStudyAIDecide');
    if (studyAIDecide) studyAIDecide.checked = !!state.studyAIDecide;
    const studyTopics = document.getElementById('promptStudyTopics');
    if (studyTopics) studyTopics.value = state.studyTopics || '';
    const foodPrefs = document.getElementById('promptFoodPrefs');
    if (foodPrefs) foodPrefs.value = state.foodPrefs || '';
    const batchRadio = document.querySelector(`input[name="batchDuration"][value="${state.batchDuration}"]`);
    if (batchRadio) batchRadio.checked = true;
    
    const hobbies = document.getElementById('promptHobbies');
    if (hobbies) hobbies.value = state.hobbies || '';
    const hobbyHours = document.getElementById('promptHobbyHours');
    if (hobbyHours) hobbyHours.value = state.hobbyHours || '';
    const hobbyAIDecide = document.getElementById('promptHobbyAIDecide');
    if (hobbyAIDecide) hobbyAIDecide.checked = !!state.hobbyAIDecide;
    
    const oneOffTasks = document.getElementById('promptOneOffTasks');
    if (oneOffTasks) oneOffTasks.value = state.oneOffTasks || '';
    const sleepSchedule = document.getElementById('promptSleep');
    if (sleepSchedule) sleepSchedule.value = state.sleepSchedule || '';
    const includeRelax = document.getElementById('promptRelax');
    if (includeRelax) includeRelax.checked = !!state.includeRelax;
    
    const workMealsProvided = document.getElementById('promptWorkMealsProvided');
    if (workMealsProvided) workMealsProvided.checked = !!state.workMealsProvided;
    const workMealStrategy = document.getElementById('promptWorkMealStrategy');
    if (workMealStrategy && state.workMealStrategy) workMealStrategy.value = state.workMealStrategy;
    const workMealCookMinutes = document.getElementById('promptWorkMealCookMinutes');
    if (workMealCookMinutes) workMealCookMinutes.value = state.workMealCookMinutes ?? 30;
    const workMealNotes = document.getElementById('promptWorkMealNotes');
    if (workMealNotes) workMealNotes.value = state.workMealNotes || '';
    
    document.getElementById('dietVegetarian')?.setAttribute('checked', state.dietary?.vegetarian ? 'checked' : '');
    const dietVegetarian = document.getElementById('dietVegetarian');
    if (dietVegetarian) dietVegetarian.checked = !!state.dietary?.vegetarian;
    const dietVegan = document.getElementById('dietVegan');
    if (dietVegan) dietVegan.checked = !!state.dietary?.vegan;
    const dietNutFree = document.getElementById('dietNutFree');
    if (dietNutFree) dietNutFree.checked = !!state.dietary?.nutFree;
    const dietDairyFree = document.getElementById('dietDairyFree');
    if (dietDairyFree) dietDairyFree.checked = !!state.dietary?.dairyFree;
    const dietGlutenFree = document.getElementById('dietGlutenFree');
    if (dietGlutenFree) dietGlutenFree.checked = !!state.dietary?.glutenFree;
    
    const addCommute = document.getElementById('promptAddCommute');
    if (addCommute) addCommute.checked = !!state.addCommute;
    const commuteDuration = document.getElementById('promptCommuteDuration');
    if (commuteDuration) commuteDuration.value = state.commuteMinutes ?? 15;
    const commutePrep = document.getElementById('promptCommutePrepDuration');
    if (commutePrep) commutePrep.value = state.commutePrepMinutes ?? 0;
    
    applyWorkDayTimes(state.workDayTimes);
}

function attachPromptFormListeners() {
    const fields = [
        'promptWeekDate',
        'promptStudySubjects',
        'promptExamDates',
        'promptStudyHours',
        'promptStudyAIDecide',
        'promptStudyTopics',
        'promptFoodPrefs',
        'promptHobbies',
        'promptHobbyHours',
        'promptHobbyAIDecide',
        'promptOneOffTasks',
        'promptSleep',
        'promptRelax',
        'promptWorkMealsProvided',
        'promptWorkMealStrategy',
        'promptWorkMealCookMinutes',
        'promptWorkMealNotes',
        'promptAddCommute',
        'promptCommuteDuration',
        'promptCommutePrepDuration'
    ];
    
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', savePromptFormState);
            el.addEventListener('change', savePromptFormState);
        }
    });
    
    const batchRadios = document.querySelectorAll('input[name="batchDuration"]');
    batchRadios.forEach(radio => {
        radio.addEventListener('change', savePromptFormState);
    });
    
    const dietaryCheckboxes = [
        'dietVegetarian',
        'dietVegan',
        'dietNutFree',
        'dietDairyFree',
        'dietGlutenFree'
    ];
    dietaryCheckboxes.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', savePromptFormState);
        }
    });
    
    // Work meal visibility toggles
    const staffMealToggle = document.getElementById('promptWorkMealsProvided');
    const strategySelect = document.getElementById('promptWorkMealStrategy');
    const cookMinutes = document.getElementById('promptWorkMealCookMinutes');
    
    if (staffMealToggle) {
        staffMealToggle.addEventListener('change', () => {
            updateWorkMealUI();
            savePromptFormState();
        });
    }
    if (strategySelect) {
        strategySelect.addEventListener('change', () => {
            updateWorkMealUI();
            savePromptFormState();
        });
    }
    if (cookMinutes) {
        cookMinutes.addEventListener('input', savePromptFormState);
    }
}

function attachWorkDayListeners() {
    for (let i = 0; i < 7; i++) {
        const startInput = document.getElementById(`workDay${i}Start`);
        const endInput = document.getElementById(`workDay${i}End`);
        if (startInput) startInput.addEventListener('input', savePromptFormState);
        if (endInput) endInput.addEventListener('input', savePromptFormState);
    }
}

function updateWorkMealUI() {
    const providedToggle = document.getElementById('promptWorkMealsProvided');
    const planContainer = document.getElementById('workMealPlanContainer');
    const cookOptions = document.getElementById('workMealCookOptions');
    const strategySelect = document.getElementById('promptWorkMealStrategy');
    
    if (!planContainer || !providedToggle || !strategySelect || !cookOptions) return;
    
    const showPlan = !providedToggle.checked;
    planContainer.style.display = showPlan ? 'block' : 'none';
    
    const strategy = strategySelect.value || WORK_MEAL_STRATEGIES.COOK_MORNING;
    cookOptions.style.display = (strategy === WORK_MEAL_STRATEGIES.COOK_MORNING || strategy === WORK_MEAL_STRATEGIES.COOK_EVENING) ? 'block' : 'none';
}

function openPromptGenerator() {
    document.getElementById('promptGeneratorModal').classList.add('active');
    document.getElementById('generatedPromptSection').style.display = 'none';
    
    const savedState = loadPromptFormState();
    
    // Set today's date as default, or restore saved date
    const today = new Date();
    const defaultDateStr = savedState?.weekDate || today.toISOString().split('T')[0];
    document.getElementById('promptWeekDate').value = defaultDateStr;
    
    // Populate work days with saved values
    populateWorkDays(defaultDateStr);
    applyPromptFormState(savedState, { skipWeekDate: true });
    updateWorkMealUI();
}

function closePromptGenerator() {
    document.getElementById('promptGeneratorModal').classList.remove('active');
}

function populateWorkDays(date) {
    const container = document.getElementById('workDaysContainer');
    
    // Use the EXACT date entered - do NOT adjust to Monday!
    const startDate = new Date(date);
    console.log('Work days start from:', startDate.toDateString());
    
    // Create work day inputs for each day starting from the entered date
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let html = '<div style="display: grid; gap: 8px;">';
    
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        const dayName = getDayName(currentDate); // This returns "Monday", "Tuesday", etc.
        
        html += `
            <div style="background: white; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: 600; min-width: 80px; color: #2c3e50; font-size: 14px;">${dayName}</span>
                <span style="color: #7f8c8d; font-size: 12px; min-width: 50px;">${dateStr}</span>
                <input type="time" id="workDay${i}Start" style="padding: 6px 8px; border: 2px solid #ddd; border-radius: 4px; font-size: 13px; width: 110px;" />
                <span style="color: #7f8c8d; font-size: 13px;">to</span>
                <input type="time" id="workDay${i}End" style="padding: 6px 8px; border: 2px solid #ddd; border-radius: 4px; font-size: 13px; width: 110px;" />
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
    
    // Re-attach listeners and restore saved times
    attachWorkDayListeners();
    const savedState = loadPromptFormState();
    if (savedState?.workDayTimes) {
        applyWorkDayTimes(savedState.workDayTimes);
    }
}

// Listen for date changes
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('promptWeekDate');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            const date = new Date(this.value);
            populateWorkDays(date);
            savePromptFormState();
        });
    }
    
    attachPromptFormListeners();
    updateWorkMealUI();
});

/**
 * Get date of next Monday (or today if already Monday)
 */
function getNextMonday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
    
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    
    const day = nextMonday.getDate();
    const month = nextMonday.toLocaleDateString('en-GB', { month: 'short' });
    const year = nextMonday.getFullYear();
    
    return `${day} ${month} ${year}`;
}

function chooseWorkMealSuggestion(selectedRecipes = []) {
    if (!Array.isArray(selectedRecipes) || selectedRecipes.length === 0) return null;
    
    const scored = selectedRecipes.map(recipe => {
        const availability = typeof describeRecipeAvailability === 'function'
            ? describeRecipeAvailability(recipe)
            : { match: 0, isReady: false, missingList: [] };
        return { recipe, availability };
    });
    
    scored.sort((a, b) => {
        if (a.availability.isReady !== b.availability.isReady) {
            return a.availability.isReady ? -1 : 1; // ready first
        }
        return (b.availability.match || 0) - (a.availability.match || 0);
    });
    
    return scored[0] || null;
}

function buildWorkMealInstruction(formData, suggestion) {
    const notes = formData.workMealNotes ? ` Preferences: ${formData.workMealNotes}.` : '';
    
    if (formData.workMealsProvided) {
        return `Staff meals provided on workdays; skip planning cooked/bought lunches/dinners during work shifts.${notes}`;
    }
    
    const describeSuggestion = () => {
        if (!suggestion) return 'Pick a quick main/batch recipe that travels well.';
        const { recipe, availability } = suggestion;
        const readyText = availability?.isReady ? 'ready with current stock' :
            (availability?.missingList?.length ? `missing: ${availability.missingList.join(', ')} (schedule shopping before first cook)` : 'may need shopping first');
        return `${recipe.name} (${recipe.id}) — ${readyText}`;
    };
    
    if (formData.workMealStrategy === WORK_MEAL_STRATEGIES.COOK_MORNING) {
        return `Cook a portable work meal each workday in the morning before leaving. Reserve ~${formData.workMealCookMinutes} mins before the commute for cooking, then pack it. Suggested recipe: ${describeSuggestion()}.${notes}`;
    }
    
    if (formData.workMealStrategy === WORK_MEAL_STRATEGIES.COOK_EVENING) {
        return `Cook the next day's work meal in the evening before workdays. Reserve ~${formData.workMealCookMinutes} mins after work or later in the evening, then pack for the next morning. Suggested recipe: ${describeSuggestion()}.${notes}`;
    }
    
    return `Buy meals near work (no cooking block). Add a small buffer around lunch to purchase food.${notes}`;
}

function generatePrompt() {
    console.log('🤖 Generating AI prompt with smart selection...');
    savePromptFormState();
    
    // Get all form data
    const weekDate = document.getElementById('promptWeekDate').value || new Date().toISOString().split('T')[0];
    
    // Build formData for pre-fill system
    const formData = {
        workSchedule: '',  // Will build from time inputs
        commuteMinutes: document.getElementById('promptAddCommute')?.checked ? 
            (parseInt(document.getElementById('promptCommuteDuration')?.value) || 0) : 0,
        commutePrepMinutes: document.getElementById('promptAddCommute')?.checked ?
            (parseInt(document.getElementById('promptCommutePrepDuration')?.value) || 0) : 0,
        studySubjects: document.getElementById('promptStudySubjects')?.value || '',
        examDates: document.getElementById('promptExamDates')?.value || '',
        studyHours: document.getElementById('promptStudyHours')?.value || '',
        studyAIDecide: document.getElementById('promptStudyAIDecide')?.checked || false,
        studyTopics: document.getElementById('promptStudyTopics')?.value || '',
        foodPrefs: document.getElementById('promptFoodPrefs')?.value || '',
        batchDuration: document.querySelector('input[name="batchDuration"]:checked')?.value || '1',
        hobbies: document.getElementById('promptHobbies')?.value || '',
        hobbyHours: document.getElementById('promptHobbyHours')?.value || '',
        hobbyAIDecide: document.getElementById('promptHobbyAIDecide')?.checked || false,
        oneOffTasks: document.getElementById('promptOneOffTasks')?.value || '',
        sleepSchedule: document.getElementById('promptSleep')?.value || '',
        includeRelax: document.getElementById('promptRelax')?.checked || false,
        workMealsProvided: document.getElementById('promptWorkMealsProvided')?.checked || false,
        workMealStrategy: document.getElementById('promptWorkMealStrategy')?.value || WORK_MEAL_STRATEGIES.COOK_MORNING,
        workMealCookMinutes: parseInt(document.getElementById('promptWorkMealCookMinutes')?.value) || 30,
        workMealNotes: document.getElementById('promptWorkMealNotes')?.value || ''
    };
    
    // Build work schedule string from time inputs
    const startDate = new Date(weekDate);
    for (let i = 0; i < 7; i++) {
        const startInput = document.getElementById(`workDay${i}Start`);
        const endInput = document.getElementById(`workDay${i}End`);
        
        if (!startInput || !endInput) continue;
        
        const start = startInput.value;
        const end = endInput.value;
        
        if (start && end) {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + i);
            const dayName = getDayName(dayDate);
            
            // Convert to "Monday-Friday 9am-5pm" format if possible
            if (!formData.workSchedule) {
                formData.workSchedule = `${dayName} ${start}-${end}`;
            } else {
                formData.workSchedule += `\n${dayName}: ${start}-${end}`;
            }
        }
    }
    
    // Get dietary filters
    const dietaryFilters = {
        vegetarian: document.getElementById('dietVegetarian')?.checked || false,
        vegan: document.getElementById('dietVegan')?.checked || false,
        nutFree: document.getElementById('dietNutFree')?.checked || false,
        dairyFree: document.getElementById('dietDairyFree')?.checked || false,
        glutenFree: document.getElementById('dietGlutenFree')?.checked || false
    };
    
    // === SMART RECIPE SELECTION (Part 2) ===
    const selectedRecipes = selectRecipesForWeek(dietaryFilters);
    console.log(`📊 Selected ${selectedRecipes.length} recipes for this week`);
    const workMealSuggestion = chooseWorkMealSuggestion(selectedRecipes);
    const workMealInstruction = buildWorkMealInstruction(formData, workMealSuggestion);
    
    // === PRE-FILL SYSTEM (Part 3) ===
    const preFilledData = generatePreFilledData(formData);
    
    // === BUILD REDUCED RECIPE PROMPT ===
    const recipePromptSection = buildReducedRecipePrompt(
        selectedRecipes, 
        formData.batchDuration
    );
    
    // === BUILD TIME SLOT SECTION ===
    const timeSlotSection = buildTimeSlotPrompt(
        preFilledData.timeGaps,
        preFilledData.excludedActivities
    );
    
    // === BUILD KITCHEN STOCK SUMMARY ===
    const homeInventorySummary = buildHomeInventoryPromptString();
    
    // === BUILD DIETARY SUMMARY ===
    const dietarySummary = describeDietaryFilters(dietaryFilters);
    
    // Format the week start date nicely
    const weekDateObj = new Date(weekDate);
    const weekDateFormatted = weekDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // === BUILD FULL PROMPT ===
    const prompt = `
You are a personal schedule assistant helping me plan my week.

📅 WEEK DETAILS:
Start date: ${weekDateFormatted}

${timeSlotSection}

📚 STUDY:
- Subjects: ${formData.studySubjects || 'None'}
${formData.examDates ? `- IMPORTANT EXAMS: ${formData.examDates}` : ''}
- Study time needed: ${formData.studyAIDecide ? 'YOU DECIDE the optimal hours based on my schedule' : formData.studyHours + ' hours per day'}
${formData.studyTopics ? `- Focus topics:\n${formData.studyTopics}` : ''}

🍳 MEALS & FOOD:
- Preferences: ${formData.foodPrefs || 'No preferences'}
- Batch cook duration: ${formData.batchDuration} day(s) worth of meals per batch recipe
- Dietary filters: ${dietarySummary}
- Meal ordering rule: Cook recipes from the "READY TO COOK" list first (all ingredients on hand). For any recipe listed under "RECIPES NEEDING SHOPPING", add a shopping block before it and only schedule it after that shopping trip.

🏢 WORK MEALS:
- ${workMealInstruction || 'Plan simple, portable meals for workdays as you see fit.'}

🎯 HOBBIES:
- Hobbies: ${formData.hobbies || 'None'}
- Time per day: ${formData.hobbyAIDecide ? 'YOU DECIDE the optimal time' : formData.hobbyHours + ' hours'}

✅ ONE-OFF TASKS & ERRANDS:
${formData.oneOffTasks ? `These MUST be scheduled somewhere this week:\n${formData.oneOffTasks}` : 'No special tasks this week'}
- Find appropriate time slots for each task
- Spread them across the week logically

😴 SLEEP & REST:
- Preferred sleep: ${formData.sleepSchedule}
${formData.includeRelax ? '- Include relaxation/free time blocks' : ''}

${recipePromptSection}

📋 WHAT I NEED FROM YOU:

Create a COMPLETE 7-day schedule only. Output must be copy-paste ready for the app with ZERO extra sections or notes.

FORMAT RULES:
1) Each day header: === DAY — DD Mon YYYY ===
2) Each block on its own line: HH:MM–HH:MM | EMOJI Title | Tasks
3) Add the recipe ID next to meal titles, e.g., "🍳 Breakfast | Porridge oats with honey (R5)". Recipe IDs use the R1+ for defaults and CR1+ for custom shown in the database above.
4) After all 7 days, add one blank line, then a SINGLE LINE with all recipe IDs you used, comma-separated, and NO heading (e.g., R4, CR2, R6).
5) Do NOT include shopping lists, meal summaries, video links, or extra headings (specifically avoid: "🗓️ WEEKLY SCHEDULE", "🛒 SHOPPING LIST…", "🍽️ MEAL PLAN SUMMARY…", "📌 RECIPES USED", or any "If you want…" variants).
6) Keep meals simple and quick. Use Kitchen Stock items first: ${homeInventorySummary || 'none'}.
7) Use the exact time slots provided in the "FILL THESE TIME SLOTS" section above.
8) Ensure meals that are ready-to-cook (100% ingredients available) happen BEFORE any recipes that need shopping. Place shopping before those missing-ingredient recipes so no meal is scheduled without its ingredients.
${workMealInstruction ? `9) Work meal handling: ${workMealInstruction}` : ''}

Generate the schedule now.
    `.trim();
    
    console.log('✅ AI prompt generated');
    console.log(`📏 Estimated tokens: ~${Math.round(prompt.length / 4)}`);
    
    // Save preFilledData for later use during import
    sessionStorage.setItem('lastPreFilledData', JSON.stringify(preFilledData));
    
    // Show generated prompt
    document.getElementById('generatedPromptText').value = prompt;
    document.getElementById('generatedPromptSection').style.display = 'block';
    
    // Scroll to generated prompt
    document.getElementById('generatedPromptSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function copyPrompt() {
    const promptText = document.getElementById('generatedPromptText');
    promptText.select();
    document.execCommand('copy');
    
    // Show confirmation
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✅ Copied to Clipboard!';
    btn.style.background = '#27ae60';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '#4caf50';
    }, 2500);
    
    // Show helpful alert
    setTimeout(() => {
        alert('✅ Prompt copied!\n\nNext steps:\n1. Go to ChatGPT.com or Claude.ai\n2. Paste and send\n3. Copy AI\'s complete response\n4. Click "📥 Step 2: Import AI Response"');
    }, 100);
}

function parseAndCreateSchedule(response) {
    console.log('=== PARSING STARTED ===');
    
    const detectedRecipeIDs = new Set();
    const preExtractedRecipeIDs = typeof extractRecipeIDs === 'function' ? extractRecipeIDs(response) : [];
    preExtractedRecipeIDs.forEach(id => detectedRecipeIDs.add(id));
    
    // Clean up the response - handle ALL dash types
    const originalLength = response.length;
    response = response.replace(/–/g, '-'); // En-dash
    response = response.replace(/—/g, '-'); // Em-dash (this is what your AI uses!)
    response = response.replace(/→/g, '-'); // Arrow
    response = response.replace(/>/g, '-'); // Greater than
    console.log('Cleaned dashes, length:', response.length, 'original:', originalLength);
    
    // Try to extract week start date from the response
    let startDate = null;
    
    // Look for date patterns - much more flexible
    const datePatterns = [
        /(\d{1,2})\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i, // "12 Dec 2025"
        /Starting\s+(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/i,
        /Starting\s+(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/i,
        /Week starts?:?\s+(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/i,
        /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/
    ];
    
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    for (const pattern of datePatterns) {
        const match = response.match(pattern);
        if (match) {
            let day, month, year;
            
            // Check if it's the "12 Dec 2025" format
            if (match[0].match(/\d+\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d+/i)) {
                day = parseInt(match[1]);
                const monthStr = match[0].match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i)[0].toLowerCase();
                month = monthNames.indexOf(monthStr.substring(0, 3));
                year = parseInt(match[2]);
            } else if (match[1] && match[1].length === 4) {
                // YYYY-MM-DD format
                year = parseInt(match[1]);
                month = parseInt(match[2]) - 1;
                day = parseInt(match[3]);
            } else {
                // DD/MM/YYYY format
                day = parseInt(match[1]);
                month = parseInt(match[2]) - 1;
                year = parseInt(match[3]);
            }
            
            startDate = new Date(year, month, day);
            console.log('Found date in response:', startDate.toDateString());
            break;
        }
    }
    
    // Fallback to current date if no date found
    if (!startDate) {
        startDate = new Date();
        console.log('No date found, using today:', startDate.toDateString());
    }
    
    // Parse each day section - SUPER flexible with day names and dates
    const allDayNames = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const dayAbbreviations = {
        'MONDAY': 'MON',
        'TUESDAY': 'TUE',
        'WEDNESDAY': 'WED',
        'THURSDAY': 'THU',
        'FRIDAY': 'FRI',
        'SATURDAY': 'SAT',
        'SUNDAY': 'SUN'
    };
    const dayData = {}; // Will store by ACTUAL date offset, not day name index!
    
    allDayNames.forEach((dayName, dayNameIndex) => {
        console.log(`\n--- Parsing ${dayName} ---`);
        
        const dayAbbr = dayAbbreviations[dayName];
        const dayPattern = `(?:${dayName}|${dayAbbr})`;  // Match either full or abbreviated
        
        // VERY flexible patterns - handles dates, em-dashes, everything!
        const patterns = [
            // Pattern 1: === FRIDAY — 12 Dec 2025 === or === FRI — 12 Dec 2025 ===
            new RegExp(`===\\s*${dayPattern}\\s*[—–-]?\\s*(?:\\d+\\s+\\w+\\s+\\d+)?\\s*===([\\s\\S]*?)(?===\\s*(?:${allDayNames.join('|')}|MON|TUE|WED|THU|FRI|SAT|SUN|🛒|SHOPPING|MEAL)|$)`, 'i'),
            // Pattern 2: === FRIDAY (Dec 12) === or === FRI (Dec 12) ===
            new RegExp(`===\\s*${dayPattern}\\s*(?:\\([^)]*\\))?\\s*===([\\s\\S]*?)(?===\\s*(?:${allDayNames.join('|')}|MON|TUE|WED|THU|FRI|SAT|SUN|🛒|SHOPPING|MEAL)|$)`, 'i'),
            // Pattern 3: === FRIDAY === or === FRI ===
            new RegExp(`===\\s*${dayPattern}\\s*===([\\s\\S]*?)(?===\\s*(?:${allDayNames.join('|')}|MON|TUE|WED|THU|FRI|SAT|SUN|🛒|SHOPPING|MEAL)|$)`, 'i'),
            // Pattern 4: FRIDAY: or FRI:
            new RegExp(`${dayPattern}\\s*[—–-]?\\s*(?:\\d+\\s+\\w+\\s+\\d+)?:([\\s\\S]*?)(?=(?:${allDayNames.join('|')}|MON|TUE|WED|THU|FRI|SAT|SUN|🛒|SHOPPING|MEAL)[:\\s]|$)`, 'i')
        ];
        
        let dayContent = null;
        for (let i = 0; i < patterns.length; i++) {
            const match = response.match(patterns[i]);
            if (match) {
                dayContent = match[1];
                console.log(`Found ${dayName} using pattern ${i+1}, content length:`, dayContent.length);
                break;
            }
        }
        
        if (!dayContent) {
            console.log(`❌ No content found for ${dayName}`);
            return;
        }
        
        const blocks = [];
        const usedRecipesInDay = new Set(); // Track recipes used in this day
        
        // Try multiple time block patterns
        const blockPatterns = [
            /(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})\s*\|\s*([^|]+?)\s*\|\s*([^\n]+)/g,
            /(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})\s*\|\s*([^\n]+)/g,
            /(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})\s+([^0-9\n]+?)(?:\n|$)/g
        ];
        
        for (let patternIndex = 0; patternIndex < blockPatterns.length; patternIndex++) {
            const pattern = blockPatterns[patternIndex];
            pattern.lastIndex = 0;
            let blockMatch;
            let matchCount = 0;
            
            while ((blockMatch = pattern.exec(dayContent)) !== null) {
                matchCount++;
                let startTime = blockMatch[1];
                let endTime = blockMatch[2];
                let title = '';
                let tasks = [];
                
                if (blockMatch[4]) {
                    title = blockMatch[3].trim();
                    tasks = blockMatch[4].split(',').map(t => t.trim()).filter(t => t);
                } else if (blockMatch[3]) {
                    const combined = blockMatch[3].trim();
                    
                    if (combined.includes('|')) {
                        const parts = combined.split('|');
                        title = parts[0].trim();
                        tasks = parts.slice(1).join(',').split(',').map(t => t.trim()).filter(t => t);
                    } else {
                        const parts = combined.split(/[,\n]/);
                        title = parts[0].trim();
                        tasks = parts.slice(1).map(t => t.trim()).filter(t => t);
                        if (tasks.length === 0) tasks = [parts[0].trim()];
                    }
                }
                
                if (title || tasks.length > 0) {
                    const blockText = `${title} ${tasks.join(' ')}`.trim();
                    const recipeMatches = blockText.match(/(?:CR|R[A-Z]*)\d+/gi) || [];
                    let recipeID = null;
                    let recipeName = null;
                    recipeMatches.forEach(id => {
                        const upperId = id.toUpperCase();
                        const recipe = typeof getRecipe === 'function' ? getRecipe(upperId) : null;
                        if (recipe) {
                            detectedRecipeIDs.add(upperId);
                            if (!recipeID) {
                                recipeID = upperId;
                                recipeName = recipe.name;
                            }
                        }
                    });
                    
                    // Strip recipe IDs from display (e.g., remove "(RB5)", "(RM10)", "(CR1)", etc.)
                    const cleanTitle = (title || tasks[0] || 'Activity').replace(/\s*\((?:CR|R)[A-Z]*\d+\)/gi, '').trim();
                    const cleanTasks = tasks.map(t => t.replace(/\s*\((?:CR|R)[A-Z]*\d+\)/gi, '').trim()).filter(t => t);
                    
                    // Check if this is a leftover (same recipe used earlier in the day)
                    let isLeftover = /leftover/i.test(blockText);
                    if (recipeID && usedRecipesInDay.has(recipeID)) {
                        isLeftover = true; // Same recipe used again = leftover
                    }
                    if (recipeID) {
                        usedRecipesInDay.add(recipeID); // Track this recipe
                    }
                    
                    blocks.push({
                        time: `${startTime}-${endTime}`,
                        title: cleanTitle,
                        tasks: cleanTasks.length > 0 ? cleanTasks : ['Activity'],
                        note: '',
                        video: '',
                        recipeID,
                        recipeName,
                        isLeftover
                    });
                }
            }
            
            if (blocks.length > 0) {
                console.log(`✅ ${dayName}: ${blocks.length} blocks parsed`);
                break;
            }
        }
        
        if (blocks.length > 0) {
            // CRITICAL FIX: Calculate which offset this day is from the start date!
            // Find what date this day name corresponds to
            for (let offset = 0; offset < 7; offset++) {
                const testDate = new Date(startDate);
                testDate.setDate(startDate.getDate() + offset);
                const testDayName = getDayName(testDate).toUpperCase();
                
                if (testDayName === dayName) {
                    // Found it! Store by offset, not by day name index
                    console.log(`  → Mapped to offset ${offset} (${testDate.toDateString()})`);
                    dayData[offset] = blocks;
                    break;
                }
            }
        }
    });
    
    // Check if we parsed anything
    const totalBlocks = Object.values(dayData).reduce((sum, blocks) => sum + blocks.length, 0);
    console.log(`\n=== PARSING COMPLETE ===`);
    console.log(`Total days parsed: ${Object.keys(dayData).length}`);
    console.log(`Total blocks parsed: ${totalBlocks}`);
    
    if (totalBlocks === 0 && detectedRecipeIDs.size === 0) {
        throw new Error('No schedule blocks found in the response. Make sure the AI included time blocks like "07:00-07:30 | Title | Tasks"');
    }
    
    // If only recipe IDs were provided, just update recipes and shopping
    if (totalBlocks === 0 && detectedRecipeIDs.size > 0) {
        const uniqueRecipeIDs = [...detectedRecipeIDs];
        if (Array.isArray(selectedRecipesThisWeek)) {
            selectedRecipesThisWeek = [...new Set([...selectedRecipesThisWeek, ...uniqueRecipeIDs])];
            if (typeof saveSelectedRecipes === 'function') saveSelectedRecipes();
            if (typeof renderThisWeekRecipes === 'function') renderThisWeekRecipes();
        }
        if (typeof generateShoppingListFromRecipes === 'function') {
            generateShoppingListFromRecipes({ silent: true, resetHidden: true });
        }
        saveToLocalStorage();
        return { recipeOnly: true, recipeCount: uniqueRecipeIDs.length };
    }
    
    // Create days in schedule starting from the correct day
    console.log('\n=== CREATING SCHEDULE ===');
    console.log(`Week starts: ${startDate.toDateString()}`);
    console.log(`Days with content: ${Object.keys(dayData).length}`);
    
    // ONLY create days that have blocks - using correct offset!
    for (const offsetStr of Object.keys(dayData)) {
        const offset = parseInt(offsetStr);
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + offset);
        
        const dayKey = `day_${date.getTime()}`;
        const dayName = getDayName(date);
        
        const blocks = dayData[offset];
        console.log(`Creating ${dayName} (${date.toDateString()}): ${blocks.length} blocks`);
        
        scheduleData.days[dayKey] = {
            name: dayName,
            date: date.toISOString().split('T')[0],
            displayDate: date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
            subtitle: 'Imported Schedule',
            motivation: '✨ Your schedule!',
            blocks: blocks
        };
    }
    
    // If no days were created, throw error
    if (Object.keys(dayData).length === 0) {
        throw new Error('No days found in response. Make sure the AI response includes day headers like "=== MONDAY — 15 Dec 2025 ==="');
    }
    
    // Extract and show shopping list
    const shoppingMatch = response.match(/🛒\s*SHOPPING LIST|===\s*SHOPPING LIST\s*===/i);
    if (shoppingMatch) {
        const shoppingStart = shoppingMatch.index;
        const shoppingSection = response.substring(shoppingStart);
        const shoppingEnd = shoppingSection.search(/🍽️|===\s*MEAL|$/) || shoppingSection.length;
        const shoppingContent = shoppingSection.substring(0, shoppingEnd);
        
        console.log('Shopping list found!');
        const items = shoppingContent.match(/[-•—–]\s*([^\n]+)/g);
        if (items) {
            const shoppingList = items.map(item => 
                item.replace(/^[-•—–]\s*/, '').trim()
            ).filter(item => 
                !item.match(/^💰|^£|^Estimated|^cost/i) && item.length > 2
            );
            
            if (shoppingList.length > 0) {
                setTimeout(() => {
                    alert('🛒 SHOPPING LIST:\n\n' + shoppingList.join('\n'));
                }, 1000);
            }
        }
    }
    
    // Render everything
    console.log('Rendering tabs and schedule...');
    renderDayTabs();
    renderSchedule();
    
    // Merge any detected recipe IDs into "This Week" and generate shopping (no Quick Add changes)
    if (typeof extractRecipeIDs === 'function') {
        extractRecipeIDs(response).forEach(id => detectedRecipeIDs.add(id));
    }
    const uniqueRecipeIDs = [...detectedRecipeIDs];
    if (uniqueRecipeIDs.length > 0) {
        console.log(`Linking ${uniqueRecipeIDs.length} recipe IDs to This Week`, uniqueRecipeIDs);
        if (Array.isArray(selectedRecipesThisWeek)) {
            selectedRecipesThisWeek = [...new Set([...selectedRecipesThisWeek, ...uniqueRecipeIDs])];
            if (typeof saveSelectedRecipes === 'function') saveSelectedRecipes();
            if (typeof renderThisWeekRecipes === 'function') renderThisWeekRecipes();
        }
        if (typeof generateShoppingListFromRecipes === 'function') {
            generateShoppingListFromRecipes({ silent: true, resetHidden: true });
        }
    }
    
    saveToLocalStorage();
    
    // Show first day that was created
    const createdDayKeys = Object.keys(scheduleData.days);
    if (createdDayKeys.length > 0) {
        // Sort by timestamp to get chronologically first day
        createdDayKeys.sort((a, b) => {
            const timeA = parseInt(a.split('_')[1]);
            const timeB = parseInt(b.split('_')[1]);
            return timeA - timeB;
        });
        
        const firstDayKey = createdDayKeys[0];
        showDay(firstDayKey);
        
        setTimeout(() => {
            const firstTab = document.querySelector(`.day-tab[data-day="${firstDayKey}"]`);
            if (firstTab) {
                document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
                firstTab.classList.add('active');
            }
            updateNavButtons();
        }, 100);
    }
    
    console.log('\n=== IMPORT SUMMARY ===');
    console.log(`Week starts: ${startDate.toDateString()}`);
    console.log(`Days imported: ${Object.keys(dayData).length}`);
    console.log(`Total blocks: ${totalBlocks}`);
    console.log('=== DONE ===');
    
    return {
        daysCreated: Object.keys(dayData).length,
        recipeCount: uniqueRecipeIDs.length
    };
}


// ========================================
// QUICK FILL (Simple Alternative)
// ========================================

function quickFillRota() {
    closeAddDayModal();
    
    // Ask for start date
    let startDateInput = prompt("📅 What date should the week start?\n\nExamples:\n- 'next Monday'\n- '16/12/2024'\n- 'December 16'");
    
    if (!startDateInput) return; // User cancelled
    
    // Parse date
    let startDate = parseQuickDate(startDateInput);
    if (!startDate) {
        alert("❌ Couldn't understand that date. Please try again with a clearer format like '16/12/2024'");
        return;
    }
    
    // Ask for work days
    let workDaysInput = prompt("📋 Which days do you work?\n\nExamples:\n- 'Monday, Wednesday, Friday'\n- 'Mon Wed Fri'\n- 'Mon-Fri' (for Monday to Friday)");
    
    if (!workDaysInput) return;
    
    let workDaysArray = parseQuickDays(workDaysInput);
    if (workDaysArray.length === 0) {
        alert("❌ Couldn't understand those days. Please try again.");
        return;
    }
    
    // Ask for times for each day
    let workTimes = {};
    for (let dayNum of workDaysArray) {
        let dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayNum];
        let timeInput = prompt(`⏰ What time do you work on ${dayName}?\n\nExamples:\n- '9am to 5pm'\n- '09:00-17:00'\n- '16:00 to 23:30'`);
        
        if (!timeInput) return; // User cancelled
        
        let times = parseQuickTimes(timeInput);
        if (!times) {
            alert(`❌ Couldn't understand '${timeInput}'. Please use format like '9am-5pm' or '09:00-17:00'`);
            return;
        }
        
        workTimes[dayNum] = times;
    }
    
    // Ask for commute
    let commuteInput = confirm("🚶 Do you want to add commute blocks?");
    let commuteDuration = 15;
    
    if (commuteInput) {
        let durationInput = prompt("⏱️ How many minutes is your commute? (one way)", "15");
        if (durationInput) {
            commuteDuration = parseInt(durationInput) || 15;
        }
    }
    
    // Now fill the form!
    document.getElementById('weekStartDate').value = startDate;
    document.getElementById('addWorkSchedule').checked = true;
    document.getElementById('workScheduleDetails').style.display = 'block';
    
    // Fill work days
    document.querySelectorAll('.work-day-check').forEach(checkbox => {
        const dayValue = parseInt(checkbox.value);
        if (workTimes[dayValue]) {
            checkbox.checked = true;
            const workDayItem = checkbox.closest('.work-day-item');
            const timesDiv = workDayItem.querySelector('.work-day-times');
            timesDiv.style.display = 'block';
            workDayItem.querySelector('.work-start').value = workTimes[dayValue].start;
            workDayItem.querySelector('.work-end').value = workTimes[dayValue].end;
        }
    });
    
    // Set commute
    document.getElementById('addCommute').checked = commuteInput;
    document.getElementById('commuteSettings').style.display = commuteInput ? 'block' : 'none';
    document.getElementById('commuteDuration').value = commuteDuration;
    
    // Show the modal again and offer to create
    document.getElementById('addDayModal').classList.add('active');
    
    if (confirm('✅ Rota filled in! Create the week now?')) {
        addWeek();
        closeAddDayModal();
    }
}

function parseQuickDate(input) {
    input = input.toLowerCase().trim();
    const today = new Date();
    
    // "next Monday" pattern
    if (input.includes('next monday')) {
        let date = new Date(today);
        date.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7) + 7);
        return date.toISOString().split('T')[0];
    }
    
    // "next week" pattern
    if (input.includes('next week')) {
        let date = new Date(today);
        date.setDate(today.getDate() + 7 - today.getDay() + 1); // Next Monday
        return date.toISOString().split('T')[0];
    }
    
    // DD/MM or DD/MM/YY or DD/MM/YYYY
    const slashMatch = input.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
    if (slashMatch) {
        let day = parseInt(slashMatch[1]);
        let month = parseInt(slashMatch[2]) - 1; // JS months are 0-indexed
        let year = slashMatch[3] ? (slashMatch[3].length === 2 ? 2000 + parseInt(slashMatch[3]) : parseInt(slashMatch[3])) : today.getFullYear();
        let date = new Date(year, month, day);
        // Find the Monday of that week
        let dayOfWeek = date.getDay();
        let diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        let monday = new Date(date);
        monday.setDate(diff);
        return monday.toISOString().split('T')[0];
    }
    
    // Try native date parsing as last resort
    try {
        let date = new Date(input);
        if (!isNaN(date.getTime())) {
            let dayOfWeek = date.getDay();
            let diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            let monday = new Date(date);
            monday.setDate(diff);
            return monday.toISOString().split('T')[0];
        }
    } catch(e) {}
    
    return null;
}

function parseQuickDays(input) {
    input = input.toLowerCase().replace(/,/g, ' ');
    const days = [];
    const dayMap = {
        'monday': 1, 'mon': 1,
        'tuesday': 2, 'tue': 2, 'tues': 2,
        'wednesday': 3, 'wed': 3,
        'thursday': 4, 'thu': 4, 'thur': 4, 'thurs': 4,
        'friday': 5, 'fri': 5,
        'saturday': 6, 'sat': 6,
        'sunday': 0, 'sun': 0
    };
    
    // Check for "Mon-Fri" pattern
    if (input.match(/mon.*fri/i)) {
        return [1, 2, 3, 4, 5];
    }
    
    for (let [name, num] of Object.entries(dayMap)) {
        if (input.includes(name)) {
            if (!days.includes(num)) days.push(num);
        }
    }
    
    return days.sort();
}

function parseQuickTimes(input) {
    input = input.toLowerCase().replace(/\s+/g, '');
    
    // Try to match HH:MM-HH:MM or HH:MM to HH:MM
    let match24 = input.match(/(\d{1,2}):(\d{2})[-to]*(\d{1,2}):(\d{2})/);
    if (match24) {
        return {
            start: `${match24[1].padStart(2, '0')}:${match24[2]}`,
            end: `${match24[3].padStart(2, '0')}:${match24[4]}`
        };
    }
    
    // Try to match 9am-5pm or 9am to 5pm style
    let match12 = input.match(/(\d{1,2})(am|pm)[-to]*(\d{1,2})(am|pm)/);
    if (match12) {
        let startHour = parseInt(match12[1]);
        let endHour = parseInt(match12[3]);
        
        if (match12[2] === 'pm' && startHour !== 12) startHour += 12;
        if (match12[2] === 'am' && startHour === 12) startHour = 0;
        if (match12[4] === 'pm' && endHour !== 12) endHour += 12;
        if (match12[4] === 'am' && endHour === 12) endHour = 0;
        
        return {
            start: `${String(startHour).padStart(2, '0')}:00`,
            end: `${String(endHour).padStart(2, '0')}:00`
        };
    }
    
    // Try 16:00-23:30 style (with possible minutes)
    let matchRange = input.match(/(\d{1,2}):?(\d{2})?[-to]+(\d{1,2}):?(\d{2})?/);
    if (matchRange) {
        return {
            start: `${matchRange[1].padStart(2, '0')}:${matchRange[2] || '00'}`,
            end: `${matchRange[3].padStart(2, '0')}:${matchRange[4] || '00'}`,
        };
    }
    
    return null;
}



// ===================================
// DEBUG: TEST PAST BLOCKS HIDING
// ===================================
// To test: Open browser console (F12) and type: testPastBlocksHiding('14:30')
// This will simulate current time as 14:30 and show which blocks get hidden
function testPastBlocksHiding(testTime) {
    console.log(`\n🧪 TESTING PAST BLOCKS HIDING at time: ${testTime}\n`);
    
    if (!currentDay) {
        console.log('❌ No day is currently selected. Please select a day first.');
        return;
    }
    
    // Parse test time
    const [hours, minutes] = testTime.split(':').map(Number);
    const testMinutes = hours * 60 + minutes;
    
    console.log(`Test time in minutes: ${testMinutes} (${testTime})`);
    
    const blocks = document.querySelectorAll(`#${currentDay}Content .time-block`);
    console.log(`Total blocks found: ${blocks.length}`);
    
    let pastBlocks = [];
    let currentBlockIndex = -1;
    
    blocks.forEach((block, index) => {
        const timeStr = block.dataset.time;
        const [startStr, endStr] = timeStr.split('-');
        
        let startMin = timeToMinutes(startStr);
        let endMin = timeToMinutes(endStr);
        
        if (endMin < startMin) {
            endMin += 24 * 60;
        }
        
        const status = testMinutes >= startMin && testMinutes < endMin ? 'CURRENT' : 
                      testMinutes >= endMin ? 'PAST' : 'FUTURE';
        
        console.log(`Block ${index}: ${timeStr} - ${status}`);
        
        if (testMinutes >= startMin && testMinutes < endMin) {
            currentBlockIndex = index;
        } else if (testMinutes >= endMin) {
            pastBlocks.push({ block, index, time: timeStr });
        }
    });
    
    console.log(`\nCurrent block index: ${currentBlockIndex}`);
    console.log(`Past blocks count: ${pastBlocks.length}`);
    
    if (currentBlockIndex > 0 && pastBlocks.length > 0) {
        const blocksToHide = pastBlocks.length - 3;
        console.log(`Blocks to hide: ${blocksToHide} (keeping last 3 visible)`);
        
        if (blocksToHide > 0) {
            console.log('\n🙈 HIDING THESE BLOCKS:');
            pastBlocks.slice(0, blocksToHide).forEach(item => {
                console.log(`  - Block ${item.index}: ${item.time}`);
            });
            
            console.log('\n👁️ KEEPING THESE PAST BLOCKS VISIBLE:');
            pastBlocks.slice(blocksToHide).forEach(item => {
                console.log(`  - Block ${item.index}: ${item.time}`);
            });
        } else {
            console.log('\n✅ No blocks need hiding (3 or fewer past blocks)');
        }
    } else {
        console.log('\n✅ No hiding needed (no current block or no past blocks)');
    }
    
    console.log('\n💡 To actually apply hiding, the real updateCurrentTimeHighlight() function runs every second.');
}

console.log('✅ Debug function loaded! Use testPastBlocksHiding("14:30") in console to test.');

// ========================================
// NEW MANUAL ADD INTERFACE HANDLERS
// ========================================

function switchAddType(type) {
    const singleDayBtn = document.getElementById('singleDayBtn');
    const wholeWeekBtn = document.getElementById('wholeWeekBtn');
    const dayRadio = document.getElementById('dayTypeRadio');
    const weekRadio = document.getElementById('weekTypeRadio');
    
    const singleDayDateSection = document.getElementById('singleDayDateSection');
    const weekStartDateSection = document.getElementById('weekStartDateSection');
    const workScheduleCheckboxSection = document.getElementById('workScheduleCheckboxSection');
    const workDaysSection = document.getElementById('workDaysSection');
    const addWorkScheduleNew = document.getElementById('addWorkScheduleNew');
    const addCommuteNew = document.getElementById('addCommuteNew');
    const commuteSettingsNew = document.getElementById('commuteSettingsNew');
    
    if (type === 'day') {
        // Style buttons - Single Day selected (blue)
        singleDayBtn.style.background = '#4A90E2';
        singleDayBtn.style.color = 'white';
        wholeWeekBtn.style.background = '#F5D76E';
        wholeWeekBtn.style.color = '#333';
        
        // Update hidden radios
        dayRadio.checked = true;
        weekRadio.checked = false;
        
        // Show Single Day sections
        if (singleDayDateSection) singleDayDateSection.style.display = 'block';
        
        // Hide Whole Week sections
        if (weekStartDateSection) weekStartDateSection.style.display = 'none';
        if (workScheduleCheckboxSection) workScheduleCheckboxSection.style.display = 'none';
        if (workDaysSection) workDaysSection.style.display = 'none';
        if (commuteSettingsNew) commuteSettingsNew.style.display = 'none';
        
        // Uncheck checkboxes
        if (addWorkScheduleNew) addWorkScheduleNew.checked = false;
        if (addCommuteNew) addCommuteNew.checked = false;
        
        // Trigger existing logic
        if (dayRadio.onchange) dayRadio.onchange();
    } else {
        // Style buttons - Whole Week selected (blue)
        singleDayBtn.style.background = '#F5D76E';
        singleDayBtn.style.color = '#333';
        wholeWeekBtn.style.background = '#4A90E2';
        wholeWeekBtn.style.color = 'white';
        
        // Update hidden radios
        dayRadio.checked = false;
        weekRadio.checked = true;
        
        // Hide Single Day sections
        if (singleDayDateSection) singleDayDateSection.style.display = 'none';
        
        // Show Whole Week sections
        if (weekStartDateSection) weekStartDateSection.style.display = 'block';
        if (workScheduleCheckboxSection) workScheduleCheckboxSection.style.display = 'block';
        
        // Trigger existing logic
        if (weekRadio.onchange) weekRadio.onchange();
    }
}

// Sync new inputs with old ones
document.addEventListener('DOMContentLoaded', function() {
    // Sync single day date
    const singleDayDateInput = document.getElementById('singleDayDateInput');
    const oldDayDate = document.getElementById('dayDate');
    
    if (singleDayDateInput && oldDayDate) {
        singleDayDateInput.addEventListener('input', function() {
            // Convert date input (YYYY-MM-DD) to format the old system expects
            if (this.value) {
                const parts = this.value.split('-');
                oldDayDate.value = `${parts[2]}/${parts[1]}/${parts[0]}`;
            } else {
                oldDayDate.value = '';
            }
        });
    }
    
    // Sync week start date
    const weekStartDateInput = document.getElementById('weekStartDateInput');
    const oldWeekStartDate = document.getElementById('weekStartDate');
    
    if (weekStartDateInput) {
        weekStartDateInput.addEventListener('input', function() {
            if (this.value) {
                const parts = this.value.split('-');
                const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                if (oldWeekStartDate) oldWeekStartDate.value = formattedDate;
                if (oldDayDate) oldDayDate.value = formattedDate;
                
                // Update work days to show correct dates starting from selected date
                updateManualWorkDays(new Date(this.value));
            } else {
                if (oldWeekStartDate) oldWeekStartDate.value = '';
                if (oldDayDate) oldDayDate.value = '';
            }
        });
    }
    
    // Function to update manual work days based on selected start date
    function updateManualWorkDays(startDate) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const workDaysSection = document.getElementById('workDaysSection');
        
        if (!workDaysSection) return;
        
        // Clear existing content
        const grid = workDaysSection.querySelector('div[style*="display: grid"]');
        if (!grid) return;
        
        let html = '';
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dayName = getDayName(currentDate);
            const dateStr = currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            const dayKey = days[i];
            
            html += `
                <div style="display: grid; grid-template-columns: 100px auto; align-items: center; gap: 10px;">
                    <span style="font-weight: 500; color: #333;">${dayName} <span style="font-size: 12px; color: #999;">${dateStr}</span></span>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <input type="time" class="day-work-start" data-day="${dayKey}" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" />
                        <span>to</span>
                        <input type="time" class="day-work-end" data-day="${dayKey}" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" />
                    </div>
                </div>
            `;
        }
        
        grid.innerHTML = html;
        
        // Re-attach event listeners for syncing
        syncWorkTimesToOldSystem();
    }
    
    // Function to sync work times to old system
    function syncWorkTimesToOldSystem() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNumbers = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 0 };
        
        days.forEach(day => {
            const startInput = document.querySelector(`.day-work-start[data-day="${day}"]`);
            const endInput = document.querySelector(`.day-work-end[data-day="${day}"]`);
            
            if (startInput && endInput) {
                const syncToOldSystem = () => {
                    const dayNum = dayNumbers[day];
                    const oldWorkDayItem = document.querySelector(`.work-day-item .work-day-check[value="${dayNum}"]`)?.closest('.work-day-item');
                    
                    if (oldWorkDayItem) {
                        const oldCheckbox = oldWorkDayItem.querySelector('.work-day-check');
                        const oldStart = oldWorkDayItem.querySelector('.work-start');
                        const oldEnd = oldWorkDayItem.querySelector('.work-end');
                        const oldTimesDiv = oldWorkDayItem.querySelector('.work-day-times');
                        
                        if (startInput.value && endInput.value) {
                            if (oldCheckbox) oldCheckbox.checked = true;
                            if (oldStart) oldStart.value = startInput.value;
                            if (oldEnd) oldEnd.value = endInput.value;
                            if (oldTimesDiv) oldTimesDiv.style.display = 'block';
                        } else {
                            if (oldCheckbox) oldCheckbox.checked = false;
                            if (oldTimesDiv) oldTimesDiv.style.display = 'none';
                        }
                    }
                };
                
                startInput.addEventListener('change', syncToOldSystem);
                endInput.addEventListener('change', syncToOldSystem);
            }
        });
    }
    
    // Sync work schedule checkbox
    const addWorkScheduleNew = document.getElementById('addWorkScheduleNew');
    const addWorkSchedule = document.getElementById('addWorkSchedule');
    const workDaysSection = document.getElementById('workDaysSection');
    
    if (addWorkScheduleNew) {
        addWorkScheduleNew.addEventListener('change', function() {
            if (workDaysSection) {
                workDaysSection.style.display = this.checked ? 'block' : 'none';
                
                // If showing work days and date is selected, update the display
                if (this.checked && weekStartDateInput && weekStartDateInput.value) {
                    updateManualWorkDays(new Date(weekStartDateInput.value));
                } else if (this.checked) {
                    // Just sync event listeners for existing inputs
                    syncWorkTimesToOldSystem();
                }
            }
            if (addWorkSchedule) {
                addWorkSchedule.checked = this.checked;
                if (addWorkSchedule.onchange) addWorkSchedule.onchange();
            }
        });
    }
    
    // Sync commute checkbox
    const addCommuteNew = document.getElementById('addCommuteNew');
    const addCommute = document.getElementById('addCommute');
    const commuteSettingsNew = document.getElementById('commuteSettingsNew');
    const commuteSettings = document.getElementById('commuteSettings');
    
    if (addCommuteNew) {
        addCommuteNew.addEventListener('change', function() {
            if (commuteSettingsNew) {
                commuteSettingsNew.style.display = this.checked ? 'block' : 'none';
            }
            if (addCommute) {
                addCommute.checked = this.checked;
                if (addCommute.onchange) addCommute.onchange();
            }
        });
    }
    
    // Sync commute duration
    const commuteDurationNew = document.getElementById('commuteDurationNew');
    const commuteDuration = document.getElementById('commuteDuration');
    
    if (commuteDurationNew && commuteDuration) {
        commuteDurationNew.addEventListener('input', function() {
            commuteDuration.value = this.value;
        });
    }

    renderHomeInventoryTable();
    populatePreferredShopSelect();
    setTimeout(populatePreferredShopSelect, 400);
});

console.log('✅ New manual add interface handlers loaded!');

// ===================================
// PHASE 6: SETTINGS UI & HISTORY
// ===================================

/**
 * Open settings modal and load current stats
 */
function openSettings() {
    document.getElementById('settingsModal').classList.add('active');
    loadSettingsStats();
    loadScheduleHistory();
}

/**
 * Close settings modal
 */
function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}

/**
 * Load and display usage statistics
 */
function loadSettingsStats() {
    // Generation count
    const genData = JSON.parse(localStorage.getItem('aiGenerationCount')) || {
        count: 0,
        firstGenerated: null,
        lastGenerated: null
    };
    
    document.getElementById('statsGenerationCount').textContent = genData.count;
    
    // First generated
    if (genData.firstGenerated) {
        const date = new Date(genData.firstGenerated);
        document.getElementById('statsFirstGenerated').textContent = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } else {
        document.getElementById('statsFirstGenerated').textContent = 'Never';
    }
    
    // Last generated
    if (genData.lastGenerated) {
        const date = new Date(genData.lastGenerated);
        document.getElementById('statsLastGenerated').textContent = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        document.getElementById('statsLastGenerated').textContent = 'Never';
    }
    
    // Recipes tried
    const history = JSON.parse(localStorage.getItem('recipeUsageHistory')) || {};
    const recipesTried = Object.keys(history).length;
    document.getElementById('statsRecipesTried').textContent = recipesTried;
}

/**
 * Load and display schedule history
 */
function loadScheduleHistory() {
    const history = JSON.parse(localStorage.getItem('scheduleHistory_v2')) || [];
    const container = document.getElementById('scheduleHistoryList');
    
    if (history.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #9ca3af;">
                <p style="font-size: 16px; margin: 0;">No schedules generated yet</p>
                <p style="font-size: 14px; margin: 8px 0 0 0;">Your generated schedules will appear here</p>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    const sorted = history.sort((a, b) => {
        return new Date(b.generatedAt) - new Date(a.generatedAt);
    });
    
    let html = '';
    
    sorted.forEach(entry => {
        const genDate = new Date(entry.generatedAt);
        const dateStr = genDate.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const recipeCount = entry.recipesUsed.length;
        const recipeList = entry.recipesUsed.join(', ');
        
        html += `
            <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div>
                        <div style="font-weight: 600; color: #1f2937; font-size: 15px;">Week of ${entry.weekStart}</div>
                        <div style="color: #6b7280; font-size: 13px; margin-top: 2px;">Generated: ${dateStr}</div>
                    </div>
                    <button onclick="viewScheduleFromHistory('${entry.id}')" style="background: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                        View
                    </button>
                </div>
                
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #f3f4f6;">
                    <div style="color: #6b7280; font-size: 12px; margin-bottom: 4px;">Recipes used (${recipeCount}):</div>
                    <div style="color: #1f2937; font-size: 13px; font-family: monospace;">${recipeList || 'None'}</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * View a specific schedule from history
 */
function viewScheduleFromHistory(scheduleId) {
    const history = JSON.parse(localStorage.getItem('scheduleHistory_v2')) || [];
    const entry = history.find(e => e.id === scheduleId);
    
    if (!entry) {
        alert('Schedule not found');
        return;
    }
    
    // Show the schedule in an alert first
    const schedulePreview = entry.scheduleText.substring(0, 500) + (entry.scheduleText.length > 500 ? '...\n\n(Schedule continues...)' : '');
    
    alert(`📅 Schedule from ${entry.weekStart}\n\n${schedulePreview}\n\n✅ Full schedule stored in history.`);
    
    // Then ask if they want to import
    const shouldImport = confirm(`Would you like to import this schedule?\n\nWeek: ${entry.weekStart}\nRecipes: ${entry.recipesUsed.join(', ')}\n\n⚠️ This will replace your current schedule.`);
    
    if (shouldImport) {
        // Close settings first
        closeSettings();
        
        // Parse and import the schedule
        if (typeof parseAndCreateSchedule === 'function') {
            parseAndCreateSchedule(entry.scheduleText);
            alert('✅ Schedule imported!');
        } else {
            alert('❌ Import function not available');
        }
    }
}

/**
 * Clear recipe usage history (30-day tracking)
 */
function resetRecipeHistory() {
    const confirm1 = confirm('Reset recipe usage history?\n\nAll recipes will be available for selection again.');
    if (!confirm1) return;
    
    localStorage.setItem('recipeUsageHistory', JSON.stringify({}));
    
    alert('✅ Recipe usage history reset!\n\nAll recipes are now available for selection.');
    
    loadSettingsStats();
}

/**
 * Clear all saved schedules
 */
function resetScheduleHistory() {
    const confirm1 = confirm('Clear all saved schedules from history?\n\nThis cannot be undone.');
    if (!confirm1) return;
    
    localStorage.setItem('scheduleHistory_v2', JSON.stringify([]));
    
    alert('✅ Schedule history cleared!');
    
    loadScheduleHistory();
}

/**
 * Nuclear option - delete everything
 */
function resetAllData() {
    const confirm1 = confirm(
        '⚠️ DELETE EVERYTHING?\n\n' +
        'This will remove:\n' +
        '• Custom recipes (CR1, CR2, ...)\n' +
        '• Kitchen Stock items\n' +
        '• Recipe usage history\n' +
        '• Schedule history\n' +
        '• All settings and preferences\n\n' +
        'Are you ABSOLUTELY sure?'
    );
    
    if (!confirm1) return;
    
    const confirm2 = confirm(
        'FINAL WARNING!\n\n' +
        'This action CANNOT be undone.\n\n' +
        'Click OK to proceed with deletion.'
    );
    
    if (!confirm2) return;
    
    // Keep only PWA essentials
    const essentialKeys = ['updateDismissed', 'lastSeenVersion', 'pwaInstalled'];
    const backup = {};
    
    essentialKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) backup[key] = value;
    });
    
    // Clear everything
    localStorage.clear();
    
    // Restore essentials
    Object.keys(backup).forEach(key => {
        localStorage.setItem(key, backup[key]);
    });
    
    alert('🗑️ All data deleted.\n\nReloading application...');
    
    // Reload page
    window.location.reload();
}

console.log('✅ Phase 6: Settings & History loaded!');
