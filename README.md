# Pumping Lemma Simulator

An interactive educational website for learning the Pumping Lemma for Regular Languages.

## Overview

The Pumping Lemma Simulator helps students understand:
- What the Pumping Lemma is
- Why it's important
- The three conditions for valid decompositions
- How to split strings into x, y, z
- How pumping changes a string
- How to identify contradictions
- How the lemma proves non-regularity

## Features

### Pages

1. **Home** - Introduction and overview
2. **Learn** - Comprehensive explanations with definitions
3. **Examples** - Library of 6 carefully selected languages
4. **Try It** - Two tabs: the Interactive Tester (experiment with one split at a time) and the Non-Regularity Test (a step-by-step general proof for {aⁿbⁿ} and {0ⁿ1ⁿ})
5. **Proof** - Step-by-step formal proofs
6. **Viva** - Quick reference Q&A and common mistakes

### Languages Included

- {aⁿbⁿ | n ≥ 0} - Non-regular example
- Even number of 0s - Regular
- Strings ending in 01 - Regular
- (01)* - Regular
- 0*1* - Regular
- a*b* - Regular

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts the development server at `http://localhost:3000`

### Build

```bash
npm run build
```

Creates an optimized production build in the `dist/` folder

## Technologies

- React 18
- Vite
- JavaScript
- CSS3

## Project Structure

```
src/
├── components/
│   ├── Home.jsx
│   ├── Learn.jsx
│   ├── Examples.jsx
│   ├── TryIt.jsx
│   ├── Proof.jsx
│   ├── Viva.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── StringVisualizer.jsx
├── styles/
│   ├── Home.css
│   ├── Learn.css
│   ├── Examples.css
│   ├── TryIt.css
│   ├── Proof.css
│   ├── Viva.css
│   ├── Navbar.css
│   ├── Footer.css
│   ├── StringVisualizer.css
│   └── Global.css
├── languages.js
├── App.jsx
├── main.jsx
└── index.css
```

## Non-Regularity Test

On the **Try It** page, switch to the **Non-Regularity Test** tab to see a guided proof that
{aⁿbⁿ | n ≥ 0} (or {0ⁿ1ⁿ | n ≥ 0}) is not regular:

- Choose a pumping length p (whole number, 1–20); the site builds w = aᵖbᵖ and shows its length.
- Eight proof steps: assume regular, choose w, x and y lie in the a's, |y| ≥ 1, pump with i = 0 or 2,
  counts become unequal, the argument holds for every legal split, contradiction.
- A final banner: **NOT REGULAR — Proven by the Pumping Lemma**.
- The conclusion comes from the general mathematical argument, not from a sample split. The program
  does not decide regularity for arbitrary languages.

The **Interactive Tester** stays separate. If one chosen split fails it says
"Pumping failed for this split" and never claims the whole language is non-regular.

## Key Features

### Interactive String Decomposition
- Visual representation of strings split into x, y, z
- Color-coded visualization with labels
- Real-time validation of conditions

### Pumping Simulation
- Interactive pumping controls
- Live table showing pumped strings
- Membership checking for each pumped result
- Dynamic explanations

### Formal Proofs
- Step-by-step proof visualization
- Progress tracking
- Clear explanations of each step

### Language Membership
- Actual implementation of language checkers (not hard-coded)
- Correct membership verification for all supported languages
- Support for custom alphabets

## Important Notes

The website emphasizes critical distinctions:
- ✓ Correct: "Pumping causes a contradiction, so the language is not regular"
- ✗ Incorrect: "The language passed pumping, therefore it is regular"

The Pumping Lemma is a necessary condition for regularity, mainly used to prove non-regularity.

## Dark Mode

Toggle dark/light mode with the button in the navbar for comfortable viewing.

## Responsive Design

Fully responsive layout that works on desktop, tablet, and mobile devices.

---

An educational tool for understanding the Pumping Lemma for Regular Languages.

## ProofLens (Try It and Proof pages)

- **Try It → ProofLens**: choose p, split w = aᵖbᵖ into x, y, z, pump with i = 0..3, and press **Explain Why** for the 11-step general argument for L = {aⁿbⁿ}.
- **Proof → Find the Mistake / Check My Proof**: a short quiz on why one split is not enough, and a rule-based checker that looks for six required ideas. It only supports this one proof pattern.
- Logic lives in `src/proofLens.js` (tests: `tests/proofLens.test.mjs`). Run `npm test`.
