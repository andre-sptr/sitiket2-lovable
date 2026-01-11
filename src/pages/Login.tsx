import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/types/ticket';
import { Ticket, Shield, Wrench, Eye, Headphones, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const roleCards = [
  {
    role: 'admin' as UserRole,
    title: 'Admin',
    description: 'Kelola tiket & monitor SLA',
    icon: Shield,
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-500/10 to-indigo-600/10',
    redirect: '/dashboard',
  },
  {
    role: 'hd' as UserRole,
    title: 'Help Desk',
    description: 'Input tiket, monitoring & dispatch',
    icon: Headphones,
    gradient: 'from-violet-500 to-purple-600', 
    bgGradient: 'from-violet-500/10 to-purple-600/10',
    redirect: '/dashboard',
  },
  {
    role: 'guest' as UserRole,
    title: 'Guest',
    description: 'Monitoring dashboard (read-only)',
    icon: Eye,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-500/10 to-teal-600/10',
    redirect: '/dashboard',
  },
];

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (role: UserRole, redirect: string) => {
    login(role);
    navigate(redirect);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-[120px]" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Logo & Title */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl" />
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary to-teal-400 rounded-2xl flex items-center justify-center shadow-2xl">
                <Ticket className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            SiTiket
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-md mx-auto">
            Sistem Manajemen Tiket Gangguan
            <span className="block text-sm text-slate-500 mt-1">Telkom Infra • Demo/Prototipe</span>
          </p>
        </div>

        {/* Role Selection */}
        <div className="w-full max-w-4xl">
          <div className="flex flex-col md:flex-row justify-center gap-5 md:gap-6">
            {roleCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card 
                  key={card.role} 
                  className="group w-full md:w-[300px] bg-white/[0.03] backdrop-blur-xl border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 100 + 200}ms` }}
                  onClick={() => handleLogin(card.role, card.redirect)}
                >
                  {/* Top gradient line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <CardHeader className="text-center pb-3 pt-8">
                    <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${card.bgGradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl font-semibold">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pb-8">
                    <CardDescription className="text-slate-400 text-sm mb-5">
                      {card.description}
                    </CardDescription>
                    <Button 
                      variant="ghost" 
                      className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:text-white group-hover:border-white/20 transition-all duration-300"
                    >
                      <span>Masuk</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs text-slate-400">Prototype Version 1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
