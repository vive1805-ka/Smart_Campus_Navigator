import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Navigation, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import facultyJson from "../data/faculty.json";
import type { Faculty } from "../types";

const STATUS_COLORS: Record<Faculty["availability"], string> = {
  available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200",
  "in-class": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200",
  meeting: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200",
  "not-in-campus": "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export default function FacultyFinder() {
  const navigate = useNavigate();
  const faculty = facultyJson as Faculty[];
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(faculty[0] ?? null);

  const departments = useMemo(
    () => Array.from(new Set(faculty.map((member) => member.department))).sort(),
    [faculty]
  );

  const filteredFaculty = useMemo(() => {
    return faculty.filter((member) => {
      const matchesQuery =
        !searchQuery ||
        [member.name, member.department, member.block, member.room]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesDepartment =
        departmentFilter === "all" || member.department === departmentFilter;
      const matchesAvailability =
        availabilityFilter === "all" || member.availability === availabilityFilter;
      return matchesQuery && matchesDepartment && matchesAvailability;
    });
  }, [availabilityFilter, departmentFilter, faculty, searchQuery]);

  const handleNavigate = (member: Faculty) => {
    navigate("/map", {
      state: {
        destination: member.block,
        highlight: member.block,
      },
    });
  };

  return (
    <motion.div
      className="mx-auto max-w-7xl p-4 lg:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
            <Filter size={12} />
            Faculty finder
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
            Search and locate faculty members
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Find a cabin, check availability, and jump to the faculty block on the map.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
          {filteredFaculty.length} result{filteredFaculty.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, block, or room"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40"
              />
            </div>

            <div className="relative">
              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40"
              >
                <option value="all">All departments</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={availabilityFilter}
                onChange={(event) => setAvailabilityFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40"
              >
                <option value="all">All availability</option>
                <option value="available">Available</option>
                <option value="in-class">In class</option>
                <option value="meeting">Meeting</option>
                <option value="not-in-campus">Not in campus</option>
              </select>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {filteredFaculty.map((member) => {
              const isActive = selectedFaculty?.id === member.id;
              return (
                <motion.button
                  key={member.id}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFaculty(member)}
                  className={`rounded-[24px] border p-4 text-left transition ${
                    isActive
                      ? "border-blue-300 bg-blue-50/80 shadow-lg shadow-blue-100 dark:bg-blue-950/30"
                      : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {member.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {member.department} • {member.block}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLORS[member.availability]}`}>
                          {member.availability.replace(/-/g, " ")}
                        </span>
                        {member.expectedAvailable && (
                          <span className="text-[11px] text-slate-400">
                            Free by {member.expectedAvailable}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}

            {filteredFaculty.length === 0 && (
              <div className="col-span-full rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
                No faculty matches the current filters.
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4 rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-slate-700 dark:bg-slate-900/80">
          {selectedFaculty ? (
            <>
              <div className="overflow-hidden rounded-[24px] bg-slate-950">
                <img
                  src={selectedFaculty.image}
                  alt={selectedFaculty.name}
                  className="h-56 w-full object-cover opacity-90"
                />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {selectedFaculty.name}
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {selectedFaculty.department} department, {selectedFaculty.block}, Floor{" "}
                  {selectedFaculty.floor}, Room {selectedFaculty.room}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Status
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${STATUS_COLORS[selectedFaculty.availability]}`}>
                    {selectedFaculty.availability.replace(/-/g, " ")}
                  </span>
                  {selectedFaculty.expectedAvailable && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Expected free at {selectedFaculty.expectedAvailable}
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/80">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Contact
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  {selectedFaculty.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleNavigate(selectedFaculty)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Navigation size={16} />
                Navigate to cabin
              </button>
            </>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-800/40">
              <MapPin size={28} className="text-slate-400" />
              <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                Select a faculty member
              </p>
              <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                We’ll show their availability, cabin details, and a map jump target here.
              </p>
            </div>
          )}
        </aside>
      </div>
    </motion.div>
  );
}
