import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { StatsCard } from '@/components/StatsCard';
import { TicketCard } from '@/components/TicketCard';
import { StatsCardSkeleton, TicketCardSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  getTodayTickets, 
  mockDashboardStats 
} from '@/lib/mockData';
import { generateWhatsAppMessage } from '@/lib/formatters';
import { getSettings, isDueSoon as checkIsDueSoon } from '@/hooks/useSettings';
import { Ticket } from '@/types/ticket';
import { 
  Ticket as TicketIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  TrendingUp,
  Percent,
  Plus,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const todayTickets = getTodayTickets();
  const stats = mockDashboardStats;
  const settings = getSettings();

  const handleRefresh = () => {
    setIsRefreshing(true); 
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ title: "Data diperbarui", description: "Dashboard telah di-refresh" });
    }, 1000);
  };

  // Sort: overdue first, then by remaining TTR
  const sortedTickets = [...todayTickets].sort((a, b) => {
    if (a.status === 'CLOSED' && b.status !== 'CLOSED') return 1;
    if (a.status !== 'CLOSED' && b.status === 'CLOSED') return -1;
    return a.sisaTtrHours - b.sisaTtrHours;
  });

  const overdueTickets = todayTickets.filter(t => t.sisaTtrHours < 0 && t.status !== 'CLOSED');
  const dueSoonTickets = todayTickets.filter(t => 
    checkIsDueSoon(t.sisaTtrHours, settings.ttrThresholds) && t.status !== 'CLOSED'
  );
  const unassignedTickets = todayTickets.filter(t => !t.assignedTo && t.status === 'OPEN');

  const handleCopyWhatsApp = (ticket: Ticket) => {
    const message = generateWhatsAppMessage('share', ticket);
    navigator.clipboard.writeText(message);
    toast({
      title: "Pesan WhatsApp Disalin",
      description: `Pesan untuk ${ticket.siteCode} sudah disalin ke clipboard`,
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">
              Tiket hari ini — {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 rounded-xl border-slate-200 hover:bg-slate-50" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
            >
              <RefreshCw 
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              />
              Refresh
            </Button>
            {user?.role !== 'admin' && user?.role !== 'guest' && (
              <Link to="/import">
                <Button size="sm" className="gap-2 rounded-xl bg-gradient-to-r from-primary to-teal-500 hover:opacity-90 transition-opacity shadow-md">
                  <Plus className="w-4 h-4" />
                  Import Tiket
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isRefreshing ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <StatsCard
                title="Total Hari Ini"
                value={stats.totalToday}
                icon={TicketIcon}
                variant="primary"
              />
              <StatsCard
                title="Open/Unassigned"
                value={stats.openTickets}
                subtitle={unassignedTickets.length > 0 ? `${unassignedTickets.length} belum assign` : undefined}
                icon={Clock}
                variant="warning"
              />
              <StatsCard
                title="Overdue"
                value={stats.overdueTickets}
                icon={AlertTriangle}
                variant="danger"
              />
              <StatsCard
                title="Closed Hari Ini"
                value={stats.closedToday}
                icon={CheckCircle2}
                variant="success"
              />
            </>
          )}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-4">
          {isRefreshing ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <StatsCard
                title="Rata-rata Respon"
                value={`${stats.avgResponseTime}m`}
                subtitle="Waktu respon pertama TA"
                icon={TrendingUp}
              />
              <StatsCard
                title="Compliance Rate"
                value={`${stats.complianceRate}%`}
                subtitle="Target: 90%"
                icon={Percent}
                variant={stats.complianceRate >= 90 ? 'success' : stats.complianceRate >= 70 ? 'warning' : 'danger'}
              />
            </>
          )}
        </div>

        {/* Alerts */}
        {(overdueTickets.length > 0 || dueSoonTickets.length > 0 || unassignedTickets.length > 0) && (
          <div className="flex flex-wrap gap-3">
            {overdueTickets.length > 0 && (
              <Badge variant="critical" className="gap-2 py-2 px-4 text-sm rounded-full shadow-sm">
                <AlertTriangle className="w-4 h-4" />
                {overdueTickets.length} tiket overdue
              </Badge>
            )}
            {dueSoonTickets.length > 0 && (
              <Badge variant="warning" className="gap-2 py-2 px-4 text-sm rounded-full shadow-sm">
                <Clock className="w-4 h-4" />
                {dueSoonTickets.length} tiket hampir due
              </Badge>
            )}
            {unassignedTickets.length > 0 && (
              <Badge variant="info" className="gap-2 py-2 px-4 text-sm rounded-full shadow-sm">
                <TicketIcon className="w-4 h-4" />
                {unassignedTickets.length} belum assign
              </Badge>
            )}
          </div>
        )}

        {/* Ticket List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800">Tiket Hari Ini</h2>
            <Link to="/tickets">
              <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10 rounded-xl">
                Lihat Semua
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="p-4 space-y-3">
            {isRefreshing ? (
              <TicketCardSkeleton count={3} />
            ) : sortedTickets.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TicketIcon className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-medium">Belum ada tiket hari ini</p>
              </div>
            ) : (
              sortedTickets.map((ticket, index) => (
                <div 
                  key={ticket.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TicketCard 
                    ticket={ticket} 
                    onCopyWhatsApp={handleCopyWhatsApp}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
