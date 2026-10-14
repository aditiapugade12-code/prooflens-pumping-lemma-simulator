import React from 'react';
import { languages } from '../languages';
import '../styles/Examples.css';

// The six curated languages shown on this page (definitions come from languages.js)
const FEATURED_IDS = ['anbn', 'evenZeros', 'endsIn01', 'alternating01', 'zeroStarOneStar', 'aStarBStar'];

export default function Examples({ setCurrentPage, setTryItState }) {
  const handleTry = (lang) => {
    // Pre-fills the Try It page (TryIt reads these fields from initialState)
    setTryItState({
      selectedLanguage: lang.id,
      alphabet: lang.alphabet,
      testString: lang.recommendedTestString,
      p: lang.recommendedP,
      isCustom: false
    });
    setCurrentPage('tryit');
  };

  return (
    <div className="page-examples">
      <div className="container">
        <h1>Language Library</h1>
        <p className="examples-intro">
          Six carefully chosen languages. One is non-regular and shows a contradiction; the others are regular.
        </p>

        <div className="examples-grid">
          {FEATURED_IDS.map((id) => {
            const lang = languages[id];
            const highlighted = id === 'anbn';
            return (
              <div key={id} className={`example-card ${highlighted ? 'highlighted' : ''}`}>
                <h3>{highlighted ? '★ ' : ''}{lang.name}</h3>
                <div className="example-def">{lang.definition}</div>
                <p className="example-desc">{lang.description}</p>

                <div className="example-section">
                  <strong>Strings in the language:</strong>
                  <div className="example-list">
                    {lang.exampleStrings.map((s, idx) => (
                      <span key={idx}>{s === '' ? 'ε' : s}</span>
                    ))}
                  </div>
                </div>

                {lang.notInLanguage && (
                  <div className="example-section">
                    <strong>Strings NOT in the language:</strong>
                    <div className="example-list wrong">
                      {lang.notInLanguage.map((s, idx) => (
                        <span key={idx}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="example-desc"><strong>Why:</strong> {lang.why}</p>

                <button className="btn btn-primary" onClick={() => handleTry(lang)}>
                  Try This Language
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
