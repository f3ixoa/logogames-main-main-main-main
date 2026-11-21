import React from 'react';
import './BackButton.css';

const BackButton = ({ onClick, label = 'Назад' }) => (
  <button type="button" className="back-button" onClick={onClick} aria-label={label}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
    <span>{label}</span>
  </button>
);

export default BackButton;
