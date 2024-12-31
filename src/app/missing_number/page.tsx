'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LevelOnePage() {
  // State variables for the numbers, user answer, and game state
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isNumber2Left, setIsNumber2Left] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [figureColor, setFigureColor] = useState('');
  const [figureShape, setFigureShape] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Use useMemo to memoize the colors and shapes arrays
  const colors = useMemo(() => ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'], []);
  const shapes = useMemo(() => ['circle', 'square', 'rounded-square', 'triangle'], []);

  // Initialize the game by generating random numbers and figures
  const generateNumbers = useCallback(() => {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;

    if (num1 > num2) {
      setNumber1(num1);
      setNumber2(num2);
    } else {
      setNumber1(num2);
      setNumber2(num1);
    }

    setIsNumber2Left(Math.random() < 0.5);
    setIsButtonDisabled(false);
    setFigureColor(colors[Math.floor(Math.random() * colors.length)]);
    setFigureShape(shapes[Math.floor(Math.random() * shapes.length)]);
  }, [colors, shapes]); // Add 'colors' and 'shapes' to the dependency array

  useEffect(() => {
    generateNumbers();
  }, [generateNumbers]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCorrect]);

  useEffect(() => {
    if (score === 10) {
      router.push('/level_two'); // Navigate to next level
    }
  }, [score, router]);

  const correctAnswer = number1 - number2;

  function handleSubmit() {
    setAttempts(attempts + 1);
    setIsButtonDisabled(true);

    if (parseInt(userAnswer) === correctAnswer) {
      setIsCorrect(true);
      setScore(score + 1);
      playSound('success');
    } else {
      setIsCorrect(false);
      playSound('wrong');
    }

    setTimeout(() => {
      handleRetry();
    }, 3000);
  }

  function handleRetry() {
    generateNumbers();
    setUserAnswer('');
    setIsCorrect(null);
  }

  function playSound(type: 'success' | 'wrong') {
    const soundPath = type === 'success' ? '/success-sound.mp3' : '/wrong-sound.mp3';
    const audio = new Audio(soundPath);
    audio.play();
  }

  function renderFigures(count: number, highlightCount: number) {
    return Array.from({ length: count }, (_, i) => (
      <span
        key={i}
        className={`inline-block w-6 h-6 m-1 ${i < highlightCount ? figureColor : 'bg-gray-300'}`}
        style={{
          borderRadius: figureShape === 'circle' ? '50%' : figureShape === 'rounded-square' ? '8px' : '0',
          clipPath: figureShape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
        }}
      ></span>
    ));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-blue-200 to-purple-300 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-lg w-full">
        <div className="flex justify-between items-center">
          <Link
            href="../subjects/math"
            className="text-blue-600 underline italic transition hover:text-blue-800 bg-yellow-100 font-cursive ml-auto"
          >
            Back
          </Link>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4 text-gray-800">
          Find The Missing Number!
        </h1>
        <p className="text-base sm:text-lg font-semibold text-center mb-4 text-gray-700">
          Score: {score} / {attempts}
        </p>
        <div className="text-center">
          <div className="text-lg mb-2">
            <div className="font-bold text-lg text-gray-800 mb-2">(<strong>{number1}</strong>)</div>
            <div className="mt-2 flex flex-wrap justify-center">
              {renderFigures(number1, number2)}
            </div>

            <div
              className={`flex items-start justify-center mt-4 gap-12 ${isNumber2Left ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className="flex flex-col items-center min-h-[100px]">
                <div className="font-bold text-lg text-gray-800">( ? )</div>
                <div className="mt-2 flex flex-wrap justify-center h-[40px]"></div>
              </div>

              <div className="flex flex-col items-center min-h-[100px]">
                <div className="font-bold text-lg text-gray-800">({number2})</div>
                <div className="mt-2 flex flex-wrap justify-center h-[40px]">
                  {renderFigures(number2, number2)}
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-2 sm:mb-4">Find the missing number ( ? )</p>
          <input
            ref={inputRef}
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your Answer"
            className="border border-gray-300 rounded-md px-3 py-2 w-full mb-3 text-center text-sm sm:text-base"
          />
          {isCorrect === true && (
            <p className="text-green-600 font-semibold">Correct! Great job! 🎉</p>
          )}
          {isCorrect === false && (
            <p className="text-red-600 font-semibold">
              Oops! Try again. 😅 The correct answer is{' '}
              <span className="text-blue-600 font-bold">{correctAnswer}</span>.
            </p>
          )}
          <div className="flex justify-center space-x-4 mt-2">
            <button
              onClick={handleSubmit}
              disabled={isButtonDisabled}
              className={`px-5 py-2 rounded-md shadow transition duration-200 ${isButtonDisabled ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
