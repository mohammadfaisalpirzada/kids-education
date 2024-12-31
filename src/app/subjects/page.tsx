
// subject.tsx file

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubjectSelectionPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  // Fetch the stored username from localStorage when the component mounts
  useEffect(() => {
    try {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName); // Set the username if found
      } else {
        // If no username is found, redirect back to the homepage
        router.push('/');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      router.push('/'); // Redirect to homepage in case of error
    }
  }, [router]);

  // Handle subject selection
  const handleSubjectSelection = (subject: string) => {
    // Redirect to the relevant subject page (e.g., Math)
    router.push(`/subjects/${subject}`);
  };

  // Handle change of username
  const handleChangeName = () => {
    try {
      localStorage.removeItem('userName'); // Remove username from localStorage
      router.push('/'); // Redirect back to the home page to enter a new name
    } catch (error) {
      console.error('Error removing userName from localStorage:', error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400 via-red-300 to-purple-400 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {/* Display the username */}
        {userName && (
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Hello, {userName}!
          </h1>
        )}

        {/* Message to choose a subject */}
        <p className="text-lg text-gray-600 mb-6">
          What would you like to learn today? Choose a subject to get started.
        </p>

        {/* Vertically aligned subject selection buttons */}
        <div className="flex flex-col space-y-4 mb-4">
          <button
            onClick={() => handleSubjectSelection('math')}
            aria-label="Select Mathematics"
            className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            Mathematics
          </button>
          <button
            onClick={() => handleSubjectSelection('english')}
            aria-label="Select English"
            className="bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
          >
            English
          </button>
          <button
            onClick={() => handleSubjectSelection('urdu')}
            aria-label="Select Urdu"
            className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-orange-600 transition duration-200"
          >
            Urdu
          </button>
        </div>

        {/* Change Name text */}
        <p
          onClick={handleChangeName} // Clicking text triggers name change
          className="mt-6 text-sm text-red-500 underline hover:text-red-600 cursor-pointer"
        >
          Change Name
        </p>
      </div>
    </main>
  );
}
