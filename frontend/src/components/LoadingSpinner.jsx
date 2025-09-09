import React from 'react';

const LoadingSpinner = ({ size = 'normal', text = 'Loading...' }) => {
  const sizeClass = size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-8 h-8' : 'w-6 h-6';
  
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`spinner ${sizeClass}`}></div>
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
