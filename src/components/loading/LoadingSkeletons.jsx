import { motion } from "framer-motion";

export const Skeleton = ({ className, style }) => {
  return (
    <motion.div
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={`relative overflow-hidden bg-[#E8E4DC] dark:bg-[#1D1B20] ${className}`}
      style={style}
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-[#2A2A2A]/50 to-transparent"
      />
    </motion.div>
  );
};

export const DashboardSkeleton = () => (
  <div className="w-full overflow-hidden">
    {/* Label + Heading */}
    <Skeleton className="w-20 h-4 mb-3 rounded-full" />
    <Skeleton className="w-64 h-12 mb-8 rounded-xl" />

    {/* Habit cards — horizontal scroll, clipped to parent */}
    <div className="flex gap-5 overflow-x-auto pb-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="min-w-72 h-52 rounded-xl shrink-0" />
      ))}
    </div>

    {/* Completed section */}
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="w-48 h-8 rounded-xl" />
        <Skeleton className="w-24 h-4 rounded-full" />
      </div>
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="w-full h-16 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);


export const HabitsPageSkeleton = () => (
  <div className="w-full">
    {/* Header */}
    <div className="flex justify-between items-start mb-8">
      <div>
        <Skeleton className="w-20 h-4 mb-2 rounded-full" />
        <Skeleton className="w-64 h-12 rounded-full" />
      </div>
      <Skeleton className="w-28 h-10 rounded-full" />
    </div>

    {/* Filter tabs */}
    <div className="flex items-center gap-8 mb-8 border-b border-border-subtle">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-16 h-4 mb-3 rounded-full" />
      ))}
    </div>

    {/* 6 habit cards grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="w-full h-40 rounded-xl" />
      ))}
    </div>
  </div>
);

export const StatisticsSkeleton = () => (
  <div className="w-full">
    {/* HEADER */}
    <div className="mb-10">
      <Skeleton className="w-72 h-12 rounded-full" />
    </div>

    {/* 4 Stat Cards */}
    <div className="grid max-sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>

    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
      {/* Weekly Chart */}
      <Skeleton className="lg:col-span-2 rounded-xl max-sm:h-64 sm:h-80" />
      {/* AI Card */}
      <Skeleton className="rounded-xl min-h-80" />
    </div>

    {/* Heatmap & Streak */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      <Skeleton className="w-full h-80 rounded-xl" />
      <Skeleton className="w-full h-80 rounded-xl" />
    </div>
  </div>
);

export const SettingsSkeleton = () => (
  <div className="w-full">
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-10">
        <Skeleton className="w-48 h-12 mb-2 rounded-full" />
        <Skeleton className="w-64 h-4 rounded-full" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        <Skeleton className="h-100 rounded-xl" />
        <Skeleton className="h-100 rounded-xl" />
      </div>

      {/* Danger Zone / Other Cards */}
      <Skeleton className="h-64 rounded-xl w-full" />
    </div>
  </div>
);
