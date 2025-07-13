import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeCases: number;
  threatCount: number;
}

export function Sidebar({ activeCases, threatCount }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    {
      href: "/",
      icon: "fas fa-tachometer-alt",
      label: "Dashboard",
      badge: null,
    },
    {
      href: "/investigation",
      icon: "fas fa-search",
      label: "Investigation",
      badge: activeCases > 0 ? activeCases.toString() : null,
      badgeColor: "bg-accent",
    },
    {
      href: "/anomaly-detection",
      icon: "fas fa-brain",
      label: "Anomaly Detection",
      badge: "NEW",
      badgeColor: "bg-blue-600",
      indicator: true,
    },
    {
      href: "/threats",
      icon: "fas fa-exclamation-triangle",
      label: "Threats",
      badge: threatCount > 0 ? threatCount.toString() : null,
      badgeColor: "bg-error",
    },
    {
      href: "/network",
      icon: "fas fa-network-wired",
      label: "Network Analysis",
      badge: null,
    },
    {
      href: "/crypto",
      icon: "fab fa-bitcoin",
      label: "Crypto Forensics",
      badge: null,
    },
    {
      href: "/deepfake",
      icon: "fas fa-eye",
      label: "Deepfake Detection",
      badge: null,
    },
    {
      href: "/social-media",
      icon: "fas fa-share-alt",
      label: "Social Media",
      badge: null,
    },
  ];

  const evidenceItems = [
    {
      href: "/files",
      icon: "fas fa-folder",
      label: "File Browser",
    },
    {
      href: "/upload",
      icon: "fas fa-upload",
      label: "Upload Evidence",
    },
    {
      href: "/cases",
      icon: "fas fa-database",
      label: "Case Management",
    },
  ];

  const reportItems = [
    {
      href: "/analytics",
      icon: "fas fa-chart-line",
      label: "Analytics",
    },
    {
      href: "/reports",
      icon: "fas fa-file-alt",
      label: "Generate Report",
    },
  ];

  return (
    <div className="flex-shrink-0 w-64 bg-dark-900 border-r border-dark-800">
      {/* Sidebar Header */}
      <div className="flex items-center p-4 border-b border-dark-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-shield-alt text-white text-sm"></i>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">DAFF</h1>
            <p className="text-xs text-dark-400">v2.0.1-AI</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2 scrollbar-thin overflow-y-auto h-full">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                location === item.href
                  ? "bg-primary text-white"
                  : "text-dark-300 hover:bg-dark-800"
              )}
            >
              <i className={`${item.icon} w-5`}></i>
              <span>{item.label}</span>
              {item.badge && (
                <span className={cn(
                  "ml-auto text-white text-xs px-2 py-1 rounded-full",
                  item.badgeColor || "bg-accent"
                )}>
                  {item.badge}
                </span>
              )}
              {item.indicator && (
                <span className="ml-auto w-2 h-2 bg-success rounded-full animate-pulse"></span>
              )}
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t border-dark-800">
          <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">
            Evidence
          </h3>
          {evidenceItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                location === item.href
                  ? "bg-primary text-white"
                  : "text-dark-300 hover:bg-dark-800"
              )}
            >
              <i className={`${item.icon} w-5`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t border-dark-800">
          <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">
            Reports
          </h3>
          {reportItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                location === item.href
                  ? "bg-primary text-white"
                  : "text-dark-300 hover:bg-dark-800"
              )}
            >
              <i className={`${item.icon} w-5`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
