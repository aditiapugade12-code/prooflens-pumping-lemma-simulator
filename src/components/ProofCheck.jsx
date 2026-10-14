import React, { useState } from 'react';
import {
  MISTAKE_STATEMENT, MISTAKE_QUESTION, MISTAKE_OPTIONS, MISTAKE_HINTS, MISTAKE_EXPLANATION,
  checkProof, SAMPLE_PROOF, CONCLUSION
} from '../proofLens';
import '../styles/ProofLens.css';

function FindTheMistake() {
  const [picked, setPicked] = useState(null);
  const [hints, setHints] = useState(0);
  const chosen = MISTAKE_OPTIONS.find((o) => o.id === picked);

  return (
    <section className="pl-card">
      <h3>Find the Mistake</h3>
      <blockquote className="pl-quote">“{MISTAKE_STATEMENT}”</blockquote>
      <p className="pl-line"><strong>{MISTAKE_QUESTION}</strong></p>

      <div className="pl-options" role="radiogroup" aria-label="Answer choices">
        {MISTAKE_OPTIONS.map((o) => {
          const state = picked === o.id ? (o.correct ? 'right' : 'wrong') : '';
          return (
            <button key={o.id} type="button" role="radio" aria-checked={picked === o.id}
              className={`pl-option ${state}`} onClick={() => setPicked(o.id)}>
              <span className="pl-letter">{o.id}</span>{o.text}
            </button>
          );
        })}
      </div>

      <div className="pl-actions">
        <button type="button" className="btn btn-secondary btn-small" disabled={hints >= MISTAKE_HINTS.length}
          onClick={() => setHints((h) => h + 1)}>
          {hints === 0 ? 'Show a hint' : 'Show another hint'}
        </button>
        <button type="button" className="btn btn-secondary btn-small" disabled={picked === null && hints === 0}
          onClick={() => { setPicked(null); setHints(0); }}>Reset</button>
      </div>
      {hints > 0 && (
        <ul className="pl-hints">{MISTAKE_HINTS.slice(0, hints).map((h, k) => <li key={k}>{h}</li>)}</ul>
      )}

      {chosen && (
        <div className={`pl-note ${chosen.correct ? 'good' : 'warn'}`} role="status">
          <p><strong>{chosen.correct ? 'Correct!' : 'Not quite.'}</strong> {chosen.correct ? '' : chosen.feedback}</p>
          {chosen.correct && <p>{MISTAKE_EXPLANATION}</p>}
        </div>
      )}
    </section>
  );
}

function ProofChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  return (
    <section className="pl-card">
      <h3>Check My Proof</h3>
      <p className="pl-muted">
        Write your own proof that {'{aⁿbⁿ | n ≥ 0}'} is not regular, in plain English. The checker looks for six required ideas.
        It only supports this one proof pattern. It cannot judge arbitrary languages or arbitrary proofs.
      </p>
      <textarea className="pl-textarea" rows={6} value={text} spellCheck="false"
        placeholder="Example: Let w = aᵖbᵖ. Since |xy| ≤ p, ..."
        onChange={(e) => { setText(e.target.value); setResult(null); }} aria-label="Your proof" />
      <div className="pl-actions">
        <button type="button" className="btn btn-primary btn-small" onClick={() => setResult(checkProof(text))}>Check My Proof</button>
        <button type="button" className="btn btn-secondary btn-small" onClick={() => { setText(SAMPLE_PROOF); setResult(null); }}>Insert a sample proof</button>
        <button type="button" className="btn btn-secondary btn-small" onClick={() => { setText(''); setResult(null); }}>Clear</button>
      </div>

      {result && (
        <>
          <ul className="pl-checklist">
            {result.items.map((it) => (
              <li key={it.id} className={it.ok ? 'ok' : 'missing'}>
                <span className="pl-badge">{it.ok ? 'FOUND' : 'MISSING'}</span>
                <span><strong>{it.label}</strong>{!it.ok && <small>{it.hint}</small>}</span>
              </li>
            ))}
          </ul>
          {result.complete ? (
            <div className="pl-conclusion" role="status" aria-live="polite">
              <div className="pl-complete">PROOF COMPLETE</div>
              <div className="pl-conclusion-title">{CONCLUSION}</div>
              <p>Your argument covers every legal decomposition of w = aᵖbᵖ, so the assumption that L is regular leads to a contradiction.</p>
            </div>
          ) : (
            <div className="pl-note warn" role="status">
              <p><strong>PROOF INCOMPLETE.</strong> {result.missing.length} of 6 required ideas {result.missing.length === 1 ? 'is' : 'are'} missing.
                A single failed pumping test is never a complete proof.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function ProofCheck() {
  return (
    <div className="pl pl-check">
      <div className="pl-intro">
        <h2>ProofLens <span>Check your reasoning</span></h2>
      </div>
      <div className="pl-grid">
        <FindTheMistake />
        <ProofChecker />
      </div>
    </div>
  );
}
