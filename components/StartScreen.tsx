import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4 animate-fade-in">
      <div className="bg-brand-surface p-8 rounded-2xl shadow-2xl max-w-lg w-full animate-pop-in">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-4">あなたの死生観を探る</h1>
        <p className="text-lg text-brand-text-secondary mb-8">
          いくつかの質問を通して、あなたが「生と死」をどのように捉えているかを探求します。心の奥深くにある声に耳を傾け、直感でお答えください。
        </p>
        <button
          onClick={onStart}
          className="bg-brand-primary text-brand-bg font-bold py-3 px-8 rounded-full text-lg hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          診断を始める
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
