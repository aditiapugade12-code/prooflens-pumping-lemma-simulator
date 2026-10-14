import React, { useState } from 'react';
import '../styles/Viva.css';

export default function Viva() {
  const [currentQ, setCurrentQ] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(new Set());
  const [picked, setPicked] = useState({});

  const questions = [
    {
      q: 'What is the Pumping Lemma?',
      options: [
        'A proof technique to show a language IS regular',
        'A property of regular languages stating sufficiently long strings can be split into x, y, z with y pumpable',
        'A method to construct finite automata',
        'A way to minimize DFA states'
      ],
      correct: 1
    },
    {
      q: 'What is pumping length p?',
      options: [
        'The length of the input string',
        'A limit on the number of pumping iterations',
        'A positive integer defining how long a string must be for valid decomposition',
        'The maximum number of states in the corresponding NFA'
      ],
      correct: 2
    },
    {
      q: 'In the decomposition w = xyz, what does y represent?',
      options: [
        'The entire string',
        'The prefix of the string',
        'The repeatable middle part that can be pumped',
        'The suffix of the string'
      ],
      correct: 2
    },
    {
      q: 'Why must y be non-empty (|y| ≥ 1)?',
      options: [
        'To ensure the string is long enough',
        'To make the proof easier',
        'Because pumping empty y would not change the string, making the condition trivial',
        'To guarantee p exists for any language'
      ],
      correct: 2
    },
    {
      q: 'What does the condition |xy| ≤ p ensure?',
      options: [
        'The string length must be at least p',
        'The y portion ends within the first p symbols of the string',
        'Both x and y individually have length at most p',
        'The decomposition is unique'
      ],
      correct: 1
    },
    {
      q: 'When i = 0 in xyⁱz, what string do we get?',
      options: [
        'The original string xyz',
        'Empty string',
        'xz (y is removed)',
        'xyy (y is doubled)'
      ],
      correct: 2
    },
    {
      q: 'Can the Pumping Lemma prove a language IS regular?',
      options: [
        'Yes, it directly proves regularity',
        'No, it is mainly used to prove non-regularity',
        'Only for finite languages',
        'Only with additional DFA construction'
      ],
      correct: 1
    },
    {
      q: 'What is a "contradiction" in the Pumping Lemma proof?',
      options: [
        'Finding two decompositions of the same string',
        'When xy⁰z is not in the language',
        'Showing that every legal split gives a pumped string outside L, which clashes with the assumption that L is regular',
        'When p is larger than the string length'
      ],
      correct: 2
    },
    {
      q: 'Why is aⁿbⁿ not regular?',
      options: [
        'It has too many strings in the language',
        'The alphabet size is 2',
        'Every valid decomposition has y as only a\'s, so pumping breaks the a=b equality',
        'It requires counting, which finite automata cannot do'
      ],
      correct: 2
    },
    {
      q: 'Which of these languages IS regular?',
      options: [
        '{aⁿbⁿ | n ≥ 0}',
        '{0*1*}',
        '{ww | w ∈ {0,1}*}',
        '{aⁿbⁿcⁿ | n ≥ 0}'
      ],
      correct: 1
    },
    {
      q: 'What happens if we find even ONE pumped string outside L?',
      options: [
        'The language might still be regular',
        'It immediately proves the language is non-regular',
        'We must check all possible decompositions',
        'It only works for alphabet size 2'
      ],
      correct: 2
    },
    {
      q: 'If all pumped strings stay in L, what can we conclude?',
      options: [
        'The language IS regular (proven)',
        'The language is NOT regular (proven)',
        'We cannot conclude - the Pumping Lemma doesn\'t prove regularity',
        'We need to try a different string'
      ],
      correct: 2
    },
    {
      q: 'What is the key mistake in: "I tested pumping and nothing failed, so L is regular"?',
      options: [
        'The string was too short',
        'The decomposition was invalid',
        'The Pumping Lemma cannot prove regularity, only non-regularity',
        'We didn\'t try enough values of i'
      ],
      correct: 2
    },
    {
      q: 'Which condition is NOT required for a valid decomposition?',
      options: [
        '|y| ≥ 1 (y is non-empty)',
        '|xy| ≤ p (y ends within first p)',
        '|x| + |y| + |z| = |w| (covers entire string)',
        '|x| = |z| (x and z have equal length)'
      ],
      correct: 3
    }
  ];

  const quick = [
    ['What is the Pumping Lemma?', 'If L is regular, every long string w in L can be split as w = xyz so that xyⁱz stays in L for all i ≥ 0.'],
    ['What are p, w, x, y, z, i?', 'p is the pumping length, w the chosen string, x y z its three parts, and i how many times y is repeated.'],
    ['Why do we assume L is regular?', 'It is a proof by contradiction. If the assumption leads to something impossible, L cannot be regular.'],
    ['Why choose w = aᵖbᵖ?', 'Its first p characters are all a\'s, so |xy| ≤ p forces y to contain only a\'s.'],
    ['Why is one failed split not a proof?', 'The lemma only promises that some legal split works. We must show that every legal split fails.'],
    ['Can the lemma show a language is regular?', 'No. Passing the tests proves nothing. It is only used to show non-regularity.'],
    ['What does ProofLens check?', 'Whether a proof for {aⁿbⁿ} states the witness, why y is only a\'s, why y is non-empty, what removal does, why the result is outside L, and that it covers every legal split.']
  ];

  const handleNext = () => {
    setShowAnswer(false);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setCurrentQ(0);
    }
  };

  const handlePrev = () => {
    setShowAnswer(false);
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    } else {
      setCurrentQ(questions.length - 1);
    }
  };

  const handleSelectOption = (selectedIndex) => {
    const q = questions[currentQ];
    const isCorrect = selectedIndex === q.correct;
    
    if (!answered.has(currentQ) && isCorrect) {
      setScore(score + 1);
    }
    setAnswered(new Set(answered).add(currentQ));
    setPicked({ ...picked, [currentQ]: selectedIndex });
    setShowAnswer(true);
  };

  const q = questions[currentQ];
  const isAnswered = answered.has(currentQ);
  const userSelectedCorrect = isAnswered;

  return (
    <div className="page-viva">
      <div className="container">
        <h1>MCQ Quiz - Pumping Lemma</h1>
        <p className="viva-intro">
          Test your understanding with multiple-choice questions.
        </p>

        <div className="score-bar">
          <div className="score-display">Score: {score}/{questions.length}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${(currentQ + 1) / questions.length * 100}%`}}></div>
          </div>
          <div className="progress-info">Question {currentQ + 1} of {questions.length}</div>
        </div>

        <div className="viva-card mcq-card">
          <div className="question-box">
            <h2>{q.q}</h2>
          </div>

          <div className="options-grid">
            {q.options.map((option, index) => {
              const isCorrectOption = index === q.correct;
              const isSelected = isAnswered && picked[currentQ] === index;
              let optionClass = 'option-btn';
              
              if (isAnswered) {
                if (isCorrectOption) {
                  optionClass += ' correct';
                } else if (isSelected) {
                  optionClass += ' incorrect';
                }
              }
              
              return (
                <button
                  key={index}
                  className={optionClass}
                  onClick={() => handleSelectOption(index)}
                  disabled={isAnswered}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                  <span className="option-text">{option}</span>
                  {isAnswered && isCorrectOption && <span className="check">✓</span>}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="feedback-box">
              <p>
                {picked[currentQ] === q.correct ? (
                  <strong className="correct-text">✓ Correct!</strong>
                ) : (
                  <strong className="incorrect-text">✗ Incorrect. The correct answer is:</strong>
                )}
              </p>
              <p className="correct-answer">"{q.options[q.correct]}"</p>
            </div>
          )}

          <div className="viva-controls">
            <button className="btn btn-secondary" onClick={handlePrev}>
              ← Previous
            </button>
            <button className="btn btn-secondary" onClick={handleNext}>
              Next →
            </button>
          </div>
        </div>

        {/* Quick viva answers */}
        <section className="mistakes-section">
          <h2>Quick Viva Answers</h2>
          <div className="mistakes-grid">
            {quick.map(([qq, aa]) => (
              <div className="mistake-card" key={qq}>
                <h3>{qq}</h3>
                <p className="correction">{aa}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mistakes Section */}
        <section className="mistakes-section">
          <h2>⚠️ Watch Out</h2>
          <div className="mistakes-grid">
            <div className="mistake-card">
              <h3>Mistake 1</h3>
              <p className="mistake-text">"Passing the Pumping Lemma proves regularity."</p>
              <p className="correction">
                ✓ Correct: No. The lemma is mainly used to prove non-regularity, not regularity.
              </p>
            </div>

            <div className="mistake-card">
              <h3>Mistake 2</h3>
              <p className="mistake-text">"Choose any random string to pump."</p>
              <p className="correction">
                ✓ Correct: Choose a string in L with length ≥ p that exposes the language's defining property.
              </p>
            </div>

            <div className="mistake-card">
              <h3>Mistake 3</h3>
              <p className="mistake-text">"Any decomposition w = xyz works."</p>
              <p className="correction">
                ✓ Correct: The decomposition must satisfy |y| ≥ 1 and |xy| ≤ p.
              </p>
            </div>

            <div className="mistake-card">
              <h3>Mistake 4</h3>
              <p className="mistake-text">"One failed split proves non-regularity."</p>
              <p className="correction">
                ✓ Correct: For a formal proof, every legal decomposition must lead to contradiction.
              </p>
            </div>

            <div className="mistake-card">
              <h3>Mistake 5</h3>
              <p className="mistake-text">"If i = 1 works, the language is regular."</p>
              <p className="correction">
                ✓ Correct: We must test i = 0, 2, 3, ... and check if any gives a string outside L.
              </p>
            </div>

            <div className="mistake-card">
              <h3>Mistake 6</h3>
              <p className="mistake-text">"y can be anywhere in the string."</p>
              <p className="correction">
                ✓ Correct: Due to |xy| ≤ p, y must end within the first p symbols.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
