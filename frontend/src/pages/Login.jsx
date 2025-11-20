import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, GraduationCap, Crown, BookOpen, UserRound, Users, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasAccount, setHasAccount] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setHasAccount(!!user);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password too short';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        role: formData.role,
        name: formData.role === 'admin' ? 'System Administrator' :
              formData.role === 'teacher' ? 'Mr. David Smith' :
              formData.role === 'student' ? 'Emma Johnson' : 'Parent Guardian'
      }));

      const routes = {
        admin: '/dashboard',
        teacher: '/teacher/dashboard',
        student: '/student/dashboard',
        parent: '/parent/dashboard'
      };
      navigate(routes[formData.role]);
    } else {
      setErrors(newErrors);
    }
  };

  const roles = [
    { id: 'admin', label: 'Administrator', icon: Crown },
    { id: 'teacher', label: 'Teacher', icon: BookOpen },
    { id: 'student', label: 'Student', icon: UserRound },
    { id: 'parent', label: 'Parent', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="absolute top-20 -left-40 w-96 h-96 bg-purple-900 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-pink-900 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-4000"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Hero */}
          <div className="hidden lg:block space-y-12">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold tracking-tight">Classora</h1>
                  <p className="text-xl text-gray-400">Future Leaders Academy</p>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-5xl font-bold leading-tight">
                  Next-Generation<br />School Management
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Streamline administration, empower teachers, engage parents, and inspire students — all in one secure platform.
                </p>
              </div>
            </div>
          </div>

          {/* Right - Login Card */}
          <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-10 lg:p-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role Selection */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-4 block">Select Role</label>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                        className={`py-6 rounded-2xl font-medium transition-all backdrop-blur-xl border flex flex-col items-center gap-2 ${
                          formData.role === role.id
                            ? 'bg-white/20 border-white/40 text-white shadow-xl'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <Icon className="w-8 h-8" />
                        <span className="text-sm">{role.label}</span>
                      </button>
                    );
                  })}
                </div>
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
                    className={`w-full pl-14 pr-5 py-5 bg-white/5 border backdrop-blur-xl rounded-2xl text-white placeholder-gray-500 transition-all ${
                      errors.email ? 'border-red-500/80' : 'border-white/10 focus:border-white/40'
                    } focus:outline-none focus:ring-4 focus:ring-white/10`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm ml-2">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-14 pr-16 py-5 bg-white/5 border backdrop-blur-xl rounded-2xl text-white placeholder-gray-500 transition-all ${
                      errors.password ? 'border-red-500/80' : 'border-white/10 focus:border-white/40'
                    } focus:outline-none focus:ring-4 focus:ring-white/10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm ml-2">{errors.password}</p>}
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500" />
                  <span className="text-gray-400">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300 font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-3"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>

              {/* Show Register Button Only If No Account Exists */}
              {!hasAccount && (
                <div className="text-center pt-6 border-t border-white/10">
                  <p className="text-gray-400 mb-4">No admin account detected</p>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl font-medium hover:from-emerald-500 hover:to-cyan-500 transition-all transform hover:scale-105 shadow-xl"
                  >
                    <Shield className="w-5 h-5" />
                    Create Admin Account
                  </Link>
                </div>
              )}

              {hasAccount && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                  <p className="text-xs text-gray-500 font-medium">Demo • admin@futureleaders.edu / admin123</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;