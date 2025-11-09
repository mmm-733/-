import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Question, ShiseikanTrait, PersonalityResult, AnswerScore } from './types';
import { getQuizQuestions, getPersonalityDescription } from './services/geminiService';
import { SHISEIKAN_PAIRS } from './constants';

import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';
import SpinnerIcon from './components/icons/SpinnerIcon';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setIsFetchingQuestions(true);
    setError(null);
    try {
      const fetchedQuestions = await getQuizQuestions();
      setQuestions(fetchedQuestions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "不明なエラーが発生しました。");
    } finally {
      setIsFetchingQuestions(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = () => {
    if (questions.length > 0) {
      setAppState('quiz');
    } else {
      console.error("クイズを開始できません。質問が読み込まれていません。");
    }
  };

  const handleRestart = () => {
    setResult(null);
    setError(null);
    setAppState('start');
  };

  const handleQuizComplete = useCallback(async (userAnswers: AnswerScore[]) => {
    setAppState('loading');
    try {
      const traitScores: { [key in ShiseikanTrait]: number } = { D: 0, W: 0, S: 0, M: 0, A: 0, R: 0, I: 0, C: 0 };

      userAnswers.forEach(({ score, traitPair }) => {
        const [trait1, trait2] = traitPair;
        // スコアの中心を5.5とし、それからの距離を各特性のスコアとして加算
        if (score < 5.5) {
          traitScores[trait1] += (5.5 - score);
        } else {
          traitScores[trait2] += (score - 5.5);
        }
      });

      const personalityType = SHISEIKAN_PAIRS.map(([traitA, traitB]) => {
        // 死生観のペア（例：DとW）のスコアを比較し、高い方を採用
        return (traitScores[traitA] || 0) >= (traitScores[traitB] || 0) ? traitA : traitB;
      }).join('');

      const personalityResult = await getPersonalityDescription(personalityType);
      setResult(personalityResult);
      setAppState('result');
    } catch (e) {
      setError(e instanceof Error ? e.message : "結果の取得に失敗しました。");
      setAppState('error');
    }
  }, []);

  const renderContent = () => {
    if (isFetchingQuestions && appState === 'start') {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
          <SpinnerIcon className="w-12 h-12 text-brand-primary mb-4" />
          <p className="text-brand-text-secondary">診断を準備しています...</p>
        </div>
      );
    }

    if (error && appState !== 'result') { 
       return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative max-w-md">
            <strong className="font-bold">エラーが発生しました！</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <button
              onClick={() => {
                if (questions.length === 0) fetchQuestions();
                else handleRestart();
              }}
              className="mt-4 bg-brand-primary text-brand-bg font-bold py-2 px-4 rounded-full"
            >
              再試行
            </button>
          </div>
        </div>
      );
    }

    switch (appState) {
      case 'start':
        return <StartScreen onStart={handleStart} />;
      case 'quiz':
        return <QuizScreen questions={questions} onComplete={handleQuizComplete} />;
      case 'loading':
        return <LoadingScreen />;
      case 'result':
        return result ? <ResultScreen result={result} onRestart={handleRestart} /> : <LoadingScreen/>;
      case 'error':
         return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-4">
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative max-w-md">
                    <strong className="font-bold">問題が発生しました。</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                    <button onClick={handleRestart} className="mt-4 bg-brand-primary text-brand-bg font-bold py-2 px-4 rounded-full">
                        やり直す
                    </button>
                </div>
            </div>
        );
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <main className="font-sans antialiased">
      {renderContent()}
    </main>
  );
};

export default App;
