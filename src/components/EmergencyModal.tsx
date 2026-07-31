import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation, Phone } from "lucide-react";
import buildings from "../data/buildings.json";
import type { Building } from "../types";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (building: Building) => void;
}

const EMERGENCY_BUILDINGS = [
  {
    name: "Medical Center",
    icon: "🏥",
    description: "On-campus medical facility with ambulance service",
    phone: "+91-98765-43210",
  },
  {
    name: "Security Office",
    icon: "👮",
    description: "24/7 campus security and surveillance",
    phone: "+91-98765-43211",
  },
];

const EMERGENCY_CONTACTS = [
  { name: "Campus Security", number: "100", type: "security" },
  { name: "Medical Emergency", number: "108", type: "medical" },
  { name: "Ambulance", number: "102", type: "medical" },
  { name: "Women Helpline", number: "1091", type: "general" },
  { name: "Student Welfare", number: "+91-98765-43212", type: "general" },
];

export default function EmergencyModal({
  isOpen,
  onClose,
  onNavigate,
}: EmergencyModalProps) {
  const medicalBuilding = buildings.find((b) => b.name === "Medical Center") as
    | Building
    | undefined;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-red-600 text-xl">🚨</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Emergency Services
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Quick access to help
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {EMERGENCY_BUILDINGS.map((item) => (
                <div
                  key={item.name}
                  className="p-4 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                      <p className="text-sm font-medium text-red-600 mt-1 flex items-center gap-1">
                        <Phone size={14} />
                        {item.phone}
                      </p>
                    </div>
                    {item.name === "Medical Center" && medicalBuilding && (
                      <button
                        onClick={() => onNavigate(medicalBuilding)}
                        className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Navigation size={14} />
                        <span className="text-xs font-medium">Go</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Emergency Contacts
                </h3>
                <div className="space-y-2">
                  {EMERGENCY_CONTACTS.map((contact) => (
                    <div
                      key={contact.name}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {contact.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {contact.type}
                        </p>
                      </div>
                      <a
                        href={`tel:${contact.number}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Phone size={14} />
                        {contact.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
