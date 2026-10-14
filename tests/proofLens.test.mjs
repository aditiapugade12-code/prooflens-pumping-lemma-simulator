import assert from 'node:assert/strict';
import {
  inAnBn, explainMembership, evaluateSplit, pump, witness, buildExplainSteps,
  checkProof, SAMPLE_PROOF, MISTAKE_OPTIONS
} from '../src/proofLens.js';

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log('PASS', name); };

test('membership: accepts aⁿbⁿ', () => {
  ['', 'ab', 'aabb', 'aaabbb', 'aaaabbbb'].forEach((s) => assert.ok(inAnBn(s), s));
});

test('membership: rejects wrong counts, wrong order, other symbols', () => {
  ['a', 'b', 'aab', 'abb', 'aabbb', 'ba', 'abab', 'bbaa', 'aabbab', 'abc', 'AB'].forEach((s) => assert.ok(!inAnBn(s), s));
});

test('membership is not decided by length: same length can be in or out', () => {
  assert.ok(inAnBn('aabb'));      // length 4, in L
  assert.ok(!inAnBn('aaab'));     // length 4, out
  assert.ok(!inAnBn('abab'));     // length 4, out (equal counts but wrong order)
  assert.ok(!inAnBn('aabbb'));    // odd length, out
});

test('explainMembership gives correct counts', () => {
  assert.match(explainMembership('aabbb'), /2 a's and 3 b's/);
  assert.match(explainMembership('abab'), /b before an a/);
  assert.match(explainMembership('aabb'), /is in L/);
});

test('witness and pump helpers', () => {
  assert.equal(witness(3), 'aaabbb');
  assert.equal(pump('a', 'b', 'c', 0), 'ac');
  assert.equal(pump('a', 'b', 'c', 3), 'abbbc');
});

const ev = (p, x, y, z) => evaluateSplit({ p, x, y, z });

test('valid split p=3 x=ε y=a z=aabbb: i=0..3 results', () => {
  const r = ev(3, '', 'a', 'aabbb');
  assert.equal(r.status, 'LEGAL');
  assert.deepEqual(r.rows.map((x) => x.pumped), ['aabbb', 'aaabbb', 'aaaabbb', 'aaaaabbb']);
  assert.deepEqual(r.rows.map((x) => x.inL), [false, true, false, false]);
});

test('invalid: x+y+z != w', () => {
  assert.equal(ev(3, '', 'a', 'abbb').status, 'BAD_SPLIT');
  assert.equal(ev(3, 'b', 'a', 'aabb').status, 'BAD_SPLIT');
});

test('invalid: empty y', () => {
  const r = ev(3, 'a', '', 'aabbb');
  assert.equal(r.status, 'EMPTY_Y');
  assert.equal(r.cond1, false);
  assert.equal(r.rows.length, 0);
});

test('invalid: |xy| > p', () => {
  const r = ev(3, 'aa', 'ab', 'bb');
  assert.equal(r.status, 'TOO_LONG');
  assert.equal(r.cond2, false);
  assert.equal(r.rows.length, 0);
});

test('invalid p', () => {
  assert.equal(ev(0, '', 'a', '').status, 'BAD_P');
  assert.equal(ev(NaN, '', 'a', '').status, 'BAD_P');
  assert.equal(ev(99, '', 'a', '').status, 'BAD_P');
});

test('EVERY legal split of aᵖbᵖ fails at i=0 and i=2, i=1 stays in L (p = 1..12)', () => {
  for (let p = 1; p <= 12; p++) {
    const w = witness(p);
    let legal = 0;
    for (let xl = 0; xl <= w.length; xl++) {
      for (let yl = 0; xl + yl <= w.length; yl++) {
        const r = ev(p, w.slice(0, xl), w.slice(xl, xl + yl), w.slice(xl + yl));
        if (r.status === 'LEGAL') {
          legal++;
          assert.equal(r.rows[0].inL, false, `p=${p} xl=${xl} yl=${yl} i=0`);
          assert.equal(r.rows[1].inL, true);
          assert.equal(r.rows[2].inL, false, `i=2`);
          assert.equal(r.rows[3].inL, false, `i=3`);
          // y is only a's, as the proof claims
          assert.ok(/^a+$/.test(w.slice(xl, xl + yl)));
        }
      }
    }
    assert.equal(legal, (p * (p + 1)) / 2);
  }
});

test('explain steps: 11 steps, adapts to p', () => {
  const s = buildExplainSteps(4);
  assert.equal(s.length, 11);
  assert.match(s[2].note, /aaaabbbb/);
});

test('Find the Mistake: exactly one correct option, and it is about every decomposition', () => {
  const right = MISTAKE_OPTIONS.filter((o) => o.correct);
  assert.equal(right.length, 1);
  assert.match(right[0].text, /every legal decomposition/);
});

test('checker: sample proof is complete', () => {
  const r = checkProof(SAMPLE_PROOF);
  assert.ok(r.complete, JSON.stringify(r.missing));
});

test('checker: the incomplete one-split argument is NOT complete', () => {
  const r = checkProof('I selected y = a, removed it, and got a string outside the language. Therefore, the language is not regular.');
  assert.equal(r.complete, false);
  assert.equal(r.items.find((i) => i.id === 'everySplit').ok, false);
  assert.equal(r.items.find((i) => i.id === 'witness').ok, false);
});

test('checker: empty / irrelevant text is incomplete', () => {
  assert.equal(checkProof('').complete, false);
  assert.equal(checkProof('banana').missing.length, 6);
});

test('checker: removing any single required idea makes it incomplete', () => {
  const sentences = SAMPLE_PROOF.split('. ');
  // drop each of the sentences that carry a required idea (index 1..5) one at a time
  for (let drop = 1; drop <= 5; drop++) {
    const text = sentences.filter((_, k) => k !== drop).join('. ');
    assert.equal(checkProof(text).complete, false, `dropping sentence ${drop} should break completeness`);
  }
});

test('checker accepts plain typing without special symbols', () => {
  const t = "Let w = a^p b^p. Because |xy| <= p, x and y are in the first p characters, so y has only a's. " +
    "|y| >= 1 so y is not empty. Remove y with i = 0. Now there are fewer a's than b's so the string is not in L. " +
    "This holds for every legal decomposition, a contradiction.";
  assert.ok(checkProof(t).complete);
});

console.log(`\n${passed} ProofLens tests passed`);
