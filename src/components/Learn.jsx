import React, { useState } from 'react';
import '../styles/Learn.css';

export default function Learn() {
  const [expandedTerm, setExpandedTerm] = useState(null);

  const terms = [
    {
      id: 'regular-language',
      title: 'Regular Language',
      simple: 'A language that can be recognized by a simple machine (finite automaton).',
      detail: 'Regular languages are the simplest class of formal languages in the Chomsky hierarchy.'
    },
    {
      id: 'string',
      title: 'String',
      simple: 'A sequence of symbols from an alphabet.',
      detail: 'Example: "aaabbb" is a string over the alphabet {a, b}. The empty string ε is also a valid string.'
    },
    {
      id: 'alphabet',
      title: 'Alphabet',
      simple: 'A set of allowed symbols.',
      detail: 'Example: {0, 1}, {a, b}, {a, b, c}. All strings in a language use only symbols from the alphabet.'
    },
    {
      id: 'language',
      title: 'Language',
      simple: 'A set of strings over an alphabet.',
      detail: 'Example: The language {aⁿbⁿ} contains strings like "", "ab", "aabb", "aaabbb", etc.'
    },
    {
      id: 'pumping-length',
      title: 'Pumping Length p',
      simple: 'A positive number that tells us how long a string must be to apply the Pumping Lemma.',
      detail: 'The Pumping Lemma guarantees that every regular language has such a p where all strings of length ≥ p can be decomposed.'
    },
    {
      id: 'w',
      title: 'w (the witness string)',
      simple: 'The long string we choose and then split into x, y and z.',
      detail: 'Example: for {aⁿbⁿ} with p = 3 we choose w = aaabbb. It must be in L and have length at least p.'
    },
    {
      id: 'x',
      title: 'x',
      simple: 'The first part of the decomposition. Can be empty.',
      detail: 'In w = xyz, x is the prefix. |xy| ≤ p ensures x and y stay within the first p symbols.'
    },
    {
      id: 'y',
      title: 'y',
      simple: 'The middle part that we pump by repeating or removing it.',
      detail: 'In w = xyz, y must be non-empty (|y| ≥ 1) and is the only part that changes during pumping.'
    },
    {
      id: 'z',
      title: 'z',
      simple: 'The final part of the decomposition. Can be empty.',
      detail: 'In w = xyz, z is the suffix. It remains unchanged during pumping.'
    },
    {
      id: 'pumping',
      title: 'Pumping',
      simple: 'Repeating or removing the middle part y.',
      detail: 'We create new strings: xy⁰z, xy¹z, xy²z, xy³z, etc. by changing how many times y appears.'
    },
    {
      id: 'pumping-value',
      title: 'Pumping Value i',
      simple: 'How many times we repeat y in xyⁱz.',
      detail: 'i = 0 means removing y entirely. i = 1 is the original string. i = 2, 3, ... repeat y multiple times.'
    },
    {
      id: 'decomposition',
      title: 'Decomposition',
      simple: 'A way to split a string into parts w = xyz satisfying the conditions.',
      detail: 'Different decompositions exist for the same string. A formal proof must show all legal decompositions fail.'
    },
    {
      id: 'contradiction',
      title: 'Contradiction',
      simple: 'When our result clashes with our starting assumption.',
      detail: 'If EVERY legal split gives a pumped string that is NOT in L, this contradicts the assumption that L is regular. One failed split is not enough.'
    }
  ];

  return (
    <div className="page-learn">
      <div className="container">
        {/* What is the Pumping Lemma */}
        <section className="learn-intro">
          <h1>Understanding the Pumping Lemma</h1>
          
          <div className="intro-box">
            <h2>What is the Pumping Lemma?</h2>
            <p>
              If a language is <strong>regular</strong>, then sufficiently long strings in that language can be divided into x, y and z so that the middle part y can be removed or repeated while staying in the language.
            </p>
            <div className="formula">
              <p><strong>w = xyz</strong></p>
              <p><strong>xyⁱz ∈ L</strong> for all <strong>i ≥ 0</strong></p>
            </div>
            <p className="intro-note">
              The Pumping Lemma is a <strong>necessary</strong> condition for regularity. It's mainly used to <strong>prove that a language is NOT regular</strong> by finding a contradiction.
            </p>
          </div>
        </section>

        {/* Important Terms */}
        <section className="terms-section">
          <h2>Important Terms</h2>
          <div className="terms-grid">
            {terms.map(term => (
              <div 
                key={term.id}
                className="term-card"
                onClick={() => setExpandedTerm(expandedTerm === term.id ? null : term.id)}
              >
                <h3>{term.title}</h3>
                <p className="term-simple">{term.simple}</p>
                {expandedTerm === term.id && (
                  <div className="term-detail">
                    <p>{term.detail}</p>
                  </div>
                )}
                <div className="term-toggle">
                  {expandedTerm === term.id ? '−' : '+'}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Three Conditions */}
        <section className="conditions-section">
          <h2>The 3 Conditions</h2>
          <p className="conditions-intro">
            Any valid decomposition w = xyz must satisfy all three conditions:
          </p>
          
          <div className="conditions-grid">
            <div className="condition-card">
              <div className="condition-number">01</div>
              <h3>y must not be empty</h3>
              <div className="condition-formula">|y| ≥ 1</div>
              <p>y must contain at least one symbol.</p>
            </div>

            <div className="condition-card">
              <div className="condition-number">02</div>
              <h3>y must occur within the first p symbols</h3>
              <div className="condition-formula">|xy| ≤ p</div>
              <p>The boundary between y and z must be at or before position p.</p>
            </div>

            <div className="condition-card">
              <div className="condition-number">03</div>
              <h3>Pumping must remain in the language</h3>
              <div className="condition-formula">xyⁱz ∈ L for all i ≥ 0</div>
              <p>Every pumped version must be in L to avoid contradiction.</p>
            </div>
          </div>

          <div className="conditions-example">
            <h4>Example: w = aaabbb with p = 3</h4>
            <div className="example-decomp">
              <span className="part x-part">a</span>
              <span className="part y-part">aa</span>
              <span className="part z-part">bbb</span>
            </div>
            <p>✓ |y| = 2, so y is not empty.</p>
            <p>✓ |xy| = 3 ≤ p = 3, so x and y fit in the first p characters.</p>
            <p>✗ i = 0 gives abbb, which is not in L. Condition 3 fails for this split.</p>
          </div>
        </section>

        {/* How to Solve */}
        <section className="howto-section">
          <h2>How to Solve a Pumping Lemma Problem</h2>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Assume L is regular</h3>
              <p>To prove by contradiction, we start by assuming the language is regular.</p>
              <p className="step-detail">Then, a pumping length p must exist.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Choose a suitable string</h3>
              <p>Select a string w ∈ L with |w| ≥ p.</p>
              <p className="step-detail">Choose one that highlights the language's defining property.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Consider every split</h3>
              <p>Any split w = xyz must obey:</p>
              <p className="step-detail">|y| ≥ 1 and |xy| ≤ p</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Pump y</h3>
              <p>For each split, make pumped strings:</p>
              <p className="step-detail">xy⁰z, xy¹z, xy²z, xy³z, ...</p>
            </div>

            <div className="step-card">
              <div className="step-number">5</div>
              <h3>Find a contradiction</h3>
              <p>Show that for EVERY legal split, some xyⁱz ∉ L.</p>
              <p className="step-detail">Then L is NOT regular.</p>
            </div>
          </div>
        </section>

        {/* Important Rule */}
        <section className="important-rule">
          <h2>⚠️ Important Logic Rule</h2>
          <div className="rule-box">
            <p className="rule-correct">
              ✓ <strong>CORRECT:</strong> "Pumping causes a contradiction, so the language is not regular."
            </p>
            <p className="rule-correct">
              ✓ <strong>CORRECT:</strong> "No contradiction was found for this tested split. This does NOT prove that the language is regular."
            </p>
            <p className="rule-wrong">
              ✗ <strong>INCORRECT:</strong> "The language passed pumping, therefore it is regular."
            </p>
            <hr />
            <p className="rule-note">
              In a formal non-regularity proof, we must show that <strong>every legal decomposition</strong> leads to a contradiction, not just one randomly chosen split.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
