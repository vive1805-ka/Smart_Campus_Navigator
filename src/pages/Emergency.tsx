import { motion } from "framer-motion";
import { Phone, AlertTriangle, Navigation } from "lucide-react";
import type { EmergencyContact } from "../types";

const CONTACTS: EmergencyContact[] = [
  {
    id: "e1",
    name: "Campus Medical Center",
    number: "+91-44-1234-5678",
    type: "medical",
    building: "Medical Center",
  },
  {
    id: "e2",
    name: "Security Office",
    number: "+91-44-1234-5679",
    type: "security",
    building: "Administrative Block",
  },
  {
    id: "e3",
    name: "Campus Ambulance",
    number: "+91-44-1234-5680",
    type: "medical",
    building: "Medical Center",
  },
  {
    id: "e4",
    name: "Student Welfare",
    number: "+91-44-1234-5681",
    type: "general",
    building: "Student Affairs",
  },
];

const CONTAINER_VARIANTS = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function Emergency() {
  const handleNavigate = (contact: EmergencyContact) => {
    alert(`Navigate to ${contact.building}`);
  };

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <AlertTriangle size={28} className="text-red-600" />
          Emergency Contacts
        </h1>
        <p className="text-gray-500 mt-1">Important contacts for campus safety</p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8"
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="show"
      >
        {CONTACTS.filter((c) => c.type === "medical" || c.type === "security").map((contact) => {
          return (
            <motion.div
              key={contact.id}
              variants={ITEM_VARIANTS}
              className="rounded-2xl border border-red-200 bg-red-50/70 backdrop-blur-xl shadow-lg overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 text-red-600">
                    {contact.type === "medical" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M12 8v8" />
                        <path d="M8 12h8" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      </svg>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{contact.building}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-red-700 font-medium">
                      <Phone size={14} />
                      {contact.number}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:${contact.number.replace(/-/g, "")}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
                  >
                    <Phone size={14} />
                    Call Now
                  </a>
                  <button
                    onClick={() => handleNavigate(contact)}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-300 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors"
                  >
                    <Navigation size={14} />
                    Navigate
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Contacts</h2>
        <motion.div
          className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden"
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="show"
        >
          {CONTACTS.map((contact) => (
            <motion.div
              key={contact.id}
              variants={ITEM_VARIANTS}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 flex-shrink-0">
                <Phone size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                <p className="text-xs text-gray-400">{contact.building}</p>
              </div>
              <a
                href={`tel:${contact.number.replace(/-/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors"
              >
                <Phone size={12} />
                {contact.number}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
}
