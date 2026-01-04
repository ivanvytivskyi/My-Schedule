// ================================================
// WORK-OVERLAP RESOLVER - V2.1.0
// ================================================
// Handles conflicts when default blocks overlap with work hours
// User can choose to Remove or Move overlapping tasks
// Move supports same-day slot picking with optional task splitting

// State for overlap resolution
let overlapResolverState = {
    dayIndex: 0,
    dayData: null,
    overlappingBlocks: [],
    currentBlockIndex: 0,
    workRange: null,
    allBlocks: [],
    resolveCallback: null,
    rejectCallback: null
};

// Check if a block is allowed during work hours
function allowedDuringWork(block) {
    const title = (block.title || '').toLowerCase();
    return title.includes('work') || 
           title.includes('commute') || 
           title.includes('sleep');
}

// Find all gaps in the schedule on a given day
function findAvailableGaps(blocks, dayStartMins = 0, dayEndMins = 24 * 60) {
    // Sort blocks by start time
    const sortedBlocks = blocks.slice().sort((a, b) => {
        const aStart = getBlockTimeRange(a).start;
        const bStart = getBlockTimeRange(b).start;
        return aStart - bStart;
    });
    
    const gaps = [];
    let lastEnd = dayStartMins;
    
    sortedBlocks.forEach(block => {
        const { start, end } = getBlockTimeRange(block);
        if (isNaN(start) || isNaN(end)) return;
        
        // Skip blocks outside our day window
        if (end <= dayStartMins || start >= dayEndMins) return;
        
        // Check if there's a gap before this block
        if (start > lastEnd) {
            gaps.push({
                start: lastEnd,
                end: start,
                duration: start - lastEnd
            });
        }
        
        lastEnd = Math.max(lastEnd, end);
    });
    
    // Check for gap after last block
    if (lastEnd < dayEndMins) {
        gaps.push({
            start: lastEnd,
            end: dayEndMins,
            duration: dayEndMins - lastEnd
        });
    }
    
    return gaps;
}

// Find all time slots that can fit a task of given duration
function findSlotsForDuration(blocks, duration, dayStartMins = 0, dayEndMins = 24 * 60) {
    const gaps = findAvailableGaps(blocks, dayStartMins, dayEndMins);
    return gaps.filter(gap => gap.duration >= duration);
}

// Start the overlap resolution process
function resolveWorkOverlaps(dayIndex, dayData, blocks, workRange) {
    return new Promise((resolve, reject) => {
        // Find blocks that overlap with work
        const overlapping = blocks.filter(block => {
            if (allowedDuringWork(block)) return false;
            
            const { start, end } = getBlockTimeRange(block);
            if (isNaN(start) || isNaN(end)) return false;
            
            // Check if block overlaps work range
            const workStart = workRange.start;
            const workEnd = workRange.end;
            
            return (start < workEnd && end > workStart);
        });
        
        if (overlapping.length === 0) {
            resolve(blocks); // No overlaps, continue
            return;
        }
        
        // Store state
        overlapResolverState = {
            dayIndex,
            dayData,
            overlappingBlocks: overlapping,
            currentBlockIndex: 0,
            workRange,
            allBlocks: blocks,
            resolveCallback: resolve,
            rejectCallback: reject
        };
        
        // Show choice modal
        showOverlapChoice();
    });
}

// Show the initial choice: Remove or Move
function showOverlapChoice() {
    const modal = document.getElementById('workOverlapModal');
    const choiceStep = document.getElementById('overlapChoiceStep');
    const slotPickerStep = document.getElementById('overlapSlotPickerStep');
    const splitModeStep = document.getElementById('overlapSplitModeStep');
    
    // Hide all steps except choice
    choiceStep.style.display = 'block';
    slotPickerStep.style.display = 'none';
    splitModeStep.style.display = 'none';
    
    // Update choice info
    document.getElementById('overlapDayName').textContent = overlapResolverState.dayData.name;
    document.getElementById('overlapCount').textContent = overlapResolverState.overlappingBlocks.length;
    
    modal.classList.add('active');
}

// Handle user choice: Remove or Move
function handleOverlapChoice(choice) {
    if (choice === 'remove') {
        // Remove all overlapping blocks
        const newBlocks = overlapResolverState.allBlocks.filter(
            block => !overlapResolverState.overlappingBlocks.includes(block)
        );
        
        closeOverlapModal();
        overlapResolverState.resolveCallback(newBlocks);
        return;
    }
    
    if (choice === 'move') {
        // Start slot picking for first overlapping block
        overlapResolverState.currentBlockIndex = 0;
        showSlotPicker();
    }
}

// Show slot picker for current overlapping block
function showSlotPicker() {
    const currentBlock = overlapResolverState.overlappingBlocks[overlapResolverState.currentBlockIndex];
    const duration = getBlockDurationMinutes(currentBlock);
    
    // Get blocks excluding current overlapping block and other overlapping blocks
    const blocksForGapCalculation = overlapResolverState.allBlocks.filter(
        block => !overlapResolverState.overlappingBlocks.includes(block)
    );
    
    // Find available slots
    const availableSlots = findSlotsForDuration(blocksForGapCalculation, duration);
    
    if (availableSlots.length === 0) {
        // No full slots available - offer to split
        showSplitMode();
        return;
    }
    
    // Show slot picker
    const choiceStep = document.getElementById('overlapChoiceStep');
    const slotPickerStep = document.getElementById('overlapSlotPickerStep');
    const splitModeStep = document.getElementById('overlapSplitModeStep');
    
    choiceStep.style.display = 'none';
    slotPickerStep.style.display = 'block';
    splitModeStep.style.display = 'none';
    
    // Update task info
    document.getElementById('currentTaskTitle').textContent = currentBlock.title || 'Untitled';
    document.getElementById('currentTaskDuration').textContent = duration + ' minutes';
    document.getElementById('currentTaskDay').textContent = overlapResolverState.dayData.name;
    
    // Populate slots
    const container = document.getElementById('availableSlotsContainer');
    container.innerHTML = '';
    
    availableSlots.forEach((slot, index) => {
        const label = document.createElement('label');
        label.style.cssText = 'display: flex; align-items: center; gap: 10px; padding: 12px; margin-bottom: 8px; background: #f8f9fa; border: 2px solid #dee2e6; border-radius: 6px; cursor: pointer; transition: all 0.2s;';
        label.onmouseover = function() {
            if (!this.querySelector('input').checked) {
                this.style.background = '#e9ecef';
                this.style.borderColor = '#0066cc';
            }
        };
        label.onmouseout = function() {
            if (!this.querySelector('input').checked) {
                this.style.background = '#f8f9fa';
                this.style.borderColor = '#dee2e6';
            }
        };
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'slotChoice';
        radio.value = index;
        radio.style.cssText = 'width: 18px; height: 18px; cursor: pointer;';
        radio.onchange = function() {
            // Update visual selection
            container.querySelectorAll('label').forEach(l => {
                l.style.background = '#f8f9fa';
                l.style.borderColor = '#dee2e6';
            });
            label.style.background = '#e7f3ff';
            label.style.borderColor = '#0066cc';
        };
        
        const text = document.createElement('span');
        text.style.cssText = 'font-size: 15px; font-weight: 500; color: #333;';
        text.textContent = `${formatMinutesToTime(slot.start)} – ${formatMinutesToTime(slot.end)} (${slot.duration} min available)`;
        
        label.appendChild(radio);
        label.appendChild(text);
        container.appendChild(label);
    });
    
    // Auto-select first slot
    if (availableSlots.length > 0) {
        const firstRadio = container.querySelector('input[type="radio"]');
        firstRadio.checked = true;
        firstRadio.dispatchEvent(new Event('change'));
    }
}

// Confirm slot pick and move to next overlapping block
function confirmSlotPick() {
    const selected = document.querySelector('input[name="slotChoice"]:checked');
    if (!selected) {
        alert('Please select a time slot');
        return;
    }
    
    const slotIndex = parseInt(selected.value);
    const currentBlock = overlapResolverState.overlappingBlocks[overlapResolverState.currentBlockIndex];
    const duration = getBlockDurationMinutes(currentBlock);
    
    // Get blocks excluding overlapping blocks
    const blocksForGapCalculation = overlapResolverState.allBlocks.filter(
        block => !overlapResolverState.overlappingBlocks.includes(block)
    );
    
    const availableSlots = findSlotsForDuration(blocksForGapCalculation, duration);
    const selectedSlot = availableSlots[slotIndex];
    
    // Move the block to the selected slot
    const newStartTime = formatMinutesToTime(selectedSlot.start);
    const newEndTime = formatMinutesToTime(selectedSlot.start + duration);
    currentBlock.time = `${newStartTime}-${newEndTime}`;
    
    // Update startDateTime and endDateTime if they exist
    if (currentBlock.startDateTime && overlapResolverState.dayData.date) {
        const date = new Date(overlapResolverState.dayData.date);
        currentBlock.startDateTime = createDateTimeFromTimeStr(date, newStartTime).toISOString();
        currentBlock.endDateTime = createDateTimeFromTimeStr(date, newEndTime).toISOString();
    }
    
    // Remove current block from overlapping list and add to allBlocks in new position
    overlapResolverState.overlappingBlocks.splice(overlapResolverState.currentBlockIndex, 1);
    
    // Check if more blocks to process
    if (overlapResolverState.overlappingBlocks.length > 0) {
        // Reset index and show picker for next block
        overlapResolverState.currentBlockIndex = 0;
        showSlotPicker();
    } else {
        // All blocks resolved
        closeOverlapModal();
        overlapResolverState.resolveCallback(overlapResolverState.allBlocks);
    }
}

// Show split mode when no single slot fits
function showSplitMode() {
    const currentBlock = overlapResolverState.overlappingBlocks[overlapResolverState.currentBlockIndex];
    const duration = getBlockDurationMinutes(currentBlock);
    
    // Get blocks excluding overlapping blocks
    const blocksForGapCalculation = overlapResolverState.allBlocks.filter(
        block => !overlapResolverState.overlappingBlocks.includes(block)
    );
    
    // Find ALL gaps (even if they don't fit the full duration)
    const allGaps = findAvailableGaps(blocksForGapCalculation);
    
    if (allGaps.length === 0) {
        // No gaps at all - must remove this task
        alert(`No available time slots for "${currentBlock.title}". This task will be removed.`);
        cancelSplitMode();
        return;
    }
    
    // Show split mode
    const choiceStep = document.getElementById('overlapChoiceStep');
    const slotPickerStep = document.getElementById('overlapSlotPickerStep');
    const splitModeStep = document.getElementById('overlapSplitModeStep');
    
    choiceStep.style.display = 'none';
    slotPickerStep.style.display = 'none';
    splitModeStep.style.display = 'block';
    
    // Update task info
    document.getElementById('splitTaskTitle').textContent = currentBlock.title || 'Untitled';
    document.getElementById('splitTaskDuration').textContent = duration + ' minutes';
    document.getElementById('splitRequiredTime').textContent = duration + ' minutes';
    document.getElementById('splitSelectedTime').textContent = '0 minutes';
    
    // Populate gap checkboxes
    const container = document.getElementById('splitSlotsContainer');
    container.innerHTML = '';
    
    allGaps.forEach((gap, index) => {
        const label = document.createElement('label');
        label.style.cssText = 'display: flex; align-items: center; gap: 10px; padding: 12px; margin-bottom: 8px; background: #f8f9fa; border: 2px solid #dee2e6; border-radius: 6px; cursor: pointer; transition: all 0.2s;';
        label.dataset.duration = gap.duration;
        
        label.onmouseover = function() {
            if (!this.querySelector('input').checked) {
                this.style.background = '#e9ecef';
            }
        };
        label.onmouseout = function() {
            if (!this.querySelector('input').checked) {
                this.style.background = '#f8f9fa';
            }
        };
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = index;
        checkbox.className = 'split-slot-check';
        checkbox.style.cssText = 'width: 18px; height: 18px; cursor: pointer;';
        checkbox.onchange = function() {
            // Update visual selection
            if (this.checked) {
                label.style.background = '#e7f3ff';
                label.style.borderColor = '#0066cc';
            } else {
                label.style.background = '#f8f9fa';
                label.style.borderColor = '#dee2e6';
            }
            updateSplitSelection();
        };
        
        const text = document.createElement('span');
        text.style.cssText = 'font-size: 15px; font-weight: 500; color: #333;';
        text.textContent = `${formatMinutesToTime(gap.start)} – ${formatMinutesToTime(gap.end)} (${gap.duration} min)`;
        
        label.appendChild(checkbox);
        label.appendChild(text);
        container.appendChild(label);
    });
}

// Update split selection totals
function updateSplitSelection() {
    const checkboxes = document.querySelectorAll('.split-slot-check:checked');
    let totalTime = 0;
    
    checkboxes.forEach(cb => {
        const label = cb.closest('label');
        totalTime += parseInt(label.dataset.duration);
    });
    
    document.getElementById('splitSelectedTime').textContent = totalTime + ' minutes';
    
    const currentBlock = overlapResolverState.overlappingBlocks[overlapResolverState.currentBlockIndex];
    const requiredTime = getBlockDurationMinutes(currentBlock);
    
    const confirmBtn = document.getElementById('confirmSplitBtn');
    if (totalTime >= requiredTime) {
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
    } else {
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.5';
    }
}

// Confirm split and create multiple parts
function confirmSplit() {
    const currentBlock = overlapResolverState.overlappingBlocks[overlapResolverState.currentBlockIndex];
    const requiredTime = getBlockDurationMinutes(currentBlock);
    
    const checkboxes = document.querySelectorAll('.split-slot-check:checked');
    if (checkboxes.length === 0) {
        alert('Please select at least one time slot');
        return;
    }
    
    // Get selected gaps in order
    const blocksForGapCalculation = overlapResolverState.allBlocks.filter(
        block => !overlapResolverState.overlappingBlocks.includes(block)
    );
    const allGaps = findAvailableGaps(blocksForGapCalculation);
    
    const selectedGaps = Array.from(checkboxes)
        .map(cb => allGaps[parseInt(cb.value)])
        .sort((a, b) => a.start - b.start);
    
    // Calculate total selected time
    let totalSelectedTime = selectedGaps.reduce((sum, gap) => sum + gap.duration, 0);
    
    if (totalSelectedTime < requiredTime) {
        alert('Not enough time selected. Please select more slots.');
        return;
    }
    
    // Remove original block from overlapping list
    overlapResolverState.overlappingBlocks.splice(overlapResolverState.currentBlockIndex, 1);
    
    // Remove original block from allBlocks
    const originalIndex = overlapResolverState.allBlocks.indexOf(currentBlock);
    if (originalIndex !== -1) {
        overlapResolverState.allBlocks.splice(originalIndex, 1);
    }
    
    // Create split parts
    let remainingTime = requiredTime;
    let partNumber = 1;
    
    selectedGaps.forEach((gap, index) => {
        if (remainingTime <= 0) return;
        
        const partDuration = Math.min(gap.duration, remainingTime);
        const partStart = gap.start;
        const partEnd = gap.start + partDuration;
        
        const partBlock = {
            ...currentBlock,
            title: `${currentBlock.title} (Part ${partNumber})`,
            time: `${formatMinutesToTime(partStart)}-${formatMinutesToTime(partEnd)}`
        };
        
        // Update datetime fields if they exist
        if (currentBlock.startDateTime && overlapResolverState.dayData.date) {
            const date = new Date(overlapResolverState.dayData.date);
            partBlock.startDateTime = createDateTimeFromTimeStr(date, formatMinutesToTime(partStart)).toISOString();
            partBlock.endDateTime = createDateTimeFromTimeStr(date, formatMinutesToTime(partEnd)).toISOString();
        }
        
        overlapResolverState.allBlocks.push(partBlock);
        remainingTime -= partDuration;
        partNumber++;
    });
    
    // Check if more blocks to process
    if (overlapResolverState.overlappingBlocks.length > 0) {
        overlapResolverState.currentBlockIndex = 0;
        showSlotPicker();
    } else {
        closeOverlapModal();
        overlapResolverState.resolveCallback(overlapResolverState.allBlocks);
    }
}

// Cancel slot picker - remove this task and continue
function cancelSlotPicker() {
    const currentBlock = overlapResolverState.overlappingBlocks[overlapResolverState.currentBlockIndex];
    
    if (confirm(`Remove "${currentBlock.title}" from this day?`)) {
        // Remove current block
        const blockIndex = overlapResolverState.allBlocks.indexOf(currentBlock);
        if (blockIndex !== -1) {
            overlapResolverState.allBlocks.splice(blockIndex, 1);
        }
        overlapResolverState.overlappingBlocks.splice(overlapResolverState.currentBlockIndex, 1);
        
        // Continue with next block or finish
        if (overlapResolverState.overlappingBlocks.length > 0) {
            overlapResolverState.currentBlockIndex = 0;
            showSlotPicker();
        } else {
            closeOverlapModal();
            overlapResolverState.resolveCallback(overlapResolverState.allBlocks);
        }
    }
}

// Cancel split mode - remove this task
function cancelSplitMode() {
    const currentBlock = overlapResolverState.overlappingBlocks[overlapResolverState.currentBlockIndex];
    
    // Remove current block
    const blockIndex = overlapResolverState.allBlocks.indexOf(currentBlock);
    if (blockIndex !== -1) {
        overlapResolverState.allBlocks.splice(blockIndex, 1);
    }
    overlapResolverState.overlappingBlocks.splice(overlapResolverState.currentBlockIndex, 1);
    
    // Continue with next block or finish
    if (overlapResolverState.overlappingBlocks.length > 0) {
        overlapResolverState.currentBlockIndex = 0;
        showSlotPicker();
    } else {
        closeOverlapModal();
        overlapResolverState.resolveCallback(overlapResolverState.allBlocks);
    }
}

// Close modal
function closeOverlapModal() {
    const modal = document.getElementById('workOverlapModal');
    modal.classList.remove('active');
}

// Helper to create DateTime from date and time string
function createDateTimeFromTimeStr(date, timeStr) {
    const [hours, mins] = timeStr.split(':').map(Number);
    const dt = new Date(date);
    dt.setHours(hours, mins, 0, 0);
    return dt;
}

console.log('✅ Work-Overlap Resolver loaded - V2.1.0');
