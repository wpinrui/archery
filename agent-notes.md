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
`simulator.html` at repo root — open in browser. Live-editable constants, hover tooltips with exact counts, theory table, GDD-original vs current preset buttons.
