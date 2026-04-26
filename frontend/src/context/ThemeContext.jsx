import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [theme, setThemeState] = useState(() => {
    // Default to 'default' if not set
    return 'default';
  });

  // Apply theme class to <html> element based on role
  const applyTheme = useCallback((t, role) => {
    const html = document.documentElement;
    html.classList.remove('theme-light', 'theme-dark', 'doctor-theme-light', 'doctor-theme-dark');
    
    // We only apply the global classes if a valid theme is passed
    if (role === 'doctor') {
      if (t === 'light') html.classList.add('doctor-theme-light');
      if (t === 'dark') html.classList.add('doctor-theme-dark');
    } else {
      if (t === 'light') html.classList.add('theme-light');
      if (t === 'dark') html.classList.add('theme-dark');
    }
  }, []);

  // Fetch theme from DB when user logs in
  useEffect(() => {
    if (token && user) {
      const storageKey = `theme_${user.role}`;
      axios.get('http://localhost:5000/api/settings/theme', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const dbTheme = res.data.theme || 'default';
        setThemeState(dbTheme);
        localStorage.setItem(storageKey, dbTheme);
        applyTheme(dbTheme, user.role);
      }).catch(() => {
        // Fallback to localStorage if API fails
        const stored = localStorage.getItem(storageKey) || 'default';
        applyTheme(stored, user.role);
      });
    } else {
      // Not logged in — do NOT apply any theme globally by default here.
      // The ThemeEnforcer in App.jsx handles stripping themes from public pages.
      const html = document.documentElement;
      html.classList.remove('theme-light', 'theme-dark', 'doctor-theme-light', 'doctor-theme-dark');
    }
  }, [user, token, applyTheme]);

  // Preview theme instantly (before save)
  const previewTheme = (t, role = 'patient') => {
    applyTheme(t, role);
  };

  // Save theme to DB + localStorage
  const saveTheme = async (t, role = 'patient') => {
    setThemeState(t);
    const storageKey = `theme_${role}`;
    localStorage.setItem(storageKey, t);
    applyTheme(t, role);
    if (token) {
      await axios.put('http://localhost:5000/api/settings/theme',
        { theme: t },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, saveTheme, previewTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
