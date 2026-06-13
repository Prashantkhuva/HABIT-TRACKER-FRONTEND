export default function BlogAdminLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="h-10 w-48 animate-pulse rounded-xl bg-border-subtle" />
          <div className="mt-2 h-4 w-32 animate-pulse rounded-full bg-border-subtle/60" />
        </div>
        <div className="h-10 w-28 animate-pulse rounded-full bg-border-subtle" />
      </div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-border-subtle" />
        ))}
      </div>
    </div>
  );
}
