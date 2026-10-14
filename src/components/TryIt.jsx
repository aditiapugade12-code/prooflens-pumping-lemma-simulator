import React, { useState, useEffect, useMemo } from 'react';
import { languages, validateString } from '../languages';
import { evaluateSplit, explainNonMembership, proofInfo, buildProofString, isProofString, MAX_PROOF_P } from '../pumpingLogic';
import { buildProofSteps, conclusionText } from '../proofSteps';
import StringVisualizer from './StringVisualizer';
import NonRegularityTest from './NonRegularityTest';
import ProofLens from './ProofLens';
import '../styles/TryIt.css';

const PUMP_MEANING = {
  0: 'remove y',
  1: 'keep y once (the original string)',
  2: 'repeat y twice',
  3: 'repeat y three times'
};

export default function TryIt({ initialState }) {
  const [selectedLanguageId, setSelectedLanguageId] = useState(initialState?.selectedLanguage || 'anbn');
  const [alphabet, setAlphabet] = useState(initialState?.alphabet || ['a', 'b']);
  const [testString, setTestString] = useState(initialState?.testString || 'aaabbb');
  const [p, setP] = useState(initialState?.p || 3);
  const [isCustomLang, setIsCustomLang] = useState(initialState?.isCustom || false);
  const [customRegex, setCustomRegex] = useState('');
  const [mode, setMode] = useState(initialState ? 'tester' : 'prooflens'); // 'prooflens' | 'tester' | 'nonregular'

  // Decomposition: |x| and |y| (y may be set to 0 or too long on purpose, to see INVALID)
  const [xLen, setXLen] = useState(0);
  const [yLen, setYLen] = useState(1);
  const [pumpValue, setPumpValue] = useState(2);

  const [stringError, setStringError] = useState('');
  const [pError, setPError] = useState('');

  const currentLanguage = isCustomLang ? null : languages[selectedLanguageId];
  const proof = isCustomLang ? null : proofInfo(selectedLanguageId);

  useEffect(() => {
    if (testString === '') { setStringError(''); return; }
    const v = validateString(testString, alphabet);
    setStringError(v.valid ? '' : v.error);
  }, [testString, alphabet]);

  useEffect(() => {
    if (p < 1) setPError('p must be at least 1');
    else if (testString.length < p) setPError(`String length (${testString.length}) must be ≥ p (${p})`);
    else setPError('');
  }, [p, testString]);

  // Real membership logic for whichever language is selected
  const check = useMemo(() => {
    if (isCustomLang) {
      return (str) => {
        try { return new RegExp(`^(?:${customRegex})$`).test(str); } catch (e) { return false; }
      };
    }
    return currentLanguage.check;
  }, [isCustomLang, customRegex, currentLanguage]);

  // Clamp decomposition to the current string
  const xEnd = Math.min(xLen, testString.length);
  const yL = Math.min(yLen, testString.length - xEnd);
  const x = testString.slice(0, xEnd);
  const y = testString.slice(xEnd, xEnd + yL);
  const z = testString.slice(xEnd + yL);

  const evaluation = useMemo(
    () => evaluateSplit({ check, w: testString, p, x, y, z }),
    [check, testString, p, x, y, z]
  );
  const { cond1, cond2, legal, wInL, rows, firstFailure, status } = evaluation;
  const inputsOk = !stringError && !pError;

  const selectedRow = rows.find((r) => r.i === pumpValue) || rows[0];
  const isProofW = !!proof && isProofString(selectedLanguageId, testString, p);

  // ---------- handlers ----------
  const handleLanguageChange = (e) => {
    const langId = e.target.value;
    setXLen(0); setYLen(1); setPumpValue(2);
    if (langId === 'custom') {
      setIsCustomLang(true);
      setAlphabet(['0', '1']);
      setTestString('');
      setP(1);
      setCustomRegex('');
    } else {
      setIsCustomLang(false);
      setSelectedLanguageId(langId);
      const lang = languages[langId];
      setAlphabet(lang.alphabet);
      setTestString(lang.recommendedTestString);
      setP(lang.recommendedP);
    }
  };

  const handleCustomRegexChange = (e) => {
    const regexStr = e.target.value;
    setCustomRegex(regexStr);
    try { new RegExp(regexStr); setStringError(''); }
    catch (err) { setStringError('Invalid regex: ' + err.message); }
  };

  const handleAlphabetChange = (e) => {
    const chars = [];
    for (const ch of e.target.value) {
      if (ch !== ' ' && ch !== ',' && ch !== '{' && ch !== '}') chars.push(ch);
    }
    setAlphabet([...new Set(chars)]);
  };

  const handlePChange = (e) => {
    const raw = parseInt(e.target.value, 10);
    if (proof) {
      // For aⁿbⁿ / 0ⁿ1ⁿ the example string aᵖbᵖ is built automatically
      const np = Math.min(MAX_PROOF_P, Math.max(1, raw || 1));
      setP(np);
      setTestString(buildProofString(selectedLanguageId, np));
    } else {
      setP(Math.max(1, raw || 1));
    }
  };

  const useProofString = () => setTestString(buildProofString(selectedLanguageId, p));
  const num = (v) => parseInt(v, 10) || 0;
  const handleXLen = (v) => setXLen(Math.max(0, Math.min(testString.length, num(v))));
  const handleYLen = (v) => setYLen(Math.max(0, Math.min(testString.length - xEnd, num(v))));

  const proofSteps = proof ? buildProofSteps(selectedLanguageId, p) : [];
  const langLabel = proof ? proof.label : '';

  // ---------- final result ----------
  const renderResult = () => {
    if (status === 'INVALID') {
      const reasons = [];
      if (!cond1) reasons.push('Condition 1 failed: y is empty. y must contain at least one character.');
      if (!cond2) reasons.push(`Condition 2 failed: x and y together have ${xEnd + yL} characters, but p = ${p}. They must not contain more than p characters.`);
      return (
        <div className="result-banner invalid" role="status">
          <div className="result-title">INVALID DECOMPOSITION</div>
          {reasons.map((r, k) => <p key={k}>{r}</p>)}
          <p>This split is not allowed by the Pumping Lemma, so it tells us nothing about whether the language is regular. Change x and y to a legal split to continue.</p>
        </div>
      );
    }

    if (status === 'W_NOT_IN_L') {
      return (
        <div className="result-banner warn" role="status">
          <div className="result-title">STRING IS NOT IN THE LANGUAGE</div>
          <p>The Pumping Lemma only applies to a string w that is in L. {explainNonMembership(isCustomLang ? 'custom' : selectedLanguageId, testString)}</p>
          <p>Choose a string that belongs to the language, then try again.</p>
        </div>
      );
    }

    if (status === 'COND3_FAILED') {
      return (
        <>
          <div className="result-banner failed" role="status">
            <div className="result-title">CONDITION 3 FAILED FOR THIS TEST</div>
            <p>With i = {firstFailure.i} ({PUMP_MEANING[firstFailure.i]}), the pumped string is:</p>
            <div className="result-string"><code>{firstFailure.pumped === '' ? 'ε (empty)' : firstFailure.pumped}</code></div>
            <p>It does not belong to the language. {explainNonMembership(isCustomLang ? 'custom' : selectedLanguageId, firstFailure.pumped)}</p>
            <p>The pumping value that caused the failure is <strong>i = {firstFailure.i}</strong>.</p>
          </div>

          {proof && isProofW && (
            <>
              <section className="proof-panel">
                <h4>The complete proof for {langLabel}</h4>
                <p className="section-note">
                  This split failed, but one split is only an example. The proof below does not depend on which split was chosen:
                  it covers <strong>every</strong> legal split of {proof.A}ᵖ{proof.B}ᵖ, because x and y are always inside the block of {proof.A}'s.
                </p>
                <ol className="proof-panel-steps">
                  {proofSteps.map((st, idx) => (
                    <li key={idx}><strong>{st.title}.</strong> {st.text}</li>
                  ))}
                </ol>
              </section>
              <div className="result-banner not-regular" role="status" aria-live="polite">
                <div className="result-title big">LANGUAGE IS NOT REGULAR</div>
                <p className="result-sub">{conclusionText(selectedLanguageId)}</p>
                <p>Why? Pumping the selected portion changes the required pattern of the language. The resulting string violates the language rule, contradicting the Pumping Lemma.</p>
              </div>
            </>
          )}

          {proof && !isProofW && (
            <div className="result-note">
              The formal proof for {langLabel} uses the string {proof.A}ᵖ{proof.B}ᵖ. Your string is different, so the proof is not shown for it.{' '}
              <button type="button" className="pump-btn" onClick={useProofString}>Use {proof.A}ᵖ{proof.B}ᵖ for p = {p}</button>
            </div>
          )}

          {!proof && (
            <div className="result-note">
              One failed split does not prove that a language is non-regular. The Pumping Lemma only needs <em>one</em> legal split to work, so a proof must show that <em>every</em> legal split fails.
              {' '}This tool contains a full proof only for {'{aⁿbⁿ | n ≥ 0}'} and {'{0ⁿ1ⁿ | n ≥ 0}'}.
            </div>
          )}
        </>
      );
    }

    if (status === 'ALL_PASSED') {
      return (
        <div className="result-banner passed" role="status">
          <div className="result-title">ALL TESTED CONDITIONS PASSED</div>
          <p>This split kept the string in the language for i = 0, 1, 2 and 3.</p>
          <p>Only those values were tested, so this does not prove anything by itself. Passing a few tests does <strong>not</strong> show that the language is regular.</p>
        </div>
      );
    }
    return null;
  };

  const cond3Tested = legal && wInL;
  const cond3Pass = cond3Tested && !firstFailure;

  return (
    <div className="page-tryit">
      <div className="container">
        <h1>Try the Pumping Lemma</h1>
        <p className="tryit-subtitle">Use ProofLens to test splits of aᵖbᵖ, or the other tools to explore more languages.</p>

        <div className="tryit-mode-switch" role="tablist" aria-label="Try It mode">
          <button type="button" role="tab" aria-selected={mode === 'prooflens'}
            className={`pump-btn ${mode === 'prooflens' ? 'active' : ''}`} onClick={() => setMode('prooflens')}>
            ProofLens
          </button>
          <button type="button" role="tab" aria-selected={mode === 'tester'}
            className={`pump-btn ${mode === 'tester' ? 'active' : ''}`} onClick={() => setMode('tester')}>
            Interactive Tester
          </button>
          <button type="button" role="tab" aria-selected={mode === 'nonregular'}
            className={`pump-btn ${mode === 'nonregular' ? 'active' : ''}`} onClick={() => setMode('nonregular')}>
            Non-Regularity Test
          </button>
        </div>

        {mode === 'prooflens' ? (
          <ProofLens />
        ) : mode === 'nonregular' ? (
          <NonRegularityTest />
        ) : (
        <div className="tryit-grid">
          {/* Left Column: Inputs */}
          <div className="tryit-inputs">
            <section className="input-section">
              <h3>1. Select Language</h3>
              <select value={isCustomLang ? 'custom' : selectedLanguageId} onChange={handleLanguageChange}>
                <option value="anbn">{'{aⁿbⁿ | n ≥ 0}'} (Non-Regular) ★</option>
                <option value="zeroNOneN">{'{0ⁿ1ⁿ | n ≥ 0}'} (Non-Regular) ★</option>
                <option value="evenZeros">Even number of 0s (Regular)</option>
                <option value="endsIn01">Strings ending in 01 (Regular)</option>
                <option value="alternating01">(01)* (Regular)</option>
                <option value="zeroStarOneStar">0*1* (Regular)</option>
                <option value="aStarBStar">a*b* (Regular)</option>
                <option value="wcw">wcw (Non-Regular)</option>
                <option value="anb2n">{'{aⁿb²ⁿ | n ≥ 0}'} (Non-Regular)</option>
                <option value="palindromes">Palindromes (Non-Regular)</option>
                <option value="primes">Length is Prime (Non-Regular)</option>
                <option value="powerOfTwo">Length is 2^n (Non-Regular)</option>
                <option value="custom">🔧 Custom Regex</option>
              </select>

              {isCustomLang && (
                <div className="custom-lang-section">
                  <p className="section-note">Enter a regular expression pattern:</p>
                  <input type="text" placeholder="e.g., 0*1* or a+b+ or (01)+" value={customRegex}
                    onChange={handleCustomRegexChange} className="regex-input" />
                  <p className="regex-help">Examples: <code>0*1*</code> | <code>a+b+</code> | <code>(01)+</code> | <code>[01]*0</code></p>
                  {customRegex && !stringError && <p className="success-msg">✓ Valid regex pattern</p>}
                  {stringError && <p className="error">{stringError}</p>}
                </div>
              )}

              {currentLanguage && (
                <div className="lang-info">
                  <p><strong>Definition:</strong> {currentLanguage.definition}</p>
                  <p><strong>Description:</strong> {currentLanguage.description}</p>
                  <p><strong>Why:</strong> {currentLanguage.why}</p>
                </div>
              )}
            </section>

            <section className="input-section">
              <h3>2. Set Alphabet</h3>
              <input type="text" placeholder="e.g., a,b or 0,1" value={alphabet.join(', ')} onChange={handleAlphabetChange} />
              <p className="input-note">Current alphabet: {'{' + alphabet.join(', ') + '}'}</p>
            </section>

            <section className="input-section">
              <h3>3. Set Pumping Length p</h3>
              <input type="number" value={p} onChange={handlePChange} min="1" max={proof ? MAX_PROOF_P : undefined} />
              {pError && <p className="error">{pError}</p>}
              <p className="input-note">
                p = {p}, string length = {testString.length}.
                {proof && ` The example string ${proof.A}ᵖ${proof.B}ᵖ is built for you automatically (p up to ${MAX_PROOF_P}).`}
              </p>
            </section>

            <section className="input-section">
              <h3>4. Test String w</h3>
              <input type="text" value={testString} onChange={(e) => setTestString(e.target.value)} placeholder="e.g., aaabbb" />
              {stringError && <p className="error">{stringError}</p>}
              {proof && !isProofW && (
                <p className="input-note">
                  This is not {proof.A}ᵖ{proof.B}ᵖ. <button type="button" className="link-btn" onClick={useProofString}>Reset to {buildProofString(selectedLanguageId, p)}</button>
                </p>
              )}
              <div className="string-preview">
                <StringVisualizer string={testString || 'ε'} hideLabels={true} />
              </div>
              {testString && !stringError && (
                <p className="input-note">
                  {wInL ? '✓ w is in the language.' : '✗ w is NOT in the language (the lemma needs w ∈ L).'}
                </p>
              )}
            </section>
          </div>

          {/* Right Column: Decomposition & Results */}
          <div className="tryit-results">
            {inputsOk && (
              <>
                <section className="decomposition-section">
                  <h3>5. Split the String: w = x y z</h3>
                  <p className="section-note">Pick how many characters go into x and y. z is the rest.</p>

                  <div className="decomp-visual">
                    <StringVisualizer string={testString} x={x} y={y} z={z} />
                  </div>
                  <p className="color-legend">
                    <span className="lg lg-x" /> x &nbsp; <span className="lg lg-y" /> y (pumped) &nbsp; <span className="lg lg-z" /> z
                  </p>

                  <div className="decomp-controls">
                    <div className="control-pair">
                      <label htmlFor="xlen">|x| = {xEnd}</label>
                      <div className="range-row">
                        <input id="xlen" type="range" min="0" max={testString.length} value={xEnd} onChange={(e) => handleXLen(e.target.value)} />
                        <input type="number" className="mini-num" min="0" max={testString.length} value={xEnd} onChange={(e) => handleXLen(e.target.value)} aria-label="Length of x" />
                      </div>
                    </div>
                    <div className="control-pair">
                      <label htmlFor="ylen">|y| = {yL}</label>
                      <div className="range-row">
                        <input id="ylen" type="range" min="0" max={testString.length - xEnd} value={yL} onChange={(e) => handleYLen(e.target.value)} />
                        <input type="number" className="mini-num" min="0" max={testString.length - xEnd} value={yL} onChange={(e) => handleYLen(e.target.value)} aria-label="Length of y" />
                      </div>
                    </div>
                  </div>

                  <div className="decomp-display">
                    <p>x = <code>{x || '(empty)'}</code></p>
                    <p>y = <code>{y || '(empty)'}</code></p>
                    <p>z = <code>{z || '(empty)'}</code></p>
                  </div>

                  <div className="condition-check">
                    <h4>The three Pumping Lemma conditions</h4>
                    <div className={`condition-card ${cond1 ? 'pass' : 'fail'}`}>
                      <span className="badge">{cond1 ? 'PASS' : 'FAIL'}</span>
                      <div>
                        <strong>Condition 1: y must contain at least one character.</strong>
                        <div className="cond-why">{cond1 ? `|y| = ${yL}, so y is not empty.` : '|y| = 0. y is empty.'}</div>
                      </div>
                    </div>
                    <div className={`condition-card ${cond2 ? 'pass' : 'fail'}`}>
                      <span className="badge">{cond2 ? 'PASS' : 'FAIL'}</span>
                      <div>
                        <strong>Condition 2: x and y together must not contain more than p characters.</strong>
                        <div className="cond-why">|xy| = {xEnd + yL} and p = {p}, so {xEnd + yL} {cond2 ? '≤' : '>'} {p}.</div>
                      </div>
                    </div>
                    <div className={`condition-card ${!cond3Tested ? 'pending' : cond3Pass ? 'pass' : 'fail'}`}>
                      <span className="badge">{!cond3Tested ? 'NOT TESTED' : cond3Pass ? 'PASS' : 'FAIL'}</span>
                      <div>
                        <strong>Condition 3: After pumping y, the resulting string must remain in the selected language for every i ≥ 0.</strong>
                        <div className="cond-why">
                          {!legal && 'Not tested: fix Condition 1 and 2 first.'}
                          {legal && !wInL && 'Not tested: w itself is not in the language.'}
                          {cond3Tested && cond3Pass && 'Stayed in the language for i = 0, 1, 2, 3 (only these four values were tested).'}
                          {cond3Tested && !cond3Pass && `Left the language at i = ${firstFailure.i}.`}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {legal && rows.length > 0 && (
                  <section className="pumping-section">
                    <h3>6. Pump y and Check</h3>

                    <div className="pumping-controls">
                      <p>Select how many copies of y to use (i):</p>
                      <div className="pump-buttons">
                        {rows.map((r) => (
                          <button key={r.i} className={`pump-btn ${pumpValue === r.i ? 'active' : ''}`} onClick={() => setPumpValue(r.i)}>
                            i = {r.i}
                          </button>
                        ))}
                      </div>
                      <p className="pump-meaning">i = {selectedRow.i}: {PUMP_MEANING[selectedRow.i]}.</p>
                    </div>

                    <div className="decomp-visual">
                      <StringVisualizer string={selectedRow.pumped || 'ε'} x={selectedRow.pumped === '' ? null : x} y={y.repeat(selectedRow.i)} z={z} hideLabels={true} />
                    </div>
                    <div className={`pumped-verdict ${selectedRow.inLanguage ? 'yes' : 'no'}`}>
                      {selectedRow.inLanguage
                        ? `✓ xy${selectedRow.i}z is in the language.`
                        : `✗ xy${selectedRow.i}z is NOT in the language. ${explainNonMembership(isCustomLang ? 'custom' : selectedLanguageId, selectedRow.pumped)}`}
                    </div>

                    <div className="pumping-table">
                      <table>
                        <thead>
                          <tr><th>i</th><th>What it means</th><th>Resulting string</th><th>In language?</th></tr>
                        </thead>
                        <tbody>
                          {rows.map((r) => (
                            <tr key={r.i} className={pumpValue === r.i ? 'highlight' : ''}>
                              <td>{r.i}</td>
                              <td>{PUMP_MEANING[r.i]}</td>
                              <td><code>{r.pumped === '' ? 'ε' : r.pumped}</code></td>
                              <td className={r.inLanguage ? 'yes' : 'no'}>{r.inLanguage ? '✓ Yes' : '✗ No'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                <section className="final-result-section">
                  <h3>Result</h3>
                  {renderResult()}
                </section>
              </>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
