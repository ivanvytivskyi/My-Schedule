window.App = window.App || {};
window.App.features = window.App.features || {};
window.App.features['wizard'] = window.App.features['wizard'] || {};

let currentSetupStep = 1;
const TOTAL_SETUP_STEPS = 4;
let setupWeekCreated = false;
let setupShoppingSelection = null;

function isSetupWizardActive() {
    return document.getElementById('setupWizardModal')?.classList.contains('active');
}

function updateSetupWizardHeader() {
    const title = document.getElementById('setupWizardTitle');
    const stepPill = document.getElementById('setupWizardStepPill');
    if (title) {
        title.textContent = `Setup – Step ${currentSetupStep} of ${TOTAL_SETUP_STEPS}: ${getSetupStepTitle(currentSetupStep)}`;
    }
    if (stepPill) {
        stepPill.textContent = `Step ${currentSetupStep} / ${TOTAL_SETUP_STEPS}`;
    }
}

function getSetupStepTitle(stepNumber) {
    switch (stepNumber) {
        case 1:
            return 'Daily Template';
        case 2:
            return 'Work schedule';
        case 3:
            return 'Cooking preferences';
        case 4:
            return 'Shopping day & time';
        default:
            return 'Daily Template';
    }
}

function openSetupWizard() {
    const modal = document.getElementById('setupWizardModal');
    if (modal) {
        setupWeekCreated = false;
        setupShoppingSelection = null;
        embedDefaultsInSetup();
        embedCookingInSetup();
        renderSetupShoppingNeeded();
        initWorkScheduleSetup();
        currentSetupStep = 1;
        updateSetupWizardHeader();
        document.querySelectorAll('.setup-step-card').forEach(card => card.classList.remove('is-open'));
        modal.classList.add('active');
    }
}

function closeSetupWizard() {
    const modal = document.getElementById('setupWizardModal');
    if (modal) {
        modal.classList.remove('active');
    }
    restoreDefaultsModalContent();
    restoreAdjustableWorkSchedule();
    restoreCookingModalContent();
}

window.openSetupWizard = openSetupWizard;
window.closeSetupWizard = closeSetupWizard;

let defaultsModalContent = null;
let defaultsModalHome = null;
let cookingModalContent = null;
let cookingModalFooter = null;
let cookingModalHome = null;

function cacheDefaultsModalContent() {
    if (!defaultsModalContent) {
        defaultsModalContent = document.querySelector('#manageDefaultsModal .modal-content');
        defaultsModalHome = defaultsModalContent?.parentElement || null;
    }
}

function cacheCookingModalContent() {
    if (!cookingModalContent) {
        cookingModalContent = document.querySelector('#cookingConfigModal .cooking-config-body');
        cookingModalFooter = document.querySelector('#cookingConfigModal .cooking-config-footer');
        cookingModalHome = cookingModalContent?.parentElement || null;
    }
}

function embedDefaultsInSetup() {
    cacheDefaultsModalContent();
    const container = document.getElementById('setupStepDefaultsContainer');
    if (!container || !defaultsModalContent) return;
    if (defaultsModalContent.parentElement !== container) {
        container.appendChild(defaultsModalContent);
        defaultsModalContent.classList.add('embedded-defaults');
    }
    renderDefaultBlocksList();
    if (typeof window.ensureMedicineButton === 'function') {
        window.ensureMedicineButton();
    }
}

function restoreDefaultsModalContent() {
    if (!defaultsModalContent || !defaultsModalHome) return;
    if (defaultsModalContent.parentElement !== defaultsModalHome) {
        defaultsModalHome.appendChild(defaultsModalContent);
        defaultsModalContent.classList.remove('embedded-defaults');
    }
}

function embedCookingInSetup() {
    cacheCookingModalContent();
    const container = document.getElementById('setupCookingContainer');
    if (!container || !cookingModalContent) return;
    if (cookingModalContent.parentElement !== container) {
        container.appendChild(cookingModalContent);
        cookingModalContent.classList.add('embedded-cooking');
    }
    if (cookingModalFooter && cookingModalFooter.parentElement !== container) {
        container.appendChild(cookingModalFooter);
        cookingModalFooter.classList.add('embedded-cooking');
    }
}

function restoreCookingModalContent() {
    if (!cookingModalContent || !cookingModalHome) return;
    if (cookingModalContent.parentElement !== cookingModalHome) {
        cookingModalHome.appendChild(cookingModalContent);
        cookingModalContent.classList.remove('embedded-cooking');
    }
    if (cookingModalFooter && cookingModalFooter.parentElement !== cookingModalHome) {
        cookingModalHome.appendChild(cookingModalFooter);
        cookingModalFooter.classList.remove('embedded-cooking');
    }
}

function applyWorkScheduleToOrderedDays(orderedDays) {
    if (!orderedDays || orderedDays.length === 0) return;

    let addWorkSchedule = document.getElementById('addWorkScheduleNew')?.checked || document.getElementById('addWorkSchedule')?.checked;
    const workSchedule = {};
    const storedPattern = localStorage.getItem(WORK_PATTERN_KEY);
    const patternMode = localStorage.getItem(WORK_PATTERN_MODE_KEY) || 'same';
    const patternRows = storedPattern ? JSON.parse(storedPattern) : [];
    const patternCommute = parseInt(localStorage.getItem(WORK_PATTERN_COMMUTE_KEY) || '15', 10);
    const patternPrep = parseInt(localStorage.getItem(WORK_PATTERN_PREP_KEY) || '20', 10);

    if (!addWorkSchedule && patternMode === 'same' && patternRows.length) {
        addWorkSchedule = true;
        const dayIndexMap = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6
        };
        orderedDays.forEach(({ date }) => {
            const dayOfWeek = date.getDay();
            const match = patternRows.find(row => dayIndexMap[row.day] === dayOfWeek);
            if (match && match.start && match.end) {
                workSchedule[dayOfWeek] = { start: match.start, end: match.end, date: new Date(date) };
            }
        });
    }

    if (addWorkSchedule && Object.keys(workSchedule).length === 0) {
        orderedDays.forEach(({ date, name }) => {
            const key = (name || getDayName(date)).toLowerCase();
            const startInput = document.querySelector(`.day-work-start[data-day="${key}"]`);
            const endInput = document.querySelector(`.day-work-end[data-day="${key}"]`);
            const dayOfWeek = date.getDay();

            if (startInput?.value && endInput?.value) {
                workSchedule[dayOfWeek] = { start: startInput.value, end: endInput.value, date: new Date(date) };
            }
        });
    }

    const commuteSettings = getCommuteSettingsUniversal();
    const addCommute = commuteSettings.addCommute;
    const commuteDuration = commuteSettings.commuteDuration;
    const addCommutePrep = commuteSettings.addCommutePrep;
    const commutePrepDuration = commuteSettings.commutePrepDuration;

    if (!addWorkSchedule) return;

    orderedDays.forEach(day => {
        const dayOfWeek = day.date.getDay();
        const work = workSchedule[dayOfWeek];
        if (!work) return;

        let actualStartTime = work.start;
        let commuteStartTime = actualStartTime;
        if (addCommute) {
            const workStartMins = timeStrToMinutes(actualStartTime);
            let commuteStartMins = workStartMins - commuteDuration;
            if (addCommutePrep) {
                commuteStartMins -= commutePrepDuration;
            }
            commuteStartTime = formatMinutesToTime(commuteStartMins);
        }

        day.workActual = `${work.start}-${work.end}`;
        day.work = `${commuteStartTime}-${work.end}`;
    });
}

function getCommuteSettingsUniversal() {
    if (typeof isSetupWizardActive === 'function' && isSetupWizardActive()) {
        const sharedCommuteInput = document.getElementById('workPatternCommute');
        const sharedPrepInput = document.getElementById('workPatternPrep');
        const sharedCommute = parseInt(sharedCommuteInput?.value || '0', 10);
        const sharedPrep = parseInt(sharedPrepInput?.value || '0', 10);
        const commuteDuration = Number.isFinite(sharedCommute) && sharedCommute > 0 ? sharedCommute : 0;
        const commutePrepDuration = Number.isFinite(sharedPrep) && sharedPrep > 0 ? sharedPrep : 0;
        const addCommute = commuteDuration > 0;
        const addCommutePrep = commutePrepDuration > 0;
        return { addCommute, addCommutePrep, commuteDuration, commutePrepDuration };
    }

    const addCommute = document.getElementById('addCommuteNew')?.checked || document.getElementById('addCommute')?.checked || false;
    const commuteDurationRaw = parseInt(document.getElementById('commuteDurationNew')?.value || document.getElementById('commuteDuration')?.value || '0', 10);
    const commuteDuration = addCommute && Number.isFinite(commuteDurationRaw) ? commuteDurationRaw : 0;
    const addCommutePrep = addCommute && (document.getElementById('addCommutePrepNew')?.checked || false);
    const commutePrepRaw = parseInt(document.getElementById('commutePrepDurationNew')?.value || '0', 10);
    const commutePrepDuration = addCommutePrep && Number.isFinite(commutePrepRaw) ? commutePrepRaw : 0;
    return { addCommute, addCommutePrep, commuteDuration, commutePrepDuration };
}

function buildPreviewBlocksForDay(dayName, date, isWorkDay = false) {
    const blocks = [];
    const defaults = Array.isArray(scheduleData.defaultBlocks) ? scheduleData.defaultBlocks : [];
    const cookingConfig = getCookingConfig();
    const maxWorkCookTime = cookingConfig.maxCookingTimeWorkDays || 45;

    defaults.forEach(defaultBlock => {
        const isEnabled = defaultBlock.enabled !== false;
        const days = defaultBlock.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!isEnabled || !days.includes(dayName)) return;

        const { todayBlock } = splitOvernightBlock(defaultBlock);
        const copyBlock = { ...todayBlock, fromDefault: true, sourceDefaultId: defaultBlock.id };
        blocks.push(...buildPrepTravelBlocks(copyBlock, date));
        blocks.push(copyBlock);
    });

    if (isWorkDay) {
        blocks.push({
            time: '09:00-17:00',
            title: '💼 Work',
            blockType: 'work'
        });
    }

    const addMealBlocks = (mealType, start, end) => {
        blocks.push({
            time: `${start}-${end}`,
            title: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`
        });
        const cookDur = mealType === 'breakfast' ? Math.min(15, maxWorkCookTime)
            : mealType === 'lunch' ? Math.min(30, maxWorkCookTime)
            : Math.min(45, maxWorkCookTime);
        const cookEnd = timeStrToMinutes(start);
        const cookStart = Math.max(0, cookEnd - cookDur);
        blocks.push({
            time: `${formatMinutesToTime(cookStart)}-${formatMinutesToTime(cookEnd)}`,
            title: `Cook ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
            isCookingBlock: true,
            mealType: mealType
        });
    };

    blocks.forEach(block => {
        if (isCookingBlock(block)) return;
        if (isBreakfastBlock(block)) addMealBlocks('breakfast', '08:00', '08:30');
        if (isLunchBlock(block)) addMealBlocks('lunch', '12:30', '13:00');
        if (isDinnerBlock(block)) addMealBlocks('dinner', '18:30', '19:30');
    });

    return blocks;
}

function renderSetupShoppingNeeded() {
    const container = document.getElementById('setupStep4Shopping');
    if (!container) return;

    const setupStartInput = document.getElementById('setupWeekStartDateInput')?.value;
    const fallbackStartInput = document.getElementById('weekStartDateInput')?.value || document.getElementById('weekStartDate')?.value;
    const setupStartDate = parseFlexibleDate(setupStartInput || fallbackStartInput || '');
    if (!setupStartDate) {
        container.innerHTML = `
            <div class="setup-shopping-card">
                <h3>🛒 Shopping Needed</h3>
                <p>Select a week start date in Step 2 to see shopping timing and available slots.</p>
            </div>
        `;
        return;
    }

    const dayEntries = setupWeekCreated
        ? Object.values(scheduleData.days || {})
            .filter(day => day.date)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
        : [];

    const orderedDays = dayEntries.length
        ? dayEntries.map(day => ({
            date: new Date(day.date),
            name: day.name || new Date(day.date).toLocaleDateString('en-GB', { weekday: 'long' }),
            blocks: day.blocks || [],
            hasFinalBlocks: true
        }))
        : Array.from({ length: 7 }, (_, idx) => {
            const date = setupStartDate ? new Date(setupStartDate) : new Date();
            date.setDate(date.getDate() + idx);
            return {
                date,
                name: getDayName(date),
                blocks: [],
                hasFinalBlocks: false
            };
        });

    const recipeIds = typeof getThisWeekRecipes === 'function' ? getThisWeekRecipes() : [];
    const allRecipes = typeof getAllRecipes === 'function' ? getAllRecipes() : {};
    const recipeList = recipeIds.map(id => allRecipes[id]).filter(Boolean);

    if (recipeList.length === 0) {
        container.innerHTML = `
            <div class="setup-shopping-card">
                <h3>🛒 Shopping Needed</h3>
                <p>Add recipes to “This Week” to see shopping timing and available slots.</p>
            </div>
        `;
        return;
    }

    const stockAnalysis = analyzeStockCoverage(recipeList);
    const coverageDays = stockAnalysis.coverageDays;
    const needsFrom = stockAnalysis.needsShoppingFrom;
    const needsRecipes = stockAnalysis.needsShoppingRecipes.slice(0, 5);
    const firstDay = orderedDays[0];
    const firstDayDate = firstDay.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const needsFromDay = orderedDays[needsFrom - 1];
    const needsFromDate = needsFromDay
        ? needsFromDay.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        : `Day ${needsFrom}`;
    const coverageText = coverageDays === 0
        ? '⚠️ No ingredients available - urgent shopping needed!'
        : `✓ You have enough ingredients through ${needsFromDate}`;

    applyWorkScheduleToOrderedDays(orderedDays);

    if (!setupWeekCreated && dayEntries.length === 0) {
        orderedDays.forEach(day => {
            const dayName = getDayName(day.date);
            day.blocks = buildPreviewBlocksForDay(dayName, day.date, !!day.work);
        });
    }

    const setupNote = setupWeekCreated
        ? ''
        : '<p class="setup-shopping-note">Create your week to see shopping timing and available slots.</p>';

    container.innerHTML = `
        <div class="setup-shopping-card">
            <h3>🛒 Shopping Needed</h3>
            ${setupNote}
            <div class="setup-shopping-alert">
                <strong>${coverageText}</strong>
                <p>${coverageDays === 0
                    ? `Shop before ${firstDayDate} lunch to cook your first meal.`
                    : `Shop by ${needsFromDate} to stay stocked.`}
                </p>
            </div>
            <div class="setup-shopping-list">
                <div class="setup-shopping-label">Need shopping for:</div>
                <ul>
                    ${needsRecipes.map(r => `<li>${r.name}</li>`).join('')}
                    ${stockAnalysis.needsShoppingRecipes.length > 5
                        ? `<li>...and ${stockAnalysis.needsShoppingRecipes.length - 5} more recipes</li>`
                        : ''}
                </ul>
            </div>
            <div class="setup-shopping-slots">
                <div class="setup-shopping-label">Available time slots</div>
                <div class="setup-shopping-days" id="setupShoppingDays"></div>
                <div id="setupShoppingSlotsList"></div>
                <div id="setupShoppingSlotsEmpty" class="setup-shopping-empty" style="display: none;">
                    No free time slots found for this day.
                </div>
            </div>
            <div class="setup-shopping-customize">
                <div class="setup-shopping-label">Customize</div>
                <div class="setup-shopping-controls">
                    <label>
                        Prep time
                        <input type="number" id="setupShoppingPrepTime" value="10" min="0" max="60" />
                        <span>min</span>
                    </label>
                    <label>
                        Travel time (each way)
                        <input type="number" id="setupShoppingTravelTime" value="15" min="5" max="60" />
                        <span>min</span>
                    </label>
                    <label>
                        Shopping duration
                        <input type="number" id="setupShoppingDuration" value="60" min="15" max="180" />
                        <span>min</span>
                    </label>
                    <label>
                        Unpack time
                        <input type="number" id="setupShoppingUnpackTime" value="10" min="0" max="60" />
                        <span>min</span>
                    </label>
                </div>
            </div>
        </div>
    `;

    const daysContainer = container.querySelector('#setupShoppingDays');
    const slotsList = container.querySelector('#setupShoppingSlotsList');
    const slotsEmpty = container.querySelector('#setupShoppingSlotsEmpty');
    const prepInput = container.querySelector('#setupShoppingPrepTime');
    const travelInput = container.querySelector('#setupShoppingTravelTime');
    const durationInput = container.querySelector('#setupShoppingDuration');
    const unpackInput = container.querySelector('#setupShoppingUnpackTime');
    let availableSlotsByDay = new Map();
    let activeDayIndex = setupShoppingSelection?.dayIndex ?? 0;

    const buildSlotsIndex = () => {
        const prepMins = parseInt(prepInput.value, 10);
        const travelMins = parseInt(travelInput.value, 10);
        const shopMins = parseInt(durationInput.value, 10);
        const unpackMins = parseInt(unpackInput.value, 10);
        const sanitizedPrep = Number.isFinite(prepMins) && prepMins >= 0 ? prepMins : 10;
        const sanitizedTravel = Number.isFinite(travelMins) && travelMins > 0 ? travelMins : 15;
        const sanitizedShop = Number.isFinite(shopMins) && shopMins > 0 ? shopMins : 60;
        const sanitizedUnpack = Number.isFinite(unpackMins) && unpackMins >= 0 ? unpackMins : 10;
        const totalDuration = Math.max(15, sanitizedPrep + (sanitizedTravel * 2) + sanitizedShop + sanitizedUnpack);

        const allSlots = findAvailableShoppingSlots(orderedDays, orderedDays.length, totalDuration, orderedDays.length);
        const freeSlots = allSlots;
        console.log("✅ setup slots:", freeSlots);
        availableSlotsByDay = new Map();
        orderedDays.forEach((_, idx) => availableSlotsByDay.set(idx, []));
        allSlots.forEach(slot => {
            const slotsForDay = availableSlotsByDay.get(slot.dayIndex) || [];
            slotsForDay.push(slot);
            availableSlotsByDay.set(slot.dayIndex, slotsForDay);
        });

        return {
            sanitizedPrep,
            sanitizedTravel,
            sanitizedShop,
            sanitizedUnpack,
            totalDuration
        };
    };

    const renderDayButtons = () => {
        daysContainer.innerHTML = orderedDays.map((day, idx) => {
            const label = day.date.toLocaleDateString('en-US', { weekday: 'long' });
            const isActive = idx === activeDayIndex ? 'is-active' : '';
            return `
                <button type="button" class="setup-shopping-day ${isActive}" data-day-index="${idx}">
                    ${label}
                </button>
            `;
        }).join('');
    };

    const renderSlotsForDay = (settings) => {
        const slots = availableSlotsByDay.get(activeDayIndex) || [];
        if (!slots.length) {
            slotsList.innerHTML = '';
            slotsEmpty.style.display = 'block';
            return;
        }

        slotsEmpty.style.display = 'none';
        slotsList.innerHTML = slots.map((slot, idx) => {
            const slotDate = slot.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const minStartMins = slot.windowStartMins;
            const maxStartMins = slot.windowEndMins - settings.totalDuration;
            slot.minStartTime = formatMinutesToTime(minStartMins);
            slot.maxStartTime = formatMinutesToTime(maxStartMins);
            slot.shoppingStartTime = slot.minStartTime;
            const checked = setupShoppingSelection?.slot?.dayIndex === slot.dayIndex
                && setupShoppingSelection?.slot?.windowStartMins === slot.windowStartMins;
            return `
                <label class="setup-shopping-slot-option">
                    <input type="radio" name="setupShoppingSlot" value="${idx}" ${checked ? 'checked' : ''} />
                    <div class="setup-shopping-slot-meta">
                        <strong>${slot.dayName} ${slotDate}</strong>
                        <div>${slot.windowStartTime} – ${slot.windowEndTime}</div>
                        <small>${slot.label}</small>
                        <div class="setup-shopping-start">
                            <span>Choose start time:</span>
                            <input type="time" id="setupShoppingStart_${idx}" value="${slot.shoppingStartTime}" min="${slot.minStartTime}" max="${slot.maxStartTime}" />
                            <small>Allowed: ${slot.minStartTime} - ${slot.maxStartTime}</small>
                        </div>
                    </div>
                </label>
            `;
        }).join('');
    };

    const renderAll = () => {
        const settings = buildSlotsIndex();
        renderDayButtons();
        renderSlotsForDay(settings);
        return settings;
    };

    let currentSettings = renderAll();

    daysContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.setup-shopping-day');
        if (!button) return;
        if (!button.dataset.dayIndex) return;
        activeDayIndex = Number(button.dataset.dayIndex);
        renderDayButtons();
        currentSettings = buildSlotsIndex();
        renderSlotsForDay(currentSettings);
    });

    slotsList.addEventListener('change', (event) => {
        if (!event.target.matches('input[name="setupShoppingSlot"]')) return;
        const slotIndex = parseInt(event.target.value, 10);
        const slots = availableSlotsByDay.get(activeDayIndex) || [];
        const slot = slots[slotIndex];
        if (!slot) return;
        setupShoppingSelection = {
            dayIndex: activeDayIndex,
            slot: slot,
            startTime: slot.shoppingStartTime,
            durations: {
                prep: currentSettings.sanitizedPrep,
                travel: currentSettings.sanitizedTravel,
                shop: currentSettings.sanitizedShop,
                unpack: currentSettings.sanitizedUnpack
            }
        };
    });

    slotsList.addEventListener('input', (event) => {
        if (!event.target.matches('input[type="time"]')) return;
        const slotIndex = parseInt(event.target.id.replace('setupShoppingStart_', ''), 10);
        const slots = availableSlotsByDay.get(activeDayIndex) || [];
        const slot = slots[slotIndex];
        if (!slot) return;
        setupShoppingSelection = {
            dayIndex: activeDayIndex,
            slot: slot,
            startTime: event.target.value,
            durations: {
                prep: currentSettings.sanitizedPrep,
                travel: currentSettings.sanitizedTravel,
                shop: currentSettings.sanitizedShop,
                unpack: currentSettings.sanitizedUnpack
            }
        };
    });

    const rerenderForDurationChange = () => {
        currentSettings = renderAll();
        setupShoppingSelection = null;
    };

    prepInput.addEventListener('input', rerenderForDurationChange);
    travelInput.addEventListener('input', rerenderForDurationChange);
    durationInput.addEventListener('input', rerenderForDurationChange);
    unpackInput.addEventListener('input', rerenderForDurationChange);
}

function getOrderedDaysFromSchedule() {
    return Object.values(scheduleData.days || {})
        .filter(day => day.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(day => ({
            date: new Date(day.date),
            name: day.name || new Date(day.date).toLocaleDateString('en-GB', { weekday: 'long' }),
            blocks: day.blocks || []
        }));
}

window.createWeekFromSetup = async function() {
    const submitButton = document.getElementById('createWeekFromSetup');
    if (submitButton) submitButton.disabled = true;
    try {
        const success = await addWeek({ suppressShoppingModal: true });
        if (success) {
            setupWeekCreated = true;
            if (setupShoppingSelection?.slot && Number.isFinite(setupShoppingSelection.dayIndex)) {
                const orderedDays = getOrderedDaysFromSchedule();
                const recipeIds = typeof getThisWeekRecipes === 'function' ? getThisWeekRecipes() : [];
                const allRecipes = typeof getAllRecipes === 'function' ? getAllRecipes() : {};
                const recipeList = recipeIds.map(id => allRecipes[id]).filter(Boolean);
                const stockAnalysis = analyzeStockCoverage(recipeList);
                const durations = setupShoppingSelection.durations || { prep: 10, travel: 15, shop: 60, unpack: 10 };
                const totalDuration = Math.max(15, durations.prep + (durations.travel * 2) + durations.shop + durations.unpack);
                const startTime = setupShoppingSelection.startTime || setupShoppingSelection.slot.shoppingStartTime;
                const startMins = timeStrToMinutes(startTime);
                const minStartMins = setupShoppingSelection.slot.windowStartMins;
                const maxStartMins = setupShoppingSelection.slot.windowEndMins - totalDuration;

                if (!isNaN(startMins) && startMins >= minStartMins && startMins <= maxStartMins) {
                    const successShopping = addShoppingBlocks(
                        orderedDays,
                        setupShoppingSelection.dayIndex,
                        startTime,
                        durations.prep,
                        durations.travel,
                        durations.shop,
                        durations.unpack
                    );
                    if (successShopping) {
                        const shoppingList = generateShoppingListFromRecipes(stockAnalysis.needsShoppingRecipes);
                        window.currentWeekShoppingList = shoppingList;
                        renderDayTabs();
                        renderSchedule();
                        saveToLocalStorage();
                    }
                } else {
                    alert('Selected shopping time no longer fits the chosen slot. Please reselect a time slot.');
                }
            }
            closeSetupWizard();
        }
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
};

function toggleSetupStep(stepNumber) {
    const stepCard = document.querySelector(`.setup-step-card[data-step="${stepNumber}"]`);
    if (!stepCard) return;
    const isOpen = stepCard.classList.contains('is-open');
    document.querySelectorAll('.setup-step-card').forEach(card => card.classList.remove('is-open'));
    if (!isOpen) {
        if (currentSetupStep === 3 && stepNumber !== 3) {
            saveConfigFromForm({ silent: true, keepOpen: true });
        }
        stepCard.classList.add('is-open');
        currentSetupStep = stepNumber;
        updateSetupWizardHeader();
        if (stepNumber === 1) {
            embedDefaultsInSetup();
        }
        if (stepNumber === 2) {
            initWorkScheduleSetup();
        }
        if (stepNumber === 3) {
            embedCookingInSetup();
        }
        if (stepNumber === 4) {
            renderSetupShoppingNeeded();
        }
    }
}

function openSetupStep(stepNumber) {
    document.querySelectorAll('.setup-step-card').forEach(card => card.classList.remove('is-open'));
    const stepCard = document.querySelector(`.setup-step-card[data-step="${stepNumber}"]`);
    if (stepCard) {
        if (currentSetupStep === 3 && stepNumber !== 3) {
            saveConfigFromForm({ silent: true, keepOpen: true });
        }
        stepCard.classList.add('is-open');
        currentSetupStep = stepNumber;
        updateSetupWizardHeader();
        if (stepNumber === 1) {
            embedDefaultsInSetup();
        }
        if (stepNumber === 2) {
            initWorkScheduleSetup();
        }
        if (stepNumber === 3) {
            embedCookingInSetup();
        }
        if (stepNumber === 4) {
            renderSetupShoppingNeeded();
        }
    }
}

function advanceSetupStep(currentStep) {
    if (currentStep === 3) {
        saveConfigFromForm({ silent: true, keepOpen: true });
    }
    const nextStep = Math.min(currentStep + 1, TOTAL_SETUP_STEPS);
    openSetupStep(nextStep);
}

const WORK_PATTERN_KEY = 'weeklyWorkPattern';
const WORK_PATTERN_MODE_KEY = 'weeklyWorkPatternMode';
const WORK_PATTERN_PREP_KEY = 'weeklyWorkPatternPrep';
const WORK_PATTERN_COMMUTE_KEY = 'weeklyWorkPatternCommute';
const WORK_PATTERN_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

let adjustableWorkScheduleHome = null;
let adjustableWorkScheduleNodes = null;

function initWorkScheduleSetup() {
    const modeInputs = document.querySelectorAll('input[name="workScheduleMode"]');
    if (!modeInputs.length) return;
    if (modeInputs[0].dataset.bound === 'true') {
        syncSetupWeekStartDate();
        loadWorkPattern();
        return;
    }
    const savedMode = localStorage.getItem(WORK_PATTERN_MODE_KEY) || 'same';
    modeInputs.forEach(input => {
        input.checked = input.value === savedMode;
        input.addEventListener('change', () => setWorkScheduleMode(input.value));
    });
    modeInputs[0].dataset.bound = 'true';
    setWorkScheduleMode(savedMode);
    syncSetupWeekStartDate();
    loadWorkPattern();
}

function setWorkScheduleMode(mode) {
    localStorage.setItem(WORK_PATTERN_MODE_KEY, mode);
    const sameForm = document.getElementById('workScheduleSameForm');
    const adjustableForm = document.getElementById('workScheduleAdjustableForm');
    if (sameForm) sameForm.style.display = mode === 'same' ? 'block' : 'none';
    if (adjustableForm) adjustableForm.style.display = mode === 'adjustable' ? 'block' : 'none';
    if (mode === 'adjustable') {
        embedAdjustableWorkSchedule();
    } else {
        restoreAdjustableWorkSchedule();
    }
}

function embedAdjustableWorkSchedule() {
    const container = document.getElementById('setupAdjustableWorkContainer');
    const workScheduleCheckboxSection = document.getElementById('workScheduleCheckboxSection');
    const workDaysSection = document.getElementById('workDaysSection');
    if (!container || !workScheduleCheckboxSection || !workDaysSection) return;
    container.classList.add('setup-adjustable-work');
    if (!adjustableWorkScheduleNodes) {
        adjustableWorkScheduleHome = workScheduleCheckboxSection.parentElement;
        adjustableWorkScheduleNodes = [workScheduleCheckboxSection, workDaysSection];
    }
    adjustableWorkScheduleNodes.forEach(node => {
        if (node.parentElement !== container) {
            container.appendChild(node);
        }
    });
    workScheduleCheckboxSection.style.display = 'none';
    workDaysSection.style.display = 'block';
    const commuteToggleInput = container.querySelector('#addCommuteNew');
    const commuteToggle = commuteToggleInput?.closest('label');
    if (commuteToggle) {
        commuteToggle.style.display = 'none';
    }
    if (commuteToggleInput) {
        commuteToggleInput.checked = false;
        commuteToggleInput.disabled = true;
        commuteToggleInput.dataset.setupHidden = 'true';
        commuteToggleInput.dispatchEvent(new Event('change'));
    }
    const commuteSettings = document.getElementById('commuteSettingsNew');
    if (commuteSettings) {
        commuteSettings.style.display = 'none';
        const commuteWrapper = commuteSettings.parentElement;
        if (commuteWrapper && !commuteWrapper.dataset.setupHidden) {
            commuteWrapper.dataset.setupHidden = 'true';
            commuteWrapper.style.display = 'none';
        }
    }
    const addWorkScheduleNew = document.getElementById('addWorkScheduleNew');
    if (addWorkScheduleNew) {
        addWorkScheduleNew.checked = true;
        addWorkScheduleNew.dispatchEvent(new Event('change'));
    }
}

function restoreAdjustableWorkSchedule() {
    if (!adjustableWorkScheduleNodes || !adjustableWorkScheduleHome) return;
    adjustableWorkScheduleNodes.forEach(node => {
        if (node.parentElement !== adjustableWorkScheduleHome) {
            adjustableWorkScheduleHome.appendChild(node);
        }
    });
    const commuteToggleInput = document.getElementById('addCommuteNew');
    if (commuteToggleInput?.dataset.setupHidden) {
        commuteToggleInput.disabled = false;
        delete commuteToggleInput.dataset.setupHidden;
    }
    const commuteSettings = document.getElementById('commuteSettingsNew');
    if (commuteSettings?.parentElement?.dataset.setupHidden) {
        commuteSettings.parentElement.style.display = '';
        delete commuteSettings.parentElement.dataset.setupHidden;
    }
}

function syncSetupWeekStartDate() {
    const setupInput = document.getElementById('setupWeekStartDateInput');
    const weekStartDateInput = document.getElementById('weekStartDateInput');
    if (!setupInput || !weekStartDateInput) return;
    if (!setupInput.dataset.bound) {
        setupInput.addEventListener('input', () => {
            weekStartDateInput.value = setupInput.value;
            weekStartDateInput.dispatchEvent(new Event('input'));
        });
        setupInput.dataset.bound = 'true';
    }
    setupInput.value = weekStartDateInput.value || '';
}

function styleAdjustableCommuteInputs() {
    const commuteToggleLabel = document.querySelector('#setupAdjustableWorkContainer label input#addCommuteNew')?.parentElement;
    const commutePrepLabel = document.querySelector('#setupAdjustableWorkContainer label input#addCommutePrepNew')?.parentElement;
    if (commuteToggleLabel) {
        const textSpan = commuteToggleLabel.querySelector('span');
        if (textSpan) textSpan.textContent = '🚶 Commute';
    }
    if (commutePrepLabel) {
        const textSpan = commutePrepLabel.querySelector('span');
        if (textSpan) textSpan.textContent = '🧰 Prep';
    }
    const commuteDurationLabel = document.querySelector('#setupAdjustableWorkContainer label[for="commuteDurationNew"]');
    const commuteDurationInput = document.getElementById('commuteDurationNew');
    if (commuteDurationInput && commuteDurationInput.parentElement) {
        commuteDurationInput.parentElement.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = '';
            }
        });
        commuteDurationInput.insertAdjacentText('afterend', ' min');
    }
    if (commuteDurationLabel && commuteDurationLabel.firstChild) {
        commuteDurationLabel.firstChild.textContent = '🚶 Commute';
    }
    const prepLabel = document.querySelector('#setupAdjustableWorkContainer label[for="commutePrepDurationNew"]');
    const prepInput = document.getElementById('commutePrepDurationNew');
    if (prepInput && prepInput.parentElement) {
        prepInput.parentElement.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = '';
            }
        });
        prepInput.insertAdjacentText('afterend', ' min');
    }
    if (prepLabel && prepLabel.firstChild) {
        prepLabel.firstChild.textContent = '🧰 Prep';
    }
    const addCommuteNew = document.getElementById('addCommuteNew');
    const addCommutePrepNew = document.getElementById('addCommutePrepNew');
    if (addCommuteNew) {
        addCommuteNew.checked = true;
        addCommuteNew.dispatchEvent(new Event('change'));
    }
    if (addCommutePrepNew) {
        addCommutePrepNew.checked = true;
        addCommutePrepNew.dispatchEvent(new Event('change'));
    }
}

function loadWorkPattern() {
    const stored = localStorage.getItem(WORK_PATTERN_KEY);
    const rows = stored ? JSON.parse(stored) : [];
    const prepInput = document.getElementById('workPatternPrep');
    const commuteInput = document.getElementById('workPatternCommute');
    if (prepInput) {
        prepInput.value = localStorage.getItem(WORK_PATTERN_PREP_KEY) || '30';
    }
    if (commuteInput) {
        commuteInput.value = localStorage.getItem(WORK_PATTERN_COMMUTE_KEY) || '15';
    }
    const container = document.getElementById('workPatternRows');
    if (!container) return;
    container.innerHTML = '';
    WORK_PATTERN_DAYS.forEach(day => {
        const match = rows.find(row => row.day === day);
        addWorkPatternRow({ day, start: match?.start || '', end: match?.end || '' });
    });
    bindWorkPatternAutosave();
}

function addWorkPatternRow(data = {}) {
    const container = document.getElementById('workPatternRows');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'setup-work-row';
    row.innerHTML = `
        <div class="work-pattern-day">${data.day || 'Monday'}</div>
        <input type="time" class="work-pattern-start" />
        <input type="time" class="work-pattern-end" />
    `;
    container.appendChild(row);
    row.querySelector('.work-pattern-start').value = data.start || '';
    row.querySelector('.work-pattern-end').value = data.end || '';
}

function saveWorkPattern() {
    const container = document.getElementById('workPatternRows');
    if (!container) return;
    const rows = Array.from(container.querySelectorAll('.setup-work-row')).map(row => ({
        day: row.querySelector('.work-pattern-day')?.textContent || 'Monday',
        start: row.querySelector('.work-pattern-start')?.value || '',
        end: row.querySelector('.work-pattern-end')?.value || ''
    })).filter(row => row.start && row.end);
    localStorage.setItem(WORK_PATTERN_KEY, JSON.stringify(rows));
    const prepInput = document.getElementById('workPatternPrep');
    if (prepInput) {
        localStorage.setItem(WORK_PATTERN_PREP_KEY, prepInput.value || '30');
    }
    const commuteInput = document.getElementById('workPatternCommute');
    if (commuteInput) {
        localStorage.setItem(WORK_PATTERN_COMMUTE_KEY, commuteInput.value || '15');
    }
}

function clearWorkPattern() {
    localStorage.removeItem(WORK_PATTERN_KEY);
    localStorage.removeItem(WORK_PATTERN_PREP_KEY);
    localStorage.removeItem(WORK_PATTERN_COMMUTE_KEY);
    const container = document.getElementById('workPatternRows');
    if (container) container.innerHTML = '';
    WORK_PATTERN_DAYS.forEach(day => addWorkPatternRow({ day }));
}

function bindWorkPatternAutosave() {
    const container = document.getElementById('workPatternRows');
    if (!container || container.dataset.bound === 'true') return;
    container.addEventListener('input', () => saveWorkPattern());
    const prepInput = document.getElementById('workPatternPrep');
    const commuteInput = document.getElementById('workPatternCommute');
    prepInput?.addEventListener('input', () => saveWorkPattern());
    commuteInput?.addEventListener('input', () => saveWorkPattern());
    container.dataset.bound = 'true';
}

window.toggleSetupStep = toggleSetupStep;
window.advanceSetupStep = advanceSetupStep;
window.App.features['wizard'] = {
    openSetupWizard,
    closeSetupWizard,
    toggleSetupStep,
    advanceSetupStep,
    renderSetupShoppingNeeded,
    initWorkScheduleSetup,
    applyWorkScheduleToOrderedDays,
    getCommuteSettingsUniversal
};
