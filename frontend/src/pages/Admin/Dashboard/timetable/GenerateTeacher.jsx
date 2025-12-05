import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar,
  Download,
  Printer,
  Home,
  ChevronRight,
  BookOpen,
  Users,
  Clock,
  DoorOpen,
  Search,
  UserCheck,
  FileText,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { timetableApi } from '../../../../services/timetableApi';
import { employeesApi as employeeApi } from '../../../../services/employeesApi';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const GenerateTeacher = () => {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(teacherId || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
  const [term, setTerm] = useState('1st Term');
  const [stats, setStats] = useState({
    totalPeriods: 0,
    classPeriods: 0,
    freePeriods: 0
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      fetchTimetable();
    }
  }, [selectedTeacher, academicYear, term]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await employeeApi.getEmployees({ role: 'Teacher' });
      setTeachers(response.data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const data = await timetableApi.getTimetableByTeacher(selectedTeacher, {
        academicYear,
        term
      });
      setTimetable(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setTimetable(null);
      setStats({ totalPeriods: 0, classPeriods: 0, freePeriods: 0 });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!data || !data.periods) {
      setStats({ totalPeriods: 0, classPeriods: 0, freePeriods: 0 });
      return;
    }

    const totalPeriods = data.periods.length;
    const classPeriods = data.periods.filter(p => !p.isBreak).length;
    const freePeriods = data.freePeriods || 0;

    setStats({ totalPeriods, classPeriods, freePeriods });
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.employeeRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTeacherData = teachers.find(t => t._id === selectedTeacher);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!timetable || !selectedTeacherData) {
      toast.error('No timetable data to download');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.setTextColor(0, 51, 102);
      doc.text(`${selectedTeacherData.employeeName}`, 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Employee ID: ${selectedTeacherData.employeeId} | Role: ${selectedTeacherData.employeeRole}`, 14, 30);
      doc.text(`Academic Year: ${academicYear} | Term: ${term}`, 14, 38);
      
      // Prepare table data
      const days = timetable.groupedByDay || [];
      
      const tableData = [];
      
      // For each period, create a row
      const allPeriods = {};
      days.forEach(dayGroup => {
        dayGroup.periods.forEach(period => {
          if (period.periodId) {
            allPeriods[period.periodId._id] = {
              name: period.periodId.name,
              timeRange: `${period.periodId.startTime} - ${period.periodId.endTime}`,
              order: period.periodId.order
            };
          }
        });
      });
      
      const sortedPeriods = Object.values(allPeriods).sort((a, b) => a.order - b.order);
      
      sortedPeriods.forEach(period => {
        const row = [period.name, period.timeRange];
        
        // Add data for each day
        days.forEach(dayGroup => {
          const dayPeriod = dayGroup.periods.find(p => 
            p.periodId?._id === Object.keys(allPeriods).find(key => allPeriods[key].name === period.name)
          );
          
          if (dayPeriod) {
            const cellContent = [
              dayPeriod.className || '',
              dayPeriod.subjectId?.name || '',
              dayPeriod.roomId?.name || ''
            ].filter(Boolean).join('\n');
            row.push(cellContent);
          } else {
            row.push('Free Period');
          }
        });
        
        tableData.push(row);
      });
      
      // Add table
      autoTable(doc, {
        head: [['Period', 'Time', ...days.map(dayGroup => dayGroup.day?.name || 'Day')]],
        body: tableData,
        startY: 45,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [0, 51, 102] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      // Save PDF
      doc.save(`${selectedTeacherData.employeeName}_Timetable.pdf`);
      toast.success('Timetable downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download timetable');
    }
  };

  const isBreakOrFree = (subject) => {
    return subject === 'Break' || subject === 'Lunch Break' || subject === 'Free Period';
  };

  const getSubjectColor = (subject) => {
    if (subject === 'Break' || subject === 'Lunch Break') return 'bg-orange-50';
    if (subject === 'Free Period') return 'bg-green-50';
    return 'bg-blue-50';
  };

  if (loading && !timetable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-blue-600 font-semibold">Timetable</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Teacher Timetable</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:mb-4">
          <div className="flex items-center justify-between print:block">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 print:text-2xl print:text-center">Teacher Timetable</h1>
              <p className="text-gray-600 mt-1 print:text-center print:text-sm">View and download teacher-wise schedules</p>
            </div>
            <div className="flex items-center space-x-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
              >
                <Printer className="w-5 h-5" />
                <span className="font-semibold">Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Teacher Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year.toString()}>
                    {year}-{year + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Term
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
                <option value="Annual">Annual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Teacher
              </label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a teacher...</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.employeeName} - {teacher.employeeRole} ({teacher.employeeId})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Timetable Display */}
        {selectedTeacher && selectedTeacherData && timetable ? (
          <div>
            {/* Teacher Info & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <div className="lg:col-span-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white print:bg-white print:text-gray-900 print:border print:border-gray-300">
                <div className="flex items-center space-x-3 mb-4 print:justify-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center print:bg-blue-100">
                    <GraduationCap className="w-6 h-6 print:text-blue-600" />
                  </div>
                  <div className="print:hidden">
                    <h3 className="font-bold text-lg">{selectedTeacherData.employeeName}</h3>
                    <p className="text-blue-100 text-sm">{selectedTeacherData.employeeId}</p>
                  </div>
                </div>
                <div className="space-y-2 print:text-center">
                  <p className="text-sm print:font-bold print:text-gray-900 hidden print:block">{selectedTeacherData.employeeName}</p>
                  <p className="text-sm print:text-xs print:text-gray-600">
                    <span className="font-semibold">Role:</span> {selectedTeacherData.employeeRole}
                  </p>
                  <p className="text-sm print:text-xs print:text-gray-600">
                    <span className="font-semibold">Department:</span> {selectedTeacherData.department || 'N/A'}
                  </p>
                  <p className="text-sm print:text-xs print:text-gray-600">
                    <span className="font-semibold">Academic Year:</span> {academicYear}
                  </p>
                  <p className="text-sm print:text-xs print:text-gray-600">
                    <span className="font-semibold">Term:</span> {term}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:shadow-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Periods</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2 print:text-2xl">{stats.totalPeriods}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center print:w-10 print:h-10">
                    <Clock className="w-6 h-6 text-purple-600 print:w-5 print:h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:shadow-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Class Periods</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2 print:text-2xl">{stats.classPeriods}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center print:w-10 print:h-10">
                    <BookOpen className="w-6 h-6 text-blue-600 print:w-5 print:h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:shadow-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Free Periods</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2 print:text-2xl">{stats.freePeriods}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center print:w-10 print:h-10">
                    <UserCheck className="w-6 h-6 text-green-600 print:w-5 print:h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 print:bg-gray-100">
                      <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 print:text-xs print:py-2">
                        Time / Day
                      </th>
                      {timetable.groupedByDay?.map(dayGroup => (
                        <th key={dayGroup.day._id} className="px-4 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 print:text-xs print:py-2">
                          {dayGroup.day.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Get all unique periods
                      const allPeriods = {};
                      timetable.groupedByDay?.forEach(dayGroup => {
                        dayGroup.periods.forEach(period => {
                          if (period.periodId) {
                            allPeriods[period.periodId._id] = period.periodId;
                          }
                        });
                      });
                      
                      const sortedPeriods = Object.values(allPeriods).sort((a, b) => a.order - b.order);
                      
                      return sortedPeriods.map(period => {
                        const isBreakPeriod = period.name === 'Break' || period.name === 'Lunch Break';
                        
                        return (
                          <tr key={period._id} className={`border-b border-gray-200 ${isBreakPeriod ? 'bg-orange-50 print:bg-gray-50' : 'hover:bg-gray-50'}`}>
                            <td className="px-4 py-3 border-r border-gray-200 print:py-2">
                              <div className="font-semibold text-gray-900 text-sm print:text-xs">{period.name}</div>
                              <div className="text-xs text-gray-500 mt-1 print:text-[10px]">{period.startTime} - {period.endTime}</div>
                            </td>
                            {timetable.groupedByDay?.map(dayGroup => {
                              const dayPeriod = dayGroup.periods.find(p => p.periodId?._id === period._id);
                              const isPeriodBreakOrFree = isBreakOrFree(dayPeriod?.subjectId?.name || (dayPeriod ? 'Free Period' : ''));
                              
                              return (
                                <td key={dayGroup.day._id} className={`px-3 py-3 text-center border-r border-gray-200 ${getSubjectColor(dayPeriod?.subjectId?.name || (dayPeriod ? 'Free Period' : ''))} print:py-2`}>
                                  {dayPeriod ? (
                                    isPeriodBreakOrFree ? (
                                      <div className={`text-sm font-semibold print:text-xs ${
                                        dayPeriod.subjectId?.name === 'Free Period' ? 'text-green-700' : 'text-orange-700'
                                      }`}>
                                        {dayPeriod.subjectId?.name || 'Free Period'}
                                      </div>
                                    ) : (
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-center space-x-1">
                                          <Users className="w-3 h-3 text-blue-600 print:hidden" />
                                          <span className="font-bold text-gray-900 text-sm print:text-xs">
                                            {dayPeriod.className || 'N/A'}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-600 print:text-[10px]">
                                          <BookOpen className="w-3 h-3 print:hidden" />
                                          <span>{dayPeriod.subjectId?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 print:text-[10px]">
                                          <DoorOpen className="w-3 h-3 print:hidden" />
                                          <span>{dayPeriod.roomId?.name || 'Not assigned'}</span>
                                        </div>
                                      </div>
                                    )
                                  ) : (
                                    <div className="text-sm font-semibold text-green-700 print:text-xs">
                                      Free Period
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 print:mt-4 print:shadow-none print:page-break-before">
              <h3 className="text-lg font-bold text-gray-900 mb-4 print:text-sm">Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <Users className="w-5 h-5 text-blue-600 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm print:text-xs">Class</p>
                    <p className="text-xs text-gray-500 print:text-[10px]">Assigned class</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <BookOpen className="w-5 h-5 text-purple-600 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm print:text-xs">Subject</p>
                    <p className="text-xs text-gray-500 print:text-[10px]">Teaching subject</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <DoorOpen className="w-5 h-5 text-green-600 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm print:text-xs">Room</p>
                    <p className="text-xs text-gray-500 print:text-[10px]">Classroom location</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <Clock className="w-5 h-5 text-orange-600 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm print:text-xs">Free Period</p>
                    <p className="text-xs text-gray-500 print:text-[10px]">No class assigned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedTeacher ? 'No Timetable Found' : 'No Teacher Selected'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {selectedTeacher 
                ? `No timetable found for selected teacher in ${academicYear} ${term}.`
                : 'Please select a teacher from the dropdown above to view their timetable'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateTeacher;