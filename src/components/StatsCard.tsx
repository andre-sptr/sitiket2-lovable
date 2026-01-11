import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const variantStyles = {
  default: {
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    valueColor: 'text-slate-800',
    accentGradient: 'from-slate-400 to-slate-500',
  },
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    valueColor: 'text-primary',
    accentGradient: 'from-primary to-teal-400',
  },
  success: {
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    valueColor: 'text-emerald-600',
    accentGradient: 'from-emerald-400 to-teal-500',
  },
  warning: {
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    valueColor: 'text-amber-600',
    accentGradient: 'from-amber-400 to-orange-500',
  },
  danger: {
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    valueColor: 'text-red-600',
    accentGradient: 'from-red-400 to-rose-500',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}) => {
  const styles = variantStyles[variant];

  return (
    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-500 mb-2">
              {title}
            </p>
            <p className={`text-3xl font-bold tracking-tight ${styles.valueColor}`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${styles.iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
