'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EnglishPage = () => {
  const [showSubjectSelection, setShowSubjectSelection] = useState(false);
  const [storedUserName, setStoredUserName] = useState<string | null>(null);
  const router = useRouter();

  // Effect to retrieve stored username from localStorage
  useEffect(() => {
    const nameFromStorage = localStorage.getItem('userName');
    if (nameFromStorage) {
      setStoredUserName(nameFromStorage);
    }
  }, []);

  // Function to navigate to the selected level
  const navigateToLevel = (level: string) => {
    router.push(`/english/${level}`);
  };

  // Effect to trigger the navigation to subjects page after state change
  useEffect(() => {
    if (showSubjectSelection) {
      router.push('/subjects');
    }
  }, [showSubjectSelection, router]);

  // Function for the back button
  const backButton = () => {
    setShowSubjectSelection(true); // Update the state to trigger navigation
  };

  return (
    <div className="flex flex-col justify-center items-center p-6 sm:p-10 bg-gradient-to-br from-green-400 via-blue-300 to-purple-400 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Hello, {storedUserName || 'Guest'}!
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Improve your English skills! Choose a topic to get started.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigateToLevel('nouns')}
            className="bg-yellow-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200"
          >
            Learn about Nouns!
          </button>
          <button
            onClick={() => navigateToLevel('verbs')}
            className="bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            Practice Verbs!
          </button>
          <button
            onClick={() => navigateToLevel('../gender')}
            className="bg-pink-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-pink-600 transition duration-200"
          >
            Understand Gender!
          </button>
        </div>

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

export default EnglishPage;
