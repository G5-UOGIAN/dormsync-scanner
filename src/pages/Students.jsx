import { useState, useMemo } from 'react';
import { Search, MapPin, Phone, User, Home } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';

const Students = ({ allotments }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const allotmentsList = useMemo(() => {
    return Object.values(allotments);
  }, [allotments]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return allotmentsList;
    
    return allotmentsList.filter(student => {
      const name = student.Name?.toLowerCase() || '';
      const rollNo = student['Roll No.']?.toLowerCase() || '';
      const hostel = student.Hostel?.toLowerCase() || '';
      const room = student.Room?.toLowerCase() || '';
      
      return (
        name.includes(searchTerm.toLowerCase()) ||
        rollNo.includes(searchTerm.toLowerCase()) ||
        hostel.includes(searchTerm.toLowerCase()) ||
        room.includes(searchTerm.toLowerCase())
      );
    });
  }, [allotmentsList, searchTerm]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Allotments</h1>
        <p className="text-sm text-slate-500 mt-1">View and manage student hostel allotments</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            type="text"
            placeholder="Search by name, roll no, hostel, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          Total Students: {filteredStudents.length}
        </Button>
      </div>

      {/* Students Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
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
                Try adjusting your search criteria
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
