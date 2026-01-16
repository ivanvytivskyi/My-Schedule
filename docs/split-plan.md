# Split Plan (No Behavior Changes)

## Goals
- Preserve UI/UX, IDs/classes, localStorage keys, and scheduling outcomes.
- Keep one shared scheduling engine.
- Use plain `<script defer>` tags; no bundlers, no frameworks.
- Maintain global function availability for inline handlers.

## Recent Moves (Old → New)
- `src/engine/schedule-engine.js` → `src/features/wizard/services/setup-wizard.js` (setup wizard UI, work pattern helpers)
- `src/engine/schedule-engine.js` → `src/features/settings-history/services/settings-history.js` (settings modal + schedule history)

## Legacy Moves (Old → New)
- `script.js` → `src/engine/schedule-engine.js`
- `import-functions.js` → `src/features/schedule-ui/services/import-functions.js`
- `recipe-database.js` → `src/features/recipes/model/recipe-database.js`
- `recipe-display.js` → `src/features/recipes/ui/recipe-display.js`
- `recipe-utils.js` → `src/features/recipes/services/recipe-utils.js`
- `product-catalog.js` → `src/features/products/model/product-catalog.js`
- `product-management.js` → `src/features/products/services/product-management.js`
- `kitchen-stock.js` → `src/features/kitchen-stock/services/kitchen-stock.js`
- `smart-shopping.js` → `src/features/smart-shopping/services/smart-shopping.js`
- `shopping-quick-add.js` → `src/features/shopping/ui/shopping-quick-add.js`
- `cooking-integration.js` → `src/features/cooking/services/cooking-integration.js`
- `overlap-resolver.js` → `src/features/work-commute/services/overlap-resolver.js`
- `pwa-manager.js` → `src/features/pwa/services/pwa-manager.js`

## Script Load Order (Preserved)
1. `src/features/schedule-ui/services/import-functions.js`
2. `src/features/recipes/model/recipe-database.js`
3. `src/features/recipes/ui/recipe-display.js`
4. `src/features/recipes/services/recipe-utils.js`
5. `src/features/pwa/services/pwa-manager.js`
6. `src/features/wizard/services/setup-wizard.js`
7. `src/features/settings-history/services/settings-history.js`
8. `src/features/products/model/product-catalog.js`
9. `src/features/kitchen-stock/services/kitchen-stock.js`
10. `src/features/smart-shopping/services/smart-shopping.js`
11. `src/features/cooking/services/cooking-integration.js`
12. `src/features/work-commute/services/overlap-resolver.js`
13. `src/engine/schedule-engine.js`
14. `src/features/shopping/ui/shopping-quick-add.js`
15. `src/features/products/services/product-management.js`

## Engine Contracts (Single Source of Truth)
- **Shared engine file:** `src/engine/schedule-engine.js`
- **Allowed engine API:**
  - `addWeek`
  - `buildPredictedDayBusyIntervals`
  - `findAvailableShoppingSlots`
  - `finalizeDayBlocks`
  - `renderSchedule`
  - `saveToLocalStorage`
  - `loadFromLocalStorage`
- **No duplication**: features call into the shared engine through existing globals.
- **Engine never touches DOM for feature-specific views** (wizard/settings moved to their features).

## Feature Boundaries
- **wizard:** owns setup modal UI, work pattern storage, and shopping slot selection.
- **settings-history:** owns settings modal UI, schedule history, and reset actions.
- **recipes:** owns recipe library UI and usage tracking.
- **shopping/smart-shopping:** own manual quick add vs recipe-driven lists.
- **products/kitchen-stock:** own product catalog customizations + stock storage.
- **work-commute:** owns overlap resolver UI.

## Known Fragile Areas
- **Global state coupling:** `scheduleData` is shared across engine + features.
- **History key duplication:** `scheduleHistory_v2` is written by both settings-history and recipe utils.
- **Missing dependency:** `resetScheduleHistory()` calls `loadScheduleHistory()` which is not defined.

## Rules for Future Fixes
1. Keep scheduling logic inside the engine (prediction/generation/finalization only).
2. Feature UI should call engine APIs, not replicate scheduling logic.
3. Preserve inline handler names used by HTML (global functions).
4. Maintain storage keys and schemas; add new keys only in feature-owned modules.

## Documentation Outputs
- `/docs/app-map.json`: machine-readable map
- `/docs/app-map.html`: standalone HTML map (no build step)
