"use client";

import { getCourseThumbnail } from "@/core/utils/imageHelper";
import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { getCourseCatalogUI, getCourses, getUserEnrollments } from '@/actions/courseActions';
import { getCategories } from '@/actions/categoryActions';
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from '@/core/store/useCartStore';
import { ModernCourseCard, ModernCourseCardSkeleton } from "@/components/ui/ModernCourseCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { SimpleHero } from "@/components/ui/SimpleHero";
import { FlatButton } from "@/components/ui/FlatButton";



function CoursesContent() {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState<string[]>(["Semua Kategori"]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const { addItem, clearCart } = useCartStore();

  const handleBuyNow = (e: React.MouseEvent, c: any) => {
    e.preventDefault();
    clearCart();
    addItem({
      id: c.id,
      title: c.title,
      thumbnail: getCourseThumbnail(c.thumbnail),
      instructor_name: c.instructor_name || 'Mentor Ahli',
      price: Number(c.price),
      price_formatted: 'Rp ' + Number(c.price).toLocaleString('id-ID')
    });
    router.push('/cart');
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getCourseCatalogUI(),
      getUserEnrollments(),
      getCategories()
    ]).then(([coursesData, enrollsData, catsData]) => {
      setEnrollments(enrollsData || []);
      setCoursesList(coursesData || []);
      if (catsData) {
        const catNames = catsData.map((c: any) => c.name);
        setCategoriesList(["Semua Kategori", ...catNames]);
      }
      setIsLoading(false);
    }).catch((err) => {
      console.error("Error loading courses catalog:", err);
      setIsLoading(false);
    });
  }, []);
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryQ = searchParams.get('q') || '';
  const queryCat = searchParams.get('kategori') || 'Semua Kategori';
  const queryLevel = searchParams.get('level') || 'Semua Level';

  const [activeCategory, setActiveCategory] = useState(queryCat);
  const [activeLevel, setActiveLevel] = useState(queryLevel);
  const [searchQuery, setSearchQuery] = useState(queryQ);
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);

  const categories = categoriesList;
  const levels = ["Semua Level", ...Array.from(new Set(coursesList.map((c: any) => c.level).filter(Boolean)))];

  // Apply filters
  const baseFiltered = coursesList.filter(c => {
    let match = true;
    if (searchQuery) match = match && c.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory !== 'Semua Kategori') {
      const catMatch = c.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(c.category.toLowerCase());
      match = match && catMatch;
    }

    if (activeLevel !== 'Semua Level') {
      match = match && c.level.toLowerCase().includes(activeLevel.toLowerCase());
    }
    return match;
  });

  const ITEMS_PER_PAGE = 8;
  const [displayLimit, setDisplayLimit] = useState(ITEMS_PER_PAGE);

  // Reset pagination limit when filters change
  useEffect(() => {
    setDisplayLimit(ITEMS_PER_PAGE);
  }, [searchQuery, activeCategory, activeLevel]);

  const visibleCourses = baseFiltered.slice(0, displayLimit);
  const hasMore = displayLimit < baseFiltered.length;

  const triggerRef = useRef<HTMLDivElement>(null);

  // Real Infinite Scroll: only triggers when there are genuinely more courses to show
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setDisplayLimit((prev) => prev + ITEMS_PER_PAGE);
      }
    }, { rootMargin: '200px' });

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, baseFiltered.length]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (activeCategory !== 'Semua Kategori') params.set('kategori', activeCategory);
    if (activeLevel !== 'Semua Level') params.set('level', activeLevel);

    router.push(`/kursus?${params.toString()}`);
  };

  return (
    <>
      <SimpleHero 
        badgeText="Katalog Lengkap"
        title={<>Jelajahi <span className="text-gradient">Ribuan Kursus</span></>}
        description="Temukan materi pembelajaran dari tingkat pemula hingga mahir. Dibimbing langsung oleh praktisi ahli di bidangnya untuk mewujudkan karier impianmu."
      />

      <section className="py-5" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div className="filter-wrapper animate-on-scroll delay-1" style={{ position: 'relative', zIndex: 40, marginTop: '-80px', marginBottom: '3rem' }}>
            <form onSubmit={handleFilterSubmit}>
              <div className="d-flex gap-2 gap-lg-3 align-items-end">
                <div className="flex-grow-1">
                  <label className="text-xs tracking-wider uppercase text-gray-500 font-bold mb-2 d-none d-lg-block">Cari Kursus</label>
                  <SearchInput
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ketik keyword pencarian..."
                  />
                </div>

                <FlatButton 
                  type="button" 
                  colorTheme="blue"
                  className="d-lg-none flex-shrink-0 d-flex justify-content-center align-items-center" 
                  data-bs-toggle="offcanvas" 
                  data-bs-target="#filterDrawer" 
                  style={{ width: '56px', height: '56px', borderRadius: '16px', padding: 0, boxShadow: '0 8px 20px rgba(139, 92, 246, 0.25)' }}
                >
                  <i className="fas fa-sliders-h fs-5"></i>
                </FlatButton>

                <div className="offcanvas-lg offcanvas-bottom border-0 mobile-drawer-styled flex-grow-1" tabIndex={-1} id="filterDrawer" style={{ height: 'auto' }}>
                  <div className="d-lg-none w-100 text-center pt-3 pb-1">
                    <div className="mx-auto bg-secondary opacity-25" style={{ width: '48px', height: '6px', borderRadius: '10px' }}></div>
                  </div>

                  <div className="offcanvas-header d-lg-none px-4 pt-3 pb-2">
                    <h5 className="offcanvas-title fw-bold text-dark w-100 text-center fs-4">Filter Kursus</h5>
                    <button type="button" className="btn-close position-absolute end-0 me-4" data-bs-dismiss="offcanvas" data-bs-target="#filterDrawer" aria-label="Close"></button>
                  </div>

                  <div className="offcanvas-body d-flex flex-column flex-lg-row gap-4 px-4 pb-5 pt-3 pt-lg-0 px-lg-0 pb-lg-0 w-100">
                    <div className="flex-grow-1 w-100" style={{ minWidth: '220px' }}>
                      <label className="text-xs tracking-wider uppercase text-gray-500 font-bold mb-2 block">Kategori</label>
                      <CustomSelect 
                        options={categories}
                        value={activeCategory}
                        onChange={(val) => setActiveCategory(val)}
                        isOpen={isCategoryOpen}
                        onToggle={() => { setIsCategoryOpen(!isCategoryOpen); setIsLevelOpen(false); }}
                        onClose={() => setIsCategoryOpen(false)}
                      />
                    </div>

                    <div className="flex-grow-1 w-100" style={{ minWidth: '220px' }}>
                      <label className="text-xs tracking-wider uppercase text-gray-500 font-bold mb-2 block">Level</label>
                      <CustomSelect 
                        options={levels}
                        value={activeLevel}
                        onChange={(val) => setActiveLevel(val)}
                        isOpen={isLevelOpen}
                        onToggle={() => { setIsLevelOpen(!isLevelOpen); setIsCategoryOpen(false); }}
                        onClose={() => setIsLevelOpen(false)}
                      />
                    </div>

                    <div className="mt-auto pt-4 pt-lg-0 d-lg-none">
                      <FlatButton 
                        type="submit" 
                        colorTheme="blue"
                        noShadow
                        icon={<i className="fas fa-filter"></i>}
                        className="w-full transition-transform hover:-translate-y-1 active:translate-y-0" 
                        style={{ minWidth: '160px', height: '44px', borderRadius: '12px', fontSize: '14px' }}
                        data-bs-dismiss="offcanvas"
                      >
                        Terapkan
                      </FlatButton>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="row g-4">
            {isLoading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <div className="col-md-6 col-lg-3" key={i}>
                    <ModernCourseCardSkeleton />
                  </div>
                ))}
              </>
            ) : visibleCourses.length > 0 ? visibleCourses.map((c, i) => (
              <div className="col-md-6 col-lg-3" key={c.slug}>
                <ModernCourseCard 
                  course={c} 
                  isEnrolled={enrollments.some((e) => e.course_id === c.id)} 
                  onBuyNow={handleBuyNow} 
                />
              </div>
            )) : (
              <div className="col-12 text-center py-5">
                <i className="fas fa-search-minus text-muted display-4 mb-3"></i>
                <h4 className="text-dark fw-bold">Kursus tidak ditemukan</h4>
                <p className="text-muted">Coba gunakan kata kunci atau filter kategori yang berbeda.</p>
                <button className="btn btn-outline-primary mt-3" onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('Semua Kategori');
                  setActiveLevel('Semua Level');
                  router.push('/kursus');
                }}>Reset Filter</button>
              </div>
            )}
          </div>

          {hasMore && (
            <div ref={triggerRef} id="loading-spinner" className="row g-4 mt-2">
              {[...Array(3)].map((_, i) => (
                <div className="col-md-6 col-lg-3" key={i}>
                  <ModernCourseCardSkeleton />
                </div>
              ))}
            </div>
          )}
          {!isLoading && !hasMore && baseFiltered.length > 0 && (
            <div className="mt-5 text-center py-4 text-muted small">
              Menampilkan seluruh {baseFiltered.length} kursus.
            </div>
          )}
        </div>
      </section >
    </>
  );
}


export default function Courses() {
  return (
    <Suspense fallback={
      <div className="container py-5">
        <div className="row g-4">
          {[...Array(6)].map((_, i) => (
            <div className="col-md-6 col-lg-3" key={i}>
              <ModernCourseCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
