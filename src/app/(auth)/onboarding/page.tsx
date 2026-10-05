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
  const [state, formAction] = useActionState(onboardingAction, null);

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
          <label htmlFor="phone" className="form-label-custom">Nomor Telepon (WhatsApp)</label>
          <div className="input-wrapper">
            <i className="fas fa-phone input-icon"></i>
            <input type="tel" id="phone" name="phone" className="form-input-custom" placeholder="Contoh: 08123456789" required />
          </div>
          <small className="text-muted mt-1 d-block" style={{ fontSize: '12px' }}>
            {role === 'student' ? 'Untuk pembaruan jadwal kelas dan info tugas.' : role === 'general' ? 'Untuk info sertifikat dan kelas terbaru.' : 'Untuk memantau perkembangan belajar anak Anda.'}
          </small>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
