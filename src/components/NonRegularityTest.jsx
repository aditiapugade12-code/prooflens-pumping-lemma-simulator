import React, { useState } from 'react';
import StringVisualizer from './StringVisualizer';
import '../styles/TryIt.css';
import '../styles/NonRegularityTest.css';

/*
 * Non-Regularity Test
 * -------------------
 * A guided, general proof that L = {aⁿbⁿ | n ≥ 0} (or {0ⁿ1ⁿ | n ≥ 0}) is NOT regular.
 *
 * The conclusion shown to the user comes from the hand-written mathematical argument
 * (it works for every p and every legal split). Everything computed in the browser
 * (the worked example, the table, the "sanity check") only ILLUSTRATES that argument.
 * This component never claims to decide regularity for arbitrary languages.
 */

const MAX_P = 20; // keeps strings readable (|w| = 2p ≤ 40, pumped strings ≤ 60)

const LANGS = {
  anbn: { a: 'a', b: 'b', label: '{aⁿbⁿ | n ≥ 0}' },
  zeroOne: { a: '0', b: '1', label: '{0ⁿ1ⁿ | n ≥ 0}' }
};

// Real membership test for {Aⁿ Bⁿ | n ≥ 0}
function inLanguage(str, A, B) {
  let n = 0;
  while (str[n] === A) n++;
  return str.length === 2 * n && str.slice(n) === B.repeat(n);
}

const countOf = (str, ch) => str.split(ch).length - 1;
const pump = (x, y, z, i) => x + y.repeat(i) + z;

function parseP(raw) {
  const t = raw.trim();
  if (t === '') return { error: 'Please enter a value for p.' };
  if (!/^[+-]?\d+$/.test(t)) return { error: 'p must be a whole number (no decimals, letters or symbols).' };
  const n = Number(t);
  if (n < 1) return { error: 'p must be at least 1.' };
  if (n > MAX_P) return { error: `p must be at most ${MAX_P} so the strings stay readable.` };
  return { value: n };
}

export default function NonRegularityTest() {
  const [langId, setLangId] = useState('anbn');
  const [pRaw, setPRaw] = useState('4');
  const [sRaw, setSRaw] = useState(0); // |x| for the worked example
  const [kRaw, setKRaw] = useState(1); // |y| for the worked example
  const [pumpI, setPumpI] = useState(2);

  const { a: A, b: B, label } = LANGS[langId];
  const parsed = parseP(pRaw);
  const valid = parsed.value !== undefined;
  const p = parsed.value;

  let content = null;

  if (valid) {
    const w = A.repeat(p) + B.repeat(p);

    // Worked example: clamp so the chosen split is always LEGAL (|y| ≥ 1, |xy| ≤ p)
    const s = Math.min(sRaw, p - 1);
    const k = Math.max(1, Math.min(kRaw, p - s));
    const x = w.slice(0, s);
    const y = w.slice(s, s + k);
    const z = w.slice(s + k);
    const pumped = pump(x, y, z, pumpI);
    const pumpedIn = inLanguage(pumped, A, B);

    // Computational sanity check for THIS p only (not the proof)
    let total = 0;
    let failing = 0;
    for (let sx = 0; sx < p; sx++) {
      for (let ky = 1; ky <= p - sx; ky++) {
        total++;
        const px = w.slice(0, sx);
        const py = w.slice(sx, sx + ky);
        const pz = w.slice(sx + ky);
        if (!inLanguage(pump(px, py, pz, 2), A, B)) failing++;
      }
    }

    const sup = (t) => <sup>{t}</sup>;
    const Wform = (
      <span className="nrt-math">{A}{sup('p')}{B}{sup('p')}</span>
    );

    const steps = [
      {
        title: 'Assume L is regular',
        body: (
          <>
            Suppose, for contradiction, that L = {label} is regular. Then the Pumping Lemma gives a
            pumping length <strong>p ≥ 1</strong>. The argument below works for <em>any</em> p; here we
            use p = {p} to make it concrete.
          </>
        )
      },
      {
        title: 'Choose w = ' + A + 'ᵖ' + B + 'ᵖ',
        body: (
          <>
            Take w = {Wform} = <code>{w}</code>. It is in L (equal numbers of {A}'s and {B}'s) and
            |w| = 2p = {2 * p} ≥ p, so the lemma applies to it.
          </>
        )
      },
      {
        title: 'x and y lie inside the first p symbols',
        body: (
          <>
            Any legal split w = xyz has |xy| ≤ p. The first p symbols of w are all {A}'s, so x and y
            contain only {A}'s: x = {A}{sup('s')}, y = {A}{sup('k')}, with s ≥ 0, k ≥ 1 and s + k ≤ p.
            Then z = {A}{sup('p−s−k')}{B}{sup('p')}.
          </>
        )
      },
      {
        title: 'y is not empty',
        body: (
          <>
            Since |y| ≥ 1, we have <strong>k ≥ 1</strong>: y contains one or more {A}'s.
          </>
        )
      },
      {
        title: 'Pump y with i = 2 (or i = 0)',
        body: (
          <>
            For i = 2: xy²z = {A}{sup('p+k')}{B}{sup('p')}. For i = 0: xz = {A}{sup('p−k')}{B}{sup('p')}.
            Only the number of {A}'s changes; the number of {B}'s stays p.
          </>
        )
      },
      {
        title: 'The counts become unequal, so the string is not in L',
        body: (
          <>
            With i = 2 there are p + k {A}'s but p {B}'s, and p + k ≠ p because k ≥ 1. With i = 0 there
            are p − k {A}'s but p {B}'s, and p − k ≠ p. Either way the pumped string is
            <strong> not in L</strong>.
          </>
        )
      },
      {
        title: 'This holds for every legal decomposition',
        key: true,
        body: (
          <>
            The reasoning used only that x and y lie in the block of {A}'s and that k ≥ 1. It never
            depended on how long x is, how long y is, or where they sit inside the first p symbols.
            So <strong>every</strong> legal split of w fails when pumped, and the argument is valid for
            every p.
          </>
        )
      },
      {
        title: 'Contradiction',
        key: true,
        body: (
          <>
            The lemma promises that <em>some</em> legal split keeps xyⁱz in L for all i ≥ 0. We showed no
            legal split does. This contradicts our assumption, so L = {label} is not regular.
          </>
        )
      }
    ];

    content = (
      <>
        {/* The test string */}
        <section className="input-section">
          <h3>Test string w = {A}ᵖ{B}ᵖ</h3>
          <div className="string-preview">
            <StringVisualizer string={w} x={A.repeat(p)} y="" z={B.repeat(p)} hideLabels={true} />
          </div>
          <p className="input-note">
            w = <code>{w}</code> &nbsp;|&nbsp; p = {p} &nbsp;|&nbsp; |w| = {w.length}
          </p>
          <p className="nrt-legend">
            <span className="nrt-dot nrt-dot-x" /> first p symbols (all {A}'s)
            <span className="nrt-dot nrt-dot-z" /> last p symbols (all {B}'s)
          </p>
        </section>

        {/* Step by step proof */}
        <section className="input-section">
          <h3>Step-by-step proof</h3>
          <ol className="nrt-steps">
            {steps.map((st, idx) => (
              <li key={idx} className={`nrt-step ${st.key ? 'key' : ''}`}>
                <div className="nrt-step-num">{idx + 1}</div>
                <div className="nrt-step-body">
                  <h4>{st.title}</h4>
                  <p>{st.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* One concrete legal split */}
        <section className="input-section">
          <h3>Illustration: one legal split of your choice</h3>
          <p className="section-note">
            Only legal splits are offered (|y| ≥ 1 and |xy| ≤ p). This is a single example of the
            argument above, not the proof itself.
          </p>

          <div className="decomp-visual">
            <StringVisualizer string={w} x={x} y={y} z={z} />
          </div>

          <div className="decomp-controls">
            <div className="control-pair">
              <label htmlFor="nrt-s">|x| = {s}</label>
              <input
                id="nrt-s"
                type="range"
                min="0"
                max={p - 1}
                value={s}
                onChange={(e) => setSRaw(Number(e.target.value))}
              />
            </div>
            <div className="control-pair">
              <label htmlFor="nrt-k">|y| = {k}</label>
              <input
                id="nrt-k"
                type="range"
                min="1"
                max={p - s}
                value={k}
                onChange={(e) => setKRaw(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="condition-check">
            <div className="condition pass">✓ |y| ≥ 1 (|y| = {k})</div>
            <div className="condition pass">✓ |xy| ≤ p ({s + k} ≤ {p})</div>
          </div>

          <div className="pumping-controls">
            <p>Pump y:</p>
            <div className="pump-buttons">
              {[0, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`pump-btn ${pumpI === i ? 'active' : ''}`}
                  onClick={() => setPumpI(i)}
                >
                  i = {i}
                </button>
              ))}
            </div>
          </div>

          <div className="decomp-visual">
            <StringVisualizer string={pumped} />
          </div>

          <div className="nrt-counts">
            <span>number of {A}'s: <strong>{countOf(pumped, A)}</strong></span>
            <span>number of {B}'s: <strong>{countOf(pumped, B)}</strong></span>
          </div>

          <div className={`verdict ${pumpedIn ? 'no-contradiction' : 'contradiction'}`}>
            <strong>{pumpedIn ? 'This pumped string is in L' : 'Pumping failed for this split'}</strong>
            <p>
              {pumpedIn
                ? 'This case does not happen for this language and a legal split.'
                : `xy${pumpI === 0 ? '⁰' : '²'}z is not in L because the numbers of ${A}'s and ${B}'s differ. This is one split; the proof above is what covers all of them.`}
            </p>
          </div>
        </section>

        {/* Why every split fails: indexed by |y| only, independent of |x| */}
        <section className="input-section">
          <h3>Why every split fails</h3>
          <p className="section-note">
            The counts depend only on k = |y|, not on where y sits. That is why the argument covers all
            legal splits at once.
          </p>
          <div className="pumping-table">
            <table>
              <thead>
                <tr>
                  <th>|y| = k</th>
                  <th>i = 0: {A}'s vs {B}'s</th>
                  <th>i = 2: {A}'s vs {B}'s</th>
                  <th>In L?</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: p }, (_, idx) => idx + 1).map((kk) => (
                  <tr key={kk} className={kk === k ? 'highlight' : ''}>
                    <td>{kk}</td>
                    <td>{p - kk} vs {p}</td>
                    <td>{p + kk} vs {p}</td>
                    <td className="no">✗ No (both)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="nrt-note">
            <strong>Computer sanity check (this p only, not the proof):</strong> for p = {p} there are{' '}
            {total} legal splits; {failing} of {total} produce a string outside L at i = 2. The
            non-regularity conclusion rests on the general argument above, which holds for every p.
          </p>
        </section>

        {/* Final result */}
        <section className="nrt-result" role="status" aria-live="polite">
          <div className="nrt-result-title">LANGUAGE IS NOT REGULAR</div>
          <p>
            L = {label} is not regular. If it were, the Pumping Lemma would force a legal split of{' '}
            {A}ᵖ{B}ᵖ that stays in L when y is repeated or removed. But every legal split puts y entirely
            among the {A}'s, so pumping changes the number of {A}'s while the number of {B}'s stays p.
            No legal split survives, which contradicts the lemma.
          </p>
          <p>
            In plain terms: a finite automaton has only finitely many states, so it cannot keep count of
            an unbounded number of {A}'s in order to match them with {B}'s.
          </p>
        </section>
      </>
    );
  }

  return (
    <div className="nrt">
      <section className="input-section">
        <h3>1. Select language</h3>
        <select
          value={langId}
          onChange={(e) => setLangId(e.target.value)}
          aria-label="Language for the non-regularity test"
        >
          <option value="anbn">{LANGS.anbn.label} (Non-Regular) ★</option>
          <option value="zeroOne">{LANGS.zeroOne.label} (Non-Regular)</option>
        </select>

        <h3 className="nrt-subhead">2. Choose pumping length p</h3>
        <input
          type="number"
          inputMode="numeric"
          min="1"
          max={MAX_P}
          step="1"
          value={pRaw}
          onChange={(e) => setPRaw(e.target.value)}
          aria-label="Pumping length p"
          aria-invalid={!valid}
        />
        {!valid && <p className="error">{parsed.error}</p>}
        <p className="input-note">Allowed: whole numbers from 1 to {MAX_P}.</p>
      </section>

      {valid ? (
        content
      ) : (
        <section className="input-section">
          <p className="section-note">Enter a valid p above to build w and see the proof.</p>
        </section>
      )}

      <p className="nrt-note nrt-scope">
        This page contains a hand-written proof for the two languages above. The program does not
        decide regularity for arbitrary languages, and the Interactive Tester remains a separate tool
        for experimenting with individual splits.
      </p>
    </div>
  );
}
