import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  Download, 
  FileText, 
  Hash, 
  Info, 
  Copy, 
  Eye,
  Trash2,
  Settings
} from "lucide-react";

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  item?: {
    id: string;
    name: string;
    type: string;
    status: string;
  };
}

export default function ContextMenu({ isOpen, x, y, onClose, item }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const menuItems = [
    {
      icon: <Play className="w-4 h-4" />,
      label: item.status === 'processing' ? 'Pause Analysis' : 'Start Analysis',
      shortcut: 'Ctrl+A',
      action: () => console.log('Toggle analysis'),
      disabled: item.status === 'error'
    },
    {
      icon: <Eye className="w-4 h-4" />,
      label: 'View Details',
      shortcut: 'Enter',
      action: () => console.log('View details'),
      disabled: false
    },
    { type: 'separator' },
    {
      icon: <Hash className="w-4 h-4" />,
      label: 'Verify Hash',
      shortcut: '',
      action: () => console.log('Verify hash'),
      disabled: false
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: 'Generate Report',
      shortcut: 'Ctrl+R',
      action: () => console.log('Generate report'),
      disabled: item.status === 'pending'
    },
    {
      icon: <Download className="w-4 h-4" />,
      label: 'Export Evidence',
      shortcut: 'Ctrl+E',
      action: () => console.log('Export evidence'),
      disabled: false
    },
    { type: 'separator' },
    {
      icon: <Copy className="w-4 h-4" />,
      label: 'Copy Path',
      shortcut: 'Ctrl+C',
      action: () => console.log('Copy path'),
      disabled: false
    },
    {
      icon: <Info className="w-4 h-4" />,
      label: 'Properties',
      shortcut: 'Alt+Enter',
      action: () => console.log('Show properties'),
      disabled: false
    },
    { type: 'separator' },
    {
      icon: <Trash2 className="w-4 h-4" />,
      label: 'Remove from Case',
      shortcut: 'Del',
      action: () => console.log('Remove evidence'),
      disabled: false,
      danger: true
    }
  ];

  return (
    <div 
      ref={menuRef}
      className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 min-w-[200px]"
      style={{ left: x, top: y }}
    >
      <div className="px-3 py-2 border-b border-gray-600">
        <div className="text-sm font-medium text-white mono-font">{item.name}</div>
        <div className="text-xs text-gray-400">{item.type} • {item.status}</div>
      </div>
      
      <div className="py-1">
        {menuItems.map((menuItem, index) => {
          if (menuItem.type === 'separator') {
            return <Separator key={index} className="my-1 bg-gray-600" />;
          }

          return (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start px-3 py-1.5 h-auto text-sm hover:bg-gray-700 ${
                menuItem.disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                menuItem.danger ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-gray-200'
              }`}
              disabled={menuItem.disabled}
              onClick={() => {
                if (!menuItem.disabled) {
                  menuItem.action();
                  onClose();
                }
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  {menuItem.icon}
                  <span>{menuItem.label}</span>
                </div>
                {menuItem.shortcut && (
                  <span className="text-xs text-gray-500 mono-font">{menuItem.shortcut}</span>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}