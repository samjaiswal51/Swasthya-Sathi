import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * AuthContext tak pahunchne ke liye ek custom hook.
 * @returns {object} - Authentication context ki value.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth ka upyog AuthProvider ke andar hi kiya jaana chahiye');
  }
  return context;
};
