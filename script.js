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

// Default schedule data structure
let scheduleData = {
    userName: 'Ivan',
    dateInfo: 'December 2025 🚴',
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
            <button onclick="document.getElementById('editMode').click(); setTimeout(() => document.getElementById('addDayBtn').click(), 100);" 
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
    const calendarBtn = document.getElementById('calendarMode');
    const editBtn = document.getElementById('editMode');
    const manageDefaultsBtn = document.getElementById('manageDefaultsBtn');
    
    if (!calendarBtn || !editBtn) {
        console.error('Calendar or Edit button not found!');
        return;
    }
    
    // Initialize: hide Manage Defaults if it exists
    if (manageDefaultsBtn) {
        manageDefaultsBtn.classList.add('hidden');
    }

    calendarBtn.addEventListener('click', () => {
        calendarBtn.classList.add('active');
        editBtn.classList.remove('active');
        if (manageDefaultsBtn) {
            manageDefaultsBtn.classList.remove('active');
            manageDefaultsBtn.classList.add('hidden');
        }
        document.body.classList.remove('edit-mode');
        hideEditElements();
        
        // Disable shopping edit mode
        disableShoppingEditMode();
        
        // Disable Quick Add edit mode
        window.quickAddEditMode = false;
        
        // Re-render Quick Add modal if it's open
        const quickAddModal = document.getElementById('quickAddModal');
        if (quickAddModal && quickAddModal.classList.contains('active')) {
            renderQuickAddModal();
        }
    });

    editBtn.addEventListener('click', () => {
        editBtn.classList.add('active');
        calendarBtn.classList.remove('active');
        if (manageDefaultsBtn) {
            manageDefaultsBtn.classList.remove('active');
            manageDefaultsBtn.classList.remove('hidden');
        }
        document.body.classList.add('edit-mode');
        showEditElements();
        
        // Enable shopping edit mode
        enableShoppingEditMode();
        
        // Enable Quick Add edit mode
        window.quickAddEditMode = true;
        
        // Re-render Quick Add modal if it's open
        const quickAddModal = document.getElementById('quickAddModal');
        if (quickAddModal && quickAddModal.classList.contains('active')) {
            renderQuickAddModal();
        }
    });
    
    if (manageDefaultsBtn) {
        manageDefaultsBtn.addEventListener('click', () => {
            openDefaultsModal();
        });
    }
}

function hideEditElements() {
    document.querySelectorAll('.edit-col').forEach(el => el.style.display = 'none');
    document.getElementById('addShoppingItem').style.display = 'none';
    document.getElementById('addRecipeItem').style.display = 'none';
}

function showEditElements() {
    document.querySelectorAll('.edit-col').forEach(el => el.style.display = 'table-cell');
    document.getElementById('addShoppingItem').style.display = 'block';
    document.getElementById('addRecipeItem').style.display = 'block';
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
                const monthYear = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
                monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
            }
        });
        
        // Find most common month
        let maxCount = 0;
        let currentMonth = 'December 2025 🚴';
        for (const [month, count] of Object.entries(monthCounts)) {
            if (count > maxCount) {
                maxCount = count;
                currentMonth = month + ' 🚴';
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
    
    titleSuggestBtn.addEventListener('click', () => {
        if (titleSuggestions.style.display === 'none' || !titleSuggestions.style.display) {
            titleSuggestions.style.display = 'block';
            titleSuggestions.innerHTML = '';
            
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

    html += '<button class="add-event-btn" onclick="openEventModal()">➕ Add Event</button>';
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
    
    // Add default blocks if any
    if (scheduleData.defaultBlocks && scheduleData.defaultBlocks.length > 0) {
        scheduleData.defaultBlocks.forEach(defaultBlock => {
            blocks.push({...defaultBlock}); // Copy the block
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
                blocks.push({...defaultBlock});
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
    document.getElementById('applyToAllDays').checked = false;
    
    showEmojiSuggestions(block.title || '');
    document.getElementById('editModal').classList.add('active');
}

function addNewBlock(dayKey, afterIndex) {
    currentEditingDay = dayKey;
    currentEditingBlock = afterIndex + 1;
    
    document.getElementById('modalTitle').textContent = 'Add New Time Block';
    
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
    document.getElementById('applyToAllDays').checked = false;
    document.getElementById('emojiSuggestions').innerHTML = '';
    
    document.getElementById('editModal').classList.add('active');
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

    const newBlock = {
        time: time,
        title: title,
        tasks: tasks,
        note: note,
        video: video
    };

    // Apply to current day
    if (currentEditingBlock === -1 || currentEditingBlock >= scheduleData.days[currentEditingDay].blocks.length) {
        scheduleData.days[currentEditingDay].blocks.push(newBlock);
    } else {
        scheduleData.days[currentEditingDay].blocks[currentEditingBlock] = newBlock;
    }

    // If "Apply to all days" is checked, add to defaultBlocks for NEW days
    if (applyToAll) {
        // Check if this block already exists in defaults
        const existingIndex = scheduleData.defaultBlocks.findIndex(b => b.time === time);
        if (existingIndex >= 0) {
            scheduleData.defaultBlocks[existingIndex] = newBlock;
        } else {
            scheduleData.defaultBlocks.push(newBlock);
        }
        
        alert('✅ Added to default blocks! This will be applied to all NEW days you create.');
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
    const savedHTML = localStorage.getItem('shoppingListHTML');
    
    if (!savedHTML) {
        container.innerHTML = `
            <div style="text-align: center; color: #999; padding: 40px 20px;">
                <p style="font-size: 18px; margin: 0;">📝 No shopping list yet</p>
                <p style="font-size: 14px; margin: 10px 0 0 0;">Use "⚡ Quick Add" button to add items</p>
            </div>
        `;
    } else {
        // Display the HTML table
        container.innerHTML = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                ${savedHTML}
            </div>
        `;
    }
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
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
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

// Legacy function for compatibility
function toggleShoppingEditMode() {
    if (shoppingEditMode) {
        disableShoppingEditMode();
    } else {
        enableShoppingEditMode();
    }
}

function recalculateShopTotals(table) {
    const rows = table.querySelectorAll('tbody tr:not(:last-child)');
    let totalPrice = 0;
    let totalQty = 0;
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const priceText = cells[2].textContent.replace('£', '').trim();
        const qtyText = cells[3].textContent.trim();
        
        const price = parseFloat(priceText) || 0;
        const qty = parseFloat(qtyText) || 0;
        
        totalPrice += price * qty;
        totalQty += qty;
    });
    
    // Update totals row
    const totalRow = table.querySelector('tbody tr:last-child');
    if (totalRow) {
        const totalCells = totalRow.querySelectorAll('td');
        totalCells[1].textContent = `£${totalPrice.toFixed(2)}`;
        totalCells[2].textContent = `Total Qty: ${totalQty % 1 !== 0 ? totalQty.toFixed(1) : totalQty}`;
    }
}

function renderRecipes() {
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

function renderDefaultBlocksList() {
    const container = document.getElementById('defaultBlocksList');
    
    if (!container) {
        console.warn('defaultBlocksList element not found');
        return;
    }
    
    if (!scheduleData.defaultBlocks || scheduleData.defaultBlocks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No default blocks yet. Use "Apply to all days" when creating a task to add it here.</p>';
        return;
    }
    
    let html = '';
    scheduleData.defaultBlocks.forEach((block, index) => {
        html += `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 10px; position: relative;">
                <button onclick="removeDefaultBlock(${index})" style="position: absolute; top: 10px; right: 10px; background: #ff6b6b; color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 16px;">✕</button>
                <div style="font-weight: bold; color: #667eea; margin-bottom: 5px;">${block.time}</div>
                <div style="font-size: 16px; margin-bottom: 5px;">${block.title}</div>
                ${block.tasks && block.tasks.length > 0 ? `<div style="font-size: 14px; color: #666;">Tasks: ${block.tasks.join(', ')}</div>` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function removeDefaultBlock(index) {
    if (confirm('Remove this block from defaults?')) {
        scheduleData.defaultBlocks.splice(index, 1);
        renderDefaultBlocksList();
        saveToLocalStorage();
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

let pantryItems = [];

// Load pantry from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('pantryItems');
    if (saved) {
        pantryItems = JSON.parse(saved);
    }
});

function openPromptGenerator() {
    document.getElementById('promptGeneratorModal').classList.add('active');
    document.getElementById('generatedPromptSection').style.display = 'none';
    
    // Set today's date as default
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('promptWeekDate').value = dateStr;
    
    // Populate work days
    populateWorkDays(today);
    
    // Render pantry items
    renderPantryItems();
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
}

// Listen for date changes
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('promptWeekDate');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            const date = new Date(this.value);
            populateWorkDays(date);
        });
    }
});

function addPantryItem() {
    const input = document.getElementById('pantryItemInput');
    const item = input.value.trim();
    
    if (item && !pantryItems.includes(item)) {
        pantryItems.push(item);
        localStorage.setItem('pantryItems', JSON.stringify(pantryItems));
        renderPantryItems();
        input.value = '';
    }
}

function removePantryItem(index) {
    pantryItems.splice(index, 1);
    localStorage.setItem('pantryItems', JSON.stringify(pantryItems));
    renderPantryItems();
}

function renderPantryItems() {
    const container = document.getElementById('pantryList');
    if (!container) return;
    
    if (pantryItems.length === 0) {
        container.innerHTML = '<p style="margin: 0; color: #95a5a6; font-size: 13px;">No items yet. Add items above!</p>';
        return;
    }
    
    let html = '';
    pantryItems.forEach((item, index) => {
        html += `
            <div style="background: #ecf0f1; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; gap: 8px; font-size: 14px;">
                <span>${item}</span>
                <button type="button" onclick="removePantryItem(${index})" style="background: #e74c3c; color: white; border: none; border-radius: 4px; width: 20px; height: 20px; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center;">×</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

function openResponseImporter() {
    document.getElementById('responseImporterModal').classList.add('active');
}

function closeResponseImporter() {
    document.getElementById('responseImporterModal').classList.remove('active');
}

function generatePrompt() {
    // Get all form data
    const weekDate = document.getElementById('promptWeekDate').value || new Date().toISOString().split('T')[0];
    
    // Get work schedule from time inputs - CORRECTLY this time
    let workSchedule = '';
    const startDate = new Date(weekDate);
    
    for (let i = 0; i < 7; i++) {
        const startInput = document.getElementById(`workDay${i}Start`);
        const endInput = document.getElementById(`workDay${i}End`);
        
        if (!startInput || !endInput) continue;
        
        const start = startInput.value;
        const end = endInput.value;
        
        if (start && end) {
            // Calculate the actual date for this day
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + i);
            const dayName = getDayName(dayDate); // Gets "Monday", "Tuesday", etc.
            
            workSchedule += `${dayName}: ${start}-${end}\n`;
        }
    }
    
    const addCommute = document.getElementById('promptAddCommute').checked;
    const commuteDuration = document.getElementById('promptCommuteDuration').value;
    const studySubjects = document.getElementById('promptStudySubjects').value;
    const examDates = document.getElementById('promptExamDates').value;
    const studyHours = document.getElementById('promptStudyHours').value;
    const studyAIDecide = document.getElementById('promptStudyAIDecide').checked;
    const studyTopics = document.getElementById('promptStudyTopics').value;
    const foodPrefs = document.getElementById('promptFoodPrefs').value;
    const freeMeals = document.getElementById('promptFreeMeals').checked;
    const pantry = pantryItems.join(', ');
    const budgetSelect = document.getElementById('promptBudget');
    const budget = budgetSelect.options[budgetSelect.selectedIndex].text; // Get full text, not value
    const hobbies = document.getElementById('promptHobbies').value;
    const hobbyHours = document.getElementById('promptHobbyHours').value;
    const hobbyAIDecide = document.getElementById('promptHobbyAIDecide').checked;
    const oneOffTasks = document.getElementById('promptOneOffTasks').value;
    const sleepSchedule = document.getElementById('promptSleep').value;
    const includeRelax = document.getElementById('promptRelax').checked;
    
    // Format the week start date nicely
    const weekDateObj = new Date(weekDate);
    const weekDateFormatted = weekDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // Generate comprehensive prompt
    const prompt = `I need you to create a complete weekly schedule for me. Please read ALL my information carefully and create a detailed schedule.

📅 WEEK INFORMATION:
- Week starts: ${weekDateFormatted} (${weekDate})
- IMPORTANT: Start the week from this exact date (even if it's not Monday)
- Create 7 consecutive days starting from this date

💼 WORK INFORMATION:
${workSchedule || 'No work this week'}
${addCommute && workSchedule ? `- Add ${commuteDuration}-minute commute TO work (before shift) and FROM work (after shift)` : ''}

📚 STUDY:
- Subjects: ${studySubjects || 'None'}
${examDates ? `- IMPORTANT EXAMS: ${examDates}` : ''}
- Study time needed: ${studyAIDecide ? 'YOU DECIDE the optimal hours based on my schedule' : studyHours + ' hours per day'}
${studyTopics ? `- Focus topics:\n${studyTopics}` : ''}

🍳 MEALS & FOOD:
- Preferences: ${foodPrefs || 'No preferences'}
- Current pantry: ${pantry || 'Empty - need to buy everything'}
- Budget: ${budget}
${freeMeals ? '- IMPORTANT: I get FREE meals at work! Reduce shopping accordingly and note this in schedule.' : '- No free meals at work - need to plan all meals myself.'}

🎯 HOBBIES:
- Hobbies: ${hobbies || 'None'}
- Time per day: ${hobbyAIDecide ? 'YOU DECIDE the optimal time' : hobbyHours + ' hours'}

✅ ONE-OFF TASKS & ERRANDS:
${oneOffTasks ? `These MUST be scheduled somewhere this week:\n${oneOffTasks}` : 'No special tasks this week'}
- Find appropriate time slots for each task
- Spread them across the week logically

😴 SLEEP & REST:
- Preferred sleep: ${sleepSchedule}
${includeRelax ? '- Include relaxation/free time blocks' : ''}

📋 WHAT I NEED FROM YOU:

Please create a COMPLETE weekly schedule using this EXACT format:

CRITICAL FORMAT RULES:
1. Each time block must be on a SEPARATE line
2. Use this format: TIME | EMOJI TITLE | Tasks/description
3. Never combine multiple time blocks into one line
4. Use em-dashes (—) or regular dashes (-) in day headers
5. Include the actual date in each day header

CORRECT FORMAT EXAMPLE:

=== FRIDAY — 12 Dec 2025 ===

07:00–07:30 | ☕ Morning Routine | Wake up, shower, get ready
07:30–08:00 | 🍳 Breakfast | Eggs and toast
08:00–10:00 | 📚 Study Math | Practice fractions and percentages
10:00–10:30 | ☕ Break | Tea and rest
... (continue for whole day)

=== SATURDAY — 13 Dec 2025 ===

07:00–07:30 | ☀️ Morning Routine | Wake up, stretch
07:30–08:00 | 🍳 Breakfast | Simple breakfast
... (same format)

... (continue for all 7 consecutive days)

📋 SHOPPING LIST (LIGHT — free meals at work!)

IMPORTANT: Format this beautifully with emojis, clear sections, and visual appeal!

Using pantry first: ${pantry || 'none'}
${freeMeals ? 'You get free work meals, so you need less food!' : 'Need to plan all meals.'}
Budget: ${budget}

Format like this:

🛒 SHOPPING LIST (LIGHT — free meals at work!)

Using pantry first (eggs, bread, milk, pasta).
Budget: ${budget}

Essentials:
• Tomatoes (canned or fresh)
• Butter
• Fruit (bananas/apples)
• Ukrainian-style dumplings (vareniki, 1 bag)
• Yogurt
• Tea bags
• Basic seasonings (salt/pepper if low)

Estimated Cost: £18–£25

🍽️ MEAL PLAN SUMMARY + SIMPLE RECIPES

IMPORTANT: Format recipes beautifully with clear sections, emojis, and step-by-step instructions!

Format each recipe like this:

🥚 Simple Eggs & Toast

Whisk eggs — pan with butter — toast bread — serve.
Video: https://www.youtube.com/watch?v=R1vNHvH6bW8

🍝 Quick Ukrainian-Style Pasta

Boil pasta — add butter — pepper — optional fried egg on top.
Video: https://www.youtube.com/watch?v=g8uJ3z_NB18

For detailed recipes, format like this:

📋 DETAILED RECIPE: Ukrainian-Style Butter Pasta with Fried Egg

Simple filling, cheap — perfect for study days.

Ingredients (for 1 large meal):
• Ukrainian pasta (any kind)
• 2 eggs
• Butter (2 tbsp)
• Salt + pepper

Instructions:
1. Boil Pasta
   • Bring pot of salted water to boil
   • Add pasta and cook per package
   • Drain (save a bit water for sauce)
   
2. Prep While Pasta Cooks
   • Crack eggs into bowl
   • Season with salt/pepper (optional: chili)
   
3. Butter Pasta
   • Add 1-2 tbsp butter
   • Toss so butter coats all pasta
   
4. Fry Egg
   • Heat pan on med-high (a bit oil/butter)
   • Crack egg into pan (or pre-scrambled egg)
   • Cook 2-4 minutes till whites set but yolk runny
   
5. Serve
   • Plate the buttered pasta
   • Top with fried egg
   • Add salt, pepper, and optional chili/herbs

Result:
A warm, buttery, delicately-simple pasta with egg that can be made for lunch.

Video: [Full YouTube URL]

CRITICAL FORMATTING RULES (MUST FOLLOW):
1. ⚠️ NEVER write: "07:00-07:30 | Morning Routine 07:30-08:00 | Breakfast" 
   ✅ ALWAYS write each block on separate lines:
   07:00-07:30 | Morning Routine | Wake up, shower
   07:30-08:00 | Breakfast | Eggs and toast

2. Each time block MUST be on its own line
3. Use the pipe (|) separator: TIME | TITLE | TASKS
4. Include dates in headers: "=== MONDAY — 15 Dec 2025 ==="
5. Start from ${weekDateFormatted} and create 7 consecutive days
6. ${freeMeals ? 'Note FREE work meals in schedule and reduce shopping!' : 'Plan all meals.'}
7. Use items from pantry first: ${pantry || 'none'}
8. Keep meals simple and quick
9. Add relaxation time after work shifts
10. Make sleep schedule realistic: ${sleepSchedule}
${examDates ? '11. Increase study time before exam dates!' : ''}
${oneOffTasks ? '12. FIT IN THE ONE-OFF TASKS! Spread them across the week!' : ''}

EXAMPLE OF WRONG FORMAT (DON'T DO THIS):
07:00-07:30 | Morning Routine 07:30-08:00 | Breakfast 08:00-11:00 | Work

EXAMPLE OF CORRECT FORMAT (DO THIS):
07:00-07:30 | Morning Routine | Wake up, shower
07:30-08:00 | Breakfast | Eggs and toast  
08:00-11:00 | Work | Office tasks

Be specific, detailed, and helpful! Include YouTube recipe links for meals!`;

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

function importAIResponse() {
    const response = document.getElementById('aiResponseInput').value.trim();
    
    if (!response) {
        alert('⚠️ Please paste the AI response first!');
        return;
    }
    
    console.log('=== IMPORT STARTED ===');
    console.log('Raw response length:', response.length);
    console.log('First 200 chars:', response.substring(0, 200));
    
    try {
        // Parse AI response and create schedule
        parseAndCreateSchedule(response);
        
        // Count how many days were actually created
        const daysCreated = Object.keys(scheduleData.days).length;
        
        // Close importer
        closeResponseImporter();
        document.getElementById('aiResponseInput').value = '';
        
        // Success message with actual count
        alert(`🎉 SUCCESS!\n\n${daysCreated} day${daysCreated > 1 ? 's' : ''} imported to your schedule!\n\n✅ Check your calendar now!`);
        
    } catch (error) {
        console.error('Parse error details:', error);
        console.error('Error stack:', error.stack);
        
        // Show detailed error message
        let errorMsg = '❌ Error importing schedule\n\n';
        errorMsg += 'Error: ' + error.message + '\n\n';
        errorMsg += 'Troubleshooting:\n';
        errorMsg += '1. Make sure you copied the COMPLETE AI response\n';
        errorMsg += '2. Response should include day headers like "=== MONDAY — 15 Dec 2025 ==="\n';
        errorMsg += '3. Each time block should be on its own line\n';
        errorMsg += '4. Format: "07:00-07:30 | Title | Tasks"\n';
        errorMsg += '5. Check browser console (F12) for detailed logs\n\n';
        errorMsg += 'Common mistakes:\n';
        errorMsg += '- Multiple blocks on one line (wrong)\n';
        errorMsg += '- Missing day headers\n';
        errorMsg += '- Incorrect time format\n';
        
        alert(errorMsg);
    }
}

function parseAndCreateSchedule(response) {
    console.log('=== PARSING STARTED ===');
    
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
    const dayData = {}; // Will store by ACTUAL date offset, not day name index!
    
    allDayNames.forEach((dayName, dayNameIndex) => {
        console.log(`\n--- Parsing ${dayName} ---`);
        
        // VERY flexible patterns - handles dates, em-dashes, everything!
        const patterns = [
            // Pattern 1: === FRIDAY — 12 Dec 2025 ===
            new RegExp(`===\\s*${dayName}\\s*[—–-]?\\s*(?:\\d+\\s+\\w+\\s+\\d+)?\\s*===([\\s\\S]*?)(?===\\s*(?:${allDayNames.join('|')}|🛒|SHOPPING|MEAL)|$)`, 'i'),
            // Pattern 2: === FRIDAY (Dec 12) ===
            new RegExp(`===\\s*${dayName}\\s*(?:\\([^)]*\\))?\\s*===([\\s\\S]*?)(?===\\s*(?:${allDayNames.join('|')}|🛒|SHOPPING|MEAL)|$)`, 'i'),
            // Pattern 3: === FRIDAY ===
            new RegExp(`===\\s*${dayName}\\s*===([\\s\\S]*?)(?===\\s*(?:${allDayNames.join('|')}|🛒|SHOPPING|MEAL)|$)`, 'i'),
            // Pattern 4: FRIDAY:
            new RegExp(`${dayName}\\s*[—–-]?\\s*(?:\\d+\\s+\\w+\\s+\\d+)?:([\\s\\S]*?)(?=(?:${allDayNames.join('|')}|🛒|SHOPPING|MEAL)[:\\s]|$)`, 'i')
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
                    blocks.push({
                        time: `${startTime}-${endTime}`,
                        title: title || tasks[0] || 'Activity',
                        tasks: tasks.length > 0 ? tasks : ['Activity'],
                        note: '',
                        video: ''
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
    
    if (totalBlocks === 0) {
        throw new Error('No schedule blocks found in the response. Make sure the AI included time blocks like "07:00-07:30 | Title | Tasks"');
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
});

console.log('✅ New manual add interface handlers loaded!');
