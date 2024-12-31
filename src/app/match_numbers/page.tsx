'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function LevelZeroPage() {
  const [leftNumbers, setLeftNumbers] = useState<number[]>([]); // Numbers in the left column
  const [rightNumbers, setRightNumbers] = useState<number[]>([]); // Numbers in the right column
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null); // Selected index from left column
  const [selectedRight, setSelectedRight] = useState<number | null>(null); // Selected index from right column
  const [matches, setMatches] = useState<{ [key: number]: number }>({}); // User matches
  const [feedback, setFeedback] = useState<string | null>(null); // Feedback message
  const [correctCount, setCorrectCount] = useState(0); // Number of correct matches
  const [wrongCount, setWrongCount] = useState(0); // Number of incorrect matches

  // Memoize the generateNumbers function to avoid unnecessary re-renders
  const generateNumbers = useCallback(() => {
    const numbers = shuffleArray([...Array(9).keys()].map((n) => n + 1)); // Unique numbers 1-9
    setLeftNumbers(numbers);
    setRightNumbers(shuffleArray([...numbers])); // Shuffle for random order
    setMatches({}); // Reset matches
    setSelectedLeft(null); // Reset selected items
    setSelectedRight(null);
    setFeedback(null); // Reset feedback
    setCorrectCount(0); // Reset correct count
    setWrongCount(0); // Reset wrong count
  }, []); // Empty dependency array means it won't change

  // Generate random numbers when the component mounts
  useEffect(() => {
    generateNumbers();
  }, [generateNumbers]); // Add generateNumbers to dependencies to ensure it's up-to-date

  // Shuffle array utility function
  function shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Handle selection from either column
  function handleSelect(column: 'left' | 'right', index: number) {
    if (column === 'left' && !Object.keys(matches).includes(index.toString())) {
      setSelectedLeft(index);
      playSound(leftNumbers[index]); // Play number sound
    } else if (column === 'right' && !Object.values(matches).includes(index)) {
      setSelectedRight(index);
      playSound(rightNumbers[index]); // Play number sound
    }

    if (selectedLeft !== null && column === 'right' && !Object.values(matches).includes(index)) {
      if (leftNumbers[selectedLeft] === rightNumbers[index]) {
        setMatches((prevMatches) => ({ ...prevMatches, [selectedLeft]: index })); 
        setCorrectCount(correctCount + 1); 
        playSound(leftNumbers[selectedLeft]); // Play matching number sound
      } else {
        setFeedback('Wrong match! Try again.');
        setWrongCount(wrongCount + 1);
        playSound('wrong'); // Play wrong sound
      }
      setSelectedLeft(null); // Reset selected left
      setSelectedRight(null); // Reset selected right
    } else if (selectedRight !== null && column === 'left' && !Object.keys(matches).includes(index.toString())) {
      if (rightNumbers[selectedRight] === leftNumbers[index]) {
        setMatches((prevMatches) => ({ ...prevMatches, [index]: selectedRight })); 
        setCorrectCount(correctCount + 1); 
        playSound(rightNumbers[selectedRight]); // Play matching number sound
      } else {
        setFeedback('Wrong match! Try again.');
        setWrongCount(wrongCount + 1);
        playSound('wrong'); // Play wrong sound
      }
      setSelectedLeft(null); // Reset selected left
      setSelectedRight(null); // Reset selected right
    }
  }

  // Play sound for numbers or success/wrong sound
  function playSound(type: number | 'success' | 'wrong' | 'clap') {
    const soundPath =
      typeof type === 'number'
        ? `/${type}.mp3` // Play specific number sound
        : type === 'success'
        ? '/success-sound.mp3'
        : type === 'wrong'
        ? '/wrong-sound.mp3'
        : '/clap-sound.mp3'; // Play clap sound
    const audio = new Audio(soundPath);
    audio.play();
  }

  // Check if all matches are done
  useEffect(() => {
    if (Object.keys(matches).length === leftNumbers.length && leftNumbers.length > 0) {
      playSound('clap'); // Play clap sound when all matches are completed
    }
  }, [matches, leftNumbers]);

  const allMatched = Object.keys(matches).length === leftNumbers.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-200 to-blue-300 flex items-center justify-center px-4 relative">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-2xl w-full">
        {/* The Home link */}
        <div className="flex justify-between items-center">
          <Link
            href="../subjects/math"
            className="text-blue-600 underline italic transition hover:text-blue-800 bg-yellow-100 font-cursive ml-auto">
            Back
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 text-indigo-800">Match the Numbers!</h1>

        {/* Matching Section */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <h2 className="text-lg font-semibold text-center mb-4 text-yellow-600">Column A</h2>
            <ul className="space-y-4">
              {leftNumbers.map((num, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect('left', index)}
                  className={`p-3 border-2 rounded-lg text-center text-xl font-bold cursor-pointer transition-transform transform hover:scale-105 ${
                    selectedLeft === index
                      ? 'bg-green-200 border-green-500'
                      : matches[index] !== undefined
                      ? 'bg-gray-300 cursor-not-allowed border-gray-400'
                      : 'bg-gray-100 border-gray-200'
                  }`}
                >
                  {num}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-lg font-semibold text-center mb-4 text-yellow-600">Column B</h2>
            <ul className="space-y-4">
              {rightNumbers.map((num, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect('right', index)}
                  className={`p-3 border-2 rounded-lg text-center text-xl font-bold cursor-pointer transition-transform transform hover:scale-105 ${
                    selectedRight === index
                      ? 'bg-green-200 border-green-500'
                      : Object.values(matches).includes(index)
                      ? 'bg-gray-300 cursor-not-allowed border-gray-400'
                      : 'bg-gray-100 border-gray-200'
                  }`}
                >
                  {num}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feedback Section */}
        {feedback && <p className={`text-center mt-4 text-lg font-semibold ${feedback.includes('Wrong') ? 'text-red-600' : 'text-green-600'}`}>{feedback}</p>}

        {/* Final Score Section */}
        {allMatched && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-indigo-800">Correct Matches: {correctCount}</p>
            <p className="text-lg font-semibold text-indigo-800">Wrong Matches: {wrongCount}</p>
            <button
              onClick={generateNumbers}
              className="mt-4 px-6 py-3 bg-pink-500 text-white font-bold rounded-md shadow hover:bg-pink-600 transition"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
