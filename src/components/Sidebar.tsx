import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Map,
  Bot,
  Users,
  Bus,
  Bookmark,
  AlertTriangle,
  Settings,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: string;
  onNavigate: (item: string) => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "map", label: "Campus Map", icon: Map },
  { id: "ask", label: "Ask Campus AI", icon: Bot },
  { id: "faculty", label: "Faculty", icon: Users },
  { id: "bus", label: "Bus Routes", icon: Bus },
  { id: "saved", label: "Saved Places", icon: Bookmark },
  { id: "emergency", label: "Emergency", icon: AlertTriangle },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  isOpen,
  onClose,
  activeItem,
  onNavigate,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 260 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed lg:relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-slate-700 z-40 overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">SC</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              Campus Nav
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm whitespace-nowrap">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                CSE Student
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
