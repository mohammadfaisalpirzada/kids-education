'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

export default function TablesPage() {
  // --------- State Variables ---------
  const [selectedTable, setSelectedTable] = useState<number | null>(null); // Selected table
  const [isPlaying, setIsPlaying] = useState(false); // Track if speech is playing
  const [isMemorizing, setIsMemorizing] = useState(false); // Track if memorization is active
  const [speechRate, setSpeechRate] = useState(0.75); // Control speech rate
  const [volume, setVolume] = useState(1.0); // Control speech volume
  const [isHydrated, setIsHydrated] = useState(false); // Ensure hydration

  // --------- Refs ---------
  const loopRef = useRef<boolean>(false); // Track memorization loop state
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null); // Current utterance ref

  // --------- Effects ---------

  // Initialize state from localStorage
  useEffect(() => {
    setIsHydrated(true);

    // Retrieve stored states
    const savedTable = localStorage.getItem('selectedTable');
    const savedIsPlaying = localStorage.getItem('isPlaying') === 'true';
    const savedIsMemorizing = localStorage.getItem('isMemorizing') === 'true';
    const savedSpeechRate = parseFloat(localStorage.getItem('speechRate') || '0.75');
    const savedVolume = parseFloat(localStorage.getItem('volume') || '1.0');

    // Restore states
    if (savedTable) setSelectedTable(parseInt(savedTable, 10));
    setSpeechRate(savedSpeechRate);
    setVolume(savedVolume);
    setIsMemorizing(savedIsMemorizing);
    setIsPlaying(savedIsPlaying);
  }, []);

  // Update speech properties dynamically
  const updateUtteranceProperties = useCallback(() => {
    if (utteranceRef.current && speechSynthesis.speaking) {
      utteranceRef.current.rate = speechRate;
      utteranceRef.current.volume = volume;
      speechSynthesis.cancel();
      speechSynthesis.speak(utteranceRef.current);
    }
  }, [speechRate, volume]);

  useEffect(() => {
    localStorage.setItem('speechRate', speechRate.toString());
    localStorage.setItem('volume', volume.toString());
    updateUtteranceProperties(); // Ensure this is updated correctly
  }, [speechRate, volume, updateUtteranceProperties]); // Add updateUtteranceProperties as a dependency

  // Cleanup on component unmount
  const stopMemorizing = useCallback(() => {
    setIsMemorizing(false);
    loopRef.current = false;
    localStorage.setItem('isMemorizing', 'false');
    stopSpeech();
  }, []);

  useEffect(() => {
    return () => {
      stopMemorizing(); // Add stopMemorizing as a cleanup function
      stopSpeech();
    };
  }, [stopMemorizing]); // Add stopMemorizing to the dependency array

  // --------- Helper Functions ---------

  // Generate multiplication table
  const generateTable = (table: number) => {
    return Array.from({ length: 12 }, (_, i) => `${table} x ${i + 1} = ${table * (i + 1)}`);
  };

  // Speak the table
  const speakTable = (table: number, onComplete?: () => void) => {
    if (utteranceRef.current && speechSynthesis.speaking) return; // Prevent restarting

    speechSynthesis.cancel(); // Cancel ongoing speech

    // Convert table to speech format
    const tableLines = generateTable(table).map((line) =>
      line.replace('x', 'times').replace('=', 'equals')
    );
    const tableText = tableLines.join('. ');

    const utterance = new SpeechSynthesisUtterance(tableText);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;
    utterance.volume = volume;

    utteranceRef.current = utterance;

    utterance.onstart = () => {
      setIsPlaying(true);
      localStorage.setItem('isPlaying', 'true');
    };

    utterance.onend = () => {
      setIsPlaying(false);
      localStorage.setItem('isPlaying', 'false');
      if (onComplete) onComplete(); // Call onComplete callback when finished
    };

    speechSynthesis.speak(utterance);
  };

  // Stop speech playback
  const stopSpeech = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    localStorage.setItem('isPlaying', 'false');
  };

  // Memorize table: Loop playback
  const memorizeTable = (table: number) => {
    if (isMemorizing) return;

    setIsMemorizing(true);
    localStorage.setItem('isMemorizing', 'true');
    loopRef.current = true;

    const loop = () => {
      if (loopRef.current) {
        speakTable(table, loop); // Restart loop after table finishes
      }
    };

    loop(); // Start the loop
  };

  // Handle table selection
  const handleTableSelection = (table: number) => {
    setSelectedTable(table);
    localStorage.setItem('selectedTable', table.toString());
  };

  // Handle returning to table selection
  const handleBackToTable = () => {
    stopSpeech(); // Stop any ongoing speech
    stopMemorizing(); // Stop memorization loop
    setSelectedTable(null); // Reset selected table
    localStorage.removeItem('selectedTable'); // Clear the stored table
  };

  // --------- Render ---------

  if (!isHydrated) return null; // Prevent SSR issues

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-200 to-blue-300 relative px-4">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200 font-medium z-10"
      >
        Back
      </Link>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-start pt-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-gray-800 text-center">
          Multiplication Tables
        </h1>

        {/* Table Selection */}
        {!selectedTable ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-md sm:max-w-4xl px-4">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((tableNumber) => (
              <button
                key={tableNumber}
                onClick={() => handleTableSelection(tableNumber)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-4 w-full rounded-lg shadow-md hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 text-lg sm:text-xl"
              >
                Table of {tableNumber}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* Table Content */}
            <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md mb-6">
              <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
                Table of {selectedTable}
              </h2>
              <ul className="text-lg font-semibold text-gray-700 space-y-4">
                {generateTable(selectedTable).map((line, index) => (
                  <li key={index} className="text-center">
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            {/* Playback Buttons */}
            <div className="flex space-x-4 mb-6">
              {!isPlaying ? (
                <button
                  onClick={() => speakTable(selectedTable!)}
                  className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
                >
                  Speak Table
                </button>
              ) : (
                <button
                  onClick={stopSpeech}
                  className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                >
                  Stop
                </button>
              )}
              {!isMemorizing ? (
                <button
                  onClick={() => memorizeTable(selectedTable!)}
                  className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                >
                  Memorize Table
                </button>
              ) : (
                <button
                  onClick={stopMemorizing}
                  className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                >
                  Stop Memorizing
                </button>
              )}
              <button
                onClick={handleBackToTable}
                className="bg-yellow-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200"
              >
                Back to Tables
              </button>
            </div>

            {/* Volume and Speed Controls */}
            {(isPlaying || isMemorizing) && (
              <div className="flex flex-col items-center space-y-6 w-full max-w-md mb-12">
                <div className="flex flex-col items-center space-y-2">
                  <label
                    htmlFor="volumeControl"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Volume: {(volume * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    id="volumeControl"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-64 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <label
                    htmlFor="speechRate"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Speed: {speechRate.toFixed(2)}x
                  </label>
                  <input
                    type="range"
                    id="speechRate"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-64 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Back link */}
      <div className="flex justify-center items-center h-full mt-10"> 
        <Link
          href="../subjects/math"
          className="text-blue-600 underline italic transition hover:text-blue-800 font-cursive"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
