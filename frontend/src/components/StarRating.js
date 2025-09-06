import React from 'react';
import { generateStars } from '../utils/helpers';

const StarRating = ({ rating, onRatingChange, interactive = false, size = 'normal' }) => {
  const sizeClass = size === 'small' ? 'text-sm' : 'text-lg';
  
  return (
    <div className={`rating ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''} ${
            interactive ? 'cursor-pointer hover:scale-110' : ''
          } transition-transform`}
          onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
