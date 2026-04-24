import Container from "../container/Container";

/* ================= Skeleton Component ================= */

function Skeleton({ className = "" }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}

/* ================= App Shell ================= */

function AppShellSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <header className="fixed left-10 right-10 top-0 z-50 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-black/70 backdrop-blur-md">
        <Container>
          <div className="flex items-center justify-between py-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </div>
        </Container>
      </header>

      <main className="pt-28">
        <Container>
          <div className="flex flex-col gap-14 py-12 md:py-16">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full max-w-2xl" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-full max-w-2xl" />
                <Skeleton className="h-5 w-5/6 max-w-2xl" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-44 rounded-full" />
                  <Skeleton className="h-12 w-40 rounded-full" />
                </div>
              </div>
              <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

/* ================= Post Card ================= */

function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
      <Skeleton className="aspect-[16/11] w-full" />
      <div className="flex flex-col gap-5 p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="size-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ================= Post Grid ================= */

function PostGridSkeleton({ count = 6 }) {
  return (
    <Container>
      <div className="flex flex-col gap-12 py-12 md:py-16">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 w-64" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Container>
  );
}

/* ================= Home ================= */

function HomeSkeleton() {
  return (
    <div className="w-full">
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="flex flex-col gap-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full max-w-2xl" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-44 rounded-full" />
                <Skeleton className="h-12 w-40 rounded-full" />
              </div>
            </div>

            <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <PostGridSkeleton />
      </section>
    </div>
  );
}

/* ================= Post Details ================= */

function PostDetailsSkeleton() {
  return (
    <article className="pb-16 md:pb-24">
      <Skeleton className="aspect-[21/8] w-full" />

      <Container>
        <div className="mx-auto -mt-16 max-w-4xl">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-8">
            <div className="flex flex-col gap-6">
              <Skeleton className="h-9 w-36 rounded-full" />
              <Skeleton className="h-14 w-4/5" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}

/* ================= Auth ================= */

function AuthFormSkeleton() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-xl">
        <Skeleton className="h-16 w-32 mx-auto mb-6" />

        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-48 mx-auto" />
          <Skeleton className="h-5 w-56 mx-auto" />
        </div>

        <div className="mt-8 flex flex-col gap-5">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

/* ================= Post Form ================= */

function PostFormSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 md:p-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-5 md:col-span-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>

        <div className="flex flex-col gap-5">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

/* ================= Export ================= */

export  {
  AppShellSkeleton,
  AuthFormSkeleton,
  HomeSkeleton,
  PostCardSkeleton,
  PostDetailsSkeleton,
  PostFormSkeleton,
  PostGridSkeleton,
};
