import React from 'react';

const Logo = ({ size = 40 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle with gradient */}
      <circle cx="100" cy="100" r="100" fill="url(#logoGradient)"/>
      
      {/* Document icon */}
      <rect x="55" y="50" width="90" height="100" rx="8" fill="white" opacity="0.9"/>
      <rect x="65" y="65" width="70" height="8" rx="4" fill="#4F46E5" opacity="0.6"/>
      <rect x="65" y="80" width="70" height="8" rx="4" fill="#4F46E5" opacity="0.4"/>
      <rect x="65" y="95" width="50" height="8" rx="4" fill="#4F46E5" opacity="0.3"/>
      
      {/* AI Sparkle */}
      <circle cx="140" cy="45" r="12" fill="white" opacity="0.9"/>
      <path d="M140 35V55M130 45H150" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round"/>
      
      {/* Decorative dots */}
      <circle cx="155" cy="70" r="6" fill="white" opacity="0.6"/>
      <circle cx="160" cy="90" r="4" fill="white" opacity="0.4"/>
      <circle cx="155" cy="110" r="5" fill="white" opacity="0.5"/>
      
      {/* Gradients */}
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="200" y2="200">
          <stop offset="0%" stopColor="#4F46E5"/>
          <stop offset="50%" stopColor="#7C3AED"/>
          <stop offset="100%" stopColor="#EC4899"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
