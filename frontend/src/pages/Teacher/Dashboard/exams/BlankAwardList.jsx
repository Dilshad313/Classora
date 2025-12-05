import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  Printer, 
  Trophy, 
  Star, 
  Medal, 
  Crown, 
  Target, 
  BookOpen,
  Users,
  Calendar,
  Eye,
  Plus,
  Edit3,
  CheckCircle2,
  Sparkles,
  Gift,
  Zap,
  TrendingUp
} from 'lucide-react';

const BlankAwardList = () => {
  const [selectedAwardType, setSelectedAwardType] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [numberOfCertificates, setNumberOfCertificates] = useState(1);
  const [customTitle, setCustomTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [showPreview, setShowPreview] = useState(false);
  const [awardsList, setAwardsList] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const awardTypes = [
    { id: 'academic-excellence', name: 'Academic Excellence', icon: Trophy, color: 'text-yellow-600', description: 'For outstanding academic performance' },
    { id: 'perfect-attendance', name: 'Perfect Attendance', icon: Target, color: 'text-green-600', description: 'For 100% attendance record' },
    { id: 'best-student', name: 'Best Student of the Year', icon: Crown, color: 'text-purple-600', description: 'For overall excellence' },
    { id: 'sports-achievement', name: 'Sports Achievement', icon: Medal, color: 'text-blue-600', description: 'For excellence in sports' },
    { id: 'leadership', name: 'Leadership Award', icon: Star, color: 'text-orange-600', description: 'For exceptional leadership qualities' },
    { id: 'improvement', name: 'Most Improved Student', icon: TrendingUp, color: 'text-indigo-600', description: 'For significant academic improvement' },
    { id: 'participation', name: 'Active Participation', icon: Zap, color: 'text-pink-600', description: 'For active class participation' },
    { id: 'custom', name: 'Custom Award', icon: Gift, color: 'text-gray-600', description: 'Create your own award type' }
  ];

  const classes = [
    { id: '10-A', name: 'Class 10-A', students: 35 },
    { id: '10-B', name: 'Class 10-B', students: 32 },
    { id: '9-A', name: 'Class 9-A', students: 30 },
    { id: '9-B', name: 'Class 9-B', students: 28 }
  ];

  const templates = [
    { id: 'classic', name: 'Classic Gold', preview: 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400' },
    { id: 'modern', name: 'Modern Blue', preview: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400' },
    { id: 'elegant', name: 'Elegant Purple', preview: 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400' },
    { id: 'vibrant', name: 'Vibrant Green', preview: 'bg-gradient-to-br from-green-100 to-green-200 border-green-400' }
  ];

  const handleGenerateAwards = () => {
    if (!selectedAwardType || !selectedClass || numberOfCertificates < 1) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedAward = awardTypes.find(award => award.id === selectedAwardType);
    const selectedClassData = classes.find(cls => cls.id === selectedClass);
    
    const newAward = {
      id: Date.now(),
      type: selectedAward?.name || customTitle,
      class: selectedClassData?.name,
      template: selectedTemplate,
      count: numberOfCertificates,
      studentName: studentName,
      date: selectedDate,
      createdAt: new Date().toLocaleDateString(),
      status: 'Generated'
    };

    setAwardsList([newAward, ...awardsList]);
    setShowPreview(true);
  };

  const handlePrintCertificate = () => {
    const printWindow = window.open('', '_blank');
    const certificateContent = document.getElementById('certificate-preview');
    
    if (printWindow && certificateContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Certificate - ${studentName || '[Student Name]'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .certificate { max-width: 800px; margin: 0 auto; padding: 40px; border: 4px solid #d97706; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 16px; }
              .certificate h1 { text-align: center; font-size: 2.5rem; font-weight: bold; color: #374151; margin-bottom: 20px; }
              .certificate .icon { text-align: center; margin-bottom: 20px; }
              .certificate .content { text-align: center; line-height: 1.8; }
              .certificate .student-name { font-size: 1.5rem; font-weight: bold; border-bottom: 2px solid #9ca3af; padding: 10px; margin: 20px auto; width: 300px; }
              .certificate .award-type { font-weight: bold; color: #d97706; }
              .certificate .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
              .certificate .signature { text-align: center; }
              .certificate .signature-line { border-bottom: 1px solid #9ca3af; width: 150px; margin-bottom: 5px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="certificate">
              <div class="icon">🏆</div>
              <h1>CERTIFICATE OF ACHIEVEMENT</h1>
              <div style="border-top: 2px solid #d97706; width: 150px; margin: 0 auto 20px;"></div>
              <div class="content">
                <p style="font-size: 1.2rem; color: #374151;">This is to certify that</p>
                <div class="student-name">${studentName || '[Student Name]'}</div>
                <p style="font-size: 1.2rem; color: #374151;">
                  has been awarded the <span class="award-type">${selectedAwardType === 'custom' ? customTitle : awardTypes.find(a => a.id === selectedAwardType)?.name}</span>
                </p>
                <p style="color: #6b7280;">for outstanding performance in ${classes.find(c => c.id === selectedClass)?.name}</p>
                <p style="color: #6b7280; margin-top: 20px;">Date: ${new Date(selectedDate).toLocaleDateString()}</p>
              </div>
              <div class="signatures">
                <div class="signature">
                  <div class="signature-line"></div>
                  <p style="font-size: 0.9rem; color: #6b7280;">Date</p>
                </div>
                <div class="signature">
                  <div class="signature-line"></div>
                  <p style="font-size: 0.9rem; color: #6b7280;">Teacher's Signature</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadPDF = () => {
    // Create a temporary link element for download
    const element = document.createElement('a');
    const certificateData = {
      studentName: studentName || '[Student Name]',
      awardType: selectedAwardType === 'custom' ? customTitle : awardTypes.find(a => a.id === selectedAwardType)?.name,
      className: classes.find(c => c.id === selectedClass)?.name,
      date: new Date(selectedDate).toLocaleDateString(),
      template: selectedTemplate
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(certificateData, null, 2));
    element.setAttribute("href", dataStr);
    element.setAttribute("download", `certificate-${studentName || 'student'}-${Date.now()}.json`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Show success message
    alert('Certificate data downloaded! You can use this data with a PDF generator or print the certificate directly.');
  };

  const getAwardIcon = (awardTypeId) => {
    const award = awardTypes.find(a => a.id === awardTypeId);
    return award ? award.icon : Award;
  };

  const getTemplateStyle = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    return template?.preview || 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-800 dark:to-orange-800 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Award Certificate Generator</h1>
                <p className="text-amber-100 text-lg">Create and manage student achievement certificates</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-amber-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>Multiple Templates</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Custom Awards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Award Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Edit3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Certificate Configuration</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Design and customize your award certificates</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {/* Award Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Select Award Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {awardTypes.map(award => {
                    const IconComponent = award.icon;
                    return (
                      <button
                        key={award.id}
                        onClick={() => setSelectedAwardType(award.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedAwardType === award.id
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-amber-300 dark:hover:border-amber-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent className={`w-6 h-6 ${award.color}`} />
                          <span className="font-semibold text-gray-800 dark:text-gray-100">{award.name}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{award.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Title for Custom Award */}
              {selectedAwardType === 'custom' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Custom Award Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    placeholder="Enter custom award title..."
                  />
                </div>
              )}

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Certificate Template
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedTemplate === template.id
                          ? 'border-amber-500 ring-2 ring-amber-500/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-amber-300'
                      }`}
                    >
                      <div className={`w-full h-20 ${template.preview} border-2 rounded-lg mb-2 flex items-center justify-center`}>
                        <Award className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{template.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Award Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Class and Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                  >
                    <option value="">Select a class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name} ({cls.students} students)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Number of Certificates <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={numberOfCertificates}
                    onChange={(e) => setNumberOfCertificates(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    placeholder="Enter number of certificates"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleGenerateAwards}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Generate Certificates
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  {showPreview ? 'Hide' : 'Show'} Preview
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Preview */}
        {showPreview && selectedAwardType && selectedClass && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Certificate Preview
              </h3>
            </div>
            <div className="p-6">
              <div id="certificate-preview" className={`max-w-2xl mx-auto p-8 ${getTemplateStyle(selectedTemplate)} border-4 rounded-2xl`}>
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    {React.createElement(getAwardIcon(selectedAwardType), { 
                      className: "w-16 h-16 text-amber-600" 
                    })}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">CERTIFICATE OF ACHIEVEMENT</h2>
                  <div className="border-t-2 border-amber-600 w-32 mx-auto"></div>
                  <p className="text-lg text-gray-700">This is to certify that</p>
                  <div className="border-b-2 border-gray-400 w-64 mx-auto py-2">
                    <p className="text-xl font-semibold text-gray-800">{studentName || '[Student Name]'}</p>
                  </div>
                  <p className="text-lg text-gray-700">
                    has been awarded the <span className="font-bold">
                      {selectedAwardType === 'custom' ? customTitle : awardTypes.find(a => a.id === selectedAwardType)?.name}
                    </span>
                  </p>
                  <p className="text-gray-600">for outstanding performance in {classes.find(c => c.id === selectedClass)?.name}</p>
                  <p className="text-gray-600 mt-4">Date: {new Date(selectedDate).toLocaleDateString()}</p>
                  <div className="flex justify-between items-end mt-8 pt-4">
                    <div className="text-center">
                      <div className="border-b border-gray-400 w-32 mb-1"></div>
                      <p className="text-sm text-gray-600">Date</p>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-gray-400 w-32 mb-1"></div>
                      <p className="text-sm text-gray-600">Teacher's Signature</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button 
                  onClick={handlePrintCertificate}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Certificate
                </button>
                <button 
                  onClick={handleDownloadPDF}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Awards List */}
        {awardsList.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Generated Awards ({awardsList.length})
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {awardsList.map(award => (
                  <div key={award.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">{award.type}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {award.class} • {award.count} certificates • {award.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                        {award.status}
                      </span>
                      <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlankAwardList;
