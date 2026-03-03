# Google OAuth Setup Guide

## Overview
The Scanner Dashboard supports Google OAuth authentication for University of Gujrat (@uog.edu.pk) users. This guide explains how to set up Google OAuth and manage authorized users.

## Prerequisites
- Google Cloud Console account
- Access to create OAuth 2.0 credentials
- Domain verification for @uog.edu.pk (if required)

## Step 1: Create Google OAuth Credentials

### 1.1 Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### 1.2 Enable Google Identity Services
1. Navigate to **APIs & Services** → **Library**
2. Search for "Google Identity"
3. Enable **Google Identity Services API**

### 1.3 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (unless you have Google Workspace)
3. Fill in the required information:
   - **App name**: Scanner Dashboard
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Add authorized domains:
   - `localhost` (for development)
   - Your production domain
5. Save and continue through the scopes and test users sections

### 1.4 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Configure:
   - **Name**: Scanner Dashboard
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**: (Leave empty for Google Identity Services)
5. Click **Create**
6. Copy the **Client ID** (starts with numbers, ends with `.apps.googleusercontent.com`)

## Step 2: Configure Application

### 2.1 Update Environment Variables
Add the Google OAuth configuration to your `.env` file:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
VITE_ORGANIZATION_DOMAIN=uog.edu.pk
```

### 2.2 Restart Application
- **Development**: `npm run dev`
- **Production**: `npm run build`

## Step 3: Manage Authorized Users

### 3.1 Access User Management
1. Log in to the Scanner Dashboard
2. Navigate to **Settings** page
3. Find the **Authorized Users** section

### 3.2 Add Users
1. Enter the user's @uog.edu.pk email address
2. Click **Add** button
3. User will now be able to sign in with Google

### 3.3 Remove Users
1. Find the user in the authorized list
2. Click the trash icon next to their email
3. User will no longer be able to sign in

## How It Works

### Authentication Flow
```
1. User clicks "Continue with Google"
2. Google OAuth popup opens
3. User signs in with Google account
4. Google returns user information (JWT token)
5. Application validates:
   - Email is verified
   - Email domain is @uog.edu.pk
   - Email is in authorized users list
6. If valid: Create session and log in
7. If invalid: Show error message
```

### Domain Restriction
- Only emails ending with `@uog.edu.pk` are allowed
- Configurable via `VITE_ORGANIZATION_DOMAIN` environment variable
- Checked automatically during authentication

### Authorization Control
- Users must be explicitly added to the authorized list
- Managed through the Settings page
- Changes take effect immediately
- Stored in browser localStorage

## Security Features

### ✅ Domain Validation
- Automatically rejects non-UOG email addresses
- Prevents unauthorized domain access

### ✅ Email Verification
- Only accepts verified Google accounts
- Prevents unverified email access

### ✅ Explicit Authorization
- Users must be manually added to authorized list
- No automatic access for domain users

### ✅ Session Management
- 30-minute session timeout
- Automatic logout on expiry
- Secure session validation

### ✅ Dual Authentication
- Google OAuth for convenience
- Traditional username/password as backup
- Both methods use same session system

## Troubleshooting

### Common Issues

#### "Google Client ID not configured"
- **Cause**: `VITE_GOOGLE_CLIENT_ID` not set in `.env`
- **Solution**: Add the client ID to environment variables and restart

#### "Only @uog.edu.pk emails are allowed"
- **Cause**: User signed in with non-UOG email
- **Solution**: User must use their UOG email address

#### "You are not authorized to access this system"
- **Cause**: User's email not in authorized list
- **Solution**: Admin must add user via Settings page

#### Google Sign-In button not appearing
- **Cause**: Google Identity Services script failed to load
- **Solution**: Check internet connection and firewall settings

#### "Failed to process Google authentication"
- **Cause**: Invalid JWT token or network error
- **Solution**: Try signing in again, check browser console for errors

### Development Issues

#### CORS Errors in Development
- **Cause**: `localhost:5173` not in authorized origins
- **Solution**: Add to Google Cloud Console OAuth settings

#### Button Styling Issues
- **Cause**: CSS conflicts with Google's button
- **Solution**: Google button uses its own styling, minimal customization available

## Production Deployment

### 1. Update OAuth Settings
1. Add production domain to authorized origins
2. Update redirect URIs if needed
3. Verify domain ownership in Google Console

### 2. Environment Variables
```env
VITE_GOOGLE_CLIENT_ID=your_production_client_id
VITE_ORGANIZATION_DOMAIN=uog.edu.pk
```

### 3. HTTPS Requirement
- Google OAuth requires HTTPS in production
- Ensure SSL certificate is properly configured
- Test OAuth flow after deployment

### 4. User Management
- Pre-populate authorized users list
- Provide admin interface for user management
- Document user onboarding process

## Best Practices

### Security
- Regularly review authorized users list
- Remove users who no longer need access
- Monitor authentication logs
- Keep Google OAuth credentials secure

### User Experience
- Provide clear error messages
- Offer both Google and traditional login
- Document login process for users
- Test with different browsers

### Maintenance
- Monitor Google OAuth quota usage
- Keep Google Cloud Console project updated
- Review and update authorized domains
- Test authentication flow regularly

## API Reference

### Environment Variables
```env
VITE_GOOGLE_CLIENT_ID=string          # Google OAuth Client ID
VITE_ORGANIZATION_DOMAIN=string       # Allowed email domain (default: uog.edu.pk)
```

### Functions (src/utils/googleAuth.js)
- `initializeGoogleAuth()` - Load Google Identity Services
- `getAuthorizedUsers()` - Get authorized users list
- `addAuthorizedUser(email)` - Add user to authorized list
- `removeAuthorizedUser(email)` - Remove user from authorized list
- `isOrganizationEmail(email)` - Check if email is from UOG domain
- `isUserAuthorized(email)` - Check if user is authorized
- `handleGoogleResponse(response)` - Process Google OAuth response

### Storage Keys
- `dormsyncscanner_authorized_users` - Authorized users list (JSON array)
- `dormsyncscanner_auth` - Authentication flag
- `dormsyncscanner_session` - Session data with expiry
- `dormsyncscanner_user` - Current user information

## Support

For issues with Google OAuth setup:
1. Check Google Cloud Console configuration
2. Verify environment variables
3. Test with browser developer tools
4. Review application logs
5. Contact Google Cloud Support if needed

For application-specific issues:
1. Check browser console for errors
2. Verify authorized users list
3. Test traditional login as backup
4. Review session management