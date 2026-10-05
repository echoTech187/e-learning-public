import Link from "next/link";
import { getCompanyProfileData } from "@/actions/companyProfileActions";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatCard } from "@/components/ui/StatCard";
import { WhyItemCard } from "@/components/ui/WhyItemCard";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { HeroCardMain } from "@/components/ui/HeroCardMain";
import { HeroCardFloat } from "@/components/ui/HeroCardFloat";

export default async function Home() {
  const { categories, testimonials, stats } = await getCompanyProfileData();

  return (
    <>
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="container">
          <div className="row align-items-center min-vh-hero">
            <div className="col-lg-6 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="hero-badge animate-on-scroll">
                <i className="fas fa-star text-warning"></i>
                Platform E-Learning #1 di Indonesia
              </div>
              <h1 className="hero-title animate-on-scroll">
                Kuasai <span className="text-gradient">Skill Baru</span>,<br />
                Wujudkan Karier Impian
              </h1>
              <p className="hero-desc animate-on-scroll">
                Belajar dari 500+ instruktur berpengalaman dengan lebih dari 1.200 kursus online berkualitas. Dapatkan sertifikat terakreditasi dan tingkatkan kariermu bersama EduNusa.
              </p>
              <div className="hero-actions animate-on-scroll">
                <Link href="/daftar" className="btn-hero-primary">
                  Mulai Belajar Gratis
                  <i className="fas fa-arrow-right ms-2"></i>
                </Link>
                <Link href="/kursus" className="btn-hero-outline">
                  <i className="fas fa-play-circle me-2"></i>
                  Jelajahi Kursus
                </Link>
              </div>
              <div className="hero-stats-wrapper animate-on-scroll">
                <div className="hero-stats-track">
                  <div className="stat-item">
                    <strong>50K+</strong>
                    <span>Siswa Aktif</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <strong>1.200+</strong>
                    <span>Kursus</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <strong>500+</strong>
                    <span>Instruktur</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <strong>4.9★</strong>
                    <span>Rating</span>
                  </div>
                  
                  <div className="stat-divider d-lg-none"></div>
                  
                  <div className="stat-item d-lg-none">
                    <strong>50K+</strong>
                    <span>Siswa Aktif</span>
                  </div>
                  <div className="stat-divider d-lg-none"></div>
                  <div className="stat-item d-lg-none">
                    <strong>1.200+</strong>
                    <span>Kursus</span>
                  </div>
                  <div className="stat-divider d-lg-none"></div>
                  <div className="stat-item d-lg-none">
                    <strong>500+</strong>
                    <span>Instruktur</span>
                  </div>
                  <div className="stat-divider d-lg-none"></div>
                  <div className="stat-item d-lg-none">
                    <strong>4.9★</strong>
                    <span>Rating</span>
                  </div>
                  <div className="stat-divider d-lg-none"></div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <div className="hero-visual">
                <HeroCardMain 
                  name="Budi Santoso"
                  role="Web Developer"
                  initials="BS"
                  courseTitle="JavaScript Mastery"
                  progress={stats.hero_progress}
                  currentLesson={stats.hero_current_lesson}
                />
                <HeroCardFloat 
                  title={stats.hero_cert_title}
                  subtitle={stats.hero_cert_course}
                  icon="fa-certificate"
                  iconColorClass="text-warning"
                  className="card-cert"
                />
                <HeroCardFloat 
                  title={stats.hero_new_students}
                  subtitle={stats.hero_new_students_sub}
                  icon="fa-user-plus"
                  iconColorClass="text-success"
                  className="card-enroll"
                />
                <div className="hero-circle-bg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-category py-5">
        <div className="container">
          <SectionHeader 
            badge="Kategori Populer" 
            title={<>Temukan Kursus <span className="text-gradient">Sesuai Passion</span> Anda</>}
            className="mb-5"
          />
          <div className="row g-3">
            {categories.map((cat: { name: string; icon: string; color: string; count: number }, index: number) => (
              <div className="col-6 col-md-4 col-lg-3" key={index}>
                <CategoryCard 
                  name={cat.name}
                  icon={cat.icon}
                  color={cat.color}
                  count={cat.count}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-why py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <SectionHeader 
                badge="Mengapa EduNusa?" 
                title={<>Pengalaman Belajar yang <span className="text-gradient">Berbeda</span></>}
                align="left"
              />
              <p className="text-muted mb-4 mt-3">Kami tidak sekadar menyediakan video — kami menciptakan ekosistem belajar yang komprehensif untuk memastikan Anda berhasil.</p>
              <div className="why-list">
                <WhyItemCard 
                  title="Materi Berkualitas Tinggi"
                  description="Video HD, PDF, artikel, dan live class yang dikurasi secara ketat oleh tim ahli kami."
                  icon="fa-video"
                />
                <WhyItemCard 
                  title="Sertifikat Terakreditasi"
                  description="Dapatkan sertifikat yang diakui oleh ratusan perusahaan ternama di Indonesia."
                  icon="fa-certificate"
                />
                <WhyItemCard 
                  title="Dukungan Mentor Aktif"
                  description="Tanya jawab langsung dengan mentor berpengalaman melalui forum diskusi."
                  icon="fa-headset"
                />
                <WhyItemCard 
                  title="Belajar Kapan Saja"
                  description="Akses materi dari perangkat apapun — desktop, tablet, maupun smartphone."
                  icon="fa-mobile-alt"
                />
              </div>
            </div>
            <div className="col-lg-7">
              <div className="row g-2 g-md-4">
                <div className="col-6">
                  <StatCard colorTheme="primary" value={stats.satisfaction_rate} label="Tingkat kepuasan siswa" />
                </div>
                <div className="col-6 mt-md-4">
                  <StatCard colorTheme="orange" value={stats.employment_rate} label="Siswa mendapat pekerjaan baru" />
                </div>
                <div className="col-6">
                  <StatCard colorTheme="green" value={<>{stats.average_rating ? stats.average_rating.split('/')[0] : '0'}<i className="fas fa-star ms-1" style={{ fontSize: '0.6em', verticalAlign: 'text-top', color: '#16A34A' }}></i></>} label="Rating rata-rata kursus" />
                </div>
                <div className="col-6 mt-md-4">
                  <StatCard colorTheme="blue" value={stats.students_count} label="Siswa aktif belajar" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-testimonial py-5">
        <div className="container">
          <SectionHeader 
            badge="Testimoni" 
            title={<>Kata Mereka yang <span className="text-gradient">Sudah Berhasil</span></>}
            className="mb-5"
          />
          <div className="row g-4">
            {testimonials.map((t: { rating: number; text: string; color: string; initials: string; name: string; role: string }, index: number) => (
              <div className="col-12 col-lg-4 mb-4 mb-lg-0" key={index}>
                <TestimonialCard 
                  name={t.name}
                  initials={t.initials}
                  role={t.role}
                  rating={t.rating}
                  text={t.text}
                  color={t.color}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-cta py-5">
        <div className="container">
          <div className="cta-box text-center">
            <div className="cta-shape-1"></div>
            <div className="cta-shape-2"></div>
            <div className="cta-content">
              <h2>Siap Mulai Perjalanan Belajar Anda?</h2>
              <p>Bergabunglah dengan {stats.students_count} siswa yang sudah mewujudkan impian karier mereka bersama EduNusa.</p>
              <div className="cta-actions">
                <Link href="/daftar" className="btn-cta-primary">
                  Daftar Gratis Sekarang
                  <i className="fas fa-arrow-right ms-2"></i>
                </Link>
                <Link href="/kursus" className="btn-cta-outline">
                  Lihat Semua Kursus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}










