import React, { useEffect, useState } from 'react';
import { isSoundEnabled, setSoundEnabled, subscribeToSoundPreference } from '../../utils/audioPreference';
import './GameChrome.css';

export function GameHeader({ title, theme = 'forest', children, onBack, onRestart, backLabel = 'Выйти к играм', withSound = false }) {
  const [soundEnabled, updateSoundEnabled] = useState(isSoundEnabled);
  useEffect(() => subscribeToSoundPreference(updateSoundEnabled), []);
  const toggleSound = () => {
    const next = !soundEnabled;
    updateSoundEnabled(next);
    setSoundEnabled(next);
    if (!next) window.speechSynthesis?.cancel();
  };

  return (
    <header className={`game-header game-header--${theme}`}>
      <div className="game-header__brand" aria-label="LogoToti">LogoToti</div>
      <h1 className="game-header__title">{title}</h1>
      <nav className="game-header__actions" aria-label="Управление игрой">
        {onBack && <button type="button" className="game-header__button" onClick={onBack} aria-label={backLabel} title={backLabel}>←</button>}
        {children}
        {withSound && <button type="button" className="game-header__button" onClick={toggleSound} aria-label={soundEnabled ? 'Выключить озвучивание' : 'Включить озвучивание'} aria-pressed={soundEnabled} title="Звук озвучивания">{soundEnabled ? '🔊' : '🔇'}</button>}
        {onRestart && <button type="button" className="game-header__button game-header__restart" onClick={onRestart} aria-label="Начать сначала" title="Начать сначала">↻</button>}
      </nav>
    </header>
  );
}

export function GameExitDialog({ theme = 'forest', onStay, onExit }) {
  return (
    <div className={`game-exit game-exit--${theme}`} role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) onStay(); }}>
      <section className="game-exit__dialog" role="dialog" aria-modal="true" aria-labelledby="game-exit-title">
        <button className="game-exit__close" type="button" onClick={onStay} aria-label="Остаться в игре">×</button>
        <h2 id="game-exit-title">Ты действительно хочешь выйти?</h2>
        <p>Текущий прогресс останется, если ты продолжишь игру.</p>
        <div className="game-exit__actions">
          <button type="button" onClick={onStay}>Остаться</button>
          <button type="button" onClick={onExit}>Выйти</button>
        </div>
      </section>
    </div>
  );
}

export default GameHeader;
