import React from 'react';
import '../styles/Home.css';

export default function Home({ setCurrentPage }) {
  return (
    <div className="page-home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-label">INTERACTIVE FORMAL LANGUAGES LAB</div>
            <h1 className="hero-title">Pumping Lemma Simulator</h1>
            <p className="hero-subtitle">Learn the Pumping Lemma by splitting, pumping and testing strings.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => setCurrentPage('learn')}>
                Learn the Concept
              </button>
              <button className="btn btn-secondary" onClick={() => setCurrentPage('tryit')}>
                Try an Example
              </button>
              <button className="btn btn-secondary" onClick={() => setCurrentPage('tryit')}>
                Open ProofLens
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-step">
              <div className="visual-box">[ x ][ y ][ z ]</div>
              <div className="visual-arrow">↓</div>
            </div>
            <div className="visual-step">
              <div className="visual-box">[ x ][ y ][ y ][ z ]</div>
              <div className="visual-arrow">↓</div>
            </div>
            <div className="visual-result">Pumped String</div>
          </div>
        </div>
      </section>

      {/* What Will I Learn Section */}
      <section className="learn-section">
        <div className="container">
          <h2>What Will I Learn?</h2>
          <div className="cards-grid">
            <div className="card">
              <div className="card-icon">🧠</div>
              <h3>Understand</h3>
              <p>Learn the Pumping Lemma and its conditions. Discover why it matters for formal languages.</p>
            </div>
            <div className="card">
              <div className="card-icon">🔬</div>
              <h3>Experiment</h3>
              <p>Choose a language, enter a string, select a pumping length, and explore the process interactively.</p>
            </div>
            <div className="card">
              <div className="card-icon">✓</div>
              <h3>Prove</h3>
              <p>See how pumping can create a contradiction and show that a language is not regular.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Basic Idea Section */}
      <section className="basic-idea">
        <div className="container">
          <h2>The Basic Idea</h2>
          <div className="idea-visual">
            <div className="idea-step">
              <div className="idea-label">Long String</div>
              <div className="idea-arrow">↓</div>
            </div>
            <div className="idea-step">
              <div className="idea-label">Split it: w = xyz</div>
              <div className="idea-arrow">↓</div>
            </div>
            <div className="idea-step">
              <div className="idea-label">Pump y: xy⁰z   xy¹z   xy²z   xy³z</div>
              <div className="idea-arrow">↓</div>
            </div>
            <div className="idea-step final">
              <div className="idea-label">Check: Is the pumped string still in L?</div>
            </div>
          </div>
          <p className="idea-text">
            The Pumping Lemma tells us that if a language is regular, we can split any sufficiently long string into three parts (x, y, z) and repeat the middle part (y) while staying in the language. If we find a string where this fails, the language cannot be regular.
          </p>
        </div>
      </section>
    </div>
  );
}
