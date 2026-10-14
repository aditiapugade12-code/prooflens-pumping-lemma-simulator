// Pure logic for the Try It page (no React). Tested in tests/logic.test.mjs.
import { languages } from './languages.js';

export const MAX_PROOF_P = 20;

// Languages for which the app contains a complete, hand-written non-regularity proof.
// Both are of the form { A^n B^n | n >= 0 }.
export const PROOF_LANGS = {
  anbn: { A: 'a', B: 'b', label: '{aⁿbⁿ | n ≥ 0}' },
  zeroNOneN: { A: '0', B: '1', label: '{0ⁿ1ⁿ | n ≥ 0}' }
};

export const proofInfo = (langId) => PROOF_LANGS[langId] || null;

export const buildProofString = (langId, p) => {
  const info = PROOF_LANGS[langId];
  return info ? info.A.repeat(p) + info.B.repeat(p) : '';
};

// True only when w is exactly A^p B^p (the string used in the proof).
export const isProofString = (langId, w, p) =>
  !!PROOF_LANGS[langId] && w === buildProofString(langId, p);

export const pumpString = (x, y, z, i) => x + y.repeat(i) + z;

const count = (s, ch) => s.split(ch).length - 1;

// Plain-English reason why `str` is NOT in the language (null if it is, or unknown).
export const explainNonMembership = (langId, str) => {
  const shown = str === '' ? 'ε (empty string)' : `"${str}"`;
  switch (langId) {
    case 'anbn':
    case 'zeroNOneN': {
      const { A, B } = PROOF_LANGS[langId];
      const ca = count(str, A), cb = count(str, B);
      const sorted = new RegExp(`^${A}*${B}*$`).test(str);
      if (!sorted) return `${shown} has a ${B} before an ${A}, so it is not of the form ${A}…${A}${B}…${B}.`;
      return `${shown} has ${ca} ${A}'s and ${cb} ${B}'s. The language needs the two counts to be equal.`;
    }
    case 'anb2n': {
      const ca = count(str, 'a'), cb = count(str, 'b');
      return `${shown} has ${ca} a's and ${cb} b's. The language needs exactly twice as many b's as a's (and all a's first).`;
    }
    case 'evenZeros':
      return `${shown} has ${count(str, '0')} zeros, which is odd. The language needs an even number of 0s.`;
    case 'endsIn01':
      return `${shown} does not end with "01".`;
    case 'alternating01':
      return `${shown} is not made of repeated "01" blocks.`;
    case 'zeroStarOneStar':
      return `${shown} has a 0 after a 1. All 0s must come before all 1s.`;
    case 'aStarBStar':
      return `${shown} has an a after a b. All a's must come before all b's.`;
    case 'wcw':
      return `${shown} is not of the form w c w (exactly one c, with the same text on both sides).`;
    case 'palindromes':
      return `${shown} does not read the same backwards.`;
    case 'primes':
      return `${shown} has length ${str.length}, which is not a prime number.`;
    case 'powerOfTwo':
      return `${shown} has length ${str.length}, which is not a power of 2.`;
    default:
      return `${shown} does not match the language rule.`;
  }
};

/**
 * Evaluate one chosen split w = xyz.
 * check: (string) => boolean membership function of the language.
 * Returns status:
 *   'W_NOT_IN_L'    – w itself is not in L (lemma does not apply to w)
 *   'INVALID'       – condition 1 or 2 violated (says nothing about regularity)
 *   'COND3_FAILED'  – legal split, some tested i gives a string outside L
 *   'ALL_PASSED'    – legal split, every tested i stays in L
 */
export const evaluateSplit = ({ check, w, p, x, y, z, maxI = 3 }) => {
  const cond1 = y.length >= 1;
  const cond2 = x.length + y.length <= p;
  const legal = cond1 && cond2;
  const wInL = check(w);

  let rows = [];
  let firstFailure = null;
  if (legal) {
    for (let i = 0; i <= maxI; i++) {
      const pumped = pumpString(x, y, z, i);
      rows.push({ i, pumped, inLanguage: check(pumped) });
    }
    firstFailure = rows.find((r) => !r.inLanguage) || null;
  }

  let status;
  if (!legal) status = 'INVALID';
  else if (!wInL) status = 'W_NOT_IN_L';
  else status = firstFailure ? 'COND3_FAILED' : 'ALL_PASSED';

  return { cond1, cond2, legal, wInL, rows, firstFailure, status };
};
