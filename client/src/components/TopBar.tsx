interface TopBarProps {
  activeCaseName: string;
  userName: string;
  userRole: string;
  notificationCount: number;
}

export function TopBar({ activeCaseName, userName, userRole, notificationCount }: TopBarProps) {
  return (
    <header className="bg-dark-900 border-b border-dark-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-white">Forensic Dashboard</h2>
          <div className="flex items-center space-x-2 text-sm text-dark-400">
            <span>Active Case:</span>
            <span className="text-primary font-medium">{activeCaseName}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-dark-400 hover:text-white transition-colors">
            <i className="fas fa-bell"></i>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-dark-400">{userRole}</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b612b647?w=32&h=32&fit=crop&crop=face"
              alt="User avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
