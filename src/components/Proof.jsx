import React, { useState } from 'react';
import { PROOF_LANGS } from '../pumpingLogic';
import { buildProofSteps, conclusionText } from '../proofSteps';
import StringVisualizer from './StringVisualizer';
import ProofCheck from './ProofCheck';
import '../styles/Proof.css';

const symbolRows = (A, B) => [
  ['L', 'The language: the set of strings that are allowed.', `L = {ε, ${A}${B}, ${A}${A}${B}${B}, …}`],
  [`${A}ⁿ${B}ⁿ`, `n copies of ${A} followed by n copies of ${B}.`, `n = 3 gives ${A}${A}${A}${B}${B}${B}`],
  ['p', 'The pumping length: a number the lemma promises exists for a regular language.', 'p = 3'],
  ['w', 'The original string we pick to test.', `w = ${A}${A}${A}${B}${B}${B}`],
  ['x', 'The first part of w.', `x = ${A}`],
  ['y', 'The middle part: the part we pump (repeat or remove).', `y = ${A}`],
  ['z', 'The remaining part of w.', `z = ${A}${B}${B}${B}`],
  ['i', 'How many copies of y we use.', 'i = 2 means y appears twice'],
  ['|y| ≥ 1', 'y must not be empty.', `y = ${A} is fine, y = ε is not`],
  ['|xy| ≤ p', 'x and y together must fit inside the first p characters.', `With p = 3, x and y use at most the first 3 characters`],
  ['xyⁱz', 'The new string after pumping y i times.', `x = ${A}, y = ${A}, z = ${A}${B}${B}${B}: i = 2 gives ${A}${A}${A}${A}${B}${B}${B}`],
  ['Contradiction', 'The result conflicts with the assumption that the language is regular.', 'We assumed "regular", the pumped string breaks the rule, so the assumption is false']
];

export default function Proof() {
  const [langId, setLangId] = useState('anbn');
  const [p, setP] = useState(3);
  const [shown, setShown] = useState(1); // how many steps are revealed

  const { A, B, label } = PROOF_LANGS[langId];
  const steps = buildProofSteps(langId, p);
  const done = shown >= steps.length;
  const w = A.repeat(p) + B.repeat(p);
  const down = A.repeat(p - 1) + B.repeat(p);

  const changeLang = (id) => { setLangId(id); setShown(1); };
  const changeP = (v) => {
    const n = Math.min(10, Math.max(1, parseInt(v, 10) || 1));
    setP(n);
  };

  return (
    <div className="page-proof">
      <div className="container">
        <h1>Formal Non-Regularity Proof</h1>
        <p className="proof-intro">
          A step-by-step proof, in plain English, that {label} is NOT regular. Press “Show Me the Next Step” to reveal it one step at a time.
        </p>

        <div className="proof-selector">
          <button className={langId === 'anbn' ? 'active' : ''} onClick={() => changeLang('anbn')}>{'{aⁿbⁿ | n ≥ 0}'}</button>
          <button className={langId === 'zeroNOneN' ? 'active' : ''} onClick={() => changeLang('zeroNOneN')}>{'{0ⁿ1ⁿ | n ≥ 0}'}</button>
        </div>

        <div className="proof-layout">
          <div className="proof-main">
            <div className="proof-container">
              <div className="proof-header">
                <h2>{label}</h2>
                <p>Proof by contradiction using the Pumping Lemma</p>
                <label className="p-picker">
                  Pumping length p:{' '}
                  <input type="number" min="1" max="10" value={p} onChange={(e) => changeP(e.target.value)} />
                </label>
              </div>

              <div className="proof-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(shown / steps.length) * 100}%` }}></div>
                </div>
                <p className="progress-text">Step {shown} of {steps.length}</p>
              </div>

              {steps.slice(0, shown).map((st, idx) => (
                <div key={idx} className={`proof-step ${idx === shown - 1 ? 'current' : ''}`}>
                  <div className="step-number">{idx + 1}</div>
                  <div className="step-content">
                    <h3>STEP {idx + 1} — {st.title}</h3>
                    <p className="step-quote">“{st.text}”</p>
                    <dl className="step-detail">
                      <dt>What we are doing</dt><dd>{st.what}</dd>
                      <dt>Why we are doing it</dt><dd>{st.why}</dd>
                      <dt>What happens to the string</dt><dd>{st.string}</dd>
                      <dt>What the result means</dt><dd>{st.meaning}</dd>
                    </dl>
                  </div>
                </div>
              ))}

              <div className="proof-controls">
                <button className="btn btn-secondary" onClick={() => setShown(Math.max(1, shown - 1))} disabled={shown <= 1}>← Back</button>
                <button className="btn btn-primary" onClick={() => setShown(shown + 1)} disabled={done}>Show Me the Next Step →</button>
                <button className="btn btn-secondary" onClick={() => setShown(steps.length)} disabled={done}>Show All</button>
                <button className="btn btn-secondary" onClick={() => setShown(1)} disabled={shown === 1}>Restart</button>
              </div>

              {done && (
                <div className="proof-final" role="status" aria-live="polite">
                  <div className="proof-final-label">FINAL CONCLUSION</div>
                  <div className="proof-final-title">{conclusionText(langId)}</div>
                  <p>
                    This is not just one lucky split. Steps 3 to 6 show that <strong>every</strong> legal split
                    (|y| ≥ 1 and |xy| ≤ p) puts y inside the block of {A}'s, and pumping y then breaks the
                    equal-count rule. The lemma needs at least one split that survives, and none does.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="proof-side">
            <div className="example-card-proof">
              <h3>Example with p = 3</h3>
              <p className="side-note">Only an illustration. The general argument in Steps 3 to 7 is what proves the result for all legal splits.</p>
              <div className="ex-line"><span>Original:</span></div>
              <StringVisualizer string={A.repeat(3) + B.repeat(3)} x="" y={A} z={A.repeat(2) + B.repeat(3)} hideLabels={true} />
              <div className="ex-line"><span>After pumping down one {A} (i = 0):</span></div>
              <StringVisualizer string={A.repeat(2) + B.repeat(3)} hideLabels={true} />
              <p className="ex-result">
                <strong>Not in the language</strong> because there are two {A}'s and three {B}'s.
              </p>
              {p !== 3 && (
                <p className="side-note">For your p = {p}: {w} becomes {down} (not in L).</p>
              )}
            </div>
          </aside>
        </div>

        <section className="symbols-panel">
          <h3>Understand the Symbols</h3>
          <p className="side-note">Each symbol is explained in words first, with an example from {A}{A}{A}{B}{B}{B} (p = 3).</p>
          <div className="symbols-table-wrap">
            <table className="symbols-table">
              <thead><tr><th>Symbol</th><th>In plain English</th><th>Example</th></tr></thead>
              <tbody>
                {symbolRows(A, B).map(([sym, meaning, ex]) => (
                  <tr key={sym}>
                    <td><code>{sym}</code></td>
                    <td>{meaning}</td>
                    <td>{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ProofCheck />
      </div>
    </div>
  );
}
