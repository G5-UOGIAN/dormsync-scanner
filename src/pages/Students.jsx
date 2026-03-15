import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Phone, User, Home, X, Calendar, CreditCard } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectItem } from '../components/ui/select';
import FullscreenImageViewer from '../components/FullscreenImageViewer';
import LazyAvatar from '../components/LazyAvatar';
import { resolveImageUrl, getCachedImageUrl } from '../utils/imageLoader';

/** Eager avatar with click-to-fullscreen — used inside modals (already visible) */
const ClickableAvatar = ({ basePath, onClick, size = 'w-12 h-12', fallback }) => {
  const [src, setSrc] = useState(() => getCachedImageUrl(basePath));

  useEffect(() => {
    if (!basePath || src) return;
    resolveImageUrl(basePath).then(setSrc);
  }, [basePath, src]);

  return (
    <div
      className={`${size} rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0 flex items-center justify-center text-cyan-600 cursor-pointer hover:ring-2 hover:ring-cyan-500 transition-all`}
      onClick={onClick}
    >
      {src ? (
        <img src={src} alt="Profile" className="w-full h-full object-cover" />
      ) : (
        fallback
      )}
    </div>
  );
};

const StudentModal = ({ student, onClose }) => {
  if (!student) return null;

  const [fullscreenBasePath, setFullscreenBasePath] = useState(null);

  const profileImagesPath = localStorage.getItem('profileImagesPath') || '/images/students/';
  const rollNo = student['Roll No.']?.trim();
  const profileImageBasePath = rollNo ? `${profileImagesPath}${rollNo}` : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Student Details</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X size={16} />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {/* Identity row */}
          <div className="flex items-center gap-3">
            {profileImageBasePath ? (
              <ClickableAvatar
                basePath={profileImageBasePath}
                onClick={() => setFullscreenBasePath(profileImageBasePath)}
                size="w-12 h-12"
                fallback={<User size={22} />}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 flex-shrink-0">
                <User size={22} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{student.Name}</p>
              <p className="text-xs text-slate-500 truncate">{student['Roll No.']}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
              <p className="text-slate-400 mb-0.5 flex items-center gap-1"><Home size={10} /> Hostel</p>
              <p className="font-medium text-slate-900 dark:text-white truncate">{student.Hostel || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
              <p className="text-slate-400 mb-0.5 flex items-center gap-1"><MapPin size={10} /> Room</p>
              <p className="font-medium text-slate-900 dark:text-white truncate">{student.Room || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
              <p className="text-slate-400 mb-0.5 flex items-center gap-1"><Phone size={10} /> Contact</p>
              <p className="font-medium text-slate-900 dark:text-white truncate">{student.Contact || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
              <p className="text-slate-400 mb-0.5 flex items-center gap-1"><Calendar size={10} /> Batch</p>
              <p className="font-medium text-slate-900 dark:text-white truncate">{student.Batch || 'N/A'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
              <p className="text-slate-400 mb-0.5 flex items-center gap-1"><CreditCard size={10} /> Mess</p>
              <p className="font-medium text-slate-900 dark:text-white">{student['Mess Status'] || 'N/A'}</p>
            </div>
            {student.Arrears && student.Arrears !== '-' ? (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-2">
                <p className="text-red-400 mb-0.5">Arrears</p>
                <p className="font-medium text-red-700 dark:text-red-300">{student.Arrears}</p>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2">
                <p className="text-slate-400 mb-0.5">Arrears</p>
                <p className="font-medium text-slate-900 dark:text-white">None</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {fullscreenBasePath && (
        <FullscreenImageViewer
          basePath={fullscreenBasePath}
          alt="Profile photo"
          onClose={() => setFullscreenBasePath(null)}
        />
      )}
    </div>
  );
};

const Students = ({ allotments, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const profileImagesPath = localStorage.getItem('profileImagesPath') || '/images/students/';

  const allotmentsList = useMemo(() => {
    return Object.values(allotments);
  }, [allotments]);

  // Get unique hostels
  const hostels = useMemo(() => {
    const uniqueHostels = [...new Set(allotmentsList.map(s => s.Hostel).filter(Boolean))];
    return uniqueHostels.sort();
  }, [allotmentsList]);

  // Get rooms for selected hostel
  const rooms = useMemo(() => {
    if (!selectedHostel) return [];
    const hostelRooms = allotmentsList
      .filter(s => s.Hostel === selectedHostel)
      .map(s => s.Room)
      .filter(Boolean);
    return [...new Set(hostelRooms)].sort();
  }, [allotmentsList, selectedHostel]);

  const filteredStudents = useMemo(() => {
    let filtered = allotmentsList;

    // Filter by hostel
    if (selectedHostel) {
      filtered = filtered.filter(s => s.Hostel === selectedHostel);
    }

    // Filter by room
    if (selectedRoom) {
      filtered = filtered.filter(s => s.Room === selectedRoom);
    }

    // Filter by search term (name or roll number)
    if (searchTerm) {
      filtered = filtered.filter(student => {
        const name = student.Name?.toLowerCase() || '';
        const rollNo = student['Roll No.']?.toLowerCase() || '';
        return (
          name.includes(searchTerm.toLowerCase()) ||
          rollNo.includes(searchTerm.toLowerCase())
        );
      });
    }

    return filtered;
  }, [allotmentsList, searchTerm, selectedHostel, selectedRoom]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSearchInput('');
    setSelectedHostel('');
    setSelectedRoom('');
  };

  return (
    <div className="p-3 flex-1 flex flex-col overflow-hidden">
      <div className="hidden md:block px-3 md:px-6 pt-4 md:pt-6 pb-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Allotments</h1>
        <p className="text-sm text-slate-500 mt-1">View and manage student hostel allotments</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Hostel Select */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Hostel
              </label>
              <Select
                value={selectedHostel}
                onValueChange={(value) => {
                  setSelectedHostel(value);
                  setSelectedRoom(''); // Reset room when hostel changes
                }}
                placeholder="All Hostels"
              >
                {hostels.map(hostel => (
                  <SelectItem key={hostel} value={hostel}>
                    {hostel}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Room Select */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Room
              </label>
              <Select
                value={selectedRoom}
                onValueChange={setSelectedRoom}
                placeholder="All Rooms"
                disabled={!selectedHostel}
              >
                {rooms.map(room => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Search by Name/Roll No */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Search
              </label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    type="text"
                    placeholder="Name or Roll No..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setSearchTerm(searchInput); }}
                    className="pl-9"
                  />
                </div>
                <Button size="sm" onClick={() => setSearchTerm(searchInput)}>
                  Search
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Actions
              </label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  className="flex-1"
                >
                  Clear
                </Button>
                <Button variant="outline" className="flex-1">
                  {filteredStudents.length} Found
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="flex-1 mt-3 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {filteredStudents.map((student, index) => (
            <Card 
              key={index} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <CardContent className="p-3">
                {/* Top row: avatar + name + roll */}
                <div className="flex items-center gap-2">
                  {(() => {
                    const sRollNo = student['Roll No.']?.trim();
                    const sBasePath = sRollNo ? `${profileImagesPath}${sRollNo}` : null;
                    return (
                      <LazyAvatar
                        basePath={sBasePath}
                        fallback={<User size={18} />}
                      />
                    );
                  })()}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {student.Name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{student['Roll No.']}</p>
                  </div>
                  {student.Arrears && student.Arrears !== '-' && (
                    <Badge variant="destructive" className="text-xs py-0 shrink-0">Arrears</Badge>
                  )}
                </div>
                {/* Bottom row: two-column detail grid */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-2">
                  <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 truncate">
                    <Home size={11} className="text-cyan-600 flex-shrink-0" />
                    <span className="truncate">{student.Hostel || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 truncate">
                    <MapPin size={11} className="text-cyan-600 flex-shrink-0" />
                    <span className="truncate">Room {student.Room || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 truncate col-span-2">
                    <Phone size={11} className="text-cyan-600 flex-shrink-0" />
                    <span className="truncate">{student.Contact || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <User className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                No Students Found
              </p>
              <p className="text-sm text-slate-500">
                Try adjusting your filters
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default Students;
