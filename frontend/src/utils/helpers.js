import clsx from 'clsx';

// Utility function for conditional class names
export const cn = (...inputs) => {
  return clsx(inputs);
};

// Validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const maxLength = password.length <= 16;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  return {
    isValid: minLength && maxLength && hasUpperCase && hasSpecialChar,
    errors: {
      minLength: !minLength ? 'Password must be at least 8 characters' : null,
      maxLength: !maxLength ? 'Password must be at most 16 characters' : null,
      hasUpperCase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
      hasSpecialChar: !hasSpecialChar ? 'Password must contain at least one special character' : null,
    }
  };
};

export const validateName = (name) => {
  const minLength = name.length >= 5;
  const maxLength = name.length <= 60;
  
  return {
    isValid: minLength && maxLength,
    errors: {
      minLength: !minLength ? 'Name must be at least 5 characters' : null,
      maxLength: !maxLength ? 'Name must be at most 60 characters' : null,
    }
  };
};

export const validateAddress = (address) => {
  const maxLength = address.length <= 400;
  
  return {
    isValid: maxLength,
    errors: {
      maxLength: !maxLength ? 'Address must be at most 400 characters' : null,
    }
  };
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format rating
export const formatRating = (rating) => {
  return parseFloat(rating).toFixed(1);
};

// Generate star rating display
export const generateStars = (rating, interactive = false, onStarClick = null) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 1; i <= 5; i++) {
    let starClass = 'star';
    if (i <= fullStars) {
      starClass += ' filled';
    } else if (i === fullStars + 1 && hasHalfStar) {
      starClass += ' half-filled';
    }
    
    stars.push(
      <span
        key={i}
        className={starClass}
        onClick={interactive && onStarClick ? () => onStarClick(i) : undefined}
        style={{ cursor: interactive ? 'pointer' : 'default' }}
      >
        ★
      </span>
    );
  }
  
  return stars;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Sort options
export const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'address', label: 'Address' },
  { value: 'created_at', label: 'Created Date' },
  { value: 'rating', label: 'Rating' }
];

export const sortOrderOptions = [
  { value: 'ASC', label: 'Ascending' },
  { value: 'DESC', label: 'Descending' }
];
