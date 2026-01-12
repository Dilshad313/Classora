// pages/Login.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, GraduationCap, Crown, Shield, Loader2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminKey: '',
    role: 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasAccount, setHasAccount] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      const role = user.role;
      if (role === 'student') {
        navigate('/student/dashboard');
      } else if (role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
    
    setHasAccount(!!userStr);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.adminKey) {
      newErrors.adminKey = 'Admin key is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const endpoints = {
        admin: 'http://localhost:5000/api/admin/login',
        student: 'http://localhost:5000/api/admin/login/student',
        employee: 'http://localhost:5000/api/admin/login/employee'
      };

      const response = await fetch(endpoints[formData.role], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          adminKey: formData.adminKey.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Login failed');
        return;
      }

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      setHasAccount(true);
      
      // Success toast
      toast.success(`Welcome back, ${data.user.fullName}!`, {
        icon: '👋',
        duration: 3000,
      });

      const targetRole = data.user?.role || formData.role;
      const destination = targetRole === 'student'
        ? '/student/dashboard'
        : targetRole === 'teacher'
          ? '/teacher/dashboard'
          : '/dashboard';

      // Navigate to role-specific dashboard
      setTimeout(() => {
        navigate(destination);
      }, 500);

    } catch (error) {
      console.error('Login error:', error);
      toast.error('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'admin', label: 'Administrator', icon: Crown },
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'employee', label: 'Employee / Teacher', icon: Briefcase }
  ];

  const placeholders = {
    admin: 'admin@example.com',
    student: 'student@example.com',
    employee: 'teacher@example.com'
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="absolute top-20 -left-40 w-96 h-96 bg-purple-900 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-pink-900 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Left hero section */}
          <div className="hidden lg:block space-y-12">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold tracking-tight">Classora</h1>
                <p className="text-xl text-gray-400">Future Leaders Academy</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-bold leading-tight">
                Next-Generation<br/>School Management
              </h2>
              <p className="text-xl text-gray-400">
                All-in-one system for admins, teachers, parents & students.
              </p>
            </div>
          </div>

          {/* Right login form */}
          <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-10 lg:p-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role selector */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-4 block">Select Role</label>
                <div className="grid grid-cols-1 gap-4">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                        className={`py-4 rounded-2xl transition-all flex items-center justify-center gap-3 backdrop-blur-xl border
                          ${formData.role === role.id
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}
                        `}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-base font-medium">{role.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={placeholders[formData.role]}
                    disabled={isLoading}
                    className={`w-full pl-14 pr-5 py-5 rounded-2xl bg-white/5 border backdrop-blur-xl text-white placeholder-gray-500 transition-all
                      ${errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-white/10 focus:border-purple-500'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm ml-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className={`w-full pl-14 pr-16 py-5 rounded-2xl bg-white/5 border backdrop-blur-xl text-white placeholder-gray-500 transition-all
                      ${errors.password ? 'border-red-500/80 focus:border-red-500' : 'border-white/10 focus:border-purple-500'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors disabled:cursor-not-allowed"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm ml-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Admin Key */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Admin Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="adminKey"
                    value={formData.adminKey}
                    onChange={handleChange}
                    placeholder="Enter admin security key"
                    disabled={isLoading}
                    className={`w-full pl-5 pr-5 py-5 rounded-2xl bg-white/5 border backdrop-blur-xl text-white placeholder-gray-500 transition-all
                      ${errors.adminKey ? 'border-red-500/80 focus:border-red-500' : 'border-white/10 focus:border-purple-500'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  />
                </div>
                {errors.adminKey && (
                  <p className="text-red-400 text-sm ml-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                    {errors.adminKey}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-lg 
                  hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] 
                  flex items-center justify-center gap-3 transition-all
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>

              {/* Registration suggestion */}
              <div className="text-center pt-6 border-t border-white/10">
                <p className="text-gray-400 mb-4">Don't have an account?</p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 
                    rounded-2xl font-medium hover:from-emerald-700 hover:to-cyan-700 hover:scale-105 transition-all"
                >
                  <Shield className="w-5 h-5" />
                  Create Admin Account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;