# GitHub Personal Access Token Setup

## Overview
The Scanner Dashboard requires a GitHub Personal Access Token (PAT) to access data from private repositories. This guide explains how to create and configure the token.

## Why is a Token Needed?

When the scanner logs repository is private, GitHub requires authentication to access the raw file content. The Personal Access Token acts as a password that allows the application to fetch CSV files from the private repository.

## Creating a GitHub Personal Access Token

### Step 1: Navigate to GitHub Settings
1. Log in to your GitHub account
2. Click your profile picture in the top-right corner
3. Select **Settings** from the dropdown menu

### Step 2: Access Developer Settings
1. Scroll down to the bottom of the left sidebar
2. Click **Developer settings**

### Step 3: Generate New Token
1. Click **Personal access tokens** in the left sidebar
2. Select **Tokens (classic)**
3. Click **Generate new token** button
4. Select **Generate new token (classic)**

### Step 4: Configure Token
1. **Note**: Enter a descriptive name (e.g., "Scanner Dashboard Access")
2. **Expiration**: Choose an expiration period (recommended: 90 days or No expiration for production)
3. **Select scopes**: Check the following:
   - ✅ **repo** (Full control of private repositories)
     - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events

### Step 5: Generate and Copy Token
1. Scroll to the bottom and click **Generate token**
2. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!
3. The token will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Configuring the Application

### Step 1: Add Token to .env File
1. Open the `.env` file in the root directory of the project
2. Add or update the following line:
   ```env
   VITE_GITHUB_PAT=ghp_your_actual_token_here
   ```
3. Replace `ghp_your_actual_token_here` with your actual token
4. Save the file

### Step 2: Restart the Application
- **Development**: Restart the dev server (`npm run dev`)
- **Production**: Rebuild the application (`npm run build`)

## How It Works

When the application fetches data from GitHub:

1. **URL Detection**: Checks if the URL contains `raw.githubusercontent.com`
2. **URL Conversion**: If token is present, converts raw URL to GitHub API URL:
   - From: `https://raw.githubusercontent.com/owner/repo/branch/file.csv`
   - To: `https://api.github.com/repos/owner/repo/contents/file.csv?ref=branch`
3. **Token Injection**: Adds token to request headers:
   ```javascript
   headers: {
     'Authorization': 'token ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
     'Accept': 'application/vnd.github.v3.raw'
   }
   ```
4. **Authentication**: GitHub API validates the token and returns raw file content
5. **CORS Bypass**: Using GitHub API instead of raw.githubusercontent.com avoids CORS issues

**Why GitHub API?**
- `raw.githubusercontent.com` doesn't support custom headers (causes CORS errors)
- GitHub API supports authentication headers
- `Accept: application/vnd.github.v3.raw` returns raw file content directly

## Verification

### Test Token Access
1. Start the application
2. Log in with your credentials
3. The dashboard should load data successfully
4. Check browser console for any errors

### Common Issues

#### 404 Not Found
- **Cause**: Token is missing, invalid, or doesn't have correct permissions
- **Solution**: 
  - Verify token is correctly set in `.env`
  - Ensure token has `repo` scope
  - Check if token has expired

#### 403 Forbidden
- **Cause**: Token doesn't have access to the specific repository
- **Solution**: 
  - Verify you have access to the repository
  - Regenerate token with correct permissions
  - Check if repository owner has granted access

#### Token Not Working After Update
- **Cause**: Application hasn't reloaded environment variables
- **Solution**: 
  - Restart development server
  - Rebuild application for production
  - Clear browser cache

## Security Best Practices

### DO:
✅ Store token in `.env` file (not committed to git)
✅ Use `.env.example` for documentation
✅ Set token expiration for better security
✅ Regenerate token if compromised
✅ Use minimum required scopes
✅ Keep token confidential

### DON'T:
❌ Commit `.env` file to version control
❌ Share token in public channels
❌ Use token in client-side code (only in build-time env vars)
❌ Give token more permissions than needed
❌ Use same token across multiple applications

## Token Management

### Rotating Tokens
For security, periodically rotate your tokens:
1. Generate a new token with same permissions
2. Update `.env` file with new token
3. Restart/rebuild application
4. Delete old token from GitHub

### Revoking Tokens
If a token is compromised:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Find the compromised token
3. Click **Delete** or **Revoke**
4. Generate a new token immediately
5. Update application configuration

## Troubleshooting

### Token Not Being Used
Check the following:
1. `.env` file exists in root directory
2. Variable name is exactly `VITE_GITHUB_PAT`
3. No spaces around the `=` sign
4. Token starts with `ghp_` (classic token)
5. Application has been restarted after adding token

### Still Getting 404 Errors
1. Verify repository URL in Settings page
2. Check if repository is actually private
3. Confirm you have access to the repository
4. Test token with GitHub API:
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" \
        https://api.github.com/user
   ```

### Token Expired
1. Check token expiration date in GitHub settings
2. Generate new token with same permissions
3. Update `.env` file
4. Restart application

## Alternative: Fine-Grained Tokens

GitHub also offers fine-grained personal access tokens with more granular permissions:

1. Go to Personal access tokens → **Fine-grained tokens**
2. Click **Generate new token**
3. Configure:
   - **Repository access**: Select specific repository
   - **Permissions**: 
     - Repository permissions → Contents → Read-only
4. Generate and copy token

**Note**: Fine-grained tokens start with `github_pat_` instead of `ghp_`

## Support

If you continue to experience issues:
1. Check GitHub's token documentation: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
2. Verify repository permissions
3. Contact repository administrator
4. Check application logs for detailed error messages
