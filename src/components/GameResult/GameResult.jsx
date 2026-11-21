import React, { useRef, useState } from 'react';
import './GameResult.css';
import { completionActions } from '../../utils/gameCompletion';

const GameResult = ({ score, total, onRepeat, onNextGame, onHome, onBackToCategories, onHomeAction, theme = 'meadow', gameName = 'игру' }) => {
  const actions = completionActions({ nextActivity: onNextGame, gameSelection: onBackToCategories });
  const percentage = Math.round((score / total) * 100);
  const actionTakenRef = useRef(false);
  const [actionTaken, setActionTaken] = useState(false);
  const runAction = (callback) => {
    if (actionTakenRef.current) return;
    actionTakenRef.current = true;
    setActionTaken(true);
    callback?.();
  };

  const getEmoji = () => {
    if (percentage >= 90) return '🎉';
    if (percentage >= 70) return '👏';
    if (percentage >= 50) return '👍';
    return '💪';
  };

  const getMessage = () => {
    if (percentage >= 90) return 'Отлично!';
    if (percentage >= 70) return 'Хорошо!';
    if (percentage >= 50) return 'Неплохо!';
    return 'Попробуй ещё раз!';
  };

  return (
    <div className={`game-result game-result--${theme}`}>
      <div className="game-result__content" role="dialog" aria-modal="true" aria-labelledby="game-result-title">
        <div className="game-result__emoji" aria-hidden="true">{getEmoji()}</div>
        <div className="game-result__message" id="game-result-title">{getMessage()} Ты прошёл: {gameName}!</div>
        {Number.isFinite(score) && Number.isFinite(total) && total > 0 && <div className="game-result__score">
          <div className="game-result__score-number">
            {score} / {total}
          </div>
          <div className="game-result__score-text">
            Правильных ответов
          </div>
        </div>}
        <div className="game-result__buttons">
          <button className="game-result__button game-result__button--primary" onClick={() => runAction(onRepeat)} disabled={actionTaken}>
            🔄 Повторить
          </button>
          <button className="game-result__button game-result__button--secondary" onClick={() => runAction(actions.next)} disabled={actionTaken}>
            🎮 Следующая игра
          </button>
          <button className="game-result__button game-result__button--secondary" onClick={() => runAction(onHomeAction || onHome || onBackToCategories)} disabled={actionTaken}>
            🏠 На главную
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
