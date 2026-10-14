import assert from 'node:assert/strict';
import { languages } from '../src/languages.js';
import { evaluateSplit, buildProofString, isProofString, pumpString, explainNonMembership } from '../src/pumpingLogic.js';

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log('PASS', name); };

const run = (langId, w, p, xl, yl) => evaluateSplit({
  check: languages[langId].check, w, p,
  x: w.slice(0, xl), y: w.slice(xl, xl + yl), z: w.slice(xl + yl)
});

test('a^n b^n p=3: proof string is aaabbb', () => {
  assert.equal(buildProofString('anbn', 3), 'aaabbb');
  assert.ok(isProofString('anbn', 'aaabbb', 3));
  assert.ok(!isProofString('anbn', 'aabb', 3));
});

test('a^n b^n membership', () => {
  const c = languages.anbn.check;
  ['', 'ab', 'aabb', 'aaabbb'].forEach((s) => assert.ok(c(s), s));
  ['a', 'b', 'ba', 'aab', 'abb', 'abab', 'aabbb', 'bbaa'].forEach((s) => assert.ok(!c(s), s));
});

test('0^n 1^n membership and proof string', () => {
  const c = languages.zeroNOneN.check;
  ['', '01', '0011', '000111'].forEach((s) => assert.ok(c(s), s));
  ['0', '1', '10', '001', '011', '0101'].forEach((s) => assert.ok(!c(s), s));
  assert.equal(buildProofString('zeroNOneN', 3), '000111');
});

test('EVERY legal split of a^p b^p fails (exhaustive, p = 1..15, both languages)', () => {
  for (const id of ['anbn', 'zeroNOneN']) {
    for (let p = 1; p <= 15; p++) {
      const w = buildProofString(id, p);
      let legalCount = 0;
      for (let xl = 0; xl <= w.length; xl++)
        for (let yl = 0; xl + yl <= w.length; yl++) {
          const r = run(id, w, p, xl, yl);
          if (r.legal) {
            legalCount++;
            assert.equal(r.status, 'COND3_FAILED', `${id} p=${p} |x|=${xl} |y|=${yl}`);
            assert.ok(!r.rows[0].inLanguage, 'i=0 should fail');
            assert.ok(!r.rows[2].inLanguage, 'i=2 should fail');
            assert.ok(r.rows[1].inLanguage, 'i=1 returns w, which is in L');
          }
        }
      assert.equal(legalCount, (p * (p + 1)) / 2); // |x|+|y| <= p, |y| >= 1
    }
  }
});

test('empty y is INVALID', () => {
  const r = run('anbn', 'aaabbb', 3, 1, 0);
  assert.equal(r.cond1, false);
  assert.equal(r.status, 'INVALID');
  assert.equal(r.rows.length, 0);
});

test('|xy| > p is INVALID', () => {
  const r = run('anbn', 'aaabbb', 3, 2, 2);
  assert.equal(r.cond1, true);
  assert.equal(r.cond2, false);
  assert.equal(r.status, 'INVALID');
});

test('failing split reports exact i and pumped string (aaabbb, x=ε, y=a)', () => {
  const r = run('anbn', 'aaabbb', 3, 0, 1);
  assert.equal(r.status, 'COND3_FAILED');
  assert.equal(r.firstFailure.i, 0);
  assert.equal(r.firstFailure.pumped, 'aabbb');
  assert.match(explainNonMembership('anbn', 'aabbb'), /2 a's and 3 b's/);
});

test('pumping helper: i=0 removes y, i=1 keeps, i=2 doubles, i=3 triples', () => {
  assert.equal(pumpString('a', 'b', 'c', 0), 'ac');
  assert.equal(pumpString('a', 'b', 'c', 1), 'abc');
  assert.equal(pumpString('a', 'b', 'c', 2), 'abbc');
  assert.equal(pumpString('a', 'b', 'c', 3), 'abbbc');
});

test('regular language (a*b*) uses its real rule and can pass all tests', () => {
  const r = run('aStarBStar', 'aaabbb', 3, 0, 1);
  assert.equal(r.status, 'ALL_PASSED');
  assert.ok(r.rows.every((x) => x.inLanguage));
});

test('regular language (even 0s) is not marked non-regular; failing split is only a failed test', () => {
  // w = 0011, y = "0" (x = ε): i=0 -> 011 has one 0 -> fails, but a different split works
  assert.equal(run('evenZeros', '0011', 3, 0, 1).status, 'COND3_FAILED');
  assert.equal(run('evenZeros', '0011', 3, 0, 2).status, 'ALL_PASSED');
});

test('string not in L is flagged, not treated as a pumping failure', () => {
  assert.equal(run('anbn', 'aab', 2, 0, 1).status, 'W_NOT_IN_L');
});

test('(01)* and ends-in-01 membership', () => {
  assert.ok(languages.alternating01.check('0101'));
  assert.ok(!languages.alternating01.check('010'));
  assert.ok(languages.endsIn01.check('1001'));
  assert.ok(!languages.endsIn01.check('1010'));
});

console.log(`\n${passed} tests passed`);
