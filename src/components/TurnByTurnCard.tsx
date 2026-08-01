import { motion } from "framer-motion";

interface TurnByTurnCardProps {
  steps: string[];
  currentStep: number;
}

export default function TurnByTurnCard({ steps, currentStep }: TurnByTurnCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-600 p-4 max-h-64 overflow-y-auto"
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
          {currentStep + 1}
        </span>
        Turn by Turn
      </h3>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 p-2 rounded-xl transition-all ${
              idx === currentStep
                ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                : idx < currentStep
                ? "bg-gray-50 dark:bg-slate-700/30 opacity-60"
                : "bg-transparent opacity-40"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                idx <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-slate-600 text-gray-500"
              }`}
            >
              {idx + 1}
            </span>
            <p
              className={`text-sm ${
                idx === currentStep
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
