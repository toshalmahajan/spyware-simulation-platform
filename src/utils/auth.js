import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

// Encryption key (in production, this should be from environment variables)
const ENCRYPTION_KEY = 'spysim-secure-key-2024';

// User roles
export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator', 
  VIEWER: 'viewer'
};

// Mock user database (in production, this would be a real database)
const users = [
  {
    id: 1,
    username: 'admin',
    password: CryptoJS.SHA256('admin123').toString(), // Hashed password
    role: ROLES.ADMIN,
    name: 'System Administrator',
    email: 'admin@security.local',
    lastLogin: null
  },
  {
    id: 2,
    username: 'operator',
    password: CryptoJS.SHA256('operator123').toString(),
    role: ROLES.OPERATOR,
    name: 'Security Operator',
    email: 'operator@security.local',
    lastLogin: null
  },
  {
    id: 3,
    username: 'viewer',
    password: CryptoJS.SHA256('viewer123').toString(),
    role: ROLES.VIEWER,
    name: 'Security Viewer',
    email: 'viewer@security.local',
    lastLogin: null
  }
];

// Encryption functions
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

export const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Authentication functions
export const login = (username, password) => {
  const user = users.find(u => u.username === username);
  
  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = CryptoJS.SHA256(password).toString();
  if (user.password !== hashedPassword) {
    throw new Error('Invalid password');
  }

  // Update last login
  user.lastLogin = new Date().toISOString();

  // Create session data
  const sessionData = {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email
    },
    loginTime: new Date().toISOString(),
    sessionId: CryptoJS.lib.WordArray.random(32).toString()
  };

  // Encrypt and store session
  const encryptedSession = encryptData(sessionData);
  Cookies.set('auth_session', encryptedSession, { 
    expires: 1, // 1 day
    secure: true,
    sameSite: 'strict'
  });

  return sessionData.user;
};

export const logout = () => {
  Cookies.remove('auth_session');
  window.location.href = '/login';
};

export const getCurrentUser = () => {
  try {
    const encryptedSession = Cookies.get('auth_session');
    if (!encryptedSession) return null;

    const sessionData = decryptData(encryptedSession);
    if (!sessionData || !sessionData.user) return null;

    // Check if session is expired (24 hours)
    const loginTime = new Date(sessionData.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      logout();
      return null;
    }

    return sessionData.user;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
};

export const hasPermission = (requiredRole) => {
  const user = getCurrentUser();
  if (!user) return false;

  const roleHierarchy = {
    [ROLES.VIEWER]: [ROLES.VIEWER],
    [ROLES.OPERATOR]: [ROLES.VIEWER, ROLES.OPERATOR],
    [ROLES.ADMIN]: [ROLES.VIEWER, ROLES.OPERATOR, ROLES.ADMIN]
  };

  return roleHierarchy[user.role]?.includes(requiredRole) || false;
};

// Audit logging
export const logActivity = (action, details = {}) => {
  const user = getCurrentUser();
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId: user?.id || 'unknown',
    username: user?.username || 'unknown',
    action,
    details,
    ipAddress: '127.0.0.1' // In production, get real IP
  };

  // Get existing logs
  const existingLogs = JSON.parse(localStorage.getItem('audit_logs') || '[]');

  // Keep only last 1000 entries to prevent storage overflow
  const updatedLogs = [logEntry, ...existingLogs].slice(0, 1000);

  localStorage.setItem('audit_logs', JSON.stringify(updatedLogs));
  console.log('AUDIT LOG:', logEntry);
};

export const getAuditLogs = () => {
  return JSON.parse(localStorage.getItem('audit_logs') || '[]');
};
