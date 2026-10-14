// ProofLens logic (pure JS, no React). Tested in tests/proofLens.test.mjs.
// Scope: ONLY the language L = { aⁿbⁿ | n ≥ 0 } and the witness w = aᵖbᵖ.
// Nothing here decides regularity of arbitrary languages.

export const MAX_P = 12;

export const witness = (p) => 'a'.repeat(p) + 'b'.repeat(p);

const count = (s, ch) => s.split(ch).length - 1;

// Real membership test: all a's first, then all b's, with equal counts.
// (Length alone is never used: "aabbb" and "abab" are both rejected for the right reasons.)
export const inAnBn = (s) => {
  if (!/^a*b*$/.test(s)) return false;
  return count(s, 'a') === count(s, 'b');
};

// Plain-English reason for the membership verdict.
export const explainMembership = (s) => {
  const shown = s === '' ? 'ε (the empty string)' : s;
  const a = count(s, 'a');
  const b = count(s, 'b');
  if (!/^[ab]*$/.test(s)) return `${shown} contains a symbol other than a and b.`;
  if (!/^a*b*$/.test(s)) return `${shown} has a b before an a. In L every a must come before every b.`;
  if (a === b) return `${shown} has ${a} a's followed by ${b} b's. The counts are equal, so it is in L.`;
  return `${shown} has ${a} a's and ${b} b's. L needs equal numbers of a's and b's, so it is not in L.`;
};

export const pump = (x, y, z, i) => x + y.repeat(i) + z;

export const PUMP_MEANING = {
  0: 'remove y',
  1: 'keep y once (the original string)',
  2: 'repeat y twice',
  3: 'repeat y three times'
};

/**
 * Evaluate a student's split of w = aᵖbᵖ.
 * status:
 *   'BAD_SPLIT'    – x + y + z is not w
 *   'BAD_P'        – p is not a whole number in 1..MAX_P
 *   'EMPTY_Y'      – |y| = 0
 *   'TOO_LONG'     – |xy| > p
 *   'LEGAL'        – legal split; rows holds i = 0..3
 */
export const evaluateSplit = ({ p, x, y, z }) => {
  if (!Number.isInteger(p) || p < 1 || p > MAX_P) {
    return { status: 'BAD_P', w: '', concatOk: false, cond1: false, cond2: false, rows: [] };
  }
  const w = witness(p);
  const concatOk = x + y + z === w;
  const cond1 = y.length >= 1;
  const cond2 = x.length + y.length <= p;
  let status = 'LEGAL';
  if (!concatOk) status = 'BAD_SPLIT';
  else if (!cond1) status = 'EMPTY_Y';
  else if (!cond2) status = 'TOO_LONG';

  const rows = [];
  if (status === 'LEGAL') {
    for (let i = 0; i <= 3; i++) {
      const s = pump(x, y, z, i);
      rows.push({ i, pumped: s, inL: inAnBn(s), reason: explainMembership(s) });
    }
  }
  return { status, w, concatOk, cond1, cond2, rows };
};

/** Step-by-step reference explanation ("Explain Why"). */
export const buildExplainSteps = (p) => {
  const w = witness(p);
  const down = 'a'.repeat(p - 1) + 'b'.repeat(p);
  return [
    { text: 'Assume the language L is regular.', note: 'We use proof by contradiction: pretend L is regular and see if something impossible happens.' },
    { text: 'Let p be its pumping length.', note: 'p is the number the Pumping Lemma promises exists for every regular language. We do not know its value.' },
    { text: `Choose w = aᵖbᵖ.`, note: `aᵖbᵖ means p a's followed by p b's. For p = ${p}, w = ${w}. It is in L and |w| = 2p ≥ p.` },
    { text: "The first p characters of w are all a's.", note: `In ${w}, the first ${p} characters are ${'a'.repeat(p)}.` },
    { text: "Since |xy| ≤ p, y contains only a's.", note: '|xy| ≤ p means x and y together fit inside the first p characters, which are all a\'s.' },
    { text: "Since |y| ≥ 1, y contains at least one a.", note: '|y| ≥ 1 means y is not empty. So y = aᵏ for some k ≥ 1 (k is just the number of a\'s in y).' },
    { text: 'Pump with i = 0: remove y.', note: 'xy⁰z = xz: the string with y deleted.' },
    { text: "The resulting string has fewer a's than b's.", note: `It has p − k a's but still p b's, and p − k < p. Example: removing one a gives ${down}.` },
    { text: 'Therefore, the resulting string is not in the language.', note: "L needs equal numbers of a's and b's, but p − k ≠ p." },
    { text: 'This argument works for every legal decomposition of the chosen witness string.', note: 'We never used where x and y sit or how long they are, only that y is a non-empty block of a\'s. So no legal split survives pumping.', key: true },
    { text: 'The assumption that the language is regular leads to a contradiction.', note: 'The lemma promises at least one legal split that survives all pumping. We showed none does.', key: true }
  ];
};

export const CONCLUSION = 'LANGUAGE IS NOT REGULAR';

// ---------------------------------------------------------------------------
// Find the Mistake
// ---------------------------------------------------------------------------
export const MISTAKE_STATEMENT =
  'I selected y = a, removed it, and got a string outside the language. Therefore, the language is not regular.';

export const MISTAKE_QUESTION = 'What is missing from this proof?';

export const MISTAKE_OPTIONS = [
  { id: 'A', text: 'The student should also have tried i = 5.', correct: false,
    feedback: 'Not quite. The problem is not how many values of i were tried. With i = 0 the string really is outside L.' },
  { id: 'B', text: 'Only one decomposition was tested. The proof must cover every legal decomposition of the witness string.', correct: true,
    feedback: 'Correct!' },
  { id: 'C', text: 'The student should have chosen y = b.', correct: false,
    feedback: 'No. With |xy| ≤ p, y sits in the first p characters, which are all a\'s. y = b is not a legal choice.' },
  { id: 'D', text: 'Removing y (i = 0) is not allowed in the Pumping Lemma.', correct: false,
    feedback: 'Not quite. i = 0 is allowed: the lemma says xyⁱz ∈ L for all i ≥ 0.' }
];

export const MISTAKE_HINTS = [
  'Hint 1: The Pumping Lemma promises that SOME legal split exists. Who chooses the split, the student or the lemma?',
  'Hint 2: If only one split fails, could a different split (for example y = aa) still survive pumping?'
];

export const MISTAKE_EXPLANATION =
  'The Pumping Lemma only promises that some legal decomposition works, and we do not get to choose which one. ' +
  'To contradict the lemma, we must show that every legal decomposition fails. ' +
  'One failed split is just one example. A complete proof explains why all legal splits fail: ' +
  'x and y lie in the first p characters (all a\'s), y is non-empty, and removing y always leaves fewer a\'s than b\'s.';

// ---------------------------------------------------------------------------
// Rule-based proof completeness checker (aⁿbⁿ with w = aᵖbᵖ ONLY)
// ---------------------------------------------------------------------------
const normalise = (t) =>
  t
    .toLowerCase()
    .replace(/ᵖ/g, '^p').replace(/ⁿ/g, '^n').replace(/ᵏ/g, '^k')
    .replace(/[⁰]/g, '^0').replace(/²/g, '^2')
    .replace(/[’‘]/g, "'")
    .replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/≠/g, '!=').replace(/∉/g, ' not in ')
    .replace(/\s+/g, ' ');

const RULES = [
  {
    id: 'witness',
    label: 'Names the witness string w = aᵖbᵖ',
    hint: "Say which string you chose, for example: \"Let w = aᵖbᵖ (p a's followed by p b's).\"",
    test: (t) => /a\^?\{?p\}?\s*b\^?\{?p\}?/.test(t) || /p\s*a'?s?\s*(followed by|then)\s*p\s*b/.test(t)
  },
  {
    id: 'onlyA',
    label: "Explains why y contains only a's",
    hint: "Use |xy| ≤ p: x and y lie in the first p characters of w, and those are all a's.",
    test: (t) =>
      /(\|?xy\|?\s*<=\s*p|first p|within p|first p characters|first p symbols)/.test(t) &&
      /(only a|all a|just a|nothing but a|consists of a|made of a|y\s*=\s*a\^?[a-z0-9]|y is (a block of )?a'?s)/.test(t)
  },
  {
    id: 'nonEmpty',
    label: 'Explains why y is non-empty',
    hint: "Use |y| ≥ 1: y has at least one character, so it contains at least one a.",
    test: (t) =>
      /(\|y\|\s*(>=|>)\s*[01]|k\s*(>=|>)\s*[01]|non-?empty|not empty|isn't empty|is not empty|cannot be empty|at least one (a|character|symbol))/.test(t)
  },
  {
    id: 'removal',
    label: 'Says what happens when y is removed (or repeated)',
    hint: 'Pump with i = 0 (remove y). The number of a\'s drops, the number of b\'s stays p.',
    test: (t) => /(i\s*=\s*0|i\s*=\s*2|remov|delet|xz\b|pump(ed|ing)? down|y\^0|y\^2|repeat)/.test(t)
  },
  {
    id: 'outside',
    label: "Shows the resulting string is outside L (counts of a's and b's differ)",
    hint: "Compare the counts: after removing y there are fewer a's than b's, so the string is not in L.",
    test: (t) =>
      /(fewer|less|more|unequal|not equal|differ|!=|mismatch|p\s*-\s*k|p\s*\+\s*k)/.test(t) &&
      /(not in|outside|not belong|not part|isn't in|is not a member|∉)/.test(t)
  },
  {
    id: 'everySplit',
    label: 'Says the reasoning covers every legal decomposition',
    hint: 'State that this works for every legal split (every x, y, z with |y| ≥ 1 and |xy| ≤ p), not only one example.',
    test: (t) =>
      /((every|all|any|each)\s+(possible\s+|legal\s+|valid\s+)?(decomposition|split|division|way|choice)s?)|(no matter (how|which|where))|(regardless of (how|which|where))|(for (any|every|all) (legal|valid|possible))/.test(t)
  }
];

export const SAMPLE_PROOF =
  "Assume L = {aⁿbⁿ} is regular with pumping length p. Let w = aᵖbᵖ. " +
  "Since |xy| ≤ p, x and y lie in the first p characters, which are all a's, so y contains only a's. " +
  "Since |y| ≥ 1, y has at least one a. " +
  "Pump with i = 0 and remove y. " +
  "The new string has fewer a's than b's, so it is not in L. " +
  "This works for every legal decomposition of w, so we have a contradiction and L is not regular.";

export const checkProof = (text) => {
  const t = normalise(text || '');
  const items = RULES.map((r) => ({ id: r.id, label: r.label, hint: r.hint, ok: r.test(t) }));
  const complete = items.every((i) => i.ok);
  return { items, complete, missing: items.filter((i) => !i.ok) };
};
