import { useState, useMemo } from 'react';
import { Search, MapPin, Phone, User, Home, X, Calendar, CreditCard } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectItem } from '../components/ui/select';
import { handleImageErrorSimple } from '../utils/imageLoader';

const StudentModal = ({ student, onClose }) => {
  if (!student) return null;

  const profileImagesPath = localStorage.getItem('profileImagesPath') || '/images/students/';
  const rollNo = student['Roll No.']?.trim();
  const profileImageBasePath = rollNo ? `${profileImagesPath}${rollNo}` : null;
  const profileImageUrl = profileImageBasePath ? `${profileImageBasePath}.png` : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex-1 min-w-0 pr-2">
            <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white truncate">Student Details</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {student['Roll No.']}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
            <X size={20} />
          </Button>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {/* Profile Image */}
            <div className="space-y-2 sm:space-y-4">
              {profileImageUrl && (
                <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={profileImageUrl}
                    alt="Student profile"
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageErrorSimple(e, profileImageBasePath)}
                  />
                </div>
              )}
            </div>

            {/* Student Info */}
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
                        {student.Name}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-cyan-200 dark:border-cyan-900">
                    <p className="text-xs sm:text-sm text-cyan-700 dark:text-cyan-400">Roll Number</p>
                    <p className="text-sm sm:text-lg font-medium text-cyan-900 dark:text-cyan-100 break-all">{student['Roll No.']}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Card>
                  <CardContent className="p-2 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <Home size={14} className="text-cyan-600 flex-shrink-0" />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Hostel</p>
                    </div>
                    <p className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
                      {student.Hostel || 'N/A'}
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
                      {student.Room || 'N/A'}
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
                      {student.Contact || 'N/A'}
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
                      {student.Batch || 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-2 sm:p-4">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <CreditCard size={14} className="text-cyan-600 flex-shrink-0" />
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Mess Status</p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white">
                      {student['Mess Status'] || 'N/A'}
                    </p>
                    <Badge variant={student['Mess Status'] === 'ON' ? 'success' : 'secondary'} className="text-xs">
                      {student['Mess Status'] === 'ON' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {student.Arrears && student.Arrears !== '-' && (
                <Card className="border-red-200 dark:border-red-900">
                  <CardContent className="p-2 sm:p-4 bg-red-50 dark:bg-red-950">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Arrears</p>
                    <p className="text-sm sm:text-lg font-semibold text-red-700 dark:text-red-300">
                      {student.Arrears}
                    </p>
                  </CardContent>
                </Card>
              )}

              {student.TotalCollection && (
                <Card>
                  <CardContent className="p-2 sm:p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Total Collection</p>
                    <p className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white">
                      {student.TotalCollection}
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

const Students = ({ allotments, isMobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

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
      <div className="hidden md:block p-3 md:p-6 space-y-4 md:space-y-6 overflow-auto pb-20 md:pb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student, index) => (
            <Card 
              key={index} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                    <User size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                      {student.Name}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">{student['Roll No.']}</p>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Home size={14} className="text-cyan-600 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-400 truncate">
                          {student.Hostel} - Room {student.Room}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-cyan-600 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-400 truncate">
                          {student.Contact || 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        <Badge variant={student['Mess Status'] === 'ON' ? 'success' : 'secondary'}>
                          Mess: {student['Mess Status']}
                        </Badge>
                        <Badge variant="outline">
                          Batch: {student.Batch}
                        </Badge>
                        {student.Arrears && student.Arrears !== '-' && (
                          <Badge variant="destructive">
                            Arrears: {student.Arrears}
                          </Badge>
                        )}
                      </div>
                    </div>
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
