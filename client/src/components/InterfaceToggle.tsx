import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Monitor, 
  Terminal, 
  BookOpen, 
  Keyboard,
  X
} from "lucide-react";

export default function InterfaceToggle() {
  const [location, setLocation] = useLocation();
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.ctrlKey && e.key === '1') {
        e.preventDefault();
        setLocation('/tools');
      } else if (e.ctrlKey && e.key === '2') {
        e.preventDefault();
        setLocation('/academic');
      } else if (e.key === 'F1') {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      } else if (e.key === 'Escape') {
        setShowShortcuts(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setLocation, showShortcuts]);

  const isLinuxTools = location === '/tools';
  const isAcademic = location === '/academic' || location === '/dashboard';

  return (
    <>
      {/* Interface Toggle Buttons */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-2">
        <Button
          size="sm"
          variant={isLinuxTools ? "default" : "ghost"}
          onClick={() => setLocation('/tools')}
          className="flex items-center space-x-1"
        >
          <Terminal className="w-4 h-4" />
          <span>Tools</span>
        </Button>
        <Button
          size="sm"
          variant={isAcademic ? "default" : "ghost"}
          onClick={() => setLocation('/academic')}
          className="flex items-center space-x-1"
        >
          <BookOpen className="w-4 h-4" />
          <span>Academic</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="flex items-center space-x-1"
        >
          <Keyboard className="w-4 h-4" />
        </Button>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowShortcuts(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Interface Navigation</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tools Interface</span>
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-xs mono-font">Ctrl+1</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Academic Dashboard</span>
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-xs mono-font">Ctrl+2</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Show Help</span>
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-xs mono-font">F1</kbd>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-green-400 mb-2">Tools Interface</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Start/Pause Analysis</span>
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-xs mono-font">Ctrl+A</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Focus Filter</span>
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-xs mono-font">Ctrl+F</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Export Report</span>
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-xs mono-font">Ctrl+E</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Next Pane</span>
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-xs mono-font">Tab</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Previous Pane</span>
                    <kbd className="px-2 py-1 bg-gray-800 rounded text-xs mono-font">Shift+Tab</kbd>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                Press <kbd className="px-1 py-0.5 bg-gray-800 rounded mono-font">Esc</kbd> to close this dialog
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}