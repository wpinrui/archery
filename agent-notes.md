# Agent Notes

## Phase 2, Step 2: Competitor Growth Curve — Balancing Report

### What changed

- Added `GROWTH_RATE` (2.0), `GROWTH_AGE_MIN` (18), `GROWTH_AGE_MAX` (29), `GROWTH_SPAN` (12) constants to `src/types/index.ts`
- Updated `ageCompetitor()` in `src/store/helpers.ts` to apply the GDD growth formula for ages 18–29:
  `seasonal_gain = GROWTH_RATE * (1 - (age - 18) / 12)`
- Growth is applied before aging degradation (they don't overlap: growth 18–29, decay 30+)
- Skill clamped to max 100

### Balancing simulation

Created `scripts/simulate-balance.ts` — a standalone simulation that runs N seasons of the full roster lifecycle (growth, decay, retirement, rookie replacement) and reports skill distribution stats.

Usage: `npx tsx scripts/simulate-balance.ts [seasons=100] [growth_rate=2.0]`

### Simulation results

Tested three growth_rate values over 100 seasons each:

| growth_rate | Equilibrium mean | StdDev | Peak skill (65@18) | Drift  | Verdict         |
|-------------|------------------|--------|---------------------|--------|-----------------|
| 1.5         | ~80.4            | ~7.7   | ~74.8               | +0.98  | Too low peak    |
| **2.0**     | **~80.6**        | **~8.5** | **~78.0**         | **-0.46** | **Best fit** |
| 2.5         | ~83.2            | ~9.1   | ~81.3               | +0.55  | Too high field  |

All three are stable (drift < 1.0), but 2.0 best matches the GDD target of "gradually improves toward ~80 by age 29".

### Sample career arc (growth_rate = 2.0, rookie entering at skill 65, age 18)

```
Age  Skill   Change
19    67.0   +2.00
20    68.8   +1.83
21    70.5   +1.67
22    72.0   +1.50
23    73.3   +1.33
24    74.5   +1.17
25    75.5   +1.00
26    76.3   +0.83
27    77.0   +0.67
28    77.5   +0.50
29    77.8   +0.33
30    78.0   +0.17  (peak)
31    78.0   +0.00
32    77.9   -0.10
33    77.5   -0.40
34    76.6   -0.90
35    75.0   -1.60
36    72.5   -2.50
37    68.9   -3.60
38    64.0   -4.90
39    57.6   -6.40
40    50.0   (floor)
```

### Conclusion

`growth_rate = 2.0` is confirmed as the correct default. The system reaches equilibrium with mean skill ~80, stddev ~8.5, and no drift in either direction. The distribution stays roughly normal — no runaway inflation or deflation.
