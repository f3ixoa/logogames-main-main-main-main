import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { getSentences } from '../../data/sentences';
import { getSentenceImage } from '../../data/sentenceImages';
import BackButton from '../../components/BackButton/BackButton';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import GameResult from '../../components/GameResult/GameResult';
import { speakText, isSpeechSynthesisSupported } from '../../utils/speechSynthesis';
import { startSpeechRecognition, isSpeechRecognitionSupported } from '../../utils/speechRecognition';
import './SentencesPage.css';

const STEP = {
  SELECT_WORD: 'select_word',
  LISTEN: 'listen',
  SPEAK: 'speak'
};

const PRAISE_PHRASES = [
  'Молодец!',
  'Отлично!',
  'Супер!',
  'Прекрасно!',
  'Замечательно!'
];

const SentenceIllustration = ({ imageSrc, emoji, alt, isPlayingAudio, speechSynthesisAvailable, small = false, onClick, disabled }) => {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

  return (
    <button
      className={`sentences-page__emoji-hero${small ? ' small' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={alt}
    >
      {imageSrc && !imageFailed ? (
        <img
          className="sentences-page__illustration-image"
          src={imageSrc}
          alt={alt}
          onError={() => setImageFailed(true)}
        />
      ) : imageSrc ? (
        <span className="sentences-page__illustration-fallback" aria-hidden="true">{emoji}</span>
      ) : (
        <span className="sentences-page__illustration-placeholder">
          <span className="sentences-page__illustration-placeholder-icon" aria-hidden="true">✦</span>
          <span>Иллюстрация скоро появится</span>
        </span>
      )}
      {speechSynthesisAvailable && (
        <span className="sentences-page__emoji-speaker" aria-hidden="true">
          {isPlayingAudio ? '🔊' : '🔈'}
        </span>
      )}
    </button>
  );
};

const SentencesPage = () => {
  const navigate = useNavigate();
  const { soundId } = useParams();
  const sound = getSoundById(soundId);
  const sentences = getSentences(soundId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(STEP.SELECT_WORD);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [preSelectedAnswer, setPreSelectedAnswer] = useState(null);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState(null);
  const [pronunciationAttempts, setPronunciationAttempts] = useState(0);
  const [recognizedText, setRecognizedText] = useState('');
  const [pronunciationFeedback, setPronunciationFeedback] = useState(null);
  const [stopRecognition, setStopRecognition] = useState(null);
  const stopRecognitionRef = useRef(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const actionModalRef = useRef(null);
  const modalTriggerRef = useRef(null);
  const isListeningRef = useRef(isListening);
  isListeningRef.current = isListening;

  const speechRecognitionAvailable = isSpeechRecognitionSupported();
  const speechSynthesisAvailable = isSpeechSynthesisSupported();

  function closeActionModal() {
    if (isListeningRef.current) return;
    if (stopRecognitionRef.current) {
      stopRecognitionRef.current();
      stopRecognitionRef.current = null;
      setStopRecognition(null);
    }
    setIsListening(false);
    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setIsActionModalOpen(false);
  }

  const openActionModal = () => setIsActionModalOpen(true);

  useEffect(() => {
    stopRecognitionRef.current = stopRecognition;
  }, [stopRecognition]);

  useEffect(() => {
    return () => {
      stopRecognitionRef.current?.();
      if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!isActionModalOpen) return undefined;

    const previousFocus = document.activeElement;
    actionModalRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isListeningRef.current) {
        closeActionModal();
      }
      if (event.key === 'Tab' && actionModalRef.current) {
        const focusable = actionModalRef.current.querySelectorAll('button:not(:disabled)');
        if (focusable.length === 0) {
          event.preventDefault();
          actionModalRef.current.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      (modalTriggerRef.current || previousFocus)?.focus?.();
    };
  }, [isActionModalOpen]);

  if (!sound || sentences.length === 0) {
    navigate('/');
    return null;
  }

  const currentSentence = sentences[currentIndex];
  const sentenceImage = getSentenceImage(soundId, currentSentence.id);
  const sentenceImageAlt = `Иллюстрация к предложению ${currentSentence.id}`;
  const isLastSentence = currentIndex === sentences.length - 1;
  const hasAnsweredCorrectly = selectedAnswer === currentSentence.correctAnswer;

  const handleAnswerSelect = (optionObj) => {
    if (hasAnsweredCorrectly || isPlayingAudio) return;

    const answerText = optionObj.text;

    // Первое нажатие: озвучиваем и устанавливаем предварительный выбор
    if (preSelectedAnswer !== answerText) {
      setPreSelectedAnswer(answerText);

      // Озвучиваем выбранный вариант
      if (speechSynthesisAvailable) {
        setIsPlayingAudio(true);
        const success = speakText(answerText);
        if (success) {
          setTimeout(() => setIsPlayingAudio(false), 2000);
        } else {
          setIsPlayingAudio(false);
        }
      }
      return;
    }

    // Второе нажатие на ту же карточку: подтверждаем ответ
    setSelectedAnswer(answerText);
    const correct = answerText === currentSentence.correctAnswer;

    if (correct) {
      setScore(score + 1);

      // Brief praise audio for correct word selection
      if (speechSynthesisAvailable) {
        setTimeout(() => {
          speakText('Молодец!');
        }, 300);
      }
    } else {
      setIncorrectAttempts(incorrectAttempts + 1);
      setTimeout(() => {
        setSelectedAnswer(null);
        setPreSelectedAnswer(null);
      }, 1500);
    }
  };

  const playPictureAudio = () => {
    if (!speechSynthesisAvailable || isPlayingAudio) return;

    setIsPlayingAudio(true);
    const text = hasAnsweredCorrectly
      ? currentSentence.sentence.replace('_____', currentSentence.correctAnswer)
      : currentSentence.sentence.replace('_____', '...');

    const success = speakText(text);
    if (success) {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const playWordAudio = () => {
    if (!speechSynthesisAvailable || isPlayingAudio) return;

    setIsPlayingAudio(true);
    const success = speakText(currentSentence.targetWord);
    if (success) {
      setTimeout(() => setIsPlayingAudio(false), 2000);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleContinueToListen = () => {
    if (speechSynthesisAvailable) {
      modalTriggerRef.current = document.activeElement;
      setCurrentStep(STEP.LISTEN);
      setHasPlayedAudio(false);
      setIsActionModalOpen(true);
    } else {
      handleSkipToNext();
    }
  };

  const playFullAudio = () => {
    if (!speechSynthesisAvailable) return;

    setIsPlayingAudio(true);
    const success = speakText(currentSentence.audioPrompt || currentSentence.sentence);

    if (success) {
      setHasPlayedAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 4000);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleContinueToSpeak = () => {
    if (speechRecognitionAvailable) {
      setCurrentStep(STEP.SPEAK);
      setPronunciationFeedback(null);
      setRecognitionError(null);
      setRecognizedText('');
    } else {
      handleSkipToNext();
    }
  };

  const normalizeText = (text) => {
    return (text || '')
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[^а-яa-z\s]/gi, '')
      .trim();
  };

  const handleStartRecording = () => {
    if (!speechRecognitionAvailable || isListening) return;

    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setRecognitionError(null);
    setPronunciationFeedback(null);
    setRecognizedText('');

    const stop = startSpeechRecognition(
      currentSentence.targetWord,
      {
        onListeningChange: (listening) => {
          setIsListening(listening);
        },
        onError: (error) => {
          setIsListening(false);
          setRecognitionError(error);
        },
        onTranscript: (transcript) => {
          setRecognizedText(transcript);
        },
        onResult: ({ transcript, matched }) => {
          setIsListening(false);
          setRecognizedText(transcript);

          const normalizedTranscript = normalizeText(transcript);
          const normalizedTarget = normalizeText(currentSentence.targetWord);
          const isMatch = normalizedTranscript === normalizedTarget ||
                         normalizedTranscript.includes(normalizedTarget);

          if (isMatch) {
            const praise = PRAISE_PHRASES[Math.floor(Math.random() * PRAISE_PHRASES.length)];
            setPronunciationFeedback({
              success: true,
              message: `${praise} Ты сказал: ${currentSentence.targetWord}!`
            });
            setPronunciationAttempts(0);

            // Play praise for pronunciation success
            if (speechSynthesisAvailable) {
              setTimeout(() => {
                speakText(praise);
              }, 300);
            }
          } else {
            const newAttemptCount = pronunciationAttempts + 1;
            setPronunciationAttempts(newAttemptCount);

            if (newAttemptCount >= 3) {
              setPronunciationFeedback({
                success: false,
                message: 'Выбери, как продолжить.',
                showOptions: true
              });
            } else {
              setPronunciationFeedback({
                success: false,
                message: 'Давай попробуем ещё раз! Послушай слово внимательно.',
                canRetry: true
              });
            }
          }
        }
      },
      { matchMode: 'exact-word' }
    );

    stopRecognitionRef.current = stop;
    setStopRecognition(() => stop);
  };

  const handleRetryPronunciation = () => {
    setPronunciationFeedback(null);
    setRecognitionError(null);
    setRecognizedText('');
    playWordAudio();
  };

  const handleSelfAssessment = () => {
    setPronunciationFeedback({
      success: true,
      message: 'Хорошо! Продолжаем дальше.',
      selfAssessed: true
    });
    setPronunciationAttempts(0);
  };

  const handleSkipToNext = () => {
    setIsActionModalOpen(false);
    if (isLastSentence) {
      setIsCompleted(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      resetItemState();
    }
  };

  const resetItemState = () => {
    setCurrentStep(STEP.SELECT_WORD);
    setSelectedAnswer(null);
    setPreSelectedAnswer(null);
    setIncorrectAttempts(0);
    setHasPlayedAudio(false);
    setIsPlayingAudio(false);
    setPronunciationAttempts(0);
    setPronunciationFeedback(null);
    setRecognitionError(null);
    setRecognizedText('');
    if (stopRecognitionRef.current) {
      stopRecognitionRef.current();
      stopRecognitionRef.current = null;
      setStopRecognition(null);
    }
  };

  const handleRepeat = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsCompleted(false);
    resetItemState();
  };

  const handleBackToCategories = () => {
    navigate(`/sound/${soundId}/categories`);
  };

  const handleBack = () => {
    navigate(`/sound/${soundId}/categories`);
  };

  if (isCompleted) {
    return (
      <GameResult
        score={score}
        total={sentences.length}
        gameName="Предложения"
        onRepeat={handleRepeat}
        onNextGame={() => navigate(`/sound/${soundId}/category/syllables/games`)}
        onHome={() => navigate('/')}
      />
    );
  }

  const getHintMessage = () => {
    if (incorrectAttempts === 0) return null;
    if (incorrectAttempts === 1) return 'Подумай ещё немного!';
    if (incorrectAttempts === 2) return `Подсказка: правильное слово начинается на "${currentSentence.correctAnswer[0]}"`;
    return `Правильный ответ: ${currentSentence.correctAnswer}`;
  };

  return (
    <div className="sentences-page">
      <div className="sentences-page__header">
        <BackButton onClick={handleBack} />
        <ProgressBar current={currentIndex + 1} total={sentences.length} showText={true} />
      </div>

      <div className="sentences-page__content">
        {currentStep === STEP.SELECT_WORD && (
          <div className="sentences-page__container">
            <SentenceIllustration
              imageSrc={sentenceImage}
              emoji={currentSentence.emoji}
              alt={`${sentenceImageAlt}. Прослушать предложение`}
              onClick={playPictureAudio}
              disabled={isPlayingAudio}
              isPlayingAudio={isPlayingAudio}
              speechSynthesisAvailable={speechSynthesisAvailable}
            />

            <div className="sentences-page__sentence-display">
              {currentSentence.sentence}
            </div>

            {getHintMessage() && (
              <div className={`sentences-page__hint ${incorrectAttempts >= 3 ? 'show-answer' : ''}`}>
                {getHintMessage()}
              </div>
            )}

            <div className="sentences-page__word-choices">
              {currentSentence.options.map((option, index) => {
                const optionText = typeof option === 'string' ? option : option.text;
                const optionEmoji = typeof option === 'string' ? '' : option.emoji;

                let buttonClass = 'sentences-page__word-button';

                const isPreSelected = preSelectedAnswer === optionText;
                const isSelected = selectedAnswer === optionText;
                const isCorrectOption = optionText === currentSentence.correctAnswer;

                if (isPreSelected && !hasAnsweredCorrectly) {
                  buttonClass += ' pre-selected';
                }

                if (hasAnsweredCorrectly && isCorrectOption) {
                  buttonClass += ' correct';
                }

                if (isSelected && !isCorrectOption) {
                  buttonClass += ' shake-animation';
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(typeof option === 'string' ? { text: option, emoji: '' } : option)}
                    disabled={hasAnsweredCorrectly}
                  >
                    <div className="sentences-page__word-button-emoji">
                      {optionEmoji}
                    </div>
                    <div className="sentences-page__word-button-text">
                      {optionText}
                    </div>
                  </button>
                );
              })}
            </div>

            {hasAnsweredCorrectly && (
              <div className="sentences-page__result-card success">
                <div className="sentences-page__result-icon">✓</div>
                <div className="sentences-page__result-content">
                  <div className="sentences-page__result-title">Молодец!</div>
                  <div className="sentences-page__result-text">
                    {currentSentence.sentence.replace('_____', currentSentence.correctAnswer)}
                  </div>
                </div>
              </div>
            )}

            {hasAnsweredCorrectly && (
              <button
                className="sentences-page__continue-btn"
                onClick={handleContinueToListen}
              >
                {speechSynthesisAvailable ? '🔊 Послушать и повторить' : '➡️ Далее'}
              </button>
            )}
          </div>
        )}

        {currentStep === STEP.LISTEN && (
          <div className="sentences-page__container">
            <div className="sentences-page__step-badge">Шаг 2 из 3</div>

            <SentenceIllustration
              imageSrc={sentenceImage}
              emoji={currentSentence.emoji}
              alt={`${sentenceImageAlt}. Прослушать предложение`}
              onClick={playFullAudio}
              disabled={isPlayingAudio}
              isPlayingAudio={isPlayingAudio}
              speechSynthesisAvailable={speechSynthesisAvailable}
            />

            <div className="sentences-page__completed-sentence">
              {currentSentence.sentence.replace('_____', currentSentence.correctAnswer)}
            </div>
          </div>
        )}

        {currentStep === STEP.SPEAK && (
          <div className="sentences-page__container">
            <div className="sentences-page__step-badge">
              Шаг 3 из 3 {pronunciationAttempts > 0 && `• Попытка ${pronunciationAttempts} из 3`}
            </div>

            <SentenceIllustration
              imageSrc={sentenceImage}
              emoji={currentSentence.emoji}
              alt={`${sentenceImageAlt}. Прослушать слово`}
              onClick={playWordAudio}
              disabled={isPlayingAudio}
              isPlayingAudio={isPlayingAudio}
              speechSynthesisAvailable={speechSynthesisAvailable}
              small
            />

            <div className="sentences-page__target-display">
              Произнеси слово: <strong>{currentSentence.targetWord}</strong>
            </div>

          </div>
        )}
      </div>

      {(currentStep === STEP.LISTEN || currentStep === STEP.SPEAK) && !isActionModalOpen && (
        <button
          type="button"
          className="sentences-page__reopen-actions"
          onClick={openActionModal}
        >
          Открыть действия
        </button>
      )}

      {isActionModalOpen && (
        <div
          className="sentences-page__modal-backdrop"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget && !isListening) closeActionModal();
          }}
        >
          <section
            className="sentences-page__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sentences-page-modal-title"
            tabIndex={-1}
            ref={actionModalRef}
          >
            <button
              type="button"
              className="sentences-page__modal-close"
              onClick={closeActionModal}
              disabled={isListening}
              aria-label="Закрыть окно"
            >×</button>
            <span className="sentences-page__modal-eyebrow">
              {currentStep === STEP.LISTEN ? 'Шаг 2 из 3 · Послушай предложение' : 'Шаг 3 из 3 · Произнеси слово'}
            </span>
            <h2 id="sentences-page-modal-title" className="sentences-page__modal-title">
              {currentStep === STEP.LISTEN ? 'Слушаем и повторяем' : currentSentence.targetWord}
            </h2>
            <p className="sentences-page__modal-prompt">
              {currentStep === STEP.LISTEN
                ? currentSentence.sentence.replace('_____', currentSentence.correctAnswer)
                : 'Нажми на кнопку и произнеси слово вслух.'}
            </p>

            {currentStep === STEP.LISTEN && (
              <div className="sentences-page__modal-actions">
                <button
                  type="button"
                  className="sentences-page__modal-button listen"
                  onClick={playFullAudio}
                  disabled={isPlayingAudio || !speechSynthesisAvailable}
                >
                  {isPlayingAudio ? '🔊 Слушай внимательно…' : hasPlayedAudio ? '🔊 Послушать ещё раз' : '🔊 Послушать предложение'}
                </button>
                {speechSynthesisAvailable && (
                  <button
                    type="button"
                    className="sentences-page__modal-button secondary"
                    onClick={playWordAudio}
                    disabled={isPlayingAudio}
                  >
                    🔈 Слушать слово
                  </button>
                )}
                {hasPlayedAudio && speechRecognitionAvailable && (
                  <button
                    type="button"
                    className="sentences-page__modal-button primary"
                    onClick={handleContinueToSpeak}
                    disabled={isPlayingAudio}
                  >
                    🎙️ Произнести
                  </button>
                )}
                {hasPlayedAudio && !speechRecognitionAvailable && (
                  <button
                    type="button"
                    className="sentences-page__modal-button primary"
                    onClick={handleSkipToNext}
                  >
                    {isLastSentence ? '✅ Завершить' : '➡️ Далее'}
                  </button>
                )}
              </div>
            )}

            {currentStep === STEP.SPEAK && (
              <>
                <div className="sentences-page__modal-actions">
                  <button
                    type="button"
                    className={`sentences-page__modal-button mic${isListening ? ' listening' : ''}`}
                    onClick={handleStartRecording}
                    disabled={!speechRecognitionAvailable || isListening || pronunciationFeedback?.success}
                  >
                    {isListening ? '🎤 Слушаю тебя…' : '🎙️ Произнести слово'}
                  </button>
                  {speechSynthesisAvailable && (
                    <button
                      type="button"
                      className="sentences-page__modal-button secondary"
                      onClick={playWordAudio}
                      disabled={isPlayingAudio || isListening}
                    >
                      🔄 Послушать ещё раз
                    </button>
                  )}
                </div>
                {recognizedText && (
                  <div className="sentences-page__modal-status" role="status" aria-live="polite">
                    Приложение услышало: <strong>{recognizedText || '(не распознано)'}</strong>
                  </div>
                )}
                {recognitionError && <div className="sentences-page__modal-status error" role="alert">{recognitionError}</div>}
                {pronunciationFeedback && (
                  <div className={`sentences-page__modal-status ${pronunciationFeedback.success ? 'success' : 'retry'}`} role="status" aria-live="polite">
                    {pronunciationFeedback.message}
                  </div>
                )}
                {!speechRecognitionAvailable && (
                  <div className="sentences-page__modal-status error" role="alert">
                    Распознавание речи недоступно. Попробуй открыть страницу через HTTPS или используй другой браузер.
                  </div>
                )}
                {pronunciationFeedback?.showOptions && (
                  <div className="sentences-page__modal-actions">
                    <button
                      type="button"
                      className="sentences-page__modal-button mic"
                      onClick={() => {
                        setPronunciationFeedback(null);
                        setRecognizedText('');
                        setPronunciationAttempts(pronunciationAttempts - 1);
                      }}
                    >
                      🎙️ Попробовать ещё
                    </button>
                    <button type="button" className="sentences-page__modal-button primary" onClick={handleSelfAssessment}>
                      ✓ Я сказал правильно
                    </button>
                  </div>
                )}
                {pronunciationFeedback?.canRetry && (
                  <button
                    type="button"
                    className="sentences-page__modal-button secondary"
                    onClick={handleStartRecording}
                    disabled={!speechRecognitionAvailable}
                  >
                    🎙️ Попробовать ещё раз
                  </button>
                )}
                {(pronunciationFeedback?.success || pronunciationFeedback?.selfAssessed) && (
                  <button type="button" className="sentences-page__modal-button primary" onClick={handleSkipToNext}>
                    {isLastSentence ? '✅ Завершить' : '➡️ Следующее предложение'}
                  </button>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default SentencesPage;
