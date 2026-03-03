// Authentication utility with session management

const AUTH_KEY = 'dormsyncscanner_auth';
const SESSION_KEY = 'dormsyncscanner_session';
const USER_KEY = 'dormsyncscanner_user';
const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '30') * 60 * 1000; // Convert minutes to milliseconds

/**
 * Validate credentials against environment variables
 */
export const validateCredentials = (username, password) => {
  const validUsername = import.meta.env.VITE_ADMIN_USERNAME;
  const validPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  
  return username === validUsername && password === validPassword;
};

/**
 * Create a new session with timestamp
 */
export const createSession = (userInfo = null) => {
  const sessionData = {
    timestamp: Date.now(),
    expiresAt: Date.now() + SESSION_TIMEOUT,
    authMethod: userInfo ? 'google' : 'credentials'
  };
  
  localStorage.setItem(AUTH_KEY, 'true');
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  
  if (userInfo) {
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
  }
};

/**
 * Get current user info
 */
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem(USER_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * Check if current session is valid
 */
export const isSessionValid = () => {
  const authValue = localStorage.getItem(AUTH_KEY);
  const sessionData = localStorage.getItem(SESSION_KEY);
  
  // Check if auth flag exists
  if (authValue !== 'true' || !sessionData) {
    return false;
  }
  
  try {
    const session = JSON.parse(sessionData);
    const now = Date.now();
    
    // Check if session has expired
    if (now > session.expiresAt) {
      clearSession();
      return false;
    }
    
    return true;
  } catch (error) {
    clearSession();
    return false;
  }
};

/**
 * Clear session data
 */
export const clearSession = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get remaining session time in minutes
 */
export const getRemainingTime = () => {
  const sessionData = localStorage.getItem(SESSION_KEY);
  
  if (!sessionData) return 0;
  
  try {
    const session = JSON.parse(sessionData);
    const remaining = session.expiresAt - Date.now();
    return Math.max(0, Math.floor(remaining / 60000)); // Convert to minutes
  } catch (error) {
    return 0;
  }
};

/**
 * Extend session (refresh the timeout)
 */
export const extendSession = () => {
  if (isSessionValid()) {
    const currentUser = getCurrentUser();
    createSession(currentUser);
  }
};

/**
 * Get authentication method
 */
export const getAuthMethod = () => {
  const sessionData = localStorage.getItem(SESSION_KEY);
  
  if (!sessionData) return null;
  
  try {
    const session = JSON.parse(sessionData);
    return session.authMethod || 'credentials';
  } catch (error) {
    return null;
  }
};
