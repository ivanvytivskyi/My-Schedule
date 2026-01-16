window.App = window.App || {};
window.App.features = window.App.features || {};
window.App.features['settings-history'] = window.App.features['settings-history'] || {};

function saveScheduleHistoryEntry(startDate, scheduleText, recipeIds = []) {
    if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) return;
    const weekStart = startDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    const history = JSON.parse(localStorage.getItem('scheduleHistory_v2')) || [];
    history.unshift({
        id: `hist_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
        weekStart,
        scheduleText,
        recipesUsed: Array.isArray(recipeIds) ? recipeIds : [],
        generatedAt: new Date().toISOString()
    });
    localStorage.setItem('scheduleHistory_v2', JSON.stringify(history));
}

function buildWeekScheduleText(orderedDays) {
    if (!Array.isArray(orderedDays)) return '';
    const lines = [];
    orderedDays.forEach(({ date }) => {
        if (!date || isNaN(date.getTime())) return;
        const dateStr = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        const dayName = getDayName(date).toUpperCase();
        lines.push(`=== ${dayName} — ${dateStr} ===`);
        const dayKey = Object.keys(scheduleData.days || {}).find(key => {
            return scheduleData.days[key].date === date.toISOString().split('T')[0];
        });
        const day = dayKey ? scheduleData.days[dayKey] : null;
        if (!day || !Array.isArray(day.blocks)) {
            lines.push('');
            return;
        }
        const sortedBlocks = day.blocks.slice().sort((a, b) => {
            const aStart = (a.time || '').split('-')[0] || '';
            const bStart = (b.time || '').split('-')[0] || '';
            return aStart.localeCompare(bStart);
        });
        sortedBlocks.forEach(block => {
            const title = block.title || '';
            const tasks = Array.isArray(block.tasks) && block.tasks.length > 0 ? block.tasks.join(', ') : '';
            lines.push(`${block.time} | ${title} | ${tasks}`);
        });
        lines.push('');
    });
    return lines.join('\n').trim();
}

/**
 * Open settings modal and load current stats
 */
function openSettings() {
    document.getElementById('settingsModal').classList.add('active');
    loadSettingsStats();
    renderScheduleHistory();
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
    const history = JSON.parse(localStorage.getItem('scheduleHistory_v2')) || [];
    const sorted = history.slice().sort((a, b) => new Date(a.generatedAt) - new Date(b.generatedAt));

    document.getElementById('statsGenerationCount').textContent = sorted.length;

    if (sorted.length > 0) {
        const first = new Date(sorted[0].generatedAt);
        const last = new Date(sorted[sorted.length - 1].generatedAt);
        document.getElementById('statsFirstGenerated').textContent = first.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        document.getElementById('statsLastGenerated').textContent = last.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        document.getElementById('statsFirstGenerated').textContent = 'Never';
        document.getElementById('statsLastGenerated').textContent = 'Never';
    }

    // Recipes tried
    const recipeHistory = JSON.parse(localStorage.getItem('recipeUsageHistory')) || {};
    const recipesTried = Object.keys(recipeHistory).length;
    document.getElementById('statsRecipesTried').textContent = recipesTried;
}

/**
 * Load and display schedule history
 */
function renderScheduleHistory(containerId = 'scheduleHistoryList') {
    const history = JSON.parse(localStorage.getItem('scheduleHistory_v2')) || [];
    const container = document.getElementById(containerId);
    if (!container) return;

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

window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.renderScheduleHistory = renderScheduleHistory;
window.saveScheduleHistoryEntry = saveScheduleHistoryEntry;
window.buildWeekScheduleText = buildWeekScheduleText;
window.viewScheduleFromHistory = viewScheduleFromHistory;
window.resetRecipeHistory = resetRecipeHistory;
window.resetScheduleHistory = resetScheduleHistory;
window.resetAllData = resetAllData;

window.App.features['settings-history'] = {
    openSettings,
    closeSettings,
    renderScheduleHistory,
    saveScheduleHistoryEntry,
    buildWeekScheduleText,
    resetRecipeHistory,
    resetScheduleHistory,
    resetAllData
};
