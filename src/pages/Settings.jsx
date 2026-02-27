import { useState, useEffect } from 'react';
import { Save, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/toast';

const Settings = () => {
  const [scanLogsPath, setScanLogsPath] = useState('');
  const [allotmentsPath, setAllotmentsPath] = useState('');

  useEffect(() => {
    // Load saved paths from localStorage
    const savedScanLogsPath = localStorage.getItem('scanLogsPath') || '/scan_logs.csv';
    const savedAllotmentsPath = localStorage.getItem('allotmentsPath') || '/allotments.csv';
    
    setScanLogsPath(savedScanLogsPath);
    setAllotmentsPath(savedAllotmentsPath);
  }, []);

  const handleSave = () => {
    // Save paths to localStorage
    localStorage.setItem('scanLogsPath', scanLogsPath);
    localStorage.setItem('allotmentsPath', allotmentsPath);
    
    toast.success('Settings saved successfully! Please refresh the page to apply changes.');
  };

  const handleReset = () => {
    setScanLogsPath('/scan_logs.csv');
    setAllotmentsPath('/allotments.csv');
    toast.info('Paths reset to default values');
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure application settings and file paths</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Source Configuration</CardTitle>
          <CardDescription>
            Configure the file paths for scan logs and student allotments. 
            You can use local paths (e.g., /scan_logs.csv) or remote URLs (e.g., https://example.com/data.csv)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scan Logs Path */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Scan Logs File Path
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  type="text"
                  value={scanLogsPath}
                  onChange={(e) => setScanLogsPath(e.target.value)}
                  placeholder="/scan_logs.csv or https://example.com/scan_logs.csv"
                  className="pl-10"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Default: /scan_logs.csv (public folder)
            </p>
          </div>

          {/* Allotments Path */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Allotments File Path
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  type="text"
                  value={allotmentsPath}
                  onChange={(e) => setAllotmentsPath(e.target.value)}
                  placeholder="/allotments.csv or https://example.com/allotments.csv"
                  className="pl-10"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Default: /allotments.csv (public folder)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="gap-2">
              <Save size={16} />
              Save Settings
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900 rounded-lg">
            <h4 className="text-sm font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
              Important Notes:
            </h4>
            <ul className="text-sm text-cyan-800 dark:text-cyan-200 space-y-1 list-disc list-inside">
              <li>Changes will take effect after refreshing the page</li>
              <li>Local files should be placed in the public folder</li>
              <li>Remote URLs must support CORS for browser access</li>
              <li>Ensure CSV files follow the correct format</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Current Configuration Display */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Scan Logs:</span>
            <code className="text-sm text-cyan-600 dark:text-cyan-400">{scanLogsPath}</code>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Allotments:</span>
            <code className="text-sm text-cyan-600 dark:text-cyan-400">{allotmentsPath}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
