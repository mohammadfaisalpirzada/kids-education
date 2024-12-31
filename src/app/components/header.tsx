'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Image component from Next.js

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // Track header visibility

  const menuItems = [
    { href: '/match_numbers', label: 'Match the Numbers!', color: 'bg-pink-500 hover:bg-pink-600' },
    { href: '/missing_number', label: 'Find the Missing Number!', color: 'bg-blue-500 hover:bg-blue-600' },
    { href: '/counts_10', label: 'Counts of 10s', color: 'bg-green-500 hover:bg-green-600' },
    { href: '/tables', label: 'Tables', color: 'bg-orange-500 hover:bg-orange-600' },
  ];

  // Hide header after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsHeaderVisible(false), 2000);
    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  // Show header on scroll or interaction
  useEffect(() => {
    const handleInteraction = () => setIsHeaderVisible(true);

    window.addEventListener('scroll', handleInteraction);
    document.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-red-600 text-white py-4 shadow-lg z-50 transition-transform duration-500 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo and Website Title */}
        <div className="flex items-center space-x-3">
          <Link href="/">
            {/* Use Next.js Image component */}
            <Image
              src="/logo.png"  // Path to your logo
              alt="Math Master Logo"
              width={48}  // Define width
              height={48} // Define height
              className="rounded-full shadow-md cursor-pointer"
            />
          </Link>
          <Link href="/" className="text-center flex flex-col">
            <span className="text-xl font-bold">Master Sahub</span>
            <span className="text-sm italic">(Learn Mathematics with Master Sahub)</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="flex items-center space-x-8">
          {/* Regular Links */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-yellow-300 transition-colors duration-200">
              Home
            </Link>
            <Link href="/contact" className="hover:text-yellow-300 transition-colors duration-200">
              Contact Us
            </Link>
          </nav>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:text-yellow-300 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-transparent bg-opacity-95 transform transition-transform duration-300 ease-in-out z-[999] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl`}
      >
        <div className="p-4 relative">
          {/* Close Button Positioned Properly */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 bg-transparent border-none text-white hover:text-gray-300 focus:outline-none z-[1000]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Menu Items */}
          <nav className="flex flex-col space-y-4 mt-14">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${item.color} text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-200 text-center`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Light Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-[998]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
