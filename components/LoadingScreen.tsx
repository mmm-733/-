import React from 'react';
import SpinnerIcon from './icons/SpinnerIcon';

const loadingMessages = [
  "あなたの哲学を分析しています...",
  "生と死の価値観を探っています...",
  "深層心理にアクセス中...",
  "あなただけの宇宙観を構築しています...",
  "答えは間もなく現れます...",
];

const LoadingScreen: React.FC = () => {
  const [message, setMessage] = React.useState(loadingMessages[0]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4 animate-fade-in">
      <SpinnerIcon className="w-16 h-16 text-brand-primary mb-6" />
      <h2 className="text-2xl font-semibold text-brand-text-secondary transition-opacity duration-500">{message}</h2>
    </div>
  );
};

export default LoadingScreen;
