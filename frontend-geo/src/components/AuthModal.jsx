import React, { useState } from 'react';
import { loginUser, registerUser } from '../firebase/auth';
import { isValidUsername } from '../utils/profanityFilter';
import styles from './AuthModal.module.css';
import PasswordInput from './PasswordInput';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameValidation, setUsernameValidation] = useState({ valid: true, message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time username validation
    if (name === 'username') {
      const validation = isValidUsername(value);
      setUsernameValidation(validation);
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (isLogin) {
        result = await loginUser(formData.email, formData.password);
      } else {
        // Validate username before registration
        const usernameCheck = isValidUsername(formData.username);
        if (!usernameCheck.valid) {
          setError(usernameCheck.message);
          setLoading(false);
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }
        
        result = await registerUser(formData.email, formData.password, formData.username);
      }

      if (result.success) {
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        onAuthSuccess();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className={!usernameValidation.valid ? styles.inputError : ''}
              />
              {!usernameValidation.valid && (
                <span className={styles.validationError}>
                  {usernameValidation.message}
                </span>
              )}
              {usernameValidation.valid && formData.username && (
                <span className={styles.validationSuccess}>✓ Username available</span>
              )}
            </div>
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          {/* Replace your existing password input */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <PasswordInput
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength="6"
            />
          </div>
          
          {!isLogin && (
            <>
              {/* And for confirm password if you have it */}
              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <PasswordInput
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength="6"
                />
              </div>
            </>
          )}
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button 
            type="submit" 
            disabled={loading || (!isLogin && !usernameValidation.valid)}
            className={styles.submitButton}
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>
        
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className={styles.switchButton}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;