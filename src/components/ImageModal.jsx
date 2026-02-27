import { X, User, MapPin, Phone, Calendar, CreditCard } from 'lucide-react';
import moment from 'moment';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

const ImageModal = ({ log, student, onClose }) => {
  if (!log) return null;

  const imagePath = log['Image Path']?.replace(/\\/g, '/').split('/').pop();
  const imageUrl = `/captured/${imagePath}`;

  const getStatusVariant = (status) => {
    if (status === 'Boarder') return 'success';
    if (status === 'Non-Boarder') return 'warning';
    return 'destructive';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Scan Record</h2>
            <p className="text-sm text-slate-500 mt-1">
              {moment(log.DateTime).format('MMMM DD, YYYY [at] hh:mm A')}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                <img
                  src={imageUrl}
                  alt="Scan capture"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="18"%3EImage Not Available%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Scan Status</p>
                  <Badge variant={getStatusVariant(log.Status)} className="text-base px-3 py-1">
                    {log.Status}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Student Info Section */}
            <div className="space-y-4">
              <Card className="bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-900">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white">
                      <User size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-cyan-700 dark:text-cyan-400">Student Name</p>
                      <p className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 truncate">
                        {student?.Name || 'Unregistered'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-cyan-200 dark:border-cyan-900">
                    <p className="text-sm text-cyan-700 dark:text-cyan-400">Roll Number</p>
                    <p className="text-lg font-medium text-cyan-900 dark:text-cyan-100">{log['QR Code']}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-cyan-600" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Hostel</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {student?.Hostel || 'N/A'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-cyan-600" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Room</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {student?.Room || 'N/A'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone size={16} className="text-cyan-600" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Contact</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {student?.Contact || 'N/A'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-cyan-600" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Batch</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {student?.Batch || 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={16} className="text-cyan-600" />
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Mess Status</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {student?.['Mess Status'] || 'N/A'}
                    </p>
                    <Badge variant={student?.['Mess Status'] === 'ON' ? 'success' : 'secondary'}>
                      {student?.['Mess Status'] === 'ON' ? 'Allowed' : 'Not Allowed'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {student?.Arrears && (
                <Card className="border-red-200 dark:border-red-900">
                  <CardContent className="p-4 bg-red-50 dark:bg-red-950">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Arrears</p>
                    <p className="text-lg font-semibold text-red-700 dark:text-red-300">
                      {student.Arrears}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImageModal;
