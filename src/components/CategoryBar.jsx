import {
  Utensils,
  Hotel,
  Camera,
  Landmark,
  TrainFront,
  Fuel,
  Coffee,
  ShoppingBag,
  Pill,
  ParkingCircle,
} from "lucide-react";

const CATEGORIES = [
  { id: "restaurants", label: "Restaurants", icon: Utensils },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "things", label: "Things to do", icon: Camera },
  { id: "museums", label: "Museums", icon: Landmark },
  { id: "transit", label: "Transit", icon: TrainFront },
  { id: "gas", label: "Gas stations", icon: Fuel },
  { id: "coffee", label: "Coffee", icon: Coffee },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "pharmacies", label: "Pharmacies", icon: Pill },
  { id: "parking", label: "Parking", icon: ParkingCircle },
];

/**
 * Full-width category chip bar that sits above the map.
 */
export default function CategoryBar({ activeCategory, onCategoryClick }) {
  return (
    <div
      className="flex gap-2 px-3 py-2 overflow-x-auto"
      style={{ scrollbarWidth: "none" }}
    >
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onCategoryClick?.(cat)}
            className={`
              flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2
              text-xs font-medium transition-all duration-200 border flex-shrink-0 cursor-pointer
              ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
              }
            `}
          >
            <Icon size={14} strokeWidth={2} />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
