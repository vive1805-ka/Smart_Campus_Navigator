import {
  Menu,
  Search,
  Sparkles,
  Bookmark,
  Clock,
  MoreHorizontal,
  Smartphone,
} from "lucide-react";

/* ─── Navigation items ─── */
const NAV_ITEMS = [
  { id: "menu", label: "Menu", icon: Menu, position: "top" },
  { id: "search", label: "Search", icon: Search, position: "top" },
  { id: "ask", label: "Ask Maps", icon: Search, sparkle: true, position: "top" },
  { id: "saved", label: "Saved", icon: Bookmark, position: "top" },
  { id: "recents", label: "Recents", icon: Clock, position: "top" },
  { id: "more", label: "View more", icon: MoreHorizontal, position: "top" },
  { id: "app", label: "Get app", icon: Smartphone, position: "bottom" },
];

/**
 * Persistent left navigation rail — always visible regardless of active panel.
 */
export default function NavRail({ activeId = "search", onSelect }) {
  return (
    <nav className="flex flex-col items-center w-[72px] bg-white border-r border-gray-100
                    py-3 flex-shrink-0 h-full select-none">
      {/* Top section */}
      <div className="flex-1 flex flex-col items-center gap-0.5">
        {NAV_ITEMS.filter((n) => n.position === "top").map((item) => (
          <RailButton
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={() => onSelect?.(item.id)}
          />
        ))}
      </div>

      {/* Bottom-pinned */}
      <div className="flex flex-col items-center gap-0.5">
        {NAV_ITEMS.filter((n) => n.position === "bottom").map((item) => (
          <RailButton
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={() => onSelect?.(item.id)}
          />
        ))}
      </div>
    </nav>
  );
}

/* ─── Individual rail button ─── */
function RailButton({ item, isActive, onClick }) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-0.5 w-[64px] py-2.5 rounded-2xl
        text-[10px] font-medium transition-all duration-200 cursor-pointer
        ${
          isActive
            ? "text-blue-600"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }
      `}
      title={item.label}
    >
      {/* Icon with optional active ring */}
      <span
        className={`
          relative flex items-center justify-center w-8 h-8 rounded-full
          transition-all duration-200
          ${isActive ? "bg-blue-100 ring-2 ring-blue-400 ring-offset-1" : ""}
        `}
      >
        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
        {item.sparkle && (
          <Sparkles
            size={9}
            className={`absolute -top-0.5 -right-1.5 ${
              isActive ? "text-blue-500" : "text-gray-400"
            }`}
          />
        )}
      </span>
      <span className="leading-tight mt-0.5">{item.label}</span>
    </button>
  );
}
