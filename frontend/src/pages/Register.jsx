// pages/Register.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Shield, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.adminKey) {
      newErrors.adminKey = 'Admin key is required';
    } else if (formData.adminKey !== 'CLASSORA2025') {
      newErrors.adminKey = 'Invalid admin key';
    }

    return newErrors;
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    // Show loading toast
    const loadingToast = toast.loading('Creating your account...');

    try {
      const response = await fetch('http://localhost:5000/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          adminKey: formData.adminKey
        })
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        toast.error(data.message || 'Registration failed');
        return;
      }

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      // Success toast with custom styling
      toast.success(
        <div className="flex flex-col">
          <span className="font-semibold">Account Created Successfully!</span>
          <span className="text-sm opacity-90">Welcome to Classora, {data.user.fullName}</span>
        </div>,
        {
          duration: 4000,
          icon: '🎉',
        }
      );

      // Navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('Register error:', error);
      toast.dismiss(loadingToast);
      toast.error('Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="absolute top-20 -left-40 w-96 h-96 bg-cyan-900 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-emerald-900 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Left section */}
          <div className="hidden lg:block space-y-12">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold tracking-tight">Classora</h1>
                  <p className="text-xl text-gray-400">Administrator Portal</p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-5xl font-bold leading-tight">
                  Admin Registration<br />By Invitation Only
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Only authorized administrators can create accounts.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-emerald-400" />
                  Secure Access
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Admin key required for registration
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Encrypted credentials storage
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Audit trail enabled
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right form section */}
          <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-10 lg:p-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-2">Create Admin Account</h2>
              <p className="text-gray-400">Invitation required</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    disabled={isLoading}
                    className={`w-full pl-14 pr-5 py-5 bg-white/5 border rounded-2xl text-white placeholder-gray-500 transition-all
                      ${errors.fullName ? 'border-red-500/80' : 'border-white/10 focus:border-cyan-500'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  />
                </div>
                {errors.fullName && <p className="text-red-400 text-sm ml-2">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    disabled={isLoading}
                    className={`w-full pl-14 pr-5 py-5 bg-white/5 border rounded-2xl text-white placeholder-gray-500 transition-all
                      ${errors.email ? 'border-red-500/80' : 'border-white/10 focus:border-cyan-500'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm ml-2">{errors.email}</p>}
              </div>

              {/* Password fields */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className={`w-full pl-14 pr-14 py-5 bg-white/5 border rounded-2xl text-white placeholder-gray-500 transition-all
                        ${errors.password ? 'border-red-500/80' : 'border-white/10 focus:border-cyan-500'}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
                  
                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              level <= passwordStrength.strength
                                ? passwordStrength.color
                                : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">{passwordStrength.label}</p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      disabled={isLoading}
                      className={`w-full pl-14 pr-14 py-5 bg-white/5 border rounded-2xl text-white placeholder-gray-500 transition-all
                        ${errors.confirmPassword ? 'border-red-500/80' : 'border-white/10 focus:border-cyan-500'}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
                  
                  {/* Password match indicator */}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-emerald-400 text-xs flex items-center gap-1 mt-1">
                      <CheckCircle className="w-4 h-4" />
                      Passwords match
                    </p>
                  )}
                </div>
              </div>

              {/* Admin Key */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Admin Key</label>
                <div className="relative">
                  <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    name="adminKey"
                    value={formData.adminKey}
                    onChange={handleChange}
                    placeholder="Enter admin key"
                    disabled={isLoading}
                    className={`w-full pl-14 pr-5 py-5 bg-white/5 border rounded-2xl text-white placeholder-gray-500 transition-all
                      ${errors.adminKey ? 'border-red-500/80' : 'border-white/10 focus:border-cyan-500'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  />
                </div>
                {errors.adminKey && <p className="text-red-400 text-sm ml-2">{errors.adminKey}</p>}
                <p className="text-xs text-gray-500 ml-2">
                  Contact your system administrator for the admin key
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl font-semibold text-lg 
                  hover:from-emerald-700 hover:to-cyan-700 hover:scale-[1.02] 
                  flex items-center justify-center gap-3 transition-all
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Admin Account
                  </>
                )}
              </button>

              {/* Login link */}
              <p className="text-center text-gray-400 pt-4 border-t border-white/10">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  Sign In →
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;