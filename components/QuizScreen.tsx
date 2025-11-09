import React, { useState } from 'react';
import { Question, AnswerScore } from '../types';
import { TOTAL_QUESTIONS, TRAIT_LABELS } from '../constants';

interface QuizScreenProps {
  questions: Question[];
  onComplete: (answers: AnswerScore[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerScore[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (score: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = [...answers, { score, traitPair: currentQuestion.traitPair }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        onComplete(newAnswers);
      }
      setIsAnimating(false);
    }, 400);
  };

  const progressPercentage = ((currentQuestionIndex) / TOTAL_QUESTIONS) * 100;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-brand-surface p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="mb-6">
          <p className="text-sm text-brand-text-secondary mb-2">質問 {currentQuestionIndex + 1} / {TOTAL_QUESTIONS}</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-brand-secondary h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 min-h-[96px] md:min-h-[120px] flex items-center justify-center">
            {currentQuestion?.question}
          </h2>

          <div className="mt-4">
            <div className="flex justify-between text-base font-bold text-brand-secondary mb-3 px-1">
              <span>{TRAIT_LABELS[currentQuestion?.traitPair[0]]}</span>
              <span>{TRAIT_LABELS[currentQuestion?.traitPair[1]]}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
                <button
                  key={score}
                  onClick={() => handleAnswer(score)}
                  aria-label={`選択肢 ${score}`}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800 text-brand-text font-bold flex items-center justify-center hover:bg-brand-primary hover:text-brand-bg transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                >
                  {score}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-brand-text-secondary mt-3 px-1">
                <span>全く当てはまらない</span>
                <span>完全に当てはまる</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
