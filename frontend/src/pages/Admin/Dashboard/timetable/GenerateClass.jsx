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
  Filter,
  FileText,
  Loader2
} from 'lucide-react';
import { timetableApi } from '../../../../services/timetableApi';
import { classApi } from '../../../../services/classApi';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const GenerateClass = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(classId || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
  const [term, setTerm] = useState('1st Term');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable();
    }
  }, [selectedClass, academicYear, term]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await classApi.getAllClasses();
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const data = await timetableApi.getTimetableByClass(selectedClass, {
        academicYear,
        term
      });
      setTimetable(data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setTimetable(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedClassData = classes.find(c => c._id === selectedClass);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!timetable || !selectedClassData) {
      toast.error('No timetable data to download');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.setTextColor(0, 51, 102);
      doc.text(`${selectedClassData.className} - ${selectedClassData.section}`, 14, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Academic Year: ${academicYear} | Term: ${term}`, 14, 30);
      doc.text(`Total Students: ${selectedClassData.studentCount || 0}`, 14, 38);
      
      // Prepare table data
      const days = timetable.timetableByDay ? Object.keys(timetable.timetableByDay) : [];
      const periods = timetable.periods ? Array.from(new Set(timetable.periods.map(p => p.periodId?._id))) : [];
      
      const tableData = [];
      
      // For each period, create a row
      periods.forEach(periodId => {
        const period = timetable.periods.find(p => p.periodId?._id === periodId);
        const row = [period?.periodId?.name || '', period?.periodId?.timeRange || ''];
        
        // Add data for each day
        days.forEach(dayId => {
          const dayPeriod = timetable.periods.find(p => 
            p.dayId?._id === dayId && p.periodId?._id === periodId
          );
          
          if (dayPeriod) {
            const cellContent = [
              dayPeriod.subjectId?.name || '',
              dayPeriod.teacherId?.employeeName || '',
              dayPeriod.roomId?.name || ''
            ].filter(Boolean).join('\n');
            row.push(cellContent);
          } else {
            row.push('');
          }
        });
        
        tableData.push(row);
      });
      
      // Add table
      autoTable(doc, {
        head: [['Period', 'Time', ...days.map(dayId => {
          const day = timetable.periods.find(p => p.dayId?._id === dayId)?.dayId;
          return day?.name || 'Day';
        })]],
        body: tableData,
        startY: 45,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [0, 51, 102] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      // Save PDF
      doc.save(`${selectedClassData.className}_${selectedClassData.section}_Timetable.pdf`);
      toast.success('Timetable downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to download timetable');
    }
  };

  const isBreak = (subject) => {
    return subject === 'Break' || subject === 'Lunch Break';
  };

  if (loading && !timetable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm print:hidden">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Timetable</span>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-gray-100 font-semibold">Class Timetable</span>
        </div>

        {/* Header */}
        <div className="mb-8 print:mb-4">
          <div className="flex items-center justify-between print:block">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 print:text-2xl print:text-center">Class Timetable</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 print:text-center print:text-sm">View and download class-wise schedules</p>
            </div>
            <div className="flex items-center space-x-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Printer className="w-5 h-5" />
                <span className="font-semibold">Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white rounded-xl hover:from-green-700 hover:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                <span className="font-semibold">Download PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              >
                {[2023, 2024, 2025, 2026].map(year => (
                  <option key={year} value={year.toString()}>
                    {year}-{year + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Term
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              >
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
                <option value="Annual">Annual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              >
                <option value="">Choose a class...</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className} - {cls.section}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Timetable Display */}
        {selectedClass && selectedClassData && timetable ? (
          <div>
            {/* Class Info */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-800 rounded-2xl shadow-lg p-6 mb-6 text-white print:bg-white print:text-gray-900 print:border print:border-gray-300">
              <div className="flex items-center justify-between print:block">
                <div>
                  <h2 className="text-2xl font-bold print:text-xl print:text-center">{selectedClassData.className} - {selectedClassData.section}</h2>
                  <p className="text-blue-100 dark:text-blue-200 mt-1 print:text-gray-600 print:text-center">
                    Academic Year: {academicYear} | Term: {term} | 
                    Total Students: {selectedClassData.studentCount || 0}
                  </p>
                </div>
                <div className="flex items-center space-x-2 print:hidden">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden print:shadow-none">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 print:bg-gray-100">
                      <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-300 dark:border-gray-600 print:text-xs">
                        Time / Day
                      </th>
                      {Object.keys(timetable.timetableByDay || {}).map(dayId => {
                        const day = timetable.periods.find(p => p.dayId?._id === dayId)?.dayId;
                        return (
                          <th key={dayId} className="px-4 py-4 text-center text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b-2 border-gray-300 dark:border-gray-600 print:text-xs">
                            {day?.name || 'Day'}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Group periods by periodId
                      const uniquePeriods = {};
                      timetable.periods.forEach(p => {
                        if (p.periodId && !uniquePeriods[p.periodId._id]) {
                          uniquePeriods[p.periodId._id] = p.periodId;
                        }
                      });
                      
                      const sortedPeriods = Object.values(uniquePeriods).sort((a, b) => a.order - b.order);
                      
                      return sortedPeriods.map((period, index) => {
                        const isBreakPeriod = isBreak(period.name);
                        
                        return (
                          <tr key={period._id} className={`border-b border-gray-200 dark:border-gray-700 ${isBreakPeriod ? 'bg-orange-50 dark:bg-orange-900/20 print:bg-gray-50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                            <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-600 print:py-2">
                              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm print:text-xs">{period.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 print:text-[10px]">{period.startTime} - {period.endTime}</div>
                            </td>
                            {Object.keys(timetable.timetableByDay || {}).map(dayId => {
                              const dayPeriod = timetable.periods?.find(p => 
                                p.dayId?._id === dayId && p.periodId?._id === period._id
                              );
                              const isPeriodBreak = isBreak(dayPeriod?.subjectId?.name);
                              
                              return (
                                <td key={dayId} className="px-3 py-3 text-center border-r border-gray-200 dark:border-gray-600 print:py-2">
                                  {dayPeriod ? (
                                    isPeriodBreak ? (
                                      <div className="text-sm font-semibold text-orange-700 dark:text-orange-400 print:text-xs">
                                        {dayPeriod.subjectId?.name}
                                      </div>
                                    ) : (
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-center space-x-1">
                                          <BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400 print:hidden" />
                                          <span className="font-bold text-gray-900 dark:text-gray-100 text-sm print:text-xs">
                                            {dayPeriod.subjectId?.name || 'N/A'}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-600 dark:text-gray-400 print:text-[10px]">
                                          <Users className="w-3 h-3 print:hidden" />
                                          <span>{dayPeriod.teacherId?.employeeName || 'Not assigned'}</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 dark:text-gray-500 print:text-[10px]">
                                          <DoorOpen className="w-3 h-3 print:hidden" />
                                          <span>{dayPeriod.roomId?.name || 'Not assigned'}</span>
                                        </div>
                                      </div>
                                    )
                                  ) : (
                                    <span className="text-gray-400 dark:text-gray-500 text-sm print:text-xs">-</span>
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
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 print:mt-4 print:shadow-none">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 print:text-sm">Legend</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm print:text-xs">Subject</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 print:text-[10px]">Class subject</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm print:text-xs">Teacher</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 print:text-[10px]">Assigned teacher</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-lg flex items-center justify-center print:w-8 print:h-8">
                    <DoorOpen className="w-5 h-5 text-green-600 dark:text-green-400 print:w-4 print:h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm print:text-xs">Room</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 print:text-[10px]">Classroom location</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-16 text-center">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {selectedClass ? 'No Timetable Found' : 'No Class Selected'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              {selectedClass 
                ? `No timetable found for selected class in ${academicYear} ${term}. Please create one first.`
                : 'Please select a class from the dropdown above to view its timetable'
              }
            </p>
            {selectedClass && (
              <button
                onClick={() => navigate('/timetable/create')}
                className="mt-4 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Create Timetable</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateClass;