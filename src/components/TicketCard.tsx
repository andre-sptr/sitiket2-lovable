import { Ticket } from '@/types/ticket';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, ComplianceBadge, TTRBadge } from '@/components/StatusBadge';
import { formatDateShort, generateGoogleMapsLink } from '@/lib/formatters';
import { getSettings, getTTRStatus, isDueSoon as checkIsDueSoon } from '@/hooks/useSettings';
import { 
  MapPin, 
  Clock, 
  User, 
  MessageSquare, 
  ChevronRight,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TicketCardProps {
  ticket: Ticket;
  onCopyWhatsApp?: (ticket: Ticket) => void;
  compact?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onCopyWhatsApp, compact = false }) => {
  const navigate = useNavigate();
  const settings = getSettings();
  const ttrStatus = getTTRStatus(ticket.sisaTtrHours, settings.ttrThresholds);
  const isOverdue = ttrStatus === 'overdue' && ticket.status !== 'CLOSED';
  const isDueSoon = checkIsDueSoon(ticket.sisaTtrHours, settings.ttrThresholds) && ticket.status !== 'CLOSED';
  const isUnassigned = !ticket.assignedTo && ticket.status === 'OPEN';

  const handleClick = () => {
    navigate(`/ticket/${ticket.id}`);
  };

  return (
    <Card 
      hover
      className={`group relative overflow-hidden border-0 shadow-sm bg-white transition-all duration-300 ${
        isOverdue ? 'ring-2 ring-red-400/50' : ''
      } ${isDueSoon ? 'ring-2 ring-amber-400/50' : ''}`}
      onClick={handleClick}
    >
      {/* Left accent strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${
        isOverdue ? 'bg-gradient-to-b from-red-500 to-rose-500' : 
        isDueSoon ? 'bg-gradient-to-b from-amber-400 to-orange-500' : 
        ticket.status === 'CLOSED' ? 'bg-gradient-to-b from-emerald-400 to-teal-500' : 
        'bg-gradient-to-b from-primary to-teal-400'
      }`} />

      <CardContent className="p-5 pl-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                {ticket.incNumbers[0]}
              </span>
              {ticket.incNumbers.length > 1 && (
                <span className="text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                  +{ticket.incNumbers.length - 1}
                </span>
              )}
              {isUnassigned && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  Belum assign
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-800 text-base group-hover:text-primary transition-colors">
              {ticket.siteCode} - {ticket.siteName}
            </h3>
            <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full mt-2">
              {ticket.kategori}
            </span>
          </div>
          <StatusBadge status={ticket.status} size="sm" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="truncate text-xs">{ticket.lokasiText}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-xs">{formatDateShort(ticket.jamOpen)}</span>
          </div>
          {ticket.assignedTo && (
            <div className="flex items-center gap-2 text-slate-500 col-span-2">
              <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="truncate text-xs">{ticket.teknisiList?.join(', ') || 'TA Assigned'}</span>
            </div>
          )}
        </div>

        {/* TTR & Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <TTRBadge hours={ticket.sisaTtrHours} size="sm" />
            <ComplianceBadge compliance={ticket.ttrCompliance} size="sm" />
          </div>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {ticket.latitude && ticket.longitude && (
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-slate-100"
                asChild
              >
                <a href={generateGoogleMapsLink(ticket.latitude, ticket.longitude)} target="_blank" rel="noopener noreferrer">
                  <Navigation className="w-4 h-4 text-slate-400" />
                </a>
              </Button>
            )}
            {onCopyWhatsApp && (
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyWhatsApp(ticket);
                }}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            )}
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
