import { X, User, MapPin, Phone, Clock } from 'lucide-react';
import moment from 'moment';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { handleImageErrorSimple, getPlaceholderImage } from '../utils/imageLoader';

const ImageModal = ({ log, student, onClose }) => {
  if (!log) return null;

  const scanImagesPath = localStorage.getItem('scanImagesPath') || '/captured/';
  const profileImagesPath = localStorage.getItem('profileImagesPath') || '/images/students/';

  const imagePath = log.ImagePath?.replace(/\\/g, '/').split('/').pop();
  const scanImageUrl = `${scanImagesPath}${imagePath}`;

  const rollNo = log['QR Code']?.trim();
  const profileImageBasePath = rollNo ? `${profileImagesPath}${rollNo}` : null;
  const profileImageUrl = profileImageBasePath ? `${profileImageBasePath}.png` : null;

  const lateEntryHour = parseInt(localStorage.getItem('lateEntryHour') || '22');
  const entryHour = moment(log.DateTime, 'DD/MM/YYYY HH:mm:ss').hour();
  const isLateEntry = entryHour >= lateEntryHour;

  const getStatusVariant = (status) => {
    if (status === 'Boarder') return 'success';
    if (status === 'Non-Boarder') return 'warning';
    return 'destructive';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Scan Record</h2>
            <p className="text-xs text-slate-500">
              {moment(log.DateTime, 'DD/MM/YYYY HH:mm:ss').format('MMM DD, YYYY [at] hh:mm A')}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X size={16} />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {/* Scan image - compact */}
          <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
            <img
              src={scanImageUrl}
              alt="Scan capture"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = getPlaceholderImage('No Image'); }}
            />
          </div>

          {/* Student identity row */}
          <div className="flex items-center gap-3">
            {profileImageUrl && (
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0">
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageErrorSimple(e, profileImageBasePath)}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                {student?.Name || 'Unregistered'}
              </p>
              <p className="text-xs text-slate-500 truncate">{log['QR Code']}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Badge variant={getStatusVariant(log.Status)} className="text-xs py-0">
                {log.Status}
              </Badge>
              {isLateEntry && (
                <Badge variant="warning" className="text-xs py-0">Late</Badge>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
              <p className="text-slate-400 mb-0.5 flex items-center gap-1"><MapPin size={10} /> Hostel</p>
              <p className="font-medium text-slate-900 dark:text-white truncate">{student?.Hostel || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
              <p className="text-slate-400 mb-0.5 flex items-center gap-1"><MapPin size={10} /> Room</p>
              <p className="font-medium text-slate-900 dark:text-white truncate">{student?.Room || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
              <p className="text-slate-400 mb-0.5 flex items-center gap-1"><Phone size={10} /> Contact</p>
              <p className="font-medium text-slate-900 dark:text-white truncate">{student?.Contact || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
              <p className="text-slate-400 mb-0.5 flex items-center gap-1"><Clock size={10} /> Time</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {moment(log.DateTime, 'DD/MM/YYYY HH:mm:ss').format('hh:mm A')}
              </p>
            </div>
          </div>

          {student?.Arrears && student.Arrears !== '-' && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-2 text-xs">
              <span className="text-red-500 font-medium">Arrears: </span>
              <span className="text-red-700 dark:text-red-300">{student.Arrears}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
