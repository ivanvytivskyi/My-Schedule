(() => {
    'use strict';

    async function resolveWorkOverlaps(dayIndex, dayData, blocks, workRange) {
        console.warn(
            '⚠️ Work overlap resolver is not available. Skipping overlap handling.',
            { dayIndex, dayData, workRange }
        );
        return blocks;
    }

    window.resolveWorkOverlaps = resolveWorkOverlaps;
    console.log('✅ Work-Overlap Resolver loaded - fallback');
})();
