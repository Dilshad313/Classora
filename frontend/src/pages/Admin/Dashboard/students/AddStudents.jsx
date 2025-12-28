import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  X,
  Upload,
  User,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Users,
  UserPlus,
  ArrowLeft,
  Heart,
  Briefcase,
  DollarSign,
  FileText,
  AlertCircle,
  ChevronRight,
  Hash,
  School,
  Cross,
  Stethoscope,
  StickyNote,
  Home,
  Mail,
  Lock,
  Save
} from 'lucide-react';
import { createStudent, updateStudent, getStudentById } from '../../../../services/studentApi';
import { classApi } from '../../../../services/classApi';
import toast from 'react-hot-toast';

const AddStudents = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
    studentName: '',
    picture: null,
    dateOfAdmission: '',
    selectClass: '',
    discountInFee: '',
    mobileNo: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    fatherName: '',
    fatherMobile: '',
    fatherOccupation: '',
    motherName: '',
    motherMobile: '',
    motherOccupation: '',
    documents: [],
    registrationNo: '',
    orphanStudent: '',
    caste: '',
    osc: '',
    identificationMark: '',
    previousSchool: '',
    religion: '',
    previousIdBoardRollNo: '',
    selectFamily: '',
    disease: '',
    additionalNote: '',
    totalSiblings: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loading, setLoading] = useState(isEditMode);
  const [existingPicture, setExistingPicture] = useState(null);
  const [existingDocuments, setExistingDocuments] = useState([]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  useEffect(() => {
    fetchClasses();
    if (isEditMode) {
      fetchStudentData();
    }
  }, [id]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const data = await getStudentById(id);
      
      // Format date fields
      const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      setFormData({
        studentName: data.studentName || '',
        picture: null,
        dateOfAdmission: formatDate(data.dateOfAdmission) || '',
        selectClass: data.selectClass || '',
        discountInFee: data.discountInFee || '',
        mobileNo: data.mobileNo || '',
        dateOfBirth: formatDate(data.dateOfBirth) || '',
        gender: data.gender || '',
        bloodGroup: data.bloodGroup || '',
        address: data.address || '',
        fatherName: data.fatherName || '',
        fatherMobile: data.fatherMobile || '',
        fatherOccupation: data.fatherOccupation || '',
        motherName: data.motherName || '',
        motherMobile: data.motherMobile || '',
        motherOccupation: data.motherOccupation || '',
        documents: [],
        registrationNo: data.registrationNo || '',
        orphanStudent: data.orphanStudent || '',
        caste: data.caste || '',
        osc: data.osc || '',
        identificationMark: data.identificationMark || '',
        previousSchool: data.previousSchool || '',
        religion: data.religion || '',
        previousIdBoardRollNo: data.previousIdBoardRollNo || '',
        selectFamily: data.selectFamily || '',
        disease: data.disease || '',
        additionalNote: data.additionalNote || '',
        totalSiblings: data.totalSiblings || '',
        email: data.email || '',
        password: ''
      });

      if (data.picture?.url) {
        setExistingPicture(data.picture.url);
      }
      if (data.documents && data.documents.length > 0) {
        setExistingDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to load student data', error);
      toast.error('Failed to load student data');
      navigate('/dashboard/students/all');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await classApi.getAllClassNames();
      setClasses(response);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes. Using default classes.');
      // Fallback to default classes if API fails
      setClasses(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      toast.success(`${field === 'picture' ? 'Photo' : 'Document'} selected successfully!`);
    }
  };

  const handleDocumentsUpload = (event) => {
    const files = Array.from(event.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...(prev.documents || []), ...files]
    }));
    toast.success(`${files.length} document(s) added successfully!`);
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
    toast.success('Document removed!');
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['studentName', 'registrationNo', 'dateOfAdmission', 'selectClass', 'email'];
    
    // Password is only required when adding new student
    if (!isEditMode) {
      requiredFields.push('password');
    }

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate registration number format
    if (formData.registrationNo && !/^[A-Z0-9]+$/.test(formData.registrationNo.toUpperCase())) {
      newErrors.registrationNo = 'Registration number should contain only letters and numbers';
    }

    // Validate mobile number
    if (formData.mobileNo && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(isEditMode ? 'Updating student...' : 'Adding student...');

    try {
      // Extract class number from class name (e.g., "Class 2" -> "2")
      const extractClassNumber = (className) => {
        if (!className) return '';
        const match = className.match(/(\d+)/);
        return match ? match[0] : className;
      };

      // Prepare data for API
      const studentData = {
        studentName: formData.studentName.trim(),
        registrationNo: formData.registrationNo.trim().toUpperCase(),
        dateOfAdmission: formData.dateOfAdmission,
        selectClass: extractClassNumber(formData.selectClass),
        email: formData.email.trim(),
        password: formData.password,
        discountInFee: formData.discountInFee || 0,
        mobileNo: formData.mobileNo || '',
        dateOfBirth: formData.dateOfBirth || '',
        gender: formData.gender || '',
        bloodGroup: formData.bloodGroup || '',
        address: formData.address || '',
        fatherName: formData.fatherName || '',
        fatherMobile: formData.fatherMobile || '',
        fatherOccupation: formData.fatherOccupation || '',
        motherName: formData.motherName || '',
        motherMobile: formData.motherMobile || '',
        motherOccupation: formData.motherOccupation || '',
        orphanStudent: formData.orphanStudent || '',
        caste: formData.caste || '',
        osc: formData.osc || '',
        identificationMark: formData.identificationMark || '',
        previousSchool: formData.previousSchool || '',
        religion: formData.religion || '',
        previousIdBoardRollNo: formData.previousIdBoardRollNo || '',
        selectFamily: formData.selectFamily || '',
        disease: formData.disease || '',
        additionalNote: formData.additionalNote || '',
        totalSiblings: formData.totalSiblings || 0
      };

      if (isEditMode) {
        await updateStudent(id, studentData, formData.picture, formData.documents);
        toast.success('Student updated successfully!', { id: loadingToast });
      } else {
        await createStudent(studentData, formData.picture, formData.documents);
        toast.success('Student added successfully!', { id: loadingToast });
      }
      
      navigate('/dashboard/students/all');
    } catch (error) {
      console.error('Error adding student:', error);
      
      // Handle duplicate registration/admission number error
      const errorMessage = error.message || '';
      const errorLower = errorMessage.toLowerCase();
      const isDuplicateError = 
        error.status === 409 || 
        error.isDuplicate ||
        error.field === 'registrationNo' ||
        errorLower.includes('registration') || 
        errorLower.includes('admission') ||
        errorLower.includes('already exists');
      
      if (isDuplicateError) {
        // Set error on registration number field
        setErrors(prev => ({
          ...prev,
          registrationNo: 'This registration number is already in use. Please use a different one.'
        }));
        
        // Scroll to registration number field after a short delay to ensure DOM is updated
        setTimeout(() => {
          // Use the ID to find the registration input
          const registrationInput = document.getElementById('registrationNo-input') ||
                                   document.querySelector('input[name="registrationNo"]') ||
                                   document.querySelector('input[placeholder="STU001"]');
          
          if (registrationInput) {
            registrationInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              registrationInput.focus();
              registrationInput.select();
            }, 300);
          }
        }, 100);
        
        toast.error('Registration number already exists. Please use a different registration number.', { 
          id: loadingToast,
          duration: 5000 
        });
      } else {
        toast.error(error.message || 'Failed to add student. Please try again.', { id: loadingToast });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-5xl mx-auto flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <button
            onClick={() => navigate('/dashboard/students/all')}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
          >
            Students
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span className="text-gray-900 dark:text-white font-semibold">Add New</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/students/all')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isEditMode ? 'Edit Student' : 'Add New Student'}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{isEditMode ? 'Update student information' : 'Fill in the student information to create a new record'}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-8 space-y-10">
              {/* Personal Information */}
              <div>
                <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-blue-100 dark:border-blue-900">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.studentName}
                        onChange={(e) => handleInputChange('studentName', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                          errors.studentName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                        placeholder="Enter student full name"
                      />
                    </div>
                    {errors.studentName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.studentName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Registration No <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        id="registrationNo-input"
                        name="registrationNo"
                        value={formData.registrationNo}
                        onChange={(e) => handleInputChange('registrationNo', e.target.value.toUpperCase())}
                        disabled={isEditMode}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                          errors.registrationNo ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        } ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                        placeholder="STU001"
                      />
                    </div>
                    {errors.registrationNo && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.registrationNo}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="tel"
                        value={formData.mobileNo}
                        onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                          errors.mobileNo ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    {errors.mobileNo && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.mobileNo}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Date of Admission <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="date"
                        value={formData.dateOfAdmission}
                        onChange={(e) => handleInputChange('dateOfAdmission', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                          errors.dateOfAdmission ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      />
                    </div>
                    {errors.dateOfAdmission && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.dateOfAdmission}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Select Class <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" />
                      <select
                        value={formData.selectClass}
                        onChange={(e) => handleInputChange('selectClass', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                          errors.selectClass ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        <option value="">Select Class</option>
                        {classes.map(className => (
                          <option key={className} value={className}>{className}</option>
                        ))}
                      </select>
                      <ChevronRight className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    </div>
                    {errors.selectClass && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.selectClass}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                          errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                        placeholder="student@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Password {!isEditMode && <span className="text-red-500">*</span>}
                      {isEditMode && <span className="text-gray-500 text-xs ml-2">(Leave blank to keep current password)</span>}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                          errors.password ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                        placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"}
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Gender
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" />
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronRight className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Discount in Fee (%)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="number"
                        value={formData.discountInFee}
                        onChange={(e) => handleInputChange('discountInFee', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Blood Group
                    </label>
                    <div className="relative">
                      <Heart className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" />
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                      <ChevronRight className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows="3"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 resize-none"
                        placeholder="Enter full address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-green-100 dark:border-green-900">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Additional Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Orphan Student
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" />
                      <select
                        value={formData.orphanStudent}
                        onChange={(e) => handleInputChange('orphanStudent', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                      <ChevronRight className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Caste
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.caste}
                        onChange={(e) => handleInputChange('caste', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter caste"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      OSC (Other Special Category)
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" />
                      <select
                        value={formData.osc}
                        onChange={(e) => handleInputChange('osc', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                      >
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                      <ChevronRight className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 dark:text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Any Identification Mark?
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.identificationMark}
                        onChange={(e) => handleInputChange('identificationMark', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter identification mark"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Previous School
                    </label>
                    <div className="relative">
                      <School className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.previousSchool}
                        onChange={(e) => handleInputChange('previousSchool', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter previous school name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Religion
                    </label>
                    <div className="relative">
                      <Cross className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.religion}
                        onChange={(e) => handleInputChange('religion', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter religion"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Previous ID / Board Roll No
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.previousIdBoardRollNo}
                        onChange={(e) => handleInputChange('previousIdBoardRollNo', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter previous ID or board roll no"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Select Family
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.selectFamily}
                        onChange={(e) => handleInputChange('selectFamily', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter family name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Disease (if any)
                    </label>
                    <div className="relative">
                      <Stethoscope className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.disease}
                        onChange={(e) => handleInputChange('disease', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter disease if any"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Total Siblings
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="number"
                        value={formData.totalSiblings}
                        onChange={(e) => handleInputChange('totalSiblings', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter number of siblings"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Any Additional Note
                    </label>
                    <div className="relative">
                      <StickyNote className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                      <textarea
                        value={formData.additionalNote}
                        onChange={(e) => handleInputChange('additionalNote', e.target.value)}
                        rows="3"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 resize-none"
                        placeholder="Enter any additional notes"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent/Guardian Information */}
              <div>
                <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-purple-100 dark:border-purple-900">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Parent/Guardian Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Father's Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.fatherName}
                        onChange={(e) => handleInputChange('fatherName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter father's name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Father's Mobile
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="tel"
                        value={formData.fatherMobile}
                        onChange={(e) => handleInputChange('fatherMobile', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Father's Occupation
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.fatherOccupation}
                        onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter occupation"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Mother's Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.motherName}
                        onChange={(e) => handleInputChange('motherName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter mother's name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Mother's Mobile
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="tel"
                        value={formData.motherMobile}
                        onChange={(e) => handleInputChange('motherMobile', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Mother's Occupation
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        value={formData.motherOccupation}
                        onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500"
                        placeholder="Enter occupation"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Upload */}
              <div>
                <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-indigo-100 dark:border-indigo-900">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center">
                    <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Student Photo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-700/50">
                      {existingPicture && !formData.picture && (
                        <div className="mb-4">
                          <img
                            src={existingPicture}
                            alt="Current photo"
                            className="w-32 h-32 rounded-xl object-cover mx-auto border-2 border-gray-200 dark:border-gray-600"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Current photo</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'picture')}
                        className="hidden"
                        id="student-photo"
                      />
                      <label
                        htmlFor="student-photo"
                        className="cursor-pointer inline-flex flex-col items-center"
                      >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-3">
                          <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload photo</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                      </label>
                      {formData.picture && (
                        <div className="mt-3">
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">
                            ✓ {formData.picture.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, picture: null }))}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Additional Documents
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-700/50">
                      <input
                        type="file"
                        multiple
                        onChange={handleDocumentsUpload}
                        className="hidden"
                        id="documents-upload"
                      />
                      <label
                        htmlFor="documents-upload"
                        className="cursor-pointer inline-flex flex-col items-center"
                      >
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center mb-3">
                          <FileText className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload documents</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOC, JPG up to 5MB each</span>
                      </label>
                      {existingDocuments.length > 0 && (
                        <div className="mt-3 mb-3">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Current documents:</p>
                          <div className="space-y-1 max-h-20 overflow-y-auto">
                            {existingDocuments.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 p-2 rounded">
                                <span className="truncate flex-1">{doc.name}</span>
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 ml-2"
                                >
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {formData.documents && formData.documents.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">
                            ✓ {formData.documents.length} new file(s) selected
                          </p>
                          <div className="space-y-1 max-h-20 overflow-y-auto">
                            {formData.documents.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                                <span className="truncate flex-1">{doc.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(index)}
                                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 ml-2"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50">
              <button
                type="button"
                onClick={() => navigate('/dashboard/students/all')}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-white dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all font-medium flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  isSubmitting || loading
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-gray-200 dark:text-gray-400'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting || loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white dark:border-gray-300 border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
                    <span>{isEditMode ? 'Updating Student...' : 'Adding Student...'}</span>
                  </>
                ) : (
                  <>
                    {isEditMode ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    <span>{isEditMode ? 'Update Student' : 'Add Student'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudents;