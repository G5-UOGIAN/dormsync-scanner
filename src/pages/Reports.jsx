import { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const Reports = ({ logs }) => {
  // Peak Times Data
  const peakTimesData = useMemo(() => {
    const hourCounts = {};
    logs.forEach(log => {
      const hour = moment(log.DateTime).hour();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.entries(hourCounts)
      .map(([hour, count]) => ({
        hour: moment().hour(parseInt(hour)).format('hh A'),
        count
      }))
      .sort((a, b) => {
        const aHour = moment(a.hour, 'hh A').hour();
        const bHour = moment(b.hour, 'hh A').hour();
        return aHour - bHour;
      });
  }, [logs]);

  // Status Distribution Data
  const statusData = useMemo(() => {
    const boarders = logs.filter(l => l.Status === 'Boarder').length;
    const nonBoarders = logs.filter(l => l.Status === 'Non-Boarder').length;
    const invalid = logs.filter(l => l.Status !== 'Boarder' && l.Status !== 'Non-Boarder').length;
    const total = logs.length;

    return [
      { 
        name: 'Boarders', 
        value: boarders,
        percentage: ((boarders / total) * 100).toFixed(1)
      },
      { 
        name: 'Non-Boarders', 
        value: nonBoarders,
        percentage: ((nonBoarders / total) * 100).toFixed(1)
      },
      { 
        name: 'Invalid', 
        value: invalid,
        percentage: ((invalid / total) * 100).toFixed(1)
      }
    ];
  }, [logs]);

  const COLORS = {
    'Boarders': '#10b981',
    'Non-Boarders': '#f97316',
    'Invalid': '#ef4444'
  };

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Visual insights and statistics</p>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Entry Status Distribution</CardTitle>
          <CardDescription>Breakdown of boarders, non-boarders, and invalid entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
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

            <div className="flex flex-col justify-center space-y-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[item.name] }}
                    />
                    <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                    <p className="text-sm text-slate-500">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peak Times */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Entry Times</CardTitle>
          <CardDescription>Hourly distribution of scan entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
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
  );
};

export default Reports;
