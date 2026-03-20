# Agent Notes

## Phase 2, Step 3 — Competitor Shot Simulation (2026-03-20)

### Status: complete

### What was found
`simulateAIShot()` and `recordShot()` already existed and were correct — no bugs. Arrow-by-arrow, lockstep with player, incremental accumulation, no pre-computation.

### Shot simulation constants — balanced values (agreed by user)

| Constant | Old (GDD) | New |
|---|---|---|
| SKILL_COEFFICIENT | 0.085 | 0.035 |
| SKILL_BASE | 0.25 | 4.75 |
| DISTANCE_BONUS 18m | +1.5 | +1.5 |
| DISTANCE_BONUS 30m | +0.8 | +0.8 |
| DISTANCE_BONUS 50m | 0.0 | +0.3 |
| DISTANCE_BONUS 70m | -0.8 | 0.0 |
| DISTANCE_BONUS 90m | -1.675 | -0.5 |
| SIGMA 18m | 0.8 | 0.8 |
| SIGMA 30m | 1.2 | 1.2 |
| SIGMA 50m | 1.6 | 1.6 |
| SIGMA 70m | 2.0 | 2.0 |
| SIGMA 90m | 2.5 | 2.0 |

Derived from anchors: skill 50 at 18m → mean 8.0, skill 100 at 18m → mean 9.75.

### Theoretical means (new constants)

| Skill | 18m | 30m | 50m | 70m | 90m |
|---|---|---|---|---|---|
| 50 | 8.00 | 7.30 | 6.80 | 6.50 | 6.00 |
| 65 | 8.53 | 7.83 | 7.33 | 7.03 | 6.53 |
| 75 | 8.88 | 8.18 | 7.68 | 7.38 | 6.88 |
| 85 | 9.23 | 8.53 | 8.03 | 7.73 | 7.23 |
| 100 | 9.75 | 9.05 | 8.55 | 8.25 | 7.75 |

### Simulator
`scripts/simulator.html` — open in browser. Live-editable constants, hover tooltips with exact counts, theory table, GDD-original vs current preset buttons.

---

# Reviewer 1

PR: https://github.com/wpinrui/archery/pull/15

## Type errors: 0

## Bugs found: 0

## Code smells: 3

- [simulator.html:1001-1004](simulator.html#L1001-L1004) — Initial JS variable values for `DISTANCE_BONUS` and `DISTANCE_SIGMA` don't match the proposed preset that `applyPreset('proposed')` immediately applies on load. At declaration: `50: 0.0, 70: -0.5, 90: -0.75` and `90: 2.5`. The proposed preset (and actual game constants) are `50: 0.3, 70: 0.0, 90: -0.5` and `90: 2.0`. No runtime impact since the preset fires on load, but the initial values are stale GDD-original numbers, which is misleading.

- [simulator.html:1160](simulator.html#L1160), [simulator.html:1217](simulator.html#L1217), [simulator.html:1257](simulator.html#L1257) — `maxCount` is declared and immediately computed in `renderOverview`, `renderComparison`, and `renderDetail`, but never read. Each function recomputes the same value inline (`const ref = Math.max(...counts.slice(1), 1)`) inside the loop. Dead variable × 3.

- [simulator.html](simulator.html) — Standalone HTML tool committed to the repo root. Per prior feedback, mockup HTML files are throwaway artifacts and should not be committed. **Judgment call needed**: this is more sophisticated than a typical mockup (live presets, theory table, multi-chart), so it may be intentionally kept. Flag for implementer to decide.

## Issues created: 0

## Judgment calls
- The `normalRandom` and `randInt` duplication in `scripts/simulate-balance.ts` is intentional (comment says "Duplicated here so the script runs standalone without bundler resolution"). Not flagged.
- `GROWTH_SPAN = 12` (not 11): the taper formula reaches ~0.083 at age 29, not exactly 0. This is intentional per the GDD ("by age 29 it is ~0.17"). Not a bug.
- GDD states "over 100 seasons, the mean rises from ~80 to ~89" — this describes the equilibrium field mean (including growth), not just rookie_mean. The formula `70 + season × 0.075` gives 70→77.5 for rookie_mean only; the field average being ~80 at start is consistent with growth pushing the mean up. Not a discrepancy.
