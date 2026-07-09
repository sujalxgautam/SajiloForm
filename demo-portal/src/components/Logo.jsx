import React from 'react';

const Logo = ({ size = 100 }) => {   // Changed default to 100px
  return (
    <img
      src="/logo.png"
      alt="SajiloForm Logo"
      width={size}
      height={size}
      style={{
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0, // Prevents shrinking in flex layouts
      }}
    />
  );
};

export default Logo;