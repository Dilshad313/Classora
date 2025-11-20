import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Shield, Eye, EyeOff, GraduationCap } from 'lucide-react';

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
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be 8+ characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (formData.adminKey !== 'CLASSORA2025') newErrors.adminKey = 'Invalid admin key';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      try {
        setApiError('');
        const response = await fetch('http://localhost:5000/api/admin/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            adminKey: formData.adminKey
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setApiError(data.message || 'Registration failed');
          return;
        }

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } catch (err) {
        setApiError('Unable to connect to server');
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="absolute top-20 -left-40 w-96 h-96 bg-cyan-900 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-emerald-900 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-4000"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Admin Only Notice */}
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
                  Only authorized administrators can create accounts. Teachers, students, and parents are registered through the admin panel.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-emerald-400" />
                  Secure & Restricted
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-3">✓ Admin key required</li>
                  <li className="flex items-center gap-3">✓ Encrypted credentials</li>
                  <li className="flex items-center gap-3">✓ Audit trail enabled</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right - Register Form */}
          <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-10 lg:p-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-2">Create Admin Account</h2>
              <p className="text-gray-400">Restricted access • Invitation required</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {apiError && (
                <p className="text-red-400 text-sm text-center">{apiError}</p>
              )}
              {/* Full Name */}
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl text-white placeholder-gray-500 focus:border-white/40 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
                  />
                </div>
                {errors.fullName && <p className="text-red-400 text-sm ml-2">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@futureleaders.edu"
                    className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl text-white placeholder-gray-500 focus:border-white/40 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm ml-2">{errors.email}</p>}
              </div>

              {/* Passwords */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-14 pr-16 py-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl text-white placeholder-gray-500 focus:border-white/40 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full pl-14 pr-16 py-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl text-white placeholder-gray-500 focus:border-white/40 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Admin Key */}
              <div className="space-y-3">
                <div className="relative">
                  <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="adminKey"
                    value={formData.adminKey}
                    onChange={handleChange}
                    placeholder="Admin Key (CLASSORA2025)"
                    className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl text-white placeholder-gray-500 focus:border-white/40 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
                  />
                </div>
                {errors.adminKey && <p className="text-red-400 text-sm ml-2">{errors.adminKey}</p>}
                <p className="text-xs text-gray-500 ml-2">Contact your system provider for the admin key</p>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl font-semibold text-lg hover:from-emerald-500 hover:to-cyan-500 transition-all transform hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-3"
              >
                <UserPlus className="w-5 h-5" />
                Create Admin Account
              </button>

              <p className="text-center text-gray-400">
                Already have access?{' '}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
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