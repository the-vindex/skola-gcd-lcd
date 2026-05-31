# GCD & LCM Practice App — Design Spec

**Date:** 2026-05-31  
**Status:** Approved

---

## Overview

A browser-only Czech-language app for secondary school students to practice finding NSD (největší společný dělitel) and NSN (nejmenší společný násobek) of 2–4 numbers. Deployable to GitHub Pages with no build step.

---

## Files

```
index.html   — page structure and markup
style.css    — layout and visual styling
app.js       — all logic: generation, calculation, answer checking, solution display
```

No frameworks, no dependencies, no build tools.

---

## Task Generation

- Pick a random count of numbers: 2, 3, or 4
- Each number is a random integer in range 2–1000
- Numbers are regenerated on "Nové příklady" button click
- A task is shown immediately on page load

---

## Calculation

### GCD (NSD)
Computed iteratively using the Euclidean algorithm across all numbers.

### LCM (NSN)
Computed as `lcm(a, b) = a * b / gcd(a, b)`, applied pairwise across all numbers.

### Prime Factorization (for solution display)
Each number is factorized by trial division. Result stored as a map of `{ prime: exponent }`.

---

## UI — Czech Labels

| Element | Text |
|---|---|
| Page title | Procvičování NSD a NSN |
| Task prompt | Najdi NSD a NSN čísel: |
| GCD input label | NSD: |
| LCM input label | NSN: |
| Check button | Zkontrolovat |
| Show solution button | Zobrazit řešení |
| New task button | Nové příklady |
| Correct feedback | ✓ Správně! |
| Incorrect feedback | ✗ Špatně, zkus znovu |

---

## User Flow

1. Page loads → task generated and displayed immediately
2. Student enters NSD answer and NSN answer in two inputs
3. Clicks **Zkontrolovat** → inline feedback: Správně / Špatně
4. At any point, clicks **Zobrazit řešení** → solution panel appears
5. Clicks **Nové příklady** → new task, inputs cleared, feedback hidden, solution hidden

---

## Solution Display Format

### Per-number ladders (side by side)

Each number gets its own division ladder (trial division column):

```
 84 │ 2    630 │ 2    315 │ 3
 42 │ 2    315 │ 3    105 │ 3
 21 │ 3    105 │ 3     35 │ 5
  7 │ 7     35 │ 5      7 │ 7
  1 │        7 │ 7      1 │
               1 │
```

### Factorization summary

Below the ladders:

```
84  = 2² · 3 · 7
630 = 2 · 3² · 5 · 7
315 = 3² · 5 · 7
```

### NSD and NSN derivation

```
NSD = 3 · 7 = 21
NSN = 2² · 3² · 5 · 7 = 1260
```

NSD uses minimum exponent of each prime common to all numbers.  
NSN uses maximum exponent of each prime appearing in any number.

---

## Behavior Details

- "Zobrazit řešení" is always visible; solution panel starts hidden
- Checking answer does not hide or show the solution panel
- Both inputs must be filled to submit (HTML required validation)
- Answer comparison is integer equality (trim whitespace, parse int)
- New task resets: inputs cleared, feedback hidden, solution hidden

---

## Constraints

- No external dependencies
- Works offline (after initial load)
- GitHub Pages compatible (static files only)
