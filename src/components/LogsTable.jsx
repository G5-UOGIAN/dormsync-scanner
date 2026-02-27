import { UserCircle, ArrowUpDown } from 'lucide-react';
import moment from 'moment';
import { Badge } from './ui/badge';

const LogsTable = ({ logs, allotments, onRowClick, sortConfig, onSort }) => {
  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={14} className="opacity-50" />;
    return <ArrowUpDown size={14} className={sortConfig.direction === 'asc' ? 'rotate-180' : ''} />;
  };

  const getStatusVariant = (status) => {
    if (status === 'Boarder') return 'success';
    if (status === 'Non-Boarder') return 'warning';
    return 'destructive';
  };

  const isLateEntry = (dateTime) => {
    const hour = moment(dateTime).hour();
    return hour >= 22;
  };

  return (
    <table className="w-full">
      <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 z-10 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th 
              onClick={() => onSort('identity')}
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                Student Identity
                {getSortIcon('identity')}
              </div>
            </th>
            <th 
              onClick={() => onSort('time')}
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                Scan Time
                {getSortIcon('time')}
              </div>
            </th>
            <th 
              onClick={() => onSort('room')}
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                Hostel & Room
                {getSortIcon('room')}
              </div>
            </th>
            <th 
              onClick={() => onSort('status')}
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                Status
                {getSortIcon('status')}
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Mess Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950">
          {logs.map((log, i) => {
            const student = allotments[log['QR Code']?.trim()];
            const isLate = isLateEntry(log.DateTime);
            
            return (
              <tr 
                key={i} 
                onClick={() => onRowClick(log)}
                className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                      <UserCircle size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">
                        {student?.Name || 'Unregistered'}
                      </p>
                      <p className="text-sm text-slate-500 truncate">{log['QR Code']}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {moment(log.DateTime).format('hh:mm A')}
                    </span>
                    <span className="text-sm text-slate-500">
                      {moment(log.DateTime).format('DD MMM YYYY')}
                    </span>
                    {isLate && (
                      <Badge variant="destructive" className="mt-1 w-fit">Late Entry</Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {student?.Hostel || 'N/A'}
                    </span>
                    <span className="text-sm text-slate-500">
                      Room: {student?.Room || '??'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(log.Status)}>
                    {log.Status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={student?.['Mess Status'] === 'ON' ? 'success' : 'secondary'}>
                    {student?.['Mess Status'] || 'N/A'}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
  );
};

export default LogsTable;
