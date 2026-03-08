import { useState, useEffect } from 'react';
import { Save, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/toast';
import PageHeader from '../components/PageHeader';

const Settings = ({ isMobile }) => {
  const [scanLogsPath, setScanLogsPath] = useState('');
  const [allotmentsPath, setAllotmentsPath] = useState('');
  const [lateEntryHour, setLateEntryHour] = useState('22');
  const [profileImagesPath, setProfileImagesPath] = useState('');
  const [scanImagesPath, setScanImagesPath] = useState('');

  useEffect(() => {
    // Load saved paths from localStorage
    const savedScanLogsPath = localStorage.getItem('scanLogsPath') || 'https://raw.githubusercontent.com/G5-UOGIAN/scanner-logs/main/scan_log.csv';
    const savedAllotmentsPath = localStorage.getItem('allotmentsPath') || 'https://raw.githubusercontent.com/G5-UOGIAN/scanner-logs/main/allotments.csv';

    const savedLateEntryHour = localStorage.getItem('lateEntryHour') || '22';
    const savedProfileImagesPath = localStorage.getItem('profileImagesPath') || '/images/students/';
    const savedScanImagesPath = localStorage.getItem('scanImagesPath') || '/captured/';

    setScanLogsPath(savedScanLogsPath);
    setAllotmentsPath(savedAllotmentsPath);
    setLateEntryHour(savedLateEntryHour);
    setProfileImagesPath(savedProfileImagesPath);
    setScanImagesPath(savedScanImagesPath);
  }, []);

  const handleSave = () => {
    // Save paths to localStorage
    localStorage.setItem('scanLogsPath', scanLogsPath);
    localStorage.setItem('allotmentsPath', allotmentsPath);
    localStorage.setItem('lateEntryHour', lateEntryHour);
    localStorage.setItem('profileImagesPath', profileImagesPath);
    localStorage.setItem('scanImagesPath', scanImagesPath);

    toast.success('Settings saved successfully! Please refresh the page to apply changes.');
  };

  const handleReset = () => {
    setScanLogsPath('https://raw.githubusercontent.com/G5-UOGIAN/scanner-logs/main/scan_log.csv');
    setAllotmentsPath('https://raw.githubusercontent.com/G5-UOGIAN/scanner-logs/main/allotments.csv');
    setLateEntryHour('22');
    setProfileImagesPath('/images/students/');
    setScanImagesPath('/captured/');
    toast.info('Settings reset to default values');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PageHeader
        title="Settings"
        description="Configure application settings"
      />

      <div className="flex-1 overflow-auto p-3 md:p-6 space-y-4 md:space-y-6 pb-20 md:pb-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Source Configuration</CardTitle>
            <CardDescription>
              Configure the file paths for scan logs and student allotments.
              By default, data is fetched from GitHub repository. You can change to local paths or other remote URLs.
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
                    placeholder="https://raw.githubusercontent.com/G5-UOGIAN/scanner-logs/main/scan_log.csv"
                    className="pl-10"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Default: GitHub URL - https://raw.githubusercontent.com/G5-UOGIAN/scanner-logs/main/scan_log.csv
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
                    placeholder="https://raw.githubusercontent.com/G5-UOGIAN/scanner-logs/main/allotments.csv"
                    className="pl-10"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Default: GitHub URL - https://raw.githubusercontent.com/G5-UOGIAN/scanner-logs/main/allotments.csv
              </p>
            </div>

            {/* Late Entry Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Late Entry Time (Hour)
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={lateEntryHour}
                  onChange={(e) => setLateEntryHour(e.target.value)}
                  placeholder="22"
                  className="w-32"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  :00 (24-hour format)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Default: 22 (10:00 PM). Entries after this hour will be marked as "Late Entry"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Image Paths Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Image Path Configuration</CardTitle>
            <CardDescription>
              Configure the folder paths for student profile images and scan capture images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Images Path */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Student Profile Images Folder
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    type="text"
                    value={profileImagesPath}
                    onChange={(e) => setProfileImagesPath(e.target.value)}
                    placeholder="/images/students/"
                    className="pl-10"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Default: /images/students/ - Profile images should be named as {'{rollnumber}'} with supported formats: .png, .jpg, .jpeg, .PNG, .JPG, .JPEG, .webp, .WEBP, .heic, .HEIC
              </p>
            </div>

            {/* Scan Images Path */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Scan Capture Images Folder
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    type="text"
                    value={scanImagesPath}
                    onChange={(e) => setScanImagesPath(e.target.value)}
                    placeholder="/captured/"
                    className="pl-10"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Default: /captured/ - Scan images are taken from the Image_Path column in CSV
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
                Image Path Notes:
              </h4>
              <ul className="text-sm text-cyan-800 dark:text-cyan-200 space-y-1 list-disc list-inside">
                <li>Profile images: Named as rollnumber with any supported format (e.g., 23021519-147.png, 23021519-147.jpg, 23021519-147.HEIC)</li>
                <li>Supported formats: .png, .jpg, .jpeg, .PNG, .JPG, .JPEG, .webp, .WEBP, .heic, .HEIC</li>
                <li>System automatically tries all formats until one loads successfully</li>
                <li>Scan images: Automatically extracted from Image_Path column in CSV</li>
                <li>Paths can be local (e.g., /images/) or remote URLs</li>
                <li>Ensure proper folder structure and file permissions</li>
              </ul>
            </div>

            {/* GitHub Token Info */}
            {/* <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Private Repository Access:
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                If accessing data from a private GitHub repository, ensure the <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900 rounded">VITE_GITHUB_PAT</code> environment variable is set with a valid Personal Access Token. The token is automatically used for authentication when fetching from GitHub URLs.
              </p>
            </div> */}
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
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Late Entry Time:</span>
              <code className="text-sm text-cyan-600 dark:text-cyan-400">{lateEntryHour}:00 ({lateEntryHour > 12 ? `${lateEntryHour - 12}:00 PM` : `${lateEntryHour}:00 AM`})</code>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile Images:</span>
              <code className="text-sm text-cyan-600 dark:text-cyan-400">{profileImagesPath}</code>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Scan Images:</span>
              <code className="text-sm text-cyan-600 dark:text-cyan-400">{scanImagesPath}</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
