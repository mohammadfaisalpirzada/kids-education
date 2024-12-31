'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MathPage = () => {
  const [showSubjectSelection, setShowSubjectSelection] = useState(false);
  const [storedUserName, setStoredUserName] = useState<string | null>(null);
  const router = useRouter();

  // On component mount, check if the userName is stored in localStorage
  useEffect(() => {
    try {
      const nameFromStorage = localStorage.getItem('userName');
      if (nameFromStorage) {
        setStoredUserName(nameFromStorage);
      } else {
        // If no username is found, redirect back to the homepage
        router.push('/');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      router.push('/');
    }
  }, [router]);

  // Navigate to different levels of Math
  const navigateToLevel = (level: string) => {
    router.push(`/math/${level}`);
  };

  // Back button function to go back to the subject selection page
  const backButton = () => {
    setShowSubjectSelection(true);
  };

  // Handle redirection after state change
  useEffect(() => {
    if (showSubjectSelection) {
      router.push('/subjects');
    }
  }, [showSubjectSelection, router]);

  // Don't render anything until we have the username
  if (!storedUserName) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center p-6 sm:p-10 bg-gradient-to-br from-yellow-400 via-red-300 to-purple-400 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        {/* Display user name */}
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Hello, {storedUserName}!
        </h1>

        {/* Math skills message */}
        <p className="text-xl text-gray-600 mb-8">
          Test your math skills and have fun! Choose a level to get started.
        </p>

        {/* Buttons for various Math levels */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigateToLevel('match_numbers')}
            className="bg-pink-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-pink-600 transition duration-200"
          >
            Match the Numbers!
          </button>
          <button
            onClick={() => navigateToLevel('missing_number')}
            className="bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            Find the Missing Number!
          </button>
          <button
            onClick={() => navigateToLevel('counts_10')}
            className="bg-green-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
          >
            Counts of 10s
          </button>
          <button
            onClick={() => navigateToLevel('tables')}
            className="bg-orange-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-orange-600 transition duration-200"
          >
            Tables
          </button>
        </div>

        {/* Back button to go back to the subject selection page */}
        <button
          onClick={backButton}
          className="mt-6 text-sm text-red-500 underline hover:text-red-600 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MathPage;