'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LevelTwoPage() {
  const [number1, setNumber1] = useState(0); // First number in the addition
  const [number2, setNumber2] = useState(0); // Second number (multiple of 10s)
  const [userAnswer, setUserAnswer] = useState(''); // User's inputted answer
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Whether the answer is correct or not
  const [score, setScore] = useState(0); // Total correct answers
  const [attempts, setAttempts] = useState(0); // Total attempts made
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Controls whether the submit button is disabled
  const [showPopup, setShowPopup] = useState(false); // Show congratulation popup when moving to the next level
  const [showHelp, setShowHelp] = useState(false); // Toggle for displaying the help box

  const helpRef = useRef<HTMLDivElement>(null); // Ref for the help box
  const inputRef = useRef<HTMLInputElement>(null); // Ref for focusing the input field automatically

  const router = useRouter(); // Router instance for navigation

  // Generate numbers when the component mounts
  useEffect(() => {
    generateNumbers();
  }, []);

  // Focus the input field whenever the question changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCorrect]);

  // Check if the score reaches 10 and navigate to the next level
  useEffect(() => {
    if (score === 10) {
      setShowPopup(true); // Show popup
      setTimeout(() => {
        router.push('/level_three'); // Navigate to level 3
      }, 3000);
    }
  }, [score, router]);

  // Close the help box when clicking outside of it
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setShowHelp(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Generate random numbers for the question
  function generateNumbers() {
    const num1 = Math.floor(Math.random() * 21) + 10; // Random number between 10 and 30
    const multiplesOf10 = [10, 20, 30, 40, 50]; // Possible values for number2
    const num2 = multiplesOf10[Math.floor(Math.random() * multiplesOf10.length)];

    setNumber1(num1);
    setNumber2(num2);

    setIsButtonDisabled(false); // Enable the submit button
  }

  // Calculate the correct answer
  const correctAnswer = number1 + number2;

  // Handle submit button click
  function handleSubmit() {
    setAttempts(attempts + 1); // Increment attempts
    setIsButtonDisabled(true); // Disable the button temporarily

    // Check if the user's answer is correct
    if (parseInt(userAnswer) === correctAnswer) {
      setIsCorrect(true);
      setScore(score + 1); // Increment score
      playSound('success'); // Play success sound
    } else {
      setIsCorrect(false);
      playSound('wrong'); // Play wrong sound
    }

    // Generate a new question after 3 seconds
    setTimeout(() => {
      handleRetry();
    }, 3000);
  }

  // Reset the game state for the next question
  function handleRetry() {
    generateNumbers();
    setUserAnswer(''); // Clear the input
    setIsCorrect(null); // Reset correctness
  }

  // Play sound based on success or wrong answer
  function playSound(type: 'success' | 'wrong') {
    const soundPath = type === 'success' ? '/success-sound.mp3' : '/wrong-sound.mp3';
    const audio = new Audio(soundPath);
    audio.play();
  }

  // Render the help box with numbers from 1 to 100
  function renderHelpBox() {
    if (!showHelp) return null;

    return (
      <div
        ref={helpRef}
        className="absolute bg-white/95 border border-gray-300 rounded-lg shadow-lg p-4 top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md h-auto max-h-[300px] overflow-y-auto"
      >
        <div className="text-center text-lg font-semibold mb-4">
          Question: {number1} + {number2}
        </div>
        <div className="grid grid-cols-10 gap-x-4 text-center text-xs font-medium">
          {Array.from({ length: 10 }).map((_, column) => (
            <div key={column} className="flex flex-col gap-1">
              {Array.from({ length: 10 }).map((_, row) => {
                const value = column * 10 + row + 1;
                return (
                  <div
                    key={value}
                    className={`p-1 ${
                      value === number1
                        ? 'bg-green-500 text-white rounded-full shadow-lg'
                        : 'text-gray-800'
                    }`}
                    style={{ minWidth: '1.5rem', minHeight: '1rem', lineHeight: '1rem' }}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render the figure box for number2
  function renderFigures(count: number) {
    return (
      <div className="w-16 h-24 border border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50">
        {Array.from({ length: count / 10 }).map((_, index) => (
          <div
            key={index}
            className="w-6 h-6 bg-red-500 rounded-full mb-1 last:mb-0"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-pink-200 to-yellow-300 flex items-center justify-center px-4 relative">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-lg w-full relative mt-4">
        
        {/* The Home link */}
      <div className="flex justify-between items-center"> 
  <Link
    href="../subjects/math"
    className="text-blue-600 underline italic transition hover:text-blue-800 bg-yellow-100 font-cursive ml-auto"
  >
    Back
  </Link>
</div>
        
        
        
        {/* Title Section */}
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-2 text-gray-800">
          Level Two: Fun Addition!
        </h1>
        <p className="text-sm sm:text-base text-center mb-6 text-gray-500">(counts of 10s)</p>

        {/* Score Section */}
        <p className="text-base sm:text-lg font-semibold text-center mb-4 text-gray-700">
          Score: {score} / {attempts}
        </p>

        {/* Question Section */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-2xl sm:text-3xl font-bold text-gray-800">{number1} + {number2}</div>
          {renderFigures(number2)}
        </div>

        {/* Placeholder for the answer */}
        <div className="text-2xl sm:text-3xl font-bold text-green-600 text-center mb-4">?</div>

        {/* Input Section */}
        <p className="text-gray-600 mb-2 sm:mb-4 text-center">Find the total</p>
        <input
          ref={inputRef}
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your Answer"
          className="border border-gray-300 rounded-md px-3 py-2 w-full mb-3 text-center text-sm sm:text-base text-gray-800"
        />

        {/* Feedback Section */}
        {isCorrect === true && (
          <p className="text-green-600 font-semibold text-center">Correct! Great job! 🎉</p>
        )}
        {isCorrect === false && (
          <p className="text-red-600 font-semibold text-center">
            Oops! Try again. 😅 The correct answer is{' '}
            <span className="text-blue-600 font-bold">{correctAnswer}</span>.
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md shadow hover:bg-gray-600"
          >
            Help
          </button>
          <button
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className={`px-5 py-2 rounded-md shadow transition duration-200 ${
              isButtonDisabled
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Submit
          </button>
        </div>

        {/* Help Box */}
        {renderHelpBox()}

        {/* Congratulation Popup */}
        {showPopup && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4 text-green-600">Congratulations! 🎉</h2>
              <p className="text-lg text-gray-700">Moving to Level 3...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
