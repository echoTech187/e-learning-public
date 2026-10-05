"use client";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { onboardingAction } from "../../actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-submit w-100 mt-4" disabled={pending}>
      {pending ? (
        <><span className="spinner-border spinner-border-sm me-2"></span>Menyimpan...</>
      ) : (
        <><span className="btn-text">Selesaikan Pendaftaran</span><i className="fas fa-check ms-2"></i></>
      )}
    </button>
  );
}

export default function Onboarding() {
  const [role, setRole] = useState("student");
  const [birthDate, setBirthDate] = useState("");
  const [state, formAction] = useActionState(onboardingAction, null);

  const calculateAge = (dateString: string) => {
    if (!dateString) return null;
    const today = new Date();
    const dob = new Date(dateString);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(birthDate);
  const isUnder12 = age !== null && age < 12;

  return (
    <div className="auth-form-inner" style={{ maxWidth: '650px' }}>
      <div className="form-header text-center">
        <h1 className="form-title">Satu Langkah Lagi!</h1>
        <p className="form-subtitle">Ceritakan sedikit tentang Anda agar kami bisa menyesuaikan pengalaman belajar Anda.</p>
      </div>

      {state?.error && (
        <div className="alert alert-danger" style={{ borderRadius: '12px', fontSize: '14px' }}>
          <i className="fas fa-exclamation-circle me-2"></i>
          {state.error}
        </div>
      )}

      <form action={formAction} noValidate>
        
        <div className="form-group-custom mb-4">
          <label className="form-label-custom">Saya ingin menggunakan EduNusa sebagai...</label>
          <div className="d-flex flex-column flex-md-row gap-3 mt-2">
            <label className="flex-fill cursor-pointer" style={{ cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="role" 
                value="student" 
                className="d-none" 
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              <div className={`p-3 border rounded-3 text-center ${role === 'student' ? 'border-primary shadow-sm' : 'border-secondary'}`} style={role === 'student' ? { borderWidth: '2px !important' } : {}}>
                <i className={`fas fa-user-graduate mb-2 fs-3 ${role === 'student' ? 'text-primary' : 'text-secondary'}`}></i>
                <div className={role === 'student' ? 'fw-bold text-primary' : 'text-secondary'}>Siswa / Mahasiswa</div>
              </div>
            </label>
            <label className="flex-fill cursor-pointer" style={{ cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="role" 
                value="general" 
                className="d-none" 
                checked={role === 'general'}
                onChange={() => setRole('general')}
              />
              <div className={`p-3 border rounded-3 text-center ${role === 'general' ? 'border-primary shadow-sm' : 'border-secondary'}`} style={role === 'general' ? { borderWidth: '2px !important' } : {}}>
                <i className={`fas fa-laptop-code mb-2 fs-3 ${role === 'general' ? 'text-primary' : 'text-secondary'}`}></i>
                <div className={role === 'general' ? 'fw-bold text-primary' : 'text-secondary'}>Umum / Profesional</div>
              </div>
            </label>
            <label className="flex-fill cursor-pointer" style={{ cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="role" 
                value="parent" 
                className="d-none" 
                checked={role === 'parent'}
                onChange={() => setRole('parent')}
              />
              <div className={`p-3 border rounded-3 text-center ${role === 'parent' ? 'border-primary shadow-sm' : 'border-secondary'}`} style={role === 'parent' ? { borderWidth: '2px !important' } : {}}>
                <i className={`fas fa-user-tie mb-2 fs-3 ${role === 'parent' ? 'text-primary' : 'text-secondary'}`}></i>
                <div className={role === 'parent' ? 'fw-bold text-primary' : 'text-secondary'}>Orang Tua / Wali</div>
              </div>
            </label>
          </div>
        </div>

        <div className="form-group-custom">
          <label htmlFor="profession" className="form-label-custom">Profesi Saat Ini</label>
          <div className="input-wrapper">
            <i className="fas fa-briefcase input-icon"></i>
            <select id="profession" name="profession" className="form-input-custom" required style={{ appearance: 'none' }} defaultValue="">
              <option value="" disabled>Pilih profesi Anda...</option>
              {role === 'student' ? (
                <>
                  <option value="Pelajar SD/SMP">Pelajar SD/SMP</option>
                  <option value="Pelajar SMA/SMK">Pelajar SMA/SMK</option>
                  <option value="Mahasiswa">Mahasiswa</option>
                  <option value="Lulusan Baru (Fresh Graduate)">Lulusan Baru (Fresh Graduate)</option>
                </>
              ) : (
                <>
                  <option value="Karyawan Swasta">Karyawan Swasta</option>
                  <option value="PNS / Pegawai BUMN">PNS / Pegawai BUMN</option>
                  <option value="Wirausaha / Freelancer">Wirausaha / Freelancer</option>
                  <option value="Pencari Kerja">Pencari Kerja</option>
                  <option value="Guru / Dosen">Guru / Dosen</option>
                  <option value="Lainnya">Lainnya</option>
                </>
              )}
            </select>
            <i className="fas fa-chevron-down position-absolute" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}></i>
          </div>
        </div>

        <div className="form-group-custom">
          <label htmlFor="birth_date" className="form-label-custom">Tanggal Lahir</label>
          <div className="input-wrapper">
            <i className="fas fa-calendar-alt input-icon"></i>
            <input 
              type="date" 
              id="birth_date" 
              name="birth_date" 
              className="form-input-custom" 
              required 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
          <small className="text-muted mt-1 d-block" style={{ fontSize: '12px' }}>
            Untuk memverifikasi kelayakan usia Anda.
          </small>
        </div>

        {isUnder12 && (
          <div className="form-group-custom" style={{ animation: "fadeIn 0.3s ease-in-out" }}>
            <label htmlFor="parent_email" className="form-label-custom text-danger">Email Orang Tua / Wali (Wajib)</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon text-danger"></i>
              <input type="email" id="parent_email" name="parent_email" className="form-input-custom border-danger" placeholder="Contoh: orangtua@email.com" required={isUnder12} />
            </div>
            <small className="text-danger mt-1 d-block" style={{ fontSize: '12px', fontWeight: '500' }}>
              <i className="fas fa-info-circle me-1"></i> Karena usia Anda di bawah 12 tahun, akun Anda wajib ditautkan dengan email Orang Tua/Wali demi keamanan.
            </small>
          </div>
        )}

        <div className="form-group-custom">
          <label htmlFor="phone" className="form-label-custom">Nomor Telepon (WhatsApp)</label>
          <div className="input-wrapper">
            <i className="fas fa-phone input-icon"></i>
            <input type="tel" id="phone" name="phone" className="form-input-custom" placeholder="Contoh: 08123456789" required />
          </div>
          <small className="text-muted mt-1 d-block" style={{ fontSize: '12px' }}>
            {role === 'student' ? 'Untuk pembaruan jadwal kelas dan info tugas.' : role === 'general' ? 'Untuk info sertifikat dan kelas terbaru.' : 'Untuk memantau perkembangan belajar anak Anda.'}
          </small>
        </div>

        <div className="form-group-custom">
          <label className="form-label-custom mb-3">Topik yang Ingin Dipelajari</label>
          <div className="d-flex flex-wrap gap-2">
            {['Programming', 'Desain Grafis', 'Bisnis', 'Marketing', 'Bahasa', 'Sains & Data'].map((topic) => (
              <label key={topic} className="d-inline-flex align-items-center cursor-pointer">
                <input type="checkbox" name="interests" value={topic} className="btn-check" id={`interest-${topic}`} />
                <span className="btn btn-outline-primary rounded-pill btn-sm fw-semibold" style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
                  {topic}
                </span>
              </label>
            ))}
          </div>
          <small className="text-muted mt-2 d-block" style={{ fontSize: '12px' }}>Pilih satu atau lebih topik untuk menyesuaikan rekomendasi kursus Anda.</small>
        </div>

        <div className="form-group-custom">
          <label htmlFor="referred_by" className="form-label-custom">Kode Referral (Opsional)</label>
          <div className="input-wrapper">
            <i className="fas fa-ticket-alt input-icon"></i>
            <input type="text" id="referred_by" name="referred_by" className="form-input-custom" placeholder="Contoh: EDUNUSA2026" />
          </div>
          <small className="text-muted mt-1 d-block" style={{ fontSize: '12px' }}>
            Masukkan kode referral teman Anda untuk mendapatkan bonus poin saat mendaftar!
          </small>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
