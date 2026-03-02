import { X, User, MapPin, Phone, Calendar, Clock } from 'lucide-react';
import moment from 'moment';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

const ImageModal = ({ log, student, onClose }) => {
  if (!log) return null;

  // Get configured paths from localStorage
  const scanImagesPath = localStorage.getItem('scanImagesPath') || '/captured/';
  const profileImagesPath = localStorage.getItem('profileImagesPath') || '/images/students/';

  // Extract filename from Image_Path column
  const imagePath = log.ImagePath?.replace(/\\/g, '/').split('/').pop();
  const scanImageUrl = `${scanImagesPath}${imagePath}`;
  
  // Profile image based on roll number
  const rollNo = log['QR Code']?.trim();
  const profileImageUrl = rollNo ? `${profileImagesPath}${rollNo}.png` : null;

  // Check if entry is late
  const lateEntryHour = parseInt(localStorage.getItem('lateEntryHour') || '22');
  const entryHour = moment(log.DateTime, 'DD/MM/YYYY HH:mm:ss').hour();
  const isLateEntry = entryHour >= lateEntryHour;

  const getStatusVariant = (status) => {
    if (status === 'Boarder') return 'success';
    if (status === 'Non-Boarder') return 'warning';
    return 'destructive';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex-1 min-w-0 pr-2">
            <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white truncate">Scan Record</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {moment(log.DateTime, 'DD/MM/YYYY HH:mm:ss').format('MMM DD, YYYY [at] hh:mm A')}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
            <X size={20} />
          </Button>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {/* Image Section */}
            <div className="space-y-2 sm:space-y-4">
              {/* Scan Capture Image */}
              <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                <img
                  src={scanImageUrl}
                  alt="Scan capture"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14"%3EScan Image Not Available%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              
              {/* Profile Image - Hidden on mobile to save space */}
              {profileImageUrl && (
                <div className="hidden sm:block aspect-square bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={profileImageUrl}
                    alt="Student profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Try .jpg extension if .png fails
                      if (e.target.src.endsWith('.png')) {
                        e.target.src = `${profileImagesPath}${rollNo}.jpg`;
                      } else {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23f1f5f9" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif" font-size="14"%3EProfile Not Available%3C/text%3E%3C/svg%3E';
                      }
                    }}
                  />
                </div>
              )}
              
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Scan Status</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getStatusVariant(log.Status)} className="text-sm sm:text-base px-2 sm:px-3 py-1">
                      {log.Status}
                    </Badge>
                    {isLateEntry && (
                      <Badge variant="warning" className="text-sm sm:text-base px-2 sm:px-3 py-1">
                        Late Entry
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student Info Section */}
            <div className="space-y-2 sm:space-y-4">
              <Card className="bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-900">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <User size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-cyan-700 dark:text-cyan-400">Student Name</p>
                      <p className="text-base sm:text-xl font-semibold text-cyan-900 dark:text-cyan-100 truncate">
                        {student?.Name || 'Unregistered'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-cyan-200 dark:border-cyan-900">
                    <p className="text-xs sm:text-sm text-cyan-700 dark:text-cyan-400">Roll Number</p>
                    <p className="text-sm sm:text-lg font-medium text-cyan-900 dark:text-cyan-100 break-all">{log['QR Code']}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Card>
                  <CardContent className="p-2 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <MapPin size={14} className="text-cyan-600 flex-shrink-0" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Hostel</p>
                    </div>
                    <p className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
                      {student?.Hostel || 'N/A'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-2 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <MapPin size={14} className="text-cyan-600 flex-shrink-0" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Room</p>
                    </div>
                    <p className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
                      {student?.Room || 'N/A'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-2 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <Phone size={14} className="text-cyan-600 flex-shrink-0" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Contact</p>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {student?.Contact || 'N/A'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-2 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <Calendar size={14} className="text-cyan-600 flex-shrink-0" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Batch</p>
                    </div>
                    <p className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
                      {student?.Batch || 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-2 sm:p-4">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <Clock size={14} className="text-cyan-600 flex-shrink-0" />
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Entry Time</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white">
                      {moment(log.DateTime, 'DD/MM/YYYY HH:mm:ss').format('hh:mm A')}
                    </p>
                    {isLateEntry && (
                      <Badge variant="warning" className="text-xs">
                        Late
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {student?.Arrears && student.Arrears !== '-' && (
                <Card className="border-red-200 dark:border-red-900">
                  <CardContent className="p-2 sm:p-4 bg-red-50 dark:bg-red-950">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Arrears</p>
                    <p className="text-sm sm:text-lg font-semibold text-red-700 dark:text-red-300">
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
