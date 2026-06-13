import { motion } from "framer-motion";

export const Skeleton = ({ className, style }) => {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={`relative overflow-hidden bg-border-subtle ${className}`}
      style={style}
    >
      <motion.div
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </motion.div>
  );
};

export const DashboardSkeleton = () => (
  <div className="w-full overflow-hidden">
    <Skeleton className="w-24 h-4 mb-3 rounded-full" />
    <Skeleton className="w-72 h-12 mb-8 rounded-xl" />
    <div className="flex gap-5 overflow-x-auto pb-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="min-w-72 h-64 rounded-[28px] shrink-0" />
      ))}
    </div>
    <div className="mt-16">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="w-52 h-8 rounded-xl" />
        <Skeleton className="w-28 h-4 rounded-full" />
      </div>
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="w-full h-16 rounded-2xl" />
        ))}
      </div>
    </div>
  </div>
);

export const HabitsPageSkeleton = () => (
  <div className="w-full">
    <div className="flex justify-between items-start mb-8">
      <div>
        <Skeleton className="w-20 h-4 mb-2 rounded-full" />
        <Skeleton className="w-64 h-12 rounded-xl" />
      </div>
      <Skeleton className="w-28 h-11 rounded-full" />
    </div>
    <div className="flex items-center gap-8 mb-8 border-b border-border-subtle">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-16 h-4 mb-3 rounded-full" />
      ))}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="w-full h-44 rounded-[28px]" />
      ))}
    </div>
  </div>
);

export const StatisticsSkeleton = () => (
  <div className="w-full">
    <div className="mb-10">
      <Skeleton className="w-72 h-12 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-36 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
      <Skeleton className="lg:col-span-2 rounded-[28px] max-sm:h-64 sm:h-80" />
      <Skeleton className="rounded-[28px] min-h-80" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      <Skeleton className="w-full h-80 rounded-[28px]" />
      <Skeleton className="w-full h-80 rounded-[28px]" />
    </div>
  </div>
);

export const SettingsSkeleton = () => (
  <div className="w-full">
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="mb-10">
        <Skeleton className="w-48 h-12 mb-2 rounded-xl" />
        <Skeleton className="w-64 h-4 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        <Skeleton className="h-100 rounded-[28px]" />
        <Skeleton className="h-100 rounded-[28px]" />
      </div>
      <Skeleton className="h-64 rounded-[28px] w-full" />
    </div>
  </div>
);
