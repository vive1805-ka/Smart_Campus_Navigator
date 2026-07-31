import { AnimatePresence, motion } from "framer-motion";
import { X, Navigation, Phone, ShieldAlert, HeartPulse } from "lucide-react";
import { campusBuildings, getCampusBuildingByName } from "../data/campusData";
import type { Building } from "../types";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (building: Building) => void;
}

const EMERGENCY_CONTACTS = [
  { name: "Campus Security", number: "100", type: "security" },
  { name: "Medical Emergency", number: "108", type: "medical" },
  { name: "Ambulance", number: "102", type: "medical" },
  { name: "Women Helpline", number: "1091", type: "general" },
  { name: "Student Welfare", number: "+91-98765-43212", type: "general" },
];

export default function EmergencyModal({ isOpen, onClose, onNavigate }: EmergencyModalProps) {
  const medicalBuilding = getCampusBuildingByName("Medical Center") ?? campusBuildings[0];
  const securityBuilding = getCampusBuildingByName("Security Office") ?? campusBuildings[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 18 }}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/60 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.28)] dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Emergency Services
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Fast access to campus safety support
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(85vh-88px)] space-y-5 overflow-y-auto p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: "Medical Center",
                    description: "On-campus medical support with first response care.",
                    building: medicalBuilding,
                    icon: HeartPulse,
                    action: "Navigate to medical",
                  },
                  {
                    title: "Security Office",
                    description: "24/7 security desk for incident reporting and support.",
                    building: securityBuilding,
                    icon: ShieldAlert,
                    action: "Navigate to security",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-[24px] border border-red-100 bg-red-50/50 p-4 dark:border-red-950/40 dark:bg-red-950/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm dark:bg-slate-800 dark:text-red-300">
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <a
                          href="tel:108"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                          <Phone size={16} />
                          Call
                        </a>
                        <button
                          type="button"
                          onClick={() => onNavigate(item.building)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900/50 dark:text-red-200 dark:hover:bg-red-950/40"
                        >
                          <Navigation size={16} />
                          Go
                        </button>
                      </div>
                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                        {item.action}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Emergency Contacts
                </h3>
                <div className="space-y-2">
                  {EMERGENCY_CONTACTS.map((contact) => (
                    <div
                      key={contact.name}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {contact.name}
                        </p>
                        <p className="text-xs capitalize text-slate-400">{contact.type}</p>
                      </div>
                      <a
                        href={`tel:${contact.number.replace(/[^0-9]/g, "")}`}
                        className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
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
