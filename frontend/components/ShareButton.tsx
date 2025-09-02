"use client";

import React from 'react';
import { FaShare } from 'react-icons/fa';

interface ShareButtonProps {
  title: string;
  content: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, content }) => {
  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <button
      onClick={sharePost}
      className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
    >
      <FaShare className="mr-2" size={12} />
      Share
    </button>
  );
};

export default ShareButton;
