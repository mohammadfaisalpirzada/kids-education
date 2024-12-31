// page.tsx - User Name Input and Redirect to Subject Selection

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  // Check if user name is already stored in localStorage and redirect
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      // If the user name is already entered, redirect to subject selection page
      router.push('/subjects');
    }
  }, [router]);

  // Handle name submission and redirect to subject selection
  const handleStart = () => {
    if (userName.trim().length >= 3) {
      // Save the user name to localStorage to persist it across sessions
      localStorage.setItem('userName', userName);

      // Redirect the user to the subject selection page
      router.push('/subjects');
    }
  };

  // Function to handle "Enter" key press for form submission
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userName.trim().length >= 3) {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-red-300 to-purple-400">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome!</h1>
        <p className="text-lg text-gray-600 mb-6">Enter your name to start practicing.</p>
        
        {/* User name input field */}
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)} // Update state on user input
          onKeyDown={handleKeyPress} // Trigger the "Enter" key press handler
          placeholder="Your Name"
          className="border border-gray-300 rounded-md px-4 py-2 w-full mb-4 text-center text-lg"
        />
        
        {/* Submit button to start practicing */}
        <button
          onClick={handleStart} // Trigger handleStart function on click
          disabled={userName.trim().length < 3} // Disable button if the username is too short
          className={`py-2 px-6 rounded-lg shadow-md text-white font-semibold transition duration-200 ${
            userName.trim().length >= 3
              ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' // Enable button style when valid
              : 'bg-gray-400 cursor-not-allowed' // Disable button style when invalid
          }`}
        >
          Start Practicing
        </button>
      </div>
    </div>
  );
}
