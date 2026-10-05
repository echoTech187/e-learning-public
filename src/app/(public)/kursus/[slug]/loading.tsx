import { Skeleton } from "@/components/ui/Skeleton";

export default function CourseDetailLoading() {
  return (
    <main className="relative min-h-screen bg-slate-50 font-sans antialiased">
      {/* DARK HERO BACKGROUND BANNER SKELETON */}
      <div className="relative">
        <div
          className="absolute top-0 left-0 right-0 h-[560px] sm:h-[520px] lg:h-[500px] pointer-events-none z-0"
          style={{
            background: "linear-gradient(160deg, #0b0f19 0%, #1e1b4b 55%, #0f172a 100%)",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 relative z-10 h-full">
          <div className="max-w-7xl mx-auto w-full pb-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="flex-1 max-w-3xl pt-2 sm:pt-4">
                {/* Breadcrumb Skeleton */}
                <div className="flex items-center gap-2 mb-6 sm:mb-8">
                  <Skeleton variant="text" animation="wave" className="w-16 h-3 bg-white/20" />
                  <Skeleton variant="text" animation="wave" className="w-3 h-3 bg-white/20" />
                  <Skeleton variant="text" animation="wave" className="w-24 h-3 bg-white/20" />
                </div>

                {/* Title Skeleton */}
                <Skeleton variant="text" animation="wave" className="w-3/4 h-10 sm:h-12 bg-white/20 mb-4" />
                <Skeleton variant="text" animation="wave" className="w-1/2 h-10 sm:h-12 bg-white/20 mb-6" />

                {/* Description Skeleton */}
                <Skeleton variant="text" animation="wave" className="w-full h-5 bg-white/10 mb-2" />
                <Skeleton variant="text" animation="wave" className="w-5/6 h-5 bg-white/10 mb-8" />

                {/* Badges Skeleton */}
                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton variant="rectangular" animation="wave" className="w-24 h-8 rounded-full bg-white/10" />
                  <Skeleton variant="rectangular" animation="wave" className="w-24 h-8 rounded-full bg-white/10" />
                  <Skeleton variant="rectangular" animation="wave" className="w-32 h-8 rounded-full bg-white/10" />
                </div>
              </div>

              {/* Right spacer for the overlapping card */}
              <div className="hidden lg:block lg:w-[380px] xl:w-[420px] shrink-0" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full -mt-4 lg:-mt-[110px] relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* LEFT COLUMN: MAIN CONTENT SKELETON */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 sm:gap-8 order-2 lg:order-1 pt-4 lg:pt-0">
            {/* Feature Pillars Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rounded" animation="wave" className="h-28" />
              ))}
            </div>

            {/* Objectives Skeleton */}
            <div className="p-6 sm:p-8 rounded-[24px] bg-white border border-slate-100 shadow-sm">
              <Skeleton variant="text" animation="wave" className="w-1/3 h-6 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton variant="circular" animation="wave" className="w-6 h-6 shrink-0" />
                    <Skeleton variant="text" animation="wave" className="w-full h-12" />
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Skeleton */}
            <div className="mt-4">
              <Skeleton variant="text" animation="wave" className="w-1/4 h-7 mb-6" />
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rounded" animation="wave" className="h-16" />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PURCHASE CARD SKELETON */}
          <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 lg:sticky lg:top-28">
            <div className="bg-white rounded-[24px] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50">
              {/* Video Placeholder Skeleton */}
              <div className="aspect-video relative bg-slate-100 p-2">
                <Skeleton variant="rounded" animation="wave" className="w-full h-full rounded-2xl" />
              </div>
              
              <div className="p-6 sm:p-8">
                {/* Price Skeleton */}
                <Skeleton variant="text" animation="wave" className="w-1/2 h-10 mb-6" />
                
                {/* Buttons Skeleton */}
                <Skeleton variant="rounded" animation="wave" className="w-full h-12 mb-3 rounded-full" />
                <Skeleton variant="rounded" animation="wave" className="w-full h-12 mb-8 rounded-full" />
                
                {/* Feature List Skeleton */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <Skeleton variant="text" animation="wave" className="w-2/3 h-4 mb-4" />
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton variant="circular" animation="wave" className="w-4 h-4 shrink-0" />
                      <Skeleton variant="text" animation="wave" className="w-full h-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
