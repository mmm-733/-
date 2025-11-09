import React from 'react';
import { PersonalityResult } from '../types';

interface ResultScreenProps {
  result: PersonalityResult;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 animate-fade-in">
      <div className="bg-brand-surface p-8 md:p-12 rounded-2xl shadow-2xl max-w-3xl w-full animate-slide-in">
        <div className="text-center mb-8">
          <p className="text-lg text-brand-text-secondary">あなたの死生観タイプは</p>
          <h1 className="text-6xl md:text-7xl font-bold text-brand-primary my-2">{result.type}</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-brand-secondary">{result.title}</h2>
        </div>
        
        <div className="prose prose-invert max-w-none text-brand-text-secondary text-lg leading-relaxed space-y-4">
          {result.description.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={onRestart}
            className="bg-brand-primary text-brand-bg font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            もう一度診断する
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
