import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, GraduationCap, Crown, Shield } from 'lucide-react';

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
  const [apiError, setApiError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      try {
        setApiError('');
        const response = await fetch('http://localhost:5000/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setApiError(data.message || 'Login failed');
          return;
        }

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setHasAccount(true);
        navigate('/dashboard');
      } catch {
        setApiError('Unable to connect to server');
      }
    } else {
      setErrors(newErrors);
    }
  };

  const roles = [
    { id: 'admin', label: 'Administrator', icon: Crown }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="absolute top-20 -left-40 w-96 h-96 bg-purple-900 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-pink-900 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

          {/* left hero */}
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
              <h2 className="text-5xl font-bold leading-tight">Next-Generation<br/>School Management</h2>
              <p className="text-xl text-gray-400">All-in-one system for admins, teachers, parents & students.</p>
            </div>
          </div>

          {/* right login */}
          <div className="backdrop-blur-2xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-10 lg:p-12">

            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {apiError && <p className="text-red-400 text-sm text-center">{apiError}</p>}

              {/* role */}
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
                        className={`py-6 rounded-2xl transition-all flex flex-col items-center gap-2 backdrop-blur-xl border
                          ${formData.role === role.id
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}
                        `}
                      >
                        <Icon className="w-8 h-8" />
                        <span className="text-sm">{role.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* email */}
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@futureleaders.edu"
                    className={`w-full pl-14 pr-5 py-5 rounded-2xl bg-white/5 border backdrop-blur-xl
                      ${errors.email ? 'border-red-500/80' : 'border-white/10'}
                    `}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm ml-2">{errors.email}</p>}
              </div>

              {/* password */}
              <div className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full pl-14 pr-16 py-5 rounded-2xl bg-white/5 border backdrop-blur-xl
                      ${errors.password ? 'border-red-500/80' : 'border-white/10'}
                    `}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm ml-2">{errors.password}</p>}
              </div>

              {/* remember + forgot */}
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded bg-white/10 border-white/20" />
                  <span className="text-gray-400">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-purple-400">Forgot password?</Link>
              </div>

              {/* submit */}
              <button
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-semibold text-lg hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <LogIn className="w-5 h-5" /> Sign In
              </button>

              {/* registration suggestion */}
              {!hasAccount && (
                <div className="text-center pt-6 border-t border-white/10">
                  <p className="text-gray-400 mb-4">No admin account found</p>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl font-medium hover:scale-105"
                  >
                    <Shield className="w-5 h-5" />
                    Create Admin Account
                  </Link>
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
