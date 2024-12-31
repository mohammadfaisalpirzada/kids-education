'use client';
import React, { useState, useEffect } from 'react';

const GenderLearningGame = ({ onNavigateBack }) => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [score, setScore] = useState(0);
  const [gameMode, setGameMode] = useState('learning');
  const [learningPairs, setLearningPairs] = useState([]);
  const [shuffledPairs, setShuffledPairs] = useState({ masculine: [], feminine: [] });
  const [matchedPairs, setMatchedPairs] = useState(new Set());
  const [disabledAll, setDisabledAll] = useState(false);

  const genderPairs = [
    { masculine: "Boy", feminine: "Girl" },
    { masculine: "Husband", feminine: "Wife" },
    { masculine: "Man", feminine: "Woman" },
    { masculine: "Father", feminine: "Mother" },
    { masculine: "King", feminine: "Queen" },
    { masculine: "Uncle", feminine: "Aunt" },
    { masculine: "Son", feminine: "Daughter" },
    { masculine: "Brother", feminine: "Sister" },
    { masculine: "Grandfather", feminine: "Grandmother" },
    { masculine: "Prince", feminine: "Princess" },
    { masculine: "Ox", feminine: "Cow" },
    { masculine: "Sir", feminine: "Madam" },
    { masculine: "Hero", feminine: "Heroine" },
    { masculine: "Master", feminine: "Mistress" },
    { masculine: "Hunter", feminine: "Huntress" },
    { masculine: "Actor", feminine: "Actress" },
    { masculine: "Peacock", feminine: "Peahen" },
    { masculine: "Waiter", feminine: "Waitress" },
    { masculine: "Bull", feminine: "Cow" },
    { masculine: "Drake", feminine: "Duck" },
    { masculine: "Gentleman", feminine: "Lady" },
    { masculine: "Grandson", feminine: "Granddaughter" },
    { masculine: "Wizard", feminine: "Witch" },
    { masculine: "Rooster", feminine: "Hen" },
    { masculine: "Lion", feminine: "Lioness" },
    { masculine: "Tiger", feminine: "Tigress" },
    { masculine: "Dog", feminine: "Bitch" },
    { masculine: "Horse", feminine: "Mare" },
    { masculine: "Fox", feminine: "Vixen" },
    { masculine: "Ram", feminine: "Ewe" },
    { masculine: "Daddy", feminine: "Mommy" },
    { masculine: "Goat", feminine: "Nanny Goat" },
    { masculine: "Bear", feminine: "She-Bear" },
    { masculine: "Stallion", feminine: "Mare" },
    { masculine: "Gander", feminine: "Goose" }
  ];

  useEffect(() => {
    if (gameMode === 'learning') {
      generateLearningPairs();
    } else {
      generateRandomPairs();
    }
  }, [gameMode]);

  const generateLearningPairs = () => {
    const randomPairs = genderPairs.sort(() => Math.random() - 0.5).slice(0, 6);
    setLearningPairs(randomPairs);
  };

  const generateRandomPairs = () => {
    const shuffledMasculine = genderPairs.sort(() => Math.random() - 0.5).slice(0, 5);
    const shuffledFeminine = shuffledMasculine
      .map((pair) => pair.feminine)
      .sort(() => Math.random() - 0.5);
    setShuffledPairs({ masculine: shuffledMasculine, feminine: shuffledFeminine });
    setMatchedPairs(new Set());
  };

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-GB';
    speechSynthesis.speak(utterance);
  };

  const handleLearningClick = (index) => {
    if (disabledAll) return;
    const { masculine, feminine } = learningPairs[index];
    setDisabledAll(true);
    speakWord(masculine);
    setTimeout(() => {
      speakWord(feminine);
      const unusedPairs = genderPairs.filter((pair) => !learningPairs.includes(pair));
      const newPair = unusedPairs[Math.floor(Math.random() * unusedPairs.length)];
      setLearningPairs((prev) => {
        const updated = [...prev];
        updated[index] = newPair;
        return updated;
      });
      setDisabledAll(false);
    }, 1000);
  };

  const handleMatchingClick = (word, type, index) => {
    if (!selectedWord) {
      setSelectedWord({ word, type, index });
      speakWord(word);
    } else {
      const { word: prevWord, type: prevType, index: prevIndex } = selectedWord;
      speakWord(word);

      const masculineIndex = prevType === 'masculine' ? prevIndex : index;
      const feminineIndex = prevType === 'feminine' ? prevIndex : index;
      const isMatch =
        shuffledPairs.masculine[masculineIndex].feminine ===
        shuffledPairs.feminine[feminineIndex];

      if (isMatch) {
        setMatchedPairs((prev) => new Set([...prev, masculineIndex]));
        setScore((prevScore) => prevScore + 1);
      } else {
        const wrongSound = new Audio('/wrong-sound.mp3');
        wrongSound.play();
      }

      setSelectedWord(null);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-400 via-blue-300 to-purple-400 p-4 sm:p-6 mt-16">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 w-full max-w-4xl">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setGameMode('learning')}
            className={`px-4 py-2 rounded-lg font-semibold mx-2 ${
              gameMode === 'learning' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Learning Mode
          </button>
          <button
            onClick={() => setGameMode('matching')}
            className={`px-4 py-2 rounded-lg font-semibold mx-2 ${
              gameMode === 'matching' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Matching Mode
          </button>
        </div>

        {gameMode === 'learning' && (
          <div className="space-y-4">
            {learningPairs.map((pair, idx) => (
              <button
                key={idx}
                onClick={() => handleLearningClick(idx)}
                disabled={disabledAll}
                className={`w-full p-3 rounded-lg text-lg font-semibold bg-gradient-to-r from-blue-100 to-pink-100 text-gray-800 hover:from-blue-200 hover:to-pink-200 ${
                  disabledAll ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {pair.masculine} - {pair.feminine}
              </button>
            ))}
          </div>
        )}

        {gameMode === 'matching' && (
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">Masculine</h2>
              <div className="space-y-4">
                {shuffledPairs.masculine.map((pair, idx) => (
                  <button
                    key={`m-${idx}`}
                    onClick={() => handleMatchingClick(pair.masculine, 'masculine', idx)}
                    disabled={matchedPairs.has(idx)}
                    className={`w-full p-4 rounded-lg text-lg font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 ${
                      matchedPairs.has(idx) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {pair.masculine}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-pink-600 mb-4 text-center">Feminine</h2>
              <div className="space-y-4">
                {shuffledPairs.feminine.map((word, idx) => (
                  <button
                    key={`f-${idx}`}
                    onClick={() => handleMatchingClick(word, 'feminine', idx)}
                    className={`w-full p-4 rounded-lg text-lg font-semibold bg-pink-100 text-pink-800 hover:bg-pink-200`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          {gameMode === 'matching' && <p className="text-lg font-semibold text-indigo-800">Score: {score}</p>}
        </div>

        <button
          onClick={onNavigateBack}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
        >
          Back to Subjects
        </button>
      </div>
    </div>
  );
};

export default GenderLearningGame;
