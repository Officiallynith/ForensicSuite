interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

function StatusCard({ title, value, subtitle, icon, iconColor, trend }: StatusCardProps) {
  return (
    <div className="bg-dark-900 rounded-xl p-6 border border-dark-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-dark-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend ? (
            <p className={`text-sm ${trend.isPositive ? 'text-success' : 'text-error'}`}>
              <i className={`fas fa-arrow-${trend.isPositive ? 'up' : 'down'} mr-1`}></i>
              {trend.value}
            </p>
          ) : (
            <p className="text-dark-400 text-sm">
              <i className={`${icon} mr-1`}></i>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}>
          <i className={`${icon} ${iconColor.includes('error') ? 'text-error' : iconColor.includes('primary') ? 'text-primary' : iconColor.includes('accent') ? 'text-accent' : 'text-success'}`}></i>
        </div>
      </div>
    </div>
  );
}

interface StatusCardsProps {
  threatsDetected: number;
  evidenceFiles: number;
  activeInvestigations: number;
  aiProgress: number;
}

export function StatusCards({ threatsDetected, evidenceFiles, activeInvestigations, aiProgress }: StatusCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatusCard
        title="AI Threats Detected"
        value={threatsDetected}
        subtitle="+12% from yesterday"
        icon="fas fa-shield-virus"
        iconColor="bg-error/20"
        trend={{ value: "+12% from yesterday", isPositive: false }}
      />
      
      <StatusCard
        title="Evidence Files"
        value={evidenceFiles.toLocaleString()}
        subtitle="2.4TB analyzed"
        icon="fas fa-folder-open"
        iconColor="bg-primary/20"
      />
      
      <StatusCard
        title="Active Investigations"
        value={activeInvestigations}
        subtitle="3 high priority"
        icon="fas fa-search"
        iconColor="bg-accent/20"
      />
      
      <StatusCard
        title="AI Analysis Progress"
        value={`${aiProgress}%`}
        subtitle="ML models active"
        icon="fas fa-robot"
        iconColor="bg-success/20"
      />
    </div>
  );
}
