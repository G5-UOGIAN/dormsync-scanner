import { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import moment from 'moment';
import { Clock, Users, ShieldAlert, AlertTriangle } from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import LogsTable from './components/LogsTable';
import LoadingSpinner from './components/LoadingSpinner';
import ImageModal from './components/ImageModal';
import Students from './pages/Students';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { toast } from './components/ui/toast';

const App = () => {
  const [logs, setLogs] = useState([]);
  const [allotments, setAllotments] = useState({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLog, setSelectedLog] = useState(null);
  const [filterTab, setFilterTab] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'time', direction: 'desc' });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get paths from localStorage or use defaults
      const scanLogsPath = localStorage.getItem('scanLogsPath') || '/scan_logs.csv';
      const allotmentsPath = localStorage.getItem('allotmentsPath') || '/allotments.csv';
      
      const [logsRes, allotRes] = await Promise.all([
        fetch(scanLogsPath),
        fetch(allotmentsPath)
      ]);

      const logsText = await logsRes.text();
      const allotText = await allotRes.text();

      Papa.parse(allotText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const map = {};
          result.data.forEach(row => {
            const cleanRoll = row['Roll No.']?.trim();
            if (cleanRoll) map[cleanRoll] = row;
          });
          setAllotments(map);
        }
      });

      Papa.parse(logsText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setLogs(result.data);
          setLoading(false);
          toast.success('Scan logs loaded successfully');
        }
      });
    } catch (err) {
      console.error('Fetch Error:', err);
      setLoading(false);
      toast.error('Failed to load data');
    }
  };

  // Apply filters
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(log => {
        const logDate = moment(log.DateTime).format('YYYY-MM-DD');
        return logDate === selectedDate;
      });
    }

    // Tab filter
    if (filterTab === 'late') {
      filtered = filtered.filter(log => {
        const hour = moment(log.DateTime).hour();
        return hour >= 22;
      });
    } else if (filterTab === 'boarder') {
      filtered = filtered.filter(log => log.Status === 'Boarder');
    } else if (filterTab === 'non-boarder') {
      filtered = filtered.filter(log => log.Status === 'Non-Boarder');
    } else if (filterTab === 'invalid') {
      filtered = filtered.filter(log => 
        log.Status !== 'Boarder' && log.Status !== 'Non-Boarder'
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log => {
        const student = allotments[log['QR Code']?.trim()];
        const name = student?.Name || '';
        const rollNo = log['QR Code'] || '';
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rollNo.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return filtered;
  }, [logs, searchTerm, filterTab, allotments, selectedDate]);

  // Sort logs
  const sortedLogs = useMemo(() => {
    const sorted = [...filteredLogs];
    
    sorted.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.key) {
        case 'identity':
          const aStudent = allotments[a['QR Code']?.trim()];
          const bStudent = allotments[b['QR Code']?.trim()];
          aValue = aStudent?.Name || '';
          bValue = bStudent?.Name || '';
          break;
        case 'time':
          aValue = moment(a.DateTime).valueOf();
          bValue = moment(b.DateTime).valueOf();
          break;
        case 'room':
          const aRoom = allotments[a['QR Code']?.trim()]?.Room || '';
          const bRoom = allotments[b['QR Code']?.trim()]?.Room || '';
          aValue = aRoom;
          bValue = bRoom;
          break;
        case 'status':
          aValue = a.Status || '';
          bValue = b.Status || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredLogs, sortConfig, allotments]);

  // Calculate stats (static - all logs)
  const stats = useMemo(() => {
    const totalScans = logs.length;
    const boarders = logs.filter(l => l.Status === 'Boarder').length;
    const nonBoarders = logs.filter(l => l.Status === 'Non-Boarder').length;
    const invalid = logs.filter(l => 
      l.Status !== 'Boarder' && l.Status !== 'Non-Boarder'
    ).length;

    // Calculate peak time
    const hourCounts = {};
    logs.forEach(log => {
      const hour = moment(log.DateTime).hour();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    let peakHour = null;
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
      if (count > maxCount) {
        maxCount = count;
        peakHour = parseInt(hour);
      }
    });

    const peakTime = peakHour !== null 
      ? moment().hour(peakHour).minute(0).format('hh:00 A')
      : 'N/A';

    // Calculate late entries (after 10 PM)
    const lateEntries = logs.filter(log => {
      const hour = moment(log.DateTime).hour();
      return hour >= 22;
    }).length;

    return {
      totalScans,
      boarders,
      nonBoarders,
      invalid,
      peakTime,
      lateEntries
    };
  }, [logs]);

  const handleSearch = () => {
    if (searchTerm) {
      toast.info(`Searching for: ${searchTerm}`);
    } else {
      toast.warning('Please enter a search term');
    }
  };

  const handleSort = (key) => {
    setProcessing(true);
    setTimeout(() => {
      setSortConfig(prev => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
      setProcessing(false);
    }, 100);
  };

  const handleTabChange = (value) => {
    setProcessing(true);
    setTimeout(() => {
      setFilterTab(value);
      setProcessing(false);
    }, 100);
  };

  if (activeTab !== 'dashboard') {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'students' && <Students allotments={allotments} />}
          {activeTab === 'reports' && <Reports logs={logs} />}
          {activeTab === 'notifications' && <Notifications />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <div className="flex-1 overflow-hidden p-6 space-y-6">
          {/* Static Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              label="Total Scans"
              value={stats.totalScans}
              icon={Users}
            />
            <StatsCard
              label="Peak Time"
              value={stats.peakTime}
              icon={Clock}
              description="Busiest hour"
            />
            <StatsCard
              label="Late Entries"
              value={stats.lateEntries}
              icon={AlertTriangle}
              description="After 10:00 PM"
            />
            <StatsCard
              label="Invalid Scans"
              value={stats.invalid}
              icon={ShieldAlert}
            />
          </div>

          {/* Tabs and Table Container */}
          <div className="flex-1 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-0">
            {/* Date Display */}
            <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Showing records: {' '}
                <span className="text-slate-900 dark:text-white font-semibold">
                  {selectedDate ? moment(selectedDate).format('MMMM DD, YYYY') : 'All Time'}
                </span>
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="ml-3 text-xs text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium"
                  >
                    View All Time
                  </button>
                )}
              </p>
            </div>

            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
              <Tabs value={filterTab} onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger 
                    value="all" 
                    active={filterTab === 'all'}
                    onClick={() => handleTabChange('all')}
                    disabled={processing}
                  >
                    All Scans
                  </TabsTrigger>
                  <TabsTrigger 
                    value="boarder" 
                    active={filterTab === 'boarder'}
                    onClick={() => handleTabChange('boarder')}
                    disabled={processing}
                  >
                    Boarders
                  </TabsTrigger>
                  <TabsTrigger 
                    value="non-boarder" 
                    active={filterTab === 'non-boarder'}
                    onClick={() => handleTabChange('non-boarder')}
                    disabled={processing}
                  >
                    Non-Boarders
                  </TabsTrigger>
                  <TabsTrigger 
                    value="late" 
                    active={filterTab === 'late'}
                    onClick={() => handleTabChange('late')}
                    disabled={processing}
                  >
                    Late Entries
                  </TabsTrigger>
                  <TabsTrigger 
                    value="invalid" 
                    active={filterTab === 'invalid'}
                    onClick={() => handleTabChange('invalid')}
                    disabled={processing}
                  >
                    Invalid
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1 relative min-h-138 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-138">
                  <div className="text-center">
                    <svg className="animate-spin h-10 w-10 text-cyan-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Loading Records...
                    </p>
                  </div>
                </div>
              ) : processing ? (
                <div className="flex items-center justify-center h-138">
                  <div className="text-center">
                    <svg className="animate-spin h-10 w-10 text-cyan-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Loading Records...
                    </p>
                  </div>
                </div>
              ) : sortedLogs.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-1">
                      No Records Found
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {selectedDate 
                        ? `No scan records for ${moment(selectedDate).format('MMMM DD, YYYY')}`
                        : 'No scan records match your current filters'
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className=" max-h-138 overflow-auto">
                  <LogsTable
                    logs={sortedLogs}
                    allotments={allotments}
                    onRowClick={(log) => setSelectedLog(log)}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedLog && (
        <ImageModal
          log={selectedLog}
          student={allotments[selectedLog['QR Code']?.trim()]}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};

export default App;
