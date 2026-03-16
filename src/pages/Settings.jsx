import { useState, useEffect } from 'react';
import { Save, FolderOpen, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/toast';
import PageHeader from '../components/PageHeader';

const DEFAULT_SCAN_LOGS = 'https://raw.githubusercontent.com/G5-UOGIAN/scanner-logs/main/scan_log.csv';
const DEFAULT_LATE_HOUR = '22';

const Settings = ({ isMobile }) => {
  const [scanLogsPath, setScanLogsPath] = useState('');
  const [lateEntryHour, setLateEntryHour] = useState(DEFAULT_LATE_HOUR);

  useEffect(() => {
    setScanLogsPath(localStorage.getItem('scanLogsPath') || DEFAULT_SCAN_LOGS);
    setLateEntryHour(localStorage.getItem('lateEntryHour') || DEFAULT_LATE_HOUR);
  }, []);

  const handleSave = () => {
    localStorage.setItem('scanLogsPath', scanLogsPath);
    localStorage.setItem('lateEntryHour', lateEntryHour);
    toast.success('Settings saved. Refresh the page to apply changes.');
  };

  const handleReset = () => {
    setScanLogsPath(DEFAULT_SCAN_LOGS);
    setLateEntryHour(DEFAULT_LATE_HOUR);
    toast.info('Reset to default values');
  };

  const hour = parseInt(lateEntryHour) || 22;
  const hourDisplay = hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PageHeader title="Settings" description="Configure application settings" />

      <div className="flex-1 overflow-auto p-3 md:p-6 space-y-4 pb-20 md:pb-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Source</CardTitle>
            <CardDescription>
              URL for the scan logs CSV file fetched from GitHub.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Scan Logs URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Scan Logs URL
              </label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  type="text"
                  value={scanLogsPath}
                  onChange={(e) => setScanLogsPath(e.target.value)}
                  placeholder={DEFAULT_SCAN_LOGS}
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-slate-500">
                Raw GitHub URL to <code>scan_log.csv</code>. The allotments file is resolved automatically from the same path.
              </p>
            </div>

            {/* Late Entry Hour */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Late Entry Threshold
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={lateEntryHour}
                  onChange={(e) => setLateEntryHour(e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-slate-500">= {hourDisplay}</span>
              </div>
              <p className="text-xs text-slate-500">
                Entries at or after this hour (24h) are flagged as Late Entry.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="gap-2">
                <Save size={15} />
                Save
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw size={15} />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current config summary */}
        <Card>
          <CardHeader>
            <CardTitle>Current Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg gap-4">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">Scan Logs</span>
              <code className="text-xs text-cyan-600 dark:text-cyan-400 truncate text-right">{scanLogsPath}</code>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Late Entry After</span>
              <code className="text-sm text-cyan-600 dark:text-cyan-400">{lateEntryHour}:00 ({hourDisplay})</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
