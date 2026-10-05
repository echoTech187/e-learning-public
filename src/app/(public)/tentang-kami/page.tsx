import { SimpleHero } from '@/components/ui/SimpleHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatCard } from '@/components/ui/StatCard';
import { TeamCard } from '@/components/ui/TeamCard';

export default function About() {
  const team = [
    { name: 'Dr. Andi Wijaya', role: 'CEO & Co-Founder', initials: 'AW', color: '#6C47FF' },
    { name: 'Siti Nurhayati', role: 'Head of Education', initials: 'SN', color: '#FF6B47' },
    { name: 'Bima Kurniawan', role: 'CTO', initials: 'BK', color: '#00C4B8' },
    { name: 'Lina Setiawan', role: 'Head of Marketing', initials: 'LS', color: '#F59E0B' },
  ];

  return (
    <>
      <SimpleHero 
        badgeText="Tentang Kami"
        title={<>Kami Ada untuk <span className="text-gradient">Memberdayakan</span> Anda</>}
        description="EduNusa hadir sebagai solusi pendidikan digital terpercaya untuk membantu setiap orang Indonesia mengakses pendidikan berkualitas."
      />

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-5 mb-5">
            <div className="col-lg-6">
              <SectionHeader 
                badge="Misi Kami" 
                title={<>Mendemokratisasi <span className="text-gradient">Pendidikan</span> Indonesia</>}
                align="left"
                className="mb-3"
              />
              <p className="text-muted mb-3">Kami percaya bahwa setiap orang, di mana pun berada, berhak mendapatkan akses ke pendidikan berkualitas tinggi. EduNusa hadir untuk menghapus batasan geografis dan ekonomi dalam dunia pendidikan.</p>
              <p className="text-muted">Sejak 2022, kami telah membantu lebih dari 50.000 siswa meraih keterampilan baru, berganti karier, dan meningkatkan kualitas hidup mereka.</p>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <StatCard variant="about" accentColor="#6C47FF" value="50K+" label="Siswa Aktif" />
                </div>
                <div className="col-6">
                  <StatCard variant="about" accentColor="#FF6B47" value="1.200+" label="Kursus Tersedia" />
                </div>
                <div className="col-6">
                  <StatCard variant="about" accentColor="#00C4B8" value="500+" label="Instruktur Ahli" />
                </div>
                <div className="col-6">
                  <StatCard variant="about" accentColor="#22C55E" value="98%" label="Tingkat Kepuasan" />
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <SectionHeader 
            badge="Tim Kami" 
            title={<>Orang-orang di Balik <span className="text-gradient">EduNusa</span></>}
            className="mb-5"
          />
          <div className="row g-4 justify-content-center">
            {team.map((member, i) => (
              <div className="col-6 col-md-3" key={i}>
                <TeamCard 
                  name={member.name}
                  role={member.role}
                  initials={member.initials}
                  color={member.color}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
