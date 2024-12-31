'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UsernameInputProps {
  userName: string;
  setUserName: (name: string) => void;
  setIsNameEntered: (isEntered: boolean) => void;
}

export default function UsernameInput({ userName, setUserName, setIsNameEntered }: UsernameInputProps) {
  const router = useRouter();

  // Load the stored user name from localStorage on mount
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, [setUserName]); // Added setUserName to dependency array

  const handleStart = () => {
    if (userName.trim().length >= 3) {
      localStorage.setItem('userName', userName); // Save name
      localStorage.setItem('isNameEntered', 'true'); // Mark as entered
      setIsNameEntered(true);
      router.push('/'); // Redirect to main page
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-6 sm:p-10 bg-gradient-to-br from-yellow-400 via-red-300 to-purple-400 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome!</h1>
        <p className="text-xl text-gray-600 mb-6">Enter your name to start practicing.</p>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Your Name"
          className="w-full p-4 rounded-lg border-2 border-gray-300 mb-6 text-lg text-center"
        />
        {userName.trim().length < 3 && (
          <p className="text-red-500 text-sm mb-4">Name must be at least 3 characters long.</p>
        )}
        <button
          onClick={handleStart}
          disabled={userName.trim().length < 3}
          className={`py-2 px-6 rounded-lg shadow-md text-white font-semibold transition duration-200 ${
            userName.trim().length >= 3
              ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Start Practicing
        </button>
      </div>
    </div>
  );
}
