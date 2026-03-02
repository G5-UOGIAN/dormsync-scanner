# Authentication System Documentation

## Overview
The Scanner Dashboard implements a secure authentication system with session management to protect access to the hostel management data.

## Features

### 1. Environment-Based Credentials
- Credentials are stored in `.env` file (not committed to version control)
- Uses Vite environment variables: `VITE_ADMIN_USERNAME` and `VITE_ADMIN_PASSWORD`
- No hardcoded credentials in the codebase

### 2. Session Management
- **Session Duration**: 30 minutes (configurable via `VITE_SESSION_TIMEOUT`)
- **Session Storage**: Stores session data with timestamp and expiry in localStorage
- **Auto-Logout**: Automatically logs out user when session expires
- **Session Validation**: Checks session validity every minute

### 3. Security Features
- **No Token Manipulation**: Cannot bypass authentication by setting localStorage values
- **Timestamp Validation**: Session includes creation timestamp and expiry time
- **Credential Validation**: Validates against environment variables on every login
- **Secure Logout**: Properly clears all session data

## Implementation

### File Structure
```
src/
├── utils/
│   └── auth.js           # Authentication utility functions
├── pages/
│   └── Login.jsx         # Login page component
└── App.jsx               # Main app with auth checking
```

### Authentication Flow

1. **Login Process**:
   ```
   User enters credentials
   → validateCredentials() checks against .env
   → createSession() creates session with timestamp
   → User is authenticated
   ```

2. **Session Validation**:
   ```
   Every minute (or on page load)
   → isSessionValid() checks:
      - Auth flag exists
      - Session data exists
      - Current time < expiry time
   → If invalid: clearSession() and redirect to login
   ```

3. **Logout Process**:
   ```
   User clicks logout
   → clearSession() removes all auth data
   → Redirect to login page
   ```

## API Reference

### `src/utils/auth.js`

#### `validateCredentials(username, password)`
Validates credentials against environment variables.
- **Parameters**: username (string), password (string)
- **Returns**: boolean
- **Usage**: Called during login

#### `createSession()`
Creates a new session with timestamp and expiry.
- **Storage**: Sets `dormsyncscanner_auth` and `dormsyncscanner_session` in localStorage
- **Expiry**: Current time + SESSION_TIMEOUT

#### `isSessionValid()`
Checks if current session is valid.
- **Returns**: boolean
- **Checks**: Auth flag, session data, expiry time

#### `clearSession()`
Clears all session data from localStorage.
- **Removes**: `dormsyncscanner_auth` and `dormsyncscanner_session`

#### `getRemainingTime()`
Gets remaining session time in minutes.
- **Returns**: number (minutes remaining)

#### `extendSession()`
Extends the current session (refreshes timeout).
- **Usage**: Can be called on user activity to keep session alive

## Configuration

### Environment Variables

Create a `.env` file:
```env
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=password123
VITE_SESSION_TIMEOUT=30
VITE_GITHUB_PAT=your_github_personal_access_token
```

**GitHub Personal Access Token:**
- Required for accessing private GitHub repositories
- Create at: https://github.com/settings/tokens
- Required scopes: `repo` (Full control of private repositories)
- The token is automatically added to request headers when fetching from GitHub URLs
- Format: `Authorization: token YOUR_TOKEN`

### Changing Credentials
1. Update `.env` file with new credentials
2. Restart development server (`npm run dev`)
3. For production, rebuild the application (`npm run build`)

### Changing Session Timeout
1. Update `VITE_SESSION_TIMEOUT` in `.env` (value in minutes)
2. Restart/rebuild application

## Security Best Practices

### For Development
- Never commit `.env` file to version control
- Use `.env.example` for documentation
- Change default credentials immediately

### For Production
- Use strong, unique passwords
- Consider implementing:
  - Password hashing (if storing in database)
  - Rate limiting on login attempts
  - HTTPS for all connections
  - Additional authentication factors

### For Distribution
- Provide `.env.example` file
- Document credential setup process
- Instruct users to change default credentials

## Testing

### Test Login
1. Start development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Enter credentials from `.env` file
4. Verify successful login

### Test Session Expiry
1. Login successfully
2. Wait 30 minutes (or change timeout to 1 minute for testing)
3. Verify automatic logout

### Test Invalid Credentials
1. Enter incorrect username/password
2. Verify error message appears
3. Verify no session is created

## Troubleshooting

### Cannot Login
- Check `.env` file exists in root directory
- Verify credentials match exactly (case-sensitive)
- Restart development server after changing `.env`

### Session Expires Too Quickly
- Check `VITE_SESSION_TIMEOUT` value in `.env`
- Verify system clock is correct

### Session Persists After Logout
- Clear browser localStorage manually
- Check browser console for errors
- Verify `clearSession()` is being called

## Future Enhancements

Potential improvements for production use:
- Backend authentication API
- JWT tokens instead of localStorage
- Refresh token mechanism
- Multi-user support with roles
- Password reset functionality
- Login attempt tracking
- Two-factor authentication
