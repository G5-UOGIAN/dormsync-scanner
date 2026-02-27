import { useMemo, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Users, Clock, AlertTriangle, TrendingUp, Calendar, Download, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import PageHeader from '../components/PageHeader';
import DateRangeModal from '../components/DateRangeModal';
import { toast } from '../components/ui/toast';
import { cn } from '../lib/utils';

const Reports = ({ logs }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');

  // Filter logs by date range
  const filteredLogs = useMemo(() => {
    if (!startDate && !endDate) return logs;

    return logs.filter(log => {
      const logDate = moment(log.DateTime).format('YYYY-MM-DD');
      
      if (startDate && endDate) {
        return logDate >= startDate && logDate <= endDate;
      } else if (startDate) {
        return logDate >= startDate;
      } else if (endDate) {
        return logDate <= endDate;
      }
      
      return true;
    });
  }, [logs, startDate, endDate]);

  const handleDateRangeApply = (start, end) => {
    setIsDateModalOpen(false);
    setStartDate(start);
    setEndDate(end);
    
    if (start || end) {
      toast.success('Date range filter applied');
    } else {
      toast.success('Showing all records');
    }
  };

  const clearDateRange = () => {
    setStartDate('');
    setEndDate('');
    toast.success('Showing all records');
  };

  // Peak Times Data
  const peakTimesData = useMemo(() => {
    const hourCounts = {};
    filteredLogs.forEach(log => {
      const hour = moment(log.DateTime).hour();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.entries(hourCounts)
      .map(([hour, count]) => ({
        hour: moment().hour(parseInt(hour)).format('hh A'),
        hourNum: parseInt(hour),
        count
      }))
      .sort((a, b) => a.hourNum - b.hourNum);
  }, [filteredLogs]);

  // Status Distribution Data
  const statusData = useMemo(() => {
    const boarders = filteredLogs.filter(l => l.Status === 'Boarder').length;
    const nonBoarders = filteredLogs.filter(l => l.Status === 'Non-Boarder').length;
    const invalid = filteredLogs.filter(l => l.Status !== 'Boarder' && l.Status !== 'Non-Boarder').length;
    const total = filteredLogs.length;

    return [
      { 
        name: 'Boarders', 
        value: boarders,
        percentage: total > 0 ? ((boarders / total) * 100).toFixed(1) : '0.0'
      },
      { 
        name: 'Non-Boarders', 
        value: nonBoarders,
        percentage: total > 0 ? ((nonBoarders / total) * 100).toFixed(1) : '0.0'
      },
      { 
        name: 'Invalid', 
        value: invalid,
        percentage: total > 0 ? ((invalid / total) * 100).toFixed(1) : '0.0'
      }
    ];
  }, [filteredLogs]);

  // Daily Trend Data
  const dailyTrendData = useMemo(() => {
    if (startDate && endDate) {
      const start = moment(startDate);
      const end = moment(endDate);
      const days = [];
      
      for (let m = moment(start); m.isSameOrBefore(end); m.add(1, 'days')) {
        const date = m.format('YYYY-MM-DD');
        const count = filteredLogs.filter(log => 
          moment(log.DateTime).format('YYYY-MM-DD') === date
        ).length;
        days.push({
          date: m.format('MMM DD'),
          count
        });
      }
      return days;
    } else {
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
        const count = filteredLogs.filter(log => 
          moment(log.DateTime).format('YYYY-MM-DD') === date
        ).length;
        last7Days.push({
          date: moment().subtract(i, 'days').format('MMM DD'),
          count
        });
      }
      return last7Days;
    }
  }, [filteredLogs, startDate, endDate]);

  // Late Entries Data
  const lateEntriesData = useMemo(() => {
    const lateEntryHour = parseInt(localStorage.getItem('lateEntryHour') || '22');
    const lateCount = filteredLogs.filter(log => moment(log.DateTime).hour() >= lateEntryHour).length;
    const onTimeCount = filteredLogs.length - lateCount;
    const total = filteredLogs.length;
    return [
      { name: 'On Time', value: onTimeCount, percentage: total > 0 ? ((onTimeCount / total) * 100).toFixed(1) : '0.0' },
      { name: 'Late Entry', value: lateCount, percentage: total > 0 ? ((lateCount / total) * 100).toFixed(1) : '0.0' }
    ];
  }, [filteredLogs]);

  // Summary Stats
  const stats = useMemo(() => {
    const lateEntryHour = parseInt(localStorage.getItem('lateEntryHour') || '22');
    const peakHour = peakTimesData.reduce((max, curr) => 
      curr.count > max.count ? curr : max
    , { count: 0, hour: 'N/A' });

    const daysCount = startDate && endDate 
      ? moment(endDate).diff(moment(startDate), 'days') + 1 
      : 7;
    const avgPerDay = daysCount > 0 ? (filteredLogs.length / daysCount).toFixed(0) : '0';
    const lateEntries = filteredLogs.filter(log => moment(log.DateTime).hour() >= lateEntryHour).length;
    const invalidEntries = filteredLogs.filter(l => l.Status !== 'Boarder' && l.Status !== 'Non-Boarder').length;

    return {
      peakHour: peakHour.hour,
      peakCount: peakHour.count,
      avgPerDay,
      lateEntries,
      invalidEntries
    };
  }, [filteredLogs, peakTimesData, startDate, endDate]);

  const COLORS = {
    'Boarders': '#10b981',
    'Non-Boarders': '#f97316',
    'Invalid': '#ef4444',
    'On Time': '#06b6d4',
    'Late Entry': '#f59e0b'
  };

  // Generate Report Functions
  const generateDailyReport = () => {
    const today = moment().format('YYYY-MM-DD');
    const todayLogs = logs.filter(log => 
      moment(log.DateTime).format('YYYY-MM-DD') === today
    );
    
    downloadReport(todayLogs, 'Daily', today);
  };

  const generateWeeklyReport = () => {
    const weekStart = moment().startOf('week').format('YYYY-MM-DD');
    const weekEnd = moment().endOf('week').format('YYYY-MM-DD');
    const weekLogs = logs.filter(log => {
      const logDate = moment(log.DateTime).format('YYYY-MM-DD');
      return logDate >= weekStart && logDate <= weekEnd;
    });
    
    downloadReport(weekLogs, 'Weekly', `${weekStart}_to_${weekEnd}`);
  };

  const generateMonthlyReport = () => {
    const monthStart = moment().startOf('month').format('YYYY-MM-DD');
    const monthEnd = moment().endOf('month').format('YYYY-MM-DD');
    const monthLogs = logs.filter(log => {
      const logDate = moment(log.DateTime).format('YYYY-MM-DD');
      return logDate >= monthStart && logDate <= monthEnd;
    });
    
    downloadReport(monthLogs, 'Monthly', moment().format('MMMM_YYYY'));
  };

  const downloadReport = (reportLogs, reportType, dateLabel) => {
    const lateEntryHour = parseInt(localStorage.getItem('lateEntryHour') || '22');
    
    // Calculate statistics
    const totalScans = reportLogs.length;
    const boarders = reportLogs.filter(l => l.Status === 'Boarder').length;
    const nonBoarders = reportLogs.filter(l => l.Status === 'Non-Boarder').length;
    const invalid = reportLogs.filter(l => l.Status !== 'Boarder' && l.Status !== 'Non-Boarder').length;
    const lateEntries = reportLogs.filter(log => moment(log.DateTime).hour() >= lateEntryHour).length;

    // Create HTML report
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${reportType} Scan Report - ${dateLabel}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 40px;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #06b6d4;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #0f172a;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .header p {
      color: #64748b;
      font-size: 16px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .stat-card {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-card h3 {
      font-size: 14px;
      font-weight: 500;
      opacity: 0.9;
      margin-bottom: 10px;
    }
    .stat-card p {
      font-size: 32px;
      font-weight: bold;
    }
    .section {
      margin: 30px 0;
    }
    .section h2 {
      color: #0f172a;
      font-size: 20px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
      text-align: left;
      padding: 12px;
      border-bottom: 2px solid #cbd5e1;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    tr:hover {
      background: #f8fafc;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-warning { background: #fed7aa; color: #9a3412; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Scanner Dashboard</h1>
      <p>${reportType} Scan Report</p>
      <p style="margin-top: 5px; font-weight: 600;">${dateLabel}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Scans</h3>
        <p>${totalScans}</p>
      </div>
      <div class="stat-card">
        <h3>Boarders</h3>
        <p>${boarders}</p>
      </div>
      <div class="stat-card">
        <h3>Non-Boarders</h3>
        <p>${nonBoarders}</p>
      </div>
      <div class="stat-card">
        <h3>Invalid Scans</h3>
        <p>${invalid}</p>
      </div>
      <div class="stat-card">
        <h3>Late Entries</h3>
        <p>${lateEntries}</p>
      </div>
    </div>

    <div class="section">
      <h2>Scan Records</h2>
      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Roll Number</th>
            <th>Status</th>
            <th>Late Entry</th>
          </tr>
        </thead>
        <tbody>
          ${reportLogs.map(log => {
            const isLate = moment(log.DateTime).hour() >= lateEntryHour;
            const statusClass = log.Status === 'Boarder' ? 'success' : 
                               log.Status === 'Non-Boarder' ? 'warning' : 'danger';
            return `
              <tr>
                <td>${moment(log.DateTime).format('MMM DD, YYYY hh:mm A')}</td>
                <td>${log['QR Code'] || 'N/A'}</td>
                <td><span class="badge badge-${statusClass}">${log.Status}</span></td>
                <td>${isLate ? '<span class="badge badge-danger">Late</span>' : '<span class="badge badge-success">On Time</span>'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <p>Generated on ${moment().format('MMMM DD, YYYY [at] hh:mm A')}</p>
      <p style="margin-top: 5px;">UOG Hostel Management System - Scanner Dashboard</p>
    </div>
  </div>
</body>
</html>
    `;

    // Create and download file
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_Report_${dateLabel}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`${reportType} report downloaded successfully`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PageHeader 
        title="Reports & Analytics" 
        description="Visual insights and downloadable reports"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDateModalOpen(true)}
              className="gap-2"
            >
              <Calendar size={16} />
              {startDate || endDate ? 'Change Date Range' : 'Select Date Range'}
            </Button>
            {(startDate || endDate) && (
              <Button variant="outline" onClick={clearDateRange}>
                View All Time
              </Button>
            )}
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Tabs */}
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === 'analytics'
                ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50"
                : "hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            )}
          >
            Analytics & Charts
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === 'downloads'
                ? "bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-slate-50"
                : "hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            )}
          >
            Download Reports
          </button>
        </div>

        {activeTab === 'analytics' && (
          <>
            {/* Date Range Display */}
            {(startDate || endDate) && (
              <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800 rounded-lg px-4 py-2">
                <p className="text-sm text-cyan-900 dark:text-cyan-100">
                  Showing analytics: {' '}
                  <span className="font-semibold">
                    {startDate ? moment(startDate).format('MMM DD, YYYY') : 'Beginning'} 
                    {' '} to {' '}
                    {endDate ? moment(endDate).format('MMM DD, YYYY') : 'Now'}
                  </span>
                  {' '}({filteredLogs.length} records)
                </p>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Total Scans</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{filteredLogs.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-cyan-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Peak Hour</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.peakHour}</p>
                      <p className="text-xs text-slate-500">{stats.peakCount} entries</p>
                    </div>
                    <Clock className="w-8 h-8 text-cyan-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Avg Per Day</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.avgPerDay}</p>
                      <p className="text-xs text-slate-500">Last {startDate && endDate ? moment(endDate).diff(moment(startDate), 'days') + 1 : 7} days</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Late Entries</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.lateEntries}</p>
                      <p className="text-xs text-slate-500">After {localStorage.getItem('lateEntryHour') || '22'}:00</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Invalid Scans</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.invalidEntries}</p>
                      <p className="text-xs text-slate-500">Total invalid</p>
                    </div>
                    <Users className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Entry Status Distribution</CardTitle>
                  <CardDescription>Breakdown by entry type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Late Entries */}
              <Card>
                <CardHeader>
                  <CardTitle>On-Time vs Late Entries</CardTitle>
                  <CardDescription>Entry timing analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={lateEntriesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {lateEntriesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Trend */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Entry Trend</CardTitle>
                  <CardDescription>Daily scan entries over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} name="Entries" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Peak Times */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Peak Entry Times</CardTitle>
                  <CardDescription>Hourly distribution of scan entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peakTimesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#06b6d4" name="Number of Entries" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'downloads' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Daily Report */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-950 rounded-lg">
                    <FileText className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <CardTitle>Daily Report</CardTitle>
                    <CardDescription>Today's scan records</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p>• All scans from today</p>
                  <p>• Summary statistics</p>
                  <p>• Detailed record table</p>
                  <p>• Professional HTML format</p>
                </div>
                <Button 
                  onClick={generateDailyReport}
                  className="w-full gap-2"
                >
                  <Download size={16} />
                  Download Daily Report
                </Button>
              </CardContent>
            </Card>

            {/* Weekly Report */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-950 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Weekly Report</CardTitle>
                    <CardDescription>This week's records</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p>• All scans from this week</p>
                  <p>• Weekly trends</p>
                  <p>• Comprehensive analysis</p>
                  <p>• Professional HTML format</p>
                </div>
                <Button 
                  onClick={generateWeeklyReport}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <Download size={16} />
                  Download Weekly Report
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Report */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 dark:bg-orange-950 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Monthly Report</CardTitle>
                    <CardDescription>This month's records</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p>• All scans from this month</p>
                  <p>• Monthly statistics</p>
                  <p>• Complete overview</p>
                  <p>• Professional HTML format</p>
                </div>
                <Button 
                  onClick={generateMonthlyReport}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <Download size={16} />
                  Download Monthly Report
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <DateRangeModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onApply={handleDateRangeApply}
        currentStartDate={startDate}
        currentEndDate={endDate}
      />
    </div>
  );
};

export default Reports;
