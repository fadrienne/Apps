import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  prefix?: string;
  suffix?: string;
}

export default function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  iconBg,
  iconColor,
  prefix = '',
  suffix = '',
}: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold text-gray-900">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {isPositive ? (
            <TrendingUp size={14} className="text-green-500" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
          <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      </div>
    </div>
  );
}
