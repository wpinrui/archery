# Long Draw Archery — GDD

## Overview

Long Draw Archery is a single-player sports career and skill game.
The player competes as a professional archer on the world tour,
attending 5 events per season across real-world cities. Each
season's results feed into a championship standings table. The
career spans as long as the player chooses, with an aging curve
that eventually forces retirement. The core skill loop is
real-time aim stabilisation against a physically simulated bow
shake, with gravity and wind compensation at longer distances.

## Core Shooting Mechanic

The player aims by moving the mouse. The bow sight drifts
continuously due to simulated hand tremor — the entire bow
moves, not just a cursor. The player actively corrects by
countering the drift direction. Effective aim = mouse position
+ live shake offset.

On click, the arrow is released. A 20-second timer per shot
forces decisions under pressure.

At longer distances the arrow drops due to gravity. The player
must aim above the target to compensate — no indicator is shown;
this is learned through trial and error. At 18m compensation is
negligible; at 90m it is significant.

Wind is shown via a windsock. The player reads it and
compensates manually by aiming into the wind. Wind displaces
the arrow horizontally on release.

Scoring follows standard archery rings: bullseye = 10, down to
1 at the outer edge. Missing the board entirely scores 0.

## Competition Structure

The season consists of 5 events in fixed order each year.
Each event features 3 distances (10 arrows total), always
shot shortest to longest. Each event has a distinct character.

| Event                  | 18m | 30m | 50m | 70m | 90m |
|------------------------|-----|-----|-----|-----|-----|
| Seoul Cup              |  4  |  3  |  3  |  0  |  0  |
| Paris Open             |  4  |  4  |  0  |  2  |  0  |
| Las Vegas Classic      |  0  |  3  |  4  |  3  |  0  |
| Sydney International   |  0  |  0  |  3  |  3  |  4  |
| Cape Town Cup          |  2  |  0  |  0  |  4  |  4  |

Seoul Cup is an accessible opener. Paris Open rewards
short-range accuracy. Las Vegas Classic is the mid-range
benchmark. Sydney International introduces 90m seriously.
Cape Town Cup is the most demanding — a dramatic jump from
18m to 70m/90m tests full range adaptation.

After each arrow, a mini leaderboard card shows the player's
running event total with 2 competitors above and 2 below.
Expandable to show all 50. The top 3 finishers receive
event medals (gold, silver, bronze).

## Season & World Tour

Each season consists of 5 events. Points are awarded per event
finish position and accumulate toward the World Championship.

Points distribution (50 athletes):
P1: 100 | P2: 85 | P3: 72 | P4: 61 | P5: 52 | P6: 44 | P7: 37
P8: 31 | P9: 26 | P10: 22 | P11–15: 15 | P16–20: 10 | P21–30: 6
P31–40: 3 | P41–50: 0

The athlete with the most points at season end wins the
World Championship and receives the championship cup.

At season end, a summary screen shows final championship
standings for all 50 athletes.

## Athletes & Roster

The world tour has 50 athletes, one per country. Countries are
fixed — the same 50 nations appear every season. Each athlete
has a name, country, flag, age, and skill level.

"Skill" is an AI-only term and does not apply to the player.
The player's difficulty is governed by shakiness (see Progression
& Aging). Skill and shakiness are separate systems.

### Skill & Shot Simulation

Skill ranges from 50 to 100. Each competitor shot is sampled
from a normal distribution:

  mean(skill, distance) = base_mean(skill) + distance_bonus(distance)
  base_mean(skill) = 0.085 × skill + 0.25
    → skill 100 = 8.75 overall average, skill 50 = 4.5 overall average

  distance_bonus:
    18m: +1.5 | 30m: +0.8 | 50m: 0.0 | 70m: −0.8 | 90m: −1.675

  σ(distance):
    18m: 0.8 | 30m: 1.2 | 50m: 1.6 | 70m: 2.0 | 90m: 2.5

Spread is the same regardless of skill — only the mean changes.
Samples are rounded to the nearest integer and clamped to [0, 10].

### Player Setup

On first launch the player chooses a country. If that country
is already in the roster, the player replaces that athlete.
Otherwise the player replaces the lowest-skill athlete and
takes their country slot.

### Aging & Retirement

Competitors age one year per season and their skill degrades
following the same quadratic curve as the player's shakiness
(proportionally scaled). Each season, the 5 lowest-skill
competitors retire and are replaced by rookies aged 18–25
with normally distributed skill — allowing for rare wunderkind
entrants. Country slots never change.

## Career & Screens

### Career Structure

The player's career begins at age 18 with no fixed end.
A retire button is permanently visible. The player decides
when to stop.

Each season: 5 events → championship standings → season
summary screen → next season begins.

### Screens

1. **Shooting HUD** — active gameplay view (see Core Shooting
   Mechanic)

2. **Post-event leaderboard** — full event results after the
   final arrow of each event

3. **Season summary** — final championship standings for all
   50 athletes after the 5th event

4. **Career screen** — accessible at any time; shows
   championship finish position for each completed season
   and all medals earned (event podium + championship cups)

5. **Victory screen** — played when the player wins the
   championship; a victory animation followed by the option
   to continue or retire

6. **Country selection** — shown once on first launch

7. **Retirement screen** — shown when the player retires.
   Opens with a full-screen animated sequence of 5 career
   highlights, displayed one at a time in ascending order
   of greatness (weakest first, strongest last):
     Highlights 1–4: Individual event medal finishes (one
       medal per highlight). Selection priority within the
       career's medal pool: gold > silver > bronze. When
       multiple medals exist at the same tier, prefer medals
       from different events (countries) for variety; break
       remaining ties at random. If the player earned all
       their medals at the same event, all four highlights
       may show that event. Each highlight shows the medal
       emoji, event name, season number, and player age.
     Highlight 5: Best championship finish. If the player
       won the championship more than once, the count is
       shown (e.g., "World Champion × 2").
   Each highlight fades in, holds briefly, then fades out
   before the next appears. After all five, the retirement
   summary screen is shown with: player identity, career
   stats, a compact highlights strip, and the full career
   table (one row per season with age, championship
   position, points total, and medals earned that season).

8. **Event lobby** — shown before each event begins (after
   country selection on first launch, and after each
   post-event leaderboard thereafter). Displays the event
   name, host country flag, and the three distances for the
   event. Shows current season standings (top 5 rows plus the
   player's row if outside top 5). A "Start Event" button
   advances to the Shooting HUD. The career screen is
   accessible from here via a persistent button.

## Progression & Aging

### Skill & Shakiness

Shakiness controls the amplitude of bow drift the player must
actively correct. Scale: 0 (perfectly steady) to 500 (genuinely
uncontrollable).

Starting shakiness: 100

Each season, shakiness is permanently reduced based on final
championship position:

| Position | Shakiness reduction |
|----------|---------------------|
| P1       | −8%                 |
| P2–3     | −6%                 |
| P4–10    | −4%                 |
| P11–20   | −2%                 |
| P21–40   | −1%                 |
| P41–50   | 0%                  |

Reductions are cumulative and permanent.

### Aging

From age 30 onward, shakiness increases each season:

  added_shake = (age − 30)²

Age 35: +25  |  Age 40: +100  |  Age 45: +225  |  Age 50: +400

Each season, aging is applied first, then the finish-position
reduction is applied to the result. Order of operations:
  1. added_shake = (age − 30)²  [applied if age > 30]
  2. shakiness reduced by finish-position percentage

A player who reduces shakiness to 50 by their peak will be
at 150 by age 40 and 275 by age 45. Finishing well extends
the competitive window but cannot stop the decline.

The player may retire at any time via a permanently visible
retire button. There is no forced retirement age.

## Core Shooting Mechanic

The player aims by moving the mouse. The bow sight drifts
continuously due to simulated hand tremor — the entire bow
moves, not just a cursor. The player actively corrects by
countering the drift direction. Effective aim = mouse position
+ live shake offset.

On click, the arrow is released. A 20-second timer per shot
forces decisions under pressure.

At longer distances the arrow drops due to gravity. The player
must aim above the target to compensate — no indicator is shown;
this is learned through trial and error. At 18m compensation is
negligible; at 90m it is significant.

Wind is shown via a windsock. The player reads it and
compensates manually by aiming into the wind. Wind displaces
the arrow horizontally on release.

Scoring follows standard archery rings: bullseye = 10, down to
1 at the outer edge. Missing the board entirely scores 0.
