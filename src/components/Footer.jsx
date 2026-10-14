import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <h3>Pumping Lemma Simulator</h3>
          <p>An interactive learning tool for understanding the Pumping Lemma for Regular Languages.</p>
        </div>
        <div className="footer-info">
          <p>&copy; 2024 Educational Tool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
