"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useCartStore } from "@/core/store/useCartStore";
import { getCourseThumbnail } from "@/core/utils/imageHelper";
import { CourseDetailUIModel } from "@/core/ViewModels/CourseDetailViewModel";
import { Enrollment } from "@/core/Entities/Enrollment";
import { FlatButton } from "@/components/ui/FlatButton";
import { CurriculumAccordion } from "@/components/ui/CurriculumAccordion";
import { ContentCard } from "@/components/ui/ContentCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturePillar } from "@/components/ui/FeaturePillar";
import { ObjectiveItem } from "@/components/ui/ObjectiveItem";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { VideoPreviewModal } from "@/components/ui/VideoPreviewModal";

interface CourseDetailClientProps {
  course: CourseDetailUIModel;
  enrollments: Enrollment[];
}

export default function CourseDetailClient({ course, enrollments }: CourseDetailClientProps) {
  const router = useRouter();
  const { addItem, clearCart } = useCartStore();

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewVideoTitle, setPreviewVideoTitle] = useState("Pratinjau Materi Kursus");

  const isEnrolled = enrollments.some((e) => e.course_id === course.id);

  const handleBuyCourse = () => {
    const isLoggedIn = document.cookie.includes("user=");
    if (!isLoggedIn) {
      toast.error("Silakan masuk terlebih dahulu untuk membeli kursus.");
      setTimeout(() => {
        router.push("/masuk");
      }, 1200);
      return;
    }

    clearCart();
    addItem({
      id: course.id,
      title: course.title,
      thumbnail: getCourseThumbnail(course.thumbnail),
      instructor_name: course.instructor_name,
      price: course.price,
      price_formatted: course.price_formatted,
    });
    router.push("/cart");
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success("Tautan kursus berhasil disalin ke clipboard!");
      } else {
        toast.error("Gagal menyalin tautan otomatis.");
      }
    } catch (err) {
      toast.error("Browser Anda tidak mendukung fitur salin otomatis.");
    }

    document.body.removeChild(textArea);
  };

  const handleCopyShare = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url)
          .then(() => toast.success("Tautan kursus berhasil disalin ke clipboard!"))
          .catch(() => fallbackCopyTextToClipboard(url));
      } else {
        fallbackCopyTextToClipboard(url);
      }
    }
  };

  const openPreview = (title: string) => {
    setPreviewVideoTitle(title);
    setPreviewModalOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <style dangerouslySetInnerHTML={{
        __html: `
        /* KHUSUS HALAMAN INI: Ubah warna navbar menjadi putih saat belum di-scroll */
        #mainNav:not(.scrolled) .navbar-brand-edu span { color: white !important; }
        #mainNav:not(.scrolled) .navbar-brand-edu .brand-icon { background: rgba(255, 255, 255, 0.15) !important; color: white !important; }
        #mainNav:not(.scrolled) .nav-link-edu { color: rgba(255, 255, 255, 0.8) !important; }
        #mainNav:not(.scrolled) .nav-link-edu:hover,
        #mainNav:not(.scrolled) .nav-link-edu.active { color: white !important; background: rgba(255, 255, 255, 0.15) !important; }
        #mainNav:not(.scrolled) .navbar-toggler-edu span { background: white !important; }
        #mainNav:not(.scrolled) .btn-nav-outline { color: white !important; border-color: rgba(255, 255, 255, 0.5) !important; }
        #mainNav:not(.scrolled) .btn-nav-outline:hover { background: rgba(255, 255, 255, 0.15) !important; border-color: white !important; }
      `}} />
      <Toaster position="top-center" reverseOrder={false} />

      {/* ========================================================================= */}
      {/* DARK HERO BACKGROUND BANNER (BEHIND TOP SECTION)                          */}
      {/* ========================================================================= */}
      <div className="relative">
        <div
          className="absolute top-0 left-0 right-0 h-[560px] sm:h-[520px] lg:h-[500px] text-white overflow-hidden pointer-events-none z-0"
          style={{
            background: "linear-gradient(160deg, #0b0f19 0%, #1e1b4b 55%, #0f172a 100%)",
          }}
        >
          {/* Ambient Glows */}
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-primary/25 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />

          {/* CONTAINER WRAPPER UNTUK MENGEMBALIKAN POSISI KE TENGAH */}
          <div className="container mx-auto px-4 sm:px-6  pt-28 sm:pt-32 pointer-events-auto relative z-10 h-full">
            {/* HERO INFO BLOCK (WHITE TEXT ON DARK BG) */}
            <div className="text-white pb-2 lg:pb-4 max-w-3xl h-full">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                {course.is_featured && (
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                    <i className="fas fa-fire text-amber-400"></i> Best Seller
                  </span>
                )}
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-200 text-xs font-bold rounded-full border border-indigo-500/30">
                  {course.level}
                </span>
                {course.last_updated && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                    <i className="fas fa-check-circle text-emerald-400"></i> Kurikulum Terkini {course.last_updated.split(' ').pop()}
                  </span>
                )}
              </div>
              <div className="flex flex-col justify-between h-fit">
                <div className="relative h-64">
                  {/* Course Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white max-w-2xl tracking-tight leading-tight sm:leading-snug mb-4 line-clamp-2">
                    {course.title}
                  </h1>
                  {/* Subtitle / Overview */}
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl font-normal line-clamp-5">
                    {course.full_description}
                  </p>
                </div>
                {/* Metadata Badges */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300 pt-3 border-t border-white/10">
                  {/* Instructor */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0 shadow-md"
                      style={{ background: "linear-gradient(135deg, #6C47FF 0%, #4338CA 100%)" }}
                    >
                      {course.instructor_initials}
                    </div>
                    <span className="font-semibold text-white">{course.instructor_name}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <i className="fas fa-star text-xs"></i>
                    <span>{course.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal text-xs">
                      ({course.total_students} ulasan)
                    </span>
                  </div>

                  {/* Students */}
                  <div className="flex items-center gap-1.5">
                    <i className="fas fa-user-graduate text-indigo-400"></i>
                    <span>{course.total_students.toLocaleString("id-ID")} Siswa</span>
                  </div>

                  {/* Language */}
                  <div className="flex items-center gap-1.5">
                    <i className="fas fa-globe text-emerald-400"></i>
                    <span>{course.language || "Bahasa Indonesia"}</span>
                  </div>

                  {/* Last updated */}
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <i className="fas fa-sync-alt text-[11px]"></i>
                    <span>Update: {course.last_updated}</span>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
      {/* ========================================================================= */}
      {/* MAIN UNIFIED 2-COLUMN CONTAINER                                           */}
      {/* ========================================================================= */}
      <div className="container mx-auto px-4 sm:px-6  relative z-10 pt-28 sm:pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ------------------------------------------------------------------- */}
          {/* LEFT COLUMN: HERO INFO + RICH CONTENT                               */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-8 space-y-8 mt-[360px]">

            {/* Mobile Purchase Card (Shown below Hero on small screens) */}
            <ContentCard className="block lg:hidden" padding="p-6">
              <div
                className="w-full h-48 rounded-2xl bg-cover bg-center relative overflow-hidden flex items-center justify-center group mb-3 cursor-pointer shadow-md"
                style={{ backgroundImage: `url(${getCourseThumbnail(course.thumbnail)})` }}
                onClick={() => openPreview("Pratinjau Video Kursus")}
              >
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition"></div>
                <div className="w-14 h-14 rounded-full bg-white text-primary flex items-center justify-center text-xl shadow-lg transform group-hover:scale-110 transition z-10">
                  <i className="fas fa-play ms-1 text-primary"></i>
                </div>
                <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur flex items-center gap-1.5">
                  <i className="fas fa-play-circle text-emerald-400"></i> Pratinjau Video
                </span>
              </div>

              <div className="mb-5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {course.price_formatted}
                  </span>
                  {course.original_price_formatted && (
                    <span className="text-sm text-slate-400 line-through font-medium">
                      {course.original_price_formatted}
                    </span>
                  )}
                </div>
                <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                  Hemat 33% • Akses Seumur Hidup
                </span>
              </div>

              {isEnrolled ? (
                <FlatButton
                  onClick={() => router.push("/dashboard")}
                  variant="solid"
                  colorTheme="green"
                  fullWidth
                  size="md"
                  icon={<i className="fas fa-play-circle text-lg"></i>}
                  iconPosition="left"
                  className="mb-3 px-0"
                >
                  Lanjutkan Belajar
                </FlatButton>
              ) : (
                <FlatButton
                  onClick={handleBuyCourse}
                  variant="solid"
                  colorTheme="blue"
                  fullWidth
                  size="md"
                  icon={<i className="fas fa-arrow-right ms-1"></i>}
                  iconPosition="right"
                  className="mb-3 px-0"
                >
                  Beli Sekarang
                </FlatButton>
              )}

              <p className="text-center text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
                <i className="fas fa-shield-alt text-emerald-600"></i>
                Garansi 30 Hari Uang Kembali 100%
              </p>
            </ContentCard>

            {/* CARD 1: WHAT YOU WILL LEARN */}
            <ContentCard>
              <SectionHeader title="Apa yang Akan Anda Pelajari?" icon="fa-lightbulb" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {course.objectives.map((obj, idx) => (
                  <ObjectiveItem key={obj.id || idx} title={obj.objective} />
                ))}
              </div>
            </ContentCard>

            {/* CARD 2: CURRICULUM ACCORDION */}
            <CurriculumAccordion
              curricula={course.curricula as any}
              onPreview={openPreview}
              totalLessons={course.total_lessons}
              totalDuration={course.total_duration}
            />

            {/* CARD 3: FULL COURSE DESCRIPTION */}
            <ContentCard>
              <SectionHeader title="Deskripsi Lengkap Kursus" icon="fa-book-open" />
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>{course.full_description}</p>
                <p>
                  Sepanjang pelatihan ini, Anda akan dibimbing langkah demi langkah melalui studi kasus aplikasi nyata berstandar industri. Kami mengutamakan pemahaman konsep yang solid disertai dengan praktik langsung (hands-on) sehingga Anda siap mengimplementasikan solusi berkualitas enterprise pada pekerjaan atau proyek Anda selanjutnya.
                </p>
              </div>

              {/* Key Pillars Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-100">
                <FeaturePillar title="Studi Kasus Nyata" description="Portofolio siap kerja" icon="fa-code" colorTheme="indigo" />
                <FeaturePillar title="Sertifikasi Resmi" description="Terverifikasi QR Code" icon="fa-certificate" colorTheme="emerald" />
                <FeaturePillar title="Bimbingan Mentor" description="Tanya jawab forum aktif" icon="fa-headset" colorTheme="amber" />
              </div>
            </ContentCard>

            {/* CARD 4: REQUIREMENTS & TARGET AUDIENCE */}
            <ContentCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Requirements */}
                <div>
                  <SectionHeader title="Persyaratan & Prasyarat" icon="fa-clipboard-check" size="sm" />
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                    {course.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <i className="fas fa-check-circle text-emerald-500 text-xs mt-1 flex-shrink-0"></i>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Audience */}
                <div>
                  <SectionHeader title="Untuk Siapa Kursus Ini?" icon="fa-bullseye" size="sm" />
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                    {course.target_audience.map((aud, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <i className="fas fa-arrow-alt-circle-right text-primary text-xs mt-1 flex-shrink-0"></i>
                        <span>{aud}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ContentCard>

            {/* CARD 5: ABOUT INSTRUCTOR (Strict Master Plan Avatar Standard) */}
            <ContentCard>
              <SectionHeader title="Mengenal Instruktur" icon="fa-user-tie" className="mb-6" />
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white flex-shrink-0 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #6C47FF 0%, #4338CA 100%)" }}
                >
                  {course.instructor_initials}
                </div>
                <div className="flex-grow">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                    {course.instructor_name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-primary mb-3">
                    {course.instructor_role}
                  </p>

                  {/* Instructor Stat Badges */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                      <i className="fas fa-star text-amber-500"></i> {course.instructor_rating} Rating
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                      <i className="fas fa-users text-indigo-500"></i> {course.instructor_students} Siswa
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                      <i className="fas fa-play-circle text-slate-500"></i> {course.instructor_courses} Kursus
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {course.instructor_description}
                  </p>
                </div>
              </div>
            </ContentCard>

            {/* CARD 6: STUDENT REVIEWS & FEEDBACK */}
            <ContentCard>
              <SectionHeader title="Ulasan & Testimoni Siswa" icon="fa-star" className="mb-6" />

              {/* Rating Overview Box */}
              {(() => {
                const totalReviews = course.reviews.length;
                let averageRating = Number(course.rating) || 0;
                let ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                
                if (totalReviews > 0) {
                  let totalScore = 0;
                  course.reviews.forEach(r => {
                    totalScore += r.rating;
                    const rFloor = Math.floor(r.rating);
                    if (rFloor >= 1 && rFloor <= 5) {
                      ratingCounts[rFloor as 1|2|3|4|5]++;
                    }
                  });
                  averageRating = totalScore / totalReviews;
                }

                // Default to course.total_students if no reviews, otherwise use actual review count
                const displayTotal = totalReviews > 0 ? totalReviews : (course.total_students || 0);

                return (
                  <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-6 mb-6">
                    <div className="text-center sm:text-start flex-shrink-0 sm:pr-6 sm:border-r border-slate-200">
                      <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 text-sm my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className={`fas ${averageRating >= star ? "fa-star" : averageRating >= star - 0.5 ? "fa-star-half-alt" : "fa-star text-slate-300"}`}></i>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Berdasarkan {displayTotal} rating</p>
                    </div>

                    <div className="flex-grow space-y-1.5 w-full">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingCounts[star as 1|2|3|4|5];
                        const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                        // Only show bars that have some data, or show 5 and 4 if empty (fallback layout)
                        if (totalReviews === 0 && star < 4) return null;
                        
                        // Fake percentages if no data, just to keep UI looking nice
                        const displayPct = totalReviews > 0 ? percentage : (star === 5 ? 92 : 8);

                        return (
                          <div key={star} className="flex items-center gap-3 text-xs">
                            <span className="w-8 flex items-center justify-between text-slate-600 font-medium">
                              <span>{star}</span>
                              <i className="fas fa-star text-amber-400 text-[10px]"></i>
                            </span>
                            <div className="flex-grow h-2 rounded-full bg-slate-200 overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${displayPct}%` }}></div>
                            </div>
                            <span className="w-8 text-slate-500 text-end font-semibold">{displayPct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Reviews List */}
              <div className="space-y-4">
                {course.reviews.map((rev) => (
                  <ReviewCard
                    key={rev.id}
                    name={rev.name}
                    initials={rev.initials}
                    date={rev.date}
                    rating={rev.rating}
                    comment={rev.comment}
                  />
                ))}
              </div>
            </ContentCard>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: STICKY DESKTOP SIDEBAR PURCHASE CARD                  */}
          {/* ------------------------------------------------------------------- */}
          <div className="hidden lg:block lg:col-span-4 relative z-30">
            <div className="sticky top-24">
              <ContentCard padding="p-6">
                {/* Video Preview Box */}
                <div
                  className="w-full h-52 rounded-2xl bg-cover bg-center relative overflow-hidden flex items-center justify-center group mb-3 cursor-pointer shadow-md"
                  style={{
                    backgroundImage: `url(${getCourseThumbnail(course.thumbnail)})`,
                  }}
                  onClick={() => openPreview("Pratinjau Video Kursus")}
                >
                  <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition"></div>
                  <div className="w-16 h-16 rounded-full bg-white/95 text-primary flex items-center justify-center text-xl shadow-xl transform group-hover:scale-110 transition z-10">
                    <i className="fas fa-play ms-1 text-primary"></i>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur flex items-center gap-1.5">
                    <i className="fas fa-eye text-emerald-400"></i> Pratinjau Video Kursus
                  </span>
                </div>

                {/* Price Display */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2.5 mb-1.5">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {course.price_formatted}
                    </span>
                    {course.original_price_formatted && (
                      <span className="text-sm text-slate-400 line-through font-medium">
                        {course.original_price_formatted}
                      </span>
                    )}
                  </div>
                  <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                    Hemat 33% • Akses Seumur Hidup
                  </span>
                </div>

                {/* Primary CTA Button */}
                {isEnrolled ? (
                  <FlatButton
                    onClick={() => router.push("/dashboard")}
                    variant="solid"
                    colorTheme="green"
                    fullWidth
                    size="md"
                    icon={<i className="fas fa-play-circle text-lg"></i>}
                    iconPosition="left"
                    className="mb-3 px-0"
                  >
                    Lanjutkan Belajar
                  </FlatButton>
                ) : (
                  <FlatButton
                    onClick={handleBuyCourse}
                    variant="solid"
                    colorTheme="blue"
                    fullWidth
                    size="md"
                    icon={<i className="fas fa-arrow-right text-sm"></i>}
                    iconPosition="right"
                    className="mb-3 px-0"
                  >
                    Beli Sekarang
                  </FlatButton>
                )}

                {/* Guarantee */}
                <p className="text-center text-xs text-slate-500 font-medium mb-6 flex items-center justify-center gap-1.5">
                  <i className="fas fa-shield-alt text-emerald-600"></i>
                  Garansi 30 Hari Uang Kembali 100%
                </p>

                {/* Divider */}
                <div className="border-t border-slate-100 my-5" />

                {/* Course Facilities List */}
                <div className="space-y-3.5 mb-6">
                  <h4 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">
                    Fasilitas Kursus Termasuk:
                  </h4>
                  <ul className="space-y-3 text-xs text-slate-600 font-medium">
                    {course.facilities.map((fac, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-indigo-50 text-primary flex items-center justify-center text-xs flex-shrink-0">
                          <i className="fas fa-check"></i>
                        </div>
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleCopyShare}
                  className="w-full py-2.5 px-4 rounded-full font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs flex items-center justify-center gap-2 transition"
                >
                  <i className="fas fa-share-alt text-slate-500"></i>
                  Bagikan Kursus Ini
                </button>

                {/* Enterprise Note */}
                <div className="mt-5 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Pelatihan tim atau corporate enterprise?<br />
                    <Link href="/kontak" className="text-primary font-bold hover:underline">
                      Hubungi EduNusa Enterprise
                    </Link>
                  </p>
                </div>
              </ContentCard>
            </div>
          </div>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* 3. MOBILE STICKY FLOATING BOTTOM BAR                                      */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Total Harga</span>
          <span className="text-lg font-black text-slate-900 leading-tight">
            {course.price_formatted}
          </span>
        </div>
        {isEnrolled ? (
          <FlatButton
            onClick={() => router.push("/dashboard")}
            variant="solid"
            colorTheme="green"
            size="md"
            icon={<i className="fas fa-play-circle"></i>}
            iconPosition="left"
            className="px-0"
          >
            Lanjutkan Belajar
          </FlatButton>
        ) : (
          <FlatButton
            onClick={handleBuyCourse}
            variant="solid"
            colorTheme="blue"
            size="md"
            icon={<i className="fas fa-arrow-right text-[10px]"></i>}
            iconPosition="right"
            className="px-0"
          >
            Beli Sekarang
          </FlatButton>
        )}
      </div>

      {/* 4. PREVIEW VIDEO MODAL */}
      <VideoPreviewModal 
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={previewVideoTitle}
        thumbnailUrl={getCourseThumbnail(course.thumbnail)}
      />
    </main>
  );
}
