import React, { useState } from 'react';
import styles from './PasswordInput.module.css';

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = 'Enter password', 
  name = 'password',
  required = false,
  className = '',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className={styles.passwordContainer}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        required={required}
        className={`${styles.passwordInput} ${className}`}
        {...props}
      />
      <button 
        type="button"
        className={styles.toggleButton}
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {/* Simplified eye icon to prevent duplicates */}
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

export default PasswordInput;