(() => {
    'use strict';

    // ================================================
    // WORK-OVERLAP RESOLVER - V2.1.0 (Modal UI)
    // ================================================
    // Handles conflicts when default blocks overlap with work hours.
    // User can choose to Remove or Move overlapping tasks in one friendly list.

    let overlapResolverState = {
        dayIndex: 0,
        dayData: null,
        overlappingBlocks: [],
        workRange: null,
        allBlocks: [],
        resolveCallback: null,
        rejectCallback: null,
        taskStates: [],
        baseBlocks: [],
        dayStart: 0,
        dayEnd: 24 * 60,
        mode: 'select'
    };

    function allowedDuringWork(block) {
        const title = (block.title || '').toLowerCase();
        return title.includes('work') ||
            title.includes('commute') ||
            title.includes('sleep');
    }

    function formatMinutesAsHoursAndMinutes(totalMinutes) {
        const minutes = Math.max(0, Math.round(totalMinutes));
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours}h`;
        return `${mins}m`;
    }

    function findAvailableGaps(blocks, dayStartMins = 0, dayEndMins = 24 * 60) {
        const busy = [];
        blocks.forEach(block => {
            if (typeof getBlockIntervalsWithinWindow === 'function') {
                busy.push(...getBlockIntervalsWithinWindow(block, dayStartMins, dayEndMins));
            }
        });

        const mergedBusy = typeof mergeIntervals === 'function' ? mergeIntervals(busy) : busy;
        const gaps = [];
        let cursor = dayStartMins;

        mergedBusy.forEach(interval => {
            if (interval.start > cursor) {
                gaps.push({
                    start: cursor,
                    end: interval.start,
                    duration: interval.start - cursor
                });
            }
            cursor = Math.max(cursor, interval.end);
        });

        if (cursor < dayEndMins) {
            gaps.push({
                start: cursor,
                end: dayEndMins,
                duration: dayEndMins - cursor
            });
        }

        return gaps;
    }

    function findSlotsForDuration(blocks, duration, dayStartMins = 0, dayEndMins = 24 * 60) {
        const gaps = findAvailableGaps(blocks, dayStartMins, dayEndMins);
        return gaps.filter(gap => gap.duration >= duration);
    }

    function resolveWorkOverlaps(dayIndex, dayData, blocks, workRange) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(blocks) || !workRange) {
                resolve(blocks || []);
                return;
            }
            const overlapping = blocks.filter(block => {
                if (allowedDuringWork(block)) return false;
                const { start, end } = typeof getBlockTimeRange === 'function'
                    ? getBlockTimeRange(block)
                    : { start: NaN, end: NaN };
                if (isNaN(start) || isNaN(end)) return false;
                return (start < workRange.end && end > workRange.start);
            });

            if (overlapping.length === 0) {
                resolve(blocks);
                return;
            }

            overlapResolverState = {
                dayIndex,
                dayData,
                overlappingBlocks: overlapping,
                workRange,
                allBlocks: blocks,
                resolveCallback: resolve,
                rejectCallback: reject,
                taskStates: [],
                dayStart: (() => {
                    const val = typeof timeStrToMinutes === 'function'
                        ? timeStrToMinutes(window.scheduleData?.dayWindow?.start || '00:00')
                        : 0;
                    return isNaN(val) ? 0 : val;
                })(),
                dayEnd: (() => {
                    const val = typeof timeStrToMinutes === 'function'
                        ? timeStrToMinutes(window.scheduleData?.dayWindow?.end || '23:59')
                        : 24 * 60;
                    return isNaN(val) ? 24 * 60 : val;
                })(),
                mode: 'select',
                baseBlocks: []
            };

            prepareOverlapTaskStates();
            showOverlapList();
        });
    }

    function prepareOverlapTaskStates() {
        const baseBlocks = overlapResolverState.allBlocks.filter(
            block => !overlapResolverState.overlappingBlocks.includes(block)
        );
        overlapResolverState.taskStates = overlapResolverState.overlappingBlocks.map(block => {
            const duration = typeof getBlockDurationMinutes === 'function'
                ? getBlockDurationMinutes(block)
                : 0;
            const slots = findSlotsForDuration(
                baseBlocks,
                duration,
                overlapResolverState.dayStart,
                overlapResolverState.dayEnd
            );
            return {
                block,
                selected: true,
                slots,
                chosenSlotIndex: slots.length ? 0 : -1,
                chosenStart: slots.length ? slots[0].start : null,
                splitSelection: [],
                splitTotal: 0,
                removeInstead: false
            };
        });
        overlapResolverState.baseBlocks = baseBlocks;
    }

    function showOverlapList() {
        const modal = document.getElementById('workOverlapModal');
        if (!modal) {
            overlapResolverState.resolveCallback(overlapResolverState.allBlocks);
            return;
        }
        const summary = document.getElementById('overlapSummary');
        const dayName = overlapResolverState.dayData?.name || 'this day';
        if (summary) {
            summary.textContent = `Some blocks overlap your work hours for ${dayName}. Choose what you’d like to do.`;
        }

        overlapResolverState.mode = 'select';
        const applyBtn = document.getElementById('applyMoveBtn');
        const startBtn = document.getElementById('startMoveBtn');
        if (applyBtn) applyBtn.style.display = 'none';
        if (startBtn) startBtn.style.display = 'inline-flex';

        renderOverlapTasks();
        modal.classList.add('active');
    }

    function closeOverlapModal(resolveWithBlocks = true) {
        const modal = document.getElementById('workOverlapModal');
        if (modal) modal.classList.remove('active');
        if (resolveWithBlocks && overlapResolverState.resolveCallback) {
            overlapResolverState.resolveCallback(overlapResolverState.allBlocks);
        }
    }

    function renderOverlapTasks() {
        const container = document.getElementById('overlapTasksContainer');
        if (!container) return;
        container.innerHTML = '';

        overlapResolverState.taskStates.forEach((state, index) => {
            const block = state.block;
            const duration = typeof getBlockDurationMinutes === 'function'
                ? getBlockDurationMinutes(block)
                : 0;
            const card = document.createElement('div');
            card.className = 'overlap-task-card';
            card.dataset.index = index;

            const header = document.createElement('div');
            header.className = 'overlap-task-header';
            header.innerHTML = `
                <label style="display:flex; align-items:center; gap:8px; flex:1; cursor:pointer;">
                    <input type="checkbox" class="overlap-select" data-index="${index}" ${state.selected ? 'checked' : ''} style="width:18px; height:18px;">
                    <span style="font-weight:700; color:#111827;">${block.title || 'Untitled'}</span>
                </label>
                <span style="font-size:13px; color:#4b5563;">${formatMinutesAsHoursAndMinutes(duration)}</span>
            `;
            card.appendChild(header);

            const moveControls = document.createElement('div');
            moveControls.className = 'overlap-task-actions';
            moveControls.id = `move-controls-${index}`;
            moveControls.style.display = overlapResolverState.mode === 'move' ? 'grid' : 'none';

            if (state.slots.length > 0) {
                const options = state.slots.map((slot, i) =>
                    `<option value="${i}">${formatMinutesToTime(slot.start)} – ${formatMinutesToTime(slot.end)} (Available)</option>`
                ).join('');
                moveControls.innerHTML = `
                    <div style="display:grid; gap:8px;">
                        <label style="font-size:13px; color:#374151;">Select a slot:</label>
                        <select id="task-slot-${index}" data-index="${index}" style="padding:8px; border:1px solid #d1d5db; border-radius:8px;">
                            ${options}
                        </select>
                    </div>
                    <div style="display:grid; gap:6px;">
                        <label style="font-size:13px; color:#374151;">Pick a start time within the slot:</label>
                        <input type="time" id="task-start-${index}" data-index="${index}" class="custom-time-input" style="width: 150px;">
                        <div id="task-preview-${index}" class="slot-preview-text">Will run: --:-- – --:--</div>
                    </div>
                `;
            } else {
                moveControls.innerHTML = `
                    <div class="slot-preview-text" style="color:#1f2937;">No single slot fits. Split into parts?</div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button type="button" class="btn btn-secondary" data-action="split" data-index="${index}" style="background:#e0f2fe; color:#0f172a;">Split</button>
                        <button type="button" class="btn btn-secondary" data-action="remove-one" data-index="${index}" style="background:#fee2e2; color:#991b1b;">Remove this task</button>
                    </div>
                    <div id="split-options-${index}" style="display:none; border:1px dashed #cbd5e1; padding:10px; border-radius:8px; background:#f8fafc;">
                        <div id="split-gaps-${index}" style="display:grid; gap:6px; max-height:180px; overflow-y:auto;"></div>
                        <div id="split-total-${index}" style="font-size:12px; color:#4b5563; margin-top:6px;">Total selected: 0m</div>
                        <button type="button" class="btn btn-primary" data-action="confirm-split" data-index="${index}" style="margin-top:8px; background:#10b981; color:white;">Use selected gaps</button>
                    </div>
                    <div id="split-preview-${index}" class="slot-preview-text"></div>
                `;
            }

            card.appendChild(moveControls);
            container.appendChild(card);
        });

        attachTaskEventHandlers();
        if (overlapResolverState.mode === 'move') {
            overlapResolverState.taskStates.forEach((_, idx) => updateTaskStartControls(idx));
        }
    }

    function attachTaskEventHandlers() {
        document.querySelectorAll('.overlap-select').forEach(cb => {
            cb.onchange = () => {
                const idx = parseInt(cb.dataset.index, 10);
                overlapResolverState.taskStates[idx].selected = cb.checked;
            };
        });

        document.querySelectorAll('select[id^="task-slot-"]').forEach(sel => {
            sel.onchange = () => {
                const idx = parseInt(sel.dataset.index, 10);
                overlapResolverState.taskStates[idx].chosenSlotIndex = parseInt(sel.value, 10);
                const slot = overlapResolverState.taskStates[idx].slots[overlapResolverState.taskStates[idx].chosenSlotIndex];
                overlapResolverState.taskStates[idx].chosenStart = slot ? slot.start : null;
                updateTaskStartControls(idx);
            };
        });

        document.querySelectorAll('input[id^="task-start-"]').forEach(input => {
            input.oninput = () => {
                const idx = parseInt(input.dataset.index, 10);
                const mins = timeStrToMinutes(input.value);
                overlapResolverState.taskStates[idx].chosenStart = mins;
                updateTaskStartControls(idx);
            };
        });

        document.querySelectorAll('[data-action="split"]').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.index, 10);
                renderSplitOptions(idx);
            };
        });

        document.querySelectorAll('[data-action="remove-one"]').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.index, 10);
                overlapResolverState.taskStates[idx].selected = true;
                overlapResolverState.taskStates[idx].slots = [];
                overlapResolverState.taskStates[idx].splitSelection = [];
                overlapResolverState.taskStates[idx].removeInstead = true;
                const checkbox = document.querySelector(`.overlap-select[data-index="${idx}"]`);
                if (checkbox) checkbox.checked = true;
                const preview = document.getElementById(`split-preview-${idx}`);
                if (preview) preview.textContent = 'This task will be removed from this day.';
            };
        });

        document.querySelectorAll('[data-action="confirm-split"]').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.index, 10);
                confirmSplitSelection(idx);
            };
        });
    }

    function renderSplitOptions(index) {
        const gapsContainer = document.getElementById(`split-gaps-${index}`);
        const splitBox = document.getElementById(`split-options-${index}`);
        if (!gapsContainer || !splitBox) return;

        gapsContainer.innerHTML = '';
        const gaps = findAvailableGaps(overlapResolverState.baseBlocks, overlapResolverState.dayStart, overlapResolverState.dayEnd);
        gaps.forEach((gap, gapIndex) => {
            const label = document.createElement('label');
            label.style.cssText = 'display:flex; align-items:center; gap:8px; font-size:13px;';
            label.innerHTML = `
                <input type="checkbox" class="split-gap-check" data-index="${index}" data-gap="${gapIndex}" data-duration="${gap.duration}" style="width:16px; height:16px;">
                <span>${formatMinutesToTime(gap.start)} – ${formatMinutesToTime(gap.end)} (${formatMinutesAsHoursAndMinutes(gap.duration)})</span>
            `;
            gapsContainer.appendChild(label);
        });

        document.querySelectorAll(`.split-gap-check[data-index="${index}"]`).forEach(cb => {
            cb.onchange = () => updateSplitTotal(index);
        });

        splitBox.style.display = 'block';
        updateSplitTotal(index);
    }

    function updateSplitTotal(index) {
        const totalEl = document.getElementById(`split-total-${index}`);
        const checkboxes = document.querySelectorAll(`.split-gap-check[data-index="${index}"]:checked`);
        let total = 0;
        checkboxes.forEach(cb => {
            total += parseInt(cb.dataset.duration, 10);
        });
        if (totalEl) totalEl.textContent = `Total selected: ${formatMinutesAsHoursAndMinutes(total)}`;
    }

    function confirmSplitSelection(index) {
        const checkboxes = Array.from(document.querySelectorAll(`.split-gap-check[data-index="${index}"]:checked`));
        const gaps = findAvailableGaps(overlapResolverState.baseBlocks, overlapResolverState.dayStart, overlapResolverState.dayEnd);
        const selectedGaps = checkboxes
            .map(cb => gaps[parseInt(cb.dataset.gap, 10)])
            .filter(Boolean)
            .sort((a, b) => a.start - b.start);
        const total = selectedGaps.reduce((sum, gap) => sum + gap.duration, 0);
        const state = overlapResolverState.taskStates[index];
        state.splitSelection = selectedGaps;
        state.splitTotal = total;
        state.removeInstead = false;

        const preview = document.getElementById(`split-preview-${index}`);
        if (preview) {
            const duration = getBlockDurationMinutes(state.block);
            preview.textContent = total >= duration
                ? `Will split across ${selectedGaps.length} gap(s).`
                : `Selected ${formatMinutesAsHoursAndMinutes(total)} (need ${formatMinutesAsHoursAndMinutes(duration)}).`;
        }
    }

    function updateTaskStartControls(index) {
        const state = overlapResolverState.taskStates[index];
        if (!state || !state.slots.length) return;

        const slot = state.slots[state.chosenSlotIndex] || state.slots[0];
        const startInput = document.getElementById(`task-start-${index}`);
        const preview = document.getElementById(`task-preview-${index}`);
        const slotSelect = document.getElementById(`task-slot-${index}`);

        if (slotSelect && state.chosenSlotIndex >= 0) {
            slotSelect.value = state.chosenSlotIndex;
        }

        if (!slot || !startInput || !preview) return;

        const duration = getBlockDurationMinutes(state.block);
        const minStart = slot.start;
        const maxStart = Math.max(slot.start, slot.end - duration);
        startInput.min = formatMinutesToTime(minStart);
        startInput.max = formatMinutesToTime(maxStart);

        let chosen = state.chosenStart;
        if (isNaN(chosen) || chosen < minStart || chosen > maxStart) {
            chosen = minStart;
        }
        state.chosenStart = chosen;
        startInput.value = formatMinutesToTime(chosen);

        const endMins = chosen + duration;
        preview.textContent = `Will run: ${formatMinutesToTime(chosen)} – ${formatMinutesToTime(endMins)}`;
    }

    function syncSelectionsFromUI() {
        document.querySelectorAll('.overlap-select').forEach(cb => {
            const idx = parseInt(cb.dataset.index, 10);
            overlapResolverState.taskStates[idx].selected = cb.checked;
        });
    }

    function removeSelectedOverlaps() {
        syncSelectionsFromUI();
        const toRemove = new Set(
            overlapResolverState.taskStates.filter(t => t.selected).map(t => t.block)
        );
        const newBlocks = overlapResolverState.allBlocks.filter(b => !toRemove.has(b));
        closeOverlapModal(false);
        overlapResolverState.resolveCallback(newBlocks);
    }

    function startMoveSelected() {
        syncSelectionsFromUI();
        overlapResolverState.mode = 'move';
        const applyBtn = document.getElementById('applyMoveBtn');
        const startBtn = document.getElementById('startMoveBtn');
        if (applyBtn) applyBtn.style.display = 'inline-flex';
        if (startBtn) startBtn.style.display = 'none';
        renderOverlapTasks();
    }

    function applyMoveSelections() {
        syncSelectionsFromUI();
        const selectedTasks = overlapResolverState.taskStates.filter(t => t.selected);
        if (selectedTasks.length === 0) {
            alert('Select at least one task to move.');
            return;
        }

        const newBlocks = overlapResolverState.baseBlocks.slice();
        overlapResolverState.taskStates.forEach(state => {
            if (!state.selected) {
                newBlocks.push(state.block);
                return;
            }

            const duration = getBlockDurationMinutes(state.block);

            if (state.removeInstead) {
                return;
            }

            if (state.slots.length > 0) {
                const slot = state.slots[state.chosenSlotIndex >= 0 ? state.chosenSlotIndex : 0];
                const start = Math.min(Math.max(state.chosenStart ?? slot.start, slot.start), slot.end - duration);
                const end = start + duration;
                const updatedBlock = { ...state.block, time: `${formatMinutesToTime(start)}-${formatMinutesToTime(end)}` };
                if (state.block.startDateTime && overlapResolverState.dayData?.date) {
                    const date = new Date(overlapResolverState.dayData.date);
                    updatedBlock.startDateTime = createDateTimeFromTimeStr(date, formatMinutesToTime(start)).toISOString();
                    updatedBlock.endDateTime = createDateTimeFromTimeStr(date, formatMinutesToTime(end)).toISOString();
                }
                newBlocks.push(updatedBlock);
                return;
            }

            if (state.splitSelection && state.splitSelection.length > 0 && state.splitTotal >= duration) {
                let remaining = duration;
                let part = 1;
                state.splitSelection.forEach(gap => {
                    if (remaining <= 0) return;
                    const partDuration = Math.min(gap.duration, remaining);
                    const partStart = gap.start;
                    const partEnd = gap.start + partDuration;
                    const partBlock = {
                        ...state.block,
                        title: `${state.block.title} (Part ${part})`,
                        time: `${formatMinutesToTime(partStart)}-${formatMinutesToTime(partEnd)}`
                    };
                    if (state.block.startDateTime && overlapResolverState.dayData?.date) {
                        const date = new Date(overlapResolverState.dayData.date);
                        partBlock.startDateTime = createDateTimeFromTimeStr(date, formatMinutesToTime(partStart)).toISOString();
                        partBlock.endDateTime = createDateTimeFromTimeStr(date, formatMinutesToTime(partEnd)).toISOString();
                    }
                    newBlocks.push(partBlock);
                    remaining -= partDuration;
                    part += 1;
                });
                return;
            }
        });

        closeOverlapModal(false);
        overlapResolverState.resolveCallback(newBlocks);
    }

    function createDateTimeFromTimeStr(date, timeStr) {
        const [hours, mins] = timeStr.split(':').map(Number);
        const dt = new Date(date);
        dt.setHours(hours, mins, 0, 0);
        return dt;
    }

    window.resolveWorkOverlaps = resolveWorkOverlaps;
    window.closeOverlapModal = closeOverlapModal;
    window.removeSelectedOverlaps = removeSelectedOverlaps;
    window.startMoveSelected = startMoveSelected;
    window.applyMoveSelections = applyMoveSelections;
    console.log('✅ Work-Overlap Resolver loaded - V2.1.0');
})();
