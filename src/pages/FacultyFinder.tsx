import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Filter } from "lucide-react";
import faculty from "../data/faculty.json";
import type { Faculty } from "../types";

const CONTAINER_VARIANTS = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const AVAILABILITY_COLORS: Record<string, string> = {
  available: "bg-emerald-100 text-emerald-700",
  "in-class": "bg-amber-100 text-amber-700",
  meeting: "bg-purple-100 text-purple-700",
  "not-in-campus": "bg-gray-100 text-gray-600",
};

function FacultyCard({
  member,
  isSelected,
  onSelect,
}: {
  member: Faculty;
  isSelected: boolean;
  onSelect: (member: Faculty) => void;
}) {
  return (
    <motion.div
      variants={ITEM_VARIANTS}
      onClick={() => onSelect(member)}
      className={`rounded-2xl border p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-blue-400 bg-blue-50/80 shadow-lg shadow-blue-100"
          : "border-white/40 bg-white/70 backdrop-blur-xl shadow-md hover:shadow-xl"
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src={member.image}
          alt={member.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{member.department} · {member.block}</p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${AVAILABILITY_COLORS[member.availability] || "bg-gray-100 text-gray-600"}`}
            >
              {member.availability.replace(/-/g, " ")}
            </span>
            {member.expectedAvailable && (
              <span className="text-[11px] text-gray-400">
                Free by {member.expectedAvailable}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FacultyFinder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const typedFaculty = faculty as Faculty[];

  const departments = useMemo(() => {
    const set = new Set(typedFaculty.map((f) => f.department));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return typedFaculty.filter((f) => {
      const matchesName = f.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = departmentFilter === "all" || f.department === departmentFilter;
      const matchesAvail = availabilityFilter === "all" || f.availability === availabilityFilter;
      return matchesName && matchesDept && matchesAvail;
    });
  }, [searchQuery, departmentFilter, availabilityFilter, typedFaculty]);

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Faculty Finder</h1>
        <p className="text-gray-500 mt-1">Search and locate faculty members</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 bg-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Availability</option>
          <option value="available">Available</option>
          <option value="in-class">In Class</option>
          <option value="meeting">In Meeting</option>
          <option value="not-in-campus">Not In Campus</option>
        </select>
      </div>

      {selectedFaculty && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl border border-blue-200 bg-blue-50/80 backdrop-blur flex items-center gap-3"
        >
          <MapPin size={18} className="text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Selected on map</p>
            <p className="text-xs text-gray-500">
              {selectedFaculty.name} · {selectedFaculty.block}, Floor {selectedFaculty.floor}, Room {selectedFaculty.room}
            </p>
          </div>
          <button
            onClick={() => setSelectedFaculty(null)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <MapPin size={16} />
          </button>
        </motion.div>
      )}

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="show"
      >
        {filtered.map((member) => (
          <FacultyCard
            key={member.id}
            member={member}
            isSelected={selectedFaculty?.id === member.id}
            onSelect={setSelectedFaculty}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-12">No faculty found</p>
        )}
      </motion.div>
    </motion.div>
  );
}
