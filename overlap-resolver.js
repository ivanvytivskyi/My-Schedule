(() => {
    'use strict';

    function parseTimeToMinutes(timeStr) {
        const [h, m] = (timeStr || '').split(':').map(Number);
        if (Number.isNaN(h) || Number.isNaN(m)) return NaN;
        return h * 60 + m;
    }

    function parseTimeRange(rangeStr) {
        if (!rangeStr || !rangeStr.includes('-')) return { start: NaN, end: NaN };
        const [startStr, endStr] = rangeStr.split('-');
        return { start: parseTimeToMinutes(startStr), end: parseTimeToMinutes(endStr) };
    }

    function formatMinutes(minutes) {
        const safe = ((minutes % (24 * 60)) + (24 * 60)) % (24 * 60);
        const h = Math.floor(safe / 60);
        const m = safe % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    function rangeOverlaps(start, end, otherStart, otherEnd) {
        if (Number.isNaN(start) || Number.isNaN(end) || Number.isNaN(otherStart) || Number.isNaN(otherEnd)) {
            return false;
        }
        const normalizedEnd = end < start ? end + 24 * 60 : end;
        const normalizedOtherEnd = otherEnd < otherStart ? otherEnd + 24 * 60 : otherEnd;
        return start < normalizedOtherEnd && normalizedEnd > otherStart;
    }

    function isFixedDuringWork(block) {
        const title = (block.title || '').toLowerCase();
        if (title.includes('work')) return true;
        if (title.includes('commute')) return true;
        if (title.includes('sleep')) return true;
        if (block.type === 'shopping' || block.type === 'travel-shopping') return true;
        if (block.isCookingBlock) return true;
        return false;
    }

    async function resolveWorkOverlaps(dayIndex, dayData, blocks, workRange) {
        if (!Array.isArray(blocks) || !workRange) return blocks;
        const overlaps = blocks.filter(block => {
            const { start, end } = parseTimeRange(block.time || '');
            if (Number.isNaN(start) || Number.isNaN(end)) return false;
            return rangeOverlaps(start, end, workRange.start, workRange.end);
        });

        if (overlaps.length === 0) return blocks;

        const dayLabel = dayData?.name ? `${dayData.name} (${dayData.date || ''})` : `Day ${dayIndex + 1}`;
        for (const block of overlaps) {
            if (isFixedDuringWork(block)) continue;
            const { start, end } = parseTimeRange(block.time || '');
            const duration = Number.isNaN(start) || Number.isNaN(end) ? 0 : (end < start ? end + 24 * 60 - start : end - start);
            const workEnd = workRange.end;
            const workStart = workRange.start;
            const afterStart = workEnd;
            const afterEnd = workEnd + duration;
            const beforeEnd = workStart;
            const beforeStart = workStart - duration;
            const suggestionAfter = duration > 0 ? `${formatMinutes(afterStart)}-${formatMinutes(afterEnd)}` : '';
            const suggestionBefore = duration > 0 ? `${formatMinutes(beforeStart)}-${formatMinutes(beforeEnd)}` : '';
            const promptMsg =
                `⚠️ "${block.title}" overlaps work on ${dayLabel}.\n\n` +
                `Work: ${formatMinutes(workRange.start)}-${formatMinutes(workRange.end)}\n` +
                `Current: ${block.time}\n\n` +
                `Enter a new time (HH:MM-HH:MM) to reschedule.\n` +
                `Suggestions: ${suggestionAfter} or ${suggestionBefore}\n` +
                `Leave blank to remove this block.`;
            const response = window.prompt(promptMsg, suggestionAfter || block.time || '');
            if (response === null) {
                continue;
            }
            const trimmed = response.trim();
            if (!trimmed) {
                blocks = blocks.filter(b => b !== block);
                continue;
            }
            block.time = trimmed;
        }

        return blocks;
    }

    window.resolveWorkOverlaps = resolveWorkOverlaps;
    console.log('✅ Work-Overlap Resolver loaded - fallback');
})();
