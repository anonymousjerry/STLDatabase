'use client';
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // <- from the ThemeProvider we discussed

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="relative inline-flex items-center cursor-pointer w-16 h-6">
      <input
        type="checkbox"
        checked={theme === 'dark'}
        onChange={toggleTheme}
        className="sr-only peer"
      />
      <div
        className="peer h-6 w-16 rounded-full bg-yellow-400 peer-checked:bg-gray-700 transition-colors duration-500"
      ></div>

      <div
        className="absolute  left-0 w-7 h-7 rounded-full bg-white text-yellow-400
        peer-checked:translate-x-9 peer-checked:text-blue-400
        flex items-center justify-center text-xl transition-all duration-500"
      >
        {theme === 'dark' ? (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 384 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M223.5 32C100 32 0 132.3 0 256s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="#facc15">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1a1 1 0 011 1v1a1 1 0 01-2 0V2a1 1 0 011-1zM12 21a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l.71.7a1 1 0 01-1.42 1.42l-.7-.71a1 1 0 010-1.41zM17.66 17.66a1 1 0 011.42 0l.71.7a1 1 0 01-1.42 1.42l-.7-.71a1 1 0 010-1.41zM1 12a1 1 0 011-1h1a1 1 0 110 2H2a1 1 0 01-1-1zM20 11h1a1 1 0 010 2h-1a1 1 0 010-2zM4.22 19.78a1 1 0 010-1.41l.71-.71a1 1 0 011.42 1.42l-.71.7a1 1 0 01-1.42 0zM19.78 4.22a1 1 0 010 1.41l-.71.71a1 1 0 01-1.42-1.42l.71-.7a1 1 0 011.42 0z" />
            </g>
          </svg>
        )}
      </div>
    </label>
  );
};

export default ThemeToggleButton;
