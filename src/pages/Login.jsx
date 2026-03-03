import { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Lock, User, AlertCircle } from 'lucide-react';
import { validateCredentials, createSession } from '../utils/auth';
import { initializeGoogleSignIn } from '../utils/googleAuth';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleError, setGoogleError] = useState('');

  useEffect(() => {
    // Initialize Google Sign-In
    const handleGoogleSuccess = (userInfo) => {
      setGoogleLoading(false);
      createSession(userInfo);
      onLogin();
    };

    const handleGoogleError = (error) => {
      setGoogleLoading(false);
      setGoogleError(error.message);
    };

    // Initialize Google Sign-In after component mounts
    setTimeout(() => {
      initializeGoogleSignIn(handleGoogleSuccess, handleGoogleError);
    }, 100);
  }, [onLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (validateCredentials(username, password)) {
        createSession();
        onLogin();
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 500);
  };

  const handleGoogleSignIn = () => {
    setGoogleError('');
    setGoogleLoading(true);
    // Google Sign-In is handled by the button click automatically
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-cyan-100 dark:bg-cyan-950 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-cyan-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Scanner Dashboard</CardTitle>
          <CardDescription>UOG Hostel Management System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Sign-In */}
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Sign in with your UOG account
              </p>
            </div>
            
            {googleError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{googleError}</p>
              </div>
            )}

            <div className="relative">
              <div 
                id="google-signin-button" 
                className={`w-full ${googleLoading ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={handleGoogleSignIn}
              ></div>
              {googleLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Traditional Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900 rounded-lg">
            <p className="text-xs text-cyan-800 dark:text-cyan-200 text-center">
              Session expires after 30 minutes of inactivity
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
