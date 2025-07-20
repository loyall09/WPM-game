'use client';

import { useEffect, useState, useRef } from 'react';

const sentences = [
  'The quick brown fox jumps over the lazy dog.',
  'Typing games are fun and improve your speed.',
  'React with Next.js makes frontend powerful.'
];

export default function TypingGame() {
  const [sentence, setSentence] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSentence(sentences[Math.floor(Math.random() * sentences.length)]);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (userInput.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    if (userInput === sentence) {
      const elapsedTime = (Date.now() - (startTime || Date.now())) / 1000 / 60;
      const wordCount = sentence.split(' ').length;
      setWpm(Math.round(wordCount / elapsedTime));
      calculateAccuracy();
      setIsFinished(true);
    }
  }, [userInput]);

  const calculateAccuracy = () => {
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === sentence[i]) {
        correctChars++;
      }
    }
    const acc = Math.round((correctChars / userInput.length) * 100);
    setAccuracy(acc);
  };

  const restartGame = () => {
    const newSentence = sentences[Math.floor(Math.random() * sentences.length)];
    setSentence(newSentence);
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(0);
    setIsFinished(false);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="min-h-screen p-10 flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl mb-6 font-bold">Typing Speed Test</h1>
      <p className="mb-4 text-lg text-gray-700">{sentence}</p>
      <input
        ref={inputRef}
        className="border p-2 w-full max-w-xl text-lg rounded"
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        disabled={isFinished}
      />
      {isFinished && (
        <div className="mt-4 text-center">
          <p className="text-green-600 font-semibold">🎉 Finished!</p>
          <p>Your speed: <strong>{wpm} WPM</strong></p>
          <p>Your accuracy: <strong>{accuracy}%</strong></p>
          <button
            onClick={restartGame}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
