import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface EmergencyButtonProps {
  onClick: () => void;
}

export default function EmergencyButton({ onClick }: EmergencyButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center group"
    >
      <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-30" />
      <AlertTriangle size={24} className="relative z-10" />
      <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Emergency
      </span>
    </motion.button>
  );
}
