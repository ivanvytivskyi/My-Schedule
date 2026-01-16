# Split Plan (No Behavior Changes)

## Goals
- Preserve UI/UX, IDs/classes, localStorage keys, and scheduling outcomes.
- Keep one shared scheduling engine.
- Use plain `<script defer>` tags; no bundlers, no frameworks.
- Maintain global function availability for inline handlers.

## File Moves (Old → New)
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
6. `src/features/products/model/product-catalog.js`
7. `src/features/kitchen-stock/services/kitchen-stock.js`
8. `src/features/smart-shopping/services/smart-shopping.js`
9. `src/features/cooking/services/cooking-integration.js`
10. `src/features/work-commute/services/overlap-resolver.js`
11. `src/engine/schedule-engine.js`
12. `src/features/shopping/ui/shopping-quick-add.js`
13. `src/features/products/services/product-management.js`

## Engine Contracts (Single Source of Truth)
- **Scheduling engine:** `src/engine/schedule-engine.js` remains the only implementation of:
  - Week generation (`addWeek`)
  - Prediction/slots (`buildPredictedDayBusyIntervals`, `findAvailableShoppingSlots`)
  - Overlap resolution orchestration
  - Finalization (`finalizeDayBlocks`) and rendering
- **No duplication**: features call into the shared engine through existing globals.

## Feature Folder Contracts
Each feature folder includes:
- `index.js` (placeholder for future `window.App.features.<name>` exports)
- `ui/` (DOM rendering/handlers)
- `model/` (data definitions, constants)
- `services/` (logic/utilities)

## Risky Couplings / Notes
- **History persistence duplication:** `saveScheduleHistoryEntry` (engine) vs `saveScheduleToHistory` (recipes utils) both write `scheduleHistory_v2`.
- **Work/commute logic duplication:** both preview and generation compute work schedule/commute.
- **Cooking integration:** calls `saveSchedule()` (missing function), left unchanged to preserve behavior.
- **Overlap resolver:** async modal flow; availability is required for conflict handling.

## Storage Keys (Preserved)
All keys remain unchanged (e.g., `weeklySchedule`, `shoppingTables_v2`, `kitchenStock_v2`, `recipeUsageHistory`, `scheduleHistory_v2`, `cookingConfig`).

## Documentation Outputs
- `/docs/app-map.json`: machine-readable map
- `/docs/app-map.html`: standalone HTML map (no build step)
