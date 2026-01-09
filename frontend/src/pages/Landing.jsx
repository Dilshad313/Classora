import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, BookOpen, Building2, Users, Briefcase, 
  CalendarCheck, ClipboardCheck, Wallet, Banknote, Calculator, 
  MessageSquare, FileText, PenTool, Clock, Home, Video, 
  BarChart3, Award, Landmark, GraduationCap, Scale, 
  UploadCloud, CreditCard,  Search, LayoutDashboard, Settings, Check,
  Menu, X, ChevronRight, ArrowRight, Sparkles,
  Zap, Globe, Cloud, Cpu, Target, TrendingUp,
  Shield, Lock, BarChart, PieChart, Smartphone,
  Tablet, Monitor, Server, Database, Network,
  ZapOff, CheckCircle, Clock as ClockIcon,
  Users as UsersIcon, DollarSign, Globe as GlobeIcon,
  Play, X as CloseIcon
} from 'lucide-react';

// Particle Background Component
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      const maxDistance = 100;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
    />
  );
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start > end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observerRef.current.observe(ref.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [end, duration]);

  return (
    <span ref={ref} className="font-black">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Animated Card Component
const AnimatedCard = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 transform ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};

// Main Landing Component
const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active section based on scroll position
      const sections = ['hero', 'features', 'solutions', 'modules', 'pricing', 'cta'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featureGroups = [
    {
      title: "System & Security",
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      features: ["General Settings", "Roles & Permissions", "Database Backup", "User Management", "Institute Profile", "Logo & Branding"],
      gradient: "from-blue-900/20 to-blue-900/5"
    },
    {
      title: "Academic Excellence",
      icon: <BookOpen className="w-8 h-8 text-emerald-400" />,
      features: ["Classes & Sections", "Subject Assignment", "Timetable Management", "Syllabus Management", "Class Materials", "Live Class Integration"],
      gradient: "from-emerald-900/20 to-emerald-900/5"
    },
    {
      title: "Student & Staff",
      icon: <Users className="w-8 h-8 text-purple-400" />,
      features: ["Admission & Enrollment", "ID Card Generation", "Promotion System", "Employee Records", "Job Letter Generation", "Login Management"],
      gradient: "from-purple-900/20 to-purple-900/5"
    },
    {
      title: "Financial Suite",
      icon: <Wallet className="w-8 h-8 text-amber-400" />,
      features: ["Fee Structure", "Payment Tracking", "Salary Processing", "Expense Tracking", "Income Management", "Bank Account Config"],
      gradient: "from-amber-900/20 to-amber-900/5"
    },
    {
      title: "Assessment & Exams",
      icon: <ClipboardCheck className="w-8 h-8 text-rose-400" />,
      features: ["Exam Scheduling", "Mark Entry System", "Report Cards", "Question Bank", "Class Tests", "Grading Configuration"],
      gradient: "from-rose-900/20 to-rose-900/5"
    },
    {
      title: "Analytics & Insights",
      icon: <BarChart3 className="w-8 h-8 text-indigo-400" />,
      features: ["Analytics Dashboard", "Attendance Reports", "Financial Statements", "Certificate System", "Global Search", "Cloud Storage"],
      gradient: "from-indigo-900/20 to-indigo-900/5"
    }
  ];

  const stats = [
    { icon: <UsersIcon className="w-6 h-6" />, value: "2.5k+", label: "Active Students", color: "text-blue-400", bg: "bg-blue-900/30" },
    { icon: <CheckCircle className="w-6 h-6" />, value: "98%", label: "Satisfaction Rate", color: "text-emerald-400", bg: "bg-emerald-900/30" },
    { icon: <GlobeIcon className="w-6 h-6" />, value: "150+", label: "Global Institutions", color: "text-purple-400", bg: "bg-purple-900/30" },
    { icon: <TrendingUp className="w-6 h-6" />, value: "45k", label: "Monthly Revenue", color: "text-amber-400", bg: "bg-amber-900/30" }
  ];

  const platforms = [
    { icon: <Smartphone className="w-8 h-8" />, name: "Mobile", desc: "iOS & Android apps" },
    { icon: <Tablet className="w-8 h-8" />, name: "Tablet", desc: "Responsive tablet UI" },
    { icon: <Monitor className="w-8 h-8" />, name: "Desktop", desc: "Full web application" },
    { icon: <Server className="w-8 h-8" />, name: "Cloud", desc: "AWS infrastructure" }
  ];

  const solutions = [
    {
      title: "For Administrators",
      desc: "Complete control over institute operations, finances, and staff performance with real-time analytics.",
      icon: <Settings className="w-8 h-8 text-blue-400" />,
      features: ["Financial Oversight", "Staff Management", "Resource Planning"]
    },
    {
      title: "For Teachers",
      desc: "Empower educators with digital tools for attendance, grading, and interactive classroom management.",
      icon: <Users className="w-8 h-8 text-emerald-400" />,
      features: ["Auto-Grading", "Attendance Tracking", "Syllabus Planning"]
    },
    {
      title: "For Students",
      desc: "An engaging platform for students to access learning materials, track progress, and stay updated.",
      icon: <GraduationCap className="w-8 h-8 text-purple-400" />,
      features: ["LMS Access", "Result Tracking", "Unified Timetable"]
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "49",
      desc: "Perfect for single branch schools",
      features: ["Up to 500 Students", "Basic Analytics", "Email Support", "Core ERP Modules"],
      gradient: "from-blue-500/10 to-transparent",
      buttonVariant: "outline"
    },
    {
      name: "Professional",
      price: "99",
      desc: "Best for growing institutions",
      features: ["Up to 2000 Students", "Advanced AI Analytics", "24/7 Priority Support", "All Premium Modules", "Mobile App Access"],
      gradient: "from-cyan-500/20 to-blue-500/10",
      popular: true,
      buttonVariant: "solid"
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For multi-branch networks",
      features: ["Unlimited Students", "Multi-Institute Support", "Dedicated Account Manager", "White-label Branding", "Custom Integrations"],
      gradient: "from-purple-500/10 to-transparent",
      buttonVariant: "outline"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Particle Background */}
      <div className="fixed inset-0 z-0">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/80 to-gray-950"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-gray-900/90 backdrop-blur-xl py-3 shadow-2xl' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-75 animate-pulse"></div>
              <div className="relative bg-gray-900 p-2 rounded-xl">
                <Zap className="w-7 h-7 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Classora</span>
              <span className="text-xs text-gray-400">EDGE ERP</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {['Features', 'Modules', 'Solutions', 'Pricing'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  const element = document.getElementById(item.toLowerCase());
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative font-medium transition-all duration-300 hover:text-cyan-300 group ${
                  activeSection === item.toLowerCase() ? 'text-cyan-300' : 'text-gray-300'
                }`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <button 
              onClick={() => navigate('/login')}
              className="relative font-medium transition-all duration-300 hover:text-cyan-300 group text-gray-300"
            >
              Login
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-2.5 rounded-full font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25 active:scale-95">
                Get Started
              </div>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 mt-3 p-6 space-y-4 animate-in slide-in-from-top">
            {['Features', 'Modules', 'Solutions', 'Pricing'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  const element = document.getElementById(item.toLowerCase());
                  element?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="block text-gray-300 hover:text-white font-medium py-2 transition-colors text-left w-full"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => {
                navigate('/login');
                setIsMenuOpen(false);
              }}
              className="block text-gray-300 hover:text-white font-medium py-2 transition-colors text-left w-full"
            >
              Login
            </button>
            <button 
              onClick={() => {
                navigate('/register');
                setIsMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-bold mt-4"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/30 to-gray-950"></div>
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <AnimatedCard>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 text-cyan-300 px-6 py-3 rounded-full text-sm font-bold mb-8 backdrop-blur-sm border border-cyan-500/20">
              <Sparkles size={16} /> AI-Powered School Management Platform
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={200}>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-100 via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                Next-Gen
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                Educational Intelligence
              </span>
            </h1>
          </AnimatedCard>

          <AnimatedCard delay={400}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              The world's most advanced AI-driven ERP system for modern educational institutions. 
              Transform your school management with predictive analytics and automated workflows.
            </p>
          </AnimatedCard>

          <AnimatedCard delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <button 
                onClick={() => navigate('/login')}
                className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="flex items-center justify-center gap-3">
                  Start Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </div>
              </button>
              <button 
                onClick={() => setShowVideoModal(true)}
                className="group bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 hover:border-cyan-500/50 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center gap-3">
                  <Video size={20} /> Interactive Demo
                </div>
              </button>
            </div>
          </AnimatedCard>

          {/* Animated Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-3xl p-2 border border-gray-800 overflow-hidden">
              <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl aspect-video flex items-center justify-center overflow-hidden">
                <div className="grid grid-cols-12 w-full h-full gap-4 p-6">
                  {/* Left Sidebar */}
                  <div className="col-span-3 space-y-4">
                    <div className="h-8 w-full bg-gradient-to-r from-gray-800 to-gray-900 rounded animate-pulse"></div>
                    <div className="h-32 w-full bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm"></div>
                    <div className="h-32 w-full bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm"></div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="col-span-9 space-y-4">
                    <div className="h-12 w-full bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm flex items-center px-4">
                      <div className="h-4 w-1/4 bg-gradient-to-r from-gray-700 to-gray-800 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 bg-gradient-to-br from-blue-900/30 to-blue-900/10 rounded-xl border border-blue-800/30 backdrop-blur-sm animate-float" style={{animationDelay: '0s'}}></div>
                      <div className="h-24 bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 rounded-xl border border-emerald-800/30 backdrop-blur-sm animate-float" style={{animationDelay: '0.2s'}}></div>
                      <div className="h-24 bg-gradient-to-br from-amber-900/30 to-amber-900/10 rounded-xl border border-amber-800/30 backdrop-blur-sm animate-float" style={{animationDelay: '0.4s'}}></div>
                    </div>
                    
                    {/* Chart Area */}
                    <div className="h-48 w-full bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm hidden lg:block animate-float">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full shadow-lg">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Today's Collection</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    $<AnimatedCounter end={12450} duration={1500} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border-y border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <AnimatedCard key={idx} delay={idx * 100}>
                <div className={`${stat.bg} backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 hover:scale-105`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      {stat.icon}
                    </div>
                    <span className={`text-3xl font-black ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-20">
            <AnimatedCard>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Enterprise-Grade
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Modules
                </span>
              </h2>
            </AnimatedCard>
            <AnimatedCard delay={200}>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Our modular architecture allows seamless scaling as your institution grows.
                Each module is powered by AI for optimal performance.
              </p>
            </AnimatedCard>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureGroups.map((group, idx) => (
              <AnimatedCard key={idx} delay={idx * 100}>
                <div className={`group h-full p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 hover:border-cyan-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10 relative overflow-hidden`}>
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${group.gradient} backdrop-blur-sm`}>
                        {group.icon}
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 text-white">{group.title}</h3>
                    
                    <ul className="space-y-3">
                      {group.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <AnimatedCard>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Comprehensive
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Solutions
                </span>
              </h2>
            </AnimatedCard>
            <AnimatedCard delay={200}>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Designed to meet the unique needs of every member of your educational community.
              </p>
            </AnimatedCard>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {solutions.map((solution, idx) => (
              <AnimatedCard key={idx} delay={idx * 150}>
                <div className="group p-8 rounded-3xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-blue-500/30 transition-all duration-500 h-full flex flex-col">
                  <div className="p-4 rounded-2xl bg-gray-800/50 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                    {solution.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
                  <p className="text-gray-400 mb-6 flex-grow">{solution.desc}</p>
                  <ul className="space-y-3">
                    {solution.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle size={14} className="text-cyan-400" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="modules" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <AnimatedCard>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                    Intelligent Dashboard
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    For Modern Leadership
                  </span>
                </h2>
              </AnimatedCard>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <Cpu className="w-6 h-6" />,
                    title: "AI-Powered Analytics",
                    desc: "Real-time insights with predictive modeling for student performance and resource allocation."
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Military-Grade Security",
                    desc: "End-to-end encryption with multi-factor authentication and compliance monitoring."
                  },
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: "Instant Communication",
                    desc: "Integrated messaging system with automated notifications and emergency alerts."
                  }
                ].map((item, idx) => (
                  <AnimatedCard key={idx} delay={idx * 200}>
                    <div className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-900/20 backdrop-blur-sm border border-gray-800 hover:border-cyan-500/30 transition-all duration-300">
                      <div className="flex gap-4">
                        <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-900/10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <div className="text-cyan-400">{item.icon}</div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-white mb-2">{item.title}</h4>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: <AnimatedCounter end={2500} />, label: "Active Students", color: "from-blue-500 to-cyan-500", delay: 0 },
                  { value: "98%", label: "Attendance Rate", color: "from-emerald-500 to-teal-500", delay: 100 },
                  { value: <AnimatedCounter end={150} />, label: "Staff Members", color: "from-purple-500 to-pink-500", delay: 200 },
                  { value: "$45k", label: "Monthly Revenue", color: "from-amber-500 to-orange-500", delay: 300 }
                ].map((stat, idx) => (
                  <AnimatedCard key={idx} delay={stat.delay}>
                    <div className={`p-8 rounded-3xl bg-gradient-to-br ${stat.color}/10 to-transparent backdrop-blur-sm border border-gray-800/50 hover:scale-105 transition-transform duration-300`}>
                      <div className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                        {stat.value}
                      </div>
                      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
              
              {/* Platform Support */}
              <AnimatedCard delay={400}>
                <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-gray-900/50 to-gray-900/20 backdrop-blur-sm border border-gray-800">
                  <h4 className="font-bold text-white mb-6 text-center">Multi-Platform Support</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {platforms.map((platform, idx) => (
                      <div key={idx} className="text-center p-4 rounded-xl bg-gray-900/30 hover:bg-gray-800/50 transition-all duration-300">
                        <div className="text-cyan-400 mb-2 flex justify-center">{platform.icon}</div>
                        <div className="font-medium text-white text-sm">{platform.name}</div>
                        <div className="text-gray-400 text-xs">{platform.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <AnimatedCard>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Predictable
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Pricing
                </span>
              </h2>
            </AnimatedCard>
            <AnimatedCard delay={200}>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Choose the plan that's right for your institution's growth.
              </p>
            </AnimatedCard>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <AnimatedCard key={idx} delay={idx * 150}>
                <div className={`relative p-8 rounded-3xl border transition-all duration-500 h-full flex flex-col ${
                  plan.popular 
                  ? 'bg-gradient-to-b from-blue-900/40 to-gray-900 border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-105 z-10' 
                  : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-black text-white">
                      {plan.price === "Custom" ? "" : "$"}
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && <span className="text-gray-400 ml-2">/month</span>}
                  </div>
                  <p className="text-gray-400 text-sm mb-8">{plan.desc}</p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={14} className="text-blue-400" />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                    plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}>
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </button>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-cyan-900/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <AnimatedCard>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 text-cyan-300 px-6 py-3 rounded-full text-sm font-bold mb-6 backdrop-blur-sm border border-cyan-500/20">
              <Zap size={16} /> LIMITED TIME OFFER
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={200}>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                Educational Institution?
              </span>
            </h2>
          </AnimatedCard>
          
          <AnimatedCard delay={400}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join over 500+ institutions worldwide that trust Classora for their daily operations.
              Get started with a 30-day free trial, no credit card required.
            </p>
          </AnimatedCard>
          
          <AnimatedCard delay={600}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => navigate('/login')}
                className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="flex items-center justify-center gap-3">
                  Start Free Trial
                  <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={20} />
                </div>
              </button>
              
              <button 
                onClick={() => setShowVideoModal(true)}
                className="group bg-transparent text-gray-300 hover:text-white border-2 border-gray-700 hover:border-cyan-500 px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center gap-3">
                  <Video size={20} /> Book a Demo
                </div>
              </button>
            </div>
          </AnimatedCard>
          
          <AnimatedCard delay={800}>
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> No setup fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> 24/7 support
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> GDPR compliant
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-400" /> SOC 2 certified
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-20 relative border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-75"></div>
                  <div className="relative bg-gray-900 p-2 rounded-xl">
                    <Zap className="w-7 h-7 text-cyan-400" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Classora</span>
                  <span className="text-xs text-gray-500">Intelligent Education Platform</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                The world's most advanced AI-driven education management platform, 
                transforming how institutions operate in the digital age.
              </p>
              <div className="flex gap-4 mt-8">
                {[Twitter, LinkedIn, GitHub, Facebook].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 hover:text-white transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "Platform",
                links: ["Student Management", "Exam System", "Fee Collection", "Cloud Storage", "Mobile App"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Privacy Policy", "Terms of Service", "Contact"]
              },
              {
                title: "Resources",
                links: ["Documentation", "API Reference", "Blog", "Webinars", "Help Center"]
              }
            ].map((column, idx) => (
              <div key={idx}>
                <h4 className="text-white font-bold mb-6 text-lg">{column.title}</h4>
                <ul className="space-y-4">
                  {column.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href="#"
                        className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 text-sm"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Classora Technologies. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">Cookies</a>
              <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl shadow-2xl border border-gray-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Interactive Demo</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            
            {/* Video Content */}
            <div className="p-6">
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play size={40} className="text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Classora Platform Demo</h4>
                  <p className="text-gray-400 mb-6">
                    Experience the power of AI-driven school management with our comprehensive platform tour.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                      Watch Full Demo
                    </button>
                    <button 
                      onClick={() => setShowVideoModal(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Social Icons
const Twitter = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const LinkedIn = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHub = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const Facebook = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Add custom styles for animations
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-gradient {
    background-size: 200% auto;
    animation: gradient 3s linear infinite;
  }
`;

export default Landing;