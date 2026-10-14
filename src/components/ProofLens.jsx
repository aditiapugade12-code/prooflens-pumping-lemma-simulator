import React, { useState, useMemo } from 'react';
import { MAX_P, witness, evaluateSplit, buildExplainSteps, PUMP_MEANING, CONCLUSION } from '../proofLens';
import '../styles/ProofLens.css';

// Character boxes. Colours are paired with a letter label so meaning never depends on colour alone.
function Boxes({ parts }) {
  const chars = [];
  parts.forEach(({ text, kind }) => text.split('').forEach((c) => chars.push({ c, kind })));
  if (chars.length === 0) return <div className="pl-boxes"><span className="pl-empty">ε (empty string)</span></div>;
  return (
    <div className="pl-boxes" role="img" aria-label={chars.map((b) => b.c).join('')}>
      {chars.map((b, k) => (
        <span key={k} className={`pl-box ${b.kind || ''}`}>
          {b.c}
          {b.kind && <sub>{b.kind}</sub>}
        </span>
      ))}
    </div>
  );
}

const Check = ({ ok, pending, children, sub }) => (
  <li className={`pl-cond ${pending ? 'pending' : ok ? 'pass' : 'fail'}`}>
    <span className="pl-badge">{pending ? 'N/A' : ok ? 'PASS' : 'FAIL'}</span>
    <span><strong>{children}</strong>{sub && <small>{sub}</small>}</span>
  </li>
);

export default function ProofLens() {
  const [pRaw, setPRaw] = useState('4');
  const [x, setX] = useState('');
  const [y, setY] = useState('a');
  const [z, setZ] = useState('aaabbbb');
  const [i, setI] = useState(0);
  const [showWhy, setShowWhy] = useState(false);

  const p = /^\d+$/.test(pRaw.trim()) ? Number(pRaw.trim()) : NaN;
  const pOk = Number.isInteger(p) && p >= 1 && p <= MAX_P;
  const w = pOk ? witness(p) : '';
  const ev = useMemo(() => evaluateSplit({ p, x, y, z }), [p, x, y, z]);
  const row = ev.rows.find((r) => r.i === i);
  const legal = ev.status === 'LEGAL';

  const changeP = (v) => {
    setPRaw(v);
    const n = /^\d+$/.test(v.trim()) ? Number(v.trim()) : NaN;
    if (Number.isInteger(n) && n >= 1 && n <= MAX_P) {
      const ww = witness(n);
      setX(''); setY('a'); setZ(ww.slice(1)); // reset to a legal default split
    }
  };
  const onlyAB = (v) => v.replace(/[^ab]/g, '');
  const fillZ = () => {
    if (pOk && w.startsWith(x + y)) setZ(w.slice(x.length + y.length));
  };
  const preset = (xl, yl) => { setX(w.slice(0, xl)); setY(w.slice(xl, xl + yl)); setZ(w.slice(xl + yl)); setI(0); };

  // Colouring only when x+y+z really equals w
  const parts = ev.concatOk
    ? [{ text: x, kind: 'x' }, { text: y, kind: 'y' }, { text: z, kind: 'z' }]
    : [{ text: w, kind: '' }];

  const pumpedParts = row && [
    { text: x, kind: 'x' },
    { text: y.repeat(row.i), kind: 'y' },
    { text: z, kind: 'z' }
  ];

  const steps = pOk ? buildExplainSteps(p) : [];

  return (
    <div className="pl">
      <div className="pl-intro">
        <h2>ProofLens <span>Pumping Lemma Proof Debugger</span></h2>
        <p>
          Language: <strong>L = {'{aⁿbⁿ | n ≥ 0}'}</strong> (n a's followed by n b's). Pick p, split the witness
          string, and pump it. Then press <strong>Explain Why</strong> to see why a complete proof must handle <em>every</em> legal split.
        </p>
      </div>

      <div className="pl-grid">
        {/* LEFT: inputs */}
        <section className="pl-card">
          <h3>1. Choose p and the split</h3>
          <label className="pl-field">
            <span>Pumping length p (1 to {MAX_P})</span>
            <input type="number" min="1" max={MAX_P} value={pRaw} onChange={(e) => changeP(e.target.value)} aria-invalid={!pOk} />
          </label>
          {!pOk && <p className="pl-error">Enter a whole number from 1 to {MAX_P}.</p>}

          {pOk && (
            <>
              <p className="pl-line">Witness string <code>w = aᵖbᵖ = {w}</code> ({w.length} characters)</p>
              <Boxes parts={parts} />
              <p className="pl-legend">
                <span className="pl-sw x" />x <span className="pl-sw y" />y (pumped) <span className="pl-sw z" />z
              </p>

              <div className="pl-xyz">
                {[['x', x, setX], ['y', y, setY], ['z', z, setZ]].map(([name, val, set]) => (
                  <label key={name} className="pl-field">
                    <span>{name}</span>
                    <input type="text" value={val} spellCheck="false" autoComplete="off"
                      onChange={(e) => set(onlyAB(e.target.value))} aria-label={`String ${name}`} />
                  </label>
                ))}
              </div>
              <div className="pl-actions">
                <button type="button" className="btn btn-secondary btn-small" onClick={fillZ}>Fill z automatically</button>
                <button type="button" className="btn btn-secondary btn-small" onClick={() => preset(0, 1)}>Example: y = a</button>
                <button type="button" className="btn btn-secondary btn-small" onClick={() => preset(Math.min(1, p - 1), Math.max(1, Math.min(2, p - 1)))}>Example: y = aa</button>
                <button type="button" className="btn btn-secondary btn-small" onClick={() => preset(0, Math.min(p + 1, w.length))}>Try illegal: |xy| &gt; p</button>
              </div>

              <ul className="pl-conds">
                <Check ok={ev.concatOk} sub={ev.concatOk ? undefined : `x + y + z = "${x + y + z}", but w = "${w}". Type letters so that they join to make w.`}>
                  w = xyz
                </Check>
                <Check ok={ev.cond1} pending={!ev.concatOk} sub={`|y| = ${y.length}`}>y is not empty (|y| ≥ 1)</Check>
                <Check ok={ev.cond2} pending={!ev.concatOk} sub={`|xy| = ${x.length + y.length}, p = ${p}`}>x and y fit in the first p characters (|xy| ≤ p)</Check>
              </ul>
            </>
          )}
        </section>

        {/* RIGHT: pumping */}
        <section className="pl-card">
          <h3>2. Pump y</h3>
          {!pOk && <p className="pl-muted">Enter a valid p first.</p>}
          {pOk && !legal && (
            <div className="pl-note warn" role="status">
              {ev.status === 'BAD_SPLIT' && <p><strong>Not a decomposition of w.</strong> x, y and z must join to give exactly {w}.</p>}
              {ev.status === 'EMPTY_Y' && <p><strong>y is empty.</strong> Condition |y| ≥ 1 fails, so this split is not allowed and there is nothing to pump.</p>}
              {ev.status === 'TOO_LONG' && <p><strong>x and y use {x.length + y.length} characters, but p = {p}.</strong> Condition |xy| ≤ p fails, so this split is not allowed. An illegal split says nothing about regularity.</p>}
            </div>
          )}
          {legal && (
            <>
              <div className="pl-tabs" role="tablist" aria-label="Pumping value i">
                {[0, 1, 2, 3].map((n) => (
                  <button key={n} type="button" role="tab" aria-selected={i === n}
                    className={`pl-tab ${i === n ? 'active' : ''}`} onClick={() => setI(n)}>i = {n}</button>
                ))}
              </div>
              <p className="pl-line">
                <code>xy<sup>{i}</sup>z</code>: {PUMP_MEANING[i]}.
              </p>
              <Boxes parts={pumpedParts} />
              <div className={`pl-verdict ${row.inL ? 'pass' : 'fail'}`} role="status">
                <span className="pl-badge">{row.inL ? 'PASS' : 'FAIL'}</span>
                <span>
                  <strong>Condition 3 for i = {i}: {row.inL ? 'xyⁱz stays in L' : 'xyⁱz is NOT in L'}</strong>
                  <small>{row.reason}</small>
                </span>
              </div>

              <div className="pl-table-wrap">
                <table className="pl-table">
                  <thead><tr><th>i</th><th>String</th><th>In L?</th></tr></thead>
                  <tbody>
                    {ev.rows.map((r) => (
                      <tr key={r.i} className={r.i === i ? 'sel' : ''} onClick={() => setI(r.i)}>
                        <td>{r.i}</td>
                        <td><code>{r.pumped || 'ε'}</code></td>
                        <td className={r.inL ? 'yes' : 'no'}>{r.inL ? 'PASS' : 'FAIL'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {ev.rows.some((r) => !r.inL) ? (
                <p className="pl-note info">
                  This split failed for some i. That is only <strong>one</strong> decomposition, so it is not a proof yet.
                  Press <strong>Explain Why</strong> to see what a complete proof needs.
                </p>
              ) : (
                <p className="pl-note info">All four tests passed for this split. Passing a few tests proves nothing by itself.</p>
              )}
            </>
          )}

          {pOk && (
            <button type="button" className="btn btn-primary pl-why-btn" onClick={() => setShowWhy((s) => !s)} aria-expanded={showWhy}>
              {showWhy ? 'Hide explanation' : 'Explain Why'}
            </button>
          )}
        </section>
      </div>

      {pOk && showWhy && (
        <section className="pl-card pl-why" aria-live="polite">
          <h3>Why L = {'{aⁿbⁿ}'} is not regular (p = {p}, w = {w})</h3>
          <ol className="pl-steps">
            {steps.map((s, k) => (
              <li key={k} className={s.key ? 'key' : ''}>
                <strong>{s.text}</strong>
                <small>{s.note}</small>
              </li>
            ))}
          </ol>
          <div className="pl-conclusion" role="status">
            <div className="pl-conclusion-title">{CONCLUSION}</div>
            <p>
              The key is step 10. Whatever legal split is chosen, y is a non-empty block of a's, so pumping changes only the number of a's.
              No legal split survives, which contradicts the Pumping Lemma. Test your own wording on the Proof page.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
