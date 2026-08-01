export default function LoadingSkeleton({
  width = "w-full",
  height = "h-4",
  borderRadius = "rounded",
}: {
  width?: string;
  height?: string;
  borderRadius?: string;
}) {
  return (
    <div
      className={`${width} ${height} ${borderRadius} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%] animate-shimmer`}
    />
  );
}
